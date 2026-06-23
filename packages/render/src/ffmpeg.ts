import { spawn } from "node:child_process";
import { access } from "node:fs/promises";

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
  await run(bin, [
    "-y",
    "-i", input,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "160k",
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-movflags", "+faststart",
    output,
  ]);
  return output;
}

/**
 * Last-resort shrink for an oversized render: downscale to 720p and re-encode at
 * a higher CRF so the file fits restrictive object-storage limits. Lossy but keeps
 * the demo deliverable instead of failing the whole pipeline.
 */
export async function shrinkMp4(input: string, output: string): Promise<string> {
  const bin = await ffmpegPath();
  await run(bin, [
    "-y",
    "-i", input,
    "-vf", "scale='min(1280,iw)':-2",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "veryfast",
    "-crf", "30",
    "-c:a", "aac",
    "-b:a", "128k",
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
