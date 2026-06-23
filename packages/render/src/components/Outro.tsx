import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { Backdrop } from "./Backdrop.js";
import { BrandLockup } from "./BrandLockup.js";

/** Closing CTA card. Calm, confident, no flashing. */
export const Outro: React.FC<{
  productName: string;
  cta: string;
  logoUrl?: string | null;
  host?: string;
  theme: Theme;
  scale: number;
}> = ({ productName, cta, logoUrl, host, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: Math.round(fps * 0.7) });
  const y = interpolate(rise, [0, 1], [20, 0]);
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const btnOpacity = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop theme={theme} intensity={1.3} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 * scale, opacity, transform: `translateY(${y}px)` }}>
        {logoUrl ? (
          <BrandLockup url={logoUrl} scale={scale} height={140} />
        ) : (
          <span style={{ color: theme.text, fontFamily: theme.fontDisplay, fontSize: 70 * scale, fontWeight: 680, letterSpacing: -1.6 * scale }}>{productName}</span>
        )}
        <span style={{ color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 32 * scale, fontWeight: 460, textAlign: "center", maxWidth: 1000 * scale, lineHeight: 1.35 }}>{cta}</span>
        <div style={{ opacity: btnOpacity, marginTop: 10 * scale, padding: `${17 * scale}px ${38 * scale}px`, borderRadius: 14 * scale, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, color: "white", fontFamily: theme.fontFamily, fontSize: 26 * scale, fontWeight: 620, letterSpacing: 0.2, boxShadow: `0 18px 56px ${theme.accentGlow}, 0 0 0 1px ${theme.accentSoft}, 0 2px 0 rgba(255,255,255,0.18) inset` }}>
          {host ? host : "Demander une démo"}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
