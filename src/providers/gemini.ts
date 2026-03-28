import { GoogleGenAI } from "@google/genai";
import type { AIProvider } from "./types.ts";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";

  private client: GoogleGenAI;
  private model: string;

  constructor(model: string = "gemini-3-flash-preview") {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com",
      );
    }

    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    console.log(`Using ${this.name} (${this.model})`);

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    console.log(`Response received from ${this.name}`);
    return text;
  }
}
