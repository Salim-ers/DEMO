import { NextResponse } from "next/server";
import { prisma, JobStatus } from "@demoforge/db";
import { enqueuePipeline } from "../../../../../lib/queue.js";

export const runtime = "nodejs";

/** Create a fresh RenderJob and enqueue the full pipeline for it. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const renderJob = await prisma.renderJob.create({
    data: { projectId: project.id, status: JobStatus.QUEUED, format: project.format },
  });

  try {
    await enqueuePipeline({ projectId: project.id, renderJobId: renderJob.id });
  } catch (err) {
    // Redis unavailable: keep the job queued and surface the issue rather than 500-ing the UI.
    return NextResponse.json(
      { renderJobId: renderJob.id, queued: false, error: "Queue unavailable — is Redis running?" },
      { status: 202 },
    );
  }

  await prisma.project.update({ where: { id: project.id }, data: { status: "capturing" } });
  return NextResponse.json({ renderJobId: renderJob.id, queued: true }, { status: 201 });
}
