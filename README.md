# readme-ai

AI-powered CLI that reads your codebase and generates your README automatically.

[![npm version](https://img.shields.io/npm/v/@dipeshgavit666/readme-ai.svg)](https://www.npmjs.com/package/@dipeshgavit666/readme-ai)
[![npm downloads](https://img.shields.io/npm/dm/@dipeshgavit666/readme-ai.svg)](https://www.npmjs.com/package/@dipeshgavit666/readme-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What it does

`readme-ai` analyzes your project's source code, directory structure, and git history to generate or update professional `README.md` files. It supports Google Gemini (free) and Anthropic Claude as AI providers.

## Installation

```bash
npm install -g @dipeshgavit666/readme-ai
```

That's it. No cloning, no building, no Bun required.

## Getting started

**Step 1 — configure your API keys (one time only):**

```bash
readme-ai setup
```

This launches an interactive wizard that saves your keys to `~/.readme-ai/config.json`.
You'll need at least one API key:

- **Gemini** (free) — get one at [aistudio.google.com](https://aistudio.google.com)
- **Anthropic** (paid) — get one at [console.anthropic.com](https://console.anthropic.com)

**Step 2 — generate your README:**

```bash
# generate README for the current directory
readme-ai

# generate README for a different repo
readme-ai --path ./my-other-project

# preview without writing to disk
readme-ai --dry-run
```

## Usage

```bash
readme-ai [command] [options]
```

### Commands

| Command | Description                              |
| :------ | :--------------------------------------- |
| `setup` | Configure your API keys (run this first) |

### Options

| Option       | Short    | Description                                               |
| :----------- | :------- | :-------------------------------------------------------- |
| `--provider` | `-p`     | AI provider to use (`gemini` or `anthropic`)              |
| `--path`     | `--repo` | Path to the repo to document (default: current directory) |
| `--output`   | `-o`     | Output filename (default: `README.md`)                    |
| `--dry-run`  | `-d`     | Preview output without writing to disk                    |
| `--help`     | `-h`     | Show help message                                         |

### Examples

```bash
# use gemini (default, free)
readme-ai

# use anthropic
readme-ai --provider anthropic

# run on a different repo
readme-ai --path /home/user/projects/my-app

# preview without writing
readme-ai --dry-run

# save to a different filename
readme-ai --output DOCS.md
```

## Configuration

Configuration is stored at `~/.readme-ai/config.json` after running `readme-ai setup`.
Environment variables override the config file if both are set.

| Variable             | Description                                                     |
| :------------------- | :-------------------------------------------------------------- |
| `README_AI_PROVIDER` | Default provider (`gemini` or `anthropic`)                      |
| `GEMINI_API_KEY`     | API key from [Google AI Studio](https://aistudio.google.com)    |
| `ANTHROPIC_API_KEY`  | API key from [Anthropic Console](https://console.anthropic.com) |

### Supported models

- **Google Gemini** — `gemini-2.0-flash` (free tier available)
- **Anthropic Claude** — `claude-haiku-4-5-20251001`

## How it works

1. **Context gathering** — scans `package.json`, folder structure, and source files (`.ts`, `.js`, `.py`, `.go`, `.rs`, and more)
2. **Git integration** — reads `git diff HEAD` to understand what recently changed and reflect it accurately
3. **AI generation** — sends a structured prompt to your chosen provider and gets back clean markdown
4. **Safe writing** — backs up your existing README to `.readme-ai.bak` before overwriting
5. **Validation** — checks the output is valid markdown before saving

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push and open a pull request

## License

MIT — see [LICENSE](LICENSE) for details.
