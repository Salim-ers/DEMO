import Link from "next/link";
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
} from "lucide-react";
import { Reveal } from "../components/reveal.js";
import { Pricing } from "../components/pricing.js";
import { LogoMark } from "../components/brand/logo.js";

export const metadata = {
  title: "Des démos produit soignées, façon studio",
};

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

const FAQ = [
  {
    q: "Comment StudioOne crée-t-il la vidéo ?",
    a: "Vous donnez l'URL de votre app et décrivez le parcours en une phrase. StudioOne capture les vrais écrans, construit un storyboard, écrit la voix off, puis rend une vidéo premium — automatiquement.",
  },
  {
    q: "Mes écrans sont-ils réellement capturés ?",
    a: "Oui. StudioOne se connecte à votre application et filme l'interface réelle. Aucune capture n'est inventée ou simulée.",
  },
  {
    q: "Puis-je utiliser ma propre voix ou une IA ?",
    a: "Les deux. Une voix de synthèse gratuite est disponible par défaut ; une voix IA premium est possible en option, uniquement avec votre consentement explicite.",
  },
  {
    q: "Dans quels formats puis-je exporter ?",
    a: "MP4 en 1080p, sous-titres SRT et VTT, plus une archive ZIP de tous les fichiers du projet. Les formats 16:9, 9:16 et carré sont pris en charge.",
  },
  {
    q: "Y a-t-il plusieurs offres ?",
    a: "Non. Un seul plan, tout inclus, avec facturation mensuelle ou annuelle. Simple et transparent.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div className="animate-fade-up">
            <span className="chip border-accent/25 bg-accent-soft text-accent-deep">
              <Sparkles size={13} /> De vrais écrans, jamais d'UI inventée
            </span>
            <h1 className="display mt-5 text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.04] text-ink">
              Des démos produit,{" "}
              <span className="bg-bronze-sheen bg-clip-text text-transparent">façon studio.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              StudioOne transforme vos vraies interfaces en démos raffinées et prêtes à diffuser. Capture,
              storyboard, voix off et rendu premium — dans un seul flux élégant.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/projects/new" className="btn-primary px-6 py-3 text-base">
                Créer une démo <ArrowRight size={17} />
              </Link>
              <Link href="/dashboard" className="btn-secondary px-6 py-3 text-base">
                Voir le tableau de bord
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-faint">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Rendu 1080p premium</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Rapport qualité inclus</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-accent-deep" /> Prêt en quelques minutes</span>
            </div>
          </div>

          <div className="animate-scale-in lg:pl-4">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ───────── Workflow ───────── */}
      <section id="workflow" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Le flux</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.75rem)] font-semibold text-ink">
              Cinq étapes, un résultat soigné
            </h2>
            <p className="mt-4 text-muted">
              Un pipeline lisible du début à la fin. Vous voyez toujours où en est votre projet et quelle est
              la prochaine action.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <div className="card h-full p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                      <s.icon size={19} />
                    </span>
                    <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-ink">{s.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Pensé pour livrer</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.75rem)] font-semibold text-ink">
            Tout ce qu'il faut pour une démo qui en jette
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 70}>
              <div className="card group h-full p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bronze-sheen text-ivory shadow-glow transition-transform duration-200 group-hover:scale-105">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── Quality ───────── */}
      <section className="border-y border-hairline bg-surface/60">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Qualité garantie</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold text-ink">
              Un rendu noté, pas seulement livré
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">
              Chaque vidéo passe un contrôle qualité automatique : résolution, débit, audio, scènes et
              cohérence. Vous récupérez un score clair et des recommandations — avant même de partager.
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
          </Reveal>
          <Reveal delay={120}>
            <QualityPreview />
          </Reveal>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Tarifs</p>
          <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.75rem)] font-semibold text-ink">
            Un seul plan. Tout est inclus.
          </h2>
          <p className="mt-4 text-muted">
            Pas de paliers, pas de fonctionnalités verrouillées. Mensuel ou annuel, à vous de choisir.
          </p>
        </Reveal>
        <div className="mt-12">
          <Pricing />
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="border-t border-hairline bg-surface/60">
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <Reveal className="text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold text-ink">Questions fréquentes</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 50}>
                <details className="card group px-5 py-1 [&_summary]:list-none">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink">
                    {item.q}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline text-faint transition-transform duration-200 group-open:rotate-45">
                      <Play size={11} className="rotate-90 fill-current" />
                    </span>
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-bronze-sheen px-8 py-16 text-center shadow-soft sm:px-16">
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(60%_120%_at_50%_0%,#fff_0%,transparent_60%)]" />
            <div className="relative">
              <h2 className="display mx-auto max-w-2xl text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-tight text-ivory">
                Votre prochaine démo mérite un studio
              </h2>
              <p className="mx-auto mt-4 max-w-md text-ivory/80">
                Lancez votre premier projet en quelques minutes. De vrais écrans, un rendu premium.
              </p>
              <Link
                href="/projects/new"
                className="btn mt-8 bg-ivory px-7 py-3.5 text-base font-semibold text-espresso shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Créer ma démo <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/** A faux project view that mirrors the real app's surfaces and pipeline. */
function HeroPreview() {
  const steps = ["Capture", "Storyboard", "Script", "Rendu", "Export"];
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-bronze-sheen opacity-10 blur-2xl" />
      <div className="card overflow-hidden p-0 shadow-soft">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
          <LogoMark size={20} />
          <span className="display text-sm font-semibold text-ink">
            Studio<span className="text-accent-deep">One</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-xs font-medium text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Rendu prêt
          </span>
        </div>
        <div className="p-4">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-bronze-sheen">
            <div className="absolute inset-0 opacity-25 [background:radial-gradient(50%_80%_at_50%_30%,#fff_0%,transparent_60%)]" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ivory/95 text-espresso shadow-soft">
              <Play size={22} className="ml-0.5 fill-current" />
            </span>
            <span className="absolute bottom-3 left-3 rounded-md bg-espresso/70 px-2 py-0.5 font-mono text-[11px] text-ivory">
              acme.app · 1080p · 16:9
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i < 4 ? "bg-accent text-ivory" : "border border-accent/40 bg-accent-soft text-accent-deep"
                  }`}
                >
                  {i < 4 ? <Check size={13} strokeWidth={3} /> : i + 1}
                </div>
                <span className="text-[10px] font-medium text-faint">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A miniature of the in-app quality report panel. */
function QualityPreview() {
  const checks = [
    ["Résolution", "1920×1080", "ok"],
    ["Débit vidéo", "8.4 Mbps", "ok"],
    ["Piste audio", "AAC · 192 kbps", "ok"],
    ["Scènes motion", "7", "ok"],
  ] as const;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Rapport qualité</span>
        <span className="display text-xl font-semibold text-accent-deep tabular-nums">92/100</span>
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
          <span className="font-medium text-accent-deep">Recommandation</span> — ajoutez une scène de
          conclusion pour renforcer l'appel à l'action.
        </p>
      </div>
    </div>
  );
}
