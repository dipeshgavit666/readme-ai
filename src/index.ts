import path from "path";
import fs from "fs";
import { gatherContext } from "./context.ts";
import { generateReadme } from "./agent.ts";
import { createProvider } from "./providers/types.ts";
import { writeReadme } from "./writer.ts";
import type { ProviderName } from "./providers/types.ts";

type CLIArgs = {
  provider: ProviderName;
  repoPath: string;
  output: string;
  dryRun: boolean;
  help: boolean;
};

const providerName = (process.env.README_AI_PROVIDER ?? "gemini") as
  | "anthropic"
  | "gemini";

const repoPath = process.cwd();

console.log(`\n Readme.ai starting...`);
console.log(`   Provider : ${providerName}`);
console.log(`   Repo     : ${repoPath}\n`);

const provider = createProvider(providerName);
const context = gatherContext(repoPath);
const readme = await generateReadme(context, provider);
const result = writeReadme(readme, repoPath);

console.log("\n Done!");
console.log(`   Written  : ${result.outputPath}`);
console.log(`   Size     : ${result.bytesWritten} bytes`);
if (result.backedUp) {
  console.log(`   Backup   : ${result.backupPath}`);
}

function parseArgs(argv: string[]): CLIArgs {
  const args = argv.slice(2);

  const result: CLIArgs = {
    provider: (process.env.README_AI_PROVIDER as ProviderName) ?? "gemini",
    repoPath: process.cwd(),
    output: "README.md",
    dryRun: false,
    help: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    switch (arg) {
      case "--provider":
      case "-p": {
        const value = args[i + 1];
        if (!value || value.startsWith("--")) {
          console.error(`--provider requires a value (anthropic | gemini)`);
          process.exit(1);
        }
        if (value !== "anthropic" && value !== "gemini") {
          console.error(
            `Unknown provider "${value}". Choose: anthropic | gemini`,
          );
          process.exit(1);
        }
        result.provider = value as ProviderName;
        i += 2;
        break;
      }

      case "--path":
      case "--repo": {
        const value = args[i + 1];
        if (!value || value.startsWith("--")) {
          console.error(`--path requires a value`);
          process.exit(1);
        }
        result.repoPath = path.resolve(value);
        i += 2;
        break;
      }

      case "--output":
      case "-o": {
        const value = args[i + 1];
        if (!value || value.startsWith("--")) {
          console.error(`--output requires a value`);
          process.exit(1);
        }
        result.output = value;
        i += 2;
        break;
      }

      case "--dry-run":
      case "-d": {
        result.dryRun = true;
        i += 1;
        break;
      }

      case "--help":
      case "-h": {
        result.help = true;
        i += 1;
        break;
      }

      default: {
        console.warn(`Unknown argument: ${arg}`);
        i += 1;
      }
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
readme-ai — AI-powered README generator

USAGE
  readme-ai [options]

OPTIONS
  --provider, -p   AI provider to use (default: gemini)
                   choices: anthropic | gemini

  --path           Path to the repo to document (default: current directory)
                   example: --path ./my-other-project

  --output, -o     Output filename (default: README.md)
                   example: --output DOCS.md

  --dry-run, -d    Generate README but don't write to disk
                   Prints the result to stdout instead

  --help, -h       Show this help message

ENVIRONMENT VARIABLES
  README_AI_PROVIDER    Default provider (anthropic | gemini)
  ANTHROPIC_API_KEY     Required when using anthropic provider
  GEMINI_API_KEY        Required when using gemini provider

EXAMPLES
  # Generate README for current repo using gemini
  readme-ai

  # Use anthropic for a different repo
  readme-ai --provider anthropic --path ./my-app

  # Preview without writing
  readme-ai --dry-run

  # Save to a different filename
  readme-ai --output CONTRIBUTING.md
`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\n Readme.ai`);
  console.log(`   Provider : ${args.provider}`);
  console.log(`   Repo     : ${args.repoPath}`);
  console.log(`   Output   : ${args.output}`);
  if (args.dryRun) {
    console.log(`   Mode     : dry run (won't write to disk)`);
  }
  console.log("");

  if (!fs.existsSync(args.repoPath)) {
    console.error(`Repo path does not exist: ${args.repoPath}`);
    process.exit(1);
  }

  const provider = createProvider(args.provider);

  const context = gatherContext(args.repoPath);

  const readme = await generateReadme(context, provider);

  if (args.dryRun) {
    console.log("\n--- PREVIEW (dry run) ---\n");
    console.log(readme);
    console.log("\n--- END PREVIEW ---");
    console.log("\n Dry run complete. Nothing written to disk.");
    return;
  }

  const result = writeReadme(readme, args.repoPath, args.output);

  console.log("\n Done!");
  console.log(`   Written  : ${result.outputPath}`);
  console.log(`   Size     : ${result.bytesWritten} bytes`);
  if (result.backedUp) {
    console.log(`   Backup   : ${result.backupPath}`);
  }
}

main().catch((err) => {
  console.error(`\n Fatal error: ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }
  process.exit(1);
});
