#!/bin/sh
# Capture only the previous release owned by this exact Compose project before
# `docker compose build` can replace its image.  No host Node/pnpm is needed.
set -eu

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="${CABADRIVE_REPOSITORY_ROOT:-$(CDPATH= cd -- "$script_dir/.." && pwd)}"
repo_root="$(CDPATH= cd -- "$repo_root" && pwd -P)"
historical_basename="$(basename "$repo_root")"
adopted_project_file="$repo_root/.cabadrive-release-handoff/.adopted-project"
# Preserve this fact before resolve_project exports the selected value below.
# A discovered historical identity must not look caller-provided afterward.
compose_project_name_explicit=0
if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
  compose_project_name_explicit=1
fi

is_post_feature_runtime_image() {
  docker image inspect \
    --format '{{ index .Config.Labels "com.cabadrive.release-state-runtime" }}' \
    "$1" 2>/dev/null | grep -qx 'true'
}

validate_project_name() {
  case "$1" in
    [a-z0-9]*) ;;
    *)
      printf '%s\n' 'Compose project name must be one safe lowercase path component' >&2
      return 1
      ;;
  esac
  case "$1" in
    *[!a-z0-9_-]*)
      printf '%s\n' 'Compose project name must be one safe lowercase path component' >&2
      return 1
      ;;
  esac
}

# An explicit project name always wins.  On the first upgrade however an older
# Compose installation may have used the checkout basename rather than the new
# cabadrive default.  Discover only resources that carry an exact Compose
# ancestry label for this checkout (or the exact historical image name); a
# service-name match by itself is deliberately not enough authority.
resolve_project() {
  if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
    validate_project_name "$COMPOSE_PROJECT_NAME" || return 1
    printf '%s\n' "$COMPOSE_PROJECT_NAME"
    return 0
  fi

  if [ -e "$adopted_project_file" ] || [ -L "$adopted_project_file" ]; then
    if [ -L "$adopted_project_file" ] || [ ! -f "$adopted_project_file" ]; then
      printf '%s\n' 'persisted Compose project identity is unsafe' >&2
      return 1
    fi
    adopted_project="$(cat "$adopted_project_file" 2>/dev/null || true)"
    validate_project_name "$adopted_project" || return 1
    printf '%s\n' "$adopted_project"
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
  # nevertheless the historical Compose name, but only if its exact pre-F051
  # image exists.  A labelled runtime image may have been produced by this
  # checkout's new build and must not resurrect an obsolete project name.
  # Do not scan arbitrary similarly named images.
  if docker image inspect --format '{{.Id}}' "${historical_basename}-cabadrive" >/dev/null 2>&1; then
    if ! is_post_feature_runtime_image "${historical_basename}-cabadrive"; then
      add_candidate "$historical_basename"
    fi
  fi

  candidate_count="$(printf '%s\n' "$candidates" | tr '|' '\n' | sed '/^$/d' | wc -l | tr -d ' ')"
  case "$candidate_count" in
    0) candidate=cabadrive ;;
    1) candidate="$candidates" ;;
    *)
      printf '%s\n' 'ambiguous pre-feature Compose project; set COMPOSE_PROJECT_NAME explicitly' >&2
      return 1
      ;;
  esac
  validate_project_name "$candidate" || return 1
  printf '%s\n' "$candidate"
}

if [ "${1:-}" = "--resolve-project" ]; then
  resolve_project
  exit 0
fi

project="$(resolve_project)"
export COMPOSE_PROJECT_NAME="$project"
handoff_parent="$repo_root/.cabadrive-release-handoff"
if [ -L "$handoff_parent" ] || { [ -e "$handoff_parent" ] && [ ! -d "$handoff_parent" ]; }; then
  printf '%s\n' 'legacy handoff root is not a repository-owned directory' >&2
  exit 1
fi
if [ ! -e "$handoff_parent" ] && ! mkdir -p "$handoff_parent"; then
  printf '%s\n' 'failed to create repository-owned legacy handoff root' >&2
  exit 1
fi
handoff_parent="$(CDPATH= cd -- "$handoff_parent" && pwd -P)"
if [ "$handoff_parent" != "$repo_root/.cabadrive-release-handoff" ]; then
  printf '%s\n' 'legacy handoff root escapes the repository' >&2
  exit 1
