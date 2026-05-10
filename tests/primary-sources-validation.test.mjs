import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { validatePrimarySources } from "../scripts/primary-sources-validation.mjs";

const doc1Text = "# Doc One\nArticulo 1\nTexto oficial uno.";
const doc2Text = "# Doc Two\nArticulo 1\nTexto oficial dos.";
const doc1SpanText = doc1Text;
const doc2SpanText = "# Doc Two\nArticulo 1";
const doc1TailText = "Texto oficial uno.";
const doc2TailText = "Texto oficial dos.";
const doc1Hash = sha256(doc1Text);
const doc2Hash = sha256(doc2Text);
const doc1SpanHash = sha256(doc1SpanText);
const doc2SpanHash = sha256(doc2SpanText);
const doc1TailHash = sha256(doc1TailText);
const doc2TailHash = sha256(doc2TailText);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function clone(value) {
  return structuredClone(value);
}

function manifest({ includeDoc2 = false } = {}) {
  return {
    version: 1,
    entries: [
      {
        id: "doc-1",
        title: "Doc One",
        officialSourceType: "law",
        sourceUrl: "https://example.test/doc-1",
        retrievalDate: "2026-05-10",
        localPath: "content/official-documents/documents/doc-1.md",
        hash: doc1Hash,
        currentness: { status: "current", validationStatus: "passed" },
        exactTextValidation: { status: "passed" }
      },
      ...(includeDoc2
        ? [
            {
              id: "doc-2",
              title: "Doc Two",
              officialSourceType: "law",
              sourceUrl: "https://example.test/doc-2",
              retrievalDate: "2026-05-10",
              localPath: "content/official-documents/documents/doc-2.md",
              hash: doc2Hash,
              currentness: { status: "current", validationStatus: "passed" },
              exactTextValidation: { status: "passed" }
            }
          ]
        : [])
    ]
  };
}

function corpus() {
  return {
    version: 1,
    schema: "primary-sources-learner-corpus.v1",
    status: "draft",
    locale: "ru",
    sectionPath: "content/primary-sources",
    documents: [
      {
        officialDocumentId: "doc-1",
        title: "Doc One",
        shortTitleRu: "Документ 1",
        category: "traffic-law",
        jurisdiction: "national",
        officialSourceType: "law",
        archiveLocalPath: "content/official-documents/documents/doc-1.md",
        chunks: [
          {
            chunkId: "doc-1--001",
            officialDocumentId: "doc-1",
            order: 1,
            headingPath: ["Doc One"],
            originalSpanish: doc1SpanText,
            fullTranslationRu: "Полный русский перевод официального фрагмента.",
            simpleRu: "Простое русское объяснение этого фрагмента.",
            sourceFingerprint: `sha256:${doc1SpanHash}`
          },
          {
            chunkId: "doc-1--002",
            officialDocumentId: "doc-1",
            order: 2,
            headingPath: ["Doc One"],
            originalSpanish: doc1TailText,
            fullTranslationRu: "Полный русский перевод заключительной строки.",
            simpleRu: "Простое русское объяснение заключительной строки.",
            sourceFingerprint: `sha256:${doc1TailHash}`
          }
        ]
      }
    ]
  };
}

function coverage() {
  return {
    version: 1,
    schema: "primary-sources-coverage.v1",
    status: "draft",
    documents: [
      {
        officialDocumentId: "doc-1",
        archiveLocalPath: "content/official-documents/documents/doc-1.md",
        archiveSha256: doc1Hash,
        expectedChunkIds: ["doc-1--001", "doc-1--002"],
        chunks: [
          {
            chunkId: "doc-1--001",
            officialDocumentId: "doc-1",
            order: 1,
            headingPath: ["Doc One"],
            sourceSpan: { startLine: 1, endLine: 3 },
            sourceTextSha256: doc1SpanHash,
            sourceFingerprint: `sha256:${doc1SpanHash}`
          },
          {
            chunkId: "doc-1--002",
            officialDocumentId: "doc-1",
            order: 2,
            headingPath: ["Doc One"],
            sourceSpan: { startLine: 3, endLine: 3 },
            sourceTextSha256: doc1TailHash,
            sourceFingerprint: `sha256:${doc1TailHash}`
          }
        ]
      }
    ]
  };
}

