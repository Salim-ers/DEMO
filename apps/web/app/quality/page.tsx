import Link from "next/link";
import { Gauge, ArrowRight } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { timeAgo } from "../../lib/format.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Rapports qualité" };

type Check = { id: string; label: string; status: "pass" | "warn" | "fail"; detail?: string };
type Report = { score?: number; resolution?: string; fileMb?: number; motionSceneCount?: number; checks?: Check[] };

function scoreTone(s: number) {
  if (s >= 85) return "text-ok";
  if (s >= 70) return "text-warn";
  return "text-bad";
}
const DOT: Record<string, string> = { pass: "bg-ok", warn: "bg-warn", fail: "bg-bad" };

export default async function QualityPage() {
  const workspaceId = await getActiveWorkspaceId();
  const jobs = await prisma.renderJob.findMany({
    where: { project: { workspaceId } },
    include: { project: { select: { id: true, productName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const reports = jobs
    .map((j) => ({ job: j, report: (j.qualityReport ?? null) as Report | null }))
    .filter((r): r is { job: (typeof jobs)[number]; report: Report } => r.report != null && typeof r.report.score === "number");

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow mb-2">Contrôle qualité</p>
        <h1 className="display text-3xl font-semibold text-ink">Rapports qualité</h1>
        <p className="mt-2 max-w-lg text-muted">
          Chaque rendu est noté et vérifié automatiquement : résolution, audio, scènes et cohérence.
        </p>
      </header>

      {reports.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-faint">
            <Gauge size={20} />
          </span>
          <h3 className="text-base font-semibold text-ink">Aucun rapport pour l'instant</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            Dès qu'un projet est rendu, son rapport qualité — score et vérifications — apparaît ici.
          </p>
          <Link href="/projects/new" className="btn-primary mt-5">
            Créer une démo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map(({ job, report }) => {
            const checks = (report.checks ?? []).slice(0, 5);
            return (
              <Link
                key={job.id}
                href={`/projects/${job.project.id}#quality`}
                className="card group p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="display truncate text-lg font-semibold text-ink">{job.project.productName}</h3>
                    <p className="mt-0.5 text-xs text-faint">
                      {report.resolution ?? "—"} · {report.fileMb ? `${report.fileMb} Mo` : "—"} · rendu {timeAgo(job.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`display text-3xl font-semibold tabular-nums ${scoreTone(report.score!)}`}>
                      {report.score}
                    </span>
                    <span className="text-sm text-faint">/100</span>
                  </div>
                </div>

                {checks.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {checks.map((c) => (
                      <li key={c.id} className="flex items-center gap-2.5 text-sm">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[c.status] ?? "bg-faint"}`} />
                        <span className="flex-1 truncate text-ink">{c.label}</span>
                        {c.detail && <span className="truncate font-mono text-xs text-faint">{c.detail}</span>}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 flex items-center justify-end border-t border-hairline pt-3 text-sm font-medium text-accent-deep">
                  Voir le détail
                  <ArrowRight size={15} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
