import { pino } from "pino";
import { GoogleTTSProvider } from "./google.js";
const log = pino({ name: "tts" });

export { GoogleTTSProvider };

/** A word with its absolute timing (ms), derived from ElevenLabs alignment. */
export interface WordStamp {
  word: string;
  startMs: number;
  endMs: number;
}

export interface TTSResult {
  audio: Buffer | null;
  contentType: string;
  provider: string;
  status: "generated" | "skipped" | "error";
  /** Word-level timestamps when the provider returns them (ElevenLabs). */
  words?: WordStamp[];
  /** PCM sample rate when the audio is WAV/PCM. */
  sampleRate?: number;
}

export interface SynthOptions {
  language: string;
  /** consent MUST be true. We never clone or synthesize a voice without it. */
  consent: boolean;
  voiceId?: string;
  /** Format drives the voice energy (TikTok is punchier than a 16:9 demo). */
  format?: "16:9" | "9:16" | "1:1";
}

export interface TTSProvider {
  readonly name: string;
  readonly available: boolean;
  synthesize(text: string, opts: SynthOptions): Promise<TTSResult>;
}

/**
 * ElevenLabs voice_settings per the Studio One spec. The single biggest cause of
 * "robotic" voice is a high `stability`; we keep it low (and lower still for
 * social formats) and never exceed 0.6.
 */
function voiceSettingsFor(format?: SynthOptions["format"]) {
  const tiktok = format === "9:16";
  return {
    stability: tiktok ? 0.38 : 0.45,
    similarity_boost: 0.8,
    style: tiktok ? 0.3 : 0.15,
    use_speaker_boost: true,
  };
}

/** Wrap raw 16-bit mono PCM into a minimal WAV container (so it is a real .wav). */
function pcmToWav(pcm: Buffer, sampleRate: number, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Collapse ElevenLabs character alignment into word-level timestamps. */
function charsToWords(
  characters: string[],
  starts: number[],
  ends: number[],
): WordStamp[] {
  const words: WordStamp[] = [];
  let cur = "";
  let startS = 0;
  let endS = 0;
  const flush = () => {
    const w = cur.trim();
    if (w) words.push({ word: w, startMs: Math.round(startS * 1000), endMs: Math.round(endS * 1000) });
    cur = "";
  };
  for (let i = 0; i < characters.length; i++) {
    const ch = characters[i] ?? "";
    if (/\s/.test(ch)) {
      flush();
      continue;
    }
    if (cur === "") startS = starts[i] ?? endS;
    cur += ch;
    endS = ends[i] ?? endS;
  }
  flush();
  return words;
}

interface TimestampResponse {
  audio_base64?: string;
  alignment?: {
    characters?: string[];
    character_start_times_seconds?: number[];
    character_end_times_seconds?: number[];
  };
}

export class ElevenLabsProvider implements TTSProvider {
  readonly name = "elevenlabs";
  readonly available: boolean;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY ?? "";
    this.available = this.apiKey.length > 0;
  }

  async synthesize(text: string, opts: SynthOptions): Promise<TTSResult> {
    if (!opts.consent) {
      log.warn("TTS refused: consent flag is false");
      return { audio: null, contentType: "audio/wav", provider: this.name, status: "skipped" };
    }
    if (!this.available) {
      return { audio: null, contentType: "audio/wav", provider: this.name, status: "skipped" };
    }

    const voiceId = opts.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
    const sampleRate = 44100;
    try {
      // /with-timestamps returns base64 audio + per-character alignment, which we
      // turn into word-synced captions. PCM (not MP3) for clean downstream mixing.
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=pcm_44100`,
        {
          method: "POST",
          headers: { "content-type": "application/json", "xi-api-key": this.apiKey },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: voiceSettingsFor(opts.format),
          }),
        },
      );
      if (!res.ok) {
        log.warn({ status: res.status }, "elevenlabs synth failed");
        return { audio: null, contentType: "audio/wav", provider: this.name, status: "error" };
      }
      const data = (await res.json()) as TimestampResponse;
      if (!data.audio_base64) {
        return { audio: null, contentType: "audio/wav", provider: this.name, status: "error" };
      }
      const pcm = Buffer.from(data.audio_base64, "base64");
      const wav = pcmToWav(pcm, sampleRate);
      const al = data.alignment;
      const words =
        al?.characters && al.character_start_times_seconds && al.character_end_times_seconds
          ? charsToWords(al.characters, al.character_start_times_seconds, al.character_end_times_seconds)
          : undefined;
      return { audio: wav, contentType: "audio/wav", provider: this.name, status: "generated", words, sampleRate };
    } catch (err) {
      log.warn({ err: String(err) }, "elevenlabs request failed");
      return { audio: null, contentType: "audio/wav", provider: this.name, status: "error" };
    }
  }
}

class NoopTTSProvider implements TTSProvider {
  readonly name = "none";
  readonly available = false;
  async synthesize(): Promise<TTSResult> {
    return { audio: null, contentType: "audio/mpeg", provider: "none", status: "skipped" };
  }
}

/**
 * Resolve the active TTS provider.
 *  - "elevenlabs" → studio-grade neural voice (WAV + word timestamps) when a key
 *    is set; otherwise it transparently falls back to the free Google voice.
 *  - "google" / unset → free Google voiceover (no key, works out of the box).
 *  - "none" → explicit opt-out (silent video).
 * Synthesis only runs when the project's voice mode is tts_provider AND consent
 * was confirmed, so defaulting to a real provider never synthesizes silently.
 */
export function getTTS(): TTSProvider {
  const choice = (process.env.TTS_PROVIDER ?? "google").toLowerCase();
  if (choice === "none") return new NoopTTSProvider();
  if (choice === "elevenlabs") {
    const p = new ElevenLabsProvider();
    if (p.available) return p;
    log.warn("TTS_PROVIDER=elevenlabs but ELEVENLABS_API_KEY missing — using free Google voice");
    return new GoogleTTSProvider();
  }
  return new GoogleTTSProvider();
}
