import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ticketUpscalePolicy, ticketMasterDimensions } from "../scripts/ticket-upscale-policy.mjs";
import {
  validateTicketRecord,
  reviewBinding,
  identityHash,
  validateCanonicalTicketIdentity,
  validateTicketMasters,
} from "../scripts/ticket-upscale-validation.mjs";

function reviewedFixture() {
  const sha = "a".repeat(64);
  const model = { productionEligible: true, binSha256: sha, paramSha256: sha };
  const tools = {
    models: { "realesrnet-x4plus": model },
    executables: { realesrgan: { sha256: sha } },
  };
  const journal = { selectedModel: "realesrnet-x4plus", toolsSha256: sha };
  const record = {
    imageId: "question-image-b1",
    sourcePath: "content/assets/questions/sign.jpg",
    originalSha256: sha,
    masterPath: "content/assets-masters/questions/sign.png",
    masterSha256: sha,
    width: 1240,
    height: 1240,
    originalWidth: 210,
    originalHeight: 210,
    status: "accepted",
    reviewSha256: sha,
    inference: {
      imageId: "question-image-b1",
      sourcePath: "content/assets/questions/sign.jpg",
      originalSha256: sha,
      originalWidth: 210,
      originalHeight: 210,
      width: 1240,
      height: 1240,
      model: journal.selectedModel,
      binarySha256: sha,
      modelBinSha256: sha,
      modelParamSha256: sha,
      aiWidth: 840,
      aiHeight: 840,
      aiSha256: sha,
      candidateSha256: sha,
      finalKernel: "cubic",
      parameters: ticketUpscalePolicy,
      elapsedMs: 120,
      command: [
        ".cache/image-qa/ticket-upscale/realesrgan-v0.2.0/realesrgan-ncnn-vulkan-v0.2.0-macos/realesrgan-ncnn-vulkan",
        "-i",
        "content/assets/questions/sign.jpg",
        "-o",
        ".cache/image-qa/ticket-upscale/scratch-ai.png",
        "-m",
        ".cache/image-qa/ticket-upscale/realesrgan/models",
        "-n",
        "realesrnet-x4plus",
        "-s",
        "4",
        "-t",
        "32",
        "-j",
        "1:1:1",
        "-f",
        "png",
      ],
    },
    sanity: {
      kernel: "lanczos3",
      normalization: "srgb",
      referenceWidth: 210,
      referenceHeight: 210,
      dssim: 0.006,
    },
  };
  const source = {
    record: {
      sourcePath: record.sourcePath,
      masterPath: record.masterPath,
      class: "c",
      targetWidth: 1240,
    },
    master: { sha256: sha, width: 1240, height: 1240 },
  };
  const review = {
    imageId: record.imageId,
    originalSha256: record.originalSha256,
    candidateSha256: record.inference.candidateSha256,
    method: "actual-source-candidate-pixel-inspection",
    reviewer: "fixture reviewer",
    reviewedAt: "2026-10-13T10:00:00Z",
    textOrSign: true,
    status: "accepted",
    observations: ["Black arrows retain their original opposite directions."],
    binding: reviewBinding(record, journal),
  };
  return { record, journal, source, tools, review };
}
test("small originals retain actual 4x then explicit bicubic delivery interpolation", () => {
  assert.deepEqual(ticketMasterDimensions(210, 210), {
    width: 1240,
    height: 1240,
    kernel: "cubic",
  });
  assert.deepEqual(ticketMasterDimensions(574, 368), {
    width: 1263,
    height: 810,
    kernel: "lanczos3",
  });
  assert.deepEqual(ticketMasterDimensions(962, 500), {
    width: 2116,
    height: 1100,
    kernel: "lanczos3",
  });
  assert.throws(() => ticketMasterDimensions(0, 1));
});
test("bound individual review rejects model/policy/master/candidate drift and missing review", () => {
  const f = reviewedFixture();
  validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review);
  for (const change of [
    (v) => {
      v.record.inference.command = ["pinned-ncnn", "-s", "2"];
    },
    (v) => {
      v.record.inference.originalSha256 = "0".repeat(64);
    },
    (v) => {
      v.record.inference.modelBinSha256 = "0".repeat(64);
    },
    (v) => {
      v.record.inference.parameters = { ...ticketUpscalePolicy, tile: 128 };
    },
    (v) => {
      v.record.inference.candidateSha256 = "0".repeat(64);
    },
    (v) => {
      v.record.masterSha256 = "0".repeat(64);
    },
    (v) => {
      v.review.observations = [];
    },
    (v) => {
      v.review.method = "automatic-metric-approval";
    },
    (v) => {
      v.review.binding.toolsSha256 = "0".repeat(64);
    },
    (v) => {
      v.record.sanity.dssim = 0.021;
    },
    (v) => {
      v.record.status = "pending";
    },
    (v) => {
      v.journal.selectedModel = "remacri";
    },
  ]) {
    const changed = structuredClone(f);
    change(changed);
    assert.throws(() =>
      validateTicketRecord(
        changed.record,
        changed.journal,
        changed.source,
        changed.tools,
        changed.review,
      ),
    );
  }
  assert.notEqual(
    identityHash(ticketUpscalePolicy),
    identityHash({ ...ticketUpscalePolicy, scale: 2 }),
  );
});
test("a rejection cannot hide its AI candidate or omit separate fallback pixel inspection", () => {
  const f = reviewedFixture();
  f.record.status = f.review.status = "rejected";
  assert.throws(
    () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
    /rejection/,
  );
  f.record.rejection = {
    reason: "Original document characters became malformed strokes",
    candidateSha256: f.record.inference.candidateSha256,
    kernel: "cubic",
  };
  f.review.rejectionReason = f.record.rejection.reason;
  assert.throws(
    () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
    /fallback/,
  );
  f.review.fallbackObservations = ["Original letter shapes retained with softer bicubic edges."];
  assert.throws(
    () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
    /fallback/,
  );
  f.review.fallbackSha256 = f.record.masterSha256;
  f.review.fallbackReviewer = "fixture fallback reviewer";
  f.review.fallbackReviewedAt = "2026-10-13T10:10:00Z";
  validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review);
  for (const mutation of [
    (review) => {
      delete review.fallbackSha256;
    },
    (review) => {
      review.fallbackSha256 = "0".repeat(64);
    },
    (review) => {
      delete review.fallbackReviewer;
    },
    (review) => {
      review.fallbackReviewer = "   ";
    },
    (review) => {
      review.fallbackReviewer = { name: "fixture" };
    },
    (review) => {
      delete review.fallbackReviewedAt;
    },
    (review) => {
      review.fallbackReviewedAt = "not-a-timestamp";
    },
    (review) => {
      review.fallbackReviewedAt = "2026-13-99T99:99:99Z";
    },
    (review) => {
      review.fallbackReviewedAt = "2026-02-30T10:00:00Z";
    },
    (review) => {
      review.fallbackReviewedAt = "1";
    },
    (review) => {
      review.fallbackReviewedAt = 1791885600000;
    },
  ]) {
    const changed = structuredClone(f);
    mutation(changed.review);
    // A freshly rebound review digest cannot excuse a missing or stale proof.
    changed.review.binding = reviewBinding(changed.record, changed.journal);
    changed.record.reviewSha256 = identityHash(changed.review);
    assert.throws(
      () =>
        validateTicketRecord(
          changed.record,
          changed.journal,
          changed.source,
          changed.tools,
          changed.review,
        ),
      /fallback/,
    );
  }
});
test("primary visual reviewer and timestamp reject malformed identity even after rebinding", () => {
  for (const [field, values] of [
    ["reviewer", [undefined, "", "   ", { name: "fixture" }, ["fixture"]]],
    [
      "reviewedAt",
      [
        undefined,
        "",
        "1",
        1791885600000,
        "not-a-timestamp",
        "2026-13-99T99:99:99Z",
        "2026-02-30T10:00:00Z",
      ],
    ],
  ]) {
    for (const value of values) {
      const f = reviewedFixture();
      if (value === undefined) delete f.review[field];
      else f.review[field] = value;
      f.review.binding = reviewBinding(f.record, f.journal);
      f.record.reviewSha256 = identityHash(f.review);
      assert.throws(
        () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
        /individual visual review/,
      );
    }
  }
  for (const timestamp of [
    "2026-10-13T10:00:00Z",
    "2026-10-13T10:00:00.123Z",
    "2026-10-13T07:00:00-03:00",
  ]) {
    const f = reviewedFixture();
    f.review.reviewedAt = timestamp;
    validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review);
  }
});
test("command provenance rejects wrong inputs/models/paths and duplicate or unexpected flags even after review rebinding", () => {
  for (const mutation of [
    (argv) => {
      argv[argv.indexOf("-i") + 1] = "content/assets/questions/other.jpg";
    },
    (argv) => {
      argv[argv.indexOf("-n") + 1] = "remacri";
    },
    (argv) => {
      argv[argv.indexOf("-m") + 1] = ".cache/other/models";
    },
    (argv) => {
      argv[argv.indexOf("-o") + 1] = ".cache/other.png";
    },
    (argv) => {
      argv[argv.indexOf("-f") + 1] = "jpg";
    },
    (argv) => {
      argv[0] = "unverified-ncnn";
    },
    (argv) => {
      argv.push("-s", "2");
    },
    (argv) => {
      argv.push("-n", "remacri");
    },
    (argv) => {
      argv.push("-x");
    },
    (argv) => {
      argv.push("-v");
    },
  ]) {
    const f = reviewedFixture();
    mutation(f.record.inference.command);
    f.review.binding = reviewBinding(f.record, f.journal);
    assert.throws(
      () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
      /inference/,
    );
  }
});

