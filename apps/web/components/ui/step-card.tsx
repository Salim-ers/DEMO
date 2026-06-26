import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/cn.js";

export interface StepCardProps {
  index: number;
  icon?: LucideIcon;
  title: string;
  text: string;
  /** Optional rainbow accent for the icon chip, as "r,g,b". Falls back to caramel. */
  accent?: string;
}

export function StepCard({ index, icon: Icon, title, text, accent }: StepCardProps) {
  const chip = accent
    ? { style: { background: `rgba(${accent},0.12)`, color: `rgb(${accent})` }, className: "" }
    : { style: undefined, className: "bg-accent/12 text-accent-deep" };
  return (
    <div className={cn("card h-full p-7")}>
      <div className="flex items-center justify-between">
        {Icon ? (
          <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl", chip.className)} style={chip.style}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
        ) : (
          <span aria-hidden="true" />
        )}
        <span className="text-2xl font-bold text-faint">{`0${index}`}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}
