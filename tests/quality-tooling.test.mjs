import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ESLint } from "eslint";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

test("quality scripts use fail-closed explicit allowlists", () => {
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit");
  assert.equal(packageJson.scripts.lint.startsWith("eslint --max-warnings 0 "), true);
  assert.doesNotMatch(packageJson.scripts.lint, /(?:^|\s)\.(?:\s|$)/);
  assert.equal(packageJson.scripts.format.startsWith("prettier --write "), true);
  assert.equal(packageJson.scripts["format:check"].startsWith("prettier --check "), true);
  assert.doesNotMatch(packageJson.scripts.format, /(?:^|\s)\.(?:\s|$)/);
  assert.equal(packageJson.scripts["quality:fast"], "pnpm run typecheck && pnpm run lint");
  assert.equal(packageJson.scripts["verify:quality-negative"], "node scripts/verify-quality-negative.mjs");
});

test("quality dependencies are exact, compatible toolchain pins", () => {
  for (const dependency of [
    "eslint",
    "@eslint/js",
    "typescript-eslint",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react-refresh",
    "globals",
    "prettier",
  ]) {
    assert.match(packageJson.devDependencies[dependency], /^\d+\.\d+\.\d+$/);
  }
  assert.match(packageJson.devDependencies.eslint, /^9\./);
});

test("CI keeps required identity and runs cheap quality gates before tests and build", () => {
  assert.match(ci, /baseline-checks:\n\s+name: baseline-checks/);
  const expectedOrder = [
    "Run repository baseline",
    "Run typecheck and lint with budget",
    "Run format check",
    "Run negative quality contracts",
    "Run tests if present",
    "Run build if present",
    "Run browser smoke tests if present",
  ];
  let cursor = -1;
  for (const marker of expectedOrder) {
    const next = ci.indexOf(marker);
    assert.ok(next > cursor, `${marker} must retain required CI order`);
    cursor = next;
  }
  assert.match(ci, /QUALITY_FAST_BUDGET_SECONDS: "60"/);
  assert.match(ci, /elapsed > QUALITY_FAST_BUDGET_SECONDS/);
});

test("formatter defenses exclude governed and attribution artifacts", () => {
  const ignore = readFileSync(new URL("../.prettierignore", import.meta.url), "utf8");
  for (const protectedPath of [
    "content/",
    "public/content/",
    "LICENSE",
    "NOTICE",
    "licenses/",
    "docs/",
    "docs_project/",
    "specs/",
    "public/screenshots/",
  ]) {
    assert.match(ignore, new RegExp(`^${protectedPath.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
  }
});

test("representative files receive the intended flat-config profiles", async () => {
  const eslint = new ESLint({ cwd: new URL("..", import.meta.url).pathname });
  const app = await eslint.calculateConfigForFile("src/App.tsx");
  const domain = await eslint.calculateConfigForFile("src/domain.ts");
  const script = await eslint.calculateConfigForFile("scripts/shared.mjs");
  const nodeTest = await eslint.calculateConfigForFile("tests/domain.test.mjs");
  const e2e = await eslint.calculateConfigForFile("tests/e2e/app.spec.ts");
  const vite = await eslint.calculateConfigForFile("vite.config.ts");

  for (const config of [app, domain]) {
    assert.equal(config.rules["react-hooks/rules-of-hooks"][0], 2);
    assert.equal(config.rules["react-hooks/exhaustive-deps"][0], 2);
    assert.equal(config.rules["react-refresh/only-export-components"][0], 2);
    assert.match(config.languageOptions.parser.meta.name, /typescript-eslint/);
  }
  for (const config of [script, nodeTest]) {
    assert.equal(config.rules["react-hooks/rules-of-hooks"], undefined);
    assert.equal(config.languageOptions.globals.process, false);
  }
  for (const config of [e2e, vite]) {
    assert.match(config.languageOptions.parser.meta.name, /typescript-eslint/);
    assert.equal(config.rules["react-hooks/rules-of-hooks"], undefined);
  }
});
