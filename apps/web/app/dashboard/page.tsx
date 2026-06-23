import Link from "next/link";
import { Plus, Clapperboard } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProjectCard, type ProjectCardData } from "../../components/project-card.js";

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

  const ready = data.filter((p) => p.status === "ready").length;
  const active = data.filter((p) => !["ready", "draft", "failed"].includes(p.status)).length;

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Espace de travail</p>
          <h1 className="display text-3xl font-semibold text-ink">Vos projets de démo</h1>
          {data.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              {data.length} projet{data.length > 1 ? "s" : ""}
              <span className="text-faint"> · </span>
              {ready} prêt{ready > 1 ? "s" : ""}
              {active > 0 && (
                <>
                  <span className="text-faint"> · </span>
                  <span className="text-accent-deep">{active} en cours</span>
                </>
              )}
            </p>
          )}
        </div>
        <Link
          href="/projects/new"
          className="hidden items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ivory shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-soft sm:inline-flex"
        >
          <Plus size={16} /> Nouvelle démo
        </Link>
      </header>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card animate-scale-in flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-bronze-sheen shadow-glow">
        <Clapperboard size={26} className="text-ivory" />
      </div>
      <h2 className="display mb-2 text-xl font-semibold text-ink">Votre première démo vous attend</h2>
      <p className="mb-7 max-w-md text-sm leading-relaxed text-muted">
        Donnez une app en ligne à StudioOne, décrivez le parcours en une phrase, et il capture les vrais écrans
        puis génère une démo narrée et soignée.
      </p>
      <Link
        href="/projects/new"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-ivory shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-soft"
      >
        <Plus size={16} /> Créer votre première démo
      </Link>
    </div>
  );
}
