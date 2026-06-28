/**
 * Public API of the Studio One montage engine (Node side). The worker imports
 * from here to map a storyboard to props and render a premium video. This module
 * is deliberately free of any Remotion / browser imports (no google-fonts at
 * load time); the Remotion entry (registerRoot) is the separate "./entry" export.
 */
export * from "./schema.js";
export { FPS, TRANSITION_FRAMES, FORMAT_DIMS, dbToVolume, getDurationInFrames, type Dims } from "./lib/constants.js";
export { buildVideoProps, type BuildVideoInput, type VoiceLineInput } from "./lib/buildProps.js";
export { renderVideoProps, type RenderPremiumOptions, FORMAT_TO_COMPOSITION } from "./render.js";