function qa({ status = "approved" } = {}) {
  return {
    version: 1,
    schema: "primary-sources-qa.v1",
    status: "draft",
    documents: [
      {
        officialDocumentId: "doc-1",
        chunks: [
          {
            chunkId: "doc-1--001",
            translationQa: {
              status,
              checkedAt: "2026-05-10",
              methodNotes: "Reviewed against the official Spanish source."
            },
            simplificationQa: {
              status,
              checkedAt: "2026-05-10",
              methodNotes: "Reviewed for faithful simple wording."
            }
          },
          {
            chunkId: "doc-1--002",
            translationQa: {
              status,
              checkedAt: "2026-05-10",
              methodNotes: "Reviewed against the official Spanish source."
            },
            simplificationQa: {
              status,
              checkedAt: "2026-05-10",
              methodNotes: "Reviewed for faithful simple wording."
            }
          }
        ]
      }
    ]
  };
}

function searchIndex() {
  return {
    version: 1,
    schema: "primary-sources-search.v1",
    status: "draft",
    entries: [
      {
        entryId: "doc-1--001",
        officialDocumentId: "doc-1",
        chunkId: "doc-1--001",
        textFields: ["title", "fullTranslationRu", "simpleRu", "originalSpanish"]
      },
      {
        entryId: "doc-1--002",
        officialDocumentId: "doc-1",
        chunkId: "doc-1--002",
        textFields: ["title", "fullTranslationRu", "simpleRu", "originalSpanish"]
      }
    ]
  };
}

function validate(overrides = {}) {
  return validatePrimarySources({
    manifest: overrides.manifest ?? manifest(),
    corpus: overrides.corpus ?? corpus(),
    coverage: overrides.coverage ?? coverage(),
    qa: overrides.qa ?? qa(),
    searchIndex: overrides.searchIndex ?? searchIndex(),
    mode: overrides.mode ?? "strict",
    archiveFiles: {
      "content/official-documents/documents/doc-1.md": doc1Text,
      "content/official-documents/documents/doc-2.md": doc2Text,
      ...(overrides.archiveFiles || {})
    },
    learnerContentPaths: overrides.learnerContentPaths ?? ["content/primary-sources/primary-sources.ru.json"]
  });
}

test("current repository draft primary-source corpus passes draft validation", () => {
  assert.deepEqual(
    validatePrimarySources({
      manifest: JSON.parse(readFileSync("content/official-documents/manifest.json", "utf8")),
      corpus: JSON.parse(readFileSync("content/primary-sources/primary-sources.ru.json", "utf8")),
      coverage: JSON.parse(readFileSync("content/primary-sources/primary-sources.coverage.json", "utf8")),
      qa: JSON.parse(readFileSync("content/primary-sources/primary-sources.qa.json", "utf8")),
      searchIndex: JSON.parse(readFileSync("content/primary-sources/primary-sources.search.json", "utf8")),
      mode: "draft"
    }),
    []
  );
});

test("valid strict primary-source fixture passes", () => {
  assert.deepEqual(validate(), []);
});

test("strict mode rejects learner chunks missing search projection entries", () => {
  const badSearchIndex = searchIndex();
  badSearchIndex.entries = [];

  const errors = validate({ searchIndex: badSearchIndex });

  assert(errors.includes("doc-1--001: learner chunk is missing search projection entry in strict mode."));
});

test("strict mode rejects missing manifest document coverage", () => {
  const errors = validate({ manifest: manifest({ includeDoc2: true }) });

  assert(errors.includes("doc-2: missing learner document coverage in strict mode."));
  assert(errors.includes("doc-2: missing generated chunk coverage in strict mode."));
});

