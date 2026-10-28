import { copyDockerTestScripts } from "./copy-docker-test-scripts.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkpointOptions, readCheckpoint } from "../scripts/docker-image-checkpoint.mjs";

function requireCompletedDriver(result, diagnostic) {
  assert.equal(result.error, undefined, diagnostic);
  assert.equal(result.signal, null, diagnostic);
  assert(Number.isInteger(result.status), diagnostic);
  return result;
}

test("checkpoint subprocess completion guard rejects errors, signals and missing exits", () => {
  for (const status of [0, 1]) {
    const completed = { status, signal: null };
    assert.equal(requireCompletedDriver(completed, "completed"), completed);
  }
  for (const incomplete of [
    {
      status: null,
      signal: null,
      error: Object.assign(new Error("timeout"), { code: "ETIMEDOUT" }),
    },
    { status: null, signal: null, error: Object.assign(new Error("spawn"), { code: "ENOENT" }) },
    { status: 1, signal: null, error: new Error("spawn") },
    { status: null, signal: "SIGTERM" },
    { status: 1, signal: "SIGTERM" },
    { status: null, signal: null },
    { status: undefined, signal: null },
    { status: 1 },
  ]) {
    assert.throws(() => requireCompletedDriver(incomplete, "incomplete checkpoint driver"), {
      name: "AssertionError",
      message: /incomplete checkpoint driver/,
    });
  }
});

