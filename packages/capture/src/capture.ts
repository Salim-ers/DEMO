import type { Page } from "playwright";
import { type PageMetadata, pageMetadataSchema, CAPTURE_VIEWPORTS } from "@demoforge/shared";
import { redactMetadataText } from "./mask.js";

/** Full-page (or viewport) PNG. Returns the raw buffer for the caller to store. */
export async function captureScreenshot(
  page: Page,
  opts: { fullPage?: boolean } = {},
): Promise<Buffer> {
  return page.screenshot({ type: "png", fullPage: opts.fullPage ?? false, animations: "disabled" });
}

/** Take a mobile-viewport screenshot by resizing the page temporarily. */
export async function captureMobileScreenshot(page: Page): Promise<Buffer> {
  const prev = page.viewportSize();
  await page.setViewportSize(CAPTURE_VIEWPORTS.mobile);
  await page.waitForTimeout(400);
  const buf = await page.screenshot({ type: "png", animations: "disabled" });
  if (prev) await page.setViewportSize(prev);
  return buf;
}

/**
 * Capture a short video segment by performing a small scripted interaction
 * (slow scroll) while the context records WebM. The context must have been
 * created with `recordVideoDir`. Returns the saved file path.
 */
export async function captureVideoSegment(
  page: Page,
  opts: { durationMs?: number } = {},
): Promise<string | null> {
  const video = page.video();
  if (!video) return null;
  const duration = opts.durationMs ?? 2500;
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(duration / steps);
  }
  // The file is finalized when the page/context closes; caller reads it then.
  return video.path();
}

/** Extract title, headings, visible button labels and primary text (redacted). */
export async function extractPageMetadata(
  page: Page,
  opts: { redactNames?: string[] } = {},
): Promise<PageMetadata> {
  const data = await page.evaluate(() => {
    const text = (el: Element | null) => (el?.textContent ?? "").trim();
    const visible = (el: Element) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      const style = getComputedStyle(el as HTMLElement);
      return r.width > 0 && r.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };
    const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
      .filter(visible).map(text).filter(Boolean).slice(0, 12);
    const buttons = Array.from(document.querySelectorAll('button, [role="button"], a.btn, a[role="button"]'))
      .filter(visible).map(text).filter((t) => t.length > 0 && t.length < 40).slice(0, 16);
    const primaryText = Array.from(document.querySelectorAll("p, li"))
      .filter(visible).map(text).filter((t) => t.length > 12 && t.length < 200).slice(0, 8);
    return { title: document.title, headings, buttons, primaryText };
  });

  const names = opts.redactNames ?? [];
  return pageMetadataSchema.parse({
    url: page.url(),
    title: redactMetadataText(data.title, names),
    headings: data.headings.map((h) => redactMetadataText(h, names)),
    visibleButtons: data.buttons.map((b) => redactMetadataText(b, names)),
    primaryText: data.primaryText.map((p) => redactMetadataText(p, names)),
  });
}
