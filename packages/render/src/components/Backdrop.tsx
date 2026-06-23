import React from "react";
import { AbsoluteFill } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Premium backdrop: pure black canvas with soft, tasteful color glows — no grid.
 * Deliberately restrained so it reads as "fond noir" while still feeling alive
 * and colorful rather than flat.
 */
export const Backdrop: React.FC<{ theme: Theme; intensity?: number }> = ({
  theme,
  intensity = 1,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Main accent glow, top-center. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 70% at 50% -15%, ${theme.accentGlow} 0%, rgba(0,0,0,0) 60%)`,
          opacity: intensity,
        }}
      />
      {/* A second, cooler glow low-left for subtle depth and color. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 60% at 12% 115%, ${theme.accentSoft} 0%, rgba(0,0,0,0) 55%)`,
          opacity: 0.7 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
