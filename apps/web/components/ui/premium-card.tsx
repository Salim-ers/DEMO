"use client";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";
import { cardHover } from "../../lib/motion.js";

/** Glass card with a gradient hairline, optional aurora glow, and hover lift. */
export function PremiumCard({
  children,
  className,
  glow = false,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}) {
  return (
    <motion.div
      variants={interactive ? cardHover : undefined}
      initial="rest"
      whileHover={interactive ? "hover" : undefined}
      animate="rest"
      className={cn("border-gradient relative overflow-hidden rounded-3xl border border-hairline bg-panel p-6 shadow-panel backdrop-blur-xl", className)}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet/20 blur-3xl"
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
