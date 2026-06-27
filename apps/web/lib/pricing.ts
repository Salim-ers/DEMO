/**
 * Studio One ships a single subscription. One plan, ten videos a month, no
 * per-video pricing. Change the numbers here and every surface (landing,
 * pricing, wizard, dashboard quota) updates.
 */
export const PLAN = {
  name: "Studio One",
  tagline: "Un abonnement. Dix vidéos. Zéro montage.",
  currency: "€",
  monthlyPrice: 39.99,
  includedVideos: 10,
  features: [
    "10 vidéos de présentation par mois",
    "Démo SaaS, publicité courte, TikTok / Reels, onboarding",
    "Formats 16:9, 9:16 et 1:1",
    "Script marketing écrit pour vous",
    "Storyboard scène par scène",
    "Sous-titres synchronisés",
    "Voix off premium (option)",
    "Exports prêts à publier (MP4, SRT)",
    "Historique de tous vos projets",
  ],
} as const;

/** Format a price the French way: "39,99 €". */
export function formatPrice(value: number, currency: string = PLAN.currency): string {
  const hasCents = !Number.isInteger(value);
  return `${value.toFixed(hasCents ? 2 : 0).replace(".", ",")} ${currency}`;
}

/** Pretty monthly price string, e.g. "39,99 €". */
export const PRICE_LABEL = formatPrice(PLAN.monthlyPrice);
