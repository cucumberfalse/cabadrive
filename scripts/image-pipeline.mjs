import { createHash } from "node:crypto";
import { lstat, readFile, readdir, mkdir, writeFile, link, unlink } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { canonicalJson } from "./content-shards.mjs";
import { nativeIdentity, comparePng } from "./image-qa.mjs";

export const formats = ["avif", "webp", "jpeg"];
export const widths = [480, 800, 1200, 1600, 2400];
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const jsonBytes = (value) => `${canonicalJson(value)}\n`;
export const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
export const profiles = {
  photo: {
    avif: { quality: 55, effort: 4, bitdepth: 8, tune: "iq", chromaSubsampling: "4:2:0" },
    webp: { quality: 82, effort: 4 },
    jpeg: { quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" },
  },
  text: {
    avif: { quality: 70, effort: 4, bitdepth: 8, tune: "iq", chromaSubsampling: "4:4:4" },
    webp: { quality: 90, effort: 4 },
    jpeg: { quality: 90, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" },
  },
};
export function currentPolicy() {
  return {
    pipelineVersion: 1,
    widths,
    formats,
    profiles,
    normalization: { colourspace: "srgb", depth: "uchar", alpha: "white", metadata: "strip" },
    reference: { kernel: "lanczos3", fit: "fill", withoutEnlargement: true },
    quality: {
      dssimMaximum: 0.01,
      ssimulacra2Minimum: 70,
      sample: "sha256(sourcePath|width|format)-5%-ceil-min1-v1",
      retry: "once-quality+5-cap100",
    },
    tools: {
      sharp: sharp.versions.sharp,
      vips: sharp.versions.vips,
      aom: sharp.versions.aom,
      heif: sharp.versions.heif,
      webp: sharp.versions.webp,
      mozjpeg: sharp.versions.mozjpeg,
      native: nativeIdentity(),
      fileType: "21.3.2",
    },
  };
}
export function safePath(value, prefix) {
  if (
    typeof value !== "string" ||
    !value ||
    /[\\?#:%\s]/.test(value) ||
    [...value].some((char) => char.charCodeAt(0) < 32) ||
    value.startsWith("/") ||
    value.split("/").some((part) => !part || part === "." || part === "..") ||
    (prefix && !value.startsWith(`${prefix}/`))
  ) {
    throw new Error(`Unsafe image path: ${String(value)}`);
  }
  return value;
}
export async function confinedPath(root, relative, missing = false) {
  safePath(relative);
  let path = root;
  for (const [index, part] of relative.split("/").entries()) {
    path = join(path, part);
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink()) throw new Error(`Image symlink refused: ${relative}`);
      if (index < relative.split("/").length - 1 && !info.isDirectory())
        throw new Error(`Not an image directory: ${relative}`);
    } catch (error) {
      if (error.code !== "ENOENT" || !missing) throw error;
    }
  }
  return path;
}
export async function inventory(root, relative) {
  const folder = await confinedPath(root, relative, true);
  try {
    await lstat(folder);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const result = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const path = `${relative}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`Image symlink refused: ${path}`);
    if (entry.isDirectory()) result.push(...(await inventory(root, path)));
    else if (entry.isFile()) result.push(path);
    else throw new Error(`Unsupported image input: ${path}`);
  }
  return result.sort();
}
function assertPngChunks(bytes) {
  let cursor = 8;
  let ended = false;
  while (cursor + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(cursor);
    const type = bytes.toString("ascii", cursor + 4, cursor + 8);
    if (type === "acTL") throw new Error("Animated/multiframe PNG masters are unsupported");
    cursor += length + 12;
    if (cursor > bytes.length) throw new Error("Truncated PNG master");
    if (type === "IEND") {
      ended = true;
      break;
    }
  }
  if (!ended || cursor !== bytes.length) throw new Error("Incomplete PNG master or trailing data");
}
export async function decodeMaster(bytes, path) {
  if (!/\.png$/i.test(path) || (await fileTypeFromBuffer(bytes))?.mime !== "image/png")
    throw new Error(`Master must be real lossless PNG: ${path}`);
  assertPngChunks(bytes);
  const metadata = await sharp(bytes, { failOn: "warning", animated: true }).metadata();
  if (
    metadata.format !== "png" ||
    !Number.isInteger(metadata.width) ||
    !Number.isInteger(metadata.height) ||
    metadata.width < 1 ||
    metadata.height < 1 ||
    (metadata.pages ?? 1) !== 1 ||
    (metadata.orientation ?? 1) !== 1
  )
    throw new Error(`Unsupported PNG master: ${path}`);
  // Encoding this normalized PNG forces a complete decode, including pixels.
  const normalized = await sharp(bytes, { failOn: "warning" })
    .toColourspace("srgb")
    .flatten({ background: "white" })
    .png({ bitdepth: 8 })
    .toBuffer();
  return {
    bytes,
    normalized,
    width: metadata.width,
    height: metadata.height,
    sha256: sha256(bytes),
  };
}
export async function loadSources(root) {
  const registry = await readJson(await confinedPath(root, "content/image-pipeline.sources.json"));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.sources))
    throw new Error("Invalid image source registry");
  const sources = [];
  const sourcePaths = new Set();
  const masterPaths = new Set();
  let previous = "";
  for (const record of registry.sources) {
    safePath(record.sourcePath, "content/assets");
    safePath(record.masterPath, "content/assets-masters");
    if (
      sourcePaths.has(record.sourcePath) ||
      masterPaths.has(record.masterPath) ||
      record.sourcePath <= previous ||
      !["a", "b", "c"].includes(record.class) ||
      !Object.hasOwn(profiles, record.profile) ||
      (record.targetWidth !== undefined &&
        (!Number.isInteger(record.targetWidth) || record.targetWidth < 1))
    )
      throw new Error("Duplicate, unordered or invalid image source registry record");
    sourcePaths.add(record.sourcePath);
    masterPaths.add(record.masterPath);
    previous = record.sourcePath;
    const logical = await confinedPath(root, record.sourcePath);
    if (!(await lstat(logical)).isFile())
      throw new Error(`Missing logical image source: ${record.sourcePath}`);
    const bytes = await readFile(await confinedPath(root, record.masterPath));
    const master = await decodeMaster(bytes, record.masterPath);
    if (record.targetWidth && Math.max(...variantWidths(master.width)) < record.targetWidth)
      throw new Error(`Master cannot meet target width: ${record.sourcePath}`);
    sources.push({ record, master });
  }
  if (
    canonicalJson(await inventory(root, "content/assets-masters")) !==
    canonicalJson([...masterPaths].sort())
  )
    throw new Error("PNG master inventory differs from registry (unregistered/missing input)");
  return sources;
}
export function variantWidths(width) {
  const values = widths.filter((value) => value <= width);
  return values.length ? values : [width];
}
export function expectedVariants(sources) {
  return sources.flatMap(({ record, master }) =>
    variantWidths(master.width).flatMap((width) =>
      formats.map((format) => ({ sourcePath: record.sourcePath, width, format })),
    ),
  );
}
export const variantKey = (variant) => `${variant.sourcePath}|${variant.width}|${variant.format}`;
export function metricSample(variants) {
  return new Set(
    [...variants]
      .sort(
        (a, b) =>
          sha256(variantKey(a)).localeCompare(sha256(variantKey(b))) ||
          variantKey(a).localeCompare(variantKey(b)),
      )
      .slice(0, variants.length ? Math.max(1, Math.ceil(variants.length * 0.05)) : 0)
      .map(variantKey),
  );
}
export async function referencePng(master, width, height) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > master.width ||
    height > master.height
  )
    throw new Error("Candidate dimensions exceed master or are invalid");
  return sharp(master.normalized)
    .resize(width, height, { fit: "fill", kernel: "lanczos3", withoutEnlargement: true })
    .png()
    .toBuffer();
}
export async function decodeVariant(bytes, format, width, height) {
  const mime = (await fileTypeFromBuffer(bytes))?.mime;
  const metadata = await sharp(bytes, { failOn: "warning" }).metadata();
  if (
    mime !== `image/${format}` ||
    (format === "avif"
      ? metadata.format !== "heif" || metadata.compression !== "av1"
      : metadata.format !== format) ||
    metadata.width !== width ||
    metadata.height !== height ||
    (metadata.pages ?? 1) !== 1
  )
    throw new Error(`Derivative MIME/format/dimension mismatch: ${format} ${width}x${height}`);
  return sharp(bytes, { failOn: "warning" })
    .toColourspace("srgb")
    .flatten({ background: "white" })
    .png()
    .toBuffer();
}
export async function measureLikeSizedQuality(
  master,
  bytes,
  format,
  width,
  height,
  tools,
  sampled = false,
) {
  const reference = await referencePng(master, width, height);
  const candidate = await decodeVariant(bytes, format, width, height);
  return {
    referenceWidth: width,
    referenceHeight: height,
    kernel: "lanczos3",
    ...(await comparePng(reference, candidate, tools, sampled)),
  };
}
export function qualityPass(qa, sampled) {
  return (
    (qa.ssimulacra2 === undefined || Number.isFinite(qa.ssimulacra2)) &&
    Number.isFinite(qa.dssim) &&
    qa.dssim >= 0 &&
    qa.dssim <= 0.01 &&
    (!sampled || (Number.isFinite(qa.ssimulacra2) && qa.ssimulacra2 >= 70))
  );
}
export async function encodeWithRetry(encode, measure, baselineQuality, sampled) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const quality = Math.min(100, baselineQuality + (attempt - 1) * 5);
    const bytes = await encode(quality);
    const qa = await measure(bytes);
    if (qualityPass(qa, sampled)) return { bytes, qa, quality, attempt };
  }
  throw new Error("Image quality failed after one quality+5 retry");
}
function sourceIdentity(source, policy) {
  return sha256(
    canonicalJson({ sourceSha256: source.master.sha256, registry: source.record, policy }),
  );
}
function variantPath(record, width, format, hash) {
  return `content/img/${record.class}/${basename(record.masterPath).replace(/\.png$/i, "")}-${width}.${hash.slice(0, 8)}.${format === "jpeg" ? "jpg" : format}`;
}
export function diskPath(deliveryPath) {
  safePath(deliveryPath, "content/img");
  return deliveryPath.replace("content/img/", "content/assets-derived/img/");
}
export async function verifySource(root, source, stored, policy, tools, sampled) {
  const { record, master } = source;
  const identity = {
    ...record,
    sourceSha256: master.sha256,
    masterWidth: master.width,
    masterHeight: master.height,
    generationSha256: sourceIdentity(source, policy),
  };
  const { variants, ...actual } = stored ?? {};
  if (canonicalJson(actual) !== canonicalJson(identity) || !Array.isArray(variants))
    throw new Error(`Stale source/generation policy: ${record.sourcePath}`);
  const expected = expectedVariants([source]);
  if (variants.length !== expected.length) throw new Error("Missing/extra derivative variants");
  const measured = [];
  for (const [index, variant] of variants.entries()) {
    const wanted = expected[index];
    const height = Math.max(1, Math.round((master.height * wanted.width) / master.width));
    const options = profiles[record.profile][wanted.format];
    const selected = sampled.has(variantKey(wanted));
    if (
      variant.width !== wanted.width ||
      variant.format !== wanted.format ||
      variant.height !== height ||
      ![1, 2].includes(variant.attempt) ||
      variant.quality !== Math.min(100, options.quality + (variant.attempt - 1) * 5) ||
      !/^[a-f0-9]{64}$/.test(variant.sha256 ?? "") ||
      variant.path !== variantPath(record, wanted.width, wanted.format, variant.sha256) ||
      !Number.isInteger(variant.bytes) ||
      variant.bytes < 1 ||
      variant.qa?.referenceWidth !== variant.width ||
      variant.qa?.referenceHeight !== variant.height ||
      variant.qa?.kernel !== "lanczos3" ||
      !qualityPass(variant.qa, selected)
    )
      throw new Error("Malformed/unsafe/stale derivative variant or QA record");
    const bytes = await readFile(await confinedPath(root, diskPath(variant.path)));
    if (bytes.length !== variant.bytes || sha256(bytes) !== variant.sha256)
      throw new Error(`Derivative hash/size tampering: ${variant.path}`);
    const qa = await measureLikeSizedQuality(
      master,
      bytes,
      variant.format,
      variant.width,
      variant.height,
      tools,
      selected,
    );
    if (!qualityPass(qa, selected))
      throw new Error(`Derivative real quality failed: ${variant.path}`);
    measured.push({ ...variant, qa });
  }
  return { ...identity, variants: measured };
}
export async function immutableWrite(root, relative, bytes) {
  const path = await confinedPath(root, relative, true);
  await mkdir(dirname(path), { recursive: true });
  try {
    const existing = await readFile(path);
    if (!existing.equals(bytes))
      throw new Error(
        `Image hash URL collision/unknown owned target: ${relative} (${sha256(existing)} != ${sha256(bytes)})`,
      );
    return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const scratch = `${path}.tmp-${process.pid}-${Math.random().toString(16).slice(2)}`;
  await writeFile(scratch, bytes, { flag: "wx", mode: 0o600 });
  try {
    await link(scratch, path);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    const existing = await readFile(await confinedPath(root, relative));
    if (!existing.equals(bytes)) throw new Error(`Image hash URL collision: ${relative}`);
  } finally {
    await unlink(scratch);
  }
}
export async function buildRaster(root, sources, tools, oldManifest) {
  const policy = currentPolicy();
  const sample = metricSample(expectedVariants(sources));
  const records = [];
  const pending = [];
  for (const source of sources) {
    const old = oldManifest?.sources?.find(
      (record) => record.sourcePath === source.record.sourcePath,
    );
    if (oldManifest?.policySha256 === sha256(canonicalJson(policy)) && old) {
      try {
        const verified = await verifySource(root, source, old, policy, tools, sample);
        records.push({ ...verified, variants: old.variants });
        continue;
      } catch {
        /* Rebuild from verified master; existing hash URLs remain immutable. */
      }
    }
    const variants = [];
    for (const wanted of expectedVariants([source])) {
      const { width, format } = wanted;
      const height = Math.max(1, Math.round((source.master.height * width) / source.master.width));
      const reference = await referencePng(source.master, width, height);
      const options = profiles[source.record.profile][format];
      const result = await encodeWithRetry(
        (quality) => {
          const encoder = sharp(reference);
          return encoder[format]({ ...options, quality }).toBuffer();
        },
        (bytes) =>
          measureLikeSizedQuality(
            source.master,
            bytes,
            format,
            width,
            height,
            tools,
            sample.has(variantKey(wanted)),
          ),
        options.quality,
        sample.has(variantKey(wanted)),
      );
      const hash = sha256(result.bytes);
      const path = variantPath(source.record, width, format, hash);
      pending.push({ relative: diskPath(path), bytes: result.bytes });
      variants.push({
        width,
        height,
        format,
        path,
        sha256: hash,
        bytes: result.bytes.length,
        quality: result.quality,
        attempt: result.attempt,
        qa: result.qa,
      });
    }
    records.push({
      ...source.record,
      sourceSha256: source.master.sha256,
      masterWidth: source.master.width,
      masterHeight: source.master.height,
      generationSha256: sourceIdentity(source, policy),
      variants,
    });
  }
  // Preflight every destination before publishing any new immutable files.
  const destinations = new Map();
  for (const item of pending) {
    if (destinations.has(item.relative) && !destinations.get(item.relative).equals(item.bytes))
      throw new Error(`Image hash URL collision: ${item.relative}`);
    destinations.set(item.relative, item.bytes);
    try {
      const bytes = await readFile(await confinedPath(root, item.relative));
      if (!bytes.equals(item.bytes)) throw new Error(`Image hash URL collision: ${item.relative}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return {
    manifest: {
      schemaVersion: 1,
      policy,
      policySha256: sha256(canonicalJson(policy)),
      sources: records,
    },
    pending,
  };
}
export async function validateRaster(root, sources, tools, manifest) {
  const policy = currentPolicy();
  if (
    manifest.schemaVersion !== 1 ||
    canonicalJson(manifest.policy) !== canonicalJson(policy) ||
    manifest.policySha256 !== sha256(canonicalJson(policy)) ||
    !Array.isArray(manifest.sources) ||
    manifest.sources.length !== sources.length
  )
    throw new Error("Stale/invalid derivative manifest policy/inventory");
  const sample = metricSample(expectedVariants(sources));
  const measured = [];
  for (const [index, source] of sources.entries())
    measured.push(await verifySource(root, source, manifest.sources[index], policy, tools, sample));
  return { ...manifest, sources: measured };
}
