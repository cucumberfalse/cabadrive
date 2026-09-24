#!/usr/bin/env node
/** Executable Docker A->B retention regression, intentionally self-cleaning. */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const suffix = `${process.pid}-${Date.now()}`;
const project = `cabadrive-retention-${suffix}`.toLowerCase();
const stoppedProject = `${project}-stopped`;
const initialProject = `${project}-initial`;
const siblingProject = `${project}-sibling`;
const lockProject = `${project}-lock`;
const testHandoffProjects = new Set([
  project,
  stoppedProject,
  initialProject,
  siblingProject,
  lockProject,
]);
const handoffBase = join(root, ".cabadrive-release-handoff");
const port = String(5600 + (process.pid % 300));
const temporary = mkdtempSync(join(tmpdir(), "cabadrive-docker-retention-"));
const legacyBytes = "export const legacyLazy = 'retained-origin-A';";

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
}

function compose(args, selectedProject) {
  return run("docker", ["compose", "-p", selectedProject, ...args]);
}

function make(args, selectedProject) {
  return run("make", args, {
    env: { ...process.env, COMPOSE_PROJECT_NAME: selectedProject, CABADRIVE_HOST_PORT: port },
  });
}

function buildLegacyImage(selectedProject) {
  const dockerfile = `FROM nginx:1.29-alpine
RUN mkdir -p /usr/share/nginx/html/assets \\
  && printf %s ${JSON.stringify(legacyBytes)} > /usr/share/nginx/html/assets/lazy-a.js \\
  && printf %s '<!doctype html><title>legacy A</title>' > /usr/share/nginx/html/index.html
`;
  writeFileSync(join(temporary, "Dockerfile"), dockerfile);
  run("docker", ["build", "--quiet", "-t", `${selectedProject}-cabadrive`, temporary]);
}

async function waitFor(url) {
  let lastError;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`${url} returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  }
  throw lastError || new Error(`timed out waiting for ${url}`);
}

function startLegacyContainer(selectedProject) {
  return run("docker", [
    "run",
    "-d",
    "--label",
    `com.docker.compose.project=${selectedProject}`,
    "--label",
    "com.docker.compose.service=cabadrive",
    "--name",
    `${selectedProject}-legacy-a`,
    `${selectedProject}-cabadrive`,
  ]).trim();
}

function assertExactLegacyAsset() {
  const body = run("curl", ["--fail", "--silent", `http://localhost:${port}/assets/lazy-a.js`]);
  if (body !== legacyBytes)
    throw new Error("retained legacy asset bytes changed or were not served");
}

function candidateFile(selectedProject, path) {
  return run("docker", ["run", "--rm", `${selectedProject}-stager`, "cat", `/candidate/${path}`]);
}

function assertExactCandidateShellAndWorker(selectedProject) {
  const expectedShell = candidateFile(selectedProject, "index.html");
  const expectedWorker = candidateFile(selectedProject, "sw.js");
  const actualShell = run("curl", ["--fail", "--silent", `http://localhost:${port}/`]);
  const actualWorker = run("curl", ["--fail", "--silent", `http://localhost:${port}/sw.js`]);
  if (actualShell !== expectedShell)
    throw new Error("B index.html is not served from the committed candidate release");
  if (actualWorker !== expectedWorker)
    throw new Error("B sw.js is not served from the committed candidate release");
}

async function assertCandidateWorkerControls() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
    await page.waitForFunction(() =>
      navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)),
    );
    await page.reload({ waitUntil: "networkidle" });
    const controlled = await page.evaluate(
      () => navigator.serviceWorker.controller?.scriptURL.endsWith("/sw.js") === true,
    );
    if (!controlled)
      throw new Error("candidate B service worker did not activate and control the browser");
  } finally {
    await browser.close();
  }
}

function cleanupProject(selectedProject) {
  spawnSync("docker", ["compose", "-p", selectedProject, "down"], { cwd: root, stdio: "ignore" });
  spawnSync("docker", ["rm", "-f", `${selectedProject}-legacy-a`], { stdio: "ignore" });
  spawnSync("docker", ["image", "rm", "-f", `${selectedProject}-cabadrive`], { stdio: "ignore" });
  spawnSync("docker", ["image", "rm", "-f", `${selectedProject}-stager`], { stdio: "ignore" });
  spawnSync("docker", ["volume", "rm", "-f", `${selectedProject}_release-state`], {
    stdio: "ignore",
  });
  cleanupHandoffProject(selectedProject);
}

function cleanupHandoffProject(selectedProject) {
  if (!testHandoffProjects.has(selectedProject)) {
    throw new Error(`refusing to clean a non-test legacy handoff project: ${selectedProject}`);
  }
  const handoff = join(handoffBase, selectedProject);
  rmSync(handoff, { recursive: true, force: true });
  if (existsSync(handoff))
    throw new Error(`test legacy handoff cleanup failed: ${selectedProject}`);
}

