import { Badge } from "./ui/badge.js";

export interface PreviewScene {
  id: string;
  order: number;
  type: string;
  captionText: string;
  voiceoverText: string;
  durationMs: number;
  cameraMotion: string;
  hasImage: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  TITLE_CARD: "Title",
  BENEFIT_CARD: "Statement",
  SCREEN_CAPTURE: "Screen",
  ZOOM: "Zoom",
  TRANSITION: "Transition",
  HIGGSFIELD_BROLL: "B-roll",
  OUTRO: "Outro",
};

export function StoryboardPreview({ scenes, source }: { scenes: PreviewScene[]; source?: string }) {
  if (scenes.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-sm text-muted">The storyboard appears here once the pipeline reaches that stage.</p>
      </div>
    );
  }
  const total = scenes.reduce((a, s) => a + s.durationMs, 0);
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Storyboard · {scenes.length} scenes</span>
        <span className="font-mono text-xs text-muted">
          {source ? `${source} · ` : ""}
          {(total / 1000).toFixed(1)}s
        </span>
      </div>
      <ol className="divide-y divide-hairline">
        {scenes.map((s) => (
          <li key={s.id} className="flex gap-4 px-6 py-4">
            <span className="mt-0.5 font-mono text-xs text-faint tabular-nums">{String(s.order + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge tone={s.type === "SCREEN_CAPTURE" || s.type === "ZOOM" ? "accent" : "neutral"}>
                  {TYPE_LABEL[s.type] ?? s.type}
                </Badge>
                {s.hasImage && <span className="font-mono text-[10px] uppercase tracking-wide text-ok">real capture</span>}
                <span className="font-mono text-[11px] text-faint">{(s.durationMs / 1000).toFixed(1)}s</span>
                {s.cameraMotion !== "none" && (
                  <span className="font-mono text-[11px] text-faint">{s.cameraMotion.replace(/_/g, " ")}</span>
                )}
              </div>
              <p className="truncate text-sm text-ink">{s.captionText || s.voiceoverText}</p>
              {s.voiceoverText && s.voiceoverText !== s.captionText && (
                <p className="mt-0.5 line-clamp-1 text-xs text-faint">{s.voiceoverText}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
