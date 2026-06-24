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
  Captions,
  Gauge,
  Palette,
  AudioLines,
  Film,
} from "lucide-react";
import { fadeUp, staggerContainer, blurIn, heroTextReveal, viewportOnce } from "../../lib/motion.js";
import { SectionLabel } from "../ui/section-label.js";
import { GlowButton } from "../ui/glow-button.js";
import { MetricCard } from "../ui/metric-card.js";
import { ProductShowcaseCard } from "../ui/product-showcase-card.js";
import { AnimatedGradient } from "../ui/animated-gradient.js";
import { StudioOneHeroVisual } from "../marketing/StudioOneHeroVisual.js";
import { LogoEmblem } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const HERO_WORDS = ["Turn", "any", "SaaS", "into", "a", "cinematic", "product", "demo."];

const METRICS = [
  { value: "4K", label: "Premium exports" },
  { value: "90s", label: "Sales demos" },
  { value: "100%", label: "Real product capture" },
  { value: "5 steps", label: "From URL to final video" },
];

const FEATURES = [
  { step: "01", icon: Camera, title: "Capture", text: "Record real product flows.", accent: "cyan" as const },
  { step: "02", icon: LayoutPanelTop, title: "Storyboard", text: "Turn screens into a sales narrative.", accent: "violet" as const },
  { step: "03", icon: Mic, title: "Voice", text: "Prepare natural voiceover scripts.", accent: "pink" as const },
  { step: "04", icon: Clapperboard, title: "Render", text: "Export polished demo videos.", accent: "blue" as const },
];

const GALLERY = [
  { name: "Horse Ledger", tag: "Equestrian", duration: "1:30", style: "Luxury Product Demo", grad: "from-amber-700/55 to-emerald-900/45" },
  { name: "CRM Launch", tag: "SaaS", duration: "0:90", style: "Studio One Cinematic", grad: "from-brown/70 to-caramel/45" },
  { name: "Fintech Dashboard", tag: "Fintech", duration: "1:20", style: "Premium Motion", grad: "from-caramel/70 to-gold/45" },
  { name: "AI Assistant", tag: "AI product", duration: "0:60", style: "Startup Launch", grad: "from-gold/60 to-brown/45" },
  { name: "Marketplace", tag: "Marketplace", duration: "1:00", style: "Product Tour", grad: "from-brown/60 to-gold/45" },
  { name: "Analytics Platform", tag: "Analytics", duration: "0:75", style: "Clean SaaS Demo", grad: "from-caramel/60 to-brown/50" },
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
  { icon: Gauge, title: "High-bitrate rendering" },
  { icon: AudioLines, title: "Human voice workflow" },
  { icon: Film, title: "Cinematic motion" },
  { icon: Captions, title: "Premium captions" },
  { icon: Palette, title: "Brand style presets" },
  { icon: LayoutPanelTop, title: "16:9 / 9:16 / 1:1 exports" },
];

/** A floating glass tile used in the Welcome collage. */
function Tile({ className, grad, label, delay = 0 }: { className?: string; grad: string; label?: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
      className={cn("absolute overflow-hidden rounded-2xl border border-hairline shadow-soft backdrop-blur-xl", className)}
    >
      <div className={cn("h-full w-full bg-gradient-to-br", grad)}>
        <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_35%,rgba(255,244,228,0.16),transparent_62%)]" />
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-canvas">
          <Play size={15} className="ml-0.5 fill-current" />
        </span>
        {label && <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-cream backdrop-blur">{label}</span>}
      </div>
    </motion.div>
  );
}

