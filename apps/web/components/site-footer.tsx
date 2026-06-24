import Link from "next/link";
import { Logo } from "./brand/logo.js";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/#fonctionnement", label: "Fonctionnement" },
  { href: "/#exemples", label: "Exemples" },
  { href: "/new", label: "Créer une démo" },
  { href: "/projects", label: "Connexion" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-sm">
          <Logo size={150} />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Studio One — Vidéos de démonstration SaaS professionnelles.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-faint sm:px-8">
          © 2026 Studio One. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
