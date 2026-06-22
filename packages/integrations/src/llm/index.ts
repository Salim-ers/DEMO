import type { LLMProvider } from "./types.js";
import { AnthropicProvider } from "./anthropic.js";
import { OpenAIProvider } from "./openai.js";

export * from "./types.js";
export { AnthropicProvider, OpenAIProvider };

/**
 * Resolve the configured LLM provider from env.
 * Returns null when LLM_PROVIDER="none" or the key is missing — callers MUST
 * fall back to their deterministic builder so the MVP runs fully offline.
 */
export function resolveLLM(): LLMProvider | null {
  const choice = (process.env.LLM_PROVIDER ?? "none").toLowerCase();
  if (choice === "anthropic") {
    const p = new AnthropicProvider();
    return p.available ? p : null;
  }
  if (choice === "openai") {
    const p = new OpenAIProvider();
    return p.available ? p : null;
  }
  return null;
}

/** Extract a JSON object/array from a model response that may wrap it in prose. */
export function extractJSON(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1]! : raw;
  const start = body.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in LLM response");
  const sliced = body.slice(start).trim();
  return JSON.parse(sliced);
}
