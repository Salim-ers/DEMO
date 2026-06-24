/**
 * Studio One ships a single, everything-included plan. Prices are placeholders
 * until real billing is wired — change them here and every surface updates.
 */
export const PLAN = {
  name: "Studio One",
  summary: "Tout est inclus. Un seul plan, pensé pour livrer.",
  currency: "€",
  monthly: 29,
  yearly: 290, // two months free vs. monthly
  features: [
    "Projets de démo illimités",
    "Capture d'écrans réelle, app connectée",
    "Storyboard & script générés automatiquement",
    "Voix off gratuite ou IA premium",
    "Rendu vidéo premium 1080p",
    "Rapport qualité automatique",
    "Espace de marque & presets vidéo",
    "Exports MP4, SRT/VTT et archive ZIP",
    "Support prioritaire",
  ],
} as const;

/** Effective monthly price when billed yearly (rounded), and the % saved. */
export function yearlyBreakdown() {
  const perMonth = Math.round(PLAN.yearly / 12);
  const savedPct = Math.round((1 - PLAN.yearly / (PLAN.monthly * 12)) * 100);
  return { perMonth, savedPct };
}
