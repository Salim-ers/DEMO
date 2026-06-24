"use client";
import { motion } from "framer-motion";
import { Camera, Clapperboard, Mic, Sparkles, Play, Check, Captions } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const FRAMES = [
  "from-brown/70 to-caramel/40",
  "from-caramel/70 to-gold/40",
  "from-gold/60 to-brown/40",
  "from-brown/60 to-gold/40",
  "from-caramel/60 to-brown/40",
  "from-gold/70 to-caramel/40",
  "from-brown/70 to-caramel/40",
  "from-caramel/60 to-gold/40",
];

// Deterministic-looking audio waveform (no Math.random — stable on SSR).
const WAVE = Array.from({ length: 56 }, (_, i) => 30 + Math.round(60 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.21))));

function FloatingBadge({
  icon: Icon,
  label,
  className,
  delay,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={cn("absolute z-30", className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        className="border-gradient flex items-center gap-2.5 rounded-2xl border border-hairline bg-canvas/70 py-2.5 pl-2.5 pr-4 shadow-soft backdrop-blur-2xl"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-aurora text-canvas shadow-glow">
          <Icon size={16} />
        </span>
        <span className="text-[13px] font-semibold text-ink">{label}</span>
      </motion.div>
    </motion.div>
  );
}

/** The Studio One hero visual — a premium editor with depth, timeline tracks,
 *  audio, captions and floating callouts. */
export function StudioOneHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" style={{ perspective: "1600px" }}>
      {/* depth glows */}
      <div aria-hidden className="absolute -inset-16 -z-10">
        <div className="absolute left-[8%] top-[6%] h-72 w-72 rounded-full bg-caramel/30 blur-[120px]" />
        <div className="absolute bottom-[2%] right-[6%] h-72 w-72 rounded-full bg-gold/25 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brown/30 blur-[130px]" />
      </div>

      <FloatingBadge icon={Camera} label="Real product capture" className="-left-4 top-10 sm:-left-16" delay={0.5} />
      <FloatingBadge icon={Clapperboard} label="Cinematic storyboard" className="-right-3 top-28 sm:-right-20" delay={0.9} />
      <FloatingBadge icon={Mic} label="Human voice-ready" className="-left-3 bottom-24 sm:-left-20" delay={1.3} />
      <FloatingBadge icon={Sparkles} label="4K export" className="-right-2 bottom-10 sm:-right-14" delay={1.7} />

      {/* studio window */}
      <motion.div
        initial={{ opacity: 0, rotateY: -16, rotateX: 8, y: 30 }}
        animate={{ opacity: 1, rotateY: -9, rotateX: 5, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotateY: -4, rotateX: 2 }}
        style={{ transformStyle: "preserve-3d" }}
        className="border-gradient relative overflow-hidden rounded-[1.7rem] border border-hairline bg-canvas-soft/80 p-3 shadow-soft backdrop-blur-2xl"
      >
        {/* title bar */}
        <div className="flex items-center gap-2.5 px-2 py-2">
          <LogoMark size={22} />
          <span className="display text-sm font-semibold text-ink">Studio One</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[11px] font-medium text-ok">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-ok" /> Rendering
          </span>
        </div>

        {/* preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-hairline bg-canvas">
          <div className="absolute inset-0 bg-aurora opacity-30" />
          <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_28%,rgba(255,244,228,0.2),transparent_62%)]" />
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute left-1/2 top-1/2 flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-canvas shadow-glow-lg"
          >
            <Play size={26} className="ml-1 fill-current" />
          </motion.span>
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-cream backdrop-blur">
            acme.app — onboarding flow
          </span>
          <span className="absolute bottom-3 right-3 rounded-md bg-black/45 px-2 py-0.5 font-mono text-[11px] text-cream backdrop-blur">
            1080p · 16:9
          </span>
          <span className="absolute bottom-3 left-3 max-w-[60%] rounded-md bg-black/55 px-2.5 py-1 text-[12px] font-medium text-cream backdrop-blur">
            "Connect your stack in under a minute."
          </span>
        </div>

        {/* timeline */}
        <div className="mt-3 space-y-2 rounded-2xl border border-hairline bg-surface p-3">
          {/* ruler + playhead */}
          <div className="relative mb-1 h-3">
            <div className="absolute inset-x-0 top-1/2 flex justify-between">
              {Array.from({ length: 13 }).map((_, i) => (
                <span key={i} className={cn("w-px bg-hairline", i % 4 === 0 ? "h-3" : "h-1.5")} />
              ))}
            </div>
            <motion.div
              className="absolute top-0 z-10 h-full"
              initial={{ left: "10%" }}
              animate={{ left: ["10%", "82%", "10%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="block h-full w-0.5 bg-gold shadow-[0_0_10px_rgba(216,164,96,0.8)]" />
              <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-gold" />
            </motion.div>
          </div>

          {/* video track */}
          <div className="flex items-center gap-1.5">
            <Clapperboard size={13} className="shrink-0 text-faint" />
            <div className="flex flex-1 gap-1">
              {FRAMES.map((g, i) => (
                <div key={i} className={cn("h-8 flex-1 rounded-md border border-hairline bg-gradient-to-br", g)} />
              ))}
            </div>
          </div>

          {/* audio track */}
          <div className="flex items-center gap-1.5">
            <Mic size={13} className="shrink-0 text-faint" />
            <div className="flex h-7 flex-1 items-center gap-[2px] rounded-md border border-hairline bg-canvas/50 px-2">
              {WAVE.map((h, i) => (
                <span key={i} className="w-[2px] rounded-full bg-caramel/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* captions track */}
          <div className="flex items-center gap-1.5">
            <Captions size={13} className="shrink-0 text-faint" />
            <div className="flex flex-1 gap-1.5">
              <div className="h-5 w-1/3 rounded-md border border-gold/30 bg-gold/10" />
              <div className="h-5 w-1/4 rounded-md border border-gold/30 bg-gold/10" />
              <div className="h-5 flex-1 rounded-md border border-gold/30 bg-gold/10" />
            </div>
          </div>

          {/* nodes */}
          <div className="flex items-center justify-between pt-1">
            {["Capture", "Storyboard", "Voice", "Render"].map((n, i) => (
              <div key={n} className="flex items-center gap-1.5 text-[10px] font-medium text-faint">
                <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", i < 3 ? "bg-accent text-canvas" : "border border-hairline")}>
                  {i < 3 && <Check size={9} strokeWidth={3} />}
                </span>
                {n}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
