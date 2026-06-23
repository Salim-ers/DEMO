import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { Backdrop } from "./Backdrop.js";
import { BrandLockup } from "./BrandLockup.js";

/** Short, restrained product intro: wordmark + one-line promise. */
export const TitleCard: React.FC<{
  productName: string;
  promise: string;
  logoUrl?: string | null;
  theme: Theme;
  scale: number;
}> = ({ productName, promise, logoUrl, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: Math.round(fps * 0.7) });
  const heroY = interpolate(rise, [0, 1], [22, 0]);
  const heroScale = interpolate(rise, [0, 1], [0.965, 1]);
  const titleOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [12, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [14, 36], [0, 64 * scale], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop theme={theme} intensity={1.2} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 * scale, padding: "0 8%" }}>
        <div style={{ opacity: titleOpacity, transform: `translateY(${heroY}px) scale(${heroScale})` }}>
          {logoUrl ? (
            <BrandLockup url={logoUrl} scale={scale} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 20 * scale }}>
              <Logo theme={theme} scale={scale} />
              <span style={{ color: theme.text, fontFamily: theme.fontFamily, fontSize: 84 * scale, fontWeight: 680, letterSpacing: -2 * scale }}>{productName}</span>
            </div>
          )}
        </div>
        <div style={{ width: lineW, height: 3, borderRadius: 2, background: theme.accent, boxShadow: `0 0 18px ${theme.accent}` }} />
        <div style={{ maxWidth: 1100 * scale, textAlign: "center", color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 34 * scale, fontWeight: 460, lineHeight: 1.35, opacity: subOpacity, letterSpacing: -0.4 }}>
          {promise}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ theme: Theme; scale: number }> = ({ theme, scale }) => (
  <div style={{ width: 76 * scale, height: 76 * scale, borderRadius: 18 * scale, background: `linear-gradient(140deg, ${theme.accent}, ${theme.accentSoft})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 40px ${theme.accentSoft}` }}>
    <svg width={40 * scale} height={40 * scale} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 4 20 12 6 20 6 4" fill="white" stroke="white" />
    </svg>
  </div>
);
