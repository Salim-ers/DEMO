import { z } from "zod";
import {
  VIDEO_FORMATS, DEMO_DURATIONS, DEMO_TONES, VOICE_MODES, SCENE_TYPES,
} from "./constants.js";

/* -------------------------------------------------------------------------- */
/*  Project creation (Step 1 + 2 + 3 of the wizard)                            */
/* -------------------------------------------------------------------------- */

export const createProjectSchema = z.object({
  productName: z.string().min(2).max(120),
  url: z.string().url(),
  targetAudience: z.string().min(2).max(280),
  mainPromise: z.string().min(2).max(280),
  durationSeconds: z.union(
    DEMO_DURATIONS.map((d) => z.literal(d)) as [z.ZodLiteral<number>, ...z.ZodLiteral<number>[]],
  ),
  format: z.enum(VIDEO_FORMATS),
  language: z.string().min(2).max(10).default("en"),
  tone: z.enum(DEMO_TONES),
  voiceMode: z.enum(VOICE_MODES),
});
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/** Access credentials. The plaintext password never leaves this boundary —
 *  it is handed straight to the vault and replaced by a CredentialVaultRef. */
export const credentialsSchema = z.object({
  loginUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1).optional(),
  notes: z.string().max(2000).optional(),
});
export type CredentialsInput = z.infer<typeof credentialsSchema>;

/* -------------------------------------------------------------------------- */
/*  Scenario: natural language -> structured steps                             */
/* -------------------------------------------------------------------------- */

export const scenarioStepSchema = z.object({
  intent: z.string().min(1),
  urlHint: z.string().optional(),
  actionHints: z.array(z.string()).optional(),
  waitForSelector: z.string().optional(),
  note: z.string().optional(),
});
export type ScenarioStep = z.infer<typeof scenarioStepSchema>;

export const scenarioSchema = z.object({
  raw: z.string().min(1),
  steps: z.array(scenarioStepSchema).min(1),
});
export type Scenario = z.infer<typeof scenarioSchema>;

/* -------------------------------------------------------------------------- */
/*  Capture artifacts                                                          */
/* -------------------------------------------------------------------------- */

export const pageMetadataSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  headings: z.array(z.string()).default([]),
  visibleButtons: z.array(z.string()).default([]),
  primaryText: z.array(z.string()).default([]),
});
export type PageMetadata = z.infer<typeof pageMetadataSchema>;

export const captureStepResultSchema = z.object({
  index: z.number().int().nonnegative(),
  intent: z.string(),
  url: z.string(),
  status: z.enum(["ok", "broken", "skipped"]),
  screenshotAssetKey: z.string().optional(),
  mobileScreenshotAssetKey: z.string().optional(),
  videoAssetKey: z.string().optional(),
  metadata: pageMetadataSchema.optional(),
  startedAt: z.string(),
  finishedAt: z.string(),
  error: z.string().optional(),
});
export type CaptureStepResult = z.infer<typeof captureStepResultSchema>;

/* -------------------------------------------------------------------------- */
/*  Storyboard — STRICT output contract (matches the spec exactly)             */
/* -------------------------------------------------------------------------- */

export const calloutSchema = z.object({
  text: z.string(),
  /** Relative anchor 0..1 within the frame. */
  x: z.number().min(0).max(1).default(0.5),
  y: z.number().min(0).max(1).default(0.5),
});
export type Callout = z.infer<typeof calloutSchema>;

export const cameraMotionSchema = z.enum([
  "none", "slow_zoom_in", "slow_zoom_out", "pan_left", "pan_right", "ken_burns",
]);
export type CameraMotion = z.infer<typeof cameraMotionSchema>;

export const storyboardSceneSchema = z.object({
  id: z.string(),
  type: z.enum(SCENE_TYPES),
  sourceAssetId: z.string().nullable().optional(),
  visualInstruction: z.string(),
  voiceoverText: z.string(),
  captionText: z.string(),
  durationMs: z.number().int().positive(),
  cameraMotion: cameraMotionSchema.default("none"),
  highlightSelector: z.string().nullable().optional(),
  callouts: z.array(calloutSchema).default([]),
});
export type StoryboardScene = z.infer<typeof storyboardSceneSchema>;

export const storyboardSchema = z.object({
  title: z.string(),
  targetAudience: z.string(),
  durationSeconds: z.number().int().positive(),
  scenes: z.array(storyboardSceneSchema).min(1),
});
export type Storyboard = z.infer<typeof storyboardSchema>;

/* -------------------------------------------------------------------------- */
/*  Voice script                                                               */
/* -------------------------------------------------------------------------- */

export const voiceLineSchema = z.object({
  sceneId: z.string(),
  text: z.string(),
  startMs: z.number().int().nonnegative(),
  endMs: z.number().int().positive(),
});
export type VoiceLine = z.infer<typeof voiceLineSchema>;

export const voiceScriptSchema = z.object({
  mode: z.enum(VOICE_MODES),
  language: z.string(),
  fullText: z.string(),
  lines: z.array(voiceLineSchema),
  /** Provider used when mode = tts_provider; null otherwise. */
  ttsProvider: z.string().nullable().default(null),
  /** Asset key of an uploaded human voice file when mode = uploaded_human_voice. */
  humanAudioAssetKey: z.string().nullable().default(null),
  /** Consent flag — required to be true before any TTS/voice synthesis runs. */
  consentConfirmed: z.boolean().default(false),
});
export type VoiceScript = z.infer<typeof voiceScriptSchema>;

/* -------------------------------------------------------------------------- */
/*  Render props handed to Remotion                                            */
/* -------------------------------------------------------------------------- */

export const renderSceneSchema = z.object({
  id: z.string(),
  type: z.enum(SCENE_TYPES),
  imageUrl: z.string().nullable(),
  visualInstruction: z.string(),
  captionText: z.string(),
  durationInFrames: z.number().int().positive(),
  cameraMotion: cameraMotionSchema,
  callouts: z.array(calloutSchema),
  highlight: z
    .object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })
    .nullable()
    .optional(),
});
export type RenderScene = z.infer<typeof renderSceneSchema>;

export const renderPropsSchema = z.object({
  productName: z.string(),
  mainPromise: z.string(),
  format: z.enum(VIDEO_FORMATS),
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  audioUrl: z.string().nullable(),
  accentColor: z.string().default("#6366F1"),
  scenes: z.array(renderSceneSchema).min(1),
});
export type RenderProps = z.infer<typeof renderPropsSchema>;

/* -------------------------------------------------------------------------- */
/*  Pipeline job payload                                                       */
/* -------------------------------------------------------------------------- */

export const pipelineJobDataSchema = z.object({
  projectId: z.string(),
  renderJobId: z.string(),
});
export type PipelineJobData = z.infer<typeof pipelineJobDataSchema>;
