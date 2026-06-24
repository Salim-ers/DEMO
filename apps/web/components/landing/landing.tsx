import Link from "next/link";
import { ArrowRight, Globe, PenLine, Clapperboard, Download, Play } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { AnimatedDots } from "../ui/animated-dots.js";
import { EditorTimeline } from "./editor-timeline.js";
import { Reveal, RevealGroup, RevealItem, HeroStagger, HeroItem } from "./motion.js";

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
  { title: "Une démo claire", text: "Une vidéo plus claire et plus courte qu’un long appel de présentation." },
  { title: "Un discours cohérent", text: "Des démos homogènes pour tous vos commerciaux, à chaque envoi." },
  { title: "Un rendu professionnel", text: "Un montage propre et soigné, sans édition vidéo manuelle." },
];

const EXAMPLES = [
  { title: "Démo SaaS B2B", text: "Présentez votre plateforme en 90 secondes." },
  { title: "Démo produit métier", text: "Montrez un parcours fonctionnel clé." },
  { title: "Démo onboarding client", text: "Guidez vos nouveaux utilisateurs pas à pas." },
];

const QUOTES = [
  { quote: "Nos prospects comprennent le produit avant même le premier appel.", who: "Responsable commercial", ctx: "SaaS B2B" },
  { quote: "Toutes nos démos racontent enfin la même histoire.", who: "Head of Sales", ctx: "Éditeur logiciel" },
  { quote: "Un livrable prêt à envoyer, sans jamais repasser par le montage.", who: "Fondateur", ctx: "Startup" },
];

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
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, #060504 0%, rgba(6,5,4,0.78) 22%, rgba(6,5,4,0.30) 52%, rgba(6,5,4,0.45) 100%)" }}
          />
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

      {/* 2 — Stats band (sans lignes) */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <RevealGroup className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label} className="px-4 text-center">
              <div className="text-display text-[clamp(1.8rem,3vw,2.7rem)] text-ink">{s.value}</div>
              <p className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3 — Statement */}
      <section className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="eyebrow justify-center text-center">Notre conviction</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-display mx-auto mt-6 max-w-4xl text-balance text-center text-[clamp(2.2rem,5.5vw,4.25rem)] text-ink">
            Une démonstration claire convainc mieux qu’un long appel.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-muted">
            Studio One met en scène votre produit avec le soin d’un studio — pour que chaque prospect comprenne la valeur en quelques secondes.
          </p>
        </Reveal>
      </section>

      {/* 4 — Comment ça marche (full noir) */}
      <section id="fonctionnement" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="mb-14 text-center">
          <p className="eyebrow justify-center">Comment ça marche</p>
          <h2 className="text-display mt-4 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Quatre étapes simples</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <RevealItem key={s.title} className="rounded-2xl bg-white/[0.04] p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent-deep">
                  <s.icon size={21} />
                </span>
                <span className="text-sm font-semibold text-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 5 — Bande immersive : envoyer une démo (photo montage) */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/visuals/edit.jpg')" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(90deg, #060504 0%, rgba(6,5,4,0.90) 32%, rgba(6,5,4,0.55) 64%, rgba(6,5,4,0.40) 100%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 py-32 sm:px-8 sm:py-40">
          <Reveal className="max-w-xl">
            <p className="eyebrow">La démo qui convertit</p>
            <h2 className="text-display mt-5 text-[clamp(2.2rem,4.8vw,3.75rem)] text-ink">Envoyez une démonstration, pas un énième email.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Vos prospects voient le produit en action, à leur rythme. Une vidéo claire vaut mieux qu’un long fil de messages — et prépare le terrain avant même le premier appel.
            </p>
            <Link href="/new" className="btn-primary mt-9 px-7 py-3.5 text-base">Créer une démo <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      {/* 6 — Showcase (timeline / livrable) */}
      <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Le rendu</p>
            <h2 className="text-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Une vidéo prête à envoyer, pas un projet de montage.</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Captures réelles de votre application, storyboard structuré, voix off et sous-titres : tout est assemblé pour vous. Vous récupérez un fichier propre, dans le format de votre choix.
            </p>
            <Link href="/new" className="btn-primary mt-9 px-6 py-3 text-base">Créer une démo <ArrowRight size={18} /></Link>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="rounded-3xl bg-canvas-soft p-3 shadow-soft">
              <div className="mb-3 flex items-center gap-1.5 px-2 pt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="ml-3 h-5 flex-1 rounded-md bg-white/[0.06]" />
              </div>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-canvas">
                <LogoMark tone="cream" size={72} className="opacity-95" />
                <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-studio">
                  <Play size={18} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — Bénéfices : cartes en verre sur photo caméra */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/visuals/camera.jpg')" }} />
        <div aria-hidden className="absolute inset-0 bg-canvas/[0.88]" />
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(185,130,74,0.14) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">Pour vos équipes</p>
            <h2 className="text-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Pensé pour les équipes commerciales</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <RevealItem key={b.title} className="rounded-2xl bg-white/[0.05] p-8 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-sm font-semibold text-accent-deep">0{i + 1}</span>
                <h3 className="mt-6 text-xl font-semibold text-ink">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{b.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 8 — Exemples */}
      <section id="exemples" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow">Exemples</p>
          <h2 className="text-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Des démos pour chaque usage</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {EXAMPLES.map((e) => (
            <RevealItem key={e.title} className="group overflow-hidden rounded-2xl bg-white/[0.04] transition-transform duration-300 hover:-translate-y-1">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-canvas-soft">
                <div aria-hidden className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(70% 90% at 30% 0%, rgba(185,130,74,0.20), transparent 70%)" }} />
                <LogoMark tone="cream" size={58} className="relative opacity-95 transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent/90 text-studio">
                  <Play size={15} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-ink">{e.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 9 — Témoignages */}
      <section id="temoignages" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow">Témoignages</p>
          <h2 className="text-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">Ce que ça change</h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {QUOTES.map((q) => (
            <RevealItem key={q.who} className="flex h-full flex-col rounded-2xl bg-white/[0.04] p-7">
              <span className="font-display text-4xl leading-none text-accent/50">“</span>
              <p className="mt-2 flex-1 text-lg leading-relaxed text-ink">{q.quote}</p>
              <div className="mt-6 pt-4">
                <p className="text-sm font-semibold text-ink">{q.who}</p>
                <p className="text-sm text-muted">{q.ctx}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 10 — CTA final sur photo studio */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/visuals/studio.jpg')" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,5,4,0.86) 0%, rgba(6,5,4,0.78) 50%, rgba(6,5,4,0.92) 100%)" }} />
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 80% at 50% 50%, rgba(185,130,74,0.16) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center sm:px-8 sm:py-40">
          <Reveal>
            <LogoMark tone="cream" size={84} className="mx-auto mb-8 drop-shadow-[0_14px_40px_rgba(0,0,0,0.5)]" />
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-display mx-auto max-w-2xl text-[clamp(2.2rem,5.5vw,4rem)] text-ink">Prêt à créer votre première démo ?</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">Lancez votre première vidéo de démonstration en quelques minutes.</p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-10">
              <Link href="/new" className="btn-primary px-8 py-4 text-base">Créer une démo <ArrowRight size={18} /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
