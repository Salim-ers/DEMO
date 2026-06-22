export const APP_NAME = "DemoForge";

export const VIDEO_FORMATS = ["16:9", "9:16", "1:1"] as const;
export type VideoFormat = (typeof VIDEO_FORMATS)[number];

export const FORMAT_DIMENSIONS: Record<VideoFormat, { width: number; height: number }> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
};

export const DEMO_DURATIONS = [30, 60, 90, 180] as const;
export type DemoDuration = (typeof DEMO_DURATIONS)[number];

export const DEMO_TONES = ["premium", "pedagogical", "sales", "investor_demo", "onboarding"] as const;
export type DemoTone = (typeof DEMO_TONES)[number];

export const VOICE_MODES = ["uploaded_human_voice", "tts_provider", "script_only"] as const;
export type VoiceMode = (typeof VOICE_MODES)[number];

export const SCENE_TYPES = [
  "screen_capture", "zoom", "transition", "title_card", "benefit_card", "higgsfield_broll", "outro",
] as const;
export type SceneType = (typeof SCENE_TYPES)[number];

export const CAPTURE_VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
} as const;

export const RENDER_DEFAULTS = { fps: 30, width: 1920, height: 1080 } as const;

/** Hard cap on a single browser session lifetime (security requirement). */
export const MAX_BROWSER_SESSION_MS = 5 * 60 * 1000;

/** Job names — keep in sync with apps/worker queue definitions. */
export const JOBS = {
  analyzeProject: "analyzeProject",
  captureWebsite: "captureWebsite",
  generateStoryboard: "generateStoryboard",
  generateVoiceScript: "generateVoiceScript",
  generateCaptions: "generateCaptions",
  renderVideo: "renderVideo",
  exportAssets: "exportAssets",
} as const;
export type JobName = (typeof JOBS)[keyof typeof JOBS];

// NOTE: no ":" — BullMQ v5 rejects colons in queue names (it uses ":" as its
// internal Redis key separator). A colon here crashes both the Worker and the
// web-side Queue with "Queue name cannot contain :".
export const QUEUE_NAME = "demoforge-pipeline";

/** Average speaking rate (words/min) used to budget voiceover against scene time. */
export const WORDS_PER_MINUTE = 150;
