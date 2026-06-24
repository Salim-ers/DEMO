import { prisma, AssetKind } from "@studio-one/db";
import { buildVoiceScript } from "@studio-one/voice";
import { getTTS, GoogleTTSProvider, getStorage } from "@studio-one/integrations";
import { dbStoryboardToDomain, projectToContext, voiceModeToDb, voiceModeToDomain } from "../db-map.js";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 4 — generateVoiceScript.
 * Builds a timed voiceover script aligned 1:1 with storyboard scenes. For the
 * tts_provider mode it will synthesize audio ONLY when consent is confirmed and
 * a provider is configured; otherwise it degrades gracefully to script-only.
 *
 * Idempotent: upserts the project's single VoiceScript.
 */
export async function generateVoiceScript(ctx: PipelineCtx): Promise<{ voiceScriptId: string }> {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: ctx.projectId } });
  const sb = await prisma.storyboard.findUniqueOrThrow({
    where: { projectId: project.id },
    include: { scenes: true },
  });
  const storyboard = dbStoryboardToDomain(sb, sb.scenes);
  const mode = voiceModeToDomain(project.voiceMode as unknown as string);

  // Consent is only implicit for script_only; any synthesis path needs an
  // explicit flag, which the web app captures at project creation.
  const existing = await prisma.voiceScript.findUnique({ where: { projectId: project.id } });
  const consentConfirmed = existing?.consentConfirmed ?? mode === "script_only";

  const script = await buildVoiceScript({
    ctx: projectToContext(project),
    storyboard,
    mode,
    consentConfirmed,
    humanAudioAssetKey: existing?.humanAudioKey ?? null,
    ttsProvider: process.env.TTS_PROVIDER ?? null,
  });

  let audioAssetId: string | undefined;
  if (mode === "tts_provider" && script.consentConfirmed) {
    const tts = getTTS();
    let out = await tts.synthesize(script.fullText, { language: script.language, consent: true });
    // Never ship a silent demo: if the configured provider (e.g. ElevenLabs with
    // a missing/invalid key or exhausted quota) returns no audio, fall back to the
    // free Google voice so there is always a voiceover.
    if ((out.status !== "generated" || !out.audio) && tts.name !== "google") {
      ctx.log.warn({ provider: tts.name, status: out.status }, "primary TTS produced no audio; falling back to free voice");
      out = await new GoogleTTSProvider().synthesize(script.fullText, { language: script.language, consent: true });
    }
    if (out.status === "generated" && out.audio) {
      const key = `audio/${project.id}/voiceover.mp3`;
      const { bytes } = await getStorage().put(key, out.audio, out.contentType);
      const asset = await prisma.asset.create({
        data: { projectId: project.id, kind: AssetKind.AUDIO, storageKey: key, contentType: out.contentType, bytes },
      });
      audioAssetId = asset.id;
      ctx.log.info({ provider: out.provider }, "voiceover synthesized");
    } else {
      ctx.log.info({ status: out.status }, "voiceover not synthesized; continuing without audio");
    }
  }

  const row = await prisma.voiceScript.upsert({
    where: { projectId: project.id },
    create: {
      projectId: project.id,
      mode: voiceModeToDb(mode) as never,
      language: script.language,
      fullText: script.fullText,
      lines: script.lines as unknown as object,
      ttsProvider: script.ttsProvider,
      humanAudioKey: script.humanAudioAssetKey,
      consentConfirmed: script.consentConfirmed,
      audioAssetId,
    },
    update: {
      mode: voiceModeToDb(mode) as never,
      language: script.language,
      fullText: script.fullText,
      lines: script.lines as unknown as object,
      ttsProvider: script.ttsProvider,
      consentConfirmed: script.consentConfirmed,
      audioAssetId: audioAssetId ?? existing?.audioAssetId ?? null,
    },
  });

  ctx.log.info({ lines: script.lines.length, mode }, "generateVoiceScript complete");
  return { voiceScriptId: row.id };
}
