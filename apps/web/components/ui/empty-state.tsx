import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn.js";

/** Calm empty state: icon, title, one line, optional action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-elevated text-faint">
        <Icon size={20} />
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