test("record and receipt digests require exact strings even when both sides are rebound", () => {
  for (const value of [undefined, ["a".repeat(64)], {}, 123, "", "A".repeat(64)]) {
    for (const [inferenceField, receiptField] of [
      ["binarySha256", "executable"],
      ["modelBinSha256", "binSha256"],
      ["modelParamSha256", "paramSha256"],
    ]) {
      const f = reviewedFixture();
      const receipt =
        receiptField === "executable"
          ? f.tools.executables.realesrgan
          : f.tools.models[f.journal.selectedModel];
      const key = receiptField === "executable" ? "sha256" : receiptField;
      if (value === undefined) {
        delete f.record.inference[inferenceField];
        delete receipt[key];
      } else {
        f.record.inference[inferenceField] = value;
        receipt[key] = value;
      }
      f.journal.toolsSha256 = identityHash(f.tools);
      f.review.binding = reviewBinding(f.record, f.journal);
      f.record.reviewSha256 = identityHash(f.review);
      assert.throws(() => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review));
    }
    const f = reviewedFixture();
    f.record.inference.aiSha256 = value;
    f.review.binding = reviewBinding(f.record, f.journal);
    f.record.reviewSha256 = identityHash(f.review);
    assert.throws(() => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review));
  }
  const f = reviewedFixture();
  f.record.masterSha256 = f.source.master.sha256 = ["a".repeat(64)];
  f.review.binding = reviewBinding(f.record, f.journal);
  assert.throws(
    () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
    /identity drift/,
  );
  for (const value of [undefined, "true", "false", 1, {}, []]) {
    const f = reviewedFixture();
    f.tools.models[f.journal.selectedModel].productionEligible = value;
    f.journal.toolsSha256 = identityHash(f.tools);
    f.review.binding = reviewBinding(f.record, f.journal);
    f.record.reviewSha256 = identityHash(f.review);
    assert.throws(
      () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
      /unapproved production model/,
    );
  }
});

