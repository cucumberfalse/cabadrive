import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
  chmodSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  publicSeed,
  prepareNativeOutputs,
  nativeOutputMounts,
  candidateVolumeMount,
  probeNativeOutputs,
  assertNativeCandidateUnchanged,
  nativeOutputCaps,
} from "../scripts/docker-image-fixture-outputs.mjs";
import { checkpointInventory } from "../scripts/docker-image-checkpoint.mjs";

test("public seed binds only complete frozen included regular0644 inputs; tampering and overflow fail", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-public-seed-"));
  try {
    mkdirSync(join(root, "public/content"), { recursive: true });
    writeFileSync(join(root, "public/sw.js"), "tracked", { mode: 0o644 });
    writeFileSync(join(root, "public/content/ignored"), "generated");
    const inventory = checkpointInventory(root),
      seed = publicSeed(root, inventory);
    assert.deepEqual(
      seed.records.map((record) => record.path),
      ["sw.js"],
    );
    assert.equal(Buffer.from(seed.records[0].data, "base64").toString(), "tracked");
    writeFileSync(join(root, "public/sw.js"), "changed");
    assert.throws(() => publicSeed(root, inventory), /hash drift/);
    writeFileSync(join(root, "public/sw.js"), "tracked");
    chmodSync(join(root, "public/sw.js"), 0o600);
    assert.throws(() => publicSeed(root, inventory), /mode drift/);
    chmodSync(join(root, "public/sw.js"), 0o644);
    writeFileSync(join(root, "public/sw.js"), "x".repeat(1024 ** 2 + 1));
    assert.throws(() => publicSeed(root, checkpointInventory(root)), /exceeds1MiB/);
    assert.throws(() => publicSeed(root, Array(101).fill(inventory[0])), /exceeds100/);
    assert.throws(() => publicSeed(root, [{ ...inventory[0], path: "public/../escape" }]));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("native output creators require absent exact labelled volumes, nocopy and empty roots before ownership or byte seed", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-native-outputs-"));
  try {
    mkdirSync(join(root, "public"));
    writeFileSync(join(root, "public/sw.js"), "tracked", { mode: 0o644 });
    mkdirSync(join(root, "public/nested"));
    writeFileSync(join(root, "public/nested/seed.js"), "nested", { mode: 0o644 });
    const commands = [],
      created = new Set(),
      volumes = [];
    let seedPayload, initPayload, seedInput;
    const docker = (args, options = {}) => {
      commands.push(args);
      if (args[0] === "volume" && args[1] === "inspect")
        return created.has(args[2])
          ? {
              status: 0,
              stdout: JSON.stringify([
                { Name: args[2], Labels: { "com.cabadrive.image-pipeline-test": "owned" } },
              ]),
            }
          : { status: 1, stdout: "" };
      if (args[0] === "volume" && args[1] === "create") {
        created.add(args.at(-1));
        return { status: 0, stdout: args.at(-1) };
      }
      assert.equal(args[0], "run");
      for (const mount of args.filter((arg) => arg.startsWith("type=volume")))
        assert(mount.includes("volume-nocopy"));
      const payload = args[args.indexOf("-e") + 1];
      const checked = spawnSync(process.execPath, ["--input-type=module", "--check"], {
        input: payload,
        encoding: "utf8",
      });
      assert.equal(checked.status, 0, checked.stderr);
      if (options.input) {
        seedPayload = payload;
        seedInput = options.input;
        return {
          status: 0,
          stdout: JSON.stringify(
            JSON.parse(options.input).map(({ path, bytes, sha256 }) => ({ path, bytes, sha256 })),
          ),
        };
      }
      initPayload = payload;
      return { status: 0, stdout: "" };
    };
    const output = prepareNativeOutputs({
      docker,
      context: root,
      image: "owned-image",
      token: "owned",
      volumes,
      uid: process.getuid(),
      gid: process.getgid(),
    });
    assert.deepEqual(volumes, ["owned-public", "owned-dist"]);
    assert.equal(
      candidateVolumeMount(output),
      "type=volume,source=owned-dist,target=/candidate,readonly,volume-nocopy",
    );
    assert.equal(nativeOutputMounts(output).filter((arg) => arg === "--mount").length, 2);
    assert(seedPayload && initPayload);
    assert(!seedPayload.includes("chmodSync") && !seedPayload.includes("chownSync"));
    const publicRoot = join(root, "native-public"),
      distRoot = join(root, "native-dist");
    mkdirSync(publicRoot);
    mkdirSync(distRoot);
    const paths = (code) =>
      code
        .replaceAll("/app/public", publicRoot)
        .replaceAll("/app/dist", distRoot)
        .replaceAll("'/app'", JSON.stringify(root));
    const synthetic = [
      `1 0 0:1 / ${publicRoot} rw - ext4 /dev/vda rw`,
      `2 0 0:1 / ${distRoot} rw - ext4 /dev/vda rw`,
    ].join("\n");
    const emittedInit = paths(initPayload).replace(
      "readFileSync('/proc/self/mountinfo','utf8')",
      JSON.stringify(synthetic),
    );
    writeFileSync(join(publicRoot, "foreign"), "must refuse adoption");
    const refused = spawnSync(process.execPath, ["--input-type=module", "-e", emittedInit], {
      encoding: "utf8",
    });
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /fresh nocopy output root must be empty/);
    rmSync(join(publicRoot, "foreign"));
    const initialized = spawnSync(process.execPath, ["--input-type=module", "-e", emittedInit], {
      encoding: "utf8",
    });
    assert.equal(initialized.status, 0, initialized.stderr);
    const seeded = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", "process.umask(0o002);" + paths(seedPayload)],
      {
        input: seedInput,
        encoding: "utf8",
      },
    );
    assert.equal(seeded.status, 0, seeded.stderr);
    assert.equal(readFileSync(join(publicRoot, "sw.js"), "utf8"), "tracked");
    assert.equal(readFileSync(join(publicRoot, "nested/seed.js"), "utf8"), "nested");
    assert.deepEqual(readdirSync(distRoot), []);
    const reseed = spawnSync(
      process.execPath,
      ["--input-type=module", "-e", "process.umask(0o002);" + paths(seedPayload)],
      {
        input: seedInput,
        encoding: "utf8",
      },
    );
    assert.notEqual(reseed.status, 0, "nonempty root cannot be reseeded");
    const previous = () =>
      prepareNativeOutputs({
        docker: () => ({ status: 0, stdout: "" }),
        context: root,
        image: "owned-image",
        token: "foreign",
        volumes: [],
        uid: process.getuid(),
        gid: process.getgid(),
      });
    assert.throws(previous, /already exists/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("actual emitted native inventory reads bytes/modes and rejects candidate mutation and output allocation overflow", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-native-candidate-"));
  try {
    mkdirSync(join(root, "public"));
    mkdirSync(join(root, "dist"));
    writeFileSync(join(root, "public/sw.js"), "public", { mode: 0o644 });
    writeFileSync(join(root, "dist/index.html"), "first", { mode: 0o644 });
    const boundary =
      "content/assets/learning/generated/v1/topic-learning-adverse-weather-and-visibility-1.svg";
    for (const prefix of ["", "public/", "dist/"]) {
      const path = join(root, prefix + boundary);
      mkdirSync(join(path, ".."), { recursive: true });
      writeFileSync(path, "canonical", { mode: 0o644 });
    }
    const run = (args) => {
      const code = args.at(-1).replaceAll("'/app/'", JSON.stringify(root + "/"));
      const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], {
        encoding: "utf8",
      });
      if (result.status !== 0) throw new Error(result.stderr);
      return result;
    };
    const before = probeNativeOutputs(run);
    assert.equal(before.dist.files.length, 2);
    assert(before.dist.allocatedBytes > 0);
    assertNativeCandidateUnchanged(run, before.dist);
    const denied = join(root, "public", boundary);
    rmSync(denied);
    assert.throws(() => probeNativeOutputs(run), /ENOENT/);
    writeFileSync(denied, "wrong", { mode: 0o644 });
    assert.throws(() => probeNativeOutputs(run), /exact canonical bytes/);
    writeFileSync(denied, "canonical");
    chmodSync(denied, 0o200);
    assert.throws(() => probeNativeOutputs(run), /formerly denied SVG mode/);
    chmodSync(denied, 0o644);
    assert.equal(probeNativeOutputs(run).public.boundaryProof.readable, true);
    writeFileSync(join(root, "dist/index.html"), "second");
    assert.throws(
      () => assertNativeCandidateUnchanged(run, before.dist),
      /native candidate changed/,
    );
    chmodSync(join(root, "dist/index.html"), 0o200);
    assert.throws(() => probeNativeOutputs(run), /output must be readable/);
    chmodSync(join(root, "dist/index.html"), 0o644);
    const cap = nativeOutputCaps.public;
    try {
      nativeOutputCaps.public = 1;
      assert.throws(() => probeNativeOutputs(run), /public output allocation exceeds/);
    } finally {
      nativeOutputCaps.public = cap;
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