test("rejects learner chunks missing generated chunk coverage", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].chunks = [];

  const errors = validate({ coverage: badCoverage, mode: "draft" });

  assert(errors.includes("doc-1: expected chunk doc-1--001 is missing from coverage chunks."));
  assert(errors.includes("doc-1--001: learner chunk is missing generated chunk coverage."));
});

test("strict mode rejects coverage documents without generated chunks or expected chunk IDs", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].expectedChunkIds = [];
  badCoverage.documents[0].chunks = [];

  const errors = validate({ coverage: badCoverage });

  assert(errors.includes("doc-1.expectedChunkIds must include at least one expected chunk ID in strict mode."));
  assert(errors.includes("doc-1.chunks must include at least one generated coverage chunk in strict mode."));
});

test("rejects generated coverage chunks missing from expectedChunkIds", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].chunks.push({
    chunkId: "doc-1--extra",
    officialDocumentId: "doc-1",
    order: 3,
    headingPath: ["Doc One"],
    sourceSpan: { startLine: 3, endLine: 3 },
    sourceTextSha256: doc1TailHash,
    sourceFingerprint: `sha256:${doc1TailHash}`
  });

  const errors = validate({ coverage: badCoverage, mode: "draft" });

  assert(errors.includes("doc-1: generated coverage chunk doc-1--extra is missing from expectedChunkIds."));
});

test("coverage mode validates complete chunk inventory without full learner coverage", () => {
  const coverageOnly = coverage();
  coverageOnly.documents.push({
    officialDocumentId: "doc-2",
    archiveLocalPath: "content/official-documents/documents/doc-2.md",
    archiveSha256: doc2Hash,
    expectedChunkIds: ["doc-2--001", "doc-2--002"],
    chunks: [
      {
        chunkId: "doc-2--001",
        officialDocumentId: "doc-2",
        order: 1,
        headingPath: ["Doc Two"],
        sourceSpan: { startLine: 1, endLine: 2 },
        sourceTextSha256: doc2SpanHash,
        sourceFingerprint: `sha256:${doc2SpanHash}`
      },
      {
        chunkId: "doc-2--002",
        officialDocumentId: "doc-2",
        order: 2,
        headingPath: ["Doc Two"],
        sourceSpan: { startLine: 3, endLine: 3 },
        sourceTextSha256: doc2TailHash,
        sourceFingerprint: `sha256:${doc2TailHash}`
      }
    ]
  });

  assert.deepEqual(
    validate({
      manifest: manifest({ includeDoc2: true }),
      coverage: coverageOnly,
      mode: "coverage"
    }),
    []
  );
});

test("coverage mode rejects missing manifest chunk inventory", () => {
  const errors = validate({
    manifest: manifest({ includeDoc2: true }),
    mode: "coverage"
  });

  assert(errors.includes("doc-2: missing generated chunk coverage in coverage mode."));
});

test("coverage mode rejects source spans that miss archive tail lines", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].expectedChunkIds = ["doc-1--001"];
  badCoverage.documents[0].chunks = [badCoverage.documents[0].chunks[0]];

  const errors = validate({ coverage: badCoverage, mode: "coverage" });

  assert(errors.includes("doc-1: sourceSpan coverage must include all archive lines; covered through line 2 of 3."));
});

test("coverage mode rejects source span gaps", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].chunks[0].sourceSpan = { startLine: 1, endLine: 1 };
  badCoverage.documents[0].chunks[0].sourceTextSha256 = sha256("# Doc One");
  badCoverage.documents[0].chunks[0].sourceFingerprint = `sha256:${sha256("# Doc One")}`;

  const errors = validate({ coverage: badCoverage, mode: "coverage" });

  assert(
    errors.includes(
      "doc-1: sourceSpan coverage must be contiguous; expected line 2 but doc-1--002 starts at line 3."
    )
  );
});

test("strict mode rejects learner corpus documents without learner chunks", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks = [];

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1.chunks must include at least one learner chunk in strict mode."));
});

