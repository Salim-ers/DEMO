"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MonitorPlay, Smartphone, Presentation, GraduationCap, Sparkles, PlayCircle, Play } from "lucide-react";

type Style = {
  id: string;
  label: string;
  icon: typeof MonitorPlay;
  tagline: string;
  format: "16:9" | "9:16" | "1:1";
  duration: string;
  poster: string;
  caption: string;
};

const STYLES: Style[] = [
  { id: "saas", label: "Démo SaaS premium", icon: MonitorPlay, tagline: "Le parcours produit, écran par écran.", format: "16:9", duration: "90 s", poster: "/visuals/edit.jpg", caption: "« Votre dashboard, raconté. »" },
  { id: "tiktok", label: "Pub TikTok / Reels", icon: Smartphone, tagline: "Vertical, rythmé, fait pour le feed.", format: "9:16", duration: "30 s", poster: "/visuals/studio.jpg", caption: "« Accroche. Preuve. Action. »" },
  { id: "pitch", label: "Pitch commercial", icon: Presentation, tagline: "Le bon message pour vos prospects.", format: "16:9", duration: "60 s", poster: "/visuals/camera.jpg", caption: "« Problème, solution, preuve. »" },
  { id: "onboarding", label: "Onboarding produit", icon: GraduationCap, tagline: "Guidez la prise en main, sans friction.", format: "16:9", duration: "3 min", poster: "/hero/editing.jpg", caption: "« Bienvenue. Voici l'essentiel. »" },
  { id: "teaser", label: "Teaser feature", icon: Sparkles, tagline: "Annoncez une nouveauté, vite et net.", format: "1:1", duration: "30 s", poster: "/visuals/edit.jpg", caption: "« Une nouveauté. Un bénéfice. »" },
  { id: "tutorial", label: "Tutoriel court", icon: PlayCircle, tagline: "Expliquez une action clé.", format: "16:9", duration: "45 s", poster: "/visuals/studio.jpg", caption: "« En trois étapes. »" },
];

const RATIO: Record<Style["format"], string> = {
  "16:9": "aspect-video w-full",
  "9:16": "aspect-[9/16] h-full",
  "1:1": "aspect-square h-full",
};

export function StylesSwitcher() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const s = STYLES[active]!;

  return (
    <section id="styles" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32">
      <div className="max-w-2xl">
        <p className="eyebrow">Styles</p>
        <h2 className="text-display mt-4 text-[clamp(2rem,4vw,3.2rem)] text-ink">
          Un style pour chaque objectif.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Survolez un style : le format, la durée et le rythme s'adaptent. Studio One garde votre identité, change le tempo.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        {/* Selector */}
        <ul className="flex flex-col gap-2.5">
          {STYLES.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                    on ? "border-accent/45 bg-elevated shadow-glow-accent" : "border-hairline bg-surface hover:border-hairline hover:bg-elevated/60"
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors ${on ? "border-accent/40 bg-accent-soft text-accent-deep" : "border-hairline text-muted"}`}>
                    <item.icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">{item.label}</span>
                    <span className="block truncate text-sm text-muted">{item.tagline}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{item.format}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Preview */}
        <div className="flex min-h-[440px] items-center justify-center rounded-3xl border border-hairline bg-canvas-soft p-6 sm:p-8">
          <div className={`relative flex max-h-[400px] items-center justify-center ${s.format === "16:9" ? "w-full" : "h-[400px]"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-2xl border border-hairline shadow-soft ${RATIO[s.format]}`}
              >
                <img src={s.poster} alt={s.label} className="editorial-img absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-champagne backdrop-blur-sm">
                  {s.format} · {s.duration}
                </span>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bronze-sheen text-studio shadow-glow-accent">
                  <Play size={15} className="ml-0.5" fill="currentColor" />
                </span>
                <p className="absolute inset-x-3 bottom-3 rounded-lg bg-black/45 px-3 py-2 text-center text-sm font-medium text-champagne backdrop-blur-sm">
                  {s.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
