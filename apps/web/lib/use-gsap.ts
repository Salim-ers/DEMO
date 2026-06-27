"use client";
import { useLayoutEffect, useEffect, useRef, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "./gsap.js";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scoped GSAP effect with automatic cleanup. The callback runs inside a
 * `gsap.context()` bound to the returned ref, so every tween / ScrollTrigger it
 * creates is reverted on unmount (and on dep change). Reduced-motion is honored
 * by the caller via the `reduced` flag passed in.
 *
 *   const ref = useGsap((self, reduced) => { ... }, []);
 *   return <section ref={ref}>…</section>;
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (self: T, reduced: boolean) => void,
  deps: unknown[] = [],
): RefObject<T> {
  const scope = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => setup(el, reduced), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return scope;
}
