import type { AIProvider } from "./providers/types.ts";
import type { RepoContext } from "./context.ts";

const SYSTEM_PROMPT = `You are an expert technical writer and software engineer.
Your job is to generate and maintain high-quality README.md files for software projects.

Follow these rules strictly:
1. Output ONLY raw markdown. No explanations, no commentary, no "Here is your README:".
   The very first character of your response must be "#".
2. Structure the README with these sections (include only what's relevant):
   - Project title and one-line description
   - Badges (build status, npm version, license) if applicable
   - What the project does (2-3 sentences, plain English)
   - Why it exists / the problem it solves
   - Installation instructions (exact commands)
   - Usage examples (with code blocks)
   - Configuration / environment variables
   - How to contribute
   - License
3. Write for a developer who has never seen this project before.
4. Use the git diff to understand what recently changed and reflect that accurately.
5. If an existing README is provided, preserve its structure and tone.
   Only update the sections that are inaccurate or incomplete.
6. Keep it concise. Every sentence must earn its place.
7. Code blocks must have the correct language tag (\`\`\`ts, \`\`\`bash, etc.).`;

function buildPrompt(context: RepoContext): string {
  const sections: string[] = [];

  if (context.packageJson) {
    const pkg = context.packageJson as Record<string, unknown>;
    sections.push(`## Project Info (from package.json)
        Name: ${pkg.name ?? "unknown"}
        Description: ${pkg.description ?? "none provided"}
        Version: ${pkg.version ?? "unknown"}
        Scripts: ${JSON.stringify(pkg.scripts ?? {}, null, 2)}
        Dependencies: ${JSON.stringify(pkg.dependencies ?? {}, null, 2)}`);
  }

  sections.push(`## Folder Structure
\`\`\`
${context.folderStructure}
\`\`\``);

  if (context.sourceFiles.length > 0) {
    const filesText = context.sourceFiles
      .map((f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
      .join("\n\n");
    sections.push(`## Source Files\n${filesText}`);
  }

  if (context.gitDiff) {
    sections.push(`## Recent Changes (git diff)
\`\`\`diff
${context.gitDiff}
\`\`\`
Pay special attention to these changes when updating the README.`);
  }

  if (context.existingReadme) {
    sections.push(`## Existing README (update this, don't replace it entirely)
${context.existingReadme}`);
  } else {
    sections.push(
      `## Existing README\nNone. Create a fresh README from scratch.`,
    );
  }

  return sections.join("\n\n---\n\n");
}

export async function generateReadme(
  context: RepoContext,
  provider: AIProvider,
): Promise<string> {
  console.log("\n Generating README...");

  const userPrompt = buildPrompt(context);
  const readme = await provider.generate(SYSTEM_PROMPT, userPrompt);

  console.log("README generated");
  return readme;
}
