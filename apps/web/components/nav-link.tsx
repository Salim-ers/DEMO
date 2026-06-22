"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/cn.js";

export function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
        active ? "bg-white/5 text-ink" : "text-muted hover:bg-white/5 hover:text-ink",
      )}
    >
      <Icon size={17} className={cn(active ? "text-accent" : "text-faint group-hover:text-muted")} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
