import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  rmSync,
  symlinkSync,
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

function createMakeProvenanceFixture({ imageMode = "legacy", labelMode = "normal" } = {}) {
  const root = join(
    tmpdir(),
    `cabadrive-make-provenance-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  const project = root.split("/").at(-1);
  const bin = join(root, "bin");
  const scripts = join(root, "scripts");
  const phase = join(root, "image-phase");
  const log = join(root, "docker.log");
  const buildSentinel = join(root, "build-started");
  mkdirSync(bin, { recursive: true });
  mkdirSync(scripts, { recursive: true });
  writeFileSync(join(root, "Makefile"), readFileSync(join(repositoryRoot, "Makefile")));
  writeFileSync(join(scripts, "capture-legacy-assets.sh"), readFileSync(captureScript));
  chmodSync(join(scripts, "capture-legacy-assets.sh"), 0o755);
  writeFileSync(phase, "legacy");
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
printf '%s|%s\\n' "\${COMPOSE_PROJECT_NAME:-}" "$*" >>"$CABADRIVE_DOCKER_LOG"
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *com.cabadrive.release-state-runtime*)
      if [ "$CABADRIVE_LABEL_MODE" = failure ]; then
        printf '%s\\n' 'runtime label inspect unavailable' >&2
        exit 42
      fi
      if [ "$CABADRIVE_LABEL_MODE" = unexpected ]; then
        printf '%s\\n' unexpected-marker
        exit 0
      fi
      [ "$(cat "$CABADRIVE_IMAGE_PHASE")" = labeled ] && printf '%s\\n' true
      exit 0
      ;;
  esac
  if [ "$CABADRIVE_IMAGE_MODE" = absent ]; then
    printf '%s\\n' 'Error response from daemon: No such image' >&2
    exit 1
  fi
  printf '%s\\n' legacy-image-id
  exit 0
fi
if [ "$1" = compose ]; then
  case " $* " in
    *" build "*)
      if [ "$CABADRIVE_IMAGE_MODE" = legacy ]; then
        test -f "$CABADRIVE_ADOPTED_PROJECT" || exit 88
      fi
      : >"$CABADRIVE_BUILD_SENTINEL"
      printf '%s\\n' labeled >"$CABADRIVE_IMAGE_PHASE"
      printf 'build:%s\\n' "$COMPOSE_PROJECT_NAME" >>"$CABADRIVE_DOCKER_LOG"
      exit 0
      ;;
    *" up "*)
      printf 'up:%s\\n' "$COMPOSE_PROJECT_NAME" >>"$CABADRIVE_DOCKER_LOG"
      exit 0
      ;;
    *) exit 0 ;;
  esac
fi
if [ "$1" = create ]; then printf '%s\\n' temporary-container; exit 0; fi
if [ "$1" = cp ]; then mkdir -p "$3"; printf '%s' legacy-bytes >"$3/lazy-a.js"; exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *adopted-project-verify*)
      cat "$CABADRIVE_ADOPTED_PROJECT"
      exit 0
      ;;
    *adopted-project-write*)
      case "$*" in
        *'durability:fsync-file'*) exit 73 ;;
        *'durability:rename'*|*'durability:fsync-directory'*)
          printf '%s\\n' "$COMPOSE_PROJECT_NAME" >"$CABADRIVE_ADOPTED_PROJECT"
          exit 73
          ;;
      esac
      printf '%s\\n' "$COMPOSE_PROJECT_NAME" >"$CABADRIVE_ADOPTED_PROJECT"
      exit 0
      ;;
    *legacy-publish-pointer*)
      handoff_project="\${COMPOSE_PROJECT_NAME:-$CABADRIVE_FIXTURE_PROJECT}"
      release="$(find "$CABADRIVE_REPOSITORY_ROOT/.cabadrive-release-handoff/$handoff_project/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "$CABADRIVE_REPOSITORY_ROOT/.cabadrive-release-handoff/$handoff_project/current"
      ;;
  esac
  exit 0
fi
if [ "$1" = rm ]; then exit 0; fi
exit 90
`,
  );
  chmodSync(docker, 0o755);
  const env = {
    ...process.env,
    CABADRIVE_REPOSITORY_ROOT: root,
    CABADRIVE_FIXTURE_PROJECT: project,
    CABADRIVE_IMAGE_MODE: imageMode,
    CABADRIVE_LABEL_MODE: labelMode,
    CABADRIVE_IMAGE_PHASE: phase,
    CABADRIVE_DOCKER_LOG: log,
    CABADRIVE_BUILD_SENTINEL: buildSentinel,
    CABADRIVE_ADOPTED_PROJECT: join(root, ".cabadrive-release-handoff/.adopted-project"),
    PATH: `${bin}:${process.env.PATH}`,
  };
  delete env.COMPOSE_PROJECT_NAME;
  return { root, project, bin, log, buildSentinel, env };
}

