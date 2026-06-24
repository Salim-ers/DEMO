"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Linkedin, Youtube, Twitter } from "lucide-react";
import { Logo, LogoMark } from "../brand/logo.js";
import { cn } from "../../lib/cn.js";

const NAV = [
  { href: "#presentation", label: "Présentation" },
  { href: "#fonctionnement", label: "Fonctionnement" },
  { href: "#exemples", label: "Exemples" },
  { href: "#temoignages", label: "Témoignages" },
];

const SOCIAL = [
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "YouTube", icon: Youtube },
  { href: "#", label: "X", icon: Twitter },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="relative flex h-full flex-col">
      {/* lueur chaude derrière le logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 h-56 w-56 -translate-x-1/2 opacity-70 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(185,130,74,0.25) 0%, transparent 70%)" }}
      />

      {/* Grand logo */}
      <Link href="/" onClick={onNavigate} aria-label="Studio One — accueil" className="relative px-2 pt-2">
        <Logo size={196} className="max-w-full" />
      </Link>

      {/* Navigation */}
      <nav className="relative mt-10 flex flex-1 flex-col gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-muted transition-colors hover:bg-elevated hover:text-ink"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-hairline transition-colors group-hover:bg-accent" />
            {n.label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <div className="relative mt-6 space-y-3">
        <Link
          href="/new"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-studio transition-colors hover:bg-accent-deep"
        >
          Créer une démo <ArrowRight size={16} />
        </Link>
        <Link
          href="/projects"
          onClick={onNavigate}
          className="flex items-center justify-center rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:bg-elevated"
        >
          Connexion
        </Link>
      </div>

      {/* Pied : réseaux + ligne de marque */}
      <div className="relative mt-7 border-t border-hairline pt-5">
        <div className="flex items-center gap-2">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-faint transition-colors hover:border-accent/40 hover:text-ink"
            >
              <s.icon size={15} />
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Studio One — Vidéos de démonstration SaaS professionnelles.
        </p>
      </div>
    </div>
  );
}

/** Stylish full-height marketing sidebar (desktop) + mobile top bar & drawer. */
export function LandingSidebar() {
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[264px] flex-col border-r border-hairline bg-canvas/70 px-5 py-7 backdrop-blur-xl lg:flex">
        <SidebarBody />
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-hairline bg-canvas/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" aria-label="Studio One" className="flex items-center gap-2.5">
          <LogoMark size={34} />
          <span className="text-base font-semibold tracking-tight text-ink">Studio One</span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Ouvrir le menu"
          className="text-muted hover:text-ink"
        >
          <Menu size={24} />
        </button>
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
            "absolute left-0 top-0 h-full w-[284px] max-w-[86vw] border-r border-hairline bg-canvas px-5 py-7 shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            drawer ? "translate-x-0" : "-translate-x-full",
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
          <SidebarBody onNavigate={() => setDrawer(false)} />
        </div>
      </div>
    </>
  );
}
