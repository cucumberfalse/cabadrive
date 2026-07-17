import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { ESLint } from "eslint";
import { getFileInfo } from "prettier";

const root = new URL("..", import.meta.url).pathname;
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
const eslintConfig = readFileSync(new URL("../eslint.config.mjs", import.meta.url), "utf8");
const qualitySentinels = [
  "src/__quality_typecheck_sentinel.ts",
  "src/__quality_hooks_sentinel.tsx",
  "scripts/__quality_format_sentinel.mjs",
];

test("quality scripts use fail-closed explicit allowlists", () => {
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit");
  const lintTargets =
    '"src/**/*.{ts,tsx}" "scripts/**/*.mjs" "tests/**/*.mjs" "tests/e2e/**/*.ts" "vite.config.ts" "playwright.config.ts" "eslint.config.mjs"';
  const formatTargets =
    '"src/**/*.{ts,tsx,css}" "scripts/**/*.mjs" "tests/**/*.mjs" "tests/e2e/**/*.ts" "vite.config.ts" "playwright.config.ts" "eslint.config.mjs"';
  assert.equal(packageJson.scripts.lint, `eslint --max-warnings 0 ${lintTargets}`);
  assert.equal(packageJson.scripts.format, `prettier --write ${formatTargets}`);
  assert.equal(packageJson.scripts["format:check"], `prettier --check ${formatTargets}`);
  for (const command of [
    packageJson.scripts.lint,
    packageJson.scripts.format,
    packageJson.scripts["format:check"],
  ]) {
    assert.doesNotMatch(command, /(?:^|\s)\.(?:\s|$)/);
    assert.doesNotMatch(command, /\*\.config\.ts/);
  }
  assert.match(
    eslintConfig,
    /files:\s*\["tests\/e2e\/\*\*\/\*\.ts", "vite\.config\.ts", "playwright\.config\.ts"\]/,
  );
  assert.doesNotMatch(eslintConfig, /"\*\.config\.ts"/);
  assert.equal(packageJson.scripts["quality:fast"], "pnpm run typecheck && pnpm run lint");
  assert.equal(
    packageJson.scripts["verify:quality-negative"],
    "node scripts/verify-quality-negative.mjs",
  );
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
  assert.match(
    ci,
    /QUALITY_SOURCE_HEAD:\s*\$\{\{ github\.event\.pull_request\.head\.sha \|\| github\.sha \}\}/,
  );
  assert.match(ci, /\[\[ ! "\$QUALITY_SOURCE_HEAD" =~ \^\[0-9a-f\]\{40\}\$ \]\]/);
  assert.match(
    ci,
    /quality:fast completed in \$\{elapsed\}s \(budget \$\{QUALITY_FAST_BUDGET_SECONDS\}s, source \$\{QUALITY_SOURCE_HEAD\}\)/,
  );
  assert.match(ci, /elapsed > QUALITY_FAST_BUDGET_SECONDS/);
});

async function waitForFile(file, child) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (existsSync(file)) return;
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(
        `quality helper exited before readiness: ${child.exitCode}/${child.signalCode}`,
      );
    }
    await delay(25);
  }
  throw new Error(`timed out waiting for quality helper readiness marker: ${file}`);
}

