"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Settings, Plus, Sparkles } from "lucide-react";
import { Logo } from "./brand/logo.js";
import { NavLink } from "./nav-link.js";
import { SiteHeader } from "./site-header.js";
import { SiteFooter } from "./site-footer.js";

/** Routes that render the public marketing chrome instead of the app sidebar. */
const MARKETING_ROUTES = new Set(["/", "/pricing"]);

/**
 * One frame, two faces. Public pages (landing, pricing) get a marketing header +
 * footer; the workspace gets the persistent sidebar. Chosen from the pathname so
 * the root layout stays a single tree.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (MARKETING_ROUTES.has(pathname)) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      <aside className="sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col border-r border-hairline px-4 py-6 md:flex">
        <Link href="/dashboard" className="mb-8 px-2" aria-label="StudioOne — tableau de bord">
          <Logo size={30} />
        </Link>

        <nav className="flex flex-col gap-1">
          <NavLink href="/dashboard" label="Projets" icon={LayoutGrid} />
          <NavLink href="/settings" label="Paramètres" icon={Settings} />
        </nav>

        <Link
          href="/projects/new"
          className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ivory shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-soft"
        >
          <Plus size={16} /> Nouvelle démo
        </Link>

        <div className="mt-auto rounded-2xl border border-hairline bg-surface/70 px-4 py-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-accent-deep">
            <Sparkles size={13} /> Le flux StudioOne
          </p>
          <p className="text-xs leading-relaxed text-faint">
            Capture → storyboard → script → rendu. De vrais écrans, aucune UI inventée.
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12">{children}</main>
    </div>
  );
}
