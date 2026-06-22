import { NextResponse } from "next/server";
import type { JobState } from "@demoforge/shared";
import { prisma } from "@demoforge/db";

export const runtime = "nodejs";

/** Lightweight polling endpoint for the live pipeline timeline. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.renderJob.findFirst({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
  });
  if (!job) return NextResponse.json({ status: "none", progress: 0, stages: [] });

  return NextResponse.json({
    status: job.status.toLowerCase(),
    progress: job.progress,
    stages: (job.stages as unknown as JobState[]) ?? [],
    error: job.error ?? null,
  });
}
