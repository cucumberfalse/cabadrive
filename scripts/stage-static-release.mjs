#!/usr/bin/env node
/**
 * Append-only staging for Vite output.  This intentionally has no package
 * dependencies so the Docker stager can run it without the application tree.
 */
import { createHash, randomUUID } from "node:crypto";
import {
  constants,
  chmodSync,
  closeSync,
  copyFileSync,
  existsSync,
  fstatSync,
  ftruncateSync,
  fsyncSync,
  linkSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const RELEASE_MARKER = ".release-state.json";
const RETAINED_INVENTORY = "retained-assets.json";
const LEGACY_HANDOFF_MARKER = ".legacy-handoff.json";
const LEGACY_SOURCE_KIND = "baked-legacy-root";
const PUBLISH_PENDING = "publish-pending.json";
const ASSET_PROMOTION_PENDING = "retained-assets-pending.json";
const LOCK_SCHEMA_VERSION = 2;
const EXECUTION_DOMAIN_SCHEMA_VERSION = 1;
const EXECUTION_DOMAIN_RECORD = "stage-execution-domain.json";
const RECLAIM_GUARD = "stage.lock.reclaim";
const TEST_LOCKS = new Set();

function fail(message) {
  throw new Error(`Static release staging: ${message}`);
}

function ordinal(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeRelative(path) {
  if (
    typeof path !== "string" ||
    !path ||
    path.includes("\0") ||
    path.includes("\\") ||
    isAbsolute(path) ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  ) {
    fail(`unsafe relative path ${JSON.stringify(path)}`);
  }
  return path;
}

function assertDirectory(path, label, { allowMissing = false } = {}) {
  if (!existsSync(path)) {
    if (allowMissing) return false;
    fail(`${label} does not exist: ${path}`);
  }
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) fail(`${label} must not be a symlink: ${path}`);
  if (!stat.isDirectory()) fail(`${label} must be a directory: ${path}`);
  return true;
}

function assertInside(root, target, label) {
  const rootReal = realpathSync(root);
  const targetReal = realpathSync(target);
  if (targetReal !== rootReal && !targetReal.startsWith(`${rootReal}${sep}`)) {
    fail(`${label} escapes its root: ${target}`);
  }
}

function sha256(path) {
  const handle = openSync(path, "r");
  try {
    const before = statSync(path);
    if (!before.isFile()) fail(`non-regular file: ${path}`);
    const data = readFileSync(handle);
    const after = statSync(path);
    if (
      before.size !== after.size ||
      before.mtimeMs !== after.mtimeMs ||
      before.ino !== after.ino
    ) {
      fail(`file changed while hashing: ${path}`);
    }
    return { size: data.byteLength, sha256: createHash("sha256").update(data).digest("hex") };
  } finally {
    closeSync(handle);
  }
}

function walkRegularFiles(root, label) {
  assertDirectory(root, label);
  const entries = [];
  const visit = (directory, prefix = "") => {
    const names = [...new Set(requireDirectoryNames(directory))].sort(ordinal);
    for (const name of names) {
      normalizeRelative(name);
      const path = join(directory, name);
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) fail(`symlink is not allowed: ${path}`);
      const relativePath = prefix ? `${prefix}/${name}` : name;
      if (stat.isDirectory()) {
        assertInside(root, path, label);
        visit(path, relativePath);
      } else if (stat.isFile()) {
        assertInside(root, path, label);
        entries.push({ path: normalizeRelative(relativePath), ...sha256(path) });
      } else {
        fail(`non-regular file is not allowed: ${path}`);
      }
    }
  };
  visit(root);
  return entries.sort((left, right) => ordinal(left.path, right.path));
}

function requireDirectoryNames(path) {
  // Dynamic import would make this otherwise synchronous staging API async.
  // Node's directory snapshot is enough because each discovered node is lstat'ed.
  return awaitlessReaddir(path);
}

function awaitlessReaddir(path) {
  // Kept as a small indirection to make the deterministic walk clear in tests.
  return readdirSync(path);
}

// Imported this way to keep the built-in dependency list explicit at the top.
import { readdirSync } from "node:fs";

function manifestDigest(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

function markerForRelease(release) {
  return {
    schemaVersion: SCHEMA_VERSION,
    releaseId: release.releaseId,
    manifestSha256: manifestDigest({
      schemaVersion: release.schemaVersion,
      assets: release.assets,
      mutable: release.mutable,
    }),
  };
}

export function createCandidateManifest(candidateRoot) {
  assertDirectory(candidateRoot, "candidate root");
  const root = realpathSync(candidateRoot);
  const assetsRoot = join(root, "assets");
  assertDirectory(assetsRoot, "candidate assets directory");
  const all = walkRegularFiles(root, "candidate root");
  const assets = [];
  const mutable = [];
  for (const entry of all) {
    if (entry.path.startsWith("assets/")) {
      assets.push({ ...entry, path: entry.path.slice("assets/".length) });
    } else {
      mutable.push(entry);
    }
  }
  if (mutable.length === 0) fail("candidate has no mutable shell files");
  const canonical = { schemaVersion: SCHEMA_VERSION, assets, mutable };
  return { ...canonical, releaseId: manifestDigest(canonical) };
}

function equalEntry(left, right) {
  return left.size === right.size && left.sha256 === right.sha256;
}

function sameEntries(left, right) {
  return (
    left.length === right.length &&
    left.every(
      (entry, index) => entry.path === right[index].path && equalEntry(entry, right[index]),
    )
  );
}

function sameLegacyManifest(left, right) {
  return (
    left?.schemaVersion === right?.schemaVersion &&
    left?.sourceId === right?.sourceId &&
    left?.sourceKind === right?.sourceKind &&
    sameEntries(left?.assets || [], right?.assets || [])
  );
}

function readJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    fail(`invalid ${label}: ${path}`);
  }
}

export function verifyCandidateManifest(candidateRoot, manifest) {
  if (!manifest || manifest.schemaVersion !== SCHEMA_VERSION) fail("unsupported manifest schema");
  const actual = createCandidateManifest(candidateRoot);
  if (
    manifest.releaseId !== actual.releaseId ||
    !sameEntries(manifest.assets, actual.assets) ||
    !sameEntries(manifest.mutable, actual.mutable)
  ) {
    fail("candidate inventory does not match exact filesystem walk");
  }
  return actual;
}

function ensureStateLayout(stateRoot) {
  const state = resolve(stateRoot);
  if (existsSync(state)) {
    assertDirectory(state, "state root");
  } else {
    mkdirSync(state, { recursive: true, mode: 0o755 });
  }
  chmodSync(state, 0o755);
  for (const part of ["assets", "releases", "metadata", "transactions"]) {
    const path = join(state, part);
    if (existsSync(path)) assertDirectory(path, `state ${part}`);
    else mkdirSync(path, { recursive: true, mode: 0o755 });
    chmodSync(path, 0o755);
  }
  return realpathSync(state);
}

function processStartIdentity(pid) {
  // Linux /proc starttime is tied to one process incarnation, unlike the PID.
  // A platform without it cannot safely reclaim a crashed publisher's lock.
  try {
    const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
    const close = stat.lastIndexOf(")");
    if (close < 0) return undefined;
    const fields = stat
      .slice(close + 2)
      .trim()
      .split(/\s+/u);
    // Field 3 is the first field here; starttime is field 22.
    const start = fields[19];
    return /^\d+$/u.test(start || "") ? start : undefined;
  } catch {
    return undefined;
  }
}

function effectiveProjectKey(projectKey) {
  const value = projectKey || process.env.CABADRIVE_COMPOSE_PROJECT || "cabadrive";
  if (typeof value !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/u.test(value)) {
    fail("Compose project identity is missing or unsafe");
  }
  return value;
}

function validExecutionDomain(record, project) {
  return (
    record?.schemaVersion === EXECUTION_DOMAIN_SCHEMA_VERSION &&
    record.project === project &&
    typeof record.domain === "string" &&
    /^[a-f0-9-]{36}$/u.test(record.domain)
  );
}

