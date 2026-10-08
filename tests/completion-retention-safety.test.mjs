import assert from "node:assert/strict";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";
import {
  createCandidateManifest,
  pinLegacyHandoffCurrent,
  publishAndExportStaticRelease,
  verifyLegacyHandoff,
  writeLegacyHandoffManifest,
} from "../scripts/stage-static-release.mjs";

process.env.CABADRIVE_TEST_KERNEL_LOCK = "in-process";
const stager = new URL("../scripts/stage-static-release.mjs", import.meta.url).pathname;
const capture = new URL("../scripts/capture-legacy-assets.sh", import.meta.url).pathname;
function fixture(callback) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "cabadrive-completion-retention-")));
  try {
    callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
function handoff(root) {
  const parent = join(root, "handoff");
  const legacy = join(parent, "releases", "a");
  mkdirSync(join(legacy, "assets"), { recursive: true });
  writeFileSync(join(legacy, "assets", "old-a.js"), "old exact bytes");
  writeLegacyHandoffManifest({
    legacyRoot: legacy,
    sourceId: "old-container",
    sourceKind: "baked-legacy-root",
  });
  symlinkSync("releases/a", join(parent, "current"));
  return { parent, legacy, current: join(parent, "current") };
}

test("legacy expected identity is checked inside the pinned no-follow authority", () => {
  fixture((root) => {
    const { legacy, current } = handoff(root);
    const expected = { expectedSourceId: "old-container", expectedSourceKind: "baked-legacy-root" };
    assert.equal(verifyLegacyHandoff(legacy, expected).valid, true);
    assert.equal(
      verifyLegacyHandoff(legacy, { ...expected, expectedSourceId: "replacement" }).valid,
      false,
    );
    assert.equal(
      verifyLegacyHandoff(legacy, { ...expected, expectedSourceKind: "different" }).valid,
      false,
    );
    assert.throws(
      () => pinLegacyHandoffCurrent(current, { ...expected, expectedSourceId: "replacement" }),
      /source identity/,
    );
    const result = spawnSync(
      process.execPath,
      [
        stager,
        "legacy-verify",
        "--legacy",
        current,
        "--source-id",
        "replacement",
        "--source-kind",
        "baked-legacy-root",
      ],
      { encoding: "utf8", timeout: 3000 },
    );
    assert.notEqual(result.status, 0);
  });
});

test("source identity authority rejects links, FIFO, wrong types and open-time substitutions promptly", () => {
  for (const field of ["source-id", "source-kind"])
    for (const kind of ["symlink", "dangling", "fifo", "directory", "substitution"]) {
      fixture((root) => {
        const { legacy, current } = handoff(root);
        const target = join(legacy, field);
        const sentinel = join(root, "foreign");
        writeFileSync(sentinel, "external sentinel");
        const contents = readFileSync(target, "utf8");
        if (kind !== "substitution") unlinkSync(target);
        if (kind === "symlink") symlinkSync(sentinel, target);
        if (kind === "dangling") symlinkSync(join(root, "absent"), target);
        if (kind === "fifo") execFileSync("mkfifo", [target]);
        if (kind === "directory") mkdirSync(target);
        const options = {
          expectedSourceId: "old-container",
          expectedSourceKind: "baked-legacy-root",
          onSourceOpen: ({ path }) => {
            if (kind === "substitution" && path === target) {
              renameSync(target, `${target}.original`);
              writeFileSync(target, contents);
            }
          },
        };
        assert.equal(verifyLegacyHandoff(legacy, options).valid, false, `${field}/${kind}`);
        if (kind !== "substitution") {
          const result = spawnSync(
            process.execPath,
            [
              stager,
              "legacy-verify",
              "--legacy",
              current,
              "--source-id",
              "old-container",
              "--source-kind",
              "baked-legacy-root",
            ],
            { encoding: "utf8", timeout: 3000 },
          );
          assert.notEqual(result.status, 0);
          assert.equal(result.error, undefined);
        }
        assert.equal(readFileSync(sentinel, "utf8"), "external sentinel");
      });
    }
});

function generations(root) {
  const generationRoot = join(root, "generations");
  mkdirSync(generationRoot);
  const helper = join(root, "rename-noreplace");
  execFileSync("cc", [
    "-O2",
    "-Wall",
    "-Wextra",
    "-o",
    helper,
    new URL("../scripts/rename-noreplace.c", import.meta.url).pathname,
  ]);
  const releases = ["a", "b", "c", "d"].map((name) => {
    const candidate = join(root, name);
    mkdirSync(join(candidate, "assets"), { recursive: true });
    writeFileSync(join(candidate, "assets", `${name}.js`), `${name} exact`);
    writeFileSync(join(candidate, "index.html"), `${name} shell`);
    writeFileSync(join(candidate, "sw.js"), `${name} worker`);
    return {
      candidate,
      output: join(generationRoot, `site-${createCandidateManifest(candidate).releaseId}`),
      destination: join(root, `export-${name}`),
    };
  });
  const state = join(root, "state");
  const publish = (index, extra = {}) =>
    publishAndExportStaticRelease({
      stateRoot: state,
      generationRoot,
      outputRoot: join(generationRoot, "site"),
      candidateRoot: releases[index].candidate,
      destinationRoot: releases[index].destination,
      renameNoReplaceHelper: helper,
      ...extra,
    });
  publish(0);
  publish(1);
  const oldTree = join(generationRoot, readlinkSync(releases[0].output));
  return {
    generationRoot,
    state,
    publish,
    releases,
    oldTree,
    journal: join(state, "publish-retirement.json"),
  };
}

test("generation retirement survives every journal, unlink, removal and fsync interruption", () => {
  for (const point of [
    "retirement-prepare",
    "retirement-journal-durable",
    "retirement-unlink",
    "retirement-unlink-durable",
    "retirement-remove-entry",
    "retirement-remove-tree",
    "retirement-tree-durable",
    "retirement-clear",
  ]) {
    fixture((root) => {
      const f = generations(root);
      let injected = false;
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (!injected && operation === point) {
                injected = true;
                throw new Error(`injected ${point}`);
              }
            },
          }),
        /injected/,
      );
      assert.equal(injected, true);
      if (!["retirement-clear", "retirement-prepare"].includes(point))
        assert.equal(existsSync(f.journal), true, point);
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
      f.publish(2);
      assert.equal(existsSync(f.oldTree), false, point);
      assert.equal(existsSync(f.journal), false, point);
      assert.equal(
        readdirSync(f.generationRoot).filter((name) => name.startsWith("site-")).length,
        2,
      );
    });
  }
});

