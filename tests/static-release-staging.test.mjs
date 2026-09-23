import assert from "node:assert/strict";
import {
  existsSync,
  lstatSync,
  linkSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  buildStaticPublish,
  createCandidateManifest,
  stageStaticRelease,
  verifyCommittedState,
  verifyCandidateManifest,
  verifyLegacyHandoff,
  publishLegacyHandoffPointer,
  writeLegacyHandoffManifest,
} from "../scripts/stage-static-release.mjs";

process.env.CABADRIVE_TEST_KERNEL_LOCK = "in-process";

function withFixture(callback) {
  const root = join(tmpdir(), `cabadrive-release-${process.pid}-${Date.now()}-${Math.random()}`);
  mkdirSync(root, { recursive: true });
  try {
    callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function release(root, name, assets, shell = `<!doctype html><title>${name}</title>`) {
  const output = join(root, name);
  mkdirSync(join(output, "assets"), { recursive: true });
  for (const [path, bytes] of Object.entries(assets)) {
    const target = join(output, "assets", path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, bytes);
  }
  writeFileSync(join(output, "index.html"), shell);
  writeFileSync(join(output, "sw.js"), `self.release = ${JSON.stringify(name)};`);
  return output;
}

function currentShell(state) {
  return readFileSync(join(state, readlinkSync(join(state, "current")), "index.html"), "utf8");
}

function legacyHandoff(root, sourceId, assets) {
  mkdirSync(join(root, "assets"), { recursive: true });
  for (const [path, bytes] of Object.entries(assets)) {
    const target = join(root, "assets", path);
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, bytes);
  }
  writeLegacyHandoffManifest({
    legacyRoot: root,
    sourceId,
    sourceKind: "baked-legacy-root",
  });
  return root;
}

function snapshotState(state) {
  const current = readlinkSync(join(state, "current"));
  const releases = Object.fromEntries(
    ["assets", "releases", "metadata"].flatMap((part) => {
      const root = join(state, part);
      const visit = (directory, prefix = "") =>
        readdirSync(directory)
          .sort()
          .flatMap((name) => {
            const path = join(directory, name);
            const relative = prefix ? `${prefix}/${name}` : name;
            const stat = lstatSync(path);
            return stat.isDirectory()
              ? visit(path, relative)
              : [
                  [
                    `${part}/${relative}`,
                    stat.isSymbolicLink() ? readlinkSync(path) : readFileSync(path, "utf8"),
                  ],
                ];
          });
      return visit(root);
    }),
  );
  return { current, releases };
}

test("canonical manifest is ordinal, complete and digest-backed", () => {
  withFixture((root) => {
    const candidate = release(root, "candidate", { "z.js": "z", "ä.js": "umlaut" });
    const manifest = createCandidateManifest(candidate);

    assert.deepEqual(
      manifest.assets.map((entry) => entry.path),
      ["z.js", "ä.js"],
      "paths use stable ordinal code-point order rather than locale collation",
    );
    assert.equal(manifest.mutable.map((entry) => entry.path).join(","), "index.html,sw.js");
    assert.match(manifest.releaseId, /^[a-f0-9]{64}$/);
    assert.doesNotThrow(() => verifyCandidateManifest(candidate, manifest));
  });
});

test("stage appends A then B before atomically selecting B and is idempotent", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a-lazy.js": "A lazy", "shared.css": "same" });
    const b = release(root, "b", { "b-main.js": "B main", "shared.css": "same" });

    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));
    stageStaticRelease({ stateRoot: state, candidateRoot: b });

    assert.equal(readFileSync(join(state, "assets/a-lazy.js"), "utf8"), "A lazy");
    assert.equal(readFileSync(join(state, "assets/b-main.js"), "utf8"), "B main");
    assert.match(currentShell(state), /b/);
    assert.notEqual(readlinkSync(join(state, "current")), aCurrent);

    const retry = stageStaticRelease({ stateRoot: state, candidateRoot: b });
    assert.equal(retry.changed, false);
    assert.match(currentShell(state), /b/);
  });
});

test("direct staging rejects candidate/state overlap before state layout mutation", () => {
  withFixture((root) => {
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    const beforeManifest = createCandidateManifest(candidate);
    const beforeRoot = readdirSync(root).sort();
    for (const stateRoot of [candidate, join(candidate, "nested-state"), root]) {
      assert.throws(
        () => stageStaticRelease({ stateRoot, candidateRoot: candidate }),
        /candidate and release state must not overlap/i,
      );
      assert.deepEqual(createCandidateManifest(candidate), beforeManifest);
      assert.deepEqual(readdirSync(root).sort(), beforeRoot);
      assert.equal(existsSync(join(candidate, "nested-state")), false);
    }
  });
});

test("direct staging refuses malformed current pointers without mutation", () => {
  withFixture((root) => {
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    for (const [name, install, pattern] of [
      ["non-symlink", (current) => writeFileSync(current, "not a link"), /not a symlink/i],
      ["unsafe", (current) => symlinkSync("../outside", current), /unsafe/i],
      ["dangling", (current) => symlinkSync(`releases/${"0".repeat(64)}`, current), /dangling/i],
    ]) {
      const state = join(root, `${name}-state`);
      stageStaticRelease({ stateRoot: state, candidateRoot: a });
      const current = join(state, "current");
      unlinkSync(current);
      install(current);
      const currentEntry = lstatSync(current);
      const currentValue = currentEntry.isSymbolicLink()
        ? readlinkSync(current)
        : readFileSync(current, "utf8");
      const retainedA = readFileSync(join(state, "assets", "a.js"), "utf8");
      assert.throws(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }), pattern);
      const afterEntry = lstatSync(current);
      assert.equal(afterEntry.isSymbolicLink(), currentEntry.isSymbolicLink());
      assert.equal(
        afterEntry.isSymbolicLink() ? readlinkSync(current) : readFileSync(current, "utf8"),
        currentValue,
      );
      assert.equal(readFileSync(join(state, "assets", "a.js"), "utf8"), retainedA);
    }
  });
});

test("collision, unsafe input and injected partial stages preserve A", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "same.js": "A" });
    const collision = release(root, "collision", { "same.js": "B" }, "B shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const before = currentShell(state);

    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: collision }),
      /collision/i,
    );
    assert.equal(currentShell(state), before);
    assert.equal(readFileSync(join(state, "assets/same.js"), "utf8"), "A");

    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: b, faultAt: "before-current" }),
      /fault injection/i,
    );
    assert.equal(currentShell(state), before);
    assert.equal(existsSync(join(state, "assets/b.js")), true, "unreferenced bytes are safe");
    stageStaticRelease({ stateRoot: state, candidateRoot: b });
    assert.match(currentShell(state), /B shell/);

    const unsafe = release(root, "unsafe", { "ok.js": "ok" });
    symlinkSync(join(unsafe, "assets/ok.js"), join(unsafe, "assets/link.js"));
    assert.throws(() => createCandidateManifest(unsafe), /symlink/i);
  });
});

