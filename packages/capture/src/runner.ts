import type { Page } from "playwright";
import {
  type ScenarioStep, type CaptureStepResult, captureStepResultSchema,
} from "@studio-one/shared";
import { captureScreenshot, captureMobileScreenshot, extractPageMetadata } from "./capture.js";
import { detectBrokenState } from "./health.js";
import { maskSensitiveData } from "./mask.js";
import { pino } from "pino";

const log = pino({ name: "capture:runner" });

export interface RunOptions {
  baseUrl: string;
  maskPII?: boolean;
  redactNames?: string[];
  captureMobile?: boolean;
  /** Called for each captured PNG so the worker can persist to storage and
   *  return the asset key it stored it under. */
  onScreenshot: (stepIndex: number, kind: "desktop" | "mobile", png: Buffer) => Promise<string>;
}

/**
 * Execute scenario steps against the page, capturing a screenshot + metadata per
 * step. Best-effort interaction: navigate by urlHint, click hinted actions. Never
 * fails the whole run on a single bad step — marks it broken/skipped and moves on.
 */
export async function runScenarioSteps(
  page: Page,
  steps: ScenarioStep[],
  opts: RunOptions,
): Promise<CaptureStepResult[]> {
  const results: CaptureStepResult[] = [];

  // Steps with no explicit navigation/action are "passive": for those we walk
  // progressively down the current page so each screenshot shows a DIFFERENT
  // section (hero → features → pricing → footer) instead of N identical top
  // shots. This is what turns a single landing page into a real product tour.
  const isPassive = (s: ScenarioStep) => !s.urlHint && (s.actionHints ?? []).length === 0;
  const passiveCount = steps.filter(isPassive).length;
  let passiveSeen = 0;

  // Clear the intro splash + cookie banner once up front. They obscure every
  // screenshot and usually lock body scrolling — which would pin every passive
  // capture to the hero. We also re-run this per step below, because consent
  // banners on many sites only appear *after* an intro animation finishes.
  await dismissOverlays(page).catch(() => {});

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;
    const startedAt = new Date().toISOString();
    try {
      // 1. Navigate.
      if (step.urlHint) {
        const target = new URL(step.urlHint, opts.baseUrl).toString();
        await page.goto(target, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => {});
      }
      if (step.waitForSelector) {
        await page.waitForSelector(step.waitForSelector, { timeout: 8_000 }).catch(() => {});
      }

      // 1b. Skip intro splashes / accept consent so the shot shows real content
      // and the page is free to scroll.
      await dismissOverlays(page).catch(() => {});

      // 2. Perform hinted actions (clicks by visible text).
      for (const hint of step.actionHints ?? []) {
        const label = hint.replace(/^click\s+/i, "").trim();
        const loc = page.locator(`text=${label}`).first();
        if ((await loc.count()) > 0) {
          await loc.click({ timeout: 5_000 }).catch(() => {});
          await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
        }
      }

      // 2b. Passive step → advance through the page so each shot shows a new
      // section. The first passive shot stays on the hero; each later one wheels
      // down ~one viewport. Wheel events (not scrollTo) so this also drives
      // scroll-jacked sites (GSAP / Locomotive / Fullpage) that ignore scrollTo.
      if (isPassive(step)) {
        if (passiveSeen > 0) await advanceScroll(page);
        passiveSeen++;
      }

      await page.waitForTimeout(600); // settle

      // 2c. Re-clear overlays right before the shot. On SPA route changes the
      // cookie/consent banner is re-injected a beat after navigation, so the
      // earlier (post-nav) dismissal can miss it — this second pass catches it.
      await dismissOverlays(page).catch(() => {});
      await page.waitForTimeout(250);

      // 3. Health check.
      const health = await detectBrokenState(page);
      if (health.broken) {
        results.push(
          captureStepResultSchema.parse({
            index: i, intent: step.intent, url: page.url(), status: "broken",
            startedAt, finishedAt: new Date().toISOString(), error: health.reason,
          }),
        );
        continue;
      }

      // 4. Mask + capture.
      if (opts.maskPII ?? true) await maskSensitiveData(page, { names: opts.redactNames }).catch(() => {});
      const desktopPng = await captureScreenshot(page, { fullPage: false });
      const screenshotAssetKey = await opts.onScreenshot(i, "desktop", desktopPng);

      let mobileScreenshotAssetKey: string | undefined;
      if (opts.captureMobile) {
        const mobilePng = await captureMobileScreenshot(page);
        mobileScreenshotAssetKey = await opts.onScreenshot(i, "mobile", mobilePng);
      }

      const metadata = await extractPageMetadata(page, { redactNames: opts.redactNames });

      results.push(
        captureStepResultSchema.parse({
          index: i, intent: step.intent, url: page.url(), status: "ok",
          screenshotAssetKey, mobileScreenshotAssetKey, metadata,
          startedAt, finishedAt: new Date().toISOString(),
        }),
      );
    } catch (err) {
      log.warn({ step: step.intent, err: String(err) }, "step failed");
      results.push(
        captureStepResultSchema.parse({
          index: i, intent: step.intent, url: page.url(), status: "skipped",
          startedAt, finishedAt: new Date().toISOString(), error: String(err),
        }),
      );
    }
  }

  return results;
}

