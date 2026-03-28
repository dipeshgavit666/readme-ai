# readme-ai

AI-powered CLI that reads your codebase and generates your README automatically.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What it does

`readme-ai` analyzes your project's source code, directory structure, and git history to generate or update professional `README.md` files. It leverages Large Language Models (LLMs) like Claude and Gemini to understand the technical context of your repository, including recent changes detected via `git diff`.

## Why it exists

Technical documentation often lags behind code implementation. `readme-ai` eliminates the manual overhead of keeping documentation in sync by providing an automated, context-aware writing agent that ensures your project's documentation is always accurate and concise.

## Installation

This project requires [Bun](https://bun.sh).

```bash
# Clone the repository
git clone https://github.com/dipeshgavit666/readme-ai.git
cd readme-ai

# Install dependencies
bun install

# Build the project
bun run build
```

## Usage

First, initialize the tool with your API keys:

```bash
bun run dev setup
```

To generate or update a README in the current directory:

```bash
# Using default provider (Gemini)
bun run dev

# Using a specific provider and custom path
bun run dev --provider anthropic --path ../another-repo

# Dry run (output to console only)
bun run dev --dry-run
```

### CLI Arguments

| Argument | Short | Description |
| :--- | :--- | :--- |
| `setup` | - | Run the configuration wizard for API keys |
| `--provider` | `-p` | AI provider to use (`anthropic` or `gemini`) |
| `--path` | `--repo` | Path to the repository to analyze (default: `.`) |
| `--output` | `-o` | Output filename (default: `README.md`) |
| `--dry-run` | `-d` | Generate the README without writing to disk |
| `--help` | `-h` | Show help message |

## Configuration

Configuration is stored in `~/.readme-ai/config.json`. You can also use environment variables, which will override the config file.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `README_AI_PROVIDER` | Default AI provider | `gemini` |
| `GEMINI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com) | - |
| `ANTHROPIC_API_KEY` | API key from [Anthropic Console](https://console.anthropic.com) | - |

### Supported Models
- **Google Gemini**: Uses `gemini-3-flash-preview` by default.
- **Anthropic Claude**: Uses `claude-haiku-4-5-20251001` by default.

## How it works

1. **Context Gathering**: The tool scans for `package.json`, identifies project structure, and reads relevant source files (supporting `.ts`, `.py`, `.go`, `.rs`, `.js`, etc.).
2. **Git Integration**: It analyzes `git diff HEAD` to understand recent logic changes and ensure the documentation reflects the latest updates.
3. **Safety First**: Before writing, it creates a backup of your existing README at `.readme-ai.bak`.
4. **Validation**: The generated content is validated to ensure it is valid Markdown and meets minimum length requirements before saving.

## How to contribute

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).