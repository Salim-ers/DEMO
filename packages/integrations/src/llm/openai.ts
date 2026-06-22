import type { LLMProvider, LLMCompletionOptions } from "./types.js";

/** Minimal OpenAI Chat Completions client (works with OpenAI-compatible APIs). */
export class OpenAIProvider implements LLMProvider {
  readonly name = "openai";
  readonly available: boolean;
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(apiKey?: string, model = "gpt-4o-mini", baseUrl = "https://api.openai.com/v1") {
    this.apiKey = apiKey ?? process.env.OPENAI_API_KEY ?? "";
    this.model = model;
    this.baseUrl = baseUrl;
    this.available = this.apiKey.length > 0;
  }

  async complete(opts: LLMCompletionOptions): Promise<string> {
    if (!this.available) throw new Error("OpenAIProvider: OPENAI_API_KEY not set");
    const messages = [
      ...(opts.system ? [{ role: "system", content: opts.system }] : []),
      ...opts.messages,
    ];
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        max_tokens: opts.maxTokens ?? 2000,
        temperature: opts.temperature ?? 0.4,
        messages,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message.content ?? "";
  }
}
