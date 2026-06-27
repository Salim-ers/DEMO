"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";

/**
 * Subtle pointer tilt + bronze glare for a "real panel" feel. Pointer devices
 * only; no-ops under reduced motion. Keep `max` small (6–10deg) so it reads
 * premium, not gimmicky.
 */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const glare = useRef<HTMLSpanElement>(null);

  const ref = useGsap<HTMLDivElement>((self, reduced) => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const rxTo = gsap.quickTo(self, "rotateX", { duration: 0.4, ease: "power2.out" });
    const ryTo = gsap.quickTo(self, "rotateY", { duration: 0.4, ease: "power2.out" });
    gsap.set(self, { transformPerspective: 900, transformStyle: "preserve-3d" });

    const onMove = (e: PointerEvent) => {
      const r = self.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rxTo((0.5 - py) * max * 2);
      ryTo((px - 0.5) * max * 2);
      if (glare.current) gsap.set(glare.current, { background: `radial-gradient(120px circle at ${px * 100}% ${py * 100}%, rgba(246,231,204,0.16), transparent 60%)` });
    };
    const onLeave = () => {
      rxTo(0);
      ryTo(0);
      if (glare.current) gsap.to(glare.current, { background: "transparent", duration: 0.4 });
    };
    self.addEventListener("pointermove", onMove);
    self.addEventListener("pointerleave", onLeave);
    return () => {
      self.removeEventListener("pointermove", onMove);
      self.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`relative will-change-transform ${className ?? ""}`}>
      {children}
      <span ref={glare} aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" />
    </div>
  );
}
