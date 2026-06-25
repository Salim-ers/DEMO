import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Globe, PenLine, Clapperboard, Download, Play, Sparkles, Users, BadgeCheck } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { AnimatedDots } from "../ui/animated-dots.js";
import { EditorTimeline } from "./editor-timeline.js";
import { cn } from "../../lib/cn.js";
import { Reveal, RevealGroup, RevealItem, HeroStagger, HeroItem } from "./motion.js";

/** Rainbow accent palette (echoes the hero dots). value = "r,g,b". */
const RAINBOW = [
  "255,69,58", // red
  "255,159,10", // orange
  "255,214,10", // yellow
  "52,199,89", // green
  "48,176,199", // teal
  "10,132,255", // blue
  "94,92,230", // indigo
  "191,90,242", // purple
  "255,55,95", // pink
];

/** Safe rainbow accessor (array access is possibly-undefined under strict TS). */
const rb = (i: number): string => RAINBOW[((i % RAINBOW.length) + RAINBOW.length) % RAINBOW.length] ?? "255,69,58";

const STATS = [
  { value: "3", label: "étapes pour créer une démo" },
  { value: "60–180 s", label: "de vidéo finale" },
  { value: "16:9 · 9:16 · 1:1", label: "formats d’export" },
  { value: "4 livrables", label: "vidéo, script, sous-titres, storyboard" },
];

const STEPS = [
  { icon: Globe, title: "Ajoutez votre application", text: "URL, accès démo et informations produit." },
  { icon: PenLine, title: "Décrivez le scénario", text: "Indiquez ce que la vidéo doit montrer." },
  { icon: Clapperboard, title: "Studio One prépare la démo", text: "Captures, storyboard, script et montage." },
  { icon: Download, title: "Téléchargez la vidéo", text: "Récupérez votre vidéo, le script et les sous-titres." },
];

const BENEFITS = [
  { icon: Sparkles, title: "Une démo claire", text: "Une vidéo plus claire et plus courte qu’un long appel de présentation." },
  { icon: Users, title: "Un discours cohérent", text: "Des démos homogènes pour tous vos commerciaux, à chaque envoi." },
  { icon: BadgeCheck, title: "Un rendu professionnel", text: "Un montage propre et soigné, sans édition vidéo manuelle." },
];

const EXAMPLES = [
  { title: "Démo SaaS B2B", text: "Présentez votre plateforme en 90 secondes." },
  { title: "Démo produit métier", text: "Montrez un parcours fonctionnel clé." },
  { title: "Démo onboarding client", text: "Guidez vos nouveaux utilisateurs pas à pas." },
];

