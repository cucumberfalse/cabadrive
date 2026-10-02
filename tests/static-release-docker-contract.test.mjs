import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";

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
    const bootstrap = runStage(root, helper, "publish-export", {
      state,
      candidate: a,
      output,
      destination,
    });
    assert.equal(bootstrap.status, 0, bootstrap.stdout + bootstrap.stderr);
    const result = JSON.parse(bootstrap.stdout);
    assert.ok(result.releaseId);
    assert.equal(
      readFileSync(join(destination, "index.html"), "utf8"),
      "<title>candidate-a</title>",
    );
    assert.equal(readFileSync(join(destination, "assets", "a.js"), "utf8"), "candidate-a bytes");

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
    assert.match(staticExport, /docker compose[\s\S]*build stager/);
    assert.match(staticExport, /--state \/state[\s\S]*--candidate \/candidate/);
    assert.match(
      readme,
      /\.\/scripts\/export-static-release\.sh \/absolute\/path\/cabadrive-static/,
    );
    assert.match(backendDocs, /commit one `publish`[\s\S]*exporting that same transaction/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
