#!/usr/bin/env node
// Explicit GPU maintainer operation. Creates candidates only, never reviews or approvals.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import { repositoryRoot, nativeTools, comparePng } from "./image-qa.mjs";
import { sha256, readJson, confinedPath, jsonBytes } from "./image-pipeline.mjs";
import { ticketUpscalePolicy, ticketMasterDimensions } from "./ticket-upscale-policy.mjs";
import { ticketToolsPath, identityHash } from "./ticket-upscale-validation.mjs";

const cache = ".cache/image-qa/ticket-upscale";
async function inference(binary, args) {
  await new Promise((done, reject) => {
    const child = spawn(binary, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (bytes) => {
      stderr += bytes;
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? done() : reject(new Error(`NCNN failed (${code}): ${stderr}`)),
    );
  });
}
export async function generateTicketCandidates(model, { sample = false } = {}) {
  if (!["realesrgan-x4plus", "realesrnet-x4plus", "remacri"].includes(model))
    throw new Error("Choose an exact comparison model");
  const root = repositoryRoot;
  const toolsReceipt = await readJson(join(root, ticketToolsPath));
  if (!sample && !toolsReceipt.models[model].productionEligible)
    throw new Error("Evaluation-only model cannot process the production batch");
  const binaryRelative =
    model === "remacri"
      ? `${cache}/upscayl/upscayl-bin-20251207-174704-macos/upscayl-bin`
      : `${cache}/realesrgan-v0.2.0/realesrgan-ncnn-vulkan-v0.2.0-macos/realesrgan-ncnn-vulkan`;
  const modelRelative =
    model === "remacri" ? `${cache}/remacri/models` : `${cache}/realesrgan/models`;
  const binary = await confinedPath(root, binaryRelative);
  const binarySha256 = sha256(await readFile(binary));
  const modelBinSha256 = sha256(
    await readFile(await confinedPath(root, `${modelRelative}/${model}.bin`)),
  );
  const modelParamSha256 = sha256(
    await readFile(await confinedPath(root, `${modelRelative}/${model}.param`)),
  );
  const wanted = toolsReceipt.models[model];
  if (
    binarySha256 !==
      toolsReceipt.executables[model === "remacri" ? "upscayl" : "realesrgan"].sha256 ||
    modelBinSha256 !== wanted.binSha256 ||
    modelParamSha256 !== wanted.paramSha256
  )
    throw new Error("Tool/model bytes differ from the pinned receipt; no inference executed");
  const canonical = await readJson(
    join(root, "content/image-metadata/question-images.manifest.json"),
  );
  const sampleIds = new Set(
    (await readJson(join(root, "content/validation/ticket-upscale/sample.json"))).sources.map(
      (s) => s.imageId,
    ),
  );
  const sources = canonical.images
    .filter((r) => !sample || sampleIds.has(r.imageId))
    .sort((a, b) => a.localPath.localeCompare(b.localPath));
  const output = `${cache}/${sample ? "reproduction" : "candidates"}/${model}`;
  await mkdir(join(root, output), { recursive: true });
  const resultPath = join(root, `${output}/inferences.json`);
  let previous = { records: [] };
  try {
    previous = await readJson(resultPath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  let pilot = { records: [] };
  try {
    pilot = await readJson(join(root, `${cache}/pilot-results.json`));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const tools = await nativeTools();
  const records = [];
  const startedAt = new Date().toISOString();
  const started = Date.now();
  for (const original of sources) {
    const input = await readFile(await confinedPath(root, original.localPath));
    if (sha256(input) !== original.sha256) throw new Error("Canonical original hash drift");
    const d = await sharp(input, { failOn: "warning" }).metadata();
    const target = ticketMasterDimensions(d.width, d.height);
    const candidatePath = `${output}/${original.imageId.replace("question-image-", "")}.png`;
    const cached = previous.records.find((r) => r.sourcePath === original.localPath);
    if (
      cached &&
      cached.binarySha256 === binarySha256 &&
      cached.modelBinSha256 === modelBinSha256 &&
      cached.modelParamSha256 === modelParamSha256 &&
      cached.originalSha256 === original.sha256 &&
      cached.model === model &&
      cached.originalWidth === d.width &&
      cached.originalHeight === d.height &&
      cached.width === target.width &&
      cached.height === target.height &&
      cached.finalKernel === target.kernel &&
      cached.candidatePath === candidatePath &&
      identityHash(cached.parameters) === identityHash(ticketUpscalePolicy) &&
      sha256(await readFile(await confinedPath(root, cached.candidatePath))) ===
        cached.candidateSha256
    ) {
      records.push(cached);
      continue;
    }
    const reused =
      !sample &&
      pilot.records.find(
        (r) =>
          r.imageId === original.imageId &&
          r.model === model &&
          r.binarySha256 === binarySha256 &&
          r.modelBinSha256 === modelBinSha256 &&
          r.modelParamSha256 === modelParamSha256 &&
          r.originalSha256 === original.sha256 &&
          r.width === target.width &&
          r.height === target.height &&
          r.kernel === target.kernel,
      );
    let candidate;
    let aiSha256;
    let elapsedMs;
    let command;
    let aiWidth;
    let aiHeight;
    if (reused) {
      candidate = await readFile(await confinedPath(root, reused.candidatePath));
      if (sha256(candidate) !== reused.candidateSha256)
        throw new Error("Pilot candidate integrity drift");
      ({ aiSha256, aiWidth, aiHeight, elapsedMs, command } = reused);
    } else {
      const raw = join(root, `${cache}/scratch-ai.png`);
      const args = [
        "-i",
        join(root, original.localPath),
        "-o",
        raw,
        "-m",
        join(root, modelRelative),
        "-n",
        model,
        "-s",
        "4",
        "-t",
        "32",
        "-j",
        "1:1:1",
        "-f",
        "png",
        ...(model === "remacri" ? ["-z", "4"] : []),
      ];
      const begin = Date.now();
      await inference(binary, args);
      const ai = await readFile(raw);
      const metadata = await sharp(ai, { failOn: "warning" }).metadata();
      aiWidth = metadata.width;
      aiHeight = metadata.height;
      if (aiWidth !== d.width * 4 || aiHeight !== d.height * 4)
        throw new Error("NCNN did not produce exact scale4 pixels");
      aiSha256 = sha256(ai);
      candidate = await sharp(ai)
        .toColourspace("srgb")
        .resize(target.width, target.height, { fit: "fill", kernel: target.kernel })
        .png()
        .toBuffer();
      elapsedMs = Date.now() - begin;
      command = [
        binaryRelative,
        ...args.map((arg) => (arg.startsWith(`${root}/`) ? arg.slice(root.length + 1) : arg)),
      ];
    }
    await writeFile(join(root, candidatePath), candidate);
    const reference = await sharp(input).toColourspace("srgb").png().toBuffer();
    const reduced = await sharp(candidate)
      .resize(d.width, d.height, { fit: "fill", kernel: "lanczos3" })
      .png()
      .toBuffer();
    const sanity = await comparePng(reference, reduced, tools);
    records.push({
      imageId: original.imageId,
      sourcePath: original.localPath,
      originalSha256: original.sha256,
      originalWidth: d.width,
      originalHeight: d.height,
      model,
      binarySha256,
      modelBinSha256,
      modelParamSha256,
      aiSha256,
      aiWidth,
      aiHeight,
      candidatePath,
      candidateSha256: sha256(candidate),
      width: target.width,
      height: target.height,
      finalKernel: target.kernel,
      parameters: ticketUpscalePolicy,
      elapsedMs,
      command,
      reusedPilot: !!reused,
      candidateBytes: candidate.length,
      sanityDssim: sanity.dssim,
    });
    await writeFile(
      resultPath,
      jsonBytes({
        schemaVersion: 1,
        startedAt,
        wallElapsedMs: Date.now() - started,
        model,
        records,
      }),
    );
    console.log(
      `${records.length}/${sources.length} ${original.imageId}; DSSIM=${sanity.dssim}; ${candidate.length} bytes${reused ? " (verified pilot reuse)" : ""}`,
    );
  }
  await writeFile(
    resultPath,
    jsonBytes({ schemaVersion: 1, startedAt, wallElapsedMs: Date.now() - started, model, records }),
  );
  return records;
}
if (process.argv[1]?.endsWith("/generate-ticket-upscales.mjs")) {
  const args = process.argv.slice(2);
  if (args.length < 2 || args[0] !== "--model" || args.slice(2).some((arg) => arg !== "--sample"))
    throw new Error("Usage: generate-ticket-upscales.mjs --model <exact-model> [--sample]");
  await generateTicketCandidates(args[1], { sample: args.includes("--sample") });
}
