import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { renderPropsSchema, type RenderProps, type VideoFormat } from "@demoforge/shared";

export type CompositionId = "Demo16x9" | "Demo9x16" | "DemoSquare";

const FORMAT_TO_COMPOSITION: Record<VideoFormat, CompositionId> = {
  "16:9": "Demo16x9",
  "9:16": "Demo9x16",
  "1:1": "DemoSquare",
};

export interface RenderOptions {
  props: RenderProps;
  outPath: string;
  /** Override composition; otherwise derived from props.format. */
  compositionId?: CompositionId;
  onProgress?: (progress: number) => void;
  /** Concurrency for the renderer (defaults to Remotion's auto). */
  concurrency?: number | null;
}

/** Absolute path to the Remotion entry (source .tsx — bundler handles TSX). */
function entryPoint(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, "entry.tsx");
}

/**
 * Render a DemoVideo composition to an MP4 (H.264, 1080p+). Bundles the Remotion
 * project, selects the composition for the requested format, validates props,
 * and renders. Returns the output path.
 *
 * Heavy deps (@remotion/bundler, @remotion/renderer, a headless Chromium) are
 * imported lazily so that importing this package for its types/mapping helpers
 * never pulls the renderer into a non-render context (e.g. the web app).
 */
export async function renderDemoVideo(opts: RenderOptions): Promise<string> {
  const props = renderPropsSchema.parse(opts.props);
  const compositionId = opts.compositionId ?? FORMAT_TO_COMPOSITION[props.format];

  const [{ bundle }, { selectComposition, renderMedia }] = await Promise.all([
    import("@remotion/bundler"),
    import("@remotion/renderer"),
  ]);

  await mkdir(path.dirname(path.resolve(opts.outPath)), { recursive: true });

  const serveUrl = await bundle({
    entryPoint: entryPoint(),
    onProgress: () => undefined,
  });

  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps: props as unknown as Record<string, unknown>,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: opts.outPath,
    inputProps: props as unknown as Record<string, unknown>,
    concurrency: opts.concurrency ?? null,
    chromiumOptions: { gl: "angle" },
    onProgress: ({ progress }) => opts.onProgress?.(progress),
  });

  return opts.outPath;
}
