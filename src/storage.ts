import type { ProgressAnswer } from "./data/content";

const KEY = "cabadrive.progress.v1";

export type ExamAttempt = {
  id: string;
  finishedAt: string;
  score: number;
  passed: boolean;
  total: number;
};

export type StoredProgress = {
  answers: ProgressAnswer[];
  difficultQuestionIds: string[];
  examAttempts: ExamAttempt[];
};

const emptyProgress: StoredProgress = {
  answers: [],
  difficultQuestionIds: [],
  examAttempts: []
};

export function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      answers: Array.isArray(parsed.answers) ? parsed.answers : [],
      difficultQuestionIds: Array.isArray(parsed.difficultQuestionIds) ? parsed.difficultQuestionIds : [],
      examAttempts: Array.isArray(parsed.examAttempts) ? parsed.examAttempts : []
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StoredProgress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function clearProgress() {
  localStorage.removeItem(KEY);
}
