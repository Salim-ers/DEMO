import {
  type Storyboard, type StoryboardScene, type CaptureStepResult, type Scenario,
  type ProjectContext, type CameraMotion, type Callout, slugId, clamp,
} from "@demoforge/shared";

/**
 * Deterministic storyboard builder for the Premium SaaS Motion Engine. Runs with
 * no LLM and produces a commercial arc:
 *
 *   cinematic_intro → problem_motion_card → promise_card →
 *   product_stage (+callouts) → product_zoom → product_stage… →
 *   workflow_map → benefit_grid → final_cta
 *
 * It is grounded in the real captured screens (woven into the product beats) and
 * speaks the project's language. Horse Ledger (and equestrian products) get a
 * curated luxury script; every other product gets a premium generic script.
 */
export function buildStoryboardFallback(
  ctx: ProjectContext,
  _scenario: Scenario,
  captures: CaptureStepResult[],
): Storyboard {
  const okCaptures = captures.filter((c) => c.status === "ok");
  const totalMs = ctx.durationSeconds * 1000;
  const copy = pickCopy(ctx);
  const scenes: StoryboardScene[] = [];

  const push = (s: Partial<StoryboardScene> & Pick<StoryboardScene, "id" | "type" | "visualInstruction" | "voiceoverText" | "captionText">) =>
    scenes.push({
      sourceAssetId: null,
      durationMs: 0,
      cameraMotion: "none",
      highlightSelector: null,
      callouts: [],
      ...s,
    });

  // --- 1. Cinematic intro (brand + hook) -----------------------------------
  push({
    id: slugId("scene", `${ctx.productName}-intro`),
    type: "cinematic_intro",
    visualInstruction: copy.hookHeading(ctx),
    voiceoverText: copy.hook(ctx),
    captionText: ctx.productName.trim(),
    durationMs: 3200,
  });

  // --- 2. Problem (motion card) --------------------------------------------
  push({
    id: slugId("scene", `${ctx.productName}-problem`),
    type: "problem_motion_card",
    visualInstruction: copy.problemHeading,
    voiceoverText: copy.problem,
    captionText: copy.problemKicker,
    durationMs: 4200,
  });

  // --- 3. Promise ----------------------------------------------------------
  push({
    id: slugId("scene", `${ctx.productName}-promise`),
    type: "promise_card",
    visualInstruction: copy.promiseHeading(ctx),
    voiceoverText: copy.promise(ctx),
    captionText: copy.promiseKicker,
    durationMs: 3600,
  });

  // --- 4..N. Product in action ---------------------------------------------
  // First capture = dashboard hero (callouts). Second = a zoomed feature. Rest
  // = staged product views. Narration names the real section for unique lines.
  okCaptures.forEach((cap, i) => {
    const section = cleanLabel(cap.intent) ?? cleanLabel(cap.metadata?.title);
    const isHero = i === 0;
    const isZoom = i === 1;
    const type = isZoom ? "product_zoom" : "product_stage";
    const motion: CameraMotion = isZoom ? "slow_zoom_in" : i % 2 === 0 ? "slow_zoom_out" : "ken_burns";
    push({
      id: slugId("scene", `cap-${cap.index}-${cap.url}`),
      type,
      sourceAssetId: cap.screenshotAssetKey ?? null,
      visualInstruction: `Stage "${cap.intent}"${section ? ` (${section})` : ""} in a premium browser frame.`,
      voiceoverText: copy.action(i, ctx, section ?? undefined),
      captionText: "",
      durationMs: 0, // distributed below
      cameraMotion: motion,
      callouts: isHero ? copy.dashboardCallouts : [],
    });
  });

  // No captures (login wall / bot protection): substitute a workflow map so the
  // story still lands without empty product beats.
  if (okCaptures.length === 0) {
    push({
      id: slugId("scene", `${ctx.productName}-workflow-fallback`),
      type: "workflow_map",
      visualInstruction: copy.workflowNodes.join(" | "),
      voiceoverText: copy.workflowVoice,
      captionText: copy.workflowKicker,
      durationMs: 0,
    });
  }

  // --- N+1. Workflow map (everything connected) ----------------------------
  push({
    id: slugId("scene", `${ctx.productName}-workflow`),
    type: "workflow_map",
    visualInstruction: copy.workflowNodes.join(" | "),
    voiceoverText: copy.workflowVoice,
    captionText: copy.workflowKicker,
    durationMs: 4200,
  });

  // --- N+2. Benefit grid (outcome) -----------------------------------------
  push({
    id: slugId("scene", `${ctx.productName}-benefits`),
    type: "benefit_grid",
    visualInstruction: copy.benefitItems.join(" | "),
    voiceoverText: copy.benefitVoice,
    captionText: copy.benefitKicker,
    durationMs: 4200,
  });

  // --- Final CTA -----------------------------------------------------------
  push({
    id: slugId("scene", `${ctx.productName}-cta`),
    type: "final_cta",
    visualInstruction: copy.ctaHeading(ctx),
    voiceoverText: copy.cta(ctx),
    captionText: host(ctx.url),
    durationMs: 3600,
  });

  distributeDurations(scenes, totalMs);

  return {
    title: `${ctx.productName} — ${ctx.mainPromise}`,
    targetAudience: ctx.targetAudience,
    durationSeconds: ctx.durationSeconds,
    scenes,
  };
}