test("strict mode rejects sourceSpans that do not cover the full archive", () => {
  const partialSpanText = "# Doc One\nArticulo 1";
  const partialSpanHash = sha256(partialSpanText);
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].originalSpanish = partialSpanText;
  badCorpus.documents[0].chunks[0].sourceFingerprint = `sha256:${partialSpanHash}`;
  const badCoverage = coverage();
  badCoverage.documents[0].chunks[0].sourceSpan = { startLine: 1, endLine: 2 };
  badCoverage.documents[0].chunks[0].sourceTextSha256 = partialSpanHash;
  badCoverage.documents[0].chunks[0].sourceFingerprint = `sha256:${partialSpanHash}`;

  const errors = validate({ corpus: badCorpus, coverage: badCoverage });

  assert(errors.includes("doc-1: sourceSpan coverage must include all archive lines; covered through line 2 of 3."));
});

test("strict mode rejects non-contiguous sourceSpans", () => {
  const shiftedSpanText = "Articulo 1\nTexto oficial uno.";
  const shiftedSpanHash = sha256(shiftedSpanText);
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].originalSpanish = shiftedSpanText;
  badCorpus.documents[0].chunks[0].sourceFingerprint = `sha256:${shiftedSpanHash}`;
  const badCoverage = coverage();
  badCoverage.documents[0].chunks[0].sourceSpan = { startLine: 2, endLine: 3 };
  badCoverage.documents[0].chunks[0].sourceTextSha256 = shiftedSpanHash;
  badCoverage.documents[0].chunks[0].sourceFingerprint = `sha256:${shiftedSpanHash}`;

  const errors = validate({ corpus: badCorpus, coverage: badCoverage });

  assert(
    errors.includes(
      "doc-1: sourceSpan coverage must be contiguous; expected line 1 but doc-1--001 starts at line 2."
    )
  );
});

test("strict mode rejects missing full Russian translation", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].fullTranslationRu = "";

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1--001.fullTranslationRu must be a non-empty string in strict mode."));
});

test("strict mode rejects missing simple Russian rewrite", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].simpleRu = "";

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1--001.simpleRu must be a non-empty string in strict mode."));
});

test("strict mode rejects Russian placeholder learner text", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].fullTranslationRu = "Черновой подготовительный перевод будет заменен позже.";
  badCorpus.documents[0].chunks[0].simpleRu = "Это заглушка для будущего простого текста.";

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1--001.fullTranslationRu must not be placeholder or draft text in strict mode."));
  assert(errors.includes("doc-1--001.simpleRu must not be placeholder or draft text in strict mode."));
});

test("strict mode rejects English placeholder learner text", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].fullTranslationRu = "TODO translate this source chunk.";
  badCorpus.documents[0].chunks[0].simpleRu = "draft placeholder for the simple rewrite.";

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1--001.fullTranslationRu must not be placeholder or draft text in strict mode."));
  assert(errors.includes("doc-1--001.simpleRu must not be placeholder or draft text in strict mode."));
});

test("strict mode rejects non-approved translation and simplification QA", () => {
  const errors = validate({ qa: qa({ status: "reviewed" }) });

  assert(errors.includes("doc-1--001.translationQa.status must be approved in strict mode."));
  assert(errors.includes("doc-1--001.simplificationQa.status must be approved in strict mode."));
});

test("strict mode rejects approved QA without checkedAt", () => {
  const badQa = qa();
  delete badQa.documents[0].chunks[0].translationQa.checkedAt;
  delete badQa.documents[0].chunks[0].simplificationQa.checkedAt;

  const errors = validate({ qa: badQa });

  assert(
    errors.includes(
      "doc-1--001.translationQa.checkedAt must be YYYY-MM-DD when QA is reviewed, approved, or running strict mode."
    )
  );
  assert(
    errors.includes(
      "doc-1--001.simplificationQa.checkedAt must be YYYY-MM-DD when QA is reviewed, approved, or running strict mode."
    )
  );
});

