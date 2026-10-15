import { copyDockerTestScripts } from "./copy-docker-test-scripts.mjs";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import {
  installedPackageInventory,
  linuxFixtureArguments,
  prepareLinuxFixtureDependencies,
  viteTemporaryCap,
} from "../scripts/docker-image-fixture-dependencies.mjs";

test("installed identity detects package and symlink tampering but excludes only the declared temporary boundary", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-installed-identity-"));
  try {
    mkdirSync(join(root, "package"));
    writeFileSync(join(root, "package/package.json"), "original");
    symlinkSync("package", join(root, "link"));
    const original = installedPackageInventory(root);
    mkdirSync(join(root, ".vite-temp"));
    writeFileSync(join(root, ".vite-temp/config.mjs"), "temporary");
    assert.deepEqual(installedPackageInventory(root), original);
    writeFileSync(join(root, "package/package.json"), "tampered");
    assert.notDeepEqual(installedPackageInventory(root), original);
    writeFileSync(join(root, "package/package.json"), "original");
    rmSync(join(root, "link"));
    symlinkSync(".vite-temp", join(root, "link"));
    assert.notDeepEqual(installedPackageInventory(root), original);
    mkdirSync(join(root, "package/.vite-temp"));
    writeFileSync(join(root, "package/.vite-temp/package-data"), "cannot be excluded");
    assert(
      installedPackageInventory(root).some(
        (entry) => entry.path === "package/.vite-temp/package-data",
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("every emitted Linux node-e payload parses as an ES module, including mountinfo newline escapes", () => {
  const temporary = mkdtempSync(join(tmpdir(), "cabadrive-linux-payload-syntax-"));
  const payloads = new Set();
  try {
    const createdVolumes = new Set();
    const docker = (args) => {
      if (args[0] === "volume" && args[1] === "create") {
        createdVolumes.add(args.at(-1));
        return { status: 0, stdout: args.at(-1) };
      }
      if (args[0] === "volume" && args[1] === "inspect")
        return createdVolumes.has(args[2])
          ? {
              status: 0,
              stdout: JSON.stringify([
                {
                  Name: args[2],
                  Labels: { "com.cabadrive.image-pipeline-test": "syntax-fixture" },
                },
              ]),
            }
          : { status: 1, stdout: "" };
      const index = args.indexOf("-e");
      if (index !== -1) {
        const payload = args[index + 1];
        payloads.add(payload);
        const checked = spawnSync(process.execPath, ["--input-type=module", "--check"], {
          input: payload,
          encoding: "utf8",
        });
        assert.equal(checked.status, 0, checked.stderr);
        if (payload.includes("nativeReceiptSha256"))
          return { status: 0, stdout: JSON.stringify({ records: Array(101).fill("identity") }) };
        if (payload.includes("VITE_TEMP_BOUNDARY_PASS"))
          return { status: 0, stdout: '{"status":"VITE_TEMP_BOUNDARY_PASS"}' };
        return { status: 0, stdout: payload.includes("seed.map") ? "[]" : "" };
      }
      if (args.includes("pnpm"))
        return args.includes("--tmpfs")
          ? { status: 0, stdout: "Manual ticket placement valid: syntax fixture", stderr: "" }
          : { status: 1, stdout: "", stderr: "ENOENT mkdir /app/node_modules/.vite-temp" };
      assert.fail("unexpected syntax fixture command");
    };
    prepareLinuxFixtureDependencies({
      docker,
      context: temporary,
      image: "owned-image",
      token: "syntax-fixture",
      volumes: [],
      uid: 502,
      gid: 20,
      evidenceRoot: temporary,
    });
    assert.equal(payloads.size, 7, "all seven actual generated payloads must be checked");
    const mountProof = [...payloads].find((payload) => payload.includes("VITE_TEMP_BOUNDARY_PASS"));
    assert(mountProof.includes("split('\\n')"));
    const regressed = mountProof.replace("split('\\n')", "split('\n')");
    const invalid = spawnSync(process.execPath, ["--input-type=module", "--check"], {
      input: regressed,
      encoding: "utf8",
    });
    assert.notEqual(invalid.status, 0, "the actual original newline regression must fail");
    assert.match(invalid.stderr, /SyntaxError/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("fixture runs retain the readonly package mount and expose only the bounded per-container temporary mount", () => {
  const environment = {
    context: "/owned/context",
    dependencyVolume: "creator-dependencies",
    image: "creator-image",
    uid: 502,
    gid: 20,
  };
  const original = linuxFixtureArguments(environment, ["pnpm", "run", "build"], false);
  assert(
    original.includes("type=volume,source=creator-dependencies,target=/app/node_modules,readonly"),
  );
  assert(!original.includes("--tmpfs"));
  const fixed = linuxFixtureArguments(environment, ["pnpm", "run", "build"]);
  assert(
    fixed.includes("type=volume,source=creator-dependencies,target=/app/node_modules,readonly"),
  );
  assert.equal(fixed.filter((argument) => argument === "--tmpfs").length, 1);
  assert.equal(
    fixed[fixed.indexOf("--tmpfs") + 1],
    `/app/node_modules/.vite-temp:rw,nosuid,nodev,size=${viteTemporaryCap},mode=0700,uid=502,gid=20`,
  );
  assert(fixed.includes("--rm") && fixed.includes("--network=none"));
  assert.deepEqual(fixed.slice(-4), ["pnpm", "creator-image", "run", "build"]);
});

for (const scenario of ["trace", "original", "cleanup"])
  test(`focused runner ${scenario} proof-cap failure preserves failure and tears down exact creator resources`, () => {
    const temporary = mkdtempSync(join(tmpdir(), "cabadrive-vite-trace-test-"));
    const root = join(temporary, "repository");
    const bin = join(temporary, "bin");
    const scratch = join(temporary, "scratch");
    for (const path of [root, bin, scratch]) mkdirSync(path);
    const state = join(temporary, "state.json");
    try {
      copyDockerTestScripts(new URL("../scripts", import.meta.url), join(root, "scripts"));
      writeFileSync(join(root, "package.json"), '{"type":"module"}');
      writeFileSync(state, JSON.stringify({ images: [], volumes: [], commands: [] }));
      writeFileSync(
        join(bin, "docker"),
        `#!${process.execPath}
const fs=require('node:fs');const path=process.env.VITE_FAKE_STATE;const state=JSON.parse(fs.readFileSync(path));
const args=process.argv.slice(2);state.commands.push(args);let status=0;
if(args[0]==='ps'){}
else if(args[0]==='volume'&&args[1]==='create'){state.volumes.push(args.at(-1));console.log(args.at(-1));}
else if(args[0]==='volume'&&args[1]==='rm'){state.volumes=state.volumes.filter(x=>x!==args[2]);if(process.env.VITE_SCENARIO==='cleanup'){process.stderr.write('cleanup-volume-error'+ 'z'.repeat(25*1024**2));status=1;}}
else if(args[0]==='volume'&&args[1]==='inspect'){status=state.volumes.includes(args[2])?0:1;if(!status)console.log(JSON.stringify([{Name:args[2],Labels:{'com.cabadrive.image-pipeline-test':args[2].replace(/-(dependencies|public|dist)$/,'')}}]));}
else if(args[0]==='run'&&args[args.indexOf('--entrypoint')+1]==='pnpm'){process.stdout.write('x'.repeat(1024**2));console.error('ENOENT mkdir /app/node_modules/.vite-temp');status=1;}
else if(args[0]==='run'&&args[args.indexOf('--entrypoint')+1]==='node'){const payload=args[args.indexOf('-e')+1];console.log(payload.includes('seed.map')?'[]':'mock tool copy');}
else if(args[0]==='run')console.log('Filesystem 1024-blocks Used Available Capacity Mounted on\\noverlay 16777216 0 8388608 0% /');
else if(args[0]==='build'){state.images.push(args[args.indexOf('-t')+1]);if(process.env.VITE_SCENARIO==='trace'){process.stdout.write('a'.repeat(8*1024**2-64));process.stderr.write('b'.repeat(8*1024**2-64));}else console.log('mock tools build');}
else if(args[0]==='image'&&args[1]==='rm'){state.images=state.images.filter(x=>x!==args[2]);if(process.env.VITE_SCENARIO==='cleanup'){process.stderr.write('cleanup-image-error'+ 'z'.repeat(25*1024**2));status=1;}}
else if(args[0]==='image'&&args[1]==='inspect'){status=state.images.includes(args[2])?0:1;if(!status)console.log(JSON.stringify([{Id:'mock-image',Config:{Labels:{'com.cabadrive.image-pipeline-test':args[2].replace(/-tools$/,'')}}}]));}
else status=2;
fs.writeFileSync(path,JSON.stringify(state));process.exitCode=status;
`,
        { mode: 0o755 },
      );
      const preload = join(temporary, "capacity.mjs");
      writeFileSync(
        preload,
        "import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';fs.statfsSync=()=>({bavail:8*1024**3,bsize:1});syncBuiltinESMExports();",
      );
      const result = spawnSync(
        process.execPath,
        ["--import", preload, join(root, "scripts/test-docker-vite-temp.mjs")],
        {
          encoding: "utf8",
          timeout: 30000,
          maxBuffer: 128 * 1024 ** 2,
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            TMPDIR: scratch,
            VITE_FAKE_STATE: state,
            VITE_SCENARIO: scenario,
          },
        },
      );
      assert.ifError(result.error);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        scenario === "trace"
          ? /focused command trace exceeds16MiB budget/
          : /original Vite failure proof exceeds1MiB budget/,
      );
      assert.doesNotMatch(result.stdout, /FOCUSED_LINUX_VITE_PASS/);
      const recorded = JSON.parse(readFileSync(state));
      const tag = recorded.commands
        .find((args) => args[0] === "build")
        .find((argument) => /^cabadrive-vite-\d+-\d+-tools$/.test(argument));
      assert(tag);
      assert.deepEqual(
        recorded.commands.filter((args) => args[0] === "image" && args[1] === "rm"),
        [["image", "rm", tag]],
      );
      assert.deepEqual(recorded.images, []);
      assert.deepEqual(recorded.volumes, []);
      if (scenario !== "trace")
        assert.equal(
          recorded.commands.filter((args) => args[0] === "volume" && args[1] === "rm").length,
          3,
        );
      assert.deepEqual(readdirSync(scratch), []);
      const evidenceRoot = join(root, ".cache/image-qa/ticket-upscale");
      const tracePath = join(
        evidenceRoot,
        readdirSync(evidenceRoot).find((name) => name.endsWith("-focused-vite.json")),
      );
      const trace = readFileSync(tracePath);
      assert(trace.length <= 48 * 1024 ** 2);
      if (scenario === "cleanup") {
        const proof = JSON.parse(trace);
        assert(proof.cleanupErrors.some((error) => error.bytes > 20 * 1024 ** 2));
        assert(
          proof.cleanupErrors.every(
            (error) => error.excerpt.length <= 4096 && /^[a-f0-9]{64}$/.test(error.sha256),
          ),
        );
        assert(proof.cleanupErrors.some((error) => error.excerpt.includes("cleanup-volume-error")));
        assert(proof.cleanupErrors.some((error) => error.excerpt.includes("cleanup-image-error")));
        assert.match(
          result.stderr,
          /AggregateError: focused Vite operation\/creator teardown failed/,
        );
      }
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });

test("fresh full-driver evidence parents are created before the first real proof write", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-fresh-proof-parent-"));
  const context = join(root, "context");
  const evidenceRoot = join(root, "absent", "nested", "ticket-upscale");
  const token = "cabadrive-images-12345-123456789";
  const ownedVolumes = [];
  const labels = { "com.cabadrive.image-pipeline-test": token };
  const created = new Set();
  mkdirSync(context);
  assert.equal(existsSync(evidenceRoot), false);
  const docker = (args) => {
    if (args[0] === "volume" && args[1] === "create") {
      created.add(args.at(-1));
      return { status: 0, stdout: args.at(-1) };
    }
    if (args[0] === "volume" && args[1] === "inspect")
      return created.has(args[2])
        ? { status: 0, stdout: JSON.stringify([{ Name: args[2], Labels: labels }]) }
        : { status: 1, stdout: "" };
    if (args[0] === "run" && args[args.indexOf("--entrypoint") + 1] === "pnpm")
      return {
        status: 1,
        signal: null,
        stdout: "actual original command result",
        stderr: "ENOENT mkdir /app/node_modules/.vite-temp",
      };
    const code = args[args.indexOf("-e") + 1] ?? "";
    if (code.includes("seed.map")) return { status: 0, stdout: "[]" };
    if (code.includes("installedPackageInventory"))
      return {
        status: 0,
        stdout: JSON.stringify({ records: ["mock installed identity"], lockSha256: "mock-lock" }),
      };
    if (code.includes("fresh volume must not contain"))
      throw new Error("temporary init boundary reached after both proof writes");
    return { status: 0, stdout: "tools copied / empty roots initialized" };
  };
  try {
    assert.throws(
      () =>
        prepareLinuxFixtureDependencies({
          docker,
          context,
          image: "owned-image",
          token,
          volumes: ownedVolumes,
          uid: 502,
          gid: 20,
          evidenceRoot,
        }),
      /temporary init boundary reached after both proof writes/,
    );
    const proofPath = join(evidenceRoot, `${token}-vite-original-failure.json`);
    const proof = JSON.parse(readFileSync(proofPath, "utf8"));
    assert.equal(proof.exit, 1);
    assert.equal(proof.stdout, "actual original command result");
    assert.match(proof.stderr, /ENOENT.*node_modules\/\.vite-temp/);
    assert.equal(lstatSync(proofPath).mode & 0o777, 0o600);
    assert.equal(lstatSync(evidenceRoot).mode & 0o777, 0o700);
    const identityPath = join(evidenceRoot, `${token}-dependencies-before.json`);
    assert.deepEqual(JSON.parse(readFileSync(identityPath, "utf8")), {
      records: ["mock installed identity"],
      lockSha256: "mock-lock",
    });
    assert.equal(lstatSync(identityPath).mode & 0o777, 0o600);
    assert.equal(ownedVolumes.length, 3);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("evidence parent that is a regular file refuses before any Docker allocation", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-proof-parent-file-"));
  const parent = join(root, "parent");
  writeFileSync(parent, "preserve exact parent bytes");
  let calls = 0;
  const volumes = [];
  try {
    assert.throws(
      () =>
        prepareLinuxFixtureDependencies({
          docker: () => {
            calls++;
            throw new Error("Docker must not be called");
          },
          context: root,
          image: "owned-image",
          token: "owned-token",
          volumes,
          uid: 502,
          gid: 20,
          evidenceRoot: join(parent, "ticket-upscale"),
        }),
      (error) => ["ENOTDIR", "EEXIST"].includes(error.code),
    );
    assert.equal(calls, 0);
    assert.deepEqual(volumes, []);
    assert.equal(readFileSync(parent, "utf8"), "preserve exact parent bytes");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("preexisting evidence content survives idempotent parent preparation", () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-proof-existing-"));
  const evidenceRoot = join(root, "evidence");
  mkdirSync(evidenceRoot, { mode: 0o700 });
  const existing = join(evidenceRoot, "historical-proof.json");
  writeFileSync(existing, '{"preserve":true}', { mode: 0o600 });
  try {
    assert.throws(
      () =>
        prepareLinuxFixtureDependencies({
          docker: () => {
            throw new Error("first allocation boundary");
          },
          context: root,
          image: "owned-image",
          token: "owned-token",
          volumes: [],
          uid: 502,
          gid: 20,
          evidenceRoot,
        }),
      /first allocation boundary/,
    );
    assert.equal(readFileSync(existing, "utf8"), '{"preserve":true}');
    assert.deepEqual(readdirSync(evidenceRoot), ["historical-proof.json"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
