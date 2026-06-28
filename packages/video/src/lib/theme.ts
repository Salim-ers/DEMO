import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Manrope";

/** Node-safe constants live in constants.ts; re-exported here for components. */
export { FPS, TRANSITION_FRAMES, FORMAT_DIMS, dbToVolume, type Dims } from "./constants.js";

/** Always-loaded premium fallback face, so text renders even before brand fonts. */
export const { fontFamily: FONT_FAMILY } = loadFont();

/**
 * THE house easing. easeOutExpo — a fast, confident start that brakes slowly.
 * Every entrance/exit uses this. Never linear (the spec's hard rule).
 */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

/** Spring config reserved for pops (badges, numbers, the CTA button). */
export const POP = { damping: 12, mass: 0.6, stiffness: 140 } as const;

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
