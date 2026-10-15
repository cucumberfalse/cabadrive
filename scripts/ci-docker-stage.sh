#!/usr/bin/env bash
# Same complete Docker job commands, selected only by the resource supervisor.
set -euo pipefail
case "${1:?stage required}" in
  install) pnpm install --frozen-lockfile ;;
  browser) pnpm exec playwright install --with-deps chromium ;;
  build) make build ;;
  up) make up ;;
  smoke)
    set -euo pipefail
    for attempt in $(seq 1 30); do
      if curl --fail --silent --show-error "http://localhost:${CABADRIVE_HOST_PORT}/" >/tmp/cabadrive-home.html; then
        break
      fi
      sleep 1
    done
    grep -q "Cabadrive" /tmp/cabadrive-home.html
    curl --fail --silent --show-error "http://localhost:${CABADRIVE_HOST_PORT}/sw.js" >/dev/null
    ;;
  production-retry) node scripts/ci-production-release-proof.mjs ;;
  retention) env -u CABADRIVE_HOST_PORT node scripts/test-docker-asset-retention.mjs ;;
  image-pipeline) pnpm run test:docker-image-pipeline ;;
  headers)
    set -euo pipefail
    # hashed Vite bundle discovered from index.html
    asset=$(curl --fail --silent "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -oE '/assets/[^"]+\.js' | head -1)
    test -n "$asset"
    # FR-1: immutable on hashed /assets/
    curl -sI "http://localhost:${CABADRIVE_HOST_PORT}${asset}" | grep -qi 'cache-control: public, max-age=31536000, immutable'
    # FR-3 (NS-6): gzip on a JS asset when Accept-Encoding: gzip
    curl -sI -H 'Accept-Encoding: gzip' "http://localhost:${CABADRIVE_HOST_PORT}${asset}" | grep -qi 'content-encoding: gzip'
    # FR-2: security headers on the app shell
    curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -qi 'x-content-type-options: nosniff'
    curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/" | grep -qi 'content-security-policy: default-src'
    # FR-1 (NS-2): non-hashed /content/assets/ must NOT be immutable, must carry max-age=86400
    img=$(find content/assets -type f \( -name '*.jpg' -o -name '*.png' -o -name '*.webp' \) -print -quit)
    test -n "$img"
    curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/${img}" | grep -qi 'cache-control: public, max-age=86400, stale-while-revalidate=604800'
    ! curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/${img}" | grep -qi 'immutable'
    # NS-8: an /assets/* miss (404) must NOT be cached as immutable, else the
    # failure is pinned in browsers even after the file is restored.
    missing_headers=$(curl -sI "http://localhost:${CABADRIVE_HOST_PORT}/assets/does-not-exist.js")
    echo "$missing_headers" | grep -qi '^HTTP/[0-9.]* 404'
    ! echo "$missing_headers" | grep -qi 'cache-control'
    ;;
  *) echo "Unknown Docker CI stage" >&2; exit 2 ;;
esac