test("legacy assets seed the append-only namespace and stay byte-identical", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const legacy = legacyHandoff(join(root, "legacy"), "legacy-image", {
      "a-lazy-old.js": "legacy exact bytes",
    });
    const b = release(root, "b", { "b.js": "B" });

    stageStaticRelease({ stateRoot: state, candidateRoot: b, legacyRoot: legacy });

    assert.equal(readFileSync(join(state, "assets/a-lazy-old.js"), "utf8"), "legacy exact bytes");
  });
});

test("a late authoritative legacy union is promoted before an idempotent candidate return", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: b });
    const legacy = legacyHandoff(join(root, "legacy"), "legacy-A", { "a-lazy.js": "A" });

    const retry = stageStaticRelease({ stateRoot: state, candidateRoot: b, legacyRoot: legacy });
    assert.equal(retry.changed, false);
    assert.equal(readFileSync(join(state, "assets/a-lazy.js"), "utf8"), "A");

    const collision = legacyHandoff(join(root, "collision"), "legacy-collision", {
      "b.js": "not B",
    });
    const before = snapshotState(state);
    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: b, legacyRoot: collision }),
      /collision/i,
    );
    assert.deepEqual(snapshotState(state), before);
  });
});

test("a malformed legacy handoff is never treated as authoritative", () => {
  withFixture((root) => {
    const legacy = join(root, "legacy");
    mkdirSync(join(legacy, "assets"), { recursive: true });
    writeFileSync(join(legacy, "assets/a.js"), "A");
    assert.equal(verifyLegacyHandoff(legacy).valid, false);
    const b = release(root, "b", { "b.js": "B" });
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: join(root, "state"),
          candidateRoot: b,
          legacyRoot: legacy,
        }),
      /not authoritative/i,
    );
  });
});

test("every supplied legacy handoff is mandatory and fails before state mutation", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const before = snapshotState(state);

    const missingAssets = join(root, "missing-assets");
    mkdirSync(missingAssets);
    const wrongType = join(root, "wrong-type");
    mkdirSync(wrongType);
    writeFileSync(join(wrongType, "assets"), "not a directory");
    const incomplete = legacyHandoff(join(root, "incomplete"), "legacy", {
      "lost.js": "lost",
    });
    unlinkSync(join(incomplete, "assets", "lost.js"));
    const external = join(root, "external-assets");
    mkdirSync(external);
    writeFileSync(join(external, "sentinel"), "external");
    const hostile = join(root, "hostile");
    mkdirSync(hostile);
    symlinkSync(external, join(hostile, "assets"));

    for (const legacyRoot of [
      join(root, "absent-handoff"),
      missingAssets,
      wrongType,
      incomplete,
      hostile,
    ]) {
      assert.throws(
        () => stageStaticRelease({ stateRoot: state, candidateRoot: b, legacyRoot }),
        /legacy handoff is not authoritative/i,
      );
      assert.deepEqual(snapshotState(state), before);
      assert.equal(existsSync(join(state, "publish-pending.json")), false);
    }
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "external");

    assert.doesNotThrow(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }));
    assert.match(currentShell(state), /B shell/);
  });
});

test("static publish emits retained assets with only the B mutable shell", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "publish");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output });

    assert.equal(readFileSync(join(output, "assets/a.js"), "utf8"), "A");
    assert.equal(readFileSync(join(output, "assets/b.js"), "utf8"), "B");
    assert.equal(readFileSync(join(output, "index.html"), "utf8"), "B shell");
    const exactRetry = buildStaticPublish({
      stateRoot: state,
      candidateRoot: b,
      outputRoot: output,
    });
    assert.equal(exactRetry.changed, false);
  });
});

test("static publish rejects candidate/output overlap before state mutation", () => {
  withFixture((root) => {
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    for (const outputRoot of [candidate, join(candidate, "nested-output"), root]) {
      const state = join(root, `state-${Math.random()}`);
      assert.throws(
        () => buildStaticPublish({ stateRoot: state, candidateRoot: candidate, outputRoot }),
        /must not overlap/i,
      );
      assert.equal(existsSync(state), false);
      assert.equal(existsSync(join(candidate, "nested-output")), false);
    }
  });
});

test("static publish rejects state/output overlap before either path is mutated", () => {
  withFixture((root) => {
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    const cases = [
      {
        stateRoot: join(root, "state-with-output"),
        outputRoot: join(root, "state-with-output", "assets", "site"),
      },
      { stateRoot: join(root, "same"), outputRoot: join(root, "same") },
      {
        stateRoot: join(root, "output-with-state", "state"),
        outputRoot: join(root, "output-with-state"),
      },
    ];
    for (const { stateRoot, outputRoot } of cases) {
      assert.throws(
        () => buildStaticPublish({ stateRoot, candidateRoot: candidate, outputRoot }),
        /state and static publish output must not overlap/i,
      );
      assert.equal(existsSync(stateRoot), false);
      assert.equal(existsSync(outputRoot), false);
    }
  });
});

test("static publish rejects candidate/state overlap before state layout mutation", () => {
  withFixture((root) => {
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    const outputRoot = join(root, "output");
    const beforeManifest = createCandidateManifest(candidate);
    const beforeRoot = readdirSync(root).sort();
    for (const stateRoot of [candidate, join(candidate, "nested-state"), root]) {
      assert.throws(
        () => buildStaticPublish({ stateRoot, candidateRoot: candidate, outputRoot }),
        /candidate and release state must not overlap/i,
      );
      assert.deepEqual(createCandidateManifest(candidate), beforeManifest);
      assert.deepEqual(readdirSync(root).sort(), beforeRoot);
      assert.equal(existsSync(join(candidate, "nested-state")), false);
      assert.equal(existsSync(outputRoot), false);
    }
  });
});

test("static publish writes and verifies output before B activation and resumes only its exact journal", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "publish");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    assert.equal(readlinkSync(join(state, "current")), aCurrent, "A stays current after output");
    assert.equal(readFileSync(join(output, "index.html"), "utf8"), "B shell");
    assert.equal(readFileSync(join(output, "assets/a.js"), "utf8"), "A");
    assert.equal(existsSync(join(state, "publish-pending.json")), true);

    buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output });
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);

    const state2 = join(root, "state-pre-rename");
    const output2 = join(root, "publish-pre-rename");
    stageStaticRelease({ stateRoot: state2, candidateRoot: a });
    const before = readlinkSync(join(state2, "current"));
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state2,
          candidateRoot: b,
          outputRoot: output2,
          faultAt: "before-output-rename",
        }),
      /fault injection/i,
    );
    assert.equal(readlinkSync(join(state2, "current")), before);
    assert.equal(existsSync(output2), false, "failed preparation exposes no output");
    assert.equal(existsSync(join(state2, "publish-pending.json")), true);
    buildStaticPublish({ stateRoot: state2, candidateRoot: b, outputRoot: output2 });
    assert.match(currentShell(state2), /B shell/);
    assert.equal(existsSync(join(state2, "publish-pending.json")), false);
  });
});

