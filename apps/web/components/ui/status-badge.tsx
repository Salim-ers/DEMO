import { cn } from "../../lib/cn.js";
import { prettyStatus } from "../../lib/format.js";

type Tone = "neutral" | "progress" | "ok" | "bad";

const TONES: Record<Tone, string> = {
  neutral: "bg-elevated text-muted border-hairline",
  progress: "bg-accent-soft text-accent-deep border-accent/30",
  ok: "bg-ok/10 text-ok border-ok/30",
  bad: "bg-bad/10 text-bad border-bad/30",
};

const STATUS_TONE: Record<string, Tone> = {
  draft: "neutral",
  capturing: "progress",
  storyboarding: "progress",
  rendering: "progress",
  queued: "progress",
  running: "progress",
  ready: "ok",
  succeeded: "ok",
  failed: "bad",
};

/** Pipeline status pill, in French, with a pulse while work is in flight. */
export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "neutral";
  const inFlight = tone === "progress";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {inFlight && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      )}
      {prettyStatus(status)}
    </span>
  );
}
