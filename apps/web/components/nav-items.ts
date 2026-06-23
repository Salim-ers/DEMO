import type { LucideIcon } from "lucide-react";
import {
  Home,
  FolderOpen,
  LayoutTemplate,
  Palette,
  Library,
  Download,
  Gauge,
  CreditCard,
  Settings,
  LifeBuoy,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; hint?: string };

/** Single source of truth for the sidebar and the command palette. */
export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Studio",
    items: [
      { href: "/dashboard", label: "Accueil", icon: Home, hint: "Vue d'ensemble" },
      { href: "/projects", label: "Projets", icon: FolderOpen, hint: "Tous vos projets" },
      { href: "/templates", label: "Modèles", icon: LayoutTemplate, hint: "Partir d'un modèle" },
    ],
  },
  {
    title: "Bibliothèque",
    items: [
      { href: "/brand-kit", label: "Brand Kit", icon: Palette, hint: "Identité de marque" },
      { href: "/assets", label: "Ressources", icon: Library, hint: "Médias & fichiers" },
      { href: "/exports", label: "Exports", icon: Download, hint: "Rendus livrés" },
      { href: "/quality", label: "Rapports qualité", icon: Gauge, hint: "Contrôle qualité" },
    ],
  },
  {
    title: "Compte",
    items: [
      { href: "/billing", label: "Facturation", icon: CreditCard, hint: "Abonnement" },
      { href: "/settings", label: "Paramètres", icon: Settings, hint: "Fournisseurs" },
      { href: "/help", label: "Aide & guide", icon: LifeBuoy, hint: "Comment ça marche" },
    ],
  },
];

export const NAV_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
