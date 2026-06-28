import { type ProjectContext, type Storyboard, type StoryboardScene, msToFrames } from "@studio-one/shared";
import { FPS } from "./constants.js";
import { type Brand, type Caption, type Scene, type Stat, type TransitionKind, type VideoProps, videoSchema } from "../schema.js";

/** A single voice line with absolute timing (matches the worker's VoiceLine). */
export interface VoiceLineInput {
  text: string;
  startMs: number;
  endMs: number;
}

export interface BuildVideoInput {
  ctx: ProjectContext;
  storyboard: Storyboard;
  /** Brand overrides; anything omitted is filled from ctx + sensible defaults. */
  brand?: Partial<Brand>;
  /** Captured accent → brand.primary when brand.primary is absent. */
  accentColor?: string | null;
  logoUrl?: string | null;
  siteHost?: string | null;
  voiceoverSrc?: string | null;
  musicSrc?: string | null;
  /** Real word timestamps (ElevenLabs); falls back to even line distribution. */
  words?: Caption[] | null;
  /** Voice lines, used to derive captions when real word timings are absent. */
  voiceLines?: VoiceLineInput[];
  /** Resolve a scene's sourceAssetId to a screenshot URL. */
  resolveImageUrl?: (assetId: string) => string | null;
  /** Resolve a scene's sourceAssetId to a generated Higgsfield clip URL. */
  resolveClipUrl?: (assetId: string) => string | null;
  /** Resolve a generated Higgsfield clip by scene id (b-roll for statement scenes). */
  resolveSceneClipUrl?: (sceneId: string) => string | null;
}

const CTA_TYPES = new Set(["final_cta", "outro"]);
const STAT_TYPES = new Set(["metric_moment", "benefit_grid"]);
const TRANSITION_CYCLE: TransitionKind[] = ["slide", "fade", "wipe", "fade", "slide"];

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

/** Parse "value::label | value::label" metric encoding into typed stats. */
function parseStats(visualInstruction: string): Stat[] {
  const out: Stat[] = [];
  for (const seg of visualInstruction.split("|")) {
    const [vRaw, ...rest] = seg.split("::");
    const label = rest.join("::").trim();
    if (!label || vRaw === undefined) continue;
    const m = vRaw.match(/-?\d[\d.,]*/);
    if (!m) continue;
    const value = parseFloat(m[0].replace(/\s/g, "").replace(",", "."));
    if (Number.isNaN(value)) continue;
    const idx = vRaw.indexOf(m[0]);
    out.push({
      value,
      prefix: vRaw.slice(0, idx).trim(),
      suffix: vRaw.slice(idx + m[0].length).trim(),
      label,
    });
  }
  return out.slice(0, 4);
}

function device(s: StoryboardScene, input: BuildVideoInput): { deviceSrc?: string; deviceIsVideo: boolean } {
  // A generated Higgsfield clip for this scene wins (gives statement scenes real
  // motion instead of a placeholder).
  const sceneClip = input.resolveSceneClipUrl?.(s.id) ?? null;
  if (sceneClip) return { deviceSrc: sceneClip, deviceIsVideo: true };
  if (!s.sourceAssetId) return { deviceIsVideo: false };
  const clip = input.resolveClipUrl?.(s.sourceAssetId) ?? null;
  if (clip) return { deviceSrc: clip, deviceIsVideo: true };
  const img = input.resolveImageUrl?.(s.sourceAssetId) ?? null;
  return img ? { deviceSrc: img, deviceIsVideo: false } : { deviceIsVideo: false };
}

/** Even word distribution across each line, when real timestamps are absent. */
function captionsFromLines(lines: VoiceLineInput[]): Caption[] {
  const out: Caption[] = [];
  for (const l of lines) {
    const words = l.text.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    const per = Math.max(1, l.endMs - l.startMs) / words.length;
    words.forEach((w, i) => out.push({ word: w, startMs: Math.round(l.startMs + i * per), endMs: Math.round(l.startMs + (i + 1) * per) }));
  }
  return out;
}

/**
 * Map a validated Storyboard to the premium engine's props. Each storyboard
 * scene becomes a hook / feature / stats / cta scene; captures and Higgsfield
 * clips fill the device frames; captions come from real word timings when
 * available, otherwise from line timing. The brand is derived from the captured
 * accent/logo + the project context (never a generic template).
 */
export function buildVideoProps(input: BuildVideoInput): VideoProps {
  const { ctx, storyboard } = input;
  const siteHost = input.siteHost ?? input.brand?.siteHost ?? hostOf(ctx.url);

  const brand: Brand = {
    name: input.brand?.name ?? ctx.productName,
    primary: input.brand?.primary ?? input.accentColor ?? "#6C5CE7",
    secondary: input.brand?.secondary ?? input.accentColor ?? "#8B7BF0",
    bg: input.brand?.bg ?? "#0B0B12",
    text: input.brand?.text ?? "#FFFFFF",
    fontFamily: input.brand?.fontFamily ?? "Manrope",
    logoSrc: input.brand?.logoSrc ?? input.logoUrl ?? undefined,
    siteHost,
  };

  const total = storyboard.scenes.length;
  const scenes: Scene[] = storyboard.scenes.map((s, i) => {
    const durationInFrames = Math.max(1, msToFrames(s.durationMs, FPS));
    const transitionToNext: TransitionKind = i === total - 1 ? "none" : TRANSITION_CYCLE[i % TRANSITION_CYCLE.length]!;
    const dev = device(s, input);

    if (CTA_TYPES.has(s.type)) {
      return {
        type: "cta",
        durationInFrames,
        transitionToNext,
        headline: s.captionText || ctx.mainPromise,
        buttonLabel: `Essayer ${ctx.productName}`,
        url: siteHost,
      };
    }

    if (STAT_TYPES.has(s.type)) {
      const stats = parseStats(s.visualInstruction);
      if (stats.length > 0) {
        return { type: "stats", durationInFrames, transitionToNext, title: s.captionText || undefined, stats };
      }
    }

    if (i === 0) {
      return {
        type: "hook",
        durationInFrames,
        transitionToNext,
        title: s.captionText || s.visualInstruction || ctx.mainPromise,
        subtitle: s.voiceoverText && s.voiceoverText !== s.captionText ? s.voiceoverText : undefined,
        ...dev,
      };
    }

    return {
      type: "feature",
      durationInFrames,
      transitionToNext,
      title: s.captionText || s.visualInstruction,
      benefit: s.voiceoverText || s.visualInstruction,
      ...dev,
    };
  });

  const captions = input.words && input.words.length > 0 ? input.words : captionsFromLines(input.voiceLines ?? []);

  return videoSchema.parse({
    brand,
    format: ctx.format,
    scenes,
    voiceoverSrc: input.voiceoverSrc ?? undefined,
    musicSrc: input.musicSrc ?? undefined,
    musicDuckingDb: -20,
    captions,
  });
}
