import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "./ui/status-badge.js";
import { ProjectActionsMenu } from "./project-actions.js";
import { timeAgo } from "../lib/format.js";

export interface ProjectCardData {
  id: string;
  productName: string;
  url: string;
  mainPromise: string;
  format: string;
  status: string;
  updatedAt: string;
  archived?: boolean;
}

export function ProjectCard({ p, index = 0 }: { p: ProjectCardData; index?: number }) {
  let host = p.url;
  try {
    host = new URL(p.url).host;
  } catch {
    /* keep raw */
  }

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group card animate-fade-up flex flex-col p-5 transition-colors duration-200 hover:border-accent/30"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <Link href={`/projects/${p.id}`} className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-deep">
            {p.productName}
          </h3>
          <p className="mt-0.5 truncate text-xs text-faint">{host}</p>
        </Link>
        <ProjectActionsMenu id={p.id} name={p.productName} archived={p.archived} />
      </div>

      <Link href={`/projects/${p.id}`} className="block flex-1">
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted">{p.mainPromise}</p>
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <StatusBadge status={p.status} />
        <span className="text-[11px] text-faint">
          {p.format} · {timeAgo(p.updatedAt)}
        </span>
      </div>

      <Link
        href={`/projects/${p.id}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-elevated"
      >
        Ouvrir <ArrowRight size={15} />
      </Link>
    </div>
  );
}
