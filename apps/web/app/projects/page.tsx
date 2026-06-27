import Link from "next/link";
import { Plus, CheckCircle2, Loader2, AlertTriangle, FileText } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { getSubscriptionUsage } from "../../lib/subscription.js";
import { QuotaCard } from "../../components/quota-card.js";
import { ProjectsBrowser } from "../../components/projects-browser.js";
import { StatusBadge } from "../../components/ui/status-badge.js";
import { timeAgo } from "../../lib/format.js";
import type { ProjectCardData } from "../../components/project-card.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes démos" };

const IN_PROGRESS = ["capturing", "storyboarding", "rendering"];

export default async function ProjectsPage() {
  const workspaceId = await getActiveWorkspaceId();
  const [projects, usage] = await Promise.all([
    prisma.project.findMany({ where: { workspaceId }, orderBy: { updatedAt: "desc" }, take: 200 }),
    getSubscriptionUsage(workspaceId),
  ]);

  const data: ProjectCardData[] = projects.map((p) => ({
    id: p.id,
    productName: p.productName,
    url: p.url,
    mainPromise: p.mainPromise,
    format: p.format,
    durationSeconds: p.durationSeconds,
    status: p.status,
    updatedAt: p.updatedAt.toISOString(),
    archived: Boolean(p.archivedAt),
  }));

  const active = data.filter((p) => !p.archived);
  const inProgress = active.filter((p) => IN_PROGRESS.includes(p.status));
  const tiles = [
    { label: "Prêtes", value: active.filter((p) => p.status === "ready").length, color: "79,180,119", Icon: CheckCircle2 },
    { label: "En cours", value: inProgress.length, color: "91,141,239", Icon: Loader2 },
    { label: "Action requise", value: active.filter((p) => p.status === "failed").length, color: "217,105,75", Icon: AlertTriangle },
    { label: "Brouillons", value: active.filter((p) => p.status === "draft").length, color: "154,147,137", Icon: FileText },
  ];

  return (
    <div className="animate-fade-up">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Mes démos</h1>
          <p className="mt-2 max-w-xl text-muted">
            Vos vidéos de démonstration, leur statut de production et les fichiers prêts à publier.
          </p>
        </div>
        <Link href="/new" className="btn-primary">
          <Plus size={16} /> Nouvelle démo
        </Link>
      </header>

      {/* Overview: quota + stats */}
      <div className="mb-6 grid gap-4 lg:grid-cols-[330px_1fr]">
        <QuotaCard usage={usage} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="card flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `rgba(${t.color},0.14)`, color: `rgb(${t.color})` }}>
                  <t.Icon size={15} />
                </span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: `rgb(${t.color})` }} />
              </div>
              <div className="mt-4 text-[1.7rem] font-bold leading-none tabular-nums text-ink">{t.value}</div>
              <div className="mt-1.5 text-xs font-medium text-muted">{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Production queue */}
      {inProgress.length > 0 && (
        <div className="mb-8 card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-hairline px-5 py-3">
            <Loader2 size={14} className="animate-spin text-processing" />
            <span className="eyebrow !text-processing">En production · {inProgress.length}</span>
          </div>
          <ul className="divide-y divide-hairline">
            {inProgress.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link href={`/projects/${p.id}`} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-elevated/50">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{p.productName}</span>
                    <span className="block text-xs text-faint">Mise à jour {timeAgo(p.updatedAt)}</span>
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProjectsBrowser projects={data} />
    </div>
  );
}
