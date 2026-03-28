import fs from "fs";
import path from "path";

export type WriteResult = {
  outputPath: string;
  backedUp: boolean;
  backupPath: string | null;
  bytesWritten: number;
};

function validateReadme(content: string): string | null {
  if (!content || content.trim().length === 0) {
    return "Generated content is empty";
  }

  if (!content.trimStart().startsWith("#")) {
    return "Generated content does not look like markdown (must start with #)";
  }

  if (content.trim().length < 100) {
    return `Generated content is too short (${content.trim().length} chars)`;
  }

  return null;
}

export function writeReadme(
  content: string,
  repoPath: string,
  filename: string = "README.md",
): WriteResult {
  const validationError = validateReadme(content);
  if (validationError) {
    throw new Error(`README validation failed: ${validationError}`);
  }

  const outputPath = path.join(repoPath, filename);
  const backupPath = path.join(repoPath, ".readme-ai.bak");
  let backedUp = false;

  if (fs.existsSync(outputPath)) {
    const existing = fs.readFileSync(outputPath, "utf-8");
    fs.writeFileSync(backupPath, existing, "utf-8");
    backedUp = true;
  }

  const tempPath = path.join(repoPath, ".readme-ai.tmp");
  fs.writeFileSync(tempPath, content, "utf-8");
  fs.renameSync(tempPath, outputPath);

  return {
    outputPath,
    backedUp,
    backupPath: backedUp ? backupPath : null,
    bytesWritten: Buffer.byteLength(content, "utf-8"),
  };
}
