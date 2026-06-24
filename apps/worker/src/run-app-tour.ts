import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env") });
import { prisma, JobStatus } from "@studio-one/db";
import { getVault } from "@studio-one/integrations";
import { runPipeline } from "./pipeline.js";

const projectId = process.argv[2];
if (!projectId) {
  console.error("usage: tsx src/run-app-tour.ts <projectId>");
  process.exit(1);
}
const email = process.env.DF_EMAIL ?? "";
const password = process.env.DF_PASS ?? "";
const cr = await prisma.credentialVaultRef.findUnique({ where: { projectId } });
const originalRef = cr?.ref ?? null;
const localRef = await getVault().store(JSON.stringify({ email, password }));
await prisma.credentialVaultRef.update({ where: { projectId }, data: { ref: localRef } });
const job = await prisma.renderJob.create({ data: { projectId, status: JobStatus.QUEUED, format: (await prisma.project.findUniqueOrThrow({ where: { id: projectId } })).format } });
try { await runPipeline({ projectId, renderJobId: job.id }); console.log("=== PIPELINE OK ==="); }
catch (err) { console.error("=== FAILED ===", err); }
finally { if (originalRef) await prisma.credentialVaultRef.update({ where: { projectId }, data: { ref: originalRef } }); }
const out = await prisma.asset.findFirst({ where: { projectId, kind: "RENDER_OUTPUT" }, orderBy: { createdAt: "desc" } });
const vs = await prisma.voiceScript.findUnique({ where: { projectId } });
console.log("DELIVERED:", out?.bytes ? (out.bytes / 1e6).toFixed(1) + "MB" : "n/a", "| audioAssetId:", vs?.audioAssetId ?? "NULL");
await prisma.$disconnect();
