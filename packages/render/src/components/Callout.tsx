import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Minimalist callout chip anchored at (x,y) in 0..1 space. Springs in, holds,
 * fades on exit. Used to label the part of the UI under discussion.
 */
export const Callout: React.FC<{
  text: string;
  x: number;
  y: number;
  theme: Theme;
  delay?: number;
  scale?: number;
}> = ({ text, x, y, theme, delay = 0, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const local = frame - delay;
  const enter = spring({ frame: local, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: Math.round(fps * 0.5) });
  const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const translateY = interpolate(enter, [0, 1], [10, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 10 * scale,
        padding: `${10 * scale}px ${16 * scale}px`,
        borderRadius: 999,
        background: "rgba(8,9,12,0.82)",
        border: `1px solid ${theme.border}`,
        backdropFilter: "blur(8px)",
        boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 0 4px ${theme.accentSoft}`,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8 * scale, height: 8 * scale, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 12px ${theme.accent}` }} />
      <span style={{ color: theme.text, fontFamily: theme.fontFamily, fontSize: 22 * scale, fontWeight: 560, letterSpacing: -0.2 }}>{text}</span>
    </div>
  );
};
