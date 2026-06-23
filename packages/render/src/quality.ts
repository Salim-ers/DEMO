/**
 * Render quality configuration, resolved from environment variables so the same
 * build can ship a fast preview or a premium master without code changes.
 *
 *   RENDER_QUALITY        premium | standard          (default premium)
 *   RENDER_CRF            x264 CRF, 15–18 ideal        (default 16)
 *   RENDER_X264_PRESET    ultrafast…veryslow           (default medium)
 *   RENDER_VIDEO_BITRATE  e.g. 12M / 35M (advisory)    (default 12M)
 *   RENDER_AUDIO_BITRATE  e.g. 192k / 256k             (default 192k)
 *   RENDER_RESOLUTION     1080p | 1440p | 4k           (default 1080p)
 *   RENDER_ENABLE_4K      true | false                 (default false)
 *   RENDER_AUDIO_SAMPLE_RATE  Hz                        (default 48000)
 */
export type X264Preset =
  | "ultrafast" | "superfast" | "veryfast" | "faster" | "fast"
  | "medium" | "slow" | "slower" | "veryslow";

export interface RenderQuality {
  quality: "premium" | "standard";
  crf: number;
  x264Preset: X264Preset;
  /** Advisory target for the quality report; CRF is the actual quality driver. */
  videoBitrate: string;
  audioBitrate: `${number}k`;
  audioSampleRate: number;
  /** Upscale factor passed to Remotion. 2 → 4K from a 1080p composition. */
  scale: number;
  resolutionLabel: string;
  pixelFormat: "yuv420p";
}

const ALLOWED_PRESETS = new Set([
  "ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow",
]);

function clampInt(v: string | undefined, def: number, min: number, max: number): number {
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : def;
}

export function getRenderQuality(): RenderQuality {
  const quality = (process.env.RENDER_QUALITY ?? "premium").toLowerCase() === "standard" ? "standard" : "premium";
  const premium = quality === "premium";

  const crf = clampInt(process.env.RENDER_CRF, premium ? 16 : 23, 12, 30);

  const presetEnv = (process.env.RENDER_X264_PRESET ?? (premium ? "medium" : "veryfast")).toLowerCase();
  const x264Preset = (ALLOWED_PRESETS.has(presetEnv) ? presetEnv : "medium") as X264Preset;

  const enable4k = (process.env.RENDER_ENABLE_4K ?? "false").toLowerCase() === "true";
  const resolution = (process.env.RENDER_RESOLUTION ?? (enable4k ? "4k" : "1080p")).toLowerCase();

  let scale = 1;
  let resolutionLabel = "1080p";
  if (enable4k || resolution === "4k" || resolution === "2160p") {
    scale = 2; // 1920×1080 → 3840×2160
    resolutionLabel = "4k";
  } else if (resolution === "1440p" || resolution === "2k") {
    scale = 4 / 3; // 1920×1080 → 2560×1440
    resolutionLabel = "1440p";
  }

  const audioSampleRate = clampInt(process.env.RENDER_AUDIO_SAMPLE_RATE, 48000, 8000, 96000);

  return {
    quality,
    crf,
    x264Preset,
    videoBitrate: process.env.RENDER_VIDEO_BITRATE ?? (resolutionLabel === "4k" ? "35M" : "12M"),
    audioBitrate: (process.env.RENDER_AUDIO_BITRATE ?? "192k") as `${number}k`,
    audioSampleRate,
    scale,
    resolutionLabel,
    pixelFormat: "yuv420p",
  };
}
