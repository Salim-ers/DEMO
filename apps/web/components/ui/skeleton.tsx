import { cn } from "../../lib/cn.js";

/** Shimmering placeholder for premium loading states. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-elevated", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-ivory/60 to-transparent" />
    </div>
  );
}
