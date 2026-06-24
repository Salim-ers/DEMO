import type { Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + lift — the workhorse entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/** Parent that staggers its animated children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
};

/** Hero headline — rise from a clipped mask (use with overflow-hidden parent). */
export const heroTextReveal: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

/** Card hover lift (spring). Use as `whileHover="hover"` with these variants. */
export const cardHover: Variants = {
  rest: { y: 0 },
  hover: { y: -8, transition: { type: "spring", stiffness: 320, damping: 22 } },
};

/** Gentle perpetual float for decorative elements. */
export const slowFloat: Variants = {
  animate: { y: [0, -10, 0], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } },
};

/** Shared `whileInView` viewport config — fire once, a bit before fully in view. */
export const viewportOnce = { once: true, amount: 0.2 } as const;
