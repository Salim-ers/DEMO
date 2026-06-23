import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEMPLATES } from "../../lib/templates.js";

export const metadata = { title: "Modèles" };

export default function TemplatesPage() {
  return (
    <div className="animate-fade-up">
      <header className="mb-8">
        <p className="eyebrow mb-2">Démarrer vite</p>
        <h1 className="display text-3xl font-semibold text-ink">Modèles</h1>
        <p className="mt-2 max-w-lg text-muted">
          Choisissez un point de départ pensé pour votre format. Vous gardez la main sur chaque détail.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t, i) => (
          <Link
            key={t.id}
            href={`/projects/new?template=${t.id}`}
            style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
            className="card group animate-fade-up flex flex-col p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bronze-sheen text-ivory shadow-glow transition-transform group-hover:scale-105">
              <t.icon size={22} />
            </span>
            <h3 className="display mt-5 text-lg font-semibold text-ink">{t.name}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{t.blurb}</p>
            <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
              <div className="flex gap-1.5">
                <span className="chip">{t.format}</span>
                <span className="chip">{t.duration}</span>
                <span className="chip">{t.tone}</span>
              </div>
              <ArrowRight size={16} className="text-faint transition-all group-hover:translate-x-1 group-hover:text-accent-deep" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
