import { prisma } from "@demoforge/db";
import { getStorage } from "@demoforge/integrations";
import { buildSRT, buildVTT, type VoiceLine } from "@demoforge/shared";
import type { PipelineCtx } from "../pipeline.js";

export interface CaptionKeys {
  srtKey: string;
  vttKey: string;
}

/**
 * Stage 5 — generateCaptions.
 * Renders SRT + VTT from the timed voice lines and stores them. Deterministic
 * keys make this idempotent (re-running overwrites the same objects).
 */
export async function generateCaptions(ctx: PipelineCtx): Promise<CaptionKeys> {
  const vs = await prisma.voiceScript.findUniqueOrThrow({ where: { projectId: ctx.projectId } });
  const lines = (vs.lines as unknown as VoiceLine[]) ?? [];

  const srt = buildSRT(lines);
  const vtt = buildVTT(lines);

  const srtKey = `exports/${ctx.projectId}/captions.srt`;
  const vttKey = `exports/${ctx.projectId}/captions.vtt`;
  const storage = getStorage();
  await storage.put(srtKey, srt, "application/x-subrip");
  await storage.put(vttKey, vtt, "text/vtt");

  ctx.log.info({ cues: lines.length }, "generateCaptions complete");
  return { srtKey, vttKey };
}
