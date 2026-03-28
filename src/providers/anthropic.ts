import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./types.ts";

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";

  private client: Anthropic;

  private model: string;

  constructor(model: string = "claude-haiku-4-5-20251001") {
    this.client = new Anthropic();
    this.model = model;
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log(`Using ${this.name} (${this.model})`);

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    console.log(
      `Tokens — input: ${message.usage.input_tokens}, output: ${message.usage.output_tokens}`,
    );

    const content = message.content[0];
    if (!content || content.type !== "text") {
      throw new Error("Unexpected response type from Anthropic API");
    }

    return content.text;
  }
}
