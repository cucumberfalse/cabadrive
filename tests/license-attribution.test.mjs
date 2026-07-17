import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const repositoryUrl = "https://github.com/cucumberfalse/cabadrive";
const upstreamCommit = "90d17d47864b807415ba505b682710a8f4c441f5";
const screenshots = [
  "docs_project/screens/readme/learn.png",
  "docs_project/screens/readme/materials.png",
  "docs_project/screens/readme/about.png"
];

test("root and pinned upstream Apache licenses are exact copies", () => {
  const canonical = read("content/sources/originals/bandinopla-simulador-test-de-conducir/LICENSE");
  assert.equal(read("LICENSE"), canonical);
  assert.equal(read("licenses/bandinopla-simulador-test-de-conducir-Apache-2.0.txt"), canonical);
});

test("NOTICE and third-party inventory preserve attribution boundaries", () => {
  const notice = read("NOTICE");
  const inventory = read("licenses/THIRD-PARTY-NOTICES.md");

  assert.match(notice, /Copyright 2026 Mikhail Orlov/);
  assert.match(notice, /THIRD-PARTY-NOTICES\.md/);
  assert.match(inventory, /bandinopla\/simulador-test-de-conducir/);
  assert.match(inventory, new RegExp(upstreamCommit));
  assert.match(inventory, /GCBA website HTML/);
  assert.match(inventory, /GCBA PDFs, manual derivatives, and source-faithful artwork/);
  assert.match(inventory, /Bolet[ií]n Oficial/);
  assert.match(inventory, /Argentina\.gob\.ar \/ InfoLEG \/ ANSV \/ DNRPA/);
  assert.match(inventory, /governmental names, logos, marks, and third-party artwork/i);
  assert.match(inventory, /owner\/legal review required before broader redistribution/i);
  assert.doesNotMatch(inventory, /all official materials are (?:licensed|available) under/i);
});

test("public documentation is current and links stable local screenshots", () => {
  const readme = read("README.md");
  const contributing = read("CONTRIBUTING.md");
  const security = read("SECURITY.md");

  assert.doesNotMatch(readme, /No product runtime scaffold is committed yet/);
  assert.match(readme, /русскоязыч/i);
  assert.match(readme, /English/);
  assert.match(readme, /make build/);
  assert.match(readme, /make up/);
  assert.match(readme, /http:\/\/localhost:5173/);
  assert.match(readme, /make down/);
  assert.match(readme, new RegExp(repositoryUrl.replaceAll("/", "\\/")));
  for (const path of screenshots) {
    assert.ok(existsSync(path), `missing README screenshot ${path}`);
    assert.match(readme, new RegExp(path.replaceAll("/", "\\/")));
  }

  assert.match(contributing, /AGENTS\.md/);
  assert.match(contributing, /pnpm run preflight/);
  assert.match(contributing, /pull request|PR-only/i);
  assert.match(security, /security\/advisories\/new/);
  assert.match(security, /private/i);
  assert.match(security, /Do not open a public issue/i);
});

test("package and About implementation use the agreed local contract", () => {
  const packageJson = JSON.parse(read("package.json"));
  const app = read("src/App.tsx");

  assert.equal(packageJson.version, "0.1.0");
  assert.match(packageJson.scripts["validate:attribution"], /validate-license-attribution/);
  assert.match(packageJson.scripts["validate:content"], /validate:attribution/);
  assert.match(app, /"about"/);
  assert.match(app, /О приложении/);
  assert.match(app, /data\.contentMode/);
  assert.match(app, /sourceById/);
  assert.match(app, new RegExp(repositoryUrl.replaceAll("/", "\\/")));
  assert.doesNotMatch(app, /fetch\s*\(/);
});
