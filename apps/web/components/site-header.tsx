import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./brand/logo.js";
import { GlowButton } from "./ui/glow-button.js";

const NAV = [
  { href: "/#features", label: "Product" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
];

/** Public marketing header — dark glass, sticky, restrained. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="DemoForge — home">
          <Logo size={34} />
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
            Log in
          </Link>
          <GlowButton href="/projects/new" className="px-5 py-2.5">
            Create demo <ArrowRight size={15} />
          </GlowButton>
        </div>
      </div>
    </header>
  );
}