/**
 * Discover the app/site's own pages to tour. Reads same-origin links from the
 * primary navigation (nav / sidebar / header / [role=navigation]) on the current
 * page — after login this surfaces the real product sections (dashboard, the
 * different feature areas, settings…), which is exactly what a usage demo should
 * walk through. Returns at most `max` distinct routes as ready-to-run steps.
 */
export async function discoverInternalRoutes(page: Page, baseUrl: string, max = 8): Promise<ScenarioStep[]> {
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return [];
  }

  const raw: Array<{ href: string; text: string }> = await page
    .evaluate(() => {
      const containers = Array.from(
        document.querySelectorAll('nav, aside, header, [role="navigation"], [class*="sidebar" i], [class*="menu" i]'),
      );
      const scope = containers.length > 0 ? containers : [document.body];
      const seen = new Set<string>();
      const out: Array<{ href: string; text: string }> = [];
      for (const c of scope) {
        for (const a of Array.from(c.querySelectorAll("a[href]"))) {
          const el = a as HTMLAnchorElement;
          const href = el.href;
          if (!href || seen.has(href)) continue;
          seen.add(href);
          out.push({ href, text: (el.textContent || "").trim() });
        }
      }
      return out;
    })
    .catch(() => [] as Array<{ href: string; text: string }>);

  // Skip auth + lead-capture pages (forms, not product). Intentionally keeps
  // "contact" so an authenticated app's "Contacts" feature is still toured.
  const skip = /(log\s*-?\s*in|log\s*-?\s*out|sign\s*-?\s*in|sign\s*-?\s*up|s'?inscrire|s'?identifier|register|connexion|d[ée]connexion|password|mot-de-passe|mailto:|tel:|\.pdf|\.zip|demande-demo|demande_demo|\/devis|\/quote)/i;
  const seenPath = new Set<string>();
  const steps: ScenarioStep[] = [];
  for (const { href, text } of raw) {
    let u: URL;
    try {
      u = new URL(href);
    } catch {
      continue;
    }
    if (u.origin !== origin) continue; // same-site only
    const path = (u.pathname.replace(/\/+$/, "") || "/") + u.search;
    if (seenPath.has(path)) continue;
    if (skip.test(href) || skip.test(text)) continue;
    if (!text || text.length > 40) continue; // skip empty / oversized labels
    seenPath.add(path);
    steps.push({ intent: text, urlHint: u.pathname + u.search });
    if (steps.length >= max) break;
  }
  return steps;
}

/**
 * Click sidebar group headers to reveal nested feature links. Single-page apps
 * (React/Vue routers) keep their navigation in collapsed <button> groups with no
 * href, so without this their feature pages are invisible to link discovery.
 */
export async function expandNavGroups(page: Page): Promise<void> {
  const labels: string[] = await page
    .evaluate(() => {
      const inSidebar = (el: Element) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.left < 360 && r.width > 0 && r.height > 0;
      };
      const out: string[] = [];
      const seen = new Set<string>();
      const btns = document.querySelectorAll(
        "aside button, nav button, [class*='sidebar' i] button, [class*='menu' i] button, [role='navigation'] button",
      );
      for (const b of Array.from(btns)) {
        if (!inSidebar(b)) continue;
        const t = (b.textContent || "").trim().replace(/\s+/g, " ");
        if (!t || t.length > 40 || seen.has(t)) continue;
        if (/d[ée]connexion|logout|param[èe]tres|settings|profil|mon compte|apparence|th[èe]me|dark|clair|sombre/i.test(t)) continue;
        seen.add(t);
        out.push(t);
      }
      return out;
    })
    .catch(() => [] as string[]);
  for (const t of labels) {
    const btn = page.getByRole("button", { name: t, exact: true }).first();
    if ((await btn.count()) > 0) {
      await btn.click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(160);
    }
  }
  await page.waitForTimeout(350);
}

