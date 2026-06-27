/**
 * Video engine — single entry point. Re-exports the three engine adapters and
 * provides the product-level mapping + production-pipeline plan the UI renders.
 */
import type { EngineStageStatus, ProductionStage, VideoStatus } from "../../types/video-engine.js";

export * from "./engine.js";
export * from "./higgsfield.js";
export * from "./elevenlabs.js";
export * from "./remotion.js";

/** DB project.status → product-level VideoStatus the user sees. */
export function toVideoStatus(dbStatus: string, archived = false): VideoStatus {
  if (archived) return "archived";
  switch (dbStatus) {
    case "capturing":
      return "analyzing";
    case "storyboarding":
      return "storyboard_ready";
    case "rendering":
      return "rendering";
    case "ready":
      return "ready";
    case "failed":
      return "action_required";
    default:
      return "draft";
  }
}

const PIPELINE: { key: string; label: string; engine: ProductionStage["engine"]; detail: string }[] = [
  { key: "analyze", label: "Analyse du site", engine: "studio", detail: "Lecture de l'URL, captures, proposition de valeur, audience." },
  { key: "strategy", label: "Stratégie vidéo", engine: "studio", detail: "Objectif, format, durée, ton, angle et CTA." },
  { key: "storyboard", label: "Storyboard", engine: "studio", detail: "Découpage scène par scène : message, écran, mouvement." },
  { key: "shots", label: "Plans IA", engine: "higgsfield", detail: "Higgsfield génère les plans cinématiques et le b-roll." },
  { key: "voice", label: "Voix off", engine: "elevenlabs", detail: "ElevenLabs génère une voix naturelle par scène." },
  { key: "assembly", label: "Montage", engine: "remotion", detail: "Remotion assemble écrans, plans, voix, sous-titres, transitions." },
  { key: "delivery", label: "Livraison", engine: "studio", detail: "Exports 16:9, 9:16, 1:1, sous-titres et archive." },
];

/** Index of the pipeline stage currently in flight for a given status. */
const STATUS_PHASE: Record<VideoStatus, number> = {
  draft: 0,
  analyzing: 1,
  storyboard_ready: 3,
  rendering: 5,
  action_required: 5,
  ready: 7,
  archived: 7,
};

/**
 * Build the production pipeline view. Stages before the current phase are
 * "ready", the current one is "generating" (or "failed" when action is
 * required), later ones are "queued". The voice stage is "skipped" when the
 * project has no voice-over.
 */
export function productionStages(status: VideoStatus, hasVoiceOver: boolean): ProductionStage[] {
  const phase = STATUS_PHASE[status];
  return PIPELINE.map((s, i) => {
    let st: EngineStageStatus;
    if (s.key === "voice" && !hasVoiceOver) st = "skipped";
    else if (i < phase) st = "ready";
    else if (i === phase) st = status === "action_required" ? "failed" : "generating";
    else st = "queued";
    return { ...s, status: st };
  });
}