function assertCrossContainerKernelLock(selectedProject) {
  const volume = `${selectedProject}_release-state`;
  const holder = `${selectedProject}-holder`;
  run("docker", ["volume", "create", volume]);
  run("docker", [
    "run",
    "-d",
    "--name",
    holder,
    "-e",
    `CABADRIVE_COMPOSE_PROJECT=${selectedProject}`,
    "-e",
    "CABADRIVE_TEST_HOLD_LOCK_MS=15000",
    "-v",
    `${volume}:/state`,
    `${project}-stager`,
  ]);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const ready = spawnSync("docker", ["exec", holder, "test", "-s", "/state/stage.lock"]);
    if (ready.status === 0) break;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
    if (attempt === 29) throw new Error("kernel-lock holder did not become ready");
  }
  const contender = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-e",
      `CABADRIVE_COMPOSE_PROJECT=${selectedProject}`,
      "-v",
      `${volume}:/state`,
      `${project}-stager`,
    ],
    { encoding: "utf8" },
  );
  if (contender.status === 0 || !/exclusive kernel lock/i.test(contender.stderr || "")) {
    throw new Error(
      `overlapping stager crossed the kernel-lock boundary: status=${contender.status} stderr=${contender.stderr}`,
    );
  }
  run("docker", ["kill", holder]);
  run("docker", ["rm", holder]);
  run("docker", [
    "run",
    "--rm",
    "-e",
    `CABADRIVE_COMPOSE_PROJECT=${selectedProject}`,
    "-v",
    `${volume}:/state`,
    `${project}-stager`,
  ]);
  run("docker", ["volume", "rm", volume]);
}

try {
  // Running-container first migration: capture A before B image replacement.
  buildLegacyImage(project);
  startLegacyContainer(project);
  make(["build"], project);
  assertCrossContainerKernelLock(lockProject);
  make(["up"], project);
  await waitFor(`http://localhost:${port}/`);
  assertExactLegacyAsset();
  assertExactCandidateShellAndWorker(project);
  await assertCandidateWorkerControls();
  compose(["restart", "cabadrive"], project);
  await waitFor(`http://localhost:${port}/`);
  assertExactLegacyAsset();
  assertExactCandidateShellAndWorker(project);
  await assertCandidateWorkerControls();

  // A sibling test-owned volume is never read or changed by this project.
  run("docker", ["volume", "create", `${siblingProject}_release-state`]);
  run("docker", [
    "run",
    "--rm",
    "-v",
    `${siblingProject}_release-state:/state`,
    "alpine:3.21",
    "sh",
    "-c",
    "printf sibling > /state/sentinel",
  ]);
  make(["down"], project);
  make(["up"], project);
  await waitFor(`http://localhost:${port}/`);
  assertExactLegacyAsset();
  assertExactCandidateShellAndWorker(project);
  await assertCandidateWorkerControls();
  const sibling = run("docker", [
    "run",
    "--rm",
    "-v",
    `${siblingProject}_release-state:/state:ro`,
    "alpine:3.21",
    "cat",
    "/state/sentinel",
  ]);
  if (sibling !== "sibling") throw new Error("sibling Compose volume was changed");
  make(["down"], project);

  // Stopped-image first migration: no legacy container, only exact old image.
  buildLegacyImage(stoppedProject);
  make(["build"], stoppedProject);
  make(["up"], stoppedProject);
  await waitFor(`http://localhost:${port}/`);
  const stoppedBody = run("curl", [
    "--fail",
    "--silent",
    `http://localhost:${port}/assets/lazy-a.js`,
  ]);
  if (stoppedBody !== legacyBytes) throw new Error("stopped legacy image was not retained");
  assertExactCandidateShellAndWorker(stoppedProject);
  await assertCandidateWorkerControls();
  make(["down"], stoppedProject);

  // A clean initial install has neither a legacy source nor a retained-state
  // tuple. It must still stage and serve the exact candidate release.
  make(["build"], initialProject);
  make(["up"], initialProject);
  await waitFor(`http://localhost:${port}/`);
  assertExactCandidateShellAndWorker(initialProject);
  await assertCandidateWorkerControls();
  const absentLegacy = spawnSync(
    "curl",
    ["--fail", "--silent", `http://localhost:${port}/assets/lazy-a.js`],
    { encoding: "utf8" },
  );
  if (absentLegacy.status === 0)
    throw new Error("initial install unexpectedly inherited a legacy asset");

  process.stdout.write(`Docker asset-retention lifecycle passed for ${project}\n`);
} finally {
  cleanupProject(project);
  cleanupProject(stoppedProject);
  cleanupProject(initialProject);
  spawnSync("docker", ["rm", "-f", `${lockProject}-holder`], { stdio: "ignore" });
  spawnSync("docker", ["volume", "rm", "-f", `${lockProject}_release-state`], {
    stdio: "ignore",
  });
  spawnSync("docker", ["volume", "rm", "-f", `${siblingProject}_release-state`], {
    stdio: "ignore",
  });
  cleanupHandoffProject(siblingProject);
  cleanupHandoffProject(lockProject);
  rmSync(temporary, { recursive: true, force: true });
}
