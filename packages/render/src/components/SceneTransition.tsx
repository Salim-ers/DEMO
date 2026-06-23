import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Cinematic per-scene wrapper. Each scene eases in (fade + slight zoom-through +
 * defocus clearing) and eases out (fade + soft blur), with a single subtle light
 * sweep across the first beat. Replaces the old hard cross-dissolve so cuts feel
 * fluid and intentional, never kitschy.
 */
export const SceneTransition: React.FC<{
  durationInFrames: number;
  theme: Theme;
  /** First scene skips the entrance zoom for a calm open. */
  first?: boolean;
  children: React.ReactNode;
}> = ({ durationInFrames, theme, first = false, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inN = Math.min(Math.round(fps * 0.5), Math.floor(durationInFrames / 2));
  const outN = Math.min(Math.round(fps * 0.45), Math.floor(durationInFrames / 2));

  const opacity = interpolate(
    frame,
    [0, inN, durationInFrames - outN, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const enterScale = first ? 1 : interpolate(frame, [0, inN], [1.035, 1], { extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [durationInFrames - outN, durationInFrames], [1, 0.992], { extrapolateLeft: "clamp" });
  const scale = enterScale * exitScale;

  const enterBlur = first ? 0 : interpolate(frame, [0, inN], [9, 0], { extrapolateRight: "clamp" });
  const exitBlur = interpolate(frame, [durationInFrames - outN, durationInFrames], [0, 7], { extrapolateLeft: "clamp" });
  const blur = enterBlur + exitBlur;

  // Subtle diagonal light sweep over the opening beat.
  const sweep = interpolate(frame, [inN * 0.4, inN + Math.round(fps * 0.5)], [-40, 140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweepOpacity = interpolate(frame, [inN * 0.4, inN, inN + Math.round(fps * 0.5)], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, filter: blur > 0.05 ? `blur(${blur}px)` : undefined }}>
      {children}
      {!first ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, transparent ${sweep - 18}%, ${theme.accentSoft} ${sweep}%, transparent ${sweep + 18}%)`,
            opacity: sweepOpacity,
            mixBlendMode: "screen",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
