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
PUBLIC_URL="bb.digilatics.co"

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

# ------------------------------------------------------------------- pull code
# This checkout is a deploy target, not a workspace: whatever origin says is the
# truth. Tracked local edits are discarded (npm rewriting package-lock.json, a
# stray hotfix, a file-mode flip) so a deploy can never wedge on a dirty tree.
log "Fetching origin/$BRANCH"
git fetch origin "$BRANCH"

if ! git diff --quiet HEAD -- || ! git diff --cached --quiet; then
  echo "  discarding local changes to tracked files:"
  git status --short | sed 's/^/    /'
fi

git checkout -q "$BRANCH" 2>/dev/null || git checkout -q -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
echo "  now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# --------------------------------------------------------------- dependencies
log "Installing dependencies"
# `npm ci` is preferred (exact, reproducible), but this repo's package-lock.json
# has 28 entries flagged "extraneous" — including the whole esbuild subtree —
# because it was written from a polluted node_modules instead of resolved from
# package.json. npm treats children of an extraneous node as hard requirements,
# so `npm ci` tries to install @esbuild/aix-ppc64 on linux/x64 and dies with
# EBADPLATFORM. `npm install` re-resolves per-platform and works. The fallback
# self-heals: once the lockfile is regenerated cleanly, `npm ci` takes over.
if [ -f package-lock.json ] && npm ci --no-audit --no-fund; then
  echo "  installed from package-lock.json (npm ci)"
else
  echo "  npm ci unusable — falling back to npm install (see comment above)"
  npm install --no-audit --no-fund
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

# The node app on 127.0.0.1:$APP_PORT is what we just deployed. The public URL is
# whatever the CloudPanel vhost proxies to. If the two disagree, the vhost (or a
# cache) is serving something else and no amount of rebuilding will change it.
# --compressed matters: without it curl prints gzip bytes and grep says "binary
# file matches" instead of showing the title.
local_code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/" 2>/dev/null || echo 000)"
local_title="$(curl -fsS --compressed "http://127.0.0.1:$APP_PORT/" 2>/dev/null \
  | grep -o -m1 '<title>[^<]*</title>' || echo '(no title)')"
echo "  local  127.0.0.1:$APP_PORT  HTTP $local_code  $local_title"

if [ "$local_code" = "000" ]; then
  printf '  \033[1;33m! App is not answering on 127.0.0.1:%s — run: pm2 logs %s --lines 50\033[0m\n' \
    "$APP_PORT" "$APP_NAME"
fi

public_code="$(curl -fsS -o /dev/null -w '%{http_code}' "https://$PUBLIC_URL/" 2>/dev/null || echo 000)"
public_title="$(curl -fsS --compressed "https://$PUBLIC_URL/" 2>/dev/null \
  | grep -o -m1 '<title>[^<]*</title>' || echo '(no title)')"
echo "  public $PUBLIC_URL  HTTP $public_code  $public_title"

if [ "$local_title" != "$public_title" ]; then
  printf '  \033[1;33m! Local and public HTML differ: the vhost is not proxying to port %s,\n' "$APP_PORT"
  printf '    or a cache/CDN sits in front. Check CloudPanel > Vhost for\n'
  printf '    "proxy_pass http://127.0.0.1:%s;" and purge any Cloudflare cache.\033[0m\n' "$APP_PORT"
fi

printf '\n\033[1;32m✓ Deployed %s (%s) → https://%s\033[0m\n' \
  "$(git rev-parse --short HEAD)" "$BRANCH" "$PUBLIC_URL"
