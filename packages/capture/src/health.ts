import type { Page } from "playwright";

export interface BrokenState {
  broken: boolean;
  reason?: string;
}

/** Heuristic detection of an error/blank state so we can skip a bad screenshot. */
export async function detectBrokenState(page: Page): Promise<BrokenState> {
  const status = page.url();
  if (status.startsWith("chrome-error://") || status === "about:blank") {
    return { broken: true, reason: "navigation failed" };
  }

  const signal = await page.evaluate(() => {
    const bodyText = (document.body?.innerText ?? "").trim();
    const lower = bodyText.toLowerCase();
    const errorMarkers = [
      "404", "500", "503", "not found", "something went wrong",
      "application error", "internal server error", "this page isn’t working",
    ];
    const visibleArea = document.body
      ? document.body.getBoundingClientRect().height
      : 0;
    return {
      empty: bodyText.length < 20,
      tiny: visibleArea < 200,
      hasError: errorMarkers.some((m) => lower.includes(m)),
    };
  });

  if (signal.hasError) return { broken: true, reason: "error text detected" };
  if (signal.empty || signal.tiny) return { broken: true, reason: "page appears blank" };
  return { broken: false };
}
