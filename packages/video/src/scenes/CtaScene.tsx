import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand, Format, Scene } from "../schema.js";
import { FORMAT_DIMS, FONT_FAMILY, POP, enter } from "../lib/theme.js";

type S = Extract<Scene, { type: "cta" }>;

/** CTA: one clear action. Logo, headline, a button that pops in. */
export function CtaScene({ scene, brand, format }: { scene: S; brand: Brand; format: Format }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = FORMAT_DIMS[format];
  const wide = format === "16:9";
  const fontFamily = brand.fontFamily ? `${brand.fontFamily}, ${FONT_FAMILY}` : FONT_FAMILY;

  const logo = enter(frame, 2, 16);
  const head = enter(frame, 10, 18);
  const pop = spring({ frame: frame - 24, fps, config: POP });

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 55% at 50% 45%, ${brand.primary}2e, transparent 70%)` }} />
      <AbsoluteFill style={{ padding: safe, alignItems: "center", justifyContent: "center", gap: 36, textAlign: "center" }}>
        {brand.logoSrc ? (
          <Img src={/^https?:\/\//.test(brand.logoSrc) ? brand.logoSrc : staticFile(brand.logoSrc)} style={{ height: wide ? 72 : 60, opacity: logo.opacity, transform: `translateY(${logo.y}px)` }} />
        ) : (
          <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, fontSize: wide ? 40 : 34, fontWeight: 800, letterSpacing: "-0.02em", color: brand.text }}>
            {brand.name}
          </div>
        )}

        <h2 style={{ margin: 0, opacity: head.opacity, transform: `translateY(${head.y}px)`, fontSize: wide ? 68 : 54, lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.02em", color: brand.text, maxWidth: "82%" }}>
          {scene.headline}
        </h2>

        <div style={{ transform: `scale(${pop})`, opacity: pop }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 40px",
              borderRadius: 9999,
              background: brand.primary,
              color: brand.bg,
              fontSize: wide ? 30 : 27,
              fontWeight: 800,
              boxShadow: `0 24px 60px -18px ${brand.primary}b3`,
            }}
          >
            {scene.buttonLabel}
          </div>
        </div>

        {scene.url ? <div style={{ opacity: enter(frame, 34, 14).opacity, fontSize: wide ? 24 : 22, color: `${brand.text}99`, fontWeight: 600 }}>{scene.url}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
