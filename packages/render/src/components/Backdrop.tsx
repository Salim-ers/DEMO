import React from "react";
import { AbsoluteFill } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Static premium backdrop: deep canvas with a soft radial accent glow and a
 * faint grid. Deliberately subtle — it should never compete with the product UI.
 */
export const Backdrop: React.FC<{ theme: Theme; intensity?: number }> = ({
  theme,
  intensity = 1,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% -10%, ${theme.accentSoft} 0%, rgba(0,0,0,0) 55%)`,
          opacity: intensity,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(120% 120% at 50% 0%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(120% 120% at 50% 0%, black 30%, transparent 80%)",
          opacity: 0.5 * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
