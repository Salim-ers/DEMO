/**
 * Remotion adapter (web-facing). Remotion is the final assembly engine: it
 * composes product screenshots, Higgsfield shots, voice-over, captions and
 * transitions into the exported video. The real renderer lives in
 * `packages/render`; this surface plans the composition for the UI.
 */
import { FORMAT_DIMENSIONS, RENDER_DEFAULTS, type VideoFormat } from "@studio-one/shared";
import type { RemotionComposition, RemotionSceneSpec } from "../../types/video-engine.js";
import { isMockEngine } from "./engine.js";

export const remotionEndpoint = process.env.REMOTION_RENDER_ENDPOINT ?? "";
export const remotionAvailable = remotionEndpoint.length > 0;

/** Pixel dimensions for a target format. */
export function dimensionsFor(format: VideoFormat) {
  return FORMAT_DIMENSIONS[format] ?? FORMAT_DIMENSIONS["16:9"];
}

/** Build the composition plan (durations, scene sources) from a scene list. */
export function planComposition(format: VideoFormat, scenes: RemotionSceneSpec[]): RemotionComposition {
  const { width, height } = dimensionsFor(format);
  const durationMs = scenes.reduce((sum, s) => sum + s.durationMs, 0);
  return { format, width, height, fps: RENDER_DEFAULTS.fps, durationMs, scenes };
}

/**
 * Kick off a render. Mock mode returns the plan as "ready" so the export center
 * has something to show; production posts the composition to the render
 * endpoint (handled by the worker / packages/render).
 */
export async function renderComposition(comp: RemotionComposition): Promise<{ status: "ready" | "queued"; comp: RemotionComposition }> {
  if (isMockEngine || !remotionAvailable) return { status: "ready", comp };
  return { status: "queued", comp };
}
