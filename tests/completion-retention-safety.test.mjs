import assert from "node:assert/strict";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  lutimesSync,
  linkSync,
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
  stageStaticRelease,
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
  const publish = (index, extra = {}) => {
    try {
      return publishAndExportStaticRelease({
        stateRoot: state,
        generationRoot,
        outputRoot: join(generationRoot, "site"),
        candidateRoot: releases[index].candidate,
        destinationRoot: releases[index].destination,
        renameNoReplaceHelper: helper,
        ...extra,
      });
    } finally {
      const pendingPath = join(state, "publish-pending.json");
      const lineagePath = join(state, "publish-generations.json");
      const readFixtureRecord = (path) => {
        try {
          return lstatSync(path).isFile() ? JSON.parse(readFileSync(path, "utf8")) : null;
        } catch {
          return null;
        }
      };
      const pending = readFixtureRecord(pendingPath);
      const lineage = readFixtureRecord(lineagePath);
      const releaseId = createCandidateManifest(releases[index].candidate).releaseId;
      const destination = extra.destinationRoot || releases[index].destination;
      const published = lineage?.generations.find(
        (entry) => entry.releaseId === releaseId && entry.destination === destination,
      );
      if (pending?.releaseId === releaseId && pending.destination === destination)
        releases[index].output = pending.output;
      else if (published) releases[index].output = published.link.path;
    }
  };
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
  for (const replacement of ["immediate-recreate", "retained-original-inode"])
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
        const original = lstatSync(link, { bigint: true });
        if (replacement === "retained-original-inode")
          renameSync(link, join(root, `displaced-${mutation}`));
        else unlinkSync(link);
        symlinkSync(target, link);
        const changed = lstatSync(link, { bigint: true });
        if (replacement === "retained-original-inode")
          assert.notEqual(
            changed.ino,
            original.ino,
            "replacement must have a distinct allocated inode",
          );
        assert.throws(() => f.publish(3), /retirement/);
        assert.equal(existsSync(f.releases[3].output), false);
        assert.equal(existsSync(f.releases[3].destination), false);
        assert.equal(existsSync(f.oldTree), true);
        assert.equal(existsSync(f.journal), true);
      });
});

test("retirement schema2 requires canonical exact link generations and rejects schema1 unchanged", () => {
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
    const original = JSON.parse(readFileSync(f.journal, "utf8"));
    assert.equal(original.schemaVersion, 2);
    const links = (record) => [record.current, ...record.protected, record.output];
    for (const link of links(original)) {
      for (const field of ["ctimeNs", "birthtimeNs"])
        assert.match(link[field], /^(?:0|[1-9][0-9]*)$/);
    }
    const rejected = (record) => {
      writeFileSync(f.journal, JSON.stringify(record));
      assert.throws(() => f.publish(3), /retirement/);
      assert.equal(existsSync(f.oldTree), true);
      assert.equal(existsSync(f.releases[3].output), false);
      assert.equal(existsSync(f.releases[3].destination), false);
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
      assert.equal(readFileSync(f.journal, "utf8"), JSON.stringify(record));
    };
    const legacy = structuredClone(original);
    legacy.schemaVersion = 1;
    for (const link of links(legacy)) {
      delete link.ctimeNs;
      delete link.birthtimeNs;
    }
    rejected(legacy);
    for (let index = 0; index < 4; index++)
      for (const field of ["ctimeNs", "birthtimeNs"])
        for (const value of [undefined, null, 7, "", "-1", "+1", "01", "1.0"]) {
          const record = structuredClone(original);
          if (value === undefined) delete links(record)[index][field];
          else links(record)[index][field] = value;
          rejected(record);
        }
    writeFileSync(f.journal, JSON.stringify(original));
    f.publish(3);
    assert.equal(existsSync(f.oldTree), false);
    assert.equal(existsSync(f.journal), false);
  });
});

