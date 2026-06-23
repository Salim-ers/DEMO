import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";

export type CalloutIcon = "check" | "bolt" | "eye" | "layers" | "clock" | "shield" | "dot";

const ICONS: Record<CalloutIcon, React.ReactNode> = {
  check: <path d="M20 6 9 17l-5-5" />,
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  shield: <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />,
  dot: <circle cx="12" cy="12" r="4" />,
};

/**
 * Premium feature callout: a pulsing target ring pinned to (x,y) on the product,
 * with a glass chip + icon + short label springing in just above it. Text should
 * be ≤ 6 words. Placement flips below the ring when the anchor is near the top.
 */
export const FeatureCallout: React.FC<{
  text: string;
  x: number;
  y: number;
  theme: Theme;
  scale?: number;
  delay?: number;
  icon?: CalloutIcon;
  placement?: "top" | "bottom" | "auto";
}> = ({ text, x, y, theme, scale = 1, delay = 0, icon = "dot", placement = "auto" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const enter = spring({ frame: local, fps, config: { damping: 180, mass: 0.7 }, durationInFrames: Math.round(fps * 0.55) });
  const opacity = interpolate(local, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pop = interpolate(enter, [0, 1], [0.8, 1]);
  const lift = interpolate(enter, [0, 1], [12 * scale, 0]);

  // Pulsing ring
  const pulse = (Math.sin(local / fps * 4) + 1) / 2; // 0..1
  const ringScale = 1 + pulse * 0.5;
  const ringOpacity = (1 - pulse) * 0.6;

  const below = placement === "bottom" || (placement === "auto" && y < 0.18);
  const chipOffset = (46 * scale) + lift;

  return (
    <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, opacity }}>
      {/* Target ring */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: "translate(-50%, -50%)" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 26 * scale,
            height: 26 * scale,
            marginLeft: -13 * scale,
            marginTop: -13 * scale,
            borderRadius: "50%",
            border: `2px solid ${theme.accent}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity,
          }}
        />
        <div
          style={{
            width: 12 * scale,
            height: 12 * scale,
            marginLeft: -6 * scale,
            marginTop: -6 * scale,
            borderRadius: "50%",
            background: theme.accent,
            boxShadow: `0 0 14px ${theme.accent}`,
          }}
        />
      </div>

      {/* Chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: below ? chipOffset : -chipOffset,
          transform: `translate(-50%, ${below ? "0" : "-100%"}) scale(${pop})`,
          transformOrigin: below ? "top center" : "bottom center",
          display: "flex",
          alignItems: "center",
          gap: 10 * scale,
          padding: `${10 * scale}px ${16 * scale}px`,
          borderRadius: 14 * scale,
          background: theme.panel,
          border: `1px solid ${theme.panelBorder}`,
          backdropFilter: "blur(12px)",
          boxShadow: `0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px ${theme.accentSoft}`,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26 * scale,
            height: 26 * scale,
            borderRadius: 8 * scale,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
            flexShrink: 0,
          }}
        >
          <svg width={15 * scale} height={15 * scale} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[icon]}
          </svg>
        </span>
        <span style={{ color: theme.text, fontFamily: theme.fontFamily, fontSize: 22 * scale, fontWeight: 560, letterSpacing: -0.2 }}>{text}</span>
      </div>
    </div>
  );
};
