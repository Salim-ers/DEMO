import { prisma, ProviderKind } from "@studio-one/db";
import { APP_NAME } from "@studio-one/shared";
import { getActiveWorkspaceId } from "../../lib/workspace.js";
import { ProviderSettings, type ProviderRow } from "../../components/provider-settings.js";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réglages" };

const CATALOG: Array<{ kind: ProviderKind; label: string; description: string; placeholder: string }> = [
  { kind: ProviderKind.LLM_ANTHROPIC, label: "Anthropic", description: "Storyboards et textes de voix off plus précis. Optionnel : un générateur intégré prend le relais sans clé.", placeholder: "sk-ant-…" },
  { kind: ProviderKind.LLM_OPENAI, label: "OpenAI", description: "Fournisseur alternatif pour la génération de storyboard et de script.", placeholder: "sk-…" },
  { kind: ProviderKind.ELEVENLABS, label: "ElevenLabs", description: "Voix off premium. Utilisée uniquement avec votre consentement explicite.", placeholder: "xi-…" },
  { kind: ProviderKind.HIGGSFIELD, label: "Higgsfield", description: "Transitions et plans d’illustration supplémentaires (optionnel).", placeholder: "hf-…" },
];

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-8">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3.5 last:border-b-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

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
      <header className="mb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Réglages</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Votre compte et quelques options. Tout fonctionne sans configuration supplémentaire.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <SettingsSection title="Informations du compte">
          <div className="card">
            <Row label="Espace de travail" value={APP_NAME} />
            <Row label="Langue" value="Français" />
          </div>
        </SettingsSection>

        <SettingsSection
          title="Clés API optionnelles"
          description="Connectez des fournisseurs pour enrichir la génération. Aucun n’est obligatoire."
        >
          <ProviderSettings initial={rows} />
        </SettingsSection>

        <SettingsSection title="Stockage" description="Espace utilisé par vos démos, captures et exports.">
          <div className="card">
            <Row label="Conservation des fichiers" value="Illimitée" />
            <Row label="Exports disponibles" value="Vidéo, script, sous-titres" />
          </div>
        </SettingsSection>

        <SettingsSection title="Qualité vidéo par défaut" description="Appliquée aux nouvelles démos. Modifiable projet par projet.">
          <div className="card">
            <Row label="Résolution" value="1080p" />
            <Row label="Format par défaut" value="16:9 — paysage" />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
