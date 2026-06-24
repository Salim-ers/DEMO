import Link from "next/link";
import { Camera, LayoutPanelTop, PenLine, Palette, Clapperboard, Eye, Download, ArrowRight } from "lucide-react";

export const metadata = { title: "Aide & guide" };

const STEPS = [
  { icon: Camera, name: "Capture", text: "DemoForge se connecte à votre app et filme les vrais écrans du parcours décrit." },
  { icon: LayoutPanelTop, name: "Arrange", text: "Les scènes sont ordonnées en un storyboard clair, prêt à narrer." },
  { icon: PenLine, name: "Script", text: "Une voix off juste est écrite dans votre langue et votre ton." },
  { icon: Palette, name: "Style", text: "Votre identité de marque s'applique : couleurs, typographies, motion." },
  { icon: Clapperboard, name: "Render", text: "Le montage premium est produit automatiquement, scène par scène." },
  { icon: Eye, name: "Review", text: "Un rapport qualité note le rendu et propose des améliorations." },
  { icon: Download, name: "Export", text: "MP4, sous-titres et archive ZIP, prêts à diffuser partout." },
];

const FAQ = [
  { q: "Par où commencer ?", a: "Créez un projet, indiquez l'URL de votre app et décrivez le parcours en une phrase. DemoForge s'occupe du reste." },
  { q: "Comment supprimer un projet ?", a: "Sur une carte projet, ouvrez le menu (•••) puis Supprimer. Une confirmation est demandée — la suppression est définitive. Pour le garder sans l'afficher, utilisez Archiver." },
  { q: "Où retrouver mes rendus ?", a: "Dans Exports, ou directement sur la page d'un projet une fois le rendu terminé." },
  { q: "La voix off est-elle payante ?", a: "Une voix gratuite est disponible par défaut. Une voix IA premium est possible en option, avec votre consentement." },
];

export default function HelpPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="eyebrow mb-2">Guide</p>
        <h1 className="display text-3xl font-semibold text-ink">Comment fonctionne DemoForge</h1>
        <p className="mt-2 text-muted">Capturez, façonnez, affinez, exportez. Voici le parcours, étape par étape.</p>
      </header>

      <div className="card mb-6 overflow-hidden">
        <div className="border-b border-hairline px-6 py-4">
          <span className="eyebrow">Le flux en 7 étapes</span>
        </div>
        <ol className="divide-y divide-hairline">
          {STEPS.map((s, i) => (
            <li key={s.name} className="flex items-start gap-4 px-6 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
                <s.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-ink">
                  <span className="mr-2 font-mono text-xs text-faint">0{i + 1}</span>
                  {s.name}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="card mb-6 overflow-hidden">
        <div className="border-b border-hairline px-6 py-4">
          <span className="eyebrow">Raccourcis</span>
        </div>
        <ul className="divide-y divide-hairline">
          {[
            ["Ouvrir la palette de commandes", "⌘K / Ctrl+K"],
            ["Nouveau projet", "depuis la barre latérale"],
            ["Fermer une fenêtre", "Échap"],
          ].map(([k, v]) => (
            <li key={k} className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm">
              <span className="text-ink">{k}</span>
              <kbd className="rounded-md border border-hairline bg-surface px-2 py-0.5 font-mono text-xs text-muted">{v}</kbd>
            </li>
          ))}
        </ul>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-hairline px-6 py-4">
          <span className="eyebrow">Questions fréquentes</span>
        </div>
        <div className="divide-y divide-hairline">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 [&_summary]:list-none">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink">
                {f.q}
                <span className="text-faint transition-transform group-open:rotate-90">
                  <ArrowRight size={15} />
                </span>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-hairline bg-surface px-6 py-5">
        <p className="text-sm text-muted">Besoin d'un coup de main ?</p>
        <Link href="/projects/new" className="btn-primary text-sm">
          Créer un projet <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
