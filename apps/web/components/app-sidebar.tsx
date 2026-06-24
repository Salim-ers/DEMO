"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Search, Menu, X, Sparkles } from "lucide-react";
import { Logo, LogoEmblem } from "./brand/logo.js";
import { NAV_GROUPS } from "./nav-items.js";
import { CommandPalette } from "./command-palette.js";
import { cn } from "../lib/cn.js";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
}

function openCommand() {
  window.dispatchEvent(new Event("studioone:command"));
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" onClick={onNavigate} className="mb-5 px-1" aria-label="DemoForge — accueil">
        <Logo size={46} />
      </Link>

      <Link
        href="/projects/new"
        onClick={onNavigate}
        className="relative mb-4 flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-soft"
      >
        <span className="absolute inset-0 -z-10 bg-aurora bg-[length:200%_200%] animate-gradient-pan" />
        <Plus size={16} /> Nouveau projet
      </Link>

      <button
        type="button"
        onClick={openCommand}
        className="mb-5 flex items-center gap-2.5 rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-faint transition-colors hover:border-accent/30 hover:text-muted"
      >
        <Search size={15} />
        <span className="flex-1 text-left">Rechercher…</span>
        <kbd className="rounded-md border border-hairline bg-panel px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
      </button>

      <nav className="flex-1 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-faint">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      active ? "bg-elevated text-ink" : "text-muted hover:bg-elevated/60 hover:text-ink",
                    )}
                  >
                    {active && <span className="absolute left-0 h-5 w-[3px] rounded-full bg-accent" />}
                    <item.icon
                      size={17}
                      className={cn(active ? "text-accent-deep" : "text-faint group-hover:text-muted")}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 rounded-2xl border border-hairline bg-surface/70 px-4 py-3.5">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent-deep">
          <Sparkles size={13} /> Plan DemoForge
        </p>
        <p className="text-xs leading-relaxed text-faint">
          Tout est inclus.{" "}
          <Link href="/billing" onClick={onNavigate} className="font-medium text-accent-deep hover:underline">
            Gérer
          </Link>
        </p>
      </div>
    </div>
  );
}

/** App chrome: fixed desktop sidebar, mobile drawer + topbar, command palette. */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1500px]">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-hairline bg-surface/20 px-4 py-6 backdrop-blur-xl md:flex">
        <div aria-hidden className="pointer-events-none absolute -left-10 top-0 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
        <div className="relative flex h-full flex-col">
          <SidebarContent pathname={pathname} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          drawer ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!drawer}
      >
        <div
          className={cn("absolute inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity", drawer ? "opacity-100" : "opacity-0")}
          onClick={() => setDrawer(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[280px] max-w-[84vw] border-r border-hairline bg-canvas px-4 py-6 shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            drawer ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label="Fermer le menu"
            className="absolute right-3 top-5 text-faint hover:text-ink"
          >
            <X size={20} />
          </button>
          <SidebarContent pathname={pathname} onNavigate={() => setDrawer(false)} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-hairline bg-canvas/80 px-4 py-3 backdrop-blur-md md:hidden">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Ouvrir le menu" className="text-muted hover:text-ink">
            <Menu size={22} />
          </button>
          <Link href="/dashboard" className="flex items-center" aria-label="DemoForge">
            <LogoEmblem size={40} />
          </Link>
          <button type="button" onClick={openCommand} aria-label="Rechercher" className="ml-auto text-muted hover:text-ink">
            <Search size={20} />
          </button>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">{children}</main>
      </div>

      <CommandPalette />
    </div>
  );
}
