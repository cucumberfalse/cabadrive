import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { validateOfficialDocumentsManifest } from "../scripts/official-documents-validation.mjs";

const sha256 = "a".repeat(64);

function manifest(overrides = {}) {
  return {
    version: 1,
    status: "draft",
    schema: "official-documents-manifest.v1",
    sectionPath: "content/official-documents",
    entries: [entry()],
    ...overrides,
  };
}

function entry(overrides = {}) {
  return {
    id: "ley-24449",
    title: "Ley de Transito",
    officialSourceType: "law",
    sourceUrl: "https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto",
    retrievalDate: "2026-05-09",
    localPath: "content/official-documents/documents/ley-24449.md",
    sourceFormat: "html",
    hashAlgorithm: "sha256",
    hash: sha256,
    conversionMethod: "html-to-markdown exact text preservation",
    conversionNotes: "Headings, article numbering, and source wording preserved as Markdown.",
    currentness: {
      checkedAt: "2026-05-09",
      status: "current",
      validationStatus: "passed",
      statusEvidence: "Official page presented the current consolidated text.",
      amendmentRepealEvidence:
        "No repeal or supersession notice observed on the checked official page.",
      evidenceUrls: ["https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto"],
    },
    exactTextValidation: {
      status: "pending",
      notes: "Final exact-text comparison is reserved for the final archive validation slice.",
    },
    ...overrides,
  };
}

function files(extra = {}) {
  return {
    "content/official-documents/documents/ley-24449.md": { exists: true, sha256 },
    ...extra,
  };
}

function validate({ manifestData = manifest(), fileMetadata = files(), sourceTrace } = {}) {
  return validateOfficialDocumentsManifest({
    manifest: manifestData,
    fileMetadata,
    sourceTrace,
  });
}

function repositoryFileMetadata(relativePath) {
  const exists = existsSync(relativePath);
  return {
    exists,
    ...(exists
      ? { sha256: createHash("sha256").update(readFileSync(relativePath)).digest("hex") }
      : {}),
  };
}

test("current committed manifest passes validation with repository files and hashes", () => {
  const currentManifest = JSON.parse(
    readFileSync("content/official-documents/manifest.json", "utf8"),
  );
  assert.deepEqual(
    validateOfficialDocumentsManifest({
      manifest: currentManifest,
      fileMetadata: repositoryFileMetadata,
    }),
    [],
  );
});

test("valid manifest entry passes with injected local file metadata", () => {
  assert.deepEqual(validate(), []);
});

test("rejects missing required metadata", () => {
  const document = entry({
    title: "",
    officialSourceType: "",
    sourceUrl: "not-a-url",
    retrievalDate: "09-05-2026",
    sourceFormat: "",
  });

  const errors = validate({ manifestData: manifest({ entries: [document] }) });
  assert(errors.includes("ley-24449.title must be a non-empty string."));
  assert(errors.includes("ley-24449.officialSourceType must be a non-empty string."));
  assert(errors.includes("ley-24449.sourceUrl must be an http(s) URL."));
  assert(errors.includes("ley-24449.retrievalDate must be YYYY-MM-DD."));
  assert(errors.includes("ley-24449.sourceFormat must be a non-empty string."));
});

test("rejects local paths outside official-documents", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          localPath: "content/sources/originals/ley-24449.md",
        }),
      ],
    }),
    fileMetadata: {
      "content/sources/originals/ley-24449.md": { exists: true },
    },
  });

  assert(
    errors.includes("ley-24449.localPath must stay inside content/official-documents/documents."),
  );
});

test("rejects official Markdown local paths outside documents directory", () => {
  const validationPathErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          localPath: "content/official-documents/validation/fake.md",
        }),
      ],
    }),
    fileMetadata: {
      "content/official-documents/validation/fake.md": { exists: true },
    },
  });

  assert(
    validationPathErrors.includes(
      "ley-24449.localPath must stay inside content/official-documents/documents.",
    ),
  );

  const agentsPathErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          localPath: "content/official-documents/AGENTS.md",
        }),
      ],
    }),
    fileMetadata: {
      "content/official-documents/AGENTS.md": { exists: true },
    },
  });

  assert(
    agentsPathErrors.includes(
      "ley-24449.localPath must stay inside content/official-documents/documents.",
    ),
  );
});

