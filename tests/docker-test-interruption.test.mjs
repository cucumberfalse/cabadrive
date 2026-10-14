import { copyDockerTestScripts } from "./copy-docker-test-scripts.mjs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
function copied(kind, scenario) {
  const temporary = realpathSync(mkdtempSync(join(tmpdir(), "cabadrive-interrupt-regression-")));
  const repository = join(temporary, "repo"),
    bin = join(temporary, "bin"),
    scratch = join(temporary, "scratch"),
    stop = join(temporary, "stop");
  for (const path of [repository, bin, scratch]) mkdirSync(path);
  mkdirSync(stop, { mode: 0o700 });
  try {
    copyDockerTestScripts(join(root, "scripts"), join(repository, "scripts"));
    mkdirSync(join(repository, "tests"));
    cpSync(
      join(root, "tests/image-pipeline-fixtures.mjs"),
      join(repository, "tests/image-pipeline-fixtures.mjs"),
    );
    symlinkSync(join(root, "node_modules"), join(repository, "node_modules"));
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
    const foreign = join(temporary, "foreign");
    writeFileSync(foreign, "foreign unchanged");
    const state = join(temporary, "commands.jsonl");
    const owner = String(process.pid),
      token = "a".repeat(64);
    if (scenario === "before" || scenario === "malformed")
      writeFileSync(
        join(stop, "stop.json"),
        scenario === "malformed"
          ? "bad JSON"
          : JSON.stringify({
              schemaVersion: 1,
              token,
              ownerPid: process.pid,
              groupPid: 123,
              reason: "resource-observer-stop",
            }),
        { mode: 0o600 },
      );
    writeFileSync(
      join(bin, "docker"),
      `#!${process.execPath}
const fs=require('node:fs');const args=process.argv.slice(2);fs.appendFileSync(process.env.COMMANDS,JSON.stringify(args)+'\\n');
const stop=process.env.CABADRIVE_CI_STOP_DIR+'/stop.json';
if(args.includes('--fault')||args[0]==='build'){
 const marker={schemaVersion:1,token:process.env.CABADRIVE_CI_STOP_TOKEN,ownerPid:Number(process.env.CABADRIVE_CI_STOP_OWNER),groupPid:process.ppid,reason:'resource-observer-stop'};
 fs.writeFileSync(stop+'.pending',JSON.stringify(marker),{mode:0o600});fs.renameSync(stop+'.pending',stop);
 // A real synchronous child signals its actual parent while callback dispatch is blocked.
 process.kill(process.ppid,'SIGINT');
 console.error('fault injection at after-assets');process.exitCode=['exit0','cleanup-error'].includes(process.env.SCENARIO)?0:1;
}else if(args[0]==='info')console.log('mock daemon');
else if(args[0]==='run'&&args.includes('df'))console.log('Filesystem 1024-blocks Used Available Capacity Mounted on\\noverlay 67108864 0 67108864 0% /');
else if(args[0]==='run')console.log(JSON.stringify({bytes:"export const legacyLazy = 'retained-origin-A';",manifest:{sourceKind:'baked-legacy-root'}}));
else if(args[0]==='image'&&args[1]==='inspect')process.exitCode=1;
else if(args[0]==='image'&&args[1]==='rm'&&process.env.SCENARIO==='cleanup-error'){console.error('owned cleanup refusal');process.exitCode=2;}
`,
      { mode: 0o755 },
    );
    // Retain the actual expected-negative function and actual nested/outer finally.
    // Only skip unrelated earlier heavy fixture setup to reach that real boundary.
    if (kind === "retention") {
      const path = join(repository, "scripts/test-docker-asset-retention.mjs");
      let source = readFileSync(path, "utf8");
      const ast = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
      const outer = ast.statements.filter(ts.isTryStatement).at(-1);
      assert(outer?.finallyBlock, "actual outer creator finally must exist");
      source =
        source.slice(0, outer.tryBlock.getStart(ast) + 1) +
        '\n interruption.check();\n try { assertImageOnlyIncompleteRecovery(project); } finally { interruption.beginCleanup(); try { spawnSync("docker", ["rm", "-f", `${project}-nested-sentinel`]); } finally { interruption.endCleanup(); } }\n' +
        source.slice(outer.tryBlock.end - 1);
      writeFileSync(path, source);
    }
    const preload = join(temporary, "capacity.mjs");
    writeFileSync(
      preload,
      "import fs from 'node:fs';import{syncBuiltinESMExports}from'node:module';fs.statfsSync=()=>({bavail:64*1024**3,bsize:1});syncBuiltinESMExports();",
    );
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        preload,
        join(
          repository,
          `scripts/test-docker-${kind === "retention" ? "asset-retention" : "image-pipeline"}.mjs`,
        ),
      ],
      {
        encoding: "utf8",
        detached: true,
        timeout: 30000,
        env: {
          ...process.env,
          PATH: `${bin}:${process.env.PATH}`,
          TMPDIR: scratch,
          CABADRIVE_DOCKER_IMAGES_UNAVAILABLE_PROBE: "1",
          CABADRIVE_CI_STOP_DIR: stop,
          CABADRIVE_CI_STOP_TOKEN: token,
          CABADRIVE_CI_STOP_OWNER: owner,
          COMMANDS: state,
          SCENARIO: scenario,
        },
      },
    );
    assert.ifError(result.error);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Docker fixture cancelled/u);
    assert.doesNotMatch(result.stdout, /"status"\s*:\s*"(?:PASS|PARTIAL)"|lifecycle passed/u);
    const commands = (() => {
      try {
        return readFileSync(state, "utf8").trim().split("\n").map(JSON.parse);
      } catch {
        return [];
      }
    })();
    if (kind === "retention") {
      assert(
        commands.some((args) =>
          args.includes(`${commands.find((a) => a.includes("--fault"))?.[2]}-nested-sentinel`),
        ),
        "nested creator finally runs",
      );
      assert(
        commands.some((args) => args[0] === "compose" && args.includes("down")),
        "outer creator finally runs",
      );
      assert.equal(
        commands.filter((args) => args.includes("verify")).length,
        0,
        "no next expected-negative command",
      );
    } else {
      assert.deepEqual(readdirSync(scratch), [], "creator context removed");
      if (scenario === "exit0" || scenario === "cleanup-error")
        assert(
          commands.some((args) => args[0] === "image" && args[1] === "rm"),
          "successful owned image registered before cancelled return",
        );
    }
    assert.equal(readFileSync(foreign, "utf8"), "foreign unchanged");
    if (["before", "malformed"].includes(scenario)) assert.equal(commands.length, 0);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}
for (const scenario of ["before", "malformed", "exit0", "cleanup-error"])
  test(`copied actual image harness cancellation ${scenario}`, () => copied("images", scenario));
for (const scenario of ["negative", "exit0"])
  test(`copied actual retention nested expected-negative cancellation ${scenario}`, () =>
    copied("retention", scenario));
