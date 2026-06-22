import "server-only";
import { prisma } from "@demoforge/db";

/**
 * Resolve a workspace to operate in. Auth.js is wired in the schema (User /
 * Membership / Workspace); until a session provider is connected, the MVP
 * resolves or creates a single default workspace so the app is fully usable.
 */
export async function getActiveWorkspaceId(): Promise<string> {
  const existing = await prisma.workspace.findFirst({ orderBy: { createdAt: "asc" } });
  if (existing) return existing.id;
  const created = await prisma.workspace.create({ data: { name: "DemoForge HQ" } });
  return created.id;
}
