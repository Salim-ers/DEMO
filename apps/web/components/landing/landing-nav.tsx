"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const WORDMARK = "/brand/studio-one-wordmark-white.png";

const NAV = [
  { href: "#presentation", label: "Présentation" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#exemples", label: "Exemples" },
  { href: "#temoignages", label: "Témoignages" },
];

/**
 * Atypical top bar: an oversized cream wordmark that floats at the top-left,
 * with the navigation living inside a detached glass "pill" on the right.
 * Transparent over the hero, frosted on scroll so the beige mark stays legible
 * over the cream sections too.
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-hairline bg-canvas/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-5",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Oversized cream wordmark */}
          <Link href="/" aria-label="Studio One — accueil" className="flex shrink-0 items-center">
            <img
              src={WORDMARK}
              alt="Studio One"
              className={cn("w-auto object-contain transition-all duration-300", scrolled ? "h-14" : "h-20")}
            />
          </Link>

          {/* Right: floating glass pill nav + CTA */}
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 rounded-full border border-hairline bg-canvas/40 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:flex">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-ink"
                >
                  {n.label}
                </Link>
              ))}
              <span className="mx-1 h-5 w-px bg-hairline" />
              <Link
                href="/projects"
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-ink"
              >
                Connexion
              </Link>
            </nav>

            <Link
              href="/new"
              className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-studio shadow-[0_10px_30px_-10px_rgba(185,130,74,0.6)] transition-colors hover:bg-accent-deep sm:inline-flex"
            >
              Créer une démo <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas/40 text-ink backdrop-blur-xl lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn("fixed inset-0 z-[60] lg:hidden", drawer ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!drawer}
      >
        <div
          className={cn("absolute inset-0 bg-black/55 transition-opacity", drawer ? "opacity-100" : "opacity-0")}
          onClick={() => setDrawer(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[288px] max-w-[86vw] border-l border-hairline bg-canvas px-5 py-7 shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            drawer ? "translate-x-0" : "translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Fermer le menu"
            className="absolute right-4 top-7 text-faint hover:text-ink"
          >
            <X size={20} />
          </button>
          <Link href="/" onClick={() => setDrawer(false)} className="flex items-center gap-2.5" aria-label="Studio One">
            <LogoMark size={34} />
            <span className="text-base font-semibold tracking-tight text-ink">Studio One</span>
          </Link>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setDrawer(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-muted transition-colors hover:bg-elevated hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 space-y-3">
            <Link
              href="/new"
              onClick={() => setDrawer(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-studio transition-colors hover:bg-accent-deep"
            >
              Créer une démo <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects"
              onClick={() => setDrawer(false)}
              className="flex items-center justify-center rounded-full border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-elevated"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
