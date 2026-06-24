/**
 * videoBrand — the art-direction layer for the Premium SaaS Motion Engine.
 *
 * A "brand" is the full visual language a render uses: deep base, gradient,
 * dual accents, glass cards, glow, grain, grid and typography. It is resolved
 * once per render from (video style, captured accent, product name) and threaded
 * through every component as the Theme, so the whole video feels like one
 * coherent, designed piece — not a slideshow of screenshots.
 *
 * Lineage: Linear / Arc / Ramp / Attio / Notion Calendar — strong but elegant
 * colour, real depth, restrained motion. Never gadget-bright, never flat.
 */

import { type VideoStyle, VIDEO_STYLES, VIDEO_STYLE_LABEL } from "@demoforge/shared";

export { VIDEO_STYLES, VIDEO_STYLE_LABEL };
export type { VideoStyle };

/** A resolved palette + type system. Components read only from this. */
export interface Brand {
  style: VideoStyle;
  /** Deep base colour (used as the hard fallback / letterbox). */
  bg: string;
  /** Backdrop gradient stops, dark → darker, for depth. */
  bgGrad: [string, string];
  bgElevated: string;
  /** Glass card fill + border (already rgba). */
  panel: string;
  panelBorder: string;
  border: string;
  text: string;
  textMuted: string;
  /** Primary accent (links, glows, active UI). */
  accent: string;
  accentSoft: string;
  accentGlow: string;
  /** Secondary accent — used for gradients, kinetic words, second glow. */
  accent2: string;
  accent2Soft: string;
  accent2Glow: string;
  /** Warm/tertiary tint (gold/brass on luxury). */
  accentWarm: string;
  /** Primary radial glow colour behind the product (rgba). */
  glow: string;
  glow2: string;
  /** 0..1 film-grain intensity. Keep ≤ 0.06. */
  grain: number;
  /** 0..1 backdrop grid opacity. Keep ≤ 0.05 — barely there. */
  gridOpacity: number;
  /** Body / UI font stack. */
  fontFamily: string;
  /** Display / headline stack — elegant serif on luxury brands. */
  fontDisplay: string;
  fontMono: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Rotate a hex colour's hue to derive a tasteful complementary accent. */
function shiftHue(hex: string, deg: number): string {
  let [r, g, b] = hexToRgb(hex).map((v) => v / 255) as [number, number, number];
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  h = (h + deg + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0, gp = 0, bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(rp)}${to(gp)}${to(bp)}`;
}

const FONT_SANS =
  'Inter, "Geist", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const FONT_SERIF =
  '"Cormorant Garamond", "Playfair Display", "Times New Roman", Georgia, serif';
const FONT_MONO = 'ui-monospace, "Geist Mono", "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace';

/** The luxury equestrian direction for Horse Ledger: cream, brown, soft gold,
 *  deep green, premium black. Calm, confident, professional — never startup-bright. */
function luxuryEquestrian(accentOverride?: string): Brand {
  const gold = accentOverride && isVivid(accentOverride) ? accentOverride : "#C9A875";
  const green = "#3C6E5F";
  return {
    style: "luxury_product",
    bg: "#080604",
    bgGrad: ["#17110A", "#070503"],
    bgElevated: "#120D08",
    panel: "rgba(60, 46, 30, 0.30)",
    panelBorder: "rgba(201, 168, 117, 0.22)",
    border: "rgba(243, 236, 224, 0.10)",
    text: "#F3ECE0",
    textMuted: "rgba(243, 236, 224, 0.60)",
    accent: gold,
    accentSoft: rgba(gold, 0.16),
    accentGlow: rgba(gold, 0.30),
    accent2: green,
    accent2Soft: rgba(green, 0.16),
    accent2Glow: rgba(green, 0.26),
    accentWarm: "#6B4F33",
    glow: rgba(gold, 0.22),
    glow2: rgba(green, 0.16),
    grain: 0.05,
    gridOpacity: 0.025,
    fontFamily: FONT_SANS,
    fontDisplay: FONT_SERIF,
    fontMono: FONT_MONO,
  };
}

/** Creative AI Studio — the DemoForge house style: near-black space, electric
 *  violet → cyan with a pink kicker. Vibrant, modern, cinematic. */
function creativeAiStudio(accentOverride?: string): Brand {
  const a = accentOverride && isVivid(accentOverride) ? accentOverride : "#8B5CF6";
  const a2 = "#22D3EE";
  return {
    style: "creative_ai_studio",
    bg: "#05050A",
    bgGrad: ["#0B0A18", "#04040A"],
    bgElevated: "#0C0C18",
    panel: "rgba(255, 255, 255, 0.05)",
    panelBorder: "rgba(255, 255, 255, 0.12)",
    border: "rgba(255, 255, 255, 0.10)",
    text: "#F7F7FB",
    textMuted: "rgba(247, 247, 251, 0.66)",
    accent: a,
    accentSoft: rgba(a, 0.18),
    accentGlow: rgba(a, 0.36),
    accent2: a2,
    accent2Soft: rgba(a2, 0.16),
    accent2Glow: rgba(a2, 0.3),
    accentWarm: "#EC4899",
    glow: rgba(a, 0.3),
    glow2: rgba(a2, 0.2),
    grain: 0.05,
    gridOpacity: 0.04,
    fontFamily: FONT_SANS,
    fontDisplay: FONT_SANS,
    fontMono: FONT_MONO,
  };
}

function isVivid(hex: string): boolean {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return false;
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max - min > 20 && max > 50;
}

/** The default premium-dark direction (Linear/Vercel lineage), tinted by the
 *  captured brand accent. Strong colour, deep space, elegant — works for any SaaS. */
function premiumDark(accent: string, style: VideoStyle): Brand {
  const a = isVivid(accent) ? accent : "#6E8BFF";
  const a2 = shiftHue(a, 150); // complementary-ish second accent for gradients
  return {
    style,
    bg: "#06070B",
    bgGrad: ["#0C0F18", "#05060A"],
    bgElevated: "#0E1118",
    panel: "rgba(22, 26, 36, 0.55)",
    panelBorder: "rgba(255, 255, 255, 0.10)",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#F6F8FC",
    textMuted: "rgba(246, 248, 252, 0.62)",
    accent: a,
    accentSoft: rgba(a, 0.16),
    accentGlow: rgba(a, 0.32),
    accent2: a2,
    accent2Soft: rgba(a2, 0.16),
    accent2Glow: rgba(a2, 0.28),
    accentWarm: a,
    glow: rgba(a, 0.26),
    glow2: rgba(a2, 0.18),
    grain: 0.04,
    gridOpacity: 0.035,
    fontFamily: FONT_SANS,
    fontDisplay: FONT_SANS,
    fontMono: FONT_MONO,
  };
}

export interface ResolveBrandOptions {
  accent?: string | null;
  productName?: string;
  siteHost?: string;
  style?: VideoStyle | null;
}

/**
 * Resolve the art direction for a render. Luxury equestrian is auto-selected for
 * Horse Ledger (by name/host) or when style = luxury_product; otherwise premium
 * dark tinted by the captured accent. The "social_short" style nudges grain/glow.
 */
export function resolveBrand(opts: ResolveBrandOptions = {}): Brand {
  const accent = opts.accent ?? undefined;
  const hay = `${opts.productName ?? ""} ${opts.siteHost ?? ""}`.toLowerCase();
  const isEquestrian = /\bhorse\b|ledger|equine|equestr|écuri|haras|cheval|chevaux/.test(hay);

  // Equestrian products always get the luxury palette; any product can opt in
  // via the luxury_product style.
  if (opts.style === "luxury_product" || isEquestrian) {
    return luxuryEquestrian(accent ?? undefined);
  }
  if (opts.style === "creative_ai_studio") return creativeAiStudio(accent ?? undefined);
  return premiumDark(accent ?? "#6E8BFF", opts.style ?? "premium_motion");
}
