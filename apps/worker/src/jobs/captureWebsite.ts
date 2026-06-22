import { prisma, JobStatus, AssetKind } from "@demoforge/db";
import {
  createBrowserSession, loginWithCredentials, runScenarioSteps, persistAuthState,
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
  try {
    await session.page.goto(project.url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});

    if (email && password) {
      const login = await loginWithCredentials(session.page, {
        loginUrl: project.credentialRef?.loginUrl ?? undefined,
        email,
        password,
      });
      ctx.log.info({ status: login.status }, "login attempt");
      if (login.status === "manual_step_required") {
        await prisma.auditLog.create({
          data: { projectId: project.id, action: "capture.manual_required", meta: { reason: login.reason ?? "" } },
        });
      }
    }

    results = await runScenarioSteps(session.page, steps, {
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

  ctx.log.info({ captured: okCount, total: results.length }, "captureWebsite complete");
  return { captureRunId: run.id };
}

function splitKeyAsset(v?: string): { key: string; assetId: string } | undefined {
  if (!v) return undefined;
  const [key, assetId] = v.split("::");
  if (!key || !assetId) return undefined;
  return { key, assetId };
}
