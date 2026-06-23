"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Camera,
  LayoutPanelTop,
  PenLine,
  Clapperboard,
  Download,
  Gauge,
  Mic,
  Palette,
  MonitorPlay,
  Play,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Pricing } from "../pricing.js";
import { LogoEmblem } from "../brand/logo.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  { icon: Camera, name: "Capture", text: "On filme vos vrais écrans — connecté à votre app, login inclus." },
  { icon: LayoutPanelTop, name: "Storyboard", text: "Un plan de scènes clair, structuré comme une vraie démo." },
  { icon: PenLine, name: "Script", text: "Une voix off juste, dans votre langue et votre ton." },
  { icon: Clapperboard, name: "Rendu", text: "Un montage premium : motion design, transitions, typographie." },
  { icon: Download, name: "Export", text: "MP4, sous-titres et archive — prêts à diffuser partout." },
];

const FEATURES = [
  { icon: MonitorPlay, title: "Captures réelles", text: "Jamais d'UI inventée. StudioOne filme l'outil réel, connexion comprise." },
  { icon: Clapperboard, title: "Rendu premium", text: "Motion design, transitions et typographie dignes des meilleures démos SaaS." },
  { icon: Gauge, title: "Rapport qualité", text: "Chaque rendu est noté et vérifié automatiquement avant livraison." },
  { icon: Mic, title: "Voix off naturelle", text: "Gratuite par défaut, IA premium en option — toujours avec consentement." },
  { icon: Palette, title: "Espace de marque", text: "Vos couleurs, votre logo, vos presets vidéo, appliqués à chaque projet." },
  { icon: LayoutPanelTop, title: "Multi-format", text: "16:9, 9:16 ou carré — un rendu adapté à chaque canal de diffusion." },
];

const MARQUEE = [
  "Démos SaaS",
  "Walkthroughs mobiles",
  "Lancements produit",
  "Démos investisseurs",
  "Onboarding",
  "Annonces de feature",
  "Tours marketplace",
  "Outils internes",
];

const FAQ = [
  { q: "Comment StudioOne crée-t-il la vidéo ?", a: "Vous donnez l'URL de votre app et décrivez le parcours en une phrase. StudioOne capture les vrais écrans, construit un storyboard, écrit la voix off, puis rend une vidéo premium — automatiquement." },
  { q: "Mes écrans sont-ils réellement capturés ?", a: "Oui. StudioOne se connecte à votre application et filme l'interface réelle. Aucune capture n'est inventée ou simulée." },
  { q: "Puis-je utiliser ma propre voix ou une IA ?", a: "Les deux. Une voix de synthèse gratuite est disponible par défaut ; une voix IA premium est possible en option, uniquement avec votre consentement explicite." },
  { q: "Dans quels formats puis-je exporter ?", a: "MP4 en 1080p, sous-titres SRT et VTT, plus une archive ZIP de tous les fichiers. Les formats 16:9, 9:16 et carré sont pris en charge." },
  { q: "Y a-t-il plusieurs offres ?", a: "Non. Un seul plan, tout inclus, avec facturation mensuelle ou annuelle. Simple et transparent." },
];

