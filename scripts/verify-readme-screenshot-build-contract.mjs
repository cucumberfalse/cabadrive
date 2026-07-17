import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const marker = "STALE_DIST_MUST_NOT_BE_CAPTURED";
const committedScreenshots = ["learn.png", "materials.png", "about.png"].map(
  (name) => `docs_project/screens/readme/${name}`,
);

function screenshotState() {
  return committedScreenshots.map((path) => ({
    path,
    hash: createHash("sha256").update(readFileSync(path)).digest("hex"),
    mtimeMs: statSync(path).mtimeMs,
  }));
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

async function runPublicCommand(env, timeout) {
  return execFileAsync("pnpm", ["run", "screenshots:readme"], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    timeout,
    maxBuffer: 10 * 1024 * 1024,
  });
}

const root = mkdtempSync(join(tmpdir(), "cabadrive-readme-build-contract-"));
const failedOutput = join(root, "failed");
const backupDir = join(root, "backup");
const before = screenshotState();
try {
  mkdirSync(backupDir);
  for (const path of committedScreenshots)
    copyFileSync(path, join(backupDir, path.split("/").at(-1)));

  mkdirSync("dist", { recursive: true });
  writeFileSync("dist/index.html", marker);
  const failedAt = Date.now();
  await assert.rejects(
    runPublicCommand(
      {
        README_SCREENSHOT_FORCE_BUILD_FAILURE: "1",
        README_SCREENSHOT_OUTPUT_DIR: failedOutput,
        README_SCREENSHOT_PORT: String(await availablePort()),
      },
      10_000,
    ),
    (error) => {
      assert.equal(error.killed, false);
      assert.doesNotMatch(
        `${error.stdout}\n${error.stderr}`,
        /Captured and pixel-checked|Vite preview/,
      );
      return true;
    },
  );
  assert.ok(Date.now() - failedAt < 10_000, "failed build stays within the verifier bound");
  assert.equal(readFileSync("dist/index.html", "utf8"), marker);
  assert.equal(existsSync(failedOutput), false);
  assert.deepEqual(screenshotState(), before);

  rmSync(committedScreenshots[0]);
  writeFileSync(committedScreenshots[1], "corrupt screenshot fixture");
  const recovered = await runPublicCommand(
    {
      README_SCREENSHOT_PORT: String(await availablePort()),
    },
    180_000,
  );
  assert.doesNotMatch(readFileSync("dist/index.html", "utf8"), new RegExp(marker));
  assert.match(`${recovered.stdout}\n${recovered.stderr}`, /Attribution validation passed/);
  assert.deepEqual(
    screenshotState().map(({ path, hash }) => ({ path, hash })),
    before.map(({ path, hash }) => ({ path, hash })),
  );

  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
  const wrapper = readFileSync("scripts/run-readme-screenshots.mjs", "utf8");
  assert.doesNotMatch(scripts.build, /screenshots:readme/);
  assert.match(scripts.build, /validate:content/);
  assert.match(scripts.build, /build:app/);
  assert.match(scripts.preflight, /validate:content/);
  assert.match(scripts.preflight, /pnpm run build/);
  assert.equal(
    scripts["build:app"],
    "pnpm run prepare:assets && vite build && pnpm run generate:sw",
  );
  assert.doesNotMatch(
    scripts["build:app"],
    /screenshots:readme|validate:attribution|validate:content/,
  );
  assert.equal(scripts["screenshots:readme"], "node scripts/run-readme-screenshots.mjs");
  assert.equal(
    Object.values(scripts).some((command) => command.includes("capture-readme-screenshots.mjs")),
    false,
  );
  assert.ok(
    wrapper.indexOf('["run", "build:app"]') <
      wrapper.indexOf('["scripts/capture-readme-screenshots.mjs"]'),
  );
  assert.ok(
    wrapper.indexOf('["scripts/capture-readme-screenshots.mjs"]') <
      wrapper.indexOf('["run", "validate:attribution"]'),
  );
  console.log(
    "README screenshot bootstrap contract passed: failed SPA build preserved stale dist/no capture; public command recovered missing/corrupt artifacts from current source and post-validated attribution.",
  );
} finally {
  for (const path of committedScreenshots) {
    const backup = join(backupDir, path.split("/").at(-1));
    if (existsSync(backup)) copyFileSync(backup, path);
  }
  rmSync(root, { recursive: true, force: true });
}