/** Collect feature links visible in the sidebar, evenly sampled for breadth. */
async function collectSidebarLinks(page: Page, baseUrl: string, max: number): Promise<ScenarioStep[]> {
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return [];
  }
  const raw: Array<{ href: string; text: string }> = await page
    .evaluate(() => {
      const out: Array<{ href: string; text: string }> = [];
      const seen = new Set<string>();
      for (const a of Array.from(document.querySelectorAll("a[href]"))) {
        const el = a as HTMLAnchorElement;
        const r = el.getBoundingClientRect();
        if (r.left > 360 || r.width === 0 || r.height === 0) continue; // sidebar only
        const href = el.href;
        const text = (el.textContent || "").trim().replace(/\s+/g, " ");
        if (!href || !text || text.length > 40 || seen.has(href)) continue;
        seen.add(href);
        out.push({ href, text });
      }
      return out;
    })
    .catch(() => [] as Array<{ href: string; text: string }>);

  const skip = /(log\s*-?\s*out|d[ée]connexion|\/login|param[èe]tres|settings)/i;
  const all: ScenarioStep[] = [];
  const seenPath = new Set<string>();
  for (const { href, text } of raw) {
    let u: URL;
    try {
      u = new URL(href);
    } catch {
      continue;
    }
    if (u.origin !== origin) continue;
    const path = u.pathname.replace(/\/+$/, "") || "/";
    if (seenPath.has(path) || skip.test(href) || skip.test(text)) continue;
    seenPath.add(path);
    all.push({ intent: text, urlHint: u.pathname }); // urlHint = the href to click
  }
  if (all.length <= max) return all;
  const out: ScenarioStep[] = [];
  const stride = all.length / max;
  for (let i = 0; i < max; i++) out.push(all[Math.floor(i * stride)]!);
  return out;
}

export interface AppTourOptions {
  maskPII?: boolean;
  redactNames?: string[];
  onScreenshot: (stepIndex: number, kind: "desktop" | "mobile", png: Buffer) => Promise<string>;
  max?: number;
}

/**
 * Tour a logged-in single-page app: snap the landing/dashboard, then expand the
 * sidebar, discover the real feature pages and walk them by CLICKING their links
 * (client-side navigation — a hard goto would drop the in-memory session and bounce
 * back to login). Produces one clean screenshot per feature, named by its nav label.
 */
export async function captureAppTour(page: Page, baseUrl: string, opts: AppTourOptions): Promise<CaptureStepResult[]> {
  const max = opts.max ?? 9;
  const results: CaptureStepResult[] = [];

  const snap = async (index: number, intent: string) => {
    await dismissOverlays(page).catch(() => {});
    await page.waitForTimeout(400);
    const health = await detectBrokenState(page);
    if (opts.maskPII ?? true) await maskSensitiveData(page, { names: opts.redactNames }).catch(() => {});
    const png = await captureScreenshot(page, { fullPage: false });
    const key = await opts.onScreenshot(index, "desktop", png);
    const metadata = await extractPageMetadata(page, { redactNames: opts.redactNames }).catch(() => undefined);
    results.push(
      captureStepResultSchema.parse({
        index,
        intent,
        url: page.url(),
        status: health.broken ? "broken" : "ok",
        screenshotAssetKey: key,
        metadata,
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        error: health.broken ? health.reason : undefined,
      }),
    );
  };

  // Scene 0: the dashboard, captured clean (before expanding the nav).
  await dismissOverlays(page).catch(() => {});
  await snap(0, "Tableau de bord");

  // Discover the feature pages, then walk them by clicking.
  await expandNavGroups(page).catch(() => {});
  const features = await collectSidebarLinks(page, baseUrl, Math.max(1, max - 1));

  let i = 1;
  let lastPath = "";
  for (const f of features) {
    try {
      await expandNavGroups(page).catch(() => {}); // the sidebar resets after each client-side nav
      const href = f.urlHint!;
      let link = page.locator(`a[href="${href}"]`).first();
      if ((await link.count()) === 0) link = page.getByRole("link", { name: f.intent, exact: false }).first();
      if ((await link.count()) === 0) continue;
      await link.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1600);
      const path = new URL(page.url()).pathname;
      if (path === lastPath) continue; // navigation didn't take; don't duplicate
      lastPath = path;
      await snap(i, f.intent);
      i++;
    } catch {
      /* skip a flaky link */
    }
  }
  return results;
}

