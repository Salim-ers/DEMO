import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { getRenderQuality } from "./quality.js";

/** Resolve the ffmpeg binary: prefer ffmpeg-static if installed, else PATH. */
export async function ffmpegPath(): Promise<string> {
  try {
    // Optional dependency; present in many environments. Falls back to PATH.
    const mod: { default?: string } = await import("ffmpeg-static" as string).catch(() => ({}) as never);
    if (mod?.default) {
      await access(mod.default);
      return mod.default;
    }
  } catch {
    /* ignore — fall through to PATH */
  }
  return "ffmpeg";
}

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    p.stderr.on("data", (d) => (stderr += d.toString()));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-500)}`))));
  });
}

/**
 * Normalize a rendered MP4 for stable delivery: keep the (already H.264, already
 * compressed) video stream as-is — copying avoids re-bloating the file and any
 * quality loss — and only re-encode the audio with EBU R128 loudness leveling,
 * plus +faststart so the web player can stream/seek immediately.
 */
export async function normalizeMp4(input: string, output: string): Promise<string> {
  const bin = await ffmpegPath();
  const q = getRenderQuality();
  await run(bin, [
    "-y",
    "-i", input,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", q.audioBitrate,
    "-ar", String(q.audioSampleRate),
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-movflags", "+faststart",
    output,
  ]);
  return output;
}

/**
 * Flatten a (possibly transparent) logo onto a solid square so it renders cleanly
 * as an opaque app-icon tile — Remotion's <Img> otherwise paints PNG transparency
 * as a checkerboard. Centers the logo with padding on a `color` canvas.
 */
export async function flattenImageOnColor(input: string, output: string, color = "white", size = 512): Promise<string> {
  const bin = await ffmpegPath();
  const inner = Math.round(size * 0.8);
  await run(bin, [
    "-y",
    "-f", "lavfi", "-i", `color=c=${color}:s=${size}x${size}`,
    "-i", input,
    "-filter_complex",
    `[1]scale=${inner}:${inner}:force_original_aspect_ratio=decrease[lg];[0][lg]overlay=(W-w)/2:(H-h)/2:format=auto,format=rgb24`,
    "-frames:v", "1",
    output,
  ]);
  return output;
}

/**
 * Last-resort shrink for an oversized render: keep 1080p but raise CRF so the
 * file fits restrictive object-storage limits (e.g. Supabase's default 50 MB
 * per-file cap). Stays premium-looking — a far better fallback than dropping to
 * 720p. For true high-bitrate masters, raise the storage bucket's file limit.
 */
export async function shrinkMp4(input: string, output: string): Promise<string> {
  const bin = await ffmpegPath();
  const q = getRenderQuality();
  await run(bin, [
    "-y",
    "-i", input,
    "-vf", "scale='min(1920,iw)':-2",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "23",
    "-c:a", "aac",
    "-b:a", q.audioBitrate,
    "-ar", String(q.audioSampleRate),
    "-movflags", "+faststart",
    output,
  ]);
  return output;
}

/** Mux an external audio track onto a (silent) video, trimming to the shorter. */
export async function muxAudio(video: string, audio: string, output: string): Promise<string> {
  const bin = await ffmpegPath();
  await run(bin, [
    "-y",
    "-i", video,
    "-i", audio,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-shortest",
    "-movflags", "+faststart",
    output,
  ]);
  return output;
}
