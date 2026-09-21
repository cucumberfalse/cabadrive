import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const dockerfile = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");
const nginx = readFileSync(new URL("../nginx.conf", import.meta.url), "utf8");
const capture = readFileSync(
  new URL("../scripts/capture-legacy-assets.sh", import.meta.url),
  "utf8",
);

test("the stager is Docker-contained and nginx exposes retained immutable assets", () => {
  assert.match(dockerfile, /FROM node:22-alpine AS stager/);
  assert.match(dockerfile, /\/candidate/);
  assert.match(dockerfile, /stage-static-release\.mjs/);
  assert.match(nginx, /root \/state\/current/);
  assert.match(nginx, /alias \/state\/assets\//);
  assert.match(nginx, /location \/assets\//);
  assert.match(nginx, /try_files \$uri =404/);
});

test("legacy capture is exact-project, supports container and prior image, and records identity", () => {
  assert.match(capture, /COMPOSE_PROJECT_NAME="\$project" docker compose -f/);
  assert.match(capture, /resolve_project\(\)/);
  assert.match(capture, /ambiguous pre-feature Compose project/);
  assert.match(capture, /com\.docker\.compose\.project\.working_dir/);
  assert.match(capture, /docker image inspect --format/);
  assert.match(capture, /\$\{project\}-cabadrive/);
  assert.match(capture, /docker volume inspect/);
  assert.match(capture, /docker cp .*\/usr\/share\/nginx\/html\/assets/);
  assert.match(capture, /source-id/);
  assert.match(capture, /source-kind/);
  assert.match(capture, /legacy-verify/);
  assert.match(capture, /legacy-write/);
  assert.match(capture, /\.cabadrive-release-handoff/);
  assert.doesNotMatch(capture, /docker (?:stop|rm)\s+cabadrive/);
});
