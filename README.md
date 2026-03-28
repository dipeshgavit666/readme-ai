# readme-ai

Automated README generation and maintenance powered by LLMs.

## What it does

`readme-ai` analyzes your project's source code, folder structure, and git history to generate or update professional `README.md` files. It intelligently gathers context from your files—including recent code changes via `git diff`—and utilizes AI models like Claude 3.5/4.5 or Gemini 1.5/3 to draft documentation that stays in sync with your implementation.

## Why it exists

Writing and maintaining documentation is a repetitive task that often lags behind actual code changes. This tool automates the process by understanding the technical context of your repository, ensuring that your project's first point of contact for developers is always accurate and up-to-date.

## Installation

This project requires [Bun](https://bun.sh).

```bash
bun install
```

## Usage

To generate a README for the current directory:

```bash
bun run dev
```

The tool will output the generated markdown directly to your console.

### GitHub Action

This tool can be integrated into your CI/CD pipeline using the provided `action.yml`. Add it to your workflow to automatically suggest README updates on pull requests.

## Configuration

Configure the tool using environment variables. You can create a `.env` file or set them in your shell.

| Variable             | Description                                                  | Default  |
| -------------------- | ------------------------------------------------------------ | -------- |
| `README_AI_PROVIDER` | AI provider to use (`gemini` or `anthropic`)                 | `gemini` |
| `GEMINI_API_KEY`     | API key from [Google AI Studio](https://aistudio.google.com) | -        |
| `ANTHROPIC_API_KEY`  | API key from Anthropic Console                               | -        |

### Supported Models

- **Google Gemini**: Uses `gemini-3-flash-preview` by default.
- **Anthropic Claude**: Uses `claude-haiku-4-5-20251001` by default.

## How it works

1. **Context Gathering**: Scans the repository for `package.json` metadata, directory hierarchy, and relevant source files (filtering by common extensions).
2. **Change Analysis**: Performs a `git diff` to identify what has changed since the last commit, allowing the AI to focus on updates rather than just initial creation.
3. **Agentic Writing**: Passes the gathered context through a specialized system prompt designed for technical writing, ensuring concise and well-formatted Markdown output.

## How to contribute

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a clear description of your changes.

## License

All rights reserved. (No license specified in `package.json`).
