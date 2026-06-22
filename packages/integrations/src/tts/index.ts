import { pino } from "pino";
const log = pino({ name: "tts" });

export interface TTSResult {
  audio: Buffer | null;
  contentType: string;
  provider: string;
  status: "generated" | "skipped" | "error";
}

export interface TTSProvider {
  readonly name: string;
  readonly available: boolean;
  /** consent MUST be true. We never clone or synthesize a voice without it. */
  synthesize(text: string, opts: { language: string; consent: boolean; voiceId?: string }): Promise<TTSResult>;
}

export class ElevenLabsProvider implements TTSProvider {
  readonly name = "elevenlabs";
  readonly available: boolean;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY ?? "";
    this.available = this.apiKey.length > 0;
  }

  async synthesize(text: string, opts: { language: string; consent: boolean; voiceId?: string }) {
    if (!opts.consent) {
      log.warn("TTS refused: consent flag is false");
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "skipped" as const };
    }
    if (!this.available) {
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "skipped" as const };
    }
    const voiceId = opts.voiceId ?? "21m00Tcm4TlvDq8ikWAM"; // default narrator voice
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "content-type": "application/json", "xi-api-key": this.apiKey },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
    });
    if (!res.ok) {
      log.warn({ status: res.status }, "elevenlabs synth failed");
      return { audio: null, contentType: "audio/mpeg", provider: this.name, status: "error" as const };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return { audio: buf, contentType: "audio/mpeg", provider: this.name, status: "generated" as const };
  }
}

class NoopTTSProvider implements TTSProvider {
  readonly name = "none";
  readonly available = false;
  async synthesize(): Promise<TTSResult> {
    return { audio: null, contentType: "audio/mpeg", provider: "none", status: "skipped" };
  }
}

export function getTTS(): TTSProvider {
  const choice = (process.env.TTS_PROVIDER ?? "none").toLowerCase();
  if (choice === "elevenlabs") {
    const p = new ElevenLabsProvider();
    if (p.available) return p;
  }
  return new NoopTTSProvider();
}
