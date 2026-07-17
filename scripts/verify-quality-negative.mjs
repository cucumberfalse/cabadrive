import { existsSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sentinels = {
  type: path.join(root, "src/__quality_typecheck_sentinel.ts"),
  hooks: path.join(root, "src/__quality_hooks_sentinel.tsx"),
  format: path.join(root, "scripts/__quality_format_sentinel.mjs"),
};

function run(command, args, expectedStatus, expectedOutput) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.status !== expectedStatus || (expectedOutput && !expectedOutput.test(output))) {
    throw new Error(
      `${command} ${args.join(" ")} returned ${result.status}; expected ${expectedStatus}.\n${output}`,
    );
  }
}

for (const sentinel of Object.values(sentinels)) {
  if (existsSync(sentinel)) {
    throw new Error(`Refusing to overwrite existing quality sentinel: ${sentinel}`);
  }
}

try {
  writeFileSync(sentinels.type, 'export const qualityTypeSentinel: number = "intentional";\n');
  run("pnpm", ["run", "typecheck"], 2, /__quality_typecheck_sentinel\.ts/);
  rmSync(sentinels.type);

  writeFileSync(
    sentinels.hooks,
    'import { useEffect } from "react";\nexport function QualityHooksSentinel({ enabled }: { enabled: boolean }) {\n  if (enabled) useEffect(() => {}, []);\n  return null;\n}\n',
  );
  run(
    "pnpm",
    ["exec", "eslint", "--max-warnings", "0", sentinels.hooks],
    1,
    /react-hooks\/rules-of-hooks/,
  );
  rmSync(sentinels.hooks);

  writeFileSync(sentinels.format, "export const qualityFormatSentinel={enabled:true}\n");
  run("pnpm", ["exec", "prettier", "--check", sentinels.format], 1, /Code style issues/);
  run("pnpm", ["exec", "prettier", "--write", sentinels.format], 0);
  run("pnpm", ["exec", "prettier", "--check", sentinels.format], 0);
} finally {
  for (const sentinel of Object.values(sentinels)) {
    rmSync(sentinel, { force: true });
  }
}

run("pnpm", ["run", "typecheck"], 0);
console.log("Negative quality contracts passed and all sentinels were removed.");
