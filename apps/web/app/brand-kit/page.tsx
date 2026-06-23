import { Download, Lock } from "lucide-react";
import { LogoEmblem } from "../../components/brand/logo.js";

export const metadata = { title: "Brand Kit" };

const COLORS = [
  { name: "Bronze", hex: "#9A6534" },
  { name: "Cognac", hex: "#A6703B" },
  { name: "Caramel", hex: "#C08E51" },
  { name: "Gold", hex: "#C79A5B" },
  { name: "Espresso", hex: "#2B2118" },
  { name: "Champagne", hex: "#EDE3D3" },
  { name: "Ivoire", hex: "#F7F1E7" },
];

const TONE = ["Chaleureux", "Précis", "Premium", "Humain", "Confiant", "Sans jargon"];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">{title}</span>
        {hint && <span className="text-xs text-faint">{hint}</span>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function BrandKitPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-4xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Identité</p>
          <h1 className="display text-3xl font-semibold text-ink">Brand Kit</h1>
          <p className="mt-2 max-w-lg text-muted">
            Le système visuel appliqué à vos rendus. Couleurs, typographies et ton, réunis au même endroit.
          </p>
        </div>
        <span className="chip">
          <Lock size={12} /> Personnalisation bientôt
        </span>
      </header>

      <div className="space-y-6">
        <Section title="Logo">
          <div className="flex flex-wrap items-center gap-6">
            <LogoEmblem size={120} />
            <div className="space-y-2.5">
              <p className="text-sm text-muted">Emblème officiel, à utiliser sur fond clair ou sombre.</p>
              <div className="flex gap-2.5">
                <a href="/brand/studioone-badge.svg" download className="btn-secondary text-sm">
                  <Download size={15} /> Badge SVG
                </a>
                <a href="/brand/studioone-mark.svg" download className="btn-secondary text-sm">
                  <Download size={15} /> Mark SVG
                </a>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Couleurs" hint="Palette warm signature">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {COLORS.map((c) => (
              <div key={c.name}>
                <div
                  className="aspect-square w-full rounded-2xl border border-hairline shadow-panel"
                  style={{ background: c.hex }}
                />
                <p className="mt-2 text-xs font-medium text-ink">{c.name}</p>
                <p className="font-mono text-[11px] uppercase text-faint">{c.hex}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typographie">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-faint">Display · Fraunces</p>
              <p className="display text-3xl font-semibold text-ink">Des démos façon studio</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-faint">Texte · Inter</p>
              <p className="text-lg text-ink">De vrais écrans, un flux élégant, un rendu premium.</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-faint">Logotype · Pacifico</p>
              <p className="font-script text-3xl text-espresso">Studio One</p>
            </div>
          </div>
        </Section>

        <div className="grid gap-6 sm:grid-cols-2">
          <Section title="Ton de voix">
            <div className="flex flex-wrap gap-2">
              {TONE.map((t) => (
                <span key={t} className="chip border-accent/25 bg-accent-soft text-accent-deep">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Clair, humain, premium. On décrit ce que le produit fait, sans superlatifs ni jargon.
            </p>
          </Section>

          <Section title="Style d'export">
            <dl className="space-y-3 text-sm">
              {[
                ["Format par défaut", "16:9 · 1080p"],
                ["Sous-titres", "SRT + VTT"],
                ["Voix off", "Gratuite ou IA premium"],
                ["Archive", "ZIP de tous les fichiers"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-faint">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}