test("static publish recovers only an exact durable pre-rename temporary transaction", () => {
  withFixture((root) => {
    const a = release(root, "pre-a", { "a.js": "A" }, "A shell");
    const b = release(root, "pre-b", { "b.js": "B" }, "B shell");
    const c = release(root, "pre-c", { "c.js": "C" }, "C shell");
    const crash = (name) => {
      const state = join(root, `${name}-state`);
      const output = join(root, `${name}-output`);
      stageStaticRelease({ stateRoot: state, candidateRoot: a });
      assert.throws(
        () =>
          buildStaticPublish({
            stateRoot: state,
            candidateRoot: b,
            outputRoot: output,
            faultAt: "crash-before-output-rename",
          }),
        /crash-before-output-rename/i,
      );
      const pendingPath = join(state, "publish-pending.json");
      const pendingBytes = readFileSync(pendingPath, "utf8");
      const pending = JSON.parse(pendingBytes);
      const temporary = join(root, pending.transactionId);
      assert.equal(existsSync(output), false);
      assert.equal(lstatSync(temporary).isDirectory(), true);
      return { state, output, pendingPath, pendingBytes, pending, temporary };
    };
    const unchanged = (fixture, before) => {
      assert.deepEqual(snapshotState(fixture.state), before);
      assert.equal(readFileSync(fixture.pendingPath, "utf8"), fixture.pendingBytes);
    };

    const exact = crash("exact");
    const trace = [];
    buildStaticPublish({
      stateRoot: exact.state,
      candidateRoot: b,
      outputRoot: exact.output,
      onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
    });
    const temporarySync = trace.findIndex(
      (entry) => entry.startsWith("fsync-file:") && entry.includes(exact.pending.transactionId),
    );
    const outputRename = trace.findIndex((entry) => entry.startsWith("rename-output:"));
    assert.ok(temporarySync >= 0 && temporarySync < outputRename);
    assert.equal(existsSync(exact.temporary), false);
    assert.equal(existsSync(exact.pendingPath), false);
    assert.equal(readFileSync(join(exact.output, "index.html"), "utf8"), "B shell");
    assert.match(currentShell(exact.state), /B shell/);

    const unrelated = crash("unrelated-orphan");
    const unrelatedOrphan = join(root, ".unrelated-orphan-output.publish-old-attempt");
    mkdirSync(unrelatedOrphan);
    writeFileSync(join(unrelatedOrphan, "sentinel"), "leave unrelated recovery evidence alone");
    assert.doesNotThrow(() =>
      buildStaticPublish({
        stateRoot: unrelated.state,
        candidateRoot: b,
        outputRoot: unrelated.output,
      }),
    );
    assert.equal(
      readFileSync(join(unrelatedOrphan, "sentinel"), "utf8"),
      "leave unrelated recovery evidence alone",
    );

    const missing = crash("missing");
    const missingBefore = snapshotState(missing.state);
    rmSync(missing.temporary, { recursive: true, force: true });
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: missing.state,
          candidateRoot: b,
          outputRoot: missing.output,
        }),
      /no exact temporary directory/i,
    );
    unchanged(missing, missingBefore);

    const mutated = crash("mutated");
    const mutatedBefore = snapshotState(mutated.state);
    writeFileSync(join(mutated.temporary, "extra.js"), "foreign");
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: mutated.state,
          candidateRoot: b,
          outputRoot: mutated.output,
        }),
      /does not match pending journal/i,
    );
    unchanged(mutated, mutatedBefore);

    const linked = crash("linked");
    const linkedBefore = snapshotState(linked.state);
    const external = join(root, "external-transaction");
    mkdirSync(external);
    writeFileSync(join(external, "sentinel"), "untouched");
    rmSync(linked.temporary, { recursive: true, force: true });
    symlinkSync(external, linked.temporary);
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: linked.state,
          candidateRoot: b,
          outputRoot: linked.output,
        }),
      /no exact temporary directory/i,
    );
    unchanged(linked, linkedBefore);
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "untouched");

    const escaped = crash("escaped");
    const escapedBefore = snapshotState(escaped.state);
    const escapedJournal = { ...escaped.pending, transactionId: "../foreign" };
    writeFileSync(escaped.pendingPath, `${JSON.stringify(escapedJournal)}\n`);
    escaped.pendingBytes = readFileSync(escaped.pendingPath, "utf8");
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: escaped.state,
          candidateRoot: b,
          outputRoot: escaped.output,
        }),
      /no matching pre-output transaction/i,
    );
    unchanged(escaped, escapedBefore);

    const occupied = crash("occupied");
    const occupiedBefore = snapshotState(occupied.state);
    mkdirSync(occupied.output);
    writeFileSync(join(occupied.output, "sentinel"), "user");
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: occupied.state,
          candidateRoot: b,
          outputRoot: occupied.output,
        }),
      /exact pending transaction/i,
    );
    unchanged(occupied, occupiedBefore);
    assert.equal(readFileSync(join(occupied.output, "sentinel"), "utf8"), "user");

    const candidateDrift = crash("candidate-drift");
    const candidateBefore = snapshotState(candidateDrift.state);
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: candidateDrift.state,
          candidateRoot: c,
          outputRoot: candidateDrift.output,
        }),
      /no matching pre-output transaction/i,
    );
    unchanged(candidateDrift, candidateBefore);

    const stateDrift = crash("state-drift");
    stageStaticRelease({ stateRoot: stateDrift.state, candidateRoot: c });
    const afterC = snapshotState(stateDrift.state);
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: stateDrift.state,
          candidateRoot: b,
          outputRoot: stateDrift.output,
        }),
      /no matching pre-output transaction/i,
    );
    unchanged(stateDrift, afterC);
    assert.match(currentShell(stateDrift.state), /C shell/);
  });
});

test("a visible prepared journal preserves its exact temporary when its directory barrier fails", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    let injected = false;

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          onDurabilityOperation: ({ operation, path }) => {
            if (
              !injected &&
              operation === "fsync-directory" &&
              path === realpathSync(state) &&
              existsSync(join(state, "publish-pending.json"))
            ) {
              injected = true;
              throw new Error("publish journal directory barrier failed");
            }
          },
        }),
      /journal directory barrier failed/i,
    );
    const pending = JSON.parse(readFileSync(join(state, "publish-pending.json"), "utf8"));
    const temporary = join(root, pending.transactionId);
    assert.equal(pending.phase, "prepared");
    assert.equal(lstatSync(temporary).isDirectory(), true);
    assert.equal(existsSync(output), false);

    buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output });
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(temporary), false);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);
  });
});

test("a durable output retry finishes its exact journalled partial asset promotion", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "nested/b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-asset-rename",
        }),
      /fault injection/i,
    );
    assert.match(readFileSync(join(output, "index.html"), "utf8"), /B shell/);
    assert.equal(readlinkSync(join(state, "current")), aCurrent);
    assert.equal(existsSync(join(state, "publish-pending.json")), true);
    assert.equal(existsSync(join(state, "retained-assets-pending.json")), true);

    assert.doesNotThrow(() =>
      buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
    );
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);
    assert.equal(existsSync(join(state, "retained-assets-pending.json")), false);
  });
});

test("publish never activates a candidate changed after its output journal is durable", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    let mutated = false;
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          onLockOperation: ({ operation }) => {
            if (!mutated && operation === "lock-acquired") {
              mutated = true;
              writeFileSync(join(b, "index.html"), "C shell");
            }
          },
        }),
      /candidate inventory changed since static publish journal/i,
    );
    assert.equal(mutated, true);
    assert.equal(readlinkSync(join(state, "current")), aCurrent);
    assert.match(readFileSync(join(output, "index.html"), "utf8"), /B shell/);
    writeFileSync(join(b, "index.html"), "B shell");
    assert.doesNotThrow(() =>
      buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
    );
    assert.match(currentShell(state), /B shell/);
  });
});

