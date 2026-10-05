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
  lchownSync,
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
import { spawn, spawnSync } from "node:child_process";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const RELEASE_MARKER = ".release-state.json";
const RETAINED_INVENTORY = "retained-assets.json";
const LEGACY_HANDOFF_MARKER = ".legacy-handoff.json";
const ADOPTED_PROJECT_RECORD = ".adopted-project";
const LEGACY_SOURCE_KIND = "baked-legacy-root";
const PUBLISH_PENDING = "publish-pending.json";
const ASSET_PROMOTION_PENDING = "retained-assets-pending.json";
const LOCK_SCHEMA_VERSION = 2;
const EXECUTION_DOMAIN_SCHEMA_VERSION = 1;
const EXECUTION_DOMAIN_RECORD = "stage-execution-domain.json";
const RECLAIM_GUARD = "stage.lock.reclaim";
const MAX_AUTHORITY_BYTES = 1024 * 1024;
const EXPORT_OWNER_RECORD = ".cabadrive-export-owner.json";
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
    if (entry.path === EXPORT_OWNER_RECORD) {
      fail(`candidate collides with reserved export ownership record: ${entry.path}`);
    }
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
  return readJsonRegularFileNoFollow(path, label);
}

function openRegularFileNoFollow(path, label) {
  let descriptor;
  try {
    descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const descriptorStat = fstatSync(descriptor);
    const pathStat = lstatSync(path);
    if (
      !descriptorStat.isFile() ||
      (descriptorStat.mode & 0o444) === 0 ||
      pathStat.isSymbolicLink() ||
      !pathStat.isFile() ||
      descriptorStat.dev !== pathStat.dev ||
      descriptorStat.ino !== pathStat.ino
    ) {
      fail(`${label} is not one stable no-follow regular file: ${path}`);
    }
    return { descriptor, stat: descriptorStat };
  } catch (error) {
    if (descriptor !== undefined) closeSync(descriptor);
    if (error instanceof Error && error.message.startsWith("Static release staging:")) throw error;
    fail(`${label} is not a no-follow regular file: ${path}`);
  }
}

function requireStableOpenPath(path, label, stat) {
  const pathStat = lstatSync(path);
  if (
    pathStat.isSymbolicLink() ||
    !pathStat.isFile() ||
    pathStat.dev !== stat.dev ||
    pathStat.ino !== stat.ino
  ) {
    fail(`${label} changed during no-follow access: ${path}`);
  }
}

export function readAuthorityFile(
  path,
  label,
  { onOpen, onReadChunk, onAfterRead, maxBytes = MAX_AUTHORITY_BYTES } = {},
) {
  const { descriptor, stat } = openRegularFileNoFollow(path, label);
  try {
    if (stat.size > maxBytes) fail(`${label} exceeds the authority size limit: ${path}`);
    onOpen?.({ path, stat });
    const chunks = [];
    let total = 0;
    while (total <= maxBytes) {
      const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, maxBytes + 1 - total));
      const count = readSync(descriptor, buffer, 0, buffer.length, null);
      if (count === 0) break;
      total += count;
      onReadChunk?.({ path, count, total });
      if (total > maxBytes) fail(`${label} exceeds the authority size limit: ${path}`);
      chunks.push(buffer.subarray(0, count));
    }
    const contents = Buffer.concat(chunks, total).toString("utf8");
    onAfterRead?.({ path, stat, contents });
    const after = fstatSync(descriptor);
    if (
      after.dev !== stat.dev ||
      after.ino !== stat.ino ||
      after.size !== stat.size ||
      after.mtimeMs !== stat.mtimeMs
    ) {
      fail(`${label} changed during descriptor access: ${path}`);
    }
    requireStableOpenPath(path, label, stat);
    return contents;
  } finally {
    closeSync(descriptor);
  }
}

function readRegularFileNoFollow(path, label, options) {
  return readAuthorityFile(path, label, options);
}

function readJsonRegularFileNoFollow(path, label, options) {
  try {
    return JSON.parse(readRegularFileNoFollow(path, label, options));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Static release staging:")) throw error;
    fail(`invalid ${label}: ${path}`);
  }
}

export function readAuthorityJson(path, label = "authority record", options) {
  return readJsonRegularFileNoFollow(path, label, options);
}

