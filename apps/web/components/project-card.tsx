import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "./ui/badge.js";
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
}

export function ProjectCard({ p }: { p: ProjectCardData }) {
  let host = p.url;
  try {
    host = new URL(p.url).host;
  } catch {
    /* keep raw */
  }
  return (
    <Link
      href={`/projects/${p.id}`}
      className="group card animate-fade-up p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-tighter text-ink">{p.productName}</h3>
          <p className="mt-0.5 truncate font-mono text-xs text-faint">{host}</p>
        </div>
        <ArrowUpRight size={16} className="shrink-0 text-faint transition-colors group-hover:text-accent" />
      </div>

      <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-muted">{p.mainPromise}</p>

      <div className="flex items-center justify-between">
        <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>
          {p.status !== "draft" && p.status !== "ready" && p.status !== "failed" ? (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ) : null}
          {prettyStatus(p.status)}
        </Badge>
        <span className="font-mono text-[11px] text-faint">
          {p.format} · {timeAgo(p.updatedAt)}
        </span>
      </div>
    </Link>
  );
}
