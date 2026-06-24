"use client";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn.js";
import { fadeUp, cardHover } from "../../lib/motion.js";

/**
 * A bento showcase tile: gradient visual area, glow, an icon chip, copy, and a
 * hover lift. The `visual` slot holds a mini-mockup; falls back to a glyph.
 */
export function ProductShowcaseCard({
  step,
  icon: Icon,
  title,
  text,
  accent = "violet",
  visual,
  className,
}: {
  step?: string;
  icon: LucideIcon;
  title: string;
  text: string;
  accent?: "violet" | "blue" | "cyan" | "pink";
  visual?: ReactNode;
  className?: string;
}) {
  const glowBg: Record<string, string> = {
    violet: "bg-violet/25",
    blue: "bg-blue/25",
    cyan: "bg-cyan/25",
    pink: "bg-pink/25",
  };
  return (
    <motion.div
      variants={fadeUp}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className={cn("border-gradient group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-panel p-7 shadow-panel backdrop-blur-xl", className)}
    >
      <div aria-hidden className={cn("pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80", glowBg[accent], "opacity-50")} />

      <div className="relative flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-hairline bg-surface text-ink backdrop-blur-md">
          <Icon size={20} />
        </span>
        {step && <span className="font-mono text-xs text-faint">{step}</span>}
      </div>

      <h3 className="display relative mt-6 text-xl font-semibold text-ink">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted">{text}</p>

      {/* Visual area / mini-mockup */}
      <motion.div
        variants={cardHover}
        className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-hairline bg-canvas/60"
      >
        {visual ?? (
          <div className="absolute inset-0 grid place-items-center bg-aurora-soft">
            <Icon size={34} className="text-ink/70" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
