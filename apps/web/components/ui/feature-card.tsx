import type { LucideIcon } from "lucide-react";

import { cn } from "../../lib/cn.js";

export interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  text: string;
  /** Optional rainbow accent for the icon chip, as "r,g,b". Falls back to caramel. */
  accent?: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, text, accent, className }: FeatureCardProps) {
  const chip = accent
    ? { style: { background: `rgba(${accent},0.12)`, color: `rgb(${accent})` }, className: "" }
    : { style: undefined, className: "bg-accent/12 text-accent-deep" };
  return (
    <div className={cn("card h-full p-7 transition-colors hover:border-accent/30", className)}>
      {Icon ? (
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", chip.className)} style={chip.style}>
          <Icon size={22} />
        </div>
      ) : null}
      <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  );
}
