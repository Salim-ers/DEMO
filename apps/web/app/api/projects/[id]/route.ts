import { NextResponse } from "next/server";
import { prisma } from "@demoforge/db";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      storyboard: { include: { scenes: { orderBy: { order: "asc" } } } },
      renderJobs: { orderBy: { createdAt: "desc" }, take: 1 },
      exports: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}
