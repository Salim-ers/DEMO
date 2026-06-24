import {
  storyboardSchema, type Storyboard, type CaptureStepResult, type Scenario,
  type ProjectContext, STORYBOARD_SYSTEM, storyboardUserPrompt, slugId,
} from "@studio-one/shared";
import { resolveLLM, extractJSON } from "@studio-one/integrations";
import { buildStoryboardFallback } from "./fallback.js";

export { buildStoryboardFallback };

export interface StoryboardResult {
  storyboard: Storyboard;
  source: "llm" | "deterministic";
}

/**
 * Generate a storyboard. Tries the configured LLM; on any failure (no key,
 * network, invalid JSON, schema mismatch) it falls back to the deterministic
 * builder so the pipeline never stalls. Output is always zod-validated.
 */
export async function generateStoryboard(
  ctx: ProjectContext,
  scenario: Scenario,
  captures: CaptureStepResult[],
): Promise<StoryboardResult> {
  const llm = resolveLLM();

  if (llm) {
    try {
      const raw = await llm.complete({
        system: STORYBOARD_SYSTEM,
        messages: [{ role: "user", content: storyboardUserPrompt(ctx, scenario, captures) }],
        maxTokens: 3000,
        temperature: 0.5,
      });
      const parsed = storyboardSchema.parse(normalizeIds(extractJSON(raw)));
      return { storyboard: parsed, source: "llm" };
    } catch (err) {
      // Fall through to deterministic. (Logged by the caller.)
    }
  }

  const storyboard = buildStoryboardFallback(ctx, scenario, captures);
  return { storyboard: storyboardSchema.parse(storyboard), source: "deterministic" };
}

/** Ensure every scene has a stable id even if the LLM omitted/duplicated some. */
function normalizeIds(input: unknown): unknown {
  if (typeof input !== "object" || input === null) return input;
  const obj = input as { scenes?: Array<Record<string, unknown>> };
  if (Array.isArray(obj.scenes)) {
    const seen = new Set<string>();
    obj.scenes.forEach((s, i) => {
      let id = typeof s.id === "string" && s.id ? s.id : slugId("scene", `i${i}`);
      while (seen.has(id)) id = `${id}_${i}`;
      seen.add(id);
      s.id = id;
      if (s.callouts == null) s.callouts = [];
      if (s.cameraMotion == null) s.cameraMotion = "none";
    });
  }
  return input;
}
