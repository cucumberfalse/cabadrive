import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { canonicalJson } from "./content-shards.mjs";
import { confinedPath, sha256, readJson, decodeMaster } from "./image-pipeline.mjs";
import { comparePng } from "./image-qa.mjs";
import { ticketUpscalePolicy, ticketMasterDimensions } from "./ticket-upscale-policy.mjs";

export const ticketJournalPath = "content/image-metadata/ticket-upscale.journal.json";
export const ticketToolsPath = "content/validation/ticket-upscale/tools.json";
export const identityHash = (value) => sha256(canonicalJson(value));
const fail = (message) => {
  throw new Error(`Ticket upscale: ${message}`);
};
const digest = (value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
const imageId = (value) => typeof value === "string" && /^question-image-b[1-9]\d*$/.test(value);
export function validateCanonicalTicketIdentity(record, original) {
  if (
    !imageId(record.imageId) ||
    record.imageId !== original.imageId ||
    record.sourcePath !== original.localPath
  )
    fail("canonical image ID binding drift");
}
function validReviewTimestamp(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value.slice(0, 10)).toISOString().slice(0, 10) === value.slice(0, 10)
  );
}
function validInferenceCommand(command, sourcePath, model) {
  const cache = ".cache/image-qa/ticket-upscale";
  const expected = [
    `${cache}/realesrgan-v0.2.0/realesrgan-ncnn-vulkan-v0.2.0-macos/realesrgan-ncnn-vulkan`,
    "-i",
    sourcePath,
    "-o",
    `${cache}/scratch-ai.png`,
    "-m",
    `${cache}/realesrgan/models`,
    "-n",
    model,
    "-s",
    String(ticketUpscalePolicy.scale),
    "-t",
    String(ticketUpscalePolicy.tile),
    "-j",
    ticketUpscalePolicy.threads,
    "-f",
    "png",
  ];
  return (
    Array.isArray(command) &&
    command.length === expected.length &&
    command.every((value, index) => value === expected[index])
  );
}
export function reviewBinding(record, journal) {
  return {
    sourcePath: record.sourcePath,
    originalSha256: record.originalSha256,
    masterPath: record.masterPath,
    masterSha256: record.masterSha256,
    candidateSha256: record.inference.candidateSha256,
    inferenceSha256: identityHash(record.inference),
    policySha256: identityHash(ticketUpscalePolicy),
    toolsSha256: journal.toolsSha256,
  };
}
export function validateTicketRecord(record, journal, source, toolReceipt, review) {
  const model = toolReceipt.models?.[journal.selectedModel];
  const wanted = ticketMasterDimensions(record.originalWidth, record.originalHeight);
  if (
    !model ||
    model.productionEligible !== true ||
    !digest(model.binSha256) ||
    !digest(model.paramSha256) ||
    !digest(toolReceipt.executables?.realesrgan?.sha256) ||
    !["realesrgan-x4plus", "realesrnet-x4plus"].includes(journal.selectedModel)
  )
    fail("unapproved production model");
  if (
    record.sourcePath !== source.record.sourcePath ||
    !imageId(record.imageId) ||
    record.masterPath !== source.record.masterPath ||
    record.masterSha256 !== source.master.sha256 ||
    record.width !== source.master.width ||
    record.height !== source.master.height ||
    record.width !== wanted.width ||
    record.height !== wanted.height ||
    source.record.class !== "c" ||
    source.record.targetWidth !== 1240 ||
    !digest(record.originalSha256) ||
    !digest(record.masterSha256) ||
    !digest(record.reviewSha256) ||
    !["accepted", "rejected"].includes(record.status)
  )
    fail("source/master/status identity drift");
  const inference = record.inference;
  if (
    inference?.model !== journal.selectedModel ||
    inference.imageId !== record.imageId ||
    inference.sourcePath !== record.sourcePath ||
    inference.originalSha256 !== record.originalSha256 ||
    inference.originalWidth !== record.originalWidth ||
    inference.originalHeight !== record.originalHeight ||
    inference.width !== record.width ||
    inference.height !== record.height ||
    inference.modelBinSha256 !== model.binSha256 ||
    inference.modelParamSha256 !== model.paramSha256 ||
    inference.binarySha256 !== toolReceipt.executables?.realesrgan?.sha256 ||
    !digest(inference.binarySha256) ||
    !digest(inference.modelBinSha256) ||
    !digest(inference.modelParamSha256) ||
    inference.aiWidth !== record.originalWidth * 4 ||
    inference.aiHeight !== record.originalHeight * 4 ||
    inference.finalKernel !== wanted.kernel ||
    !digest(inference.aiSha256) ||
    !digest(inference.candidateSha256) ||
    identityHash(inference.parameters) !== identityHash(ticketUpscalePolicy) ||
    !validInferenceCommand(inference.command, record.sourcePath, journal.selectedModel) ||
    !Number.isFinite(inference.elapsedMs) ||
    inference.elapsedMs <= 0
  )
    fail("inference/model/policy drift");
  if (
    review.method !== "actual-source-candidate-pixel-inspection" ||
    review.imageId !== record.imageId ||
    review.originalSha256 !== record.originalSha256 ||
    review.candidateSha256 !== inference.candidateSha256 ||
    typeof review.reviewer !== "string" ||
    !review.reviewer.trim() ||
    !validReviewTimestamp(review.reviewedAt) ||
    typeof review.textOrSign !== "boolean" ||
    !Array.isArray(review.observations) ||
    !review.observations.length ||
    review.observations.some((note) => typeof note !== "string" || note.trim().length < 10) ||
    canonicalJson(review.binding) !== canonicalJson(reviewBinding(record, journal)) ||
    review.status !== record.status
  )
    fail("missing/stale individual visual review");
  if (record.status === "accepted") {
    if (
      record.masterSha256 !== inference.candidateSha256 ||
      record.rejection ||
      review.rejectionReason
    )
      fail("accepted candidate was replaced or marked rejected");
  } else if (
    typeof record.rejection?.reason !== "string" ||
    record.rejection.reason.trim().length < 10 ||
    review.rejectionReason !== record.rejection.reason ||
    record.rejection.candidateSha256 !== inference.candidateSha256 ||
    record.rejection.kernel !== "cubic" ||
    review.fallbackSha256 !== record.masterSha256 ||
    typeof review.fallbackReviewer !== "string" ||
    !review.fallbackReviewer.trim() ||
    !validReviewTimestamp(review.fallbackReviewedAt) ||
    !Array.isArray(review.fallbackObservations) ||
    !review.fallbackObservations.length ||
    review.fallbackObservations.some((note) => typeof note !== "string" || note.trim().length < 10)
  )
    fail("unrecorded rejection or missing fallback inspection");
  if (
    record.sanity?.kernel !== "lanczos3" ||
    record.sanity.normalization !== "srgb" ||
    record.sanity.referenceWidth !== record.originalWidth ||
    record.sanity.referenceHeight !== record.originalHeight ||
    !Number.isFinite(record.sanity.dssim) ||
    record.sanity.dssim < 0 ||
    record.sanity.dssim > 0.02
  )
    fail("invalid upscale sanity evidence");
}
export async function validateTicketMasters(root, sources, tools) {
  const canonical = await readJson(
    await confinedPath(root, "content/image-metadata/question-images.manifest.json"),
  );
  const journal = await readJson(await confinedPath(root, ticketJournalPath));
  const toolBytes = await readFile(await confinedPath(root, ticketToolsPath));
  const toolReceipt = JSON.parse(toolBytes);
  if (
    journal.schemaVersion !== 1 ||
    canonical.baseline.uniqueImageCount !== 275 ||
    canonical.images.length !== 275 ||
    canonical.images.some((original) => !imageId(original.imageId)) ||
    new Set(canonical.images.map((original) => original.imageId)).size !== 275 ||
    !Array.isArray(journal.records) ||
    journal.records.length !== 275 ||
    journal.toolsSha256 !== sha256(toolBytes) ||
    canonicalJson(journal.policy) !== canonicalJson(ticketUpscalePolicy) ||
    canonical.baseline.imageReferenceCount !== 276 ||
    canonical.baseline.questionCount !== 460
  )
    fail("incomplete inventory or changed policy/tool receipt");
  const questions = await readJson(await confinedPath(root, canonical.questionSourcePath));
  const list = Array.isArray(questions) ? questions : questions.questions;
  const paths = list.filter((q) => q.image).map((q) => q.image.localPath);
  if (list.length !== 460 || paths.length !== 276 || new Set(paths).size !== 275)
    fail("incomplete question references");
  const canonicalByPath = new Map(canonical.images.map((r) => [r.localPath, r]));
  const cSources = sources.filter((source) => source.record.class === "c");
  if (cSources.length !== 275) fail("missing registered class-c masters");
  let previous = "";
  for (const record of journal.records) {
    if (record.sourcePath <= previous) fail("duplicate or unordered journal");
    previous = record.sourcePath;
    const original = canonicalByPath.get(record.sourcePath);
    const source = cSources.find((s) => s.record.sourcePath === record.sourcePath);
    if (
      !original ||
      !source ||
      !paths.includes(record.sourcePath) ||
      record.originalSha256 !== original.sha256
    )
      fail("canonical source/reference binding drift");
    validateCanonicalTicketIdentity(record, original);
    const bytes = await readFile(await confinedPath(root, record.sourcePath));
    const dimensions = await sharp(bytes, { failOn: "warning" }).metadata();
    if (
      sha256(bytes) !== original.sha256 ||
      dimensions.width !== record.originalWidth ||
      dimensions.height !== record.originalHeight
    )
      fail("original bytes/dimensions drift");
    const reviewBytes = await readFile(await confinedPath(root, record.reviewPath));
    if (
      !record.reviewPath.startsWith("content/validation/ticket-upscale/reviews/") ||
      sha256(reviewBytes) !== record.reviewSha256
    )
      fail("individual review integrity drift");
    validateTicketRecord(record, journal, source, toolReceipt, JSON.parse(reviewBytes));
    if (record.status === "rejected") {
      const rejectedBytes = await readFile(
        await confinedPath(root, record.rejection.candidatePath),
      );
      if (
        !record.rejection.candidatePath.startsWith("content/validation/ticket-upscale/rejected/") ||
        sha256(rejectedBytes) !== record.inference.candidateSha256
      )
        fail("missing/tampered rejected candidate");
      await decodeMaster(rejectedBytes, record.rejection.candidatePath);
      const fallback = await sharp(bytes)
        .toColourspace("srgb")
        .resize(record.width, record.height, { fit: "fill", kernel: "cubic" })
        .png()
        .toBuffer();
      if (sha256(fallback) !== record.masterSha256)
        fail("fallback differs from original bicubic policy");
    }
    const reference = await sharp(bytes).toColourspace("srgb").png().toBuffer();
    const candidate = await sharp(source.master.bytes)
      .toColourspace("srgb")
      .resize(record.originalWidth, record.originalHeight, { fit: "fill", kernel: "lanczos3" })
      .png()
      .toBuffer();
    const actual = await comparePng(reference, candidate, tools);
    if (actual.dssim > 0.02 || Math.abs(actual.dssim - record.sanity.dssim) > 0.000001)
      fail("real upscale sanity mismatch");
  }
  console.log(
    `Ticket upscale: 275 individually reviewed masters; 276 original references verified.`,
  );
  return journal;
}
