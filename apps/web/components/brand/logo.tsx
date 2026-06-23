"use client";
import { useState } from "react";
import { cn } from "../../lib/cn.js";

/**
 * StudioOne logo.
 *
 * The real artwork lives in /public/brand as raster files — drop the official
 * exports there and they appear everywhere automatically:
 *   • /brand/studio-one.png        → bronze circular badge (primary)
 *   • /brand/studio-one-white.png  → white lettering, transparent (for dark areas)
 *
 * Until those files exist, a faithful vector fallback (brush-script wordmark +
 * film/play/cut glyph) is rendered instead, so nothing ever looks broken.
 */
const SRC: Record<Variant, string> = {
  badge: "/brand/studio-one.png",
  white: "/brand/studio-one-white.png",
};
type Variant = "badge" | "white";

/** Compact film/play/cut glyph (pure SVG) for tiny contexts and favicons. */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cn("shrink-0", className)} role="img" aria-label="StudioOne">
      <defs>
        <linearGradient id="soBronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A6703B" />
          <stop offset="0.55" stopColor="#8A5A2C" />
          <stop offset="1" stopColor="#6F4521" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#soBronze)" />
      <rect x="18" y="19" width="28" height="19" rx="4.5" fill="none" stroke="#F7F1E7" strokeWidth="3" />
      <line x1="23.5" y1="19" x2="23.5" y2="38" stroke="#F7F1E7" strokeWidth="2" opacity="0.45" />
      <path d="M29 24.5 L38.5 28.5 L29 32.5 Z" fill="#F7F1E7" />
      <line x1="20" y1="45" x2="38" y2="45" stroke="#F7F1E7" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="29" cy="45" r="2.7" fill="#F7F1E7" />
      <path d="M42 42 l3.6 3 -3.6 3" fill="none" stroke="#F7F1E7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Glyph({ size }: { size: number }) {
  return (
    <svg width={size * 0.46} height={size * 0.16} viewBox="0 0 120 42" className="mt-[6%]" aria-hidden>
      <path d="M4 14 q56 22 112 -4" fill="none" stroke="#F7F1E7" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(38 18)">
        <rect x="0" y="0" width="30" height="20" rx="4" fill="none" stroke="#F7F1E7" strokeWidth="2.6" />
        <path d="M8 6 L20 10 L8 14 Z" fill="#F7F1E7" />
        <line x1="2" y1="26" x2="24" y2="26" stroke="#F7F1E7" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="13" cy="26" r="2.6" fill="#F7F1E7" />
        <path d="M34 22 l4 3 -4 3" fill="none" stroke="#F7F1E7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function EmblemFallback({ size, variant, className }: { size: number; variant: Variant; className?: string }) {
  const content = (
    <div className="relative flex flex-col items-center" style={{ transform: "translateY(-4%)" }}>
      <span className="font-script self-end leading-none text-ivory" style={{ fontSize: size * 0.165, marginRight: size * 0.05, marginBottom: -size * 0.05 }}>
        Studio
      </span>
      <span className="font-script leading-none text-ivory" style={{ fontSize: size * 0.37 }}>
        One
      </span>
      <Glyph size={size} />
    </div>
  );
  if (variant === "white") {
    return (
      <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }} role="img" aria-label="Studio One">
        {content}
      </div>
    );
  }
  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden rounded-full bg-bronze-sheen shadow-soft", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Studio One"
    >
      <div className="absolute inset-0 opacity-[0.18] [background:radial-gradient(60%_55%_at_50%_18%,#fff_0%,transparent_60%)]" />
      {content}
    </div>
  );
}

/**
 * The StudioOne emblem. Renders the faithful vector by default and fades the
 * real raster in only once it successfully loads — so it never flashes a broken
 * image while the official PNG is missing, and upgrades seamlessly when present.
 */
export function LogoEmblem({
  size = 160,
  variant = "badge",
  className,
}: {
  size?: number;
  variant?: Variant;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      {!loaded && <EmblemFallback size={size} variant={variant} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC[variant]}
        alt="Studio One"
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        className="object-contain"
        style={{ width: size, height: size, position: loaded ? "static" : "absolute", inset: 0, opacity: loaded ? 1 : 0 }}
      />
    </span>
  );
}

/** Horizontal lockup used in nav/header — the real badge at a readable size. */
export function Logo({ size = 40, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return <LogoEmblem size={size} className={className} />;
}
