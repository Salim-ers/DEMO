import { prisma, AssetKind } from "@studio-one/db";
import { getHiggsfield, cameraPresetForScene, getStorage } from "@studio-one/integrations";
import type { Storyboard } from "@studio-one/shared";

type Storage = ReturnType<typeof getStorage>;
interface ShotLog {
  info: (obj: unknown, msg?: string) => void;
  warn: (obj: unknown, msg?: string) => void;
}

/** Text stages (cta / stats) don't get a b-roll clip. */
const TEXT_STAGE_TYPES = new Set(["final_cta", "outro", "metric_moment", "benefit_grid"]);
const MAX_SHOTS = 8;

/** Deterministic per-scene seed, so re-renders stay visually coherent. */
function seedFromKey(k: string): number {
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return h % 1_000_000;
}

function brollPrompt(productName: string, tone: string, visualInstruction: string, accent: string): string {
  return (
    `Cinematic premium marketing b-roll, ${tone} tone, for ${productName}. ` +
    `${visualInstruction}. Modern, clean, ${accent} accent lighting, shallow depth of field. ` +
    `No on-screen text, no UI, no logos.`
  );
}

export interface ShotInput {
  project: { id: string; productName: string; tone: string; format: string };
  storyboard: Storyboard;
  accentColor: string;
  storage: Storage;
  log: ShotLog;
}

/**
 * Generate Higgsfield b-roll for statement scenes that would otherwise show a
 * placeholder, with one camera move per clip + a locked seed. Best-effort and
 * gated on a configured key; idempotent (reuses an already-generated clip).
 * Returns sceneId -> signed clip URL.
 */
export async function generatePremiumShots(input: ShotInput): Promise<Map<string, string>> {
  const { project, storyboard, storage, log } = input;
  const clips = new Map<string, string>();
  const hf = getHiggsfield();
  if (!hf.available) {
    log.info("higgsfield not configured; premium render uses captures + placeholders");
    return clips;
  }

  let made = 0;
  for (const s of storyboard.scenes) {
    if (made >= MAX_SHOTS) break;
    if (s.sourceAssetId) continue; // already has a real screenshot
    if (TEXT_STAGE_TYPES.has(s.type)) continue;

    const key = `broll/${project.id}/${s.id}.mp4`;
    try {
      // Reuse a previously generated clip (deterministic seed -> same shot).
      if (await storage.exists(key)) {
        clips.set(s.id, await storage.getUrl(key, 3600));
        made++;
        continue;
      }

      const preset = cameraPresetForScene(s.type, project.format);
      const durationSec = Math.min(5, Math.max(2, Math.round(s.durationMs / 1000)));
      const prompt = brollPrompt(project.productName, project.tone, s.visualInstruction, input.accentColor);
      const res = await hf.generateMarketingBroll(prompt, project.format, durationSec, { cameraPreset: preset, seed: seedFromKey(s.id) });
      if (res.status !== "generated" || !res.assetKeyOrUrl) continue;

      // Pull a remote clip into our storage; if the provider returned our own key, use it.
      let finalKey = res.assetKeyOrUrl;
      if (/^https?:\/\//.test(res.assetKeyOrUrl)) {
        const r = await fetch(res.assetKeyOrUrl);
        if (!r.ok) continue;
        await storage.put(key, Buffer.from(await r.arrayBuffer()), "video/mp4");
        finalKey = key;
      }
      const exists = await prisma.asset.findFirst({ where: { projectId: project.id, storageKey: finalKey } });
      if (!exists) {
        await prisma.asset.create({ data: { projectId: project.id, kind: AssetKind.BROLL, storageKey: finalKey, contentType: "video/mp4" } });
      }
      clips.set(s.id, await storage.getUrl(finalKey, 3600));
      made++;
      log.info({ scene: s.id, preset }, "higgsfield shot generated");
    } catch (err) {
      log.warn({ scene: s.id, err: String(err) }, "higgsfield shot failed; continuing");
    }
  }

  log.info({ generated: made }, "premium b-roll ready");
  return clips;
}
