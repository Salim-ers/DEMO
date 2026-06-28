import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Brand, Format, Scene } from "../schema.js";
import { FORMAT_DIMS, FONT_FAMILY, enter, slowPush } from "../lib/theme.js";
import { DeviceFrame, Cursor } from "../components.js";

type S = Extract<Scene, { type: "feature" }>;

/** Feature: one benefit, shown on the real product screen, with a live cursor. */
export function FeatureScene({ scene, brand, format }: { scene: S; brand: Brand; format: Format }) {
  const frame = useCurrentFrame();
  const { safe } = FORMAT_DIMS[format];
  const wide = format === "16:9";
  const fontFamily = brand.fontFamily ? `${brand.fontFamily}, ${FONT_FAMILY}` : FONT_FAMILY;

  const eyebrow = enter(frame, 2, 16);
  const title = enter(frame, 8, 18);
  const benefit = enter(frame, 16, 18);
  const device = enter(frame, 10, 22);

  const copy = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {scene.eyebrow ? (
        <div
          style={{
            opacity: eyebrow.opacity,
            transform: `translateY(${eyebrow.y}px)`,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: brand.primary,
            marginBottom: 18,
          }}
        >
          {scene.eyebrow}
        </div>
      ) : null}
      <h2 style={{ margin: 0, opacity: title.opacity, transform: `translateY(${title.y}px)`, fontSize: wide ? 64 : 52, lineHeight: 1.06, fontWeight: 800, letterSpacing: "-0.02em", color: brand.text }}>
        {scene.title}
      </h2>
      <p style={{ margin: "22px 0 0", opacity: benefit.opacity, transform: `translateY(${benefit.y}px)`, fontSize: wide ? 30 : 27, lineHeight: 1.45, color: `${brand.text}c2`, fontWeight: 500, maxWidth: 620 }}>
        {scene.benefit}
      </p>
    </div>
  );

  const screen = (
    <div
      style={{
        position: "relative",
        flex: wide ? 1.15 : undefined,
        width: wide ? undefined : "100%",
        aspectRatio: "16 / 10",
        opacity: device.opacity,
        transform: `translateY(${device.y}px) scale(${slowPush(frame, scene.durationInFrames, 1, 1.04)})`,
      }}
    >
      <DeviceFrame src={scene.deviceSrc} isVideo={scene.deviceIsVideo} brand={brand} />
      {scene.cursorTarget ? <Cursor target={scene.cursorTarget} brand={brand} /> : null}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 60% at ${wide ? "78%" : "50%"} 20%, ${brand.secondary}1f, transparent 70%)` }} />
      <AbsoluteFill
        style={{
          padding: safe,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: wide ? 72 : 44,
        }}
      >
        {wide ? (
          <>
            {copy}
            {screen}
          </>
        ) : (
          <>
            {screen}
            {copy}
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