test("retirement parent fsync failure after unlink keeps exact retry authority", () => {
  fixture((root) => {
    const f = generations(root);
    let unlinked = false;
    assert.throws(
      () =>
        f.publish(2, {
          onDurabilityOperation: ({ operation, path }) => {
            if (operation === "retirement-unlink") unlinked = true;
            if (unlinked && operation === "fsync-directory" && path === f.generationRoot)
              throw new Error("parent barrier failed");
          },
        }),
      /parent barrier/,
    );
    assert.equal(existsSync(f.journal), true);
    assert.equal(existsSync(f.oldTree), true);
    f.publish(2);
    assert.equal(existsSync(f.oldTree), false);
  });
});

test("retirement rejects malformed or substituted authority and preserves foreign/active/rollback trees", () => {
  for (const mutation of [
    "json",
    "schema",
    "extra",
    "root",
    "output",
    "active",
    "rollback",
    "target",
    "tree-inode",
    "file-inode",
    "extra-file",
    "output-link",
  ]) {
    fixture((root) => {
      const f = generations(root);
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (operation === "retirement-journal-durable") throw new Error("pause");
            },
          }),
        /pause/,
      );
      const foreign = join(f.generationRoot, "foreign-orphan");
      mkdirSync(foreign);
      writeFileSync(join(foreign, "sentinel"), "foreign");
      const record = JSON.parse(readFileSync(f.journal, "utf8"));
      if (mutation === "json") writeFileSync(f.journal, "{");
      if (mutation === "schema") record.schemaVersion = 99;
      if (mutation === "extra") record.foreign = true;
      if (mutation === "root") record.root = root;
      if (mutation === "output") record.output.path = join(f.generationRoot, "unrelated");
      if (mutation === "active") record.output.path = f.releases[2].output;
      if (mutation === "rollback") record.output.path = f.releases[1].output;
      if (mutation === "target") record.target.name = "../foreign-orphan";
      if (mutation === "tree-inode") {
        renameSync(f.oldTree, `${f.oldTree}-original`);
        mkdirSync(f.oldTree);
      }
      if (mutation === "file-inode") {
        const file = join(f.oldTree, "index.html");
        renameSync(file, `${file}.original`);
        writeFileSync(file, "a shell");
      }
      if (mutation === "extra-file") writeFileSync(join(f.oldTree, "foreign"), "foreign");
      if (mutation === "output-link") {
        unlinkSync(f.releases[0].output);
        symlinkSync("foreign-orphan", f.releases[0].output);
      }
      if (!["json", "tree-inode", "file-inode", "extra-file", "output-link"].includes(mutation))
        writeFileSync(f.journal, JSON.stringify(record));
      assert.throws(() => f.publish(2), /retirement|publish generation/);
      assert.equal(readFileSync(join(foreign, "sentinel"), "utf8"), "foreign");
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
      assert.equal(existsSync(f.oldTree), true);
    });
  }
});