// Command doubles exercise the actual driver's continuation and creator cleanup.
// Their small synthetic inventories never constitute production Docker acceptance.
function fixture() {
  const temporary = mkdtempSync(join(tmpdir(), "cabadrive-checkpoint-test-"));
  const repository = join(temporary, "repository");
  const bin = join(temporary, "bin");
  const scratch = join(temporary, "scratch");
  const statePath = join(temporary, "state.json");
  for (const path of [repository, bin, scratch]) mkdirSync(path);
  copyDockerTestScripts(new URL("../scripts", import.meta.url), join(repository, "scripts"));
  mkdirSync(join(repository, "tests"));
  cpSync(
    new URL("./image-pipeline-fixtures.mjs", import.meta.url),
    join(repository, "tests/image-pipeline-fixtures.mjs"),
  );
  symlinkSync(
    fileURLToPath(new URL("../node_modules", import.meta.url)),
    join(repository, "node_modules"),
    "dir",
  );
  writeFileSync(join(repository, "package.json"), '{"type":"module"}');
  writeFileSync(join(repository, ".dockerignore"), "node_modules\n.cache\n");
  mkdirSync(join(repository, "content"));
  mkdirSync(join(repository, "specs"));
  writeFileSync(join(repository, "specs/process.md"), "included process input\n");
  const sources = Array.from({ length: 275 }, (_, id) => ({
    class: "c",
    sourcePath: `content/assets/b${id}.jpg`,
    sourceSha256: "a".repeat(64),
    variants: [],
  }));
  const inventory = Array.from({ length: 3321 }, (_, id) => ({
    path: `content/img/${id}.jpg`,
    sha256: "b".repeat(64),
  }));
  inventory.forEach((entry, index) => sources[index % sources.length].variants.push(entry));
  writeFileSync(
    join(repository, "content/image-pipeline.sources.json"),
    JSON.stringify({ schemaVersion: 1, sources }),
  );
  writeFileSync(
    join(repository, "content/image-derivatives.manifest.json"),
    JSON.stringify({ sources }),
  );
  const payload = {
    status: "PRODUCTION_PAYLOAD_PASS",
    productionSources: 275,
    variants: 3321,
    inventory,
  };
  writeFileSync(statePath, JSON.stringify({ images: {}, commands: [], payload }));
  writeFileSync(join(bin, "package.json"), '{"type":"module"}');
  writeFileSync(
    join(bin, "docker"),
    `#!${process.execPath}
import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const path=process.env.CHECKPOINT_TEST_STATE,state=JSON.parse(readFileSync(path));
const args=process.argv.slice(2);state.commands.push(args);let status=0;
if(args[0]==='info')console.log('command double only');
else if(args[0]==='ps'){}
else if(args[0]==='build'){
 const target=args[args.indexOf('--target')+1],tag=args[args.indexOf('-t')+1];
 if(target==='build'){console.error('ENOENT content/assets-masters/b1.png');status=1;}
 else {const labels={};args.forEach((arg,i)=>{if(arg==='--label'){const value=args[i+1],split=value.indexOf('=');labels[value.slice(0,split)]=value.slice(split+1);}});
 state.images[tag]={Id:'sha256:'+createHash('sha256').update(tag).digest('hex'),Config:{Labels:labels},RepoTags:[tag],RootFS:{Layers:[]}};console.log('successful command double '+target);}
}else if(args[0]==='run'){
 if(args.includes('df'))console.log('Filesystem 1024-blocks Used Available Capacity Mounted on\\noverlay 16777216 0 8388608 0% /');
 else if(args.includes('-i')){readFileSync(0);console.log(JSON.stringify(state.payload));}
 else {console.error('unexpected run');status=2;}
}else if(args[0]==='image'&&args[1]==='inspect'){
 const image=state.images[args[2]];if(image)console.log(JSON.stringify([image]));else status=1;
}else if(args[0]==='image'&&args[1]==='rm'){delete state.images[args[2]];}
else if(args[0]==='volume'&&args[1]==='create'){console.error('phase3 intentionally unavailable in command double');status=9;}
else {console.error('unexpected command '+args.join(' '));status=2;}
writeFileSync(path,JSON.stringify(state));process.exitCode=status;
`,
    { mode: 0o755 },
  );
  const preload = join(temporary, "capacity.mjs");
  writeFileSync(
    preload,
    "import fs from 'node:fs';import {syncBuiltinESMExports} from 'node:module';fs.statfsSync=()=>({bavail:8*1024**3,bsize:1});syncBuiltinESMExports();",
  );
  const run = (...args) => {
    const started = performance.now();
    const result = spawnSync(
      process.execPath,
      ["--import", preload, join(repository, "scripts/test-docker-image-pipeline.mjs"), ...args],
      {
        encoding: "utf8",
        timeout: 45000,
        maxBuffer: 16 * 1024 ** 2,
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          TMPDIR: scratch,
          CHECKPOINT_TEST_STATE: statePath,
        },
      },
    );
    const elapsedMs = Math.round(performance.now() - started);
    let commandState;
    try {
      const snapshot = JSON.parse(readFileSync(statePath));
      commandState = {
        count: snapshot.commands.length,
        recent: snapshot.commands
          .slice(-6)
          .map((command) => command.slice(0, 5).map((argument) => argument.slice(0, 160))),
        imageCount: Object.keys(snapshot.images).length,
        imageIds: Object.values(snapshot.images)
          .slice(0, 8)
          .map((image) => image.Id),
      };
    } catch (error) {
      commandState = { error: error.message.slice(0, 256) };
    }
    let diagnosticFiles;
    if (result.error || result.signal !== null || !Number.isInteger(result.status)) {
      try {
        const directory = mkdtempSync(join(tmpdir(), "cabadrive-checkpoint-diagnostic-"));
        for (const [name, value] of [
          ["stdout", result.stdout],
          ["stderr", result.stderr],
        ])
          writeFileSync(join(directory, `${name}.log`), value ?? "", { mode: 0o600 });
        diagnosticFiles = { directory };
      } catch (error) {
        diagnosticFiles = { error: error.message.slice(0, 256) };
      }
    }
    const output = (value) => ({
      bytes: Buffer.byteLength(value ?? ""),
      tail: value?.slice(-1024),
    });
    const diagnostic = JSON.stringify({
      elapsedMs,
      status: result.status,
      signal: result.signal,
      error: result.error
        ? {
            code: result.error.code,
            syscall: result.error.syscall?.slice(0, 160),
            message: result.error.message.slice(0, 256),
          }
        : null,
      stdout: output(result.stdout),
      stderr: output(result.stderr),
      commandState,
      diagnosticFiles,
    });
    console.error(`Checkpoint driver completion: ${diagnostic}`);
    requireCompletedDriver(result, diagnostic);
    return { ...result, diagnostic };
  };
  const state = () => JSON.parse(readFileSync(statePath));
  const changeState = (mutate) => {
    const value = state();
    mutate(value);
    writeFileSync(statePath, JSON.stringify(value));
  };
  const checkpoint = () => {
    const result = run("--checkpoint-after", "production");
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const partial = JSON.parse(result.stdout.trim().split("\n").at(-1));
    assert.equal(partial.status, "PARTIAL");
    assert.equal(partial.overallAcceptance, false);
    assert.equal(partial.completed, "production");
    assert.doesNotMatch(result.stdout, /"status":"PASS"/);
    return partial;
  };
  return {
    temporary,
    repository,
    scratch,
    run,
    state,
    changeState,
    checkpoint,
    close: () => rmSync(temporary, { recursive: true, force: true }),
  };
}

