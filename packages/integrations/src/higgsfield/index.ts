import { pino } from "pino";

const log = pino({ name: "higgsfield" });

export interface BrollResult {
  /** Storage key OR remote URL of the generated clip. null when skipped. */
  assetKeyOrUrl: string | null;
  status: "generated" | "skipped" | "error";
  provider: "higgsfield";
  meta?: Record<string, unknown>;
}

/** Per-clip camera control. The spec's hard rule: ONE move per clip. */
export interface ShotOptions {
  /** A single camera preset (see CAMERA_PRESETS). */
  cameraPreset?: string;
  /** Lock a seed once a render is good, so prompt iterations stay coherent. */
  seed?: number;
}

export interface HiggsfieldProvider {
  readonly available: boolean;
  generateMarketingBroll(prompt: string, aspectRatio: string, durationSec: number, opts?: ShotOptions): Promise<BrollResult>;
  imageToVideo(imageAssetId: string, prompt: string, durationSec: number, opts?: ShotOptions): Promise<BrollResult>;
  generateTransitionScene(prompt: string, opts?: ShotOptions): Promise<BrollResult>;
}

/**
 * Camera-move vocabulary. Each preset is a single motion; never combine two in
 * one clip (the spec's "deux mouvements = instable" rule).
 */
export const CAMERA_PRESETS = {
  dollyIn: "Dolly In",
  pushIn: "Push-In",
  tracking: "Tracking",
  pan: "Pan",
  orbit: "Orbit",
  crashZoom: "Crash Zoom",
  whipPan: "Whip Pan",
  craneUp: "Crane Up",
  pullOut: "Pull-Out",
} as const;
export type CameraPreset = (typeof CAMERA_PRESETS)[keyof typeof CAMERA_PRESETS];

/**
 * Map a storyboard scene type (lower_snake) + format to the right camera move.
 * Reveals push in, lists track, features orbit, hooks crash-zoom (punchier on
 * vertical), openings crane up, endings pull out.
 */
export function cameraPresetForScene(sceneType: string, format?: string): CameraPreset {
  const vertical = format === "9:16";
  switch (sceneType) {
    case "cinematic_intro":
    case "title_card":
      return vertical ? CAMERA_PRESETS.crashZoom : CAMERA_PRESETS.craneUp;
    case "problem_motion_card":
      return CAMERA_PRESETS.crashZoom;
    case "product_stage":
    case "product_zoom":
    case "screen_capture":
    case "zoom":
      return CAMERA_PRESETS.dollyIn;
    case "feature_callout":
      return CAMERA_PRESETS.orbit;
    case "workflow_map":
    case "benefit_grid":
    case "benefit_card":
      return CAMERA_PRESETS.tracking;
    case "metric_moment":
    case "final_cta":
    case "outro":
      return CAMERA_PRESETS.pullOut;
    default:
      return CAMERA_PRESETS.pushIn;
  }
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

  generateMarketingBroll(prompt: string, aspectRatio: string, durationSec: number, opts?: ShotOptions) {
    // One camera move per clip (never combine two).
    return this.request("/v1/broll", { prompt, aspectRatio, duration: durationSec, camera: opts?.cameraPreset, seed: opts?.seed });
  }
  imageToVideo(imageAssetId: string, prompt: string, durationSec: number, opts?: ShotOptions) {
    return this.request("/v1/image-to-video", { imageAssetId, prompt, duration: durationSec, camera: opts?.cameraPreset, seed: opts?.seed });
  }
  generateTransitionScene(prompt: string, opts?: ShotOptions) {
    return this.request("/v1/transition", { prompt, camera: opts?.cameraPreset, seed: opts?.seed });
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
