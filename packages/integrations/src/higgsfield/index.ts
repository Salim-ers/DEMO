import { pino } from "pino";

const log = pino({ name: "higgsfield" });

export interface BrollResult {
  /** Storage key OR remote URL of the generated clip. null when skipped. */
  assetKeyOrUrl: string | null;
  status: "generated" | "skipped" | "error";
  provider: "higgsfield";
  meta?: Record<string, unknown>;
}

export interface HiggsfieldProvider {
  readonly available: boolean;
  generateMarketingBroll(prompt: string, aspectRatio: string, durationSec: number): Promise<BrollResult>;
  imageToVideo(imageAssetId: string, prompt: string, durationSec: number): Promise<BrollResult>;
  generateTransitionScene(prompt: string): Promise<BrollResult>;
}

/**
 * Real Higgsfield client. The exact endpoints are intentionally NOT hardcoded —
 * see TODO_PROVIDER_ENDPOINTS.md. Wire the real paths in `request()` below.
 * Until HIGGSFIELD_API_KEY + HIGGSFIELD_API_BASE_URL are set, the pipeline uses
 * the NoopHiggsfieldProvider and the render simply omits b-roll scenes.
 */
export class RealHiggsfieldProvider implements HiggsfieldProvider {
  readonly available: boolean;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.HIGGSFIELD_API_KEY ?? "";
    this.baseUrl = process.env.HIGGSFIELD_API_BASE_URL ?? "";
    this.available = this.apiKey.length > 0 && this.baseUrl.length > 0;
  }

  private async request(path: string, body: unknown): Promise<BrollResult> {
    // TODO(provider): confirm the real path + response shape in TODO_PROVIDER_ENDPOINTS.md
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      log.warn({ status: res.status, path }, "higgsfield request failed");
      return { assetKeyOrUrl: null, status: "error", provider: "higgsfield" };
    }
    const data = (await res.json()) as { url?: string; assetUrl?: string; id?: string };
    return {
      assetKeyOrUrl: data.url ?? data.assetUrl ?? null,
      status: "generated",
      provider: "higgsfield",
      meta: { id: data.id },
    };
  }

  generateMarketingBroll(prompt: string, aspectRatio: string, durationSec: number) {
    return this.request("/v1/broll", { prompt, aspectRatio, duration: durationSec });
  }
  imageToVideo(imageAssetId: string, prompt: string, durationSec: number) {
    return this.request("/v1/image-to-video", { imageAssetId, prompt, duration: durationSec });
  }
  generateTransitionScene(prompt: string) {
    return this.request("/v1/transition", { prompt });
  }
}

/** Graceful no-op used when Higgsfield is not configured. Never throws. */
export class NoopHiggsfieldProvider implements HiggsfieldProvider {
  readonly available = false;
  private skip(): Promise<BrollResult> {
    return Promise.resolve({ assetKeyOrUrl: null, status: "skipped", provider: "higgsfield" });
  }
  generateMarketingBroll() { return this.skip(); }
  imageToVideo() { return this.skip(); }
  generateTransitionScene() { return this.skip(); }
}

export function getHiggsfield(): HiggsfieldProvider {
  const real = new RealHiggsfieldProvider();
  if (real.available) {
    log.info("Higgsfield provider enabled");
    return real;
  }
  log.info("Higgsfield not configured — b-roll generation will be skipped");
  return new NoopHiggsfieldProvider();
}
