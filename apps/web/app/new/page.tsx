import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectWizard } from "../../components/new-project-wizard.js";

export const metadata = { title: "Nouvelle démo" };

export default function NewDemoPage() {
  return (
    <div>
      <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Retour à mes démos
      </Link>
      <div className="mb-8">
        <p className="eyebrow">Nouvelle vidéo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Créer une vidéo</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Cinq étapes guidées : votre produit, l'objectif, le style, le format et la voix, puis le récapitulatif. L'aperçu se met à jour en direct.
        </p>
      </div>
      <NewProjectWizard />
    </div>
  );
}
