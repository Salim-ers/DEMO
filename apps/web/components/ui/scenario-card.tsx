"use client";

import { useState } from "react";
import { Check, Copy, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn.js";

export interface ScenarioCardProps {
  title: string;
  desc?: string;
  script: string;
  className?: string;
}

export function ScenarioCard({ title, desc, script, className }: ScenarioCardProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const Icon: LucideIcon = copied ? Check : Copy;

  return (
    <div className={cn("card flex h-full flex-col p-7", className)}>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {desc ? <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p> : null}

      <p className="mt-5 rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted">
        {script}
      </p>

      <button type="button" onClick={copy} className="btn-secondary mt-5 self-start">
        <Icon className="h-4 w-4" aria-hidden />
        {copied ? "Copié !" : "Copier le scénario"}
      </button>
    </div>
  );
}
