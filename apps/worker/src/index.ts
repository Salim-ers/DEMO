import { Worker } from "bullmq";
import { QUEUE_NAME, pipelineJobDataSchema } from "@demoforge/shared";
import { createRedis } from "./redis.js";
import { runPipeline } from "./pipeline.js";
import { logger } from "./logger.js";

/**
 * DemoForge pipeline worker. Consumes jobs from the shared queue and runs the
 * full capture -> storyboard -> voice -> captions -> render -> export pipeline.
 *
 * Concurrency is intentionally low: each job spins up a headless browser and a
 * Remotion render, both resource-heavy. Scale horizontally by running more
 * worker processes rather than raising concurrency.
 */
const concurrency = Number(process.env.WORKER_CONCURRENCY ?? "1");

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const data = pipelineJobDataSchema.parse(job.data);
    logger.info({ jobId: job.id, attempt: job.attemptsMade + 1 }, "picked up pipeline job");
    await runPipeline(data);
  },
  { connection: createRedis(), concurrency },
);

worker.on("completed", (job) => logger.info({ jobId: job.id }, "job completed"));
worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err: err.message }, "job failed"));
worker.on("error", (err) => logger.error({ err: err.message }, "worker error"));

logger.info({ queue: QUEUE_NAME, concurrency }, "DemoForge worker online");

async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down worker");
  await worker.close();
  process.exit(0);
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
