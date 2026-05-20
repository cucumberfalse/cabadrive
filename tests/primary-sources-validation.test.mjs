import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import {
  combinePrimarySourceShards,
  validatePrimarySources,
  validatePrimarySourcesFromFiles
} from "../scripts/primary-sources-validation.mjs";

const doc1Text = "# Doc One\nArticulo 1\nTexto oficial uno.";
const doc2Text = "# Doc Two\nArticulo 1\nTexto oficial dos.";
const doc1SpanText = "# Doc One\nArticulo 1";
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
    status: "published",
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
    status: "published",
    contentStatus: "unofficial_learning_aid",
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
        currentnessStatus: "current",
        currentnessValidationStatus: "passed",
        exactTextValidationStatus: "passed",
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
    status: "published",
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
            sourceSpan: { startLine: 1, endLine: 2 },
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
    status: "published",
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
    status: "published",
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

test("current repository primary-source corpus passes strict published validation", () => {
  assert.deepEqual(validatePrimarySourcesFromFiles({ mode: "strict" }), []);
});

test("primary-source shard directory loading combines document, QA, and search shards", () => {
  const corpusRoot = { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] };
  const qaRoot = { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] };
  const searchRoot = { ...searchIndex(), entries: [], searchShardDirectories: ["content/primary-sources/search"] };
  const combined = combinePrimarySourceShards({
    corpus: corpusRoot,
    qa: qaRoot,
    searchIndex: searchRoot,
    shardFiles: {
      "content/primary-sources/documents/doc-1.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: corpus().documents[0]
      },
      "content/primary-sources/qa/doc-1.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: qa().documents[0]
      },
      "content/primary-sources/search/doc-1.search.json": {
        version: 1,
        schema: "primary-sources-search-shard.v1",
        entries: searchIndex().entries
      },
      "content/primary-sources/search/doc-1.ignored.json": {
        version: 1,
        schema: "ignored"
      }
    }
  });

  assert.deepEqual(combined.errors, []);
  assert.equal(combined.corpus.documents.length, 1);
  assert.equal(combined.qa.documents.length, 1);
  assert.equal(combined.searchIndex.entries.length, 2);
  assert.deepEqual(
    validate({
      corpus: combined.corpus,
      qa: combined.qa,
      searchIndex: combined.searchIndex,
      learnerContentPaths: combined.learnerContentPaths
    }),
    []
  );
});

test("document range shards with the same officialDocumentId recombine and pass", () => {
  const [firstChunk, secondChunk] = corpus().documents[0].chunks;
  const baseDocument = { ...corpus().documents[0], chunks: [] };
  const combined = combinePrimarySourceShards({
    corpus: { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] },
    qa: qa(),
    searchIndex: searchIndex(),
    shardFiles: {
      "content/primary-sources/documents/doc-1--001-001.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, chunks: [firstChunk] }
      },
      "content/primary-sources/documents/doc-1--002-002.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, chunks: [secondChunk] }
      }
    }
  });

  assert.deepEqual(combined.errors, []);
  assert.equal(combined.corpus.documents.length, 1);
  assert.deepEqual(
    combined.corpus.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.deepEqual(validate({ corpus: combined.corpus, learnerContentPaths: combined.learnerContentPaths }), []);
});

test("rejects duplicate root corpus documents before range-shard recomposition", () => {
  const [firstChunk, secondChunk] = corpus().documents[0].chunks;
  const baseDocument = { ...corpus().documents[0], chunks: [] };
  const errors = validate({
    corpus: {
      ...corpus(),
      documents: [
        { ...baseDocument, chunks: [firstChunk] },
        { ...baseDocument, chunks: [secondChunk] }
      ]
    }
  });

  assert(errors.includes("doc-1: duplicate primary sources corpus document."));
});

test("shard combining reports duplicate root corpus documents before range-shard recomposition", () => {
  const [firstChunk, secondChunk] = corpus().documents[0].chunks;
  const baseDocument = { ...corpus().documents[0], chunks: [] };
  const combined = combinePrimarySourceShards({
    corpus: {
      ...corpus(),
      documents: [
        { ...baseDocument, chunks: [firstChunk] },
        { ...baseDocument, chunks: [secondChunk] }
      ]
    },
    qa: qa(),
    searchIndex: searchIndex()
  });

  assert(combined.errors.includes("doc-1: duplicate primary sources corpus document."));
});

