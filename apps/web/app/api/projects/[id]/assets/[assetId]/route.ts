import { NextResponse } from "next/server";
import { prisma, AssetKind } from "@demoforge/db";
import { getStorage } from "@demoforge/integrations";

export const runtime = "nodejs";

/** Remove one uploaded image (storage object + Asset row). */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; assetId: string }> }) {
  const { id, assetId } = await params;
  const asset = await prisma.asset.findFirst({
    where: { id: assetId, projectId: id, kind: AssetKind.UPLOAD },
  });
  if (!asset) return NextResponse.json({ error: "Visuel introuvable" }, { status: 404 });

  await getStorage().delete(asset.storageKey).catch(() => {});
  await prisma.asset.delete({ where: { id: asset.id } });
  return NextResponse.json({ ok: true });
}
