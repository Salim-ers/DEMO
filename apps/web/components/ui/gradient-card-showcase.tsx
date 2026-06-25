import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "../../lib/cn.js";

export interface SkewCardProps {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  icon?: ReactNode;
  cta?: { label: string; href: string };
  className?: string;
}

/**
 * Glassmorphism "skew" card: two skewed gradient panels (one blurred) that
 * straighten on hover, floating blobs, and a frosted content panel that slides.
 */
export function SkewCard({ title, desc, gradientFrom, gradientTo, icon, cta, className }: SkewCardProps) {
  const grad = `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`;
  return (
    <div className={cn("group relative mx-4 my-5 h-[400px] w-[320px] max-w-[86vw] transition-all duration-500", className)}>
      {/* Skewed gradient panels (one sharp, one blurred glow) */}
      <span
        className="absolute left-[50px] top-0 h-full w-1/2 skew-x-[15deg] rounded-2xl transition-all duration-500 group-hover:left-[20px] group-hover:w-[calc(100%_-_90px)] group-hover:skew-x-0"
        style={{ background: grad }}
      />
      <span
        className="absolute left-[50px] top-0 h-full w-1/2 skew-x-[15deg] rounded-2xl blur-[30px] transition-all duration-500 group-hover:left-[20px] group-hover:w-[calc(100%_-_90px)] group-hover:skew-x-0"
        style={{ background: grad }}
      />

      {/* Floating blobs revealed on hover */}
      <span className="pointer-events-none absolute inset-0 z-10">
        <span className="animate-blob absolute left-0 top-0 h-0 w-0 rounded-lg bg-white/10 opacity-0 shadow-[0_5px_15px_rgba(0,0,0,0.3)] backdrop-blur-[10px] transition-all duration-100 group-hover:left-[50px] group-hover:top-[-50px] group-hover:h-[100px] group-hover:w-[100px] group-hover:opacity-100" />
        <span className="animate-blob animation-delay-1000 absolute bottom-0 right-0 h-0 w-0 rounded-lg bg-white/10 opacity-0 shadow-[0_5px_15px_rgba(0,0,0,0.3)] backdrop-blur-[10px] transition-all duration-500 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:h-[100px] group-hover:w-[100px] group-hover:opacity-100" />
      </span>

      {/* Frosted content */}
      <div className="relative left-0 z-20 rounded-2xl bg-white/10 px-9 py-7 text-white shadow-lg backdrop-blur-[10px] transition-all duration-500 group-hover:left-[-25px] group-hover:py-[54px]">
        {icon && (
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">{icon}</span>
        )}
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 leading-relaxed text-white/85">{desc}</p>
        {cta && (
          <Link
            href={cta.href}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-bold text-studio transition-colors hover:bg-[#ffcf4d]"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export default SkewCard;
