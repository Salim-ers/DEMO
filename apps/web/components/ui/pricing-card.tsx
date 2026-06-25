import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "../../lib/cn.js";

export interface PricingCardProps {
  name: string;
  tagline: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

export function PricingCard({ name, tagline, features, cta, featured }: PricingCardProps) {
  return (
    <div className={cn("card flex h-full flex-col p-8", featured && "border-accent/40")}>
      {featured ? (
        <p className="text-xs font-semibold text-accent-deep">Recommandé</p>
      ) : null}
      <h3 className="text-xl font-semibold text-ink">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tagline}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-muted">
            <Check size={18} className="mt-0.5 shrink-0 text-accent-deep" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={cn("mt-auto w-full justify-center", featured ? "btn-primary" : "btn-secondary")}
      >
        {cta.label}
      </Link>
    </div>
  );
}
