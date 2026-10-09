import type { ProgressAnswer } from "./data/content";

export const PROGRESS_KEY = "cabadrive.progress.v1";
export const PROGRESS_BACKUP_KEY = "cabadrive.progress.v1.backup";
export const PROGRESS_V2_BACKUP_KEY = "cabadrive.progress.v2.backup";
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

export type LearningQuestionStat = {
  questionId: string;
  showCount: number;
  activeMistakePriority: boolean;
  correctStreakAfterLastError: 0 | 1 | 2 | 3 | 4;
};

export type ProgressV3 = {
  version: 3;
  answers: ProgressAnswer[];
  difficultQuestionIds: string[];
  examAttempts: ExamAttempt[];
  prunedAnswerStats: PrunedAnswerStat[];
  learningQuestionStats: LearningQuestionStat[];
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
  | { type: "recordQuestionExposure"; questionId: string }
  | { type: "toggleDifficult"; questionId: string }
  | { type: "finishExam"; answers: ProgressAnswer[]; attempt: ExamAttempt }
  | { type: "reset" }
  | { type: "importProgress"; raw: string };

const empty = (): ProgressV3 => ({
  version: 3,
  answers: [],
  difficultQuestionIds: [],
  examAttempts: [],
  prunedAnswerStats: [],
  learningQuestionStats: [],
});
const cloneAnswer = (answer: ProgressAnswer): ProgressAnswer => ({
  questionId: answer.questionId,
  selectedAnswerId: answer.selectedAnswerId,
  isCorrect: answer.isCorrect,
  answeredAt: answer.answeredAt,
  mode: answer.mode,
});
const cloneAttempt = (attempt: ExamAttempt): ExamAttempt => ({
  id: attempt.id,
  finishedAt: attempt.finishedAt,
  score: attempt.score,
  passed: attempt.passed,
  total: attempt.total,
});
const cloneStat = (stat: PrunedAnswerStat): PrunedAnswerStat => ({
  questionId: stat.questionId,
  wrong: stat.wrong,
  lastPrunedAnswer: cloneAnswer(stat.lastPrunedAnswer),
  firstSeenOrder: stat.firstSeenOrder,
});
const cloneLearningStat = (stat: LearningQuestionStat): LearningQuestionStat => ({
  questionId: stat.questionId,
  showCount: stat.showCount,
  activeMistakePriority: stat.activeMistakePriority,
  correctStreakAfterLastError: stat.correctStreakAfterLastError,
});
const clone = (state: ProgressV3): ProgressV3 => ({
  version: 3,
  answers: state.answers.map(cloneAnswer),
  difficultQuestionIds: [...state.difficultQuestionIds],
  examAttempts: state.examAttempts.map(cloneAttempt),
  prunedAnswerStats: state.prunedAnswerStats.map(cloneStat),
  learningQuestionStats: state.learningQuestionStats.map(cloneLearningStat),
});

export function emptyProgress(): ProgressV3 {
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
    (item.selectedAnswerId.length > 0 || (item.mode === "exam" && item.isCorrect === false)) &&
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

function learningStat(value: unknown): value is LearningQuestionStat {
  const item = value as Partial<LearningQuestionStat> | null;
  return Boolean(
    item &&
    nonEmpty(item.questionId) &&
    Number.isSafeInteger(item.showCount) &&
    item.showCount! >= 0 &&
    typeof item.activeMistakePriority === "boolean" &&
    Number.isSafeInteger(item.correctStreakAfterLastError) &&
    item.correctStreakAfterLastError! >= 0 &&
    item.correctStreakAfterLastError! <= 4 &&
    (item.activeMistakePriority
      ? item.correctStreakAfterLastError! <= 3
      : item.correctStreakAfterLastError === 0 || item.correctStreakAfterLastError === 4),
  );
}

function compareQuestionIdsOrdinal(left: string, right: string) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedLearningStats(stats: LearningQuestionStat[]) {
  return [...stats].sort((a, b) => compareQuestionIdsOrdinal(a.questionId, b.questionId));
}

function validLearningStats(stats: unknown): stats is LearningQuestionStat[] {
  if (!Array.isArray(stats) || !stats.every(learningStat)) return false;
  const ids = new Set<string>();
  for (const item of stats) {
    if (ids.has(item.questionId)) return false;
    ids.add(item.questionId);
  }
  return stats.every(
    (item, index) =>
      index === 0 || compareQuestionIdsOrdinal(stats[index - 1].questionId, item.questionId) < 0,
  );
}

export function applyAnswerToLearningStats(
  stats: LearningQuestionStat[],
  progressAnswer: ProgressAnswer,
): LearningQuestionStat[] {
  const next = new Map(stats.map((item) => [item.questionId, cloneLearningStat(item)] as const));
  const current = next.get(progressAnswer.questionId) ?? {
    questionId: progressAnswer.questionId,
    showCount: 0,
    activeMistakePriority: false,
    correctStreakAfterLastError: 0 as const,
  };
  if (!progressAnswer.isCorrect) {
    current.activeMistakePriority = true;
    current.correctStreakAfterLastError = 0;
  } else if (current.activeMistakePriority) {
    const streak = Math.min(4, current.correctStreakAfterLastError + 1) as 1 | 2 | 3 | 4;
    current.correctStreakAfterLastError = streak;
    if (streak === 4) current.activeMistakePriority = false;
  }
  next.set(current.questionId, current);
  return sortedLearningStats([...next.values()]);
}

function deriveLearningStats(
  answers: ProgressAnswer[],
  prunedAnswerStats: PrunedAnswerStat[],
): LearningQuestionStat[] {
  let stats: LearningQuestionStat[] = sortedStats(prunedAnswerStats)
    .filter((item) => item.wrong > 0)
    .map((item) => ({
      questionId: item.questionId,
      showCount: 0,
      activeMistakePriority: true,
      correctStreakAfterLastError: 0,
    }));
  for (const item of answers) stats = applyAnswerToLearningStats(stats, item);
  return stats;
}

/** Folds only the specified retained prefix; it never sees or re-folds earlier history. */
export function foldPrefix(state: ProgressV3, count: number): ProgressV3 {
  const removed = state.answers.slice(0, Math.max(0, Math.min(count, state.answers.length)));
  if (!removed.length) return clone(state);
  const stats = new Map(
    sortedStats(state.prunedAnswerStats).map((item) => [item.questionId, cloneStat(item)]),
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

export function pruneToLimit(state: ProgressV3, max = ANSWER_LIMIT): ProgressV3 {
  return state.answers.length <= max ? clone(state) : foldPrefix(state, state.answers.length - max);
}

export function mistakesFromProgress(progress: ProgressV3) {
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

export function serializeProgress(state: ProgressV3) {
  const value = pruneToLimit(state);
  return JSON.stringify({
    version: 3,
    answers: value.answers,
    difficultQuestionIds: value.difficultQuestionIds,
    examAttempts: value.examAttempts,
    prunedAnswerStats: sortedStats(value.prunedAnswerStats),
    learningQuestionStats: sortedLearningStats(value.learningQuestionStats),
  });
}

type ProgressV2Payload = Omit<ProgressV3, "version" | "learningQuestionStats"> & { version: 2 };

function strictV2(value: unknown): ProgressV2Payload | undefined {
  const item = value as Partial<ProgressV2Payload> | null;
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
  return {
    version: 2,
    answers: item.answers.map(cloneAnswer),
    difficultQuestionIds: [...item.difficultQuestionIds],
    examAttempts: item.examAttempts.map(cloneAttempt),
    prunedAnswerStats: item.prunedAnswerStats.map(cloneStat),
  };
}

function strictV3(value: unknown): ProgressV3 | undefined {
  const item = value as Partial<ProgressV3> | null;
  if (
    !item ||
    item.version !== 3 ||
    !Array.isArray(item.answers) ||
    !item.answers.every(answer) ||
    !validIds(item.difficultQuestionIds) ||
    !Array.isArray(item.examAttempts) ||
    !item.examAttempts.every(attempt) ||
    !validStats(item.prunedAnswerStats) ||
    !validLearningStats(item.learningQuestionStats)
  )
    return undefined;
  return pruneToLimit({
    version: 3,
    answers: item.answers.map(cloneAnswer),
    difficultQuestionIds: [...item.difficultQuestionIds],
    examAttempts: item.examAttempts.map(cloneAttempt),
    prunedAnswerStats: item.prunedAnswerStats.map(cloneStat),
    learningQuestionStats: item.learningQuestionStats.map(cloneLearningStat),
  });
}

function migrateV2(value: ProgressV2Payload): ProgressV3 {
  return pruneToLimit({
    version: 3,
    answers: value.answers.map(cloneAnswer),
    difficultQuestionIds: [...value.difficultQuestionIds],
    examAttempts: value.examAttempts.map(cloneAttempt),
    prunedAnswerStats: value.prunedAnswerStats.map(cloneStat),
    learningQuestionStats: deriveLearningStats(value.answers, value.prunedAnswerStats),
  });
}

function recoverLocal(value: unknown): {
  state: ProgressV3;
  recovered: boolean;
  migratedFrom?: 1 | 2;
} {
  const item = value as Record<string, unknown> | null;
  if (!item || typeof item !== "object") return { state: empty(), recovered: true };
  if (item.version === 3) {
    const answers = Array.isArray(item.answers) ? item.answers.filter(answer).map(cloneAnswer) : [];
    const ids = Array.isArray(item.difficultQuestionIds)
      ? item.difficultQuestionIds
          .filter(nonEmpty)
          .filter((id, index, all) => all.indexOf(id) === index)
      : [];
    const attempts = Array.isArray(item.examAttempts)
      ? item.examAttempts.filter(attempt).map(cloneAttempt)
      : [];
    const aggregate = validStats(item.prunedAnswerStats)
      ? item.prunedAnswerStats.map(cloneStat)
      : [];
    const learning = validLearningStats(item.learningQuestionStats)
      ? item.learningQuestionStats.map(cloneLearningStat)
      : deriveLearningStats(answers, aggregate);
    const state = pruneToLimit({
      version: 3,
      answers,
      difficultQuestionIds: ids,
      examAttempts: attempts,
      prunedAnswerStats: aggregate,
      learningQuestionStats: learning,
    });
    return { state, recovered: !strictV3(item) };
  }
  if (item.version === 2) {
    const answers = Array.isArray(item.answers) ? item.answers.filter(answer).map(cloneAnswer) : [];
    const ids = Array.isArray(item.difficultQuestionIds)
      ? item.difficultQuestionIds
          .filter(nonEmpty)
          .filter((id, index, all) => all.indexOf(id) === index)
      : [];
    const attempts = Array.isArray(item.examAttempts)
      ? item.examAttempts.filter(attempt).map(cloneAttempt)
      : [];
    const aggregate = validStats(item.prunedAnswerStats)
      ? item.prunedAnswerStats.map(cloneStat)
      : [];
    const state = pruneToLimit({
      version: 3,
      answers,
      difficultQuestionIds: ids,
      examAttempts: attempts,
      prunedAnswerStats: aggregate,
      learningQuestionStats: deriveLearningStats(answers, aggregate),
    });
    const recovered = !strictV2(item);
    return { state, recovered, migratedFrom: 2 };
  }
  if ("version" in item) return { state: empty(), recovered: true };
  const answers = Array.isArray(item.answers) ? item.answers.filter(answer).map(cloneAnswer) : [];
  const ids = Array.isArray(item.difficultQuestionIds)
    ? item.difficultQuestionIds
        .filter(nonEmpty)
        .filter((id, index, all) => all.indexOf(id) === index)
    : [];
  const attempts = Array.isArray(item.examAttempts)
    ? item.examAttempts.filter(attempt).map(cloneAttempt)
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
      version: 3,
      answers,
      difficultQuestionIds: ids,
      examAttempts: attempts,
      prunedAnswerStats: [],
      learningQuestionStats: deriveLearningStats(answers, []),
    }),
    recovered,
    migratedFrom: 1,
  };
}

export function parseImportedProgress(raw: string): ProgressV3 | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);
    const v3 = strictV3(parsed);
    if (v3) return v3;
    const v2 = strictV2(parsed);
    return v2 ? migrateV2(v2) : undefined;
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
  let pendingMigrationBackup: { key: string; raw: string } | undefined;
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
      return true;
    } catch {
      return false;
    }
  };
  const withDiagnostic = (message: string, saved: boolean) =>
    saved ? message : `${message}; diagnostic copy could not be written`;

  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (raw) {
      try {
        const loaded = recoverLocal(JSON.parse(raw));
        state = loaded.state;
        if (loaded.migratedFrom)
          pendingMigrationBackup = {
            key: loaded.migratedFrom === 1 ? PROGRESS_BACKUP_KEY : PROGRESS_V2_BACKUP_KEY,
            raw,
          };
        if (loaded.recovered) {
          const saved = diagnostic(raw, "invalid-local-progress");
          recover(
            "localDataRecovered",
            "load",
            withDiagnostic("invalid local fragments were discarded", saved),
          );
        }
      } catch {
        const saved = diagnostic(raw, "invalid-json");
        recover("localDataRecovered", "load", withDiagnostic("invalid JSON", saved));
      }
    }
  } catch {
    recover("storageWriteFailed", "load", "storage read failed");
  }

  const persist = (operation: string) => {
    if (pendingMigrationBackup) {
      try {
        storage.setItem(pendingMigrationBackup.key, pendingMigrationBackup.raw);
        pendingMigrationBackup = undefined;
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
  if (pendingMigrationBackup) persist("migration");

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
        learningQuestionStats: applyAnswerToLearningStats(
          state.learningQuestionStats,
          action.answer,
        ),
      });
    if (action.type === "recordQuestionExposure" && nonEmpty(action.questionId)) {
      const stats = new Map(
        state.learningQuestionStats.map((item) => [item.questionId, cloneLearningStat(item)]),
      );
      const current = stats.get(action.questionId) ?? {
        questionId: action.questionId,
        showCount: 0,
        activeMistakePriority: false,
        correctStreakAfterLastError: 0 as const,
      };
      if (current.showCount < Number.MAX_SAFE_INTEGER) current.showCount += 1;
      stats.set(current.questionId, current);
      state = {
        ...clone(state),
        learningQuestionStats: sortedLearningStats([...stats.values()]),
      };
    }
    if (action.type === "toggleDifficult")
      state = {
        ...clone(state),
        difficultQuestionIds: state.difficultQuestionIds.includes(action.questionId)
          ? state.difficultQuestionIds.filter((id) => id !== action.questionId)
          : [...state.difficultQuestionIds, action.questionId],
      };
    if (action.type === "finishExam") {
      let learningQuestionStats = state.learningQuestionStats;
      for (const item of action.answers)
        learningQuestionStats = applyAnswerToLearningStats(learningQuestionStats, item);
      state = pruneToLimit({
        ...clone(state),
        answers: [...state.answers, ...action.answers.map(cloneAnswer)],
        examAttempts: [...state.examAttempts, cloneAttempt(action.attempt)],
        learningQuestionStats,
      });
    }
    if (action.type === "reset") {
      state = empty();
      pendingMigrationBackup = undefined;
      try {
        storage.removeItem(PROGRESS_KEY);
        storage.removeItem(PROGRESS_BACKUP_KEY);
        storage.removeItem(PROGRESS_V2_BACKUP_KEY);
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
