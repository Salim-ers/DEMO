/**
 * Seed a demo workspace + project + scenario so `pnpm dev` shows a populated UI.
 * Idempotent: safe to run repeatedly.
 */
import { PrismaClient, VoiceMode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "founder@studio-one.dev" },
    update: {},
    create: { email: "founder@studio-one.dev", name: "Demo Founder" },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: "seed_workspace" },
    update: {},
    create: { id: "seed_workspace", name: "Studio One HQ" },
  });

  await prisma.membership.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: {},
    create: { userId: user.id, workspaceId: workspace.id, role: "owner" },
  });

  // Provider rows (disabled until keys are added in Settings).
  for (const kind of ["LLM_ANTHROPIC", "HIGGSFIELD", "ELEVENLABS", "S3"] as const) {
    await prisma.integrationProvider.upsert({
      where: { workspaceId_kind: { workspaceId: workspace.id, kind } },
      update: {},
      create: { workspaceId: workspace.id, kind, enabled: kind === "S3" },
    });
  }

  const project = await prisma.project.upsert({
    where: { id: "seed_project" },
    update: {},
    create: {
      id: "seed_project",
      workspaceId: workspace.id,
      productName: "Northwind CRM",
      url: "https://app.northwind.example",
      targetAudience: "RevOps leaders at 50–500 person B2B SaaS companies",
      mainPromise: "See which accounts to act on first — without digging through tabs.",
      durationSeconds: 60,
      format: "16:9",
      language: "en",
      tone: "sales",
      voiceMode: VoiceMode.SCRIPT_ONLY,
      status: "draft",
    },
  });

  await prisma.demoScenario.upsert({
    where: { id: "seed_scenario" },
    update: {},
    create: {
      id: "seed_scenario",
      projectId: project.id,
      raw: "Show the dashboard first, then create a customer, then open analytics, and finish on the ROI summary.",
      steps: [
        { intent: "open dashboard", urlHint: "/dashboard" },
        { intent: "create a customer", actionHints: ["click New customer", "fill name", "save"] },
        { intent: "show analytics", urlHint: "/analytics" },
        { intent: "show ROI summary", urlHint: "/reports/roi" },
      ],
    },
  });

  console.log("✓ Seeded workspace, project and scenario.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
