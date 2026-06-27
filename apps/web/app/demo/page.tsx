/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Play, Film, ListOrdered, Mic, Captions, Smartphone, FolderArchive } from "lucide-react";
import { SectionHeader } from "../../components/ui/section-header.js";
import { BeforeAfter } from "../../components/ui/before-after.js";

export const metadata = {
  title: "Exemple de vidéo générée",
  description:
    "Un exemple complet de ce que Studio One produit à partir d'un vrai produit : vidéo, storyboard, script voix off, sous-titres et fichiers livrables.",
};

const DELIVERABLES = [
  { icon: Film, title: "Vidéo MP4", meta: "1080p · 16:9" },
  { icon: ListOrdered, title: "Storyboard", meta: "Structure de la vidéo" },
  { icon: Mic, title: "Script voix off", meta: "Prêt à enregistrer" },
  { icon: Captions, title: "Sous-titres", meta: "SRT / VTT" },
  { icon: Smartphone, title: "Formats sociaux", meta: "Vertical & carré" },
  { icon: FolderArchive, title: "Fichiers livrables", meta: "Archive ZIP" },
];

const AVANT = ["Captures faites à la main", "Script à écrire", "Montage long", "Formats à adapter", "Sous-titres à créer"];
const APRES = ["Vidéo 16:9 prête à envoyer", "Script voix off généré", "Sous-titres inclus", "Storyboard structuré", "Fichiers centralisés"];

export default function DemoPage() {
  return (
    <>
      {/* Header + player */}
      <section className="grain relative overflow-hidden bg-canvas px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-hero" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="eyebrow justify-center">Exemple</p>
          <h1 className="text-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] text-ink">Une vidéo générée par Studio One</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Voici un exemple complet de ce que vous obtenez à partir d'un vrai produit. Aucune interface inventée :
            de vrais écrans, scénarisés comme une vidéo professionnelle.
          </p>

          <div className="relative mx-auto mt-12 max-w-3xl">
            <div aria-hidden className="glow-orb absolute -inset-8 -z-10 bg-[radial-gradient(closest-side,rgba(198,134,66,0.3),transparent)] opacity-70" />
            <div className="group edge-light relative overflow-hidden rounded-3xl border border-hairline shadow-soft">
              <img src="/visuals/edit.jpg" alt="Aperçu d'une vidéo de démonstration" className="editorial-img aspect-video w-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
              <button
                type="button"
                aria-label="Lire l'aperçu"
                className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-bronze-sheen text-studio shadow-glow-accent transition-transform hover:scale-105"
              >
                <Play size={30} className="ml-1" fill="currentColor" />
              </button>
              <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-champagne backdrop-blur">
                Démo SaaS B2B · 90 s
              </span>
            </div>
            <p className="mt-3 text-xs text-faint">Aperçu illustratif. Votre vidéo est générée à partir de votre propre produit.</p>
          </div>
        </div>
      </section>

      {/* Avant / Après */}
      <section className="border-t border-hairline bg-canvas-soft">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
          <SectionHeader eyebrow="Avant / Après" title="Du produit brut à une vidéo prête à vendre" />
          <div className="mt-12">
            <BeforeAfter before={AVANT} after={APRES} />
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <SectionHeader eyebrow="Livrables" title="Ce que Studio One a généré" subtitle="Tout est centralisé et prêt à être utilisé par vos équipes." />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <div key={d.title} className="card flex items-center gap-4 p-6 transition-colors duration-200 hover:border-accent/30">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-deep">
                <d.icon size={22} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{d.title}</h3>
                <p className="text-sm text-muted">{d.meta}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-display text-[clamp(1.8rem,4vw,2.75rem)] text-ink">Prêt à créer la vôtre ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Transformez votre produit en vidéo claire et professionnelle, prête à envoyer à vos prospects.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/new" className="btn-primary px-7 py-3.5 text-base">
              Créer ma vidéo <ArrowRight size={18} />
            </Link>
            <Link href="/#prix" className="btn-secondary px-7 py-3.5 text-base">Voir le prix</Link>
          </div>
        </div>
      </section>
    </>
  );
}