test("document range shards with mismatched metadata fail recomposition", () => {
  const [firstChunk, secondChunk] = corpus().documents[0].chunks;
  const baseDocument = { ...corpus().documents[0], chunks: [] };
  const combined = combinePrimarySourceShards({
    corpus: { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] },
    qa: qa(),
    searchIndex: searchIndex(),
    shardFiles: {
      "content/primary-sources/documents/doc-1--001-001.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, chunks: [firstChunk] }
      },
      "content/primary-sources/documents/doc-1--002-002.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, shortTitleRu: "Другой заголовок", chunks: [secondChunk] }
      }
    }
  });

  assert(
    combined.errors.includes(
      "doc-1: primary sources corpus document metadata field shortTitleRu must match across range shards."
    )
  );
});

test("document range shards with duplicate chunks fail recomposition", () => {
  const [firstChunk] = corpus().documents[0].chunks;
  const baseDocument = { ...corpus().documents[0], chunks: [] };
  const combined = combinePrimarySourceShards({
    corpus: { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] },
    qa: qa(),
    searchIndex: searchIndex(),
    shardFiles: {
      "content/primary-sources/documents/doc-1--001-a.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, chunks: [firstChunk] }
      },
      "content/primary-sources/documents/doc-1--001-b.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: { ...baseDocument, chunks: [firstChunk] }
      }
    }
  });

  assert(
    combined.errors.includes("doc-1--001: duplicate primary sources corpus chunk across range shards for doc-1.")
  );
});

test("QA range shards with the same officialDocumentId recombine and pass", () => {
  const [firstQaChunk, secondQaChunk] = qa().documents[0].chunks;
  const combined = combinePrimarySourceShards({
    corpus: corpus(),
    qa: { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] },
    searchIndex: searchIndex(),
    shardFiles: {
      "content/primary-sources/qa/doc-1--001-001.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: { officialDocumentId: "doc-1", chunks: [firstQaChunk] }
      },
      "content/primary-sources/qa/doc-1--002-002.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: { officialDocumentId: "doc-1", chunks: [secondQaChunk] }
      }
    }
  });

  assert.deepEqual(combined.errors, []);
  assert.equal(combined.qa.documents.length, 1);
  assert.deepEqual(
    combined.qa.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.deepEqual(validate({ qa: combined.qa, learnerContentPaths: combined.learnerContentPaths }), []);
});

test("rejects duplicate root QA documents before range-shard recomposition", () => {
  const [firstQaChunk, secondQaChunk] = qa().documents[0].chunks;
  const errors = validate({
    qa: {
      ...qa(),
      documents: [
        { officialDocumentId: "doc-1", chunks: [firstQaChunk] },
        { officialDocumentId: "doc-1", chunks: [secondQaChunk] }
      ]
    }
  });

  assert(errors.includes("doc-1: duplicate primary sources QA document."));
});

test("shard combining reports duplicate root QA documents before range-shard recomposition", () => {
  const [firstQaChunk, secondQaChunk] = qa().documents[0].chunks;
  const combined = combinePrimarySourceShards({
    corpus: corpus(),
    qa: {
      ...qa(),
      documents: [
        { officialDocumentId: "doc-1", chunks: [firstQaChunk] },
        { officialDocumentId: "doc-1", chunks: [secondQaChunk] }
      ]
    },
    searchIndex: searchIndex()
  });

  assert(combined.errors.includes("doc-1: duplicate primary sources QA document."));
});

