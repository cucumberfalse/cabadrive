import type { ProgressAnswer, Question } from "./data/content";

export function scorePercent(correct: number, total: number) {
  if (total <= 0) return 0;
  return Math.floor((correct / total) * 100);
}

export function isPassing(score: number, passingScore: number) {
  return score >= passingScore;
}

export function deterministicExamSet(questions: Question[], count: number) {
  const sorted = [...questions].sort((a, b) => {
    if (Number(b.flags.hasImage) !== Number(a.flags.hasImage)) {
      return Number(b.flags.hasImage) - Number(a.flags.hasImage);
    }
    return a.id.localeCompare(b.id);
  });
  return sorted.slice(0, Math.min(count, sorted.length));
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
