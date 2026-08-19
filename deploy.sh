#!/usr/bin/env bash
#
# Deploy script for bb.digilatics.co (TanStack Start + Nitro node-server)
#
#   Server  : /home/digilatics-bb/htdocs/bb.digilatics.co
#   Repo    : https://github.com/website-a11y/BB-home
#   Node    : 22 LTS
#   App port: 3009  (must match the "App Port" in CloudPanel > Node.js Settings)
#
# Usage:
#   ./deploy.sh              # deploy the current branch (default: main)
#   ./deploy.sh main         # deploy a specific branch
#
set -euo pipefail

# ---------------------------------------------------------------- configuration
APP_NAME="bb-home"
APP_PORT="3009"
APP_HOST="0.0.0.0"
ENTRY=".output/server/index.mjs"

# Always run from the directory this script lives in.
cd "$(dirname "$0")"

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

log()  { printf '\n\033[1;36m→ %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# ------------------------------------------------------------------ pre-flight
log "Pre-flight checks"
command -v git  >/dev/null || fail "git is not installed"
command -v node >/dev/null || fail "node is not installed"
command -v npm  >/dev/null || fail "npm is not installed"
command -v pm2  >/dev/null || fail "pm2 is not installed  (fix: npm install -g pm2)"

echo "  node   $(node -v)"
echo "  npm    $(npm -v)"
echo "  branch $BRANCH"
echo "  dir    $(pwd)"

# Refuse to deploy on top of uncommitted local edits — they would be lost or
# would make `git pull` fail halfway through.
if ! git diff --quiet || ! git diff --cached --quiet; then
  git status --short
  fail "Uncommitted changes in the working tree. Commit, stash, or 'git checkout .' first."
fi

# ------------------------------------------------------------------- pull code
log "Fetching origin/$BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
echo "  now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# --------------------------------------------------------------- dependencies
log "Installing dependencies"
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

# --------------------------------------------------------------------- build
log "Building production bundle"
rm -rf .output
NODE_ENV=production npm run build

[ -f "$ENTRY" ] || fail "Build finished but $ENTRY is missing. Check the build output above."
echo "  built $ENTRY"

# --------------------------------------------------------------------- restart
log "Starting/restarting '$APP_NAME' on port $APP_PORT"
export NODE_ENV=production
export PORT="$APP_PORT"
export HOST="$APP_HOST"

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start "$ENTRY" --name "$APP_NAME" --time
fi

pm2 save >/dev/null
sleep 3

# ---------------------------------------------------------------- health check
log "Health check"
pm2 list | grep -E "id|$APP_NAME" || true

if curl -fsS -o /dev/null -w '  HTTP %{http_code} from http://127.0.0.1:%s\n' \
     "http://127.0.0.1:$APP_PORT/" 2>/dev/null; then
  :
else
  printf '  \033[1;33m! No response on 127.0.0.1:%s — check logs: pm2 logs %s --lines 50\033[0m\n' \
    "$APP_PORT" "$APP_NAME"
fi

printf '\n\033[1;32m✓ Deployed %s (%s) → https://bb.digilatics.co\033[0m\n' \
  "$(git rev-parse --short HEAD)" "$BRANCH"
