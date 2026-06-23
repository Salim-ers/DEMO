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

/** Desktop capture viewport, env-overridable (CAPTURE_WIDTH / CAPTURE_HEIGHT). */
function desktopViewport(): { width: number; height: number } {
  const w = parseInt(process.env.CAPTURE_WIDTH ?? "", 10);
  const h = parseInt(process.env.CAPTURE_HEIGHT ?? "", 10);
  return {
    width: Number.isFinite(w) && w >= 1280 ? w : CAPTURE_VIEWPORTS.desktop.width,
    height: Number.isFinite(h) && h >= 720 ? h : CAPTURE_VIEWPORTS.desktop.height,
  };
}

/** Retina-class capture by default; raise to 3 for 4K-downscale masters. */
function captureScaleFactor(): number {
  const d = parseFloat(process.env.CAPTURE_DEVICE_SCALE_FACTOR ?? "");
  return Number.isFinite(d) && d >= 1 && d <= 3 ? d : 2;
}

export async function createBrowserSession(opts: SessionOptions = {}): Promise<BrowserSession> {
  const headless = opts.headless ?? (process.env.PLAYWRIGHT_HEADLESS ?? "true") === "true";
  const viewport = (opts.viewport ?? "desktop") === "mobile" ? CAPTURE_VIEWPORTS.mobile : desktopViewport();

  const browser = await chromium.launch({
    headless,
    args: ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none"],
  });

  const context = await browser.newContext({
    viewport,
    locale: opts.locale ?? "en-US",
    deviceScaleFactor: captureScaleFactor(), // crisp, retina-class screenshots
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
