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
import test from "node:test";
import { fileURLToPath } from "node:url";

test("post-build capacity failure tears down its successfully created image and context", () => {
  const temporary = mkdtempSync(join(tmpdir(), "cabadrive-image-driver-cleanup-"));
  const repository = join(temporary, "repository");
  const bin = join(temporary, "bin");
  const scratch = join(temporary, "scratch");
  const state = join(temporary, "fake-docker.json");
  for (const path of [repository, bin, scratch]) mkdirSync(path);
  try {
    // Execute the real driver against an isolated command double. This tests
    // failure/ownership bookkeeping only and never constitutes Docker acceptance.
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
    mkdirSync(join(repository, "content"));
    writeFileSync(
      join(repository, "content/image-pipeline.sources.json"),
      JSON.stringify({
        schemaVersion: 1,
        sources: Array.from({ length: 275 }, (_, id) => ({
          class: "c",
          sourcePath: `content/assets/b${id}.jpg`,
        })),
      }),
    );
    writeFileSync(state, JSON.stringify({ images: [], commands: [], capacityProbes: 0 }));
    writeFileSync(join(bin, "package.json"), '{"type":"module"}');
    writeFileSync(
      join(bin, "docker"),
      `#!${process.execPath}
import {readFileSync,writeFileSync} from 'node:fs';
const path=process.env.DRIVER_FAKE_STATE; const state=JSON.parse(readFileSync(path));
const args=process.argv.slice(2);state.commands.push(args);let status=0;
if(args[0]==='info')console.log('mock daemon');
else if(args[0]==='build'){state.images.push(args[args.indexOf('-t')+1]);console.log('mock successful build');}
else if(args[0]==='run'){
 state.capacityProbes++;
 const available=state.capacityProbes===4?1048576:8388608;
 console.log('Filesystem 1024-blocks Used Available Capacity Mounted on\\noverlay 16777216 0 '+available+' 0% /');
}else if(args[0]==='image'&&args[1]==='rm'){state.images=state.images.filter(x=>x!==args[2]);}
else if(args[0]==='image'&&args[1]==='inspect'){status=state.images.includes(args[2])?0:1;}
else {console.error('unexpected mocked command');status=2;}
writeFileSync(path,JSON.stringify(state));process.exit(status);
`,
      { mode: 0o755 },
    );
    const preload = join(temporary, "capacity-preload.mjs");
    // Keep this failure regression independent of the host's available capacity.
    // The post-build Docker capacity value still goes through the real guard.
    writeFileSync(
      preload,
      "import fs from 'node:fs'; import {syncBuiltinESMExports} from 'node:module'; fs.statfsSync=()=>({bavail:8*1024**3,bsize:1}); syncBuiltinESMExports();",
    );
    const result = spawnSync(
      process.execPath,
      ["--import", preload, join(repository, "scripts/test-docker-image-pipeline.mjs")],
      {
        encoding: "utf8",
        timeout: 30000,
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          TMPDIR: scratch,
          DRIVER_FAKE_STATE: state,
        },
      },
    );
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Docker backing needs remaining 0 GiB plus 2 GiB reserve/);
    assert.doesNotMatch(result.stdout, /"status"\s*:\s*"PASS"/);
    const recorded = JSON.parse(readFileSync(state));
    const build = recorded.commands.find((args) => args[0] === "build");
    assert(build, "the successful build must precede the failing post-build capacity probe");
    const tag = build[build.indexOf("-t") + 1];
    assert.match(tag, /^cabadrive-images-\d+-\d+-prepare$/);
    assert.deepEqual(
      recorded.commands.filter((args) => args[0] === "image" && args[1] === "rm"),
      [["image", "rm", tag]],
    );
    assert.deepEqual(
      recorded.images,
      [],
      "successful owned image must not leak on later guard failure",
    );
    assert.deepEqual(readdirSync(scratch), [], "exact creator context must be removed on failure");
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
