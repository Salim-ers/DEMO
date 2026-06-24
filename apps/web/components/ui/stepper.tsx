import { cn } from "../../lib/cn.js";

/** Simple horizontal stepper for the new-demo form. */
export function Stepper({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                i < current
                  ? "border-accent bg-accent text-studio"
                  : i === current
                    ? "border-accent text-accent-deep"
                    : "border-hairline text-faint",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("hidden text-sm font-medium sm:inline", i <= current ? "text-ink" : "text-faint")}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && <span className={cn("h-px flex-1", i < current ? "bg-accent/50" : "bg-hairline")} />}
        </div>
      ))}
    </div>
  );
}
