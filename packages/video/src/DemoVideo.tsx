import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import type { Brand, Format, Scene, TransitionKind, VideoProps } from "./schema.js";
import { FORMAT_DIMS, TRANSITION_FRAMES } from "./lib/theme.js";
import { HookScene } from "./scenes/HookScene.js";
import { FeatureScene } from "./scenes/FeatureScene.js";
import { StatsScene } from "./scenes/StatsScene.js";
import { CtaScene } from "./scenes/CtaScene.js";
import { RollingCaptions, Soundtrack } from "./components.js";

function SceneRouter({ scene, brand, format }: { scene: Scene; brand: Brand; format: Format }) {
  switch (scene.type) {
    case "hook":
      return <HookScene scene={scene} brand={brand} format={format} />;
    case "feature":
      return <FeatureScene scene={scene} brand={brand} format={format} />;
    case "stats":
      return <StatsScene scene={scene} brand={brand} format={format} />;
    case "cta":
      return <CtaScene scene={scene} brand={brand} format={format} />;
  }
}

// Each preset has a different props generic; normalize so a dynamic choice fits
// the Transition's `presentation` prop.
type AnyPresentation = TransitionPresentation<Record<string, unknown>>;

function presentationFor(kind: TransitionKind, dims: { width: number; height: number }): AnyPresentation {
  switch (kind) {
    case "slide":
      return slide() as unknown as AnyPresentation;
    case "wipe":
      return wipe() as unknown as AnyPresentation;
    case "clockWipe":
      return clockWipe({ width: dims.width, height: dims.height }) as unknown as AnyPresentation;
    case "flip":
      return flip() as unknown as AnyPresentation;
    case "fade":
    case "none":
    default:
      return fade() as unknown as AnyPresentation;
  }
}

/**
 * The montage. Scenes flow through <TransitionSeries> (never a hard cut unless a
 * scene explicitly asks for "none"); captions and audio run on the absolute
 * timeline above them. All motion lives inside the scenes, frame-driven + eased.
 */
export function DemoVideo({ brand, format, scenes, voiceoverSrc, musicSrc, musicDuckingDb, captions }: VideoProps) {
  const dims = FORMAT_DIMS[format];

  return (
    <AbsoluteFill style={{ background: brand.bg }}>
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const last = i === scenes.length - 1;
          const withTransition = !last && scene.transitionToNext !== "none";
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={scene.durationInFrames}>
                <SceneRouter scene={scene} brand={brand} format={format} />
              </TransitionSeries.Sequence>
              {withTransition ? (
                <TransitionSeries.Transition
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                  presentation={presentationFor(scene.transitionToNext, dims)}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      <RollingCaptions captions={captions} brand={brand} safe={dims.safe} />
      <Soundtrack voiceoverSrc={voiceoverSrc} musicSrc={musicSrc} duckDb={musicDuckingDb} />
    </AbsoluteFill>
  );
}
