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

# Absolute path to this script, resolved before any cd, so it stays valid for the
# self-update re-exec below.
SELF="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"

# Always run from the directory this script lives in.
cd "$(dirname "$SELF")"

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
self_before="$(md5sum "$SELF" | cut -d' ' -f1)"
git fetch origin "$BRANCH"

if ! git diff --quiet HEAD -- || ! git diff --cached --quiet; then
  echo "  discarding local changes to tracked files:"
  git status --short | sed 's/^/    /'
fi

git checkout -q "$BRANCH" 2>/dev/null || git checkout -q -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
echo "  now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

# The reset may have just replaced THIS script. Bash reads a script lazily, so the
# rest of the run would execute a mix of the old parsed body and new bytes at a
# stale offset — silently skipping logic that the new version added. Re-exec once
# so the remainder of the deploy runs entirely from the updated script.
if [ "$(md5sum "$SELF" | cut -d' ' -f1)" != "$self_before" ] && [ "${DEPLOY_REEXEC:-}" != "1" ]; then
  echo "  deploy.sh itself was updated — re-executing the new version"
  DEPLOY_REEXEC=1 exec bash "$SELF" "$BRANCH"
fi

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
# whatever the nginx vhost proxies to. If the two disagree, the vhost is pointing
# somewhere else and no amount of rebuilding will change what visitors see.
#
# grep needs BOTH flags here. --compressed so curl decodes gzip/brotli, and -a
# because this SSR HTML is one enormous line with no terminator, which grep
# otherwise reports as "binary file matches" — returning an empty title and
# making the comparison below silently pass by comparing "" to "".
# head -1 is required as well as -m1: -m1 stops after the first matching LINE, and
# this whole page is one line, so every match on it would otherwise be printed.
page_title() {
  curl -fsS --compressed "$1" 2>/dev/null \
    | grep -ao '<title>[^<]*</title>' \
    | head -1 | sed -e 's/<[^>]*>//g' || true
}

# A fingerprint of the built client bundle. Titles rarely change between deploys,
# so they are a weak signal; the hashed asset filenames change on every build and
# prove whether the HTML being served came from this build or an older one.
page_asset() {
  curl -fsS --compressed "$1" 2>/dev/null \
    | grep -ao '/assets/index-[A-Za-z0-9_-]*\.js' \
    | head -1 || true
}

built_asset="$(grep -ao -m1 'index-[A-Za-z0-9_-]*\.js' .output/public/index.html 2>/dev/null \
  || ls .output/public/assets/ 2>/dev/null | grep -o -m1 'index-[A-Za-z0-9_-]*\.js' || echo '?')"
echo "  built bundle: $built_asset"

local_code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/" 2>/dev/null || echo 000)"
local_title="$(page_title "http://127.0.0.1:$APP_PORT/")"
local_asset="$(page_asset "http://127.0.0.1:$APP_PORT/")"
echo "  local  127.0.0.1:$APP_PORT  HTTP $local_code  ${local_asset:-no-bundle}  ${local_title:-(no title)}"

if [ "$local_code" = "000" ]; then
  printf '  \033[1;33m! App is not answering on 127.0.0.1:%s — run: pm2 logs %s --lines 50\033[0m\n' \
    "$APP_PORT" "$APP_NAME"
fi

public_code="$(curl -fsS -o /dev/null -w '%{http_code}' "https://$PUBLIC_URL/" 2>/dev/null || echo 000)"
public_title="$(page_title "https://$PUBLIC_URL/")"
public_asset="$(page_asset "https://$PUBLIC_URL/")"
echo "  public $PUBLIC_URL  HTTP $public_code  ${public_asset:-no-bundle}  ${public_title:-(no title)}"

# Compare bundle fingerprints, not titles. If the public site serves a different
# hashed bundle than the one just built, visitors are not getting this deploy.
if [ -n "$local_asset" ] && [ "$local_asset" != "$public_asset" ]; then
  printf '\n  \033[1;31m! The public site is NOT serving this build.\033[0m\n'
  printf '    local  %s\n    public %s\n\n' "$local_asset" "$public_asset"
  printf '    The app on 127.0.0.1:%s is correct, so nginx is sending visitors\n' "$APP_PORT"
  printf '    somewhere else. Which port does the vhost actually target?\n\n'
  for conf in /etc/nginx/sites-enabled/"$PUBLIC_URL".conf \
              /etc/nginx/sites-enabled/"$PUBLIC_URL" \
              /home/*/conf/nginx/*"$PUBLIC_URL"*; do
    [ -f "$conf" ] || continue
    printf '    %s\n' "$conf"
    grep -nE 'proxy_pass|root ' "$conf" 2>/dev/null | sed 's/^/      /'
  done
  printf '\n    Fix the port in CloudPanel > Vhost (or the file above), then:\n'
  printf '      nginx -t && systemctl reload nginx\n'
elif [ "$public_code" = "200" ]; then
  printf '  \033[1;32m  public site is serving this build\033[0m\n'
fi

printf '\n\033[1;32m✓ Deployed %s (%s) → https://%s\033[0m\n' \
  "$(git rev-parse --short HEAD)" "$BRANCH" "$PUBLIC_URL"
