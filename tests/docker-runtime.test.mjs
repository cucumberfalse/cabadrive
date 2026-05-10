import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const compose = readFileSync(new URL("../docker-compose.yml", import.meta.url), "utf8");
const makefile = readFileSync(new URL("../Makefile", import.meta.url), "utf8");
const dockerDocs = readFileSync(
  new URL("../docs_project/project/devops/docker-runtime.md", import.meta.url),
  "utf8"
);
const frontendDocs = readFileSync(
  new URL("../docs_project/project/frontend/frontend-docs.md", import.meta.url),
  "utf8"
);

test("Docker compose uses project-scoped containers and configurable host port", () => {
  assert.doesNotMatch(compose, /^\s*container_name:\s*cabadrive\s*$/m);
  assert.match(compose, /\$\{CABADRIVE_HOST_PORT:-5173\}:8080/);
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
  assert.match(dockerDocs, /COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up/);
  assert.match(dockerDocs, /must not stop, remove, rename, or otherwise mutate containers from\s+another compose project/);
  assert.match(frontendDocs, /COMPOSE_PROJECT_NAME=cabadrive-021-isolation CABADRIVE_HOST_PORT=5175 make up/);
});
