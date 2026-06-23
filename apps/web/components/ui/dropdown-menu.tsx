"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useClickOutside } from "../../lib/use-click-outside.js";
import { cn } from "../../lib/cn.js";

const MenuCtx = createContext<{ close: () => void }>({ close: () => {} });

/** Lightweight, accessible dropdown. Closes on outside-click, Escape, or select. */
export function DropdownMenu({
  trigger,
  children,
  align = "end",
  triggerClassName,
  label = "Actions",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  triggerClassName?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className={cn(
            "animate-scale-in absolute z-50 mt-1.5 min-w-[208px] origin-top overflow-hidden rounded-xl border border-hairline bg-panel p-1.5 shadow-soft",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          <MenuCtx.Provider value={{ close: () => setOpen(false) }}>{children}</MenuCtx.Provider>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  icon: Icon,
  children,
  onSelect,
  danger = false,
  disabled = false,
}: {
  icon?: LucideIcon;
  children: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  const { close } = useContext(MenuCtx);
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.();
        close();
      }}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors disabled:pointer-events-none disabled:opacity-40",
        danger ? "text-bad hover:bg-bad/10" : "text-ink hover:bg-elevated",
      )}
    >
      {Icon && <Icon size={15} className={danger ? "text-bad" : "text-faint"} />}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-hairline" />;
}
