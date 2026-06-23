import * as React from "react";
import { cn } from "../../lib/cn.js";

type Tone = "neutral" | "accent" | "ok" | "warn" | "bad";
const TONES: Record<Tone, string> = {
  neutral: "bg-elevated text-muted border-hairline",
  accent: "bg-accent-soft text-accent border-accent/30",
  ok: "bg-ok/10 text-ok border-ok/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  bad: "bg-bad/10 text-bad border-bad/30",
};

export function Badge({ tone = "neutral", className, ...props }: { tone?: Tone } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
