import { Globe, Clapperboard, ListChecks, Download, ArrowRight } from "lucide-react";
import { Reveal } from "../motion/reveal.js";

const STEPS = [
  { n: "01", icon: Globe, title: "Ajoutez votre site", text: "Collez l'URL de votre SaaS, app ou landing page. Studio One comprend l'offre, les écrans et les messages clés." },
  { n: "02", icon: Clapperboard, title: "Choisissez l'angle", text: "Démo produit, publicité courte, vidéo TikTok, onboarding ou pitch commercial. Vous fixez l'objectif." },
  { n: "03", icon: ListChecks, title: "Validez le storyboard", text: "Chaque scène est structurée : message, écran, mouvement, voix off et sous-titres. Rien n'est laissé au hasard." },
  { n: "04", icon: Download, title: "Téléchargez la vidéo", text: "Recevez une vidéo prête à publier en 16:9, 9:16 ou 1:1, avec script et sous-titres." },
];

const FLOW = ["URL du site", "Script", "Storyboard", "Vidéo"];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Fonctionnement</p>
        <h2 className="text-display mt-4 text-[clamp(2rem,4vw,3.2rem)] text-ink">
          De votre site à une vidéo prête à publier.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Un parcours simple, pensé pour aller vite sans rien perdre en qualité.
        </p>
      </Reveal>

      {/* Pipeline label */}
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2" stagger>
        {FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-champagne">
              {f}
            </span>
            {i < FLOW.length - 1 && <ArrowRight size={16} className="text-accent-deep" />}
          </span>
        ))}
      </Reveal>

      <Reveal className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4" stagger>
        {STEPS.map((s) => (
          <div key={s.n} className="group relative flex flex-col bg-canvas-soft p-7 transition-colors duration-300 hover:bg-elevated">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-hairline bg-surface text-accent-deep transition-colors group-hover:border-accent/40">
                <s.icon size={20} />
              </span>
              <span className="timecode text-sm text-faint">{s.n}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
