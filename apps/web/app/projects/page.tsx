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

  const active = data.filter((p) => !p.archived);
  const inProgress = active.filter((p) => ["capturing", "storyboarding", "rendering"].includes(p.status)).length;
  const stats = [
    { label: "Vidéos", value: active.length, color: "201,148,96" },
    { label: "Prêtes", value: active.filter((p) => p.status === "ready").length, color: "107,165,121" },
    { label: "En cours", value: inProgress, color: "8,145,178" },
    { label: "Action requise", value: active.filter((p) => p.status === "failed").length, color: "217,105,75" },
    { label: "Brouillons", value: active.filter((p) => p.status === "draft").length, color: "150,140,130" },
  ];

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Mes démos</h1>
          <p className="mt-2 max-w-xl text-muted">
            Retrouvez ici toutes vos vidéos de démonstration, leur statut de génération et les fichiers disponibles.
          </p>
        </div>
        <Link href="/new" className="btn-primary">
          <Plus size={16} /> Nouvelle démo
        </Link>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-[1.7rem] font-bold leading-none tabular-nums" style={{ color: `rgb(${s.color})` }}>
              {s.value}
            </div>
            <div className="mt-2 text-xs font-medium text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <ProjectsBrowser projects={data} />
    </div>
  );
}
