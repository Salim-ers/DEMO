import { z } from "zod";

/** A CSS color string (hex / rgb / hsl). Kept as a plain string for zod-3. */
const zColor = () => z.string();

/**
 * The contract. Studio One's pipeline fills these props; Remotion renders them.
 * Everything is data: brand identity (extracted from the client site), a typed
 * list of scenes, the voice-over + music tracks, and the word-level captions
 * (from ElevenLabs /with-timestamps).
 */

export const FORMATS = ["16:9", "9:16", "1:1"] as const;
export type Format = (typeof FORMATS)[number];

export const TRANSITIONS = ["fade", "slide", "wipe", "clockWipe", "flip", "none"] as const;
export type TransitionKind = (typeof TRANSITIONS)[number];

/** Brand identity, derived from the client site (never a generic template). */
export const brandSchema = z.object({
  name: z.string(),
  primary: zColor(),
  secondary: zColor(),
  bg: zColor(),
  text: zColor(),
  /** CSS font-family. A premium fallback is always loaded. */
  fontFamily: z.string().default("Manrope"),
  /** staticFile-relative path to the client logo, e.g. "logo.png". */
  logoSrc: z.string().optional(),
  siteHost: z.string().default(""),
});
export type Brand = z.infer<typeof brandSchema>;

/** One word with its absolute timing (ElevenLabs timestamps). */
export const captionSchema = z.object({
  word: z.string(),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
});
export type Caption = z.infer<typeof captionSchema>;

const sceneBase = {
  durationInFrames: z.number().int().positive(),
  /** How this scene hands off to the next one (never a hard cut). */
  transitionToNext: z.enum(TRANSITIONS).default("fade"),
};

/** Optional product screen: a Higgsfield clip (video) or a screenshot (image). */
const deviceFields = {
  deviceSrc: z.string().optional(),
  deviceIsVideo: z.boolean().default(false),
};

export const hookSceneSchema = z.object({
  type: z.literal("hook"),
  ...sceneBase,
  ...deviceFields,
  title: z.string(),
  subtitle: z.string().optional(),
});

export const featureSceneSchema = z.object({
  type: z.literal("feature"),
  ...sceneBase,
  ...deviceFields,
  eyebrow: z.string().optional(),
  title: z.string(),
  benefit: z.string(),
  /** 0..1 anchor inside the device frame the animated cursor moves to + clicks. */
  cursorTarget: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
});

export const statSchema = z.object({
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  label: z.string(),
});

export const statsSceneSchema = z.object({
  type: z.literal("stats"),
  ...sceneBase,
  title: z.string().optional(),
  stats: z.array(statSchema).min(1).max(4),
});

export const ctaSceneSchema = z.object({
  type: z.literal("cta"),
  ...sceneBase,
  headline: z.string(),
  buttonLabel: z.string(),
  url: z.string().optional(),
});

export const sceneSchema = z.discriminatedUnion("type", [
  hookSceneSchema,
  featureSceneSchema,
  statsSceneSchema,
  ctaSceneSchema,
]);
export type Scene = z.infer<typeof sceneSchema>;

export const videoSchema = z.object({
  brand: brandSchema,
  format: z.enum(FORMATS).default("16:9"),
  scenes: z.array(sceneSchema).min(1),
  /** staticFile-relative WAV (PCM) from ElevenLabs. */
  voiceoverSrc: z.string().optional(),
  /** staticFile-relative music bed, ducked under the voice. */
  musicSrc: z.string().optional(),
  /** Music loudness under the voice, in dB (spec: -18 to -22). */
  musicDuckingDb: z.number().default(-20),
  captions: z.array(captionSchema).default([]),
});
export type VideoProps = z.infer<typeof videoSchema>;
