# buninator

**buninator** is a CLI tool for promoting configuration files (such as `.json`) to Google Cloud Storage buckets, with built-in preview, deployment, and GitHub Actions integration.

## Features

- Preview configuration changes before deployment
- Deploy files to a GCP bucket with hash verification
- Generate PR summaries and post comments via GitHub Actions
- Artifact-based workflow for safe, auditable deployments

## Getting Started

### Install dependencies

```bash
bun install
```

### Run locally

```bash
bun run index.ts
```

Or, after linking:

```bash
buninator preview main.json
buninator deploy main.json
```

## Usage

### Preview a file

```bash
buninator preview <file>
```

### Deploy a file

```bash
buninator deploy <file>
```

### Generate a PR summary (for CI)

```bash
buninator summary --pr <path-to-pr.json> --files "file1.json file2.json" --run-id <github-run-id>
```

## GitHub Actions Integration

- See `.github/workflows/artifact.yml` for artifact generation on PR merge.
- See `.github/workflows/promote.yml` for deployment using artifacts from previous workflows.

## Configuration

Set your bucket and GitHub token in `.env`:

```
BUCKET_NAME="your-bucket-name"
GH_TOKEN="your-github-token"
```

## Project Structure

- `src/cli/preview.ts` – Preview config changes
- `src/cli/find.ts` - Find Workflow
- `src/cli/deploy.ts` – Deploy config to GCP bucket
- `src/cli/summary.ts` – Generate and post PR summary
- `src/index.ts` – CLI entrypoint

## Requirements

- [Bun](https://bun.sh) runtime
- Google Cloud SDK (for deployment)
- GitHub token for PR comments

---

This project was created using `bun init` in bun v1.2.21.
