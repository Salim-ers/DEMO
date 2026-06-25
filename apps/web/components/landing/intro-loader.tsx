"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const BADGE_CREAM = "/brand/studio-one-badge-cream.png";
const EASE = [0.16, 1, 0.3, 1] as const;

// Plays once per full page load (resets on hard reload, not on client navigation).
let introPlayed = false;

/** Cinematic intro: the beige badge rolls in from the left, then a clapperboard claps, and we cut to the site. */
export function IntroLoader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduce || introPlayed) return;
    introPlayed = true;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => setShow(false), 3300);
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

          <div className="relative flex flex-col items-center gap-12">
            {/* Le rond beige roule de la gauche jusqu'au centre */}
            <motion.img
              src={BADGE_CREAM}
              alt="Studio One"
              className="h-[200px] w-[200px] object-contain drop-shadow-[0_30px_80px_rgba(0,0,0,0.65)] sm:h-[230px] sm:w-[230px]"
              initial={{ x: "-66vw", rotate: -720, scale: 0.85, opacity: 0 }}
              animate={{ x: 0, rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.05, ease: EASE, opacity: { duration: 0.3 } }}
            />

            {/* Clap de cinéma */}
            <motion.div
              className="overflow-visible"
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5, ease: EASE }}
            >
              <Clapperboard />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Clapperboard() {
  // Diagonal stripes confined to the clapstick rect (x18..202, y88..114).
  const stripes = Array.from({ length: 9 }, (_, i) => 30 + i * 24);
  return (
    <svg
      width="216"
      height="212"
      viewBox="0 0 220 216"
      fill="none"
      aria-hidden
      className="overflow-visible drop-shadow-[0_24px_55px_rgba(0,0,0,0.6)]"
    >
      <defs>
        <linearGradient id="so-slate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#211711" />
          <stop offset="1" stopColor="#120C07" />
        </linearGradient>
        <clipPath id="so-stick">
          <rect x="18" y="88" width="184" height="26" rx="7" />
        </clipPath>
      </defs>

      {/* Ardoise */}
      <rect x="18" y="116" width="184" height="84" rx="14" fill="url(#so-slate)" stroke="#B9824A" strokeWidth="2.5" />
      <text
        x="110"
        y="150"
        textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="3"
        fill="#FFF7EC"
        opacity="0.92"
      >
        STUDIO ONE
      </text>
      <line x1="38" y1="170" x2="182" y2="170" stroke="rgba(255,247,236,0.16)" strokeWidth="3" strokeLinecap="round" />
      <line x1="38" y1="186" x2="132" y2="186" stroke="rgba(255,247,236,0.16)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="170" cy="186" r="5" fill="#B9824A" />

      {/* Charnière */}
      <circle cx="22" cy="114" r="4" fill="#B9824A" />

      {/* Barre claquante : pivote autour de la charnière (bas-gauche) */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
        initial={{ rotate: -24 }}
        animate={{ rotate: [-24, 0, -6, 0] }}
        transition={{ delay: 1.75, duration: 0.6, times: [0, 0.55, 0.8, 1], ease: "easeOut" }}
      >
        <rect x="18" y="88" width="184" height="26" rx="7" fill="#FFF7EC" />
        <g clipPath="url(#so-stick)" fill="#7A4C2A">
          {stripes.map((x) => (
            <polygon key={x} points={`${x},88 ${x + 12},88 ${x - 6},114 ${x - 18},114`} />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
