/**
 * Higgsfield adapter (web-facing). Generates AI shots / cinematic b-roll and
 * vertical social plans. The real client lives in
 * `packages/integrations/src/higgsfield`; this surface is what the app calls.
 */
import type { HiggsfieldShot, HiggsfieldShotRequest } from "../../types/video-engine.js";
import { isMockEngine } from "./engine.js";

/** True when a key is configured server-side (never exposes the key itself). */
export const higgsfieldAvailable = Boolean(process.env.HIGGSFIELD_API_KEY) && Boolean(process.env.HIGGSFIELD_API_BASE_URL);

export const HIGGSFIELD_VISUAL_STYLES = [
  "Premium clean",
  "Cinématique chaud",
  "TikTok dynamique",
  "Corporate épuré",
  "Luxe minimal",
] as const;

let shotSeq = 0;

/**
 * Request a generated shot. In mock mode (or with no key), returns a shot
 * marked "ready" with a deterministic id so the storyboard/timeline UI works
 * end to end. In production this is where the real Higgsfield call goes.
 */
export async function requestShot(req: HiggsfieldShotRequest): Promise<HiggsfieldShot> {
  const id = `hf_${(shotSeq += 1).toString(36)}`;
  if (isMockEngine || !higgsfieldAvailable) {
    return { ...req, id, status: "ready" };
  }
  // production: delegate to packages/integrations getHiggsfield().generateMarketingBroll(...)
  // Left intentionally to the worker pipeline; the web layer never holds the key.
  return { ...req, id, status: "queued" };
}
