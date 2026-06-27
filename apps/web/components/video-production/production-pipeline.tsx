import { Check, Loader2, AlertTriangle, Minus } from "lucide-react";
import type { EngineId, EngineStageStatus, ProductionStage } from "../../types/video-engine.js";

const ENGINE_LABEL: Record<EngineId, string> = {
  studio: "Studio One",
  higgsfield: "Higgsfield",
  elevenlabs: "ElevenLabs",
  remotion: "Remotion",
};

function StatusIcon({ status }: { status: EngineStageStatus }) {
  if (status === "ready") return <Check size={13} className="text-ok" />;
  if (status === "failed") return <AlertTriangle size={13} className="text-bad" />;
  if (status === "generating") return <Loader2 size={13} className="animate-spin text-processing" />;
  if (status === "skipped") return <Minus size={13} className="text-faint" />;
  return <span className="h-1.5 w-1.5 rounded-full bg-faint/60" />;
}

const STATUS_LABEL: Record<EngineStageStatus, string> = {
  ready: "Terminé",
  generating: "En cours",
  queued: "En attente",
  failed: "Action requise",
  skipped: "Non utilisé",
};

/**
 * The production pipeline view: the seven stages of the Studio One engine, with
 * the internal engine (Higgsfield / ElevenLabs / Remotion) credited per stage.
 * Presentational — driven by `productionStages()` from lib/video.
 */
export function ProductionPipeline({ stages }: { stages: ProductionStage[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Pipeline de production</span>
        <span className="timecode text-[11px] text-faint">{stages.filter((s) => s.status === "ready").length}/{stages.length}</span>
      </div>
      <ol className="relative px-6 py-5">
        <span aria-hidden className="absolute left-[1.85rem] top-7 bottom-7 w-px bg-hairline" />
        {stages.map((s) => (
          <li key={s.key} className="relative flex gap-4 py-2.5">
            <span className="z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-hairline bg-canvas-soft">
              <StatusIcon status={s.status} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-medium ${s.status === "queued" ? "text-faint" : "text-ink"}`}>{s.label}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{ENGINE_LABEL[s.engine]}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.detail}</p>
              <span
                className={`mt-1 inline-block text-[11px] ${
                  s.status === "ready"
                    ? "text-ok"
                    : s.status === "generating"
                      ? "text-processing"
                      : s.status === "failed"
                        ? "text-bad"
                        : "text-faint"
                }`}
              >
                {STATUS_LABEL[s.status]}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
