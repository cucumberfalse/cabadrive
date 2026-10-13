import { readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { optimize } from "svgo";
import sharp from "sharp";
import config from "../svgo.config.mjs";
import { canonicalJson } from "./content-shards.mjs";
import { inventory, confinedPath, sha256 } from "./image-pipeline.mjs";
import { comparePng, nativeIdentity, repositoryRoot } from "./image-qa.mjs";

const sourceRoot = "content/assets/learning/generated/v1";
export const svgEvidencePath = "content/validation/image-pipeline/svg-optimization.evidence.json";
const configHash = sha256(await readFile(join(repositoryRoot, "svgo.config.mjs")));
export function svgInvariants(svg) {
  if (/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|\bon\w+\s*=|@import/i.test(svg))
    throw new Error("Unsafe SVG resource/script");
  for (const match of svg.matchAll(
    /(?:href|xlink:href)\s*=\s*["']([^"']*)["']|url\(\s*["']?([^\s)'";]+)/gi,
  )) {
    if (!(match[1] ?? match[2]).startsWith("#")) throw new Error("External SVG resource refused");
  }
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0];
  const root = Object.fromEntries(
    [...(tag ?? "").matchAll(/\b(width|height|viewBox)=["']([^"']*)["']/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
  if (!root.width || !root.height || !root.viewBox)
    throw new Error("SVG intrinsic dimensions/viewBox missing");
  return {
    root,
    ids: [...svg.matchAll(/\bid=["']([^"']*)["']/g)].map((match) => match[1]).sort(),
    references: [...svg.matchAll(/(?:href|xlink:href)=["'](#[^"']*)["']|url\((#[^)]+)\)/g)]
      .map((match) => match[1] ?? match[2])
      .sort(),
    text: [...svg.matchAll(/<(title|desc|style)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((match) => [
      match[1],
      match[2],
    ]),
  };
}
function bucket(path) {
  return (
    basename(path).match(/^(topic-(?:learning|trap|practical|term)|vocabulary)/)?.[1] ?? "other"
  );
}
export function svgSample(paths, count = 30) {
  const buckets = new Map();
  for (const path of paths) {
    const key = bucket(path);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(path);
  }
  const ordered = [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => ({
      key,
      values: values.sort((a, b) => sha256(a).localeCompare(sha256(b)) || a.localeCompare(b)),
      allocation: 1,
    }));
  const target = Math.min(count, paths.length);
  while (ordered.reduce((sum, entry) => sum + entry.allocation, 0) < target) {
    const remaining = ordered
      .filter((entry) => entry.allocation < entry.values.length)
      .sort(
        (a, b) =>
          b.values.length / (b.allocation + 1) - a.values.length / (a.allocation + 1) ||
          a.key.localeCompare(b.key),
      );
    remaining[0].allocation++;
  }
  return ordered.flatMap((entry) => entry.values.slice(0, entry.allocation)).sort();
}
async function render(svg) {
  return sharp(Buffer.from(svg))
    .resize(640, 480, { fit: "fill", kernel: "lanczos3" })
    .toColourspace("srgb")
    .flatten({ background: "white" })
    .png()
    .toBuffer();
}
export async function auditSvg(root, tools) {
  const paths = await inventory(root, sourceRoot);
  if (paths.length !== 1382 || paths.some((path) => !path.endsWith(".svg")))
    throw new Error(
      `Learning SVG inventory changed (${paths.length}, expected 1382); policy update required`,
    );
  const primary = (await inventory(root, "content/assets/primary-sources")).filter((path) =>
    path.endsWith(".svg"),
  );
  if (primary.length)
    throw new Error("Class (e) SVG corpus appeared; deliberate policy update required");
  const manual = (await inventory(root, "content/assets/manuals")).filter((path) =>
    path.endsWith(".svg"),
  );
  if (manual.length !== 4) throw new Error("Protected manual SVG inventory changed");
  const sample = new Set(svgSample(paths));
  const records = [];
  const output = [];
  const scores = [];
  for (const path of paths) {
    const original = await readFile(await confinedPath(root, path), "utf8");
    const invariants = svgInvariants(original);
    const optimized = optimize(original, { ...config, path }).data;
    if (canonicalJson(invariants) !== canonicalJson(svgInvariants(optimized)))
      throw new Error(`SVG dimensions/IDs/styles changed: ${path}`);
    const bytes = Buffer.from(optimized);
    records.push({
      path,
      sourceSha256: sha256(original),
      sourceBytes: Buffer.byteLength(original),
      optimizedSha256: sha256(bytes),
      optimizedBytes: bytes.length,
    });
    output.push({
      relative: path.replace("content/assets/", "content/assets-derived/svg/"),
      bytes,
    });
    if (sample.has(path)) {
      const [before, after] = await Promise.all([render(original), render(optimized)]);
      const qa = await comparePng(before, after, tools);
      if (qa.dssim > 0.001) throw new Error(`SVG visual QA failed: ${path}: ${qa.dssim}`);
      scores.push({ path, width: 640, height: 480, dssim: qa.dssim });
    }
  }
  const policy = {
    schemaVersion: 1,
    configSha256: configHash,
    svgo: "4.1.0",
    renderer: { sharp: sharp.versions.sharp, vips: sharp.versions.vips, rsvg: sharp.versions.rsvg },
    native: nativeIdentity(),
    canvas: { width: 640, height: 480, colourspace: "srgb", alpha: "white" },
    dssimMaximum: 0.001,
    sampleAlgorithm: "prefix-buckets-proportional-divisor-sha256-v1",
  };
  return {
    evidence: {
      schemaVersion: 1,
      policy,
      policySha256: sha256(canonicalJson(policy)),
      corpusSha256: sha256(canonicalJson(records)),
      classD: {
        count: paths.length,
        sourceBytes: records.reduce((sum, row) => sum + row.sourceBytes, 0),
        optimizedBytes: records.reduce((sum, row) => sum + row.optimizedBytes, 0),
      },
      classE: { status: "absent", count: 0 },
      protectedManual: {
        count: manual.length,
        sources: await Promise.all(
          manual.map(async (path) => ({
            path,
            sha256: sha256(await readFile(await confinedPath(root, path))),
          })),
        ),
      },
      records,
      sample: scores,
    },
    output,
  };
}
export function verifySvgEvidence(stored, actual) {
  // Decimal scores may differ across CPUs; all structural/source/config data must
  // agree and fresh real measurements must pass. Stored scores remain finite.
  const withoutScores = (value) => ({
    ...value,
    sample: value.sample?.map(({ path, width, height }) => ({ path, width, height })),
  });
  if (
    !Array.isArray(stored.sample) ||
    stored.sample.length !== 30 ||
    stored.sample.some(
      (row) => !Number.isFinite(row.dssim) || row.dssim < 0 || row.dssim > 0.001,
    ) ||
    canonicalJson(withoutScores(stored)) !== canonicalJson(withoutScores(actual))
  )
    throw new Error("SVG audit evidence/source/config/tool identity mismatch");
}
