import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/cn.js";

export interface StepCardProps {
  index: number;
  icon?: LucideIcon;
  title: string;
  text: string;
}

export function StepCard({ index, icon: Icon, title, text }: StepCardProps) {
  return (
    <div className={cn("card h-full p-7")}>
      <div className="flex items-center justify-between">
        {Icon ? (
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent-deep">
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
