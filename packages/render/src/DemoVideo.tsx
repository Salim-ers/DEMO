import React from "react";
import { AbsoluteFill, Audio, Series } from "remotion";
import { type RenderProps, STATEMENT_SCENE_TYPES } from "@studio-one/shared";
import { makeTheme, fitScale } from "./theme.js";
import type { VideoStyle } from "./styles/videoBrand.js";
import { SceneRenderer } from "./components/SceneRenderer.js";
import { SceneTransition } from "./components/SceneTransition.js";
import { SubtitlesPremium } from "./components/SubtitlesPremium.js";

const STATEMENT_TYPES = new Set<string>(STATEMENT_SCENE_TYPES);

/**
 * The single, parameter-driven composition. All three aspect ratios reuse it;
 * only width/height/format differ. Scenes are laid out back-to-back via <Series>
 * so each scene owns a contiguous frame span that matches the voiceover timing.
 * Art direction is resolved once from the accent + product (Horse Ledger →
 * luxury equestrian) and threaded through every scene as the theme.
 */
export const DemoVideo: React.FC<RenderProps> = (props) => {
  const { productName, mainPromise, width, height, audioUrl, musicUrl, accentColor, logoUrl, siteHost, videoStyle, scenes } = props;
  const theme = makeTheme(accentColor, { productName, siteHost, style: (videoStyle ?? null) as VideoStyle | null });
  const scale = fitScale(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Voice on top; music bed underneath. Ducked well below narration when a
          voice track is present; a touch louder when the video is music-only. */}
      {audioUrl ? <Audio src={audioUrl} /> : null}
      {musicUrl ? <Audio src={musicUrl} volume={audioUrl ? 0.16 : 0.5} loop /> : null}

      <Series>
        {scenes.map((scene, i) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
            <SceneTransition durationInFrames={scene.durationInFrames} theme={theme} first={i === 0}>
              <SceneRenderer
                scene={scene}
                productName={productName}
                mainPromise={mainPromise}
                logoUrl={logoUrl ?? null}
                siteHost={siteHost ?? ""}
                theme={theme}
                width={width}
                height={height}
                scale={scale}
              />
              {/* Only capture-backed scenes burn in a subtitle; statement/motion
                  cards already render their own copy. */}
              {!STATEMENT_TYPES.has(scene.type) ? (
                <SubtitlesPremium text={scene.captionText} theme={theme} width={width} scale={scale} />
              ) : null}
            </SceneTransition>
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
