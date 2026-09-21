import assert from "node:assert/strict";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
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
} from "../scripts/stage-static-release.mjs";

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
    const legacy = join(root, "legacy");
    mkdirSync(join(legacy, "assets"), { recursive: true });
    writeFileSync(join(legacy, "assets/a-lazy-old.js"), "legacy exact bytes");
    const b = release(root, "b", { "b.js": "B" });

    stageStaticRelease({ stateRoot: state, candidateRoot: b, legacyRoot: legacy });

    assert.equal(readFileSync(join(state, "assets/a-lazy-old.js"), "utf8"), "legacy exact bytes");
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
    assert.throws(
      () => buildStaticPublish({ stateRoot: state, candidateRoot: b, outputRoot: output }),
      /refusing destructive replacement/i,
    );
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
