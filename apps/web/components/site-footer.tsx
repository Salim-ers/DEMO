import Link from "next/link";
import { Logo } from "./brand/logo.js";

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "How it works" },
      { href: "/#gallery", label: "Gallery" },
      { href: "/#workflow", label: "Pipeline" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/projects/new", label: "New demo" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo size={36} />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            The AI demo video studio for SaaS teams. Real screens, premium motion, sales-ready exports.
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
          <span>© 2026 Studio One. All rights reserved.</span>
          <span className="font-mono">Real capture · never fake UI</span>
        </div>
      </div>
    </footer>
  );
}
