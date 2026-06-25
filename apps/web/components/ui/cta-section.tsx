import Link from "next/link";
import { cn } from "../../lib/cn.js";
import { LogoMark } from "../brand/logo.js";

type CTASectionProps = {
  title: string;
  text: string;
  cta: { label: string; href: string };
  className?: string;
};

/**
 * Bandeau d'appel à l'action en pied de page marketing.
 * Halo caramel sobre (radial discret) — aucun dégradé arc-en-ciel, aucune plaque
 * derrière le logo. Contenu centré : badge crème, titre display, texte muted, CTA plein.
 */
export function CTASection({ title, text, cta, className }: CTASectionProps) {
  return (
    <section className={cn("relative overflow-hidden px-5 py-28 sm:py-36", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(185,130,74,0.16), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <LogoMark tone="cream" size={84} />
        <h2 className="text-display mt-8 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">{title}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{text}</p>
        <Link href={cta.href} className="btn-primary mt-8 px-8 py-4 text-base">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
