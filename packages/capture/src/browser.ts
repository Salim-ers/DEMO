import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { CAPTURE_VIEWPORTS, MAX_BROWSER_SESSION_MS } from "@demoforge/shared";
import { pino } from "pino";

const log = pino({ name: "capture:browser" });

export interface BrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  /** Wall-clock deadline; the session auto-closes past this (security cap). */
  deadline: number;
  close: () => Promise<void>;
}

export interface SessionOptions {
  headless?: boolean;
  viewport?: "desktop" | "mobile";
  /** Previously persisted Playwright storageState (cookies/localStorage). */
  storageState?: string | Record<string, unknown>;
  /** Record a WebM of the whole session into this dir (for video segments). */
  recordVideoDir?: string;
  locale?: string;
}

export async function createBrowserSession(opts: SessionOptions = {}): Promise<BrowserSession> {
  const headless = opts.headless ?? (process.env.PLAYWRIGHT_HEADLESS ?? "true") === "true";
  const viewport = CAPTURE_VIEWPORTS[opts.viewport ?? "desktop"];

  const browser = await chromium.launch({
    headless,
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
  });

  const context = await browser.newContext({
    viewport,
    locale: opts.locale ?? "en-US",
    deviceScaleFactor: 2, // crisp screenshots
    storageState: opts.storageState as never,
    recordVideo: opts.recordVideoDir ? { dir: opts.recordVideoDir, size: viewport } : undefined,
    // We DO NOT bypass bot protections, CAPTCHA, or 2FA. See README "Compliance".
  });

  // The worker runs through tsx/esbuild with `keepNames` enabled, which rewrites
  // named functions/arrows inside our `page.evaluate(...)` callbacks as
  // `__name(fn, "name")`. Playwright serializes those callbacks as source and runs
  // them in the page, where `__name` does not exist — every evaluate then throws
  // "ReferenceError: __name is not defined" and the whole capture is skipped.
  // Inject a no-op `__name` shim into every document so evaluated code resolves it.
  // Passed as a raw string (not a function) so esbuild can't rewrite the shim itself.
  await context.addInitScript({
    content: "globalThis.__name = globalThis.__name || function (fn) { return fn; };",
  });

  const page = await context.newPage();
  const deadline = Date.now() + MAX_BROWSER_SESSION_MS;

  const timer = setTimeout(() => {
    log.warn("Session deadline reached — forcing close");
    void browser.close().catch(() => {});
  }, MAX_BROWSER_SESSION_MS);

  const close = async () => {
    clearTimeout(timer);
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  };

  return { browser, context, page, deadline, close };
}

/** Persist cookies + storage so subsequent runs skip re-login where allowed. */
export async function persistAuthState(session: BrowserSession): Promise<string> {
  const state = await session.context.storageState();
  return JSON.stringify(state);
}