test("initial static publish and post-current journal cleanup both recover exactly", () => {
  withFixture((root) => {
    const initialState = join(root, "initial-state");
    const initialOutput = join(root, "initial-output");
    const a = release(root, "initial-a", { "a.js": "A" }, "A shell");

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: initialState,
          candidateRoot: a,
          outputRoot: initialOutput,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    const initialPending = JSON.parse(
      readFileSync(join(initialState, "publish-pending.json"), "utf8"),
    );
    assert.equal(initialPending.priorCurrentReleaseId, null);
    assert.doesNotThrow(() =>
      buildStaticPublish({
        stateRoot: initialState,
        candidateRoot: a,
        outputRoot: initialOutput,
      }),
    );
    assert.match(currentShell(initialState), /A shell/);
    assert.equal(existsSync(join(initialState, "publish-pending.json")), false);

    const state = join(root, "state");
    const output = join(root, "output");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "before-publish-journal-clear",
        }),
      /fault injection/i,
    );
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), true);
    assert.doesNotThrow(() =>
      buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
    );
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);
  });
});

test("an unlink-before-directory-fsync cleanup fault retries only the exact committed publish", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "durability:unlink-publish-pending",
        }),
      /unlink-publish-pending/i,
    );
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);

    const trace = [];
    const retried = buildStaticPublish({
      stateRoot: state,
      candidateRoot: b,
      outputRoot: output,
      onDurabilityOperation: (event) => trace.push(event),
    });
    assert.equal(retried.changed, false);
    assert.ok(
      trace.some(({ operation, path }) => operation === "fsync-directory" && path === root),
      "exact retry repeats the output-parent barrier",
    );

    writeFileSync(join(output, "index.html"), "foreign bytes");
    assert.throws(
      () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
      /without an exact pending transaction/i,
    );
  });
});

test("rename-before-parent-fsync recovery repeats the barrier before activation", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "crash-after-output-rename-before-parent-fsync",
        }),
      /fault injection/i,
    );
    assert.match(currentShell(state), /A shell/);
    assert.equal(
      JSON.parse(readFileSync(join(state, "publish-pending.json"), "utf8")).phase,
      "renamed-uncommitted",
    );

    let failedParent = false;
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          onDurabilityOperation: ({ operation, path }) => {
            if (!failedParent && operation === "fsync-directory" && path === root) {
              failedParent = true;
              throw new Error("parent fsync failure");
            }
          },
        }),
      /parent fsync failure/i,
    );
    assert.match(currentShell(state), /A shell/);

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-output-parent-fsync-before-phase",
        }),
      /fault injection/i,
    );
    assert.equal(
      JSON.parse(readFileSync(join(state, "publish-pending.json"), "utf8")).phase,
      "renamed-uncommitted",
    );
    assert.match(currentShell(state), /A shell/);

    const trace = [];
    buildStaticPublish({
      stateRoot: state,
      candidateRoot: b,
      outputRoot: output,
      onDurabilityOperation: (event) => trace.push(event),
    });
    const parentSync = trace.findIndex(
      ({ operation, path }) => operation === "fsync-directory" && path === root,
    );
    const activation = trace.findIndex(({ operation }) => operation === "rename-current");
    assert.ok(parentSync >= 0 && activation > parentSync);
    assert.match(currentShell(state), /B shell/);
  });
});

test("static publish rejects a corrupt prior current tuple before publication", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "output");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const releaseId = createCandidateManifest(a).releaseId;
    writeFileSync(join(state, "releases", releaseId, "index.html"), "corrupt A shell");
    const before = snapshotState(state);

    assert.throws(
      () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
      /valid committed current release/i,
    );
    assert.deepEqual(snapshotState(state), before);
    assert.equal(existsSync(output), false);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);
  });
});

test("a pending B publish expires after an independent C retained-asset promotion", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "publish-b");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    const c = release(root, "c", { "c.js": "C" }, "C shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    const staleOutput = readFileSync(join(output, "index.html"), "utf8");
    const staleJournal = readFileSync(join(state, "publish-pending.json"), "utf8");

    stageStaticRelease({ stateRoot: state, candidateRoot: c });
    const afterC = snapshotState(state);
    assert.match(currentShell(state), /C shell/);
    assert.equal(readFileSync(join(state, "assets", "c.js"), "utf8"), "C");

    assert.throws(
      () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
      /exact pending transaction/i,
    );
    assert.deepEqual(snapshotState(state), afterC, "stale B cannot alter C state");
    assert.equal(readFileSync(join(output, "index.html"), "utf8"), staleOutput);
    assert.equal(readFileSync(join(state, "publish-pending.json"), "utf8"), staleJournal);

    const controlState = join(root, "control-state");
    const controlOutput = join(root, "control-output");
    stageStaticRelease({ stateRoot: controlState, candidateRoot: a });
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: controlState,
          candidateRoot: b,
          outputRoot: controlOutput,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    assert.doesNotThrow(() =>
      buildStaticPublish({ stateRoot: controlState, candidateRoot: b, outputRoot: controlOutput }),
    );
    assert.match(currentShell(controlState), /B shell/);
  });
});

test("a pending publish resumes its exact own A+B promotion but rejects all drift", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "publish");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "nested/b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));

    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: state,
          candidateRoot: b,
          outputRoot: output,
          faultAt: "before-current",
        }),
      /fault injection/i,
    );
    assert.equal(readlinkSync(join(state, "current")), aCurrent);
    assert.equal(readFileSync(join(state, "assets", "nested", "b.js"), "utf8"), "B");
    assert.doesNotThrow(() =>
      buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
    );
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "publish-pending.json")), false);

    const changedCandidateState = join(root, "changed-candidate-state");
    const changedCandidateOutput = join(root, "changed-candidate-output");
    const changedB = release(root, "changed-b", { "nested/b.js": "different B" }, "B shell");
    stageStaticRelease({ stateRoot: changedCandidateState, candidateRoot: a });
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: changedCandidateState,
          candidateRoot: b,
          outputRoot: changedCandidateOutput,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    const beforeChangedRequest = snapshotState(changedCandidateState);
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: changedCandidateState,
          candidateRoot: changedB,
          outputRoot: changedCandidateOutput,
        }),
      /exact pending transaction/i,
    );
    assert.deepEqual(snapshotState(changedCandidateState), beforeChangedRequest);

    const driftState = join(root, "drift-state");
    const driftOutput = join(root, "drift-output");
    const c = release(root, "c", { "c.js": "C" }, "C shell");
    stageStaticRelease({ stateRoot: driftState, candidateRoot: a });
    assert.throws(
      () =>
        buildStaticPublish({
          stateRoot: driftState,
          candidateRoot: b,
          outputRoot: driftOutput,
          faultAt: "after-output",
        }),
      /fault injection/i,
    );
    stageStaticRelease({ stateRoot: driftState, candidateRoot: c });
    const afterC = snapshotState(driftState);
    assert.throws(
      () =>
        buildStaticPublish({ stateRoot: driftState, candidateRoot: b, outputRoot: driftOutput }),
      /exact pending transaction/i,
    );
    assert.deepEqual(snapshotState(driftState), afterC);
  });
});

