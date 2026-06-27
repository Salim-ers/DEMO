"use client";
import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";

/**
 * Magnetic hover: the child eases toward the cursor while hovered, springs back
 * on leave. Pointer devices only; no-ops under reduced motion. Wrap a button/CTA.
 */
export function Magnetic({ children, className, strength = 0.4 }: { children: ReactNode; className?: string; strength?: number }) {
  const inner = useRef<HTMLSpanElement>(null);

  const ref = useGsap<HTMLSpanElement>((self, reduced) => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const target = inner.current ?? self;
    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = self.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    self.addEventListener("pointermove", onMove);
    self.addEventListener("pointerleave", onLeave);
    return () => {
      self.removeEventListener("pointermove", onMove);
      self.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`}>
      <span ref={inner} className="inline-flex will-change-transform">
        {children}
      </span>
    </span>
  );
}

export { prefersReducedMotion };
