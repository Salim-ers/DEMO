import os from "node:os";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { readFile, mkdir } from "node:fs/promises";
import archiver from "archiver";
import { prisma, AssetKind } from "@demoforge/db";
import { getStorage } from "@demoforge/integrations";
import { voiceScriptToMarkdown } from "@demoforge/voice";
import type { VoiceScript, VoiceLine } from "@demoforge/shared";
import { dbStoryboardToDomain, projectToContext, voiceModeToDomain } from "../db-map.js";
import type { CaptionKeys } from "./generateCaptions.js";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 7 — exportAssets.
 * Produces the downloadable bundle: demo.mp4 (already rendered), storyboard.json,
 * script.md, captions.srt/.vtt, and an assets.zip containing all of the above
 * plus the raw captured screenshots. Records every key on an Export row.
 *
 * Idempotent: deterministic keys + a single Export row reused per project.
 */
export async function exportAssets(ctx: PipelineCtx, captions: CaptionKeys): Promise<{ exportId: string }> {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: ctx.projectId } });
  const sb = await prisma.storyboard.findUniqueOrThrow({
    where: { projectId: project.id },
    include: { scenes: true },
  });
  const vs = await prisma.voiceScript.findUniqueOrThrow({ where: { projectId: project.id } });
  const renderJob = await prisma.renderJob.findUniqueOrThrow({ where: { id: ctx.renderJobId } });
  const storage = getStorage();

  // 1. storyboard.json + script.md -> storage
  const storyboard = dbStoryboardToDomain(sb, sb.scenes);
  const storyboardJsonKey = `exports/${project.id}/storyboard.json`;
  await storage.put(storyboardJsonKey, JSON.stringify(storyboard, null, 2), "application/json");

  const script: VoiceScript = {
    mode: voiceModeToDomain(vs.mode as unknown as string),
    language: vs.language,
    fullText: vs.fullText,
    lines: (vs.lines as unknown as VoiceLine[]) ?? [],
    ttsProvider: vs.ttsProvider ?? null,
    humanAudioAssetKey: vs.humanAudioKey ?? null,
    consentConfirmed: vs.consentConfirmed,
  };
  const scriptMdKey = `exports/${project.id}/script.md`;
  await storage.put(scriptMdKey, voiceScriptToMarkdown(projectToContext(project), script), "text/markdown");

  // 2. Resolve the rendered video key.
  let videoMp4Key: string | undefined;
  if (renderJob.outputAssetId) {
    const out = await prisma.asset.findUnique({ where: { id: renderJob.outputAssetId } });
    videoMp4Key = out?.storageKey;
  }

  // 3. Build assets.zip from storage objects + screenshots.
  const tmpDir = path.join(os.tmpdir(), `demoforge-export-${project.id}`);
  await mkdir(tmpDir, { recursive: true });
  const zipPath = path.join(tmpDir, "assets.zip");
  const assetsZipKey = `exports/${project.id}/assets.zip`;

  const screenshots = await prisma.asset.findMany({
    where: { projectId: project.id, kind: { in: [AssetKind.SCREENSHOT_DESKTOP, AssetKind.SCREENSHOT_MOBILE] } },
    orderBy: { createdAt: "asc" },
  });

  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve());
    archive.on("error", reject);
    archive.pipe(output);

    void (async () => {
      try {
        archive.append(JSON.stringify(storyboard, null, 2), { name: "storyboard.json" });
        archive.append(voiceScriptToMarkdown(projectToContext(project), script), { name: "script.md" });
        archive.append(await storage.get(captions.srtKey), { name: "captions.srt" });
        archive.append(await storage.get(captions.vttKey), { name: "captions.vtt" });
        if (videoMp4Key) archive.append(await storage.get(videoMp4Key), { name: "demo.mp4" });
        let i = 0;
        for (const shot of screenshots) {
          try {
            archive.append(await storage.get(shot.storageKey), { name: `screens/${String(i).padStart(2, "0")}-${shot.kind.toLowerCase()}.png` });
            i++;
          } catch {
            /* skip missing object */
          }
        }
        await archive.finalize();
      } catch (err) {
        reject(err as Error);
      }
    })();
  });

  const zipBuf = await readFile(zipPath);
  await storage.put(assetsZipKey, zipBuf, "application/zip");

  // 4. Record the Export (reuse the latest row if one exists).
  const existing = await prisma.export.findFirst({ where: { projectId: project.id }, orderBy: { createdAt: "desc" } });
  const data = {
    projectId: project.id,
    videoMp4Key: videoMp4Key ?? null,
    storyboardJsonKey,
    scriptMdKey,
    captionsSrtKey: captions.srtKey,
    captionsVttKey: captions.vttKey,
    assetsZipKey,
  };
  const exp = existing
    ? await prisma.export.update({ where: { id: existing.id }, data })
    : await prisma.export.create({ data });

  ctx.log.info({ exportId: exp.id, screenshots: screenshots.length }, "exportAssets complete");
  return { exportId: exp.id };
}
