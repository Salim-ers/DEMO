import Link from "next/link";
import {
  Plus,
  FolderOpen,
  CheckCircle2,
  Loader,
  Download,
  ArrowRight,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProjectCard, type ProjectCardData } from "../../components/project-card.js";
import { TEMPLATES } from "../../lib/templates.js";
import { timeAgo, prettyStatus } from "../../lib/format.js";

export const dynamic = "force-dynamic";

const ACTIVITY_LABEL: Record<string, string> = {
  "project.create": "Projet créé",
  "project.delete": "Projet supprimé",
  "project.duplicate": "Projet dupliqué",
  "render.start": "Rendu lancé",
  "render.done": "Rendu terminé",
};

export default async function HomePage() {
  const workspaceId = await getActiveWorkspaceId();
  const [projects, exportsCount, activity] = await Promise.all([
    prisma.project.findMany({
      where: { workspaceId, archivedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.export.count({ where: { project: { workspaceId } } }),
    prisma.auditLog.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

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
  const inProgress = data.filter((p) => !["ready", "draft", "failed"].includes(p.status)).length;
  const cont = data[0];
  const recent = data.slice(0, 6);

  const stats = [
    { label: "Projets", value: data.length, icon: FolderOpen },
    { label: "Prêts", value: ready, icon: CheckCircle2 },
    { label: "En cours", value: inProgress, icon: Loader },
    { label: "Exports", value: exportsCount, icon: Download },
  ];

  return (
    <div className="animate-fade-up">
      {/* Welcome */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Votre studio</p>
          <h1 className="display text-3xl font-semibold text-ink sm:text-4xl">Bon retour au studio</h1>
          <p className="mt-2 max-w-lg text-muted">
            Transformez de vrais écrans en une histoire produit soignée. Capturez, façonnez, affinez, exportez.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/templates" className="btn-secondary">
            Partir d'un modèle
          </Link>
          <Link href="/projects/new" className="btn-primary">
            <Plus size={16} /> Nouveau projet
          </Link>
        </div>
      </header>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                    <s.icon size={17} />
                  </span>
                </div>
                <p className="display mt-3 text-3xl font-semibold text-ink">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Continue + recent */}
            <div className="space-y-6">
              {cont && (
                <div className="card overflow-hidden">
                  <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                    <span className="eyebrow">Reprendre où vous en étiez</span>
                  </div>
                  <Link href={`/projects/${cont.id}`} className="group flex items-center gap-5 px-6 py-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-bronze-sheen text-ivory shadow-glow">
                      <Clapperboard size={24} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="display truncate text-lg font-semibold text-ink">{cont.productName}</h3>
                      <p className="truncate text-sm text-muted">{cont.mainPromise}</p>
                      <p className="mt-1 text-xs text-faint">
                        {prettyStatus(cont.status)} · modifié {timeAgo(cont.updatedAt)}
                      </p>
                    </div>
                    <ArrowRight size={20} className="shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent-deep" />
                  </Link>
                </div>
              )}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tighter text-ink">Projets récents</h2>
                  <Link href="/projects" className="text-sm font-medium text-accent-deep hover:underline">
                    Tout voir
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {recent.map((p, i) => (
                    <ProjectCard key={p.id} p={p} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="card h-fit overflow-hidden">
              <div className="border-b border-hairline px-6 py-4">
                <span className="eyebrow">Activité</span>
              </div>
              {activity.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-faint">Rien pour l'instant.</p>
              ) : (
                <ul className="divide-y divide-hairline">
                  {activity.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 px-6 py-3.5">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-accent/60" />
                      <span className="flex-1 text-sm text-ink">{ACTIVITY_LABEL[a.action] ?? a.action}</span>
                      <span className="shrink-0 text-xs text-faint">{timeAgo(a.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Templates teaser */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tighter text-ink">Partir d'un modèle</h2>
              <Link href="/templates" className="text-sm font-medium text-accent-deep hover:underline">
                Tous les modèles
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.slice(0, 3).map((t) => (
                <Link
                  key={t.id}
                  href={`/projects/new?template=${t.id}`}
                  className="card group flex items-start gap-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep transition-transform group-hover:scale-105">
                    <t.icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-ink">{t.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{t.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card animate-scale-in flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-bronze-sheen shadow-glow">
        <Sparkles size={26} className="text-ivory" />
      </div>
      <h2 className="display mb-2 text-2xl font-semibold text-ink">Votre premier projet DemoForge commence ici</h2>
      <p className="mb-7 max-w-md text-sm leading-relaxed text-muted">
        Donnez une app en ligne à DemoForge, décrivez le parcours en une phrase, et il capture les vrais écrans pour
        en faire une démo prête à montrer.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/projects/new" className="btn-primary px-5 py-3">
          <Plus size={16} /> Créer une démo
        </Link>
        <Link href="/templates" className="btn-secondary px-5 py-3">
          Explorer les modèles
        </Link>
      </div>
    </div>
  );
}
