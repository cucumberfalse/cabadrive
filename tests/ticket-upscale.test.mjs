import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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

// IF030 expected IDs are independently curated from the accepted 66-image disposition
// (map SHA 12a63bed30d1576e727ace09ee73530fa68e798284feedc8f9903ecac61a98b1)
// and the prior audit's 209 unchanged true reviews. Never derive these from tested flags.
const priorTrueClassificationIds = new Set(
  "b2 b3 b4 b5 b7 b8 b9 b10 b11 b15 b18 b19 b20 b22 b24 b25 b26 b27 b28 b29 b30 b31 b32 b33 b34 b37 b39 b41 b42 b43 b46 b47 b48 b49 b50 b51 b52 b53 b54 b55 b56 b57 b58 b60 b62 b65 b66 b71 b73 b74 b75 b76 b78 b82 b83 b84 b85 b86 b87 b88 b89 b90 b91 b92 b93 b94 b95 b96 b97 b98 b99 b100 b101 b102 b103 b104 b105 b106 b107 b108 b109 b110 b113 b115 b118 b121 b123 b124 b125 b127 b130 b131 b132 b133 b134 b135 b136 b138 b139 b140 b141 b142 b143 b144 b145 b146 b147 b150 b151 b152 b153 b154 b156 b157 b158 b159 b160 b161 b162 b163 b164 b168 b169 b170 b171 b172 b173 b175 b176 b178 b179 b180 b181 b182 b183 b185 b187 b190 b195 b196 b197 b198 b200 b201 b202 b203 b205 b206 b207 b208 b209 b212 b218 b220 b221 b222 b223 b224 b225 b226 b227 b228 b229 b230 b231 b232 b233 b234 b235 b236 b237 b238 b239 b240 b241 b242 b243 b244 b245 b246 b247 b248 b249 b250 b251 b252 b253 b254 b255 b256 b257 b258 b259 b260 b261 b262 b263 b264 b265 b266 b267 b268 b269 b270 b271 b272 b273 b274 b275".split(
    " ",
  ),
);
const correctedClassificationIds = new Set(
  "b1 b6 b12 b13 b14 b16 b17 b21 b23 b35 b36 b40 b44 b45 b61 b63 b64 b67 b68 b69 b70 b72 b77 b111 b112 b114 b116 b117 b119 b126 b128 b129 b137 b148 b149 b155 b166 b167 b174 b177 b184 b186 b199 b204 b210 b211 b213 b216".split(
    " ",
  ),
);
const retainedFalseClassificationIds = new Set(
  "b38 b59 b79 b80 b81 b120 b122 b165 b188 b189 b191 b192 b193 b194 b214 b215 b217 b219".split(" "),
);
const classificationJournalPath = "content/image-metadata/ticket-upscale.journal.json";
const classificationCheckpointPath = "content/validation/ticket-upscale/classification-audit.json";
const corpusBytes = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const exactDigest = (bytes) => createHash("sha256").update(bytes).digest("hex");
function classificationCorpus() {
  const bytes = corpusBytes(classificationJournalPath);
  const journal = JSON.parse(bytes);
  return {
    bytes,
    journal,
    reviews: new Map(journal.records.map((r) => [r.imageId, corpusBytes(r.reviewPath)])),
  };
}
function assertGovernedClassification(journal, reviews) {
  const expectedIds = new Set([
    ...priorTrueClassificationIds,
    ...correctedClassificationIds,
    ...retainedFalseClassificationIds,
  ]);
  assert.equal(expectedIds.size, 275);
  assert.equal(journal.records.length, 275);
  assert.deepEqual(
    new Set(journal.records.map((r) => r.imageId.replace("question-image-", ""))),
    expectedIds,
  );
  for (const record of journal.records) {
    const id = record.imageId.replace("question-image-", "");
    const raw = reviews.get(record.imageId);
    assert.equal(exactDigest(raw), record.reviewSha256, `${id}: raw review binding`);
    assert.equal(
      JSON.parse(raw).textOrSign,
      !retainedFalseClassificationIds.has(id),
      `${id}: governed text/sign classification drift`,
    );
  }
}
test("IF030 all 275 reviews match independently governed classifications and exact current bindings", () => {
  const { bytes, journal, reviews } = classificationCorpus();
  assert.equal(priorTrueClassificationIds.size, 209);
  assert.equal(correctedClassificationIds.size, 48);
  assert.equal(retainedFalseClassificationIds.size, 18);
  assertGovernedClassification(journal, reviews);
  const checkpoint = JSON.parse(corpusBytes(classificationCheckpointPath));
  assert.equal(checkpoint.currentJournalSha256, exactDigest(bytes));
  assert.equal(
    checkpoint.priorJournalSha256,
    "47e7deb145ecd66454cfcc82aa190faca175b7e16648c34ea5eca89173cfffbc",
  );
  assert.deepEqual(checkpoint.counts, {
    falseToTrue: 48,
    retainedFalse: 18,
    unchangedTrue: 209,
    currentTrue: 257,
    currentFalse: 18,
    accepted: 198,
    rejected: 77,
  });
  assert.equal(checkpoint.records.length, 275);
  for (const [index, record] of journal.records.entries()) {
    const entry = checkpoint.records[index];
    const id = record.imageId.replace("question-image-", "");
    assert.equal(entry.imageId, record.imageId);
    assert.equal(entry.expectedTextOrSign, !retainedFalseClassificationIds.has(id));
    assert.equal(entry.reviewSha256, record.reviewSha256);
    assert.equal(entry.sourceSha256, record.originalSha256);
    assert.equal(entry.masterSha256, record.masterSha256);
    const review = JSON.parse(reviews.get(record.imageId));
    if (correctedClassificationIds.has(id)) {
      assert.equal(review.classificationCorrection.previousReviewSha256, entry.priorReviewSha256);
      assert.equal(review.classificationCorrection.previousTextOrSign, false);
      assert.ok(
        Date.parse(review.classificationCorrection.reviewedAt) > Date.parse(review.reviewedAt),
      );
      assert.ok(review.classificationCorrection.basis.length > 10);
      assert.equal(review.classificationCorrection.governedMapSha256, checkpoint.governedMapSha256);
    } else {
      assert.equal(entry.priorReviewSha256, entry.reviewSha256);
      assert.equal(review.classificationCorrection, undefined);
    }
  }
  const protectedJournal = structuredClone(journal);
  for (const record of protectedJournal.records) delete record.reviewSha256;
  assert.equal(
    identityHash(protectedJournal),
    "5eda856529dda74d55ac2c8fdb214233c90e7018b5475d6c84a30fb6e9d525c2",
  );
  for (const proof of checkpoint.historicalProofs)
    assert.equal(exactDigest(corpusBytes(proof.path)), proof.sha256);
  for (const id of ["b65", "b222", "b112", "b23", "b67", "b128", "b174", "b63", "b213"]) {
    assert.equal(JSON.parse(reviews.get(`question-image-${id}`)).textOrSign, true, id);
  }
  for (const id of ["b38", "b165", "b217"])
    assert.equal(JSON.parse(reviews.get(`question-image-${id}`)).textOrSign, false, id);
});
test("IF030 governed label drift fails even after an exact freshly rebound journal digest", () => {
  const { journal, reviews } = classificationCorpus();
  const record = journal.records.find((r) => r.imageId === "question-image-b112");
  const review = JSON.parse(reviews.get(record.imageId));
  review.textOrSign = false;
  const changedBytes = Buffer.from(`${JSON.stringify(review, null, 2)}\n`);
  reviews.set(record.imageId, changedBytes);
  record.reviewSha256 = exactDigest(changedBytes);
  assert.equal(exactDigest(reviews.get(record.imageId)), record.reviewSha256);
  assert.throws(
    () => assertGovernedClassification(journal, reviews),
    /b112: governed text\/sign classification drift/,
  );
});
test("IF030 production validator rejects the old review digest before any master or metric work", async () => {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-ticket-classification-"));
  try {
    const { journal } = classificationCorpus();
    const first = journal.records[0];
    assert.equal(first.imageId, "question-image-b1");
    const checkpoint = JSON.parse(corpusBytes(classificationCheckpointPath));
    first.reviewSha256 = checkpoint.records[0].priorReviewSha256;
    assert.notEqual(first.reviewSha256, exactDigest(corpusBytes(first.reviewPath)));
    const canonicalPath = "content/image-metadata/question-images.manifest.json";
    const canonical = JSON.parse(corpusBytes(canonicalPath));
    for (const [path, bytes] of [
      [canonicalPath, corpusBytes(canonicalPath)],
      [canonical.questionSourcePath, corpusBytes(canonical.questionSourcePath)],
      [classificationJournalPath, Buffer.from(JSON.stringify(journal))],
      [
        "content/validation/ticket-upscale/tools.json",
        corpusBytes("content/validation/ticket-upscale/tools.json"),
      ],
      [first.sourcePath, corpusBytes(first.sourcePath)],
      [first.reviewPath, corpusBytes(first.reviewPath)],
    ]) {
      const destination = join(root, path);
      mkdirSync(join(destination, ".."), { recursive: true });
      writeFileSync(destination, bytes);
    }
    // No master, rejected candidate, metric executable or later JPEG exists here.
    // Reaching any such work would fail differently; the actual production digest gate must win.
    const sources = journal.records.map((record) => ({
      record: { class: "c", sourcePath: record.sourcePath },
    }));
    await assert.rejects(
      validateTicketMasters(root, sources, {}),
      /individual review integrity drift/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
