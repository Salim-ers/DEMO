import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { videoSchema, type Format, type VideoProps } from "./schema.js";

const FORMAT_TO_COMPOSITION: Record<Format, string> = {
  "16:9": "Demo-16x9",
  "9:16": "Demo-9x16",
  "1:1": "Demo-1x1",
};

export interface RenderPremiumOptions {
  props: VideoProps;
  outPath: string;
  compositionId?: string;
  onProgress?: (progress: number) => void;
  concurrency?: number | null;
}

/** Absolute path to the Remotion entry (registerRoot). */
function entryPoint(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, "index.ts");
}

/**
 * Render a premium DemoVideo composition to an MP4 (H.264, 1080p+). Heavy deps
 * (@remotion/bundler, @remotion/renderer + headless Chromium) are imported lazily
 * so importing this package for its mapper/types never pulls the renderer into a
 * non-render context.
 */
export async function renderVideoProps(opts: RenderPremiumOptions): Promise<string> {
  const props = videoSchema.parse(opts.props);
  const compositionId = opts.compositionId ?? FORMAT_TO_COMPOSITION[props.format];

  const [{ bundle }, { selectComposition, renderMedia }] = await Promise.all([
    import("@remotion/bundler"),
    import("@remotion/renderer"),
  ]);

  await mkdir(path.dirname(path.resolve(opts.outPath)), { recursive: true });

  const serveUrl = await bundle({
    entryPoint: entryPoint(),
    onProgress: () => undefined,
    // The sources use NodeNext-style ".js" specifiers pointing at ".ts"/".tsx".
    webpackOverride: (config) => {
      config.resolve = config.resolve ?? {};
      config.resolve.extensionAlias = {
        ...(config.resolve.extensionAlias ?? {}),
        ".js": [".ts", ".tsx", ".js", ".jsx"],
        ".mjs": [".mts", ".mjs"],
        ".cjs": [".cts", ".cjs"],
      };
      return config;
    },
  });

  const inputProps = props as unknown as Record<string, unknown>;
  const composition = await selectComposition({ serveUrl, id: compositionId, inputProps });

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: opts.outPath,
    inputProps,
    concurrency: opts.concurrency ?? null,
    chromiumOptions: { gl: "angle" },
    crf: 18,
    x264Preset: "medium",
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    audioBitrate: "192k",
    onProgress: ({ progress }) => opts.onProgress?.(progress),
  });

  return opts.outPath;
}

export { FORMAT_TO_COMPOSITION };
