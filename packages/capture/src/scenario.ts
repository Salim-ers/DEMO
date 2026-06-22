import {
  type Scenario, type ScenarioStep, scenarioSchema, SCENARIO_SYSTEM, scenarioUserPrompt,
} from "@demoforge/shared";
import { resolveLLM, extractJSON } from "@demoforge/integrations";

/**
 * Turn a natural-language demo description into structured steps.
 * Uses the LLM when configured; otherwise a deterministic heuristic splitter.
 */
export async function parseScenario(raw: string): Promise<Scenario> {
  const llm = resolveLLM();
  if (llm) {
    try {
      const out = await llm.complete({
        system: SCENARIO_SYSTEM,
        messages: [{ role: "user", content: scenarioUserPrompt(raw) }],
        maxTokens: 800,
        temperature: 0.2,
      });
      const steps = extractJSON(out) as ScenarioStep[];
      const parsed = scenarioSchema.parse({ raw, steps });
      return parsed;
    } catch {
      /* fall back */
    }
  }
  return scenarioSchema.parse({ raw, steps: heuristicSteps(raw) });
}

const VERB_TO_URL: Array<[RegExp, string]> = [
  [/dashboard|overview|home/i, "/dashboard"],
  [/analytic|report|insight|metric/i, "/analytics"],
  [/setting|config|preference/i, "/settings"],
  [/roi|revenue|pricing|value/i, "/reports/roi"],
  [/customer|client|contact|account/i, "/customers"],
  [/billing|invoice|payment/i, "/billing"],
];

/** Split on connective words ("then", "next", "after", commas) into intents. */
export function heuristicSteps(raw: string): ScenarioStep[] {
  const chunks = raw
    .split(/\bthen\b|\bnext\b|\bafter that\b|\bafter\b|\bfinally\b|->|→|;|,|\.\s/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  const steps: ScenarioStep[] = chunks.map((chunk) => {
    const cleaned = chunk.replace(/^(show|then show|display|open up|go to|navigate to)\s+/i, "").trim();
    const urlHint = VERB_TO_URL.find(([re]) => re.test(cleaned))?.[1];
    const isCreate = /create|add|new/i.test(cleaned);
    return {
      intent: cleaned.length > 60 ? cleaned.slice(0, 60) : cleaned,
      ...(urlHint ? { urlHint } : {}),
      ...(isCreate ? { actionHints: ["click the primary create/new action", "fill required fields", "save"] } : {}),
    };
  });

  return steps.length > 0 ? steps : [{ intent: raw.slice(0, 60) }];
}
