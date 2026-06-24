"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Menu, X } from "lucide-react";
import { Logo } from "./brand/logo.js";
import { NAV_ITEMS } from "./nav-items.js";
import { cn } from "../lib/cn.js";

function isActive(pathname: string, href: string) {
  if (href === "/projects") return pathname === "/projects" || pathname.startsWith("/projects/");
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/projects" onClick={onNavigate} className="mb-8 inline-block" aria-label="Studio One — accueil">
        <Logo size={128} />
      </Link>

      <Link
        href="/new"
        onClick={onNavigate}
        className="mb-7 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-studio transition-colors hover:bg-accent-deep"
      >
        <Plus size={16} /> Nouvelle démo
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-elevated text-ink" : "text-muted hover:bg-elevated/60 hover:text-ink",
              )}
            >
              {active && <span className="absolute left-0 h-5 w-[3px] rounded-full bg-accent" />}
              <item.icon size={18} className={cn(active ? "text-accent-deep" : "text-faint group-hover:text-muted")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <p className="mt-6 px-3 text-xs leading-relaxed text-faint">
        Studio One — Vidéos de démonstration SaaS professionnelles.
      </p>
    </div>
  );
}

/** App chrome: fixed desktop sidebar + mobile drawer. Calm and uncluttered. */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-hairline px-4 py-6 md:flex">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn("fixed inset-0 z-50 md:hidden", drawer ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!drawer}
      >
        <div
          className={cn("absolute inset-0 bg-black/50 transition-opacity", drawer ? "opacity-100" : "opacity-0")}
          onClick={() => setDrawer(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[272px] max-w-[84vw] border-r border-hairline bg-canvas px-4 py-6 shadow-soft transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
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
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-hairline bg-canvas/90 px-4 py-3 backdrop-blur-md md:hidden">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Ouvrir le menu" className="text-muted hover:text-ink">
            <Menu size={22} />
          </button>
          <Link href="/projects" className="flex items-center" aria-label="Studio One">
            <Logo size={104} />
          </Link>
        </header>

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
