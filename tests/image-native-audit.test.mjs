import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { reviewedLockPaths } from "../scripts/image-native-policy.mjs";
import {
  auditNativeGraphs,
  maintenanceNotices,
  parseMaintenanceConfig,
  validateNotice,
} from "../scripts/audit-image-qa.mjs";

const config = await readFile(
  join(dirname(reviewedLockPaths.ssimulacra2), "osv-scanner.toml"),
  "utf8",
);
const now = new Date("2026-10-12T00:00:00Z");
function notice(id) {
  return {
    id,
    modified: "2026-10-01T00:00:00Z",
    affected: [
      {
        package: { name: maintenanceNotices[id][0], ecosystem: "crates.io" },
        database_specific: { informational: "unmaintained", cvss: null, categories: [] },
      },
    ],
  };
}
function mockFetch(change = (body) => body) {
  return async (url, options) => {
    let body;
    if (url.endsWith("querybatch")) {
      const queries = JSON.parse(options.body).queries;
      body = {
        results: queries.map(({ package: pkg, version }) => {
          const id = Object.keys(maintenanceNotices).find(
            (key) =>
              maintenanceNotices[key][0] === pkg.name && maintenanceNotices[key][1] === version,
          );
          return id ? { vulns: [{ id, modified: "2026-10-01T00:00:00Z" }] } : {};
        }),
      };
    } else body = notice(url.split("/").at(-1));
    return { ok: true, json: async () => change(body, url) };
  };
}
test("native full-graph audit accepts only the five exact maintenance records", async () => {
  const result = await auditNativeGraphs({ fetcher: mockFetch(), now, config });
  assert.equal(result.packages, 247);
  assert.equal(result.findings.length, 5);
  assert.ok(result.findings.every(({ tool }) => tool === "ssimulacra2"));
});
test("maintenance configuration rejects broad, duplicate and expired exclusions", () => {
  for (const bad of [
    config + "\n[[PackageOverrides]]\nignore = true\n",
    config.replace("RUSTSEC-2025-0056", "RUSTSEC-2026-0190"),
    config.replace("ignoreUntil = 2027-01-10", "ignoreUntil = 2028-01-10"),
    config.replace('id = "RUSTSEC-2025-0056"', 'id = "RUSTSEC-2024-0384"'),
  ])
    assert.throws(() => parseMaintenanceConfig(bad, now));
  assert.throws(() => parseMaintenanceConfig(config, new Date("2027-01-10T00:00:00Z")), /expired/);
});
test("hydrated notice alias, security and package drift cannot expand exemptions", () => {
  const id = "RUSTSEC-2025-0056";
  for (const mutate of [
    (record) => {
      record.aliases = ["CVE-2026-1234"];
    },
    (record) => {
      record.affected[0].database_specific.informational = "unsound";
    },
    (record) => {
      record.affected[0].database_specific.categories = ["memory-corruption"];
    },
    (record) => {
      record.affected[0].database_specific.cvss = "CVSS:3.1";
    },
    (record) => {
      record.affected[0].package.name = "anyhow";
    },
  ]) {
    const record = notice(id);
    mutate(record);
    assert.throws(() => validateNotice(record, id));
  }
});
test("security, partial, malformed and failed network responses fail the native audit", async () => {
  for (const fetcher of [
    mockFetch((body) => (body.results ? { results: body.results.slice(1) } : body)),
    mockFetch((body) => (body.results ? { results: body.results.map(() => null) } : body)),
    mockFetch((body) =>
      body.results
        ? {
            results: body.results.map((row, index) =>
              index ? row : { vulns: [{ id: "RUSTSEC-2026-0204", modified: "today" }] },
            ),
          }
        : body,
    ),
    mockFetch((body) => (body.affected ? { ...body, aliases: ["GHSA-security-alias"] } : body)),
    async () => {
      throw new Error("network unavailable");
    },
    async () => ({ ok: false, status: 503 }),
  ])
    await assert.rejects(auditNativeGraphs({ fetcher, config, now }));
});
