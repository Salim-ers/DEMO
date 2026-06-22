import {
  type Storyboard, type ProjectContext, type RenderProps, type RenderScene,
  renderPropsSchema, FORMAT_DIMENSIONS, RENDER_DEFAULTS, msToFrames,
} from "@demoforge/shared";

export interface MapOptions {
  fps?: number;
  accentColor?: string;
  /** Public/signed URL for the audio track, if any. */
  audioUrl?: string | null;
  /** Resolve a storyboard scene's sourceAssetId to a displayable image URL. */
  resolveImageUrl?: (assetId: string) => string | null;
}

const STATEMENT_TYPES = new Set(["title_card", "benefit_card", "outro", "transition"]);

/**
 * Convert a validated Storyboard into Remotion RenderProps. This is the single
 * bridge used by both the worker (real render) and the example script, so the
 * on-screen result always matches the storyboard contract.
 *
 *  - Capture scenes get their real screenshot URL + the narration line burned in
 *    as the subtitle, so caption and voiceover stay in lockstep.
 *  - Statement scenes (title/benefit/outro/transition) carry the spoken claim in
 *    `visualInstruction` for the card components.
 */
export function storyboardToRenderProps(
  ctx: ProjectContext,
  storyboard: Storyboard,
  opts: MapOptions = {},
): RenderProps {
  const fps = opts.fps ?? RENDER_DEFAULTS.fps;
  const dims = FORMAT_DIMENSIONS[ctx.format];

  const scenes: RenderScene[] = storyboard.scenes.map((s) => {
    const isStatement = STATEMENT_TYPES.has(s.type);
    const imageUrl =
      !isStatement && s.sourceAssetId && opts.resolveImageUrl
        ? opts.resolveImageUrl(s.sourceAssetId)
        : null;

    return {
      id: s.id,
      type: s.type,
      imageUrl,
      // Statement cards show the spoken claim; capture scenes keep the layout note.
      visualInstruction: isStatement ? s.voiceoverText || s.visualInstruction : s.visualInstruction,
      // Capture scenes burn in the narration line; cards reuse their short label.
      captionText: isStatement ? s.captionText : s.voiceoverText || s.captionText,
      durationInFrames: msToFrames(s.durationMs, fps),
      cameraMotion: s.cameraMotion,
      callouts: s.callouts,
      highlight: null,
    };
  });

  return renderPropsSchema.parse({
    productName: ctx.productName,
    mainPromise: ctx.mainPromise,
    format: ctx.format,
    fps,
    width: dims.width,
    height: dims.height,
    audioUrl: opts.audioUrl ?? null,
    accentColor: opts.accentColor ?? "#6366F1",
    scenes,
  } satisfies RenderProps);
}
