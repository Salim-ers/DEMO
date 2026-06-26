"use client";
import { usePathname } from "next/navigation";
import { ToastProvider } from "./ui/toast.js";
import { SiteFooter } from "./site-footer.js";
import { AppChrome } from "./app-sidebar.js";
import { SmoothScroll } from "./landing/smooth-scroll.js";
import { LandingNav } from "./landing/landing-nav.js";
import { IntroLoader } from "./landing/intro-loader.js";

/** Public marketing chrome (nav + footer). */
const MARKETING_ROUTES = new Set(["/", "/demo", "/security"]);
/** Bare pages (no chrome at all). */
const BARE_ROUTES = new Set(["/login"]);

/**
 * One frame, three faces. Marketing pages get the public header + footer; the
 * private workspace gets the app chrome (sidebar); a few pages (login) render
 * bare. The cinematic intro only plays on the home page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (BARE_ROUTES.has(pathname)) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (MARKETING_ROUTES.has(pathname)) {
    return (
      <ToastProvider>
        <div className="min-h-screen">
          {pathname === "/" && <IntroLoader />}
          <SmoothScroll />
          <LandingNav />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AppChrome>{children}</AppChrome>
    </ToastProvider>
  );
}