function verifyAndSyncExactRegularFile(path, label, expected, options) {
  const { descriptor, stat } = openRegularFileNoFollow(path, label);
  try {
    if (readFileSync(descriptor, "utf8") !== expected) {
      fail(`${label} conflicts with the requested handoff: ${path}`);
    }
    invokeDurability(options, "fsync-file", path);
    fsyncSync(descriptor);
    requireStableOpenPath(path, label, stat);
    invokeDurability(options, "close-file", path);
  } finally {
    closeSync(descriptor);
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

function executionDomain(state, projectKey) {
  const project = effectiveProjectKey(projectKey);
  const path = join(state, EXECUTION_DOMAIN_RECORD);
  const created = {
    schemaVersion: EXECUTION_DOMAIN_SCHEMA_VERSION,
    project,
    domain: randomUUID(),
  };
  let recorded = noFollowEntry(path) ? readJson(path, "stage execution domain") : undefined;
  const structurallyCompleteForeignRecord =
    recorded?.schemaVersion === EXECUTION_DOMAIN_SCHEMA_VERSION &&
    typeof recorded.project === "string" &&
    typeof recorded.domain === "string" &&
    /^[a-f0-9-]{36}$/u.test(recorded.domain) &&
    recorded.project !== project;
  if (structurallyCompleteForeignRecord) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
  if (!recorded) {
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

function publishLegacyMetadata(root, name, contents, options) {
  const path = join(root, name);
  if (noFollowEntry(path)) {
    verifyAndSyncExactRegularFile(path, `legacy handoff ${name}`, contents, options);
    syncDirectory(root, options);
    return;
  }

  const temporary = join(root, `.${name}.next-${process.pid}-${randomUUID()}`);
  let descriptor;
  let claimed = false;
  try {
    descriptor = openSync(temporary, "wx", 0o600);
    writeFileSync(descriptor, contents);
    invokeDurability(options, "fsync-file", temporary);
    fsyncSync(descriptor);
    invokeDurability(options, "close-file", temporary);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  try {
    try {
      linkSync(temporary, path);
      claimed = true;
      invokeDurability(options, "link", path);
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
    }
    if (!claimed) {
      verifyAndSyncExactRegularFile(path, `legacy handoff ${name}`, contents, options);
    }
  } finally {
    if (noFollowEntry(temporary)) unlinkSync(temporary);
    syncDirectory(root, options);
  }
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
  publishLegacyMetadata(root, "source-id", `${manifest.sourceId}\n`, options);
  publishLegacyMetadata(root, "source-kind", `${manifest.sourceKind}\n`, options);
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

export function verifyLegacyHandoff(legacyRoot, { onMarkerOpen } = {}) {
  try {
    const root = realpathSync(legacyRoot);
    assertDirectory(root, "legacy handoff root");
    const markerPath = join(root, LEGACY_HANDOFF_MARKER);
    const sourceIdPath = join(root, "source-id");
    const sourceKindPath = join(root, "source-kind");
    if (!existsSync(markerPath) || !existsSync(sourceIdPath) || !existsSync(sourceKindPath)) {
      return { valid: false, reason: "legacy handoff marker is incomplete" };
    }
    const marker = readJsonRegularFileNoFollow(markerPath, "legacy handoff marker", {
      onOpen: onMarkerOpen,
    });
    const actual = createLegacyHandoffManifest({
      legacyRoot: root,
      sourceId: readRegularFileNoFollow(sourceIdPath, "legacy handoff source-id"),
      sourceKind: readRegularFileNoFollow(sourceKindPath, "legacy handoff source-kind"),
    });
    if (!sameLegacyManifest(marker, actual)) {
      return { valid: false, reason: "legacy handoff inventory does not match" };
    }
    return { valid: true, manifest: actual, root };
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "legacy handoff validation failed",
    };
  }
}

export function pinLegacyHandoffCurrent(legacyCurrent, { onAfterClassify, onAfterValidate } = {}) {
  const current = resolve(legacyCurrent);
  let entry;
  try {
    entry = lstatSync(current);
  } catch (error) {
    if (error?.code === "ENOENT") fail("legacy handoff current pointer is absent");
    throw error;
  }
  if (!entry.isSymbolicLink()) {
    fail("legacy handoff current entry must be a symlink");
  }
  const linkTarget = readlinkSync(current);
  onAfterClassify?.({ current, linkTarget, entry });
  const parent = realpathSync(dirname(current));
  let target;
  try {
    target = realpathSync(resolve(dirname(current), linkTarget));
  } catch {
    fail("legacy handoff current pointer is dangling");
  }
  assertInside(parent, target, "legacy handoff current target");
  const targetEntry = lstatSync(target);
  if (targetEntry.isSymbolicLink() || !targetEntry.isDirectory()) {
    fail("legacy handoff current target must be a directory");
  }
  const verification = verifyLegacyHandoff(target);
  if (!verification.valid) {
    fail(`legacy handoff is not authoritative: ${verification.reason || "invalid"}`);
  }
  onAfterValidate?.({ current, target, targetEntry });
  const revalidate = () => {
    let currentEntry;
    try {
      currentEntry = lstatSync(current);
    } catch {
      fail("legacy handoff current pointer changed during validation");
    }
    if (
      !currentEntry.isSymbolicLink() ||
      currentEntry.dev !== entry.dev ||
      currentEntry.ino !== entry.ino ||
      readlinkSync(current) !== linkTarget
    ) {
      fail("legacy handoff current pointer changed during validation");
    }
    let currentTarget;
    let currentTargetEntry;
    try {
      currentTarget = realpathSync(resolve(dirname(current), linkTarget));
      currentTargetEntry = lstatSync(currentTarget);
    } catch {
      fail("legacy handoff current target changed during validation");
    }
    if (
      currentTarget !== target ||
      currentTargetEntry.dev !== targetEntry.dev ||
      currentTargetEntry.ino !== targetEntry.ino ||
      currentTargetEntry.isSymbolicLink() ||
      !currentTargetEntry.isDirectory()
    ) {
      fail("legacy handoff current target changed during validation");
    }
    return target;
  };
  revalidate();
  return { ...verification, root: target, current, linkTarget, revalidate };
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

function adoptedProjectRoot(handoffRoot) {
  if (!handoffRoot) fail("adopted project handoff root is required");
  const supplied = resolve(handoffRoot);
  assertDirectory(supplied, "adopted project handoff root");
  return realpathSync(supplied);
}

function adoptedProjectName(contents) {
  if (typeof contents !== "string" || !/^[a-z0-9][a-z0-9_-]*\n$/.test(contents)) {
    fail("adopted project record is invalid");
  }
  return contents.slice(0, -1);
}

function readAdoptedProjectRecord(root) {
  const record = join(root, ADOPTED_PROJECT_RECORD);
  const entry = noFollowEntry(record);
  if (!entry || entry.isSymbolicLink() || !entry.isFile()) {
    fail("adopted project record is not a no-follow regular file");
  }
  return { record, project: adoptedProjectName(readFileSync(record, "utf8")) };
}

// The capture shell delegates Compose-identity durability to this helper so its
// Docker-only runtime never relies on host Node.js or shell rename semantics.
// A visible record is re-synced before authority is returned: this safely
// completes the post-rename parent barrier after an interrupted publication.
export function verifyAdoptedProject({ handoffRoot, faultAt, onDurabilityOperation } = {}) {
  const root = adoptedProjectRoot(handoffRoot);
  const result = readAdoptedProjectRecord(root);
  const options = { faultAt, onDurabilityOperation };
  syncFile(result.record, options);
  syncDirectory(root, options);
  return result;
}

export function writeAdoptedProject({
  handoffRoot,
  project,
  faultAt,
  onDurabilityOperation,
  onBeforeAdoptedProjectClaim,
} = {}) {
  if (typeof project !== "string" || !/^[a-z0-9][a-z0-9_-]*$/.test(project)) {
    fail("adopted project name is invalid");
  }
  const root = adoptedProjectRoot(handoffRoot);
  const record = join(root, ADOPTED_PROJECT_RECORD);
  const existing = noFollowEntry(record);
  if (existing) {
    const verified = verifyAdoptedProject({ handoffRoot: root, faultAt, onDurabilityOperation });
    if (verified.project !== project) fail("adopted project record conflicts with discovery");
    return { ...verified, changed: false };
  }

  const temporary = join(root, `${ADOPTED_PROJECT_RECORD}.next-${process.pid}-${randomUUID()}`);
  const contents = `${project}\n`;
  const options = { faultAt, onDurabilityOperation };
  let descriptor;
  let claimed = false;
  try {
    descriptor = openSync(temporary, "wx", 0o600);
    writeFileSync(descriptor, contents);
    invokeDurability(options, "adopted-project-write", temporary);
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  try {
    const entry = noFollowEntry(temporary);
    if (
      !entry ||
      entry.isSymbolicLink() ||
      !entry.isFile() ||
      readFileSync(temporary, "utf8") !== contents
    ) {
      fail("adopted project temporary record is invalid");
    }
    syncFile(temporary, options);
    onBeforeAdoptedProjectClaim?.({ temporary, record, project });
    try {
      // link(2) creates the record atomically only if it is absent. Unlike
      // rename, it cannot replace a concurrent publisher's completed claim.
      linkSync(temporary, record);
      claimed = true;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
    }
    if (!claimed) {
      const verified = verifyAdoptedProject({ handoffRoot: root, faultAt, onDurabilityOperation });
      if (verified.project !== project) fail("adopted project record conflicts with discovery");
      return { ...verified, changed: false };
    }
    invokeDurability(options, "rename", record);
    unlinkSync(temporary);
    syncDirectory(root, options);
    return { record, project, changed: true };
  } finally {
    const entry = noFollowEntry(temporary);
    if (entry?.isFile() && !entry.isSymbolicLink()) unlinkSync(temporary);
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
  if (!noFollowEntry(markerPath)) return false;
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
  if (!noFollowEntry(path)) return false;
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
  if (!noFollowEntry(path)) return undefined;
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
  return noFollowEntry(path) ? readJson(path, "asset promotion journal") : undefined;
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
    const metadata = readJsonRegularFileNoFollow(path, "release metadata");
    return (
      metadata.releaseId === release.releaseId &&
      sameEntries(metadata.assets || [], release.assets) &&
      sameEntries(metadata.mutable || [], release.mutable)
    );
  } catch {
    return false;
  }
}

function metadataLegacyMatches(path, legacyValidation) {
  const metadata = readJsonRegularFileNoFollow(path, "release metadata");
  return (
    JSON.stringify(metadata.legacyAuthority ?? null) ===
    JSON.stringify(legacyRequest(legacyValidation))
  );
}

function releaseMetadata(release, legacyValidation) {
  return {
    ...release,
    legacySource: legacyValidation?.manifest.sourceId,
    legacyAuthority: legacyRequest(legacyValidation),
  };
}

function writeMetadataAtomically(state, path, release, legacyValidation, options) {
  writeAtomically(
    dirname(path),
    path,
    `${JSON.stringify(releaseMetadata(release, legacyValidation), null, 2)}\n`,
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
    const metadata = readJsonRegularFileNoFollow(metadataPath, "release metadata");
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
  validatedLegacy,
  finalRevalidate,
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
  const legacyValidation =
    validatedLegacy ||
    (suppliedLegacyRoot
      ? basename(suppliedLegacyRoot) === "current"
        ? pinLegacyHandoffCurrent(suppliedLegacyRoot)
        : verifyLegacyHandoff(suppliedLegacyRoot)
      : undefined);
  if (suppliedLegacyRoot && !legacyValidation?.valid) {
    fail(`legacy handoff is not authoritative: ${legacyValidation?.reason || "invalid"}`);
  }
  legacyValidation?.revalidate?.();
  const validatedLegacyRoot = legacyValidation?.root;
  const prospectiveState = resolve(stateRoot);
  const existingState = noFollowEntry(prospectiveState);
  if (existingState) {
    if (existingState.isSymbolicLink() || !existingState.isDirectory()) {
      fail(`state root must be a non-symlink directory: ${prospectiveState}`);
    }
    inspectExistingExecutionDomain(prospectiveState, projectKey);
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
        validatedLegacyRoot,
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
      if (!metadataLegacyMatches(metadataPath, legacyValidation)) {
        writeMetadataAtomically(state, metadataPath, release, legacyValidation, {
          faultAt,
          onDurabilityOperation,
        });
      }
      syncTree(releaseDir, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
      syncFile(metadataPath, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
      finalRevalidate?.();
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
      writeMetadataAtomically(state, metadataPath, release, legacyValidation, {
        faultAt,
        onDurabilityOperation,
      });
      syncTree(releaseDir, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
      syncFile(metadataPath, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
      finalRevalidate?.();
      fault({ faultAt }, "before-current");
      makeCurrent(state, release.releaseId, { faultAt, onDurabilityOperation });
      return { changed: true, releaseId: release.releaseId, manifest: release };
    }
    const metadataAlreadyExists = existsSync(metadataPath);
    if (metadataAlreadyExists && !metadataMatches(metadataPath, release)) {
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
      `${JSON.stringify(releaseMetadata(release, legacyValidation), null, 2)}\n`,
      { faultAt, onDurabilityOperation },
    );
    syncDirectoryAncestors(transactionRelease, transaction, { faultAt, onDurabilityOperation });
    renameSync(transactionRelease, releaseDir);
    invokeDurability({ faultAt, onDurabilityOperation }, "rename", releaseDir);
    syncDirectoryAncestors(dirname(releaseDir), state, { faultAt, onDurabilityOperation });
    fault({ faultAt }, "after-release");
    if (!metadataAlreadyExists) {
      renameSync(join(transaction, "manifest.json"), metadataPath);
      invokeDurability({ faultAt, onDurabilityOperation }, "rename", metadataPath);
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
    }
    if (!metadataMatches(metadataPath, release) || !releaseFilesMatch(releaseDir, release)) {
      fail("promoted release tuple does not match candidate");
    }
    if (metadataAlreadyExists) {
      // Byte equality cannot prove that a metadata-only partial survived its
      // earlier publication barrier. Repeat the file and complete ancestor
      // durability chain before selecting the newly promoted release.
      syncFile(metadataPath, { faultAt, onDurabilityOperation });
      syncDirectoryAncestors(dirname(metadataPath), state, { faultAt, onDurabilityOperation });
    }
    finalRevalidate?.();
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

function exportedInventory(root) {
  return outputInventory(root).filter((entry) => entry.path !== EXPORT_OWNER_RECORD);
}

function exportReceiptPath(state, destination) {
  return join(
    state,
    `export-receipt-${createHash("sha256").update(destination).digest("hex")}.json`,
  );
}

function exportProofFor(pending, destination) {
  return {
    schemaVersion: SCHEMA_VERSION,
    nonce: pending.exportNonce,
    operation: "publish-export",
    releaseId: pending.releaseId,
    manifestSha256: pending.manifestSha256,
    destination,
    device: pending.exportDevice,
    inode: pending.exportInode,
  };
}

function exactExportProof(value, pending, destination) {
  return JSON.stringify(value) === JSON.stringify(exportProofFor(pending, destination));
}

function validExportNonce(value) {
  return typeof value === "string" && /^[a-f0-9-]{36}$/u.test(value);
}

function validExportIdentity(pending, { required = false } = {}) {
  const absent = pending.exportDevice === null && pending.exportInode === null;
  const present =
    typeof pending.exportDevice === "string" &&
    /^[0-9]+$/u.test(pending.exportDevice) &&
    typeof pending.exportInode === "string" &&
    /^[0-9]+$/u.test(pending.exportInode);
  return required ? present : absent || present;
}

function exactBoundExportDirectory(path, pending) {
  const entry = noFollowEntry(path);
  return (
    entry &&
    !entry.isSymbolicLink() &&
    entry.isDirectory() &&
    validExportIdentity(pending, { required: true }) &&
    String(entry.dev) === pending.exportDevice &&
    String(entry.ino) === pending.exportInode
  );
}

function destinationOwnership(state, destination, pending, inventory, { terminal = false } = {}) {
  const entry = noFollowEntry(destination);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) return false;
  if (!terminal && !exactBoundExportDirectory(destination, pending)) return false;
  const proofPath = join(destination, EXPORT_OWNER_RECORD);
  const proofEntry = noFollowEntry(proofPath);
  if (!terminal && proofEntry) {
    if (proofEntry.isSymbolicLink() || !proofEntry.isFile()) return false;
    return (
      exactExportProof(readJson(proofPath, "export ownership proof"), pending, destination) &&
      sameEntries(exportedInventory(destination), inventory)
    );
  }
  if (proofEntry) return false;
  const receiptPath = exportReceiptPath(state, destination);
  if (!noFollowEntry(receiptPath)) return false;
  const receipt = readJson(receiptPath, "export ownership receipt");
  const current = lstatSync(destination);
  return (
    receipt?.schemaVersion === SCHEMA_VERSION &&
    receipt.operation === "publish-export" &&
    receipt.destination === destination &&
    receipt.releaseId === pending.releaseId &&
    receipt.manifestSha256 === pending.manifestSha256 &&
    validExportNonce(receipt.nonce) &&
    (!pending.exportNonce || receipt.nonce === pending.exportNonce) &&
    receipt.device === String(current.dev) &&
    receipt.inode === String(current.ino) &&
    receipt.inventorySha256 === inventoryDigest(inventory) &&
    sameEntries(exportedInventory(destination), inventory)
  );
}

function publishExportReceipt(state, destination, pending, inventory, options) {
  if (!exactBoundExportDirectory(destination, pending)) {
    fail("static export destination is not the journal-bound renamed inode");
  }
  const stat = lstatSync(destination);
  const receipt = {
    ...exportProofFor(pending, destination),
    device: String(stat.dev),
    inode: String(stat.ino),
    inventorySha256: inventoryDigest(inventory),
  };
  writeAtomically(
    state,
    exportReceiptPath(state, destination),
    `${JSON.stringify(receipt, null, 2)}\n`,
    options,
  );
  const proofPath = join(destination, EXPORT_OWNER_RECORD);
  if (noFollowEntry(proofPath)) {
    const proof = readJson(proofPath, "export ownership proof");
    if (!exactExportProof(proof, pending, destination)) fail("export ownership proof changed");
    unlinkSync(proofPath);
    syncDirectory(destination, options);
  }
  syncDirectory(dirname(destination), options);
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

function pendingPublishIdentityMatches(pending, output, release, operation, legacyValidation) {
  return (
    pending?.schemaVersion === SCHEMA_VERSION &&
    pending.operation === operation &&
    pending.output === output &&
    validPublishTransactionId(pending.transactionId, output) &&
    pending.releaseId === release.releaseId &&
    pending.manifestSha256 === manifestDigest(release) &&
    ["prepared", "renamed-uncommitted", "output-durable", "export-durable"].includes(
      pending.phase,
    ) &&
    (pending.priorCurrentReleaseId === null || typeof pending.priorCurrentReleaseId === "string") &&
    exactInventory(pending.priorAssets) &&
    exactInventory(pending.expectedAssets) &&
    exactInventory(pending.inventory) &&
    pending.priorAssetsSha256 === inventoryDigest(pending.priorAssets) &&
    pending.expectedAssetsSha256 === inventoryDigest(pending.expectedAssets) &&
    (operation === "publish-export"
      ? validExportNonce(pending.exportNonce) && validExportIdentity(pending)
      : pending.exportNonce === null &&
        pending.exportDevice === null &&
        pending.exportInode === null) &&
    JSON.stringify(pending.legacy) === JSON.stringify(legacyRequest(legacyValidation))
  );
}

function pendingCoordinatorRequestMatches(pending, destination, legacyValidation) {
  return (
    pending.operation === "publish-export" &&
    pending.destination === destination &&
    JSON.stringify(pending.legacy) === JSON.stringify(legacyRequest(legacyValidation))
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

function bindPendingExportIdentity(state, pending, temporary, options) {
  if (pending.operation !== "publish-export" || pending.phase !== "output-durable") {
    fail("static export identity can bind only an output-durable coordinator transaction");
  }
  const entry = noFollowEntry(temporary);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
    fail("static export temporary is not one no-follow directory");
  }
  const device = String(entry.dev);
  const inode = String(entry.ino);
  if (validExportIdentity(pending, { required: true })) {
    if (pending.exportDevice !== device || pending.exportInode !== inode) {
      fail("static export temporary does not match its journal-bound inode");
    }
    return pending;
  }
  const bound = { ...pending, exportDevice: device, exportInode: inode };
  writeAtomically(state, publishPendingPath(state), `${JSON.stringify(bound, null, 2)}\n`, options);
  return bound;
}

function pendingPublishMatches(pending, output, release, inventory, operation, legacyValidation) {
  return (
    pendingPublishIdentityMatches(pending, output, release, operation, legacyValidation) &&
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

function pendingRetainedAssetsMatchCurrentState(state, pending, release, legacyValidation) {
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
      pendingJournalMatchesRequest(
        promotionJournal,
        release,
        legacyValidation,
        pending.expectedAssets,
      ) &&
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
    pendingJournalMatchesRequest(
      promotionJournal,
      release,
      legacyValidation,
      pending.expectedAssets,
    ) &&
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

function exactCommittedPublishWithoutJournal(state, release, inventory, legacyValidation) {
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
  const metadata = readJsonRegularFileNoFollow(
    join(state, "metadata", `${release.releaseId}.json`),
    "release metadata",
  );
  if (
    JSON.stringify(metadata.legacyAuthority ?? null) !==
    JSON.stringify(legacyRequest(legacyValidation))
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
  return noFollowEntry(path) ? readJson(path, "static publish pending journal") : undefined;
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

function handBackTreeOwnership(root, ownerUid, ownerGid, options) {
  if (ownerUid === undefined && ownerGid === undefined) return;
  if (
    !Number.isSafeInteger(ownerUid) ||
    ownerUid < 0 ||
    !Number.isSafeInteger(ownerGid) ||
    ownerGid < 0
  ) {
    fail("export owner uid/gid must be safe non-negative integers");
  }
  const virtualizedDockerOwnership = (() => {
    try {
      return /linuxkit/iu.test(readFileSync("/proc/version", "utf8"));
    } catch {
      return false;
    }
  })();
  const visit = (path) => {
    const before = lstatSync(path);
    if (before.isSymbolicLink() || (!before.isDirectory() && !before.isFile())) {
      fail(`export ownership handoff found unsafe entry: ${path}`);
    }
    if (before.isDirectory()) {
      for (const name of requireDirectoryNames(path).sort(ordinal)) visit(join(path, name));
    }
    lchownSync(path, ownerUid, ownerGid);
    const after = lstatSync(path);
    const ownershipMatches = after.uid === ownerUid && after.gid === ownerGid;
    const ownershipIsOpaque =
      virtualizedDockerOwnership &&
      before.uid === 0 &&
      before.gid === 0 &&
      after.uid === before.uid &&
      after.gid === before.gid;
    if (
      after.dev !== before.dev ||
      after.ino !== before.ino ||
      (!ownershipMatches && !ownershipIsOpaque)
    ) {
      fail(`export ownership handoff changed identity or ownership: ${path}`);
    }
    if (after.isFile()) syncFile(path, options);
    else syncDirectory(path, options);
  };
  visit(root);
}

function copyPublishTree({ state, candidate, temporary, options, legacyValidation }) {
  const existing = inventoryForAssets(state, "retained assets");
  const ledger = readRetainedInventory(state);
  if (existing.length && !ledger)
    fail("retained assets do not match canonical cumulative inventory");
  if (ledger && !sameEntries(existing, ledger)) {
    fail("retained assets do not match canonical cumulative inventory");
  }
  const legacy = legacyValidation?.manifest.assets || [];
  assertNoCollision(existing, legacy, candidate.manifest.assets);
  const byExistingPath = new Map(existing.map((entry) => [entry.path, entry]));
  const byLegacyPath = new Map(legacy.map((entry) => [entry.path, entry]));
  const retained = mergeInventories(existing, legacy, candidate.manifest.assets);
  for (const entry of retained) {
    const source = byExistingPath.has(entry.path)
      ? join(state, "assets", ...entry.path.split("/"))
      : byLegacyPath.has(entry.path)
        ? join(legacyValidation.root, "assets", ...entry.path.split("/"))
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

function pathsOverlap(left, right) {
  return left === right || left.startsWith(`${right}${sep}`) || right.startsWith(`${left}${sep}`);
}

function assertAdmissionDirectory(path, label) {
  const entry = noFollowEntry(path);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
    fail(`${label} must be an existing non-symlink directory: ${path}`);
  }
  return realpathSync(path);
}

function inspectExistingExecutionDomain(state, projectKey) {
  const project = effectiveProjectKey(projectKey);
  const recordPath = join(state, EXECUTION_DOMAIN_RECORD);
  const entry = noFollowEntry(recordPath);
  if (!entry) {
    if (noFollowEntry(join(state, "stage.lock"))) {
      fail("stage execution domain is missing while a stage lock exists");
    }
    return;
  }
  const record = readJson(recordPath, "stage execution domain");
  if (!validExecutionDomain(record, project)) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
}

function exactPublishedInventory(output, pending) {
  const parent = dirname(output);
  const directory = exactPublishedOutputDirectory(parent, output, pending);
  if (!directory) return undefined;
  return { directory, inventory: outputInventory(directory) };
}

function inspectPublishAdmission({
  stateRoot,
  candidateRoot,
  release,
  output,
  destination,
  operation,
  legacyValidation,
  projectKey,
}) {
  assertAdmissionDirectory(dirname(output), "static publish output parent");
  if (operation === "publish-export") {
    if (!destination) fail("--destination is required for publish-export");
    assertAdmissionDirectory(dirname(destination), "static export destination parent");
  } else if (destination !== null) {
    fail("standalone publish must not carry a physical export destination");
  }

  const canonicalCandidate = realpathSync(candidateRoot);
  const canonicalState = canonicalProspectivePath(resolve(stateRoot));
  const canonicalOutput = canonicalProspectivePath(output);
  for (const [left, right, message] of [
    [canonicalCandidate, canonicalState, "candidate and release state must not overlap"],
    [canonicalCandidate, canonicalOutput, "candidate and static publish output must not overlap"],
    [canonicalState, canonicalOutput, "release state and static publish output must not overlap"],
  ]) {
    if (pathsOverlap(left, right)) fail(message);
  }
  if (destination) {
    const canonicalDestination = canonicalProspectivePath(destination);
    for (const protectedRoot of [canonicalCandidate, canonicalState, canonicalOutput]) {
      if (pathsOverlap(canonicalDestination, protectedRoot)) {
        fail(
          "static export destination must not overlap release state, candidate, or serving output",
        );
      }
    }
  }

  const state = resolve(stateRoot);
  const stateEntry = noFollowEntry(state);
  if (!stateEntry) {
    assertAdmissionDirectory(dirname(state), "release state parent");
  } else {
    if (stateEntry.isSymbolicLink() || !stateEntry.isDirectory()) {
      fail(`state root must be a non-symlink directory: ${state}`);
    }
    inspectExistingExecutionDomain(state, projectKey);
  }
  const pending = stateEntry ? readPendingPublish(state) : undefined;
  if (
    pending &&
    !pendingPublishIdentityMatches(pending, output, release, operation, legacyValidation)
  ) {
    fail("static publish pending journal does not own this exact operation");
  }
  if (pending && pending.destination !== destination) {
    fail("static publish pending journal does not own this exact destination");
  }
  if (
    pending &&
    operation === "publish-export" &&
    !pendingCoordinatorRequestMatches(pending, destination, legacyValidation)
  ) {
    fail("static publish pending journal does not own this exact destination");
  }

  const published = noFollowEntry(output) ? exactPublishedInventory(output, pending) : undefined;
  let terminal = false;
  if (noFollowEntry(output)) {
    const journalOwned =
      pending &&
      published &&
      pendingPublishMatches(
        pending,
        output,
        release,
        published.inventory,
        operation,
        legacyValidation,
      );
    terminal =
      !pending &&
      stateEntry &&
      published &&
      exactCommittedPublishWithoutJournal(state, release, published.inventory, legacyValidation);
    if (!journalOwned && !terminal) {
      fail("publish output already exists without exact transaction authority");
    }
  }

  if (destination && noFollowEntry(destination)) {
    const destinationEntry = noFollowEntry(destination);
    if (destinationEntry.isSymbolicLink() || !destinationEntry.isDirectory()) {
      fail("static export destination already exists without exact transaction authority");
    }
    const journalOwned =
      pending &&
      published &&
      ["output-durable", "export-durable"].includes(pending.phase) &&
      destinationOwnership(state, destination, pending, published.inventory);
    const terminalDestination =
      terminal &&
      published &&
      destinationOwnership(
        state,
        destination,
        {
          releaseId: release.releaseId,
          manifestSha256: manifestDigest(release),
          exportNonce: null,
        },
        published.inventory,
        { terminal: true },
      );
    if (!journalOwned && !terminalDestination) {
      fail("static export destination already exists without exact transaction authority");
    }
  }
  if (operation === "publish-export" && terminal && !noFollowEntry(destination)) {
    fail("committed publish-export destination is missing");
  }
  return { pending, published, terminal };
}

function assertJournalOwnedArtifacts({
  state,
  output,
  destination,
  release,
  operation,
  legacyValidation,
  committed = false,
}) {
  legacyValidation?.revalidate?.();
  const pending = readPendingPublish(state);
  if (
    !pending ||
    !pendingPublishIdentityMatches(pending, output, release, operation, legacyValidation) ||
    pending.destination !== destination
  ) {
    fail("static publish journal changed before transaction boundary");
  }
  const expectedPhase = operation === "publish-export" ? "export-durable" : "output-durable";
  if (pending.phase !== expectedPhase) {
    fail(`static publish transaction is not ${expectedPhase}`);
  }
  const published = exactPublishedInventory(output, pending);
  if (
    !published ||
    !pendingPublishMatches(
      pending,
      output,
      release,
      published.inventory,
      operation,
      legacyValidation,
    ) ||
    !pendingInventoryMatchesCandidate(pending, release)
  ) {
    fail("static publish serving output changed before transaction boundary");
  }
  if (operation === "publish-export") {
    if (!destinationOwnership(state, destination, pending, published.inventory)) {
      fail("static export destination changed before transaction boundary");
    }
  }
  const stateMatches = committed
    ? exactCommittedPublishWithoutJournal(state, release, published.inventory, legacyValidation)
    : pendingRetainedAssetsMatchCurrentState(state, pending, release, legacyValidation);
  if (!stateMatches) {
    fail("release state changed before transaction boundary");
  }
  return { pending, published };
}

function assertCandidateStillMatches(candidateRoot, release) {
  const candidate = createCandidateManifest(realpathSync(candidateRoot));
  if (
    candidate.releaseId !== release.releaseId ||
    !sameEntries(candidate.assets, release.assets) ||
    !sameEntries(candidate.mutable, release.mutable)
  ) {
    fail("candidate changed before final transaction boundary");
  }
}

function assertFinalJournalBoundary(boundary, candidateRoot, { committed = false } = {}) {
  assertCandidateStillMatches(candidateRoot, boundary.release);
  boundary.legacyValidation?.revalidate?.();
  return assertJournalOwnedArtifacts({ ...boundary, committed });
}

function syncAndRevalidateJournalBoundary(
  boundary,
  candidateRoot,
  options,
  { committed = false } = {},
) {
  const initial = assertFinalJournalBoundary(boundary, candidateRoot, { committed });
  syncTree(initial.published.directory, options);
  syncDirectory(dirname(boundary.output), options);
  if (boundary.destination) {
    syncTree(boundary.destination, options);
    syncDirectory(dirname(boundary.destination), options);
  }
  syncDirectory(boundary.state, options);
  return assertFinalJournalBoundary(boundary, candidateRoot, { committed });
}

function syncAndRevalidateCommittedTerminal(admissionRequest, admission, options) {
  syncTree(admission.published.directory, options);
  syncDirectory(dirname(admissionRequest.output), options);
  syncTree(admissionRequest.destination, options);
  syncDirectory(dirname(admissionRequest.destination), options);
  syncDirectory(resolve(admissionRequest.stateRoot), options);
  assertCandidateStillMatches(admissionRequest.candidateRoot, admissionRequest.release);
  admissionRequest.legacyValidation?.revalidate?.();
  const final = inspectPublishAdmission(admissionRequest);
  if (!final.terminal) fail("committed publish changed during final durability validation");
  return final;
}

function renameNoReplace(source, destination, options) {
  const helper = options?.renameNoReplaceHelper || process.env.CABADRIVE_RENAME_NOREPLACE_HELPER;
  if (!helper) fail("native no-replace rename helper is unavailable");
  const result = spawnSync(helper, [source, destination], { encoding: "utf8" });
  if (result.error) fail(`native no-replace rename helper failed: ${result.error.message}`);
  if (result.status !== 0) {
    fail(
      `native no-replace rename rejected destination: ${(result.stderr || result.stdout || "unknown error").trim()}`,
    );
  }
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

function retireOldPublishGenerations(generationRoot, logicalOutput, activeOutput, options) {
  if (!generationRoot) return;
  const root = realpathSync(generationRoot);
  const prefix = `${basename(logicalOutput)}-`;
  const candidates = requireDirectoryNames(root)
    .filter((name) => name.startsWith(prefix))
    .map((name) => join(root, name))
    .filter((path) => noFollowEntry(path)?.isSymbolicLink())
    .sort((left, right) => lstatSync(right).mtimeMs - lstatSync(left).mtimeMs);
  const protectedPaths = new Set([activeOutput]);
  const rollback = candidates.find((path) => path !== activeOutput);
  if (rollback) protectedPaths.add(rollback);
  for (const output of candidates) {
    if (protectedPaths.has(output)) continue;
    const directory = exactPublishedOutputDirectory(root, output);
    if (!directory) fail(`old publish generation is not safely contained: ${output}`);
    unlinkSync(output);
    syncDirectory(root, options);
    rmSync(directory, { recursive: true, force: false });
    syncDirectory(root, options);
  }
}

// Publication deliberately happens before state activation.  The journal turns
// the only unavoidable crash window (output renamed, current not yet changed)
// into an exact, byte-verified retry rather than permission to adopt arbitrary
// pre-existing output.
export function buildStaticPublish({
  stateRoot,
  candidateRoot,
  outputRoot,
  destinationRoot,
  legacyRoot,
  validatedLegacy,
  deferActivation = false,
  lockHeld = false,
  faultAt,
  onDurabilityOperation,
  projectKey,
  onLockOperation,
  diagnosticHost,
  onAfterReadOnlyAdmission,
  onBeforeActivationRevalidation,
  onBeforeJournalClearRevalidation,
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
  const suppliedLegacyRoot =
    legacyRoot === undefined || legacyRoot === null ? undefined : resolve(legacyRoot);
  const legacyValidation =
    validatedLegacy ||
    (suppliedLegacyRoot
      ? basename(suppliedLegacyRoot) === "current"
        ? pinLegacyHandoffCurrent(suppliedLegacyRoot)
        : verifyLegacyHandoff(suppliedLegacyRoot)
      : undefined);
  if (suppliedLegacyRoot && !legacyValidation?.valid) {
    fail(`legacy handoff is not authoritative: ${legacyValidation?.reason || "invalid"}`);
  }
  legacyValidation?.revalidate?.();
  const destination = destinationRoot ? resolve(destinationRoot) : null;
  const operation = deferActivation ? "publish-export" : "publish";
  const manifest = createCandidateManifest(candidateRootReal);
  const candidate = { root: candidateRootReal, manifest };
  const admissionRequest = {
    stateRoot,
    candidateRoot: candidateRootReal,
    release: manifest,
    output,
    destination,
    operation,
    legacyValidation,
    projectKey,
  };
  inspectPublishAdmission(admissionRequest);
  if (!lockHeld) onAfterReadOnlyAdmission?.(admissionRequest);
  const state = ensureStateLayout(stateRoot);
  const options = { faultAt, onDurabilityOperation };
  const unlock = lockHeld
    ? () => {}
    : acquireLock(state, {
        projectKey,
        onLockOperation,
        diagnosticHost,
      });

  try {
    inspectPublishAdmission({ ...admissionRequest, stateRoot: state });
    const existingPending = readPendingPublish(state);
    const activateStandalonePublish = () => {
      const boundary = {
        state,
        output,
        destination,
        release: manifest,
        operation,
        legacyValidation,
      };
      onBeforeActivationRevalidation?.(boundary);
      fault(options, "before-activation-revalidation");
      syncAndRevalidateJournalBoundary(boundary, candidateRootReal, options);
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
        validatedLegacy: legacyValidation,
        finalRevalidate: () =>
          assertFinalJournalBoundary(boundary, candidateRootReal, { committed: false }),
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the journaled candidate");
      }
      onBeforeJournalClearRevalidation?.(boundary);
      fault(options, "before-clear-revalidation");
      syncAndRevalidateJournalBoundary(boundary, candidateRootReal, options, {
        committed: true,
      });
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    };
    if (existingPending && existingPending.operation !== operation) {
      fail(
        `static ${existingPending.operation || "unknown"} transaction cannot resume as ${operation}`,
      );
    }
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
        if (!exactCommittedPublishWithoutJournal(state, manifest, inventory, legacyValidation)) {
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
        !pendingPublishMatches(
          existingPending,
          output,
          manifest,
          inventory,
          operation,
          legacyValidation,
        ) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingRetainedAssetsMatchCurrentState(
          state,
          existingPending,
          manifest,
          legacyValidation,
        ) ||
        (deferActivation &&
          !pendingCoordinatorRequestMatches(existingPending, destination, legacyValidation))
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
      if (deferActivation) {
        return { changed: false, releaseId: manifest.releaseId, manifest };
      }
      return activateStandalonePublish();
    }
    if (existingPending) {
      if (["output-durable", "export-durable"].includes(existingPending.phase)) {
        fail("durable publish journal is missing its exact output");
      }
      if (
        !pendingPublishIdentityMatches(
          existingPending,
          output,
          manifest,
          operation,
          legacyValidation,
        ) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingPriorStateMatchesCurrentState(state, existingPending) ||
        (deferActivation &&
          !pendingCoordinatorRequestMatches(existingPending, destination, legacyValidation))
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
      if (
        !pendingPublishMatches(
          existingPending,
          output,
          manifest,
          inventory,
          operation,
          legacyValidation,
        )
      ) {
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
      if (deferActivation) {
        return { changed: true, releaseId: manifest.releaseId, manifest };
      }
      return activateStandalonePublish();
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
        legacyValidation,
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
        operation,
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
        destination,
        exportNonce: operation === "publish-export" ? randomUUID() : null,
        exportDevice: null,
        exportInode: null,
        legacy: legacyRequest(legacyValidation),
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
      if (deferActivation) {
        return { changed: true, releaseId: manifest.releaseId, manifest };
      }
      return activateStandalonePublish();
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
            pendingPublishMatches(
              visiblePending,
              output,
              manifest,
              temporaryInventory,
              operation,
              legacyValidation,
            ) &&
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

// The serving output is an atomic no-replace symlink so it never exposes a
// partial tree. Static-host/archive consumers that require a physical artifact
// must call this explicit export operation rather than archiving that link.
export function exportStaticPublish({
  stateRoot,
  candidateRoot,
  outputRoot,
  destinationRoot,
  options,
  allowPending = false,
  validatedLegacy,
} = {}) {
  if (!stateRoot || !candidateRoot || !outputRoot || !destinationRoot) {
    fail("--state, --candidate, --output and --destination are required");
  }
  const state = resolve(stateRoot);
  const output = resolve(outputRoot);
  const destination = resolve(destinationRoot);
  const parent = dirname(output);
  const candidate = createCandidateManifest(realpathSync(candidateRoot));
  let pending = allowPending ? readPendingPublish(state) : undefined;
  const source = exactPublishedOutputDirectory(parent, output, pending);
  if (!source) fail("static publish output is not an exact serving transaction");
  const inventory = outputInventory(source);
  const exactPending =
    allowPending &&
    pending &&
    ["output-durable", "export-durable"].includes(pending.phase) &&
    pendingPublishMatches(
      pending,
      output,
      candidate,
      inventory,
      "publish-export",
      validatedLegacy,
    ) &&
    pendingInventoryMatchesCandidate(pending, candidate) &&
    pendingRetainedAssetsMatchCurrentState(state, pending, candidate, validatedLegacy) &&
    pendingCoordinatorRequestMatches(pending, destination, validatedLegacy);
  if (
    !exactPending &&
    !exactCommittedPublishWithoutJournal(state, candidate, inventory, validatedLegacy)
  ) {
    fail("static publish output is not an exact committed artifact");
  }
  const canonicalDestination = canonicalProspectivePath(destination);
  for (const protectedRoot of [
    canonicalProspectivePath(state),
    realpathSync(candidateRoot),
    canonicalProspectivePath(output),
    realpathSync(source),
  ]) {
    if (pathsOverlap(canonicalDestination, protectedRoot)) {
      fail(
        "static export destination must not overlap release state, candidate, or serving output",
      );
    }
  }
  const existingDestination = noFollowEntry(destination);
  if (existingDestination) {
    if (
      exactPending &&
      existingDestination.isDirectory() &&
      !existingDestination.isSymbolicLink() &&
      destinationOwnership(state, destination, pending, inventory)
    ) {
      syncTree(destination, options);
      syncDirectory(dirname(destination), options);
      publishExportReceipt(state, destination, pending, inventory, options || {});
      if (exactPending && pending.phase === "output-durable") {
        fault(options || {}, "after-export-parent-fsync-before-phase");
        advancePendingPublishPhase(state, pending, "export-durable", options || {});
      }
      return { changed: false, releaseId: candidate.releaseId, manifest: candidate };
    }
    fail("static export destination already exists");
  }
  const destinationParent = dirname(destination);
  assertDirectory(destinationParent, "static export destination parent");
  const temporary = join(
    destinationParent,
    exactPending
      ? `.${basename(destination)}.export-${pending.exportNonce}`
      : `.${basename(destination)}.export-${process.pid}-${randomUUID()}`,
  );
  let published = false;
  let createdTemporaryIdentity;
  try {
    // Never make the requested destination observable until the complete
    // physical artifact has been copied, verified, and made durable.
    const existingTemporary = noFollowEntry(temporary);
    if (existingTemporary) {
      if (
        !exactPending ||
        !exactBoundExportDirectory(temporary, pending) ||
        !sameEntries(exportedInventory(temporary), inventory)
      ) {
        fail("static export journal has no exact bound temporary directory");
      }
    } else {
      if (exactPending && validExportIdentity(pending, { required: true })) {
        fail("static export journal-bound temporary directory is missing");
      }
      mkdirSync(temporary, { recursive: false, mode: 0o755 });
      const created = lstatSync(temporary);
      createdTemporaryIdentity = { device: created.dev, inode: created.ino };
      for (const entry of inventory) {
        copyAndVerify(
          join(source, ...entry.path.split("/")),
          join(temporary, ...entry.path.split("/")),
          entry,
          options,
          temporary,
        );
      }
      handBackTreeOwnership(temporary, options?.ownerUid, options?.ownerGid, options);
      syncTree(temporary, options);
      if (exactPending) {
        pending = bindPendingExportIdentity(state, pending, temporary, options || {});
        fault(options || {}, "after-export-identity-bind");
      }
    }
    if (exactPending) {
      const proofPath = join(temporary, EXPORT_OWNER_RECORD);
      if (noFollowEntry(proofPath)) {
        const proof = readJson(proofPath, "export ownership proof");
        if (!exactExportProof(proof, pending, destination)) {
          fail("export ownership proof changed");
        }
      } else {
        writeFileSync(
          proofPath,
          `${JSON.stringify(exportProofFor(pending, destination), null, 2)}\n`,
          {
            flag: "wx",
            mode: 0o600,
          },
        );
      }
      syncFile(proofPath, options);
    }
    handBackTreeOwnership(temporary, options?.ownerUid, options?.ownerGid, options);
    syncTree(temporary, options);
    if (exactPending && !exactBoundExportDirectory(temporary, pending)) {
      fail("static export temporary changed after its journal identity was bound");
    }
    syncDirectory(destinationParent, options);
    options?.onBeforeExportPublish?.({ temporary, destination });
    renameNoReplace(temporary, destination, options);
    published = true;
    invokeDurability(options, "export-rename", destination);
    syncDirectory(destinationParent, options);
    if (exactPending) {
      publishExportReceipt(state, destination, pending, inventory, options || {});
      fault(options || {}, "after-export-parent-fsync-before-phase");
      advancePendingPublishPhase(state, pending, "export-durable", options || {});
      fault(options || {}, "after-export");
    }
  } finally {
    // Each attempt owns a unique sibling. Ordinary failures cannot leave a
    // partial destination. Once the journal may have durably bound the inode,
    // preserve it even if the binding call failed after its atomic rename but
    // before its parent barrier returned.
    if (!published && noFollowEntry(temporary)) {
      let preserveForJournal = false;
      if (exactPending) {
        try {
          const latest = readPendingPublish(state);
          preserveForJournal = Boolean(
            latest &&
            validExportIdentity(latest, { required: true }) &&
            latest.exportNonce === pending.exportNonce,
          );
        } catch {
          preserveForJournal = true;
        }
      }
      const current = noFollowEntry(temporary);
      const stillCreatedTemporary =
        createdTemporaryIdentity &&
        current?.isDirectory() &&
        !current.isSymbolicLink() &&
        current.dev === createdTemporaryIdentity.device &&
        current.ino === createdTemporaryIdentity.inode;
      if (!preserveForJournal && stillCreatedTemporary) {
        rmSync(temporary, { recursive: true, force: true });
      }
    }
  }
  return { changed: true, releaseId: candidate.releaseId, manifest: candidate };
}

export function publishAndExportStaticRelease(options) {
  if (
    !options?.stateRoot ||
    !options?.candidateRoot ||
    !options?.outputRoot ||
    !options?.destinationRoot
  ) {
    fail("--state, --candidate, --output and --destination are required");
  }
  const candidateRoot = realpathSync(options.candidateRoot);
  const manifest = createCandidateManifest(candidateRoot);
  const logicalOutput = resolve(options.outputRoot);
  const output = options.generationRoot
    ? join(
        assertAdmissionDirectory(resolve(options.generationRoot), "publish generation root"),
        `${basename(logicalOutput)}-${manifest.releaseId}`,
      )
    : logicalOutput;
  const destination = resolve(options.destinationRoot);
  const suppliedLegacyRoot = options.legacyRoot ? resolve(options.legacyRoot) : undefined;
  const legacyValidation = suppliedLegacyRoot
    ? basename(suppliedLegacyRoot) === "current"
      ? pinLegacyHandoffCurrent(suppliedLegacyRoot)
      : verifyLegacyHandoff(suppliedLegacyRoot)
    : undefined;
  if (suppliedLegacyRoot && !legacyValidation?.valid) {
    fail(`legacy handoff is not authoritative: ${legacyValidation?.reason || "invalid"}`);
  }
  legacyValidation?.revalidate?.();
  const admissionRequest = {
    stateRoot: options.stateRoot,
    candidateRoot,
    release: manifest,
    output,
    destination,
    operation: "publish-export",
    legacyValidation,
    projectKey: options.projectKey,
  };
  inspectPublishAdmission(admissionRequest);
  options.onAfterReadOnlyAdmission?.(admissionRequest);
  const state = ensureStateLayout(options.stateRoot);
  const transactionOptions = {
    faultAt: options.faultAt,
    onDurabilityOperation: options.onDurabilityOperation,
    renameNoReplaceHelper: options.renameNoReplaceHelper,
    onBeforeExportPublish: options.onBeforeExportPublish,
    ownerUid: options.ownerUid,
    ownerGid: options.ownerGid,
  };
  const unlock = acquireLock(state, {
    projectKey: options.projectKey,
    onLockOperation: options.onLockOperation,
    diagnosticHost: options.diagnosticHost,
  });
  try {
    const lockedManifest = createCandidateManifest(candidateRoot);
    if (
      lockedManifest.releaseId !== manifest.releaseId ||
      !sameEntries(lockedManifest.assets, manifest.assets) ||
      !sameEntries(lockedManifest.mutable, manifest.mutable)
    ) {
      fail("candidate changed between read-only and locked admission");
    }
    legacyValidation?.revalidate?.();
    const lockedAdmission = inspectPublishAdmission({ ...admissionRequest, stateRoot: state });
    if (lockedAdmission.terminal) {
      syncAndRevalidateCommittedTerminal(
        { ...admissionRequest, stateRoot: state },
        lockedAdmission,
        transactionOptions,
      );
      retireOldPublishGenerations(
        options.generationRoot,
        logicalOutput,
        output,
        transactionOptions,
      );
      return { changed: false, releaseId: manifest.releaseId, manifest };
    }
    const published = buildStaticPublish({
      ...options,
      outputRoot: output,
      stateRoot: state,
      validatedLegacy: legacyValidation,
      deferActivation: true,
      lockHeld: true,
    });
    const exported = exportStaticPublish({
      ...options,
      outputRoot: output,
      stateRoot: state,
      validatedLegacy: legacyValidation,
      allowPending: true,
      options: transactionOptions,
    });
    const pending = readPendingPublish(state);
    if (
      !pending ||
      pending.phase !== "export-durable" ||
      !pendingCoordinatorRequestMatches(pending, resolve(options.destinationRoot), legacyValidation)
    ) {
      fail("static publish/export transaction is not durably export-complete");
    }
    const boundary = {
      state,
      output,
      destination,
      release: manifest,
      operation: "publish-export",
      legacyValidation,
    };
    options.onBeforeActivationRevalidation?.(boundary);
    fault(transactionOptions, "before-activation-revalidation");
    syncAndRevalidateJournalBoundary(boundary, candidateRoot, transactionOptions);
    fault(transactionOptions, "before-current-activation");
    const staged = stageStaticRelease({
      ...options,
      stateRoot: state,
      validatedLegacy: legacyValidation,
      lockHeld: true,
      expectedManifest: published.manifest,
      finalRevalidate: () =>
        assertFinalJournalBoundary(boundary, candidateRoot, { committed: false }),
    });
    if (
      staged.releaseId !== published.releaseId ||
      published.releaseId !== exported.releaseId ||
      !verifyCommittedState(state).valid
    ) {
      fail("static publish/export transaction changed between operations");
    }
    options.onBeforeJournalClearRevalidation?.(boundary);
    fault(transactionOptions, "before-clear-revalidation");
    syncAndRevalidateJournalBoundary(boundary, candidateRoot, transactionOptions, {
      committed: true,
    });
    fault(transactionOptions, "before-publish-journal-clear");
    clearPendingPublish(state, transactionOptions);
    retireOldPublishGenerations(options.generationRoot, logicalOutput, output, transactionOptions);
    return exported;
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

function parseOwnerId(value, label) {
  if (value === undefined) return undefined;
  if (!/^(0|[1-9][0-9]*)$/.test(value)) fail(`${label} must be a numeric host identity`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) fail(`${label} must be a safe integer host identity`);
  return parsed;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { command, values } = parseCli(process.argv.slice(2));
  const options = {
    stateRoot: values.state,
    candidateRoot: values.candidate,
    legacyRoot: values.legacy,
    faultAt: values.fault,
    generationRoot: values["generation-root"],
    ownerUid: parseOwnerId(values["owner-uid"], "--owner-uid"),
    ownerGid: parseOwnerId(values["owner-gid"], "--owner-gid"),
  };
  const result =
    command === "stage"
      ? stageStaticRelease(options)
      : command === "publish"
        ? buildStaticPublish({ ...options, outputRoot: values.output })
        : command === "export"
          ? exportStaticPublish({
              ...options,
              outputRoot: values.output,
              destinationRoot: values.destination,
            })
          : command === "publish-export"
            ? publishAndExportStaticRelease({
                ...options,
                outputRoot: values.output,
                destinationRoot: values.destination,
              })
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
                  : command === "adopted-project-write"
                    ? writeAdoptedProject({
                        handoffRoot: values.handoff,
                        project: values.project,
                        faultAt: values.fault,
                      })
                    : command === "adopted-project-verify"
                      ? verifyAdoptedProject({
                          handoffRoot: values.handoff,
                          faultAt: values.fault,
                        })
                      : command === "legacy-verify"
                        ? verifyLegacyHandoff(values.legacy)
                        : fail(`unknown command ${command}`);
  if (command === "verify" || command === "legacy-verify") {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!result.valid) process.exitCode = 1;
  } else if (command === "adopted-project-verify") {
    process.stdout.write(`${result.project}\n`);
  } else if (
    command === "legacy-write" ||
    command === "legacy-publish-pointer" ||
    command === "adopted-project-write"
  ) {
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