test("static publish never follows or replaces an occupied output-root entry", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const before = snapshotState(state);
    const external = join(root, "external");
    mkdirSync(external, { recursive: true });
    writeFileSync(join(external, "sentinel"), "do not touch");
    const linked = join(root, "linked-output");
    symlinkSync(external, linked);
    const dangling = join(root, "dangling-output");
    symlinkSync(join(root, "never-created"), dangling);

    for (const output of [linked, dangling]) {
      assert.throws(
        () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
        /already exists/i,
      );
      assert.deepEqual(snapshotState(state), before);
      assert.equal(lstatSync(output).isSymbolicLink(), true);
    }
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "do not touch");

    for (const [name, create] of [
      ["file-output", () => writeFileSync(join(root, "file-output"), "user")],
      ["directory-output", () => mkdirSync(join(root, "directory-output"))],
    ]) {
      create();
      assert.throws(
        () =>
          buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: join(root, name) }),
        /already exists/i,
      );
      assert.deepEqual(snapshotState(state), before);
    }
  });
});

test("legacy reclaim is removed only when it is the exact canonical inode and generation", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const lock = join(state, "stage.lock");
    const reclaim = join(state, "stage.lock.reclaim");
    linkSync(lock, reclaim);
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: b,
          onLockOperation: ({ operation }) => {
            if (operation === "before-reclaim-removal") throw new Error("before reclaim removal");
          },
        }),
      /before reclaim removal/i,
    );
    assert.equal(lstatSync(reclaim).ino, lstatSync(lock).ino);
    assert.doesNotThrow(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }));
    assert.equal(existsSync(reclaim), false);
    assert.match(currentShell(state), /B shell/);

    writeFileSync(reclaim, readFileSync(lock));
    const foreignInode = lstatSync(reclaim).ino;
    assert.notEqual(foreignInode, lstatSync(lock).ino);
    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: b }),
      /does not bind/i,
    );
    assert.equal(lstatSync(reclaim).ino, foreignInode);
    rmSync(reclaim);

    symlinkSync(lock, reclaim);
    assert.throws(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }), /unsafe/i);
    assert.equal(lstatSync(reclaim).isSymbolicLink(), true);
  });
});

test("lock authority survives stager recreation and rejects a sibling Compose project", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    const owners = [];
    const observe = ({ operation, owner }) => {
      if (operation === "lock-acquired") owners.push(owner);
    };
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: a,
      projectKey: "stable-project",
      diagnosticHost: "stager-one",
      onLockOperation: observe,
    });
    const firstDomain = JSON.parse(
      readFileSync(join(state, "stage-execution-domain.json"), "utf8"),
    );
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      projectKey: "stable-project",
      diagnosticHost: "stager-two",
      onLockOperation: observe,
    });
    const secondDomain = JSON.parse(
      readFileSync(join(state, "stage-execution-domain.json"), "utf8"),
    );

    assert.deepEqual(secondDomain, firstDomain);
    assert.equal(owners[0].domain, owners[1].domain);
    assert.notEqual(owners[0].acquisition, owners[1].acquisition);
    assert.equal(owners[0].diagnosticHost, "stager-one");
    assert.equal(owners[1].diagnosticHost, "stager-two");
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: b,
          projectKey: "foreign-project",
        }),
      /another Compose project/i,
    );
    assert.match(currentShell(state), /B shell/);
  });
});

test("an incomplete first execution-domain record and its exact orphan guard recover before locking", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    mkdirSync(state);
    const record = join(state, "stage-execution-domain.json");
    writeFileSync(record, '{"schemaVersion":');
    linkSync(record, join(state, ".stage-execution-domain.reclaim"));

    assert.doesNotThrow(() =>
      stageStaticRelease({ stateRoot: state, candidateRoot: candidate, projectKey: "fixture" }),
    );
    const domain = JSON.parse(readFileSync(record, "utf8"));
    assert.equal(domain.project, "fixture");
    assert.match(domain.domain, /^[a-f0-9-]{36}$/u);
    assert.equal(existsSync(join(state, ".stage-execution-domain.reclaim")), false);
  });
});

test("stable kernel-lock inode admits at most one transaction", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a, projectKey: "fixture" });
    const lock = join(state, "stage.lock");
    const stableInode = lstatSync(lock).ino;
    let nested = false;
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      projectKey: "fixture",
      onLockOperation: (event) => {
        if (event.operation === "lock-acquired" && !nested) {
          nested = true;
          assert.throws(
            () => stageStaticRelease({ stateRoot: state, candidateRoot: b, projectKey: "fixture" }),
            /exclusive kernel lock/i,
          );
        }
      },
    });
    assert.equal(nested, true);
    assert.equal(lstatSync(lock).ino, stableInode);
    assert.match(currentShell(state), /B shell/);
  });
});

test("journalled existing promoted assets rerun file and ancestor durability barriers", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "x/y.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    assert.throws(
      () =>
        stageStaticRelease({ stateRoot: state, candidateRoot: b, faultAt: "after-asset-rename" }),
      /fault injection/i,
    );
    const durableState = realpathSync(state);
    const file = join(durableState, "assets", "x", "y.js");
    const nested = join(durableState, "assets", "x");
    const assets = join(durableState, "assets");
    for (const target of [nested, assets, durableState]) {
      assert.throws(
        () =>
          stageStaticRelease({
            stateRoot: state,
            candidateRoot: b,
            onDurabilityOperation: ({ operation, path }) => {
              if (operation === "fsync-directory" && path === target) {
                throw new Error("recovery ancestor sync fault");
              }
            },
          }),
        /recovery ancestor sync fault/i,
      );
      assert.match(currentShell(state), /A shell/);
    }
    const trace = [];
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
    });
    const current = trace.findIndex((entry) => entry.startsWith("rename-current:"));
    const fileIndex = trace.indexOf(`fsync-file:${file}`);
    const nestedIndex = trace.indexOf(`fsync-directory:${nested}`);
    const assetsIndex = trace.indexOf(`fsync-directory:${assets}`);
    const stateIndex = trace.findIndex(
      (entry, index) => index > assetsIndex && entry === `fsync-directory:${durableState}`,
    );
    assert.ok(
      fileIndex >= 0 &&
        fileIndex < nestedIndex &&
        nestedIndex < assetsIndex &&
        assetsIndex < stateIndex,
    );
    assert.ok(stateIndex < current);
  });
});

test("legacy handoff pointer replaces a hostile current symlink without following it", () => {
  withFixture((root) => {
    const handoff = join(root, "handoff");
    const external = join(root, "external");
    const releaseRoot = legacyHandoff(join(handoff, "releases", "capture"), "legacy-A", {
      "a.js": "A",
    });
    mkdirSync(external, { recursive: true });
    writeFileSync(join(external, "sentinel"), "do not touch");
    symlinkSync(external, join(handoff, "current"));

    publishLegacyHandoffPointer({ handoffRoot: handoff, release: "releases/capture" });
    assert.equal(readlinkSync(join(handoff, "current")), "releases/capture");
    assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "do not touch");
    assert.equal(verifyLegacyHandoff(releaseRoot).valid, true);
  });
});