test("rejects path traversal and non-Markdown archive paths", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          localPath: "content/official-documents/../sources/ley-24449.txt",
        }),
      ],
    }),
    fileMetadata: {
      "content/official-documents/../sources/ley-24449.txt": { exists: true },
    },
  });

  assert(
    errors.includes("ley-24449.localPath must stay inside content/official-documents/documents."),
  );
  assert(errors.includes("ley-24449.localPath must point to a Markdown file."));
});

test("rejects missing or invalid sha256 metadata", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          hashAlgorithm: "sha1",
          hash: "not-a-sha",
        }),
      ],
    }),
  });

  assert(errors.includes("ley-24449.hashAlgorithm must be sha256."));
  assert(errors.includes("ley-24449.hash must be a 64-character lowercase sha256 hex digest."));
});

test("rejects stale manifest hash when local sha256 metadata is available", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          hash: "b".repeat(64),
        }),
      ],
    }),
  });

  assert(errors.includes("ley-24449.hash must match local Markdown sha256 metadata."));
});

test("does not require hash comparison when local sha256 metadata is unavailable", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          hash: "b".repeat(64),
        }),
      ],
    }),
    fileMetadata: {
      "content/official-documents/documents/ley-24449.md": { exists: true },
    },
  });

  assert.deepEqual(errors, []);
});

test("rejects missing conversion method and notes", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          conversionMethod: "",
          conversionNotes: "",
        }),
      ],
    }),
  });

  assert(errors.includes("ley-24449.conversionMethod must be a non-empty string."));
  assert(errors.includes("ley-24449.conversionNotes must be a non-empty string."));
});

test("rejects missing currentness fields", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          currentness: {
            checkedAt: "",
            status: "",
            validationStatus: "",
            statusEvidence: "",
            amendmentRepealEvidence: "",
            evidenceUrls: [],
          },
        }),
      ],
    }),
  });

  assert(errors.includes("ley-24449.currentness.checkedAt must be YYYY-MM-DD."));
  assert(errors.includes("ley-24449.currentness.status must be a non-empty string."));
  assert(errors.includes("ley-24449.currentness.validationStatus must be a non-empty string."));
  assert(errors.includes("ley-24449.currentness.statusEvidence must be a non-empty string."));
  assert(
    errors.includes("ley-24449.currentness.amendmentRepealEvidence must be a non-empty string."),
  );
  assert(errors.includes("ley-24449.currentness.evidenceUrls must be a non-empty array."));
});

test("rejects invalid currentness status enum values", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          currentness: {
            checkedAt: "2026-05-09",
            status: "curent",
            validationStatus: "done",
            statusEvidence: "Typo exercise.",
            amendmentRepealEvidence: "Typo exercise.",
            evidenceUrls: ["https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto"],
          },
        }),
      ],
    }),
  });

  assert.match(
    errors.join("\n"),
    /ley-24449\.currentness\.status must be one of .*current.*not_current.*unknown/,
  );
  assert(
    errors.includes(
      "ley-24449.currentness.validationStatus must be one of pending, passed, failed.",
    ),
  );
});

test("rejects missing exact-text validation status", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          exactTextValidation: {
            notes: "No status.",
          },
        }),
      ],
    }),
  });

  assert(errors.includes("ley-24449.exactTextValidation.status must be a non-empty string."));
});

test("rejects invalid exact-text validation status enum values", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          exactTextValidation: {
            status: "done",
          },
        }),
      ],
    }),
  });

  assert(
    errors.includes("ley-24449.exactTextValidation.status must be one of pending, passed, failed."),
  );
});

