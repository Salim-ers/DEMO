import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

/**
 * A premium simulated cursor: small, sleek pointer with a soft shadow that
 * eases naturally from an entry point to a target (0..1 of the frame) and emits
 * a discreet accent ripple on click. No oversized "cheap" cursor, no bounce.
 */
export const AnimatedCursor: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  width: number;
  height: number;
  theme: Theme;
  clickAtFrame?: number;
  scale?: number;
  startAt?: number;
}> = ({ from, to, width, height, theme, clickAtFrame, scale = 1, startAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startAt;

  const travel = spring({ frame: local, fps, config: { damping: 30, mass: 0.9, stiffness: 90 }, durationInFrames: Math.round(fps * 1.0) });
  const x = interpolate(travel, [0, 1], [from.x * width, to.x * width]);
  const y = interpolate(travel, [0, 1], [from.y * height, to.y * height]);
  const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let press = 1;
  let ripple = 0;
  let rippleOpacity = 0;
  if (clickAtFrame != null && frame >= clickAtFrame) {
    const t = (frame - clickAtFrame) / (fps * 0.5);
    press = 1 - 0.16 * Math.max(0, Math.sin(Math.min(t, 1) * Math.PI));
    ripple = interpolate(t, [0, 1], [0.3, 2.1], { extrapolateRight: "clamp" });
    rippleOpacity = interpolate(t, [0, 1], [0.45, 0], { extrapolateRight: "clamp" });
  }

  const s = 22 * scale;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      {/* Click ripple — accent tinted, subtle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: s * 2.6,
          height: s * 2.6,
          marginLeft: -s * 1.3 + s * 0.18,
          marginTop: -s * 1.3 + s * 0.18,
          borderRadius: "50%",
          border: `2px solid ${theme.accent}`,
          transform: `scale(${ripple})`,
          opacity: rippleOpacity,
        }}
      />
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        style={{ transform: `scale(${press})`, transformOrigin: "top left", filter: "drop-shadow(0 3px 7px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M5 3 L5 18 L9 14.3 L11.7 20.4 L14.2 19.3 L11.5 13.4 L17 13 Z"
          fill="white"
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
