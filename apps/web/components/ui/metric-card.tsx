"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/cn.js";
import { fadeUp } from "../../lib/motion.js";

/** Splits "1080p"/"4K"/"90s" into a leading number + suffix for count-up. */
function parse(value: string) {
  const m = value.match(/^(\d[\d,.]*)(.*)$/);
  if (!m) return { num: null as number | null, suffix: "" };
  const digits = m[1] ?? "";
  return { num: Number(digits.replace(/,/g, "")), suffix: m[2] ?? "" };
}

/** Metric with an in-view count-up animation. */
export function MetricCard({ value, label, className }: { value: string; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { num, suffix } = parse(value);
  const [display, setDisplay] = useState(num === null ? value : "0");

  useEffect(() => {
    if (!inView || num === null) return;
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(num * eased).toString() + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, suffix]);

  return (
    <motion.div ref={ref} variants={fadeUp} className={cn("text-center sm:text-left", className)}>
      <div className="display text-[clamp(2.6rem,5vw,4rem)] font-semibold leading-none tracking-tighter text-gradient">
        {display}
      </div>
      <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-muted sm:mx-0">{label}</p>
    </motion.div>
  );
}
