import type { Page } from "playwright";
import {
  type ScenarioStep, type CaptureStepResult, captureStepResultSchema,
} from "@demoforge/shared";
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
