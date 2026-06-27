"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, Images } from "lucide-react";

export interface UploadedImage {
  id: string;
  url: string | null;
  contentType: string;
  bytes: number | null;
}

/**
 * Lets the user add their own photos / screenshots to a project. Uploaded images
 * are woven into the demo as full product scenes on the next generation — handy
 * when the live site is behind a login, or to feature specific shots.
 */
export function UserImagesPanel({ projectId, initial }: { projectId: string; initial: UploadedImage[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      Array.from(files).forEach((f) => body.append("files", f));
      const res = await fetch(`/api/projects/${projectId}/assets`, { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? `Échec de l'envoi (${res.status})`);
      setImages(data.assets ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove(assetId: string) {
    setImages((xs) => xs.filter((x) => x.id !== assetId));
    await fetch(`/api/projects/${projectId}/assets/${assetId}`, { method: "DELETE" }).catch(() => {});
    router.refresh();
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <span className="eyebrow">Vos visuels</span>
        {images.length > 0 && <span className="font-mono text-[11px] text-faint">{images.length} image{images.length > 1 ? "s" : ""}</span>}
      </div>

      <div className="px-6 py-5">
        <p className="mb-4 text-sm leading-relaxed text-muted">
          Ajoutez vos propres photos ou captures d'écran. Elles seront intégrées à la vidéo comme scènes du produit
          lors de la prochaine génération. Idéal si votre app est derrière une connexion.
        </p>

        {images.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2.5">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-video overflow-hidden rounded-lg border border-hairline bg-elevated">
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.url} alt="visuel importé" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center"><Images size={18} className="text-faint" /></div>
                )}
                <button
                  onClick={() => remove(img.id)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-bad group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-surface px-4 py-3.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {busy ? "Envoi…" : "Ajouter des images"}
        </button>

        {error && <p className="mt-3 rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 text-sm text-bad">{error}</p>}
      </div>
    </div>
  );
}
