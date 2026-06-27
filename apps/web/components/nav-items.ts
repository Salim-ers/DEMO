import type { LucideIcon } from "lucide-react";
import { FolderOpen, Settings } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; hint?: string };

/** Workspace navigation. "Nouvelle démo" lives in the primary button, not here. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/projects", label: "Mes démos", icon: FolderOpen, hint: "Vos vidéos" },
  { href: "/settings", label: "Réglages", icon: Settings, hint: "Compte & clés API" },
];
