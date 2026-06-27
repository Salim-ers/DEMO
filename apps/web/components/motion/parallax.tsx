"use client";
import { type ReactNode, type ElementType } from "react";
import { gsap } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";

/**
 * Scroll parallax (transform-only). Positive `speed` drifts up as you scroll
 * past; use small values (8–28). No-ops under reduced motion.
 */
export function Parallax({
  children,
  className,
  speed = 16,
  as,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  as?: ElementType;
}) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useGsap<HTMLDivElement>((self, reduced) => {
    if (reduced) return;
    gsap.fromTo(
      self,
      { yPercent: speed },
      {
        yPercent: -speed,
        ease: "none",
        scrollTrigger: { trigger: self, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
