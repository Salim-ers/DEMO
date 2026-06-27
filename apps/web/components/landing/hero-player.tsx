/* eslint-disable @next/next/no-img-element */
import { Play, Captions, Mic, Sparkles } from "lucide-react";

/**
 * Cinematic preview "player" for the hero. A real photographic frame (treated
 * editorially) inside a premium player chrome: timecode, scrubber + waveform,
 * a burned-in caption and floating capability chips for depth. No fake product
 * UI — the surface that reads as a finished, studio-grade clip.
 */
export function HeroPlayer() {
  return (
    <div className="group relative">
      {/* Warm bronze bloom behind the frame (controlled glow, not neon). */}
      <div aria-hidden className="glow-orb absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgba(198,134,66,0.42),transparent)] opacity-70" />

      <div className="edge-light relative overflow-hidden rounded-[28px] border border-hairline bg-canvas-soft shadow-soft">
        {/* Top chrome */}
        <div className="flex items-center justify-between border-b border-hairline bg-black/30 px-4 py-2.5 backdrop-blur-sm">
          <span className="timecode text-[11px] text-faint">studio-one_demo.mp4</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-bad" />
            <span className="timecode text-[11px] text-muted">1080p · 16:9</span>
          </span>
        </div>

        {/* Poster */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src="/hero/editing.jpg"
            alt="Aperçu d'une vidéo de démonstration Studio One"
            className="editorial-img absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-transparent" />
          <div aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 0 140px 30px rgba(5,4,3,0.7)" }} />

          {/* Play (decorative) */}
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 grid h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bronze-sheen text-studio shadow-[0_18px_48px_-12px_rgba(198,134,66,0.7)]"
          >
            <span className="absolute inset-0 rounded-full ring-1 ring-champagne/40" />
            <span className="absolute inset-0 animate-pulse-ring rounded-full ring-1 ring-accent/50" />
            <Play size={26} className="ml-1" fill="currentColor" />
          </span>

          {/* Burned-in caption */}
          <div className="absolute inset-x-0 bottom-16 flex justify-center px-6">
            <p className="rounded-lg bg-black/55 px-3 py-1.5 text-center text-sm font-medium text-champagne backdrop-blur-sm">
              « Concluez plus de ventes, sans montage. »
            </p>
          </div>

          {/* Scrubber + waveform */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3.5">
            <div className="mb-2 flex h-6 items-end gap-[3px] opacity-70" aria-hidden>
              {WAVE.map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-champagne/50"
                  style={{ height: `${h}%`, opacity: i / WAVE.length < 0.42 ? 0.9 : 0.4 }}
                />
              ))}
            </div>
            <div className="relative h-1 rounded-full bg-cream/15">
              <div className="absolute inset-y-0 left-0 w-[42%] rounded-full bg-bronze-sheen" />
              <span className="absolute left-[42%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-[0_0_0_4px_rgba(246,231,204,0.18)]" />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="timecode text-[10px] text-faint">00:38</span>
              <span className="timecode text-[10px] text-faint">01:30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating capability chips (depth) */}
      <Chip className="-left-4 top-10 sm:-left-7" icon={Mic} label="Voix off premium" />
      <Chip className="-right-3 top-1/3 sm:-right-6" icon={Captions} label="Sous-titres" />
      <Chip className="bottom-6 -left-3 sm:-left-6" icon={Sparkles} label="Plans IA · b-roll" />
    </div>
  );
}

function Chip({ className, icon: Icon, label }: { className?: string; icon: typeof Mic; label: string }) {
  return (
    <span
      className={`absolute z-10 hidden items-center gap-2 rounded-full border border-hairline bg-canvas-soft/90 px-3 py-1.5 text-xs font-medium text-ink shadow-glow backdrop-blur-md sm:inline-flex ${className ?? ""}`}
    >
      <Icon size={13} className="text-accent-deep" /> {label}
    </span>
  );
}

const WAVE = [30, 55, 40, 80, 60, 95, 50, 70, 45, 88, 62, 38, 72, 52, 90, 48, 66, 34, 78, 58, 42, 84, 56, 36];
