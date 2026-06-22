/**
 * Manual enqueue helper: `pnpm --filter @demoforge/worker enqueue <projectId>`.
 * Creates a RenderJob for the project and pushes a pipeline job. Handy for
 * kicking the pipeline without the web app during development.
 */
import { prisma, JobStatus } from "@demoforge/db";
import { enqueuePipeline } from "./queue.js";
import { logger } from "./logger.js";

async function main() {
  const projectId = process.argv[2];
  if (!projectId) {
    logger.error("usage: enqueue <projectId>");
    process.exit(1);
  }
  const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId } });
  const renderJob = await prisma.renderJob.create({
    data: { projectId: project.id, status: JobStatus.QUEUED, format: project.format },
  });
  await enqueuePipeline({ projectId: project.id, renderJobId: renderJob.id });
  logger.info({ projectId: project.id, renderJobId: renderJob.id }, "pipeline enqueued");
  process.exit(0);
}
main().catch((err) => {
  logger.error({ err: String(err) }, "enqueue failed");
  process.exit(1);
});