test("default options run all phases; unknown, duplicate and missing boundaries fail", () => {
  assert.deepEqual(checkpointOptions([]), {});
  assert.deepEqual(checkpointOptions(["--checkpoint-after", "production"]), {
    after: "production",
  });
  for (const args of [
    ["--pass"],
    ["--checkpoint-after"],
    ["--checkpoint-after", "releases"],
    ["--resume", "a", "--resume", "b"],
  ])
    assert.throws(() => checkpointOptions(args));
});

test("cold production and valid negative continuation retain exact proofs; later failure tears down only creator resources", () => {
  const f = fixture();
  try {
    const first = f.checkpoint();
    const token = JSON.parse(readFileSync(first.checkpoint)).token;
    f.changeState((state) => {
      state.images.foreign = { Id: "foreign" };
    });
    const continued = f.run("--resume", first.checkpoint, "--checkpoint-after", "negative");
    assert.ifError(continued.error);
    assert.equal(continued.status, 0, continued.stderr);
    const second = JSON.parse(continued.stdout.trim().split("\n").at(-1));
    assert.equal(second.status, "PARTIAL");
    assert.equal(second.completed, "negative");
    assert.equal(
      JSON.parse(readFileSync(second.checkpoint)).temporary,
      JSON.parse(readFileSync(first.checkpoint)).temporary,
    );
    assert.equal(
      f.state().commands.filter((args) => args[0] === "build").length,
      3,
      "continuation must not rebuild production",
    );
    const completed = f.run("--resume", second.checkpoint);
    assert.notEqual(completed.status, 0);
    assert.match(completed.stderr, /phase3 intentionally unavailable/);
    assert.doesNotMatch(completed.stdout, /"status":"PASS"/);
    assert.deepEqual(Object.keys(f.state().images), ["foreign"]);
    assert.deepEqual(
      f
        .state()
        .commands.filter((args) => args[0] === "image" && args[1] === "rm")
        .map((args) => args[2])
        .sort(),
      [`${token}-prepare`, `${token}-stager`].sort(),
    );
    assert.deepEqual(readdirSync(f.scratch), []);
    assert.deepEqual(readdirSync(join(f.repository, ".cache/image-qa/checkpoint-keys")), []);
  } finally {
    f.close();
  }
});

test("cold negative boundary records both real command predicates without needing an earlier checkpoint", () => {
  const f = fixture();
  try {
    const result = f.run("--checkpoint-after", "negative");
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    const partial = JSON.parse(result.stdout.trim().split("\n").at(-1));
    assert.equal(partial.status, "PARTIAL");
    assert.equal(partial.completed, "negative");
    const receipt = JSON.parse(readFileSync(partial.checkpoint));
    assert(receipt.productionFileSha256 && receipt.negativeFileSha256 && receipt.seal);
    assert.deepEqual(
      f
        .state()
        .commands.filter((args) => args[0] === "build")
        .map((args) => args[args.indexOf("--target") + 1]),
      ["image-pipeline-fixture-tools", "stager", "build"],
    );
    const resumed = f.run("--resume", partial.checkpoint);
    assert.notEqual(resumed.status, 0);
    assert.match(resumed.stderr, /phase3 intentionally unavailable/);
    assert.equal(f.state().commands.filter((args) => args[0] === "build").length, 3);
    assert.deepEqual(f.state().images, {});
    assert.deepEqual(readdirSync(f.scratch), []);
    assert.deepEqual(readdirSync(join(f.repository, ".cache/image-qa/checkpoint-keys")), []);
  } finally {
    f.close();
  }
});

