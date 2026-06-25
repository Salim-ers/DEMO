"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BADGE_CREAM = "/brand/studio-one-badge-cream.png";
const EASE = [0.16, 1, 0.3, 1] as const;

// Plays once per full page load (resets on hard reload, not on client navigation).
let introPlayed = false;

/** Cinematic intro: the beige badge rolls in from the left, then a big clapperboard claps and we cut to the site. */
export function IntroLoader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce || introPlayed) return;
    introPlayed = true;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          onClick={() => setShow(false)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(44% 44% at 50% 48%, rgba(185,130,74,0.20) 0%, transparent 70%)" }}
          />

          <div className="relative flex flex-col items-center gap-10">
            {/* Le rond beige ROULE de la gauche jusqu'au centre */}
            <motion.img
              src={BADGE_CREAM}
              alt="Studio One"
              className="h-[210px] w-[210px] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:h-[240px] sm:w-[240px]"
              initial={{ x: "-66vw", rotate: -720, scale: 0.85, opacity: 0 }}
              animate={{ x: 0, rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.05, ease: EASE, opacity: { duration: 0.3 } }}
            />

            {/* Clap de cinéma — grand & stylé */}
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.85 }}
              animate={{ opacity: 1, y: [18, 0, 0, 3, 0], scale: 1 }}
              transition={{ delay: 1.45, duration: 0.9, times: [0, 0.3, 0.62, 0.72, 0.82], ease: "easeOut" }}
            >
              <Clapperboard />
            </motion.div>
          </div>

          {/* Flash au moment du clap */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ delay: 2.0, duration: 0.4, times: [0, 0.3, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Clapperboard() {
  const stripes = Array.from({ length: 7 }, (_, i) => 28 + i * 26);
  return (
    <svg width="200" height="172" viewBox="0 0 200 172" fill="none" aria-hidden className="drop-shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
      <defs>
        <linearGradient id="slate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E140C" />
          <stop offset="1" stopColor="#120C07" />
        </linearGradient>
        <clipPath id="stick">
          <rect x="14" y="34" width="172" height="28" rx="8" />
        </clipPath>
      </defs>

      {/* Ardoise */}
      <rect x="14" y="68" width="172" height="92" rx="14" fill="url(#slate)" stroke="#B9824A" strokeWidth="2.5" />
      <text x="100" y="104" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="15" fontWeight="700" letterSpacing="3" fill="#FFF7EC" opacity="0.92">
        STUDIO ONE
      </text>
      <line x1="34" y1="124" x2="166" y2="124" stroke="rgba(255,247,236,0.16)" strokeWidth="3" strokeLinecap="round" />
      <line x1="34" y1="140" x2="120" y2="140" stroke="rgba(255,247,236,0.16)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="156" cy="140" r="5" fill="#B9824A" />

      {/* Barre claquante (charnière à gauche) */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
        initial={{ rotate: -36 }}
        animate={{ rotate: [-36, 0, -8, 0] }}
        transition={{ delay: 1.78, duration: 0.62, times: [0, 0.5, 0.78, 1], ease: "easeOut" }}
      >
        <rect x="14" y="34" width="172" height="28" rx="8" fill="#FFF7EC" />
        <g clipPath="url(#stick)" fill="#7A4C2A">
          {stripes.map((x) => (
            <polygon key={x} points={`${x},34 ${x + 14},34 ${x - 8},62 ${x - 22},62`} />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
