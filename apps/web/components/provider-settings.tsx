"use client";
import { useState } from "react";
import { Check, Loader2, KeyRound } from "lucide-react";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Badge } from "./ui/badge.js";

export interface ProviderRow {
  kind: string;
  label: string;
  description: string;
  enabled: boolean;
  hasSecret: boolean;
  placeholder: string;
}

export function ProviderSettings({ initial }: { initial: ProviderRow[] }) {
  const [rows, setRows] = useState(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(kind: string) {
    setSaving(kind);
    setSaved(null);
    try {
      const res = await fetch("/api/settings/providers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, apiKey: drafts[kind] ?? "", enabled: true }),
      });
      if (res.ok) {
        setRows((rs) => rs.map((r) => (r.kind === kind ? { ...r, enabled: true, hasSecret: Boolean(drafts[kind]) || r.hasSecret } : r)));
        setDrafts((d) => ({ ...d, [kind]: "" }));
        setSaved(kind);
        setTimeout(() => setSaved(null), 2000);
      }
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((r) => (
        <div key={r.kind} className="card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[15px] font-semibold tracking-tighter text-ink">{r.label}</h3>
                {r.enabled ? <Badge tone="ok">Connecté</Badge> : <Badge tone="neutral">Non connecté</Badge>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{r.description}</p>
            </div>
            <KeyRound size={18} className="shrink-0 text-faint" />
          </div>
          <div className="flex items-center gap-2.5">
            <Input
              type="password"
              value={drafts[r.kind] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [r.kind]: e.target.value }))}
              placeholder={r.hasSecret ? "•••••••••••• (enregistré — collez pour remplacer)" : r.placeholder}
            />
            <Button size="md" onClick={() => save(r.kind)} disabled={saving === r.kind || !(drafts[r.kind] ?? "").trim()}>
              {saving === r.kind ? <Loader2 size={16} className="animate-spin" /> : saved === r.kind ? <Check size={16} /> : null}
              Enregistrer
            </Button>
          </div>
        </div>
      ))}
      <p className="px-1 text-xs leading-relaxed text-faint">
        Les clés sont chiffrées dans le coffre et stockées uniquement sous forme de références opaques — jamais en clair,
        jamais dans les logs. Laissez un fournisseur déconnecté pour fonctionner entièrement hors ligne avec les solutions
        de repli déterministes.
      </p>
    </div>
  );
}
