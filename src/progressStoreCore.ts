import type { ProgressAnswer } from "./data/content";

export const PROGRESS_KEY = "cabadrive.progress.v1";
export const PROGRESS_BACKUP_KEY = "cabadrive.progress.v1.backup";
export const PROGRESS_RECOVERY_KEY = "cabadrive.progress.v1.recovery";
export const ANSWER_LIMIT = 5000;

export type ExamAttempt = {
  id: string;
  finishedAt: string;
  score: number;
  passed: boolean;
  total: number;
};

export type PrunedAnswerStat = {
  questionId: string;
  wrong: number;
  lastPrunedAnswer: ProgressAnswer;
  firstSeenOrder: number;
};

export type ProgressV2 = {
  version: 2;
  answers: ProgressAnswer[];
  difficultQuestionIds: string[];
  examAttempts: ExamAttempt[];
  prunedAnswerStats: PrunedAnswerStat[];
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type RecoveryCode =
  | "localDataRecovered"
  | "migrationBackupFailed"
  | "storageQuotaExhausted"
  | "storageWriteFailed"
  | "importRejected";
export type RecoveryEvent = {
  code: RecoveryCode;
  operation: string;
  retainedAnswers: number;
  aggregateRecords: number;
  detail?: string;
};

export type ProgressAction =
  | { type: "recordAnswer"; answer: ProgressAnswer }
  | { type: "toggleDifficult"; questionId: string }
  | { type: "finishExam"; answers: ProgressAnswer[]; attempt: ExamAttempt }
  | { type: "reset" }
  | { type: "importProgress"; raw: string };

const empty = (): ProgressV2 => ({
  version: 2,
  answers: [],
  difficultQuestionIds: [],
  examAttempts: [],
  prunedAnswerStats: [],
});
const cloneAnswer = (answer: ProgressAnswer): ProgressAnswer => ({
  questionId: answer.questionId,
  selectedAnswerId: answer.selectedAnswerId,
  isCorrect: answer.isCorrect,
  answeredAt: answer.answeredAt,
  mode: answer.mode,
});
const clone = (state: ProgressV2): ProgressV2 => ({
  version: 2,
  answers: state.answers.map(cloneAnswer),
  difficultQuestionIds: [...state.difficultQuestionIds],
  examAttempts: state.examAttempts.map((attempt) => ({ ...attempt })),
  prunedAnswerStats: state.prunedAnswerStats.map((stat) => ({
    ...stat,
    lastPrunedAnswer: cloneAnswer(stat.lastPrunedAnswer),
  })),
});

export function emptyProgress(): ProgressV2 {
  return empty();
}
function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
function answer(value: unknown): value is ProgressAnswer {
  const item = value as Partial<ProgressAnswer> | null;
  return Boolean(
    item &&
    nonEmpty(item.questionId) &&
    typeof item.selectedAnswerId === "string" &&
    typeof item.isCorrect === "boolean" &&
    nonEmpty(item.answeredAt) &&
    (item.mode === "learning" || item.mode === "exam" || item.mode === "mistakes"),
  );
}
function attempt(value: unknown): value is ExamAttempt {
  const item = value as Partial<ExamAttempt> | null;
  return Boolean(
    item &&
    nonEmpty(item.id) &&
    nonEmpty(item.finishedAt) &&
    Number.isFinite(item.score) &&
    item.score! >= 0 &&
    item.score! <= 100 &&
    typeof item.passed === "boolean" &&
    Number.isSafeInteger(item.total) &&
    item.total! >= 0,
  );
}
function stat(value: unknown): value is PrunedAnswerStat {
  const item = value as Partial<PrunedAnswerStat> | null;
  return Boolean(
    item &&
    nonEmpty(item.questionId) &&
    Number.isSafeInteger(item.wrong) &&
    item.wrong! >= 0 &&
    Number.isSafeInteger(item.firstSeenOrder) &&
    item.firstSeenOrder! >= 0 &&
    answer(item.lastPrunedAnswer) &&
    item.lastPrunedAnswer!.questionId === item.questionId &&
    (item.wrong! > 0 || item.lastPrunedAnswer!.isCorrect),
  );
}
function sortedStats(stats: PrunedAnswerStat[]) {
  return [...stats].sort((a, b) => a.firstSeenOrder - b.firstSeenOrder);
}
function validStats(stats: unknown): stats is PrunedAnswerStat[] {
  if (!Array.isArray(stats) || !stats.every(stat)) return false;
  const ids = new Set<string>();
  const orders = new Set<number>();
  for (const item of stats) {
    if (ids.has(item.questionId) || orders.has(item.firstSeenOrder)) return false;
    ids.add(item.questionId);
    orders.add(item.firstSeenOrder);
  }
  return stats.every(
    (item, index) => index === 0 || stats[index - 1].firstSeenOrder < item.firstSeenOrder,
  );
}
function validIds(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.every(nonEmpty) && new Set(ids).size === ids.length;
}

/** Folds only the specified retained prefix; it never sees or re-folds earlier history. */
export function foldPrefix(state: ProgressV2, count: number): ProgressV2 {
  const removed = state.answers.slice(0, Math.max(0, Math.min(count, state.answers.length)));
  if (!removed.length) return clone(state);
  const stats = new Map(
    sortedStats(state.prunedAnswerStats).map((item) => [
      item.questionId,
      { ...item, lastPrunedAnswer: cloneAnswer(item.lastPrunedAnswer) },
    ]),
  );
  let nextOrder = Math.max(-1, ...[...stats.values()].map((item) => item.firstSeenOrder)) + 1;
  for (const item of removed) {
    const current = stats.get(item.questionId);
    if (current) {
      current.wrong += Number(!item.isCorrect);
      current.lastPrunedAnswer = cloneAnswer(item);
    } else {
      stats.set(item.questionId, {
        questionId: item.questionId,
        wrong: Number(!item.isCorrect),
        lastPrunedAnswer: cloneAnswer(item),
        firstSeenOrder: nextOrder++,
      });
    }
  }
  return {
    ...clone(state),
    answers: state.answers.slice(removed.length).map(cloneAnswer),
    prunedAnswerStats: sortedStats([...stats.values()]),
  };
}

export function pruneToLimit(state: ProgressV2, max = ANSWER_LIMIT): ProgressV2 {
  return state.answers.length <= max ? clone(state) : foldPrefix(state, state.answers.length - max);
}

export function mistakesFromProgress(progress: ProgressV2) {
  const stats = new Map<string, { wrong: number; last?: ProgressAnswer }>();
  for (const item of sortedStats(progress.prunedAnswerStats))
    stats.set(item.questionId, { wrong: item.wrong, last: cloneAnswer(item.lastPrunedAnswer) });
  for (const item of progress.answers) {
    const current = stats.get(item.questionId) || { wrong: 0 };
    current.wrong += Number(!item.isCorrect);
    current.last = cloneAnswer(item);
    stats.set(item.questionId, current);
  }
  return [...stats.entries()]
    .filter(([, item]) => item.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([questionId, item]) => ({ questionId, wrong: item.wrong, last: item.last! }));
}

export function serializeProgress(state: ProgressV2) {
  const value = pruneToLimit(state);
  return JSON.stringify({
    version: 2,
    answers: value.answers,
    difficultQuestionIds: value.difficultQuestionIds,
    examAttempts: value.examAttempts,
    prunedAnswerStats: sortedStats(value.prunedAnswerStats),
  });
}

function strictV2(value: unknown): ProgressV2 | undefined {
  const item = value as Partial<ProgressV2> | null;
  if (
    !item ||
    item.version !== 2 ||
    !Array.isArray(item.answers) ||
    !item.answers.every(answer) ||
    !validIds(item.difficultQuestionIds) ||
    !Array.isArray(item.examAttempts) ||
    !item.examAttempts.every(attempt) ||
    !validStats(item.prunedAnswerStats)
  )
    return undefined;
  return pruneToLimit({
    version: 2,
    answers: item.answers.map(cloneAnswer),
    difficultQuestionIds: [...item.difficultQuestionIds],
    examAttempts: item.examAttempts.map((entry) => ({ ...entry })),
    prunedAnswerStats: item.prunedAnswerStats.map((entry) => ({
      ...entry,
      lastPrunedAnswer: cloneAnswer(entry.lastPrunedAnswer),
    })),
  });
}

function recoverLocal(value: unknown): {
  state: ProgressV2;
  recovered: boolean;
  migrated: boolean;
} {
  const item = value as Record<string, unknown> | null;
  if (!item || typeof item !== "object")
    return { state: empty(), recovered: true, migrated: false };
  if (item.version === 2) {
    const answers = Array.isArray(item.answers) ? item.answers.filter(answer).map(cloneAnswer) : [];
    const ids = Array.isArray(item.difficultQuestionIds)
      ? item.difficultQuestionIds
          .filter(nonEmpty)
          .filter((id, index, all) => all.indexOf(id) === index)
      : [];
    const attempts = Array.isArray(item.examAttempts)
      ? item.examAttempts.filter(attempt).map((entry) => ({ ...entry }))
      : [];
    const aggregate = validStats(item.prunedAnswerStats)
      ? item.prunedAnswerStats.map((entry) => ({
          ...entry,
          lastPrunedAnswer: cloneAnswer(entry.lastPrunedAnswer),
        }))
      : [];
    const state = pruneToLimit({
      version: 2,
      answers,
      difficultQuestionIds: ids,
      examAttempts: attempts,
      prunedAnswerStats: aggregate,
    });
    const recovered = !strictV2(item);
    return { state, recovered, migrated: false };
  }
  if ("version" in item) return { state: empty(), recovered: true, migrated: false };
  const answers = Array.isArray(item.answers) ? item.answers.filter(answer).map(cloneAnswer) : [];
  const ids = Array.isArray(item.difficultQuestionIds)
    ? item.difficultQuestionIds
        .filter(nonEmpty)
        .filter((id, index, all) => all.indexOf(id) === index)
    : [];
  const attempts = Array.isArray(item.examAttempts)
    ? item.examAttempts.filter(attempt).map((entry) => ({ ...entry }))
    : [];
  const recovered =
    !Array.isArray(item.answers) ||
    !Array.isArray(item.difficultQuestionIds) ||
    !Array.isArray(item.examAttempts) ||
    answers.length !== item.answers.length ||
    ids.length !== item.difficultQuestionIds.length ||
    attempts.length !== item.examAttempts.length;
  return {
    state: pruneToLimit({
      version: 2,
      answers,
      difficultQuestionIds: ids,
      examAttempts: attempts,
      prunedAnswerStats: [],
    }),
    recovered,
    migrated: true,
  };
}

export function parseImportedProgress(raw: string): ProgressV2 | undefined {
  try {
    return strictV2(JSON.parse(raw));
  } catch {
    return undefined;
  }
}

function isQuota(error: unknown) {
  return error instanceof DOMException
    ? error.name === "QuotaExceededError"
    : Boolean(
        error &&
        typeof error === "object" &&
        (error as { name?: string }).name === "QuotaExceededError",
      );
}

export function createProgressStore(storage: StorageLike) {
  let state = empty();
  let pendingV1Backup: string | undefined;
  let lastRecovery: RecoveryEvent | undefined;
  const listeners = new Set<() => void>();
  const recoveryListeners = new Set<(event: RecoveryEvent) => void>();
  const notify = () => listeners.forEach((listener) => listener());
  const recover = (code: RecoveryCode, operation: string, detail?: string) => {
    lastRecovery = {
      code,
      operation,
      retainedAnswers: state.answers.length,
      aggregateRecords: state.prunedAnswerStats.length,
      detail,
    };
    recoveryListeners.forEach((listener) => listener(lastRecovery!));
  };
  const diagnostic = (raw: string, detail: string) => {
    try {
      storage.setItem(PROGRESS_RECOVERY_KEY, JSON.stringify({ reason: detail, raw }));
    } catch {
      /* diagnostic storage is best effort */
    }
  };

  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (raw) {
      try {
        const loaded = recoverLocal(JSON.parse(raw));
        state = loaded.state;
        if (loaded.migrated) pendingV1Backup = raw;
        if (loaded.recovered) {
          diagnostic(raw, "invalid-local-progress");
          recover("localDataRecovered", "load", "invalid local fragments were discarded");
        }
      } catch {
        diagnostic(raw, "invalid-json");
        recover("localDataRecovered", "load", "invalid JSON");
      }
    }
  } catch {
    recover("storageWriteFailed", "load", "storage read failed");
  }

  const persist = (operation: string) => {
    if (pendingV1Backup !== undefined) {
      try {
        storage.setItem(PROGRESS_BACKUP_KEY, pendingV1Backup);
        pendingV1Backup = undefined;
      } catch {
        recover("migrationBackupFailed", operation);
        return;
      }
    }
    while (true) {
      try {
        storage.setItem(PROGRESS_KEY, serializeProgress(state));
        return;
      } catch (error) {
        if (!isQuota(error)) {
          recover("storageWriteFailed", operation);
          return;
        }
        if (!state.answers.length) {
          recover("storageQuotaExhausted", operation);
          return;
        }
        state = foldPrefix(state, Math.max(1, Math.ceil(state.answers.length / 2)));
        notify();
      }
    }
  };
  if (pendingV1Backup !== undefined) persist("migration");

  const dispatch = (action: ProgressAction) => {
    if (action.type === "importProgress") {
      const imported = parseImportedProgress(action.raw);
      if (!imported) {
        recover("importRejected", "import");
        return false;
      }
      state = imported;
      persist("import");
      notify();
      return true;
    }
    if (action.type === "recordAnswer")
      state = pruneToLimit({
        ...clone(state),
        answers: [...state.answers, cloneAnswer(action.answer)],
      });
    if (action.type === "toggleDifficult")
      state = {
        ...clone(state),
        difficultQuestionIds: state.difficultQuestionIds.includes(action.questionId)
          ? state.difficultQuestionIds.filter((id) => id !== action.questionId)
          : [...state.difficultQuestionIds, action.questionId],
      };
    if (action.type === "finishExam")
      state = pruneToLimit({
        ...clone(state),
        answers: [...state.answers, ...action.answers.map(cloneAnswer)],
        examAttempts: [...state.examAttempts, { ...action.attempt }],
      });
    if (action.type === "reset") {
      state = empty();
      pendingV1Backup = undefined;
      try {
        storage.removeItem(PROGRESS_KEY);
        storage.removeItem(PROGRESS_BACKUP_KEY);
        storage.removeItem(PROGRESS_RECOVERY_KEY);
      } catch {
        /* key cleanup is best effort; the empty payload is rewritten below */
      }
    }
    persist(action.type);
    notify();
    return true;
  };
  return {
    getSnapshot: () => state,
    getLastRecovery: () => lastRecovery,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeRecovery(listener: (event: RecoveryEvent) => void) {
      recoveryListeners.add(listener);
      return () => recoveryListeners.delete(listener);
    },
    dispatch,
    exportProgress: () => serializeProgress(state),
  };
}
