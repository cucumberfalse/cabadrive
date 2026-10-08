import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  statSync,
  symlinkSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repository = fileURLToPath(new URL("..", import.meta.url));
const csvMount = (source, target) =>
  `type=bind,"source=${source.replaceAll('"', '""')}",target=${target}`;
function fixture(name = "cabadrive|old") {
  const temporary = realpathSync(mkdtempSync(join(tmpdir(), "cabadrive-literal-")));
  const root = join(temporary, name);
  const bin = join(temporary, "bin");
  const scripts = join(root, "scripts");
  mkdirSync(scripts, { recursive: true });
  mkdirSync(bin);
  for (const name of ["capture-legacy-assets.sh", "export-static-release.sh"]) {
    writeFileSync(join(scripts, name), readFileSync(join(repository, "scripts", name)));
    chmodSync(join(scripts, name), 0o755);
  }
  writeFileSync(join(root, "docker-compose.yml"), "services: {}\n");
  const log = join(temporary, "docker.jsonl");
  const fake = join(bin, "docker");
  writeFileSync(
    fake,
    `#!${process.execPath}
const fs = require('node:fs');
const args = process.argv.slice(2), env = process.env;
fs.appendFileSync(env.FIXTURE_LOG, JSON.stringify(args)+'\\n');
function out(value) { process.stdout.write(value+'\\n'); }
if (args[0] === 'ps') { out('old-container'); process.exit(0); }
if (args[0] === 'inspect') {
  if (env.FIXTURE_INSPECT_FAILURE === '1') process.exit(43);
  const label = args[2];
  out(label.includes('working_dir') ? env.FIXTURE_WORKDIR : label.includes('config_files') ? env.FIXTURE_CONFIG : env.FIXTURE_PROJECT);
  process.exit(0);
}
if (args[0] === 'image' || args[0] === 'volume') { process.stderr.write('No such image\\n'); process.exit(1); }
if (args[0] === 'compose') process.exit(0);
if (args[0] === 'run') {
  const parent = env.CABADRIVE_REPOSITORY_ROOT+'/.cabadrive-release-handoff';
  if (args.includes('adopted-project-write')) {
    fs.writeFileSync(parent+'/.adopted-project', args[args.indexOf('--project')+1]+'\\n'); process.exit(0);
  }
  if (args.includes('adopted-project-verify')) { process.stdout.write(fs.readFileSync(parent+'/.adopted-project')); process.exit(0); }
}
process.exit(90);
`,
  );
  chmodSync(fake, 0o755);
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    CABADRIVE_REPOSITORY_ROOT: root,
    FIXTURE_LOG: log,
    FIXTURE_PROJECT: "historical-old",
    FIXTURE_WORKDIR: root,
    FIXTURE_CONFIG: `${root}/docker-compose.yml`,
  };
  delete env.COMPOSE_PROJECT_NAME;
  return {
    root,
    temporary,
    scripts,
    log,
    env,
    cleanup: () => rmSync(temporary, { recursive: true, force: true }),
  };
}
function run(
  f,
  args = ["--resolve-project"],
  script = join(f.scripts, "capture-legacy-assets.sh"),
  cwd = f.root,
) {
  return spawnSync("sh", [script, ...args], { cwd, env: f.env, encoding: "utf8", timeout: 10000 });
}
function sentinelMetadata(path) {
  const { atime, atimeMs, atimeNs, ...identity } = statSync(path, { bigint: true });
  void atime;
  void atimeMs;
  void atimeNs;
  return identity;
}
function calls(f) {
  return existsSync(f.log)
    ? readFileSync(f.log, "utf8")
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
    : [];
}

test("exact Compose labels and adoption preserve pipe, comma, quote and literal whitespace paths", () => {
  for (const name of ["cabadrive|old", "cabadrive,old", 'cabadrive"old', "cabadrive old"]) {
    const f = fixture(name);
    try {
      const resolved = run(f);
      assert.equal(resolved.status, 0, resolved.stderr);
      assert.equal(resolved.stdout, "historical-old\n");
      const captured = run(f, []);
      assert.equal(captured.status, 0, captured.stderr);
      assert.equal(
        readFileSync(join(f.root, ".cabadrive-release-handoff", ".adopted-project"), "utf8"),
        "historical-old\n",
      );
      const adopted = run(f);
      assert.equal(adopted.stdout, "historical-old\n");
      const adoption = calls(f).find((args) => args.includes("adopted-project-write"));
      assert.ok(
        adoption.includes(csvMount(join(f.root, ".cabadrive-release-handoff"), "/handoff")),
      );
      assert.ok(
        adoption.includes(
          `${csvMount(join(f.scripts, "stage-static-release.mjs"), "/app/stage-static-release.mjs")},readonly`,
        ),
      );
      assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff", "cabadrive")), false);
    } finally {
      f.cleanup();
    }
  }
});

