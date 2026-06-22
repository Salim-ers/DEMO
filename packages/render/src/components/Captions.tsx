import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Elegant lower-third subtitle. One or two lines, high legibility, gentle fade.
 * Synced implicitly: each scene renders its own caption for its frame span.
 */
export const Captions: React.FC<{
  text: string;
  theme: Theme;
  width: number;
  scale?: number;
}> = ({ text, theme, width, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (!text) return null;

  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: `${7}%`,
        display: "flex",
        justifyContent: "center",
        opacity,
        padding: "0 8%",
      }}
    >
      <div
        style={{
          maxWidth: width * 0.74,
          textAlign: "center",
          color: theme.text,
          fontFamily: theme.fontFamily,
          fontSize: 30 * scale,
          lineHeight: 1.3,
          fontWeight: 500,
          letterSpacing: -0.2,
          padding: `${12 * scale}px ${22 * scale}px`,
          borderRadius: 14 * scale,
          background: "rgba(8,9,12,0.72)",
          border: `1px solid ${theme.border}`,
          backdropFilter: "blur(10px)",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
