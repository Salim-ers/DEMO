"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, CornerDownLeft, FolderOpen } from "lucide-react";
import { NAV_FLAT } from "./nav-items.js";
import { cn } from "../lib/cn.js";

type Project = { id: string; productName: string; status: string };
type Command = { id: string; label: string; hint?: string; icon: typeof Search; run: () => void };

/** Global ⌘K / Ctrl+K command palette. Open via the keyboard or the
 *  `studioone:command` window event (dispatched by the nav button). */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);
  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [router, close],
  );

  // Open / close shortcuts + custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("studioone:command", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("studioone:command", onEvent);
    };
  }, []);

  // Lazy-load projects for search the first time it opens.
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      if (projects.length === 0) {
        fetch("/api/projects")
          .then((r) => r.json())
          .then((d) => setProjects(d.projects ?? []))
          .catch(() => {});
      }
    }
  }, [open, projects.length]);

  const quickActions: Command[] = useMemo(
    () => [
      { id: "new", label: "Nouveau projet", hint: "Créer une démo", icon: Plus, run: () => go("/projects/new") },
      ...NAV_FLAT.map((n) => ({ id: n.href, label: n.label, hint: n.hint, icon: n.icon, run: () => go(n.href) })),
    ],
    [go],
  );

  const q = query.trim().toLowerCase();
  const filteredActions = q
    ? quickActions.filter((c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q))
    : quickActions;
  const filteredProjects = q
    ? projects.filter((p) => p.productName.toLowerCase().includes(q)).slice(0, 6)
    : projects.slice(0, 5);

  const flat: Command[] = [
    ...filteredActions,
    ...filteredProjects.map((p) => ({
      id: `p-${p.id}`,
      label: p.productName,
      hint: "Ouvrir le projet",
      icon: FolderOpen,
      run: () => go(`/projects/${p.id}`),
    })),
  ];

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flat[active]?.run();
    }
  };

  let idx = -1;
  const renderRow = (c: Command) => {
    idx += 1;
    const i = idx;
    return (
      <button
        key={c.id}
        type="button"
        onMouseEnter={() => setActive(i)}
        onClick={c.run}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
          i === active ? "bg-elevated text-ink" : "text-muted hover:bg-elevated/60",
        )}
      >
        <c.icon size={16} className={i === active ? "text-accent-deep" : "text-faint"} />
        <span className="flex-1 truncate font-medium text-ink">{c.label}</span>
        {c.hint && <span className="truncate text-xs text-faint">{c.hint}</span>}
        {i === active && <CornerDownLeft size={13} className="text-faint" />}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={close} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Palette de commandes"
        onKeyDown={onKeyDown}
        className="animate-scale-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-hairline bg-panel shadow-soft"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search size={18} className="text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une action ou un projet…"
            className="h-14 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden rounded-md border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {flat.length === 0 && <p className="px-3 py-8 text-center text-sm text-faint">Aucun résultat.</p>}
          {filteredActions.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-faint">Actions</p>
              {filteredActions.map(renderRow)}
            </>
          )}
          {filteredProjects.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-faint">Projets</p>
              {filteredProjects.map((p) =>
                renderRow({
                  id: `p-${p.id}`,
                  label: p.productName,
                  hint: "Ouvrir le projet",
                  icon: FolderOpen,
                  run: () => go(`/projects/${p.id}`),
                }),
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
