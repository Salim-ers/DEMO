import type { LLMProvider, LLMCompletionOptions } from "./types.js";

/** Minimal Anthropic Messages API client (no SDK dependency). */
export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic";
  readonly available: boolean;
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model = "claude-sonnet-4-6") {
    this.apiKey = apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
    this.model = model;
    this.available = this.apiKey.length > 0;
  }

  async complete(opts: LLMCompletionOptions): Promise<string> {
    if (!this.available) throw new Error("AnthropicProvider: ANTHROPIC_API_KEY not set");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: opts.maxTokens ?? 2000,
        temperature: opts.temperature ?? 0.4,
        system: opts.system,
        messages: opts.messages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { content: Array<{ type: string; text?: string }> };
    return data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");
  }
}
