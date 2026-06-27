"use client";
import { type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, EASE } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Vertical lift distance (px). */
  y?: number;
  /** Stagger direct children instead of revealing the block as one. */
  stagger?: boolean;
  delay?: number;
};

/**
 * GSAP scroll reveal. Reveals the block (or staggers its direct children) on
 * scroll-in, once. Falls back to instantly visible under reduced motion.
 */
export function Reveal({ children, className, as, y = 26, stagger = false, delay = 0 }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useGsap<HTMLDivElement>((self, reduced) => {
    if (reduced) return;
    const targets = stagger ? Array.from(self.children) : [self];
    gsap.from(targets, {
      y,
      opacity: 0,
      duration: 0.85,
      ease: EASE,
      delay,
      stagger: stagger ? 0.09 : 0,
      scrollTrigger: { trigger: self, start: "top 85%", once: true },
    });
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Re-sync ScrollTrigger after async content / images settle. */
export function refreshScrollTriggers() {
  if (typeof window !== "undefined") ScrollTrigger.refresh();
}
