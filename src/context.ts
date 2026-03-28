import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export type RepoContext = {
  packageJson: Record<string, unknown> | null;
  folderStructure: string;
  sourceFiles: { path: string; content: string }[];
  existingReadme: string | null;
  gitDiff: string | null;
};

function readPackageJson(repoPath: string): Record<string, unknown> | null {
  const filePath = path.join(repoPath, "package.json");

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(raw);
}

const IGNORE_LIST = [
  "node_modules",
  ".git",
  ".env",
  ".DS_STORE",
  "bun.lock",
  "package-lock.json",
];

function buildFolderStructure(dirPath: string, indent: string = ""): string {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let result = "";

  for (const entry of entries) {
    if (IGNORE_LIST.includes(entry.name)) continue;
    if (entry.isDirectory()) {
      result += `${indent}${entry.name}/\n`;
      result += buildFolderStructure(
        path.join(dirPath, entry.name),
        indent + " ",
      );
    } else {
      result += `${indent}${entry.name}\n`;
    }
  }
  return result;
}

const SOURCE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".c",
  ".cpp",
  ".md",
  ".json",
  ".yaml",
  ".yml",
  ".toml",
  ".sh",
  ".html",
  ".css",
];

const MAX_FILE_CHARS = 3000;

function readSourceFiles(
  dirPath: string,
  repoRoot: string,
): { path: string; content: string }[] {
  const results: { path: string; content: string }[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_LIST.includes(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      results.push(...readSourceFiles(fullPath, repoRoot));
    } else {
      const ext = path.extname(entry.name);
      if (!SOURCE_EXTENSIONS.includes(ext)) continue;
      if (entry.name.toLowerCase() === "readme.md") continue;

      const content = fs.readFileSync(fullPath, "utf-8");

      const relativePath = path.relative(repoRoot, fullPath);

      results.push({
        path: relativePath,
        content: content.slice(0, MAX_FILE_CHARS),
      });
    }
  }
  return results;
}

function getGitDiff(repoPath: string): string | null {
  try {
    const diff = execSync("git diff HEAD", {
      cwd: repoPath,
      encoding: "utf-8",
    });
    return diff.slice(0, 5000) || null;
  } catch (error) {
    return null;
  }
}

function readExistingReadme(repoPath: string): string | null {
  const variants = ["README.md", "Readme.md", "readme.md", "README.txt"];

  for (const variant of variants) {
    const filePath = path.join(repoPath, variant);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
  }
  return null;
}

export function gatherContext(repoPath: string): RepoContext {
  console.log(`\n Gathering repo context...`);
  console.log(`   Target: ${repoPath}`);

  const packageJson = readPackageJson(repoPath);
  console.log("Gathered package.json");

  const folderStructure = buildFolderStructure(repoPath);
  console.log("Gatherd folder structure");

  const sourceFiles = readSourceFiles(repoPath, repoPath);
  console.log(`Gathered ${sourceFiles.length} source files`);

  const existingReadme = readExistingReadme(repoPath);
  console.log(existingReadme ? "existing README found" : "! no README yet");

  const gitDiff = getGitDiff(repoPath);
  console.log(gitDiff ? "git diff captred" : "! no git diff available");

  return {
    packageJson,
    folderStructure,
    sourceFiles,
    existingReadme,
    gitDiff,
  };
}
