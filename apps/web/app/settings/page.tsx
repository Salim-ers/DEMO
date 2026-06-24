import { prisma, ProviderKind } from "@studio-one/db";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProviderSettings, type ProviderRow } from "../../components/provider-settings.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Paramètres" };

const CATALOG: Array<{ kind: ProviderKind; label: string; description: string; placeholder: string }> = [
  { kind: ProviderKind.LLM_ANTHROPIC, label: "Anthropic", description: "Storyboards et textes de voix off plus précis. Bascule sur le générateur déterministe en son absence.", placeholder: "sk-ant-…" },
  { kind: ProviderKind.LLM_OPENAI, label: "OpenAI", description: "Fournisseur LLM alternatif pour la génération de storyboard et de script.", placeholder: "sk-…" },
  { kind: ProviderKind.ELEVENLABS, label: "ElevenLabs", description: "Synthèse de voix off par IA. Utilisée uniquement avec consentement explicite.", placeholder: "xi-…" },
  { kind: ProviderKind.HIGGSFIELD, label: "Higgsfield", description: "B-roll marketing et transitions image-vers-vidéo (optionnel).", placeholder: "hf-…" },
];

export default async function SettingsPage() {
  const workspaceId = await getActiveWorkspaceId();
  const providers = await prisma.integrationProvider.findMany({ where: { workspaceId } });
  const byKind = new Map(providers.map((p) => [p.kind, p]));

  const rows: ProviderRow[] = CATALOG.map((c) => {
    const row = byKind.get(c.kind);
    return {
      kind: c.kind,
      label: c.label,
      description: c.description,
      enabled: row?.enabled ?? false,
      hasSecret: Boolean(row?.secretRef),
      placeholder: c.placeholder,
    };
  });

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <p className="eyebrow mb-2">Paramètres</p>
        <h1 className="display text-3xl font-semibold text-ink">Paramètres</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Connectez des fournisseurs optionnels pour enrichir la génération. Tout fonctionne sans eux.
        </p>
      </header>

      <ProviderSettings initial={rows} />
    </div>
  );
}
