"use client";
import { Monitor, Sun, Moon, type LucideIcon } from "lucide-react";
import { useTheme, type ThemePref } from "./theme.js";
import { cn } from "../lib/cn.js";

const OPTIONS: { value: ThemePref; icon: LucideIcon; label: string }[] = [
  { value: "system", icon: Monitor, label: "Système" },
  { value: "light", icon: Sun, label: "Clair" },
  { value: "dark", icon: Moon, label: "Sombre" },
];

/** Segmented theme selector (Système / Clair / Sombre). */
export function ThemeToggle({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { pref, setPref } = useTheme();
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl border border-hairline bg-surface p-1", className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setPref(o.value)}
          aria-pressed={pref === o.value}
          title={o.label}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
            pref === o.value ? "bg-elevated text-ink" : "text-muted hover:text-ink",
          )}
        >
          <o.icon size={14} />
          {!compact && <span className="hidden sm:inline">{o.label}</span>}
        </button>
      ))}
    </div>
  );
}
