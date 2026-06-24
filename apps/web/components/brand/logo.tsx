import { cn } from "../../lib/cn.js";

/** DemoForge mark — a gradient rounded tile with a play glyph. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cn("shrink-0", className)} role="img" aria-label="DemoForge">
      <defs>
        <linearGradient id="dfGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="17" fill="url(#dfGrad)" />
      <path d="M26 22 L44 32 L26 42 Z" fill="#ffffff" />
    </svg>
  );
}

/** Horizontal lockup: mark + DemoForge wordmark (two-tone). */
export function Logo({
  size = 32,
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
      <span className={cn("display font-semibold leading-none text-ink", wordmarkClassName)} style={{ fontSize: size * 0.5 }}>
        Demo<span className="text-gradient">Forge</span>
      </span>
    </span>
  );
}

/** The big emblem for hero / CTA — the mark with an aurora glow behind it. */
export function LogoEmblem({ size = 120, className }: { size?: number; variant?: string; className?: string }) {
  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-[30%] bg-aurora opacity-45 blur-2xl" aria-hidden />
      <LogoMark size={size} className="relative" />
    </div>
  );
}
