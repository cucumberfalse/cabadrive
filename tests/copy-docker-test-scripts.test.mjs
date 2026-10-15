import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { copyDockerTestScripts } from "./copy-docker-test-scripts.mjs";

function inventory(root, prefix = "") {
  return readdirSync(join(root, prefix), { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(prefix, entry.name);
      return entry.isDirectory()
        ? inventory(root, path)
        : [
            [
              path,
              createHash("sha256")
                .update(readFileSync(join(root, path)))
                .digest("hex"),
            ],
          ];
    })
    .sort(([a], [b]) => a.localeCompare(b));
}

test("fixture copies every real script while exact ephemeral root sentinel disappears before stat", () => {
  const temporary = mkdtempSync(join(tmpdir(), "cabadrive-fixture-copy-"));
  const source = join(temporary, "source"),
    destination = join(temporary, "copy");
  try {
    copyDockerTestScripts(fileURLToPath(new URL("../scripts", import.meta.url)), source);
    writeFileSync(join(source, "__quality_format_sentinel-near.mjs"), "near name retained");
    mkdirSync(join(source, "nested"));
    writeFileSync(join(source, "nested/__quality_format_sentinel.mjs"), "nested basename retained");
    const expected = inventory(source);
    writeFileSync(join(source, "__quality_format_sentinel.mjs"), "ephemeral");
    copyDockerTestScripts(source, destination, () =>
      rmSync(join(source, "__quality_format_sentinel.mjs")),
    );
    assert.deepEqual(inventory(destination), expected);
    assert.ok(expected.some(([path]) => path === "test-docker-image-pipeline.mjs"));
    assert.ok(expected.some(([path]) => path === "test-docker-asset-retention.mjs"));
    cpSync(join(source, "test-docker-image-pipeline.mjs"), join(source, "real-script.mjs"));
    assert.throws(
      () =>
        copyDockerTestScripts(source, join(temporary, "refused"), () =>
          rmSync(join(source, "real-script.mjs")),
        ),
      { code: "ENOENT" },
    );
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