test("range-shard recomposition does not mutate reusable in-memory shard objects", () => {
  const [firstChunk, secondChunk] = corpus().documents[0].chunks;
  const [firstQaChunk, secondQaChunk] = qa().documents[0].chunks;
  const baseCorpusDocument = { ...corpus().documents[0], chunks: [] };
  const corpusRoot = { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] };
  const qaRoot = { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] };
  const searchRoot = { ...searchIndex(), entries: [], searchShardDirectories: ["content/primary-sources/search"] };
  const firstCorpusShardDocument = { ...baseCorpusDocument, chunks: [firstChunk] };
  const secondCorpusShardDocument = { ...baseCorpusDocument, chunks: [secondChunk] };
  const firstQaShardDocument = { officialDocumentId: "doc-1", chunks: [firstQaChunk] };
  const secondQaShardDocument = { officialDocumentId: "doc-1", chunks: [secondQaChunk] };
  const shardFiles = {
    "content/primary-sources/documents/doc-1--001-001.ru.json": {
      version: 1,
      schema: "primary-sources-document-shard.v1",
      document: firstCorpusShardDocument
    },
    "content/primary-sources/documents/doc-1--002-002.ru.json": {
      version: 1,
      schema: "primary-sources-document-shard.v1",
      document: secondCorpusShardDocument
    },
    "content/primary-sources/qa/doc-1--001-001.qa.json": {
      version: 1,
      schema: "primary-sources-qa-shard.v1",
      document: firstQaShardDocument
    },
    "content/primary-sources/qa/doc-1--002-002.qa.json": {
      version: 1,
      schema: "primary-sources-qa-shard.v1",
      document: secondQaShardDocument
    },
    "content/primary-sources/search/doc-1.search.json": {
      version: 1,
      schema: "primary-sources-search-shard.v1",
      entries: searchIndex().entries
    }
  };

  const firstCombined = combinePrimarySourceShards({ corpus: corpusRoot, qa: qaRoot, searchIndex: searchRoot, shardFiles });
  const secondCombined = combinePrimarySourceShards({ corpus: corpusRoot, qa: qaRoot, searchIndex: searchRoot, shardFiles });

  assert.deepEqual(firstCombined.errors, []);
  assert.deepEqual(secondCombined.errors, []);
  assert.deepEqual(
    firstCombined.corpus.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.deepEqual(
    secondCombined.corpus.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.deepEqual(
    firstCombined.qa.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.deepEqual(
    secondCombined.qa.documents[0].chunks.map((chunk) => chunk.chunkId),
    ["doc-1--001", "doc-1--002"]
  );
  assert.equal(firstCorpusShardDocument.chunks.length, 1);
  assert.equal(secondCorpusShardDocument.chunks.length, 1);
  assert.equal(firstQaShardDocument.chunks.length, 1);
  assert.equal(secondQaShardDocument.chunks.length, 1);
  assert.notEqual(firstCombined.corpus.documents[0], firstCorpusShardDocument);
  assert.notEqual(firstCombined.qa.documents[0], firstQaShardDocument);
  assert.notEqual(firstCombined.corpus.documents[0].chunks, firstCorpusShardDocument.chunks);
  assert.notEqual(firstCombined.qa.documents[0].chunks, firstQaShardDocument.chunks);
});

test("future document shards are discovered without root file list edits", () => {
  const corpusRoot = { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] };
  const qaRoot = { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] };
  const searchRoot = { ...searchIndex(), entries: [], searchShardDirectories: ["content/primary-sources/search"] };
  const doc2 = {
    ...corpus().documents[0],
    officialDocumentId: "doc-2",
    title: "Doc Two",
    archiveLocalPath: "content/official-documents/documents/doc-2.md",
    chunks: [
      {
        ...corpus().documents[0].chunks[0],
        chunkId: "doc-2--001",
        officialDocumentId: "doc-2",
        originalSpanish: doc2Text,
        sourceSpan: { startLine: 1, endLine: 3 },
        sourceFingerprint: `sha256:${doc2Hash}`
      }
    ]
  };
  const doc2Qa = {
    officialDocumentId: "doc-2",
    chunks: [
      {
        chunkId: "doc-2--001",
        translationQa: { status: "approved", checkedAt: "2026-05-09" },
        simplificationQa: { status: "approved", checkedAt: "2026-05-09" }
      }
    ]
  };
  const doc2Search = {
    entryId: "doc-2--001",
    officialDocumentId: "doc-2",
    chunkId: "doc-2--001",
    textFields: ["title", "fullTranslationRu", "simpleRu", "originalSpanish"]
  };

  const combined = combinePrimarySourceShards({
    corpus: corpusRoot,
    qa: qaRoot,
    searchIndex: searchRoot,
    shardFiles: {
      "content/primary-sources/documents/doc-1.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: corpus().documents[0]
      },
      "content/primary-sources/documents/doc-2.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: doc2
      },
      "content/primary-sources/qa/doc-1.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: qa().documents[0]
      },
      "content/primary-sources/qa/doc-2.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: doc2Qa
      },
      "content/primary-sources/search/doc-1.search.json": {
        version: 1,
        schema: "primary-sources-search-shard.v1",
        entries: searchIndex().entries
      },
      "content/primary-sources/search/doc-2.search.json": {
        version: 1,
        schema: "primary-sources-search-shard.v1",
        entries: [doc2Search]
      }
    }
  });

  assert.deepEqual(combined.errors, []);
  assert.deepEqual(
    combined.corpus.documents.map((document) => document.officialDocumentId).sort(),
    ["doc-1", "doc-2"]
  );
  assert.deepEqual(
    combined.learnerContentPaths.filter((path) => path.includes("doc-2")),
    [
      "content/primary-sources/documents/doc-2.ru.json",
      "content/primary-sources/qa/doc-2.qa.json",
      "content/primary-sources/search/doc-2.search.json"
    ]
  );
});

