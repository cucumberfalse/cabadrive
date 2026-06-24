import shard001092 from "../../content/manual-ticket-placement/placements/001-092.json";
import shard093184 from "../../content/manual-ticket-placement/placements/093-184.json";
import shard185276 from "../../content/manual-ticket-placement/placements/185-276.json";
import shard277368 from "../../content/manual-ticket-placement/placements/277-368.json";
import shard369460 from "../../content/manual-ticket-placement/placements/369-460.json";

export type ManualTicketPlacementBasis = "answer-bearing" | "owner-approved-thematic-fallback";

export type ManualTicketPlacement = {
  pageId: string;
  routeHash: string;
  placementBasis: ManualTicketPlacementBasis;
};

export type ManualTicketPlacementRecord = {
  questionId: string;
  placements: ManualTicketPlacement[];
};

const shards = [shard001092, shard093184, shard185276, shard277368, shard369460] as {
  entries: ManualTicketPlacementRecord[];
}[];

export const manualTicketPlacementRecords = shards
  .flatMap((shard) => shard.entries)
  .sort((left, right) => left.questionId.localeCompare(right.questionId));

export const manualTicketQuestionIdsByPage = new Map<string, string[]>();

for (const record of manualTicketPlacementRecords) {
  for (const placement of record.placements) {
    const questionIds = manualTicketQuestionIdsByPage.get(placement.pageId) ?? [];
    questionIds.push(record.questionId);
    manualTicketQuestionIdsByPage.set(placement.pageId, questionIds);
  }
}

for (const questionIds of manualTicketQuestionIdsByPage.values()) {
  questionIds.sort((left, right) => left.localeCompare(right));
}