test("post-feature container recovers only an independently verified original legacy handoff", () => {
  for (const kind of [
    "valid",
    "absent",
    "corrupt",
    "source-symlink",
    "source-fifo",
    "wrong-current",
    "escaped-current",
    "inspect-failure",
    "label-failure",
  ]) {
    fixture((root) => {
      const h = handoff(root);
      const parent = join(root, ".cabadrive-release-handoff");
      mkdirSync(parent);
      renameSync(h.parent, join(parent, "fixture"));
      const legacy = join(parent, "fixture", "releases", "a");
      const current = join(parent, "fixture", "current");
      const foreign = join(root, "foreign-sentinel");
      writeFileSync(foreign, "foreign intact");
      if (kind === "absent") unlinkSync(current);
      if (kind === "corrupt") writeFileSync(join(legacy, "assets", "old-a.js"), "corrupted");
      if (kind === "source-symlink" || kind === "source-fifo") {
        unlinkSync(join(legacy, "source-id"));
        if (kind === "source-symlink") symlinkSync(foreign, join(legacy, "source-id"));
        else execFileSync("mkfifo", [join(legacy, "source-id")]);
      }
      if (kind === "wrong-current") {
        unlinkSync(current);
        mkdirSync(current);
      }
      if (kind === "escaped-current") {
        unlinkSync(current);
        symlinkSync(root, current);
      }
      const bin = join(root, "bin");
      mkdirSync(bin);
      const log = join(root, "docker.log");
      const docker = join(bin, "docker");
      writeFileSync(
        docker,
        `#!/bin/sh
set -eu
printf '%s\\n' "$*" >>"$CABADRIVE_TEST_DOCKER_LOG"
if [ "$1" = compose ]; then printf '%s\\n' current-runtime-container; exit 0; fi
if [ "$1" = volume ]; then exit 0; fi
if [ "$1" = inspect ]; then
  [ "$CABADRIVE_TEST_CAPTURE_CASE" != inspect-failure ] || exit 42
  printf '%s\\n' sha256:immutable-runtime
  exit 0
fi
if [ "$1" = image ]; then
  [ "$CABADRIVE_TEST_CAPTURE_CASE" != label-failure ] || exit 42
  case "$*" in *sha256:immutable-runtime*) printf '%s\\n' true; exit 0 ;; esac
  printf '%s\\n' 'must not classify mutable tag' >&2; exit 43
fi
if [ "$1" = run ]; then
  case "$*" in
    *legacy-verify*) exec "$CABADRIVE_TEST_NODE" "$CABADRIVE_TEST_STAGER" legacy-verify --legacy "$CABADRIVE_TEST_CURRENT" ;;
    *' verify '*) exit 1 ;;
  esac
fi
printf '%s\\n' 'forbidden source copy or capture' >&2
exit 90
`,
      );
      chmodSync(docker, 0o755);
      const result = spawnSync("sh", [capture], {
        cwd: root,
        encoding: "utf8",
        timeout: 5000,
        env: {
          ...process.env,
          COMPOSE_PROJECT_NAME: "fixture",
          CABADRIVE_REPOSITORY_ROOT: root,
          PATH: `${bin}:${process.env.PATH}`,
          CABADRIVE_TEST_DOCKER_LOG: log,
          CABADRIVE_TEST_CAPTURE_CASE: kind,
          CABADRIVE_TEST_NODE: process.execPath,
          CABADRIVE_TEST_STAGER: stager,
          CABADRIVE_TEST_CURRENT: current,
        },
      });
      assert.equal(result.error, undefined, kind);
      assert.equal(result.status === 0, kind === "valid", `${kind}: ${result.stderr}`);
      assert.equal(readFileSync(foreign, "utf8"), "foreign intact");
      assert.doesNotMatch(
        readFileSync(log, "utf8"),
        /^cp |legacy-write|legacy-publish-pointer|\/state\/assets/m,
      );
      if (kind === "valid") assert.match(result.stdout, /preserved legacy handoff/);
    });
  }
});

