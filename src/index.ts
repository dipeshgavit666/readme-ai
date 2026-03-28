import { gatherContext } from "./context.ts";
import { generateReadme } from "./agent.ts";
import { createProvider } from "./providers/types.ts";

const providerName = (process.env.README_AI_PROVIDER ?? "gemini") as
  | "anthropic"
  | "gemini";
const provider = createProvider(providerName);

const context = gatherContext(process.cwd());
const readme = await generateReadme(context, provider);

console.log("\n--- GENERATED README ---\n");
console.log(readme);
