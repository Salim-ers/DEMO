import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";
import { KineticTitle } from "./KineticTitle.js";

/**
 * The promise beat: one strong, centred statement delivered as a kinetic
 * headline over the premium stage. Used right after the problem to land the
 * product's core value before showing the UI.
 */
export const PromiseCard: React.FC<{
  heading: string;
  kicker?: string;
  accentWords?: string[];
  theme: Theme;
  scale: number;
}> = ({ heading, kicker, accentWords = [], theme, scale }) => {
  const frame = useCurrentFrame();
  const kickerOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PremiumStage theme={theme} intensity={1.15} halo />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 * scale, padding: "0 9%" }}>
        {kicker ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 * scale, opacity: kickerOpacity }}>
            <span style={{ width: 30 * scale, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`, boxShadow: `0 0 14px ${theme.accentGlow}` }} />
            <span style={{ color: theme.accent, fontFamily: theme.fontMono, fontSize: 20 * scale, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</span>
          </div>
        ) : null}
        <KineticTitle text={heading} theme={theme} scale={scale} fontSize={74} accentWords={accentWords} align="center" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
