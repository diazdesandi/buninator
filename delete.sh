#!/usr/bin/env bash
set -euo pipefail

OWNER=diazdesandi
REPO=buninator

# Make sure you're authenticated: gh auth login
gh auth status || { echo "Authenticate with gh"; exit 1; }

# List all workflow runs (paginated) and delete them one by one
gh api --paginate \
  /repos/$OWNER/$REPO/actions/runs \
  -q '.workflow_runs[].id' \
| while read -r run_id; do
    echo "Deleting workflow run ID: $run_id"
    gh api \
      repos/$OWNER/$REPO/actions/runs/$run_id \
      -X DELETE \
      --silent \
      || echo "Failed to delete run $run_id"
  done

echo "Done deleting workflow runs."