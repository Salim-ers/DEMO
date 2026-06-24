import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./brand/logo.js";
import { GlowButton } from "./ui/glow-button.js";

const NAV = [
  { href: "/#studio", label: "Studio" },
  { href: "/#gallery", label: "Demos" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/pricing", label: "Pricing" },
];

/** Public marketing header — tall, glass, with a clearly visible wordmark. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/70 bg-canvas/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" aria-label="Studio One — home" className="-my-2 shrink-0">
          <Logo size={58} />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[15px] font-medium text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden text-[15px] font-medium text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Log in
          </Link>
          <GlowButton href="/projects/new" className="px-6 py-3 text-[15px]">
            Create a demo <ArrowRight size={16} />
          </GlowButton>
        </div>
      </div>
    </header>
  );
}
