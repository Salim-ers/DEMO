import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Premium subtitles: a single, width-limited line low in the frame on a soft
 * translucent black slab with a hairline accent edge. Rises and fades in gently,
 * fades out at the tail. Designed to read as broadcast captioning, not a sticker.
 */
export const SubtitlesPremium: React.FC<{
  text: string;
  theme: Theme;
  width: number;
  scale?: number;
}> = ({ text, theme, width, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!text) return null;

  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: Math.round(fps * 0.5) });
  const y = interpolate(enter, [0, 1], [14 * scale, 0]);
  const fadeIn = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 9, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "6.5%",
        display: "flex",
        justifyContent: "center",
        padding: "0 9%",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: width * 0.66,
          textAlign: "center",
          color: theme.text,
          fontFamily: theme.fontFamily,
          fontSize: 31 * scale,
          lineHeight: 1.32,
          fontWeight: 500,
          letterSpacing: -0.2,
          padding: `${13 * scale}px ${26 * scale}px`,
          borderRadius: 16 * scale,
          background: "rgba(6,7,11,0.66)",
          border: `1px solid ${theme.border}`,
          backdropFilter: "blur(14px)",
          boxShadow: `0 18px 50px rgba(0,0,0,0.4)`,
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        {/* Hairline accent on the leading edge for a designed touch. */}
        <span
          style={{
            position: "absolute",
            left: 14 * scale,
            top: "26%",
            bottom: "26%",
            width: 3 * scale,
            borderRadius: 2,
            background: `linear-gradient(${theme.accent}, ${theme.accent2})`,
            boxShadow: `0 0 12px ${theme.accentGlow}`,
          }}
        />
        {text}
      </div>
    </div>
  );
};
