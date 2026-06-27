"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Central GSAP setup. Plugins are registered once, on the client only. Every
 * animated component imports `gsap` / `ScrollTrigger` / `SplitText` from here so
 * registration is guaranteed and we never double-register.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // One cinematic easing vocabulary for the whole app: expo.out = a fast,
  // confident start that brakes slowly. Never linear, never bouncy.
  gsap.defaults({ ease: "expo.out", duration: 0.6 });
}

/** Premium easing language. expo.out is the house default; keep exits faster. */
export const EASE = "expo.out";
export const EASE_OUT = "power4.out";
export const EASE_INOUT = "power2.inOut";
/** Tasteful overshoot, reserved for toggles / icon pops (not page reveals). */
export const EASE_POP = "back.out(1.6)";

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText };
