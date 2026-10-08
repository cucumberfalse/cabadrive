#!/bin/sh
# Capture only the previous release owned by this exact Compose project before
# `docker compose build` can replace its image.  No host Node/pnpm is needed.
set -eu

# Command substitution removes trailing LF. Keep one non-path sentinel after
# the command's framing newline, then remove exactly those framing bytes.
capture_newline='
'
canonical_directory() {
  canonical_directory_result="$(CDPATH= cd -- "$1" && pwd -P && printf '.')" || return 1
  canonical_directory_result="${canonical_directory_result%.}"
  canonical_directory_result="${canonical_directory_result%"$capture_newline"}"
}
case "$0" in */*) entry_directory="${0%/*}" ;; *) entry_directory=. ;; esac
[ -n "$entry_directory" ] || entry_directory=/
canonical_directory "$entry_directory" || exit 1
script_dir="$canonical_directory_result"
canonical_directory "${CABADRIVE_REPOSITORY_ROOT:-$script_dir/..}" || exit 1
repo_root="$canonical_directory_result"
# Compose resolves its schema relative to a file URL; C0/DEL checkout bytes
# are unsupported upstream. Reject before any discovery or handoff mutation.
checkout_printable="$(printf '%s' "$repo_root" | LC_ALL=C tr -d '\000-\037\177' && printf '.')" || exit 1
checkout_printable="${checkout_printable%.}"
if [ "$checkout_printable" != "$repo_root" ]; then
  printf '%s\n' 'Compose checkout path contains unsupported control characters; no discovery or mutation performed' >&2
  exit 1
fi

historical_basename="${repo_root##*/}"

# --mount uses CSV, independently of shell quoting. Quote the entire source
# field and double embedded quotes, preserving commas and literal whitespace.
bind_mount() {
  mount_remaining="$1"
  mount_prefix=""
  while :; do
    case "$mount_remaining" in
      *\"*)
        mount_prefix="${mount_prefix}${mount_remaining%%\"*}\"\""
        mount_remaining="${mount_remaining#*\"}"
        ;;
      *) break ;;
    esac
  done
  printf 'type=bind,"source=%s%s",target=%s%s' "$mount_prefix" "$mount_remaining" "$2" "${3:-}"
}

inspect_compose_label() {
  inspected_label="$(docker inspect --format "{{ index .Config.Labels \"$1\" }}" "$2" 2>/dev/null && printf '.')" || return 1
  inspected_label="${inspected_label%.}"
  inspected_label="${inspected_label%"$capture_newline"}"
}
adopted_project_file="$repo_root/.cabadrive-release-handoff/.adopted-project"
# Preserve this fact before resolve_project exports the selected value below.
# A discovered historical identity must not look caller-provided afterward.
compose_project_name_explicit=0
if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
  compose_project_name_explicit=1
fi
adoption_fault="${CABADRIVE_ADOPTION_FAULT:-}"

# Return 0 only for the exact post-feature marker, 1 only when a successful
# Docker inspection proves the marker is absent, and 2 for all unsafe states.
# Do not pipe this probe through grep: a failed image inspect must not look like
# an unlabeled legacy image merely because grep received no input.
classify_runtime_label() {
  if runtime_label="$(
    docker image inspect \
      --format '{{ index .Config.Labels "com.cabadrive.release-state-runtime" }}' \
      "$1" 2>&1
  )"; then
    case "$runtime_label" in
      true) return 0 ;;
      '') return 1 ;;
      *)
        printf '%s\n' "unexpected project runtime label: $runtime_label" >&2
        return 2
        ;;
    esac
  fi
  printf '%s\n' "$runtime_label" >&2
  printf '%s\n' 'failed to inspect project runtime label' >&2
  return 2
}

