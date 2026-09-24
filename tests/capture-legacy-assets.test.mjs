import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const captureScript = fileURLToPath(
  new URL("../scripts/capture-legacy-assets.sh", import.meta.url),
);
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));

test("make build propagates capture failure before starting an image build", () => {
  const root = join(tmpdir(), `cabadrive-build-short-circuit-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const sentinel = join(root, "build-started");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ] && [ "\${4:-}" = ps ]; then printf '%s\\n' legacy-container; exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = cp ]; then exit 73; fi
if [ "$1" = compose ] && [ "$2" = build ]; then : >"$CABADRIVE_BUILD_SENTINEL"; exit 0; fi
exit 0
`,
  );
  chmodSync(docker, 0o755);
  try {
    const result = spawnSync("make", ["build"], {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        COMPOSE_PROJECT_NAME: "fixture",
        CABADRIVE_REPOSITORY_ROOT: root,
        CABADRIVE_BUILD_SENTINEL: sentinel,
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.equal(existsSync(sentinel), false);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("every Make lifecycle target stops when Compose project resolution is ambiguous", () => {
  const root = join(tmpdir(), `cabadrive-make-resolver-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const scripts = join(root, "scripts");
  const sentinel = join(root, "lifecycle-action-started");
  mkdirSync(bin, { recursive: true });
  mkdirSync(scripts, { recursive: true });
  writeFileSync(join(root, "Makefile"), readFileSync(join(repositoryRoot, "Makefile")));
  const capture = join(scripts, "capture-legacy-assets.sh");
  writeFileSync(
    capture,
    `#!/bin/sh
set -eu
if [ "\${1:-}" = --resolve-project ]; then
  printf '%s\\n' 'ambiguous pre-feature Compose project' >&2
  exit 41
fi
: >"$CABADRIVE_ACTION_SENTINEL"
`,
  );
  chmodSync(capture, 0o755);
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
: >"$CABADRIVE_ACTION_SENTINEL"
exit 0
`,
  );
  chmodSync(docker, 0o755);
  try {
    for (const target of ["build", "up", "down", "logs", "stage"]) {
      if (existsSync(sentinel)) rmSync(sentinel, { force: true });
      const env = {
        ...process.env,
        CABADRIVE_ACTION_SENTINEL: sentinel,
        PATH: `${bin}:${process.env.PATH}`,
      };
      delete env.COMPOSE_PROJECT_NAME;
      const result = spawnSync("make", [target], {
        cwd: root,
        encoding: "utf8",
        env,
      });
      assert.notEqual(result.status, 0, `${target}: ${result.stdout}${result.stderr}`);
      assert.equal(existsSync(sentinel), false, `${target} started Docker after resolver failure`);
    }
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

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
if [ "$1" = run ]; then
  case "$*" in
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/fixture/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/fixture/current"
      exit 0
      ;;
  esac
  exit 0
fi
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
        CABADRIVE_REPOSITORY_ROOT: root,
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(
        join(root, ".cabadrive-release-handoff/fixture/current/assets/lazy-a.js"),
        "utf8",
      ),
      "legacy-bytes",
    );
    assert.equal(
      readFileSync(
        join(root, ".cabadrive-release-handoff/fixture/current/source-id"),
        "utf8",
      ).trim(),
      "legacy-image-id",
    );
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("a second clean build ignores an unstarted post-feature runtime image", () => {
  const root = join(tmpdir(), `cabadrive-post-feature-image-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const log = join(root, "docker.log");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
printf '%s\\n' "$*" >>"${log}"
if [ "$1" = compose ] && [ "$2" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *com.cabadrive.release-state-runtime*) printf '%s\\n' true ;;
    *) printf '%s\\n' post-feature-image-id ;;
  esac
  exit 0
fi
if [ "$1" = create ] || [ "$1" = cp ]; then
  printf '%s\\n' 'post-feature image must not be captured' >&2
  exit 91
fi
exit 0
`,
  );
  chmodSync(docker, 0o755);
  try {
    for (const attempt of [1, 2]) {
      const result = spawnSync("sh", [captureScript], {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          COMPOSE_PROJECT_NAME: "fixture",
          CABADRIVE_REPOSITORY_ROOT: root,
          PATH: `${bin}:${process.env.PATH}`,
        },
      });
      assert.equal(result.status, 0, `attempt ${attempt}: ${result.stderr}`);
      assert.match(result.stdout, /current runtime image has no pre-feature legacy assets/);
    }
    assert.doesNotMatch(readFileSync(log, "utf8"), /^(create|cp)\b/m);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("project resolution ignores a labelled post-feature historical image", () => {
  const root = join(tmpdir(), `cabadrive-renamed-checkout-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const log = join(root, "docker.log");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
printf '%s\\n' "$*" >>"${log}"
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *com.cabadrive.release-state-runtime*) printf '%s\\n' true ;;
    *) printf '%s\\n' post-feature-image-id ;;
  esac
  exit 0
fi
exit 1
`,
  );
  chmodSync(docker, 0o755);
  try {
    const env = {
      ...process.env,
      CABADRIVE_REPOSITORY_ROOT: root,
      PATH: `${bin}:${process.env.PATH}`,
    };
    delete env.COMPOSE_PROJECT_NAME;
    const result = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), "cabadrive");
    assert.match(readFileSync(log, "utf8"), /release-state-runtime/);
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
if [ "$1" = compose ]; then printf '%s\\n' running-legacy; exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *source=fixture_release-state*) exit 1 ;;
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/fixture/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/fixture/current"
      exit 0
      ;;
    *) exit 0 ;;
  esac
fi
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
        CABADRIVE_REPOSITORY_ROOT: root,
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(
        join(root, ".cabadrive-release-handoff/fixture/current/assets/lazy-a.js"),
        "utf8",
      ),
      "running-bytes",
    );
    assert.match(result.stderr, /incomplete/);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("a verifier-rejected state never becomes a source through an attached container", () => {
  const root = join(tmpdir(), `cabadrive-capture-rejected-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ]; then printf '%s\\n' rejected-state-container; exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *source=fixture_release-state*) exit 1 ;;
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/fixture/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/fixture/current"
      exit 0
      ;;
    *) exit 0 ;;
  esac
fi
if [ "$1" = cp ]; then
  case "$2" in
    *:/state/assets/.) printf '%s\\n' 'forbidden state copy' >&2; exit 91 ;;
    *:/usr/share/nginx/html/assets/.) mkdir -p "$3"; printf '%s' baked-bytes >"$3/lazy-a.js"; exit 0 ;;
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
        CABADRIVE_REPOSITORY_ROOT: root,
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      readFileSync(
        join(root, ".cabadrive-release-handoff/fixture/current/assets/lazy-a.js"),
        "utf8",
      ),
      "baked-bytes",
    );
    assert.doesNotMatch(result.stderr, /forbidden state copy/);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture defaults to the Compose cabadrive identity outside a cabadrive cwd", () => {
  const root = join(tmpdir(), `unrelated-cwd-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const log = join(root, "docker.log");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
printf '%s|%s\\n' "$COMPOSE_PROJECT_NAME" "$*" >>"${log}"
if [ "$1" = compose ] && [ "$2" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then printf '%s\\n' default-image; exit 0; fi
if [ "$1" = create ]; then printf '%s\\n' temporary-container; exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/cabadrive/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/cabadrive/current"
      exit 0
      ;;
  esac
  exit 0
fi
if [ "$1" = cp ]; then mkdir -p "$3"; printf '%s' default-bytes >"$3/lazy-a.js"; exit 0; fi
if [ "$1" = rm ]; then exit 0; fi
exit 90
`,
  );
  chmodSync(docker, 0o755);
  try {
    const env = {
      ...process.env,
      CABADRIVE_REPOSITORY_ROOT: root,
      PATH: `${bin}:${process.env.PATH}`,
    };
    delete env.COMPOSE_PROJECT_NAME;
    const result = spawnSync("sh", [captureScript], { cwd: root, encoding: "utf8", env });
    assert.equal(result.status, 0, result.stderr);
    const calls = readFileSync(log, "utf8");
    assert.match(calls, /^cabadrive\|compose -f/m);
    assert.match(calls, /cabadrive\|image inspect --format .* cabadrive-cabadrive/);
    assert.equal(
      readFileSync(
        join(root, ".cabadrive-release-handoff/cabadrive/current/assets/lazy-a.js"),
        "utf8",
      ),
      "default-bytes",
    );
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("every legacy-handoff publication failure leaves no authoritative current pointer", () => {
  for (const fault of ["copy", "marker", "link", "rename"]) {
    const root = join(tmpdir(), `cabadrive-capture-failure-${fault}-${process.pid}-${Date.now()}`);
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
  [ "$CABADRIVE_CAPTURE_FAULT" = legacy-copy ] && exit 1
  mkdir -p "$3"; printf '%s' legacy-bytes >"$3/lazy-a.js"; exit 0
fi
if [ "$1" = run ]; then
  case "$*" in
    *legacy-verify*) exit 1 ;;
    *legacy-write*) [ "$CABADRIVE_CAPTURE_FAULT" = legacy-marker-write ] && exit 1; exit 0 ;;
    *legacy-publish-pointer*)
      case "$CABADRIVE_CAPTURE_FAULT" in legacy-pointer-link|legacy-pointer-rename) exit 1 ;; esac
      exit 0
      ;;
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
          CABADRIVE_CAPTURE_FAULT:
            fault === "copy"
              ? "legacy-copy"
              : fault === "marker"
                ? "legacy-marker-write"
                : `legacy-pointer-${fault}`,
          CABADRIVE_REPOSITORY_ROOT: root,
          PATH: `${bin}:${process.env.PATH}`,
        },
      });
      // The mock distinguishes the underlying operation from the helper's
      // fault name so each checked branch is exercised without host Docker.
      assert.equal(result.status, 1, `${fault}: ${result.stderr}`);
      const handoff = join(root, ".cabadrive-release-handoff/fixture");
      assert.equal(existsSync(join(handoff, "current")), false, `${fault} published current`);
      assert.deepEqual(readdirSync(join(handoff, "releases")), [], `${fault} left capture bytes`);
    } finally {
      if (existsSync(root)) rmSync(root, { recursive: true, force: true });
    }
  }
});

test("capture retains a release still referenced after pointer barrier and rollback failure", () => {
  const root = join(tmpdir(), `cabadrive-capture-rollback-${process.pid}-${Date.now()}`);
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
if [ "$1" = cp ]; then mkdir -p "$3"; printf '%s' legacy-bytes >"$3/lazy-a.js"; exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *legacy-verify*) exit 1 ;;
    *legacy-write*) exit 0 ;;
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/fixture/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/fixture/current"
      # Simulate the publication directory barrier followed by a rollback
      # failure: the CLI exits nonzero while current still names this release.
      exit 1
      ;;
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
        CABADRIVE_REPOSITORY_ROOT: root,
        PATH: `${bin}:${process.env.PATH}`,
      },
    });
    assert.equal(result.status, 1, result.stderr);
    const handoff = join(root, ".cabadrive-release-handoff/fixture");
    const releases = readdirSync(join(handoff, "releases"));
    assert.equal(releases.length, 1, "capture release remains available to current");
    assert.equal(readlinkSync(join(handoff, "current")), `releases/${releases[0]}`);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture test locates its script module-relatively and has no checkout-specific path", () => {
  assert.equal(existsSync(captureScript), true);
  assert.doesNotMatch(readFileSync(new URL(import.meta.url), "utf8"), /\/Users\//);
});
