import { ShieldCheck, Sparkles, LifeBuoy } from "lucide-react";
import { Pricing } from "../../components/pricing.js";

export const metadata = { title: "Tarifs" };

const REASSURANCE = [
  { icon: Sparkles, title: "Tout est inclus", text: "Aucune fonctionnalité verrouillée, aucun palier caché." },
  { icon: ShieldCheck, title: "Sans engagement", text: "Mensuel ou annuel, annulable à tout moment." },
  { icon: LifeBuoy, title: "Support prioritaire", text: "Une équipe qui répond vite quand vous livrez." },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Tarifs</p>
        <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.25rem)] font-semibold text-ink">
          Un seul plan. Tout est inclus.
        </h1>
        <p className="mt-4 text-lg text-muted">
          DemoForge, c'est une offre simple et transparente. Choisissez la facturation qui vous convient.
        </p>
      </div>

      <div className="mt-14">
        <Pricing />
      </div>

      <div className="mx-auto mt-20 grid max-w-3xl gap-4 sm:grid-cols-3">
        {REASSURANCE.map((r) => (
          <div key={r.title} className="card p-6 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-deep">
              <r.icon size={20} />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-ink">{r.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
