"use client";
import { useEffect, useRef, useState } from "react";
import { Check, X, Loader2, Circle, Minus, AlertTriangle } from "lucide-react";
import type { JobState, JobName } from "@demoforge/shared";
import { cn } from "../lib/cn.js";

const STAGE_LABEL: Record<JobName, string> = {
  analyzeProject: "Analyser le projet",
  captureWebsite: "Capturer les vrais écrans",
  generateStoryboard: "Construire le storyboard",
  generateVoiceScript: "Écrire la voix off",
  generateCaptions: "Générer les sous-titres",
  renderVideo: "Rendre la vidéo",
  exportAssets: "Exporter les fichiers",
};
const STAGE_HINT: Record<JobName, string> = {
  analyzeProject: "Découpe de votre scénario en étapes",
  captureWebsite: "Pilotage d'un navigateur headless, capture de chaque étape",
  generateStoryboard: "Séquençage d'un arc accroche → produit → preuve",
  generateVoiceScript: "Synchronisation de la narration sur chaque scène",
  generateCaptions: "Génération des sous-titres en SRT + VTT",
  renderVideo: "Composition dans Remotion, encodage H.264",
  exportAssets: "Regroupement MP4, storyboard, script & sous-titres",
};

interface StatusResponse {
  status: "queued" | "running" | "succeeded" | "failed" | string;
  progress: number;
  stages: JobState[];
  workerOnline?: boolean;
}

export function PipelineTimeline({
  projectId,
  renderJobId,
  initial,
}: {
  projectId: string;
  renderJobId: string | null;
  initial: StatusResponse | null;
}) {
  const [state, setState] = useState<StatusResponse | null>(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!renderJobId) return;
    let alive = true;

    async function poll() {
      try {
        const res = await fetch(`/api/projects/${projectId}/status`, { cache: "no-store" });
        if (res.ok && alive) {
          const data = (await res.json()) as StatusResponse;
          setState(data);
          if (data.status === "succeeded" || data.status === "failed") return; // stop polling
        }
      } catch {
        /* transient — keep polling */
      }
      if (alive) timer.current = setTimeout(poll, 2500);
    }

    poll();
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [projectId, renderJobId]);

  if (!renderJobId || !state) {
    return (
      <div className="card p-6">
        <p className="text-sm text-muted">Aucun rendu pour l'instant. Lancez le pipeline pour capturer et générer cette démo.</p>
      </div>
    );
  }

  const stages = state.stages;
  const activeIndex = stages.findIndex((s) => s.status === "running");
  // The job is waiting/processing but no worker has sent a recent heartbeat —
  // it will sit here forever until a worker is deployed (see apps/worker).
  const workerMissing =
    state.workerOnline === false && (state.status === "queued" || state.status === "running");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <div className="flex items-center gap-2.5">
          <span className="eyebrow">Pipeline de rendu</span>
          <StatusPill status={state.status} />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted">{state.progress}%</span>
      </div>

      {workerMissing && (
        <div className="flex items-start gap-3 border-b border-bad/30 bg-bad/10 px-6 py-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-bad" />
          <div className="text-sm leading-relaxed">
            <p className="font-medium text-bad">Aucun worker actif</p>
            <p className="mt-0.5 text-muted">
              Le job est en file d'attente mais aucun worker ne tourne pour l'exécuter, donc rien ne se passe. Déploie le
              worker (<span className="font-mono text-xs">apps/worker</span>) sur Railway/Render et vérifie qu'il partage
              le même <span className="font-mono text-xs">REDIS_URL</span> que Vercel.
            </p>
          </div>
        </div>
      )}

      {/* progress rail */}
      <div className="h-0.5 w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-accent/70 to-accent transition-all duration-700"
          style={{ width: `${state.progress}%` }}
        />
      </div>

      <ol className="relative px-6 py-5">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          const name = stage.name as JobName;
          return (
            <li key={stage.name} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={cn(
                    "absolute left-[13px] top-7 h-[calc(100%-12px)] w-px",
                    stage.status === "succeeded" ? "bg-accent/40" : "bg-hairline",
                  )}
                />
              )}
              <StageNode status={stage.status} />
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      stage.status === "queued" ? "text-faint" : "text-ink",
                      i === activeIndex && "text-accent",
                    )}
                  >
                    {STAGE_LABEL[name] ?? stage.name}
                  </p>
                  {stage.status === "running" && (
                    <span className="font-mono text-[11px] text-accent">en cours…</span>
                  )}
                  {stage.status === "skipped" && <span className="font-mono text-[11px] text-faint">ignoré</span>}
                </div>
                <p className="mt-0.5 truncate text-xs text-faint">
                  {stage.error ? <span className="text-bad">{stage.error}</span> : STAGE_HINT[name]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StageNode({ status }: { status: JobState["status"] }) {
  const base = "relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border";
  if (status === "succeeded")
    return (
      <span className={cn(base, "border-accent bg-accent text-white")}>
        <Check size={14} strokeWidth={3} />
      </span>
    );
  if (status === "failed")
    return (
      <span className={cn(base, "border-bad bg-bad/15 text-bad")}>
        <X size={14} strokeWidth={3} />
      </span>
    );
  if (status === "running")
    return (
      <span className={cn(base, "border-accent text-accent")}>
        <span className="absolute inset-0 rounded-full border border-accent animate-pulse-ring" />
        <Loader2 size={14} className="animate-spin" />
      </span>
    );
  if (status === "skipped")
    return (
      <span className={cn(base, "border-hairline text-faint")}>
        <Minus size={14} />
      </span>
    );
  return (
    <span className={cn(base, "border-hairline text-faint")}>
      <Circle size={8} className="fill-faint" />
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    queued: "text-muted",
    running: "text-accent",
    succeeded: "text-ok",
    failed: "text-bad",
  };
  const label: Record<string, string> = {
    queued: "En attente",
    running: "En cours",
    succeeded: "Terminé",
    failed: "Échec",
  };
  return <span className={cn("text-xs font-medium", map[status] ?? "text-muted")}>{label[status] ?? status}</span>;
}
