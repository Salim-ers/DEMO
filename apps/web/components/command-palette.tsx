"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, FolderOpen, Settings, PlayCircle, Sun, Moon, Monitor, LogOut, CornerDownLeft, type LucideIcon,
} from "lucide-react";
import { useTheme } from "./theme.js";
import { cn } from "../lib/cn.js";

type Action = { id: string; label: string; icon: LucideIcon; keywords?: string; run: () => void };

/** Open the command palette from anywhere. */
export function openCommandPalette() {
  window.dispatchEvent(new Event("studioone:command"));
}

/** Keyboard-first command palette (⌘K / Ctrl+K) — navigation, theme, logout. */
export function CommandPalette() {
  const router = useRouter();
  const { setPref } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = useMemo(
    () => [
      { id: "new", label: "Nouvelle vidéo", icon: Plus, keywords: "creer demo video", run: () => router.push("/new") },
      { id: "projects", label: "Mes vidéos", icon: FolderOpen, keywords: "projets demos", run: () => router.push("/projects") },
      { id: "settings", label: "Réglages", icon: Settings, keywords: "parametres compte cles api", run: () => router.push("/settings") },
      { id: "demo", label: "Voir un exemple", icon: PlayCircle, keywords: "demo exemple", run: () => router.push("/demo") },
      { id: "light", label: "Thème clair", icon: Sun, keywords: "apparence theme clair light", run: () => setPref("light") },
      { id: "dark", label: "Thème sombre", icon: Moon, keywords: "apparence theme sombre dark", run: () => setPref("dark") },
      { id: "system", label: "Thème système", icon: Monitor, keywords: "apparence theme systeme", run: () => setPref("system") },
      {
        id: "logout",
        label: "Se déconnecter",
        icon: LogOut,
        keywords: "deconnexion logout sortir",
        run: async () => {
          await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
          window.location.href = "/";
        },
      },
    ],
    [router, setPref],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.keywords ?? ""}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("studioone:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("studioone:command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      document.documentElement.style.overflow = "hidden";
      return () => clearTimeout(t);
    }
    document.documentElement.style.overflow = "";
    return undefined;
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const run = (a: Action) => {
    setOpen(false);
    a.run();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Palette de commandes">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-panel shadow-soft">
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search size={18} className="text-faint" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const a = filtered[active];
                if (a) run(a);
              }
            }}
            placeholder="Rechercher une action…"
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium text-faint sm:block">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-faint">Aucune action</li>
          ) : (
            filtered.map((a, i) => (
              <li key={a.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(a)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150",
                    i === active ? "bg-elevated text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <a.icon size={17} className={i === active ? "text-accent-deep" : "text-faint"} aria-hidden />
                  <span className="flex-1 font-medium">{a.label}</span>
                  {i === active && <CornerDownLeft size={14} className="text-faint" aria-hidden />}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
