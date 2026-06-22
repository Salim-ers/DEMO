import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { Backdrop } from "./Backdrop.js";

/** Sober connective beat between sections — a soft label wipe, nothing flashy. */
export const Transition: React.FC<{ label: string; theme: Theme; scale: number }> = ({ label, theme, scale }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mid = durationInFrames / 2;
  const opacity = interpolate(frame, [0, mid * 0.6, mid * 1.4, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(frame, [0, durationInFrames], [-2, 2]);

  return (
    <AbsoluteFill>
      <Backdrop theme={theme} intensity={0.7} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
        <span style={{ color: theme.textMuted, fontFamily: theme.fontMono, fontSize: 26 * scale, letterSpacing: 4, textTransform: "uppercase", transform: `translateX(${x}%)` }}>{label}</span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
