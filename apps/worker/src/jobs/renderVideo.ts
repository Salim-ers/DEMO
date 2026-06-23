import os from "node:os";
import path from "node:path";
import { readFile, mkdir } from "node:fs/promises";
import { prisma, AssetKind } from "@demoforge/db";
import { getStorage } from "@demoforge/integrations";
import { storyboardToRenderProps, renderDemoVideo, normalizeMp4, shrinkMp4, probeVideo, buildQualityReport } from "@demoforge/render";
import { RENDER_DEFAULTS, STATEMENT_SCENE_TYPES } from "@demoforge/shared";
import { dbStoryboardToDomain, projectToContext } from "../db-map.js";
import { setStage } from "../status.js";
import { JOBS } from "@demoforge/shared";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 6 — renderVideo.
 * Resolves real screenshot URLs + optional audio, maps the storyboard to Remotion
 * props, renders an MP4, normalizes it (loudness + faststart), uploads it, and
 * records the output Asset on the RenderJob.
 *
 * Idempotent: re-running overwrites the deterministic output key and updates the
 * RenderJob to point at the new asset.
 */
export async function renderVideo(ctx: PipelineCtx): Promise<{ outputAssetId: string }> {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: ctx.projectId } });
  const sb = await prisma.storyboard.findUniqueOrThrow({
    where: { projectId: project.id },
    include: { scenes: true },
  });
  const storyboard = dbStoryboardToDomain(sb, sb.scenes);
  const storage = getStorage();

  // Pre-resolve signed URLs for every referenced screenshot asset (the mapper
  // needs a synchronous resolver).
  const assetIds = Array.from(
    new Set(sb.scenes.map((s) => s.sourceAssetId).filter((v): v is string => Boolean(v))),
  );
  const urlMap = new Map<string, string>();
  if (assetIds.length > 0) {
    const assets = await prisma.asset.findMany({ where: { id: { in: assetIds } } });
    for (const a of assets) {
      try {
        urlMap.set(a.id, await storage.getUrl(a.storageKey, 3600));
      } catch (err) {
        ctx.log.warn({ assetId: a.id }, "could not sign screenshot url; scene will use placeholder");
      }
    }
  }

  // Optional audio track.
  let audioUrl: string | null = null;
  const vs = await prisma.voiceScript.findUnique({ where: { projectId: project.id } });
  if (vs?.audioAssetId) {
    const audio = await prisma.asset.findUnique({ where: { id: vs.audioAssetId } });
    if (audio) audioUrl = await storage.getUrl(audio.storageKey, 3600).catch(() => null);
  }

  // Real brand logo + accent color (captured) + the real site host.
  const logoKey = `branding/${project.id}/logo`;
  const logoUrl = (await storage.exists(logoKey)) ? await storage.getUrl(logoKey, 3600).catch(() => null) : null;

  const accentKey = `branding/${project.id}/accent`;
  let accentColor = process.env.RENDER_ACCENT ?? "#6366F1";
  if (await storage.exists(accentKey)) {
    const captured = (await storage.get(accentKey).then((b) => b.toString().trim()).catch(() => "")) || "";
    if (/^#[0-9a-fA-F]{6}$/.test(captured)) accentColor = captured;
  }

  let siteHost = project.url;
  try {
    siteHost = new URL(project.url).host;
  } catch {
    /* keep raw */
  }

  // Optional background-music bed (royalty-free), ducked under the voice.
  const musicUrl = process.env.RENDER_MUSIC_URL?.trim() || null;

  const props = storyboardToRenderProps(projectToContext(project), storyboard, {
    fps: RENDER_DEFAULTS.fps,
    accentColor,
    audioUrl,
    musicUrl,
    logoUrl,
    siteHost,
    videoStyle: project.videoStyle ?? null,
    resolveImageUrl: (assetId) => urlMap.get(assetId) ?? null,
  });

  const tmpDir = await mkdir(path.join(os.tmpdir(), `demoforge-${ctx.projectId}`), { recursive: true })
    .then(() => path.join(os.tmpdir(), `demoforge-${ctx.projectId}`));
  const rawPath = path.join(tmpDir, "raw.mp4");
  const finalPath = path.join(tmpDir, "demo.mp4");

  ctx.log.info({ scenes: props.scenes.length, format: props.format }, "render starting");
  await renderDemoVideo({
    props,
    outPath: rawPath,
    onProgress: (p) => {
      if (Math.round(p * 100) % 10 === 0) {
        void setStage(ctx.renderJobId, JOBS.renderVideo, { status: "running" }).catch(() => {});
      }
    },
  });

  // Normalize for delivery. If ffmpeg is unavailable this throws; we fall back
  // to shipping the raw render so the pipeline still produces a playable file.
  let deliverPath = finalPath;
  try {
    await normalizeMp4(rawPath, finalPath);
  } catch (err) {
    ctx.log.warn("ffmpeg normalize failed; using raw render");
    deliverPath = rawPath;
  }

  const outKey = `renders/${project.id}/demo.mp4`;
  let buf = await readFile(deliverPath);
  let bytes = buf.byteLength;
  let uploadedPath = deliverPath;
  try {
    ({ bytes } = await storage.put(outKey, buf, "video/mp4"));
  } catch (err) {
    // Object storage rejected the file (e.g. Supabase per-file size limit).
    // Re-encode (still 1080p, higher CRF) and retry once so the demo still ships.
    if (/EntityTooLarge|exceeded the maximum|413|too large/i.test(String(err))) {
      ctx.log.warn({ bytes: buf.byteLength }, "render too large for storage; shrinking and retrying");
      const smallPath = path.join(tmpDir, "demo-small.mp4");
      await shrinkMp4(deliverPath, smallPath);
      buf = await readFile(smallPath);
      uploadedPath = smallPath;
      ({ bytes } = await storage.put(outKey, buf, "video/mp4"));
      ctx.log.info({ bytes: buf.byteLength }, "shrunk render uploaded");
    } else {
      throw err;
    }
  }
  const asset = await prisma.asset.create({
    data: {
      projectId: project.id,
      kind: AssetKind.RENDER_OUTPUT,
      storageKey: outKey,
      contentType: "video/mp4",
      width: props.width,
      height: props.height,
      bytes,
    },
  });

  // --- Automated quality gate -------------------------------------------------
  // Probe the delivered file and grade it against the premium spec, then persist
  // a report the UI can show. Failures are surfaced (not silently swallowed) but
  // don't discard an otherwise-deliverable render.
  let qualityReport: unknown = null;
  try {
    const probe = await probeVideo(uploadedPath);
    const statementTypes = new Set<string>(STATEMENT_SCENE_TYPES);
    const captureScenes = storyboard.scenes.filter((s) => !statementTypes.has(s.type));
    const report = buildQualityReport(probe, {
      screenshotCount: captureScenes.length,
      motionSceneCount: storyboard.scenes.filter((s) => statementTypes.has(s.type)).length,
      calloutCount: storyboard.scenes.reduce((a, s) => a + (s.callouts?.length ?? 0), 0),
      hasCaptions: captureScenes.length > 0,
      voiceMode: String(project.voiceMode).toLowerCase(),
      ttsProviderConfigured: Boolean(process.env.TTS_PROVIDER && process.env.TTS_PROVIDER.toLowerCase() !== "none"),
      targetDurationSec: project.durationSeconds,
      minScreenshotWidth: null,
    });
    qualityReport = report;
    const failed = report.checks.filter((c) => c.status === "fail");
    if (failed.length) ctx.log.warn({ failed: failed.map((c) => c.id), score: report.score }, "quality gate: failing checks");
    else ctx.log.info({ score: report.score }, "quality gate passed");
  } catch (err) {
    ctx.log.warn({ err: String(err) }, "quality report skipped (probe failed)");
  }

  await prisma.renderJob.update({
    where: { id: ctx.renderJobId },
    data: { outputAssetId: asset.id, qualityReport: (qualityReport as object) ?? undefined },
  });

  ctx.log.info({ outputAssetId: asset.id, bytes }, "renderVideo complete");
  return { outputAssetId: asset.id };
}