fi
if [ "$compose_project_name_explicit" -eq 0 ] && [ "$project" != "cabadrive" ]; then
  identity_temporary="$handoff_parent/.adopted-project.next-$$"
  printf '%s\n' "$project" >"$identity_temporary" && mv -f "$identity_temporary" "$adopted_project_file" || {
    rm -f "$identity_temporary"
    printf '%s\n' 'failed to persist adopted Compose project identity' >&2
    exit 1
  }
fi
handoff_base="$handoff_parent/$project"
case "$handoff_base" in
  "$handoff_parent"/*) ;;
  *)
    printf '%s\n' 'legacy handoff project escapes the repository-owned root' >&2
    exit 1
    ;;
esac
# A safe project name is not enough if an existing handoff child itself points
# elsewhere. Validate it before mkdir, Docker bind mounts, or any capture
# writes can follow a symlink outside this repository-owned handoff root.
if [ -e "$handoff_base" ] || [ -L "$handoff_base" ]; then
  if [ -L "$handoff_base" ] || [ ! -d "$handoff_base" ]; then
    printf '%s\n' 'legacy handoff project is not a repository-owned directory' >&2
    exit 1
  fi
  handoff_base_real="$(CDPATH= cd -- "$handoff_base" && pwd -P)"
  case "$handoff_base_real" in
    "$handoff_parent"/*) ;;
    *)
      printf '%s\n' 'legacy handoff project escapes the repository-owned root' >&2
      exit 1
      ;;
  esac
  handoff_base="$handoff_base_real"
fi
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
  release_relative="releases/$(basename "$temporary")"
  pointer_publication_started=""
  if [ -n "$capture_fault" ]; then
    set -- --fault "$capture_fault"
  else
    set --
  fi
  cleanup_capture() {
    if [ -n "${temporary:-}" ] && [ -e "$temporary" ]; then
      # Pointer publication can fail after its rename but before a rollback is
      # known durable. Never remove the captured release while current still
      # names it; a failed readlink is likewise inconclusive and is retained.
      if [ -n "$pointer_publication_started" ] && [ -L "$handoff" ]; then
        if current_target="$(readlink "$handoff" 2>/dev/null)"; then
          if [ "$current_target" = "$release_relative" ]; then
            return 0
          fi
        else
          return 0
        fi
      fi
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
      --legacy "/handoff/$release_relative" \
      --handoff /handoff \
      --source-id "$source" --source-kind "$source_kind" "$@"; then
    cleanup_capture || true
    return 1
  fi
  pointer_publication_started=1
  if ! docker run --rm \
    --mount "type=bind,source=$script_dir,target=/app,readonly" \
    --mount "type=bind,source=$handoff_base,target=/handoff" \
    node:22-alpine node /app/stage-static-release.mjs legacy-publish-pointer \
      --handoff /handoff --release "$release_relative" \
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

if [ -n "$container" ]; then
  source="$container"
elif image="$(docker image inspect --format '{{.Id}}' "${project}-cabadrive" 2>/dev/null || true)"; [ -n "$image" ]; then
  if is_post_feature_runtime_image "${project}-cabadrive"; then
    if [ -n "$invalid_state" ]; then
      printf '%s\n' 'incomplete project release-state has no readable legacy source' >&2
      exit 1
    fi
    printf '%s\n' 'initial-install: current runtime image has no pre-feature legacy assets'
    exit 0
  fi
  source="$image"
fi

# A handoff is authoritative only when its independently generated canonical
# inventory and exact source identity revalidate against the outgoing legacy
# container/image. A replaced A source must be captured again before staging.
if [ -n "$source" ] && verify_handoff >/dev/null 2>&1 &&
  [ "$(cat "$handoff/source-id" 2>/dev/null || true)" = "$source" ] &&
  [ "$(cat "$handoff/source-kind" 2>/dev/null || true)" = "$source_kind" ]; then
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

if [ -z "$source" ]; then
  if [ -n "$invalid_state" ]; then
    printf '%s\n' 'incomplete project release-state has no readable legacy source' >&2
    exit 1
  fi
  printf '%s\n' 'initial-install: no project-scoped legacy release found'
  exit 0
fi

if [ -z "$container" ]; then
  temporary_container="$(docker create "$image")"
  trap 'docker rm -f "$temporary_container" >/dev/null 2>&1 || true' EXIT
fi
publish_handoff || { printf '%s\n' "legacy capture failed for $source" >&2; exit 1; }
if [ -z "$container" ]; then
  docker rm -f "$temporary_container" >/dev/null
  trap - EXIT
fi
printf '%s\n' "captured legacy assets from $source"
