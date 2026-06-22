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

      // 2. Perform hinted actions (clicks by visible text).
      for (const hint of step.actionHints ?? []) {
        const label = hint.replace(/^click\s+/i, "").trim();
        const loc = page.locator(`text=${label}`).first();
        if ((await loc.count()) > 0) {
          await loc.click({ timeout: 5_000 }).catch(() => {});
          await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
        }
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
