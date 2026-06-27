/**
 * ElevenLabs adapter (web-facing). Natural voice-over per scene, synchronized
 * with captions. The real client lives in `packages/integrations/src/tts`; this
 * surface is what the app and wizard call.
 */
import type { VoiceClip, VoiceSpec, VoiceStyleId } from "../../types/video-engine.js";
import { isMockEngine } from "./engine.js";

export const elevenLabsAvailable = Boolean(process.env.ELEVENLABS_API_KEY);

export interface VoicePreset {
  id: VoiceStyleId;
  label: string;
  description: string;
}

/** Selectable voice characters surfaced in the wizard. */
export const VOICE_PRESETS: VoicePreset[] = [
  { id: "premium", label: "Premium", description: "Posée, haut de gamme, rassurante." },
  { id: "energetic", label: "Énergique", description: "Rythmée, idéale pour TikTok et Reels." },
  { id: "corporate", label: "Corporate", description: "Neutre et professionnelle, pour le B2B." },
  { id: "calm", label: "Calme", description: "Douce et claire, pour l'onboarding." },
];

export const DEFAULT_VOICE: VoiceSpec = {
  enabled: false,
  style: "premium",
  gender: "female",
  language: "fr",
  energy: 1,
};

/**
 * Synthesize a scene's voice line. In mock mode returns a "ready" clip with an
 * estimated duration (150 words/min) so the timeline can lay out audio without
 * a backend. Production routes to the real ElevenLabs synthesis in the worker.
 */
export async function synthesizeScene(sceneKey: string, text: string, spec: VoiceSpec): Promise<VoiceClip> {
  if (!spec.enabled) return { sceneKey, status: "skipped" };
  if (isMockEngine || !elevenLabsAvailable) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const durationMs = Math.round((words / (150 * spec.energy)) * 60_000);
    return { sceneKey, status: "ready", durationMs };
  }
  return { sceneKey, status: "queued" };
}
