import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./brand/logo.js";

const NAV = [
  { href: "/#workflow", label: "Le flux" },
  { href: "/#features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/#faq", label: "FAQ" },
];

/** Public marketing header — translucent, sticky, restrained. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/80 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="StudioOne — accueil">
          <Logo size={46} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-elevated hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden rounded-xl px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Ouvrir l'app
          </Link>
          <Link href="/projects/new" className="btn-primary">
            Commencer <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
