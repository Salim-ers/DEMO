import Link from "next/link";
import { ArrowRight, KeyRound, EyeOff, ImageUp, Trash2, FileCheck2, ShieldCheck } from "lucide-react";
import { SectionHeader } from "../../components/ui/section-header.js";
import { FeatureCard } from "../../components/ui/feature-card.js";

export const metadata = {
  title: "Sécurité & confidentialité",
  description: "Comment Studio One utilise vos accès et vos données : uniquement pour produire la vidéo demandée.",
};

const POINTS = [
  { icon: KeyRound, title: "Accès limités au scénario", text: "Les accès que vous fournissez servent uniquement à capturer le parcours décrit dans votre scénario." },
  { icon: EyeOff, title: "Aucun secret affiché", text: "Vos identifiants et clés ne sont jamais affichés publiquement ni montrés dans la vidéo." },
  { icon: ImageUp, title: "Captures au lieu d’un accès", text: "Vous pouvez importer vos propres captures d’écran plutôt que de fournir un accès au produit." },
  { icon: Trash2, title: "Suppression des fichiers", text: "Les assets générés peuvent être supprimés après la production de votre vidéo." },
  { icon: FileCheck2, title: "Usage strictement nécessaire", text: "Les données transmises sont utilisées uniquement pour créer la vidéo que vous demandez." },
  { icon: ShieldCheck, title: "Bonnes pratiques recommandées", text: "Utilisez un compte de démonstration avec des données fictives propres pour garder le contrôle de ce qui apparaît." },
];

export default function SecurityPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-canvas px-5 pb-16 pt-36 sm:px-8 sm:pb-20 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(185,130,74,0.16) 0%, transparent 65%)" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">Sécurité &amp; confidentialité</p>
          <h1 className="text-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] text-ink">
            Des accès utilisés uniquement pour la démonstration
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Studio One est pensé pour fonctionner avec des comptes de démonstration. Voici ce que nous faisons —
            et ne faisons pas — de vos accès et de vos données.
          </p>
        </div>
      </section>

      <div className="paper" style={{ backgroundColor: "#f7f1e6" }}>
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POINTS.map((p) => (
              <FeatureCard key={p.title} icon={p.icon} title={p.title} text={p.text} />
            ))}
          </div>

          <div className="card mt-10 p-7">
            <h2 className="text-lg font-semibold text-ink">Bon à savoir</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Studio One ne promet pas une sécurité absolue : c’est un outil de production vidéo. Pour les
              démonstrations, nous recommandons toujours un compte dédié, sans données clients réelles, et de vérifier
              les écrans avant diffusion.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link href="/new" className="btn-primary px-7 py-3.5 text-base">
              Créer ma vidéo <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
