import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";
import { MetricCard } from "./MetricCard.js";
import type { CalloutIcon } from "./FeatureCallout.js";

export interface BenefitItem {
  label: string;
  value?: number | string;
  prefix?: string;
  suffix?: string;
  icon?: CalloutIcon | "spark";
}

const DEFAULT_ICONS: Array<CalloutIcon | "spark"> = ["check", "eye", "spark", "bolt", "shield"];

/**
 * The benefit / outcome beat: a kicker + heading and a row of up to four
 * premium metric cards that spring in one after another. Used for the closing
 * "fewer spreadsheets · more clarity · more professional" grid.
 */
export const BenefitGrid: React.FC<{
  items: BenefitItem[];
  heading?: string;
  kicker?: string;
  theme: Theme;
  scale: number;
}> = ({ items, heading, kicker, theme, scale }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const headY = interpolate(frame, [0, 14], [18 * scale, 0], { extrapolateRight: "clamp" });
  const cards = items.slice(0, 4);
  const cardW = cards.length >= 3 ? 360 : 420;

  return (
    <AbsoluteFill>
      <PremiumStage theme={theme} intensity={1.1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 48 * scale, padding: "0 6%" }}>
        {(kicker || heading) ? (
          <div style={{ opacity: headOpacity, transform: `translateY(${headY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * scale }}>
            {kicker ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 * scale }}>
                <span style={{ width: 30 * scale, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`, boxShadow: `0 0 14px ${theme.accentGlow}` }} />
                <span style={{ color: theme.accent, fontFamily: theme.fontMono, fontSize: 19 * scale, letterSpacing: 2, textTransform: "uppercase" }}>{kicker}</span>
              </div>
            ) : null}
            {heading ? (
              <div style={{ color: theme.text, fontFamily: theme.fontDisplay, fontSize: 50 * scale, fontWeight: 640, letterSpacing: -1.2 * scale, textAlign: "center", maxWidth: 1300 * scale }}>{heading}</div>
            ) : null}
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 28 * scale, justifyContent: "center", flexWrap: "wrap" }}>
          {cards.map((it, i) => (
            <MetricCard
              key={i}
              label={it.label}
              value={it.value ?? ""}
              prefix={it.prefix}
              suffix={it.suffix}
              icon={it.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
              theme={theme}
              scale={scale}
              width={cardW}
              delay={Math.round(fps * (0.35 + i * 0.22))}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
