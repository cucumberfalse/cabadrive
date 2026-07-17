import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const marker = "STALE_DIST_MUST_NOT_BE_CAPTURED";
const committedScreenshots = ["learn.png", "materials.png", "about.png"].map((name) => `docs_project/screens/readme/${name}`);

function screenshotState() {
  return committedScreenshots.map((path) => ({
    path,
    hash: createHash("sha256").update(readFileSync(path)).digest("hex"),
    mtimeMs: statSync(path).mtimeMs
  }));
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function runPublicCommand(env, timeout) {
  return execFileAsync("pnpm", ["run", "screenshots:readme"], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    timeout,
    maxBuffer: 10 * 1024 * 1024
  });
}

const root = mkdtempSync(join(tmpdir(), "cabadrive-readme-build-contract-"));
const failedOutput = join(root, "failed");
const successfulOutput = join(root, "successful");
const before = screenshotState();
try {
  mkdirSync("dist", { recursive: true });
  writeFileSync("dist/index.html", marker);
  const failedAt = Date.now();
  await assert.rejects(
    runPublicCommand({
      README_SCREENSHOT_FORCE_BUILD_FAILURE: "1",
      README_SCREENSHOT_OUTPUT_DIR: failedOutput,
      README_SCREENSHOT_PORT: String(await availablePort())
    }, 10_000),
    (error) => {
      assert.equal(error.killed, false);
      assert.doesNotMatch(`${error.stdout}\n${error.stderr}`, /Captured and pixel-checked|Vite preview/);
      return true;
    }
  );
  assert.ok(Date.now() - failedAt < 10_000, "failed build stays within the verifier bound");
  assert.equal(readFileSync("dist/index.html", "utf8"), marker);
  assert.equal(existsSync(failedOutput), false);
  assert.deepEqual(screenshotState(), before);

  await runPublicCommand({
    README_SCREENSHOT_OUTPUT_DIR: successfulOutput,
    README_SCREENSHOT_PORT: String(await availablePort())
  }, 180_000);
  assert.doesNotMatch(readFileSync("dist/index.html", "utf8"), new RegExp(marker));
  for (const name of ["learn.png", "materials.png", "about.png"]) assert.equal(existsSync(join(successfulOutput, name)), true);
  assert.deepEqual(screenshotState(), before);

  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts;
  assert.doesNotMatch(scripts.build, /screenshots:readme/);
  assert.equal(scripts["screenshots:readme"], "node scripts/run-readme-screenshots.mjs");
  console.log("README screenshot build contract passed: failed build preserved stale dist/no capture; successful current build replaced it and captured current About/version/content to temp output.");
} finally {
  rmSync(root, { recursive: true, force: true });
}
