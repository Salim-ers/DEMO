import os from "node:os";
import { prisma } from "@demoforge/db";
import { QUEUE_NAME } from "@demoforge/shared";
import { logger } from "./logger.js";

/**
 * Liveness heartbeat. Every `intervalMs` the worker upserts a row in
 * WorkerHeartbeat so the web app can tell, at a glance, whether a worker is
 * actually online and consuming the queue. Without this a stuck job is
 * indistinguishable from "no worker deployed".
 */
const WORKER_ID = process.env.WORKER_ID ?? process.env.RAILWAY_REPLICA_ID ?? os.hostname();
const VERSION = process.env.RAILWAY_GIT_COMMIT_SHA ?? process.env.WORKER_VERSION ?? null;
const INTERVAL_MS = Number(process.env.HEARTBEAT_INTERVAL_MS ?? "30000");

export interface HeartbeatStats {
  activeJobs: number;
  lastJobAt: Date | null;
}

export function startHeartbeat(getStats: () => HeartbeatStats) {
  let stopped = false;

  async function beat(status: "online" | "draining" = "online") {
    if (stopped && status === "online") return;
    const { activeJobs, lastJobAt } = getStats();
    try {
      await prisma.workerHeartbeat.upsert({
        where: { workerId: WORKER_ID },
        create: { workerId: WORKER_ID, status, activeJobs, queue: QUEUE_NAME, version: VERSION, lastJobAt },
        update: { status, activeJobs, queue: QUEUE_NAME, version: VERSION, lastJobAt },
      });
    } catch (err) {
      // Never let a heartbeat failure take the worker down; just surface it.
      logger.warn({ err: String(err) }, "heartbeat write failed");
    }
  }

  // Emit immediately so the UI flips to "worker online" without waiting a cycle.
  void beat();
  const timer = setInterval(() => void beat(), INTERVAL_MS);
  timer.unref?.();

  logger.info({ workerId: WORKER_ID, intervalMs: INTERVAL_MS }, "heartbeat started");

  return {
    workerId: WORKER_ID,
    /** Mark the worker as draining and stop the timer (called on shutdown). */
    async stop() {
      stopped = true;
      clearInterval(timer);
      await beat("draining");
    },
  };
}