/** Spread remaining time across flexible (product) scenes; fixed cards keep theirs. */
function distributeDurations(scenes: StoryboardScene[], totalMs: number) {
  const flexible = scenes.filter((s) => s.durationMs === 0);
  const fixedMs = scenes.filter((s) => s.durationMs > 0).reduce((a, s) => a + s.durationMs, 0);
  const remaining = Math.max(flexible.length * 3200, totalMs - fixedMs);
  const per = clamp(Math.round(remaining / Math.max(1, flexible.length)), 3200, 7000);
  for (const s of flexible) s.durationMs = per;
}

/* ----------------------------- copy packs -------------------------------- */

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

interface PremiumCopy {
  hook: (ctx: ProjectContext) => string;
  hookHeading: (ctx: ProjectContext) => string;
  problem: string;
  problemHeading: string;
  problemKicker: string;
  promise: (ctx: ProjectContext) => string;
  promiseHeading: (ctx: ProjectContext) => string;
  promiseKicker: string;
  action: (i: number, ctx: ProjectContext, section?: string) => string;
  dashboardCallouts: Callout[];
  workflowNodes: string[];
  workflowKicker: string;
  workflowVoice: string;
  benefitItems: string[];
  benefitKicker: string;
  benefitVoice: string;
  cta: (ctx: ProjectContext) => string;
  ctaHeading: (ctx: ProjectContext) => string;
}

