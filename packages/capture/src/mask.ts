import type { Page } from "playwright";
import { redactPII } from "@studio-one/shared";

/**
 * Visually mask sensitive data on the page BEFORE screenshots, when enabled.
 * This blurs obvious PII patterns (emails, phone-like strings) found in text
 * nodes, plus any element marked data-sensitive. Best-effort, opt-in.
 */
export async function maskSensitiveData(page: Page, opts: { names?: string[] } = {}): Promise<void> {
  await page.addStyleTag({
    content: `.__df_masked{ filter: blur(6px) !important; user-select:none !important; }`,
  });

  await page.evaluate((names: string[]) => {
    const emailRe = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRe = /(\+?\d[\d ().-]{7,}\d)/;
    const lowerNames = names.map((n) => n.toLowerCase()).filter((n) => n.length > 2);

    const mark = (el: Element) => el.classList.add("__df_masked");

    // Mark explicitly-tagged sensitive elements.
    document.querySelectorAll("[data-sensitive]").forEach(mark);

    // Walk small leaf text elements and blur ones that look like PII.
    const candidates = document.querySelectorAll(
      "span, td, div, p, a, li, strong, em, small, label",
    );
    candidates.forEach((el) => {
      if (el.children.length > 0) return; // leaf only
      const t = (el.textContent ?? "").trim();
      if (!t || t.length > 80) return;
      if (
        emailRe.test(t) ||
        phoneRe.test(t) ||
        lowerNames.some((n) => t.toLowerCase().includes(n))
      ) {
        mark(el);
      }
    });
  }, opts.names ?? []);
}

/** Apply the same redaction to extracted text metadata. */
export function redactMetadataText(text: string, names?: string[]): string {
  return redactPII(text, { names });
}
