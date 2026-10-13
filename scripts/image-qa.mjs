import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import sharp from "sharp";

import { nativeIdentity, repositoryRoot } from "./image-native-policy.mjs";
export { nativePins, nativeIdentity, repositoryRoot } from "./image-native-policy.mjs";
const execute = promisify(execFile);
export async function runBinary(binary, args) {
  try {
    const { stdout, stderr } = await execute(binary, args, { maxBuffer: 1024 * 1024 });
    return `${stdout}\n${stderr}`.trim();
  } catch (error) {
    throw new Error(`Image QA command failed: ${binary} ${args.join(" ")}: ${error.message}`);
  }
}
export function parseMetric(output, name) {
  // DSSIM emits one score followed by a filename; SSIMULACRA2 emits one number.
  if (output.trim().split(/\r?\n/).length !== 1) throw new Error(`Multiple ${name} metric outputs`);
  const raw = name === "ssimulacra2" ? output.trim().replace(/^Score: /, "") : output.trim();
  const token = raw.split(/\s+/)[0];
  if (name === "ssimulacra2" && raw !== token) throw new Error(`Invalid ${name} output: ${output}`);
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(token ?? "")) {
    throw new Error(`Invalid ${name} metric output: ${output}`);
  }
  const score = Number(token);
  if (!Number.isFinite(score) || (name === "dssim" && score < 0)) {
    throw new Error(`Nonfinite/invalid ${name} metric: ${output}`);
  }
  return score;
}
export async function withScratch(operation) {
  const path = await mkdtemp(join(tmpdir(), "cabadrive-image-qa-"));
  try {
    return await operation(path);
  } finally {
    await rm(path, { recursive: true, force: true });
  }
}
export async function nativeTools(options = {}) {
  const tools = {
    dssim: options.dssim ?? join(repositoryRoot, ".cache/image-qa/bin/dssim"),
    ssimulacra2: options.ssimulacra2 ?? join(repositoryRoot, ".cache/image-qa/bin/ssimulacra2_rs"),
  };
  const receipt = JSON.parse(
    await readFile(join(dirname(tools.ssimulacra2), "../install-receipt.json"), "utf8"),
  );
  if (JSON.stringify(receipt.identity) !== JSON.stringify(nativeIdentity()))
    throw new Error("Stale native source/lock/features receipt; run setup:image-qa");
  for (const [key, binary] of Object.entries(tools)) {
    const hash = createHash("sha256")
      .update(await readFile(binary))
      .digest("hex");
    // Explicit binary overrides still need a source/lock receipt for their actual
    // bytes; equal-image behavior alone cannot identify the compiled graph.
    if (receipt.binaries?.[key] !== hash)
      throw new Error(`Native binary differs from source/lock receipt: ${key}`);
  }
  const dssimVersion = await runBinary(tools.dssim, ["-h"]);
  const ssimVersion = await runBinary(tools.ssimulacra2, ["--version"]);
  if (
    !/\bVersion 3\.4\.0\b/.test(dssimVersion) ||
    !/\bssimulacra2_rs\s+0\.5\.2\b/.test(ssimVersion)
  ) {
    throw new Error(`Wrong native image QA versions: ${dssimVersion}; ${ssimVersion}`);
  }
  const equal = await sharp({
    create: { width: 64, height: 64, channels: 3, background: "#7496c1" },
  })
    .png()
    .toBuffer();
  await withScratch(async (scratch) => {
    const a = join(scratch, "equal-a.png");
    const b = join(scratch, "equal-b.png");
    await writeFile(a, equal);
    await writeFile(b, equal);
    const dssim = parseMetric(await runBinary(tools.dssim, [a, b]), "dssim");
    const ssim = parseMetric(await runBinary(tools.ssimulacra2, ["image", a, b]), "ssimulacra2");
    if (dssim > 0.000001 || ssim < 99.99)
      throw new Error("Native QA known-equal comparison failed");
  });
  return tools;
}
export async function comparePng(reference, candidate, tools, sampled = false) {
  const [a, b] = await Promise.all([sharp(reference).metadata(), sharp(candidate).metadata()]);
  if (a.width !== b.width || a.height !== b.height)
    throw new Error("QA reference/candidate dimensions differ");
  return withScratch(async (scratch) => {
    const referencePath = join(scratch, "reference.png");
    const candidatePath = join(scratch, "candidate.png");
    await writeFile(referencePath, reference);
    await writeFile(candidatePath, candidate);
    const result = {
      dssim: parseMetric(await runBinary(tools.dssim, [referencePath, candidatePath]), "dssim"),
    };
    if (sampled)
      result.ssimulacra2 = parseMetric(
        await runBinary(tools.ssimulacra2, ["image", referencePath, candidatePath]),
        "ssimulacra2",
      );
    return result;
  });
}
