import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import type { JobState } from "@demoforge/shared";
import { prisma } from "../../../lib/db.js";
import { signed } from "../../../lib/storage.js";
import { Badge } from "../../../components/ui/badge.js";
import { GenerateButton } from "../../../components/generate-button.js";
import { PipelineTimeline } from "../../../components/pipeline-timeline.js";
import { StoryboardPreview, type PreviewScene } from "../../../components/storyboard-preview.js";
import { DownloadCenter, type DownloadItem } from "../../../components/download-center.js";
import { UserImagesPanel, type UploadedImage } from "../../../components/user-images-panel.js";
import { prettyStatus } from "../../../lib/format.js";
import { AssetKind } from "@demoforge/db";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "neutral" | "accent" | "ok" | "bad"> = {
  draft: "neutral",
  capturing: "accent",
  storyboarding: "accent",
  rendering: "accent",
  ready: "ok",
  failed: "bad",
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      storyboard: { include: { scenes: { orderBy: { order: "asc" } } } },
      renderJobs: { orderBy: { createdAt: "desc" }, take: 1 },
      exports: { orderBy: { createdAt: "desc" }, take: 1 },
      voiceScript: true,
    },
  });
  if (!project) notFound();

  const renderJob = project.renderJobs[0] ?? null;
  const exp = project.exports[0] ?? null;

  let host = project.url;
  try {
    host = new URL(project.url).host;
  } catch {
    /* keep raw */
  }

  const initialStatus = renderJob
    ? {
        status: renderJob.status.toLowerCase(),
        progress: renderJob.progress,
        stages: (renderJob.stages as unknown as JobState[]) ?? [],
      }
    : null;

  const scenes: PreviewScene[] = (project.storyboard?.scenes ?? []).map((s) => ({
    id: s.id,
    order: s.order,
    type: s.type as unknown as string,
    captionText: s.captionText,
    voiceoverText: s.voiceoverText,
    durationMs: s.durationMs,
    cameraMotion: s.cameraMotion,
    hasImage: Boolean(s.sourceAssetId),
  }));

  const [videoUrl, srtUrl, vttUrl, scriptUrl, storyboardUrl, zipUrl] = await Promise.all([
    signed(exp?.videoMp4Key),
    signed(exp?.captionsSrtKey),
    signed(exp?.captionsVttKey),
    signed(exp?.scriptMdKey),
    signed(exp?.storyboardJsonKey),
    signed(exp?.assetsZipKey),
  ]);

  const uploadAssets = await prisma.asset.findMany({
    where: { projectId: project.id, kind: AssetKind.UPLOAD },
    orderBy: { createdAt: "asc" },
  });
  const uploads: UploadedImage[] = await Promise.all(
    uploadAssets.map(async (a) => ({
      id: a.id,
      contentType: a.contentType,
      bytes: a.bytes,
      url: await signed(a.storageKey),
    })),
  );

  const downloads: DownloadItem[] = [
    { label: "Vidéo de démo", sublabel: `demo.mp4 · ${project.format}`, href: videoUrl, kind: "video" },
    { label: "Storyboard", sublabel: "storyboard.json", href: storyboardUrl, kind: "json" },
    { label: "Script de voix off", sublabel: "script.md", href: scriptUrl, kind: "md" },
    { label: "Sous-titres (SRT)", sublabel: "captions.srt", href: srtUrl, kind: "srt" },
    { label: "Sous-titres (VTT)", sublabel: "captions.vtt", href: vttUrl, kind: "vtt" },
    { label: "Tous les fichiers", sublabel: "assets.zip", href: zipUrl, kind: "zip" },
  ];

  return (
    <div>
      <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Retour aux projets
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tighter text-ink">{project.productName}</h1>
            <Badge tone={STATUS_TONE[project.status] ?? "neutral"}>{prettyStatus(project.status)}</Badge>
          </div>
          <p className="font-mono text-sm text-faint">{host}</p>
        </div>
        <GenerateButton projectId={project.id} hasRun={Boolean(renderJob)} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <VideoPanel url={videoUrl} format={project.format} />
          <PipelineTimeline projectId={project.id} renderJobId={renderJob?.id ?? null} initial={initialStatus} />
          <StoryboardPreview scenes={scenes} source={project.storyboard?.source} />
        </div>

        <div className="flex flex-col gap-6">
          <DetailsPanel
            audience={project.targetAudience}
            promise={project.mainPromise}
            duration={project.durationSeconds}
            format={project.format}
            tone={project.tone}
            voiceMode={String(project.voiceScript?.mode ?? project.voiceMode)}
            language={project.language}
          />
          <UserImagesPanel projectId={project.id} initial={uploads} />
          <DownloadCenter items={downloads} />
        </div>
      </div>
    </div>
  );
}

function VideoPanel({ url, format }: { url: string | null; format: string }) {
  const aspect = format === "9:16" ? "aspect-[9/16] max-w-[320px] mx-auto" : format === "1:1" ? "aspect-square" : "aspect-video";
  return (
    <div className="card overflow-hidden">
      {url ? (
        <video controls className={`w-full ${aspect} bg-black`} src={url} />
      ) : (
        <div className={`flex w-full ${aspect} flex-col items-center justify-center gap-3 bg-surface`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-hairline bg-elevated">
            <Film size={20} className="text-faint" />
          </span>
          <p className="text-sm text-muted">Votre démo rendue s'affichera ici</p>
          <p className="font-mono text-[11px] text-faint">Lancez le pipeline pour produire demo.mp4</p>
        </div>
      )}
    </div>
  );
}

function DetailsPanel(props: {
  audience: string;
  promise: string;
  duration: number;
  format: string;
  tone: string;
  voiceMode: string;
  language: string;
}) {
  const rows: Array<[string, string]> = [
    ["Audience", props.audience],
    ["Promesse", props.promise],
    ["Durée", `${props.duration}s`],
    ["Format", props.format],
    ["Ton", props.tone],
    ["Voix", props.voiceMode.toLowerCase().replace(/_/g, " ")],
    ["Langue", props.language],
  ];
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-hairline px-6 py-4">
        <span className="eyebrow">Brief</span>
      </div>
      <dl className="divide-y divide-hairline">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-4 px-6 py-3">
            <dt className="w-24 shrink-0 text-xs font-medium uppercase tracking-wide text-faint">{k}</dt>
            <dd className="min-w-0 flex-1 text-sm text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
