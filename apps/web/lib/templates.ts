import type { LucideIcon } from "lucide-react";
import { MonitorPlay, Smartphone, Store, Wrench, Rocket, LineChart, Megaphone } from "lucide-react";

export type Template = {
  id: string;
  name: string;
  blurb: string;
  icon: LucideIcon;
  format: string;
  duration: string;
  tone: string;
};

/** Starting points for a new project. Selecting one opens the new-project flow. */
export const TEMPLATES: Template[] = [
  { id: "saas", name: "Démo produit SaaS", blurb: "Présentez le parcours clé de votre app, écran par écran.", icon: MonitorPlay, format: "16:9", duration: "60 s", tone: "Premium" },
  { id: "mobile", name: "Walkthrough mobile", blurb: "Un tour vertical, pensé pour les stories et les réseaux.", icon: Smartphone, format: "9:16", duration: "30 s", tone: "Dynamique" },
  { id: "marketplace", name: "Tour marketplace", blurb: "Mettez en avant l'offre, la recherche et l'achat.", icon: Store, format: "16:9", duration: "90 s", tone: "Commercial" },
  { id: "internal", name: "Démo outil interne", blurb: "Formez vos équipes sur un workflow, sans friction.", icon: Wrench, format: "16:9", duration: "90 s", tone: "Pédagogique" },
  { id: "launch", name: "Vidéo de lancement", blurb: "Un teaser soigné pour annoncer une nouveauté.", icon: Rocket, format: "16:9", duration: "30 s", tone: "Cinématique" },
  { id: "investor", name: "Démo investisseurs", blurb: "Racontez la traction et le produit avec clarté.", icon: LineChart, format: "16:9", duration: "180 s", tone: "Investor" },
  { id: "feature", name: "Annonce de feature", blurb: "Un focus court et net sur une fonctionnalité.", icon: Megaphone, format: "1:1", duration: "30 s", tone: "Sales" },
];
