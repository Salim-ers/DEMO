import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Brand, Caption } from "./schema.js";
import { EASE, POP, dbToVolume, FONT_FAMILY } from "./lib/theme.js";

/** Resolve a prop path to a URL: pass through http(s), otherwise staticFile(). */
function asset(src: string): string {
  return /^https?:\/\//.test(src) ? src : staticFile(src);
}

/* -------------------------------------------------------------------------- */
/*  AnimatedNumber — count-up (0 → value), eased. Never shown all at once.     */
/* -------------------------------------------------------------------------- */

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  delay = 0,
  duration = 34,
  style,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const current = interpolate(frame - delay, [0, duration], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const isInt = Number.isInteger(value);
  const shown = isInt ? Math.round(current) : Math.round(current * 10) / 10;
  const formatted = isInt ? shown.toLocaleString("fr-FR") : shown.toLocaleString("fr-FR", { minimumFractionDigits: 1 });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cursor — eases to a target inside its (relative) parent, then clicks.      */
/* -------------------------------------------------------------------------- */

export function Cursor({
  target,
  brand,
  appearAt = 8,
  moveDuration = 26,
}: {
  target: { x: number; y: number };
  brand: Brand;
  appearAt?: number;
  moveDuration?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - appearAt;
  const startX = 0.5;
  const startY = 0.94;
  const x = interpolate(t, [0, moveDuration], [startX, target.x], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const y = interpolate(t, [0, moveDuration], [startY, target.y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const opacity = interpolate(t, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const clickAt = appearAt + moveDuration;
  const click = spring({ frame: frame - clickAt, fps, config: POP });
  const ring = interpolate(click, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* click halo on the active element */}
      <div
        style={{
          position: "absolute",
          left: `${target.x * 100}%`,
          top: `${target.y * 100}%`,
          transform: "translate(-50%, -50%)",
          width: 120 * ring,
          height: 120 * ring,
          borderRadius: 9999,
          border: `2px solid ${brand.primary}`,
          opacity: (1 - ring) * 0.9,
        }}
      />
      {/* pointer */}
      <div style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, opacity, transform: `translate(-6%, -6%) scale(${1 - click * 0.12})` }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))" }}>
          <path d="M5 3l14 7-6 1.5L9.5 18 5 3z" fill="#fff" stroke="rgba(0,0,0,0.5)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------- */
/*  DeviceFrame — browser chrome around a Higgsfield clip / screenshot.        */
/* -------------------------------------------------------------------------- */

export function DeviceFrame({
  src,
  isVideo = false,
  brand,
  radius = 22,
  children,
}: {
  src?: string;
  isVideo?: boolean;
  brand: Brand;
  radius?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: radius,
        overflow: "hidden",
        background: "#0c0c12",
        boxShadow: "0 40px 120px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* chrome bar */}
      <div style={{ height: 36, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ width: 11, height: 11, borderRadius: 9999, background: "#ff5f57" }} />
        <span style={{ width: 11, height: 11, borderRadius: 9999, background: "#febc2e" }} />
        <span style={{ width: 11, height: 11, borderRadius: 9999, background: "#28c840" }} />
        {brand.siteHost ? (
          <span style={{ marginLeft: 14, fontFamily: FONT_FAMILY, fontSize: 15, color: "rgba(255,255,255,0.55)" }}>{brand.siteHost}</span>
        ) : null}
      </div>
      {/* content */}
      <div style={{ position: "relative", flex: 1 }}>
        {src ? (
          isVideo ? (
            <OffthreadVideo src={asset(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
          ) : (
            <Img src={asset(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )
        ) : (
          // graceful placeholder so the studio previews without assets
          <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 0%, ${brand.primary}33, transparent 60%), linear-gradient(160deg, #14141d, #0b0b12)` }}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.25)", fontFamily: FONT_FAMILY, fontSize: 22, letterSpacing: 1 }}>
              {brand.name}
            </AbsoluteFill>
          </AbsoluteFill>
        )}
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  RollingCaptions — word-synced subtitles (ElevenLabs timestamps).           */
/* -------------------------------------------------------------------------- */

export function RollingCaptions({ captions, brand, safe }: { captions: Caption[]; brand: Brand; safe: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (captions.length === 0) return null;

  const ms = (frame / fps) * 1000;
  let active = -1;
  for (let i = 0; i < captions.length; i++) {
    if ((captions[i]?.startMs ?? Infinity) <= ms) active = i;
    else break;
  }
  if (active < 0) return null;
  const activeCap = captions[active];
  if (!activeCap || ms > activeCap.endMs + 1200) return null;

  const from = Math.max(0, active - 4);
  const to = Math.min(captions.length, active + 4);
  const window = captions.slice(from, to);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", padding: safe, pointerEvents: "none" }}>
      <div
        style={{
          maxWidth: "82%",
          textAlign: "center",
          fontFamily: brand.fontFamily ? `${brand.fontFamily}, ${FONT_FAMILY}` : FONT_FAMILY,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.25,
          color: brand.text,
          background: "rgba(0,0,0,0.42)",
          backdropFilter: "blur(6px)",
          padding: "14px 26px",
          borderRadius: 18,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {window.map((c, i) => {
          const idx = from + i;
          const isActive = idx === active;
          const spoken = idx <= active;
          return (
            <span key={idx} style={{ color: isActive ? brand.primary : spoken ? brand.text : "rgba(255,255,255,0.4)", transition: "none", marginRight: 12 }}>
              {c.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

/* -------------------------------------------------------------------------- */
/*  Soundtrack — voice-over (front) + music bed (ducked under the voice).      */
/* -------------------------------------------------------------------------- */

export function Soundtrack({ voiceoverSrc, musicSrc, duckDb }: { voiceoverSrc?: string; musicSrc?: string; duckDb: number }) {
  return (
    <>
      {voiceoverSrc ? <Audio src={asset(voiceoverSrc)} /> : null}
      {musicSrc ? <Audio src={asset(musicSrc)} volume={dbToVolume(duckDb)} /> : null}
    </>
  );
}