test("retirement link generations stay pinned at callback, partial removal and clear boundaries", () => {
  for (const point of [
    "retirement-journal-durable",
    "retirement-remove-entry",
    "retirement-before-clear",
  ])
    for (const selected of ["current", "active", "rollback", "output"])
      fixture((root) => {
        const f = generations(root);
        let replacementPath;
        let target;
        let remaining;
        let journalBytes;
        let injected = false;
        assert.throws(
          () =>
            f.publish(2, {
              onDurabilityOperation: ({ operation }) => {
                if (operation !== point || injected) return;
                injected = true;
                journalBytes = readFileSync(f.journal, "utf8");
                const record = JSON.parse(journalBytes);
                const authority =
                  selected === "current"
                    ? record.current
                    : selected === "active"
                      ? record.protected[0]
                      : selected === "rollback"
                        ? record.protected[1]
                        : record.output;
                replacementPath = authority.path;
                target = authority.target;
                remaining = existsSync(f.oldTree)
                  ? readdirSync(f.oldTree, { recursive: true }).sort()
                  : null;
                try {
                  renameSync(replacementPath, join(root, `displaced-${selected}`));
                } catch (error) {
                  if (error.code !== "ENOENT") throw error;
                }
                symlinkSync(target, replacementPath);
              },
            }),
          /retirement/,
        );
        assert.equal(injected, true);
        assert.equal(readlinkSync(replacementPath), target);
        assert.equal(readFileSync(f.journal, "utf8"), journalBytes);
        assert.deepEqual(
          existsSync(f.oldTree) ? readdirSync(f.oldTree, { recursive: true }).sort() : null,
          remaining,
        );
        assert.equal(existsSync(f.releases[3].output), false);
        assert.equal(existsSync(f.releases[3].destination), false);
      });
});

function generationLineage(f) {
  return JSON.parse(readFileSync(join(f.state, "publish-generations.json"), "utf8"));
}

test("publication generations separate repeated content, new destinations and exact terminal retries", () => {
  fixture((root) => {
    const f = generations(root);
    const originalA = f.releases[0].output;
    const originalB = f.releases[1].output;
    const before = readFileSync(join(f.state, "publish-generations.json"), "utf8");
    const outputIdentity = lstatSync(originalB, { bigint: true });
    const destinationIdentity = lstatSync(f.releases[1].destination, { bigint: true });
    f.publish(1);
    assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), before);
    assert.equal(lstatSync(originalB, { bigint: true }).ino, outputIdentity.ino);
    assert.equal(
      lstatSync(f.releases[1].destination, { bigint: true }).ino,
      destinationIdentity.ino,
    );
    f.publish(1, { destinationRoot: join(root, "export-b-second") });
    const secondB = generationLineage(f).active;
    assert.notEqual(secondB, originalB);
    assert.equal(generationLineage(f).previous, originalB);
    f.publish(0, { destinationRoot: join(root, "export-a-again") });
    const repeatedA = generationLineage(f).active;
    assert.notEqual(repeatedA, originalA);
    assert.equal(generationLineage(f).previous, secondB);
    f.publish(2);
    assert.equal(generationLineage(f).previous, repeatedA);
    f.publish(3);
    assert.equal(generationLineage(f).previous, f.releases[2].output);
    assert.equal(generationLineage(f).generations.length, 2);
    for (const release of f.releases)
      assert.equal(
        readFileSync(join(release.destination, "index.html"), "utf8"),
        readFileSync(join(release.candidate, "index.html"), "utf8"),
      );
    assert.equal(readFileSync(join(root, "export-b-second", "index.html"), "utf8"), "b shell");
    assert.equal(readFileSync(join(root, "export-a-again", "index.html"), "utf8"), "a shell");
  });
});

test("retirement never obtains ownership from foreign prefix-shaped links or trees", () => {
  fixture((root) => {
    const f = generations(root);
    const foreignTree = join(f.generationRoot, ".site-foreign.publish-review-foreign");
    const foreignLink = join(f.generationRoot, "site-foreign");
    mkdirSync(foreignTree);
    writeFileSync(join(foreignTree, "sentinel"), "foreign exact");
    symlinkSync(".site-foreign.publish-review-foreign", foreignLink);
    const beforeLink = lstatSync(foreignLink, { bigint: true });
    const beforeTree = lstatSync(foreignTree, { bigint: true });
    f.publish(2);
    f.publish(3);
    assert.equal(readFileSync(join(foreignTree, "sentinel"), "utf8"), "foreign exact");
    assert.equal(readlinkSync(foreignLink), ".site-foreign.publish-review-foreign");
    for (const field of ["dev", "ino", "mode", "uid", "gid", "ctimeNs", "mtimeNs", "birthtimeNs"]) {
      assert.equal(lstatSync(foreignLink, { bigint: true })[field], beforeLink[field]);
      assert.equal(lstatSync(foreignTree, { bigint: true })[field], beforeTree[field]);
    }
    assert.equal(generationLineage(f).generations.length, 2);
    assert.equal(generationLineage(f).previous, f.releases[2].output);
  });
});

