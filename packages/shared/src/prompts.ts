import type { ProjectContext } from "./types.js";
import type { CaptureStepResult, Scenario } from "./schemas.js";

/**
 * Prompt templates for the LLM provider. All instruct the model to return
 * STRICT JSON so the output can be parsed and validated by zod. The deterministic
 * fallbacks in @demoforge/storyboard and @demoforge/voice produce the same shapes
 * when no LLM key is configured.
 */

export const SCENARIO_SYSTEM = `You convert a natural-language SaaS demo description into a strict JSON array of UI steps.
Return ONLY JSON. No prose, no markdown fences.
Each step: { "intent": string, "urlHint"?: string, "actionHints"?: string[], "waitForSelector"?: string }.
Keep intents short and action-oriented (e.g. "open dashboard", "create a customer").`;

export function scenarioUserPrompt(raw: string): string {
  return `Demo description:\n"""${raw}"""\n\nReturn the JSON array of steps.`;
}

export const STORYBOARD_SYSTEM = `You are a senior SaaS demo director. You write tight, credible storyboards for B2B sales videos.
Hard rules:
- Return ONLY a JSON object matching the schema below. No markdown, no commentary.
- Ground every scene in the REAL captured screens and metadata provided. Never invent UI that was not captured.
- Avoid hype. Banned phrases: "incredible", "revolutionary", "AI-powered revolution", "game-changing", "welcome to".
- Voiceover lines are concrete and benefit-led; one idea per scene.
- Scene order tells a story: hook -> problem -> product in action -> proof/ROI -> CTA.

Schema:
{
  "title": string,
  "targetAudience": string,
  "durationSeconds": number,
  "scenes": [{
    "id": string,
    "type": "screen_capture"|"zoom"|"transition"|"title_card"|"benefit_card"|"higgsfield_broll"|"outro",
    "sourceAssetId": string|null,
    "visualInstruction": string,
    "voiceoverText": string,
    "captionText": string,
    "durationMs": number,
    "cameraMotion": "none"|"slow_zoom_in"|"slow_zoom_out"|"pan_left"|"pan_right"|"ken_burns",
    "highlightSelector": string|null,
    "callouts": [{ "text": string, "x": number, "y": number }]
  }]
}`;

export function storyboardUserPrompt(
  ctx: ProjectContext,
  scenario: Scenario,
  captures: CaptureStepResult[],
): string {
  const screens = captures
    .filter((c) => c.status === "ok")
    .map(
      (c) =>
        `- assetId=${c.screenshotAssetKey ?? "none"} intent="${c.intent}" url=${c.url} ` +
        `title="${c.metadata?.title ?? ""}" buttons=[${(c.metadata?.visibleButtons ?? [])
          .slice(0, 6)
          .join(", ")}]`,
    )
    .join("\n");

  return `Product: ${ctx.productName}
Audience: ${ctx.targetAudience}
Main promise: ${ctx.mainPromise}
Tone: ${ctx.tone}
Language: ${ctx.language}
Target duration: ${ctx.durationSeconds}s
Format: ${ctx.format}

User scenario (verbatim): "${scenario.raw}"

Captured screens:
${screens || "(no successful captures — produce a title + benefit-only storyboard)"}

Produce the storyboard JSON now. Total scene durations should sum close to ${ctx.durationSeconds * 1000}ms.`;
}

export const VOICE_SYSTEM = `You write voiceover for premium B2B SaaS demos.
Rules: short sentences, natural spoken rhythm, no hype, no filler, second-person ("you/your team").
Return ONLY JSON: { "lines": [{ "sceneId": string, "text": string }] }.`;

export function voiceUserPrompt(ctx: ProjectContext, scenes: { id: string; voiceoverText: string }[]): string {
  return `Product: ${ctx.productName}. Tone: ${ctx.tone}. Language: ${ctx.language}.
Rewrite each scene's voiceover so it is concise and human. Keep the same scene ids and order.
Scenes:
${scenes.map((s) => `- ${s.id}: ${s.voiceoverText}`).join("\n")}`;
}