# Return 0 with the image ID, 1 only for Docker's explicit not-found result,
# and 2 for every other inspect failure. Callers must not mistake a daemon or
# permission failure for a clean install.
inspect_runtime_image() {
  if inspect_output="$(docker image inspect --format '{{.Id}}' "$1" 2>&1)"; then
    printf '%s\n' "$inspect_output"
    return 0
  fi
  case "$inspect_output" in
    *"No such image"*|*"No such object"*) return 1 ;;
    *)
      printf '%s\n' "$inspect_output" >&2
      printf '%s\n' 'failed to inspect project runtime image' >&2
      return 2
      ;;
  esac
}

is_safe_project_name() {
  case "$1" in
    [a-z0-9]*) ;;
    *) return 1 ;;
  esac
  case "$1" in
    *[!a-z0-9_-]*) return 1 ;;
  esac
}

validate_project_name() {
  if ! is_safe_project_name "$1"; then
    printf '%s\n' 'Compose project name must be one safe lowercase path component' >&2
    return 1
  fi
}

# Every resolver branch may later trust or bind-mount this root. Validate every
# existing entry before explicit/adopted/discovered selection or any Docker
# query; only an absent root may be created later by capture.
validate_existing_handoff_parent() {
  handoff_parent="$repo_root/.cabadrive-release-handoff"
  if [ ! -e "$handoff_parent" ] && [ ! -L "$handoff_parent" ]; then
    return 0
  fi
  if [ -L "$handoff_parent" ] || [ ! -d "$handoff_parent" ]; then
    printf '%s\n' 'legacy handoff root is not a repository-owned directory' >&2
    return 1
  fi
  canonical_directory "$handoff_parent" || {
    printf '%s\n' 'legacy handoff root is not accessible' >&2
    return 1
  }
  handoff_parent_real="$canonical_directory_result"
  if [ "$handoff_parent_real" != "$handoff_parent" ]; then
    printf '%s\n' 'legacy handoff root escapes the repository' >&2
    return 1
  fi
  handoff_parent="$handoff_parent_real"
}