/** A short label is "clean" enough to put in front of a colon in copy. */
function cleanLabel(s?: string): string | null {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  if (!t || t.length > 24) return null;
  if (!/^[\p{L}][\p{L}\s'’-]*$/u.test(t)) return null;
  if (t.split(" ").length > 3) return null;
  return t[0]!.toUpperCase() + t.slice(1);
}

const DASHBOARD_CALLOUTS_FR: Callout[] = [
  { text: "Vision claire", x: 0.28, y: 0.4 },
  { text: "Données centralisées", x: 0.72, y: 0.38 },
  { text: "Décisions plus rapides", x: 0.5, y: 0.66 },
];
const DASHBOARD_CALLOUTS_EN: Callout[] = [
  { text: "Clear overview", x: 0.28, y: 0.4 },
  { text: "Everything centralized", x: 0.72, y: 0.38 },
  { text: "Faster decisions", x: 0.5, y: 0.66 },
];

/** Luxury equestrian script for Horse Ledger — the exact premium tone requested. */
const EQUESTRIAN_FR: PremiumCopy = {
  hook: () =>
    `Dans une structure équine, chaque détail compte : un soin à planifier, un document à retrouver, une pension à suivre, une information à partager avec l'équipe.`,
  hookHeading: () => `Gérez votre structure équine, sans rien laisser au hasard.`,
  problem: `Les informations sont souvent dispersées entre messages, tableurs, documents et outils séparés.`,
  problemHeading: `Des informations dispersées entre messages, tableurs, documents et outils séparés.`,
  problemKicker: "Le problème",
  promise: () =>
    `Horse Ledger centralise tout dans une plateforme claire, élégante et pensée pour le terrain.`,
  promiseHeading: () => `Tout votre haras, réuni dans une plateforme claire et élégante.`,
  promiseKicker: "La plateforme",
  action: (i, _ctx, section) => {
    const lines = [
      `Depuis le tableau de bord, vous gardez une vision immédiate de vos chevaux, de vos tâches, de vos finances et de vos priorités.`,
      `Chaque fiche cheval rassemble les informations essentielles : identité, propriétaire, santé, documents et suivi quotidien.`,
      `Suivez les rendez-vous vétérinaires, le maréchal-ferrant, l'ostéopathie, les rappels et les tâches importantes.`,
      `Contrats, factures, documents sanitaires et fichiers administratifs sont centralisés et faciles à retrouver.`,
      `Pensions, prestations, paiements et retards se suivent clairement, sans tableur.`,
      `Alimentation, litière, produits de soin et matériel : vos stocks restent toujours à jour.`,
    ];
    if (i < lines.length) return lines[i]!;
    const s = cleanLabel(section);
    return s ? `${s} : tout est réuni, clair et exploitable.` : `Chaque espace de travail va droit au but, sans friction.`;
  },
  dashboardCallouts: DASHBOARD_CALLOUTS_FR,
  workflowNodes: ["Chevaux", "Soins", "Planning", "Documents", "Finances"],
  workflowKicker: "Tout centralisé",
  workflowVoice: `Votre équipe gagne du temps, évite les doubles saisies et travaille avec une donnée fiable.`,
  benefitItems: ["Moins de tableurs", "Plus de clarté", "Une gestion plus professionnelle"],
  benefitKicker: "Le résultat",
  benefitVoice: `Horse Ledger apporte aux haras, écuries et structures de course une gestion plus fluide, plus professionnelle et plus sécurisée.`,
  cta: (ctx) => `Découvrez la plateforme sur ${host(ctx.url)}.`,
  ctaHeading: () => `La gestion équine centralisée, élégante et professionnelle.`,
};

const GENERIC_FR: PremiumCopy = {
  hook: (ctx) => ctx.mainPromise.trim(),
  hookHeading: (ctx) => ctx.mainPromise.trim(),
  problem: `Trop d'outils dispersés, et l'information se perd — vos équipes passent un temps précieux à la chercher.`,
  problemHeading: `Trop d'outils dispersés, et l'information se perd.`,
  problemKicker: "Le problème",
  promise: (ctx) => `${ctx.productName.trim()} réunit tout dans une plateforme claire, rapide et élégante.`,
  promiseHeading: (ctx) => `${ctx.productName.trim()}, tout réuni au même endroit.`,
  promiseKicker: "La solution",
  action: (i, ctx, section) => {
    const lines = [
      `Depuis le tableau de bord, vous gardez une vision immédiate de votre activité et de vos priorités.`,
      `Chaque écran va droit au but : l'information utile, immédiatement, sans la chercher.`,
      `Vous passez d'une vue à l'autre sans friction, sans rouvrir dix onglets.`,
      `Vos données restent à jour, claires et prêtes à être partagées avec l'équipe.`,
      `Les détails qui comptent restent toujours sous les yeux.`,
    ];
    if (i < lines.length) return lines[i]!;
    const s = cleanLabel(section);
    return s ? `${s} : tout est réuni, clair et exploitable.` : `Une expérience pensée pour aller vite, sans perdre en clarté.`;
  },
  dashboardCallouts: DASHBOARD_CALLOUTS_FR,
  workflowNodes: ["Données", "Suivi", "Équipe", "Décisions"],
  workflowKicker: "Tout connecté",
  workflowVoice: `Votre équipe gagne du temps, évite les doubles saisies et travaille avec une donnée fiable.`,
  benefitItems: ["Moins de friction", "Plus de clarté", "Des décisions plus rapides"],
  benefitKicker: "Le résultat",
  benefitVoice: `Résultat : moins de friction, des décisions plus rapides, et une équipe concentrée sur l'essentiel.`,
  cta: (ctx) => `Découvrez-le sur vos propres données — rendez-vous sur ${host(ctx.url)}.`,
  ctaHeading: (ctx) => `${ctx.productName.trim()} — ${ctx.mainPromise.trim()}`,
};

const GENERIC_EN: PremiumCopy = {
  hook: (ctx) => ctx.mainPromise.trim(),
  hookHeading: (ctx) => ctx.mainPromise.trim(),
  problem: `Too many scattered tools, and information gets lost — teams waste real time hunting for it.`,
  problemHeading: `Too many scattered tools, and information gets lost.`,
  problemKicker: "The problem",
  promise: (ctx) => `${ctx.productName.trim()} brings it all into one clear, fast, elegant platform.`,
  promiseHeading: (ctx) => `${ctx.productName.trim()}, everything in one place.`,
  promiseKicker: "The solution",
  action: (i, ctx, section) => {
    const lines = [
      `From the dashboard, you get an immediate view of your activity and your priorities.`,
      `Every screen gets to the point: the useful information, right away — no hunting.`,
      `Move from one view to the next with zero friction — no ten open tabs.`,
      `Your data stays up to date, clear, and ready to share with the team.`,
      `The details that matter stay in front of you the whole time.`,
    ];
    if (i < lines.length) return lines[i]!;
    const s = cleanLabel(section);
    return s ? `${s}: everything in one place, clear and ready to use.` : `Built to move fast without ever losing clarity.`;
  },
  dashboardCallouts: DASHBOARD_CALLOUTS_EN,
  workflowNodes: ["Data", "Tracking", "Team", "Decisions"],
  workflowKicker: "All connected",
  workflowVoice: `Your team saves time, avoids double entry, and works from reliable data.`,
  benefitItems: ["Less friction", "More clarity", "Faster decisions"],
  benefitKicker: "The outcome",
  benefitVoice: `The result: less friction, faster decisions, and a team focused on what matters.`,
  cta: (ctx) => `See it on your own data — start at ${host(ctx.url)}.`,
  ctaHeading: (ctx) => `${ctx.productName.trim()} — ${ctx.mainPromise.trim()}`,
};

const isEquestrian = (ctx: ProjectContext) =>
  /\bhorse\b|ledger|equine|equestr|écuri|haras|cheval|chevaux/i.test(
    `${ctx.productName} ${ctx.url} ${ctx.targetAudience} ${ctx.mainPromise}`,
  );

function pickCopy(ctx: ProjectContext): PremiumCopy {
  const fr = (ctx.language || "en").toLowerCase().startsWith("fr");
  if (isEquestrian(ctx) && fr) return EQUESTRIAN_FR;
  return fr ? GENERIC_FR : GENERIC_EN;
}