test("timestamp changes cannot choose or delete a different immediate predecessor", () => {
  for (const name of ["active", "previous"])
    for (const value of ["2000-01-01", "2040-01-01"])
      fixture((root) => {
        const f = generations(root);
        f.publish(2);
        const lineage = generationLineage(f);
        const before = readFileSync(join(f.state, "publish-generations.json"), "utf8");
        const path = lineage[name];
        const original = lstatSync(path, { bigint: true });
        lutimesSync(path, new Date(value), new Date(value));
        assert.notEqual(lstatSync(path, { bigint: true }).ctimeNs, original.ctimeNs);
        assert.throws(() => f.publish(3), /lineage.*link changed/);
        assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), before);
        assert.equal(readFileSync(join(lineage.active, "index.html"), "utf8"), "c shell");
        assert.equal(readFileSync(join(lineage.previous, "index.html"), "utf8"), "b shell");
        assert.equal(existsSync(f.releases[3].destination), false);
      });
});

test("generation lineage promotion resumes exact output/export in a new process at every durable boundary", () => {
  for (const point of [
    "after-output",
    "after-export",
    "before-current-activation",
    "before-publish-journal-clear",
    "generation-lineage-prepared",
    "generation-lineage-promoted",
    "generation-lineage-durable",
    "unlink-publish-pending",
    "generation-lineage-update",
  ])
    fixture((root) => {
      const f = generations(root);
      let injected = false;
      assert.throws(
        () =>
          f.publish(
            2,
            point.startsWith("after-") || point.startsWith("before-")
              ? { faultAt: point }
              : {
                  onDurabilityOperation: ({ operation }) => {
                    if (!injected && operation === point) {
                      injected = true;
                      throw new Error(`pause ${point}`);
                    }
                  },
                },
          ),
        /fault injection|pause/,
      );
      const output = f.releases[2].output;
      const outputIdentity = lstatSync(output, { bigint: true });
      const destinationIdentity = existsSync(f.releases[2].destination)
        ? lstatSync(f.releases[2].destination, { bigint: true })
        : null;
      const options = {
        stateRoot: f.state,
        generationRoot: f.generationRoot,
        outputRoot: join(f.generationRoot, "site"),
        candidateRoot: f.releases[2].candidate,
        destinationRoot: f.releases[2].destination,
        renameNoReplaceHelper: join(root, "rename-noreplace"),
      };
      const child = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `import {publishAndExportStaticRelease} from ${JSON.stringify(stager)};\n` +
            `process.env.CABADRIVE_TEST_KERNEL_LOCK='in-process';\npublishAndExportStaticRelease(${JSON.stringify(options)});`,
        ],
        { encoding: "utf8", timeout: 30000 },
      );
      assert.equal(child.error, undefined, point);
      assert.equal(child.status, 0, `${point}: ${child.stderr}`);
      assert.equal(generationLineage(f).active, output);
      assert.equal(generationLineage(f).previous, f.releases[1].output);
      assert.equal(lstatSync(output, { bigint: true }).ino, outputIdentity.ino);
      if (destinationIdentity)
        assert.equal(
          lstatSync(f.releases[2].destination, { bigint: true }).ino,
          destinationIdentity.ino,
        );
      assert.equal(generationLineage(f).generations.length, 2);
      assert.equal(existsSync(join(f.state, "publish-pending.json")), false);
      assert.equal(existsSync(f.journal), false);
    });
});

