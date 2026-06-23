import Link from "next/link";
import { Badge } from "./ui/badge.js";
import { ProjectActionsMenu } from "./project-actions.js";
import { timeAgo, prettyStatus } from "../lib/format.js";

type Tone = "neutral" | "accent" | "ok" | "warn" | "bad";
const STATUS_TONE: Record<string, Tone> = {
  draft: "neutral",
  capturing: "accent",
  storyboarding: "accent",
  rendering: "accent",
  ready: "ok",
  failed: "bad",
};

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
  const inFlight = p.status !== "draft" && p.status !== "ready" && p.status !== "failed";

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group card animate-fade-up p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft"
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <Link href={`/projects/${p.id}`} className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold tracking-tighter text-ink transition-colors group-hover:text-accent-deep">
            {p.productName}
          </h3>
          <p className="mt-0.5 truncate font-mono text-xs text-faint">{host}</p>
        </Link>
        <ProjectActionsMenu id={p.id} name={p.productName} archived={p.archived} />
      </div>

      <Link href={`/projects/${p.id}`} className="block">
        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted">{p.mainPromise}</p>
      </Link>

      <div className="flex items-center justify-between">
        <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>
          {inFlight && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          )}
          {prettyStatus(p.status)}
        </Badge>
        <span className="font-mono text-[11px] text-faint">
          {p.format} · {timeAgo(p.updatedAt)}
        </span>
      </div>
    </div>
  );
}
