import Link from "next/link";
import { ArrowRight, Globe, PenLine, Clapperboard, Download } from "lucide-react";
import { Logo, LogoMark } from "../brand/logo.js";

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

export function Landing() {
  return (
    <>
      {/* 1 — Hero */}
      <section id="presentation" className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center sm:px-8 sm:pb-28 sm:pt-28">
          <div className="animate-fade-in flex justify-center">
            <Logo size={300} className="mx-auto max-w-[78vw]" />
          </div>

          <h1 className="animate-fade-up mx-auto mt-12 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Créez des vidéos de démonstration professionnelles pour vos SaaS.
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            Studio One transforme vos écrans, vos accès démo et votre scénario en une vidéo claire, propre et prête à
            être envoyée à vos prospects.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/new" className="btn-primary px-6 py-3 text-base">
              Créer une démo <ArrowRight size={18} />
            </Link>
            <Link href="#fonctionnement" className="btn-secondary px-6 py-3 text-base">
              Voir comment ça marche
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — Comment ça marche (section crème) */}
      <section id="fonctionnement" className="bg-cream text-[#1a130d]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brown">Comment ça marche</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Quatre étapes simples</h2>
          </div>

          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-[rgba(26,19,13,0.10)] bg-white/60 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a130d]/[0.05] text-brown">
                    <s.icon size={20} />
                  </span>
                  <span className="text-sm font-semibold text-[rgba(26,19,13,0.35)]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgba(26,19,13,0.66)]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 — Bénéfices */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">Pour vos équipes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Pensé pour les équipes commerciales
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card p-7">
              <h3 className="text-lg font-semibold text-ink">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — Exemples */}
      <section id="exemples" className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow">Exemples</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Des démos pour chaque usage
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {EXAMPLES.map((e) => (
              <div key={e.title} className="card overflow-hidden">
                <div className="flex aspect-video items-center justify-center bg-canvas-soft">
                  <LogoMark size={56} className="opacity-90" />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-ink">{e.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CTA final */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Prêt à créer votre première démo ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            Lancez votre première vidéo de démonstration en quelques minutes.
          </p>
          <div className="mt-9">
            <Link href="/new" className="btn-primary px-7 py-3 text-base">
              Créer une démo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
