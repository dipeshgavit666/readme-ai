export interface AIProvider {
  readonly name: string;

  generate(systemPrompt: string, userPropmt: string): Promise<string>;
}

export type ProviderName = "anthropic" | "gemini";

import { AnthropicProvider } from "./anthropic.ts";
import { GeminiProvider } from "./gemini.ts";

export function createProvider(
  name: ProviderName = "gemini",
  apiKey?: string,
): AIProvider {
  switch (name) {
    case "anthropic":
      return new AnthropicProvider(undefined, apiKey);
    case "gemini":
      return new GeminiProvider(undefined, apiKey);
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}
