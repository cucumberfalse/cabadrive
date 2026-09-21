#!/usr/bin/env node
/** Executable Docker A->B retention regression, intentionally self-cleaning. */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const suffix = `${process.pid}-${Date.now()}`;
const project = `cabadrive-retention-${suffix}`.toLowerCase();
const stoppedProject = `${project}-stopped`;
const siblingProject = `${project}-sibling`;
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
  spawnSync("docker", ["volume", "rm", "-f", `${selectedProject}_release-state`], {
    stdio: "ignore",
  });
}

try {
  // Running-container first migration: capture A before B image replacement.
  buildLegacyImage(project);
  startLegacyContainer(project);
  make(["build"], project);
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

  process.stdout.write(`Docker asset-retention lifecycle passed for ${project}\n`);
} finally {
  cleanupProject(project);
  cleanupProject(stoppedProject);
  spawnSync("docker", ["volume", "rm", "-f", `${siblingProject}_release-state`], {
    stdio: "ignore",
  });
  rmSync(temporary, { recursive: true, force: true });
}