export function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Respect reduced-motion: leave content at its natural (visible) state.
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      {
        // Hero entrance
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-halo", { scale: 0.6, opacity: 0, duration: 1.3, ease: "power2.out" })
          .from(".hero-ring", { scale: 0.7, opacity: 0, duration: 1.1, ease: "power2.out" }, "-=1.0")
          .from(".hero-emblem", { scale: 0.45, rotate: -14, opacity: 0, duration: 1.05, ease: "back.out(1.5)" }, "-=0.9")
          .from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.55 }, "-=0.5")
          .from(".hero-line", { yPercent: 115, opacity: 0, duration: 0.85, stagger: 0.12 }, "-=0.35")
          .from(".hero-sub", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35")
          .from(".hero-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3")
          .from(".hero-proof", { y: 12, opacity: 0, duration: 0.5 }, "-=0.2")
          .from(".hero-cue", { y: -8, opacity: 0, duration: 0.6 }, "-=0.1");

        // Hero parallax (separate element from the entrance target → no conflict)
        gsap.to(".hero-emblem-wrap", {
          yPercent: 26,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to(".hero-halo", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
        });

        // Single-element reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Staggered groups (children animate in sequence)
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          gsap.from(group.children, {
            y: 26,
            opacity: 0,
            duration: 0.6,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 88%", once: true },
          });
        });

        // Fonts and the logo image shift layout after init — recompute trigger
        // positions so no section is ever left stuck at opacity 0.
        ScrollTrigger.refresh();
        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
        gsap.delayedCall(0.5, () => ScrollTrigger.refresh());
      }
    },
    { scope: root },
  );

  return (
    <div ref={root} className="overflow-x-clip">
      {/* ───────── Hero ───────── */}
      <section className="hero relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
        {/* ambient layers */}
        <div className="hero-halo pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[680px] w-[680px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze-sheen opacity-[0.16] blur-[90px]" />
        <div className="hero-ring pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[520px] w-[520px] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-dashed border-accent/20" />

        <div className="hero-emblem-wrap relative mb-8">
          <div className="hero-emblem">
            <div className="origin-center scale-[0.62] sm:scale-[0.82] lg:scale-100">
              <LogoEmblem size={420} className="animate-float drop-shadow-[0_28px_70px_rgba(60,42,28,0.24)]" />
            </div>
          </div>
        </div>

        <span className="hero-eyebrow chip border-accent/25 bg-accent-soft text-accent-deep">
          <Sparkles size={13} /> Moins de prompts. Plus de contrôle studio.
        </span>

        <h1 className="display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[1.02] text-ink">
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block">Des démos produit</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block bg-bronze-sheen bg-clip-text text-transparent">prêtes à présenter.</span>
          </span>
        </h1>

        <p className="hero-sub mt-6 max-w-xl text-lg leading-relaxed text-muted">
          StudioOne transforme de vrais écrans produit en démos soignées, structurées et haut de gamme — sans
          jamais vous faire perdre le contrôle du processus créatif.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/projects/new" className="hero-cta btn-primary px-7 py-3.5 text-base">
            Démarrer un projet <ArrowRight size={17} />
          </Link>
          <Link href="/templates" className="hero-cta btn-secondary px-7 py-3.5 text-base">
            Voir les modèles
          </Link>
        </div>

        <div className="hero-proof mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-faint">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Rendu 1080p premium</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Rapport qualité inclus</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Prêt en quelques minutes</span>
        </div>

        <div className="hero-cue absolute bottom-7 left-1/2 -translate-x-1/2 text-faint">
          <ChevronDown size={22} className="animate-bounce" />
        </div>
      </section>

      {/* ───────── Marquee ───────── */}
      <div className="border-y border-hairline bg-surface/60 py-5">
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap text-lg font-medium text-muted">
                {m}
                <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Workflow ───────── */}
      <section id="workflow" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Le flux</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] font-semibold text-ink">
            Cinq étapes, un résultat soigné
          </h2>
          <p className="mt-4 text-muted">
            Un pipeline lisible du début à la fin. Vous voyez toujours où en est votre projet et la prochaine action.
          </p>
        </div>

        <div data-stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <div
              key={s.name}
              className="card h-full p-5 transition-all duration-200 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-soft"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                  <s.icon size={19} />
                </span>
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-ink">{s.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section id="features" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div data-reveal className="max-w-2xl">
            <p className="eyebrow">Pensé pour livrer</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] font-semibold text-ink">
              Tout ce qu'il faut pour une démo qui en jette
            </h2>
          </div>
          <div data-stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card group h-full p-6 transition-all duration-200 hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bronze-sheen text-ivory shadow-glow transition-transform duration-200 group-hover:scale-105">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Quality ───────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow">Qualité garantie</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.7rem)] font-semibold text-ink">
            Un rendu noté, pas seulement livré
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Chaque vidéo passe un contrôle qualité automatique : résolution, débit, audio, scènes et cohérence. Vous
            récupérez un score clair et des recommandations — avant même de partager.
          </p>
          <ul className="mt-6 space-y-3">
            {["Score qualité sur 100", "Vérifications techniques détaillées", "Recommandations actionnables"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                  <Check size={13} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <QualityPreview />
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Tarifs</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.85rem)] font-semibold text-ink">
              Un seul plan. Tout est inclus.
            </h2>
            <p className="mt-4 text-muted">
              Pas de paliers, pas de fonctionnalités verrouillées. Mensuel ou annuel, à vous de choisir.
            </p>
          </div>
          <div data-reveal className="mt-12">
            <Pricing />
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
        <div data-reveal className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.7rem)] font-semibold text-ink">Questions fréquentes</h2>
        </div>
        <div data-stagger className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="card group px-5 py-1 [&_summary]:list-none">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink">
                {item.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-transform duration-200 group-open:rotate-180">
                  <ChevronDown size={14} />
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="mx-auto max-w-6xl px-5 pb-28 sm:px-8">
        <div data-reveal className="relative overflow-hidden rounded-[2rem] bg-bronze-sheen px-8 py-20 text-center shadow-soft sm:px-16">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(60%_120%_at_50%_0%,#fff_0%,transparent_60%)]" />
          <div className="relative flex flex-col items-center">
            <LogoEmblem variant="white" size={124} className="mb-6" />
            <h2 className="display mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight text-ivory">
              Votre prochaine démo mérite un studio
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ivory/80">
              Lancez votre premier projet en quelques minutes. De vrais écrans, un rendu premium.
            </p>
            <Link
              href="/projects/new"
              className="btn mt-9 bg-ivory px-8 py-3.5 text-base font-semibold text-espresso shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Créer ma démo <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/** A miniature of the in-app quality report panel. */
function QualityPreview() {
  const checks = [
    ["Résolution", "1920×1080"],
    ["Débit vidéo", "8.4 Mbps"],
    ["Piste audio", "AAC · 192 kbps"],
    ["Scènes motion", "7"],
  ] as const;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Rapport qualité</span>
        <span className="display text-xl font-semibold tabular-nums text-accent-deep">92/100</span>
      </div>
      <ul className="divide-y divide-hairline">
        {checks.map(([k, v]) => (
          <li key={k} className="flex items-center gap-3 px-6 py-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-ok" />
            <span className="flex-1 text-sm text-ink">{k}</span>
            <span className="font-mono text-xs text-faint">{v}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-hairline px-6 py-4">
        <p className="text-xs leading-relaxed text-muted">
          <span className="font-medium text-accent-deep">Recommandation</span> — ajoutez une scène de conclusion pour
          renforcer l'appel à l'action.
        </p>
      </div>
    </div>
  );
}