test("primary-source shard loading reports missing referenced shards", () => {
  const combined = combinePrimarySourceShards({
    corpus: { ...corpus(), documents: [], documentShards: ["content/primary-sources/documents/missing.ru.json"] },
    qa: qa(),
    searchIndex: searchIndex(),
    shardFiles: {}
  });

  assert(combined.errors.includes("content/primary-sources/documents/missing.ru.json: shard file is missing."));
});

test("primary-source shard loading rejects non-array root shard fields", () => {
  const combined = combinePrimarySourceShards({
    corpus: {
      ...corpus(),
      documents: [],
      documentShards: "content/primary-sources/documents/doc-1.ru.json",
      documentShardDirectories: { path: "content/primary-sources/documents" }
    },
    qa: {
      ...qa(),
      documents: [],
      qaShards: { path: "content/primary-sources/qa/doc-1.qa.json" },
      qaShardDirectories: "content/primary-sources/qa"
    },
    searchIndex: {
      ...searchIndex(),
      entries: [],
      searchShards: "content/primary-sources/search/doc-1.search.json",
      searchShardDirectories: { path: "content/primary-sources/search" }
    },
    shardFiles: {}
  });

  assert(combined.errors.includes("primary sources corpus.documentShards must be an array."));
  assert(combined.errors.includes("primary sources corpus.documentShardDirectories must be an array."));
  assert(combined.errors.includes("primary sources QA.qaShards must be an array."));
  assert(combined.errors.includes("primary sources QA.qaShardDirectories must be an array."));
  assert(combined.errors.includes("primary sources search index.searchShards must be an array."));
  assert(combined.errors.includes("primary sources search index.searchShardDirectories must be an array."));
});

test("strict mode catches missing QA and search projections after shard combining", () => {
  const corpusRoot = { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] };
  const combined = combinePrimarySourceShards({
    corpus: corpusRoot,
    qa: { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] },
    searchIndex: { ...searchIndex(), entries: [], searchShardDirectories: ["content/primary-sources/search"] },
    shardFiles: {
      "content/primary-sources/documents/doc-1.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: corpus().documents[0]
      }
    }
  });

  const errors = validate({
    corpus: combined.corpus,
    qa: combined.qa,
    searchIndex: combined.searchIndex,
    learnerContentPaths: combined.learnerContentPaths
  });

  assert(errors.includes("doc-1--001: learner chunk is missing QA metadata."));
  assert(errors.includes("doc-1--001: learner chunk is missing search projection entry in strict mode."));
});

test("strict mode catches missing translations after shard combining", () => {
  const shardDocument = corpus().documents[0];
  delete shardDocument.chunks[0].fullTranslationRu;
  delete shardDocument.chunks[0].simpleRu;
  const combined = combinePrimarySourceShards({
    corpus: { ...corpus(), documents: [], documentShardDirectories: ["content/primary-sources/documents"] },
    qa: { ...qa(), documents: [], qaShardDirectories: ["content/primary-sources/qa"] },
    searchIndex: { ...searchIndex(), entries: [], searchShardDirectories: ["content/primary-sources/search"] },
    shardFiles: {
      "content/primary-sources/documents/doc-1.ru.json": {
        version: 1,
        schema: "primary-sources-document-shard.v1",
        document: shardDocument
      },
      "content/primary-sources/qa/doc-1.qa.json": {
        version: 1,
        schema: "primary-sources-qa-shard.v1",
        document: qa().documents[0]
      },
      "content/primary-sources/search/doc-1.search.json": {
        version: 1,
        schema: "primary-sources-search-shard.v1",
        entries: searchIndex().entries
      }
    }
  });

  const errors = validate({
    corpus: combined.corpus,
    qa: combined.qa,
    searchIndex: combined.searchIndex,
    learnerContentPaths: combined.learnerContentPaths
  });

  assert(errors.includes("doc-1--001.fullTranslationRu must be a non-empty string in strict mode."));
  assert(errors.includes("doc-1--001.simpleRu must be a non-empty string in strict mode."));
});

