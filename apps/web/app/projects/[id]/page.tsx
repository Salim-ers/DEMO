import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import type { JobState } from "@studio-one/shared";
import { prisma } from "../../../lib/db.js";
import { signed } from "../../../lib/storage.js";
import { StatusBadge } from "../../../components/ui/status-badge.js";
import { GenerateButton } from "../../../components/generate-button.js";
import { PipelineTimeline } from "../../../components/pipeline-timeline.js";
import { StoryboardPreview, type PreviewScene } from "../../../components/storyboard-preview.js";
import { DownloadCenter, type DownloadItem } from "../../../components/download-center.js";
import { UserImagesPanel, type UploadedImage } from "../../../components/user-images-panel.js";
import { AssetKind } from "@studio-one/db";

export const dynamic = "force-dynamic";

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

  const loginAudit = await prisma.auditLog.findFirst({
    where: { projectId: project.id, action: "capture.login" },
    orderBy: { createdAt: "desc" },
  });
  const loginMeta = (loginAudit?.meta as { status?: string; reason?: string } | null) ?? null;

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
      <Link href="/projects" className="mb-7 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft size={16} /> Retour à mes démos
      </Link>

      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">{project.productName}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-faint">{host}</p>
        </div>
        <GenerateButton projectId={project.id} hasRun={Boolean(renderJob)} />
      </header>

      {project.status === "failed" && (
        <div className="mb-6 rounded-xl border border-bad/30 bg-bad/10 px-5 py-4">
          <p className="text-sm font-semibold text-bad">La génération n’a pas pu aller au bout</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Vérifiez l’URL et les accès du compte de démonstration, puis relancez. Si la vidéo est trop lourde, réduisez
            la durée ou choisissez un format optimisé.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/new" className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent/40">
              Réduire la durée
            </Link>
            <a href="mailto:support@studio-one.app" className="rounded-lg border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent/40">
              Contacter le support
            </a>
          </div>
        </div>
      )}

      {loginMeta && <LoginBanner status={loginMeta.status} reason={loginMeta.reason} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-6">
          <VideoPanel url={videoUrl} format={project.format} />
          <PipelineTimeline projectId={project.id} renderJobId={renderJob?.id ?? null} initial={initialStatus} />
          <StoryboardPreview scenes={scenes} source={project.storyboard?.source} />
          <VoiceScriptPanel text={project.voiceScript?.fullText ?? null} />
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
          <div id="quality" className="scroll-mt-24">
            <QualityReportPanel report={(renderJob?.qualityReport as QReport | null) ?? null} />
          </div>
          <UserImagesPanel projectId={project.id} initial={uploads} />
          <DownloadCenter items={downloads} />
        </div>
      </div>
    </div>
  );
}

/** Tells the user whether the capture actually logged into their app. */
function LoginBanner({ status, reason }: { status?: string; reason?: string }) {
  if (status === "logged_in") {
    return (
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-ok/30 bg-ok/10 px-4 py-3 text-sm text-ok">
        <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
        <span>Connecté à votre application — la démo filme l'outil, pas seulement le site public.</span>
      </div>
    );
  }
  if (status === "no_credentials") {
    return (
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-muted">
        <Info size={17} className="mt-0.5 shrink-0 text-faint" />
        <span>La démo filme votre site public. Ajoutez vos identifiants au projet pour filmer l'outil connecté.</span>
      </div>
    );
  }
  // attempted but not logged in (failed / manual_step_required / key mismatch)
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
      <AlertTriangle size={17} className="mt-0.5 shrink-0" />
      <span>
        Connexion à votre application impossible{reason ? ` (${reason})` : ""}. La démo montre donc le site public.
        Vérifiez que <span className="font-mono text-xs">LOCAL_SECRET_ENCRYPTION_KEY</span> est <strong>identique</strong> sur
        Vercel et Railway, puis relancez le pipeline.
      </span>
    </div>
  );
}

/** Voice-over script ready to record. */
function VoiceScriptPanel({ text }: { text: string | null }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-hairline px-6 py-4">
        <span className="eyebrow">Script voix off</span>
      </div>
      <div className="px-6 py-4">
        {text && text.trim().length > 0 ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{text}</p>
        ) : (
          <p className="text-sm text-faint">Le script voix off sera disponible après la génération.</p>
        )}
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

interface QCheck { id: string; label: string; status: "pass" | "warn" | "fail"; detail: string }
interface QReport {
  resolution: string; fps: number; videoCodec: string; bitrateMbps: number;
  audioCodec: string | null; audioBitrateKbps: number | null; durationSec: number; fileMb: number;
  screenshotCount: number; motionSceneCount: number; calloutCount: number; voiceMode: string;
  score: number; checks: QCheck[]; recommendations: string[];
}

/** Post-render quality report: score, automated checks and recommendations. */
function QualityReportPanel({ report }: { report: QReport | null }) {
  if (!report) return null;
  const dot = (s: QCheck["status"]) => (s === "pass" ? "bg-ok" : s === "warn" ? "bg-yellow-400" : "bg-bad");
  const hasFail = report.checks.some((c) => c.status === "fail");
  const hasWarn = report.checks.some((c) => c.status === "warn");
  // Keep the headline score coherent with the checks: a failing premium criterion
  // (e.g. video bitrate) must not coexist with a 90+ score.
  const displayScore = hasFail ? Math.min(report.score, 70) : hasWarn ? Math.min(report.score, 84) : report.score;
  const scoreTone = displayScore >= 85 ? "text-ok" : displayScore >= 65 ? "text-yellow-400" : "text-bad";
  const metrics: Array<[string, string]> = [
    ["Résolution", report.resolution],
    ["Débit", `${report.bitrateMbps} Mbps`],
    ["Codec", report.videoCodec.toUpperCase()],
    ["FPS", String(report.fps)],
    ["Audio", report.audioCodec ? `${report.audioCodec.toUpperCase()} ${report.audioBitrateKbps ?? "?"}k` : "—"],
    ["Durée", `${report.durationSec}s`],
    ["Taille", `${report.fileMb} Mo`],
    ["Scènes motion", String(report.motionSceneCount)],
    ["Callouts", String(report.calloutCount)],
  ];
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-hairline px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Qualité vidéo</span>
          <span className={`text-lg font-semibold tabular-nums ${scoreTone}`}>{displayScore}/100</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {hasFail
            ? "Qualité vidéo : exploitable, quelques points à optimiser pour un rendu premium."
            : "Qualité vidéo : prête pour landing page, sales deck et réseaux sociaux."}
        </p>
      </div>
      <details>
        <summary className="cursor-pointer list-none px-6 py-3 text-[10px] font-medium uppercase tracking-wide text-faint transition-colors hover:text-muted">
          Détails techniques
        </summary>
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 px-6 pb-4">
          {metrics.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <div className="text-[10px] font-medium uppercase tracking-wide text-faint">{k}</div>
              <div className="truncate text-sm text-ink">{v}</div>
            </div>
          ))}
        </div>
        <ul className="divide-y divide-hairline border-t border-hairline">
          {report.checks.map((c) => (
            <li key={c.id} className="flex items-center gap-3 px-6 py-2.5">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dot(c.status)}`} />
              <span className="flex-1 text-sm text-ink">{c.label}</span>
              <span className="font-mono text-xs text-faint">{c.detail}</span>
            </li>
          ))}
        </ul>
      </details>
      {report.recommendations.length > 0 && (
        <div className="border-t border-hairline px-6 py-4">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-faint">Recommandations</div>
          <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
            {report.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
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
