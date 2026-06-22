import { NextResponse } from "next/server";
import type { JobState } from "@demoforge/shared";
import { prisma } from "@demoforge/db";

export const runtime = "nodejs";

// A worker beats every 30s; treat it as offline after ~3 missed beats.
const WORKER_STALE_MS = 95_000;

/** True if any worker has sent a heartbeat recently enough to be processing jobs. */
async function isWorkerOnline(): Promise<{ online: boolean; lastSeen: string | null }> {
  const hb = await prisma.workerHeartbeat.findFirst({ orderBy: { lastSeenAt: "desc" } });
  if (!hb) return { online: false, lastSeen: null };
  const online = hb.status === "online" && Date.now() - hb.lastSeenAt.getTime() < WORKER_STALE_MS;
  return { online, lastSeen: hb.lastSeenAt.toISOString() };
}

/** Lightweight polling endpoint for the live pipeline timeline. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, worker] = await Promise.all([
    prisma.renderJob.findFirst({ where: { projectId: id }, orderBy: { createdAt: "desc" } }),
    isWorkerOnline(),
  ]);
  if (!job) {
    return NextResponse.json({ status: "none", progress: 0, stages: [], workerOnline: worker.online });
  }

  return NextResponse.json({
    status: job.status.toLowerCase(),
    progress: job.progress,
    stages: (job.stages as unknown as JobState[]) ?? [],
    error: job.error ?? null,
    workerOnline: worker.online,
    workerLastSeen: worker.lastSeen,
  });
}
