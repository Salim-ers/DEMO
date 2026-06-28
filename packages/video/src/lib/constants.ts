import type { Format, Scene } from "../schema.js";

/**
 * Pure, Node-safe constants + helpers (no Remotion / no google-fonts imports), so
 * the worker can import the mapper/renderer without pulling the browser runtime.
 */

export const FPS = 30;

/** Scene-to-scene transition length (0.5s). */
export const TRANSITION_FRAMES = 15;

export type Dims = { width: number; height: number; safe: number };

/** 1080p masters. Safe area = inner padding so nothing kisses the edge. */
export const FORMAT_DIMS: Record<Format, Dims> = {
  "16:9": { width: 1920, height: 1080, safe: 96 },
  "9:16": { width: 1080, height: 1920, safe: 72 },
  "1:1": { width: 1080, height: 1080, safe: 80 },
};

/** dB → linear gain (for ducking music under the voice). */
export const dbToVolume = (db: number): number => Math.pow(10, db / 20);

/** Total frames once scene-to-scene transition overlaps are accounted for. */
export function getDurationInFrames(scenes: Scene[]): number {
  const sum = scenes.reduce((a, s) => a + s.durationInFrames, 0);
  const transitions = scenes.slice(0, -1).filter((s) => s.transitionToNext !== "none").length;
  return Math.max(1, sum - transitions * TRANSITION_FRAMES);
}

/** ms → frames at the project fps. */
export function msToFramesAt(ms: number, fps = FPS): number {
  return Math.max(1, Math.round((ms / 1000) * fps));
}
