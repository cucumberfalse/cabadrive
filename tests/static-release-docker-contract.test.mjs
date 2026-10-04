import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";
import { writeLegacyHandoffManifest } from "../scripts/stage-static-release.mjs";

const dockerfile = readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");
const dockerignore = readFileSync(new URL("../.dockerignore", import.meta.url), "utf8");
const nginx = readFileSync(new URL("../nginx.conf", import.meta.url), "utf8");
const capture = readFileSync(
  new URL("../scripts/capture-legacy-assets.sh", import.meta.url),
  "utf8",
);
const dockerRetention = readFileSync(
  new URL("../scripts/test-docker-asset-retention.mjs", import.meta.url),
  "utf8",
);
const staticExport = readFileSync(
  new URL("../scripts/export-static-release.sh", import.meta.url),
  "utf8",
);
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const backendDocs = readFileSync(
  new URL("../docs_project/project/backend/backend-docs.md", import.meta.url),
  "utf8",
);
const stageScript = new URL("../scripts/stage-static-release.mjs", import.meta.url);
const renameSource = new URL("../scripts/rename-noreplace.c", import.meta.url);

function candidate(root, name, assetName) {
  const path = join(root, name);
  mkdirSync(join(path, "assets"), { recursive: true });
  writeFileSync(join(path, "index.html"), `<title>${name}</title>`);
  writeFileSync(join(path, "sw.js"), `self.release = ${JSON.stringify(name)};`);
  writeFileSync(join(path, "assets", assetName), `${name} bytes`);
  return path;
}

function runStage(root, helper, command, values) {
  const args = [stageScript.pathname, command];
  for (const [name, value] of Object.entries(values)) args.push(`--${name}`, value);
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      CABADRIVE_RENAME_NOREPLACE_HELPER: helper,
      CABADRIVE_TEST_KERNEL_LOCK: "in-process",
    },
  });
}

