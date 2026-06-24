import { cn } from "../../lib/cn.js";

/* eslint-disable @next/next/no-img-element */

const WORDMARK_WHITE = "/brand/studio-one-wordmark-white.png";
const BADGE_BROWN = "/brand/studio-one-badge-brown.png";

/** Brown circular badge — for the mark, cards, app icon. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img
      src={BADGE_BROWN}
      alt="Studio One"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

/** White wordmark — for the navbar, footer and other dark surfaces. */
export function Logo({ size = 44, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <img
      src={WORDMARK_WHITE}
      alt="Studio One"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("object-contain", className)}
    />
  );
}

/** Large logo for hero / CTA, with a warm glow. `white` uses the wordmark, default the badge. */
export function LogoEmblem({ size = 120, variant = "badge", className }: { size?: number; variant?: "badge" | "white"; className?: string }) {
  const src = variant === "white" ? WORDMARK_WHITE : BADGE_BROWN;
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <div aria-hidden className="absolute inset-0 rounded-[30%] bg-aurora opacity-25 blur-2xl" />
      <img src={src} alt="Studio One" width={size} height={size} style={{ width: size, height: size }} className="relative object-contain" />
    </div>
  );
}
