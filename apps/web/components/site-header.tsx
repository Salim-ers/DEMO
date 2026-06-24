import Link from "next/link";
import { LogoMark } from "./brand/logo.js";

const NAV = [
  { href: "/#presentation", label: "Présentation" },
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#exemples", label: "Exemples" },
];

/** Public navbar — sober, low, dark, with a clearly visible wordmark. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Studio One — accueil" className="flex shrink-0 items-center gap-2.5">
          <LogoMark size={38} />
          <span className="text-[17px] font-semibold tracking-tight text-ink">Studio One</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
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
