import { prisma, JobStatus } from "@demoforge/db";
import { generateStoryboard as buildStoryboard } from "@demoforge/storyboard";
import type { CaptureStepResult, Scenario, ScenarioStep, PageMetadata } from "@demoforge/shared";
import { projectToContext, sceneTypeToDb } from "../db-map.js";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 3 — generateStoryboard.
 * Reads the most recent successful capture, asks the storyboard package to build
 * a grounded story arc (LLM when configured, deterministic fallback otherwise),
 * and persists it. `sourceAssetId` on each scene is the Asset id of the captured
 * screenshot, so the renderer can resolve a real image URL later.
 *
 * Idempotent: upserts the project's single Storyboard and rewrites its scenes.
 */
export async function generateStoryboard(ctx: PipelineCtx): Promise<{ storyboardId: string; source: string }> {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: ctx.projectId } });
  const scenarioRow = await prisma.demoScenario.findFirst({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  });

  const run = await prisma.captureRun.findFirst({
    where: { projectId: project.id, status: JobStatus.SUCCEEDED },
    orderBy: { createdAt: "desc" },
    include: { steps: { orderBy: { index: "asc" } } },
  });

  const captures: CaptureStepResult[] = (run?.steps ?? []).map((s) => ({
    index: s.index,
    intent: s.intent,
    url: s.url,
    status: s.status as "ok" | "broken" | "skipped",
    // Pass the Asset id forward as the scene's sourceAssetId.
    screenshotAssetKey: s.screenshotId ?? undefined,
    mobileScreenshotAssetKey: s.mobileShotId ?? undefined,
    metadata: (s.metadata as unknown as PageMetadata) ?? undefined,
    startedAt: s.createdAt.toISOString(),
    finishedAt: s.createdAt.toISOString(),
    error: s.error ?? undefined,
  }));

  const scenario: Scenario = {
    raw: scenarioRow?.raw ?? "Demonstrate the core product workflow.",
    steps: ((scenarioRow?.steps as unknown as ScenarioStep[]) ?? [{ intent: "open dashboard" }]),
  };

  const { storyboard, source } = await buildStoryboard(projectToContext(project), scenario, captures);

  const sb = await prisma.storyboard.upsert({
    where: { projectId: project.id },
    create: {
      projectId: project.id,
      title: storyboard.title,
      targetAudience: storyboard.targetAudience,
      durationSeconds: storyboard.durationSeconds,
      source,
    },
    update: {
      title: storyboard.title,
      targetAudience: storyboard.targetAudience,
      durationSeconds: storyboard.durationSeconds,
      source,
    },
  });

  // Replace scenes atomically.
  await prisma.storyboardScene.deleteMany({ where: { storyboardId: sb.id } });
  await prisma.storyboardScene.createMany({
    data: storyboard.scenes.map((scene, i) => ({
      storyboardId: sb.id,
      order: i,
      sceneKey: scene.id,
      type: sceneTypeToDb(scene.type) as never,
      sourceAssetId: scene.sourceAssetId ?? null,
      visualInstruction: scene.visualInstruction,
      voiceoverText: scene.voiceoverText,
      captionText: scene.captionText,
      durationMs: scene.durationMs,
      cameraMotion: scene.cameraMotion,
      highlightSelector: scene.highlightSelector ?? null,
      callouts: (scene.callouts as unknown as object) ?? [],
    })),
  });

  ctx.log.info({ scenes: storyboard.scenes.length, source }, "generateStoryboard complete");
  return { storyboardId: sb.id, source };
}
