import Link from "next/link";
import { Logo } from "./brand/logo.js";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Produit",
    links: [
      { href: "/#fonctionnement", label: "Fonctionnement" },
      { href: "/#moteur", label: "Le moteur" },
      { href: "/#styles", label: "Styles" },
      { href: "/#exemples", label: "Exemples" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/#prix", label: "Prix" },
      { href: "/#faq", label: "FAQ" },
      { href: "/demo", label: "Voir un exemple" },
      { href: "/security", label: "Sécurité" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/login", label: "Connexion" },
      { href: "/projects", label: "Mes démos" },
      { href: "/new", label: "Nouvelle vidéo" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo size={140} />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Vidéos de démonstration professionnelles pour SaaS, outils métiers et produits digitaux.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={`${col.title}-${l.label}`}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8 text-xs text-faint sm:px-8">
        © Studio One. Tous droits réservés.
      </div>
    </footer>
  );
}
