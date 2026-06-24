"use client";
import { motion } from "framer-motion";
import { Camera, LayoutPanelTop, Mic, Clapperboard, Play, Check } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const NODES = [
  { icon: Camera, label: "Capture" },
  { icon: LayoutPanelTop, label: "Storyboard" },
  { icon: Mic, label: "Voice" },
  { icon: Clapperboard, label: "Render" },
];

const FRAME_GRADIENTS = [
  "from-violet/40 to-blue/30",
  "from-blue/40 to-cyan/30",
  "from-cyan/40 to-violet/30",
  "from-pink/40 to-violet/30",
  "from-violet/30 to-cyan/30",
  "from-blue/30 to-pink/30",
];

function FloatingBadge({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
      className={cn(
        "absolute z-20 flex items-center gap-2 rounded-2xl border border-hairline bg-panel/80 px-3.5 py-2 text-xs font-medium text-ink shadow-soft backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/** Premium fake video-editor used as the hero visual. */
export function VideoStudioPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* aura behind the panel */}
      <div aria-hidden className="absolute -inset-10 -z-10 rounded-[3rem] bg-aurora opacity-20 blur-3xl" />

      {/* floating badges */}
      <FloatingBadge className="-left-4 top-8 sm:-left-10" delay={0}>
        <Camera size={14} className="text-cyan" /> Real app capture
      </FloatingBadge>
      <FloatingBadge className="-right-3 top-24 sm:-right-12" delay={1.2}>
        <LayoutPanelTop size={14} className="text-violet" /> Premium storyboard
      </FloatingBadge>
      <FloatingBadge className="-left-3 bottom-24 sm:-left-12" delay={2.1}>
        <Mic size={14} className="text-pink" /> Human voice-ready
      </FloatingBadge>
      <FloatingBadge className="-right-2 bottom-10 sm:-right-10" delay={3} >
        <span className="bg-aurora bg-clip-text font-semibold text-transparent">4K</span> export
      </FloatingBadge>

      {/* studio window */}
      <div className="border-gradient relative overflow-hidden rounded-3xl border border-hairline bg-panel/70 p-3 shadow-soft backdrop-blur-xl">
        <div className="flex items-center gap-2 px-2 py-2">
          <LogoMark size={20} />
          <span className="display text-sm font-semibold text-ink">
            Demo<span className="text-gradient">Forge</span>
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-[11px] font-medium text-ok">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Rendering
          </span>
        </div>

        {/* preview */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-hairline bg-canvas">
          <div className="absolute inset-0 bg-aurora opacity-30" />
          <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-canvas shadow-glow"
          >
            <Play size={24} className="ml-0.5 fill-current" />
          </motion.span>
          <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur">
            acme.app · 1080p · 16:9
          </span>
          {/* scrub line */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
            <motion.div
              className="h-full bg-aurora"
              initial={{ width: "8%" }}
              animate={{ width: ["8%", "72%", "8%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* timeline frames */}
        <div className="mt-3 flex gap-1.5 px-1">
          {FRAME_GRADIENTS.map((g, i) => (
            <div key={i} className={cn("h-9 flex-1 rounded-md border border-hairline bg-gradient-to-br", g)} />
          ))}
        </div>

        {/* pipeline nodes */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-hairline bg-surface px-3 py-3">
          {NODES.map((n, i) => (
            <div key={n.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg border", i < 3 ? "border-accent/40 bg-accent-soft text-accent-deep" : "border-hairline bg-elevated text-faint")}>
                  {i < 3 ? <Check size={14} strokeWidth={3} /> : <n.icon size={15} />}
                </span>
                <span className="text-[10px] font-medium text-faint">{n.label}</span>
              </div>
              {i < NODES.length - 1 && <span className="h-px w-4 bg-gradient-to-r from-accent/50 to-transparent sm:w-7" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
