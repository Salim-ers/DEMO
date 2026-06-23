import Link from "next/link";
import { Image as ImageIcon, Smartphone, Film, Upload, Music, Clapperboard, FileVideo, FileArchive, Library } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { prisma } from "../../lib/db.js";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { timeAgo } from "../../lib/format.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ressources" };

const KIND: Record<string, { label: string; icon: LucideIcon }> = {
  SCREENSHOT_DESKTOP: { label: "Capture bureau", icon: ImageIcon },
  SCREENSHOT_MOBILE: { label: "Capture mobile", icon: Smartphone },
  VIDEO_SEGMENT: { label: "Segment vidéo", icon: Film },
  UPLOAD: { label: "Import", icon: Upload },
  AUDIO: { label: "Audio", icon: Music },
  BROLL: { label: "B-roll", icon: Clapperboard },
  RENDER_OUTPUT: { label: "Rendu final", icon: FileVideo },
  EXPORT_ZIP: { label: "Archive", icon: FileArchive },
};

function fmtBytes(b?: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} Ko`;
  return `${(b / 1024 / 1024).toFixed(1)} Mo`;
}

export default async function AssetsPage() {
  const workspaceId = await getActiveWorkspaceId();
  const assets = await prisma.asset.findMany({
    where: { project: { workspaceId } },
    include: { project: { select: { id: true, productName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const counts = assets.reduce<Record<string, number>>((acc, a) => {
    acc[a.kind] = (acc[a.kind] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow mb-2">Bibliothèque</p>
        <h1 className="display text-3xl font-semibold text-ink">Ressources</h1>
        <p className="mt-2 max-w-lg text-muted">Tous les médias produits par vos projets : captures, segments, audio et rendus.</p>
      </header>

      {assets.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-faint">
            <Library size={20} />
          </span>
          <h3 className="text-base font-semibold text-ink">Aucune ressource pour l'instant</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            Lancez un projet : captures, segments vidéo et rendus apparaîtront ici automatiquement.
          </p>
          <Link href="/projects/new" className="btn-primary mt-5">
            Créer une démo
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(counts).map(([k, n]) => {
              const meta = KIND[k] ?? { label: k, icon: Library };
              return (
                <span key={k} className="chip">
                  <meta.icon size={13} /> {meta.label} · {n}
                </span>
              );
            })}
          </div>

          <div className="card overflow-hidden">
            <ul className="divide-y divide-hairline">
              {assets.map((a) => {
                const meta = KIND[a.kind] ?? { label: a.kind, icon: Library };
                return (
                  <li key={a.id} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hairline bg-elevated text-accent-deep">
                      <meta.icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{meta.label}</p>
                      <Link href={`/projects/${a.project.id}`} className="truncate text-xs text-faint hover:text-accent-deep">
                        {a.project.productName}
                      </Link>
                    </div>
                    <div className="hidden text-right sm:block">
                      {a.width && a.height && <p className="font-mono text-xs text-muted">{a.width}×{a.height}</p>}
                      <p className="font-mono text-[11px] text-faint">{fmtBytes(a.bytes)}</p>
                    </div>
                    <span className="shrink-0 text-xs text-faint">{timeAgo(a.createdAt)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
