import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Brand, Format, Scene } from "../schema.js";
import { FORMAT_DIMS, FONT_FAMILY, enter, slowPush } from "../lib/theme.js";
import { DeviceFrame } from "../components.js";

type S = Extract<Scene, { type: "hook" }>;

const TITLE: Record<Format, number> = { "16:9": 86, "9:16": 72, "1:1": 76 };

/** Hook: the painful problem, in one line. Strong, confident entrance. */
export function HookScene({ scene, brand, format }: { scene: S; brand: Brand; format: Format }) {
  const frame = useCurrentFrame();
  const { safe } = FORMAT_DIMS[format];
  const title = enter(frame, 2, 20);
  const sub = enter(frame, 12, 20);
  const fontFamily = brand.fontFamily ? `${brand.fontFamily}, ${FONT_FAMILY}` : FONT_FAMILY;

  return (
    <AbsoluteFill style={{ background: brand.bg, fontFamily }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 55% at 50% 28%, ${brand.primary}26, transparent 70%)` }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: safe, gap: 40 }}>
        <div style={{ maxWidth: format === "16:9" ? "70%" : "92%", textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              opacity: title.opacity,
              transform: `translateY(${title.y}px)`,
              fontSize: TITLE[format],
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: brand.text,
            }}
          >
            {scene.title}
          </h1>
          {scene.subtitle ? (
            <p
              style={{
                margin: "26px 0 0",
                opacity: sub.opacity,
                transform: `translateY(${sub.y}px)`,
                fontSize: format === "16:9" ? 34 : 30,
                lineHeight: 1.4,
                color: `${brand.text}b3`,
                fontWeight: 500,
              }}
            >
              {scene.subtitle}
            </p>
          ) : null}
        </div>

        {scene.deviceSrc ? (
          <div
            style={{
              width: format === "16:9" ? "58%" : "84%",
              aspectRatio: "16 / 10",
              opacity: enter(frame, 18, 24).opacity,
              transform: `translateY(${enter(frame, 18, 24).y}px) scale(${slowPush(frame, scene.durationInFrames, 1, 1.05)})`,
            }}
          >
            <DeviceFrame src={scene.deviceSrc} isVideo={scene.deviceIsVideo} brand={brand} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
