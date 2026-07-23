import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

function transpileToModule(path) {
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      isolatedModules: true,
    },
    fileName: path,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

const safety = await transpileToModule("src/progressResetSafety.ts");
const core = await transpileToModule("src/progressStoreCore.ts");
const {
  RESET_UNDO_KEY,
  IMPORT_REJECTED_MESSAGE,
  UNDO_UNAVAILABLE_MESSAGE,
  saveUndoSnapshot,
  readUndoSnapshot,
  clearUndoSnapshot,
  exportFileName,
} = safety;
const { createProgressStore, parseImportedProgress } = core;

class FakeStorage {
  constructor(entries = {}, { setFailures = [], getFailures = [], removeFailures = [] } = {}) {
    this.entries = new Map(Object.entries(entries));
    this.setFailures = [...setFailures];
    this.getFailures = [...getFailures];
    this.removeFailures = [...removeFailures];
  }
  getItem(key) {
    const failure = this.getFailures.shift();
    if (failure) throw failure;
    return this.entries.get(key) ?? null;
  }
  setItem(key, value) {
    const failure = this.setFailures.shift();
    if (failure) throw failure;
    this.entries.set(key, value);
  }
  removeItem(key) {
    const failure = this.removeFailures.shift();
    if (failure) throw failure;
    this.entries.delete(key);
  }
}
const quota = () => Object.assign(new Error("quota"), { name: "QuotaExceededError" });
const answer = (index, correct = index % 3 !== 0) => ({
  questionId: `q-${index % 7}`,
  selectedAnswerId: `a-${index}`,
  isCorrect: correct,
  answeredAt: `2026-01-01T00:00:${String(index % 60).padStart(2, "0")}.000Z`,
  mode: "learning",
});
const attempt = {
  id: "exam-1",
  finishedAt: "2026-01-01T00:00:00.000Z",
  score: 85,
  passed: true,
  total: 40,
};

test("undo snapshot key matches the versioned cabadrive namespace", () => {
  assert.equal(RESET_UNDO_KEY, "cabadrive.progress.reset-undo.v1");
});

test("saveUndoSnapshot writes under the undo key and reports success", () => {
  const storage = new FakeStorage();
  assert.equal(saveUndoSnapshot(storage, '{"version":2}'), true);
  assert.equal(storage.getItem(RESET_UNDO_KEY), '{"version":2}');
});

test("saveUndoSnapshot returns false without throwing when storage rejects the write", () => {
  const denied = new FakeStorage({}, { setFailures: [new Error("security")] });
  assert.equal(saveUndoSnapshot(denied, "snapshot"), false);
  assert.equal(denied.getItem(RESET_UNDO_KEY), null);
  const exhausted = new FakeStorage({}, { setFailures: [quota()] });
  assert.equal(saveUndoSnapshot(exhausted, "snapshot"), false);
});

test("readUndoSnapshot returns the stored value, null when absent, and null on read failure", () => {
  const storage = new FakeStorage({ [RESET_UNDO_KEY]: "snapshot" });
  assert.equal(readUndoSnapshot(storage), "snapshot");
  assert.equal(readUndoSnapshot(new FakeStorage()), null);
  assert.equal(readUndoSnapshot(new FakeStorage({}, { getFailures: [new Error("denied")] })), null);
});

test("clearUndoSnapshot removes the key and swallows removal failures", () => {
  const storage = new FakeStorage({ [RESET_UNDO_KEY]: "snapshot" });
  clearUndoSnapshot(storage);
  assert.equal(storage.getItem(RESET_UNDO_KEY), null);
  assert.doesNotThrow(() =>
    clearUndoSnapshot(new FakeStorage({}, { removeFailures: [new Error("denied")] })),
  );
});

test("exportFileName uses the zero-padded local date in the canonical pattern", () => {
  assert.equal(exportFileName(new Date(2026, 0, 5)), "cabadrive-progress-2026-01-05.json");
  assert.equal(exportFileName(new Date(2026, 11, 31)), "cabadrive-progress-2026-12-31.json");
  assert.equal(exportFileName(new Date(2026, 8, 9)), "cabadrive-progress-2026-09-09.json");
});

test("exportProgress snapshot round-trips through the undo key back into a fresh store", () => {
  const source = createProgressStore(new FakeStorage());
  source.dispatch({ type: "finishExam", answers: [answer(1, false), answer(2)], attempt });
  source.dispatch({ type: "toggleDifficult", questionId: "q-1" });
  const snapshot = source.exportProgress();
  const session = new FakeStorage();
  assert.equal(saveUndoSnapshot(session, snapshot), true);
  const stored = readUndoSnapshot(session);
  assert.equal(stored, snapshot);
  assert.notEqual(parseImportedProgress(stored), undefined);
  const restored = createProgressStore(new FakeStorage());
  assert.equal(restored.dispatch({ type: "importProgress", raw: stored }), true);
  assert.equal(restored.exportProgress(), snapshot);
});

test("user-facing messages are the fixed Russian strings the UI relies on", () => {
  assert.equal(
    IMPORT_REJECTED_MESSAGE,
    "Не удалось импортировать файл: это не корректный экспорт прогресса Cabadrive. Текущий прогресс не изменён.",
  );
  assert.equal(
    UNDO_UNAVAILABLE_MESSAGE,
    "Прогресс сброшен. Отмена недоступна: хранилище сессии недоступно.",
  );
});
