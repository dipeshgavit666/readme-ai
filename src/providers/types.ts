export interface AIProvider {
  readonly name: string;

  generate(systemPrompt: string, userPropmt: string): Promise<string>;
}

export type ProviderName = "anthropic" | "gemini";

import { AnthropicProvider } from "./anthropic.ts";
import { GeminiProvider } from "./gemini.ts";

export function createProvider(name: ProviderName = "gemini"): AIProvider {
  switch (name) {
    case "anthropic":
      return new AnthropicProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}