test("unsupported trailing LF checkout rejects before discovery and preserves the distinct plain sibling", () => {
  const f = fixture("checkout\n");
  const sibling = join(f.temporary, "checkout");
  mkdirSync(sibling);
  writeFileSync(join(sibling, "sentinel"), "plain sibling");
  writeFileSync(join(f.root, "sentinel"), "LF checkout");
  const identities = [join(sibling, "sentinel"), join(f.root, "sentinel")].map((path) =>
    sentinelMetadata(path),
  );
  try {
    const result = run(f, []);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /unsupported control characters/);
    assert.deepEqual(calls(f), []);
    assert.equal(readFileSync(join(sibling, "sentinel"), "utf8"), "plain sibling");
    assert.equal(readFileSync(join(f.root, "sentinel"), "utf8"), "LF checkout");
    assert.equal(existsSync(join(sibling, ".cabadrive-release-handoff")), false);
    assert.deepEqual(
      [join(sibling, "sentinel"), join(f.root, "sentinel")].map((path) => sentinelMetadata(path)),
      identities,
    );
    assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
  } finally {
    f.cleanup();
  }
});

test("owned malformed project labels reject before candidate encoding or handoff mutation", () => {
  for (const project of ["", "valid|foreign", "valid\n", "../foreign", "Upper"]) {
    const f = fixture();
    try {
      f.env.FIXTURE_PROJECT = project;
      const result = run(f, []);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /safe lowercase path component/);
      assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
      assert.equal(
        calls(f).some((args) => args[0] === "compose" || args[0] === "run"),
        false,
      );
    } finally {
      f.cleanup();
    }
  }
});

test("failed label inspection rejects rather than authorizing absence", () => {
  const f = fixture();
  try {
    f.env.FIXTURE_INSPECT_FAILURE = "1";
    const result = run(f, []);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /failed to inspect/);
    assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
  } finally {
    f.cleanup();
  }
});

test("config-only exact comma path and ordinary whole multi-file paths remain authoritative", () => {
  for (const comma of [false, true]) {
    const f = fixture(comma ? "checkout,old" : "checkout");
    try {
      f.env.FIXTURE_WORKDIR = "";
      if (!comma) {
        const other = join(f.temporary, "other.yml");
        writeFileSync(other, "services: {}\n");
        f.env.FIXTURE_CONFIG = `${other},${f.env.FIXTURE_CONFIG}`;
      }
      const result = run(f);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, "historical-old\n");
    } finally {
      f.cleanup();
    }
  }
});

test("ambiguous relevant config labels reject without silently selecting default", () => {
  for (const kind of [
    "comma-root-multi",
    "grouped-path",
    "missing-whole-token",
    "alternate-file",
  ]) {
    const f = fixture(kind === "comma-root-multi" ? "checkout,old" : "checkout");
    try {
      f.env.FIXTURE_WORKDIR = "";
      const other = join(f.temporary, "other.yml");
      writeFileSync(other, "services: {}\n");
      if (kind === "alternate-file") {
        const alternative = join(f.root, "explicit.yml");
        writeFileSync(alternative, "services: {}\n");
        f.env.FIXTURE_CONFIG = alternative;
      } else {
        f.env.FIXTURE_CONFIG = `${other},${f.env.FIXTURE_CONFIG}`;
        if (kind === "grouped-path") {
          mkdirSync(dirname(f.env.FIXTURE_CONFIG), { recursive: true });
          writeFileSync(f.env.FIXTURE_CONFIG, "ambiguous filename");
        }
        if (kind === "missing-whole-token")
          f.env.FIXTURE_CONFIG = `/missing.yml,${f.env.FIXTURE_CONFIG}`;
      }
      const result = run(f, []);
      assert.notEqual(result.status, 0, kind);
      assert.match(result.stderr, /ambiguous Compose configuration ancestry/, kind);
      assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
      f.env.COMPOSE_PROJECT_NAME = "explicit";
      assert.equal(run(f).stdout, "explicit\n");
    } finally {
      f.cleanup();
    }
  }
});

