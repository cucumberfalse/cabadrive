import assert from "node:assert/strict";
import { createHash, createHmac, randomBytes } from "node:crypto";
import {
  closeSync,
  existsSync,
  lstatSync,
  openSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";

export const checkpointExcluded = [
  ".git",
  ".cache",
  ".claude",
  ".omc",
  ".cabadrive-release-handoff",
  "node_modules",
  "dist",
  "public/content",
  "playwright-report",
  "test-results",
];
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const checkpointDigest = (value) => hash(JSON.stringify(value));
const digest = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const phases = ["production", "negative"];

export function checkpointOptions(args) {
  const options = {};
  while (args.length) {
    const flag = args.shift();
    assert(["--checkpoint-after", "--resume"].includes(flag), `unknown checkpoint option ${flag}`);
    const key = flag === "--resume" ? "resume" : "after";
    assert(!options[key] && args.length, `missing/duplicate ${flag}`);
    options[key] = args.shift();
  }
  if (options.after) assert(phases.includes(options.after), "invalid checkpoint boundary");
  return options;
}

// Includes every copied input, including documentation and validation evidence.
// Only the same explicitly excluded generated/private paths as the driver vanish.
export function checkpointInventory(directory) {
  const entries = [];
  const walk = (prefix = "") => {
    for (const name of readdirSync(join(directory, prefix)).sort()) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (
        checkpointExcluded.some((excluded) => path === excluded || path.startsWith(`${excluded}/`))
      )
        continue;
      const stat = lstatSync(join(directory, path));
      assert(!stat.isSymbolicLink(), `checkpoint input symlink ${path}`);
      if (stat.isDirectory()) walk(path);
      else {
        assert(
          stat.isFile() && stat.nlink === 1,
          `checkpoint input is not an independent regular file ${path}`,
        );
        entries.push({
          path,
          bytes: stat.size,
          mode: stat.mode & 0o777,
          sha256: hash(readFileSync(join(directory, path))),
        });
      }
    }
  };
  walk();
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

export function checkpointPaths(path) {
  const receiptPath = resolve(path);
  const temporary = dirname(receiptPath);
  assert.equal(basename(receiptPath), "checkpoint.json", "unexpected receipt name");
  assert(
    /^cabadrive-docker-images-[a-zA-Z0-9]+$/.test(basename(temporary)),
    "foreign checkpoint directory",
  );
  assert.equal(
    dirname(temporary),
    realpathSync(tmpdir()),
    "checkpoint outside creator temporary namespace",
  );
  assert.equal(realpathSync(temporary), temporary, "checkpoint directory symlink");
  assert.equal(
    realpathSync(join(temporary, "context")),
    join(temporary, "context"),
    "checkpoint context symlink",
  );
  const allowed = new Set([
    "context",
    "checkpoint.json",
    "input-inventory.json",
    "production-predicate.json",
    "production-builds.json",
    "negative-predicate.json",
    "checkpoint.lock",
    "missing-docker-probe",
    "empty-path",
  ]);
  assert(
    readdirSync(temporary).every((name) => allowed.has(name)),
    "unknown retained creator files",
  );
  const parent = lstatSync(temporary);
  assert(
    parent.isDirectory() && parent.uid === process.getuid() && (parent.mode & 0o077) === 0,
    "checkpoint directory must be creator-private",
  );
  const stat = lstatSync(receiptPath);
  assert(
    stat.isFile() && stat.nlink === 1 && stat.uid === process.getuid() && (stat.mode & 0o077) === 0,
    "checkpoint receipt must be creator-private",
  );
  return { temporary, context: join(temporary, "context"), receiptPath };
}

function evidence(directory, name, expected) {
  assert(digest(expected), `invalid ${name} digest`);
  const path = join(directory, name);
  const stat = lstatSync(path);
  assert(
    stat.isFile() && stat.nlink === 1 && stat.uid === process.getuid() && (stat.mode & 0o077) === 0,
    `unsafe ${name}`,
  );
  const bytes = readFileSync(path);
  assert.equal(hash(bytes), expected, `changed checkpoint ${name}`);
  return JSON.parse(bytes);
}

export function readCheckpoint(path, root, inspectImage) {
  const paths = checkpointPaths(path);
  const receipt = JSON.parse(readFileSync(paths.receiptPath));
  assert.equal(receipt.schemaVersion, 1);
  assert.equal(receipt.status, "PARTIAL");
  assert(phases.includes(receipt.completed), "no completed checkpoint phase");
  assert(/^cabadrive-images-\d+-\d+$/.test(receipt.token), "invalid creator token");
  assert.equal(receipt.uid, process.getuid());
  assert.equal(receipt.root, realpathSync(root), "foreign source repository");
  assert.equal(receipt.temporary, paths.temporary, "foreign creator context");
  const sealKeyPath = join(root, ".cache/image-qa/checkpoint-keys", `${receipt.token}.key`);
  const keyStat = lstatSync(sealKeyPath);
  assert(
    keyStat.isFile() &&
      keyStat.nlink === 1 &&
      keyStat.uid === process.getuid() &&
      (keyStat.mode & 0o077) === 0,
  );
  assert.equal(realpathSync(sealKeyPath), sealKeyPath, "checkpoint seal key symlink");
  const { seal, ...unsealed } = receipt;
  assert(digest(seal));
  const key = readFileSync(sealKeyPath);
  assert.equal(key.length, 32);
  assert.equal(
    createHmac("sha256", key).update(JSON.stringify(unsealed)).digest("hex"),
    seal,
    "tampered creator receipt seal",
  );
  assert(digest(receipt.inputSha256));
  const inventory = evidence(paths.temporary, "input-inventory.json", receipt.inventoryFileSha256);
  assert.equal(checkpointDigest(inventory), receipt.inputSha256);
  assert.deepEqual(
    checkpointInventory(root),
    inventory,
    "stale source context (including process/docs)",
  );
  assert.deepEqual(checkpointInventory(paths.context), inventory, "tampered retained context");
  const expectedImages = Object.fromEntries(
    ["prepare", "stager", "runtime"].map((stage) => [stage, `${receipt.token}-${stage}`]),
  );
  assert.deepEqual(receipt.images, expectedImages, "foreign image tags");
  assert.deepEqual(Object.keys(receipt.imageInspections).sort(), ["prepare", "stager"]);
  for (const stage of ["prepare", "stager"]) {
    const actual = inspectImage(expectedImages[stage]);
    assert.equal(
      actual.Config?.Labels?.["com.cabadrive.image-pipeline-test"],
      receipt.token,
      "foreign retained image creator",
    );
    assert.equal(
      actual.Config?.Labels?.["com.cabadrive.image-pipeline-input"],
      receipt.inputSha256,
      "stale retained image input",
    );
    assert.equal(
      actual.Config?.Labels?.["com.cabadrive.image-pipeline-context"],
      checkpointDigest(paths.temporary),
      "foreign retained image context path",
    );
    assert(/^sha256:[a-f0-9]{64}$/.test(actual.Id), "invalid retained image identity");
    assert.deepEqual(
      actual,
      receipt.imageInspections[stage],
      "changed retained image configuration/identity",
    );
  }
  const production = evidence(
    paths.temporary,
    "production-predicate.json",
    receipt.productionFileSha256,
  );
  assert.equal(production.exit, 0);
  assert.equal(hash(production.stdout), production.stdoutSha256);
  assert.equal(hash(production.stderr), production.stderrSha256);
  assert.deepEqual(JSON.parse(production.stdout), production.result);
  assert.equal(production.inputSha256, receipt.inputSha256);
  assert.equal(production.imageId, receipt.imageInspections.stager.Id);
  assert.equal(production.result.status, "PRODUCTION_PAYLOAD_PASS");
  assert.equal(production.result.productionSources, 275);
  assert.equal(production.result.variants, 3321);
  assert(Array.isArray(production.result.inventory) && production.result.inventory.length >= 3321);
  assert.equal(checkpointDigest(production.result), production.resultSha256);
  const builds = evidence(paths.temporary, "production-builds.json", receipt.buildsFileSha256);
  assert.deepEqual(
    builds.map((build) => build.target),
    ["image-pipeline-fixture-tools", "stager"],
  );
  for (const build of builds) {
    assert.equal(build.exit, 0);
    assert(digest(build.stdoutSha256) && digest(build.stderrSha256));
    assert.equal(hash(build.stdout), build.stdoutSha256);
    assert.equal(hash(build.stderr), build.stderrSha256);
  }
  if (receipt.completed === "negative") {
    const negative = evidence(
      paths.temporary,
      "negative-predicate.json",
      receipt.negativeFileSha256,
    );
    assert.equal(negative.inputSha256, receipt.inputSha256);
    assert(Number.isInteger(negative.exit) && negative.exit !== 0);
    assert.match(`${negative.stdout}\n${negative.stderr}`, /ENOENT[^\n]*content\/assets-masters/);
    assert.equal(hash(negative.stdout), negative.stdoutSha256);
    assert.equal(hash(negative.stderr), negative.stderrSha256);
    assert(negative.filteredBytes <= 0.75 * 1024 ** 3 && negative.filteredBytes > 0);
  }
  return { ...paths, receipt, inventory, production, builds, sealKeyPath };
}

export function writeCheckpoint({
  temporary,
  root,
  token,
  images,
  inventory,
  imageInspections,
  production,
  builds,
  negative,
}) {
  const save = (name, value) => {
    const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
    writeFileSync(join(temporary, name), bytes, { mode: 0o600 });
    return hash(bytes);
  };
  const receipt = {
    schemaVersion: 1,
    status: "PARTIAL",
    completed: negative ? "negative" : "production",
    createdAt: new Date().toISOString(),
    uid: process.getuid(),
    root: realpathSync(root),
    temporary,
    token,
    images,
    inputSha256: checkpointDigest(inventory),
    imageInspections,
    inventoryFileSha256: save("input-inventory.json", inventory),
    productionFileSha256: save("production-predicate.json", production),
    buildsFileSha256: save("production-builds.json", builds),
    ...(negative ? { negativeFileSha256: save("negative-predicate.json", negative) } : {}),
  };
  const keyDirectory = join(root, ".cache/image-qa/checkpoint-keys");
  mkdirSync(keyDirectory, { recursive: true, mode: 0o700 });
  assert.equal(realpathSync(keyDirectory), keyDirectory, "checkpoint key directory symlink");
  const sealKeyPath = join(keyDirectory, `${token}.key`);
  if (!existsSync(sealKeyPath))
    writeFileSync(sealKeyPath, randomBytes(32), { flag: "wx", mode: 0o600 });
  const keyStat = lstatSync(sealKeyPath);
  assert(
    keyStat.isFile() &&
      keyStat.nlink === 1 &&
      keyStat.uid === process.getuid() &&
      (keyStat.mode & 0o077) === 0,
  );
  assert.equal(realpathSync(sealKeyPath), sealKeyPath);
  const key = readFileSync(sealKeyPath);
  receipt.seal = createHmac("sha256", key).update(JSON.stringify(receipt)).digest("hex");
  const path = join(temporary, "checkpoint.json");
  writeFileSync(path, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o600 });
  return { path, receipt, sealKeyPath };
}

export function lockCheckpoint(temporary) {
  const path = join(temporary, "checkpoint.lock");
  const descriptor = openSync(path, "wx", 0o600);
  writeFileSync(descriptor, `${process.pid}\n`);
  closeSync(descriptor);
  return () => rmSync(path, { force: true });
}
