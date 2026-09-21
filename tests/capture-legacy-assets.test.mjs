import assert from "node:assert/strict";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const captureScript = fileURLToPath(
  new URL("../scripts/capture-legacy-assets.sh", import.meta.url),
);

test("stopped legacy Compose image is exported before a build can replace it", () => {
  const root = join(tmpdir(), `cabadrive-capture-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ] && [ "$2" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then printf '%s\\n' legacy-image-id; exit 0; fi
if [ "$1" = create ]; then printf '%s\\n' temporary-container; exit 0; fi
if [ "$1" = cp ]; then
  case "$2" in
    *:/state/assets/.) exit 1 ;;
    *:/usr/share/nginx/html/assets/.) mkdir -p "$3"; printf '%s' legacy-bytes >"$3/lazy-a.js"; exit 0 ;;
  esac
fi
if [ "$1" = rm ]; then exit 0; fi
exit 90
`,
  );
  chmodSync(docker, 0o755);
  try {
    const result = spawnSync("sh", [captureScript], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        COMPOSE_PROJECT_NAME: "fixture",
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(join(root, ".cabadrive-release-handoff/fixture/assets/lazy-a.js"), "utf8"),
      "legacy-bytes",
    );
    assert.equal(
      readFileSync(join(root, ".cabadrive-release-handoff/fixture/source-id"), "utf8").trim(),
      "legacy-image-id",
    );
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("an incomplete volume does not suppress capture of a running legacy release", () => {
  const root = join(tmpdir(), `cabadrive-capture-incomplete-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ] && [ "$2" = ps ]; then printf '%s\\n' running-legacy; exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 0; fi
if [ "$1" = run ]; then exit 1; fi
if [ "$1" = cp ]; then
  case "$2" in
    *:/state/assets/.) exit 1 ;;
    *:/usr/share/nginx/html/assets/.) mkdir -p "$3"; printf '%s' running-bytes >"$3/lazy-a.js"; exit 0 ;;
  esac
fi
exit 90
`,
  );
  chmodSync(docker, 0o755);
  try {
    const result = spawnSync("sh", [captureScript], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        COMPOSE_PROJECT_NAME: "fixture",
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(join(root, ".cabadrive-release-handoff/fixture/assets/lazy-a.js"), "utf8"),
      "running-bytes",
    );
    assert.match(result.stderr, /incomplete/);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture test locates its script module-relatively and has no checkout-specific path", () => {
  assert.equal(existsSync(captureScript), true);
  assert.doesNotMatch(readFileSync(new URL(import.meta.url), "utf8"), /\/Users\//);
});
