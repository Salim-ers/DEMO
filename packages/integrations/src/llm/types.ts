export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  system?: string;
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LLMProvider {
  readonly name: string;
  readonly available: boolean;
  complete(opts: LLMCompletionOptions): Promise<string>;
}
