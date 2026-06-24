/**
 * A rendered video-editing timeline used as the hero's right-side visual.
 * Pure CSS/markup so it stays razor-sharp at any size and carries no image
 * licensing. Drop a real photo at /public/hero/editing.jpg to override it
 * (the hero layers that image on top of this panel).
 */

const RULER_TICKS = Array.from({ length: 48 });

// Magenta video clips: [widthPx, label?]. Deterministic (no random → SSR-safe).
type Clip = { w: number; label?: string; fx?: boolean };
const VIDEO_A: Clip[] = [
  { w: 60 }, { w: 28 }, { w: 96, label: "max", fx: true }, { w: 40 }, { w: 120, label: "max", fx: true },
  { w: 30 }, { w: 150, label: "maxresdefault.jpg" }, { w: 44 }, { w: 180, label: "maxresdefault.jpg" },
];
const VIDEO_B: Clip[] = [
  { w: 90 }, { w: 54 }, { w: 30 }, { w: 140, label: "maxresd", fx: true }, { w: 36 }, { w: 110 }, { w: 200, label: "maxresdefault.jpg" },
];
const AUDIO_A = [120, 40, 180, 60, 220, 90, 260];
const AUDIO_B = [80, 200, 50, 160, 120, 240, 70];

// Tall thin "peaks" rising above the clips (the spiky waveform look).
const PEAKS = [
  { x: 8, h: 78 }, { x: 11, h: 52 }, { x: 14, h: 96 }, { x: 16, h: 40 }, { x: 19, h: 88 },
  { x: 22, h: 60 }, { x: 28, h: 100 }, { x: 34, h: 46 }, { x: 41, h: 70 }, { x: 47, h: 54 },
  { x: 55, h: 84 }, { x: 63, h: 38 }, { x: 71, h: 64 }, { x: 80, h: 92 }, { x: 88, h: 48 },
];

const WAVE_TICKS = "bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.30)_0_1px,transparent_1px_4px)]";

function VideoClip({ c }: { c: Clip }) {
  return (
    <div
      className="relative flex h-full shrink-0 items-center overflow-hidden rounded-[3px] border border-fuchsia-300/40 bg-gradient-to-b from-fuchsia-400/90 to-fuchsia-600/90"
      style={{ width: c.w }}
    >
      <span className={`absolute inset-0 opacity-70 ${WAVE_TICKS}`} />
      {c.fx && (
        <span className="relative z-10 ml-1 rounded-[2px] bg-black/45 px-1 text-[8px] font-bold text-fuchsia-100">fx</span>
      )}
      {c.label && (
        <span className="relative z-10 ml-1 truncate text-[8px] font-medium text-white/90">{c.label}</span>
      )}
    </div>
  );
}

function AudioClip({ w }: { w: number }) {
  return (
    <div className="relative h-full shrink-0 overflow-hidden rounded-[3px] border border-emerald-300/40 bg-emerald-500/85" style={{ width: w }}>
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-emerald-100/50" />
      <span className="absolute inset-0 opacity-80 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.22)_0_1px,transparent_1px_3px)]" />
    </div>
  );
}

export function EditorTimeline() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#08080c]">
      <div
        className="absolute left-[8%] top-[6%] h-[88%] w-[122%] origin-right"
        style={{ transform: "perspective(1700px) rotateY(-15deg) rotateX(3deg)" }}
      >
        {/* Program-monitor frame edge */}
        <div className="absolute -inset-3 rounded-xl border border-teal-400/30" />

        <div className="flex h-full flex-col gap-[6px] rounded-lg bg-[#0c0c12] p-3 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
          {/* Ruler */}
          <div className="relative flex h-6 items-end gap-[6px] border-b border-white/10 pb-1">
            {RULER_TICKS.map((_, i) => (
              <span key={i} className={`w-px bg-white/15 ${i % 6 === 0 ? "h-3" : "h-1.5"}`} />
            ))}
            <span className="absolute left-[18%] top-0 text-[8px] font-medium text-white/40">00:15:00:00</span>
            <span className="absolute left-[2%] top-1 h-px w-[34%] bg-red-500/70" />
            <span className="absolute left-[36%] top-0 h-full w-px bg-teal-300/80" />
          </div>

          {/* Tall waveform peaks */}
          <div className="relative h-14">
            {PEAKS.map((p, i) => (
              <span
                key={i}
                className="absolute bottom-0 w-[2px] bg-fuchsia-400/80"
                style={{ left: `${p.x}%`, height: `${p.h}%` }}
              />
            ))}
          </div>

          {/* Video tracks */}
          <div className="flex h-9 items-center gap-[5px]">{VIDEO_A.map((c, i) => <VideoClip key={i} c={c} />)}</div>
          <div className="flex h-9 items-center gap-[5px]">{VIDEO_B.map((c, i) => <VideoClip key={i} c={c} />)}</div>

          {/* Audio tracks */}
          <div className="flex h-10 items-center gap-[5px]">{AUDIO_A.map((w, i) => <AudioClip key={i} w={w} />)}</div>
          <div className="flex h-10 items-center gap-[5px]">{AUDIO_B.map((w, i) => <AudioClip key={i} w={w} />)}</div>

          {/* Empty lower tracks */}
          <div className="h-5 rounded-[3px] bg-white/[0.02]" />
          <div className="h-5 rounded-[3px] bg-white/[0.02]" />
        </div>
      </div>
    </div>
  );
}