test("capture entry without slash preserves the existing invocation contract", () => {
  const f = fixture();
  try {
    assert.equal(
      run(f, ["--resolve-project"], "capture-legacy-assets.sh", f.scripts).stdout,
      "historical-old\n",
    );
  } finally {
    f.cleanup();
  }
});

test("export preserves literal checkout, trailing LF parent and destination names", () => {
  const f = fixture("checkout|old");
  try {
    writeFileSync(
      join(f.scripts, "capture-legacy-assets.sh"),
      "#!/bin/sh\nif [ \"${1:-}\" = --resolve-project ]; then printf '%s\\n' historical-old; fi\n",
    );
    chmodSync(join(f.scripts, "capture-legacy-assets.sh"), 0o755);
    const parent = join(f.temporary, 'export, "parent\n');
    mkdirSync(parent);
    const result = run(f, [join(parent, "output\n")], join(f.scripts, "export-static-release.sh"));
    assert.equal(result.status, 0, result.stderr);
    const command = calls(f).find((args) => args.includes("publish-export"));
    assert.ok(command.includes(`${parent}:/export`));
    assert.ok(command.includes("/export/output\n"));
    assert.ok(command.includes(`${f.root}/docker-compose.yml`));
  } finally {
    f.cleanup();
  }
});

test("unrepresentable colon export parent rejects before discovery or mutation", () => {
  const f = fixture();
  try {
    const parent = join(f.temporary, "export:parent");
    mkdirSync(parent);
    const result = run(f, [join(parent, "output")], join(f.scripts, "export-static-release.sh"));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /colon cannot be represented/);
    assert.deepEqual(calls(f), []);
    assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
  } finally {
    f.cleanup();
  }
});

test("exact comma scalar rejects all valid partitions including comma-bearing config files", () => {
  for (const grouped of [false, true]) {
    const f = fixture();
    try {
      const prefix = join(f.temporary, "first.yml");
      const middle = join(f.temporary, "middle.yml");
      const firstConfig = grouped ? `${prefix},${middle}` : prefix;
      mkdirSync(dirname(firstConfig), { recursive: true });
      writeFileSync(firstConfig, "services: {}\n");
      assert.equal(existsSync(prefix), !grouped);
      const secondRoot = join(f.temporary, "second");
      mkdirSync(secondRoot);
      writeFileSync(join(secondRoot, "docker-compose.yml"), "services: {}\n");
      const root = `${firstConfig},${secondRoot}`;
      mkdirSync(root, { recursive: true });
      writeFileSync(join(root, "docker-compose.yml"), "services: {}\n");
      f.env.CABADRIVE_REPOSITORY_ROOT = root;
      f.env.FIXTURE_WORKDIR = secondRoot;
      f.env.FIXTURE_CONFIG = `${root}/docker-compose.yml`;
      const result = run(f, []);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /ambiguous Compose configuration ancestry/);
      assert.equal(existsSync(join(root, ".cabadrive-release-handoff")), false);
      f.env.FIXTURE_WORKDIR = root;
      assert.equal(run(f).stdout, "historical-old\n");
    } finally {
      f.cleanup();
    }
  }
});

test("export ancestor alias to colon parent rejects before Docker or capture", () => {
  const f = fixture();
  try {
    const actual = join(f.temporary, "actual:colon");
    mkdirSync(join(actual, "sub"), { recursive: true });
    const alias = join(f.temporary, "alias");
    symlinkSync(actual, alias);
    const result = run(
      f,
      [join(alias, "sub", "output")],
      join(f.scripts, "export-static-release.sh"),
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /colon cannot be represented/);
    assert.deepEqual(calls(f), []);
    assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
  } finally {
    f.cleanup();
  }
});

test("unsupported checkout C0 and DEL reject capture and export before any Docker call", () => {
  for (const control of ["\t", "\n", "\r", "\x01", "\x1f", "\x7f"]) {
    const f = fixture(`checkout${control}old`);
    try {
      for (const [script, args] of [
        ["capture-legacy-assets.sh", ["--resolve-project"]],
        ["capture-legacy-assets.sh", []],
        ["export-static-release.sh", [join(f.temporary, "output")]],
      ]) {
        const result = run(f, args, join(f.scripts, script));
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /unsupported control characters/);
        assert.deepEqual(calls(f), []);
        assert.equal(existsSync(join(f.root, ".cabadrive-release-handoff")), false);
        assert.equal(existsSync(join(f.temporary, "output")), false);
      }
    } finally {
      f.cleanup();
    }
  }
});
