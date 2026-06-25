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
  "255,69,58", "255,159,10", "255,214,10", "52,199,89",
  "48,176,199", "10,132,255", "94,92,230", "191,90,242", "255,55,95",
];
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
  { icon: Sparkles, title: "Une démo claire", text: "Plus claire et plus courte qu’un long appel." },
  { icon: Users, title: "Un discours cohérent", text: "Des démos homogènes pour tous vos commerciaux." },
  { icon: BadgeCheck, title: "Un rendu professionnel", text: "Un montage soigné, sans édition manuelle." },
];

const EXAMPLES = [
  { title: "Démo SaaS B2B", text: "Présentez votre plateforme en 90 secondes." },
  { title: "Démo produit métier", text: "Montrez un parcours fonctionnel clé." },
  { title: "Démo onboarding client", text: "Guidez vos nouveaux utilisateurs pas à pas." },
];

function RainbowCard({ color, className, children }: { color: string; className?: string; children: React.ReactNode }) {
  return (
    <div style={{ "--c": color } as CSSProperties} className={cn("rcard group overflow-hidden rounded-3xl p-7", className)}>
      <div aria-hidden className="glow pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

export function Landing() {
  return (
    <>
      {/* 1 — Hero */}
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

      {/* 2 — Statement + stats (compact, riche) */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-32">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">Notre conviction</p>
          <h2 className="text-display mx-auto mt-5 max-w-4xl text-balance text-[clamp(2.2rem,5.2vw,4.25rem)] text-ink">
            Une démonstration <span className="text-rainbow">claire</span> convainc mieux qu’un long appel.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted">
            Studio One met en scène votre produit avec le soin d’un studio — pour que chaque prospect comprenne la valeur en quelques secondes.
          </p>
        </Reveal>
        <RevealGroup className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <RevealItem key={s.label} className="text-center">
              <div className="text-display text-[clamp(1.8rem,3vw,2.6rem)]" style={{ color: `rgb(${rb(i * 2)})` }}>{s.value}</div>
              <p className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3 — Comment ça marche (plein écran, cartes qui remplissent) */}
      <section id="fonctionnement" className="flex flex-col px-5 py-20 sm:px-8 lg:min-h-screen lg:justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow justify-center">Comment ça marche</p>
            <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Quatre étapes simples</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:min-h-[58vh] lg:auto-rows-fr lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const c = rb(i);
              return (
                <RevealItem key={s.title}>
                  <RainbowCard color={c} className="h-full">
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                        <s.icon size={26} />
                      </span>
                      <span className="text-3xl font-bold text-white/10">0{i + 1}</span>
                    </div>
                    <div className="mt-auto pt-10">
                      <h3 className="text-xl font-semibold text-ink">{s.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </RainbowCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* 4 — Bento : showcase + bénéfices (plein écran, dense) */}
      <section className="flex flex-col px-5 py-20 sm:px-8 lg:min-h-screen lg:justify-center">
        <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow">Pourquoi Studio One</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Pensé pour convaincre vos prospects</h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-[210px] lg:auto-rows-fr lg:[min-height:64vh]">
          {/* Grande carte showcase (2x2) */}
          <RevealItem className="md:col-span-2 md:row-span-2">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-30 blur-3xl" style={{ background: "conic-gradient(from 0deg,#ff453a,#ffd60a,#34c759,#0a84ff,#bf5af2,#ff453a)" }} />
              <div className="relative">
                <p className="eyebrow">Le rendu</p>
                <h3 className="text-display mt-3 text-2xl text-ink sm:text-3xl">Une vidéo prête à <span className="text-rainbow">envoyer</span>.</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                  Captures réelles, storyboard, voix off et sous-titres : tout est assemblé pour vous, dans le format de votre choix.
                </p>
              </div>
              <div className="relative mt-auto pt-6">
                <div className="rounded-2xl bg-canvas-soft p-2.5 ring-1 ring-white/5">
                  <div className="mb-2 flex items-center gap-1.5 px-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: "#FF453A" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "#FFD60A" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "#34C759" }} />
                    <span className="ml-2 h-3.5 flex-1 rounded bg-white/[0.06]" />
                  </div>
                  <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden rounded-xl bg-canvas">
                    <LogoMark tone="cream" size={56} className="opacity-95" />
                    <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-studio">
                      <Play size={15} className="ml-0.5" fill="currentColor" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </RevealItem>

          {/* Bénéfices */}
          {BENEFITS.map((b, i) => {
            const c = rb(i * 3 + 1);
            return (
              <RevealItem key={b.title} className={i === 2 ? "md:col-span-1" : ""}>
                <RainbowCard color={c} className="h-full">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `rgba(${c},0.14)`, color: `rgb(${c})` }}>
                    <b.icon size={22} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.text}</p>
                </RainbowCard>
              </RevealItem>
            );
          })}

          {/* Carte CTA pour compléter le bento */}
          <RevealItem>
            <Link
              href="/new"
              style={{ "--c": "185,130,74" } as CSSProperties}
              className="rcard group flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7"
            >
              <div aria-hidden className="glow pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />
              <span className="relative font-display text-lg text-ink">Lancez votre première démo</span>
              <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">
                Créer une démo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealItem>
        </RevealGroup>
        </div>
      </section>

      {/* 5 — Exemples (plein écran, cartes qui remplissent) */}
      <section id="exemples" className="flex flex-col px-5 py-20 sm:px-8 lg:min-h-screen lg:justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow">Exemples</p>
            <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Des démos pour chaque usage</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:min-h-[60vh] lg:auto-rows-fr">
            {EXAMPLES.map((e, i) => {
              const c = rb(i * 3 + 5);
              return (
                <RevealItem key={e.title}>
                  <RainbowCard color={c} className="h-full !p-0">
                    <div className="relative flex min-h-[200px] flex-1 items-center justify-center overflow-hidden">
                      <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 90% at 30% 0%, rgba(${c},0.28), transparent 70%)` }} />
                      <LogoMark tone="cream" size={64} className="relative opacity-95 transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-studio" style={{ background: `rgb(${c})` }}>
                        <Play size={17} className="ml-0.5" fill="currentColor" />
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

      {/* 6 — CTA final (immersif, plein écran) */}
      <section className="relative flex items-center justify-center overflow-hidden px-5 py-28 sm:px-8 lg:min-h-screen">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 60% at 50% 50%, rgba(185,130,74,0.16) 0%, transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[360px] w-[760px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: "conic-gradient(from 0deg, #ff453a, #ff9f0a, #ffd60a, #34c759, #0a84ff, #5e5ce6, #bf5af2, #ff453a)" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal>
            <LogoMark tone="cream" size={92} className="mx-auto mb-8 drop-shadow-[0_14px_40px_rgba(0,0,0,0.5)]" />
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-display mx-auto max-w-2xl text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
              Prêt à créer votre <span className="text-rainbow">première</span> démo ?
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">Lancez votre première vidéo de démonstration en quelques minutes.</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10">
              <Link href="/new" className="btn-primary px-9 py-4 text-base">Créer une démo <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
