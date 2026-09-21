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
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SCHEMA_VERSION = 1;
const RELEASE_MARKER = ".release-state.json";
const LEGACY_HANDOFF_MARKER = ".legacy-handoff.json";
const LEGACY_SOURCE_KIND = "baked-legacy-root";

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

export function writeLegacyHandoffManifest({ legacyRoot, sourceId, sourceKind } = {}) {
  const root = realpathSync(legacyRoot);
  const manifest = createLegacyHandoffManifest({ legacyRoot: root, sourceId, sourceKind });
  const temporary = join(root, `${LEGACY_HANDOFF_MARKER}.next-${process.pid}-${randomUUID()}`);
  writeFileSync(join(root, "source-id"), `${manifest.sourceId}\n`);
  writeFileSync(join(root, "source-kind"), `${manifest.sourceKind}\n`);
  writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(temporary, join(root, LEGACY_HANDOFF_MARKER));
  return manifest;
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

function copyAndVerify(source, destination, expected) {
  mkdirSync(dirname(destination), { recursive: true, mode: 0o755 });
  copyFileSync(source, destination);
  const actual = sha256(destination);
  if (!equalEntry(actual, expected)) fail(`staged digest mismatch: ${destination}`);
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

function copyInventory(candidateRoot, inventory, target, sourceFor) {
  for (const entry of inventory) {
    copyAndVerify(
      sourceFor(candidateRoot, entry.path),
      join(target, ...entry.path.split("/")),
      entry,
    );
  }
}

function promoteFiles(from, to, inventory) {
  for (const entry of inventory) {
    const source = join(from, ...entry.path.split("/"));
    const destination = join(to, ...entry.path.split("/"));
    if (existsSync(destination)) {
      if (!equalEntry(sha256(destination), entry))
        fail(`immutable asset collision at ${entry.path}`);
      continue;
    }
    mkdirSync(dirname(destination), { recursive: true, mode: 0o755 });
    renameSync(source, destination);
  }
}

function makeCurrent(state, releaseId) {
  const current = join(state, "current");
  const next = join(state, `current.next-${process.pid}-${randomUUID()}`);
  symlinkSync(join("releases", releaseId), next);
  renameSync(next, current);
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

function assetsMatch(state, release) {
  const retained = inventoryForAssets(state, "retained assets");
  const byPath = new Map(retained.map((entry) => [entry.path, entry]));
  return release.assets.every((entry) => equalEntry(byPath.get(entry.path) || {}, entry));
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

function writeMetadataAtomically(state, path, release, legacySource) {
  const temporary = join(state, `metadata.next-${process.pid}-${randomUUID()}.json`);
  writeFileSync(temporary, `${JSON.stringify({ ...release, legacySource }, null, 2)}\n`);
  renameSync(temporary, path);
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

export function stageStaticRelease({ stateRoot, candidateRoot, legacyRoot, faultAt } = {}) {
  if (!stateRoot || !candidateRoot) fail("--state and --candidate are required");
  const state = ensureStateLayout(stateRoot);
  const release = createCandidateManifest(candidateRoot);
  const releaseDir = join(state, "releases", release.releaseId);
  const metadataPath = join(state, "metadata", `${release.releaseId}.json`);
  const unlock = acquireLock(state);
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

    // Do this before the complete-release shortcut: a handoff can arrive after
    // the candidate was first staged, and immutable A bytes are still owed.
    mkdirSync(transaction, { recursive: true, mode: 0o755 });
    const transactionAssets = join(transaction, "assets");
    const transactionRelease = join(transaction, "release");
    mkdirSync(transactionAssets, { recursive: true, mode: 0o755 });
    mkdirSync(transactionRelease, { recursive: true, mode: 0o755 });
    fault({ faultAt }, "after-validation");
    if (legacy.length) {
      copyInventory(suppliedLegacyRoot, legacy, transactionAssets, sourceAsset);
    }
    copyInventory(candidate, release.assets, transactionAssets, sourceAsset);
    fault({ faultAt }, "during-assets");
    promoteFiles(transactionAssets, join(state, "assets"), [...legacy, ...release.assets]);
    fault({ faultAt }, "after-assets");

    if (existsSync(releaseDir) && existsSync(metadataPath)) {
      if (
        !metadataMatches(metadataPath, release) ||
        !releaseFilesMatch(releaseDir, release) ||
        !assetsMatch(state, release)
      ) {
        fail("existing complete release is not a verified committed tuple");
      }
      makeCurrent(state, release.releaseId);
      return { changed: false, releaseId: release.releaseId, manifest: release };
    }
    if (existsSync(releaseDir)) {
      if (!releaseFilesMatch(releaseDir, release) || !assetsMatch(state, release)) {
        fail("existing release-only partial state does not match candidate");
      }
      writeMetadataAtomically(state, metadataPath, release, legacySource);
      fault({ faultAt }, "before-current");
      makeCurrent(state, release.releaseId);
      return { changed: true, releaseId: release.releaseId, manifest: release };
    }
    if (existsSync(metadataPath) && !metadataMatches(metadataPath, release)) {
      fail("existing metadata-only partial state does not match candidate");
    }

    copyInventory(candidate, release.mutable, transactionRelease, sourceMutable);
    const stagedMutable = walkRegularFiles(transactionRelease, "transaction release");
    if (!sameEntries(stagedMutable, release.mutable))
      fail("transaction mutable inventory is incomplete");
    fault({ faultAt }, "during-mutable");
    writeFileSync(
      join(transactionRelease, RELEASE_MARKER),
      `${JSON.stringify(markerForRelease(release), null, 2)}\n`,
    );
    if (!releaseFilesMatch(transactionRelease, release)) {
      fail("transaction release marker/tree does not match candidate");
    }
    writeFileSync(
      join(transaction, "manifest.json"),
      `${JSON.stringify({ ...release, legacySource }, null, 2)}\n`,
    );
    renameSync(transactionRelease, releaseDir);
    fault({ faultAt }, "after-release");
    if (!existsSync(metadataPath)) {
      renameSync(join(transaction, "manifest.json"), metadataPath);
    }
    if (!metadataMatches(metadataPath, release) || !releaseFilesMatch(releaseDir, release)) {
      fail("promoted release tuple does not match candidate");
    }
    fault({ faultAt }, "before-current");
    makeCurrent(state, release.releaseId);
    return { changed: true, releaseId: release.releaseId, manifest: release };
  } finally {
    if (existsSync(transaction)) rmSync(transaction, { recursive: true, force: true });
    unlock();
  }
}

export function buildStaticPublish({ stateRoot, candidateRoot, outputRoot }) {
  if (!outputRoot) fail("--output is required");
  const output = resolve(outputRoot);
  if (existsSync(output)) fail("publish output already exists; refusing destructive replacement");
  const staged = stageStaticRelease({ stateRoot, candidateRoot });
  const state = resolve(stateRoot);
  mkdirSync(output, { recursive: true, mode: 0o755 });
  const release = join(state, readlinkSync(join(state, "current")));
  for (const entry of walkRegularFiles(join(state, "assets"), "retained assets")) {
    copyAndVerify(
      join(state, "assets", ...entry.path.split("/")),
      join(output, "assets", ...entry.path.split("/")),
      entry,
    );
  }
  for (const entry of walkRegularFiles(release, "current release")) {
    copyAndVerify(
      join(release, ...entry.path.split("/")),
      join(output, ...entry.path.split("/")),
      entry,
    );
  }
  return staged;
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
              })
            : command === "legacy-verify"
              ? verifyLegacyHandoff(values.legacy)
              : fail(`unknown command ${command}`);
  if (command === "verify" || command === "legacy-verify") {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!result.valid) process.exitCode = 1;
  } else if (command === "legacy-write") {
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
