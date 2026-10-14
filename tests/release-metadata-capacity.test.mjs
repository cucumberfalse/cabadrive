import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  buildStaticPublish,
  createCandidateManifest,
  readAuthorityJson,
  stageStaticRelease,
  verifyCandidateManifest,
  verifyCommittedState,
} from "../scripts/stage-static-release.mjs";

process.env.CABADRIVE_TEST_KERNEL_LOCK = "in-process";

function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-release-metadata-"));
  const candidate = join(root, "candidate");
  const state = join(root, "state");
  mkdirSync(join(candidate, "assets"), { recursive: true });
  writeFileSync(join(candidate, "assets/app.01234567.js"), "export {}; ");
  writeFileSync(join(candidate, "index.html"), "<!doctype html><title>Metadata capacity</title>");
  try {
    run({ root, candidate, state });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("a complete >1MiB release publishes, verifies exact inventory and retries", () => {
  fixture(({ root, candidate, state }) => {
    const pictures = join(candidate, "content/img/c");
    mkdirSync(pictures, { recursive: true });
    for (let id = 0; id < 5600; id++)
      writeFileSync(
        join(
          pictures,
          `ticket-photo-quality-regression-${String(id).padStart(5, "0")}-1240.0123456789abcdef01234567.jpg`,
        ),
        String(id),
      );
    const manifest = createCandidateManifest(candidate);
    assert.equal(manifest.mutable.length, 5601);
    const staged = stageStaticRelease({ stateRoot: state, candidateRoot: candidate });
    const metadataPath = join(state, "metadata", `${manifest.releaseId}.json`);
    const bytes = readFileSync(metadataPath);
    assert(bytes.length > 1024 ** 2);
    assert(bytes.length < 2 * 1024 ** 2);
    assert.equal(staged.releaseId, manifest.releaseId);
    assert.equal(verifyCommittedState(state).valid, true);
    const committedMetadata = JSON.parse(bytes);
    assert.deepEqual(committedMetadata.assets, manifest.assets);
    assert.deepEqual(committedMetadata.mutable, manifest.mutable);
    assert.equal(stageStaticRelease({ stateRoot: state, candidateRoot: candidate }).changed, false);
    const output = join(root, "publish");
    buildStaticPublish({ stateRoot: state, candidateRoot: candidate, outputRoot: output });
    // The public pointer is a symlink to the admitted immutable generation.
    // Verify the complete concrete generation, keeping candidate no-follow rules.
    verifyCandidateManifest(realpathSync(output), manifest);
    assert.equal(
      buildStaticPublish({ stateRoot: state, candidateRoot: candidate, outputRoot: output })
        .changed,
      false,
    );
    assert.equal(verifyCommittedState(state).valid, true);
  });
});

test("release metadata accepts the exact 2 MiB bound and rejects one byte above", () => {
  fixture(({ candidate, state }) => {
    const release = stageStaticRelease({ stateRoot: state, candidateRoot: candidate });
    const path = join(state, "metadata", `${release.releaseId}.json`);
    const bytes = readFileSync(path);
    const exact = Buffer.concat([bytes, Buffer.alloc(2 * 1024 ** 2 - bytes.length, " ")]);
    writeFileSync(path, exact);
    assert.equal(verifyCommittedState(state).valid, true);
    writeFileSync(path, Buffer.concat([exact, Buffer.from(" ")]));
    const rejected = verifyCommittedState(state);
    assert.equal(rejected.valid, false);
    assert.match(rejected.reason, /release metadata exceeds the authority size limit/);
    assert.throws(
      () => stageStaticRelease({ stateRoot: state, candidateRoot: candidate }),
      /valid committed current release/,
    );
  });
});

test("under-limit malformed, structurally invalid and mismatched metadata still rejects", () => {
  fixture(({ candidate, state }) => {
    const release = stageStaticRelease({ stateRoot: state, candidateRoot: candidate });
    const path = join(state, "metadata", `${release.releaseId}.json`);
    const original = JSON.parse(readFileSync(path));
    for (const invalid of [
      "{",
      JSON.stringify({ ...original, mutable: null }),
      JSON.stringify({
        ...original,
        mutable: original.mutable.map((entry) => ({ ...entry, sha256: "0".repeat(64) })),
      }),
    ]) {
      writeFileSync(path, invalid);
      assert.equal(verifyCommittedState(state).valid, false);
      assert.throws(
        () => stageStaticRelease({ stateRoot: state, candidateRoot: candidate }),
        /valid committed current release/,
      );
    }
  });
});

test("generic non-release authority remains bounded at 1 MiB", () => {
  fixture(({ root }) => {
    const path = join(root, "authority.json");
    writeFileSync(path, Buffer.concat([Buffer.from("{}"), Buffer.alloc(1024 ** 2 - 2, " ")]));
    assert.deepEqual(readAuthorityJson(path), {});
    writeFileSync(path, Buffer.concat([readFileSync(path), Buffer.from(" ")]));
    assert.throws(
      () => readAuthorityJson(path),
      /authority record exceeds the authority size limit/,
    );
  });
});
