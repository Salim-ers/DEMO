import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { Backdrop } from "./Backdrop.js";

/** Closing CTA card. Calm, confident, no flashing. */
export const Outro: React.FC<{
  productName: string;
  cta: string;
  theme: Theme;
  scale: number;
}> = ({ productName, cta, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: Math.round(fps * 0.7) });
  const y = interpolate(rise, [0, 1], [20, 0]);
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const btnOpacity = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop theme={theme} intensity={1.3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 * scale, opacity, transform: `translateY(${y}px)` }}>
        <span style={{ color: theme.text, fontFamily: theme.fontFamily, fontSize: 70 * scale, fontWeight: 660, letterSpacing: -1.6 * scale }}>{productName}</span>
        <span style={{ color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 32 * scale, fontWeight: 460, textAlign: "center", maxWidth: 1000 * scale }}>{cta}</span>
        <div style={{ opacity: btnOpacity, marginTop: 8 * scale, padding: `${16 * scale}px ${34 * scale}px`, borderRadius: 12 * scale, background: theme.accent, color: "white", fontFamily: theme.fontFamily, fontSize: 26 * scale, fontWeight: 600, boxShadow: `0 16px 50px ${theme.accentSoft}` }}>
          Book a demo
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
