import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";

/**
 * A single hero metric beat: one large count-up number with a supporting line,
 * centred over the stage. For a punchy "−40 % of admin time" style moment.
 */
export const MetricMoment: React.FC<{
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
  kicker?: string;
  theme: Theme;
  scale: number;
}> = ({ value, label, prefix = "", suffix = "", kicker, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 16], [26 * scale, 0], { extrapolateRight: "clamp" });
  const countT = interpolate(frame, [Math.round(fps * 0.2), Math.round(fps * 1.4)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = 1 - Math.pow(1 - countT, 3);
  const display = typeof value === "number" ? `${prefix}${Math.round(value * ease)}${suffix}` : `${prefix}${value}${suffix}`;

  return (
    <AbsoluteFill>
      <PremiumStage theme={theme} intensity={1.2} halo />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 * scale, opacity, transform: `translateY(${y}px)`, padding: "0 8%" }}>
        {kicker ? (
          <span style={{ color: theme.accent, fontFamily: theme.fontMono, fontSize: 20 * scale, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 6 * scale }}>{kicker}</span>
        ) : null}
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 200 * scale,
            fontWeight: 760,
            lineHeight: 0.95,
            letterSpacing: -6 * scale,
            color: "transparent",
            backgroundImage: `linear-gradient(120deg, ${theme.accent}, ${theme.accent2})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            textShadow: `0 0 60px ${theme.accentGlow}`,
          }}
        >
          {display}
        </div>
        <div style={{ color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 36 * scale, fontWeight: 460, textAlign: "center", maxWidth: 1100 * scale, lineHeight: 1.35 }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