test("default path executes production and real negative before later failure, with no partial retention", () => {
  const f = fixture();
  try {
    const result = f.run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /phase3 intentionally unavailable/);
    assert.deepEqual(
      f
        .state()
        .commands.filter((args) => args[0] === "build")
        .map((args) => args[args.indexOf("--target") + 1]),
      ["image-pipeline-fixture-tools", "stager", "build"],
    );
    assert.deepEqual(f.state().images, {});
    assert.deepEqual(readdirSync(f.scratch), []);
    assert.doesNotMatch(result.stdout, /"status":"(?:PARTIAL|PASS)"/);
  } finally {
    f.close();
  }
});

for (const mutation of [
  "included-doc",
  "retained-context",
  "receipt",
  "missing-image",
  "foreign-image",
  "candidate",
  "context-symlink",
  "missing-receipt",
]) {
  test(`continuation refuses ${mutation} without adopting or deleting retained/foreign resources`, () => {
    const f = fixture();
    try {
      const partial = f.checkpoint();
      if (mutation === "included-doc")
        writeFileSync(join(f.repository, "specs/process.md"), "changed included process\n");
      if (mutation === "retained-context")
        writeFileSync(join(partial.context, "specs/process.md"), "changed retained process\n");
      if (mutation === "receipt") {
        const receipt = JSON.parse(readFileSync(partial.checkpoint));
        receipt.completed = "negative";
        writeFileSync(partial.checkpoint, JSON.stringify(receipt), { mode: 0o600 });
      }
      if (mutation === "missing-image")
        f.changeState((state) => {
          delete state.images[partial.retainedImages[0]];
        });
      if (mutation === "foreign-image")
        f.changeState((state) => {
          state.images[partial.retainedImages[0]].Config.Labels[
            "com.cabadrive.image-pipeline-test"
          ] = "foreign";
        });
      if (mutation === "candidate")
        f.changeState((state) => {
          state.payload.inventory[0].sha256 = "c".repeat(64);
        });
      if (mutation === "context-symlink") {
        rmSync(partial.context, { recursive: true });
        symlinkSync(f.repository, partial.context, "dir");
      }
      if (mutation === "missing-receipt") rmSync(partial.checkpoint);
      const before = f.state();
      const result = f.run("--resume", partial.checkpoint);
      assert.notEqual(result.status, 0);
      assert.doesNotMatch(result.stdout, /"status":"PASS"/);
      if (mutation === "candidate")
        assert.match(result.stderr, /actual retained candidate changed/, result.diagnostic);
      // A changed live candidate is discovered after creator validation; teardown
      // then legitimately removes that creator, while all pre-adoption failures preserve it.
      if (mutation !== "candidate") {
        assert.deepEqual(f.state().images, before.images);
        assert.equal(
          f.state().commands.filter((args) => args[0] === "image" && args[1] === "rm").length,
          0,
        );
        assert(readdirSync(f.scratch).length > 0);
      } else assert.deepEqual(f.state().images, {});
    } finally {
      f.close();
    }
  });
}

test("arbitrary private directory with a matching basename cannot be adopted outside creator TMPDIR", () => {
  const f = fixture();
  try {
    const partial = f.checkpoint();
    const foreign = join(f.temporary, "cabadrive-docker-images-foreign");
    mkdirSync(foreign, { mode: 0o700 });
    cpSync(join(partial.context, "../"), foreign, { recursive: true });
    assert.throws(
      () =>
        readCheckpoint(join(foreign, "checkpoint.json"), f.repository, () => {
          throw new Error("must not inspect foreign image");
        }),
      /outside creator temporary namespace/,
    );
    assert(readFileSync(join(foreign, "checkpoint.json")).length > 0);
  } finally {
    f.close();
  }
});
