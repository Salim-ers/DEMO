import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";

/**
 * A workflow / "everything connected" beat: a row of glass nodes that light up
 * one after another, joined by connectors that draw between them. Communicates
 * centralisation (care → planning → documents → finances) without a screenshot.
 */
export const WorkflowMap: React.FC<{
  nodes: string[];
  heading?: string;
  kicker?: string;
  theme: Theme;
  scale: number;
}> = ({ nodes, heading, kicker, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = nodes.slice(0, 5);
  const stepFrames = Math.round(fps * 0.45);
  const headOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PremiumStage theme={theme} intensity={1.1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 56 * scale, padding: "0 6%" }}>
        {(kicker || heading) ? (
          <div style={{ opacity: headOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * scale }}>
            {kicker ? <span style={{ color: theme.accent, fontFamily: theme.fontMono, fontSize: 19 * scale, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</span> : null}
            {heading ? <div style={{ color: theme.text, fontFamily: theme.fontDisplay, fontSize: 50 * scale, fontWeight: 640, letterSpacing: -1.2 * scale, textAlign: "center", maxWidth: 1300 * scale }}>{heading}</div> : null}
          </div>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
          {items.map((label, i) => {
            const appear = i * stepFrames;
            const enter = spring({ frame: frame - appear, fps, config: { damping: 180, mass: 0.7 }, durationInFrames: Math.round(fps * 0.5) });
            const nodeOpacity = interpolate(frame - appear, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const nodeScale = interpolate(enter, [0, 1], [0.8, 1]);
            const connFill = i === 0 ? 0 : interpolate(frame - (appear - stepFrames * 0.5), [0, stepFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <React.Fragment key={i}>
                {i > 0 ? (
                  <div style={{ position: "relative", width: 70 * scale, height: 3 * scale, background: theme.border, borderRadius: 2, overflow: "hidden", margin: `0 ${6 * scale}px` }}>
                    <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `scaleX(${connFill})`, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`, boxShadow: `0 0 12px ${theme.accentGlow}` }} />
                  </div>
                ) : null}
                <div
                  style={{
                    opacity: nodeOpacity,
                    transform: `scale(${nodeScale})`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12 * scale,
                    padding: `${16 * scale}px ${24 * scale}px`,
                    borderRadius: 16 * scale,
                    background: theme.panel,
                    border: `1px solid ${theme.panelBorder}`,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 18px 44px rgba(0,0,0,0.45), 0 0 0 1px ${theme.accentSoft}`,
                  }}
                >
                  <span style={{ width: 12 * scale, height: 12 * scale, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`, boxShadow: `0 0 12px ${theme.accentGlow}` }} />
                  <span style={{ color: theme.text, fontFamily: theme.fontFamily, fontSize: 26 * scale, fontWeight: 540, letterSpacing: -0.3, whiteSpace: "nowrap" }}>{label}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
