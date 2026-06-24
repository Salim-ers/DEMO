"use client";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/cn.js";

type Variant = "primary" | "secondary";

/**
 * Premium CTA with a soft magnetic pull toward the cursor and an aurora glow.
 * Renders as a link when `href` is set, otherwise a button.
 */
export function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18 });
  const y = useSpring(my, { stiffness: 260, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  const base =
    variant === "primary"
      ? "text-white shadow-glow"
      : "border border-hairline bg-surface text-ink backdrop-blur-md hover:border-accent/40";

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-medium transition-colors",
        base,
        className,
      )}
    >
      {variant === "primary" && <span className="absolute inset-0 -z-10 bg-aurora bg-[length:200%_200%] animate-gradient-pan" />}
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}
