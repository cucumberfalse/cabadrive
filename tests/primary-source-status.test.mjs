import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync("src/primarySourceStatus.ts", "utf8");
const javaScript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    isolatedModules: true,
  },
  fileName: "src/primarySourceStatus.ts",
}).outputText;
const primarySourceStatus = await import(
  `data:text/javascript;base64,${Buffer.from(javaScript).toString("base64")}`
);

test("exact-text status notes distinguish passed, pending, and failed states", () => {
  assert.deepEqual(primarySourceStatus.exactTextStatusNote("passed"), {
    kind: "passed",
    title: "Точный текст проверен.",
    description:
      "Испанский архив прошел exact-text проверку для этого источника. Русский слой неофициальный и нужен только для учебы.",
  });
  assert.deepEqual(primarySourceStatus.exactTextStatusNote("pending"), {
    kind: "pending",
    title: "Проверка точного текста ожидается.",
    description:
      "До финального релиза испанский архив требует отдельной exact-text проверки. Русский слой неофициальный и нужен только для учебы.",
  });
  assert.deepEqual(primarySourceStatus.exactTextStatusNote("failed"), {
    kind: "failed",
    title: "Проверка точного текста не пройдена.",
    description:
      "Испанский архив требует исправления перед финальным релизом. Русский слой неофициальный и нужен только для учебы.",
  });
});
