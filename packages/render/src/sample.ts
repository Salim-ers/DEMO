import { type RenderProps, FORMAT_DIMENSIONS, RENDER_DEFAULTS, msToFrames, type VideoFormat } from "@studio-one/shared";

/**
 * Hand-built sample props for Remotion Studio previews and as a safe default.
 * Intentionally depends only on @studio-one/shared so the browser bundle stays
 * lean (no Node-only provider code). Screenshots are null here, so capture
 * scenes render the graceful placeholder — the real pipeline supplies URLs.
 */
export function buildSampleRenderProps(format: VideoFormat = "16:9"): RenderProps {
  const fps = RENDER_DEFAULTS.fps;
  const dims = FORMAT_DIMENSIONS[format];
  const ms = (n: number) => msToFrames(n, fps);

  return {
    productName: "Northwind CRM",
    mainPromise: "Close more deals with less busywork.",
    format,
    fps,
    width: dims.width,
    height: dims.height,
    audioUrl: null,
    musicUrl: null,
    accentColor: "#6366F1",
    logoUrl: null,
    siteHost: "northwind.example.com",
    videoStyle: null,
    scenes: [
      {
        id: "s_title",
        type: "title_card",
        imageUrl: null,
        visualInstruction: "Close more deals with less busywork.",
        captionText: "Northwind CRM",
        durationInFrames: ms(2600),
        cameraMotion: "none",
        callouts: [],
        highlight: null,
      },
      {
        id: "s_problem",
        type: "benefit_card",
        imageUrl: null,
        visualInstruction: "Most teams lose hours switching tabs to find what needs attention.",
        captionText: "The problem",
        durationInFrames: ms(3000),
        cameraMotion: "none",
        callouts: [],
        highlight: null,
      },
      {
        id: "s_dashboard",
        type: "screen_capture",
        imageUrl: null,
        visualInstruction: "Dashboard overview screen.",
        captionText: "Your pipeline, prioritized the moment you log in.",
        durationInFrames: ms(4200),
        cameraMotion: "slow_zoom_in",
        callouts: [{ text: "Priority accounts", x: 0.32, y: 0.4 }],
        highlight: null,
      },
      {
        id: "s_create",
        type: "screen_capture",
        imageUrl: null,
        visualInstruction: "Create customer flow.",
        captionText: "Adding a customer takes one click, not five.",
        durationInFrames: ms(4200),
        cameraMotion: "ken_burns",
        callouts: [{ text: "New customer", x: 0.7, y: 0.3 }],
        highlight: null,
      },
      {
        id: "s_roi",
        type: "benefit_card",
        imageUrl: null,
        visualInstruction: "Teams see priorities first, act faster, and skip the busywork.",
        captionText: "The outcome",
        durationInFrames: ms(3200),
        cameraMotion: "none",
        callouts: [],
        highlight: null,
      },
      {
        id: "s_outro",
        type: "outro",
        imageUrl: null,
        visualInstruction: "See it on your own data — start at northwind.example.com.",
        captionText: "northwind.example.com",
        durationInFrames: ms(2600),
        cameraMotion: "none",
        callouts: [],
        highlight: null,
      },
    ],
  };
}
