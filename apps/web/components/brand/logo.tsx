import { cn } from "../../lib/cn.js";

/** The StudioOne badge mark — a bronze disc with an ivory film/play/cut glyph. */
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

/** Full lockup: badge mark + the StudioOne wordmark (warm serif, two-tone). */
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
        <span className={cn("display text-[17px] font-semibold leading-none text-ink", wordmarkClassName)}>
          Studio<span className="text-accent-deep">One</span>
        </span>
      )}
    </span>
  );
}