test("legacy handoff marker and pointer failures leave the prior authority untouched", () => {
  withFixture((root) => {
    const handoff = join(root, "handoff");
    const external = join(root, "external");
    const releaseRoot = join(handoff, "releases", "capture");
    mkdirSync(join(releaseRoot, "assets"), { recursive: true });
    writeFileSync(join(releaseRoot, "assets", "a.js"), "A");
    assert.throws(
      () =>
        writeLegacyHandoffManifest({
          legacyRoot: releaseRoot,
          sourceId: "legacy-A",
          sourceKind: "baked-legacy-root",
          faultAt: "legacy-marker-write",
        }),
      /marker write/i,
    );
    assert.equal(existsSync(join(releaseRoot, ".legacy-handoff.json")), false);

    writeLegacyHandoffManifest({
      legacyRoot: releaseRoot,
      sourceId: "legacy-A",
      sourceKind: "baked-legacy-root",
    });
    mkdirSync(external, { recursive: true });
    writeFileSync(join(external, "sentinel"), "do not touch");
    symlinkSync(external, join(handoff, "current"));
    for (const faultAt of ["legacy-pointer-link", "legacy-pointer-rename"]) {
      assert.throws(
        () =>
          publishLegacyHandoffPointer({
            handoffRoot: handoff,
            release: "releases/capture",
            faultAt,
          }),
        /pointer (link|rename)/i,
      );
      assert.equal(readlinkSync(join(handoff, "current")), external);
      assert.equal(readFileSync(join(external, "sentinel"), "utf8"), "do not touch");
    }
  });
});

test("legacy handoff pointer restores and syncs prior authority after its commit barrier fails", () => {
  withFixture((root) => {
    const handoff = join(root, "handoff");
    const prior = legacyHandoff(join(handoff, "releases", "prior"), "legacy-prior", {
      "prior.js": "prior",
    });
    publishLegacyHandoffPointer({ handoffRoot: handoff, release: "releases/prior" });
    const candidate = legacyHandoff(join(handoff, "releases", "candidate"), "legacy-candidate", {
      "candidate.js": "candidate",
    });
    const durableRoot = realpathSync(handoff);
    const trace = [];
    let injected = false;

    assert.throws(
      () =>
        publishLegacyHandoffPointer({
          handoffRoot: handoff,
          release: "releases/candidate",
          onDurabilityOperation: (event) => {
            trace.push(event);
            if (!injected && event.operation === "fsync-directory" && event.path === durableRoot) {
              injected = true;
              throw new Error("handoff root barrier failed");
            }
          },
        }),
      /handoff root barrier failed/i,
    );
    assert.equal(realpathSync(join(handoff, "current")), realpathSync(prior));
    assert.equal(
      trace.filter(({ operation, path }) => operation === "fsync-directory" && path === durableRoot)
        .length,
      2,
      "rollback repeats and completes the handoff-root barrier",
    );

    // This is the capture wrapper's failure cleanup boundary: deleting the
    // rejected release cannot dangle or replace the restored pointer.
    rmSync(candidate, { recursive: true, force: true });
    assert.equal(verifyLegacyHandoff(join(handoff, "current")).valid, true);
    assert.equal(realpathSync(join(handoff, "current")), realpathSync(prior));
  });
});

test("legacy handoff publication waits for the complete file and directory durability barrier", () => {
  withFixture((root) => {
    const handoff = join(root, "handoff");
    const prior = legacyHandoff(join(handoff, "releases", "prior"), "legacy-prior", {
      "prior.js": "prior",
    });
    publishLegacyHandoffPointer({ handoffRoot: handoff, release: "releases/prior" });
    const candidate = join(handoff, "releases", "candidate");
    mkdirSync(join(candidate, "assets", "nested"), { recursive: true });
    writeFileSync(join(candidate, "assets", "nested", "lazy.js"), "lazy");
    const unchanged = () =>
      assert.equal(realpathSync(join(handoff, "current")), realpathSync(prior));

    for (const [operation, suffix] of [
      ["close-file", "lazy.js"],
      ["fsync-file", ".legacy-handoff.json"],
      ["fsync-directory", "assets/nested"],
      ["fsync-directory", "assets"],
      ["fsync-directory", "candidate"],
      ["fsync-directory", "releases"],
      ["fsync-directory", "handoff"],
    ]) {
      assert.throws(
        () =>
          writeLegacyHandoffManifest({
            legacyRoot: candidate,
            handoffRoot: handoff,
            sourceId: "legacy-candidate",
            sourceKind: "baked-legacy-root",
            onDurabilityOperation: ({ operation: actual, path }) => {
              if (actual === operation && path.endsWith(suffix)) throw new Error("sync fault");
            },
          }),
        /sync fault/,
      );
      unchanged();
    }

    const trace = [];
    writeLegacyHandoffManifest({
      legacyRoot: candidate,
      handoffRoot: handoff,
      sourceId: "legacy-candidate",
      sourceKind: "baked-legacy-root",
      onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
    });
    const durableCandidate = realpathSync(candidate);
    const fileIndex = trace.findIndex(
      (entry) => entry.startsWith("fsync-file:") && entry.endsWith("assets/nested/lazy.js"),
    );
    const leafIndex = trace.indexOf(
      `fsync-directory:${join(durableCandidate, "assets", "nested")}`,
    );
    const assetsIndex = trace.indexOf(`fsync-directory:${join(durableCandidate, "assets")}`);
    const rootIndex = trace.indexOf(`fsync-directory:${durableCandidate}`);
    const releasesIndex = trace.findIndex(
      (entry, index) =>
        index > rootIndex && entry === `fsync-directory:${realpathSync(join(handoff, "releases"))}`,
    );
    const handoffIndex = trace.findIndex(
      (entry, index) =>
        index > releasesIndex && entry === `fsync-directory:${realpathSync(handoff)}`,
    );
    assert.ok(fileIndex >= 0 && fileIndex < leafIndex && leafIndex < assetsIndex);
    assert.ok(assetsIndex < rootIndex);
    assert.ok(rootIndex < releasesIndex && releasesIndex < handoffIndex);
    publishLegacyHandoffPointer({ handoffRoot: handoff, release: "releases/candidate" });
    assert.equal(realpathSync(join(handoff, "current")), realpathSync(candidate));
  });
});

test("an existing publish output is rejected before staging mutates release state", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const output = join(root, "publish");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    mkdirSync(output, { recursive: true });
    writeFileSync(join(output, "user-owned.txt"), "do not touch");
    const before = snapshotState(state);

    assert.throws(
      () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
      /publish output already exists/i,
    );
    assert.deepEqual(snapshotState(state), before);
    assert.equal(readFileSync(join(output, "user-owned.txt"), "utf8"), "do not touch");
  });
});

