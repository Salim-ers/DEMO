import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "../lib/db.js";
import { getActiveWorkspaceId } from "../lib/workspace.js";
import { ProjectCard, type ProjectCardData } from "../components/project-card.js";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const workspaceId = await getActiveWorkspaceId();
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    take: 48,
  });

  const data: ProjectCardData[] = projects.map((p) => ({
    id: p.id,
    productName: p.productName,
    url: p.url,
    mainPromise: p.mainPromise,
    format: p.format,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-2">Espace de travail</p>
          <h1 className="text-2xl font-semibold tracking-tighter text-ink">Projets de démo</h1>
        </div>
        <Link
          href="/projects/new"
          className="hidden items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-accent/90 sm:inline-flex"
        >
          <Plus size={16} /> Nouvelle démo
        </Link>
      </header>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-elevated">
        <Plus size={22} className="text-accent" />
      </div>
      <h2 className="mb-1.5 text-lg font-semibold tracking-tighter text-ink">Aucune démo pour l'instant</h2>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted">
        Indiquez une app en ligne à DemoForge, décrivez le parcours en une phrase, et il capture les vrais écrans puis
        génère une démo narrée.
      </p>
      <Link
        href="/projects/new"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-accent/90"
      >
        <Plus size={16} /> Créer votre première démo
      </Link>
    </div>
  );
}
