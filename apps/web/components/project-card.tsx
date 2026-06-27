import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
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

/** Brand-aligned gradient pairs (caramel/brown core + a few rainbow accents). */
const GRADIENTS: [string, string][] = [
  ["#C99460", "#8B5E34"],
  ["#B9824A", "#7A4E2C"],
  ["#6BA579", "#3F7D59"],
  ["#0891B2", "#0E7490"],
  ["#D9694B", "#A8412E"],
  ["#8B6FB0", "#5E4488"],
  ["#C98A2E", "#9A6312"],
];

function gradientFor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length] ?? GRADIENTS[0]!;
}

export function ProjectCard({ p, index = 0 }: { p: ProjectCardData; index?: number }) {
  let host = p.url;
  try {
    host = new URL(p.url).host;
  } catch {
    /* keep raw */
  }

  const [from, to] = gradientFor(p.productName);
  const initial = p.productName.trim().charAt(0).toUpperCase() || "?";
  const isReady = p.status === "ready";

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group card animate-fade-up flex flex-col overflow-hidden p-0 transition-colors duration-200 hover:border-accent/30"
    >
      <Link href={`/projects/${p.id}`} className="relative block h-28 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.35), transparent 55%)" }} />
        <span className="pointer-events-none absolute -bottom-5 right-2 select-none text-[5.5rem] font-black leading-none text-white/15">{initial}</span>
        <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {p.format}
        </span>
        {isReady && (
          <span className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/92 shadow-sm transition-transform duration-200 group-hover:scale-110">
            <Play size={18} className="translate-x-[1px]" style={{ color: to }} fill={to} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
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
          <span className="text-[11px] text-faint">{timeAgo(p.updatedAt)}</span>
        </div>

        <Link
          href={`/projects/${p.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-elevated"
        >
          {isReady ? "Voir la vidéo" : "Ouvrir"} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