test("lineage rejects malformed, missing, linked, FIFO and substituted authority before publication", () => {
  for (const mutation of [
    "schema",
    "extra",
    "root",
    "project",
    "active",
    "previous",
    "duplicate",
    "owned-type",
    "tree-digest",
    "missing",
    "symlink",
    "hardlink",
    "fifo",
    "replacement-after-admission",
  ])
    fixture((root) => {
      const f = generations(root);
      const path = join(f.state, "publish-generations.json");
      const original = readFileSync(path, "utf8");
      const record = JSON.parse(original);
      const foreign = join(root, "foreign-lineage");
      writeFileSync(foreign, original, { mode: 0o600 });
      if (mutation === "schema") record.schemaVersion = 99;
      if (mutation === "extra") record.unknown = true;
      if (mutation === "root") record.root = root;
      if (mutation === "project") record.projectKey = "foreign";
      if (mutation === "active") record.active = f.releases[0].output;
      if (mutation === "previous") record.previous = record.active;
      if (mutation === "duplicate") record.generations.push(record.generations[0]);
      if (mutation === "owned-type") record.generations[0].owned = "true";
      if (mutation === "tree-digest") record.generations[0].treeSha256 = "0".repeat(64);
      if (["missing", "symlink", "hardlink", "fifo"].includes(mutation)) {
        renameSync(path, `${path}.original`);
        if (mutation === "symlink") symlinkSync(foreign, path);
        if (mutation === "hardlink") linkSync(foreign, path);
        if (mutation === "fifo") execFileSync("mkfifo", [path]);
      } else if (mutation !== "replacement-after-admission")
        writeFileSync(path, JSON.stringify(record));
      if (!["missing", "replacement-after-admission"].includes(mutation))
        assert.throws(() =>
          stageStaticRelease({ stateRoot: f.state, candidateRoot: f.releases[2].candidate }),
        );
      assert.throws(() =>
        f.publish(
          2,
          mutation === "replacement-after-admission"
            ? {
                onAfterReadOnlyAdmission: () => {
                  renameSync(path, `${path}.original`);
                  writeFileSync(path, original, { mode: 0o600 });
                },
              }
            : {},
        ),
      );
      assert.equal(existsSync(f.releases[2].destination), false);
      assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[0].output, "index.html"), "utf8"), "a shell");
      assert.equal(readFileSync(join(f.releases[1].output, "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(foreign, "utf8"), original);
    });
});

test("creator-bound publication reservations recover after binding-write failure and reject foreign same-target links", () => {
  for (const mutation of ["untouched", "published-clone", "reserved-clone", "competing-output"])
    fixture((root) => {
      const f = generations(root);
      const pendingPath = join(f.state, "publish-pending.json");
      let injected = false;
      let foreignPath;
      let foreignIdentity;
      let target;
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation, path }) => {
              if (injected) return;
              if (["reserved-clone", "competing-output"].includes(mutation)) {
                if (operation !== "before-output-reservation") return;
                const record = JSON.parse(readFileSync(pendingPath, "utf8"));
                target = record.transactionId;
                foreignPath =
                  mutation === "reserved-clone"
                    ? record.generation.reservation.path
                    : record.output;
                if (mutation === "reserved-clone")
                  renameSync(foreignPath, join(root, "original-reservation"));
                symlinkSync(target, foreignPath);
                foreignIdentity = lstatSync(foreignPath, { bigint: true });
                injected = true;
                return;
              }
              if (operation !== "fsync-file" || !path.endsWith(".next")) return;
              let next;
              try {
                next = JSON.parse(readFileSync(path, "utf8"));
              } catch {
                return;
              }
              if (
                next.operation !== "publish-export" ||
                next.generation?.reservation !== null ||
                !next.generation?.created?.link
              )
                return;
              const prior = JSON.parse(readFileSync(pendingPath, "utf8"));
              if (!prior.generation?.reservation) return;
              injected = true;
              throw new Error("pause reservation binding write");
            },
          }),
        /reservation|occupied/,
      );
      assert.equal(injected, true);
      const pending = JSON.parse(readFileSync(pendingPath, "utf8"));
      const tree = join(f.generationRoot, pending.transactionId);
      assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
      assert.equal(existsSync(f.releases[2].destination), false);
      if (mutation === "untouched") {
        const original = lstatSync(pending.output, { bigint: true });
        const child = spawnSync(
          process.execPath,
          [
            "--input-type=module",
            "-e",
            `import {publishAndExportStaticRelease} from ${JSON.stringify(stager)};process.env.CABADRIVE_TEST_KERNEL_LOCK='in-process';publishAndExportStaticRelease(${JSON.stringify({ stateRoot: f.state, generationRoot: f.generationRoot, outputRoot: join(f.generationRoot, "site"), candidateRoot: f.releases[2].candidate, destinationRoot: f.releases[2].destination, renameNoReplaceHelper: join(root, "rename-noreplace") })});`,
          ],
          { encoding: "utf8", timeout: 30000 },
        );
        assert.equal(child.status, 0, child.stderr);
        assert.equal(lstatSync(pending.output, { bigint: true }).ino, original.ino);
        assert.equal(generationLineage(f).previous, f.releases[1].output);
      } else {
        if (mutation === "published-clone") {
          foreignPath = pending.output;
          target = pending.transactionId;
          renameSync(foreignPath, join(root, "original-published-link"));
          symlinkSync(target, foreignPath);
          foreignIdentity = lstatSync(foreignPath, { bigint: true });
        }
        assert.throws(() => f.publish(2), /reservation|occupied|creator-owned/);
        assert.equal(readlinkSync(foreignPath), target);
        for (const field of ["dev", "ino", "mode", "ctimeNs", "birthtimeNs"])
          assert.equal(lstatSync(foreignPath, { bigint: true })[field], foreignIdentity[field]);
        assert.equal(readFileSync(join(tree, "index.html"), "utf8"), "c shell");
        assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
        assert.equal(existsSync(f.releases[2].destination), false);
      }
    });
});

