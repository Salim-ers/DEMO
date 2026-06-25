import { Check, X } from "lucide-react";
import { cn } from "../../lib/cn.js";

export interface BeforeAfterProps {
  before: string[];
  after: string[];
  className?: string;
}

export function BeforeAfter({ before, after, className }: BeforeAfterProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2", className)}>
      <div className="card p-7">
        <h3 className="text-lg font-semibold text-faint">Avant Studio One</h3>
        <ul className="mt-5 space-y-3">
          {before.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-accent/30 p-7">
        <h3 className="text-lg font-semibold text-ink">Après Studio One</h3>
        <ul className="mt-5 space-y-3">
          {after.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
