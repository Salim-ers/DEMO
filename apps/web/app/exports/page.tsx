import Link from "next/link";
import { Download, FileVideo, ArrowRight } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { timeAgo } from "../../lib/format.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Exports" };

export default async function ExportsPage() {
  const workspaceId = await getActiveWorkspaceId();
  const exports = await prisma.export.findMany({
    where: { project: { workspaceId } },
    include: { project: { select: { id: true, productName: true, format: true } } },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow mb-2">Livrables</p>
        <h1 className="display text-3xl font-semibold text-ink">Exports</h1>
        <p className="mt-2 max-w-lg text-muted">Tous vos rendus livrés, avec leurs formats et fichiers associés.</p>
      </header>

      {exports.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-faint">
            <Download size={20} />
          </span>
          <h3 className="text-base font-semibold text-ink">Aucun export pour l'instant</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            Lancez le rendu d'un projet : vos vidéos, sous-titres et archives apparaîtront ici.
          </p>
          <Link href="/projects/new" className="btn-primary mt-5">
            Créer une démo
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {exports.map((e) => {
            const formats = [
              e.videoMp4Key && "MP4",
              e.video916Key && "9:16",
              e.video11Key && "1:1",
              e.captionsSrtKey && "SRT",
              e.captionsVttKey && "VTT",
              e.assetsZipKey && "ZIP",
            ].filter(Boolean) as string[];
            return (
              <Link
                key={e.id}
                href={`/projects/${e.project.id}`}
                className="card group flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bronze-sheen text-ivory shadow-glow">
                  <FileVideo size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-semibold text-ink">{e.project.productName}</h3>
                  <p className="text-xs text-faint">Exporté {timeAgo(e.createdAt)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {formats.length > 0 ? (
                      formats.map((f) => <span key={f} className="chip">{f}</span>)
                    ) : (
                      <span className="chip">{e.project.format}</span>
                    )}
                  </div>
                </div>
                <ArrowRight size={18} className="shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent-deep" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
