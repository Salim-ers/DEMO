import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import type { CalloutIcon } from "./FeatureCallout.js";

const ICONS: Record<string, React.ReactNode> = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  spark: <path d="M12 2v6m0 8v6m10-10h-6M8 12H2m15-7-4 4m-6 6-4 4m14 0-4-4m-6-6L3 5" />,
};

/**
 * A premium metric / benefit card: glass panel, gradient icon, an animated
 * count-up value (when numeric) and a short label. Springs in on `delay`. Use
 * three side-by-side for the "benefit grid" beat (time saved, fewer errors,
 * clear vision).
 */
export const MetricCard: React.FC<{
  label: string;
  /** Numeric target to count up to, or a ready-made string (e.g. "−40%"). */
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon?: CalloutIcon | "spark";
  theme: Theme;
  scale?: number;
  delay?: number;
  width?: number;
}> = ({ label, value, prefix = "", suffix = "", icon = "spark", theme, scale = 1, delay = 0, width = 360 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const enter = spring({ frame: local, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: Math.round(fps * 0.7) });
  const y = interpolate(enter, [0, 1], [34 * scale, 0]);
  const opacity = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const countT = interpolate(local, [Math.round(fps * 0.2), Math.round(fps * 1.3)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hasValue = value !== "" && value != null;
  const display =
    typeof value === "number" ? `${prefix}${Math.round(value * easeOut(countT))}${suffix}` : `${prefix}${value}${suffix}`;

  const glyph = ICONS[icon] ?? ICONS.spark;

  return (
    <div
      style={{
        width: width * scale,
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 18 * scale,
        padding: `${28 * scale}px ${28 * scale}px`,
        borderRadius: 22 * scale,
        background: theme.panel,
        border: `1px solid ${theme.panelBorder}`,
        backdropFilter: "blur(14px)",
        boxShadow: `0 30px 70px rgba(0,0,0,0.45), 0 0 0 1px ${theme.accentSoft}, 0 2px 0 rgba(255,255,255,0.05) inset`,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52 * scale,
          height: 52 * scale,
          borderRadius: 14 * scale,
          background: `linear-gradient(140deg, ${theme.accent}, ${theme.accent2})`,
          boxShadow: `0 12px 30px ${theme.accentGlow}`,
        }}
      >
        <svg width={26 * scale} height={26 * scale} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {glyph}
        </svg>
      </span>
      {hasValue ? (
        <>
          <div
            style={{
              color: theme.text,
              fontFamily: theme.fontDisplay,
              fontSize: 58 * scale,
              fontWeight: 700,
              letterSpacing: -1.4 * scale,
              lineHeight: 1,
            }}
          >
            {display}
          </div>
          <div style={{ color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 24 * scale, fontWeight: 460, lineHeight: 1.3 }}>
            {label}
          </div>
        </>
      ) : (
        // Qualitative benefit (no number): the label becomes the prominent text.
        <div style={{ color: theme.text, fontFamily: theme.fontDisplay, fontSize: 34 * scale, fontWeight: 620, lineHeight: 1.18, letterSpacing: -0.6 * scale }}>
          {label}
        </div>
      )}
    </div>
  );
};

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