test("the stager is Docker-contained and nginx exposes retained immutable assets", () => {
  assert.match(dockerfile, /FROM node:22-alpine AS stager/);
  assert.match(dockerfile, /\/candidate/);
  assert.match(dockerfile, /stage-static-release\.mjs/);
  assert.match(dockerfile, /FROM alpine:3\.21 AS rename-noreplace-helper/);
  assert.match(dockerfile, /COPY scripts\/rename-noreplace\.c/);
  assert.match(dockerfile, /CABADRIVE_RENAME_NOREPLACE_HELPER=\/app\/scripts\/rename-noreplace/);
  assert.match(
    dockerfile,
    /\[ -e \/legacy-handoff\/current \] \|\| \[ -L \/legacy-handoff\/current \]/,
  );
  assert.match(dockerfile, /--legacy \/legacy-handoff\/current; else exec node/);
  assert.match(nginx, /root \/state\/current/);
  assert.match(nginx, /alias \/state\/assets\//);
  assert.match(nginx, /location \/assets\//);
  assert.match(nginx, /try_files \$uri =404/);
  assert.match(dockerignore, /^\.cabadrive-release-handoff$/m);
  assert.match(dockerRetention, /\["image", "rm", "-f", `\$\{selectedProject\}-stager`\]/);
  assert.match(dockerRetention, /const testHandoffProjects = new Set/);
  assert.match(dockerRetention, /rmSync\(handoff, \{ recursive: true, force: true \}\)/);
  assert.match(dockerRetention, /cleanupHandoffProject\(selectedProject\)/);
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
  assert.match(capture, /legacy-write[\s\S]*--handoff \/handoff/);
  assert.match(capture, /\.cabadrive-release-handoff/);
  assert.doesNotMatch(capture, /docker (?:stop|rm)\s+cabadrive/);
});

test("documented Docker bootstrap publishes then exports one exact fresh transaction", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-static-command-"));
  const helper = join(root, "rename-noreplace");
  execFileSync("cc", ["-O2", "-Wall", "-Wextra", "-o", helper, renameSource.pathname]);
  try {
    const state = join(root, "state");
    const output = join(root, "publish");
    const destination = join(root, "archive");
    const a = candidate(root, "candidate-a", "a.js");
    const legacy = join(root, "legacy");
    mkdirSync(join(legacy, "assets"), { recursive: true });
    writeFileSync(join(legacy, "assets", "legacy-hash.js"), "legacy hashed bytes");
    writeLegacyHandoffManifest({
      legacyRoot: legacy,
      sourceId: "legacy-runtime-id",
      sourceKind: "baked-legacy-root",
    });
    const bootstrap = runStage(root, helper, "publish-export", {
      state,
      candidate: a,
      output,
      destination,
      legacy,
    });
    assert.equal(bootstrap.status, 0, bootstrap.stdout + bootstrap.stderr);
    const result = JSON.parse(bootstrap.stdout);
    assert.ok(result.releaseId);
    assert.equal(
      readFileSync(join(destination, "index.html"), "utf8"),
      "<title>candidate-a</title>",
    );
    assert.equal(readFileSync(join(destination, "assets", "a.js"), "utf8"), "candidate-a bytes");
    assert.equal(
      readFileSync(join(state, "assets", "legacy-hash.js"), "utf8"),
      "legacy hashed bytes",
    );
    assert.equal(
      readFileSync(join(destination, "assets", "legacy-hash.js"), "utf8"),
      "legacy hashed bytes",
    );

    const cleanState = join(root, "clean-state");
    const cleanOutput = join(root, "clean-output");
    const cleanDestination = join(root, "clean-archive");
    const clean = runStage(root, helper, "publish-export", {
      state: cleanState,
      candidate: a,
      output: cleanOutput,
      destination: cleanDestination,
    });
    assert.equal(clean.status, 0, clean.stdout + clean.stderr);
    assert.equal(readFileSync(join(cleanState, "assets", "a.js"), "utf8"), "candidate-a bytes");
    assert.equal(
      readFileSync(join(cleanDestination, "assets", "a.js"), "utf8"),
      "candidate-a bytes",
    );

    for (const [name, invalidLegacy] of [
      ["missing", join(root, "missing-legacy")],
      ["invalid", join(root, "invalid-legacy")],
    ]) {
      if (name === "invalid") {
        mkdirSync(join(invalidLegacy, "assets"), { recursive: true });
        writeFileSync(join(invalidLegacy, "assets", "untrusted.js"), "untrusted");
      }
      const invalidState = join(root, `${name}-state`);
      const invalidOutput = join(root, `${name}-output`);
      const invalidDestination = join(root, `${name}-archive`);
      const invalid = runStage(root, helper, "publish-export", {
        state: invalidState,
        candidate: a,
        output: invalidOutput,
        destination: invalidDestination,
        legacy: invalidLegacy,
      });
      assert.notEqual(invalid.status, 0, name);
      assert.match(invalid.stderr, /legacy handoff is not authoritative|ENOENT/i);
      assert.equal(existsSync(invalidState), false);
      assert.equal(existsSync(invalidOutput), false);
      assert.equal(existsSync(invalidDestination), false);
    }

    const absentDestination = join(root, "absent-archive");
    const absent = runStage(root, helper, "export", {
      state: join(root, "absent-state"),
      candidate: a,
      output: join(root, "absent-output"),
      destination: absentDestination,
    });
    assert.notEqual(absent.status, 0);
    assert.match(absent.stderr, /not an exact serving transaction/i);
    assert.equal(existsSync(absentDestination), false);

    const b = candidate(root, "candidate-b", "b.js");
    const stagedB = runStage(root, helper, "stage", { state, candidate: b });
    assert.equal(stagedB.status, 0, stagedB.stdout + stagedB.stderr);
    const mismatchDestination = join(root, "mismatch-archive");
    const mismatch = runStage(root, helper, "export", {
      state,
      candidate: a,
      output,
      destination: mismatchDestination,
    });
    assert.notEqual(mismatch.status, 0);
    assert.match(mismatch.stderr, /not an exact committed artifact/i);
    assert.equal(existsSync(mismatchDestination), false);

    assert.match(staticExport, /publish-export/);
    assert.match(
      staticExport,
      /capture-legacy-assets\.sh"\nproject=.*capture-legacy-assets\.sh" --resolve-project/,
    );
    assert.match(staticExport, /docker compose[\s\S]*build stager/);
    assert.match(
      staticExport,
      /legacy_handoff=.*\/current[\s\S]*\[ -L "\$legacy_handoff" \][\s\S]*set -- --legacy \/legacy-handoff\/current[\s\S]*elif \[ -e "\$legacy_handoff" \]/,
    );
    assert.match(staticExport, /--destination "\/export\/\$destination_name" "\$@"/);
    assert.match(
      readme,
      /\.\/scripts\/export-static-release\.sh \/absolute\/path\/cabadrive-static/,
    );
    assert.match(
      backendDocs,
      /stage that legacy inventory[\s\S]*committing one `publish`[\s\S]*exporting the\s+same transaction/,
    );
    assert.match(backendDocs, /verified clean\/post-feature capture\s+with no `current` pointer/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("export wrapper distinguishes absent, symlink, and non-symlink current entries", () => {
  for (const kind of ["absent", "dangling", "file", "directory"]) {
    const root = mkdtempSync(join(tmpdir(), `cabadrive-static-wrapper-${kind}-`));
    try {
      const scripts = join(root, "scripts");
      const bin = join(root, "bin");
      const projectRoot = join(root, ".cabadrive-release-handoff", "fixture");
      const log = join(root, "docker.log");
      mkdirSync(scripts, { recursive: true });
      mkdirSync(bin, { recursive: true });
      mkdirSync(projectRoot, { recursive: true });
      writeFileSync(join(root, "docker-compose.yml"), "services: {}\n");
      writeFileSync(join(scripts, "export-static-release.sh"), staticExport);
      chmodSync(join(scripts, "export-static-release.sh"), 0o755);
      writeFileSync(
        join(scripts, "capture-legacy-assets.sh"),
        '#!/bin/sh\nif [ "${1:-}" = "--resolve-project" ]; then printf "%s\\n" fixture; fi\n',
      );
      chmodSync(join(scripts, "capture-legacy-assets.sh"), 0o755);
      writeFileSync(
        join(bin, "docker"),
        '#!/bin/sh\nprintf "%s\\n" "$*" >>"$CABADRIVE_DOCKER_LOG"\n',
      );
      chmodSync(join(bin, "docker"), 0o755);
      const current = join(projectRoot, "current");
      if (kind === "dangling") symlinkSync("releases/missing", current);
      if (kind === "file") writeFileSync(current, "not a pointer");
      if (kind === "directory") mkdirSync(current);

      const result = spawnSync(
        "sh",
        [join(scripts, "export-static-release.sh"), join(root, "out")],
        {
          encoding: "utf8",
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            CABADRIVE_DOCKER_LOG: log,
          },
        },
      );
      if (kind === "file" || kind === "directory") {
        assert.notEqual(result.status, 0, kind);
        assert.match(result.stderr, /current entry must be a symlink/i);
        assert.equal(existsSync(log), false);
      } else {
        assert.equal(result.status, 0, result.stdout + result.stderr);
        const dockerArgs = readFileSync(log, "utf8");
        if (kind === "dangling") assert.match(dockerArgs, /--legacy \/legacy-handoff\/current/);
        else assert.doesNotMatch(dockerArgs, /--legacy/);
      }
      assert.equal(existsSync(join(root, "out")), false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});
