import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { assertNoOpaqueBlackRegion } from "./png-opaque-black-check.mjs";

const errors = [];
const read = (path) => {
  try {
    return readFileSync(path);
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
    return Buffer.alloc(0);
  }
};
const text = (path) => read(path).toString("utf8");
const requireMatch = (value, pattern, label) => {
  if (!pattern.test(value)) errors.push(`${label}: missing ${pattern}`);
};

const canonicalLicense = read(
  "content/sources/originals/bandinopla-simulador-test-de-conducir/LICENSE",
);
const rootLicense = read("LICENSE");
const upstreamLicense = read("licenses/bandinopla-simulador-test-de-conducir-Apache-2.0.txt");
if (!rootLicense.equals(canonicalLicense))
  errors.push("LICENSE: must be byte-identical to canonical Apache-2.0 text");
if (!upstreamLicense.equals(canonicalLicense))
  errors.push("upstream license copy: must be byte-identical to archived upstream LICENSE");

const expectedApacheSha256 = "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4";
if (createHash("sha256").update(canonicalLicense).digest("hex") !== expectedApacheSha256) {
  errors.push("archived upstream LICENSE: unexpected SHA-256");
}

const notice = text("NOTICE");
requireMatch(notice, /Copyright 2026 Mikhail Orlov/, "NOTICE");
requireMatch(notice, /THIRD-PARTY-NOTICES\.md/, "NOTICE");
requireMatch(notice, /no NOTICE file/, "NOTICE");

const inventory = text("licenses/THIRD-PARTY-NOTICES.md");
for (const [label, pattern] of [
  ["upstream", /bandinopla\/simulador-test-de-conducir/],
  ["upstream pin", /90d17d47864b807415ba505b682710a8f4c441f5/],
  ["GCBA HTML", /GCBA website HTML/],
  ["GCBA PDF", /GCBA PDFs, manual derivatives, and source-faithful artwork/],
  ["Boletín Oficial", /Bolet[ií]n Oficial/],
  ["national sources", /Argentina\.gob\.ar \/ InfoLEG \/ ANSV \/ DNRPA/],
  ["marks", /Governmental names, logos, marks, and third-party artwork/],
  ["legal review boundary", /owner\/legal review required before broader redistribution/],
])
  requireMatch(inventory, pattern, `third-party inventory ${label}`);

const sources = JSON.parse(text("content/sources/sources.json") || "[]");
const upstreamSource = sources.find(
  (source) => source.id === "bandinopla-testdeconducir-caba-b-source1-2026-05-08",
);
if (!upstreamSource) errors.push("sources.json: pinned upstream source is missing");
else {
  requireMatch(
    upstreamSource.retrievalNote || "",
    /90d17d47864b807415ba505b682710a8f4c441f5/,
    "upstream source retrievalNote",
  );
  if (upstreamSource.officialUrl !== "https://github.com/bandinopla/simulador-test-de-conducir")
    errors.push("sources.json: unexpected upstream URL");
}

const packageJson = JSON.parse(text("package.json") || "{}");
if (packageJson.version !== "0.1.0") errors.push("package.json: version must be 0.1.0");

const readme = text("README.md");
requireMatch(readme, /https:\/\/github\.com\/cucumberfalse\/cabadrive/, "README repository URL");
requireMatch(readme, /неофициальн/i, "README unofficial boundary");
requireMatch(
  readme,
  /not an official or complete GCBA|неофициальный и неполный fallback|не официальная или полная база/i,
  "README fallback boundary",
);
if (/No product runtime scaffold is committed yet/.test(readme))
  errors.push("README: stale runtime claim remains");

for (const path of [
  "docs_project/screens/readme/learn.png",
  "docs_project/screens/readme/materials.png",
  "docs_project/screens/readme/about.png",
]) {
  requireMatch(readme, new RegExp(path.replaceAll("/", "\\/")), `README screenshot link ${path}`);
  if (!existsSync(path)) {
    errors.push(`${path}: screenshot is missing`);
    continue;
  }
  const png = read(path);
  if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") errors.push(`${path}: not a PNG`);
  if (png.length >= 24 && (png.readUInt32BE(16) !== 1440 || png.readUInt32BE(20) !== 900)) {
    errors.push(`${path}: expected 1440x900, got ${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`);
  }
  try {
    assertNoOpaqueBlackRegion(path);
  } catch (error) {
    errors.push(error.message);
  }
}

const app = text("src/App.tsx");
requireMatch(app, /data\.contentMode/, "About canonical content mode");
requireMatch(app, /sourceById\.get/, "About canonical upstream source");
if (/fetch\s*\(/.test(app)) errors.push("src/App.tsx: About contract forbids runtime fetch");

if (errors.length) {
  console.error(`Attribution validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  "Attribution validation passed: exact licenses, inventory, public docs, screenshots, and About boundaries are current.",
);
