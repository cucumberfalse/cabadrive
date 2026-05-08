import contentMode from "../../content/meta/content-mode.json";
import examFormat from "../../content/config/caba-exam-format.json";
import sources from "../../content/sources/sources.json";
import questions from "../../content/questions/caba-b.unofficial-fallback.questions.json";
import translations from "../../content/translations/ru.translations.json";
import explanations from "../../content/explanations/ru.explanations.json";
import vocabulary from "../../content/vocabulary/ru.vocabulary.json";
import guide from "../../content/guide/ru.condensed-guide.json";

export type Answer = {
  id: string;
  officialTextEs: string;
};

export type Question = {
  id: string;
  sourceId: string;
  jurisdiction: "CABA";
  category: "B";
  contentStatus: "unofficial_fallback";
  officialTextEs: string;
  answers: Answer[];
  correctAnswerId: string;
  image?: {
    altEs: string;
    originalUrl: string;
    localPath: string;
    sha256: string;
  };
  topics: string[];
  vocabularyTermIds: string[];
  difficulty: "low" | "medium" | "high";
  flags: {
    hasImage: boolean;
    hasNegationOrException: boolean;
  };
  status: "needs_review";
};

export type Translation = {
  questionId: string;
  questionTextRu: string;
  answerTranslations: Record<string, string>;
  disclaimer: string;
};

export type Explanation = {
  questionId: string;
  textRu: string;
  explanationType: string;
  relatedSourceIds: string[];
  disclaimer: string;
};

export type ProgressAnswer = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  answeredAt: string;
  mode: "learning" | "exam" | "mistakes";
};

export const data = {
  contentMode,
  examFormat,
  sources,
  questions: questions as Question[],
  translations: translations as Translation[],
  explanations: explanations as Explanation[],
  vocabulary,
  guide
};

export const translationByQuestion = new Map(data.translations.map((item) => [item.questionId, item]));
export const explanationByQuestion = new Map(data.explanations.map((item) => [item.questionId, item]));
export const sourceById = new Map(data.sources.map((source) => [source.id, source]));

export function assetUrl(localPath: string) {
  return `/${localPath}`;
}