test("requires raw original evidence for PDF and other lossy formats", () => {
  const missingRawErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          sourceFormat: "pdf",
        }),
      ],
    }),
  });
  assert(missingRawErrors.includes("ley-24449.rawOriginalPath must be a non-empty string."));

  const spacedFormatErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          sourceFormat: "pdf ",
        }),
      ],
    }),
  });
  assert(spacedFormatErrors.includes("ley-24449.rawOriginalPath must be a non-empty string."));

  const documentsRawErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          sourceFormat: "pdf",
          rawOriginalPath: "content/official-documents/documents/source.pdf",
        }),
      ],
    }),
    fileMetadata: files({
      "content/official-documents/documents/source.pdf": { exists: true },
    }),
  });
  assert(
    documentsRawErrors.includes(
      "ley-24449.rawOriginalPath must stay inside content/official-documents/originals.",
    ),
  );

  const validationRawErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          sourceFormat: "pdf",
          rawOriginalPath: "content/official-documents/validation/source.pdf",
        }),
      ],
    }),
    fileMetadata: files({
      "content/official-documents/validation/source.pdf": { exists: true },
    }),
  });
  assert(
    validationRawErrors.includes(
      "ley-24449.rawOriginalPath must stay inside content/official-documents/originals.",
    ),
  );

  const presentRawErrors = validate({
    manifestData: manifest({
      entries: [
        entry({
          sourceFormat: "pdf",
          rawOriginalPath: "content/official-documents/originals/ley-24449.pdf",
        }),
      ],
    }),
    fileMetadata: files({
      "content/official-documents/originals/ley-24449.pdf": { exists: true },
    }),
  });
  assert.deepEqual(presentRawErrors, []);
});

test("rejects duplicate official document IDs", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [entry(), entry()],
    }),
  });

  assert(errors.includes("ley-24449: duplicate official document id."));
});

test("rejects current source-trace citations to missing official documents", () => {
  const errors = validate({
    sourceTrace: {
      entries: [
        {
          id: "trace-1",
          officialDocumentIds: ["missing-doc"],
        },
      ],
    },
  });

  assert(
    errors.includes("trace-1: source trace references missing official document missing-doc."),
  );
});

test("rejects stale or not-current documents for current guide source-trace claims", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          currentness: {
            checkedAt: "2026-05-09",
            status: "stale",
            validationStatus: "passed",
            statusEvidence: "A newer official version exists.",
            amendmentRepealEvidence: "Supersession was detected.",
            evidenceUrls: ["https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto"],
          },
        }),
      ],
    }),
    sourceTrace: {
      entries: [
        {
          id: "trace-stale",
          officialDocumentIds: ["ley-24449"],
        },
      ],
    },
  });

  assert(
    errors.includes(
      "trace-stale: current guide claims must cite only current official documents; ley-24449 has status stale and validationStatus passed.",
    ),
  );
});

test("rejects pending currentness validation for current guide source-trace claims", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          currentness: {
            checkedAt: "2026-05-09",
            status: "current",
            validationStatus: "pending",
            statusEvidence: "Source looks current but has not been independently validated.",
            amendmentRepealEvidence: "Pending final currentness pass.",
            evidenceUrls: ["https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto"],
          },
        }),
      ],
    }),
    sourceTrace: {
      entries: [
        {
          id: "trace-pending",
          officialDocumentIds: ["ley-24449"],
        },
      ],
    },
  });

  assert(
    errors.includes(
      "trace-pending: current guide claims must cite only current official documents; ley-24449 has status current and validationStatus pending.",
    ),
  );
});

test("allows historical source-trace citations to non-current archived documents", () => {
  const errors = validate({
    manifestData: manifest({
      entries: [
        entry({
          currentness: {
            checkedAt: "2026-05-09",
            status: "historical",
            validationStatus: "passed",
            statusEvidence: "Archived for history only.",
            amendmentRepealEvidence: "Superseded by a newer official source.",
            evidenceUrls: ["https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/texto"],
          },
        }),
      ],
    }),
    sourceTrace: {
      entries: [
        {
          id: "trace-history",
          claimUse: "historical_context",
          officialDocumentIds: ["ley-24449"],
        },
      ],
    },
  });

  assert.deepEqual(errors, []);
});
