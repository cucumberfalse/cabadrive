#!/bin/sh
# Capture only the previous release owned by this exact Compose project before
# `docker compose build` can replace its image.  No host Node/pnpm is needed.
set -eu

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="${CABADRIVE_REPOSITORY_ROOT:-$(CDPATH= cd -- "$script_dir/.." && pwd)}"
repo_root="$(CDPATH= cd -- "$repo_root" && pwd -P)"
historical_basename="$(basename "$repo_root")"

# An explicit project name always wins.  On the first upgrade however an older
# Compose installation may have used the checkout basename rather than the new
# cabadrive default.  Discover only resources that carry an exact Compose
# ancestry label for this checkout (or the exact historical image name); a
# service-name match by itself is deliberately not enough authority.
resolve_project() {
  if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
    printf '%s\n' "$COMPOSE_PROJECT_NAME"
    return 0
  fi

  candidates=""
  add_candidate() {
    candidate="$1"
    [ -n "$candidate" ] || return 0
    case "|$candidates|" in
      *"|$candidate|"*) ;;
      *) candidates="${candidates}${candidates:+|}$candidate" ;;
    esac
  }

  containers="$(docker ps -aq --all --filter label=com.docker.compose.service=cabadrive 2>/dev/null || true)"
  for candidate_container in $containers; do
    labels="$(docker inspect --format '{{ index .Config.Labels "com.docker.compose.project" }}|{{ index .Config.Labels "com.docker.compose.project.working_dir" }}|{{ index .Config.Labels "com.docker.compose.project.config_files" }}' "$candidate_container" 2>/dev/null || true)"
    candidate_project="${labels%%|*}"
    remaining="${labels#*|}"
    candidate_workdir="${remaining%%|*}"
    candidate_config="${remaining#*|}"
    owned=""
    if [ "$candidate_workdir" = "$repo_root" ]; then
      owned=1
    else
      case "$candidate_config" in
        *"$repo_root/docker-compose.yml"*) owned=1 ;;
      esac
    fi
    if [ -n "$owned" ]; then
      add_candidate "$candidate_project"
    fi
  done

  # Pre-F051 images have no dependable label.  The exact checkout basename is
  # nevertheless the historical Compose name, but only if its exact image
  # exists.  Do not scan arbitrary similarly named images.
  if docker image inspect --format '{{.Id}}' "${historical_basename}-cabadrive" >/dev/null 2>&1; then
    add_candidate "$historical_basename"
  fi

  candidate_count="$(printf '%s\n' "$candidates" | tr '|' '\n' | sed '/^$/d' | wc -l | tr -d ' ')"
  case "$candidate_count" in
    0) printf '%s\n' cabadrive ;;
    1) printf '%s\n' "$candidates" ;;
    *)
      printf '%s\n' 'ambiguous pre-feature Compose project; set COMPOSE_PROJECT_NAME explicitly' >&2
      return 1
      ;;
  esac
}

if [ "${1:-}" = "--resolve-project" ]; then
  resolve_project
  exit 0
fi

project="$(resolve_project)"
export COMPOSE_PROJECT_NAME="$project"
handoff_base="$repo_root/.cabadrive-release-handoff/$project"
handoff="$handoff_base/current"
state_volume="${project}_release-state"
container="$(COMPOSE_PROJECT_NAME="$project" docker compose -f "$repo_root/docker-compose.yml" ps -aq --all cabadrive | sed -n '1p')"
image=""
source=""
invalid_state=""
source_kind="baked-legacy-root"
capture_fault="${CABADRIVE_CAPTURE_FAULT:-}"

mkdir -p "$handoff_base/releases"

verify_handoff() {
  test -L "$handoff" || return 1
  docker run --rm \
    --mount "type=bind,source=$script_dir,target=/app,readonly" \
    --mount "type=bind,source=$handoff_base,target=/handoff,readonly" \
    node:22-alpine node /app/stage-static-release.mjs legacy-verify --legacy /handoff/current
}

publish_handoff() {
  temporary="$handoff_base/releases/capture-$(date +%s)-$$"
  if [ -n "$capture_fault" ]; then
    set -- --fault "$capture_fault"
  else
    set --
  fi
  cleanup_capture() {
    if [ -n "${temporary:-}" ] && [ -e "$temporary" ]; then
      rm -rf -- "$temporary" || return 1
    fi
    return 0
  }

  if ! mkdir -p "$temporary/assets"; then
    cleanup_capture || true
    return 1
  fi
  if ! copy_legacy_assets "$temporary/assets"; then
    cleanup_capture || true
    return 1
  fi
  if ! printf '%s\n' "$source" >"$temporary/source-id"; then
    cleanup_capture || true
    return 1
  fi
  if ! printf '%s\n' "$source_kind" >"$temporary/source-kind"; then
    cleanup_capture || true
    return 1
  fi
  if ! docker run --rm \
    --mount "type=bind,source=$script_dir,target=/app,readonly" \
    --mount "type=bind,source=$handoff_base,target=/handoff" \
    node:22-alpine node /app/stage-static-release.mjs legacy-write \
      --legacy "/handoff/releases/$(basename "$temporary")" \
      --source-id "$source" --source-kind "$source_kind" "$@"; then
    cleanup_capture || true
    return 1
  fi
  if ! docker run --rm \
    --mount "type=bind,source=$script_dir,target=/app,readonly" \
    --mount "type=bind,source=$handoff_base,target=/handoff" \
    node:22-alpine node /app/stage-static-release.mjs legacy-publish-pointer \
      --handoff /handoff --release "releases/$(basename "$temporary")" \
      "$@"; then
    cleanup_capture || true
    return 1
  fi
}

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

# A handoff is authoritative only when its independently generated canonical
# inventory, source identity, and source kind all revalidate. Preserve it
# rather than laundering rejected /state bytes through a mounted container.
if verify_handoff >/dev/null 2>&1; then
  printf '%s\n' 'validated independent legacy handoff is the retained source'
  exit 0
fi

copy_legacy_assets() {
  destination="$1"
  if [ -n "$container" ]; then
    # Never read /state from a container once the state verifier has rejected
    # that volume; only the baked pre-feature root is an independent source.
    docker cp "$container:/usr/share/nginx/html/assets/." "$destination"
  else
    docker cp "$temporary_container:/usr/share/nginx/html/assets/." "$destination"
  fi
}

if [ -n "$container" ]; then
  source="$container"
elif image="$(docker image inspect --format '{{.Id}}' "${project}-cabadrive" 2>/dev/null || true)"; [ -n "$image" ]; then
  temporary_container="$(docker create "$image")"
  trap 'docker rm -f "$temporary_container" >/dev/null 2>&1 || true' EXIT
  source="$image"
  publish_handoff
  docker rm -f "$temporary_container" >/dev/null
  trap - EXIT
  printf '%s\n' "captured legacy assets from $source"
  exit 0
else
  if [ -n "$invalid_state" ]; then
    printf '%s\n' 'incomplete project release-state has no readable legacy source' >&2
    exit 1
  fi
  printf '%s\n' 'initial-install: no project-scoped legacy release found'
  exit 0
fi

publish_handoff || { printf '%s\n' "legacy capture failed for $source" >&2; exit 1; }
printf '%s\n' "captured legacy assets from $source"
