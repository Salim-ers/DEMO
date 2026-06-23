import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * Premium kinetic headline: words rise + fade in, one after another, with an
 * optional accent gradient on chosen keywords. Elegant, never cartoonish —
 * tight tracking, display type, subtle per-word spring.
 */
export const KineticTitle: React.FC<{
  text: string;
  theme: Theme;
  scale?: number;
  fontSize?: number;
  /** Lowercased words (or substrings) to paint with the accent gradient. */
  accentWords?: string[];
  /** Frames between each word's entrance. */
  stagger?: number;
  startAt?: number;
  align?: "left" | "center";
}> = ({ text, theme, scale = 1, fontSize = 84, accentWords = [], stagger, startAt = 0, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = stagger ?? Math.round(fps * 0.11);
  const words = text.split(/\s+/).filter(Boolean);
  const accentSet = accentWords.map((w) => w.toLowerCase());

  const isAccent = (w: string) => {
    const clean = w.toLowerCase().replace(/[.,;:!?'"()]/g, "");
    return accentSet.some((a) => clean === a || clean.includes(a) || a.includes(clean));
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: `${0.16 * fontSize * scale}px ${0.28 * fontSize * scale}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: "baseline",
        maxWidth: 1500 * scale,
      }}
    >
      {words.map((w, i) => {
        const local = frame - startAt - i * step;
        const enter = spring({ frame: local, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: Math.round(fps * 0.6) });
        const y = interpolate(enter, [0, 1], [0.5 * fontSize * scale, 0]);
        const opacity = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const blur = interpolate(enter, [0, 1], [8, 0]);
        const accent = isAccent(w);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${y}px)`,
              opacity,
              filter: `blur(${blur}px)`,
              fontFamily: theme.fontDisplay,
              fontSize: fontSize * scale,
              fontWeight: 680,
              lineHeight: 1.04,
              letterSpacing: -0.022 * fontSize * scale,
              color: accent ? "transparent" : theme.text,
              backgroundImage: accent ? `linear-gradient(110deg, ${theme.accent}, ${theme.accent2})` : undefined,
              WebkitBackgroundClip: accent ? "text" : undefined,
              backgroundClip: accent ? "text" : undefined,
              textShadow: accent ? `0 0 38px ${theme.accentGlow}` : "0 2px 18px rgba(0,0,0,0.35)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
