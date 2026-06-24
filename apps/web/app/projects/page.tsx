import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProjectsBrowser } from "../../components/projects-browser.js";
import type { ProjectCardData } from "../../components/project-card.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projets" };

export default async function ProjectsPage() {
  const workspaceId = await getActiveWorkspaceId();
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  const data: ProjectCardData[] = projects.map((p) => ({
    id: p.id,
    productName: p.productName,
    url: p.url,
    mainPromise: p.mainPromise,
    format: p.format,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
    archived: Boolean(p.archivedAt),
  }));

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Mes démos</h1>
          <p className="mt-2 text-muted">Retrouvez et gérez toutes vos vidéos de démonstration.</p>
        </div>
        <Link href="/new" className="btn-primary">
          <Plus size={16} /> Nouvelle démo
        </Link>
      </header>

      <ProjectsBrowser projects={data} />
    </div>
  );
}
