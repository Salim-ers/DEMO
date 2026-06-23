"use client";
import { usePathname } from "next/navigation";
import { ToastProvider } from "./ui/toast.js";
import { SiteHeader } from "./site-header.js";
import { SiteFooter } from "./site-footer.js";
import { AppChrome } from "./app-sidebar.js";

/** Routes that render the public marketing chrome instead of the app shell. */
const MARKETING_ROUTES = new Set(["/", "/pricing"]);

/**
 * One frame, two faces. Public pages (landing, pricing) get a marketing header +
 * footer; the workspace gets the full app chrome (sidebar, drawer, command
 * palette). Toasts are available everywhere.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = MARKETING_ROUTES.has(pathname);

  return (
    <ToastProvider>
      {isMarketing ? (
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      ) : (
        <AppChrome>{children}</AppChrome>
      )}
    </ToastProvider>
  );
}