test("valid strict primary-source fixture passes", () => {
  assert.deepEqual(validate(), []);
});

test("strict mode rejects pending exact-text source validation", () => {
  const badManifest = manifest();
  badManifest.entries[0].exactTextValidation.status = "pending";

  const errors = validate({ manifest: badManifest });

  assert(
    errors.includes(
      "doc-1.exactTextValidation.status must be passed for strict primary-source validation."
    )
  );
});

test("strict mode rejects draft primary-source release roots", () => {
  const badManifest = manifest();
  badManifest.status = "draft";
  const badCorpus = corpus();
  badCorpus.status = "draft";
  badCorpus.contentStatus = "draft_placeholder";
  const badCoverage = coverage();
  badCoverage.status = "draft";
  const badQa = qa();
  badQa.status = "draft";
  const badSearchIndex = searchIndex();
  badSearchIndex.status = "draft";

  const errors = validate({
    manifest: badManifest,
    corpus: badCorpus,
    coverage: badCoverage,
    qa: badQa,
    searchIndex: badSearchIndex
  });

  assert(errors.includes("official documents manifest status must be published in strict mode."));
  assert(errors.includes("primary sources corpus status must be published in strict mode."));
  assert(errors.includes("primary sources corpus contentStatus must be unofficial_learning_aid in strict mode."));
  assert(errors.includes("primary sources coverage status must be published in strict mode."));
  assert(errors.includes("primary sources QA status must be published in strict mode."));
  assert(errors.includes("primary sources search index status must be published in strict mode."));
});

test("strict mode rejects stale learner-document source validation status", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].exactTextValidationStatus = "pending";

  const errors = validate({ corpus: badCorpus });

  assert(
    errors.includes("doc-1.exactTextValidationStatus must match official manifest exactTextValidation.status.")
  );
});

test("strict mode rejects failed currentness validation", () => {
  const badManifest = manifest();
  badManifest.entries[0].currentness.validationStatus = "failed";

  const errors = validate({ manifest: badManifest });

  assert(
    errors.includes(
      "doc-1.currentness.validationStatus must be passed for strict primary-source validation."
    )
  );
});

test("strict mode rejects non-current effective source status", () => {
  const badManifest = manifest();
  badManifest.entries[0].currentness.status = "stale";

  const errors = validate({ manifest: badManifest });

  assert(
    errors.includes("doc-1.currentness.status must be release-ready for strict primary-source validation.")
  );
});

test("strict mode rejects learner chunks missing search projection entries", () => {
  const badSearchIndex = searchIndex();
  badSearchIndex.entries = [];

  const errors = validate({ searchIndex: badSearchIndex });

  assert(errors.includes("doc-1--001: learner chunk is missing search projection entry in strict mode."));
});

test("rejects duplicate search entries and duplicate search chunk references", () => {
  const badSearchIndex = searchIndex();
  badSearchIndex.entries.push({ ...badSearchIndex.entries[0] });

  const errors = validate({ searchIndex: badSearchIndex, mode: "draft" });

  assert(errors.includes("doc-1--001: duplicate primary sources search entry."));
  assert(
    errors.includes("doc-1--001: duplicate primary sources search chunk reference doc-1/doc-1--001.")
  );
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
  badCorpus.documents[0].chunks = [badCorpus.documents[0].chunks[0]];
  badCorpus.documents[0].chunks[0].originalSpanish = partialSpanText;
  badCorpus.documents[0].chunks[0].sourceFingerprint = `sha256:${partialSpanHash}`;
  const badCoverage = coverage();
  badCoverage.documents[0].expectedChunkIds = ["doc-1--001"];
  badCoverage.documents[0].chunks = [badCoverage.documents[0].chunks[0]];
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

test("strict mode rejects standalone English draft markers", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].fullTranslationRu = "DRAFT translation of the source chunk.";
  badCorpus.documents[0].chunks[0].simpleRu = "This is a draft rewrite for later review.";

  const errors = validate({ corpus: badCorpus });

  assert(errors.includes("doc-1--001.fullTranslationRu must not be placeholder or draft text in strict mode."));
  assert(errors.includes("doc-1--001.simpleRu must not be placeholder or draft text in strict mode."));
});

test("strict mode rejects standalone Russian draft markers", () => {
  const badCorpus = corpus();
  badCorpus.documents[0].chunks[0].fullTranslationRu = "Черновой перевод официального фрагмента.";
  badCorpus.documents[0].chunks[0].simpleRu = "Черновик простого объяснения.";

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
