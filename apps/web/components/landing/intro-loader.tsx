"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WORDMARK_BROWN = "/brand/studio-one-wordmark-brown.png";
const EASE = [0.22, 1, 0.36, 1] as const;

// Plays once per full page load (resets on hard reload, not on client navigation).
let introPlayed = false;

/** Cinematic intro: the beige disc flies in, the wordmark writes itself, a clapperboard claps, then we cut to the site. */
export function IntroLoader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce || introPlayed) return;
    introPlayed = true;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 2800);
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
            style={{ background: "radial-gradient(42% 42% at 50% 50%, rgba(185,130,74,0.18) 0%, transparent 70%)" }}
          />

          <div className="relative flex flex-col items-center">
            {/* Rond beige : arrive de la gauche jusqu'au centre */}
            <motion.div
              className="relative grid h-[210px] w-[210px] place-items-center rounded-full bg-cream shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
              initial={{ x: "-64vw", scale: 0.7, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.15 }}
            >
              {/* Écriture « Studio One » : révélée en balayage gauche → droite (avec la barre sous One) */}
              <motion.img
                src={WORDMARK_BROWN}
                alt="Studio One"
                className="w-[66%] object-contain"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ delay: 1, duration: 0.75, ease: EASE }}
              />
            </motion.div>

            {/* Clap de cinéma */}
            <motion.div
              className="mt-9"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.55, duration: 0.35, ease: EASE }}
            >
              <Clapperboard />
            </motion.div>
          </div>

          {/* Flash au moment du clap */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ delay: 1.98, duration: 0.36, times: [0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Clapperboard() {
  const stripes = Array.from({ length: 6 }, (_, i) => 14 + i * 17);
  return (
    <svg width="108" height="96" viewBox="0 0 120 106" fill="none" aria-hidden>
      {/* Ardoise */}
      <rect x="10" y="40" width="100" height="58" rx="8" fill="#1A130D" stroke="#B9824A" strokeWidth="2" />
      <line x1="24" y1="60" x2="96" y2="60" stroke="rgba(255,247,236,0.30)" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="74" x2="78" y2="74" stroke="rgba(255,247,236,0.18)" strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="88" x2="88" y2="88" stroke="rgba(255,247,236,0.18)" strokeWidth="3" strokeLinecap="round" />

      {/* Barre claquante (charnière à gauche) */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
        initial={{ rotate: -34 }}
        animate={{ rotate: [-34, 0, -7, 0] }}
        transition={{ delay: 1.85, duration: 0.6, times: [0, 0.5, 0.78, 1], ease: "easeOut" }}
      >
        <defs>
          <clipPath id="stickClip">
            <rect x="10" y="20" width="100" height="17" rx="4" />
          </clipPath>
        </defs>
        <rect x="10" y="20" width="100" height="17" rx="4" fill="#FFF7EC" />
        <g clipPath="url(#stickClip)" fill="#8B5E34">
          {stripes.map((x) => (
            <polygon key={x} points={`${x},20 ${x + 9},20 ${x - 4},37 ${x - 13},37`} />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
