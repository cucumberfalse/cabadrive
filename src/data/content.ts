import contentMode from "../../content/meta/content-mode.json";
import examFormat from "../../content/config/caba-exam-format.json";
import sources from "../../content/sources/sources.json";
import questions from "../../content/questions/caba-b.unofficial-fallback.questions.json";
import translations from "../../content/translations/ru.translations.json";
import explanations from "../../content/explanations/ru.explanations.json";
import vocabulary from "../../content/vocabulary/ru.vocabulary.json";
import guide from "../../content/guide/ru.condensed-guide.json";
import cabaExamProcessGuideJson from "../../content/guide/caba-exam-process.ru.json";
import topicStudyGuideJson from "../../content/guide/topic-study-guide.ru.json";

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

export type TopicGuideStatus = "draft" | "published";
export type TopicGuideContentStatus = "unofficial_learning_aid";

export type TopicGuideAnswerExplanation = {
  answerId: string;
  verdict: "correct" | "incorrect";
  explanationRu: string;
};

export type TopicGuideTicket = {
  questionId: string;
  answerExplanations: TopicGuideAnswerExplanation[];
  imageLocalPath?: string;
  sourceConflictNoteRu?: string;
};

export type TopicGuideTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  sourceQuestionIds: string[];
};

export type TopicGuideTrapNote = {
  id?: string;
  textRu: string;
  sourceQuestionIds?: string[];
};

export type TopicGuideTopic = {
  id: string;
  slug: string;
  status: TopicGuideStatus;
  titleRu: string;
  summaryRu: string;
  learningMaterialRu: string[];
  practicalReasoningRu?: string[];
  spanishTerms: TopicGuideTerm[];
  tickets: TopicGuideTicket[];
  trapNotes?: TopicGuideTrapNote[];
};

export type TopicStudyGuide = {
  version: number;
  id: string;
  locale: "ru";
  status: TopicGuideStatus;
  contentStatus: TopicGuideContentStatus;
  titleRu: string;
  disclaimer: string;
  topics: TopicGuideTopic[];
};

export type ProcessGuideSource = {
  id: string;
  title: string;
  url: string;
  checkedAt: string;
  officialOwner: "GCBA" | "ANSV" | "Gobierno Argentino";
  currentnessStatus: "checked_current" | "checked_current_with_historico_url" | "volatile_check_required";
  resultRu: string;
};

export type ProcessGuideSection = {
  id: string;
  titleRu: string;
  summaryRu?: string;
  bodyRu: string[];
  spanishTerms?: string[];
  sourceIds: string[];
  calloutType: "required_step" | "optional_preparation" | "adjacent_path" | "warning";
  volatility?: "stable_procedure" | "volatile_fee" | "volatile_location" | "volatile_screen" | "volatile_document_list";
  volatilityWarningRu?: string;
};

export type ProcessGuideOfficialLink = {
  sourceId: string;
  labelRu: string;
  url: string;
};

export type ProcessGuideOfficialLinkGroup = {
  id: string;
  titleRu: string;
  links: ProcessGuideOfficialLink[];
};

export type ProcessGuideGlossaryTerm = {
  id: string;
  termEs: string;
  translationRu: string;
  explanationRu: string;
  sourceIds: string[];
};

export type CabaExamProcessGuide = {
  version: number;
  id: "caba-exam-process";
  locale: "ru";
  status: "draft" | "published";
  contentStatus: "unofficial_learning_aid";
  titleRu: string;
  primaryScope: {
    jurisdiction: "CABA";
    procedure: "otorgamiento";
    category: "B1";
    audienceRu: string;
  };
  lastReviewedAt: string;
  disclaimerRu: string;
  officialActionWarningRu: string;
  volatilityWarningRu: string;
  communityContextRu: string;
  sources: ProcessGuideSource[];
  sections: ProcessGuideSection[];
  officialLinks: ProcessGuideOfficialLinkGroup[];
  glossary: ProcessGuideGlossaryTerm[];
  optionalImages: never[];
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
  guide,
  cabaExamProcessGuide: cabaExamProcessGuideJson as CabaExamProcessGuide,
  topicStudyGuide: topicStudyGuideJson as TopicStudyGuide
};

export const translationByQuestion = new Map(data.translations.map((item) => [item.questionId, item]));
export const explanationByQuestion = new Map(data.explanations.map((item) => [item.questionId, item]));
export const sourceById = new Map(data.sources.map((source) => [source.id, source]));
export const questionById = new Map(data.questions.map((question) => [question.id, question]));

export function assetUrl(localPath: string) {
  return `/${localPath}`;
}
