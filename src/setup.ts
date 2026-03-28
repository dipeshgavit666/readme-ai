import readline from "readline";
import { writeConfig, readConfig, getConfigPath } from "./config.ts";
import type { Config } from "./config.ts";

function createInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function askSecret(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf-8");

    let input = "";

    stdin.on("data", function handler(char) {
      const c = char.toString();

      if (c === "\r" || c === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", handler);
        process.stdout.write("\n");
        resolve(input);
      } else if (c === "\u0003") {
        process.stdout.write("\n");
        process.exit(0);
      } else if (c === "\u007f") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        input += c;
        process.stdout.write("*");
      }
    });
  });
}

export async function runSetup(): Promise<void> {
  const rl = createInterface();

  console.log("\n readme-ai setup\n");
  console.log("This will save your configuration to ~/.readme-ai/config.json");
  console.log("You only need to do this once.\n");

  const existing = readConfig();
  if (existing) {
    const overwrite = await ask(
      rl,
      " Existing config found. Overwrite? (y/n): ",
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("\n Setup cancelled. Existing config kept.");
      rl.close();
      return;
    }
    console.log("");
  }

  let defaultProvider: "gemini" | "anthropic" = "gemini";
  while (true) {
    const answer = await ask(
      rl,
      "? Default provider (gemini/anthropic) [gemini]: ",
    );

    if (answer === "" || answer === "gemini") {
      defaultProvider = "gemini";
      break;
    } else if (answer === "anthropic") {
      defaultProvider = "anthropic";
      break;
    } else {
      console.log("  Please enter 'gemini' or 'anthropic'");
    }
  }

  let geminiApiKey = "";
  if (defaultProvider === "gemini") {
    while (true) {
      geminiApiKey = await askSecret(
        rl,
        "? Gemini API key (get free at aistudio.google.com): ",
      );
      if (geminiApiKey.length > 0) break;
      console.log("  Gemini API key is required when using gemini provider");
    }
  } else {
    geminiApiKey = await askSecret(
      rl,
      "? Gemini API key (optional, press enter to skip): ",
    );
  }

  let anthropicApiKey = "";
  if (defaultProvider === "anthropic") {
    while (true) {
      anthropicApiKey = await askSecret(
        rl,
        "? Anthropic API key (get one at console.anthropic.com): ",
      );
      if (anthropicApiKey.length > 0) break;
      console.log(
        "  Anthropic API key is required when using anthropic provider",
      );
    }
  } else {
    anthropicApiKey = await askSecret(
      rl,
      "? Anthropic API key (optional, press enter to skip): ",
    );
  }

  rl.close();

  const config: Config = {
    defaultProvider,
    geminiApiKey,
    anthropicApiKey,
    version: "1",
  };

  writeConfig(config);

  console.log(`\n   Config saved to ${getConfigPath()}`);
  console.log(`\n   Provider : ${defaultProvider}`);
  console.log(`   Gemini   : ${geminiApiKey ? "✓ set" : "✗ not set"}`);
  console.log(`   Anthropic: ${anthropicApiKey ? "✓ set" : "✗ not set"}`);
  console.log(`\nRun 'readme-ai' to generate your first README.\n`);
}
