import { prisma } from "@demoforge/db";
import { parseScenario } from "@demoforge/capture";
import type { ScenarioStep } from "@demoforge/shared";
import type { PipelineCtx } from "../pipeline.js";

/**
 * Stage 1 — analyzeProject.
 * Validates the project, makes sure a structured scenario exists (parsing the
 * natural-language description into steps if needed), and records an audit entry.
 * Idempotent: re-parsing the same scenario yields the same steps.
 */
export async function analyzeProject(ctx: PipelineCtx): Promise<{ steps: ScenarioStep[] }> {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: ctx.projectId } });

  const scenario = await prisma.demoScenario.findFirst({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  });
  if (!scenario) throw new Error("No demo scenario attached to project");

  let steps = (scenario.steps as unknown as ScenarioStep[]) ?? [];
  if (!Array.isArray(steps) || steps.length === 0) {
    const parsed = await parseScenario(scenario.raw);
    steps = parsed.steps;
    await prisma.demoScenario.update({
      where: { id: scenario.id },
      data: { steps: steps as unknown as object },
    });
  }

  await prisma.auditLog.create({
    data: { projectId: project.id, action: "pipeline.analyze", meta: { steps: steps.length } },
  });

  ctx.log.info({ steps: steps.length }, "analyzeProject complete");
  return { steps };
}
