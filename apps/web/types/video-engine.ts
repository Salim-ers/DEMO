/**
 * Studio One — video engine contracts (web-facing).
 *
 * These types describe the product-level video model and the three internal
 * engines the production pipeline is built on:
 *   • Higgsfield  → AI shots / cinematic b-roll / vertical social plans
 *   • ElevenLabs  → natural voice-over per scene
 *   • Remotion    → final composition (screens + shots + voice + captions)
 *
 * The real integrations live in `packages/*`. This layer gives the app a clean,
 * typed surface plus a mock mode so the UI works before keys are wired.
 */

export type VideoFormat = "16:9" | "9:16" | "1:1";

/** Product-level status the user sees (mapped from the DB project status). */
export type VideoStatus =
  | "draft"
  | "analyzing"
  | "storyboard_ready"
  | "rendering"
  | "action_required"
  | "ready"
  | "archived";

/** The angle of the video. */
export type VideoType =
  | "saas_demo"
  | "tiktok_ad"
  | "reels_ad"
  | "product_onboarding"
  | "sales_pitch"
  | "feature_teaser"
  | "tutorial";

/** Art-direction preset. */
export type VideoStyleId =
  | "premium_clean"
  | "tiktok_dynamic"
  | "corporate"
  | "minimal_luxury"
  | "startup_punchy"
  | "product_led";

export type EngineStageStatus = "queued" | "generating" | "ready" | "failed" | "skipped";

/* ------------------------------------------------------------------ */
/* Higgsfield — AI shot / b-roll generation                            */
/* ------------------------------------------------------------------ */

export interface HiggsfieldShotRequest {
  prompt: string;
  visualStyle: string;
  cameraMotion: "static" | "push_in" | "pan" | "orbit" | "handheld";
  intensity: "subtle" | "balanced" | "bold";
  orientation: "horizontal" | "vertical";
  durationSec: number;
}

export interface HiggsfieldShot extends HiggsfieldShotRequest {
  id: string;
  status: EngineStageStatus;
  previewUrl?: string;
}

/* ------------------------------------------------------------------ */
/* ElevenLabs — voice-over                                             */
/* ------------------------------------------------------------------ */

export type VoiceStyleId = "energetic" | "calm" | "premium" | "corporate";

export interface VoiceSpec {
  enabled: boolean;
  voiceId?: string;
  style: VoiceStyleId;
  gender: "female" | "male" | "neutral";
  language: string;
  /** 0.8 (calm) … 1.2 (energetic). */
  energy: number;
}

export interface VoiceClip {
  sceneKey: string;
  status: EngineStageStatus;
  durationMs?: number;
  audioUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Remotion — final composition                                        */
/* ------------------------------------------------------------------ */

export interface RemotionSceneSpec {
  sceneKey: string;
  durationMs: number;
  /** Which source the scene shows. */
  source: "screenshot" | "higgsfield" | "title" | "metric" | "cta";
  captionText?: string;
  cameraMotion?: string;
}

export interface RemotionComposition {
  format: VideoFormat;
  width: number;
  height: number;
  fps: number;
  durationMs: number;
  scenes: RemotionSceneSpec[];
}

/* ------------------------------------------------------------------ */
/* Production pipeline (what the detail page renders)                  */
/* ------------------------------------------------------------------ */

export type EngineId = "studio" | "higgsfield" | "elevenlabs" | "remotion";

export interface ProductionStage {
  key: string;
  label: string;
  engine: EngineId;
  status: EngineStageStatus;
  detail: string;
}

/* ------------------------------------------------------------------ */
/* Product model                                                       */
/* ------------------------------------------------------------------ */

export interface VideoOutputs {
  mp4?: string;
  webm?: string;
  srt?: string;
  scriptMd?: string;
  storyboardJson?: string;
  assetsZip?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  websiteUrl: string;
  brandName: string;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
  durationSeconds: number;
  format: VideoFormat;
  videoType: VideoType;
  style: VideoStyleId;
  language: string;
  hasVoiceOver: boolean;
  hasSubtitles: boolean;
  finalCta: string;
  description: string;
  thumbnail?: string;
  /** 0..100 */
  progress: number;
  outputs: VideoOutputs;
}

export interface Subscription {
  planName: string;
  monthlyPrice: number;
  includedVideos: number;
  usedVideosThisMonth: number;
  renewalDate: string;
}
