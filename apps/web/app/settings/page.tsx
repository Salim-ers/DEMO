import { prisma, ProviderKind } from "@demoforge/db";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProviderSettings, type ProviderRow } from "../../components/provider-settings.js";

export const dynamic = "force-dynamic";

const CATALOG: Array<{ kind: ProviderKind; label: string; description: string; placeholder: string }> = [
  { kind: ProviderKind.LLM_ANTHROPIC, label: "Anthropic", description: "Sharper storyboards and voiceover copy. Falls back to the deterministic writer when absent.", placeholder: "sk-ant-…" },
  { kind: ProviderKind.LLM_OPENAI, label: "OpenAI", description: "Alternative LLM provider for storyboard and script generation.", placeholder: "sk-…" },
  { kind: ProviderKind.ELEVENLABS, label: "ElevenLabs", description: "AI voiceover synthesis. Only ever used with explicit consent.", placeholder: "xi-…" },
  { kind: ProviderKind.HIGGSFIELD, label: "Higgsfield", description: "Optional marketing b-roll and image-to-video transitions.", placeholder: "hf-…" },
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
        <p className="eyebrow mb-2">Settings</p>
        <h1 className="text-2xl font-semibold tracking-tighter text-ink">Providers</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Connect optional providers to enrich generation. Everything works without them.
        </p>
      </header>
      <ProviderSettings initial={rows} />
    </div>
  );
}