/**
 * Best-effort clearing of things that ruin a clean screenshot: an intro splash
 * (a "skip"/"enter" gate) and the cookie/consent banner. Quick and defensive —
 * tries a focused set of labels, then a few well-known selectors, and clicks at
 * most one of each kind. Deliberately avoids generic labels (OK/Continue) and
 * never clicks "Refuser"/"Reject" so we don't trigger unrelated actions.
 */
async function dismissOverlays(page: Page): Promise<void> {
  // 1. Skip an intro / splash gate if present.
  const skipLabels = ["Passer", "Passer l'intro", "Passer l’intro", "Skip", "Skip intro", "Entrer", "Entrer sur le site", "Enter site", "Enter"];
  await clickFirst(page, skipLabels);
  // 2. Accept cookies / consent.
  const acceptLabels = [
    "Tout accepter", "Accepter tout", "Tout accepter et fermer", "J'accepte", "J’accepte",
    "Accepter et continuer", "Accepter", "Accept all", "Accept All Cookies", "Accept all cookies",
    "Accept cookies", "I accept", "Accept", "Allow all", "Allow cookies", "I agree", "Agree", "Autoriser",
  ];
  const clickedAccept = await clickFirst(page, acceptLabels);
  if (!clickedAccept) {
    const selectors = [
      "#onetrust-accept-btn-handler", "#axeptio_btn_acceptAll", "button#didomi-notice-agree-button",
      ".cc-allow", ".cookie-accept", "[aria-label*='accept' i]", "[data-testid*='accept' i]",
    ];
    for (const sel of selectors) {
      try {
        const loc = page.locator(sel).first();
        if ((await loc.count()) > 0 && (await loc.isVisible().catch(() => false))) {
          await loc.click({ timeout: 2_000 }).catch(() => {});
          await page.waitForTimeout(400);
          break;
        }
      } catch {
        /* ignore */
      }
    }
  }
}

/** Click the first visible button matching any of the labels. Returns whether one was clicked. */
async function clickFirst(page: Page, labels: string[]): Promise<boolean> {
  for (const label of labels) {
    try {
      const loc = page.getByRole("button", { name: label, exact: false }).first();
      if ((await loc.count()) > 0 && (await loc.isVisible().catch(() => false))) {
        await loc.click({ timeout: 2_000 }).catch(() => {});
        await page.waitForTimeout(400);
        return true;
      }
    } catch {
      /* keep trying */
    }
  }
  return false;
}

/**
 * Advance the page down by roughly one viewport so the next capture shows a new
 * section. Uses real wheel events (in several small ticks) which both scroll
 * normal pages AND drive scroll-jacked sites whose animations only react to
 * wheel input; falls back to a native scrollBy for good measure.
 */
async function advanceScroll(page: Page): Promise<void> {
  const size = page.viewportSize();
  const vh = size?.height ?? 900;
  const vw = size?.width ?? 1440;
  await page.mouse.move(Math.round(vw / 2), Math.round(vh / 2)).catch(() => {});
  // Wheel events scroll normal pages AND drive scroll-jacked ones. Several small
  // ticks (~one viewport total) so animated sites advance smoothly. We measure
  // whether the wheel actually moved the page; if not (rare custom scroll roots),
  // fall back to a native scrollBy.
  const before = await page.evaluate(() => window.scrollY).catch(() => 0);
  for (let k = 0; k < 9; k++) {
    await page.mouse.wheel(0, Math.round(vh * 0.12)).catch(() => {});
    await page.waitForTimeout(110);
  }
  const after = await page.evaluate(() => window.scrollY).catch(() => 0);
  if (Math.abs(after - before) < 40) {
    await page
      .evaluate((dy) => window.scrollBy({ top: dy, left: 0, behavior: "instant" as ScrollBehavior }), Math.round(vh * 0.9))
      .catch(() => {});
  }
  // Let lazy images / scroll-triggered animations resolve before the screenshot.
  await page.waitForTimeout(800);
}
