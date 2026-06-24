"use client";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Play,
  Camera,
  LayoutPanelTop,
  Mic,
  Clapperboard,
  Download,
  Link2,
  Sparkles,
  Captions,
  Gauge,
  Palette,
  AudioLines,
  Film,
} from "lucide-react";
import { fadeUp, staggerContainer, blurIn, viewportOnce } from "../../lib/motion.js";
import { SectionLabel } from "../ui/section-label.js";
import { GlowButton } from "../ui/glow-button.js";
import { MetricCard } from "../ui/metric-card.js";
import { ProductShowcaseCard } from "../ui/product-showcase-card.js";
import { AnimatedGradient } from "../ui/animated-gradient.js";
import { VideoStudioPreview } from "../marketing/video-studio-preview.js";
import { cn } from "../../lib/cn.js";

const METRICS = [
  { value: "4K", label: "Export resolution, cinematic-ready" },
  { value: "90s", label: "Average length of a premium demo" },
  { value: "100%", label: "Real browser capture — never fake UI" },
  { value: "5", label: "Steps from a URL to a finished video" },
];

const SHOWCASE = [
  { step: "01", icon: Camera, title: "Capture real screens", text: "Connect your app and DemoForge films the actual product flow — login included.", accent: "cyan" as const },
  { step: "02", icon: LayoutPanelTop, title: "Generate the story", text: "Scenes are arranged into a clear, premium storyboard, ready to narrate.", accent: "violet" as const },
  { step: "03", icon: Mic, title: "Add voice & captions", text: "Voice-ready scripts in your tone, with SRT/VTT captions burned in.", accent: "pink" as const },
  { step: "04", icon: Clapperboard, title: "Render premium video", text: "Motion design, transitions and typography — exported sales-ready.", accent: "blue" as const },
];

const GALLERY = [
  { name: "Nimbus CRM", tag: "SaaS", duration: "0:90", style: "Clean SaaS Demo", grad: "from-violet/50 to-blue/40" },
  { name: "Ledgerly", tag: "Fintech", duration: "1:20", style: "Premium Motion", grad: "from-blue/50 to-cyan/40" },
  { name: "Synth AI", tag: "AI product", duration: "0:60", style: "Startup Launch", grad: "from-violet/50 to-pink/40" },
  { name: "Marketplace X", tag: "Marketplace", duration: "1:00", style: "Product Tour", grad: "from-cyan/50 to-violet/40" },
  { name: "Horse Ledger", tag: "Equestrian", duration: "1:30", style: "Luxury Product Demo", grad: "from-amber-500/40 to-emerald-700/40" },
  { name: "Pulse Ops", tag: "Internal tool", duration: "0:75", style: "Investor Demo", grad: "from-pink/40 to-violet/40" },
];

const WORKFLOW = [
  { icon: Link2, label: "URL" },
  { icon: Camera, label: "Capture" },
  { icon: LayoutPanelTop, label: "Storyboard" },
  { icon: Mic, label: "Voice" },
  { icon: Clapperboard, label: "Render" },
  { icon: Download, label: "Export" },
];

const QUALITY = [
  { icon: Film, title: "1080p / 4K", text: "Crisp, broadcast-grade output for every channel." },
  { icon: Gauge, title: "High bitrate", text: "Rich, artifact-free encoding that looks expensive." },
  { icon: Sparkles, title: "Premium motion", text: "Cinematic transitions and kinetic typography." },
  { icon: Captions, title: "Captions", text: "SRT & VTT generated and embedded automatically." },
  { icon: AudioLines, title: "Human voice workflow", text: "Free TTS by default, premium AI voice on consent." },
  { icon: Palette, title: "Brand style presets", text: "Your colors, type and logo on every render." },
];

