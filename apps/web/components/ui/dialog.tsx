"use client";
import { useEffect, type ReactNode } from "react";
import { cn } from "../../lib/cn.js";

/** Modal dialog: backdrop, Escape-to-close, scroll lock. Rendered inline (fixed). */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "animate-scale-in relative w-full max-w-md rounded-3xl border border-hairline bg-panel p-6 shadow-soft",
          className,
        )}
      >
        {title && <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>}
        {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
