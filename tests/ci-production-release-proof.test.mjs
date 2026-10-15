import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { Script } from "node:vm";
import {
  committedProbe,
  proveProductionRetry,
  validateTuple,
} from "../scripts/ci-production-release-proof.mjs";

const sha = (x) => createHash("sha256").update(x).digest("hex");
const tuple = () => ({
  verified: { valid: true, releaseId: "a".repeat(64) },
  metadata: { bytes: 1127818, sha256: "b".repeat(64) },
  marker: { bytes: 196, sha256: "c".repeat(64) },
  retainedInventory: { bytes: 10219, sha256: "d".repeat(64) },
  release: { files: 5625, bytes: 278370330, sha256: "e".repeat(64) },
  assets: { files: 54, bytes: 28412534, sha256: "f".repeat(64) },
});

async function fixture(change = {}) {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-ci-production-"));
  mkdirSync(join(root, "content"));
  const variants = [480, 800, 1240].flatMap((width) =>
    ["avif", "webp", "jpeg"].map((format) => {
      const path = `content/img/example-${width}.${format}`;
      return { path, width, format, sha256: sha(path) };
    }),
  );
  writeFileSync(
    join(root, "content/image-derivatives.manifest.json"),
    JSON.stringify({ sources: [{ variants }] }),
  );
  const calls = [];
  let retried = false;
  try {
    const proof = await proveProductionRetry({
      root,
      project: "cabadrive-ci-unit",
      port: 5173,
      run(file, args) {
        calls.push([file, ...args]);
        if (file === "make") {
          assert.deepEqual(args, ["stage"]);
          if (change.stageFails) throw Error("actual stage exit1");
          retried = true;
          return "";
        }
        if (args[0] === "compose") return "sha256:" + "1".repeat(64);
        if (args[0] === "image")
          return JSON.stringify([{ Id: "sha256:" + "1".repeat(64), Config: {} }]);
        if (args[0] === "volume")
          return JSON.stringify([
            {
              Name: "cabadrive-ci-unit_release-state",
              Labels: { "com.docker.compose.project": "cabadrive-ci-unit" },
            },
          ]);
        assert.equal(args[0], "run");
        assert.ok(
          args.includes(
            "type=volume,source=cabadrive-ci-unit_release-state,target=/state,readonly,volume-nocopy",
          ),
        );
        assert.ok(args.includes("--read-only"));
        const value = tuple();
        if (retried && change.changedInventory) value.release.sha256 = "0".repeat(64);
        if (change.tooSmall) value.metadata.bytes = 1048576;
        return JSON.stringify(value);
      },
      async fetchImpl(url) {
        calls.push(["HTTP", url]);
        const path = new URL(url).pathname.slice(1);
        const variant = variants.find((v) => v.path === path);
        return new Response(change.wrongBytes ? "changed" : path, {
          status: 200,
          headers: {
            "Content-Type": change.wrongMime
              ? "text/html"
              : { avif: "image/avif", webp: "image/webp", jpeg: "image/jpeg" }[variant.format],
            "Cache-Control": change.missingImmutable
              ? "max-age=0"
              : "public, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    });
    return { proof, calls };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("real emitted committed probe parses, tuple bounds fail closed", () => {
  new Script(committedProbe);
  validateTuple(tuple());
  for (const bytes of [1048576, 2097153, "1127818"]) {
    const value = tuple();
    value.metadata.bytes = bytes;
    assert.throws(() => validateTuple(value));
  }
  const invalid = tuple();
  invalid.verified.valid = false;
  assert.throws(() => validateTuple(invalid));
});

test("publication is followed by actual make stage, same full inventory and18 HTTP comparisons", async () => {
  const { proof, calls } = await fixture();
  assert.equal(proof.status, "PRODUCTION_PUBLICATION_AND_REAL_RETRY_PASS");
  assert.equal(calls.filter((x) => x[0] === "HTTP").length, 18);
  const stage = calls.findIndex((x) => x[0] === "make");
  assert.equal(calls.slice(0, stage).filter((x) => x[0] === "HTTP").length, 9);
  assert.equal(calls.slice(stage).filter((x) => x[0] === "HTTP").length, 9);
});

for (const [label, change] of Object.entries({
  "changed complete inventory": { changedInventory: true },
  "metadata not >1MiB": { tooSmall: true },
  "nonzero ordinary make stage": { stageFails: true },
  "wrong actual HTTP bytes": { wrongBytes: true },
  "wrong MIME": { wrongMime: true },
  "missing immutable contract": { missingImmutable: true },
})) {
  test(label + " never yields production PASS", async () => {
    await assert.rejects(fixture(change));
  });
}
