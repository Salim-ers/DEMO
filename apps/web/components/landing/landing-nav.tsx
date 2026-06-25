"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { LogoMark } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const NAV = [
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#modeles", label: "Modèles" },
  { href: "#offres", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

/** High-end top bar: large beige round badge + clean spaced links, frosted on scroll. */
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
            ? "border-b border-hairline bg-canvas/80 py-2.5 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Large beige round badge + wordmark */}
          <Link href="/" aria-label="Studio One — accueil" className="flex shrink-0 items-center gap-3.5">
            <LogoMark tone="cream" size={scrolled ? 46 : 58} className="transition-all duration-300" />
            <span className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">Studio One</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[15px] font-medium text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/projects"
              className="hidden text-[15px] font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Connexion
            </Link>
            <Link
              href="/new"
              className="hidden items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[15px] font-semibold text-studio transition-colors hover:bg-accent-deep sm:inline-flex"
            >
              Créer une démo <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Ouvrir le menu"
              className="text-muted hover:text-ink lg:hidden"
            >
              <Menu size={26} />
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
          <Link href="/" onClick={() => setDrawer(false)} className="flex items-center gap-3" aria-label="Studio One">
            <LogoMark tone="cream" size={42} />
            <span className="font-display text-xl font-bold tracking-tight text-ink">Studio One</span>
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
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-studio transition-colors hover:bg-accent-deep"
            >
              Créer une démo <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects"
              onClick={() => setDrawer(false)}
              className="flex items-center justify-center rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-elevated"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
