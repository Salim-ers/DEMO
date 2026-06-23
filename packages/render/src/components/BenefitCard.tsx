import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { Backdrop } from "./Backdrop.js";

/**
 * Statement card used for problem / benefit / ROI beats. Large readable claim,
 * optional supporting line. Sober motion only.
 */
export const BenefitCard: React.FC<{
  heading: string;
  sub?: string;
  kicker?: string;
  theme: Theme;
  scale: number;
}> = ({ heading, sub, kicker, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: Math.round(fps * 0.6) });
  const y = interpolate(rise, [0, 1], [22, 0]);
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop theme={theme} />
      <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", flexDirection: "column", padding: "0 12%", gap: 22 * scale, opacity, transform: `translateY(${y}px)` }}>
        {kicker ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 * scale }}>
            <span style={{ width: 34 * scale, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`, boxShadow: `0 0 14px ${theme.accentGlow}` }} />
            <span style={{ color: theme.accent, fontFamily: theme.fontMono, fontSize: 20 * scale, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</span>
          </div>
        ) : null}
        <div style={{ maxWidth: 1300 * scale, color: theme.text, fontFamily: theme.fontDisplay, fontSize: 64 * scale, fontWeight: 640, lineHeight: 1.12, letterSpacing: -1.6 * scale }}>{heading}</div>
        {sub ? <div style={{ maxWidth: 1100 * scale, color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 30 * scale, fontWeight: 440, lineHeight: 1.4 }}>{sub}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
