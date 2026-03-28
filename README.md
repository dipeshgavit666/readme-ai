# readme-ai

Automated README generation and maintenance powered by LLMs.

## What it does

`readme-ai` analyzes your project's source code, directory structure, and git history to generate or update professional `README.md` files. It gathers deep context from your repository—including recent code changes via `git diff`—and utilizes AI models (Claude or Gemini) to draft documentation that remains perfectly in sync with your implementation.

The tool performs atomic writes and automatically creates a backup (`.readme-ai.bak`) of your existing README before making any changes.

## Why it exists

Technical documentation often becomes outdated as soon as code is committed. `readme-ai` eliminates the manual overhead of updating READMEs by understanding the technical context of your repo, ensuring your project's first point of contact for developers is always accurate, concise, and up-to-date.

## Installation

This project is built with [Bun](https://bun.sh).

```bash
bun install
```

## Usage

To generate or update the README for the current directory using the default provider:

```bash
# Using default provider (Gemini)
bun run dev

# Specify a provider and custom output path
bun run dev --provider anthropic --output DOCS.md

# Run a dry run to see the output in stdout
bun run dev --dry-run
```

### CLI Arguments

| Argument | Short | Description |
| :--- | :--- | :--- |
| `--provider` | `-p` | AI provider to use (`anthropic` or `gemini`) |
| `--path` | `--repo` | Path to the repository to analyze (default: `.`) |
| `--output` | `-o` | Output filename (default: `README.md`) |
| `--dry-run` | `-d` | Generate the README without writing to disk |
| `--help` | `-h` | Show help message |

## Configuration

Configure the tool using environment variables. Bun automatically loads variables from a `.env` file.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `README_AI_PROVIDER` | Default AI provider | `gemini` |
| `GEMINI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com) | - |
| `ANTHROPIC_API_KEY` | API key from [Anthropic Console](https://console.anthropic.com) | - |

### Supported Models
- **Google Gemini**: Uses `gemini-3-flash-preview` by default.
- **Anthropic Claude**: Uses `claude-haiku-4-5-20251001` by default.

## How it works

1.  **Context Gathering**: Scans the repository for `package.json` metadata, folder hierarchy, and source files (supporting `.ts`, `.py`, `.go`, `.rs`, etc.).
2.  **Change Analysis**: Detects recent changes using `git diff HEAD` to prioritize documentation updates for new features or fixes.
3.  **Agentic Writing**: Uses a specialized system prompt to ensure the AI produces concise, developer-centric markdown.
4.  **Safe Writing**: Validates generated content (starts with H1, non-empty) and creates an atomic backup before updating the target file.

## How to contribute

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a clear description of your changes.

## License

This project is currently private. All rights reserved.