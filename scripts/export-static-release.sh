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
if [ -e "$destination" ] || [ -L "$destination" ]; then
  printf '%s\n' 'static export destination must not already exist' >&2
  exit 1
fi

project="$("$script_dir/capture-legacy-assets.sh" --resolve-project)"
export COMPOSE_PROJECT_NAME="$project"
docker compose -f "$repo_root/docker-compose.yml" build stager
docker compose -f "$repo_root/docker-compose.yml" run --rm --no-deps \
  --volume "$destination_parent:/export" \
  --entrypoint node stager \
  /app/scripts/stage-static-release.mjs publish-export \
  --state /state --candidate /candidate --output /tmp/cabadrive-static-publish \
  --destination "/export/$destination_name"