test("pending lineage promotion rejects escaping paths, forged semantic ownership and malformed fields", () => {
  for (const mutation of [
    "escape",
    "extra",
    "installed",
    "wrong-domain",
    "created-release",
    "created-destination",
    "absent-prior-owned",
  ])
    fixture((root) => {
      const f = generations(root);
      const pendingPath = join(f.state, "publish-pending.json");
      assert.throws(
        () =>
          f.publish(2, {
            onDurabilityOperation: ({ operation }) => {
              if (operation === "generation-lineage-prepared")
                throw new Error("pause prepared lineage");
            },
          }),
        /pause prepared/,
      );
      const pending = JSON.parse(readFileSync(pendingPath, "utf8"));
      const foreign = join(root, "foreign-prepared");
      writeFileSync(foreign, pending.generation.promotion.snapshot.bytes, { mode: 0o600 });
      const before = lstatSync(foreign, { bigint: true });
      const foreignBytes = readFileSync(foreign, "utf8");
      if (mutation === "escape") {
        pending.generation.promotion.temporary = "../foreign-prepared";
        pending.generation.promotion.snapshot.identity = Object.fromEntries(
          Object.keys(pending.generation.promotion.snapshot.identity).map((field) => [
            field,
            before[field].toString(),
          ]),
        );
      }
      if (mutation === "extra") pending.generation.promotion.extra = true;
      if (mutation === "installed") pending.generation.promotion.installed = "false";
      if (mutation === "wrong-domain") {
        const record = JSON.parse(pending.generation.promotion.snapshot.bytes);
        record.projectKey = "foreign";
        pending.generation.promotion.snapshot.bytes = JSON.stringify(record);
      }
      if (mutation === "created-release")
        pending.generation.created.releaseId = createCandidateManifest(
          f.releases[0].candidate,
        ).releaseId;
      if (mutation === "created-destination") pending.generation.created.destination = foreign;
      if (mutation === "absent-prior-owned") {
        renameSync(join(f.state, "publish-generations.json"), join(root, "original-lineage"));
        pending.generation.prior = null;
        pending.generation.promotion = null;
      }
      writeFileSync(pendingPath, JSON.stringify(pending));
      assert.throws(() => f.publish(2), /generation|lineage|promotion/);
      assert.equal(readFileSync(foreign, "utf8"), foreignBytes);
      for (const field of ["dev", "ino", "mode", "uid", "gid", "ctimeNs", "mtimeNs", "birthtimeNs"])
        assert.equal(lstatSync(foreign, { bigint: true })[field], before[field]);
      assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
      assert.equal(readFileSync(join(f.releases[2].output, "index.html"), "utf8"), "c shell");
      assert.equal(readFileSync(join(f.releases[2].destination, "index.html"), "utf8"), "c shell");
    });
});

