import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, ProviderKind } from "@demoforge/db";
import { getVault } from "@demoforge/integrations";
import { getActiveWorkspaceId } from "../../../../lib/workspace.js";

export const runtime = "nodejs";

export async function GET() {
  const workspaceId = await getActiveWorkspaceId();
  const providers = await prisma.integrationProvider.findMany({
    where: { workspaceId },
    select: { kind: true, enabled: true, secretRef: true, baseUrl: true },
  });
  return NextResponse.json({
    providers: providers.map((p) => ({ kind: p.kind, enabled: p.enabled, hasSecret: Boolean(p.secretRef), baseUrl: p.baseUrl })),
  });
}

const postSchema = z.object({
  kind: z.nativeEnum(ProviderKind),
  apiKey: z.string().optional().default(""),
  enabled: z.boolean().optional().default(true),
  baseUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  let input: z.infer<typeof postSchema>;
  try {
    input = postSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid provider payload", detail: String(err) }, { status: 400 });
  }
  const workspaceId = await getActiveWorkspaceId();

  // Store the API key in the vault; persist only the opaque ref.
  let secretRef: string | undefined;
  if (input.apiKey.trim()) {
    secretRef = await getVault().store(input.apiKey.trim());
  }

  const provider = await prisma.integrationProvider.upsert({
    where: { workspaceId_kind: { workspaceId, kind: input.kind } },
    create: { workspaceId, kind: input.kind, enabled: input.enabled, secretRef, baseUrl: input.baseUrl },
    update: { enabled: input.enabled, ...(secretRef ? { secretRef } : {}), ...(input.baseUrl ? { baseUrl: input.baseUrl } : {}) },
  });

  await prisma.auditLog.create({
    data: { workspaceId, action: "provider.update", meta: { kind: input.kind, enabled: provider.enabled } },
  });

  return NextResponse.json({ ok: true, kind: provider.kind, enabled: provider.enabled, hasSecret: Boolean(provider.secretRef) });
}
