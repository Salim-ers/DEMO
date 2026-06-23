import type { Page } from "playwright";
import { type PageMetadata, pageMetadataSchema, CAPTURE_VIEWPORTS } from "@demoforge/shared";
import { redactMetadataText } from "./mask.js";

/**
 * Wait for the page to be visually settled before a screenshot: webfonts loaded
 * (so text isn't captured mid-swap / in a fallback face) and a brief beat for
 * entrance animations to land. `animations: "disabled"` then freezes any looping
 * CSS animation/transition at its end state for a clean, sharp frame.
 */
export async function waitForCaptureReady(page: Page, settleMs = 450): Promise<void> {
  await page
    .evaluate(async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore */
      }
    })
    .catch(() => {});
  await page.waitForTimeout(settleMs);
}

/** Full-page (or viewport) PNG. Returns the raw buffer for the caller to store. */
export async function captureScreenshot(
  page: Page,
  opts: { fullPage?: boolean; waitReady?: boolean } = {},
): Promise<Buffer> {
  if (opts.waitReady !== false) await waitForCaptureReady(page);
  // PNG is lossless; never recompressed before render so the UI stays pixel-sharp.
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

/**
 * Find the product's own logo on the current page so the render can use it in the
 * intro/outro. Prefers a crisp apple-touch-icon, then the largest favicon, then a
 * header/nav logo image, then og:image. Returns an absolute URL or null.
 */
export async function extractLogoUrl(page: Page): Promise<string | null> {
  return page
    .evaluate(() => {
      const abs = (u: string | null | undefined) => {
        if (!u) return null;
        try { return new URL(u, location.href).href; } catch { return null; }
      };
      // 1. The real on-page logo the site actually displays (header/nav, top-left).
      // This is what looks clean — favicons/touch-icons are often poorly exported.
      const imgs = Array.from(
        document.querySelectorAll('header img, nav img, [class*="logo" i] img, a[href="/"] img, img[alt*="logo" i], img[src*="logo" i]'),
      ) as HTMLImageElement[];
      const candidate = imgs
        .map((im) => ({ im, r: im.getBoundingClientRect() }))
        .filter(({ r }) => r.width >= 20 && r.height >= 20 && r.width <= 420 && r.top < 220)
        .sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)[0];
      if (candidate?.im.currentSrc || candidate?.im.src) return abs(candidate.im.currentSrc || candidate.im.src);

      // 2. og:image (often a clean brand asset).
      const og = (document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null)?.content;
      if (og) return abs(og);

      // 3. apple-touch-icon, then the largest favicon (last resort).
      const apple = document.querySelector('link[rel~="apple-touch-icon"]') as HTMLLinkElement | null;
      if (apple?.href) return apple.href;
      const icons = Array.from(document.querySelectorAll('link[rel~="icon"]')) as HTMLLinkElement[];
      let best: { href: string; size: number } | null = null;
      for (const i of icons) {
        const size = parseInt((i.getAttribute("sizes") || "").split("x")[0] || "0", 10) || 0;
        if (i.href && (!best || size > best.size)) best = { href: i.href, size };
      }
      return best?.href ?? null;
    })
    .catch(() => null);
}

/**
 * Screenshot the on-page logo element (handles inline SVG / <img> / CSS alike) as
 * a transparent PNG, so we always get the logo the site actually shows — favicons
 * and touch-icons are frequently low quality or badly exported. Returns null if no
 * confident logo element is found.
 */
export async function screenshotLogo(page: Page): Promise<Buffer | null> {
  const selectors = [
    'a[href="/"][class*="logo" i]', 'header a[href="/"]', 'nav a[href="/"]',
    'header [class*="logo" i]', 'nav [class*="logo" i]', '[class*="logo" i]',
    'header svg', 'nav svg', 'header img', 'nav img',
  ];
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      if ((await loc.count()) === 0) continue;
      const box = await loc.boundingBox();
      if (!box) continue;
      if (box.width < 24 || box.height < 16 || box.width > 480 || box.height > 220) continue;
      if (box.y > 260) continue; // logos live near the top
      const buf = await loc.screenshot({ omitBackground: true, timeout: 5_000 });
      if (buf && buf.byteLength > 300) return buf;
    } catch {
      /* try next selector */
    }
  }
  return null;
}

/**
 * Best-effort brand accent color from the site: prefers <meta name="theme-color">,
 * then the most-used button/link background color. Returns a #rrggbb hex or null.
 */
export async function extractThemeColor(page: Page): Promise<string | null> {
  return page
    .evaluate(() => {
      const toHex = (c: string): string | null => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const [r, g, b, a] = m[1]!.split(",").map((s) => parseFloat(s.trim()));
          if (a !== undefined && a < 0.5) return null;
          const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
          return `#${h(r!)}${h(g!)}${h(b!)}`;
        }
        if (/^#[0-9a-f]{6}$/i.test(c)) return c;
        return null;
      };
      const isVivid = (hex: string): boolean => {
        const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        return max - min > 28 && max > 60 && max < 250; // not near-grey, not near-black/white
      };
      const meta = (document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null)?.content;
      if (meta) { const h = toHex(meta.trim()); if (h && isVivid(h)) return h; }
      // Most common vivid button/link background.
      const counts = new Map<string, number>();
      for (const el of Array.from(document.querySelectorAll('button, a[class*="btn" i], [role="button"]')).slice(0, 120)) {
        const bg = getComputedStyle(el as HTMLElement).backgroundColor;
        const hex = toHex(bg);
        if (hex && isVivid(hex)) counts.set(hex, (counts.get(hex) ?? 0) + 1);
      }
      let best: string | null = null, bestN = 0;
      for (const [hex, n] of counts) if (n > bestN) { best = hex; bestN = n; }
      return best;
    })
    .catch(() => null);
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
