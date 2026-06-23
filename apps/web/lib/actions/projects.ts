"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@demoforge/db";
import { getActiveWorkspaceId } from "../workspace.js";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

/** Ensure the project exists and belongs to the active workspace before mutating. */
async function authorize(id: string) {
  const workspaceId = await getActiveWorkspaceId();
  const project = await prisma.project.findUnique({
    where: { id },
    select: { id: true, workspaceId: true, productName: true },
  });
  if (!project || project.workspaceId !== workspaceId) return null;
  return { workspaceId, project };
}

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/exports");
  revalidatePath("/quality");
}

/** Permanently delete a project. Cascades to scenes, captures, renders, assets. */
export async function deleteProject(id: string): Promise<ActionResult> {
  const auth = await authorize(id);
  if (!auth) return { ok: false, error: "Projet introuvable" };
  try {
    await prisma.project.delete({ where: { id } });
    await prisma.auditLog.create({
      data: { workspaceId: auth.workspaceId, action: "project.delete", meta: { productName: auth.project.productName } },
    });
    revalidateAll();
    return { ok: true };
  } catch {
    return { ok: false, error: "La suppression a échoué" };
  }
}

/** Rename a project (its product name). */
export async function renameProject(id: string, name: string): Promise<ActionResult> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return { ok: false, error: "Le nom est trop court" };
  const auth = await authorize(id);
  if (!auth) return { ok: false, error: "Projet introuvable" };
  await prisma.project.update({ where: { id }, data: { productName: trimmed } });
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${id}`);
  return { ok: true };
}

/** Clone a project's brief into a fresh draft (no captures/renders carried over). */
export async function duplicateProject(id: string): Promise<ActionResult> {
  const auth = await authorize(id);
  if (!auth) return { ok: false, error: "Projet introuvable" };
  const src = await prisma.project.findUnique({
    where: { id },
    include: { scenarios: { orderBy: { createdAt: "asc" }, take: 1 } },
  });
  if (!src) return { ok: false, error: "Projet introuvable" };

  const copy = await prisma.project.create({
    data: {
      workspaceId: src.workspaceId,
      productName: `${src.productName} (copie)`,
      url: src.url,
      targetAudience: src.targetAudience,
      mainPromise: src.mainPromise,
      durationSeconds: src.durationSeconds,
      format: src.format,
      language: src.language,
      tone: src.tone,
      voiceMode: src.voiceMode,
      videoStyle: src.videoStyle,
      referenceUrl: src.referenceUrl,
      status: "draft",
      scenarios: src.scenarios[0] ? { create: { raw: src.scenarios[0].raw, steps: [] } } : undefined,
    },
  });
  await prisma.auditLog.create({
    data: { workspaceId: auth.workspaceId, projectId: copy.id, action: "project.duplicate", meta: { from: id } },
  });
  revalidateAll();
  return { ok: true, id: copy.id };
}

/** Archive / unarchive a project (soft hide from the default list). */
export async function setArchived(id: string, archived: boolean): Promise<ActionResult> {
  const auth = await authorize(id);
  if (!auth) return { ok: false, error: "Projet introuvable" };
  await prisma.project.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } });
  revalidateAll();
  return { ok: true };
}
