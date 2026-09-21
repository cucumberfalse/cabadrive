#!/bin/sh
# Capture only the previous release owned by this exact Compose project before
# `docker compose build` can replace its image.  No host Node/pnpm is needed.
set -eu

project="${COMPOSE_PROJECT_NAME:-$(basename "$PWD")}"
handoff=".cabadrive-release-handoff/$project"
assets="$handoff/assets"
state_volume="${project}_release-state"
container="$(docker compose ps -aq --all cabadrive | sed -n '1p')"
image=""
source=""
invalid_state=""
script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

mkdir -p "$handoff"
rm -rf "$assets"

# A volume name is not evidence of a completed release: failed first stages can
# leave it empty. Validate the exact committed tuple in a throwaway Node
# container, so the end-user path still has no host Node/pnpm dependency.
if docker volume inspect "$state_volume" >/dev/null 2>&1; then
  if docker run --rm \
    --mount "type=volume,source=$state_volume,target=/state,readonly" \
    --mount "type=bind,source=$script_dir/stage-static-release.mjs,target=/app/stage-static-release.mjs,readonly" \
    node:22-alpine node /app/stage-static-release.mjs verify --state /state; then
    printf '%s\n' 'validated project release-state volume is the retained source'
    exit 0
  fi
  invalid_state=1
  printf '%s\n' 'project release-state is incomplete; legacy capture remains required' >&2
fi

if [ -n "$container" ]; then
  source="$container"
  if docker cp "$container:/state/assets/." "$assets" 2>/dev/null; then :; else
    docker cp "$container:/usr/share/nginx/html/assets/." "$assets"
  fi
elif image="$(docker image inspect --format '{{.Id}}' "${project}-cabadrive" 2>/dev/null || true)"; [ -n "$image" ]; then
  temporary="$(docker create "$image")"
  trap 'docker rm -f "$temporary" >/dev/null 2>&1 || true' EXIT
  source="$image"
  if docker cp "$temporary:/state/assets/." "$assets" 2>/dev/null; then :; else
    # Pre-feature images contain the original build rather than release state.
    docker cp "$temporary:/usr/share/nginx/html/assets/." "$assets"
  fi
  docker rm -f "$temporary" >/dev/null
  trap - EXIT
else
  if [ -n "$invalid_state" ]; then
    printf '%s\n' 'incomplete project release-state has no readable legacy source' >&2
    exit 1
  fi
  printf '%s\n' 'initial-install: no project-scoped legacy release found'
  exit 0
fi

test -d "$assets" || { printf '%s\n' "legacy capture failed for $source" >&2; exit 1; }
printf '%s\n' "$source" >"$handoff/source-id"
printf '%s\n' "captured legacy assets from $source"