export function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip">
        {/* ───────── Hero (full height) ───────── */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden">
          <AnimatedGradient />
          <div className="absolute inset-0 -z-10 bg-grid-faint bg-[size:72px_72px] opacity-50 [mask-image:radial-gradient(70%_60%_at_40%_0%,#000,transparent)]" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-28 sm:px-10 lg:grid-cols-[1.08fr_1fr]">
            <motion.div initial="hidden" animate="show" variants={staggerContainer}>
              <motion.div variants={fadeUp}>
                <SectionLabel>AI demo video studio for SaaS teams</SectionLabel>
              </motion.div>

              <motion.h1
                variants={staggerContainer}
                className="display mt-7 text-[clamp(3.2rem,8.5vw,7.5rem)] font-semibold leading-[0.92] tracking-tightest text-ink"
              >
                {HERO_WORDS.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      variants={heroTextReveal}
                      className={cn("mr-[0.22em] inline-block", w === "cinematic" && "text-gradient")}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                Studio One captures real product flows, writes the story, adds voice-ready scripts, and renders premium
                demo videos your sales team can use.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
                <GlowButton href="/projects/new" className="px-7 py-3.5 text-base">
                  Create your first demo <ArrowRight size={18} />
                </GlowButton>
                <GlowButton href="/dashboard" variant="secondary" className="px-7 py-3.5 text-base">
                  <Play size={16} /> Watch example
                </GlowButton>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:pl-6"
            >
              <StudioOneHeroVisual />
            </motion.div>
          </div>
        </section>

        {/* ───────── Welcome to Studio One ───────── */}
        <section id="studio" className="relative overflow-hidden py-36">
          <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-caramel/15 blur-[150px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 sm:px-10 lg:grid-cols-[1fr_1.1fr]">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
              <SectionLabel>The studio</SectionLabel>
              <h2 className="display mt-5 text-[clamp(2.8rem,6.5vw,5.5rem)] font-semibold leading-[0.95] tracking-tightest text-ink">
                Welcome to <span className="text-gradient">Studio One.</span>
              </h2>
              <p className="mt-7 max-w-md text-xl leading-relaxed text-muted">
                A cinematic demo video studio for SaaS founders, agencies and sales teams.
              </p>
            </motion.div>

            {/* depth collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="relative h-[26rem] sm:h-[32rem]"
            >
              <Tile className="left-[6%] top-[8%] h-44 w-64 sm:h-52 sm:w-80" grad="from-brown/70 to-caramel/40" label="onboarding.mp4" delay={0} />
              <Tile className="right-[2%] top-[2%] h-32 w-44 sm:h-36 sm:w-52" grad="from-caramel/70 to-gold/40" label="9:16" delay={1.2} />
              <Tile className="bottom-[6%] right-[8%] h-40 w-60 sm:h-48 sm:w-72" grad="from-gold/60 to-brown/40" label="dashboard.mp4" delay={0.6} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="border-gradient absolute bottom-[12%] left-[0%] flex items-center gap-2 rounded-2xl border border-hairline bg-canvas/70 px-4 py-3 shadow-soft backdrop-blur-2xl"
              >
                <span className="display text-2xl font-semibold text-gradient">92</span>
                <span className="text-xs text-muted">Quality<br />score</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
                className="absolute left-[34%] top-[40%] flex w-40 items-center gap-[2px] rounded-xl border border-hairline bg-canvas/70 px-3 py-2.5 shadow-soft backdrop-blur-2xl"
              >
                {Array.from({ length: 22 }).map((_, i) => (
                  <span key={i} className="w-[2px] rounded-full bg-caramel/70" style={{ height: `${30 + ((i * 13) % 60)}%` }} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ───────── Editorial ───────── */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-6 py-36 sm:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="display text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[0.96] tracking-tightest text-ink"
              >
                Your product already has the story.{" "}
                <span className="text-gradient">Studio One makes it cinematic.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="text-lg leading-relaxed text-muted"
              >
                Studio One does not invent fake interfaces. It captures real product flows, structures the narrative, and
                turns your SaaS into a polished demo video ready for sales, onboarding and launch campaigns.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9 }}
              className="border-gradient relative mt-16 aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-hairline bg-canvas-soft shadow-soft"
            >
              <div className="absolute inset-0 bg-aurora opacity-25" />
              <div className="absolute inset-0 [background:radial-gradient(50%_90%_at_50%_30%,rgba(255,244,228,0.16),transparent_60%)]" />
              <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-canvas shadow-glow-lg">
                <Play size={30} className="ml-1 fill-current" />
              </span>
              <div className="absolute inset-x-0 bottom-0 flex gap-1 p-4">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="h-10 flex-1 rounded-md border border-white/10 bg-white/5" />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ───────── Metrics (no grey band) ───────── */}
        <section className="relative overflow-hidden py-28">
          <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 h-[24rem] w-[60rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-caramel/12 blur-[140px]" />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto grid max-w-7xl grid-cols-2 gap-y-14 px-6 sm:px-10 lg:grid-cols-4 lg:gap-0"
          >
            {METRICS.map((m, i) => (
              <div key={m.label} className={cn("px-2 text-center sm:text-left lg:px-10", i > 0 && "lg:border-l lg:border-hairline")}>
                <MetricCard value={m.value} label={m.label} />
              </div>
            ))}
          </motion.div>
        </section>

        {/* ───────── Feature cards ───────── */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-36 sm:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-16 max-w-2xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="display mt-5 text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
              Four moves, one cinematic cut
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-6 md:grid-cols-2"
          >
            {FEATURES.map((f) => (
              <ProductShowcaseCard key={f.title} {...f} />
            ))}
          </motion.div>
        </section>

        {/* ───────── Gallery ───────── */}
        <section id="gallery" className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-6 py-36 sm:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>Demos</SectionLabel>
                <h2 className="display mt-5 text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
                  Demos that look expensive
                </h2>
              </div>
              <p className="max-w-xs text-muted">A glimpse of the range — every style, every format, one studio.</p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GALLERY.map((g) => (
                <motion.div
                  key={g.name}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group overflow-hidden rounded-[1.6rem] border border-hairline bg-panel shadow-panel backdrop-blur-xl"
                >
                  <div className={cn("relative aspect-video overflow-hidden bg-gradient-to-br", g.grad)}>
                    <div className="absolute inset-0 [background:radial-gradient(60%_80%_at_50%_40%,rgba(255,244,228,0.18),transparent_60%)]" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/30 px-2.5 py-0.5 text-[11px] font-medium text-cream backdrop-blur">{g.tag}</span>
                    <span className="absolute right-3 top-3 rounded-md bg-black/40 px-2 py-0.5 font-mono text-[11px] text-cream backdrop-blur">{g.duration}</span>
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-canvas opacity-0 shadow-glow transition-opacity duration-300 group-hover:opacity-100">
                      <Play size={22} className="ml-0.5 fill-current" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <span className="text-[15px] font-semibold text-ink">{g.name}</span>
                    <span className="text-xs text-faint">{g.style}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── Workflow ───────── */}
        <section id="workflow" className="mx-auto max-w-7xl px-6 py-36 sm:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-16 text-center">
            <SectionLabel className="justify-center">The pipeline</SectionLabel>
            <h2 className="display mx-auto mt-5 max-w-3xl text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
              From URL to export, automatically
            </h2>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce} className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            {WORKFLOW.map((w, i) => (
              <motion.div key={w.label} variants={fadeUp} className="flex flex-1 items-center gap-3">
                <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-hairline bg-panel px-3 py-8 text-center shadow-panel backdrop-blur-xl">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aurora-soft text-ink">
                    <w.icon size={24} />
                  </span>
                  <span className="font-semibold text-ink">{w.label}</span>
                </div>
                {i < WORKFLOW.length - 1 && <ArrowRight size={20} className="hidden shrink-0 text-accent-deep lg:block" />}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ───────── Quality ───────── */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-7xl px-6 py-36 sm:px-10">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} className="mb-16 max-w-2xl">
              <SectionLabel>Quality</SectionLabel>
              <h2 className="display mt-5 text-[clamp(2.4rem,5.5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest text-ink">
                Built for videos that don't look AI-generated.
              </h2>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {QUALITY.map((q) => (
                <motion.div key={q.title} variants={fadeUp} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="border-gradient flex items-center gap-4 rounded-2xl border border-hairline bg-panel p-6 shadow-panel backdrop-blur-xl">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aurora text-canvas shadow-glow">
                    <q.icon size={20} />
                  </span>
                  <h3 className="text-[15px] font-semibold text-ink">{q.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───────── Final CTA ───────── */}
        <section className="mx-auto max-w-7xl px-6 py-40 sm:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="border-gradient relative overflow-hidden rounded-[2.5rem] border border-hairline bg-panel px-6 py-32 text-center shadow-soft backdrop-blur-xl sm:px-16"
          >
            <AnimatedGradient />
            <div className="relative flex flex-col items-center">
              <LogoEmblem size={96} className="mb-9" />
              <h2 className="display mx-auto max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tightest text-ink">
                Make your product demo <span className="text-gradient">unforgettable.</span>
              </h2>
              <div className="mt-11">
                <GlowButton href="/projects/new" className="px-8 py-4 text-base">
                  Create a demo with Studio One <ArrowRight size={18} />
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </MotionConfig>
  );
}
