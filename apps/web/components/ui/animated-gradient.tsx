import { cn } from "../../lib/cn.js";

/** Slow-drifting colored blobs — the immersive backdrop behind hero/sections. */
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -left-[10%] -top-[10%] h-[42rem] w-[42rem] animate-float rounded-full bg-violet/25 blur-[130px]" />
      <div
        className="absolute right-[-8%] top-1/4 h-[36rem] w-[36rem] animate-float rounded-full bg-cyan/20 blur-[130px]"
        style={{ animationDelay: "2.2s" }}
      />
      <div
        className="absolute bottom-[-12%] left-1/3 h-[32rem] w-[32rem] animate-float rounded-full bg-pink/15 blur-[130px]"
        style={{ animationDelay: "4.4s" }}
      />
    </div>
  );
}