test("negative quality helper cleans sentinels and preserves SIGINT/SIGTERM semantics", async () => {
  for (const signal of ["SIGINT", "SIGTERM"]) {
    const tempDirectory = mkdtempSync(path.join(tmpdir(), "cabadrive-quality-signal-"));
    const readyFile = path.join(tempDirectory, "ready");
    const child = spawn(process.execPath, ["scripts/verify-quality-negative.mjs"], {
      cwd: root,
      env: {
        ...process.env,
        QUALITY_NEGATIVE_SIGNAL_READY_FILE: readyFile,
        QUALITY_NEGATIVE_SIGNAL_PAUSE_MS: "30000",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });

    try {
      await waitForFile(readyFile, child);
      assert.equal(child.kill(signal), true);
      const [code, terminatingSignal] = await once(child, "exit");
      assert.equal(code, null, output);
      assert.equal(terminatingSignal, signal, output);
      for (const sentinel of qualitySentinels) {
        assert.equal(
          existsSync(path.join(root, sentinel)),
          false,
          `${sentinel} survived ${signal}`,
        );
      }

      const rerun = spawnSync(process.execPath, ["scripts/verify-quality-negative.mjs"], {
        cwd: root,
        encoding: "utf8",
      });
      assert.equal(rerun.status, 0, `${rerun.stdout}\n${rerun.stderr}`);
    } finally {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
      rmSync(tempDirectory, { force: true, recursive: true });
    }
  }
});

test("negative quality helper refuses and preserves a stale sentinel", () => {
  const staleSentinel = path.join(root, qualitySentinels[0]);
  writeFileSync(staleSentinel, "user-owned stale sentinel\n");
  try {
    const result = spawnSync(process.execPath, ["scripts/verify-quality-negative.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(
      `${result.stdout}\n${result.stderr}`,
      /Refusing to overwrite existing quality sentinel/,
    );
    assert.equal(readFileSync(staleSentinel, "utf8"), "user-owned stale sentinel\n");
  } finally {
    rmSync(staleSentinel, { force: true });
  }
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
    "src/data/manual-sections/",
    "src/data/manualGuide.ts",
    "src/data/pandemiaVialSection.ts",
  ]) {
    assert.match(
      ignore,
      new RegExp(`^${protectedPath.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"),
    );
  }
});

test("Prettier file-info ignores every governed manual TypeScript source", async () => {
  const baseline = JSON.parse(
    readFileSync(
      new URL("../content/manual-ticket-placement/manual-content-baseline.json", import.meta.url),
      "utf8",
    ),
  );
  const canonicalPaths = baseline.protectedSources
    .map(({ path }) => path)
    .filter((path) => path.endsWith(".ts"))
    .sort();
  const trackedInventory = [
    ...readdirSync(new URL("../src/data/manual-sections", import.meta.url))
      .filter((name) => name.endsWith(".ts"))
      .map((name) => `src/data/manual-sections/${name}`),
    "src/data/manualGuide.ts",
    "src/data/pandemiaVialSection.ts",
  ].sort();

  assert.equal(canonicalPaths.length, 52);
  assert.deepEqual(canonicalPaths, trackedInventory);
  for (const path of canonicalPaths) {
    const info = await getFileInfo(path, { ignorePath: ".prettierignore" });
    assert.equal(info.ignored, true, `${path} must remain ignored by Prettier file-info`);
  }
});

test("representative files receive the intended flat-config profiles", async () => {
  const eslint = new ESLint({ cwd: new URL("..", import.meta.url).pathname });
  const app = await eslint.calculateConfigForFile("src/App.tsx");
  const domain = await eslint.calculateConfigForFile("src/domain.ts");
  const script = await eslint.calculateConfigForFile("scripts/shared.mjs");
  const nodeTest = await eslint.calculateConfigForFile("tests/domain.test.mjs");
  const e2e = await eslint.calculateConfigForFile("tests/e2e/app.spec.ts");
  const manualTicketE2e = await eslint.calculateConfigForFile(
    "tests/e2e/manual-ticket-placement.spec.ts",
  );
  const vite = await eslint.calculateConfigForFile("vite.config.ts");
  const playwright = await eslint.calculateConfigForFile("playwright.config.ts");
  const unsafeRules = [
    "@typescript-eslint/no-unsafe-argument",
    "@typescript-eslint/no-unsafe-assignment",
    "@typescript-eslint/no-unsafe-call",
    "@typescript-eslint/no-unsafe-member-access",
    "@typescript-eslint/no-unsafe-return",
  ];

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
  for (const config of [e2e, manualTicketE2e, vite, playwright]) {
    assert.match(config.languageOptions.parser.meta.name, /typescript-eslint/);
    assert.equal(config.rules["react-hooks/rules-of-hooks"], undefined);
    assert.equal(config.rules["@typescript-eslint/await-thenable"][0], 2);
    assert.equal(config.rules["@typescript-eslint/no-floating-promises"][0], 2);
  }
  for (const rule of unsafeRules) {
    assert.equal(e2e.rules[rule][0], 0, `${rule} is the disposed app.spec.ts exception`);
    for (const [file, config] of [
      ["tests/e2e/manual-ticket-placement.spec.ts", manualTicketE2e],
      ["vite.config.ts", vite],
      ["playwright.config.ts", playwright],
    ]) {
      assert.equal(config.rules[rule][0], 2, `${rule} must remain an error for ${file}`);
    }
  }

  for (const file of [
    ...readdirSync(new URL("../tests/e2e", import.meta.url))
      .filter((name) => name.endsWith(".ts"))
      .map((name) => `tests/e2e/${name}`),
    "vite.config.ts",
    "playwright.config.ts",
  ]) {
    assert.doesNotMatch(
      readFileSync(new URL(`../${file}`, import.meta.url), "utf8"),
      /eslint-(?:disable|enable)/,
      `${file} must not bypass calculated config with an inline/file disable`,
    );
  }
});
