import { prisma, JobStatus } from "@demoforge/db";
import type { JobName, JobState } from "@demoforge/shared";
import { JOBS } from "@demoforge/shared";

/** Ordered pipeline stages, used to seed the stepper and compute progress. */
export const STAGE_ORDER: JobName[] = [
  JOBS.analyzeProject,
  JOBS.captureWebsite,
  JOBS.generateStoryboard,
  JOBS.generateVoiceScript,
  JOBS.generateCaptions,
  JOBS.renderVideo,
  JOBS.exportAssets,
];

function emptyStages(): JobState[] {
  return STAGE_ORDER.map((name) => ({ name, status: "queued" }));
}

/** Ensure a RenderJob has its stage list initialized. Idempotent. */
export async function ensureStages(renderJobId: string): Promise<JobState[]> {
  const job = await prisma.renderJob.findUniqueOrThrow({ where: { id: renderJobId } });
  const stages = (job.stages as unknown as JobState[]) ?? [];
  if (stages.length === STAGE_ORDER.length) return stages;
  const seeded = emptyStages();
  await prisma.renderJob.update({ where: { id: renderJobId }, data: { stages: seeded as unknown as object } });
  return seeded;
}

function progressFor(stages: JobState[]): number {
  const done = stages.filter((s) => s.status === "succeeded" || s.status === "skipped").length;
  return Math.round((done / stages.length) * 100);
}

/** Read the current state of a single stage (used for idempotency checks). */
export async function getStage(renderJobId: string, name: JobName): Promise<JobState | undefined> {
  const job = await prisma.renderJob.findUniqueOrThrow({ where: { id: renderJobId } });
  return ((job.stages as unknown as JobState[]) ?? []).find((s) => s.name === name);
}

/** Patch one stage's status and recompute job progress. */
export async function setStage(renderJobId: string, name: JobName, patch: Partial<JobState>): Promise<void> {
  const job = await prisma.renderJob.findUniqueOrThrow({ where: { id: renderJobId } });
  const stages = ((job.stages as unknown as JobState[]) ?? emptyStages()).map((s) =>
    s.name === name ? { ...s, ...patch, name } : s,
  );
  await prisma.renderJob.update({
    where: { id: renderJobId },
    data: { stages: stages as unknown as object, progress: progressFor(stages) },
  });
}

export async function markJobRunning(renderJobId: string): Promise<void> {
  await prisma.renderJob.update({
    where: { id: renderJobId },
    data: { status: JobStatus.RUNNING, startedAt: new Date(), error: null },
  });
}

export async function markJobSucceeded(renderJobId: string, outputAssetId?: string): Promise<void> {
  await prisma.renderJob.update({
    where: { id: renderJobId },
    data: { status: JobStatus.SUCCEEDED, finishedAt: new Date(), progress: 100, outputAssetId: outputAssetId ?? undefined },
  });
}

export async function markJobFailed(renderJobId: string, error: string): Promise<void> {
  await prisma.renderJob.update({
    where: { id: renderJobId },
    data: { status: JobStatus.FAILED, finishedAt: new Date(), error: error.slice(0, 1000) },
  });
}

export async function setProjectStatus(projectId: string, status: string): Promise<void> {
  await prisma.project.update({ where: { id: projectId }, data: { status } });
}
