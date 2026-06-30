import { cn } from "../../lib/cn.js";

/**
 * Animated aurora background — replaces the static grid. Slow-drifting bronze →
 * champagne glows over a deep warm-black base, with a faint travelling sheen.
 * Fully CSS-driven (GPU transforms) and disabled under `prefers-reduced-motion`
 * via Tailwind's `motion-safe` variant. Decorative only (`aria-hidden`).
 *
 * `variant="hero"` is rich (for the hero / full-bleed sections); `variant="soft"`
 * is a calmer wash for content sections that should feel alive, not busy.
 */
export function AnimatedBackground({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "soft";
  className?: string;
}) {
  const hero = variant === "hero";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Deep base wash (hero only — soft layers over the section's own bg) */}
      {hero && (
        <div className="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_-10%,#0F0C09_0%,#070504_52%,#030201_100%)]" />
      )}

      {/* Drifting aurora blobs */}
      <div
        className={cn(
          "absolute -top-48 left-[18%] rounded-full blur-3xl will-change-transform motion-safe:animate-drift-1",
          hero ? "h-[46rem] w-[46rem] opacity-90" : "h-[34rem] w-[34rem] opacity-50",
        )}
        style={{ background: "radial-gradient(closest-side, rgba(198,134,66,0.34), transparent 70%)" }}
      />
      <div
        className={cn(
          "absolute top-[22%] right-[-6%] rounded-full blur-3xl will-change-transform motion-safe:animate-drift-2",
          hero ? "h-[40rem] w-[40rem] opacity-80" : "h-[30rem] w-[30rem] opacity-45",
        )}
        style={{ background: "radial-gradient(closest-side, rgba(227,179,109,0.26), transparent 70%)" }}
      />
      <div
        className={cn(
          "absolute -bottom-40 left-[-8%] rounded-full blur-3xl will-change-transform motion-safe:animate-drift-3",
          hero ? "h-[38rem] w-[38rem] opacity-80" : "h-[28rem] w-[28rem] opacity-40",
        )}
        style={{ background: "radial-gradient(closest-side, rgba(139,94,52,0.30), transparent 70%)" }}
      />

      {/* Travelling sheen */}
      <div
        className="absolute inset-0 bg-[length:220%_220%] opacity-[0.06] motion-safe:animate-hue-pan"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 32%, rgba(246,231,204,1) 50%, transparent 68%)",
        }}
      />

      {/* Vignette to keep edges deep and text readable */}
      <div
        className={cn(
          "absolute inset-0",
          hero
            ? "bg-[radial-gradient(80%_70%_at_50%_35%,transparent,rgba(3,2,1,0.72))]"
            : "bg-[radial-gradient(85%_75%_at_50%_40%,transparent,rgba(3,2,1,0.45))]",
        )}
      />
    </div>
  );
}
