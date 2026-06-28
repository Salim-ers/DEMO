import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Brand, Format, Scene } from "../schema.js";
import { FORMAT_DIMS, FONT_FAMILY, enter } from "../lib/theme.js";
import { AnimatedNumber } from "../components.js";

type S = Extract<Scene, { type: "stats" }>;

/** Proof: the numbers. Count-up, staggered, on a calm near-black stage. */
export function StatsScene({ scene, brand, format }: { scene: S; brand: Brand; format: Format }) {
  const frame = useCurrentFrame();
  const { safe } = FORMAT_DIMS[format];
  const wide = format === "16:9";
  const fontFamily = brand.fontFamily ? `${brand.fontFamily}, ${FONT_FAMILY}` : FONT_FAMILY;
  const title = enter(frame, 2, 18);

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily }}>
      <AbsoluteFill style={{ background: `radial-gradient(75% 60% at 50% 50%, ${brand.primary}1a, transparent 72%)` }} />
      <AbsoluteFill style={{ padding: safe, alignItems: "center", justifyContent: "center", gap: 56 }}>
        {scene.title ? (
          <h2 style={{ margin: 0, opacity: title.opacity, transform: `translateY(${title.y}px)`, fontSize: wide ? 48 : 40, fontWeight: 700, color: `${brand.text}d0`, textAlign: "center", maxWidth: "80%" }}>
            {scene.title}
          </h2>
        ) : null}

        <div
          style={{
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: wide ? 64 : 36,
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {scene.stats.map((s, i) => {
            const reveal = enter(frame, 14 + i * 6, 18);
            return (
              <div key={i} style={{ textAlign: "center", opacity: reveal.opacity, transform: `translateY(${reveal.y}px)` }}>
                <div style={{ fontSize: wide ? 132 : 104, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: brand.primary }}>
                  <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} delay={14 + i * 6} />
                </div>
                <div style={{ marginTop: 16, fontSize: wide ? 26 : 24, color: `${brand.text}a8`, fontWeight: 500 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
