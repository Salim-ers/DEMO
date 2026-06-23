export const APP_NAME = "StudioOne";

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

/** Art-direction presets selectable in the wizard ("Video style"). */
export const VIDEO_STYLES = [
  "clean_saas", "premium_motion", "luxury_product", "startup_launch", "investor_demo", "social_short",
] as const;
export type VideoStyle = (typeof VIDEO_STYLES)[number];

export const VIDEO_STYLE_LABEL: Record<VideoStyle, string> = {
  clean_saas: "Clean SaaS Demo",
  premium_motion: "Premium Motion Explainer",
  luxury_product: "Luxury Product Demo",
  startup_launch: "Startup Launch Video",
  investor_demo: "Investor Demo",
  social_short: "Social Short",
};

/** Fallback style intent used when a reference-style URL can't be analyzed. */
export const REFERENCE_STYLE_FALLBACK =
  "Premium SaaS explainer video with animated UI, motion graphics, cinematic transitions, " +
  "strong product storytelling, elegant color palette, professional voiceover and polished sales-demo pacing.";

export const VOICE_MODES = ["uploaded_human_voice", "tts_provider", "script_only"] as const;
export type VoiceMode = (typeof VOICE_MODES)[number];

export const SCENE_TYPES = [
  // Legacy / base types (kept for back-compat with existing storyboards).
  "screen_capture", "zoom", "transition", "title_card", "benefit_card", "higgsfield_broll", "outro",
  // Premium SaaS motion-engine scene types (the new commercial arc).
  "cinematic_intro", "problem_motion_card", "promise_card", "product_stage", "product_zoom",
  "feature_callout", "metric_moment", "workflow_map", "benefit_grid", "final_cta",
] as const;
export type SceneType = (typeof SCENE_TYPES)[number];

/** Scene types that are pure motion-graphics statements (no product screenshot). */
export const STATEMENT_SCENE_TYPES = [
  "title_card", "benefit_card", "transition", "outro",
  "cinematic_intro", "problem_motion_card", "promise_card", "metric_moment", "workflow_map",
  "benefit_grid", "final_cta",
] as const;

export const CAPTURE_VIEWPORTS = {
  // Full-HD desktop so screenshots are pixel-sharp at the 1080p render size
  // (with deviceScaleFactor 2 the actual capture is 3840×2160). Env-overridable
  // via CAPTURE_WIDTH / CAPTURE_HEIGHT / CAPTURE_DEVICE_SCALE_FACTOR.
  desktop: { width: 1920, height: 1080 },
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
