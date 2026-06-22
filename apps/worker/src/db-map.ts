import type { Project, StoryboardScene as DbScene } from "@demoforge/db";
import {
  type ProjectContext, type Storyboard, type StoryboardScene, type SceneType,
  type VoiceMode, type CameraMotion, type Callout, type VideoFormat,
} from "@demoforge/shared";

/** DB SceneType enum (UPPER_SNAKE) -> shared scene type (lower_snake). */
export function sceneTypeToDomain(v: string): SceneType {
  return v.toLowerCase() as SceneType;
}
export function sceneTypeToDb(v: SceneType): string {
  return v.toUpperCase();
}
export function voiceModeToDb(v: VoiceMode): string {
  return v.toUpperCase();
}
export function voiceModeToDomain(v: string): VoiceMode {
  return v.toLowerCase() as VoiceMode;
}

export function projectToContext(p: Project): ProjectContext {
  return {
    projectId: p.id,
    productName: p.productName,
    url: p.url,
    targetAudience: p.targetAudience,
    mainPromise: p.mainPromise,
    tone: p.tone,
    language: p.language,
    durationSeconds: p.durationSeconds,
    format: p.format as VideoFormat,
  };
}

/** Rebuild the domain Storyboard from persisted rows (ordered scenes). */
export function dbStoryboardToDomain(
  sb: { title: string; targetAudience: string; durationSeconds: number },
  scenes: DbScene[],
): Storyboard {
  const ordered = [...scenes].sort((a, b) => a.order - b.order);
  const domainScenes: StoryboardScene[] = ordered.map((s) => ({
    id: s.sceneKey,
    type: sceneTypeToDomain(s.type as unknown as string),
    sourceAssetId: s.sourceAssetId ?? null,
    visualInstruction: s.visualInstruction,
    voiceoverText: s.voiceoverText,
    captionText: s.captionText,
    durationMs: s.durationMs,
    cameraMotion: (s.cameraMotion as CameraMotion) ?? "none",
    highlightSelector: s.highlightSelector ?? null,
    callouts: (s.callouts as unknown as Callout[]) ?? [],
  }));
  return {
    title: sb.title,
    targetAudience: sb.targetAudience,
    durationSeconds: sb.durationSeconds,
    scenes: domainScenes,
  };
}
