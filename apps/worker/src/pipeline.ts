import type { Logger } from "pino";
import { JOBS, type JobName, type PipelineJobData } from "@demoforge/shared";
import { jobLogger } from "./logger.js";
import {
  ensureStages, getStage, setStage, markJobRunning, markJobSucceeded, markJobFailed, setProjectStatus,
} from "./status.js";
import { analyzeProject } from "./jobs/analyzeProject.js";
import { captureWebsite } from "./jobs/captureWebsite.js";
import { generateStoryboard } from "./jobs/generateStoryboard.js";
import { generateVoiceScript } from "./jobs/generateVoiceScript.js";
import { generateCaptions, type CaptionKeys } from "./jobs/generateCaptions.js";
import { renderVideo } from "./jobs/renderVideo.js";
import { exportAssets } from "./jobs/exportAssets.js";

export interface PipelineCtx {
  projectId: string;
  renderJobId: string;
  log: Logger;
}

/** Run one stage with status bookkeeping + idempotency (skip if already done). */
async function stage<T>(ctx: PipelineCtx, name: JobName, fn: () => Promise<T>): Promise<T | undefined> {
  const current = await getStage(ctx.renderJobId, name);
  if (current?.status === "succeeded") {
    ctx.log.info({ stage: name }, "stage already complete; skipping");
    return undefined;
  }
  await setStage(ctx.renderJobId, name, { status: "running", startedAt: new Date().toISOString(), error: undefined });
  try {
    const result = await fn();
    await setStage(ctx.renderJobId, name, { status: "succeeded", finishedAt: new Date().toISOString() });
    return result;
  } catch (err) {
    await setStage(ctx.renderJobId, name, { status: "failed", finishedAt: new Date().toISOString(), error: String(err).slice(0, 500) });
    throw err;
  }
}

/**
 * Execute the full generation pipeline for a project's render job. Stages run in
 * order; each persists its own state so the UI stepper reflects live progress and
 * a retried job resumes from where it left off.
 */
export async function runPipeline(data: PipelineJobData): Promise<void> {
  const log = jobLogger(data.projectId, data.renderJobId);
  const ctx: PipelineCtx = { projectId: data.projectId, renderJobId: data.renderJobId, log };

  await ensureStages(data.renderJobId);
  await markJobRunning(data.renderJobId);

  try {
    await setProjectStatus(data.projectId, "capturing");
    const analyzed = await stage(ctx, JOBS.analyzeProject, () => analyzeProject(ctx));
    const steps = analyzed?.steps ?? (await analyzeProject(ctx)).steps;

    await stage(ctx, JOBS.captureWebsite, () => captureWebsite(ctx, steps));

    await setProjectStatus(data.projectId, "storyboarding");
    await stage(ctx, JOBS.generateStoryboard, () => generateStoryboard(ctx));
    await stage(ctx, JOBS.generateVoiceScript, () => generateVoiceScript(ctx));

    // generateCaptions output feeds exportAssets; recompute if the stage was skipped.
    let captionKeys = (await stage(ctx, JOBS.generateCaptions, () => generateCaptions(ctx))) as CaptionKeys | undefined;
    if (!captionKeys) captionKeys = await generateCaptions(ctx);

    await setProjectStatus(data.projectId, "rendering");
    await stage(ctx, JOBS.renderVideo, () => renderVideo(ctx));

    await stage(ctx, JOBS.exportAssets, () => exportAssets(ctx, captionKeys!));

    await markJobSucceeded(data.renderJobId);
    await setProjectStatus(data.projectId, "ready");
    log.info("pipeline complete");
  } catch (err) {
    await markJobFailed(data.renderJobId, String(err));
    await setProjectStatus(data.projectId, "failed");
    log.error({ err: String(err) }, "pipeline failed");
    throw err;
  }
}
