import Link from "next/link";
import { Plus } from "lucide-react";
import type { SubscriptionUsage } from "../lib/subscription.js";
import { formatPrice } from "../lib/pricing.js";

const SIZE = 132;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/**
 * Monthly quota at a glance: a bronze ring showing videos used / included, the
 * renewal date and a shortcut to start the next one.
 */
export function QuotaCard({ usage }: { usage: SubscriptionUsage }) {
  const offset = C * (1 - usage.ratio);
  const full = usage.remaining === 0;

  return (
    <div className="card flex items-center gap-5 p-5">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <defs>
            <linearGradient id="quota-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E3B36D" />
              <stop offset="1" stopColor="#C68642" />
            </linearGradient>
          </defs>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(246,231,204,0.10)" strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={full ? "#E8924A" : "url(#quota-grad)"}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[1.9rem] font-bold leading-none tabular-nums text-ink">
            {usage.usedVideosThisMonth}
            <span className="text-faint">/{usage.includedVideos}</span>
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-faint">ce mois</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-accent-deep">{usage.planName}</p>
        <p className="mt-1.5 text-[15px] font-semibold text-ink">{formatPrice(usage.monthlyPrice)} / mois</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {full
            ? "Quota atteint. Il se recharge le " + usage.renewalLabel + "."
            : `${usage.remaining} vidéo${usage.remaining > 1 ? "s" : ""} restante${usage.remaining > 1 ? "s" : ""} · renouvellement le ${usage.renewalLabel}`}
        </p>
        <Link
          href="/new"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep transition-colors hover:text-champagne"
        >
          <Plus size={15} /> Nouvelle vidéo
        </Link>
      </div>
    </div>
  );
}