export function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip">
        {/* ───────── A. Hero ───────── */}
        <section className="relative overflow-hidden">
          <AnimatedGradient />
          <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:64px_64px] opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />

          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-28">
            <motion.div initial="hidden" animate="show" variants={staggerContainer}>
              <motion.div variants={fadeUp}>
                <SectionLabel>AI demo video studio for SaaS teams</SectionLabel>
              </motion.div>
              <motion.h1
                variants={blurIn}
                className="display mt-6 text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tighter text-ink"
              >
                Turn any SaaS into a <span className="text-gradient">cinematic</span> demo video.
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
                DemoForge captures real product flows, writes the story, adds voice-ready scripts and renders premium
                videos your sales team can actually use.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
                <GlowButton href="/projects/new">
                  Create your first demo <ArrowRight size={17} />
                </GlowButton>
                <GlowButton href="/dashboard" variant="secondary">
                  <Play size={15} /> Watch example
                </GlowButton>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}>
              <VideoStudioPreview />
            </motion.div>
          </div>
        </section>

        {/* ───────── B. Metrics ───────── */}
        <section className="border-y border-hairline bg-surface/40">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-6xl grid-cols-2 gap-y-12 px-5 py-16 sm:px-8 lg:grid-cols-4"
          >
            {METRICS.map((m) => (
              <MetricCard key={m.label} value={m.value} label={m.label} />
            ))}
          </motion.div>
        </section>

        {/* ───────── C. Product showcase (bento) ───────── */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="max-w-2xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] text-ink">
              A studio pipeline, from real screen to final cut
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-14 grid gap-5 md:grid-cols-2"
          >
            {SHOWCASE.map((s) => (
              <ProductShowcaseCard key={s.title} {...s} />
            ))}
          </motion.div>
        </section>

        {/* ───────── D. Gallery ───────── */}
        <section id="gallery" className="border-t border-hairline bg-surface/40">
          <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
            >
              <div>
                <SectionLabel>Gallery</SectionLabel>
                <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] text-ink">
                  Demos that look expensive
                </h2>
              </div>
              <p className="max-w-xs text-muted">A glimpse of the range — every style, every format, one studio.</p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {GALLERY.map((g) => (
                <motion.div
                  key={g.name}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group overflow-hidden rounded-3xl border border-hairline bg-panel shadow-panel backdrop-blur-xl"
                >
                  <div className={cn("relative aspect-video overflow-hidden bg-gradient-to-br", g.grad)}>
                    <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_40%,rgba(255,255,255,0.16),transparent_60%)]" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                      {g.tag}
                    </span>
                    <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-0.5 font-mono text-[11px] text-white backdrop-blur">
                      {g.duration}
                    </span>
                    <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-canvas opacity-0 shadow-glow transition-opacity duration-300 group-hover:opacity-100">
                      <Play size={20} className="ml-0.5 fill-current" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="font-semibold text-ink">{g.name}</span>
                    <span className="text-xs text-faint">{g.style}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── E. Workflow ───────── */}
        <section id="workflow" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-16 text-center">
            <SectionLabel className="justify-center">The pipeline</SectionLabel>
            <h2 className="display mx-auto mt-4 max-w-2xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] text-ink">
              From URL to export, automatically
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            {WORKFLOW.map((w, i) => (
              <motion.div key={w.label} variants={fadeUp} className="flex flex-1 items-center gap-3">
                <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-hairline bg-panel px-3 py-6 text-center shadow-panel backdrop-blur-xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora-soft text-ink">
                    <w.icon size={22} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{w.label}</span>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ArrowRight size={18} className="hidden shrink-0 text-accent-deep sm:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ───────── F. Quality ───────── */}
        <section className="border-t border-hairline bg-surface/40">
          <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="max-w-2xl">
              <SectionLabel>Quality</SectionLabel>
              <h2 className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] text-ink">
                Built to look broadcast-grade
              </h2>
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {QUALITY.map((q) => (
                <motion.div
                  key={q.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="border-gradient rounded-3xl border border-hairline bg-panel p-7 shadow-panel backdrop-blur-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aurora text-white shadow-glow">
                    <q.icon size={20} />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">{q.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{q.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── G. Final CTA ───────── */}
        <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="border-gradient relative overflow-hidden rounded-[2.5rem] border border-hairline bg-panel px-6 py-24 text-center shadow-soft backdrop-blur-xl sm:px-16"
          >
            <AnimatedGradient />
            <div className="relative flex flex-col items-center">
              <h2 className="display mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-tighter text-ink">
                Your product already has the story. <span className="text-gradient">DemoForge makes it cinematic.</span>
              </h2>
              <div className="mt-10">
                <GlowButton href="/projects/new">
                  Generate a demo <ArrowRight size={18} />
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
}
