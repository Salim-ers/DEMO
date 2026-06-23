"use client";
import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "../lib/cn.js";
import { PLAN, yearlyBreakdown } from "../lib/pricing.js";

type Billing = "monthly" | "yearly";

/** Settings → current plan. One plan, billing-cycle display, trustworthy. */
export function BillingPanel() {
  const [billing, setBilling] = useState<Billing>("yearly");
  const { perMonth, savedPct } = yearlyBreakdown();
  const price = billing === "monthly" ? PLAN.monthly : perMonth;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Plan &amp; facturation</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-0.5 text-xs font-medium text-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Actif
        </span>
      </div>

      <div className="px-6 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="display text-xl font-semibold text-ink">{PLAN.name}</h3>
            <p className="mt-1 text-sm text-muted">{PLAN.summary}</p>
          </div>
          <div className="text-right">
            <div className="flex items-end gap-1">
              <span className="display text-3xl font-semibold text-ink">
                {PLAN.currency}
                {price}
              </span>
              <span className="mb-1 text-xs text-muted">/ mois</span>
            </div>
            <p className="text-xs text-faint">
              {billing === "yearly" ? `Facturé ${PLAN.currency}${PLAN.yearly}/an` : "Facturé mensuellement"}
            </p>
          </div>
        </div>

        {/* Billing cycle */}
        <div className="mt-5 inline-flex rounded-full border border-hairline bg-surface p-1">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBilling(b)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                billing === b ? "bg-panel text-ink shadow-panel" : "text-muted hover:text-ink",
              )}
            >
              {b === "monthly" ? "Mensuel" : `Annuel · −${savedPct}%`}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {PLAN.features.slice(0, 6).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
              <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-accent-deep" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/pricing" className="btn-secondary">
            Voir les tarifs
          </Link>
          <button
            type="button"
            disabled
            title="Bientôt disponible"
            className="btn cursor-not-allowed border border-hairline bg-surface px-5 py-2.5 text-sm font-medium text-faint"
          >
            Gérer le paiement
          </button>
        </div>
      </div>
    </div>
  );
}
