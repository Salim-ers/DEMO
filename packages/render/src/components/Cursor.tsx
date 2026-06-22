import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Clean simulated cursor. Eases from an entry point toward a target anchor
 * (0..1 of the frame) and performs a single, subtle click pulse. No gimmicks.
 */
export const Cursor: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  width: number;
  height: number;
  clickAtFrame?: number;
  scale?: number;
}> = ({ from, to, width, height, clickAtFrame, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const travel = spring({ frame, fps, config: { damping: 26, mass: 0.7 }, durationInFrames: Math.round(fps * 0.9) });
  const x = interpolate(travel, [0, 1], [from.x * width, to.x * width]);
  const y = interpolate(travel, [0, 1], [from.y * height, to.y * height]);

  let clickScale = 1;
  let ringOpacity = 0;
  let ringScale = 0.4;
  if (clickAtFrame != null && frame >= clickAtFrame) {
    const t = (frame - clickAtFrame) / (fps * 0.45);
    clickScale = 1 - 0.18 * Math.max(0, Math.sin(Math.min(t, 1) * Math.PI));
    ringOpacity = interpolate(t, [0, 1], [0.5, 0], { extrapolateRight: "clamp" });
    ringScale = interpolate(t, [0, 1], [0.4, 1.8], { extrapolateRight: "clamp" });
  }

  const s = 26 * scale;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-4%, -4%)", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: -s * 0.6,
          top: -s * 0.6,
          width: s * 2.2,
          height: s * 2.2,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.7)",
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
        }}
      />
      <svg width={s} height={s} viewBox="0 0 24 24" style={{ transform: `scale(${clickScale})`, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))" }}>
        <path d="M4 2 L4 19 L9 14 L12.5 21 L15.5 19.5 L12 13 L19 13 Z" fill="white" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