function RainbowCard({ color, className, children }: { color: string; className?: string; children: React.ReactNode }) {
  return (
    <div style={{ "--c": color } as CSSProperties} className={cn("rcard group overflow-hidden rounded-3xl p-8", className)}>
      <div aria-hidden className="glow pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Landing() {
  return (
    <>
      {/* 1 — Hero — plein écran, fond animé */}
      <section id="presentation" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas">
        <div className="absolute inset-y-0 left-0 z-0 w-[52%]">
          <AnimatedDots fullScreen={false} className="h-full w-full" />
          <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 55%, #060504 100%)" }} />
        </div>
        <div className="absolute inset-y-0 right-0 z-0 w-[60%]">
          <EditorTimeline />
          <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero/editing.jpg')" }} />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg, #060504 0%, rgba(6,5,4,0.78) 22%, rgba(6,5,4,0.30) 52%, rgba(6,5,4,0.45) 100%)" }} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(60% 52% at 50% 30%, rgba(185,130,74,0.18) 0%, rgba(139,94,52,0.07) 42%, transparent 72%)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(44% 46% at 50% 48%, rgba(6,5,4,0.72) 0%, rgba(6,5,4,0.40) 50%, transparent 80%)" }} />

        <HeroStagger className="relative z-10 flex flex-col items-center px-5 text-center">
          <HeroItem>
            <LogoMark tone="cream" size={168} className="mb-9 max-w-[58vw] drop-shadow-[0_18px_50px_rgba(0,0,0,0.55)]" />
          </HeroItem>
          <HeroItem>
            <span className="block text-sm font-semibold uppercase tracking-[0.32em] text-accent-deep sm:text-base">Bienvenue chez</span>
          </HeroItem>
          <HeroItem blur>
            <h1 className="font-display mt-4 text-[clamp(3.6rem,16vw,13.5rem)] font-extrabold leading-[0.88] tracking-tight text-ink">Studio One</h1>
          </HeroItem>
          <HeroItem>
            <p className="mx-auto mt-8 max-w-2xl text-balance text-xl font-medium leading-snug text-muted sm:text-2xl">
              Créez des vidéos de démonstration professionnelles.
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/new" className="btn-primary px-8 py-4 text-base">Créer une démo <ArrowRight size={18} /></Link>
              <Link href="#fonctionnement" className="btn-secondary px-8 py-4 text-base">Voir comment ça marche</Link>
            </div>
          </HeroItem>
        </HeroStagger>
      </section>

      {/* 2 — Stats band (chiffres arc-en-ciel) */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <RevealGroup className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealItem key={s.label} className="px-4 text-center">
              <div className="text-display text-[clamp(1.9rem,3.2vw,2.9rem)]" style={{ color: `rgb(${rb(i * 2)})` }}>
                {s.value}
              </div>
              <p className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3 — Statement (plein écran) */}
      <section className="flex min-h-screen items-center px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="eyebrow justify-center">Notre conviction</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.6rem,6.5vw,5.5rem)] text-ink">
              Une démonstration <span className="text-rainbow">claire</span> convainc mieux qu’un long appel.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-9 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              Studio One met en scène votre produit avec le soin d’un studio — pour que chaque prospect comprenne la valeur en quelques secondes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 — Comment ça marche (plein écran, cartes arc-en-ciel) */}
      <section id="fonctionnement" className="flex min-h-screen flex-col justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow justify-center">Comment ça marche</p>
            <h2 className="text-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] text-ink">Quatre étapes simples</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const c = rb(i);
              return (
                <RevealItem key={s.title}>
                  <RainbowCard color={c} className="h-full">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                        <s.icon size={22} />
                      </span>
                      <span className="text-2xl font-bold text-white/10">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </RainbowCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* 5 — Showcase (plein écran, split) */}
      <section className="flex min-h-screen items-center px-5 py-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Le rendu</p>
            <h2 className="text-display mt-5 text-[clamp(2.2rem,4.8vw,3.75rem)] text-ink">
              Une vidéo prête à <span className="text-rainbow">envoyer</span>, pas un projet de montage.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              Captures réelles de votre application, storyboard structuré, voix off et sous-titres : tout est assemblé pour vous. Vous récupérez un fichier propre, dans le format de votre choix.
            </p>
            <Link href="/new" className="btn-primary mt-9 px-7 py-3.5 text-base">Créer une démo <ArrowRight size={18} /></Link>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-[1.6rem] bg-canvas-soft p-3 shadow-soft ring-1 ring-white/5">
              <div className="mb-3 flex items-center gap-1.5 px-2 pt-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF453A" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FFD60A" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#34C759" }} />
                <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
              </div>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-canvas">
                <LogoMark tone="cream" size={76} className="opacity-95" />
                <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-studio shadow-lg">
                  <Play size={19} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — Bénéfices (plein écran, cartes arc-en-ciel) */}
      <section className="flex min-h-screen flex-col justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-16 max-w-2xl">
            <p className="eyebrow">Pour vos équipes</p>
            <h2 className="text-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] text-ink">Pensé pour les équipes commerciales</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {BENEFITS.map((b, i) => {
              const c = rb(i * 3 + 1);
              return (
                <RevealItem key={b.title}>
                  <RainbowCard color={c} className="h-full p-9">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                      <b.icon size={26} />
                    </span>
                    <h3 className="mt-7 text-xl font-semibold text-ink">{b.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{b.text}</p>
                  </RainbowCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* 7 — Exemples (plein écran, cartes arc-en-ciel) */}
      <section id="exemples" className="flex min-h-screen flex-col justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-16 max-w-2xl">
            <p className="eyebrow">Exemples</p>
            <h2 className="text-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] text-ink">Des démos pour chaque usage</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {EXAMPLES.map((e, i) => {
              const c = rb(i * 3 + 5);
              return (
                <RevealItem key={e.title}>
                  <RainbowCard color={c} className="h-full !p-0">
                    <div className="relative flex aspect-video items-center justify-center overflow-hidden">
                      <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 90% at 30% 0%, rgba(${c},0.28), transparent 70%)` }} />
                      <LogoMark tone="cream" size={58} className="relative opacity-95 transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-studio" style={{ background: `rgb(${c})` }}>
                        <Play size={16} className="ml-0.5" fill="currentColor" />
                      </span>
                    </div>
                    <div className="p-7">
                      <h3 className="text-lg font-semibold text-ink">{e.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.text}</p>
                    </div>
                  </RainbowCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* 8 — CTA final (plein écran) */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(185,130,74,0.16) 0%, transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[420px] w-[820px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: "conic-gradient(from 0deg, #ff453a, #ff9f0a, #ffd60a, #34c759, #0a84ff, #5e5ce6, #bf5af2, #ff453a)" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <LogoMark tone="cream" size={96} className="mx-auto mb-9 drop-shadow-[0_14px_40px_rgba(0,0,0,0.5)]" />
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-display mx-auto max-w-2xl text-[clamp(2.6rem,6.5vw,5rem)] text-ink">
              Prêt à créer votre <span className="text-rainbow">première</span> démo ?
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">Lancez votre première vidéo de démonstration en quelques minutes.</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-11">
              <Link href="/new" className="btn-primary px-9 py-4 text-base">Créer une démo <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
