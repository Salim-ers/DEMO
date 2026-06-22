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
  const t = copyFor(ctx.language);

  // --- 1. Title card (hook) -------------------------------------------------
  scenes.push({
    id: slugId("scene", `${ctx.productName}-title`),
    type: "title_card",
    sourceAssetId: null,
    visualInstruction: `Product wordmark "${ctx.productName}" on a clean dark canvas, subtle accent underline.`,
    voiceoverText: shortHook(ctx),
    captionText: ctx.productName.trim(),
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
    voiceoverText: t.problem(ctx),
    captionText: t.labels.problem,
    durationMs: 3000,
    cameraMotion: "none",
    highlightSelector: null,
    callouts: [],
  });

  // --- 3..N. Product in action (one scene per captured screen) -------------
  okCaptures.forEach((cap, i) => {
    const motion = CAMERA_CYCLE[i % CAMERA_CYCLE.length]!;
    const title = cap.metadata?.title?.trim();
    scenes.push({
      id: slugId("scene", `cap-${cap.index}-${cap.url}`),
      type: "screen_capture",
      sourceAssetId: cap.screenshotAssetKey ?? null,
      visualInstruction: `Show "${cap.intent}" screen${title ? ` (${title})` : ""}. ${
        motion === "slow_zoom_in" ? "Slow push toward the primary action." : "Gentle motion across the view."
      }`,
      // Premium, grammatically-safe narration that rotates per screen. The real
      // screenshot + caption carry the specifics; the line carries the benefit.
      voiceoverText: t.action(i, ctx),
      captionText: t.labels.inProduct,
      durationMs: 0, // filled by the distributor below
      cameraMotion: motion,
      highlightSelector: null,
      callouts: [],
    });
  });

  // If nothing captured, add a single placeholder demo beat so render still works.
  if (okCaptures.length === 0) {
    scenes.push({
      id: slugId("scene", `${ctx.productName}-placeholder`),
      type: "benefit_card",
      sourceAssetId: null,
      visualInstruction: "Benefit grid stand-in (no captures available).",
      voiceoverText: t.action(0, ctx),
      captionText: t.labels.inProduct,
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
    voiceoverText: t.roi(ctx),
    captionText: t.labels.outcome,
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
    voiceoverText: t.cta(ctx),
    captionText: ctx.url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
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
/* Localized so the deterministic (no-LLM) path still speaks the user's language. */

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** The hook is the user's own promise — already in their language. */
function shortHook(ctx: ProjectContext): string {
  return ctx.mainPromise.trim();
}

interface Copy {
  labels: { problem: string; outcome: string; inProduct: string };
  problem: (ctx: ProjectContext) => string;
  roi: (ctx: ProjectContext) => string;
  cta: (ctx: ProjectContext) => string;
  /** Rotating, grammatically-safe product-in-action narration, by screen index. */
  action: (i: number, ctx: ProjectContext) => string;
}

const FR: Copy = {
  labels: { problem: "Le problème", outcome: "Le résultat", inProduct: "Dans le produit" },
  problem: () =>
    `Trop d'outils dispersés, et l'information se perd. Vos équipes passent un temps précieux à la chercher.`,
  roi: () =>
    `Résultat : moins de friction, des décisions plus rapides, et une équipe concentrée sur l'essentiel.`,
  cta: (ctx) => `Découvrez-le sur vos propres données — rendez-vous sur ${host(ctx.url)}.`,
  action: (i, ctx) => {
    const lines = [
      `${ctx.productName.trim()} réunit toute votre activité dans une interface claire et professionnelle.`,
      `Chaque écran va droit au but : l'information utile, immédiatement.`,
      `Vous passez d'une vue à l'autre sans friction, sans rouvrir dix onglets.`,
      `Les détails qui comptent restent toujours sous les yeux.`,
      `Une expérience pensée pour aller vite, sans rien perdre en clarté.`,
      `Tout est centralisé, lisible, et prêt à être partagé avec votre équipe.`,
    ];
    return lines[i % lines.length]!;
  },
};

const EN: Copy = {
  labels: { problem: "The problem", outcome: "The outcome", inProduct: "In the product" },
  problem: () => `Most teams lose time switching tabs to find what actually needs attention.`,
  roi: () => `The result: your team sees priorities first, acts faster, and skips the busywork.`,
  cta: (ctx) => `See it on your own data — start at ${host(ctx.url)}.`,
  action: (i, ctx) => {
    const lines = [
      `${ctx.productName.trim()} brings your whole workflow into one clean, professional view.`,
      `Every screen gets to the point: the useful information, right away.`,
      `Move from one view to the next with zero friction — no ten open tabs.`,
      `The details that matter stay in front of you the whole time.`,
      `Built to move fast without ever losing clarity.`,
      `Everything is centralized, readable, and ready to share with your team.`,
    ];
    return lines[i % lines.length]!;
  },
};

/** Pick the copy pack for a project language; unknown languages get English. */
function copyFor(language: string): Copy {
  const base = (language || "en").toLowerCase().split(/[-_]/)[0];
  return base === "fr" ? FR : EN;
}
