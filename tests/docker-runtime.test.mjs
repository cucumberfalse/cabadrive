import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const compose = readFileSync(new URL("../docker-compose.yml", import.meta.url), "utf8");
const makefile = readFileSync(new URL("../Makefile", import.meta.url), "utf8");
const nginx = readFileSync(new URL("../nginx.conf", import.meta.url), "utf8");
const dockerfile = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");
const dockerDocs = readFileSync(
  new URL("../docs_project/project/devops/docker-runtime.md", import.meta.url),
  "utf8",
);
const frontendDocs = readFileSync(
  new URL("../docs_project/project/frontend/frontend-docs.md", import.meta.url),
  "utf8",
);

test("Docker compose uses project-scoped containers and configurable host port", () => {
  assert.doesNotMatch(compose, /^\s*container_name:\s*cabadrive\s*$/m);
  assert.match(compose, /\$\{CABADRIVE_HOST_PORT:-5173\}:8080/);
});

test("Docker compose does not require a shared local image tag for isolated smoke", () => {
  assert.doesNotMatch(compose, /^\s*image:\s*cabadrive:local\s*$/m);
});

test("Makefile reports the configured Docker URL while keeping project-scoped targets", () => {
  assert.match(makefile, /docker compose build/);
  assert.match(makefile, /docker compose up -d/);
  assert.match(makefile, /docker compose down/);
  assert.match(makefile, /docker compose logs -f cabadrive/);
  assert.match(makefile, /http:\/\/localhost:\$\$\{CABADRIVE_HOST_PORT:-5173\}/);
  assert.doesNotMatch(makefile, /docker (?:rm|stop)\s+cabadrive/);
});

test("Docker runtime docs cover default and isolated agent smoke flows", () => {
  assert.match(dockerDocs, /http:\/\/localhost:5173/);
  assert.match(
    dockerDocs,
    /COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up/,
  );
  assert.match(
    dockerDocs,
    /Compose auto-tags the built image\s+from the compose project and service name/,
  );
  assert.match(
    dockerDocs,
    /must not stop, remove, rename, or otherwise mutate containers from\s+another compose project/,
  );
  assert.match(
    frontendDocs,
    /COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up/,
  );
  assert.match(frontendDocs, /project-scoped image name/);
});

test("nginx.conf splits cache policy, sets security headers, and enables gzip", () => {
  // FR-1: split cache policy driven by a single map on $uri.
  assert.match(nginx, /map \$uri \$cache_control/);
  assert.match(nginx, /~\^\/assets\/\s+"public, max-age=31536000, immutable"/);
  // NS-2 regression guard: non-hashed /content/assets/ must be fresh-24h, not immutable.
  assert.match(
    nginx,
    /~\^\/content\/assets\/\s+"public, max-age=86400, stale-while-revalidate=604800"/,
  );
  // FR-2: security headers, all with `always`.
  assert.match(nginx, /add_header X-Content-Type-Options "nosniff" always;/);
  assert.match(nginx, /add_header X-Frame-Options "DENY" always;/);
  assert.match(nginx, /add_header Referrer-Policy "strict-origin-when-cross-origin" always;/);
  assert.match(
    nginx,
    /add_header Permissions-Policy "camera=\(\), microphone=\(\), geolocation=\(\)" always;/,
  );
  assert.match(
    nginx,
    /add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'" always;/,
  );
  // NS-7: single server-level Cache-Control from the map (no per-location add_header).
  assert.match(nginx, /add_header Cache-Control \$cache_control;/);
  // NS-8 regression guard: Cache-Control must NOT carry `always`, else the
  // immutable policy would apply to /assets/* 404s and pin failures in browsers.
  assert.doesNotMatch(nginx, /add_header Cache-Control \$cache_control always;/);
  // FR-3 (NS-6): gzip enabled and text/javascript in the type list.
  assert.match(nginx, /gzip on;/);
  assert.match(nginx, /gzip_types[^;]*text\/javascript/);
  // NS-2: the /content/assets/ map line must not carry immutable.
  assert.doesNotMatch(nginx, /\/content\/assets\/[^\n]*immutable/);
  // Avoid the duplicate-MIME warning: text/html is not listed explicitly.
  assert.doesNotMatch(nginx, /gzip_types[^;]*text\/html/);
});

test("Dockerfile runtime uses unprivileged nginx base image", () => {
  // FR-4 (NS-3): runtime stage uses the unprivileged image (master not root).
  assert.match(dockerfile, /FROM nginxinc\/nginx-unprivileged:1\.29-alpine/);
  assert.doesNotMatch(dockerfile, /FROM nginx:1\.29-alpine/);
  // Port/copy invariants unchanged.
  assert.match(dockerfile, /COPY nginx\.conf \/etc\/nginx\/conf\.d\/default\.conf/);
  assert.match(dockerfile, /EXPOSE 8080/);
});
