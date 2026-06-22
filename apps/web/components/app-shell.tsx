"use client";
import Link from "next/link";
import { LayoutGrid, Settings, Plus, Clapperboard } from "lucide-react";
import { APP_NAME } from "@demoforge/shared";
import { NavLink } from "./nav-link.js";

/** Persistent app frame: slim sidebar + content column. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-hairline px-4 py-6 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/40 shadow-glow">
            <Clapperboard size={18} className="text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tighter text-ink">{APP_NAME}</span>
        </Link>

        <nav className="flex flex-col gap-1">
          <NavLink href="/" label="Projets" icon={LayoutGrid} />
          <NavLink href="/settings" label="Paramètres" icon={Settings} />
        </nav>

        <Link
          href="/projects/new"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-accent/90"
        >
          <Plus size={16} /> Nouvelle démo
        </Link>

        <div className="mt-auto px-2">
          <p className="eyebrow mb-1">Pipeline</p>
          <p className="text-xs leading-relaxed text-faint">
            Capture → storyboard → script → rendu. De vrais écrans, aucune UI inventée.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
