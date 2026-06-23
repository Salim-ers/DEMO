"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Archive, FolderOpen } from "lucide-react";
import { ProjectCard, type ProjectCardData } from "./project-card.js";
import { cn } from "../lib/cn.js";

type Filter = "all" | "draft" | "in_progress" | "ready" | "failed";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "draft", label: "Brouillons" },
  { id: "in_progress", label: "En cours" },
  { id: "ready", label: "Prêts" },
  { id: "failed", label: "Échecs" },
];

function matchesFilter(status: string, f: Filter) {
  if (f === "all") return true;
  if (f === "in_progress") return ["capturing", "storyboarding", "rendering"].includes(status);
  return status === f;
}

export function ProjectsBrowser({ projects }: { projects: ProjectCardData[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showArchived, setShowArchived] = useState(false);

  const archivedCount = projects.filter((p) => p.archived).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (showArchived !== Boolean(p.archived)) return false;
      if (!matchesFilter(p.status, filter)) return false;
      if (q && !(`${p.productName} ${p.url} ${p.mainPromise}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [projects, query, filter, showArchived]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un projet…"
            className="h-11 w-full rounded-xl border border-hairline bg-panel pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-accent/50"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
            showArchived ? "border-accent/40 bg-accent-soft text-accent-deep" : "border-hairline bg-panel text-muted hover:text-ink",
          )}
        >
          <Archive size={15} /> Archivés{archivedCount > 0 && <span className="text-faint">· {archivedCount}</span>}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === f.id ? "border-accent/40 bg-accent-soft text-accent-deep" : "border-hairline bg-panel text-muted hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-faint">
            {showArchived ? <Archive size={20} /> : <FolderOpen size={20} />}
          </span>
          <h3 className="text-base font-semibold text-ink">
            {showArchived ? "Aucun projet archivé" : query || filter !== "all" ? "Aucun projet ne correspond" : "Aucun projet pour l'instant"}
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted">
            {showArchived
              ? "Les projets que vous archivez apparaîtront ici."
              : query || filter !== "all"
                ? "Essayez un autre terme ou retirez les filtres."
                : "Lancez votre premier projet pour commencer."}
          </p>
          {!showArchived && !query && filter === "all" && (
            <Link href="/projects/new" className="btn-primary mt-5">
              <Plus size={16} /> Créer une démo
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
