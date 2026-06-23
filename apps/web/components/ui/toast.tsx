"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Check, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../../lib/cn.js";

type Variant = "default" | "success" | "error";
type Toast = {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
  action?: { label: string; onClick: () => void };
};

type ToastInput = Omit<Toast, "id" | "variant"> & { variant?: Variant; duration?: number };

const ToastContext = createContext<(t: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

let counter = 0;

const ICONS: Record<Variant, typeof Check> = {
  default: Info,
  success: Check,
  error: AlertTriangle,
};
const ACCENT: Record<Variant, string> = {
  default: "text-accent-deep",
  success: "text-ok",
  error: "text-bad",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = ++counter;
      const next: Toast = { id, title: input.title, description: input.description, variant: input.variant ?? "default", action: input.action };
      setToasts((list) => [...list, next]);
      const duration = input.duration ?? 4500;
      if (duration > 0) setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,360px)] flex-col gap-2.5">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const Icon = ICONS[toast.variant];
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-2xl border border-hairline bg-panel p-4 shadow-soft transition-all duration-300",
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
    >
      <span className={cn("mt-0.5 shrink-0", ACCENT[toast.variant])}>
        <Icon size={18} strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-sm leading-relaxed text-muted">{toast.description}</p>}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action!.onClick();
              onDismiss();
            }}
            className="mt-2 text-sm font-semibold text-accent-deep hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button type="button" onClick={onDismiss} aria-label="Fermer" className="shrink-0 text-faint hover:text-ink">
        <X size={16} />
      </button>
    </div>
  );
}