function publishExecutionDomain(state, path, record) {
  const temporary = join(state, `.${EXECUTION_DOMAIN_RECORD}.${randomUUID()}.next`);
  let descriptor;
  try {
    descriptor = openSync(temporary, "wx", 0o600);
    writeFileSync(descriptor, `${JSON.stringify(record)}\n`);
    fsyncSync(descriptor);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  try {
    // Hard-link publication is exclusive: unlike rename it never overwrites a
    // concurrently published domain. The target is therefore either the
    // complete, synced temporary or an already authoritative record.
    linkSync(temporary, path);
    syncDirectory(state, undefined);
    return true;
  } catch (error) {
    if (error?.code === "EEXIST") return false;
    throw error;
  } finally {
    if (existsSync(temporary)) {
      unlinkSync(temporary);
      syncDirectory(state, undefined);
    }
  }
}

function recoverIncompleteExecutionDomain(state, path) {
  const entry = noFollowEntry(path);
  if (!entry || entry.isSymbolicLink() || !entry.isFile()) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
  const lock = join(state, "stage.lock");
  if (noFollowEntry(lock)) {
    fail("stage execution domain is malformed while a stage lock exists");
  }
  const reclaim = join(state, ".stage-execution-domain.reclaim");
  const existingReclaim = noFollowEntry(reclaim);
  if (existingReclaim) {
    if (
      existingReclaim.isSymbolicLink() ||
      !existingReclaim.isFile() ||
      existingReclaim.ino !== entry.ino
    ) {
      fail("stage execution domain recovery is already in progress");
    }
  } else {
    try {
      linkSync(path, reclaim);
    } catch (error) {
      if (error?.code === "EEXIST") {
        fail("stage execution domain recovery is already in progress");
      }
      throw error;
    }
  }
  try {
    const guarded = noFollowEntry(reclaim);
    const current = noFollowEntry(path);
    if (
      !guarded ||
      guarded.isSymbolicLink() ||
      !current ||
      current.isSymbolicLink() ||
      guarded.ino !== current.ino ||
      noFollowEntry(lock)
    ) {
      fail("stage execution domain recovery lost its exact incomplete record");
    }
    unlinkSync(path);
    syncDirectory(state, undefined);
  } finally {
    if (noFollowEntry(reclaim)) {
      unlinkSync(reclaim);
      syncDirectory(state, undefined);
    }
  }
}

function executionDomain(state, projectKey) {
  const project = effectiveProjectKey(projectKey);
  const path = join(state, EXECUTION_DOMAIN_RECORD);
  const created = {
    schemaVersion: EXECUTION_DOMAIN_SCHEMA_VERSION,
    project,
    domain: randomUUID(),
  };
  let recorded;
  try {
    recorded = noFollowEntry(path) ? readJson(path, "stage execution domain") : undefined;
  } catch {
    recorded = undefined;
  }
  const structurallyCompleteForeignRecord =
    recorded?.schemaVersion === EXECUTION_DOMAIN_SCHEMA_VERSION &&
    typeof recorded.project === "string" &&
    typeof recorded.domain === "string" &&
    /^[a-f0-9-]{36}$/u.test(recorded.domain) &&
    recorded.project !== project;
  if (structurallyCompleteForeignRecord) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
  if (!validExecutionDomain(recorded, project)) {
    if (noFollowEntry(path)) recoverIncompleteExecutionDomain(state, path);
    publishExecutionDomain(state, path, created);
    recorded = readJson(path, "stage execution domain");
  }
  if (!validExecutionDomain(recorded, project)) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
  // A previous exclusive publish might have failed after link visibility but
  // before its parent barrier. Retrying the same valid record completes that
  // barrier before the record participates in lock ownership.
  syncDirectory(state, undefined);
  return recorded;
}

function lockOwnerRecord(context, diagnosticHost = hostname()) {
  const startIdentity = processStartIdentity(process.pid);
  const diagnostic = (read) => {
    try {
      return read();
    } catch {
      return "unavailable";
    }
  };
  return {
    schemaVersion: LOCK_SCHEMA_VERSION,
    project: context.project,
    domain: context.domain,
    acquisition: randomUUID(),
    diagnosticHost,
    bootIdentity: diagnostic(() => readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim()),
    pidNamespaceIdentity: diagnostic(() => readlinkSync("/proc/self/ns/pid")),
    pid: process.pid,
    // Local developer platforms without Linux's executable /proc starttime
    // may create a unique lock, but may never reclaim one: inspection below
    // treats this identity as ambiguous/fail-closed.
    startIdentity: startIdentity || `unsupported-${randomUUID()}`,
  };
}

function regularNoFollowDescriptor(path, { create = false } = {}) {
  let descriptor;
  try {
    descriptor = openSync(
      path,
      constants.O_RDWR | constants.O_NOFOLLOW | (create ? constants.O_CREAT : 0),
      0o600,
    );
    const descriptorStat = fstatSync(descriptor);
    const pathStat = lstatSync(path);
    if (
      !descriptorStat.isFile() ||
      pathStat.isSymbolicLink() ||
      !pathStat.isFile() ||
      descriptorStat.dev !== pathStat.dev ||
      descriptorStat.ino !== pathStat.ino
    ) {
      fail(`lock path is not one stable no-follow regular inode: ${path}`);
    }
    return { descriptor, stat: descriptorStat };
  } catch (error) {
    if (descriptor !== undefined) closeSync(descriptor);
    throw error;
  }
}

function lockDescriptor(path, stat) {
  const key = `${stat.dev}:${stat.ino}`;
  if (process.env.CABADRIVE_TEST_KERNEL_LOCK === "in-process") {
    if (TEST_LOCKS.has(key)) return undefined;
    TEST_LOCKS.add(key);
    return () => TEST_LOCKS.delete(key);
  }
  if (process.platform !== "linux") fail("kernel advisory lock is unsupported on this platform");
  const holder = spawn("flock", ["--nonblock", path, "sh", "-c", "printf L; cat >/dev/null"], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  let spawnError;
  holder.once("error", (error) => {
    spawnError = error;
  });
  const outputDescriptor = holder.stdout?._handle?.fd;
  if (!holder.pid || outputDescriptor === undefined) {
    holder.kill();
    fail("kernel advisory lock primitive is unavailable");
  }
  const ready = Buffer.alloc(1);
  const deadline = Date.now() + 2000;
  let acquired = false;
  while (Date.now() < deadline && !spawnError) {
    try {
      const count = readSync(outputDescriptor, ready, 0, 1, null);
      if (count === 1 && ready[0] === 76) {
        acquired = true;
        break;
      }
      if (count === 0) break;
    } catch (error) {
      if (error?.code !== "EAGAIN") {
        holder.kill();
        throw error;
      }
    }
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  }
  if (!acquired) {
    holder.kill();
    if (spawnError?.code === "ENOENT") fail("kernel advisory lock primitive is unavailable");
    fail("another stage holds the exclusive kernel lock");
  }
  const lockedPath = lstatSync(path);
  if (
    lockedPath.isSymbolicLink() ||
    !lockedPath.isFile() ||
    lockedPath.dev !== stat.dev ||
    lockedPath.ino !== stat.ino
  ) {
    holder.kill("SIGTERM");
    holder.stdin?.destroy();
    fail("kernel lock inode changed during no-follow acquisition");
  }
  // The helper stays alive for the complete transaction. Abrupt parent or
  // container death closes its stdin and releases the kernel lock without
  // consulting namespace-local PIDs.
  return () => {
    holder.kill("SIGTERM");
    holder.stdin?.destroy();
  };
}

function recoverLegacyReclaim(state, lock, lockStat, onLockOperation) {
  const reclaim = join(state, RECLAIM_GUARD);
  const entry = noFollowEntry(reclaim);
  if (!entry) return;
  if (entry.isSymbolicLink() || !entry.isFile()) fail("legacy reclaim evidence is unsafe");
  const { descriptor, stat } = regularNoFollowDescriptor(reclaim);
  try {
    if (stat.dev !== lockStat.dev || stat.ino !== lockStat.ino) {
      fail("legacy reclaim evidence does not bind the canonical lock inode");
    }
    const canonicalOwner = readJson(lock, "canonical legacy lock owner");
    const reclaimOwner = readJson(reclaim, "legacy reclaim owner");
    if (!sameLockOwner(canonicalOwner, reclaimOwner)) {
      fail("legacy reclaim generation does not match the canonical lock");
    }
    onLockOperation?.({ operation: "before-reclaim-removal", owner: canonicalOwner });
    unlinkSync(reclaim);
    syncDirectory(state, undefined);
    onLockOperation?.({ operation: "after-reclaim-removal", owner: canonicalOwner });
  } finally {
    closeSync(descriptor);
  }
}

function sameLockOwner(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function acquireLock(state, { projectKey, onLockOperation, diagnosticHost } = {}) {
  const lock = join(state, "stage.lock");
  const context = executionDomain(state, projectKey);
  const owner = lockOwnerRecord(context, diagnosticHost);
  const existed = Boolean(noFollowEntry(lock));
  const { descriptor, stat } = regularNoFollowDescriptor(lock, { create: true });
  let releaseKernel;
  try {
    releaseKernel = lockDescriptor(lock, stat);
    if (!releaseKernel) fail("another stage holds the exclusive kernel lock");
    if (!existed) syncDirectory(state, undefined);
    recoverLegacyReclaim(state, lock, stat, onLockOperation);
    ftruncateSync(descriptor, 0);
    writeFileSync(descriptor, `${JSON.stringify(owner)}\n`, { position: 0 });
    fsyncSync(descriptor);
  } catch (error) {
    releaseKernel?.();
    closeSync(descriptor);
    throw error;
  }
  syncDirectory(state, undefined);
  onLockOperation?.({ operation: "lock-acquired", owner });
  const testHold = Number(process.env.CABADRIVE_TEST_HOLD_LOCK_MS || 0);
  if (Number.isInteger(testHold) && testHold > 0) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, testHold);
  }
  return () => {
    let recorded;
    try {
      recorded = readJson(lock, "stage lock owner");
    } catch {
      fail("stage lock ownership changed before release");
    }
    if (!sameLockOwner(recorded, owner)) fail("stage lock ownership changed before release");
    onLockOperation?.({ operation: "lock-released", owner });
    releaseKernel();
    closeSync(descriptor);
  };
}

function inventoryForAssets(root, label) {
  const assets = join(root, "assets");
  if (!existsSync(assets)) return [];
  return walkRegularFiles(assets, label);
}

function requireLegacySource(value, label) {
  if (typeof value !== "string" || !value.trim()) fail(`${label} must be a nonempty string`);
  return value.trim();
}

export function createLegacyHandoffManifest({ legacyRoot, sourceId, sourceKind } = {}) {
  if (!legacyRoot) fail("legacy root is required");
  const root = realpathSync(legacyRoot);
  assertDirectory(root, "legacy handoff root");
  assertDirectory(join(root, "assets"), "legacy handoff assets directory");
  const kind = requireLegacySource(sourceKind, "legacy source kind");
  if (kind !== LEGACY_SOURCE_KIND) fail(`unsupported legacy source kind ${JSON.stringify(kind)}`);
  return {
    schemaVersion: SCHEMA_VERSION,
    sourceId: requireLegacySource(sourceId, "legacy source id"),
    sourceKind: kind,
    assets: inventoryForAssets(root, "legacy handoff assets"),
  };
}

export function writeLegacyHandoffManifest({
  legacyRoot,
  handoffRoot,
  sourceId,
  sourceKind,
  faultAt,
  onDurabilityOperation,
} = {}) {
  if (!legacyRoot) fail("legacy root is required");
  const root = realpathSync(legacyRoot);
  assertDirectory(root, "legacy handoff root");
  let durableHandoff;
  if (handoffRoot) {
    const suppliedHandoff = resolve(handoffRoot);
    assertDirectory(suppliedHandoff, "legacy handoff base");
    durableHandoff = realpathSync(suppliedHandoff);
    assertInside(durableHandoff, root, "legacy handoff release");
  }
  const options = { faultAt, onDurabilityOperation };
  const manifest = createLegacyHandoffManifest({ legacyRoot: root, sourceId, sourceKind });
  const temporary = join(root, `${LEGACY_HANDOFF_MARKER}.next-${process.pid}-${randomUUID()}`);
  writeFileSync(join(root, "source-id"), `${manifest.sourceId}\n`);
  writeFileSync(join(root, "source-kind"), `${manifest.sourceKind}\n`);
  // This point is deliberately injectable so the capture wrapper can prove a
  // half-written handoff never becomes authoritative.
  if (faultAt === "legacy-marker-write") fail("fault injection at legacy marker write");
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(temporary, join(root, LEGACY_HANDOFF_MARKER));
  // This is the handoff commit barrier. The independent pointer command is
  // allowed to publish only after every captured byte and every directory entry
  // through the release root has reached durable storage.
  syncTree(root, options);
  if (durableHandoff) {
    syncDirectoryAncestors(dirname(root), durableHandoff, options);
  }
  return manifest;
}

// The capture shell deliberately delegates the pointer commit to this helper.
// POSIX rename replaces a symlink itself; unlike `mv`, it never interprets a
// symlink-to-directory as a destination directory.  Keeping the link creation
// and rename in one repository-owned helper also makes the exact failure
// boundary testable without relying on shell errexit semantics.
export function publishLegacyHandoffPointer({
  handoffRoot,
  release,
  faultAt,
  onDurabilityOperation,
} = {}) {
  if (!handoffRoot || !release) fail("legacy handoff root and release are required");
  const suppliedRoot = resolve(handoffRoot);
  assertDirectory(suppliedRoot, "legacy handoff base");
  const root = realpathSync(suppliedRoot);
  const relative = normalizeRelative(release);
  if (!relative.startsWith("releases/")) fail("legacy handoff release must be under releases");
  const releaseRoot = join(root, ...relative.split("/"));
  assertDirectory(releaseRoot, "legacy handoff release");
  assertInside(root, releaseRoot, "legacy handoff release");
  if (!verifyLegacyHandoff(releaseRoot).valid) {
    fail("legacy handoff release is not authoritative");
  }

  const current = join(root, "current");
  const next = join(root, `current.next-${process.pid}-${randomUUID()}`);
  const rollback = join(root, `current.rollback-${process.pid}-${randomUUID()}`);
  const previous =
    existsSync(current) && lstatSync(current).isSymbolicLink() ? readlinkSync(current) : undefined;
  let renamed = false;
  try {
    if (faultAt === "legacy-pointer-link") fail("fault injection at legacy pointer link");
    symlinkSync(relative, next);
    if (faultAt === "legacy-pointer-rename") fail("fault injection at legacy pointer rename");
    renameSync(next, current);
    renamed = true;
    syncDirectory(root, { faultAt, onDurabilityOperation });
  } catch (error) {
    if (renamed) {
      try {
        if (previous === undefined) {
          if (existsSync(current)) unlinkSync(current);
        } else {
          symlinkSync(previous, rollback);
          renameSync(rollback, current);
        }
        // Do not replay the injected fault while making the rollback durable.
        // The caller may delete the rejected release only after this barrier.
        syncDirectory(root, { onDurabilityOperation });
      } catch (rollbackError) {
        throw new AggregateError(
          [error, rollbackError],
          "Static release staging: legacy handoff pointer rollback failed",
        );
      }
    }
    throw error;
  } finally {
    if (existsSync(next)) rmSync(next, { force: true });
    if (existsSync(rollback)) rmSync(rollback, { force: true });
  }
}

export function verifyLegacyHandoff(legacyRoot) {
  try {
    const root = realpathSync(legacyRoot);
    assertDirectory(root, "legacy handoff root");
    const markerPath = join(root, LEGACY_HANDOFF_MARKER);
    const sourceIdPath = join(root, "source-id");
    const sourceKindPath = join(root, "source-kind");
    if (!existsSync(markerPath) || !existsSync(sourceIdPath) || !existsSync(sourceKindPath)) {
      return { valid: false, reason: "legacy handoff marker is incomplete" };
    }
    const marker = readJson(markerPath, "legacy handoff marker");
    const actual = createLegacyHandoffManifest({
      legacyRoot: root,
      sourceId: readFileSync(sourceIdPath, "utf8"),
      sourceKind: readFileSync(sourceKindPath, "utf8"),
    });
    if (!sameLegacyManifest(marker, actual)) {
      return { valid: false, reason: "legacy handoff inventory does not match" };
    }
    return { valid: true, manifest: actual };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "legacy handoff validation failed",
    };
  }
}

