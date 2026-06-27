"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** Thin, smooth reading-progress bar at the very top of the marketing pages. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent"
    />
  );
}
