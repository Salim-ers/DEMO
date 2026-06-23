/**
 * Visual system for the rendered video. Tuned for a sober, premium, corporate
 * look (Linear / Vercel / Superhuman lineage): near-black canvas, restrained
 * accent, high-contrast type, generous spacing. No gadget colors.
 */
export interface Theme {
  bg: string;
  bgElevated: string;
  panel: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentGlow: string;
  fontFamily: string;
  fontMono: string;
}

export function makeTheme(accent: string): Theme {
  return {
    bg: "#08090C",
    bgElevated: "#0E1014",
    panel: "#13161C",
    border: "rgba(255,255,255,0.08)",
    text: "#F5F7FA",
    textMuted: "rgba(245,247,250,0.62)",
    accent,
    accentSoft: hexToRgba(accent, 0.14),
    accentGlow: hexToRgba(accent, 0.30),
    fontFamily:
      'Inter, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontMono:
      'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Scale a base size by the smaller axis so layouts hold across formats. */
export function fitScale(width: number, height: number): number {
  return Math.min(width, height) / 1080;
}