test("legacy bootstrap protects only the unique old current and never owns unknown generations", () => {
  for (const mode of ["legacy", "ambiguous", "empty-domain"])
    fixture((root) => {
      const f = generations(root);
      const state = join(root, "legacy-state");
      const domain = join(root, "legacy-generations");
      mkdirSync(domain);
      const aManifest = createCandidateManifest(f.releases[0].candidate);
      const oldOutput = join(
        mode === "empty-domain" ? root : domain,
        `site-${aManifest.releaseId}`,
      );
      const oldDestination = join(root, "legacy-export-a");
      const helper = join(root, "rename-noreplace");
      publishAndExportStaticRelease({
        stateRoot: state,
        outputRoot: oldOutput,
        candidateRoot: f.releases[0].candidate,
        destinationRoot: oldDestination,
        renameNoReplaceHelper: helper,
      });
      const originalLink = lstatSync(oldOutput, { bigint: true });
      const foreign = join(domain, ".site-foreign.publish-review-foreign");
      let foreignIdentity;
      const addForeign = () => {
        mkdirSync(foreign);
        writeFileSync(join(foreign, "sentinel"), "foreign old tree");
        symlinkSync(".site-foreign.publish-review-foreign", join(domain, "site-foreign"));
        foreignIdentity = lstatSync(foreign, { bigint: true });
      };
      if (mode !== "empty-domain") addForeign();
      const publish = (index) =>
        publishAndExportStaticRelease({
          stateRoot: state,
          generationRoot: domain,
          outputRoot: join(domain, "site"),
          candidateRoot: f.releases[index].candidate,
          destinationRoot: join(root, `legacy-export-${index}`),
          renameNoReplaceHelper: helper,
        });
      if (mode === "ambiguous") {
        const duplicate = join(domain, `site-${aManifest.releaseId}-duplicate`);
        const duplicateTree = `.${duplicate.split("/").at(-1)}.publish-00000000-0000-4000-8000-000000000001`;
        cpSync(join(domain, readlinkSync(oldOutput)), join(domain, duplicateTree), {
          recursive: true,
        });
        symlinkSync(duplicateTree, duplicate);
        assert.throws(() => publish(1), /ambiguous/);
        assert.equal(existsSync(join(root, "legacy-export-1")), false);
      } else {
        publish(1);
        if (mode === "empty-domain") addForeign();
        const lineage = JSON.parse(readFileSync(join(state, "publish-generations.json"), "utf8"));
        if (mode === "legacy") {
          assert.equal(lineage.previous, oldOutput);
          assert.equal(
            lineage.generations.find((entry) => entry.link.path === oldOutput).owned,
            false,
          );
        } else assert.equal(lineage.previous, null);
        publish(2);
        publish(3);
        assert.equal(
          JSON.parse(readFileSync(join(state, "publish-generations.json"), "utf8")).generations
            .length,
          2,
        );
      }
      assert.equal(lstatSync(oldOutput, { bigint: true }).ino, originalLink.ino);
      assert.equal(readFileSync(join(oldOutput, "index.html"), "utf8"), "a shell");
      assert.equal(readFileSync(join(oldDestination, "index.html"), "utf8"), "a shell");
      assert.equal(readFileSync(join(foreign, "sentinel"), "utf8"), "foreign old tree");
      assert.equal(lstatSync(foreign, { bigint: true }).ctimeNs, foreignIdentity.ctimeNs);
    });
});

test("runtime-only advancement leaves published lineage authoritative for fresh exports", () => {
  fixture((root) => {
    const f = generations(root);
    const publishedB = f.releases[1].output;
    const lineage = readFileSync(join(f.state, "publish-generations.json"), "utf8");
    stageStaticRelease({ stateRoot: f.state, candidateRoot: f.releases[2].candidate });
    assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), lineage);
    f.publish(3);
    assert.equal(generationLineage(f).previous, publishedB);
    assert.equal(readFileSync(join(publishedB, "index.html"), "utf8"), "b shell");
    assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "d shell");
  });
});

test("ordinary runtime stage cannot bypass coordinator pending or retirement authority including final clear", () => {
  for (const point of ["after-output", "after-export", "retirement-unlink", "retirement-clear"])
    fixture((root) => {
      const f = generations(root);
      assert.throws(
        () =>
          f.publish(
            2,
            point.startsWith("after-")
              ? { faultAt: point }
              : {
                  onDurabilityOperation: ({ operation }) => {
                    if (operation === point) throw Error(`pause ${point}`);
                  },
                },
          ),
        /pause|fault injection/,
      );
      const current = readlinkSync(join(f.state, "current"));
      const lineage = readFileSync(join(f.state, "publish-generations.json"), "utf8");
      const pendingPath = join(f.state, "publish-pending.json");
      const pending = existsSync(pendingPath) ? readFileSync(pendingPath, "utf8") : null;
      if (point === "retirement-clear") {
        assert.equal(existsSync(f.journal), false);
        assert.notEqual(generationLineage(f).retiring, null);
      }
      for (const options of [
        {},
        {
          lockHeld: true,
          expectedManifest: createCandidateManifest(f.releases[3].candidate),
          finalRevalidate: () => {},
        },
      ])
        assert.throws(
          () =>
            stageStaticRelease({
              stateRoot: f.state,
              candidateRoot: f.releases[3].candidate,
              ...options,
            }),
          /cannot bypass/,
        );
      assert.equal(readlinkSync(join(f.state, "current")), current);
      assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), lineage);
      if (pending) assert.equal(readFileSync(pendingPath, "utf8"), pending);
      f.publish(point.startsWith("after-") ? 2 : 3);
      assert.equal(generationLineage(f).retiring, null);
    });
});

