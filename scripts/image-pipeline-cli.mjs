import { resolve, isAbsolute, dirname } from "node:path";
import { readFile, writeFile, mkdir, rename, unlink } from "node:fs/promises";
import { repositoryRoot, nativeTools } from "./image-qa.mjs";
import {
  confinedPath,
  loadSources,
  readJson,
  jsonBytes,
  buildRaster,
  validateRaster,
  immutableWrite,
} from "./image-pipeline.mjs";
import { auditSvg, verifySvgEvidence, svgEvidencePath } from "./image-svg-audit.mjs";

export function parseArguments(args, command) {
  const options = { root: repositoryRoot, rasterOnly: false, write: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--root" && args[index + 1] && isAbsolute(args[index + 1]))
      options.root = resolve(args[++index]);
    else if (arg === "--raster-only") options.rasterOnly = true;
    else if (arg === "--write" && command === "validate") options.write = true;
    else throw new Error(`Unknown/invalid image argument: ${arg}`);
  }
  if (options.rasterOnly && options.root === repositoryRoot)
    throw new Error("--raster-only requires an isolated fixture root");
  return options;
}
async function atomicJson(root, relative, value) {
  const path = await confinedPath(root, relative, true);
  await mkdir(dirname(path), { recursive: true });
  const scratch = `${path}.tmp-${process.pid}`;
  await writeFile(scratch, jsonBytes(value), { flag: "wx" });
  try {
    await rename(scratch, path);
  } finally {
    await unlink(scratch).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}
export async function runPipeline(command, options) {
  const { root, rasterOnly, write } = options;
  const sources = await loadSources(root);
  const tools = sources.length || !rasterOnly ? await nativeTools(options.tools) : null;
  const manifestPath = "content/image-derivatives.manifest.json";
  let existing;
  try {
    existing = await readJson(await confinedPath(root, manifestPath));
  } catch (error) {
    if (command !== "build" || error.code !== "ENOENT") throw error;
  }
  const raster =
    command === "build"
      ? await buildRaster(root, sources, tools, existing)
      : { manifest: await validateRaster(root, sources, tools, existing), pending: [] };
  const svg = rasterOnly ? null : await auditSvg(root, tools);
  if (command === "validate" && svg) {
    const evidencePath = await confinedPath(root, svgEvidencePath);
    const storedEvidence = await readJson(evidencePath);
    verifySvgEvidence(storedEvidence, svg.evidence);
    if ((await readFile(evidencePath, "utf8")) !== jsonBytes(storedEvidence))
      throw new Error("SVG evidence must use canonical JSON serialization");
  }
  if (
    command === "validate" &&
    (await readFile(await confinedPath(root, manifestPath), "utf8")) !== jsonBytes(existing)
  )
    throw new Error("Derivative manifest must use canonical JSON serialization");
  if (command === "build") {
    for (const item of raster.pending) await immutableWrite(root, item.relative, item.bytes);
    if (svg) {
      // Reproducible ignored SVG files can replace only previously recorded owned
      // bytes; arbitrary/symlink targets are refused.
      for (const item of svg.output) {
        const path = await confinedPath(root, item.relative, true);
        try {
          const old = await readFile(path);
          if (!old.equals(item.bytes))
            throw new Error(
              `Unknown/stale SVG output target (inspect/remove explicitly): ${item.relative}`,
            );
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
      }
      for (const item of svg.output) await immutableWrite(root, item.relative, item.bytes);
    }
  }
  if (command === "build" || write) {
    if (svg) await atomicJson(root, svgEvidencePath, svg.evidence);
    // Preserve raster score bytes during normal rebuild reuse; refresh only with
    // explicit --write after current byte/integrity gates have passed.
    await atomicJson(root, manifestPath, raster.manifest);
  }
  console.log(
    `Images: ${sources.length ? `${sources.length} verified PNG masters` : "no-masters (production raster bootstrap; no quality claim)"}; ${svg ? `${svg.evidence.classD.count} SVGs, ${svg.evidence.sample.length} real DSSIM samples, class (e) absent` : "isolated raster fixture"}`,
  );
  return { manifest: raster.manifest, svg: svg?.evidence };
}
