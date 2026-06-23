import Link from "next/link";
import { Logo } from "./brand/logo.js";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Produit",
    links: [
      { href: "/#workflow", label: "Le flux" },
      { href: "/#features", label: "Fonctionnalités" },
      { href: "/pricing", label: "Tarifs" },
    ],
  },
  {
    title: "Espace de travail",
    links: [
      { href: "/dashboard", label: "Tableau de bord" },
      { href: "/projects/new", label: "Nouvelle démo" },
      { href: "/settings", label: "Paramètres" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo size={32} />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Des démos produit soignées, façon studio. De vrais écrans, un flux élégant, un rendu premium.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-3">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-faint sm:flex-row sm:px-8">
          <span>© {2026} StudioOne. Tous droits réservés.</span>
          <span className="font-mono">Capture réelle · jamais d'UI inventée</span>
        </div>
      </div>
    </footer>
  );
}
