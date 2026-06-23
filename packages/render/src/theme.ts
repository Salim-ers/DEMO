import { type Brand, resolveBrand, rgba } from "./styles/videoBrand.js";

/**
 * Visual system for the rendered video. This is the resolved art direction (see
 * styles/videoBrand.ts) plus the legacy token names every component already
 * reads. Tuned for a premium, designed look — deep colour, real depth, elegant
 * type — not a flat slideshow.
 */
export interface Theme extends Brand {
  /** @deprecated alias kept for components that predate the brand system. */
  fontMonoLegacy?: string;
}

export interface ThemeOptions {
  productName?: string;
  siteHost?: string;
  /** A video-style preset id (e.g. "luxury_product"); auto-detected if absent. */
  style?: Brand["style"] | null;
}

/**
 * Build the full theme from a captured accent (+ optional product context).
 * Back-compat: callers that only pass an accent still get a complete premium
 * theme; Horse Ledger auto-resolves to the luxury equestrian palette.
 */
export function makeTheme(accent: string, opts: ThemeOptions = {}): Theme {
  const brand = resolveBrand({
    accent,
    productName: opts.productName,
    siteHost: opts.siteHost,
    style: opts.style ?? null,
  });
  return brand;
}

export function hexToRgba(hex: string, alpha: number): string {
  return rgba(hex, alpha);
}

/** Scale a base size by the smaller axis so layouts hold across formats. */
export function fitScale(width: number, height: number): number {
  return Math.min(width, height) / 1080;
}
