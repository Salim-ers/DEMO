"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Reveal a block on scroll (fade + lift), once. Respects reduced motion. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Staggered group for grids/lists. Use <RevealItem> for children. */
export function RevealGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : container}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : item}>
      {children}
    </motion.div>
  );
}

/** Hero entrance — plays on load (not on scroll), staggered children. */
export function HeroStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "show"}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className, blur = false }: { children: React.ReactNode; className?: string; blur?: boolean }) {
  const reduce = useReducedMotion();
  const hidden = blur ? { opacity: 0, y: 30, filter: "blur(10px)" } : { opacity: 0, y: 30 };
  const show = blur
    ? { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } }
    : { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } };
  return (
    <motion.div className={className} variants={reduce ? undefined : { hidden, show }}>
      {children}
    </motion.div>
  );
}
