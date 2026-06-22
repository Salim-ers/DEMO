import {
  type Storyboard, type StoryboardScene, type CaptureStepResult, type Scenario,
  type ProjectContext, type CameraMotion, slugId, clamp,
} from "@demoforge/shared";

const CAMERA_CYCLE: CameraMotion[] = ["slow_zoom_in", "ken_burns", "slow_zoom_out", "pan_right"];

/**
 * Deterministic storyboard builder. Runs with no LLM. Produces a credible
 * hook → problem → product-in-action → benefits → proof → CTA arc, grounded in
 * the real captured screens. Scene durations are distributed to hit the target.
 */
export function buildStoryboardFallback(
  ctx: ProjectContext,
  scenario: Scenario,
  captures: CaptureStepResult[],
): Storyboard {
  const okCaptures = captures.filter((c) => c.status === "ok");
  const totalMs = ctx.durationSeconds * 1000;
  const scenes: StoryboardScene[] = [];

  // --- 1. Title card (hook) -------------------------------------------------
  scenes.push({
    id: slugId("scene", `${ctx.productName}-title`),
    type: "title_card",
    sourceAssetId: null,
    visualInstruction: `Product wordmark "${ctx.productName}" on a clean dark canvas, subtle accent underline.`,
    voiceoverText: shortHook(ctx),
    captionText: ctx.productName,
    durationMs: 2600,
    cameraMotion: "none",
    highlightSelector: null,
    callouts: [],
  });

  // --- 2. Problem framing ---------------------------------------------------
  scenes.push({
    id: slugId("scene", `${ctx.productName}-problem`),
    type: "benefit_card",
    sourceAssetId: null,
    visualInstruction: "Short problem statement, single line, generous whitespace.",
    voiceoverText: problemLine(ctx),
    captionText: "The problem",
    durationMs: 3000,
    cameraMotion: "none",
    highlightSelector: null,
    callouts: [],
  });

  // --- 3..N. Product in action (one scene per captured screen) -------------
  okCaptures.forEach((cap, i) => {
    const motion = CAMERA_CYCLE[i % CAMERA_CYCLE.length]!;
    const title = cap.metadata?.title?.trim();
    const button = cap.metadata?.visibleButtons?.[0];
    scenes.push({
      id: slugId("scene", `cap-${cap.index}-${cap.url}`),
      type: "screen_capture",
      sourceAssetId: cap.screenshotAssetKey ?? null,
      visualInstruction: `Show "${cap.intent}" screen${title ? ` (${title})` : ""}. ${
        motion === "slow_zoom_in" ? "Slow push toward the primary action." : "Gentle motion across the view."
      }`,
      voiceoverText: actionLine(ctx, cap.intent, button),
      captionText: capitalize(cap.intent),
      durationMs: 0, // filled by the distributor below
      cameraMotion: motion,
      highlightSelector: button ? `text=${button}` : null,
      callouts: button ? [{ text: button, x: 0.5, y: 0.5 }] : [],
    });
  });

  // If nothing captured, add a single placeholder demo beat so render still works.
  if (okCaptures.length === 0) {
    scenes.push({
      id: slugId("scene", `${ctx.productName}-placeholder`),
      type: "benefit_card",
      sourceAssetId: null,
      visualInstruction: "Benefit grid stand-in (no captures available).",
      voiceoverText: actionLine(ctx, "your core workflow", undefined),
      captionText: "In the product",
      durationMs: 0,
      cameraMotion: "none",
      highlightSelector: null,
      callouts: [],
    });
  }

  // --- N+1. Proof / ROI -----------------------------------------------------
  scenes.push({
    id: slugId("scene", `${ctx.productName}-roi`),
    type: "benefit_card",
    sourceAssetId: null,
    visualInstruction: "Three compact outcome chips: faster, clearer, fewer tabs.",
    voiceoverText: roiLine(ctx),
    captionText: "The outcome",
    durationMs: 3200,
    cameraMotion: "none",
    highlightSelector: null,
    callouts: [],
  });

  // --- Outro / CTA ----------------------------------------------------------
  scenes.push({
    id: slugId("scene", `${ctx.productName}-outro`),
    type: "outro",
    sourceAssetId: null,
    visualInstruction: `Wordmark + URL ${ctx.url}, restrained accent.`,
    voiceoverText: ctaLine(ctx),
    captionText: ctx.url.replace(/^https?:\/\//, ""),
    durationMs: 2600,
    cameraMotion: "none",
    highlightSelector: null,
    callouts: [],
  });

  distributeDurations(scenes, totalMs);

  return {
    title: `${ctx.productName} — ${ctx.mainPromise}`,
    targetAudience: ctx.targetAudience,
    durationSeconds: ctx.durationSeconds,
    scenes,
  };
}

/** Spread remaining time across screen_capture/placeholder scenes (fixed cards keep their time). */
function distributeDurations(scenes: StoryboardScene[], totalMs: number) {
  const flexible = scenes.filter((s) => s.durationMs === 0);
  const fixedMs = scenes.filter((s) => s.durationMs > 0).reduce((a, s) => a + s.durationMs, 0);
  const remaining = Math.max(flexible.length * 2200, totalMs - fixedMs);
  const per = clamp(Math.round(remaining / Math.max(1, flexible.length)), 2200, 7000);
  for (const s of flexible) s.durationMs = per;
}

/* --------------------------- copy generators ----------------------------- */
/* Intentionally concrete and hype-free. No "welcome to", no "revolutionary".  */

function shortHook(ctx: ProjectContext): string {
  return `${ctx.mainPromise}`;
}
function problemLine(ctx: ProjectContext): string {
  return `Most teams lose time switching tabs to find what actually needs attention.`;
}
function actionLine(ctx: ProjectContext, intent: string, button?: string): string {
  const verb = intent.replace(/^(open|show|view)\s+/i, "").trim();
  if (button) return `Here you ${lower(intent)} — ${lower(button)} is one click away.`;
  return `Here you ${lower(intent)}, with the important details up front.`;
}
function roiLine(ctx: ProjectContext): string {
  return `The result: your team sees priorities first, acts faster, and skips the busywork.`;
}
function ctaLine(ctx: ProjectContext): string {
  return `See it on your own data — start at ${ctx.url.replace(/^https?:\/\//, "")}.`;
}

const capitalize = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