test("rejection reason must be a meaningful string after review rebinding", () => {
  for (const reason of [
    undefined,
    123,
    true,
    "",
    "   ",
    "short",
    { reason: "malformed text" },
    ["Original characters changed"],
  ]) {
    const f = reviewedFixture();
    f.record.status = f.review.status = "rejected";
    f.record.rejection = {
      reason,
      candidateSha256: f.record.inference.candidateSha256,
      kernel: "cubic",
    };
    f.review.rejectionReason = reason;
    f.review.fallbackSha256 = f.record.masterSha256;
    f.review.fallbackReviewer = "fixture fallback reviewer";
    f.review.fallbackReviewedAt = "2026-10-13T10:10:00Z";
    f.review.fallbackObservations = ["Original letter shapes retained with softer bicubic edges."];
    f.review.binding = reviewBinding(f.record, f.journal);
    f.record.reviewSha256 = identityHash(f.review);
    assert.throws(
      () => validateTicketRecord(f.record, f.journal, f.source, f.tools, f.review),
      /rejection/,
    );
  }
});

test("canonical, inference and review image identities remain exact after rebinding", () => {
  const original = { imageId: "question-image-b1", localPath: "content/assets/questions/sign.jpg" };
  const f = reviewedFixture();
  validateCanonicalTicketIdentity(f.record, original);
  for (const mutation of [
    (f) => {
      f.record.imageId = f.record.inference.imageId = f.review.imageId = "question-image-b2";
    },
    (f) => {
      f.record.imageId = f.record.inference.imageId = f.review.imageId = ["question-image-b1"];
    },
    (f) => {
      f.record.imageId = undefined;
    },
  ]) {
    const changed = structuredClone(f);
    mutation(changed);
    changed.review.binding = reviewBinding(changed.record, changed.journal);
    changed.record.reviewSha256 = identityHash(changed.review);
    assert.throws(
      () => validateCanonicalTicketIdentity(changed.record, original),
      /canonical image ID/,
    );
  }
  for (const mutation of [
    (f) => {
      f.record.inference.imageId = "question-image-b2";
    },
    (f) => {
      delete f.record.inference.imageId;
    },
    (f) => {
      f.review.imageId = "question-image-b2";
    },
    (f) => {
      delete f.review.imageId;
    },
    (f) => {
      f.review.originalSha256 = "0".repeat(64);
    },
    (f) => {
      delete f.review.originalSha256;
    },
    (f) => {
      f.review.candidateSha256 = "0".repeat(64);
    },
    (f) => {
      delete f.review.candidateSha256;
    },
  ]) {
    const changed = structuredClone(f);
    mutation(changed);
    changed.review.binding = reviewBinding(changed.record, changed.journal);
    changed.record.reviewSha256 = identityHash(changed.review);
    assert.throws(() =>
      validateTicketRecord(
        changed.record,
        changed.journal,
        changed.source,
        changed.tools,
        changed.review,
      ),
    );
  }
});

test("duplicate canonical image IDs reject before any corpus metric work", async () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-ticket-identity-"));
  try {
    const canonical = JSON.parse(
      readFileSync(
        new URL("../content/image-metadata/question-images.manifest.json", import.meta.url),
      ),
    );
    canonical.images[1].imageId = canonical.images[0].imageId;
    for (const [path, value] of [
      ["content/image-metadata/question-images.manifest.json", JSON.stringify(canonical)],
      [
        "content/image-metadata/ticket-upscale.journal.json",
        readFileSync(
          new URL("../content/image-metadata/ticket-upscale.journal.json", import.meta.url),
        ),
      ],
      [
        "content/validation/ticket-upscale/tools.json",
        readFileSync(new URL("../content/validation/ticket-upscale/tools.json", import.meta.url)),
      ],
    ]) {
      const file = join(root, path);
      mkdirSync(join(file, ".."), { recursive: true });
      writeFileSync(file, value);
    }
    await assert.rejects(validateTicketMasters(root, [], {}), /incomplete inventory/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
