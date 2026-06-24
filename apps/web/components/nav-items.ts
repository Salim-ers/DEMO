import type { LucideIcon } from "lucide-react";
import { FolderOpen, Plus, Settings } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; hint?: string };

/** Single, simple navigation for the workspace. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/projects", label: "Mes démos", icon: FolderOpen, hint: "Vos projets" },
  { href: "/new", label: "Nouvelle démo", icon: Plus, hint: "Créer une vidéo" },
  { href: "/settings", label: "Réglages", icon: Settings, hint: "Compte & clés API" },
];