test("published receipt rejects malformed identity while fresh exports preserve externally removed destinations", () => {
  for (const mutation of ["schema", "extra", "device", "inode", "missing", "removed-destination"])
    fixture((root) => {
      const f = generations(root);
      const receiptPath = readdirSync(f.state)
        .filter((name) => name.startsWith("export-receipt-"))
        .map((name) => join(f.state, name))
        .find(
          (path) =>
            JSON.parse(readFileSync(path, "utf8")).destination === f.releases[1].destination,
        );
      const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
      const before = readFileSync(join(f.state, "publish-generations.json"), "utf8");
      if (mutation === "removed-destination") {
        rmSync(f.releases[1].destination, { recursive: true });
        f.publish(2);
        assert.equal(generationLineage(f).previous, f.releases[1].output);
        assert.equal(
          readFileSync(join(f.releases[2].destination, "index.html"), "utf8"),
          "c shell",
        );
      } else {
        if (mutation === "schema") receipt.schemaVersion = 99;
        if (mutation === "extra") receipt.foreign = true;
        if (mutation === "device") receipt.device = "01";
        if (mutation === "inode") receipt.inode = 1;
        if (mutation === "missing") delete receipt.device;
        writeFileSync(receiptPath, JSON.stringify(receipt));
        assert.throws(() => f.publish(2), /ownership receipt/);
        assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), before);
        assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
        assert.equal(existsSync(f.releases[2].destination), false);
      }
    });
});

