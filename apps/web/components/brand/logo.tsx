import { cn } from "../../lib/cn.js";

/** Compact film/play/cut glyph — used as the badge in the horizontal lockup. */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label="StudioOne"
    >
      <defs>
        <linearGradient id="soBronze" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A6703B" />
          <stop offset="0.55" stopColor="#8A5A2C" />
          <stop offset="1" stopColor="#6F4521" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#soBronze)" />
      <rect x="18" y="19" width="28" height="19" rx="4.5" fill="none" stroke="#F7F1E7" strokeWidth="3" />
      <line x1="23.5" y1="19" x2="23.5" y2="38" stroke="#F7F1E7" strokeWidth="2" opacity="0.45" />
      <path d="M29 24.5 L38.5 28.5 L29 32.5 Z" fill="#F7F1E7" />
      <line x1="20" y1="45" x2="38" y2="45" stroke="#F7F1E7" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="29" cy="45" r="2.7" fill="#F7F1E7" />
      <path d="M42 42 l3.6 3 -3.6 3" fill="none" stroke="#F7F1E7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The Studio One emblem — the real circular badge: bronze disc, ivory brush-script
 * "Studio One" with a swash, and the video-edit glyph beneath. The script renders
 * via the Pacifico web font (var --font-script).
 */
export function LogoEmblem({ size = 160, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn("relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-bronze-sheen shadow-soft", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Studio One"
    >
      <div className="absolute inset-0 opacity-[0.18] [background:radial-gradient(60%_55%_at_50%_18%,#fff_0%,transparent_60%)]" />
      <div className="relative flex flex-col items-center" style={{ transform: "translateY(-4%)" }}>
        <span
          className="font-script self-end leading-none text-ivory"
          style={{ fontSize: size * 0.165, marginRight: size * 0.05, marginBottom: -size * 0.05 }}
        >
          Studio
        </span>
        <span className="font-script leading-none text-ivory" style={{ fontSize: size * 0.37 }}>
          One
        </span>
        <svg width={size * 0.46} height={size * 0.16} viewBox="0 0 120 42" className="mt-[6%]" aria-hidden>
          <path d="M4 14 q56 22 112 -4" fill="none" stroke="#F7F1E7" strokeWidth="4" strokeLinecap="round" />
          <g transform="translate(38 18)">
            <rect x="0" y="0" width="30" height="20" rx="4" fill="none" stroke="#F7F1E7" strokeWidth="2.6" />
            <path d="M8 6 L20 10 L8 14 Z" fill="#F7F1E7" />
            <line x1="2" y1="26" x2="24" y2="26" stroke="#F7F1E7" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="13" cy="26" r="2.6" fill="#F7F1E7" />
            <path d="M34 22 l4 3 -4 3" fill="none" stroke="#F7F1E7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

/** Horizontal lockup: glyph badge + Studio One brush-script wordmark. */
export function Logo({
  size = 30,
  withWordmark = true,
  className,
  wordmarkClassName,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {withWordmark && (
        <span
          className={cn("font-script leading-none text-espresso", wordmarkClassName)}
          style={{ fontSize: size * 0.62 }}
        >
          Studio One
        </span>
      )}
    </span>
  );
}
