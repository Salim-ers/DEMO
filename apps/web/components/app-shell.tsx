"use client";
import { usePathname } from "next/navigation";
import { ToastProvider } from "./ui/toast.js";
import { SiteFooter } from "./site-footer.js";
import { AppChrome } from "./app-sidebar.js";
import { SmoothScroll } from "./landing/smooth-scroll.js";
import { LandingNav } from "./landing/landing-nav.js";
import { IntroLoader } from "./landing/intro-loader.js";

/** Routes that render the public marketing chrome instead of the app shell. */
const MARKETING_ROUTES = new Set(["/"]);

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
        <div className="min-h-screen">
          <IntroLoader />
          <SmoothScroll />
          <LandingNav />
          <main>{children}</main>
          <SiteFooter />
        </div>
      ) : (
        <AppChrome>{children}</AppChrome>
      )}
    </ToastProvider>
  );
}
