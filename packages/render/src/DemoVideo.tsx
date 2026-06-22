import React from "react";
import { AbsoluteFill, Audio, Series } from "remotion";
import type { RenderProps } from "@demoforge/shared";
import { makeTheme, fitScale } from "./theme.js";
import { SceneRenderer } from "./components/SceneRenderer.js";
import { Captions } from "./components/Captions.js";

/**
 * The single, parameter-driven composition. All three aspect ratios reuse it;
 * only width/height/format differ. Scenes are laid out back-to-back via <Series>
 * so each scene owns a contiguous frame span that matches the voiceover timing.
 */
export const DemoVideo: React.FC<RenderProps> = (props) => {
  const { productName, mainPromise, width, height, audioUrl, accentColor, scenes } = props;
  const theme = makeTheme(accentColor);
  const scale = fitScale(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {audioUrl ? <Audio src={audioUrl} /> : null}

      <Series>
        {scenes.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneRenderer
              scene={scene}
              productName={productName}
              mainPromise={mainPromise}
              theme={theme}
              width={width}
              height={height}
              scale={scale}
            />
            {scene.type !== "title_card" && scene.type !== "outro" ? (
              <Captions text={scene.captionText} theme={theme} width={width} scale={scale} />
            ) : null}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

/** Total composition length = sum of scene durations (used by calculateMetadata). */
export function totalDurationInFrames(scenes: RenderProps["scenes"]): number {
  return Math.max(1, scenes.reduce((sum, s) => sum + s.durationInFrames, 0));
}
