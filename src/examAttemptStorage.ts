import type { ProgressAnswer } from "./data/content";
import type { StorageLike } from "./progressStoreCore";

// Active (in-progress) exam attempt persistence. This is a separate localStorage
// key from the progress store (`cabadrive.progress.v1`, completed attempts only):
// the running attempt must survive a reload / tab switch and resume with the
// correct remaining time. The deadline is stored as an absolute ms timestamp so
// the timer recomputes `remaining = deadline - now` after any interruption rather
// than trusting a frozen countdown value.
export const EXAM_ATTEMPT_KEY = "cabadrive.exam-attempt.v1";

export type ExamAttemptSnapshot = {
  version: 1;
  questionIds: string[];
  answers: ProgressAnswer[];
  startedAt: number; // ms epoch when the attempt started
  deadline: number; // ms epoch = startedAt + timeLimitMinutes * 60_000
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

// Mirrors the exam-answer contract of `progressStoreCore.answer`: a skipped exam
// answer legitimately carries an empty `selectedAnswerId` (exam + isCorrect false).
function isProgressAnswer(value: unknown): value is ProgressAnswer {
  const item = value as Partial<ProgressAnswer> | null;
  return Boolean(
    item &&
    isNonEmptyString(item.questionId) &&
    typeof item.selectedAnswerId === "string" &&
    (item.selectedAnswerId.length > 0 || (item.mode === "exam" && item.isCorrect === false)) &&
    typeof item.isCorrect === "boolean" &&
    isNonEmptyString(item.answeredAt) &&
    (item.mode === "learning" || item.mode === "exam" || item.mode === "mistakes"),
  );
}

function cloneAnswer(answer: ProgressAnswer): ProgressAnswer {
  return {
    questionId: answer.questionId,
    selectedAnswerId: answer.selectedAnswerId,
    isCorrect: answer.isCorrect,
    answeredAt: answer.answeredAt,
    mode: answer.mode,
  };
}

/**
 * PURE validator/parser. Returns the snapshot only when it is safe to resume,
 * otherwise `null`. Rejects: null/non-JSON raw, `version !== 1`, `questionIds`
 * that are not unique non-empty strings, any id outside the current pool,
 * `answers` that are not valid `ProgressAnswer[]`, answers that do not line up
 * with the saved question sequence (each answer `i` must be exam-mode and target
 * `questionIds[i]`, since `position` is derived from `answers.length`), a
 * terminal attempt with as many (or more) answers as questions — that attempt is
 * finished, not resumable, and resuming it would leave `position` past the last
 * question — non-finite `startedAt`/`deadline`, and an expired attempt
 * (`deadline <= now`).
 */
export function parseExamAttempt(
  raw: string | null,
  opts: { now: number; validQuestionIds: ReadonlySet<string> },
): ExamAttemptSnapshot | null {
  if (raw === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const item = parsed as Partial<ExamAttemptSnapshot>;
  if (item.version !== 1) return null;
  const { questionIds, answers, startedAt, deadline } = item;
  if (!Array.isArray(questionIds) || questionIds.length === 0) return null;
  if (!questionIds.every(isNonEmptyString)) return null;
  if (new Set(questionIds).size !== questionIds.length) return null;
  if (!questionIds.every((id) => opts.validQuestionIds.has(id))) return null;
  if (!Array.isArray(answers) || !answers.every(isProgressAnswer)) return null;
  if (answers.length >= questionIds.length) return null;
  // Each saved answer must correspond to its question in sequence: position is
  // derived from answers.length, so a mismatched/stale answer would silently skip
  // a real question and let finishExam record a foreign answer into progress.
  if (
    !answers.every(
      (answer, index) => answer.mode === "exam" && answer.questionId === questionIds[index],
    )
  )
    return null;
  if (!Number.isFinite(startedAt) || !Number.isFinite(deadline)) return null;
  if ((deadline as number) <= opts.now) return null;
  return {
    version: 1,
    questionIds: [...questionIds],
    answers: answers.map(cloneAnswer),
    startedAt: startedAt as number,
    deadline: deadline as number,
  };
}

/** PURE — whole seconds left until `deadline`, floored at 0 and ceiled up so a
 * fractional second still reads as time remaining. Used by the timer tick and
 * the resume prompt. */
export function remainingSeconds(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

/** Best effort — returns false (never throws) when storage is unavailable or the
 * quota is exhausted, so the exam keeps running in memory. On a failed write it
 * also drops any previously-stored snapshot: otherwise a mid-attempt failure
 * (e.g. quota exhaustion after an earlier successful save) would leave a STALE
 * older snapshot under the key, and a plain reload/close would silently resume
 * from it — losing every answer made after the failed write. The invariant is:
 * the key reflects the current attempt or is absent, never a stale prior state. */
export function saveExamAttempt(storage: StorageLike, snapshot: ExamAttemptSnapshot): boolean {
  try {
    storage.setItem(EXAM_ATTEMPT_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    clearExamAttempt(storage);
    return false;
  }
}

/** Reads and validates the stored attempt; returns null on any read/parse/
 * validation failure (including an expired or foreign attempt). */
export function readExamAttempt(
  storage: StorageLike,
  opts: { now: number; validQuestionIds: ReadonlySet<string> },
): ExamAttemptSnapshot | null {
  let raw: string | null;
  try {
    raw = storage.getItem(EXAM_ATTEMPT_KEY);
  } catch {
    return null;
  }
  return parseExamAttempt(raw, opts);
}

/** Best effort — swallows removal failures. */
export function clearExamAttempt(storage: StorageLike): void {
  try {
    storage.removeItem(EXAM_ATTEMPT_KEY);
  } catch {
    // A stale key only re-offers resume and stays namespace-scoped.
  }
}
