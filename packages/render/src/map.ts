import {
  type Storyboard, type ProjectContext, type RenderProps, type RenderScene,
  renderPropsSchema, FORMAT_DIMENSIONS, RENDER_DEFAULTS, msToFrames, STATEMENT_SCENE_TYPES,
} from "@studio-one/shared";

export interface MapOptions {
  fps?: number;
  accentColor?: string;
  /** Public/signed URL for the audio track, if any. */
  audioUrl?: string | null;
  /** Background-music track URL (ducked under the voice), if any. */
  musicUrl?: string | null;
  /** Signed URL for the product's real logo, shown in the intro/outro. */
  logoUrl?: string | null;
  /** Real site host for the browser-frame address bar. */
  siteHost?: string;
  /** Art-direction preset id (e.g. "luxury_product"); auto-detected if absent. */
  videoStyle?: string | null;
  /** Resolve a storyboard scene's sourceAssetId to a displayable image URL. */
  resolveImageUrl?: (assetId: string) => string | null;
}

const STATEMENT_TYPES = new Set<string>(STATEMENT_SCENE_TYPES);

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
      // The storyboard owns the on-screen content: a heading, or a structured
      // payload ("a | b" / "value::label") for grids/metrics/maps, or a layout
      // note for captures. We pass it through untouched.
      visualInstruction: s.visualInstruction,
      // Capture-backed scenes burn in the narration line as the subtitle; pure
      // statement/motion cards keep their short kicker/label (no subtitle).
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
    musicUrl: opts.musicUrl ?? null,
    accentColor: opts.accentColor ?? "#6366F1",
    logoUrl: opts.logoUrl ?? null,
    siteHost: opts.siteHost ?? ctx.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    videoStyle: opts.videoStyle ?? null,
    scenes,
  } satisfies RenderProps);
}
