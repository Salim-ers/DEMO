import { cn } from "../../lib/cn.js";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** A fine film-grain overlay to add tactile depth over gradients/glass. */
export function NoiseLayer({ className, opacity = 0.05 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ opacity, backgroundImage: NOISE }}
    />
  );
}
