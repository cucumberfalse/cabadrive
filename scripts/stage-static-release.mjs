#!/usr/bin/env node
/**
 * Append-only staging for Vite output.  This intentionally has no package
 * dependencies so the Docker stager can run it without the application tree.
 */
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  closeSync,
  copyFileSync,
  existsSync,
  fsyncSync,
  lstatSync,
  linkSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
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

function executionDomain(state, projectKey) {
  const project = effectiveProjectKey(projectKey);
  const path = join(state, EXECUTION_DOMAIN_RECORD);
  const created = {
    schemaVersion: EXECUTION_DOMAIN_SCHEMA_VERSION,
    project,
    domain: randomUUID(),
  };
  let descriptor;
  try {
    descriptor = openSync(path, "wx", 0o600);
    writeFileSync(descriptor, `${JSON.stringify(created)}\n`);
    fsyncSync(descriptor);
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  if (descriptor !== undefined) syncDirectory(state, undefined);
  const recorded = readJson(path, "stage execution domain");
  if (
    recorded?.schemaVersion !== EXECUTION_DOMAIN_SCHEMA_VERSION ||
    recorded.project !== project ||
    typeof recorded.domain !== "string" ||
    !/^[a-f0-9-]{36}$/u.test(recorded.domain)
  ) {
    fail("stage execution domain is malformed or belongs to another Compose project");
  }
  return recorded;
}

function lockOwnerRecord(context, diagnosticHost = hostname()) {
  const startIdentity = processStartIdentity(process.pid);
  return {
    schemaVersion: LOCK_SCHEMA_VERSION,
    project: context.project,
    domain: context.domain,
    acquisition: randomUUID(),
    diagnosticHost,
    pid: process.pid,
    // Local developer platforms without Linux's executable /proc starttime
    // may create a unique lock, but may never reclaim one: inspection below
    // treats this identity as ambiguous/fail-closed.
    startIdentity: startIdentity || `unsupported-${randomUUID()}`,
  };
}

function inspectLockOwner(owner, context) {
  if (
    !owner ||
    owner.schemaVersion !== LOCK_SCHEMA_VERSION ||
    owner.project !== context.project ||
    owner.domain !== context.domain ||
    typeof owner.acquisition !== "string" ||
    typeof owner.diagnosticHost !== "string" ||
    !Number.isInteger(owner.pid) ||
    owner.pid <= 0 ||
    typeof owner.startIdentity !== "string" ||
    !/^\d+$/u.test(owner.startIdentity)
  ) {
    return "ambiguous";
  }
  const actual = processStartIdentity(owner.pid);
  if (!actual) {
    // `/proc` can be unavailable or denied even while a publisher is alive.
    // Only an explicit ESRCH is evidence that this owner cannot still hold
    // the lock; every other inspection failure remains fail-closed.
    try {
      process.kill(owner.pid, 0);
      return "ambiguous";
    } catch (error) {
      return error?.code === "ESRCH" ? "dead" : "ambiguous";
    }
  }
  return actual === owner.startIdentity ? "live" : "dead";
}

function sameLockOwner(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function acquireLock(state, { ownerInspector, projectKey, onLockOperation, diagnosticHost } = {}) {
  const lock = join(state, "stage.lock");
  const context = executionDomain(state, projectKey);
  const owner = lockOwnerRecord(context, diagnosticHost);
  const reclaim = join(state, RECLAIM_GUARD);
  let acquired = false;
  while (!acquired) {
    let descriptor;
    try {
      descriptor = openSync(lock, "wx", 0o600);
      writeFileSync(descriptor, `${JSON.stringify(owner)}\n`);
      fsyncSync(descriptor);
      acquired = true;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      let recorded;
      try {
        recorded = readJson(lock, "stage lock owner");
      } catch {
        fail("stage lock owner is malformed or inaccessible");
      }
      let status;
      try {
        status = ownerInspector
          ? ownerInspector(recorded, context)
          : inspectLockOwner(recorded, context);
      } catch {
        status = "ambiguous";
      }
      if (status !== "dead") fail("another stage holds the exclusive lock");
      onLockOperation?.({ operation: "stale-inspected", owner: recorded });
      let guarded = false;
      const replacement = join(state, `stage.lock.next-${owner.acquisition}`);
      try {
        // `link` is the compare-and-reclaim primitive: the fixed guard can be
        // created by only one contender and pins the exact inode inspected.
        // If release/reacquire won first, the linked contents no longer match
        // and the newer canonical lock is left untouched.
        linkSync(lock, reclaim);
        guarded = true;
        const guardedOwner = readJson(reclaim, "stage reclaim guard");
        const canonicalOwner = readJson(lock, "stage lock owner");
        if (!sameLockOwner(guardedOwner, recorded) || !sameLockOwner(canonicalOwner, recorded)) {
          continue;
        }
        onLockOperation?.({ operation: "reclaim-guarded", owner: recorded });
        const confirmedOwner = readJson(lock, "stage lock owner");
        if (!sameLockOwner(confirmedOwner, recorded)) continue;
        const nextDescriptor = openSync(replacement, "wx", 0o600);
        try {
          writeFileSync(nextDescriptor, `${JSON.stringify(owner)}\n`);
          fsyncSync(nextDescriptor);
        } finally {
          closeSync(nextDescriptor);
        }
        // The canonical name changes from the pinned stale inode to our fully
        // durable owner record in one rename; there is no unlocked name gap.
        renameSync(replacement, lock);
        syncDirectory(state, undefined);
        const staleDigest = createHash("sha256")
          .update(JSON.stringify(recorded))
          .digest("hex")
          .slice(0, 16);
        const quarantine = join(state, `stage.lock.stale-${staleDigest}-${randomUUID()}`);
        renameSync(reclaim, quarantine);
        guarded = false;
        syncDirectory(state, undefined);
        acquired = true;
      } catch (reclaimError) {
        if (reclaimError?.code === "ENOENT") continue;
        if (reclaimError?.code === "EEXIST") fail("another stage holds the exclusive lock");
        throw reclaimError;
      } finally {
        if (existsSync(replacement)) rmSync(replacement, { force: true });
        if (guarded && existsSync(reclaim)) unlinkSync(reclaim);
      }
    } finally {
      if (descriptor !== undefined) closeSync(descriptor);
    }
  }
  syncDirectory(state, undefined);
  onLockOperation?.({ operation: "lock-acquired", owner });
  return () => {
    let recorded;
    try {
      recorded = readJson(lock, "stage lock owner");
    } catch {
      fail("stage lock ownership changed before release");
    }
    if (!sameLockOwner(recorded, owner)) fail("stage lock ownership changed before release");
    unlinkSync(lock);
    syncDirectory(state, undefined);
    onLockOperation?.({ operation: "lock-released", owner });
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
  const root = realpathSync(legacyRoot);
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
  if (handoffRoot) {
    const durableHandoff = realpathSync(handoffRoot);
    assertDirectory(durableHandoff, "legacy handoff base");
    assertInside(durableHandoff, root, "legacy handoff release");
    syncDirectoryAncestors(dirname(root), durableHandoff, options);
  }
  return manifest;
}

// The capture shell deliberately delegates the pointer commit to this helper.
// POSIX rename replaces a symlink itself; unlike `mv`, it never interprets a
// symlink-to-directory as a destination directory.  Keeping the link creation
// and rename in one repository-owned helper also makes the exact failure
// boundary testable without relying on shell errexit semantics.
export function publishLegacyHandoffPointer({ handoffRoot, release, faultAt } = {}) {
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
  try {
    if (faultAt === "legacy-pointer-link") fail("fault injection at legacy pointer link");
    symlinkSync(relative, next);
    if (faultAt === "legacy-pointer-rename") fail("fault injection at legacy pointer rename");
    renameSync(next, current);
    syncDirectory(root, undefined);
  } finally {
    if (existsSync(next)) rmSync(next, { force: true });
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
  symlinkSync(join("releases", releaseId), next);
  try {
    renameSync(next, current);
    invokeDurability(options, "rename-current", current);
    syncDirectory(state, options);
  } catch (error) {
    // A failed post-rename durability barrier must not leave a newly selected
    // release advertised by this process. Restore the prior pointer before
    // surfacing the failure; a retry can then safely re-run the transaction.
    if (existsSync(current)) rmSync(current, { force: true });
    if (previous) {
      symlinkSync(previous, current);
      syncDirectory(state, undefined);
    }
    throw error;
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
  ownerInspector,
  projectKey,
  onLockOperation,
  diagnosticHost,
  lockHeld = false,
} = {}) {
  if (!stateRoot || !candidateRoot) fail("--state and --candidate are required");
  const suppliedLegacyRoot =
    legacyRoot === undefined || legacyRoot === null ? undefined : resolve(legacyRoot);
  const legacyValidation = suppliedLegacyRoot ? verifyLegacyHandoff(suppliedLegacyRoot) : undefined;
  if (suppliedLegacyRoot && !legacyValidation?.valid) {
    fail(`legacy handoff is not authoritative: ${legacyValidation?.reason || "invalid"}`);
  }
  const state = ensureStateLayout(stateRoot);
  const release = createCandidateManifest(candidateRoot);
  const releaseDir = join(state, "releases", release.releaseId);
  const metadataPath = join(state, "metadata", `${release.releaseId}.json`);
  const unlock = lockHeld
    ? () => {}
    : acquireLock(state, { ownerInspector, projectKey, onLockOperation, diagnosticHost });
  const transaction = join(state, "transactions", `${release.releaseId}-${randomUUID()}`);
  try {
    const candidate = realpathSync(candidateRoot);
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
  if (!existsSync(current) || !lstatSync(current).isSymbolicLink()) return null;
  const target = readlinkSync(current);
  return /^releases\/[a-f0-9]{64}$/u.test(target) ? target.slice("releases/".length) : null;
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
    (pending.priorCurrentReleaseId === null || typeof pending.priorCurrentReleaseId === "string") &&
    exactInventory(pending.priorAssets) &&
    exactInventory(pending.expectedAssets) &&
    exactInventory(pending.inventory) &&
    pending.priorAssetsSha256 === inventoryDigest(pending.priorAssets) &&
    pending.expectedAssetsSha256 === inventoryDigest(pending.expectedAssets)
  );
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

function pendingRetainedAssetsMatchCurrentState(state, pending) {
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
  if (!sameEntries(ledger, retained)) return false;
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
  return priorIsExact || ownPromotionIsExact || alreadyCommitted;
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
  ownerInspector,
  projectKey,
  onLockOperation,
  diagnosticHost,
} = {}) {
  if (!stateRoot || !candidateRoot || !outputRoot)
    fail("--state, --candidate and --output are required");
  const state = ensureStateLayout(stateRoot);
  const output = resolve(outputRoot);
  const candidateRootReal = realpathSync(candidateRoot);
  const manifest = createCandidateManifest(candidateRootReal);
  const candidate = { root: candidateRootReal, manifest };
  const options = { faultAt, onDurabilityOperation };
  const unlock = acquireLock(state, {
    ownerInspector,
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
      if (outputEntry.isSymbolicLink() || !outputEntry.isDirectory()) {
        fail("publish output already exists without an exact pending transaction");
      }
      const inventory = outputInventory(output);
      const pendingTemporary = existingPending
        ? join(parent, existingPending.transactionId || "invalid")
        : undefined;
      if (
        !existingPending ||
        noFollowEntry(pendingTemporary) ||
        !pendingPublishMatches(existingPending, output, manifest, inventory) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingRetainedAssetsMatchCurrentState(state, existingPending)
      ) {
        fail("publish output already exists without an exact pending transaction");
      }
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        ownerInspector,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the journaled candidate");
      }
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    }
    if (existingPending) {
      if (
        !pendingPublishIdentityMatches(existingPending, output, manifest) ||
        !pendingInventoryMatchesCandidate(existingPending, manifest) ||
        !pendingPriorStateMatchesCurrentState(state, existingPending)
      ) {
        fail("static publish pending journal has no matching pre-output transaction");
      }
      const temporary = join(parent, existingPending.transactionId);
      const prefix = `.${basename(output)}.publish-`;
      const related = requireDirectoryNames(parent).filter((name) => name.startsWith(prefix));
      if (related.length !== 1 || related[0] !== existingPending.transactionId) {
        fail("static publish pending journal has ambiguous temporary state");
      }
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
      renameSync(temporary, output);
      invokeDurability(options, "rename-output", output);
      syncDirectory(parent, options);
      fault(options, "after-output");
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        ownerInspector,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
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
    let journalWritten = false;
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
      const pending = {
        schemaVersion: SCHEMA_VERSION,
        output,
        transactionId: basename(temporary),
        releaseId: manifest.releaseId,
        manifestSha256: manifestDigest(manifest),
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
      journalWritten = true;
      fault(options, "crash-before-output-rename");
      fault(options, "before-output-rename");
      renameSync(temporary, output);
      renamed = true;
      invokeDurability(options, "rename-output", output);
      syncDirectory(parent, options);
      fault(options, "after-output");
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        ownerInspector,
        projectKey,
        onLockOperation,
        diagnosticHost,
        lockHeld: true,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the candidate");
      }
      fault(options, "before-publish-journal-clear");
      clearPendingPublish(state, options);
      return staged;
    } finally {
      const simulatedPreRenameCrash = faultAt === "crash-before-output-rename";
      if (!renamed && !simulatedPreRenameCrash && existsSync(temporary)) {
        rmSync(temporary, { recursive: true, force: true });
      }
      // The journal may survive only after the final output becomes observable.
      // A pre-rename failure is not resumable and must not poison a future run.
      if (!renamed && !simulatedPreRenameCrash && journalWritten) {
        clearPendingPublish(state, undefined);
      }
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
