"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Pricing } from "../pricing.js";
import { LogoEmblem } from "../brand/logo.js";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const CAPABILITIES = [
  { tag: "Captures réelles", title: "Vos vrais écrans, filmés", text: "StudioOne se connecte à votre application et filme l'interface réelle — login compris. Jamais d'UI inventée." },
  { tag: "Rendu premium", title: "Un montage digne d'un studio", text: "Motion design, transitions et typographie au niveau des meilleures démos SaaS du marché." },
  { tag: "Voix & langue", title: "Une narration qui sonne juste", text: "Voix off gratuite par défaut, IA premium en option, dans votre langue et votre ton." },
  { tag: "Diffusion", title: "Prêt pour chaque canal", text: "16:9, 9:16 ou carré. MP4, sous-titres et archive — exportés, prêts à publier." },
];

const PROCESS = [
  { n: "01", name: "Capture", text: "On filme le parcours réel de votre produit, connecté à votre app." },
  { n: "02", name: "Storyboard", text: "Les scènes sont ordonnées en un plan clair, prêt à narrer." },
  { n: "03", name: "Script", text: "Une voix off précise est écrite, dans votre langue et votre ton." },
  { n: "04", name: "Rendu", text: "Le montage premium est produit automatiquement, scène par scène." },
  { n: "05", name: "Export", text: "MP4, sous-titres et archive — livrés, prêts à diffuser partout." },
];

