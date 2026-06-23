import os from "node:os";
import path from "node:path";
import { writeFile, readFile, mkdtemp } from "node:fs/promises";
import { prisma, JobStatus, AssetKind } from "@demoforge/db";
import {
  createBrowserSession, loginWithCredentials, runScenarioSteps, persistAuthState,
  discoverInternalRoutes, captureAppTour, extractLogoUrl, extractThemeColor, screenshotLogo,
} from "@demoforge/capture";
import { flattenImageOnColor } from "@demoforge/render";
import { getVault, getStorage } from "@demoforge/integrations";
import type { ScenarioStep, CaptureStepResult } from "@demoforge/shared";
import { MAX_BROWSER_SESSION_MS } from "@demoforge/shared";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 2 — captureWebsite.
 * Opens a headless browser, logs in (never bypassing 2FA/CAPTCHA), walks the
 * scenario steps and stores a screenshot + metadata per step. The plaintext
 * password is resolved from the vault ONLY here and never logged or persisted.
 *
 * Idempotent: a fresh CaptureRun is created per invocation, but a re-run simply
 * supersedes the previous one; later stages always read the most recent run.
 */
export async function captureWebsite(ctx: PipelineCtx, steps: ScenarioStep[]): Promise<{ captureRunId: string }> {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: ctx.projectId },
    include: { credentialRef: true },
  });
  const storage = getStorage();

  const run = await prisma.captureRun.create({
    data: { projectId: project.id, status: JobStatus.RUNNING, startedAt: new Date(), maskPII: true },
  });

  // Resolve credentials (opaque ref -> plaintext) at the last possible moment.
  let email: string | undefined;
  let password: string | undefined;
  if (project.credentialRef?.ref) {
    try {
      const secret = await getVault().resolve(project.credentialRef.ref);
      const parsed = JSON.parse(secret) as { email?: string; password?: string };
      email = parsed.email;
      password = parsed.password;
    } catch (err) {
      ctx.log.warn("could not resolve credentials; proceeding unauthenticated");
    }
  }

  const session = await createBrowserSession({ viewport: "desktop", headless: true });
  // Hard stop safety net in addition to the session's own deadline.
  const guard = setTimeout(() => void session.close().catch(() => {}), MAX_BROWSER_SESSION_MS);

  let results: CaptureStepResult[] = [];
  let loginStatus: string = email && password ? "attempted" : "no_credentials";
  let loggedIn = false;
  // Capture the brand logo (flattened to a clean opaque tile) + accent color from
  // whatever page we're on. Prefer running this on the logged-in app, whose header
  // logo is the cleanest source.
  const captureBranding = async () => {
    try {
      // Preferred: screenshot the logo element as the site actually renders it
      // (handles inline SVG / wordmarks). Opaque, so it ships as-is.
      const shot = await screenshotLogo(session.page);
      if (shot && shot.byteLength > 300) {
        await storage.put(`branding/${project.id}/logo`, shot, "image/png");
        ctx.log.info({ bytes: shot.byteLength, source: "element" }, "captured brand logo");
      } else {
        // Fallback: a logo URL (favicon / og:image), flattened onto white.
        const logoUrl = await extractLogoUrl(session.page);
        if (logoUrl) {
          const resp = await fetch(logoUrl);
          if (resp.ok) {
            const ct = resp.headers.get("content-type") || "image/png";
            const logoBuf = Buffer.from(await resp.arrayBuffer());
            if (logoBuf.byteLength > 0 && logoBuf.byteLength < 2_000_000 && ct.startsWith("image/")) {
              let storeBuf = logoBuf;
              let storeCt = ct;
              try {
                const dir = await mkdtemp(path.join(os.tmpdir(), "df-logo-"));
                const ext = ct.includes("svg") ? "svg" : ct.includes("jpeg") ? "jpg" : "png";
                const inPath = path.join(dir, `in.${ext}`);
                const outPath = path.join(dir, "out.png");
                await writeFile(inPath, logoBuf);
                await flattenImageOnColor(inPath, outPath, "white", 512);
                storeBuf = await readFile(outPath);
                storeCt = "image/png";
              } catch (e) {
                ctx.log.warn({ err: String(e) }, "logo flatten failed; storing raw logo");
              }
              await storage.put(`branding/${project.id}/logo`, storeBuf, storeCt);
              ctx.log.info({ bytes: storeBuf.byteLength, source: "url" }, "captured brand logo");
            }
          }
        }
      }
    } catch (err) {
      ctx.log.warn({ err: String(err) }, "logo extraction skipped");
    }
    try {
      const accent = await extractThemeColor(session.page);
      if (accent) {
        await storage.put(`branding/${project.id}/accent`, accent, "text/plain");
        ctx.log.info({ accent }, "captured brand color");
      }
    } catch (err) {
      ctx.log.warn({ err: String(err) }, "brand color extraction skipped");
    }
  };

  try {
    await session.page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});

    // Brand logo + color from the public site (its header has the full logo lockup).
    await session.page.waitForTimeout(2500); // let an intro splash clear
    await captureBranding();

    if (email && password) {
      const login = await loginWithCredentials(session.page, {
        loginUrl: project.credentialRef?.loginUrl ?? undefined,
        email,
        password,
      });
      loginStatus = login.status;
      loggedIn = login.status === "logged_in";
      ctx.log.info({ status: login.status, reason: login.reason }, "login attempt");
      // Record the outcome so the web app can tell the user whether we actually
      // got inside their product (vs. only seeing the public marketing site).
      await prisma.auditLog.create({
        data: { projectId: project.id, action: "capture.login", meta: { status: login.status, reason: login.reason ?? "" } },
      });
    }

    const onScreenshot = async (stepIndex: number, kind: "desktop" | "mobile", png: Buffer) => {
      const key = `captures/${project.id}/${run.id}/${stepIndex}-${kind}.png`;
      const { bytes } = await storage.put(key, png, "image/png");
      const asset = await prisma.asset.create({
        data: {
          projectId: project.id,
          kind: kind === "mobile" ? AssetKind.SCREENSHOT_MOBILE : AssetKind.SCREENSHOT_DESKTOP,
          storageKey: key,
          contentType: "image/png",
          bytes,
        },
      });
      // Return the storage key; we reconcile keys -> Asset ids when persisting steps.
      return key + "::" + asset.id;
    };

    // 1) Logged in → tour the actual product: dashboard + each feature page,
    // navigated by CLICKING in-app links (a hard goto drops the SPA session).
    if (loggedIn) {
      try {
        results = await captureAppTour(session.page, session.page.url(), { maskPII: true, onScreenshot, max: 9 });
        ctx.log.info({ scenes: results.length }, "captured logged-in app tour");
      } catch (err) {
        ctx.log.warn({ err: String(err) }, "app tour failed; falling back to route tour");
      }
    }

    // 2) Fallback (no login, or app tour yielded too little): walk discoverable
    // pages, else the user's scenario steps (scrolling the current page).
    if (results.length < 2) {
      let tourSteps = steps;
      try {
        const discovered = await discoverInternalRoutes(session.page, project.url, 6);
        if (discovered.length >= 2) {
          ctx.log.info({ routes: discovered.length, loggedIn }, "auto-discovered routes to tour");
          tourSteps = discovered;
        }
      } catch (err) {
        ctx.log.warn({ err: String(err) }, "route discovery failed; using scenario steps");
      }
      results = await runScenarioSteps(session.page, tourSteps, { baseUrl: project.url, maskPII: true, onScreenshot });
    }

    // Persist auth state for potential re-use (and to demonstrate persistAuthState).
    try {
      const statePath = await persistAuthState(session);
      ctx.log.debug({ statePath }, "auth state persisted");
    } catch {
      /* non-fatal */
    }
  } finally {
    clearTimeout(guard);
    await session.close().catch(() => {});
  }

  // Write CaptureStep rows. The onScreenshot return encodes "key::assetId".
  for (const r of results) {
    const desktop = splitKeyAsset(r.screenshotAssetKey);
    const mobile = splitKeyAsset(r.mobileScreenshotAssetKey);
    await prisma.captureStep.create({
      data: {
        runId: run.id,
        index: r.index,
        intent: r.intent,
        url: r.url,
        status: r.status,
        screenshotId: desktop?.assetId,
        mobileShotId: mobile?.assetId,
        metadata: (r.metadata as unknown as object) ?? undefined,
        error: r.error,
      },
    });
  }

  const okCount = results.filter((r) => r.status === "ok").length;
  await prisma.captureRun.update({
    where: { id: run.id },
    data: { status: okCount > 0 ? JobStatus.SUCCEEDED : JobStatus.FAILED, finishedAt: new Date() },
  });

  ctx.log.info({ captured: okCount, total: results.length, loginStatus, loggedIn }, "captureWebsite complete");
  return { captureRunId: run.id };
}

function splitKeyAsset(v?: string): { key: string; assetId: string } | undefined {
  if (!v) return undefined;
  const [key, assetId] = v.split("::");
  if (!key || !assetId) return undefined;
  return { key, assetId };
}
