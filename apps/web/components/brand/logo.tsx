import { cn } from "../../lib/cn.js";

/* eslint-disable @next/next/no-img-element */

/**
 * Studio One logos. Two real assets, used by their natural rule:
 *  - the white script wordmark goes on dark surfaces,
 *  - the brown circular badge goes on cream surfaces.
 * The PNGs are transparent — never place a checkered / contrasting plate behind them.
 */
const WORDMARK_WHITE = "/brand/studio-one-wordmark-white.png";
const BADGE_BROWN = "/brand/studio-one-badge-brown.png";
const BADGE_CREAM = "/brand/studio-one-badge-cream.png";

/**
 * Circular badge. `brown` (default) = brown disc + cream script; `cream` = beige
 * disc + brown script (premium mark on dark surfaces).
 */
export function LogoMark({ size = 32, tone = "brown", className }: { size?: number; tone?: "brown" | "cream"; className?: string }) {
  return (
    <img
      src={tone === "cream" ? BADGE_CREAM : BADGE_BROWN}
      alt="Studio One"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

/** White wordmark — the default lockup for the dark navbar, footer and sidebar. */
export function Logo({ size = 132, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <img
      src={WORDMARK_WHITE}
      alt="Studio One"
      width={size}
      height={size}
      style={{ width: size, height: "auto" }}
      className={cn("object-contain", className)}
    />
  );
}

/**
 * Large hero lockup. `white` = the script wordmark (dark backgrounds, default),
 * `badge` = the brown badge (cream backgrounds). No glow, no plate.
 */
export function LogoEmblem({
  size = 220,
  variant = "white",
  className,
}: {
  size?: number;
  variant?: "badge" | "white";
  className?: string;
}) {
  const src = variant === "white" ? WORDMARK_WHITE : BADGE_BROWN;
  return (
    <img
      src={src}
      alt="Studio One"
      width={size}
      height={size}
      style={{ width: size, height: "auto" }}
      className={cn("object-contain", className)}
    />
  );
}

/** Alias kept for the spec's component name. */
export const StudioOneLogo = Logo;
