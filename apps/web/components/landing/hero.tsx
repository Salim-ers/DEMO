"use client";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { gsap, SplitText } from "../../lib/gsap.js";
import { useGsap } from "../../lib/use-gsap.js";
import { Magnetic } from "../motion/magnetic.js";
import { Tilt } from "../motion/tilt.js";
import { Parallax } from "../motion/parallax.js";
import { HeroPlayer } from "./hero-player.js";
import { PRICE_LABEL } from "../../lib/pricing.js";

export function Hero() {
  const ref = useGsap<HTMLElement>((self, reduced) => {
    const q = gsap.utils.selector(self);
    const h1 = self.querySelector<HTMLHeadingElement>(".hero-h1");
    // The headline is visible by default (never gated on JS). GSAP sets the
    // from-state synchronously in useLayoutEffect, so there is no flash.
    if (reduced) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (h1) {
      const split = new SplitText(h1, { type: "lines,words", linesClass: "overflow-hidden" });
      tl.from(split.words, {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.04,
        onComplete: () => split.lines.forEach((l) => ((l as HTMLElement).style.overflow = "visible")),
      });
    }
    tl.from(q(".hero-rise"), { y: 22, opacity: 0, duration: 0.8, stagger: 0.09 }, "-=0.55");
    tl.from(q(".hero-stage"), { y: 46, opacity: 0, scale: 0.97, duration: 1.2 }, "-=0.9");
  }, []);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-canvas pt-28 pb-16 sm:pt-24"
    >
      {/* Ambient warm light + faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-mesh-hero" />
      <Parallax speed={10} className="pointer-events-none absolute -left-32 top-10 -z-0">
        <span aria-hidden className="glow-orb block h-[520px] w-[520px] bg-[radial-gradient(closest-side,rgba(198,134,66,0.20),transparent)]" />
      </Parallax>
      <Parallax speed={16} className="pointer-events-none absolute -right-24 top-1/3 -z-0">
        <span aria-hidden className="glow-orb block h-[420px] w-[420px] bg-[radial-gradient(closest-side,rgba(227,179,109,0.14),transparent)]" />
      </Parallax>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-faint opacity-[0.5] [background-size:46px_46px] [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Copy */}
        <div className="max-w-2xl">
          <span className="hero-rise eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Démos · Pubs · TikTok · SaaS
          </span>

          <h1 className="hero-h1 text-display mt-5 text-[clamp(2.5rem,6vw,4.6rem)] text-ink">
            Transformez votre site en{" "}
            <span className="text-gradient-bronze">vidéo prête à vendre.</span>
          </h1>

          <p className="hero-rise mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
            Studio One analyse votre produit, écrit le scénario et génère une vidéo premium pour vos démos SaaS,
            pubs TikTok, Reels et pitchs commerciaux.
          </p>

          <div className="hero-rise mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Magnetic strength={0.45}>
              <Link href="/new" className="btn-primary px-7 py-3.5 text-base">
                Créer ma première vidéo <ArrowRight size={18} />
              </Link>
            </Magnetic>
            <Link href="/demo" className="btn-secondary px-6 py-3.5 text-base">
              <Play size={16} fill="currentColor" /> Voir un exemple
            </Link>
          </div>

          <div className="hero-rise mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-1.5 font-medium text-champagne">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 10 vidéos / mois
            </span>
            <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-3.5 py-1.5 font-medium text-champagne">
              {PRICE_LABEL} / mois
            </span>
            <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-3.5 py-1.5 font-medium text-champagne">
              Sans montage manuel
            </span>
          </div>

          <p className="hero-rise mt-5 max-w-md text-sm leading-relaxed text-faint">
            Pas une vidéo IA générique. Un rendu studio, rythmé, propre, pensé pour convertir.
          </p>
        </div>

        {/* Stage */}
        <div className="hero-stage">
          <Parallax speed={6}>
            <Tilt max={6}>
              <HeroPlayer />
            </Tilt>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
