import Link from "next/link";
import {
  ArrowRight, Globe, PenLine, Clapperboard, Download, Play,
  Sparkles, Users, BadgeCheck, MonitorPlay, Briefcase, GraduationCap,
} from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { AnimatedDots } from "../ui/animated-dots.js";
import { EditorTimeline } from "./editor-timeline.js";
import { SkewCard } from "../ui/gradient-card-showcase.js";
import { Reveal, RevealGroup, RevealItem, HeroStagger, HeroItem } from "./motion.js";

/** Vivid gradient pairs for the skew cards. */
const GRAD: { from: string; to: string }[] = [
  { from: "#ffbc00", to: "#ff0058" },
  { from: "#03a9f4", to: "#ff0058" },
  { from: "#4dff03", to: "#00d0ff" },
  { from: "#b621fe", to: "#1fd1f9" },
  { from: "#ff6a00", to: "#ee0979" },
  { from: "#00ff87", to: "#60efff" },
];
const grad = (i: number): { from: string; to: string } => GRAD[i % GRAD.length] ?? { from: "#ffbc00", to: "#ff0058" };

const STATS = [
  { value: "3", label: "étapes pour créer une démo" },
  { value: "60–180 s", label: "de vidéo finale" },
  { value: "16:9 · 9:16 · 1:1", label: "formats d’export" },
  { value: "4 livrables", label: "vidéo, script, sous-titres, storyboard" },
];

const STEPS = [
  { icon: Globe, title: "Ajoutez votre application", text: "URL, accès démo et informations produit." },
  { icon: PenLine, title: "Décrivez le scénario", text: "Indiquez ce que la vidéo doit montrer." },
  { icon: Clapperboard, title: "Studio One prépare", text: "Captures, storyboard, script et montage, automatiquement." },
  { icon: Download, title: "Téléchargez la vidéo", text: "Récupérez la vidéo, le script et les sous-titres." },
];

const BENEFITS = [
  { icon: Sparkles, title: "Une démo claire", text: "Plus claire et plus courte qu’un long appel de présentation." },
  { icon: Users, title: "Un discours cohérent", text: "Des démos homogènes pour tous vos commerciaux, à chaque envoi." },
  { icon: BadgeCheck, title: "Un rendu professionnel", text: "Un montage soigné, sans la moindre édition vidéo manuelle." },
];

const EXAMPLES = [
  { icon: MonitorPlay, title: "Démo SaaS B2B", text: "Présentez votre plateforme en 90 secondes." },
  { icon: Briefcase, title: "Démo produit métier", text: "Montrez un parcours fonctionnel clé, étape par étape." },
  { icon: GraduationCap, title: "Démo onboarding", text: "Guidez vos nouveaux utilisateurs pas à pas." },
];

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

      {/* 2 — Statement + stats */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
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
              <div className="text-display text-[clamp(1.8rem,3vw,2.6rem)]" style={{ color: grad(i).from }}>{s.value}</div>
              <p className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3 — Comment ça marche (skew cards) */}
      <section id="fonctionnement" className="flex flex-col px-5 py-16 sm:px-8 lg:min-h-screen lg:justify-center">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow justify-center">Comment ça marche</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Quatre étapes simples</h2>
        </Reveal>
        <RevealGroup className="flex flex-wrap items-center justify-center">
          {STEPS.map((s, i) => {
            const g = grad(i);
            return (
              <RevealItem key={s.title}>
                <SkewCard title={s.title} desc={s.text} gradientFrom={g.from} gradientTo={g.to} icon={<s.icon size={24} />} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* 4 — Showcase (split) */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Le rendu</p>
            <h2 className="text-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
              Une vidéo prête à <span className="text-rainbow">envoyer</span>, pas un projet de montage.
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-muted">
              Captures réelles de votre application, storyboard structuré, voix off et sous-titres : tout est assemblé pour vous, dans le format de votre choix.
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

      {/* 5 — Bénéfices (skew cards) */}
      <section className="flex flex-col px-5 py-16 sm:px-8 lg:min-h-screen lg:justify-center">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow justify-center">Pour vos équipes</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Pensé pour les équipes commerciales</h2>
        </Reveal>
        <RevealGroup className="flex flex-wrap items-center justify-center">
          {BENEFITS.map((b, i) => {
            const g = grad(i * 2 + 1);
            return (
              <RevealItem key={b.title}>
                <SkewCard title={b.title} desc={b.text} gradientFrom={g.from} gradientTo={g.to} icon={<b.icon size={24} />} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* 6 — Exemples (skew cards) */}
      <section id="exemples" className="flex flex-col px-5 py-16 sm:px-8 lg:min-h-screen lg:justify-center">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow justify-center">Exemples</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Des démos pour chaque usage</h2>
        </Reveal>
        <RevealGroup className="flex flex-wrap items-center justify-center">
          {EXAMPLES.map((e, i) => {
            const g = grad(i * 2 + 2);
            return (
              <RevealItem key={e.title}>
                <SkewCard title={e.title} desc={e.text} gradientFrom={g.from} gradientTo={g.to} icon={<e.icon size={24} />} cta={{ label: "Créer une démo", href: "/new" }} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* 7 — CTA final (immersif) */}
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