function runMake(root, target, env) {
  return spawnSync("make", [target], { cwd: root, encoding: "utf8", env });
}

test("actual make build persists a discovered project before build and reuses it after evidence changes", () => {
  const fixture = createMakeProvenanceFixture();
  const adopted = join(fixture.root, ".cabadrive-release-handoff/.adopted-project");
  try {
    const build = runMake(fixture.root, "build", fixture.env);
    assert.equal(build.status, 0, build.stdout + build.stderr);
    assert.equal(readFileSync(adopted, "utf8").trim(), fixture.project);
    assert.equal(existsSync(fixture.buildSentinel), true);
    assert.match(readFileSync(fixture.log, "utf8"), new RegExp(`build:${fixture.project}`));

    const up = runMake(fixture.root, "up", fixture.env);
    assert.equal(up.status, 0, up.stdout + up.stderr);
    assert.match(readFileSync(fixture.log, "utf8"), new RegExp(`up:${fixture.project}`));

    rmSync(adopted);
    const missingAdoption = runMake(fixture.root, "up", fixture.env);
    assert.equal(missingAdoption.status, 0, missingAdoption.stdout + missingAdoption.stderr);
    assert.match(readFileSync(fixture.log, "utf8"), /up:cabadrive/);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make build keeps an explicit project non-persistent", () => {
  const fixture = createMakeProvenanceFixture();
  const adopted = join(fixture.root, ".cabadrive-release-handoff/.adopted-project");
  mkdirSync(join(fixture.root, ".cabadrive-release-handoff"), { recursive: true });
  writeFileSync(adopted, "previous-adoption\\n");
  try {
    const result = runMake(fixture.root, "build", {
      ...fixture.env,
      COMPOSE_PROJECT_NAME: "caller-override",
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(readFileSync(adopted, "utf8"), "previous-adoption\\n");
    assert.match(readFileSync(fixture.log, "utf8"), /build:caller-override/);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make build keeps a clean install on the default project without adoption", () => {
  const fixture = createMakeProvenanceFixture({ imageMode: "absent" });
  try {
    const result = runMake(fixture.root, "build", fixture.env);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(
      existsSync(join(fixture.root, ".cabadrive-release-handoff/.adopted-project")),
      false,
    );
    assert.match(readFileSync(fixture.log, "utf8"), /build:cabadrive/);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make build fails closed when the historical runtime label cannot be inspected", () => {
  const fixture = createMakeProvenanceFixture({ labelMode: "failure" });
  try {
    const result = runMake(fixture.root, "build", fixture.env);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stderr, /failed to inspect project runtime label/i);
    assert.equal(
      existsSync(join(fixture.root, ".cabadrive-release-handoff/.adopted-project")),
      false,
    );
    assert.equal(existsSync(fixture.buildSentinel), false);
    assert.doesNotMatch(readFileSync(fixture.log, "utf8"), /\|compose\b/);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make build fails closed on an unexpected historical runtime label", () => {
  const fixture = createMakeProvenanceFixture({ labelMode: "unexpected" });
  try {
    const result = runMake(fixture.root, "build", fixture.env);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stderr, /unexpected project runtime label/i);
    assert.equal(
      existsSync(join(fixture.root, ".cabadrive-release-handoff/.adopted-project")),
      false,
    );
    assert.equal(existsSync(fixture.buildSentinel), false);
    assert.doesNotMatch(readFileSync(fixture.log, "utf8"), /\|compose\b/);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make build stops before image replacement when discovered adoption cannot publish", () => {
  const fixture = createMakeProvenanceFixture();
  try {
    const result = runMake(fixture.root, "build", {
      ...fixture.env,
      CABADRIVE_ADOPTION_FAULT: "durability:fsync-file",
    });
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stderr, /failed to persist adopted Compose project identity/i);
    assert.equal(existsSync(fixture.buildSentinel), false);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual make retries a visible adopted record after its parent durability barrier fails", () => {
  const fixture = createMakeProvenanceFixture();
  const adopted = join(fixture.root, ".cabadrive-release-handoff/.adopted-project");
  try {
    const interrupted = runMake(fixture.root, "build", {
      ...fixture.env,
      CABADRIVE_ADOPTION_FAULT: "durability:fsync-directory",
    });
    assert.notEqual(interrupted.status, 0, interrupted.stdout + interrupted.stderr);
    assert.equal(readFileSync(adopted, "utf8"), `${fixture.project}\n`);
    assert.equal(existsSync(fixture.buildSentinel), false);

    const retried = runMake(fixture.root, "build", fixture.env);
    assert.equal(retried.status, 0, retried.stdout + retried.stderr);
    const log = readFileSync(fixture.log, "utf8");
    assert.ok(log.indexOf("adopted-project-verify") < log.lastIndexOf(`build:${fixture.project}`));
    assert.equal(existsSync(fixture.buildSentinel), true);
  } finally {
    if (existsSync(fixture.root)) rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("actual Make rejects an empty symlinked handoff root before any Docker action", () => {
  const root = join(tmpdir(), `cabadrive-empty-handoff-root-${process.pid}-${Date.now()}`);
  const external = join(root, "external");
  const bin = join(root, "bin");
  const scripts = join(root, "scripts");
  const action = join(root, "docker-action");
  mkdirSync(external, { recursive: true });
  mkdirSync(bin, { recursive: true });
  mkdirSync(scripts, { recursive: true });
  writeFileSync(join(external, "sentinel"), "external bytes");
  symlinkSync(external, join(root, ".cabadrive-release-handoff"));
  writeFileSync(join(root, "Makefile"), readFileSync(join(repositoryRoot, "Makefile")));
  writeFileSync(join(scripts, "capture-legacy-assets.sh"), readFileSync(captureScript));
  chmodSync(join(scripts, "capture-legacy-assets.sh"), 0o755);
  const docker = join(bin, "docker");
  writeFileSync(docker, `#!/bin/sh\n: >"$CABADRIVE_ACTION_SENTINEL"\nexit 0\n`);
  chmodSync(docker, 0o755);
  try {
    for (const explicit of [undefined, "caller-override"]) {
      const env = {
        ...process.env,
        CABADRIVE_REPOSITORY_ROOT: root,
        CABADRIVE_ACTION_SENTINEL: action,
        PATH: `${bin}:${process.env.PATH}`,
      };
      if (explicit) env.COMPOSE_PROJECT_NAME = explicit;
      else delete env.COMPOSE_PROJECT_NAME;
      const result = runMake(root, "build", env);
      assert.notEqual(result.status, 0, result.stdout + result.stderr);
      assert.match(result.stderr, /legacy handoff root is not a repository-owned directory/i);
      assert.equal(existsSync(action), false);
      assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "external bytes");
    }
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

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
if [ "$1" = compose ]; then printf '%s\\n' legacy-container; exit 0; fi
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
if [ "\${1:-}" = --resolve-project ] || [ "$#" -eq 0 ]; then
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
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in *com.cabadrive.release-state-runtime*) exit 0 ;; esac
  printf '%s\\n' legacy-image-id
  exit 0
fi
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
if [ "$1" = compose ]; then exit 0; fi
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

test("historical image inspection failure fails closed instead of selecting the default project", () => {
  const root = join(tmpdir(), `cabadrive-historical-inspect-failure-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = image ]; then printf '%s\\n' 'daemon temporarily unavailable' >&2; exit 42; fi
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
    const result = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /failed to inspect project runtime image/i);
    assert.doesNotMatch(result.stdout, /cabadrive/);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("confirmed absent historical image keeps default project resolution", () => {
  const root = join(tmpdir(), `cabadrive-historical-absent-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = image ]; then printf '%s\\n' 'Error response from daemon: No such image' >&2; exit 1; fi
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
    const result = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), "cabadrive");
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("unsafe checkout basenames skip optional image probes and default actual Make", () => {
  for (const prefix of ["CABADRIVE-UPPER-", "cabadrive space-", "cabadrive.dot-"]) {
    const root = mkdtempSync(join(tmpdir(), prefix));
    const bin = join(root, "bin");
    const scripts = join(root, "scripts");
    const log = join(root, "docker.log");
    const invalidProbe = join(root, "invalid-image-probe");
    const build = join(root, "build-started");
    mkdirSync(bin, { recursive: true });
    mkdirSync(scripts, { recursive: true });
    writeFileSync(join(root, "Makefile"), readFileSync(join(repositoryRoot, "Makefile")));
    writeFileSync(join(scripts, "capture-legacy-assets.sh"), readFileSync(captureScript));
    chmodSync(join(scripts, "capture-legacy-assets.sh"), 0o755);
    const docker = join(bin, "docker");
    writeFileSync(
      docker,
      `#!/bin/sh
set -eu
printf '%s\\n' "$*" >>"${log}"
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *cabadrive-cabadrive*) printf '%s\\n' 'Error response from daemon: No such image' >&2; exit 1 ;;
    *) : >"${invalidProbe}"; printf '%s\\n' 'unsafe historical image probe' >&2; exit 88 ;;
  esac
fi
if [ "$1" = compose ]; then
  case " $* " in
    *" build "*) : >"${build}" ;;
  esac
  exit 0
fi
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
      const resolved = spawnSync("sh", [captureScript, "--resolve-project"], {
        cwd: root,
        encoding: "utf8",
        env,
      });
      assert.equal(resolved.status, 0, `${prefix}: ${resolved.stderr}`);
      assert.equal(resolved.stdout.trim(), "cabadrive");
      assert.equal(existsSync(invalidProbe), false, `${prefix}: invalid image inspect`);

      const made = runMake(root, "build", env);
      assert.equal(made.status, 0, `${prefix}: ${made.stdout}${made.stderr}`);
      assert.equal(existsSync(invalidProbe), false, `${prefix}: invalid image inspect`);
      assert.equal(existsSync(build), true, `${prefix}: default project build did not run`);
      assert.match(readFileSync(log, "utf8"), /compose.*build/);
    } finally {
      if (existsSync(root)) rmSync(root, { recursive: true, force: true });
    }
  }
});

test("a discovered historical project is persisted before later labelled-image resolution", () => {
  const root = join(tmpdir(), `cabadrive-adopted-project-${process.pid}-${Date.now()}`);
  const project = root.split("/").at(-1);
  const bin = join(root, "bin");
  const phase = join(root, "image-phase");
  mkdirSync(bin, { recursive: true });
  writeFileSync(phase, "legacy");
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *com.cabadrive.release-state-runtime*)
      [ "$(cat "${phase}")" = labeled ] && printf '%s\\n' true
      ;;
    *) printf '%s\\n' legacy-image-id ;;
  esac
  exit 0
fi
if [ "$1" = create ]; then printf '%s\\n' temporary-container; exit 0; fi
if [ "$1" = cp ]; then mkdir -p "$3"; printf '%s' legacy-bytes >"$3/lazy-a.js"; exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *adopted-project-write*)
      printf '%s\n' "${project}" >"${root}/.cabadrive-release-handoff/.adopted-project"
      ;;
    *adopted-project-verify*)
      cat "${root}/.cabadrive-release-handoff/.adopted-project"
      ;;
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/${project}/releases" -mindepth 1 -maxdepth 1 -type d | sed -n '1p')"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/${project}/current"
      ;;
  esac
  exit 0
fi
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
    const capture = spawnSync("sh", [captureScript], { cwd: root, encoding: "utf8", env });
    assert.equal(capture.status, 0, capture.stderr);
    assert.equal(
      readFileSync(join(root, ".cabadrive-release-handoff/.adopted-project"), "utf8").trim(),
      project,
    );

    writeFileSync(phase, "labeled");
    const resolved = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    assert.equal(resolved.status, 0, resolved.stderr);
    assert.equal(resolved.stdout.trim(), project);

    const explicit = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env: { ...env, COMPOSE_PROJECT_NAME: "explicit" },
    });
    assert.equal(explicit.status, 0, explicit.stderr);
    assert.equal(explicit.stdout.trim(), "explicit");
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("resolve-only rejects an adopted identity beneath an unsafe handoff root before discovery", () => {
  const root = join(tmpdir(), `cabadrive-unsafe-adopted-root-${process.pid}-${Date.now()}`);
  const external = join(root, "external");
  mkdirSync(external, { recursive: true });
  writeFileSync(join(external, ".adopted-project"), "historical\n");
  symlinkSync(external, join(root, ".cabadrive-release-handoff"));
  try {
    const env = { ...process.env, CABADRIVE_REPOSITORY_ROOT: root };
    delete env.COMPOSE_PROJECT_NAME;
    const result = spawnSync("sh", [captureScript, "--resolve-project"], {
      cwd: root,
      encoding: "utf8",
      env,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /handoff root is not a repository-owned directory/i);
    assert.equal(readFileSync(join(external, ".adopted-project"), "utf8"), "historical\n");
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("project discovery fails closed when Docker ps or inspect fails", () => {
  for (const failure of ["ps", "inspect"]) {
    const root = join(tmpdir(), `cabadrive-discovery-${failure}-${process.pid}-${Date.now()}`);
    const bin = join(root, "bin");
    mkdirSync(bin, { recursive: true });
    const docker = join(bin, "docker");
    writeFileSync(
      docker,
      `#!/bin/sh
if [ "$1" = ps ]; then [ "${failure}" = ps ] && exit 41; printf '%s\\n' container; exit 0; fi
if [ "$1" = inspect ]; then exit 42; fi
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
      const result = spawnSync("sh", [captureScript, "--resolve-project"], {
        cwd: root,
        encoding: "utf8",
        env,
      });
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        new RegExp(`failed to ${failure === "ps" ? "discover" : "inspect"}`, "i"),
      );
    } finally {
      if (existsSync(root)) rmSync(root, { recursive: true, force: true });
    }
  }
});

test("a failed project Compose lookup cannot fall through to image capture or handoff mutation", () => {
  const root = join(tmpdir(), `cabadrive-compose-ps-failure-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const imageFallback = join(root, "image-fallback");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = compose ]; then printf '%s\\n' 'compose unavailable' >&2; exit 71; fi
if [ "$1" = image ] || [ "$1" = create ] || [ "$1" = cp ] || [ "$1" = run ]; then : >"${imageFallback}"; exit 90; fi
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
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /failed to discover project Compose container/i);
    assert.equal(existsSync(imageFallback), false);
    assert.equal(existsSync(join(root, ".cabadrive-release-handoff")), false);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("an unreadable stopped runtime image fails before initial-install or capture fallback", () => {
  const root = join(tmpdir(), `cabadrive-image-inspect-failure-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const captureFallback = join(root, "capture-fallback");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = volume ]; then exit 1; fi
if [ "$1" = image ]; then printf '%s\\n' 'daemon temporarily unavailable' >&2; exit 42; fi
if [ "$1" = create ] || [ "$1" = cp ] || [ "$1" = run ]; then : >"${captureFallback}"; exit 90; fi
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
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /failed to inspect project runtime image/i);
    assert.doesNotMatch(result.stdout, /initial-install/i);
    assert.equal(existsSync(captureFallback), false);
    assert.deepEqual(
      readdirSync(join(root, ".cabadrive-release-handoff", "fixture", "releases")),
      [],
    );
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("a confirmed absent stopped runtime image keeps the clean-install path", () => {
  const root = join(tmpdir(), `cabadrive-image-absent-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = volume ]; then exit 1; fi
if [ "$1" = image ]; then printf '%s\\n' 'Error response from daemon: No such image: fixture-cabadrive' >&2; exit 1; fi
if [ "$1" = create ] || [ "$1" = cp ] || [ "$1" = run ]; then exit 90; fi
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
    assert.match(result.stdout, /initial-install: no project-scoped legacy release found/i);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture rejects a symlinked releases directory before creating a temporary capture", () => {
  const root = join(tmpdir(), `cabadrive-releases-symlink-${process.pid}-${Date.now()}`);
  const external = join(root, "external");
  const handoff = join(root, ".cabadrive-release-handoff", "fixture");
  const bin = join(root, "bin");
  mkdirSync(external, { recursive: true });
  mkdirSync(handoff, { recursive: true });
  writeFileSync(join(external, "sentinel"), "external");
  symlinkSync(external, join(handoff, "releases"));
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = compose ]; then exit 0; fi
: >"${join(root, "unexpected-docker-call")}"; exit 90
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
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /releases is not a repository-owned directory/i);
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "external");
    assert.deepEqual(readdirSync(external), ["sentinel"]);
    assert.equal(existsSync(join(root, "unexpected-docker-call")), false);
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture rejects a traversal Compose project before creating a handoff child", () => {
  const root = join(tmpdir(), `cabadrive-capture-project-path-${process.pid}-${Date.now()}`);
  const external = join(root, "external");
  mkdirSync(external, { recursive: true });
  writeFileSync(join(external, "sentinel"), "do not mutate");
  try {
    const result = spawnSync("sh", [captureScript], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        COMPOSE_PROJECT_NAME: "../../external",
        CABADRIVE_REPOSITORY_ROOT: root,
      },
    });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /safe lowercase path component/i);
    assert.equal(existsSync(join(root, ".cabadrive-release-handoff")), false);
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "do not mutate");
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture rejects a symlinked safe project handoff before external mutation", () => {
  const root = join(tmpdir(), `cabadrive-capture-handoff-link-${process.pid}-${Date.now()}`);
  const external = join(root, "external");
  const handoffParent = join(root, ".cabadrive-release-handoff");
  mkdirSync(external, { recursive: true });
  writeFileSync(join(external, "sentinel"), "do not mutate");
  mkdirSync(handoffParent, { recursive: true });
  symlinkSync(external, join(handoffParent, "fixture"));
  const bin = join(root, "bin");
  mkdirSync(bin, { recursive: true });
  writeFileSync(join(root, "docker-compose.yml"), "services: {}\n");
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
if [ "$1" = compose ]; then exit 0; fi
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
    assert.match(result.stderr, /project is not a repository-owned directory/i);
    assert.equal(readlinkSync(join(handoffParent, "fixture")), external);
    assert.equal(existsSync(join(external, "releases")), false);
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "do not mutate");
  } finally {
    if (existsSync(root)) rmSync(root, { recursive: true, force: true });
  }
});

test("capture replaces a valid handoff when its outgoing legacy image changed", () => {
  const root = join(tmpdir(), `cabadrive-capture-source-change-${process.pid}-${Date.now()}`);
  const bin = join(root, "bin");
  const handoff = join(root, ".cabadrive-release-handoff/fixture");
  const oldRelease = join(handoff, "releases/old");
  mkdirSync(join(oldRelease, "assets"), { recursive: true });
  writeFileSync(join(oldRelease, "source-id"), "old-image\n");
  writeFileSync(join(oldRelease, "source-kind"), "baked-legacy-root\n");
  writeFileSync(join(oldRelease, ".legacy-handoff.json"), "old marker\n");
  symlinkSync("releases/old", join(handoff, "current"));
  mkdirSync(bin, { recursive: true });
  const docker = join(bin, "docker");
  writeFileSync(
    docker,
    `#!/bin/sh
set -eu
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in *com.cabadrive.release-state-runtime*) exit 0 ;; esac
  printf '%s\\n' new-image
  exit 0
fi
if [ "$1" = create ]; then printf '%s\\n' replacement-container; exit 0; fi
if [ "$1" = cp ]; then mkdir -p "$3"; printf '%s' replacement-bytes >"$3/new-a.js"; exit 0; fi
if [ "$1" = run ]; then
  case "$*" in
    *legacy-verify*) exit 0 ;;
    *legacy-write*) exit 0 ;;
    *legacy-publish-pointer*)
      release="$(find "${root}/.cabadrive-release-handoff/fixture/releases" -mindepth 1 -maxdepth 1 -type d ! -name old | sed -n '1p')"
      rm -f "${root}/.cabadrive-release-handoff/fixture/current"
      ln -s "releases/$(basename "$release")" "${root}/.cabadrive-release-handoff/fixture/current"
      exit 0
      ;;
  esac
  exit 0
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
    assert.match(result.stdout, /captured legacy assets from new-image/);
    assert.equal(readFileSync(join(handoff, "current/source-id"), "utf8").trim(), "new-image");
    assert.equal(
      readFileSync(join(handoff, "current/assets/new-a.js"), "utf8"),
      "replacement-bytes",
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
printf '%s|%s\\n' "\${COMPOSE_PROJECT_NAME:-}" "$*" >>"${log}"
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = ps ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in
    *com.cabadrive.release-state-runtime*) exit 0 ;;
    *cabadrive-cabadrive*) printf '%s\\n' default-image; exit 0 ;;
    *) printf '%s\\n' 'Error response from daemon: No such image' >&2; exit 1 ;;
  esac
fi
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
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in *com.cabadrive.release-state-runtime*) exit 0 ;; esac
  printf '%s\\n' legacy-image-id
  exit 0
fi
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
if [ "$1" = compose ]; then exit 0; fi
if [ "$1" = volume ] && [ "$2" = inspect ]; then exit 1; fi
if [ "$1" = image ] && [ "$2" = inspect ]; then
  case "$*" in *com.cabadrive.release-state-runtime*) exit 0 ;; esac
  printf '%s\\n' legacy-image-id
  exit 0
fi
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
