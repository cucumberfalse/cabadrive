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
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const RELEASE_MARKER = ".release-state.json";
const RETAINED_INVENTORY = "retained-assets.json";
const LEGACY_HANDOFF_MARKER = ".legacy-handoff.json";
const LEGACY_SOURCE_KIND = "baked-legacy-root";
const PUBLISH_PENDING = "publish-pending.json";
const ASSET_PROMOTION_PENDING = "retained-assets-pending.json";

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

function acquireLock(state) {
  const lock = join(state, "stage.lock");
  let descriptor;
  try {
    descriptor = openSync(lock, "wx", 0o600);
    writeFileSync(descriptor, `${process.pid}\n`);
    fsyncSync(descriptor);
  } catch (error) {
    if (error?.code === "EEXIST") fail("another stage holds the exclusive lock");
    throw error;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
  return () => {
    if (existsSync(lock)) rmSync(lock, { force: true });
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
  const kind = requireLegacySource(sourceKind, "legacy source kind");
  if (kind !== LEGACY_SOURCE_KIND) fail(`unsupported legacy source kind ${JSON.stringify(kind)}`);
  return {
    schemaVersion: SCHEMA_VERSION,
    sourceId: requireLegacySource(sourceId, "legacy source id"),
    sourceKind: kind,
    assets: inventoryForAssets(root, "legacy handoff assets"),
  };
}

export function writeLegacyHandoffManifest({ legacyRoot, sourceId, sourceKind, faultAt } = {}) {
  const root = realpathSync(legacyRoot);
  const manifest = createLegacyHandoffManifest({ legacyRoot: root, sourceId, sourceKind });
  const temporary = join(root, `${LEGACY_HANDOFF_MARKER}.next-${process.pid}-${randomUUID()}`);
  writeFileSync(join(root, "source-id"), `${manifest.sourceId}\n`);
  writeFileSync(join(root, "source-kind"), `${manifest.sourceKind}\n`);
  // This point is deliberately injectable so the capture wrapper can prove a
  // half-written handoff never becomes authoritative.
  if (faultAt === "legacy-marker-write") fail("fault injection at legacy marker write");
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(temporary, join(root, LEGACY_HANDOFF_MARKER));
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

function promoteFiles(from, to, inventory, options, { sourceRoot, destinationRoot }) {
  for (const entry of inventory) {
    const source = join(from, ...entry.path.split("/"));
    const destination = join(to, ...entry.path.split("/"));
    if (existsSync(destination)) {
      if (!equalEntry(sha256(destination), entry))
        fail(`immutable asset collision at ${entry.path}`);
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
  lockHeld = false,
} = {}) {
  if (!stateRoot || !candidateRoot) fail("--state and --candidate are required");
  const state = ensureStateLayout(stateRoot);
  const release = createCandidateManifest(candidateRoot);
  const releaseDir = join(state, "releases", release.releaseId);
  const metadataPath = join(state, "metadata", `${release.releaseId}.json`);
  const unlock = lockHeld ? () => {} : acquireLock(state);
  const transaction = join(state, "transactions", `${release.releaseId}-${randomUUID()}`);
  try {
    const candidate = realpathSync(candidateRoot);
    const existing = inventoryForAssets(state, "retained assets");
    const suppliedLegacyRoot = legacyRoot ? resolve(legacyRoot) : undefined;
    const hasLegacyAssets = suppliedLegacyRoot && existsSync(join(suppliedLegacyRoot, "assets"));
    const legacyValidation = hasLegacyAssets ? verifyLegacyHandoff(suppliedLegacyRoot) : undefined;
    if (legacyValidation && !legacyValidation.valid) {
      fail(`legacy handoff is not authoritative: ${legacyValidation.reason}`);
    }
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
      { sourceRoot: transaction, destinationRoot: state },
    );
    if (!sameEntries(inventoryForAssets(state, "retained assets"), expectedRetained)) {
      fail("promoted retained assets do not match cumulative inventory");
    }
    if (!assetPromotionRecovery?.ledgerIsExpected) {
      writeRetainedInventory(state, expectedRetained, { faultAt, onDurabilityOperation });
    }
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

function pendingPublishMatches(pending, output, release, inventory) {
  return (
    pending?.schemaVersion === SCHEMA_VERSION &&
    pending.output === output &&
    typeof pending.transactionId === "string" &&
    pending.transactionId.startsWith(".") &&
    pending.releaseId === release.releaseId &&
    pending.manifestSha256 === manifestDigest(release) &&
    typeof pending.retainedAssetsSha256 === "string" &&
    sameEntries(pending.inventory || [], inventory)
  );
}

function pendingRetainedAssetsMatchCurrentState(state, pending) {
  const ledger = readRetainedInventory(state);
  if (!ledger) return false;
  const retained = inventoryForAssets(state, "retained assets");
  return (
    sameEntries(ledger, retained) &&
    pending.retainedAssetsSha256 === manifestDigest(retainedInventoryPayload(ledger))
  );
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
    // This is the retained namespace that existed before B activation.  It
    // permits an exact B retry while A remains committed, but becomes stale as
    // soon as any independent C promotion changes the ledger or asset walk.
    retainedAssetsSha256: manifestDigest(retainedInventoryPayload(existing)),
  };
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
} = {}) {
  if (!stateRoot || !candidateRoot || !outputRoot)
    fail("--state, --candidate and --output are required");
  const state = ensureStateLayout(stateRoot);
  const output = resolve(outputRoot);
  const candidateRootReal = realpathSync(candidateRoot);
  const manifest = createCandidateManifest(candidateRootReal);
  const candidate = { root: candidateRootReal, manifest };
  const options = { faultAt, onDurabilityOperation };
  const existingPending = readPendingPublish(state);
  const unlock = acquireLock(state);

  try {
    if (existsSync(output)) {
      const inventory = outputInventory(output);
      if (
        !existingPending ||
        !pendingPublishMatches(existingPending, output, manifest, inventory) ||
        !pendingRetainedAssetsMatchCurrentState(state, existingPending)
      ) {
        fail("publish output already exists without an exact pending transaction");
      }
      const staged = stageStaticRelease({
        stateRoot: state,
        candidateRoot: candidateRootReal,
        faultAt,
        onDurabilityOperation,
        lockHeld: true,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the journaled candidate");
      }
      clearPendingPublish(state, options);
      return staged;
    }
    if (existingPending) fail("static publish pending journal has no matching output");

    const parent = dirname(output);
    assertDirectory(parent, "static publish output parent");
    const temporary = join(parent, `.${basename(output)}.publish-${process.pid}-${randomUUID()}`);
    let renamed = false;
    let journalWritten = false;
    try {
      mkdirSync(temporary, { recursive: false, mode: 0o755 });
      const { inventory, retainedAssetsSha256 } = copyPublishTree({
        state,
        candidate,
        temporary,
        options,
      });
      const pending = {
        schemaVersion: SCHEMA_VERSION,
        output,
        transactionId: basename(temporary),
        releaseId: manifest.releaseId,
        manifestSha256: manifestDigest(manifest),
        retainedAssetsSha256,
        inventory,
      };
      writeAtomically(
        state,
        publishPendingPath(state),
        `${JSON.stringify(pending, null, 2)}\n`,
        options,
      );
      journalWritten = true;
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
        lockHeld: true,
      });
      if (staged.releaseId !== manifest.releaseId || !verifyCommittedState(state).valid) {
        fail("static publish activation did not commit the candidate");
      }
      clearPendingPublish(state, options);
      return staged;
    } finally {
      if (!renamed && existsSync(temporary)) rmSync(temporary, { recursive: true, force: true });
      // The journal may survive only after the final output becomes observable.
      // A pre-rename failure is not resumable and must not poison a future run.
      if (!renamed && journalWritten) clearPendingPublish(state, undefined);
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
