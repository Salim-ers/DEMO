import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Manrope";
import type { Format } from "../schema.js";

/** Always-loaded premium fallback face, so text renders even before brand fonts. */
export const { fontFamily: FONT_FAMILY } = loadFont();

export const FPS = 30;

/** Scene-to-scene transition length (0.5s). */
export const TRANSITION_FRAMES = 15;

/**
 * THE house easing. easeOutExpo — a fast, confident start that brakes slowly.
 * Every entrance/exit uses this. Never linear (the spec's hard rule).
 */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** Spring config reserved for pops (badges, numbers, the CTA button). */
export const POP = { damping: 12, mass: 0.6, stiffness: 140 } as const;

export type Dims = { width: number; height: number; safe: number };

/** 1080p masters. Safe area = inner padding so nothing kisses the edge. */
export const FORMAT_DIMS: Record<Format, Dims> = {
  "16:9": { width: 1920, height: 1080, safe: 96 },
  "9:16": { width: 1080, height: 1920, safe: 72 },
  "1:1": { width: 1080, height: 1080, safe: 80 },
};

/** dB → linear gain (for ducking music under the voice). */
export const dbToVolume = (db: number): number => Math.pow(10, db / 20);

/**
 * Staggered entrance. Returns opacity + a small upward translate, eased. Pass an
 * index-based `delay` so elements arrive in a cascade rather than all at once.
 */
export function enter(frame: number, delay = 0, duration = 18, lift = 26) {
  const t = frame - delay;
  const opacity = interpolate(t, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const y = interpolate(t, [0, duration], [lift, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  return { opacity, y };
}

/** A continuous slow push-in scale for "nothing static" backgrounds. */
export function slowPush(frame: number, totalFrames: number, from = 1, to = 1.06) {
  return interpolate(frame, [0, Math.max(1, totalFrames)], [from, to], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
}
