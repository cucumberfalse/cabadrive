import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { validateCabaExamProcessGuide } from "../scripts/content-caba-exam-process.mjs";

const guide = JSON.parse(readFileSync("content/guide/caba-exam-process.ru.json", "utf8"));

test("CABA exam process guide validates structured official-source metadata", () => {
  const errors = validateCabaExamProcessGuide({ guide });
  assert.deepEqual(errors, []);
});

test("CABA exam process guide keeps the first slice narrow and unofficial", () => {
  assert.equal(guide.primaryScope.jurisdiction, "CABA");
  assert.equal(guide.primaryScope.procedure, "otorgamiento");
  assert.equal(guide.primaryScope.category, "B1");
  assert.equal(guide.contentStatus, "unofficial_learning_aid");
  assert.match(guide.disclaimerRu, /неофициальная/);
  assert.match(guide.officialActionWarningRu, /официальные страницы GCBA\/ANSV/);
});

test("CABA exam process guide labels volatile procedural areas", () => {
  const volatileSections = guide.sections.filter((section) => section.volatility);
  assert.ok(volatileSections.length >= 4);
  for (const section of volatileSections) {
    assert.match(section.volatilityWarningRu, /провер|волатиль|официаль/i, section.id);
  }
  assert.ok(!JSON.stringify(guide.sections).includes("16,800"));
  assert.ok(!JSON.stringify(guide.sections).includes("4,000"));
});