# Dynamic reachability over comma boundaries finds every actual file-list
# interpretation in quadratic probes, including commas inside each pathname.
# Numeric boundary IDs are safe to serialize; path bytes remain shell values.
config_has_multiple_file_partition() (
  partition_starts="$1"
  partition_start=0
  partition_reachable="|0|"
  while :; do
    case "$partition_reachable" in
      *"|$partition_start|"*)
        partition_remaining="$partition_starts"
        partition_prefix=""
        partition_end="$partition_start"
        while :; do
          case "$partition_remaining" in
            *,*) partition_piece="${partition_remaining%%,*}"; partition_remaining="${partition_remaining#*,}"; partition_done="" ;;
            *) partition_piece="$partition_remaining"; partition_done=1 ;;
          esac
          if [ "$partition_end" -eq "$partition_start" ]; then partition_prefix="$partition_piece"; else partition_prefix="$partition_prefix,$partition_piece"; fi
          partition_end=$((partition_end + 1))
          case "$partition_prefix" in
            /*)
              if [ -f "$partition_prefix" ]; then
                if [ -n "$partition_done" ] && [ "$partition_start" -gt 0 ]; then return 0; fi
                if [ -z "$partition_done" ]; then partition_reachable="$partition_reachable$partition_end|"; fi
              fi
              ;;
          esac
          [ -z "$partition_done" ] || break
        done
        ;;
    esac
    case "$partition_starts" in
      *,*) partition_starts="${partition_starts#*,}"; partition_start=$((partition_start + 1)) ;;
      *) return 1 ;;
    esac
  done
)

# Compose's config_files is an unescaped comma-joined scalar, not an array.
# The entire exact single path is safe, including comma-bearing filenames.
# Multi-file fallback requires existing whole paths with no alternate grouped
# pathname interpretation; an ambiguous relevant record must never mean empty.
config_list_contains_checkout_compose() {
  expected_compose="$repo_root/docker-compose.yml"
  if [ "$1" = "$expected_compose" ]; then
    # Even the entire exact scalar may also encode multiple real files.
    # Preserve a single comma pathname only without that alternative authority.
    if config_has_multiple_file_partition "$1"; then return 2; fi
    return 0
  fi
  case "$repo_root" in
    *,*)
      case "$1" in *"$repo_root"*) return 2 ;; *) return 1 ;; esac
      ;;
  esac
  config_files_remaining="$1"
  config_found=""
  config_alternative=""
  while :; do
    case "$config_files_remaining" in
      *,*) config_file="${config_files_remaining%%,*}"; config_files_remaining="${config_files_remaining#*,}"; config_done="" ;;
      *) config_file="$config_files_remaining"; config_done=1 ;;
    esac
    [ "$config_file" != "$expected_compose" ] || config_found=1
    if [ -f "$config_file" ] && [ "${config_file%/*}" = "$repo_root" ]; then config_alternative=1; fi
    [ -z "$config_done" ] || break
  done
  if [ -z "$config_found" ]; then
    [ -z "$config_alternative" ] || return 2
    return 1
  fi
  config_suffix="$1"
  while :; do
    config_group_remaining="$config_suffix"
    config_group=""
    config_group_count=0
    while :; do
      case "$config_group_remaining" in
        *,*) config_file="${config_group_remaining%%,*}"; config_group_remaining="${config_group_remaining#*,}"; config_done="" ;;
        *) config_file="$config_group_remaining"; config_done=1 ;;
      esac
      case "$config_file" in /*) ;; *) return 2 ;; esac
      [ -f "$config_file" ] || return 2
      config_group="${config_group}${config_group:+,}$config_file"
      config_group_count=$((config_group_count + 1))
      if [ "$config_group_count" -gt 1 ] && { [ -e "$config_group" ] || [ -L "$config_group" ]; }; then return 2; fi
      [ -z "$config_done" ] || break
    done
    case "$config_suffix" in *,*) config_suffix="${config_suffix#*,}" ;; *) break ;; esac
  done
  return 0
}

# Root containment does not make a selected project child safe. Every resolver
# branch returns through here before a resolve-only caller can bind it or a
# capture path can publish adoption beneath it.
validate_selected_handoff_project() {
  selected_project="$1"
  if [ ! -e "$handoff_parent" ] && [ ! -L "$handoff_parent" ]; then
    return 0
  fi
  selected_handoff="$handoff_parent/$selected_project"
  if [ ! -e "$selected_handoff" ] && [ ! -L "$selected_handoff" ]; then
    return 0
  fi
  if [ -L "$selected_handoff" ] || [ ! -d "$selected_handoff" ]; then
    printf '%s\n' 'legacy handoff project is not a repository-owned directory' >&2
    return 1
  fi
  canonical_directory "$selected_handoff" || {
    printf '%s\n' 'legacy handoff project is not accessible' >&2
    return 1
  }
  selected_handoff_real="$canonical_directory_result"
  if [ "${selected_handoff_real%/*}" != "$handoff_parent" ]; then
    printf '%s\n' 'legacy handoff project escapes the repository-owned root' >&2
    return 1
  fi
}

select_project() {
  validate_project_name "$1" || return 1
  validate_selected_handoff_project "$1" || return 1
  printf '%s\n' "$1"
}

verify_adopted_project() {
  docker run --rm \
    --mount "$(bind_mount "$handoff_parent" "/handoff" "")" \
    --mount "$(bind_mount "$script_dir/stage-static-release.mjs" "/app/stage-static-release.mjs" ",readonly")" \
    node:22-alpine node /app/stage-static-release.mjs adopted-project-verify \
      --handoff /handoff
}

publish_adopted_project() {
  if [ -n "$adoption_fault" ]; then
    set -- --fault "$adoption_fault"
  else
    set --
  fi
  docker run --rm \
    --mount "$(bind_mount "$handoff_parent" "/handoff" "")" \
    --mount "$(bind_mount "$script_dir/stage-static-release.mjs" "/app/stage-static-release.mjs" ",readonly")" \
    node:22-alpine node /app/stage-static-release.mjs adopted-project-write \
      --handoff /handoff --project "$project" "$@"
}

# An explicit project name always wins.  On the first upgrade however an older
# Compose installation may have used the checkout basename rather than the new
# cabadrive default.  Discover only resources that carry an exact Compose
# ancestry label for this checkout (or the exact historical image name); a
# service-name match by itself is deliberately not enough authority.
resolve_project() {
  validate_existing_handoff_parent || return 1

  if [ -n "${COMPOSE_PROJECT_NAME:-}" ]; then
    select_project "$COMPOSE_PROJECT_NAME"
    return $?
  fi

  if [ -e "$adopted_project_file" ] || [ -L "$adopted_project_file" ]; then
    if [ -L "$adopted_project_file" ] || [ ! -f "$adopted_project_file" ]; then
      printf '%s\n' 'persisted Compose project identity is unsafe' >&2
      return 1
    fi
    if ! adopted_project="$(verify_adopted_project)"; then
      printf '%s\n' 'persisted Compose project identity is not durably verified' >&2
      return 1
    fi
    select_project "$adopted_project"
    return $?
  fi

  candidates=""
  add_candidate() {
    candidate="$1"
    validate_project_name "$candidate" || return 1
    case "|$candidates|" in
      *"|$candidate|"*) ;;
      *) candidates="${candidates}${candidates:+|}$candidate" ;;
    esac
  }

  if ! containers="$(docker ps -aq --all --filter label=com.docker.compose.service=cabadrive 2>/dev/null)"; then
    printf '%s\n' 'failed to discover existing Compose containers' >&2
    return 1
  fi
  for candidate_container in $containers; do
    if ! inspect_compose_label com.docker.compose.project "$candidate_container"; then
      printf '%s\n' 'failed to inspect existing Compose container project' >&2
      return 1
    fi
    candidate_project="$inspected_label"
    if ! inspect_compose_label com.docker.compose.project.working_dir "$candidate_container"; then
      printf '%s\n' 'failed to inspect existing Compose container working directory' >&2
      return 1
    fi
    candidate_workdir="$inspected_label"
    if ! inspect_compose_label com.docker.compose.project.config_files "$candidate_container"; then
      printf '%s\n' 'failed to inspect existing Compose container configuration files' >&2
      return 1
    fi
    candidate_config="$inspected_label"
    owned=""
    if [ "$candidate_workdir" = "$repo_root" ]; then
      owned=1
    else
      if config_list_contains_checkout_compose "$candidate_config"; then
        owned=1
      else
        config_status=$?
        if [ "$config_status" -eq 2 ]; then
          printf '%s\n' 'ambiguous Compose configuration ancestry; exact working directory or explicit project is required' >&2
          return 1
        fi
      fi
    fi
    if [ -n "$owned" ]; then
      add_candidate "$candidate_project" || return 1
    fi
  done

  # Pre-F051 images have no dependable label.  The exact checkout basename is
  # nevertheless the historical Compose name, but only if its exact pre-F051
  # image exists.  A labelled runtime image may have been produced by this
  # checkout's new build and must not resurrect an obsolete project name.
  # Do not scan arbitrary similarly named images.
  if is_safe_project_name "$historical_basename"; then
    if historical_image="$(inspect_runtime_image "${historical_basename}-cabadrive")"; then
      if classify_runtime_label "${historical_basename}-cabadrive"; then
        :
      else
        runtime_label_status=$?
        if [ "$runtime_label_status" -eq 1 ]; then
          add_candidate "$historical_basename" || return 1
        else
          return 1
        fi
      fi
    else
      historical_status=$?
      if [ "$historical_status" -ne 1 ]; then
        return 1
      fi
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
  select_project "$candidate"
}

if [ "${1:-}" = "--resolve-project" ]; then
  resolve_project
  exit 0
fi

project="$(resolve_project)"
export COMPOSE_PROJECT_NAME="$project"
# Do not let a pipeline mask the Compose lookup status. A failed lookup is not
# equivalent to an empty project and must not fall through to image discovery
# or create any handoff state.
if ! compose_ps_output="$(COMPOSE_PROJECT_NAME="$project" docker compose -f "$repo_root/docker-compose.yml" ps -aq --all cabadrive 2>&1)"; then
  printf '%s\n' "$compose_ps_output" >&2
  printf '%s\n' 'failed to discover project Compose container' >&2
  exit 1
fi
container="$(printf '%s\n' "$compose_ps_output" | sed -n '1p')"
handoff_parent="$repo_root/.cabadrive-release-handoff"
if [ -L "$handoff_parent" ] || { [ -e "$handoff_parent" ] && [ ! -d "$handoff_parent" ]; }; then
  printf '%s\n' 'legacy handoff root is not a repository-owned directory' >&2
  exit 1
fi
if [ ! -e "$handoff_parent" ] && ! mkdir -p "$handoff_parent"; then
  printf '%s\n' 'failed to create repository-owned legacy handoff root' >&2
  exit 1
fi
canonical_directory "$handoff_parent" || exit 1
handoff_parent="$canonical_directory_result"
if [ "$handoff_parent" != "$repo_root/.cabadrive-release-handoff" ]; then
  printf '%s\n' 'legacy handoff root escapes the repository' >&2
  exit 1
fi
if [ "$compose_project_name_explicit" -eq 0 ] && [ "$project" != "cabadrive" ]; then
  if ! publish_adopted_project; then
    printf '%s\n' 'failed to persist adopted Compose project identity' >&2
    exit 1
  fi
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
  canonical_directory "$handoff_base" || exit 1
  handoff_base_real="$canonical_directory_result"
  case "$handoff_base_real" in
    "$handoff_parent"/*) ;;
    *)
      printf '%s\n' 'legacy handoff project escapes the repository-owned root' >&2
      exit 1
      ;;
  esac
  handoff_base="$handoff_base_real"
else
  if ! mkdir "$handoff_base"; then
    printf '%s\n' 'failed to create repository-owned legacy handoff project' >&2
    exit 1
  fi
fi
handoff="$handoff_base/current"
releases="$handoff_base/releases"
if [ -e "$releases" ] || [ -L "$releases" ]; then
  if [ -L "$releases" ] || [ ! -d "$releases" ]; then
    printf '%s\n' 'legacy handoff releases is not a repository-owned directory' >&2
    exit 1
  fi
else
  if ! mkdir "$releases"; then
    printf '%s\n' 'failed to create repository-owned legacy releases directory' >&2
    exit 1
  fi
fi
canonical_directory "$releases" || exit 1
releases_real="$canonical_directory_result"
case "$releases_real" in
  "$handoff_base"/*) ;;
  *)
    printf '%s\n' 'legacy handoff releases escapes the repository-owned project' >&2
    exit 1
    ;;
esac
releases="$releases_real"
state_volume="${project}_release-state"
image=""
source=""
invalid_state=""
source_kind="baked-legacy-root"
capture_fault="${CABADRIVE_CAPTURE_FAULT:-}"

verify_handoff() {
  test -L "$handoff" || return 1
  docker run --rm \
    --mount "$(bind_mount "$script_dir" "/app" ",readonly")" \
    --mount "$(bind_mount "$handoff_base" "/handoff" ",readonly")" \
    node:22-alpine node /app/stage-static-release.mjs legacy-verify --legacy /handoff/current "$@"
}

publish_handoff() {
  temporary=""
  capture_owned=""
  capture_attempt=0
  while [ "$capture_attempt" -lt 8 ]; do
    capture_attempt=$((capture_attempt + 1))
    if temporary="$(mktemp -d "$releases/capture-XXXXXXXXXX" 2>/dev/null)"; then
      break
    fi
    temporary=""
  done
  if [ -z "$temporary" ] || [ -L "$temporary" ] || [ ! -d "$temporary" ]; then
    printf '%s\n' 'failed to create an exclusive legacy capture directory' >&2
    return 1
  fi
  canonical_directory "$temporary" || {
    printf '%s\n' 'exclusive legacy capture directory is not accessible' >&2
    return 1
  }
  temporary_real="$canonical_directory_result"
  if [ "${temporary_real%/*}" != "$releases" ]; then
    printf '%s\n' 'exclusive legacy capture directory escapes the releases root' >&2
    return 1
  fi
  temporary="$temporary_real"
  capture_owned=1
  release_relative="releases/${temporary##*/}"
  pointer_publication_started=""
  if [ -n "$capture_fault" ]; then
    set -- --fault "$capture_fault"
  else
    set --
  fi
  cleanup_capture() {
    if [ -n "$capture_owned" ] && [ -n "${temporary:-}" ] && [ -e "$temporary" ]; then
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

  if ! mkdir "$temporary/assets"; then
    cleanup_capture || true
    return 1
  fi
  if ! copy_legacy_assets "$temporary/assets"; then
    cleanup_capture || true
    return 1
  fi
  if ! docker run --rm \
    --mount "$(bind_mount "$script_dir" "/app" ",readonly")" \
    --mount "$(bind_mount "$handoff_base" "/handoff" "")" \
    node:22-alpine node /app/stage-static-release.mjs legacy-write \
      --legacy "/handoff/$release_relative" \
      --handoff /handoff \
      --source-id "$source" --source-kind "$source_kind" "$@"; then
    cleanup_capture || true
    return 1
  fi
  pointer_publication_started=1
  if ! docker run --rm \
    --mount "$(bind_mount "$script_dir" "/app" ",readonly")" \
    --mount "$(bind_mount "$handoff_base" "/handoff" "")" \
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
    --mount "$(bind_mount "$script_dir/stage-static-release.mjs" "/app/stage-static-release.mjs" ",readonly")" \
    node:22-alpine node /app/stage-static-release.mjs verify --state /state; then
    printf '%s\n' 'validated project release-state volume is the retained source'
    exit 0
  fi
  invalid_state=1
  printf '%s\n' 'project release-state is incomplete; legacy capture remains required' >&2
fi

if [ -n "$container" ]; then
  # The selected container's immutable image identity, never a mutable tag,
  # decides whether the baked pre-feature assets can be an independent source.
  if ! container_image="$(docker inspect --format '{{.Image}}' "$container")" || [ -z "$container_image" ]; then
    printf '%s\n' 'failed to inspect selected container image identity' >&2
    exit 1
  fi
  if classify_runtime_label "$container_image"; then
    if verify_handoff >/dev/null 2>&1; then
      printf '%s\n' 'validated preserved legacy handoff is the independent retained source'
      exit 0
    fi
    printf '%s\n' 'post-feature container has no authoritative independent legacy handoff' >&2
    exit 1
  else
    runtime_label_status=$?
    if [ "$runtime_label_status" -ne 1 ]; then exit 1; fi
  fi
  source="$container"
else
  if image_output="$(inspect_runtime_image "${project}-cabadrive")"; then
    image="$image_output"
  else
    image_status=$?
    if [ "$image_status" -ne 1 ]; then exit 1; fi
    image=""
  fi
fi
if [ -n "$image" ]; then
  if classify_runtime_label "${project}-cabadrive"; then
    if [ -n "$invalid_state" ]; then
      printf '%s\n' 'incomplete project release-state has no readable legacy source' >&2
      exit 1
    fi
    printf '%s\n' 'initial-install: current runtime image has no pre-feature legacy assets'
    exit 0
  else
    runtime_label_status=$?
    if [ "$runtime_label_status" -ne 1 ]; then exit 1; fi
    source="$image"
  fi
fi

# A handoff is authoritative only when its independently generated canonical
# inventory and exact source identity revalidate against the outgoing legacy
# container/image. A replaced A source must be captured again before staging.
if [ -n "$source" ] && verify_handoff --source-id "$source" --source-kind "$source_kind" >/dev/null 2>&1; then
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
