import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, VoiceMode } from "@demoforge/db";
import { createProjectSchema } from "@demoforge/shared";
import { getVault, maskEmail } from "@demoforge/integrations";
import { getActiveWorkspaceId } from "../../../lib/workspace.js";

export const runtime = "nodejs";

const bodySchema = createProjectSchema.extend({
  loginUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  scenario: z.string().min(8),
  consent: z.boolean().optional(),
});

const VOICE_MODE_DB: Record<string, VoiceMode> = {
  script_only: VoiceMode.SCRIPT_ONLY,
  uploaded_human_voice: VoiceMode.UPLOADED_HUMAN_VOICE,
  tts_provider: VoiceMode.TTS_PROVIDER,
};

export async function POST(req: Request) {
  let input: z.infer<typeof bodySchema>;
  try {
    input = bodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Données du projet invalides", detail: String(err) }, { status: 400 });
  }

  const workspaceId = await getActiveWorkspaceId();

  const project = await prisma.project.create({
    data: {
      workspaceId,
      productName: input.productName,
      url: input.url,
      targetAudience: input.targetAudience,
      mainPromise: input.mainPromise,
      durationSeconds: input.durationSeconds,
      format: input.format,
      language: input.language,
      tone: input.tone,
      voiceMode: VOICE_MODE_DB[input.voiceMode] ?? VoiceMode.SCRIPT_ONLY,
      status: "draft",
      scenarios: {
        create: { raw: input.scenario, steps: [] }, // parsed into steps by the worker
      },
    },
  });

  // Store credentials in the vault — only an opaque ref is persisted.
  if (input.email && input.password) {
    const ref = await getVault().store(JSON.stringify({ email: input.email, password: input.password }));
    await prisma.credentialVaultRef.create({
      data: {
        projectId: project.id,
        vault: "local",
        ref,
        loginUrl: input.loginUrl || null,
        emailHint: maskEmail(input.email) ?? null,
      },
    });
  }

  // Pre-seed the consent flag for TTS so the worker honors it.
  if (input.voiceMode === "tts_provider") {
    await prisma.voiceScript.upsert({
      where: { projectId: project.id },
      create: {
        projectId: project.id,
        mode: VoiceMode.TTS_PROVIDER,
        language: input.language,
        fullText: "",
        lines: [],
        consentConfirmed: Boolean(input.consent),
      },
      update: { consentConfirmed: Boolean(input.consent) },
    });
  }

  await prisma.auditLog.create({ data: { workspaceId, projectId: project.id, action: "project.create", meta: {} } });

  return NextResponse.json({ id: project.id }, { status: 201 });
}

export async function GET() {
  const workspaceId = await getActiveWorkspaceId();
  const projects = await prisma.project.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, productName: true, url: true, mainPromise: true, format: true, status: true, updatedAt: true },
  });
  return NextResponse.json({ projects });
}
