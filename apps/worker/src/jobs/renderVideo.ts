import os from "node:os";
import path from "node:path";
import { readFile, mkdir } from "node:fs/promises";
import { prisma, AssetKind } from "@demoforge/db";
import { getStorage } from "@demoforge/integrations";
import { storyboardToRenderProps, renderDemoVideo, normalizeMp4, shrinkMp4 } from "@demoforge/render";
import { RENDER_DEFAULTS } from "@demoforge/shared";
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

  const props = storyboardToRenderProps(projectToContext(project), storyboard, {
    fps: RENDER_DEFAULTS.fps,
    accentColor: process.env.RENDER_ACCENT ?? "#6366F1",
    audioUrl,
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
  try {
    ({ bytes } = await storage.put(outKey, buf, "video/mp4"));
  } catch (err) {
    // Object storage rejected the file (e.g. Supabase per-file size limit).
    // Re-encode smaller (720p) and retry once so the demo still ships.
    if (/EntityTooLarge|exceeded the maximum|413|too large/i.test(String(err))) {
      ctx.log.warn({ bytes: buf.byteLength }, "render too large for storage; shrinking to 720p and retrying");
      const smallPath = path.join(tmpDir, "demo-720p.mp4");
      await shrinkMp4(deliverPath, smallPath);
      buf = await readFile(smallPath);
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

  await prisma.renderJob.update({ where: { id: ctx.renderJobId }, data: { outputAssetId: asset.id } });

  ctx.log.info({ outputAssetId: asset.id, bytes }, "renderVideo complete");
  return { outputAssetId: asset.id };
}
