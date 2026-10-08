#!/bin/sh
# Build the Docker-contained candidate, commit its static publish transaction,
# and export that exact transaction to a new host directory.
set -eu

if [ "$#" -ne 1 ]; then
  printf '%s\n' 'usage: ./scripts/export-static-release.sh DESTINATION' >&2
  exit 2
fi

# Preserve literal trailing LF instead of canonicalizing a different sibling.
path_newline='
'
canonical_directory() {
  canonical_directory_result="$(CDPATH= cd -- "$1" && pwd -P && printf '.')" || return 1
  canonical_directory_result="${canonical_directory_result%.}"
  canonical_directory_result="${canonical_directory_result%"$path_newline"}"
}
case "$0" in */*) entry_directory="${0%/*}" ;; *) entry_directory=. ;; esac
[ -n "$entry_directory" ] || entry_directory=/
canonical_directory "$entry_directory" || exit 1
script_dir="$canonical_directory_result"
canonical_directory "$script_dir/.." || exit 1
repo_root="$canonical_directory_result"
# Compose resolves its schema relative to a file URL; C0/DEL checkout bytes
# are unsupported upstream. Reject before any discovery or handoff mutation.
checkout_printable="$(printf '%s' "$repo_root" | LC_ALL=C tr -d '\000-\037\177' && printf '.')" || exit 1
checkout_printable="${checkout_printable%.}"
if [ "$checkout_printable" != "$repo_root" ]; then
  printf '%s\n' 'Compose checkout path contains unsupported control characters; no discovery or mutation performed' >&2
  exit 1
fi

case "$1" in
  /*) destination="$1" ;;
  *) canonical_directory . || exit 1; destination="$canonical_directory_result/$1" ;;
esac
# Match dirname/basename's trailing slash behavior without a lossy substitution.
while [ "$destination" != / ] && [ "${destination%/}" != "$destination" ]; do destination="${destination%/}"; done
destination_parent="${destination%/*}"
[ -n "$destination_parent" ] || destination_parent=/
destination_name="${destination##*/}"
# Compose run only exposes the colon-delimited --volume form. Reject this
# unsupported parent before discovery, capture, owner probes, or builds.
case "$destination_parent" in
  *:*) printf '%s\n' 'static export parent containing a colon cannot be represented by Compose --volume' >&2; exit 1 ;;
esac

if [ "$destination_name" = "." ] || [ "$destination_name" = ".." ] ||
  [ -z "$destination_name" ]; then
  printf '%s\n' 'static export destination must name one new directory' >&2
  exit 1
fi
if [ ! -d "$destination_parent" ] || [ -L "$destination_parent" ]; then
  printf '%s\n' 'static export destination parent must be an existing directory' >&2
  exit 1
fi
canonical_directory "$destination_parent" || exit 1
destination_parent="$canonical_directory_result"
case "$destination_parent" in
  *:*) printf '%s\n' 'static export parent containing a colon cannot be represented by Compose --volume' >&2; exit 1 ;;
esac
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
# A host-created private directory supplies only the host owner class seen
# through Docker's namespace. It is read-only authority, never a cleanup grant.
# The stager creates and holds its actual probe descriptor exclusively.
owner_uid="$(id -u)"
owner_gid="$(id -g)"
old_umask="$(umask)"
umask 077
owner_mapping="$destination_parent/.cabadrive-export-owner-mapping"
if [ ! -e "$owner_mapping" ] && [ ! -L "$owner_mapping" ]; then
  mkdir "$owner_mapping" || { umask "$old_umask"; exit 1; }
fi
umask "$old_umask"
mapping_identity() {
  [ ! -L "$1" ] && [ -d "$1" ] || return 1
  LC_ALL=C ls -dlin -- "$1" | awk 'NR == 1 {print $1 ":" $2 ":" $4 ":" $5}'
}
owner_mapping_identity="$(mapping_identity "$owner_mapping")" || {
  printf '%s\n' 'export owner mapping is not a private directory' >&2
  exit 1
}
case "$owner_mapping_identity" in
  *:drwx------*:"$owner_uid":"$owner_gid") ;;
  *) printf '%s\n' 'export owner mapping is not private host-owned authority' >&2; exit 1 ;;
esac
owner_mapping_name="${owner_mapping##*/}"
# Reuse one persistent read-only owner-class witness. Its contents are never
# changed or removed: observation does not grant destructive creator authority.
printf '%s\n' "retaining read-only export owner mapping witness: $owner_mapping" >&2
set -- --owner-mapping /owner-mapping --owner-mapping-name "$owner_mapping_name" \
  --owner-uid "$owner_uid" --owner-gid "$owner_gid" --generation-root /publish
if [ -L "$legacy_handoff" ]; then
  set -- "$@" --legacy /legacy-handoff/current
elif [ -e "$legacy_handoff" ]; then
  printf '%s\n' 'legacy handoff current entry changed to a non-symlink' >&2
  exit 1
fi
docker compose -f "$repo_root/docker-compose.yml" build stager
if [ "$(mapping_identity "$owner_mapping")" != "$owner_mapping_identity" ]; then
  printf '%s\n' 'export owner mapping changed before stager admission' >&2
  exit 1
fi
docker compose -f "$repo_root/docker-compose.yml" run --rm --no-deps \
  --volume "$destination_parent:/export" \
  --volume "$owner_mapping:/owner-mapping:ro" \
  --entrypoint node stager \
  /app/scripts/stage-static-release.mjs publish-export \
  --state /state --candidate /candidate --output /publish/cabadrive-static-publish \
  --destination "/export/$destination_name" "$@"
