import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectWizard } from "../../../components/new-project-wizard.js";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Retour aux projets
      </Link>
      <div className="mb-8">
        <p className="eyebrow mb-2">Nouvelle démo</p>
        <h1 className="display text-3xl font-semibold text-ink">Configurez votre vidéo de démo</h1>
      </div>
      <NewProjectWizard />
    </div>
  );
}
