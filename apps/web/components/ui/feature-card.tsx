import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/cn.js";

export interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  text: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, text, className }: FeatureCardProps) {
  return (
    <div className={cn("card h-full p-7 transition-colors hover:border-accent/30", className)}>
      {Icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent-deep">
          <Icon size={22} />
        </div>
      ) : null}
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}
