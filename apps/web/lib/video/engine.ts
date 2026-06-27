/**
 * Engine mode switch. Until real keys + endpoints are wired, the app runs in
 * "mock" mode: adapters return realistic, deterministic statuses so the UI is
 * fully usable. Flip NEXT_PUBLIC_VIDEO_ENGINE_MODE=production to call the real
 * Higgsfield / ElevenLabs / Remotion services (implemented in packages/*).
 */
export type EngineMode = "mock" | "production";

export const VIDEO_ENGINE_MODE: EngineMode =
  process.env.NEXT_PUBLIC_VIDEO_ENGINE_MODE === "production" ? "production" : "mock";

export const isMockEngine = VIDEO_ENGINE_MODE === "mock";
