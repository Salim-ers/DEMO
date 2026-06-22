/** Deterministic id helper (stable across retries when seeded by content). */
export function slugId(prefix: string, seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${prefix}_${(h >>> 0).toString(36)}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function msToFrames(ms: number, fps: number): number {
  return Math.max(1, Math.round((ms / 1000) * fps));
}

export function wordsIn(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Naive but solid PII redaction used by the capture masker and by exports. */
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(\+?\d[\d ().-]{7,}\d)/g;

export function redactPII(input: string, opts?: { names?: string[] }): string {
  let out = input.replace(EMAIL_RE, "•••@•••").replace(PHONE_RE, "••• ••• ••••");
  for (const name of opts?.names ?? []) {
    if (name.trim().length < 3) continue;
    const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, "•••");
  }
  return out;
}

/** Convert milliseconds to an SRT timestamp: HH:MM:SS,mmm */
export function msToSrtTime(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const millis = Math.floor(ms % 1000);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(millis, 3)}`;
}

/** Convert milliseconds to a VTT timestamp: HH:MM:SS.mmm */
export function msToVttTime(ms: number): string {
  return msToSrtTime(ms).replace(",", ".");
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
