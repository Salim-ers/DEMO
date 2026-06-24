"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "./brand/logo.js";
import { cn } from "../lib/cn.js";

const NAV = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#exemples", label: "Exemples" },
  { href: "/#temoignages", label: "Témoignages" },
];

/** Public navbar — transparent over the hero, frosted/solid on scroll. */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-hairline bg-canvas/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 sm:px-8",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link href="/" aria-label="Studio One — accueil" className="flex shrink-0 items-center gap-2.5">
          <LogoMark size={36} />
          <span className="text-[17px] font-semibold tracking-tight text-ink">Studio One</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-muted transition-colors hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="hidden text-sm font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Connexion
          </Link>
          <Link href="/new" className="btn-primary px-4 py-2 text-sm">
            Créer une démo
          </Link>
        </div>
      </div>
    </header>
  );
}
