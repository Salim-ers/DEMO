import { Worker, type Job } from "bullmq";
import { Redis } from "ioredis";
import { QUEUE_NAME, pipelineJobDataSchema } from "@demoforge/shared";
import { prisma } from "@demoforge/db";
import { createRedis, redisUrl } from "./redis.js";
import { runPipeline } from "./pipeline.js";
import { logger } from "./logger.js";
import { startHealthServer } from "./health.js";
import { startHeartbeat } from "./heartbeat.js";

/**
 * DemoForge pipeline worker. Consumes jobs from the shared queue and runs the
 * full capture -> storyboard -> voice -> captions -> render -> export pipeline.
 *
 * Concurrency is intentionally low: each job spins up a headless browser and a
 * Remotion render, both resource-heavy. Scale horizontally by running more
 * worker processes rather than raising concurrency.
 *
 * Designed to run as a long-lived process on Railway/Render (NOT on Vercel,
 * which only runs short-lived serverless functions). It exposes /health and
 * writes a heartbeat so the web app can detect when no worker is online.
 */
const concurrency = Number(process.env.WORKER_CONCURRENCY ?? "1");

// Live counters surfaced via /health and the heartbeat.
let activeJobs = 0;
let lastJobAt: Date | null = null;
let redisOk = false;
let dbOk = false;

/** Strip credentials from a connection string before logging it. */
function redacted(url?: string): string {
  if (!url) return "(unset)";
  try {
    const u = new URL(url);
    if (u.password) u.password = "***";
    if (u.username) u.username = "***";
    return u.toString();
  } catch {
    return "(set)";
  }
}

/** Fail fast at boot with a clear message if Redis or the DB are unreachable. */
async function verifyConnections(): Promise<void> {
  const raw = process.env.REDIS_URL?.trim();
  if (!raw) {
    logger.fatal(
      "❌ REDIS_URL is not set. On Railway, set it to the Redis service's PUBLIC url " +
        "(Redis → Variables → REDIS_PUBLIC_URL). An unresolved ${{...}} reference reads as empty.",
    );
    throw new Error("REDIS_URL not set");
  }

  const target = redisUrl();
  logger.info({ redis: redacted(target) }, "connecting to Redis…");
  // A short-lived probe that gives up quickly (instead of retrying forever) so
  // a bad URL surfaces as one clear error, not an endless ECONNREFUSED stream.
  const ping = new Redis(target, {
    family: 0,
    lazyConnect: true,
    connectTimeout: 10_000,
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => (times > 2 ? null : 400),
  });
  try {
    await ping.connect();
    await ping.ping();
    redisOk = true;
    logger.info({ redis: redacted(target) }, "✅ Redis connected");
  } catch (err) {
    logger.error({ err: String(err), redis: redacted(target) }, "❌ Redis connection failed");
    throw err;
  } finally {
    ping.disconnect();
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
    logger.info("✅ DB connected");
  } catch (err) {
    logger.error({ err: String(err) }, "❌ DB connection failed");
    throw err;
  }
}

async function main(): Promise<void> {
  await verifyConnections();

  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      activeJobs++;
      lastJobAt = new Date();
      const meta = { jobId: job.id, attempt: job.attemptsMade + 1, name: job.name };
      logger.info(meta, "📥 job received");
      try {
        const data = pipelineJobDataSchema.parse(job.data);
        logger.info({ ...meta, projectId: data.projectId, renderJobId: data.renderJobId }, "▶️  job started");
        await runPipeline(data);
        // "completed" is logged by the worker.on("completed") handler below.
      } finally {
        activeJobs = Math.max(0, activeJobs - 1);
      }
    },
    { connection: createRedis(), concurrency },
  );

  worker.on("completed", (job) => logger.info({ jobId: job.id }, "✅ job completed"));
  worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err: err.message }, "❌ job failed"));
  worker.on("error", (err) => logger.error({ err: err.message }, "worker error"));

  const health = startHealthServer(() => ({ redis: redisOk, db: dbOk, activeJobs, lastJobAt }));
  const heartbeat = startHeartbeat(() => ({ activeJobs, lastJobAt }));

  logger.info(
    { queue: QUEUE_NAME, concurrency, workerId: heartbeat.workerId },
    "🟢 DemoForge worker online — waiting for jobs",
  );

  let shuttingDown = false;
  async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "shutting down worker");
    await heartbeat.stop().catch(() => {});
    await worker.close().catch(() => {});
    health.close();
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  }
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

// Surface (rather than silently swallow) fatal async errors.
process.on("unhandledRejection", (reason) => logger.error({ reason: String(reason) }, "unhandledRejection"));
process.on("uncaughtException", (err) => logger.error({ err: String(err) }, "uncaughtException"));

main().catch((err) => {
  logger.fatal({ err: String(err) }, "worker failed to start");
  process.exit(1);
});
