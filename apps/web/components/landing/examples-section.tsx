/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { Reveal } from "../motion/reveal.js";

const EXAMPLES = [
  { title: "SaaS RH", kind: "Démo produit", format: "16:9", duration: "90 s", objective: "Prospection & sales deck", style: "Premium clean", poster: "/visuals/edit.jpg" },
  { title: "Plateforme Finance", kind: "Pitch commercial", format: "16:9", duration: "60 s", objective: "Closing & investisseurs", style: "Corporate", poster: "/visuals/camera.jpg" },
  { title: "Application métier", kind: "Onboarding", format: "16:9", duration: "3 min", objective: "Activation & support", style: "Minimal luxe", poster: "/hero/editing.jpg" },
  { title: "E-commerce B2B", kind: "Pub TikTok", format: "9:16", duration: "30 s", objective: "Acquisition & ads", style: "TikTok dynamique", poster: "/visuals/studio.jpg" },
  { title: "Dashboard analytics", kind: "Teaser feature", format: "1:1", duration: "30 s", objective: "Annonce produit", style: "Product-led", poster: "/visuals/edit.jpg" },
];

export function ExamplesSection() {
  return (
    <section id="exemples" className="py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Exemples</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4vw,3.2rem)] text-ink">
            Une vidéo claire vend plus vite qu'un long appel.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Studio One transforme vos fonctionnalités en histoire visuelle : problème, solution, bénéfice, preuve,
            action. Quelques exemples illustratifs, votre vidéo est générée depuis votre propre produit.
          </p>
        </Reveal>
      </div>

      {/* Scroll-snap rail */}
      <div
        role="region"
        aria-label="Exemples de vidéos, faites défiler horizontalement"
        tabIndex={0}
        className="mask-fade-x mt-12 overflow-x-auto pb-4 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent/40 [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max snap-x snap-mandatory gap-5 px-5 sm:px-8">
          {EXAMPLES.map((e) => (
            <article
              key={e.title}
              className="group w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-canvas-soft shadow-panel transition-colors duration-300 hover:border-accent/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={e.poster} alt={`Exemple : ${e.title}`} className="editorial-img absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-canvas-soft via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champagne backdrop-blur-sm">
                  {e.format} · {e.duration}
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-ok backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Prête
                </span>
                <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-bronze-sheen text-studio shadow-glow-accent transition-transform duration-300 group-hover:scale-105">
                  <Play size={15} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-ink">{e.title}</h3>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{e.style}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{e.kind}</p>
                <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
                  <span className="text-xs text-faint">{e.objective}</span>
                  <Link href="/demo" className="inline-flex items-center gap-1 text-xs font-medium text-accent-deep transition-colors hover:text-champagne">
                    Voir <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