test("release-only partial state resumes after metadata boundary without selecting B early", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aShell = currentShell(state);

    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: b, faultAt: "after-release" }),
      /fault injection/i,
    );
    assert.equal(currentShell(state), aShell);
    const releaseId = createCandidateManifest(b).releaseId;
    assert.equal(existsSync(join(state, "releases", releaseId)), true);
    assert.equal(existsSync(join(state, "metadata", `${releaseId}.json`)), false);

    stageStaticRelease({ stateRoot: state, candidateRoot: b });
    assert.match(currentShell(state), /B shell/);
    assert.equal(verifyCommittedState(state).valid, true);
  });
});

test("visible release and metadata retry repeats tuple durability before current", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const durableState = realpathSync(state);
    const releaseId = createCandidateManifest(b).releaseId;
    const releaseDir = join(durableState, "releases", releaseId);
    const metadataPath = join(durableState, "metadata", `${releaseId}.json`);
    let injected = false;

    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: b,
          onDurabilityOperation: ({ operation, path }) => {
            if (
              !injected &&
              operation === "fsync-directory" &&
              path === join(durableState, "metadata")
            ) {
              injected = true;
              throw new Error("metadata directory barrier failed");
            }
          },
        }),
      /metadata directory barrier failed/i,
    );
    assert.equal(existsSync(releaseDir), true);
    assert.equal(existsSync(metadataPath), true);
    assert.match(currentShell(state), /A shell/);

    const trace = [];
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      onDurabilityOperation: (event) => trace.push(event),
    });
    const releaseSync = trace.findIndex(
      ({ operation, path }) => operation === "fsync-directory" && path === releaseDir,
    );
    const metadataSync = trace.findIndex(
      ({ operation, path }) => operation === "fsync-file" && path === metadataPath,
    );
    const activation = trace.findIndex(({ operation }) => operation === "rename-current");
    assert.ok(releaseSync >= 0 && metadataSync > releaseSync && activation > metadataSync);
    assert.match(currentShell(state), /B shell/);
  });
});

test("only a full marker/current/release/metadata/assets tuple is authoritative", () => {
  withFixture((root) => {
    const state = join(root, "state");
    assert.equal(
      verifyCommittedState(state).valid,
      false,
      "empty state is not an installed release",
    );
    const a = release(root, "a", { "a.js": "A" });
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    assert.equal(verifyCommittedState(state).valid, true);

    const releaseId = createCandidateManifest(a).releaseId;
    writeFileSync(join(state, "releases", releaseId, ".release-state.json"), "{}\n");
    assert.equal(verifyCommittedState(state).valid, false, "corrupt marker fails closed");
  });
});

test("cumulative retained ledger rejects corrupt, missing, and untracked historical assets", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "old-a.js": "A", "old-unreferenced.js": "still A" });
    const b = release(root, "b", { "new-b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const before = readlinkSync(join(state, "current"));

    writeFileSync(join(state, "assets", "old-unreferenced.js"), "corrupt");
    assert.throws(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }), /cumulative/i);
    assert.equal(readlinkSync(join(state, "current")), before);

    writeFileSync(join(state, "assets", "old-unreferenced.js"), "still A");
    rmSync(join(state, "retained-assets.json"));
    assert.throws(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }), /cumulative/i);
    assert.equal(readlinkSync(join(state, "current")), before, "ledger refuses a silent repair");

    writeFileSync(
      join(state, "retained-assets.json"),
      JSON.stringify({
        schemaVersion: 1,
        assets: createCandidateManifest(a).assets,
      }),
    );
    stageStaticRelease({ stateRoot: state, candidateRoot: b });
    assert.match(currentShell(state), /B shell/);
    writeFileSync(join(state, "assets", "unexpected.js"), "unexpected");
    assert.equal(verifyCommittedState(state).valid, false, "extra old bytes fail authority");
  });
});

test("an exact durable asset-promotion journal alone resumes an unledgered subset", () => {
  withFixture((root) => {
    const initialState = join(root, "initial-state");
    const initial = release(root, "initial", { "x/y.js": "initial nested" }, "initial shell");
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: initialState,
          candidateRoot: initial,
          faultAt: "after-asset-rename",
        }),
      /fault injection/i,
    );
    assert.equal(existsSync(join(initialState, "retained-assets.json")), false);
    assert.equal(existsSync(join(initialState, "retained-assets-pending.json")), true);
    assert.doesNotThrow(() =>
      stageStaticRelease({ stateRoot: initialState, candidateRoot: initial }),
    );
    assert.match(currentShell(initialState), /initial shell/);

    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "x/y.js": "B nested" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const aCurrent = readlinkSync(join(state, "current"));
    assert.throws(
      () =>
        stageStaticRelease({ stateRoot: state, candidateRoot: b, faultAt: "after-asset-rename" }),
      /fault injection/i,
    );
    assert.equal(readlinkSync(join(state, "current")), aCurrent);
    assert.equal(existsSync(join(state, "retained-assets-pending.json")), true);
    assert.doesNotThrow(() => stageStaticRelease({ stateRoot: state, candidateRoot: b }));
    assert.match(currentShell(state), /B shell/);
    assert.equal(existsSync(join(state, "retained-assets-pending.json")), false);

    const afterLedger = join(root, "after-ledger-state");
    stageStaticRelease({ stateRoot: afterLedger, candidateRoot: a });
    const afterLedgerCurrent = readlinkSync(join(afterLedger, "current"));
    assert.throws(
      () =>
        stageStaticRelease({ stateRoot: afterLedger, candidateRoot: b, faultAt: "after-assets" }),
      /fault injection/i,
    );
    assert.equal(readlinkSync(join(afterLedger, "current")), afterLedgerCurrent);
    assert.equal(existsSync(join(afterLedger, "retained-assets-pending.json")), true);
    assert.doesNotThrow(() => stageStaticRelease({ stateRoot: afterLedger, candidateRoot: b }));
    assert.match(currentShell(afterLedger), /B shell/);

    const rejected = join(root, "rejected-state");
    stageStaticRelease({ stateRoot: rejected, candidateRoot: a });
    const rejectedCurrent = readlinkSync(join(rejected, "current"));
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: rejected,
          candidateRoot: b,
          faultAt: "after-asset-rename",
        }),
      /fault injection/i,
    );
    rmSync(join(rejected, "retained-assets-pending.json"));
    assert.throws(
      () => stageStaticRelease({ stateRoot: rejected, candidateRoot: b }),
      /cumulative/i,
    );
    assert.equal(readlinkSync(join(rejected, "current")), rejectedCurrent);

    const unexpected = join(root, "unexpected-state");
    stageStaticRelease({ stateRoot: unexpected, candidateRoot: a });
    const unexpectedCurrent = readlinkSync(join(unexpected, "current"));
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: unexpected,
          candidateRoot: b,
          faultAt: "after-asset-rename",
        }),
      /fault injection/i,
    );
    writeFileSync(join(unexpected, "assets", "unexpected.js"), "unexpected");
    assert.throws(
      () => stageStaticRelease({ stateRoot: unexpected, candidateRoot: b }),
      /promotion journal/i,
    );
    assert.equal(readlinkSync(join(unexpected, "current")), unexpectedCurrent);

    const mismatched = join(root, "mismatched-state");
    const c = release(root, "c", { "c.js": "C" }, "C shell");
    stageStaticRelease({ stateRoot: mismatched, candidateRoot: a });
    const mismatchedCurrent = readlinkSync(join(mismatched, "current"));
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: mismatched,
          candidateRoot: b,
          faultAt: "after-asset-rename",
        }),
      /fault injection/i,
    );
    assert.throws(
      () => stageStaticRelease({ stateRoot: mismatched, candidateRoot: c }),
      /journal does not match this exact request/i,
    );
    assert.equal(readlinkSync(join(mismatched, "current")), mismatchedCurrent);

    const corrupt = join(root, "corrupt-state");
    stageStaticRelease({ stateRoot: corrupt, candidateRoot: a });
    const corruptCurrent = readlinkSync(join(corrupt, "current"));
    assert.throws(
      () =>
        stageStaticRelease({ stateRoot: corrupt, candidateRoot: b, faultAt: "after-asset-rename" }),
      /fault injection/i,
    );
    writeFileSync(join(corrupt, "retained-assets-pending.json"), "not json\n");
    assert.throws(
      () => stageStaticRelease({ stateRoot: corrupt, candidateRoot: b }),
      /invalid asset promotion journal/i,
    );
    assert.equal(readlinkSync(join(corrupt, "current")), corruptCurrent);
  });
});