test("creator rename authority fails closed when the filesystem cannot supply birth generation", () => {
  for (const mode of [
    "reservation-create",
    "reservation-admit",
    "prepared-create",
    "prepared-admit",
    "retirement-create",
  ])
    fixture((root) => {
      const f = generations(root);
      const pendingPath = join(f.state, "publish-pending.json");
      if (mode.endsWith("admit")) {
        const point = mode.startsWith("reservation")
          ? "before-output-reservation"
          : "generation-lineage-prepared";
        assert.throws(
          () =>
            f.publish(2, {
              onDurabilityOperation: ({ operation }) => {
                if (operation === point) throw Error("pause birth admission");
              },
            }),
          /pause birth/,
        );
        const pending = JSON.parse(readFileSync(pendingPath, "utf8"));
        if (mode.startsWith("reservation")) {
          pending.generation.reservation.birthtimeNs = "0";
          pending.generation.created.link.birthtimeNs = "0";
        } else pending.generation.promotion.snapshot.identity.birthtimeNs = "0";
        writeFileSync(pendingPath, JSON.stringify(pending));
      }
      const before = readFileSync(join(f.state, "publish-generations.json"), "utf8");
      const options = {
        stateRoot: f.state,
        generationRoot: f.generationRoot,
        outputRoot: join(f.generationRoot, "site"),
        candidateRoot: f.releases[2].candidate,
        destinationRoot: f.releases[2].destination,
        renameNoReplaceHelper: join(root, "rename-noreplace"),
      };
      const child = spawnSync(
        process.execPath,
        [
          "--input-type=module",
          "-e",
          `
        import fs from 'node:fs'; import assert from 'node:assert/strict'; import {syncBuiltinESMExports} from 'node:module';
        import {publishAndExportStaticRelease} from ${JSON.stringify(stager)};
        process.env.CABADRIVE_TEST_KERNEL_LOCK='in-process';
        const mode=${JSON.stringify(mode)};const descriptors=new Map();let observed=0;let creatorCount=0,unprovablePath;
        const originalOpen=fs.openSync,originalStat=fs.lstatSync,originalFstat=fs.fstatSync;
        const originalWrite=fs.writeFileSync;
        const selected=path=>mode==='retirement-create'?(unprovablePath!==undefined&&path===unprovablePath):mode.startsWith('reservation')?String(path).includes('.reserve-'):String(path).split('/').at(-1).startsWith('.publish-generations-');
        const zero=stat=>{observed++;return new Proxy(stat,{get(target,key){return key==='birthtimeNs'?0n:Reflect.get(target,key);}});};
        fs.openSync=(path,...args)=>{const fd=originalOpen(path,...args);descriptors.set(fd,path);if(mode==='retirement-create'&&String(path).split('/').at(-1).startsWith('.publish-generations-')&&(args[0]&fs.constants.O_CREAT)&&++creatorCount===2)unprovablePath=path;return fd;};
        fs.lstatSync=(path,...args)=>{const stat=originalStat(path,...args);return args[0]?.bigint&&selected(path)?zero(stat):stat;};
        fs.fstatSync=(fd,...args)=>{const stat=originalFstat(fd,...args);return args[0]?.bigint&&selected(descriptors.get(fd))?zero(stat):stat;};
        fs.writeFileSync=(path,...args)=>{if(['prepared-create','retirement-create'].includes(mode)&&selected(descriptors.get(path)))throw Error('unprovable creator must reject BEFORE writing prepared bytes');return originalWrite(path,...args);};
        syncBuiltinESMExports();
        assert.throws(()=>publishAndExportStaticRelease(${JSON.stringify(options)}),/birth generation|reservation authority|promotion authority/);
        if(mode.endsWith('create'))assert.ok(observed>0,'adapter must actually expose zero birthtime on the creator inode');
      `,
        ],
        { encoding: "utf8", timeout: 30000 },
      );
      assert.equal(child.error, undefined, mode);
      assert.equal(child.status, 0, `${mode}: ${child.stderr}`);
      if (mode === "retirement-create") {
        const committed = generationLineage(f);
        assert.equal(committed.retiring, null);
        assert.equal(committed.generations.length, 3);
        assert.equal(readFileSync(join(committed.active, "index.html"), "utf8"), "c shell");
        assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "c shell");
        assert.equal(existsSync(f.oldTree), true);
        assert.equal(existsSync(f.releases[1].output), true);
        assert.equal(existsSync(f.journal), false);
      } else {
        assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), before);
        assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "b shell");
      }
      assert.equal(readFileSync(join(f.releases[0].destination, "index.html"), "utf8"), "a shell");
      assert.equal(readFileSync(join(f.releases[1].destination, "index.html"), "utf8"), "b shell");
      if (mode.startsWith("reservation"))
        assert.equal(existsSync(f.releases[2].destination), false);
    });
});

test("generation and runtime admission share the existing effective Compose project identity", () => {
  const previous = process.env.CABADRIVE_COMPOSE_PROJECT;
  try {
    for (const selected of ["cabadrive", "r2j-effective-project"])
      fixture((root) => {
        if (selected === "cabadrive") delete process.env.CABADRIVE_COMPOSE_PROJECT;
        else process.env.CABADRIVE_COMPOSE_PROJECT = selected;
        const f = generations(root);
        assert.equal(generationLineage(f).projectKey, selected);
        stageStaticRelease({
          stateRoot: f.state,
          candidateRoot: f.releases[2].candidate,
          projectKey: selected,
        });
        f.publish(3, { projectKey: selected });
        const lineage = readFileSync(join(f.state, "publish-generations.json"), "utf8");
        f.publish(3, { projectKey: selected });
        assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), lineage);
        assert.throws(() =>
          stageStaticRelease({
            stateRoot: f.state,
            candidateRoot: f.releases[0].candidate,
            projectKey: "foreign-project",
          }),
        );
        assert.throws(() =>
          f.publish(0, {
            projectKey: "foreign-project",
            destinationRoot: join(root, "foreign-export"),
          }),
        );
        assert.equal(readFileSync(join(f.state, "publish-generations.json"), "utf8"), lineage);
        assert.equal(readFileSync(join(f.state, "current", "index.html"), "utf8"), "d shell");
        assert.equal(existsSync(join(root, "foreign-export")), false);
      });
  } finally {
    if (previous === undefined) delete process.env.CABADRIVE_COMPOSE_PROJECT;
    else process.env.CABADRIVE_COMPOSE_PROJECT = previous;
  }
});
