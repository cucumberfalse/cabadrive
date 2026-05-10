import contentMode from "../../content/meta/content-mode.json";
import examFormat from "../../content/config/caba-exam-format.json";
import sources from "../../content/sources/sources.json";
import questions from "../../content/questions/caba-b.unofficial-fallback.questions.json";
import vocabulary from "../../content/vocabulary/ru.vocabulary.json";
import guide from "../../content/guide/ru.condensed-guide.json";
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

export type Translation = {
  questionId: string;
  questionTextRu: string;
  answerTranslations: Record<string, string>;
  disclaimer: string;
};

export type Explanation = {
  questionId: string;
  textRu: string;
  correctAnswerId: string;
  correctAnswerExplanationRu: string;
  wrongAnswerExplanations: Record<string, string>;
  explanationType: string;
  claimScope?: "direct_ticket" | "direct_image" | "ticket_specific_fallback" | "current_official_source";
  relatedSourceIds: string[];
  imageDetailReferences?: string[];
  disclaimer: string;
};

export type ProgressAnswer = {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  answeredAt: string;
  mode: "learning" | "exam" | "mistakes";
};

type ContentShard<T> = {
  range: {
    id: string;
    start: number;
    end: number;
  };
  entries: T[];
};

function collectShardEntries<T>(modules: Record<string, unknown>, label: string): T[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const shard = (module as { default: ContentShard<T> }).default;
      if (!shard?.range || !Array.isArray(shard.entries)) {
        throw new Error(`${label} shard ${path} is malformed.`);
      }
      return { path, shard };
    })
    .sort((a, b) => a.shard.range.start - b.shard.range.start || a.path.localeCompare(b.path))
    .flatMap(({ shard }) => shard.entries);
}

const translations = collectShardEntries<Translation>(
  import.meta.glob("../../content/translations/ru/*.json", { eager: true }),
  "Russian translation"
);
const explanations = collectShardEntries<Explanation>(
  import.meta.glob("../../content/explanations/ru/*.json", { eager: true }),
  "Russian explanation"
);

export const data = {
  contentMode,
  examFormat,
  sources,
  questions: questions as Question[],
  translations: translations as Translation[],
  explanations: explanations as Explanation[],
  vocabulary,
  guide,
  topicStudyGuide: topicStudyGuideJson as TopicStudyGuide
};

export const translationByQuestion = new Map(data.translations.map((item) => [item.questionId, item]));
export const explanationByQuestion = new Map(data.explanations.map((item) => [item.questionId, item]));
export const sourceById = new Map(data.sources.map((source) => [source.id, source]));
export const questionById = new Map(data.questions.map((question) => [question.id, question]));

export function assetUrl(localPath: string) {
  return `/${localPath}`;
}