test("recovery re-publishes an expected ledger after its directory barrier failed", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a-ledger", { "a.js": "A" }, "A shell");
    const b = release(root, "b-ledger", { "b.js": "B" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const durableState = realpathSync(state);
    let ledgerRenamed = false;
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: b,
          onDurabilityOperation: ({ operation, path }) => {
            if (operation === "rename" && path === join(durableState, "retained-assets.json")) {
              ledgerRenamed = true;
            }
            if (ledgerRenamed && operation === "fsync-directory" && path === durableState) {
              throw new Error("ledger directory barrier failed");
            }
          },
        }),
      /ledger directory barrier failed/i,
    );
    assert.match(currentShell(state), /A shell/);
    assert.equal(existsSync(join(state, "retained-assets-pending.json")), true);

    const trace = [];
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
    });
    const ledgerRename = trace.indexOf(`rename:${join(durableState, "retained-assets.json")}`);
    const currentRename = trace.findIndex((entry) => entry.startsWith("rename-current:"));
    assert.ok(ledgerRename >= 0 && ledgerRename < currentRename, trace.join("\n"));
    assert.match(currentShell(state), /B shell/);
  });
});

test("nested retained-asset fsync barriers reach assets and state before current", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "x/y.js": "B nested" }, "B shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const trace = [];
    stageStaticRelease({
      stateRoot: state,
      candidateRoot: b,
      onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
    });
    const beforeCurrent = trace.findIndex((entry) => entry.startsWith("rename-current:"));
    const durableState = realpathSync(state);
    const nested = join(durableState, "assets", "x");
    const assets = join(durableState, "assets");
    const nestedIndex = trace.lastIndexOf(`fsync-directory:${nested}`);
    const assetsIndex = trace.lastIndexOf(`fsync-directory:${assets}`);
    const stateIndex = trace.findIndex(
      (entry, index) => index > assetsIndex && entry === `fsync-directory:${durableState}`,
    );
    assert.ok(
      nestedIndex >= 0 && nestedIndex < assetsIndex && assetsIndex < stateIndex,
      trace.join("\n"),
    );
    assert.ok(stateIndex < beforeCurrent);

    for (const relative of [join("assets", "x"), "assets", ""]) {
      const retryState = join(root, `retry-${relative.replaceAll("/", "-") || "state"}`);
      stageStaticRelease({ stateRoot: retryState, candidateRoot: a });
      const before = readlinkSync(join(retryState, "current"));
      const durableRetryState = realpathSync(retryState);
      const target = relative ? join(durableRetryState, relative) : durableRetryState;
      assert.throws(
        () =>
          stageStaticRelease({
            stateRoot: retryState,
            candidateRoot: b,
            onDurabilityOperation: ({ operation, path }) => {
              if (operation === "fsync-directory" && path === target) {
                throw new Error("targeted ancestor durability failure");
              }
            },
          }),
        /targeted ancestor durability failure/i,
      );
      assert.equal(readlinkSync(join(retryState, "current")), before);
      assert.doesNotThrow(() => stageStaticRelease({ stateRoot: retryState, candidateRoot: b }));
    }
  });
});

test("durability barriers precede activation and failure leaves the old pointer selected", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const a = release(root, "a", { "a.js": "A" }, "A shell");
    const b = release(root, "b", { "b.js": "B" }, "B shell");
    const c = release(root, "c", { "c.js": "C" }, "C shell");
    const d = release(root, "d", { "d.js": "D" }, "D shell");
    stageStaticRelease({ stateRoot: state, candidateRoot: a });
    const before = readlinkSync(join(state, "current"));
    const trace = [];
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: b,
          faultAt: "durability:fsync-directory",
          onDurabilityOperation: ({ operation, path }) => trace.push(`${operation}:${path}`),
        }),
      /durability fault injection/i,
    );
    assert.equal(readlinkSync(join(state, "current")), before);
    assert.equal(
      trace.some((entry) => entry.startsWith("rename-current:")),
      false,
    );
    stageStaticRelease({ stateRoot: state, candidateRoot: b });
    assert.match(currentShell(state), /B shell/);

    const bCurrent = readlinkSync(join(state, "current"));
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: c,
          faultAt: "durability:close-file",
        }),
      /durability fault injection/i,
    );
    assert.equal(readlinkSync(join(state, "current")), bCurrent, "close failure preserves B");
    stageStaticRelease({ stateRoot: state, candidateRoot: c });

    const cCurrent = readlinkSync(join(state, "current"));
    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: d,
          faultAt: "durability:rename-current",
        }),
      /durability fault injection/i,
    );
    assert.equal(
      readlinkSync(join(state, "current")),
      cCurrent,
      "post-rename sync failure restores C",
    );
    stageStaticRelease({ stateRoot: state, candidateRoot: d });
    assert.match(currentShell(state), /D shell/);
  });
});

test("initial current rollback durably removes the pointer when no predecessor exists", () => {
  withFixture((root) => {
    const state = join(root, "state");
    const candidate = release(root, "candidate", { "a.js": "A" }, "A shell");
    const trace = [];
    let activationStarted = false;
    let injected = false;

    assert.throws(
      () =>
        stageStaticRelease({
          stateRoot: state,
          candidateRoot: candidate,
          onDurabilityOperation: (event) => {
            if (event.operation === "rename-current") activationStarted = true;
            if (activationStarted) trace.push(event);
            if (
              activationStarted &&
              !injected &&
              event.operation === "fsync-directory" &&
              event.path === realpathSync(state)
            ) {
              injected = true;
              throw new Error("initial current barrier failed");
            }
          },
        }),
      /initial current barrier failed/i,
    );
    assert.equal(existsSync(join(state, "current")), false);
    assert.equal(
      trace.filter(
        ({ operation, path }) => operation === "fsync-directory" && path === realpathSync(state),
      ).length,
      2,
      "rollback repeats the state-directory durability barrier",
    );
    assert.equal(verifyCommittedState(state).valid, false);

    stageStaticRelease({ stateRoot: state, candidateRoot: candidate });
    assert.match(currentShell(state), /A shell/);
  });
});