test("retirement journal rejects symlinks, FIFO and directories promptly", () => {
  for (const kind of ["symlink", "fifo", "directory"])
    fixture((root) => {
      const f = generations(root);
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (operation === "retirement-journal-durable") throw new Error("pause");
            },
          }),
        /pause/,
      );
      const original = `${f.journal}.original`;
      renameSync(f.journal, original);
      if (kind === "symlink") symlinkSync(original, f.journal);
      if (kind === "fifo") execFileSync("mkfifo", [f.journal]);
      if (kind === "directory") mkdirSync(f.journal);
      const result = spawnSync(
        process.execPath,
        [
          stager,
          "publish-export",
          "--state",
          f.state,
          "--candidate",
          f.releases[2].candidate,
          "--output",
          join(f.generationRoot, "site"),
          "--generation-root",
          f.generationRoot,
          "--destination",
          f.releases[2].destination,
        ],
        {
          encoding: "utf8",
          timeout: 3000,
          env: {
            ...process.env,
            CABADRIVE_RENAME_NOREPLACE_HELPER: join(root, "rename-noreplace"),
          },
        },
      );
      assert.notEqual(result.status, 0);
      assert.equal(result.error, undefined);
      assert.equal(existsSync(f.oldTree), true);
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
    });
});

test("retirement detects substitution between partial removals without deleting the replacement", () => {
  fixture((root) => {
    const f = generations(root);
    const candidate = join(f.oldTree, "index.html");
    let changed = false;
    assert.throws(
      () =>
        f.publish(2, {
          onDurabilityOperation: ({ operation }) => {
            if (!changed && operation === "retirement-remove-entry") {
              changed = true;
              renameSync(candidate, `${candidate}.original`);
              writeFileSync(candidate, "foreign replacement");
            }
          },
        }),
      /retirement/,
    );
    assert.equal(changed, true);
    assert.equal(readFileSync(candidate, "utf8"), "foreign replacement");
    assert.equal(existsSync(f.journal), true);
    assert.throws(() => f.publish(2), /retirement/);
    assert.equal(readFileSync(candidate, "utf8"), "foreign replacement");
  });
});

test("retirement pins journal identity through fsync and mutation callbacks", () => {
  for (const point of [
    "fsync-file",
    "retirement-journal-durable",
    "retirement-unlink-durable",
    "retirement-remove-entry",
    "retirement-tree-durable",
    "retirement-before-clear",
  ])
    fixture((root) => {
      const f = generations(root);
      let replaced = false;
      const foreign = join(root, "foreign-journal");
      writeFileSync(foreign, "foreign journal intact");
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation, path }) => {
              if (
                !replaced &&
                operation === point &&
                (point !== "fsync-file" || path === f.journal)
              ) {
                replaced = true;
                renameSync(f.journal, `${f.journal}.original`);
                symlinkSync(foreign, f.journal);
              }
            },
          }),
        /retirement journal/,
      );
      assert.equal(replaced, true);
      assert.equal(readlinkSync(f.journal), foreign);
      assert.equal(readFileSync(foreign, "utf8"), "foreign journal intact");
      if (!["retirement-tree-durable", "retirement-before-clear"].includes(point))
        assert.equal(existsSync(f.oldTree), true);
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
    });
});

test("next release resumes earlier retirement before changing committed current", () => {
  for (const point of [
    "retirement-journal-durable",
    "retirement-unlink",
    "retirement-remove-entry",
    "retirement-tree-durable",
  ])
    fixture((root) => {
      const f = generations(root);
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (operation === point) throw new Error("pause C");
            },
          }),
        /pause C/,
      );
      f.publish(3);
      assert.equal(existsSync(f.oldTree), false);
      assert.equal(existsSync(f.journal), false);
      assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "d shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
      assert.equal(readFileSync(join(f.releases[3].output, "index.html"), "utf8"), "d shell");
      assert.equal(
        readdirSync(f.generationRoot).filter((name) => name.startsWith("site-")).length,
        2,
      );
    });
});

test("next release rejects changed retirement current or protected topology before publishing", () => {
  for (const mutation of ["current", "active-link", "rollback-link"])
    fixture((root) => {
      const f = generations(root);
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (operation === "retirement-journal-durable") throw new Error("pause C");
            },
          }),
        /pause C/,
      );
      const link =
        mutation === "current"
          ? join(f.state, "current")
          : f.releases[mutation === "active-link" ? 2 : 1].output;
      const target = readlinkSync(link);
      unlinkSync(link);
      symlinkSync(target, link);
      assert.throws(() => f.publish(3), /retirement/);
      assert.equal(existsSync(f.releases[3].output), false);
      assert.equal(existsSync(f.releases[3].destination), false);
      assert.equal(existsSync(f.oldTree), true);
      assert.equal(existsSync(f.journal), true);
    });
});
