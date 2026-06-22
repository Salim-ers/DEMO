import React from "react";
import { Composition } from "remotion";
import { type RenderProps, renderPropsSchema, FORMAT_DIMENSIONS } from "@demoforge/shared";
import { DemoVideo, totalDurationInFrames } from "./DemoVideo.js";
import { buildSampleRenderProps } from "./sample.js";

/**
 * Remotion root. One composition per aspect ratio, all backed by the same
 * <DemoVideo>. Duration and dimensions are computed from inputProps via
 * calculateMetadata, so the rendered length always matches the storyboard.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Demo16x9"
        component={DemoVideo}
        durationInFrames={300}
        fps={30}
        width={FORMAT_DIMENSIONS["16:9"].width}
        height={FORMAT_DIMENSIONS["16:9"].height}
        defaultProps={buildSampleRenderProps("16:9")}
        calculateMetadata={calc}
      />
      <Composition
        id="Demo9x16"
        component={DemoVideo}
        durationInFrames={300}
        fps={30}
        width={FORMAT_DIMENSIONS["9:16"].width}
        height={FORMAT_DIMENSIONS["9:16"].height}
        defaultProps={buildSampleRenderProps("9:16")}
        calculateMetadata={calc}
      />
      <Composition
        id="DemoSquare"
        component={DemoVideo}
        durationInFrames={300}
        fps={30}
        width={FORMAT_DIMENSIONS["1:1"].width}
        height={FORMAT_DIMENSIONS["1:1"].height}
        defaultProps={buildSampleRenderProps("1:1")}
        calculateMetadata={calc}
      />
    </>
  );
};

/** Derive fps / dimensions / total length from the validated input props. */
function calc({ props }: { props: Record<string, unknown> }) {
  const parsed: RenderProps = renderPropsSchema.parse(props);
  return {
    durationInFrames: totalDurationInFrames(parsed.scenes),
    fps: parsed.fps,
    width: parsed.width,
    height: parsed.height,
    props: parsed,
  };
}
