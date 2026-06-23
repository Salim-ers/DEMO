import { prisma, JobStatus, AssetKind } from "@demoforge/db";
import {
  createBrowserSession, loginWithCredentials, runScenarioSteps, persistAuthState,
  discoverInternalRoutes,
} from "@demoforge/capture";
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
  try {
    await session.page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});

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

    // Tour the real pages: after login this surfaces the product's own sections
    // (dashboard + features); without login it walks the marketing site's pages.
    // Falls back to the user's scenario steps if no navigation is discoverable.
    let tourSteps = steps;
    try {
      const discovered = await discoverInternalRoutes(session.page, project.url, loggedIn ? 9 : 6);
      if (discovered.length >= 2) {
        ctx.log.info({ routes: discovered.length, loggedIn }, "auto-discovered routes to tour");
        tourSteps = discovered;
      }
    } catch (err) {
      ctx.log.warn({ err: String(err) }, "route discovery failed; using scenario steps");
    }

    results = await runScenarioSteps(session.page, tourSteps, {
      baseUrl: project.url,
      maskPII: true,
      onScreenshot: async (stepIndex, kind, png) => {
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
      },
    });

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
