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
 * Normalize a rendered MP4 for stable delivery: H.264 high profile, yuv420p
 * (universally playable), faststart for web streaming, and EBU R128 loudness
 * normalization on the audio track when present.
 */
export async function normalizeMp4(input: string, output: string): Promise<string> {
  const bin = await ffmpegPath();
  await run(bin, [
    "-y",
    "-i", input,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-preset", "medium",
    "-crf", "18",
    "-c:a", "aac",
    "-b:a", "192k",
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
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
