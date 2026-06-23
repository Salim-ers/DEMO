import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import { ffmpegPath } from "./ffmpeg.js";
import { getRenderQuality } from "./quality.js";

export interface VideoProbe {
  width: number;
  height: number;
  fps: number;
  videoCodec: string;
  /** Overall file bitrate in kbps (video + audio). */
  bitrateKbps: number;
  durationSec: number;
  hasAudio: boolean;
  audioCodec: string | null;
  audioBitrateKbps: number | null;
  fileBytes: number;
}

export type CheckStatus = "pass" | "warn" | "fail";

export interface QualityCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

export interface QualityReport {
  resolution: string;
  width: number;
  height: number;
  fps: number;
  videoCodec: string;
  bitrateMbps: number;
  audioCodec: string | null;
  audioBitrateKbps: number | null;
  durationSec: number;
  fileMb: number;
  screenshotCount: number;
  motionSceneCount: number;
  calloutCount: number;
  voiceMode: string;
  score: number;
  checks: QualityCheck[];
  recommendations: string[];
}

/** Probe a rendered MP4 by parsing `ffmpeg -i` stderr (no ffprobe dependency). */
export async function probeVideo(path: string): Promise<VideoProbe> {
  const bin = await ffmpegPath();
  const stderr = await new Promise<string>((resolve) => {
    const p = spawn(bin, ["-i", path, "-hide_banner"], { stdio: ["ignore", "ignore", "pipe"] });
    let buf = "";
    p.stderr.on("data", (d) => (buf += d.toString()));
    p.on("close", () => resolve(buf));
    p.on("error", () => resolve(buf));
  });

  const fileBytes = await stat(path).then((s) => s.size).catch(() => 0);

  const dur = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const durationSec = dur ? Number(dur[1]) * 3600 + Number(dur[2]) * 60 + Number(dur[3]) : 0;

  const overall = stderr.match(/bitrate:\s*(\d+)\s*kb\/s/);
  let bitrateKbps = overall ? Number(overall[1]) : 0;
  if (!bitrateKbps && durationSec > 0 && fileBytes > 0) {
    bitrateKbps = Math.round((fileBytes * 8) / durationSec / 1000);
  }

  const v = stderr.match(/Stream #\d+:\d+.*?: Video:\s*([a-z0-9]+).*?(\d{2,5})x(\d{2,5}).*?(\d+(?:\.\d+)?)\s*fps/is);
  const videoCodec = v?.[1] ?? "unknown";
  const width = v ? Number(v[2]) : 0;
  const height = v ? Number(v[3]) : 0;
  const fps = v ? Math.round(Number(v[4])) : 0;

  const a = stderr.match(/Stream #\d+:\d+.*?: Audio:\s*([a-z0-9]+)/i);
  const hasAudio = Boolean(a);
  const audioCodec = a?.[1] ?? null;
  const ab = stderr.match(/Audio:.*?(\d+)\s*kb\/s/i);
  const audioBitrateKbps = ab ? Number(ab[1]) : null;

  return { width, height, fps, videoCodec, bitrateKbps, durationSec, hasAudio, audioCodec, audioBitrateKbps, fileBytes };
}

export interface QualityContext {
  /** Smallest captured screenshot width (px), if known. */
  minScreenshotWidth?: number | null;
  screenshotCount: number;
  motionSceneCount: number;
  calloutCount: number;
  hasCaptions: boolean;
  voiceMode: string;
  ttsProviderConfigured: boolean;
  targetDurationSec: number;
}

/**
 * Run the automated quality gate over a rendered file + storyboard context and
 * build a scored report. Checks are graded pass/warn/fail; the score is the
 * share of non-failing checks, weighted so hard failures hurt most.
 */
export function buildQualityReport(probe: VideoProbe, ctx: QualityContext): QualityReport {
  const q = getRenderQuality();
  const premium = q.quality === "premium";
  const bitrateMbps = Math.round((probe.bitrateKbps / 1000) * 10) / 10;
  const checks: QualityCheck[] = [];
  const recommendations: string[] = [];

  const add = (id: string, label: string, status: CheckStatus, detail: string) => checks.push({ id, label, status, detail });

  // Resolution ≥ 1920×1080
  if (probe.width >= 1920 && probe.height >= 1080) add("resolution", "Résolution ≥ 1920×1080", "pass", `${probe.width}×${probe.height}`);
  else { add("resolution", "Résolution ≥ 1920×1080", "fail", `${probe.width}×${probe.height}`); recommendations.push("Rendre en 1080p ou plus (RENDER_RESOLUTION=1080p/4k)."); }

  // Video bitrate (premium ≥ 10 Mbps)
  if (!premium) add("bitrate", "Débit vidéo", "pass", `${bitrateMbps} Mbps (mode standard)`);
  else if (bitrateMbps >= 10) add("bitrate", "Débit vidéo ≥ 10 Mbps (premium)", "pass", `${bitrateMbps} Mbps`);
  else { add("bitrate", "Débit vidéo ≥ 10 Mbps (premium)", "warn", `${bitrateMbps} Mbps`); recommendations.push("Baisser RENDER_CRF (15–16) ou lever la limite de taille du bucket pour un débit plus élevé."); }

  // Audio bitrate ≥ 192 kbps (only when audio present)
  if (!probe.hasAudio) add("audio", "Audio", "pass", "aucune voix (script_only)");
  else if ((probe.audioBitrateKbps ?? 0) >= 184) add("audio", "Débit audio ≥ 192 kbps", "pass", `${probe.audioBitrateKbps} kbps ${probe.audioCodec ?? ""}`);
  else { add("audio", "Débit audio ≥ 192 kbps", "warn", `${probe.audioBitrateKbps ?? "?"} kbps`); recommendations.push("Régler RENDER_AUDIO_BITRATE=192k ou 256k."); }

  // Duration 60–90s
  if (probe.durationSec >= 58 && probe.durationSec <= 92) add("duration", "Durée 60–90 s", "pass", `${Math.round(probe.durationSec)} s`);
  else { add("duration", "Durée 60–90 s", "warn", `${Math.round(probe.durationSec)} s`); recommendations.push(`Viser ${ctx.targetDurationSec}s : ajuster durationSeconds du projet.`); }

  // Captions present
  if (ctx.hasCaptions) add("captions", "Sous-titres présents", "pass", "oui");
  else { add("captions", "Sous-titres présents", "fail", "aucun"); recommendations.push("Aucune scène produit avec narration — vérifier la capture."); }

  // ≥ 3 motion-graphics scenes
  if (ctx.motionSceneCount >= 3) add("motion", "≥ 3 scènes motion design", "pass", `${ctx.motionSceneCount}`);
  else { add("motion", "≥ 3 scènes motion design", "warn", `${ctx.motionSceneCount}`); recommendations.push("Étoffer le storyboard (intro, problème, promesse, workflow, bénéfices)."); }

  // ≥ 3 callouts
  if (ctx.calloutCount >= 3) add("callouts", "≥ 3 callouts animés", "pass", `${ctx.calloutCount}`);
  else { add("callouts", "≥ 3 callouts animés", "warn", `${ctx.calloutCount}`); recommendations.push("Ajouter des callouts sur les écrans clés (tableau de bord)."); }

  // No screenshot below 1920px wide
  if (ctx.minScreenshotWidth == null) add("shotWidth", "Captures ≥ 1920 px", "pass", "config 1920×1080 ×2");
  else if (ctx.minScreenshotWidth >= 1920) add("shotWidth", "Captures ≥ 1920 px", "pass", `${ctx.minScreenshotWidth} px`);
  else { add("shotWidth", "Captures ≥ 1920 px", "warn", `${ctx.minScreenshotWidth} px`); recommendations.push("Recapturer en 1920×1080 (CAPTURE_WIDTH/HEIGHT) — ne jamais upscaler."); }

  // No audio if no TTS provider (and not a human upload)
  const unexpectedAudio = probe.hasAudio && !ctx.ttsProviderConfigured && ctx.voiceMode !== "uploaded_human_voice";
  if (!unexpectedAudio) add("voicePolicy", "Politique voix respectée", "pass", ctx.voiceMode);
  else { add("voicePolicy", "Politique voix respectée", "warn", "audio présent sans fournisseur TTS"); }

  const weight = (s: CheckStatus) => (s === "pass" ? 1 : s === "warn" ? 0.5 : 0);
  const score = Math.round((checks.reduce((a, c) => a + weight(c.status), 0) / checks.length) * 100);

  return {
    resolution: `${probe.width}×${probe.height}`,
    width: probe.width,
    height: probe.height,
    fps: probe.fps,
    videoCodec: probe.videoCodec,
    bitrateMbps,
    audioCodec: probe.audioCodec,
    audioBitrateKbps: probe.audioBitrateKbps,
    durationSec: Math.round(probe.durationSec),
    fileMb: Math.round((probe.fileBytes / 1_000_000) * 10) / 10,
    screenshotCount: ctx.screenshotCount,
    motionSceneCount: ctx.motionSceneCount,
    calloutCount: ctx.calloutCount,
    voiceMode: ctx.voiceMode,
    score,
    checks,
    recommendations,
  };
}
