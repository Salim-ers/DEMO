"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn.js";
import { PLAN, yearlyBreakdown } from "../lib/pricing.js";

type Billing = "monthly" | "yearly";

/** Monthly / Yearly switch with a sliding pill. */
function BillingToggle({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  const { savedPct } = yearlyBreakdown();
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative inline-flex rounded-full border border-hairline bg-surface p-1">
        <span
          className={cn(
            "absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-panel shadow-panel transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            value === "yearly" && "translate-x-full",
          )}
        />
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => onChange(b)}
            className={cn(
              "relative z-10 w-28 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              value === b ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {b === "monthly" ? "Mensuel" : "Annuel"}
          </button>
        ))}
      </div>
      <span className="chip border-accent/30 bg-accent-soft text-accent-deep">−{savedPct}% à l'année</span>
    </div>
  );
}

/** The single StudioOne plan card + billing toggle. Reused on landing & /pricing. */
export function Pricing({ defaultBilling = "yearly" }: { defaultBilling?: Billing }) {
  const [billing, setBilling] = useState<Billing>(defaultBilling);
  const { perMonth } = yearlyBreakdown();
  const price = billing === "monthly" ? PLAN.monthly : perMonth;

  return (
    <div className="flex flex-col items-center">
      <BillingToggle value={billing} onChange={setBilling} />

      <div className="relative mt-9 w-full max-w-md">
        <div className="absolute -inset-px rounded-3xl bg-bronze-sheen opacity-90" />
        <div className="relative m-px rounded-3xl bg-panel p-8 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Le plan</p>
              <h3 className="display mt-1 text-2xl font-semibold text-ink">{PLAN.name}</h3>
            </div>
            <span className="chip border-accent/30 bg-accent-soft text-accent-deep">Tout inclus</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{PLAN.summary}</p>

          <div className="mt-6 flex items-end gap-1.5">
            <span className="display text-5xl font-semibold text-ink">
              {PLAN.currency}
              {price}
            </span>
            <span className="mb-1.5 text-sm text-muted">/ mois</span>
          </div>
          <p className="mt-1 h-5 text-xs text-faint">
            {billing === "yearly"
              ? `Facturé ${PLAN.currency}${PLAN.yearly} par an — deux mois offerts.`
              : "Facturation mensuelle, sans engagement."}
          </p>

          <Link href="/projects/new" className="btn-primary mt-6 w-full py-3">
            Commencer maintenant <ArrowRight size={16} />
          </Link>

          <ul className="mt-7 space-y-3">
            {PLAN.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                  <Check size={13} strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 text-xs text-faint">Sans carte pour commencer · annulable à tout moment</p>
    </div>
  );
}
