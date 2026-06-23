import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/** Tileable fractal-noise grain (renders deterministically in headless Chromium). */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * The universal premium backdrop for every scene: deep gradient base, two slow
 * drifting colour glows, a barely-there grid, a soft vignette and fine film
 * grain. This is what gives the video depth and "designed" feel instead of a
 * flat panel. `halo` adds a strong colour bloom centred behind a product frame.
 */
export const PremiumStage: React.FC<{
  theme: Theme;
  intensity?: number;
  halo?: boolean;
  children?: React.ReactNode;
}> = ({ theme, intensity = 1, halo = false, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slow, organic drift so the glows feel alive without ever reading as motion.
  const t = frame / fps;
  const driftX = Math.sin(t * 0.18) * 4;
  const driftY = Math.cos(t * 0.14) * 3;
  const driftX2 = Math.cos(t * 0.12) * 5;
  const breathe = 1 + Math.sin(t * 0.22) * 0.04;

  // A gentle global brighten over the scene's life for a cinematic settle.
  const settle = interpolate(frame, [0, Math.min(durationInFrames, fps * 1.2)], [0.86, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Deep base gradient for vertical depth. */}
      <AbsoluteFill
        style={{ background: `linear-gradient(160deg, ${theme.bgGrad[0]} 0%, ${theme.bgGrad[1]} 100%)` }}
      />

      {/* Primary colour glow, top-centre, slowly breathing. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(${72 * breathe}% ${58 * breathe}% at ${50 + driftX}% ${-12 + driftY}%, ${theme.glow} 0%, rgba(0,0,0,0) 62%)`,
          opacity: intensity * settle,
        }}
      />
      {/* Secondary, cooler glow low-left for colour balance. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(64% 60% at ${10 + driftX2}% 112%, ${theme.glow2} 0%, rgba(0,0,0,0) 58%)`,
          opacity: 0.85 * intensity * settle,
        }}
      />

      {/* Optional strong bloom directly behind a product frame. */}
      {halo ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(46% 42% at 50% 48%, ${theme.accentGlow} 0%, rgba(0,0,0,0) 60%)`,
            opacity: 0.7 * intensity * settle,
          }}
        />
      ) : null}

      {/* Barely-there grid for technical texture. */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: theme.gridOpacity,
          maskImage: "radial-gradient(80% 80% at 50% 40%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 40%, black 0%, transparent 75%)",
        }}
      />

      {/* Fine film grain. */}
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN_URI,
          backgroundRepeat: "repeat",
          opacity: theme.grain,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Soft vignette to focus the centre. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {children}
    </AbsoluteFill>
  );
};
