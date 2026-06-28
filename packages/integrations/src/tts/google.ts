import { pino } from "pino";
import type { SynthOptions, TTSProvider, TTSResult } from "./index.js";

const log = pino({ name: "tts:google" });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

/** Map a project language (e.g. "fr", "fr-FR", "en") to a Google TTS `tl` code. */
function toTl(language: string): string {
  const base = (language || "en").toLowerCase().split(/[-_]/)[0]!;
  const allowed = new Set(["fr", "en", "es", "de", "it", "pt", "nl"]);
  return allowed.has(base) ? base : "en";
}

/**
 * Split text into <=200-char chunks on sentence / word boundaries. The Google
 * translate TTS endpoint rejects longer queries, so we synthesize per chunk and
 * concatenate the MP3s (MPEG frames concatenate cleanly for playback).
 */
export function chunkText(text: string, max = 200): string[] {
  const out: string[] = [];
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return out;
  const sentences = clean.match(/[^.!?]+[.!?]*\s*/g) ?? [clean];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length <= max) { cur += s; continue; }
    if (cur) { out.push(cur.trim()); cur = ""; }
    if (s.length <= max) { cur = s; continue; }
    let piece = "";
    for (const w of s.split(" ")) {
      if ((piece + " " + w).trim().length > max) { if (piece) out.push(piece.trim()); piece = w; }
      else piece = (piece + " " + w).trim();
    }
    cur = piece;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/**
 * Free voiceover via Google Translate's TTS endpoint. No API key required, which
 * makes premium-feeling demos work out of the box. Quality is clear standard
 * French/English; for studio-grade narration set TTS_PROVIDER=elevenlabs + a key.
 */
export class GoogleTTSProvider implements TTSProvider {
  readonly name = "google";
  readonly available = true;

  async synthesize(text: string, opts: SynthOptions): Promise<TTSResult> {
    if (!opts.consent) {
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "skipped" };
    }
    const tl = toTl(opts.language);
    const parts = chunkText(text).slice(0, 40); // hard cap so we never hammer the endpoint
    if (parts.length === 0) {
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "skipped" };
    }

    const buffers: Buffer[] = [];
    try {
      for (let i = 0; i < parts.length; i++) {
        const q = encodeURIComponent(parts[i]!);
        const url =
          `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}` +
          `&total=${parts.length}&idx=${i}&textlen=${parts[i]!.length}&q=${q}`;
        const res = await fetch(url, {
          headers: { "User-Agent": UA, Referer: "https://translate.google.com/" },
        });
        if (!res.ok) {
          log.warn({ status: res.status, idx: i }, "google tts chunk failed");
          return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "error" };
        }
        buffers.push(Buffer.from(await res.arrayBuffer()));
      }
    } catch (err) {
      log.warn({ err: String(err) }, "google tts request failed");
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "error" };
    }

    const audio = Buffer.concat(buffers);
    log.info({ chunks: parts.length, bytes: audio.byteLength, tl }, "google tts synthesized");
    return { audio, contentType: "audio/mpeg", provider: this.name, status: "generated" };
  }
}
