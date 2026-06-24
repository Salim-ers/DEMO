"use client";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";

export type MotionTab = { id: string; label: string };

/** Segmented control with a sliding gradient indicator (shared layoutId). */
export function MotionTabs({
  tabs,
  value,
  onChange,
  layoutId = "motion-tabs",
  className,
}: {
  tabs: MotionTab[];
  value: string;
  onChange: (id: string) => void;
  layoutId?: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-full border border-hairline bg-surface p-1 backdrop-blur-md", className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active ? "text-white" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="absolute inset-0 -z-10 rounded-full bg-aurora bg-[length:200%_200%] animate-gradient-pan shadow-glow"
              />
            )}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
