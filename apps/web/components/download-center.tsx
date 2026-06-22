import { FileVideo, FileJson, FileText, Captions, Archive, Download } from "lucide-react";

export interface DownloadItem {
  label: string;
  sublabel: string;
  href: string | null;
  kind: "video" | "json" | "md" | "srt" | "vtt" | "zip";
}

const ICONS = {
  video: FileVideo,
  json: FileJson,
  md: FileText,
  srt: Captions,
  vtt: Captions,
  zip: Archive,
} as const;

export function DownloadCenter({ items }: { items: DownloadItem[] }) {
  const available = items.some((i) => i.href);
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-hairline px-6 py-4">
        <span className="eyebrow">Downloads</span>
      </div>
      {!available ? (
        <div className="px-6 py-6">
          <p className="text-sm text-muted">Deliverables show up here when the export stage finishes.</p>
        </div>
      ) : (
        <ul className="divide-y divide-hairline">
          {items.map((item) => {
            const Icon = ICONS[item.kind];
            const disabled = !item.href;
            return (
              <li key={item.label}>
                <a
                  href={item.href ?? undefined}
                  download
                  aria-disabled={disabled}
                  className={`flex items-center gap-3.5 px-6 py-3.5 transition-colors ${
                    disabled ? "pointer-events-none opacity-40" : "hover:bg-white/5"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-elevated">
                    <Icon size={16} className="text-muted" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="font-mono text-[11px] text-faint">{item.sublabel}</p>
                  </div>
                  {!disabled && <Download size={16} className="text-faint" />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
