import React from "react";
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CameraMotion, Callout as CalloutType } from "@demoforge/shared";
import type { Theme } from "../theme.js";
import { PremiumStage } from "./PremiumStage.js";
import { BrowserMockup } from "./BrowserMockup.js";
import { FeatureCallout, type CalloutIcon } from "./FeatureCallout.js";
import { AnimatedCursor } from "./AnimatedCursor.js";

export interface ScreenCaptureProps {
  imageUrl: string | null;
  url?: string;
  caption?: string;
  callouts: CalloutType[];
  cameraMotion: CameraMotion;
  highlight?: { x: number; y: number; w: number; h: number } | null;
  theme: Theme;
  width: number;
  height: number;
  scale: number;
}

/** Map a camera motion to a per-frame transform. Cinematic but content-safe:
 *  the whole screen stays visible (objectFit: contain), so moves are gentle. */
function useCameraTransform(motion: CameraMotion): { scale: number; tx: number; ty: number } {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const ease = p * p * (3 - 2 * p); // smoothstep

  switch (motion) {
    case "slow_zoom_in":
      return { scale: interpolate(ease, [0, 1], [1.0, 1.05]), tx: 0, ty: interpolate(ease, [0, 1], [0.4, 0]) };
    case "slow_zoom_out":
      return { scale: interpolate(ease, [0, 1], [1.06, 1.0]), tx: 0, ty: 0 };
    case "pan_left":
      return { scale: 1.05, tx: interpolate(ease, [0, 1], [1.6, -1.6]), ty: 0 };
    case "pan_right":
      return { scale: 1.05, tx: interpolate(ease, [0, 1], [-1.6, 1.6]), ty: 0 };
    case "ken_burns":
      return { scale: interpolate(ease, [0, 1], [1.02, 1.06]), tx: interpolate(ease, [0, 1], [-1, 1]), ty: interpolate(ease, [0, 1], [0.6, -0.6]) };
    case "none":
    default:
      return { scale: interpolate(ease, [0, 1], [1.0, 1.02]), tx: 0, ty: 0 };
  }
}

const ICON_CYCLE: CalloutIcon[] = ["eye", "layers", "bolt", "check", "clock", "shield"];

export const ScreenCapture: React.FC<ScreenCaptureProps> = (props) => {
  const { imageUrl, url, callouts, cameraMotion, highlight, theme, width, height, scale } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = useCameraTransform(cameraMotion);

  const intro = interpolate(frame, [0, Math.round(fps * 0.6)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frameRise = interpolate(intro, [0, 1], [40, 0]);
  // A whisper of 3D tilt that settles to flat — gives depth on entry.
  const tiltX = interpolate(intro, [0, 1], [3.2, 0]);
  const tiltY = interpolate(intro, [0, 1], [-2.4, 0]);

  const margin = width * 0.055;

  return (
    <AbsoluteFill>
      <PremiumStage theme={theme} halo />
      <AbsoluteFill style={{ padding: margin, opacity: intro, transform: `translateY(${frameRise}px)` }}>
        <BrowserMockup theme={theme} url={url} scale={scale} tiltX={tiltX} tiltY={tiltY}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${cam.scale}) translate(${cam.tx}%, ${cam.ty}%)`,
                transformOrigin: "center center",
              }}
            >
              {imageUrl ? (
                <Img src={imageUrl} style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center" }} />
              ) : (
                <CapturePlaceholder theme={theme} scale={scale} />
              )}
            </div>

            {highlight ? (
              <div
                style={{
                  position: "absolute",
                  left: `${highlight.x * 100}%`,
                  top: `${highlight.y * 100}%`,
                  width: `${highlight.w * 100}%`,
                  height: `${highlight.h * 100}%`,
                  border: `2px solid ${theme.accent}`,
                  borderRadius: 12 * scale,
                  boxShadow: `0 0 0 6px ${theme.accentSoft}, 0 0 40px ${theme.accentGlow}`,
                  opacity: interpolate(frame, [Math.round(fps * 0.5), Math.round(fps * 0.9)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              />
            ) : null}

            {callouts.map((c, i) => (
              <FeatureCallout
                key={i}
                text={c.text}
                x={c.x}
                y={c.y}
                theme={theme}
                icon={ICON_CYCLE[i % ICON_CYCLE.length]}
                delay={Math.round(fps * (0.7 + i * 0.45))}
                scale={scale}
              />
            ))}

            {callouts[0] ? (
              <AnimatedCursor
                from={{ x: 0.52, y: 0.88 }}
                to={{ x: callouts[0].x, y: callouts[0].y }}
                width={width - margin * 2}
                height={height - margin * 2 - 46 * scale}
                theme={theme}
                clickAtFrame={Math.round(fps * 1.1)}
                scale={scale}
              />
            ) : null}
          </div>
        </BrowserMockup>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CapturePlaceholder: React.FC<{ theme: Theme; scale: number }> = ({ theme, scale }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", background: theme.bgElevated, gap: 14 * scale }}>
    <div style={{ width: 56 * scale, height: 56 * scale, borderRadius: 14 * scale, border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={28 * scale} height={28 * scale} viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.6" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
    <div style={{ color: theme.textMuted, fontFamily: theme.fontFamily, fontSize: 18 * scale }}>Capture indisponible pour cette étape</div>
  </AbsoluteFill>
);
