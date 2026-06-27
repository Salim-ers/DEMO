import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "../motion/reveal.js";
import { Magnetic } from "../motion/magnetic.js";
import { PLAN, PRICE_LABEL } from "../../lib/pricing.js";

export function PricingSection() {
  return (
    <section id="prix" className="border-y border-hairline bg-canvas-soft">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Prix</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4vw,3.4rem)] text-ink">
            Un abonnement. Dix vidéos. Zéro montage.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Pas de tarif par vidéo. Un seul plan, pensé pour livrer.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-14 block max-w-3xl">
          <div className="edge-light relative overflow-hidden rounded-[28px] border border-accent/25 bg-canvas p-8 shadow-glow-accent sm:p-10">
            <div aria-hidden className="glow-orb absolute -right-20 -top-24 h-72 w-72 bg-[radial-gradient(closest-side,rgba(198,134,66,0.28),transparent)]" />

            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-deep">{PLAN.name}</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-display text-[3.4rem] leading-none text-ink">{PRICE_LABEL}</span>
                  <span className="mb-1.5 text-muted">/ mois</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-semibold text-champagne">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {PLAN.includedVideos} vidéos incluses / mois
              </span>
            </div>

            <ul className="relative mt-9 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t border-hairline pt-8 sm:grid-cols-2">
              {PLAN.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-deep">
                    <Check size={13} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="relative mt-9">
              <Magnetic strength={0.3} className="w-full">
                <Link href="/new" className="btn-primary w-full justify-center py-4 text-base">
                  Commencer maintenant <ArrowRight size={18} />
                </Link>
              </Magnetic>
              <p className="mt-4 text-center text-sm leading-relaxed text-faint">
                Pensé pour les indépendants, SaaS, agences, startups et équipes commerciales qui veulent montrer vite,
                proprement, et vendre mieux.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-faint">
            Besoin de volume ?{" "}
            <a href="mailto:contact@studio-one.app" className="font-medium text-accent-deep underline-offset-4 hover:underline">
              Contactez-nous
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
