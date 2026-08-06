#!/usr/bin/env bash
# Pull latest changes, rebuild, and restart the app on the VPS.
# Usage: ./deploy.sh [branch]   (defaults to current branch)
set -euo pipefail

cd "$(dirname "$0")"

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

echo "→ Pulling latest from origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "→ Installing dependencies"
npm install

echo "→ Building"
npm run build

echo "→ Restarting app"
pm2 restart bb-home || pm2 start .output/server/index.mjs --name bb-home

echo "✓ Deployed $(git rev-parse --short HEAD) on branch $BRANCH"
