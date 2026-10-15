#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync, statfsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkpointDigest,
  checkpointExcluded,
  checkpointInventory,
} from "./docker-image-checkpoint.mjs";
import { copyImageTestContext } from "./copy-image-test-context.mjs";
import { prepareLinuxFixtureDependencies } from "./docker-image-fixture-dependencies.mjs";

// This explicit real Linux regression is separate from aggregate acceptance.
// The ordinary full driver must still run production, negative and two releases.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), "cabadrive-vite-temp-"));
const context = join(temporary, "context");
const token = `cabadrive-vite-${process.pid}-${Date.now()}`;
const image = `${token}-tools`;
const evidenceRoot = join(root, ".cache/image-qa/ticket-upscale");
mkdirSync(evidenceRoot, { recursive: true });
const commands = [];
const volumes = [];
let createdImage = false;
let error;
let report;
const cleanupErrors = [];
let traceBytes = 0;
let traceError;
let cleaning = false;
const inventory = checkpointInventory(root);
function errorEvidence(caught) {
  const text = String(caught?.stack ?? caught);
  return {
    category: String(caught?.name ?? "Error").slice(0, 128),
    bytes: Buffer.byteLength(text),
    sha256: createHash("sha256").update(text).digest("hex"),
    excerpt: text.slice(0, 4096),
  };
}
function docker(args, { failure = false, input } = {}) {
  if (traceError && !cleaning) throw traceError;
  const result = spawnSync("docker", args, {
    cwd: root,
    encoding: "utf8",
    input,
    maxBuffer: 64 * 1024 ** 2,
  });
  if (result.error) throw result.error;
  const record = {
    args,
    exit: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    completedAt: new Date().toISOString(),
  };
  // Complete identities are persisted by the helper. Avoid duplicating their
  // large bytes in command telemetry while retaining the exact output digest.
  if (result.status === 0 && args.some((argument) => argument.includes("nativeReceiptSha256"))) {
    record.stdout = {
      bytes: Buffer.byteLength(result.stdout),
      sha256: createHash("sha256").update(result.stdout).digest("hex"),
      completeIdentityReports: `${token}-dependencies*.json`,
    };
  }
  const bytes = Buffer.byteLength(JSON.stringify(record));
  if (traceBytes + bytes <= 16 * 1024 ** 2) {
    commands.push(record);
    traceBytes += bytes;
  } else {
    traceError ??= new Error("focused command trace exceeds16MiB budget");
  }
  if (!failure && result.status !== 0)
    throw new Error(`docker command failed:\n${result.stdout}\n${result.stderr}`);
  return result;
}
function capacity(phase, dockerPeakGiB, hostPeakGiB) {
  const output = docker([
    "run",
    "--rm",
    "--network=none",
    "--name",
    `${token}-capacity`,
    "--entrypoint",
    "df",
    "alpine:3.21",
    "-k",
    "/",
  ]).stdout;
  const backingFree = Number(output.trim().split("\n").at(-1).split(/\s+/)[3]) * 1024;
  const host = statfsSync(temporary);
  const hostFree = host.bavail * host.bsize;
  assert(Number.isFinite(backingFree));
  const proof = {
    phase,
    checkedAt: new Date().toISOString(),
    backingFree,
    hostFree,
    dockerPeakGiB,
    hostPeakGiB,
  };
  console.log(JSON.stringify(proof));
  assert(backingFree >= (dockerPeakGiB + 2) * 1024 ** 3, "Docker backing reserve failed");
  assert(hostFree >= (hostPeakGiB + 2) * 1024 ** 3, "Host reserve failed");
  return proof;
}
try {
  assert.equal(
    docker(["ps", "-q"]).stdout.trim(),
    "",
    "focused regression requires quiescent Docker",
  );
  capacity("before-pinned-tools", 3.24, process.platform === "darwin" ? 3.34 : 4.47);
  const clone = copyImageTestContext(root, context, checkpointExcluded);
  assert.deepEqual(checkpointInventory(context), inventory);
  const built = docker(
    [
      "build",
      "--progress=plain",
      "--target",
      "image-pipeline-fixture-tools",
      "--label",
      `com.cabadrive.image-pipeline-test=${token}`,
      "-t",
      image,
      context,
    ],
    { failure: true },
  );
  if (built.status === 0) createdImage = true; // Register before every later assertion/probe.
  assert.equal(built.status, 0, `${built.stdout}\n${built.stderr}`);
  const imageIdentity = JSON.parse(docker(["image", "inspect", image]).stdout)[0];
  assert.equal(imageIdentity.Config.Labels["com.cabadrive.image-pipeline-test"], token);
  capacity("before-readonly-vite-regression", 2.03, 2.66);
  const linux = prepareLinuxFixtureDependencies({
    docker,
    context,
    image,
    token,
    volumes,
    uid: process.getuid(),
    gid: process.getgid(),
    evidenceRoot,
  });
  console.log("Original readonly failure and isolated temporary mount checks completed");
  const builtApplication = linux.run(["pnpm", "run", "build"]);
  assert.match(
    builtApplication.stdout,
    /Ticket upscale: 275 individually reviewed masters; 276 original references verified/,
  );
  assert.match(builtApplication.stdout, /built in/);
  linux.assertIntegrity();
  const nativeOutputs = linux.probeOutputs();
  assert(nativeOutputs.dist.files.length > 0);
  assert.deepEqual(checkpointInventory(root), inventory, "protected included source changed");
  assert.deepEqual(
    checkpointInventory(context),
    inventory,
    "ordinary build changed included context",
  );
  const finalCapacity = capacity("after-ordinary-full-build", 0, 0);
  report = {
    status: "FOCUSED_LINUX_VITE_PASS",
    overallAcceptance: false,
    inputSha256: checkpointDigest(inventory),
    imageId: imageIdentity.Id,
    clone,
    temporaryBoundary: linux.temporaryProof,
    full275OrdinaryBuildExit: builtApplication.status,
    nativeOutputSummary: Object.fromEntries(
      Object.entries(nativeOutputs).map(([target, inventory]) => [
        target,
        {
          files: inventory.files.length,
          allocatedBytes: inventory.allocatedBytes,
          boundaryProof: inventory.boundaryProof,
        },
      ]),
    ),
    finalCapacity,
  };
} catch (caught) {
  error = caught;
} finally {
  // Budget failure cannot stop exact creator teardown. Creators register every
  // successful command before the next command can observe traceError.
  cleaning = true;
  for (const volume of volumes.reverse()) {
    try {
      docker(["volume", "rm", volume]);
      assert.notEqual(docker(["volume", "inspect", volume], { failure: true }).status, 0);
    } catch (caught) {
      cleanupErrors.push(caught);
    }
  }
  if (createdImage) {
    try {
      docker(["image", "rm", image]);
      assert.notEqual(docker(["image", "inspect", image], { failure: true }).status, 0);
    } catch (caught) {
      cleanupErrors.push(caught);
    }
  }
  try {
    rmSync(temporary, { recursive: true, force: true });
  } catch (caught) {
    cleanupErrors.push(caught);
  }
  if (traceError) cleanupErrors.push(traceError);
  let evidence = JSON.stringify({
    checkedAt: new Date().toISOString(),
    token,
    report,
    error: error ? errorEvidence(error) : undefined,
    cleanupErrors: cleanupErrors.map(errorEvidence),
    commands,
  });
  if (Buffer.byteLength(evidence) > 48 * 1024 ** 2) {
    cleanupErrors.push(new Error("focused complete trace exceeds48MiB budget"));
    evidence = JSON.stringify({
      token,
      status: "TRACE_BUDGET_FAILED",
      overallAcceptance: false,
      originalErrorCategory: error?.name,
      originalErrorSha256: createHash("sha256")
        .update(error?.stack ?? "")
        .digest("hex"),
      cleanupErrors: cleanupErrors.map(errorEvidence),
      retainedCommandTraceBytes: traceBytes,
    });
  }
  if (Buffer.byteLength(evidence) > 48 * 1024 ** 2) {
    cleanupErrors.push(new Error("bounded fallback trace exceeds48MiB budget"));
    evidence = JSON.stringify({
      token,
      status: "FALLBACK_TRACE_BUDGET_FAILED",
      overallAcceptance: false,
      originalErrorSha256: createHash("sha256")
        .update(error?.stack ?? "")
        .digest("hex"),
      cleanupErrorCount: cleanupErrors.length,
    });
  }
  writeFileSync(join(evidenceRoot, `${token}-focused-vite.json`), evidence, { mode: 0o600 });
}
if (cleanupErrors.length)
  throw new AggregateError(
    error ? [error, ...cleanupErrors] : cleanupErrors,
    "focused Vite operation/creator teardown failed",
  );
if (error) throw error;
// Real positive result is emitted only after exact creator teardown succeeds.
console.log(JSON.stringify({ ...report, exactCreatorTeardown: true }));
