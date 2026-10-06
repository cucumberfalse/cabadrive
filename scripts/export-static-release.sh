#!/bin/sh
# Build the Docker-contained candidate, commit its static publish transaction,
# and export that exact transaction to a new host directory.
set -eu

if [ "$#" -ne 1 ]; then
  printf '%s\n' 'usage: ./scripts/export-static-release.sh DESTINATION' >&2
  exit 2
fi

script_dir="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
repo_root="$(CDPATH= cd -- "$script_dir/.." && pwd -P)"
case "$1" in
  /*) destination="$1" ;;
  *) destination="$(pwd -P)/$1" ;;
esac
destination_parent="$(dirname -- "$destination")"
destination_name="$(basename -- "$destination")"

if [ "$destination_name" = "." ] || [ "$destination_name" = ".." ] ||
  [ -z "$destination_name" ]; then
  printf '%s\n' 'static export destination must name one new directory' >&2
  exit 1
fi
if [ ! -d "$destination_parent" ] || [ -L "$destination_parent" ]; then
  printf '%s\n' 'static export destination parent must be an existing directory' >&2
  exit 1
fi
destination_parent="$(CDPATH= cd -- "$destination_parent" && pwd -P)"
destination="$destination_parent/$destination_name"
if [ -L "$destination" ] || { [ -e "$destination" ] && [ ! -d "$destination" ]; }; then
  printf '%s\n' 'static export destination must be absent or an existing directory owned by the exact transaction' >&2
  exit 1
fi

project="$("$script_dir/capture-legacy-assets.sh" --resolve-project)"
export COMPOSE_PROJECT_NAME="$project"
legacy_handoff="$repo_root/.cabadrive-release-handoff/$project/current"
if [ -L "$legacy_handoff" ]; then
  :
elif [ -e "$legacy_handoff" ]; then
  printf '%s\n' 'legacy handoff current entry must be a symlink' >&2
  exit 1
fi
# This is the same authoritative outgoing-runtime capture boundary used by
# `make build`. Wrong-type current entries have already failed unchanged.
"$script_dir/capture-legacy-assets.sh"
owner_probe=
cleanup_owner_probe() {
  status=$?
  trap - EXIT HUP INT TERM
  if [ -n "${owner_probe:-}" ]; then
    if [ -e "$owner_probe" ] || [ -L "$owner_probe" ]; then
      current_probe_inode="$(ls -din -- "$owner_probe" 2>/dev/null | awk '{print $1}')"
      if [ ! -L "$owner_probe" ] && [ "$current_probe_inode" = "$owner_probe_inode" ]; then
        rm -f -- "$owner_probe" || status=1
      else
        printf '%s\n' 'export owner probe was replaced; refusing to remove the foreign entry' >&2
        status=1
      fi
    fi
    exec 9<&-
  fi
  exit "$status"
}
trap cleanup_owner_probe EXIT HUP INT TERM
old_umask="$(umask)"
umask 077
owner_probe="$(mktemp "$destination_parent/.cabadrive-export-owner-probe.XXXXXXXX")"
umask "$old_umask"
chmod 600 "$owner_probe"
exec 9<"$owner_probe"
owner_probe_inode="$(ls -din -- "$owner_probe" | awk '{print $1}')"
owner_probe_name="$(basename -- "$owner_probe")"
set -- --owner-probe "/export/$owner_probe_name" \
  --owner-uid "$(id -u)" --owner-gid "$(id -g)" --generation-root /publish
if [ -L "$legacy_handoff" ]; then
  set -- "$@" --legacy /legacy-handoff/current
elif [ -e "$legacy_handoff" ]; then
  printf '%s\n' 'legacy handoff current entry changed to a non-symlink' >&2
  exit 1
fi
docker compose -f "$repo_root/docker-compose.yml" build stager
docker compose -f "$repo_root/docker-compose.yml" run --rm --no-deps \
  --volume "$destination_parent:/export" \
  --entrypoint node stager \
  /app/scripts/stage-static-release.mjs publish-export \
  --state /state --candidate /candidate --output /publish/cabadrive-static-publish \
  --destination "/export/$destination_name" "$@"
