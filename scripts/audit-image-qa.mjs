#!/usr/bin/env node
// Explicit network audit; offline image validators never call this module.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { reviewedLockPaths } from "./image-native-policy.mjs";

export const maintenanceNotices = {
  "RUSTSEC-2025-0056": ["adler", "1.0.2"],
  "RUSTSEC-2024-0384": ["instant", "0.1.13"],
  "RUSTSEC-2025-0119": ["number_prefix", "0.4.0"],
  "RUSTSEC-2024-0436": ["paste", "1.0.15"],
  "RUSTSEC-2026-0192": ["ttf-parser", "0.20.0"],
};
const expiry = "2027-01-10";
export function parseMaintenanceConfig(text, now = new Date()) {
  if (now >= new Date(`${expiry}T00:00:00Z`)) throw new Error("M-001 notice policy expired");
  const entries = text.trim().split("[[IgnoredVulns]]");
  if (entries.shift() !== "" || entries.length !== 5)
    throw new Error("Unexpected OSV configuration");
  const ids = new Set();
  for (const entry of entries) {
    const fields = {};
    for (const line of entry.trim().split(/\r?\n/)) {
      const match = /^(id|reason|ignoreUntil) = (.+)$/.exec(line);
      if (!match || fields[match[1]]) throw new Error("Broad/invalid OSV configuration");
      fields[match[1]] = match[1] === "ignoreUntil" ? match[2] : JSON.parse(match[2]);
    }
    if (
      !maintenanceNotices[fields.id] ||
      ids.has(fields.id) ||
      fields.ignoreUntil !== expiry ||
      typeof fields.reason !== "string" ||
      !fields.reason.includes("M-001") ||
      !fields.reason.includes("unmaintained")
    )
      throw new Error("Unexpected maintenance notice policy");
    ids.add(fields.id);
  }
  return ids;
}
export function registryPackages(text) {
  const blocks = text.split("[[package]]");
  if (!/^# This file.*\n#.*\nversion = [34]\s*$/s.test(blocks.shift()))
    throw new Error("Unsupported Cargo lock header");
  return blocks.flatMap((block) => {
    const field = (key) => new RegExp(`^${key} = "([^"]+)"$`, "m").exec(block)?.[1];
    const name = field("name");
    const version = field("version");
    const source = field("source");
    if (!name || !version) throw new Error("Malformed native lock package");
    if (!source) return [];
    if (
      source !== "registry+https://github.com/rust-lang/crates.io-index" ||
      !/^[a-f0-9]{64}$/.test(field("checksum") ?? "")
    )
      throw new Error("Unexpected native lock source/checksum");
    return [{ name, version }];
  });
}
export function validateNotice(record, id) {
  const expected = maintenanceNotices[id];
  if (
    !expected ||
    record.id !== id ||
    !record.modified ||
    record.withdrawn ||
    (record.aliases !== undefined && (!Array.isArray(record.aliases) || record.aliases.length)) ||
    (record.severity !== undefined &&
      (!Array.isArray(record.severity) || record.severity.length)) ||
    !Array.isArray(record.affected) ||
    record.affected.length !== 1
  )
    throw new Error(`Maintenance notice classification/alias drift: ${id}`);
  const affected = record.affected[0];
  const classification = affected.database_specific;
  if (
    affected.package?.name !== expected[0] ||
    affected.package?.ecosystem !== "crates.io" ||
    classification?.informational !== "unmaintained" ||
    classification.cvss != null ||
    !Array.isArray(classification.categories) ||
    classification.categories.length ||
    (affected.severity !== undefined &&
      (!Array.isArray(affected.severity) || affected.severity.length))
  )
    throw new Error(`Security/package drift in maintenance notice: ${id}`);
}
async function requestJson(fetcher, url, options) {
  const response = await fetcher(url, { ...options, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Native OSV audit network failure: ${response.status}`);
  return response.json();
}
export async function auditNativeGraphs({ fetcher = fetch, now = new Date(), config, locks } = {}) {
  config ??= await readFile(
    join(dirname(reviewedLockPaths.ssimulacra2), "osv-scanner.toml"),
    "utf8",
  );
  parseMaintenanceConfig(config, now);
  locks ??= Object.fromEntries(
    await Promise.all(
      Object.entries(reviewedLockPaths).map(async ([key, path]) => [
        key,
        await readFile(path, "utf8"),
      ]),
    ),
  );
  if (Object.keys(locks).sort().join() !== "dssim,ssimulacra2")
    throw new Error("Incomplete native lock inventory");
  const packages = Object.entries(locks).flatMap(([tool, text]) =>
    registryPackages(text).map((item) => ({ ...item, tool })),
  );
  if (
    !packages.some((item) => item.tool === "dssim") ||
    !packages.some((item) => item.tool === "ssimulacra2")
  )
    throw new Error("Empty native graph");
  const batch = await requestJson(fetcher, "https://api.osv.dev/v1/querybatch", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      queries: packages.map(({ name, version }) => ({
        package: { name, ecosystem: "crates.io" },
        version,
      })),
    }),
  });
  if (!Array.isArray(batch.results) || batch.results.length !== packages.length)
    throw new Error("Partial/malformed native OSV results");
  const findings = [];
  for (const [index, result] of batch.results.entries()) {
    if (
      !result ||
      typeof result !== "object" ||
      Array.isArray(result) ||
      Object.keys(result).some((key) => key !== "vulns") ||
      (result.vulns !== undefined && !Array.isArray(result.vulns))
    )
      throw new Error("Malformed native OSV result");
    for (const finding of result.vulns ?? []) {
      const item = packages[index];
      const expected = maintenanceNotices[finding.id];
      if (
        !expected ||
        item.tool !== "ssimulacra2" ||
        item.name !== expected[0] ||
        item.version !== expected[1] ||
        !finding.modified
      )
        throw new Error(`Unaccepted native OSV finding: ${finding.id ?? "malformed"}`);
      findings.push({ tool: item.tool, package: item.name, version: item.version, id: finding.id });
    }
  }
  // Hydrate all accepted IDs even if a batch stops reporting one: aliases and
  // classification cannot silently expand an adjacent scanner exemption.
  for (const id of Object.keys(maintenanceNotices))
    validateNotice(await requestJson(fetcher, `https://api.osv.dev/v1/vulns/${id}`), id);
  return { packages: packages.length, findings, maintenanceDeadline: expiry };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 2) throw new Error("Usage: audit-image-qa.mjs");
  console.log(JSON.stringify(await auditNativeGraphs(), null, 2));
}