test("rejects learner Russian content paths under official-documents", () => {
  const errors = validate({
    mode: "draft",
    learnerContentPaths: ["content/official-documents/primary-sources.ru.json"]
  });

  assert(
    errors.includes(
      "content/official-documents/primary-sources.ru.json must not store learner Russian content under content/official-documents."
    )
  );
});

test("rejects forbidden simplified Spanish fields", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].simplifiedSpanish = "Texto facil en espanol.";
  const badSearchIndex = searchIndex();
  badSearchIndex.entries[0].textFields.push("simplifiedSpanish");

  const errors = validate({ corpus: badCorpus, searchIndex: badSearchIndex, mode: "draft" });

  assert(
    errors.includes(
      "primary sources corpus.documents[0].chunks[0].simplifiedSpanish is forbidden; simplified Spanish is out of scope."
    )
  );
  assert(
    errors.includes("doc-1--001.textFields must not reference simplifiedSpanish; simplified Spanish is out of scope.")
  );
});

test("rejects simplified Spanish variant keys in learner data and search projections", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].simplifiedSpanishText = "Texto facil en espanol.";
  const badSearchIndex = searchIndex();
  badSearchIndex.entries[0].textFields.push("learnerSimplifiedSpanishText");

  const errors = validate({ corpus: badCorpus, searchIndex: badSearchIndex, mode: "draft" });

  assert(
    errors.includes(
      "primary sources corpus.documents[0].chunks[0].simplifiedSpanishText is forbidden; simplified Spanish is out of scope."
    )
  );
  assert(
    errors.includes(
      "doc-1--001.textFields must not reference learnerSimplifiedSpanishText; simplified Spanish is out of scope."
    )
  );
});

test("rejects stale source fingerprints against archive Markdown", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].chunks[0].sourceTextSha256 = "f".repeat(64);
  badCoverage.documents[0].chunks[0].sourceFingerprint = `sha256:${"f".repeat(64)}`;

  const errors = validate({ coverage: badCoverage, mode: "draft" });

  assert(errors.includes("doc-1--001.sourceTextSha256 must match current archive Markdown span."));
});

test("rejects missing archive mappings", () => {
  const badCoverage = coverage();
  badCoverage.documents[0].archiveLocalPath = "content/official-documents/documents/missing.md";

  const errors = validate({ coverage: badCoverage, mode: "draft", archiveFiles: {} });

  assert(errors.includes("doc-1.archiveLocalPath must match official manifest localPath."));
  assert(errors.includes("doc-1.archiveLocalPath is missing from archive files."));
});

test("rejects orphan learner documents, QA chunks, and search entries", () => {
  const badCorpus = clone(corpus());
  badCorpus.documents.push({
    officialDocumentId: "orphan-doc",
    title: "Orphan",
    shortTitleRu: "Лишний",
    category: "extra",
    jurisdiction: "national",
    officialSourceType: "law",
    archiveLocalPath: "content/official-documents/documents/orphan.md",
    chunks: []
  });
  const badQa = clone(qa());
  badQa.documents[0].chunks.push({
    chunkId: "orphan-chunk",
    translationQa: { status: "draft", methodNotes: "No corpus chunk." },
    simplificationQa: { status: "draft", methodNotes: "No corpus chunk." }
  });
  const badSearchIndex = clone(searchIndex());
  badSearchIndex.entries.push({
    entryId: "orphan-entry",
    officialDocumentId: "doc-1",
    chunkId: "orphan-chunk",
    textFields: ["title"]
  });

  const errors = validate({ corpus: badCorpus, qa: badQa, searchIndex: badSearchIndex, mode: "draft" });

  assert(errors.includes("orphan-doc: learner document is not present in official manifest."));
  assert(errors.includes("orphan-doc: learner document is missing generated chunk coverage."));
  assert(errors.includes("orphan-chunk: QA chunk has no learner corpus chunk."));
  assert(errors.includes("orphan-entry: search entry references missing learner chunk orphan-chunk."));
});
