import { data, explanationByQuestion, translationByQuestion, type Question } from "./data/content";

function haystackFor(question: Question) {
  const translation = translationByQuestion.get(question.id);
  const explanation = explanationByQuestion.get(question.id);
  return [
    question.id,
    question.officialTextEs,
    question.answers.map((answer) => answer.officialTextEs).join(" "),
    question.topics.join(" "),
    translation?.questionTextRu,
    translation ? Object.values(translation.answerTranslations).join(" ") : "",
    explanation?.textRu
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function searchQuestions(query: string, questions = data.questions) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return questions.slice(0, 25);
  const terms = normalized.split(/\s+/);
  return questions.filter((question) => {
    const haystack = haystackFor(question);
    return terms.every((term) => haystack.includes(term));
  });
}

export function searchVocabulary(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return data.vocabulary;
  return data.vocabulary.filter((term) =>
    [term.termEs, term.translationRu, term.category, term.explanationRu].join(" ").toLowerCase().includes(normalized)
  );
}
