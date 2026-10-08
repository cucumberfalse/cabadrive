#!/usr/bin/env node
/** Executable Docker A->B retention regression, intentionally self-cleaning. */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  statSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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
const retryProject = `${project}-publish-retry`;
const testHandoffProjects = new Set([
  project,
  stoppedProject,
  initialProject,
  siblingProject,
  lockProject,
  retryProject,
]);
const handoffBase = join(root, ".cabadrive-release-handoff");
const port = process.env.CABADRIVE_HOST_PORT || String(5600 + (process.pid % 300));
const temporary = realpathSync(mkdtempSync(join(tmpdir(), "cabadrive-docker-retention-")));
const legacyBytes = "export const legacyLazy = 'retained-origin-A';";
const legacyAssetPath = `/assets/lazy-a-${createHash("sha256").update(legacyBytes).digest("hex").slice(0, 8)}.js`;

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
  && printf %s ${JSON.stringify(legacyBytes)} > /usr/share/nginx/html${legacyAssetPath} \\
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
  const body = run("curl", ["--fail", "--silent", `http://localhost:${port}${legacyAssetPath}`]);
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

async function assertIntegratedRuntime(selectedProject, retained = false) {
  const shell = candidateFile(selectedProject, "index.html");
  const currentAsset = shell.match(/src="(\/assets\/[^" ]+\.js)"/)?.[1];
  if (!currentAsset) throw new Error("candidate shell has no hashed script asset");
  const contentAsset = run("docker", [
    "run",
    "--rm",
    `${selectedProject}-stager`,
    "find",
    "/candidate/content/assets",
    "-type",
    "f",
    "-print",
    "-quit",
  ])
    .trim()
    .replace(/^\/candidate/, "");
  if (!contentAsset.startsWith("/content/assets/"))
    throw new Error("candidate has no unhashed content asset");
  const security = {
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "content-security-policy":
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
  };
  const immutable = "public, max-age=31536000, immutable";
  const cases = [
    ["/", 200, null],
    ["/index.html", 200, null],
    ["/integration-spa-route", 200, null],
    ["/sw.js", 200, "no-cache"],
    [currentAsset, 200, immutable],
    [contentAsset, 200, "public, max-age=86400, stale-while-revalidate=604800"],
    [legacyAssetPath, retained ? 200 : 404, retained ? immutable : null],
    ["/assets/missing-integration-404.js", 404, null],
    ["/content/assets/missing-integration-404.png", 404, null],
  ];
  const evidence = [];
  for (const [path, status, cache] of cases) {
    const response = await fetch(`http://localhost:${port}${path}`, {
      headers: { "Accept-Encoding": "gzip" },
    });
    if (response.status !== status || response.headers.get("cache-control") !== cache)
      throw new Error(
        `runtime status/cache mismatch on ${path}: ${response.status}/${response.headers.get("cache-control")}`,
      );
    for (const [name, expected] of Object.entries(security)) {
      if (response.headers.get(name) !== expected)
        throw new Error(`runtime security header ${name} missing/changed on ${path}`);
    }
    await response.arrayBuffer();
    if (path === currentAsset && response.headers.get("content-encoding") !== "gzip")
      throw new Error("current JavaScript asset was not gzip encoded");
    evidence.push({
      path,
      status,
      cache,
      securityHeaders: 5,
      gzip: response.headers.get("content-encoding") === "gzip",
    });
  }
  const processStatus = compose(
    ["exec", "-T", "cabadrive", "cat", "/proc/1/status"],
    selectedProject,
  );
  const masterUid = Number(processStatus.match(/^Uid:\s+(\d+)/m)?.[1]);
  const runtimeUid = Number(
    compose(["exec", "-T", "cabadrive", "id", "-u"], selectedProject).trim(),
  );
  const masterCommand = compose(
    ["exec", "-T", "cabadrive", "cat", "/proc/1/cmdline"],
    selectedProject,
  );
  if (
    !Number.isSafeInteger(masterUid) ||
    masterUid === 0 ||
    !Number.isSafeInteger(runtimeUid) ||
    runtimeUid === 0 ||
    !masterCommand.includes("nginx")
  )
    throw new Error("runtime nginx master or exec identity is not unprivileged");
  process.stdout.write(
    `Integrated runtime headers passed: ${JSON.stringify({ project: selectedProject, masterUid, runtimeUid, responses: evidence })}\n`,
  );
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
  spawnSync("docker", ["volume", "rm", "-f", `${selectedProject}_static-publish`], {
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

function assertCrossContainerPublishRetry(selectedProject) {
  const faultPoints = [
    "crash-before-output-rename",
    "crash-after-output-rename-before-parent-fsync",
    "after-output",
    "durability:export-rename",
    "after-export",
  ];
  for (const [index, faultAt] of faultPoints.entries()) {
    const transactionProject = `${selectedProject}-${index}`;
    const stateVolume = `${transactionProject}_release-state`;
    const publishVolume = `${transactionProject}_static-publish`;
    const destinationName = `two-container-export-${index}`;
    const destination = join(temporary, destinationName);
    const probeName = `.cabadrive-export-owner-probe.Retry${index}`;
    const probe = join(temporary, probeName);
    writeFileSync(probe, "", { flag: "wx", mode: 0o600 });
    chmodSync(probe, 0o600);
    run("docker", ["volume", "create", stateVolume]);
    run("docker", ["volume", "create", publishVolume]);
    const common = [
      "run",
      "--rm",
      "-e",
      `CABADRIVE_COMPOSE_PROJECT=${transactionProject}`,
      "-v",
      `${stateVolume}:/state`,
      "-v",
      `${publishVolume}:/publish`,
      "-v",
      `${temporary}:/export`,
      "--entrypoint",
      "node",
      `${project}-stager`,
      "/app/scripts/stage-static-release.mjs",
      "publish-export",
      "--state",
      "/state",
      "--candidate",
      "/candidate",
      "--output",
      "/publish/cabadrive-static-publish",
      "--generation-root",
      "/publish",
      "--destination",
      `/export/${destinationName}`,
      "--owner-probe",
      `/export/${probeName}`,
      "--owner-uid",
      String(process.getuid()),
      "--owner-gid",
      String(process.getgid()),
    ];
    try {
      const faulted = spawnSync("docker", [...common, "--fault", faultAt], {
        encoding: "utf8",
      });
      if (faulted.status === 0 || !/fault injection/i.test(faulted.stderr || "")) {
        throw new Error(`first publish container did not stop at ${faultAt}: ${faulted.stderr}`);
      }
      const resumed = spawnSync("docker", common, { encoding: "utf8" });
      if (resumed.status !== 0) {
        throw new Error(`fresh publish container did not resume ${faultAt}: ${resumed.stderr}`);
      }
      const publishedShell = readFileSync(join(destination, "index.html"), "utf8");
      if (!publishedShell.includes("<!doctype html")) {
        throw new Error(`fresh publish retry did not export the candidate shell: ${faultAt}`);
      }
      const current = run("docker", [
        "run",
        "--rm",
        "-v",
        `${stateVolume}:/state:ro`,
        "alpine:3.21",
        "readlink",
        "/state/current",
      ]).trim();
      if (!/^releases\/[a-f0-9]{64}$/.test(current)) {
        throw new Error(`fresh publish retry did not activate exact state: ${faultAt}`);
      }
    } finally {
      spawnSync("docker", ["volume", "rm", "-f", stateVolume], { stdio: "ignore" });
      spawnSync("docker", ["volume", "rm", "-f", publishVolume], { stdio: "ignore" });
      rmSync(destination, { recursive: true, force: true });
      rmSync(probe, { force: true });
    }
  }
}

function assertSequentialPublishGenerations(selectedProject) {
  const stateVolume = `${selectedProject}_release-state`;
  const publishVolume = `${selectedProject}_static-publish`;
  const candidateB = join(temporary, "candidate-sequential-b");
  const destinationA = join(temporary, "sequential-a");
  const destinationB = join(temporary, "sequential-b");
  mkdirSync(join(candidateB, "assets"), { recursive: true });
  writeFileSync(join(candidateB, "index.html"), "<!doctype html><title>sequential B</title>");
  writeFileSync(join(candidateB, "sw.js"), "self.release = 'sequential-b';");
  writeFileSync(join(candidateB, "assets", "sequential-b.js"), "sequential B bytes");
  run("docker", ["volume", "create", stateVolume]);
  run("docker", ["volume", "create", publishVolume]);
  let probeSequence = 0;
  const publish = (candidate, destinationName, extraMount = [], faultAt) => {
    const probeName = `.cabadrive-export-owner-probe.Sequential${probeSequence++}`;
    const probe = join(temporary, probeName);
    writeFileSync(probe, "", { flag: "wx", mode: 0o600 });
    chmodSync(probe, 0o600);
    try {
      return run("docker", [
        "run",
        "--rm",
        "-e",
        `CABADRIVE_COMPOSE_PROJECT=${selectedProject}`,
        "-v",
        `${stateVolume}:/state`,
        "-v",
        `${publishVolume}:/publish`,
        "-v",
        `${temporary}:/export`,
        ...extraMount,
        "--entrypoint",
        "node",
        `${project}-stager`,
        "/app/scripts/stage-static-release.mjs",
        "publish-export",
        "--state",
        "/state",
        "--candidate",
        candidate,
        "--output",
        "/publish/cabadrive-static-publish",
        "--generation-root",
        "/publish",
        "--destination",
        `/export/${destinationName}`,
        "--owner-probe",
        `/export/${probeName}`,
        "--owner-uid",
        String(process.getuid()),
        "--owner-gid",
        String(process.getgid()),
        ...(faultAt ? ["--fault", faultAt] : []),
      ]);
    } finally {
      rmSync(probe, { force: true });
    }
  };
  try {
    publish("/candidate", "sequential-a");
    publish("/candidate-b", "sequential-b", ["-v", `${candidateB}:/candidate-b:ro`]);
    if (!readFileSync(join(destinationB, "index.html"), "utf8").includes("sequential B")) {
      throw new Error("second release did not publish from a new persistent generation");
    }
    // C commits, then retirement fails after the old output unlink. A fresh
    // D container must resume that exact cleanup before D can activate.
    const extraDestinations = [];
    for (const name of ["c", "d"]) {
      const candidate = join(temporary, `candidate-${name}`);
      mkdirSync(join(candidate, "assets"), { recursive: true });
      writeFileSync(
        join(candidate, "index.html"),
        `<!doctype html><title>sequential ${name.toUpperCase()}</title>`,
      );
      writeFileSync(join(candidate, "sw.js"), `self.release = 'sequential-${name}';`);
      writeFileSync(join(candidate, "assets", `sequential-${name}.js`), `sequential ${name} bytes`);
      if (name === "c") {
        let faulted = false;
        try {
          publish(
            `/candidate-${name}`,
            `sequential-${name}`,
            ["-v", `${candidate}:/candidate-${name}:ro`],
            "durability:retirement-unlink",
          );
        } catch (error) {
          if (!String(error.stderr || error.message).includes("retirement-unlink")) throw error;
          faulted = true;
        }
        if (!faulted) throw new Error("cross-container retirement fault was not reached");
      } else {
        publish(`/candidate-${name}`, `sequential-${name}`, [
          "-v",
          `${candidate}:/candidate-${name}:ro`,
        ]);
      }
      extraDestinations.push(join(temporary, `sequential-${name}`));
    }
    const generationLinks = run("docker", [
      "run",
      "--rm",
      "-v",
      `${publishVolume}:/publish:ro`,
      "alpine:3.21",
      "find",
      "/publish",
      "-maxdepth",
      "1",
      "-type",
      "l",
    ])
      .trim()
      .split("\n")
      .filter(Boolean);
    const generationTrees = run("docker", [
      "run",
      "--rm",
      "-v",
      `${publishVolume}:/publish:ro`,
      "alpine:3.21",
      "find",
      "/publish",
      "-mindepth",
      "1",
      "-maxdepth",
      "1",
      "-type",
      "d",
    ])
      .trim()
      .split("\n")
      .filter(Boolean);
    if (generationLinks.length !== 2 || generationTrees.length !== 2)
      throw new Error(
        "cross-container retirement did not bound exact active/rollback outputs and trees",
      );
    run("docker", [
      "run",
      "--rm",
      "-v",
      `${stateVolume}:/state:ro`,
      "alpine:3.21",
      "test",
      "!",
      "-e",
      "/state/publish-retirement.json",
    ]);
    for (const destination of extraDestinations) rmSync(destination, { recursive: true });
    rmSync(destinationA, { recursive: true });
    rmSync(destinationB, { recursive: true });
    if (existsSync(destinationA) || existsSync(destinationB)) {
      throw new Error("host-owned exported artifacts were not removable without privilege");
    }
  } finally {
    spawnSync("docker", ["volume", "rm", "-f", stateVolume], { stdio: "ignore" });
    spawnSync("docker", ["volume", "rm", "-f", publishVolume], { stdio: "ignore" });
  }
}

// Exercise literal host paths with real Docker label transport, bind CSV and
// Compose adoption. Reuse this run's exact B images; never rebuild web content.
async function assertLiteralCheckoutPaths() {
  const cases = [
    { name: "cabadrive|old", stopped: false },
    { name: 'cabadrive, "old', stopped: true },
    { name: "checkout\n", stopped: false },
  ];
  for (const [index, row] of cases.entries()) {
    const selectedProject = `${project}-literal-${index}`;
    const fixtureParent = join(temporary, `literal-${index}`);
    const checkout = join(fixtureParent, row.name);
    const scripts = join(checkout, "scripts");
    const legacyName = `${selectedProject}-legacy-a`;
    mkdirSync(scripts, { recursive: true });
    const fixtureEnv = {
      ...process.env,
      CABADRIVE_HOST_PORT: port,
      CABADRIVE_REPOSITORY_ROOT: checkout,
    };
    delete fixtureEnv.COMPOSE_PROJECT_NAME;
    for (const name of [
      "capture-legacy-assets.sh",
      "export-static-release.sh",
      "stage-static-release.mjs",
    ]) {
      writeFileSync(join(scripts, name), readFileSync(join(root, "scripts", name)));
      chmodSync(join(scripts, name), 0o755);
    }
    writeFileSync(join(checkout, "Makefile"), readFileSync(join(root, "Makefile")));
    writeFileSync(join(checkout, "sentinel"), "literal checkout");
    const plainSibling = row.name.endsWith("\n")
      ? join(fixtureParent, row.name.slice(0, -1))
      : null;
    if (plainSibling) {
      mkdirSync(plainSibling);
      writeFileSync(join(plainSibling, "sentinel"), "plain sibling");
    }
    writeFileSync(
      join(checkout, "docker-compose.yml"),
      `name: \${COMPOSE_PROJECT_NAME:-cabadrive}
services:
  stager:
    image: ${project}-stager
    volumes:
      - release-state:/state
      - static-publish:/publish
      - ./.cabadrive-release-handoff/\${COMPOSE_PROJECT_NAME:-cabadrive}:/legacy-handoff:ro
    environment:
      CABADRIVE_COMPOSE_PROJECT: \${COMPOSE_PROJECT_NAME:-cabadrive}
  cabadrive:
    image: ${project}-cabadrive
    ports:
      - "${port}:8080"
    volumes:
      - release-state:/state:ro
    depends_on:
      stager:
        condition: service_completed_successfully
volumes:
  release-state:
  static-publish:
`,
    );
    const inFixture = (command, args) => run(command, args, { cwd: checkout, env: fixtureEnv });
    if (plainSibling) {
      buildLegacyImage(selectedProject);
      run("docker", [
        "run",
        "-d",
        "--name",
        legacyName,
        "--label",
        `com.docker.compose.project=${selectedProject}`,
        "--label",
        "com.docker.compose.service=cabadrive",
        "--label",
        `com.docker.compose.project.working_dir=${checkout}`,
        "--label",
        `com.docker.compose.project.config_files=${checkout}/docker-compose.yml`,
        `${selectedProject}-cabadrive`,
      ]);
      try {
        const containerBefore = run("docker", [
          "inspect",
          "--format",
          "{{.Id}}|{{.Image}}|{{.State.Running}}|{{.State.Status}}|{{.State.StartedAt}}",
          legacyName,
        ]);
        const bytesBefore = run("docker", [
          "exec",
          legacyName,
          "cat",
          `/usr/share/nginx/html${legacyAssetPath}`,
        ]);
        // Actual Compose schema URL handling rejects LF checkout paths. The
        // wrapper must diagnose this BEFORE even calling Docker or publishing A.
        const upstream = spawnSync(
          "docker",
          ["compose", "-f", join(checkout, "docker-compose.yml"), "config", "--quiet"],
          { cwd: checkout, env: fixtureEnv, encoding: "utf8" },
        );
        if (upstream.status === 0 || !upstream.stderr.includes("invalid control character"))
          throw new Error("expected measured Compose checkout URL limitation");
        const sentinels = [join(checkout, "sentinel"), join(plainSibling, "sentinel")];
        const before = sentinels.map((path) => statSync(path, { bigint: true }));
        const probe = join(fixtureParent, "docker-called");
        const bin = join(fixtureParent, "bin");
        mkdirSync(bin);
        writeFileSync(join(bin, "docker"), '#!/bin/sh\n: >"$CABADRIVE_DOCKER_PROBE"\nexit 97\n');
        chmodSync(join(bin, "docker"), 0o755);
        const rejected = spawnSync("make", ["build"], {
          cwd: checkout,
          env: { ...fixtureEnv, PATH: `${bin}:${fixtureEnv.PATH}`, CABADRIVE_DOCKER_PROBE: probe },
          encoding: "utf8",
        });
        if (
          rejected.status === 0 ||
          !rejected.stderr.includes("unsupported control characters") ||
          existsSync(probe)
        )
          throw new Error("unsupported checkout reached Docker before rejection");
        for (const root of [checkout, plainSibling])
          if (existsSync(join(root, ".cabadrive-release-handoff")))
            throw new Error("unsupported checkout mutated a handoff or sibling");
        const after = sentinels.map((path) => statSync(path, { bigint: true }));
        if (
          before.some((entry, index) =>
            ["dev", "ino", "mode", "uid", "gid", "size", "mtimeNs", "ctimeNs"].some(
              (key) => entry[key] !== after[index][key],
            ),
          )
        )
          throw new Error("unsupported checkout changed sentinel metadata");
        if (
          readFileSync(sentinels[0], "utf8") !== "literal checkout" ||
          readFileSync(sentinels[1], "utf8") !== "plain sibling"
        )
          throw new Error("unsupported checkout changed sentinel bytes");
        if (
          run("docker", [
            "inspect",
            "--format",
            "{{.Id}}|{{.Image}}|{{.State.Running}}|{{.State.Status}}|{{.State.StartedAt}}",
            legacyName,
          ]) !== containerBefore ||
          run("docker", ["inspect", "--format", "{{.State.Running}}", legacyName]).trim() !==
            "true" ||
          run("docker", ["exec", legacyName, "cat", `/usr/share/nginx/html${legacyAssetPath}`]) !==
            bytesBefore ||
          bytesBefore !== legacyBytes
        )
          throw new Error(
            "unsupported checkout changed historical container identity/state/A bytes",
          );
        process.stdout.write(
          `Literal Docker checkout ${JSON.stringify(row.name)}: measured Compose schema URL rejection; early wrapper rejection/ZERO Docker calls/no handoff/legacy ID-state-A/sibling bytes+metadata PASS\n`,
        );
        continue;
      } finally {
        spawnSync("docker", ["rm", "-f", legacyName], { stdio: "ignore" });
        spawnSync("docker", ["image", "rm", "-f", `${selectedProject}-cabadrive`], {
          stdio: "ignore",
        });
      }
    }

    try {
      buildLegacyImage(selectedProject);
      run("docker", [
        "run",
        "-d",
        "--name",
        legacyName,
        "--label",
        `com.docker.compose.project=${selectedProject}`,
        "--label",
        "com.docker.compose.service=cabadrive",
        "--label",
        `com.docker.compose.project.working_dir=${checkout}`,
        "--label",
        `com.docker.compose.project.config_files=${checkout}/docker-compose.yml`,
        `${selectedProject}-cabadrive`,
      ]);
      if (row.stopped) run("docker", ["stop", legacyName]);
      const resolved = inFixture("sh", [
        join(scripts, "capture-legacy-assets.sh"),
        "--resolve-project",
      ]);
      if (resolved !== `${selectedProject}\n`)
        throw new Error(
          `literal checkout lost historical project: ${JSON.stringify({ checkout, resolved, selectedProject })}`,
        );
      inFixture("make", ["build"]);
      const adopted = readFileSync(
        join(checkout, ".cabadrive-release-handoff", ".adopted-project"),
        "utf8",
      );
      if (adopted !== `${selectedProject}\n`)
        throw new Error("literal checkout persisted the wrong project");
      const retained = readFileSync(
        join(
          checkout,
          ".cabadrive-release-handoff",
          selectedProject,
          "current",
          legacyAssetPath.slice(1),
        ),
        "utf8",
      );
      if (retained !== legacyBytes) throw new Error("literal checkout captured different A bytes");
      inFixture("make", ["up"]);
      await waitFor(`http://localhost:${port}/`);
      assertExactLegacyAsset();
      assertExactCandidateShellAndWorker(project);
      inFixture("docker", ["compose", "restart", "cabadrive"]);
      await waitFor(`http://localhost:${port}/`);
      assertExactLegacyAsset();
      assertExactCandidateShellAndWorker(project);
      inFixture("make", ["down"]);
      inFixture("make", ["up"]);
      await waitFor(`http://localhost:${port}/`);
      assertExactLegacyAsset();
      assertExactCandidateShellAndWorker(project);
      const exportParent = join(fixtureParent, 'export, "parent\n');
      mkdirSync(exportParent);
      const destination = join(exportParent, "static-output\n");
      inFixture("sh", [join(scripts, "export-static-release.sh"), destination]);
      if (readFileSync(join(destination, legacyAssetPath.slice(1)), "utf8") !== legacyBytes)
        throw new Error("literal export lost A bytes");
      if (readFileSync(join(destination, "sw.js"), "utf8") !== candidateFile(project, "sw.js"))
        throw new Error("literal export changed B worker");
      rmSync(destination, { recursive: true });
      if (readFileSync(join(checkout, "sentinel"), "utf8") !== "literal checkout")
        throw new Error("literal checkout sentinel changed");
      if (
        plainSibling &&
        (readFileSync(join(plainSibling, "sentinel"), "utf8") !== "plain sibling" ||
          existsSync(join(plainSibling, ".cabadrive-release-handoff")))
      )
        throw new Error("trailing LF was truncated to the plain sibling");
      if (existsSync(join(checkout, ".cabadrive-release-handoff", "cabadrive")))
        throw new Error("literal checkout silently selected default");
      process.stdout.write(
        `Literal Docker checkout ${JSON.stringify(row.name)} ${row.stopped ? "stopped" : "running"}: adoption/A/B-SW/restart/down-up/export/siblings PASS\n`,
      );
    } finally {
      spawnSync("docker", ["compose", "-p", selectedProject, "down"], {
        cwd: checkout,
        env: fixtureEnv,
        stdio: "ignore",
      });
      spawnSync("docker", ["rm", "-f", legacyName], { stdio: "ignore" });
      spawnSync("docker", ["image", "rm", "-f", `${selectedProject}-cabadrive`], {
        stdio: "ignore",
      });
      for (const volume of ["release-state", "static-publish"])
        spawnSync("docker", ["volume", "rm", "-f", `${selectedProject}_${volume}`], {
          stdio: "ignore",
        });
    }
  }
}

try {
  // Running-container first migration: capture A before B image replacement.
  buildLegacyImage(project);
  startLegacyContainer(project);
  make(["build"], project);
  assertCrossContainerKernelLock(lockProject);
  assertCrossContainerPublishRetry(retryProject);
  assertSequentialPublishGenerations(`${retryProject}-sequential`);
  make(["up"], project);
  await waitFor(`http://localhost:${port}/`);
  assertExactLegacyAsset();
  assertExactCandidateShellAndWorker(project);
  await assertIntegratedRuntime(project, true);
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

  await assertLiteralCheckoutPaths();

  // Stopped-image first migration: no legacy container, only exact old image.
  buildLegacyImage(stoppedProject);
  make(["build"], stoppedProject);
  make(["up"], stoppedProject);
  await waitFor(`http://localhost:${port}/`);
  const stoppedBody = run("curl", [
    "--fail",
    "--silent",
    `http://localhost:${port}${legacyAssetPath}`,
  ]);
  if (stoppedBody !== legacyBytes) throw new Error("stopped legacy image was not retained");
  assertExactCandidateShellAndWorker(stoppedProject);
  await assertIntegratedRuntime(stoppedProject, true);
  await assertCandidateWorkerControls();
  make(["down"], stoppedProject);

  // A clean initial install has neither a legacy source nor a retained-state
  // tuple. It must still stage and serve the exact candidate release.
  make(["build"], initialProject);
  make(["up"], initialProject);
  await waitFor(`http://localhost:${port}/`);
  assertExactCandidateShellAndWorker(initialProject);
  await assertIntegratedRuntime(initialProject);
  await assertCandidateWorkerControls();
  const absentLegacy = spawnSync(
    "curl",
    ["--fail", "--silent", `http://localhost:${port}${legacyAssetPath}`],
    { encoding: "utf8" },
  );
  if (absentLegacy.status === 0)
    throw new Error("initial install unexpectedly inherited a legacy asset");

  process.stdout.write(`Docker asset-retention lifecycle passed for ${project}\n`);
} finally {
  cleanupProject(project);
  cleanupProject(stoppedProject);
  cleanupProject(initialProject);
  cleanupProject(retryProject);
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
