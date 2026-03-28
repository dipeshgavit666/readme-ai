import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".readme-ai");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export type Config = {
  defaultProvider: "gemini" | "anthropic";
  geminiApiKey: string;
  anthropicApiKey: string;
  version: string;
};

const DEFAULT_CONFIG: Config = {
  defaultProvider: "gemini",
  geminiApiKey: "",
  anthropicApiKey: "",
  version: "1",
};

export function readConfig(): Config | null {
  if (!fs.existsSync(CONFIG_FILE)) return null;

  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function writeConfig(config: Config): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function deleteConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