function assertNoCollision(...groups) {
  const known = new Map();
  for (const group of groups) {
    for (const entry of group) {
      const prior = known.get(entry.path);
      if (prior && !equalEntry(prior, entry)) {
        fail(`immutable asset collision at ${entry.path}`);
      }
      known.set(entry.path, entry);
    }
  }
}

function invokeDurability(options, operation, path) {
  options?.onDurabilityOperation?.({ operation, path });
  if (options?.faultAt === `durability:${operation}`) {
    fail(`durability fault injection at ${operation}`);
  }
}

function syncFile(path, options) {
  let descriptor;
  try {
    descriptor = openSync(path, "r");
    invokeDurability(options, "fsync-file", path);
    fsyncSync(descriptor);
    invokeDurability(options, "close-file", path);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function syncDirectory(path, options) {
  let descriptor;
  try {
    descriptor = openSync(path, "r");
    invokeDurability(options, "fsync-directory", path);
    fsyncSync(descriptor);
    invokeDurability(options, "close-directory", path);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

// Directory entries become durable only when every ancestor that records the
// entry is synced.  Keep the ordering innermost-first so a nested asset is
// never advertised through a synced parent before its own name is durable.
function syncDirectoryAncestors(directory, root, options) {
  const resolvedRoot = realpathSync(root);
  let current = realpathSync(directory);
  if (current !== resolvedRoot && !current.startsWith(`${resolvedRoot}${sep}`)) {
    fail(`durability directory escapes declared root: ${directory}`);
  }
  while (true) {
    syncDirectory(current, options);
    if (current === resolvedRoot) return;
    const parent = dirname(current);
    if (parent === current) fail(`durability root is unreachable: ${root}`);
    current = parent;
  }
}

function writeAtomically(directory, path, contents, options, durabilityRoot = directory) {
  const temporary = join(directory, `.${randomUUID()}.next`);
  let descriptor;
  try {
    descriptor = openSync(temporary, "wx", 0o644);
    writeFileSync(descriptor, contents);
    invokeDurability(options, "fsync-file", temporary);
    fsyncSync(descriptor);
    invokeDurability(options, "close-file", temporary);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  renameSync(temporary, path);
  invokeDurability(options, "rename", path);
  syncDirectoryAncestors(directory, durabilityRoot, options);
}

function copyAndVerify(source, destination, expected, options, durabilityRoot) {
  mkdirSync(dirname(destination), { recursive: true, mode: 0o755 });
  copyFileSync(source, destination);
  const actual = sha256(destination);
  if (!equalEntry(actual, expected)) fail(`staged digest mismatch: ${destination}`);
  syncFile(destination, options);
  if (durabilityRoot) syncDirectoryAncestors(dirname(destination), durabilityRoot, options);
}

function sourceAsset(candidateRoot, path) {
  return join(candidateRoot, "assets", ...path.split("/"));
}

function sourceMutable(candidateRoot, path) {
  return join(candidateRoot, ...path.split("/"));
}

function fault(options, point) {
  if (options.faultAt === point) fail(`fault injection at ${point}`);
}

function copyInventory(candidateRoot, inventory, target, sourceFor, options, durabilityRoot) {
  for (const entry of inventory) {
    copyAndVerify(
      sourceFor(candidateRoot, entry.path),
      join(target, ...entry.path.split("/")),
      entry,
      options,
      durabilityRoot,
    );
  }
}

function promoteFiles(
  from,
  to,
  inventory,
  options,
  { sourceRoot, destinationRoot, recoverExisting = false },
) {
  for (const entry of inventory) {
    const source = join(from, ...entry.path.split("/"));
    const destination = join(to, ...entry.path.split("/"));
    if (existsSync(destination)) {
      if (!equalEntry(sha256(destination), entry))
        fail(`immutable asset collision at ${entry.path}`);
      // A matching destination found through the durable promotion journal may
      // have survived the rename but not its directory barrier.  Re-run the
      // complete barrier before the ledger can make it authoritative.
      if (recoverExisting) {
        syncFile(destination, options);
        syncDirectoryAncestors(dirname(destination), destinationRoot, options);
      }
      continue;
    }
    mkdirSync(dirname(destination), { recursive: true, mode: 0o755 });
    syncFile(source, options);
    renameSync(source, destination);
    invokeDurability(options, "rename", destination);
    syncDirectoryAncestors(dirname(source), sourceRoot, options);
    syncDirectoryAncestors(dirname(destination), destinationRoot, options);
    fault(options, "after-asset-rename");
  }
}

function makeCurrent(state, releaseId, options) {
  const current = join(state, "current");
  const next = join(state, `current.next-${process.pid}-${randomUUID()}`);
  const previous =
    existsSync(current) && lstatSync(current).isSymbolicLink() ? readlinkSync(current) : undefined;
  const rollback = previous
    ? join(state, `current.rollback-${process.pid}-${randomUUID()}`)
    : undefined;
  let activated = false;
  // Materialize the old pointer before the new one is visible. If the parent
  // durability barrier then fails, rename replaces `current` atomically rather
  // than exposing an unlink-to-symlink gap to readers.
  try {
    if (rollback) {
      symlinkSync(previous, rollback);
      // Keep the pre-activation rollback boundary fault-injectable: no reader
      // may observe the new pointer before its atomic replacement exists.
      invokeDurability(options, "prepare-current-rollback", rollback);
    }
    symlinkSync(join("releases", releaseId), next);
    renameSync(next, current);
    activated = true;
    invokeDurability(options, "rename-current", current);
    syncDirectory(state, options);
  } catch (error) {
    // A failed post-rename durability barrier must not leave a newly selected
    // release advertised by this process. Restore the prior pointer before
    // surfacing the failure; a retry can then safely re-run the transaction.
    if (activated) {
      if (rollback && existsSync(rollback)) {
        renameSync(rollback, current);
      } else if (!previous && existsSync(current)) {
        rmSync(current, { force: true });
      }
      syncDirectory(state, { onDurabilityOperation: options?.onDurabilityOperation });
    }
    throw error;
  } finally {
    if (existsSync(next)) rmSync(next, { force: true });
    if (rollback && existsSync(rollback)) rmSync(rollback, { force: true });
  }
}

function releaseFilesMatch(releaseDirectory, release) {
  const markerPath = join(releaseDirectory, RELEASE_MARKER);
  if (!existsSync(markerPath)) return false;
  const marker = readJson(markerPath, "release marker");
  if (JSON.stringify(marker) !== JSON.stringify(markerForRelease(release))) return false;
  const files = walkRegularFiles(releaseDirectory, "release tree").filter(
    (entry) => entry.path !== RELEASE_MARKER,
  );
  return sameEntries(files, release.mutable);
}

function retainedLedgerPath(state) {
  return join(state, RETAINED_INVENTORY);
}

function retainedInventoryPayload(assets) {
  return { schemaVersion: SCHEMA_VERSION, assets };
}

function assetsMatch(state, release, expectedRetained) {
  const retained = inventoryForAssets(state, "retained assets");
  if (expectedRetained && !sameEntries(retained, expectedRetained)) return false;
  const byPath = new Map(retained.map((entry) => [entry.path, entry]));
  if (!release.assets.every((entry) => equalEntry(byPath.get(entry.path) || {}, entry)))
    return false;
  const path = retainedLedgerPath(state);
  if (!existsSync(path)) return false;
  try {
    const ledger = readJson(path, "retained asset inventory");
    return ledger.schemaVersion === SCHEMA_VERSION && sameEntries(ledger.assets || [], retained);
  } catch {
    return false;
  }
}

function mergeInventories(...groups) {
  const merged = new Map();
  for (const group of groups) {
    for (const entry of group) merged.set(entry.path, entry);
  }
  return [...merged.values()].sort((left, right) => ordinal(left.path, right.path));
}

function readRetainedInventory(state) {
  const path = retainedLedgerPath(state);
  if (!existsSync(path)) return undefined;
  const ledger = readJson(path, "retained asset inventory");
  if (ledger.schemaVersion !== SCHEMA_VERSION || !Array.isArray(ledger.assets)) {
    fail("retained asset inventory has an unsupported schema");
  }
  const canonical = [...ledger.assets].sort((left, right) => ordinal(left.path, right.path));
  if (!sameEntries(ledger.assets, canonical)) fail("retained asset inventory is not canonical");
  return canonical;
}

function assertExistingRetainedAuthority(state, existing) {
  const ledger = readRetainedInventory(state);
  if (!ledger) {
    if (existing.length === 0) return [];
    fail("retained assets do not match canonical cumulative inventory");
  }
  if (!sameEntries(ledger, existing))
    fail("retained assets do not match canonical cumulative inventory");
  return ledger;
}

function writeRetainedInventory(state, assets, options) {
  writeAtomically(
    state,
    retainedLedgerPath(state),
    `${JSON.stringify(retainedInventoryPayload(assets), null, 2)}\n`,
    options,
  );
}

function assetPromotionPendingPath(state) {
  return join(state, ASSET_PROMOTION_PENDING);
}

function inventoryDigest(assets) {
  return manifestDigest(retainedInventoryPayload(assets));
}

function inventoryAdditions(prior, expected) {
  const priorByPath = new Map(prior.map((entry) => [entry.path, entry]));
  return expected.filter((entry) => !priorByPath.has(entry.path));
}

function legacyRequest(legacyValidation) {
  if (!legacyValidation) return null;
  const manifest = legacyValidation.manifest;
  return {
    sourceId: manifest.sourceId,
    sourceKind: manifest.sourceKind,
    manifestSha256: manifestDigest(manifest),
  };
}

function assetPromotionJournal({ release, legacyValidation, prior, expected }) {
  return {
    schemaVersion: SCHEMA_VERSION,
    releaseId: release.releaseId,
    manifestSha256: manifestDigest(release),
    legacy: legacyRequest(legacyValidation),
    priorAssetsSha256: inventoryDigest(prior),
    priorAssets: prior,
    additions: inventoryAdditions(prior, expected),
    expectedAssetsSha256: inventoryDigest(expected),
    expectedAssets: expected,
  };
}

function pendingJournalMatchesRequest(pending, release, legacyValidation, expected) {
  const prior = pending?.priorAssets;
  const additions = pending?.additions;
  return (
    pending?.schemaVersion === SCHEMA_VERSION &&
    pending.releaseId === release.releaseId &&
    pending.manifestSha256 === manifestDigest(release) &&
    JSON.stringify(pending.legacy) === JSON.stringify(legacyRequest(legacyValidation)) &&
    Array.isArray(prior) &&
    Array.isArray(additions) &&
    Array.isArray(pending.expectedAssets) &&
    sameEntries(
      prior,
      [...prior].sort((left, right) => ordinal(left.path, right.path)),
    ) &&
    pending.priorAssetsSha256 === inventoryDigest(prior) &&
    pending.expectedAssetsSha256 === inventoryDigest(pending.expectedAssets) &&
    sameEntries(pending.expectedAssets, expected) &&
    sameEntries(additions, inventoryAdditions(prior, expected))
  );
}

function actualIsPriorPlusSubset(actual, prior, additions) {
  const priorByPath = new Map(prior.map((entry) => [entry.path, entry]));
  const additionsByPath = new Map(additions.map((entry) => [entry.path, entry]));
  for (const entry of prior) {
    const current = actual.find((candidate) => candidate.path === entry.path);
    if (!equalEntry(current || {}, entry)) return false;
  }
  return actual.every((entry) => {
    const priorEntry = priorByPath.get(entry.path);
    const addition = additionsByPath.get(entry.path);
    return (
      (priorEntry && equalEntry(priorEntry, entry)) || (addition && equalEntry(addition, entry))
    );
  });
}

function readAssetPromotionJournal(state) {
  const path = assetPromotionPendingPath(state);
  return existsSync(path) ? readJson(path, "asset promotion journal") : undefined;
}

function writeAssetPromotionJournal(state, journal, options) {
  writeAtomically(
    state,
    assetPromotionPendingPath(state),
    `${JSON.stringify(journal, null, 2)}\n`,
    options,
  );
}

function clearAssetPromotionJournal(state, options) {
  const path = assetPromotionPendingPath(state);
  if (!existsSync(path)) return;
  unlinkSync(path);
  invokeDurability(options, "unlink-asset-promotion-pending", path);
  syncDirectoryAncestors(state, state, options);
}

function recoverAssetPromotion({ state, existing, release, legacyValidation, expected }) {
  const pending = readAssetPromotionJournal(state);
  if (!pending) return undefined;
  if (!pendingJournalMatchesRequest(pending, release, legacyValidation, expected)) {
    fail("asset promotion journal does not match this exact request");
  }
  if (!actualIsPriorPlusSubset(existing, pending.priorAssets, pending.additions)) {
    fail("asset promotion journal does not match the retained asset store");
  }
  const ledger = readRetainedInventory(state);
  // The durable journal carries the prior ledger itself.  A crash that loses
  // the old directory entry must not turn an otherwise exact journaled subset
  // into an unrecoverable store; any non-journaled missing ledger still fails.
  const ledgerIsPrior = !ledger || sameEntries(ledger, pending.priorAssets);
  const ledgerIsExpected =
    ledger && sameEntries(ledger, expected) && sameEntries(existing, expected);
  if (!ledgerIsPrior && !ledgerIsExpected) {
    fail("asset promotion journal does not match the retained ledger");
  }
  return { pending, ledgerIsExpected };
}

function metadataMatches(path, release) {
  if (!existsSync(path)) return false;
  try {
    const metadata = readJson(path, "release metadata");
    return (
      metadata.releaseId === release.releaseId &&
      sameEntries(metadata.assets || [], release.assets) &&
      sameEntries(metadata.mutable || [], release.mutable)
    );
  } catch {
    return false;
  }
}

function writeMetadataAtomically(state, path, release, legacySource, options) {
  writeAtomically(
    dirname(path),
    path,
    `${JSON.stringify({ ...release, legacySource }, null, 2)}\n`,
    options,
    state,
  );
}

export function verifyCommittedState(stateRoot) {
  try {
    const state = resolve(stateRoot);
    assertDirectory(state, "state root");
    const current = join(state, "current");
    if (!existsSync(current) || !lstatSync(current).isSymbolicLink()) {
      return { valid: false, reason: "current pointer is missing" };
    }
    const target = readlinkSync(current);
    if (!/^releases\/[a-f0-9]{64}$/.test(target)) {
      return { valid: false, reason: "current pointer is unsafe" };
    }
    const releaseId = target.slice("releases/".length);
    const releaseDirectory = join(state, target);
    const metadataPath = join(state, "metadata", `${releaseId}.json`);
    if (!existsSync(releaseDirectory) || !existsSync(metadataPath)) {
      return { valid: false, reason: "current tuple is incomplete" };
    }
    const metadata = readJson(metadataPath, "release metadata");
    if (metadata.releaseId !== releaseId || !metadataMatches(metadataPath, metadata)) {
      return { valid: false, reason: "current metadata does not match" };
    }
    if (!releaseFilesMatch(releaseDirectory, metadata)) {
      return { valid: false, reason: "current release marker/tree does not match" };
    }
    if (!assetsMatch(state, metadata)) {
      return { valid: false, reason: "retained assets do not match metadata" };
    }
    return { valid: true, releaseId };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "state validation failed",
    };
  }
}

export function stageStaticRelease({
  stateRoot,
  candidateRoot,
  legacyRoot,
  faultAt,
  onDurabilityOperation,
  projectKey,
  onLockOperation,
  diagnosticHost,
  lockHeld = false,
  expectedManifest,
} = {}) {
  if (!stateRoot || !candidateRoot) fail("--state and --candidate are required");
  const candidateRootReal = realpathSync(candidateRoot);
  const canonicalState = canonicalProspectivePath(resolve(stateRoot));
  if (
    canonicalState === candidateRootReal ||
    canonicalState.startsWith(`${candidateRootReal}${sep}`) ||
    candidateRootReal.startsWith(`${canonicalState}${sep}`)
  ) {
    fail("candidate and release state must not overlap");
  }
  // Perform this no-follow validation before creating the state layout: a
  // dangling or unsafe current pointer is corruption, never an initial state.
  currentReleaseId(resolve(stateRoot));
  const suppliedLegacyRoot =
    legacyRoot === undefined || legacyRoot === null ? undefined : resolve(legacyRoot);
  const legacyValidation = suppliedLegacyRoot ? verifyLegacyHandoff(suppliedLegacyRoot) : undefined;
  if (suppliedLegacyRoot && !legacyValidation?.valid) {
    fail(`legacy handoff is not authoritative: ${legacyValidation?.reason || "invalid"}`);
  }
  const state = ensureStateLayout(stateRoot);
  const release = createCandidateManifest(candidateRootReal);
  if (
    expectedManifest &&
    (release.releaseId !== expectedManifest.releaseId ||
      !sameEntries(release.assets, expectedManifest.assets) ||
      !sameEntries(release.mutable, expectedManifest.mutable))
  ) {
    fail("candidate inventory changed since static publish journal");
  }
  const releaseDir = join(state, "releases", release.releaseId);
  const metadataPath = join(state, "metadata", `${release.releaseId}.json`);
  const unlock = lockHeld
    ? () => {}
    : acquireLock(state, { projectKey, onLockOperation, diagnosticHost });
  const transaction = join(state, "transactions", `${release.releaseId}-${randomUUID()}`);
  try {
    const candidate = candidateRootReal;
    const existing = inventoryForAssets(state, "retained assets");
    const legacy = legacyValidation?.manifest.assets || [];
    const legacySource = legacyValidation?.manifest.sourceId;
    assertNoCollision(existing, legacy, release.assets);
    const pendingAssetPromotion = readAssetPromotionJournal(state);
    let priorRetained;
    let expectedRetained;
    let assetPromotionRecovery;
    if (pendingAssetPromotion) {
      if (!Array.isArray(pendingAssetPromotion.priorAssets)) {
        fail("asset promotion journal has no prior retained inventory");
      }
      priorRetained = pendingAssetPromotion.priorAssets;
      expectedRetained = mergeInventories(priorRetained, legacy, release.assets);
      assetPromotionRecovery = recoverAssetPromotion({
        state,
        existing,
        release,
        legacyValidation,
        expected: expectedRetained,
      });
    } else {
      // A normal direct promotion may never advance an incomplete predecessor.
      // An exact asset-promotion journal is the separately verified recovery
      // authority for the narrow crash window above.
      const priorCurrentReleaseId = currentReleaseId(state);
      if (priorCurrentReleaseId !== null) {
        const priorCommitted = verifyCommittedState(state);
        if (!priorCommitted.valid || priorCommitted.releaseId !== priorCurrentReleaseId) {
          fail("direct stage requires a valid committed current release");
        }
      }
      priorRetained = assertExistingRetainedAuthority(state, existing);
      expectedRetained = mergeInventories(priorRetained, legacy, release.assets);
    }

    // Do this before the complete-release shortcut: a handoff can arrive after
    // the candidate was first staged, and immutable A bytes are still owed.
    mkdirSync(transaction, { recursive: true, mode: 0o755 });
    const transactionAssets = join(transaction, "assets");
    const transactionRelease = join(transaction, "release");
    mkdirSync(transactionAssets, { recursive: true, mode: 0o755 });
    mkdirSync(transactionRelease, { recursive: true, mode: 0o755 });
    syncDirectoryAncestors(transaction, state, { faultAt, onDurabilityOperation });
    fault({ faultAt }, "after-validation");
    if (legacy.length) {
      copyInventory(
        suppliedLegacyRoot,
        legacy,
        transactionAssets,
        sourceAsset,
        {
          faultAt,
          onDurabilityOperation,
        },
        transaction,
      );
    }
    copyInventory(
      candidate,
      release.assets,
      transactionAssets,
      sourceAsset,
      {
        faultAt,
        onDurabilityOperation,
      },
      transaction,
    );
    fault({ faultAt }, "during-assets");
    if (!assetPromotionRecovery) {
      writeAssetPromotionJournal(
        state,
        assetPromotionJournal({
          release,
          legacyValidation,
          prior: priorRetained,
          expected: expectedRetained,
        }),
        { faultAt, onDurabilityOperation },
      );
    }
    promoteFiles(
      transactionAssets,
      join(state, "assets"),
      [...legacy, ...release.assets],
      {
        faultAt,
        onDurabilityOperation,
      },
      {
        sourceRoot: transaction,
        destinationRoot: state,
        recoverExisting: Boolean(assetPromotionRecovery),
      },
    );
    if (!sameEntries(inventoryForAssets(state, "retained assets"), expectedRetained)) {
      fail("promoted retained assets do not match cumulative inventory");
    }
    // Re-publish the ledger even when recovery observes its expected bytes.
    // The previous atomic rename may have happened immediately before a failed
    // directory barrier, so byte equality alone is not durability evidence.
    writeRetainedInventory(state, expectedRetained, { faultAt, onDurabilityOperation });
    fault({ faultAt }, "after-assets");
    clearAssetPromotionJournal(state, { faultAt, onDurabilityOperation });

    if (existsSync(releaseDir) && existsSync(metadataPath)) {
      if (
        !metadataMatches(metadataPath, release) ||
        !releaseFilesMatch(releaseDir, release) ||
        !assetsMatch(state, release, expectedRetained)
      ) {
        fail("existing complete release is not a verified committed tuple");
      }
      syncTree(releaseDir, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
      syncFile(metadataPath, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
      makeCurrent(state, release.releaseId, { faultAt, onDurabilityOperation });
      return { changed: false, releaseId: release.releaseId, manifest: release };
    }
    if (existsSync(releaseDir)) {
      if (
        !releaseFilesMatch(releaseDir, release) ||
        !assetsMatch(state, release, expectedRetained)
      ) {
        fail("existing release-only partial state does not match candidate");
      }
      writeMetadataAtomically(state, metadataPath, release, legacySource, {
        faultAt,
        onDurabilityOperation,
      });
      syncTree(releaseDir, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
      syncFile(metadataPath, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
      fault({ faultAt }, "before-current");
      makeCurrent(state, release.releaseId, { faultAt, onDurabilityOperation });
      return { changed: true, releaseId: release.releaseId, manifest: release };
    }
    if (existsSync(metadataPath) && !metadataMatches(metadataPath, release)) {
      fail("existing metadata-only partial state does not match candidate");
    }

    copyInventory(
      candidate,
      release.mutable,
      transactionRelease,
      sourceMutable,
      {
        faultAt,
        onDurabilityOperation,
      },
      transaction,
    );
    const stagedMutable = walkRegularFiles(transactionRelease, "transaction release");
    if (!sameEntries(stagedMutable, release.mutable))
      fail("transaction mutable inventory is incomplete");
    fault({ faultAt }, "during-mutable");
    writeFileSync(
      join(transactionRelease, RELEASE_MARKER),
      `${JSON.stringify(markerForRelease(release), null, 2)}\n`,
    );
    syncFile(join(transactionRelease, RELEASE_MARKER), { faultAt, onDurabilityOperation });
    if (!releaseFilesMatch(transactionRelease, release)) {
      fail("transaction release marker/tree does not match candidate");
    }
    writeAtomically(
      transaction,
      join(transaction, "manifest.json"),
      `${JSON.stringify({ ...release, legacySource }, null, 2)}\n`,
      { faultAt, onDurabilityOperation },
    );
    syncDirectoryAncestors(transactionRelease, transaction, { faultAt, onDurabilityOperation });
    renameSync(transactionRelease, releaseDir);
    invokeDurability({ faultAt, onDurabilityOperation }, "rename", releaseDir);
    syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
    fault({ faultAt }, "after-release");
    if (!existsSync(metadataPath)) {
      renameSync(join(transaction, "manifest.json"), metadataPath);
      invokeDurability({ faultAt, onDurabilityOperation }, "rename", metadataPath);
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
    }
    if (!metadataMatches(metadataPath, release) || !releaseFilesMatch(releaseDir, release)) {
      fail("promoted release tuple does not match candidate");
    }
    fault({ faultAt }, "before-current");
    makeCurrent(state, release.releaseId, { faultAt, onDurabilityOperation });
    return { changed: true, releaseId: release.releaseId, manifest: release };
  } finally {
    if (existsSync(transaction)) rmSync(transaction, { recursive: true, force: true });
    unlock();
  }
}

function publishPendingPath(state) {
  return join(state, PUBLISH_PENDING);
}

function outputInventory(root) {
  return walkRegularFiles(root, "static publish output");
}

function currentReleaseId(state) {
  const current = join(state, "current");
  const entry = noFollowEntry(current);
  if (!entry) return null;
  if (!entry.isSymbolicLink()) fail("current pointer is not a symlink");
  const target = readlinkSync(current);
  if (!/^releases\/[a-f0-9]{64}$/u.test(target)) fail("current pointer is unsafe");
  const release = join(state, target);
  const releaseEntry = noFollowEntry(release);
  if (!releaseEntry || releaseEntry.isSymbolicLink() || !releaseEntry.isDirectory()) {
    fail("current pointer is dangling");
  }
  return target.slice("releases/".length);
}

function exactInventory(value) {
  return (
    Array.isArray(value) &&
    sameEntries(
      value,
      [...value].sort((left, right) => ordinal(left.path, right.path)),
    )
  );
}

function validPublishTransactionId(transactionId, output) {
  const prefix = `.${basename(output)}.publish-`;
  return (
    typeof transactionId === "string" &&
    transactionId === basename(transactionId) &&
    transactionId.startsWith(prefix) &&
    transactionId.length > prefix.length &&
    !transactionId.includes("\\") &&
    !transactionId.includes("\0")
  );
}

function pendingPublishIdentityMatches(pending, output, release) {
  return (
    pending?.schemaVersion === SCHEMA_VERSION &&
    pending.output === output &&
    validPublishTransactionId(pending.transactionId, output) &&
    pending.releaseId === release.releaseId &&
    pending.manifestSha256 === manifestDigest(release) &&
    ["prepared", "renamed-uncommitted", "output-durable"].includes(pending.phase) &&
    (pending.priorCurrentReleaseId === null || typeof pending.priorCurrentReleaseId === "string") &&
    exactInventory(pending.priorAssets) &&
    exactInventory(pending.expectedAssets) &&
    exactInventory(pending.inventory) &&
    pending.priorAssetsSha256 === inventoryDigest(pending.priorAssets) &&
    pending.expectedAssetsSha256 === inventoryDigest(pending.expectedAssets)
  );
}

function advancePendingPublishPhase(state, pending, phase, options) {
  const advanced = { ...pending, phase };
  writeAtomically(
    state,
    publishPendingPath(state),
    `${JSON.stringify(advanced, null, 2)}\n`,
    options,
  );
  return advanced;
}

function pendingPublishMatches(pending, output, release, inventory) {
  return (
    pendingPublishIdentityMatches(pending, output, release) &&
    sameEntries(pending.inventory, inventory)
  );
}

function pendingInventoryMatchesCandidate(pending, release) {
  const expected = [
    ...pending.expectedAssets.map((entry) => ({ ...entry, path: `assets/${entry.path}` })),
    ...release.mutable,
  ].sort((left, right) => ordinal(left.path, right.path));
  return sameEntries(pending.inventory, expected);
}

function pendingPriorStateMatchesCurrentState(state, pending) {
  const ledger = readRetainedInventory(state);
  const retained = inventoryForAssets(state, "retained assets");
  const current = currentReleaseId(state);
  if (!ledger) {
    return (
      pending.priorCurrentReleaseId === null &&
      current === null &&
      pending.priorAssets.length === 0 &&
      retained.length === 0
    );
  }
  if (!sameEntries(ledger, retained) || !sameEntries(ledger, pending.priorAssets)) return false;
  const committed = verifyCommittedState(state);
  return (
    pending.priorCurrentReleaseId !== null &&
    committed.valid &&
    committed.releaseId === pending.priorCurrentReleaseId
  );
}

function pendingRetainedAssetsMatchCurrentState(state, pending, release) {
  const ledger = readRetainedInventory(state);
  const retained = inventoryForAssets(state, "retained assets");
  const current = currentReleaseId(state);
  const promotionJournal = readAssetPromotionJournal(state);
  if (!ledger) {
    const emptyPriorState =
      pending.priorCurrentReleaseId === null &&
      current === null &&
      pending.priorAssets.length === 0 &&
      retained.length === 0;
    const journalledInitialSubset =
      pending.priorCurrentReleaseId === null &&
      current === null &&
      promotionJournal &&
      pendingJournalMatchesRequest(promotionJournal, release, undefined, pending.expectedAssets) &&
      actualIsPriorPlusSubset(retained, promotionJournal.priorAssets, promotionJournal.additions) &&
      promotionJournal.priorAssets.length === 0;
    return emptyPriorState || journalledInitialSubset;
  }
  const journalPriorCurrentIsExact =
    pending.priorCurrentReleaseId === null
      ? current === null && pending.priorAssets.length === 0
      : current === pending.priorCurrentReleaseId;
  const journalledPromotionSubset =
    journalPriorCurrentIsExact &&
    promotionJournal &&
    pendingJournalMatchesRequest(promotionJournal, release, undefined, pending.expectedAssets) &&
    actualIsPriorPlusSubset(retained, promotionJournal.priorAssets, promotionJournal.additions) &&
    (sameEntries(ledger, promotionJournal.priorAssets) ||
      sameEntries(ledger, promotionJournal.expectedAssets));
  if (!sameEntries(ledger, retained)) return journalledPromotionSubset;
  const committed = verifyCommittedState(state);
  const priorCurrentIsExact =
    pending.priorCurrentReleaseId === null
      ? current === null && pending.priorAssets.length === 0
      : committed.valid && committed.releaseId === pending.priorCurrentReleaseId;
  const priorIsExact =
    priorCurrentIsExact &&
    sameEntries(ledger, pending.priorAssets) &&
    sameEntries(retained, pending.priorAssets);
  // A promotion can have completed before the pre-current fault.  It is safe
  // only when it is precisely the journal's own A+B namespace and A is still
  // selected; a later C release or a foreign byte remains a hard stop.
  const ownPromotionIsExact =
    priorCurrentIsExact &&
    sameEntries(ledger, pending.expectedAssets) &&
    sameEntries(retained, pending.expectedAssets);
  const alreadyCommitted =
    committed.valid &&
    committed.releaseId === pending.releaseId &&
    sameEntries(ledger, pending.expectedAssets) &&
    sameEntries(retained, pending.expectedAssets);
  return priorIsExact || ownPromotionIsExact || alreadyCommitted || journalledPromotionSubset;
}

function exactCommittedPublishWithoutJournal(state, release, inventory) {
  const committed = verifyCommittedState(state);
  const ledger = readRetainedInventory(state);
  const retained = inventoryForAssets(state, "retained assets");
  if (
    !committed.valid ||
    committed.releaseId !== release.releaseId ||
    !ledger ||
    !sameEntries(ledger, retained)
  ) {
    return false;
  }
  const expected = [
    ...ledger.map((entry) => ({ ...entry, path: `assets/${entry.path}` })),
    ...release.mutable,
  ].sort((left, right) => ordinal(left.path, right.path));
  return sameEntries(inventory, expected);
}

function readPendingPublish(state) {
  const path = publishPendingPath(state);
  return existsSync(path) ? readJson(path, "static publish pending journal") : undefined;
}

function clearPendingPublish(state, options) {
  const path = publishPendingPath(state);
  if (!existsSync(path)) return;
  unlinkSync(path);
  invokeDurability(options, "unlink-publish-pending", path);
  syncDirectory(state, options);
}

function syncTree(root, options) {
  const visit = (directory) => {
    for (const name of requireDirectoryNames(directory).sort(ordinal)) {
      const path = join(directory, name);
      const stat = lstatSync(path);
      if (stat.isDirectory()) visit(path);
      else if (stat.isFile()) syncFile(path, options);
      else fail(`static publish output has non-regular entry: ${path}`);
    }
    syncDirectory(directory, options);
  };
  visit(root);
}

function copyPublishTree({ state, candidate, temporary, options }) {
  const existing = inventoryForAssets(state, "retained assets");
  const ledger = readRetainedInventory(state);
  if (existing.length && !ledger)
    fail("retained assets do not match canonical cumulative inventory");
  if (ledger && !sameEntries(existing, ledger)) {
    fail("retained assets do not match canonical cumulative inventory");
  }
  assertNoCollision(existing, candidate.manifest.assets);
  const byExistingPath = new Map(existing.map((entry) => [entry.path, entry]));
  const retained = mergeInventories(existing, candidate.manifest.assets);
  for (const entry of retained) {
    const source = byExistingPath.has(entry.path)
      ? join(state, "assets", ...entry.path.split("/"))
      : sourceAsset(candidate.root, entry.path);
    copyAndVerify(
      source,
      join(temporary, "assets", ...entry.path.split("/")),
      entry,
      options,
      temporary,
    );
  }
  copyInventory(
    candidate.root,
    candidate.manifest.mutable,
    temporary,
    sourceMutable,
    options,
    temporary,
  );
  const inventory = outputInventory(temporary);
  const expected = [
    ...retained.map((entry) => ({ ...entry, path: `assets/${entry.path}` })),
    ...candidate.manifest.mutable,
  ].sort((left, right) => ordinal(left.path, right.path));
  if (!sameEntries(inventory, expected))
    fail("static publish output inventory does not match candidate");
  syncTree(temporary, options);
  return {
    inventory,
    priorAssets: existing,
    expectedAssets: retained,
  };
}

function noFollowEntry(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error?.code === "ENOENT") return undefined;
    throw error;
  }
}

function canonicalProspectivePath(path) {
  let ancestor = path;
  const missing = [];
  while (!existsSync(ancestor)) {
    missing.unshift(basename(ancestor));
    const parent = dirname(ancestor);
    if (parent === ancestor) fail(`cannot resolve prospective path: ${path}`);
    ancestor = parent;
  }
  return join(realpathSync(ancestor), ...missing);
}

function exactPublishedOutputDirectory(parent, output, pending) {
  const entry = noFollowEntry(output);
  if (!entry?.isSymbolicLink()) return undefined;
  try {
    const target = readlinkSync(output);
    if (
      !validPublishTransactionId(target, output) ||
      (pending && target !== pending.transactionId)
    ) {
      return undefined;
    }
    const directory = join(parent, target);
    const directoryEntry = noFollowEntry(directory);
    if (!directoryEntry || directoryEntry.isSymbolicLink() || !directoryEntry.isDirectory()) {
      return undefined;
    }
    assertInside(parent, directory, "static publish output directory");
    return directory;
  } catch {
    return undefined;
  }
}

// A full tree remains in its verified sibling directory. Publishing an output
// symlink to that directory is an atomic no-replace operation on every
// supported runtime: a concurrent mkdir(output) makes symlink creation fail
// rather than allowing rename to replace the newly occupied destination.
function publishOutputNoReplace({ temporary, output, pending, options }) {
  if (basename(temporary) !== pending.transactionId) {
    fail("static publish temporary does not match its output journal");
  }
  invokeDurability(options, "before-output-reservation", output);
  try {
    symlinkSync(pending.transactionId, output);
  } catch (error) {
    if (error?.code === "EEXIST") {
      fail("static publish destination appeared during no-replace publication");
    }
    throw error;
  }
  invokeDurability(options, "rename-output", output);
}

// Publication deliberately happens before state activation.  The journal turns
// the only unavoidable crash window (output renamed, current not yet changed)
// into an exact, byte-verified retry rather than permission to adopt arbitrary
// pre-existing output.
export function buildStaticPublish({
  stateRoot,
  candidateRoot,
  outputRoot,
  faultAt,
  onDurabilityOperation,
  projectKey,
  onLockOperation,
  diagnosticHost,
} = {}) {
  if (!stateRoot || !candidateRoot || !outputRoot)
    fail("--state, --candidate and --output are required");
  const output = resolve(outputRoot);
  const canonicalOutput = canonicalProspectivePath(output);
  const candidateRootReal = realpathSync(candidateRoot);
  if (
    canonicalOutput === candidateRootReal ||
    canonicalOutput.startsWith(`${candidateRootReal}${sep}`) ||
    candidateRootReal.startsWith(`${canonicalOutput}${sep}`)
  ) {
    fail("candidate and static publish output must not overlap");
  }
  const canonicalState = canonicalProspectivePath(resolve(stateRoot));
  if (
    canonicalState === candidateRootReal ||
    canonicalState.startsWith(`${candidateRootReal}${sep}`) ||
    candidateRootReal.startsWith(`${canonicalState}${sep}`)
  ) {
    fail("candidate and release state must not overlap");
  }
  if (
    canonicalOutput === canonicalState ||
    canonicalOutput.startsWith(`${canonicalState}${sep}`) ||
    canonicalState.startsWith(`${canonicalOutput}${sep}`)
  ) {
    fail("release state and static publish output must not overlap");
  }
  const state = ensureStateLayout(stateRoot);
  const manifest = createCandidateManifest(candidateRootReal);
  const candidate = { root: candidateRootReal, manifest };
  const options = { faultAt, onDurabilityOperation };
  const unlock = acquireLock(state, {
    projectKey,
    onLockOperation,
    diagnosticHost,
  });

  try {
    const existingPending = readPendingPublish(state);
    const parent = dirname(output);
    assertDirectory(parent, "static publish output parent");
    const outputEntry = noFollowEntry(output);
    if (outputEntry) {
      const outputDirectory = outputEntry.isSymbolicLink()
        ? exactPublishedOutputDirectory(parent, output, existingPending)
        : outputEntry.isDirectory()
          ? output
          : undefined;
      if (!outputDirectory) {
        fail("publish output already exists without an exact pending transaction");
      }
      const inventory = outputInventory(outputDirectory);
      if (!existingPending) {
        // unlink(publish-pending) can become visible before its directory fsync.
        // Accept only the exact already-committed output/current/ledger tuple,
        // repeat its durability barriers, and otherwise keep rejecting occupied
        // destinations without mutation.
        if (!exactCommittedPublishWithoutJournal(state, manifest, inventory)) {
          fail("publish output already exists without an exact pending transaction");
        }
        syncTree(outputDirectory, options);
        syncDirectory(parent, options);
        return { changed: false, releaseId: manifest.releaseId, manifest };
      }
      const pendingTemporary = join(parent, existingPending.transactionId || "invalid");
      if (
        !existingPending ||
        (outputEntry.isSymbolicLink()
          ? outputDirectory !== pendingTemporary
          : noFollowEntry(pendingTemporary)) ||
        !pendingPublishMatches(existingPending, output, manifest, inventory) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingRetainedAssetsMatchCurrentState(state, existingPending, manifest)
      ) {
        fail("publish output already exists without an exact pending transaction");
      }
      if (existingPending.phase === "prepared") {
        fail("publish output exists before its durable rename journal phase");
      }
      if (existingPending.phase === "renamed-uncommitted") {
        syncTree(outputDirectory, options);
        fault(options, "before-recovered-output-parent-fsync");
        syncDirectory(parent, options);
        fault(options, "after-output-parent-fsync-before-phase");
        advancePendingPublishPhase(state, existingPending, "output-durable", options);
      }
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
        expectedManifest: manifest,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the journaled candidate");
      }
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    }
    if (existingPending) {
      if (existingPending.phase === "output-durable") {
        fail("durable publish journal is missing its exact output");
      }
      if (
        !pendingPublishIdentityMatches(existingPending, output, manifest) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingPriorStateMatchesCurrentState(state, existingPending)
      ) {
        fail("static publish pending journal has no matching pre-output transaction");
      }
      const temporary = join(parent, existingPending.transactionId);
      const temporaryEntry = noFollowEntry(temporary);
      if (!temporaryEntry || temporaryEntry.isSymbolicLink() || !temporaryEntry.isDirectory()) {
        fail("static publish pending journal has no exact temporary directory");
      }
      assertInside(parent, temporary, "static publish temporary output");
      const inventory = outputInventory(temporary);
      if (!pendingPublishMatches(existingPending, output, manifest, inventory)) {
        fail("static publish temporary output does not match pending journal");
      }
      syncTree(temporary, options);
      if (noFollowEntry(output)) {
        fail("static publish destination changed during pre-output recovery");
      }
      const renamedPending = advancePendingPublishPhase(
        state,
        existingPending,
        "renamed-uncommitted",
        options,
      );
      publishOutputNoReplace({
        temporary,
        output,
        pending: renamedPending,
        options,
      });
      fault(options, "crash-after-output-rename-before-parent-fsync");
      syncDirectory(parent, options);
      fault(options, "after-output-parent-fsync-before-phase");
      advancePendingPublishPhase(state, renamedPending, "output-durable", options);
      fault(options, "after-output");
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
        expectedManifest: manifest,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit recovered candidate");
      }
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    }

    const temporary = join(parent, `.${basename(output)}.publish-${process.pid}-${randomUUID()}`);
    let renamed = false;
    try {
      mkdirSync(temporary, { recursive: false, mode: 0o755 });
      const { inventory, priorAssets, expectedAssets } = copyPublishTree({
        state,
        candidate,
        temporary,
        options,
      });
      const priorCurrentReleaseId = currentReleaseId(state);
      const priorCommitted = verifyCommittedState(state);
      if (
        (priorCurrentReleaseId === null && priorAssets.length !== 0) ||
        (priorCurrentReleaseId !== null &&
          (!priorCommitted.valid || priorCommitted.releaseId !== priorCurrentReleaseId))
      ) {
        fail("static publish requires an empty initial state or a valid committed current release");
      }
      let pending = {
        schemaVersion: SCHEMA_VERSION,
        output,
        transactionId: basename(temporary),
        releaseId: manifest.releaseId,
        manifestSha256: manifestDigest(manifest),
        phase: "prepared",
        priorCurrentReleaseId,
        priorAssetsSha256: inventoryDigest(priorAssets),
        priorAssets,
        expectedAssetsSha256: inventoryDigest(expectedAssets),
        expectedAssets,
        inventory,
      };
      writeAtomically(
        state,
        publishPendingPath(state),
        `${JSON.stringify(pending, null, 2)}\n`,
        options,
      );
      fault(options, "crash-before-output-rename");
      fault(options, "before-output-rename");
      pending = advancePendingPublishPhase(state, pending, "renamed-uncommitted", options);
      publishOutputNoReplace({ temporary, output, pending, options });
      renamed = true;
      fault(options, "crash-after-output-rename-before-parent-fsync");
      syncDirectory(parent, options);
      fault(options, "after-output-parent-fsync-before-phase");
      pending = advancePendingPublishPhase(state, pending, "output-durable", options);
      fault(options, "after-output");
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
        expectedManifest: manifest,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the candidate");
      }
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    } finally {
      const pendingPath = publishPendingPath(state);
      const pendingEntry = noFollowEntry(pendingPath);
      let exactPreOutputTransaction = false;
      if (
        !renamed &&
        pendingEntry?.isFile() &&
        !pendingEntry.isSymbolicLink() &&
        noFollowEntry(temporary)?.isDirectory()
      ) {
        try {
          const visiblePending = readPendingPublish(state);
          const temporaryInventory = outputInventory(temporary);
          exactPreOutputTransaction =
            ["prepared", "renamed-uncommitted"].includes(visiblePending?.phase) &&
            visiblePending.transactionId === basename(temporary) &&
            pendingPublishMatches(visiblePending, output, manifest, temporaryInventory) &&
            pendingInventoryMatchesCandidate(visiblePending, manifest) &&
            pendingPriorStateMatchesCurrentState(state, visiblePending);
        } catch {
          exactPreOutputTransaction = false;
        }
      }
      if (!renamed && !exactPreOutputTransaction && existsSync(temporary)) {
        rmSync(temporary, { recursive: true, force: true });
      }
      // A visible, exact pre-output journal is durable recovery authority even
      // when either journal phase write threw after its rename but before
      // returning. Keep both it and its bound temporary; ambiguous evidence
      // remains fail-closed.
    }
  } finally {
    unlock();
  }
}

function parseCli(argv) {
  const [command = "stage", ...rest] = argv;
  const values = {};
  for (let index = 0; index < rest.length; index += 1) {
    if (!rest[index].startsWith("--") || !rest[index + 1]) fail("expected --name value arguments");
    values[rest[index].slice(2)] = rest[index + 1];
    index += 1;
  }
  return { command, values };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { command, values } = parseCli(process.argv.slice(2));
  const options = {
    stateRoot: values.state,
    candidateRoot: values.candidate,
    legacyRoot: values.legacy,
  };
  const result =
    command === "stage"
      ? stageStaticRelease(options)
      : command === "publish"
        ? buildStaticPublish({ ...options, outputRoot: values.output })
        : command === "verify"
          ? verifyCommittedState(values.state)
          : command === "legacy-write"
            ? writeLegacyHandoffManifest({
                legacyRoot: values.legacy,
                handoffRoot: values.handoff,
                sourceId: values["source-id"],
                sourceKind: values["source-kind"],
                faultAt: values.fault,
              })
            : command === "legacy-publish-pointer"
              ? publishLegacyHandoffPointer({
                  handoffRoot: values.handoff,
                  release: values.release,
                  faultAt: values.fault,
                })
              : command === "legacy-verify"
                ? verifyLegacyHandoff(values.legacy)
                : fail(`unknown command ${command}`);
  if (command === "verify" || command === "legacy-verify") {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!result.valid) process.exitCode = 1;
  } else if (command === "legacy-write" || command === "legacy-publish-pointer") {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(
      `${JSON.stringify({
        changed: result.changed,
        releaseId: result.releaseId,
        assets: result.manifest.assets.length,
        mutable: result.manifest.mutable.length,
      })}\n`,
    );
  }
}
