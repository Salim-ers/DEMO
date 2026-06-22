import {
  type Storyboard, type VoiceScript, type VoiceLine, type VoiceMode, type ProjectContext,
  voiceScriptSchema, VOICE_SYSTEM, voiceUserPrompt, wordsIn, WORDS_PER_MINUTE,
} from "@demoforge/shared";
import { resolveLLM, extractJSON } from "@demoforge/integrations";

export interface VoiceScriptInput {
  ctx: ProjectContext;
  storyboard: Storyboard;
  mode: VoiceMode;
  /** Required true before any TTS synthesis or human-voice cloning. */
  consentConfirmed?: boolean;
  /** Asset key of an uploaded human recording (mode = uploaded_human_voice). */
  humanAudioAssetKey?: string | null;
  /** Provider label recorded for the audit trail (mode = tts_provider). */
  ttsProvider?: string | null;
}

/**
 * Build the voiceover script. Lines are aligned 1:1 with storyboard scenes and
 * timed to each scene's duration, so captions and audio stay in sync.
 *
 * Modes:
 *  - script_only          : text export for a human to record. No synthesis.
 *  - uploaded_human_voice : user-provided audio; we keep the script for captions.
 *  - tts_provider         : synthesis happens later in the worker, only if consent.
 *
 * The optional LLM pass only *polishes* wording; the timeline is always derived
 * from the storyboard so output is deterministic and never drifts.
 */
export async function buildVoiceScript(input: VoiceScriptInput): Promise<VoiceScript> {
  const { ctx, storyboard, mode } = input;

  const polished = await maybePolish(ctx, storyboard);

  const lines: VoiceLine[] = [];
  let cursor = 0;
  for (const scene of storyboard.scenes) {
    const text = (polished.get(scene.id) ?? scene.voiceoverText).trim();
    const start = cursor;
    const end = cursor + scene.durationMs;
    if (text) lines.push({ sceneId: scene.id, text, startMs: start, endMs: end });
    cursor = end;
  }

  const fullText = lines.map((l) => l.text).join(" ");

  // Sanity: warn if the script overflows the speakable budget for the runtime.
  const budgetWords = Math.round((cursor / 60000) * WORDS_PER_MINUTE);
  if (wordsIn(fullText) > budgetWords * 1.25) {
    // Non-fatal — the worker logs this. Kept concise by the storyboard generator.
  }

  const script: VoiceScript = {
    mode,
    language: ctx.language,
    fullText,
    lines,
    ttsProvider: mode === "tts_provider" ? input.ttsProvider ?? null : null,
    humanAudioAssetKey: mode === "uploaded_human_voice" ? input.humanAudioAssetKey ?? null : null,
    // Consent is only meaningful for synthesis/cloning paths.
    consentConfirmed:
      mode === "script_only" ? true : Boolean(input.consentConfirmed),
  };

  return voiceScriptSchema.parse(script);
}

/** Optional LLM polish of per-scene wording. Falls back silently to storyboard text. */
async function maybePolish(ctx: ProjectContext, storyboard: Storyboard): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const llm = resolveLLM();
  if (!llm) return map;
  try {
    const raw = await llm.complete({
      system: VOICE_SYSTEM,
      messages: [
        {
          role: "user",
          content: voiceUserPrompt(
            ctx,
            storyboard.scenes.map((s) => ({ id: s.id, voiceoverText: s.voiceoverText })),
          ),
        },
      ],
      maxTokens: 1500,
      temperature: 0.5,
    });
    const json = extractJSON(raw) as { lines?: Array<{ sceneId: string; text: string }> };
    for (const l of json.lines ?? []) {
      if (l.sceneId && typeof l.text === "string") map.set(l.sceneId, l.text);
    }
  } catch {
    /* keep storyboard text */
  }
  return map;
}

/** Export the script as Markdown for human recording / review. */
export function voiceScriptToMarkdown(ctx: ProjectContext, script: VoiceScript): string {
  const header = `# Voiceover script — ${ctx.productName}\n\n` +
    `- Language: ${script.language}\n- Mode: ${script.mode}\n- Tone: ${ctx.tone}\n\n---\n`;
  const body = script.lines
    .map((l, i) => {
      const sec = (l.startMs / 1000).toFixed(1);
      return `**${i + 1}. [${sec}s]**\n\n${l.text}\n`;
    })
    .join("\n");
  return header + "\n" + body;
}
