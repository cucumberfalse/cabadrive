import runtimeProjection from "../../content/manual-ticket-placement/manual-ticket-placement.runtime.json";

export type ManualTicketRuntimeRecord = {
  questionId: string;
  pageIds: string[];
};

const records = runtimeProjection.records as ManualTicketRuntimeRecord[];

export const manualTicketQuestionIdsByPage = new Map<string, string[]>();

for (const record of records) {
  for (const pageId of record.pageIds) {
    const questionIds = manualTicketQuestionIdsByPage.get(pageId) ?? [];
    questionIds.push(record.questionId);
    manualTicketQuestionIdsByPage.set(pageId, questionIds);
  }
}

for (const questionIds of manualTicketQuestionIdsByPage.values()) {
  questionIds.sort((left, right) => left.localeCompare(right));
}