const STATS = [
  { value: "1080p", label: "Rendu premium, qualité broadcast" },
  { value: "5", label: "Étapes claires, du brief à l'export" },
  { value: "0", label: "Interface inventée — que du réel" },
  { value: "100", label: "Score qualité contrôlé sur chaque rendu" },
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
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-emblem", { scale: 0.5, rotate: -12, opacity: 0, duration: 1.05, ease: "back.out(1.5)" })
        .from(".hero-status", { y: 16, opacity: 0, duration: 0.5 }, "-=0.55")
        .from(".hero-line", { yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.4")
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(".hero-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
        .from(".hero-foot", { opacity: 0, duration: 0.6 }, "-=0.2");

      gsap.to(".hero-emblem-wrap", {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 34, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        gsap.from(group.children, { y: 28, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 88%", once: true } });
      });

      // Recompute after fonts/logo load so no section stays hidden.
      ScrollTrigger.refresh();
      if (typeof document !== "undefined" && document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
      gsap.delayedCall(0.5, () => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <div ref={root} className="overflow-x-clip">
      {/* ───────── Hero ───────── */}
      <section className="hero relative flex min-h-[94vh] flex-col items-center justify-center px-5 py-24 text-center">
        <div className="hero-emblem-wrap mb-10">
          <div className="hero-emblem">
            <div className="origin-center scale-[0.6] sm:scale-[0.8] lg:scale-100">
              <LogoEmblem size={300} className="animate-float drop-shadow-[0_28px_70px_rgba(60,42,28,0.24)]" />
            </div>
          </div>
        </div>

        <span className="hero-status mb-7 inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-3.5 py-1.5 text-xs font-medium text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
          </span>
          Disponible — première démo en quelques minutes
        </span>

        <h1 className="display max-w-5xl text-[clamp(2.8rem,9vw,7rem)] font-semibold leading-[0.98] tracking-tight text-ink">
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block">Vos écrans réels,</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block italic text-accent-deep">en histoires produit.</span>
          </span>
        </h1>

        <p className="hero-sub mt-7 max-w-xl text-lg leading-relaxed text-muted">
          StudioOne transforme de vrais écrans en démos soignées, structurées et haut de gamme — sans jamais vous
          faire perdre le contrôle du processus créatif.
        </p>

        <div className="hero-cta mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/projects/new" className="btn-primary px-7 py-3.5 text-base">
            Démarrer un projet <ArrowRight size={17} />
          </Link>
          <Link href="/templates" className="btn-secondary px-7 py-3.5 text-base">
            Voir les modèles
          </Link>
        </div>

        <div className="hero-foot absolute inset-x-5 bottom-7 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-faint">
          <span>© 2026 StudioOne</span>
          <span className="hidden sm:inline">Défilez pour découvrir</span>
          <span>Capture réelle</span>
        </div>
      </section>

      {/* ───────── Marquee ───────── */}
      <div className="border-y border-hairline bg-surface/60 py-6">
        <div className="relative flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-medium text-muted">
                {m}
                <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Capabilities (showcase) ───────── */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <div data-reveal className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Le studio</p>
            <h2 className="display mt-3 max-w-2xl text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.02] text-ink">
              Ce que StudioOne produit pour vous
            </h2>
          </div>
          <p className="max-w-xs text-muted">
            Un seul flux, du vrai écran à la vidéo prête à diffuser. Soigné dans chaque détail.
          </p>
        </div>

        <div data-stagger className="grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline sm:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <div key={c.title} className="group bg-panel p-8 transition-colors duration-300 hover:bg-surface sm:p-10">
              <p className="eyebrow">{c.tag}</p>
              <h3 className="display mt-4 text-2xl font-semibold text-ink">{c.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted">{c.text}</p>
              <ArrowUpRight size={22} className="mt-6 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-deep" />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Process (numbered) ───────── */}
      <section id="workflow" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
          <div data-reveal className="mb-14 max-w-2xl">
            <p className="eyebrow">La méthode</p>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.02] text-ink">
              Cinq étapes, un résultat soigné
            </h2>
          </div>

          <div data-stagger className="border-t border-hairline">
            {PROCESS.map((p) => (
              <div key={p.n} className="group flex flex-col gap-3 border-b border-hairline py-7 sm:flex-row sm:items-baseline sm:gap-10">
                <span className="display text-2xl font-semibold text-accent-deep sm:w-20">{p.n}</span>
                <h3 className="display text-3xl font-semibold text-ink transition-transform duration-300 group-hover:translate-x-2 sm:w-72 sm:text-4xl">
                  {p.name}
                </h3>
                <p className="max-w-md flex-1 leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Statement ───────── */}
      <section className="mx-auto max-w-5xl px-5 py-32 text-center sm:px-8">
        <p data-reveal className="display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-tight text-ink">
          On transforme de vrais écrans en récits produit{" "}
          <span className="text-faint">qui donnent envie d'agir.</span>
        </p>
      </section>

      {/* ───────── Stats ───────── */}
      <section className="border-y border-hairline bg-bronze-sheen text-ivory">
        <div data-stagger className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-5 py-20 sm:px-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 text-center">
              <p className="display text-[clamp(2.8rem,6vw,4.5rem)] font-semibold leading-none">{s.value}</p>
              <p className="mx-auto mt-3 max-w-[14rem] text-sm leading-relaxed text-ivory/75">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Tarifs</p>
          <h2 className="display mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.02] text-ink">
            Un seul plan. Tout est inclus.
          </h2>
          <p className="mt-4 text-muted">Pas de paliers, pas de fonctionnalités verrouillées. Mensuel ou annuel.</p>
        </div>
        <div data-reveal className="mt-14">
          <Pricing />
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-4xl px-5 py-28 sm:px-8">
          <div data-reveal className="mb-12">
            <p className="eyebrow">FAQ</p>
            <h2 className="display mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold text-ink">Questions fréquentes</h2>
          </div>
          <div data-stagger className="border-t border-hairline">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-b border-hairline [&_summary]:list-none">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg font-medium text-ink">
                  {item.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-transform duration-300 group-open:rotate-45">
                    <ArrowUpRight size={15} />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="mx-auto max-w-6xl px-5 py-32 text-center sm:px-8">
        <div data-reveal className="flex flex-col items-center">
          <LogoEmblem size={88} className="mb-9" />
          <h2 className="display max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-tight text-ink">
            Un projet en tête ?<br />
            <span className="italic text-accent-deep">On le met en image.</span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/projects/new" className="btn-primary px-8 py-4 text-base">
              Démarrer un projet <ArrowRight size={18} />
            </Link>
            <Link href="/templates" className="btn-secondary px-8 py-4 text-base">
              Explorer les modèles
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-faint">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Sans carte pour commencer</span>
            <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Annulable à tout moment</span>
          </div>
        </div>
      </section>
    </div>
  );
}
