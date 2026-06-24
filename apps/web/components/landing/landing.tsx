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
        {/* gauche : points animés, fondus vers le centre */}
        <div className="absolute inset-y-0 left-0 z-0 w-[52%]">
          <AnimatedDots fullScreen={false} className="h-full w-full" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 55%, #060504 100%)" }}
          />
        </div>

        {/* droite : timeline de montage (photo /hero/editing.jpg si présente, sinon rendu) */}
        <div className="absolute inset-y-0 right-0 z-0 w-[60%]">
          <EditorTimeline />
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero/editing.jpg')" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #060504 0%, rgba(6,5,4,0.78) 22%, rgba(6,5,4,0.30) 52%, rgba(6,5,4,0.45) 100%)",
            }}
          />
        </div>

        {/* halo chaud */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(60% 52% at 50% 30%, rgba(185,130,74,0.18) 0%, rgba(139,94,52,0.07) 42%, transparent 72%)",
          }}
        />
        {/* voile radial central pour la lisibilité du texte */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(44% 46% at 50% 48%, rgba(6,5,4,0.72) 0%, rgba(6,5,4,0.40) 50%, transparent 80%)",
          }}
        />

        <HeroStagger className="relative z-10 px-5 text-center">
          <div className="relative inline-block">
            <HeroItem>
              <span className="block text-center text-sm font-semibold uppercase tracking-[0.22em] text-muted sm:absolute sm:left-1 sm:top-0 sm:-translate-y-[150%] sm:text-left">
                Bienvenue chez
              </span>
            </HeroItem>
            <HeroItem blur>
              <h1 className="font-display text-[clamp(3.2rem,15vw,12rem)] font-extrabold leading-[0.9] tracking-tight text-ink">
                Studio One
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="mx-auto mt-4 max-w-xs text-center text-base font-medium leading-snug text-muted sm:absolute sm:bottom-0 sm:right-1 sm:mt-0 sm:max-w-[19rem] sm:translate-y-[150%] sm:text-right sm:text-lg">
                Créez des vidéos de démonstration professionnelles.
              </p>
            </HeroItem>
          </div>

          <HeroItem>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:mt-36 sm:flex-row">
              <Link href="/new" className="btn-primary px-7 py-3.5 text-base">
                Créer une démo <ArrowRight size={18} />
              </Link>
              <Link href="#fonctionnement" className="btn-secondary px-7 py-3.5 text-base">
                Voir comment ça marche
              </Link>
            </div>
          </HeroItem>
        </HeroStagger>
      </section>

      {/* 2 — Stats band */}
      <section className="border-y border-hairline">
        <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-hairline sm:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label} className="bg-canvas px-6 py-10 text-center sm:py-12">
              <div className="text-display text-[clamp(1.6rem,3vw,2.4rem)] text-ink">{s.value}</div>
              <p className="mx-auto mt-2 max-w-[16ch] text-sm leading-snug text-muted">{s.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* 3 — Statement */}
      <section className="mx-auto max-w-5xl px-5 py-28 sm:px-8 sm:py-36">
        <Reveal>
          <p className="eyebrow justify-center text-center">Notre conviction</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="text-display mx-auto mt-6 max-w-4xl text-balance text-center text-[clamp(2rem,5vw,3.75rem)] text-ink">
            Une démonstration claire convainc mieux qu’un long appel.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-7 max-w-2xl text-center text-lg leading-relaxed text-muted">
            Studio One met en scène votre produit avec le soin d’un studio — pour que chaque prospect comprenne la valeur
            en quelques secondes.
          </p>
        </Reveal>
      </section>

      {/* 4 — Comment ça marche (section crème) */}
      <section id="fonctionnement" className="bg-cream text-[#1a130d]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brown">Comment ça marche</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)]">Quatre étapes simples</h2>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <RevealItem key={s.title} className="rounded-2xl border border-[rgba(26,19,13,0.10)] bg-white/60 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a130d]/[0.05] text-brown">
                    <s.icon size={20} />
                  </span>
                  <span className="text-sm font-semibold text-[rgba(26,19,13,0.35)]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgba(26,19,13,0.66)]">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 — Showcase */}
      <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Le rendu</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink">
              Une vidéo prête à envoyer, pas un projet de montage.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Captures réelles de votre application, storyboard structuré, voix off et sous-titres : tout est assemblé
              pour vous. Vous récupérez un fichier propre, dans le format de votre choix.
            </p>
            <Link href="/new" className="btn-primary mt-9 px-6 py-3 text-base">
              Créer une démo <ArrowRight size={18} />
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-3xl border border-hairline bg-canvas-soft p-3 shadow-soft">
              <div className="mb-3 flex items-center gap-1.5 px-2 pt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
                <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
                <span className="h-2.5 w-2.5 rounded-full bg-hairline" />
                <span className="ml-3 h-5 flex-1 rounded-md bg-elevated" />
              </div>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-canvas">
                <LogoMark size={72} className="opacity-90" />
                <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-studio">
                  <Play size={18} className="ml-0.5" fill="currentColor" />
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — Bénéfices */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">Pour vos équipes</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink">Pensé pour les équipes commerciales</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <RevealItem key={b.title} className="card p-8">
                <h3 className="text-xl font-semibold text-ink">{b.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{b.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 7 — Exemples */}
      <section id="exemples" className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">Exemples</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink">Des démos pour chaque usage</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {EXAMPLES.map((e) => (
              <RevealItem key={e.title} className="group card overflow-hidden">
                <div className="relative flex aspect-video items-center justify-center bg-canvas-soft">
                  <LogoMark size={56} className="opacity-90 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-ink">{e.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 8 — Témoignages */}
      <section id="temoignages" className="border-t border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">Témoignages</p>
            <h2 className="text-display mt-4 text-[clamp(1.9rem,4vw,3rem)] text-ink">Ce que ça change</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {QUOTES.map((q) => (
              <RevealItem key={q.who} className="flex h-full flex-col rounded-2xl border border-hairline bg-canvas p-7">
                <p className="flex-1 text-lg leading-relaxed text-ink">“{q.quote}”</p>
                <div className="mt-6">
                  <p className="text-sm font-semibold text-ink">{q.who}</p>
                  <p className="text-sm text-muted">{q.ctx}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 9 — CTA final */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <h2 className="text-display mx-auto max-w-2xl text-[clamp(2rem,5vw,3.5rem)] text-ink">
              Prêt à créer votre première démo ?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Lancez votre première vidéo de démonstration en quelques minutes.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10">
              <Link href="/new" className="btn-primary px-8 py-3.5 text-base">
                Créer une démo <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
