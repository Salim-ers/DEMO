import Link from "next/link";
import { ArrowRight, Play, Clock } from "lucide-react";
import { StatusBadge } from "./ui/status-badge.js";
import { ProjectActionsMenu } from "./project-actions.js";
import { timeAgo } from "../lib/format.js";

export interface ProjectCardData {
  id: string;
  productName: string;
  url: string;
  mainPromise: string;
  format: string;
  durationSeconds?: number;
  status: string;
  updatedAt: string;
  archived?: boolean;
}

/** Warm gradient pairs (bronze / amber / terracotta / olive-gold) — one family. */
const GRADIENTS: [string, string][] = [
  ["#E3B36D", "#A96D33"],
  ["#C68642", "#7A4A22"],
  ["#D9A441", "#9A6312"],
  ["#C98A6A", "#8B4E2C"],
  ["#B8894E", "#6E4A22"],
  ["#D9694B", "#A8412E"],
  ["#A8A06A", "#6E6A3A"],
];

function gradientFor(name: string): [string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length] ?? GRADIENTS[0]!;
}

function durationLabel(s?: number): string | null {
  if (!s) return null;
  return s >= 180 ? "3 min" : `${s} s`;
}

const IN_PROGRESS = ["capturing", "storyboarding", "rendering"];

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
  const isWorking = IN_PROGRESS.includes(p.status);
  const duration = durationLabel(p.durationSeconds);

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group card animate-fade-up flex flex-col overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-glow"
    >
      <Link href={`/projects/${p.id}`} className="relative block h-32 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.35), transparent 55%)" }} />
        {/* film-strip texture */}
        <div aria-hidden className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 18px)" }} />
        <span className="pointer-events-none absolute -bottom-5 right-2 select-none text-[5.5rem] font-black leading-none text-white/15">{initial}</span>

        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90 backdrop-blur-sm">
          {p.format}
        </span>
        {duration && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
            <Clock size={10} /> {duration}
          </span>
        )}
        {isReady && (
          <span className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/92 shadow-sm transition-transform duration-200 group-hover:scale-110">
            <Play size={18} className="translate-x-[1px]" style={{ color: to }} fill={to} />
          </span>
        )}
        {isWorking && (
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-black/30">
            <span className="absolute inset-y-0 w-1/3 animate-scan-x bg-white/70" />
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
          {isReady ? "Voir la vidéo" : isWorking ? "Suivre la production" : "Continuer"} <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
