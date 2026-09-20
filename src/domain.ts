import type { ProgressAnswer, Question } from "./data/content";
import type { LearningQuestionStat } from "./progressStoreCore";

export type ExamFormatTiming = {
  questionCount?: number;
  timeLimitMinutes?: number;
};

export function scorePercent(correct: number, total: number) {
  if (total <= 0) return 0;
  return Math.floor((correct / total) * 100);
}

export function isPassing(score: number, passingScore: number) {
  return score >= passingScore;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(Math.max(totalSeconds, 0) / 60);
  const seconds = Math.max(totalSeconds, 0) % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function learningTicketTargetSeconds(
  examFormat: ExamFormatTiming,
  roundingStepSeconds = 15,
) {
  const { questionCount, timeLimitMinutes } = examFormat;
  if (
    !Number.isFinite(questionCount) ||
    !Number.isFinite(timeLimitMinutes) ||
    !Number.isFinite(roundingStepSeconds) ||
    questionCount === undefined ||
    timeLimitMinutes === undefined ||
    questionCount <= 0 ||
    timeLimitMinutes <= 0 ||
    roundingStepSeconds <= 0
  ) {
    return undefined;
  }

  return (
    Math.ceil((timeLimitMinutes * 60) / questionCount / roundingStepSeconds) * roundingStepSeconds
  );
}

function sortedExamSet(questions: Question[], count: number) {
  return [...questions]
    .sort((a, b) => {
      if (Number(b.flags.hasImage) !== Number(a.flags.hasImage)) {
        return Number(b.flags.hasImage) - Number(a.flags.hasImage);
      }
      return a.id.localeCompare(b.id);
    })
    .slice(0, Math.min(count, questions.length));
}

export function shuffleQuestions<T>(questions: T[], random = Math.random) {
  const shuffled = [...questions];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.min(Math.max(Math.floor(random() * (index + 1)), 0), index);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function orderLearningQuestions<T extends Pick<Question, "id">>(
  questions: T[],
  learningQuestionStats: LearningQuestionStat[],
  random = Math.random,
): T[] {
  const stats = new Map(learningQuestionStats.map((item) => [item.questionId, item]));
  return shuffleQuestions(questions, random)
    .map((question, sessionRank) => ({ question, sessionRank }))
    .sort((left, right) => {
      const leftStat = stats.get(left.question.id);
      const rightStat = stats.get(right.question.id);
      const countDifference = (leftStat?.showCount ?? 0) - (rightStat?.showCount ?? 0);
      if (countDifference !== 0) return countDifference;
      const priorityDifference =
        Number(rightStat?.activeMistakePriority ?? false) -
        Number(leftStat?.activeMistakePriority ?? false);
      if (priorityDifference !== 0) return priorityDifference;
      const randomDifference = left.sessionRank - right.sessionRank;
      if (randomDifference !== 0) return randomDifference;
      return left.question.id.localeCompare(right.question.id);
    })
    .map(({ question }) => question);
}

function randomExamSet(questions: Question[], count: number, random: () => number) {
  return shuffleQuestions(questions, random).slice(0, Math.min(count, questions.length));
}

export function selectExamSet(
  questions: Question[],
  count: number,
  questionOrderRule: string,
  random = Math.random,
) {
  if (questionOrderRule === "random_questions_from_available_validated_pool") {
    return randomExamSet(questions, count, random);
  }
  return sortedExamSet(questions, count);
}

export function mistakesFromHistory(history: ProgressAnswer[]) {
  const stats = new Map<string, { wrong: number; last?: ProgressAnswer }>();
  for (const answer of history) {
    const current = stats.get(answer.questionId) || { wrong: 0 };
    if (!answer.isCorrect) current.wrong += 1;
    current.last = answer;
    stats.set(answer.questionId, current);
  }
  return [...stats.entries()]
    .filter(([, stat]) => stat.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([questionId, stat]) => ({ questionId, wrong: stat.wrong, last: stat.last }));
}
