import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma, AssetKind } from "@studio-one/db";
import { getStorage } from "@studio-one/integrations";
import { signed } from "../../../../../lib/storage.js";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB per image
const EXT: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
};

/** Upload one or more user images (photos/screenshots) to weave into the demo. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide (multipart attendu)" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

  const storage = getStorage();
  const created: Array<{ id: string }> = [];
  for (const file of files) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Type non supporté : ${file.type || "inconnu"}` }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `${file.name} dépasse 12 Mo` }, { status: 413 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${project.id}/${randomUUID()}.${EXT[file.type] ?? "img"}`;
    const { bytes } = await storage.put(key, buf, file.type);
    const asset = await prisma.asset.create({
      data: { projectId: project.id, kind: AssetKind.UPLOAD, storageKey: key, contentType: file.type, bytes },
    });
    created.push({ id: asset.id });
  }

  await prisma.auditLog.create({
    data: { projectId: project.id, action: "assets.upload", meta: { count: created.length } },
  });

  return NextResponse.json({ uploaded: created.length, assets: await listUploads(project.id) }, { status: 201 });
}

/** List the project's uploaded images with signed preview URLs. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ assets: await listUploads(id) });
}

async function listUploads(projectId: string) {
  const uploads = await prisma.asset.findMany({
    where: { projectId, kind: AssetKind.UPLOAD },
    orderBy: { createdAt: "asc" },
  });
  return Promise.all(
    uploads.map(async (a) => ({
      id: a.id,
      contentType: a.contentType,
      bytes: a.bytes,
      url: await signed(a.storageKey, 3600),
    })),
  );
}
