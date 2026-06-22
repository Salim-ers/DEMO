import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewProjectWizard } from "../../../components/new-project-wizard.js";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Back to projects
      </Link>
      <div className="mb-8">
        <p className="eyebrow mb-2">New demo</p>
        <h1 className="text-2xl font-semibold tracking-tighter text-ink">Set up your demo video</h1>
      </div>
      <NewProjectWizard />
    </div>
  );
}
