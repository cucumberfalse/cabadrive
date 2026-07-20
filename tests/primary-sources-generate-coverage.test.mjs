import assert from "node:assert/strict";
import { test } from "node:test";
import {
  currentIsoDate,
  generateDocumentCoverageFromText,
  isArticleLine,
} from "../scripts/primary-sources-generate-coverage.mjs";

test("coverage generator computes snapshot dates from runtime date", () => {
  assert.equal(currentIsoDate(new Date("2026-05-20T14:15:00Z")), "2026-05-20");
  assert.equal(currentIsoDate(new Date("2027-02-03T09:30:00Z")), "2027-02-03");
});

test("article boundary detection accepts official article heading formats", () => {
  assert.equal(isArticleLine("ARTICULO 1º — AMBITO DE LA APLICACION."), true);
  assert.equal(isArticleLine("ARTICULO 10. — CURSOS DE CAPACITACION."), true);
  assert.equal(isArticleLine("ARTICULO 21 bis: Estructura"), true);
  assert.equal(isArticleLine("ARTICULO 40 bis) Requisitos para circular con bicicletas."), true);
  assert.equal(isArticleLine("ARTICULO 46 bis: Ciclovías. Las"), true);
  assert.equal(isArticleLine("ARTICULO 144 quinto.- Si se ejecutase el hecho previsto."), true);
  assert.equal(isArticleLine("ARTICULO 167 quinque.- En caso de condena."), true);
  assert.equal(isArticleLine("ARTICULO 210 quáter. - Será reprimido."), true);
  assert.equal(isArticleLine("ARTICULO 268 (1). - Será reprimido."), true);
  assert.equal(isArticleLine("ARTICULO 762,- Individualización."), true);
  assert.equal(isArticleLine("ARTICULO 1536,- Obligaciones del comodatario."), true);
  assert.equal(isArticleLine("ARTÍCULO 1°.- Establécese la entrada en vigencia."), true);
  assert.equal(isArticleLine("Artículo 1°.- Habrá sociedad si una o más personas."), true);
  assert.equal(
    isArticleLine("Art. 2. El contrato de seguro puede tener por objeto toda clase de riesgos."),
    true,
  );
});

test("article boundary detection ignores lowercase narrative cross-references", () => {
  assert.equal(
    isArticleLine("artículo 68, el cual podrá ser exhibido en formato papel impreso o"),
    false,
  );
  assert.equal(
    isArticleLine(
      "artículo 68 de la presente ley. (Inciso incorporado por art. 33 de la Ley N° 26.363 B.O. 30/4/2008.)",
    ),
    false,
  );
  assert.equal(isArticleLine("art. 33 de la Ley N° 26.363 B.O. 30/4/2008."), false);
});

test("pdf page groups keep hierarchy headings inside the current page chunk", () => {
  const coverage = generateDocumentCoverageFromText(
    {
      id: "gcba-manual-vehiculo-4-ruedas-2023",
      title: "Manual",
      localPath: "content/official-documents/documents/gcba-manual-vehiculo-4-ruedas-2023.md",
    },
    [
      "# Manual",
      "",
      "1",
      "CAPÍTULO UNO",
      "Contenido uno",
      "",
      "2",
      "ANEXO I",
      "Contenido dos",
    ].join("\n"),
  );

  const pageOne = coverage.chunks.find((chunk) => chunk.officialLabel === "1");
  const pageTwo = coverage.chunks.find((chunk) => chunk.officialLabel === "2");

  assert.deepEqual(pageOne.sourceSpan, { startLine: 3, endLine: 6 });
  assert.deepEqual(pageTwo.sourceSpan, { startLine: 7, endLine: 9 });
  assert(pageOne.headingPath.includes("Página 1: CAPÍTULO UNO"));
  assert(pageTwo.headingPath.includes("Página 2: ANEXO I"));
  assert.equal(
    coverage.chunks.some(
      (chunk) => chunk.officialLabel === "CAPÍTULO UNO" || chunk.officialLabel === "ANEXO I",
    ),
    false,
  );
});

test("article boundary detection splits comma-dash official article headings", () => {
  const coverage = generateDocumentCoverageFromText(
    {
      id: "ley-26994-codigo-civil-comercial",
      title: "Código Civil y Comercial",
      localPath: "content/official-documents/documents/ley-26994-codigo-civil-comercial.md",
    },
    [
      "# Código Civil y Comercial",
      "",
      "ARTICULO 761.- Especificación.",
      "Texto del artículo 761.",
      "",
      "ARTICULO 762,- Individualización. La obligación de dar es de género.",
      "Texto del artículo 762.",
      "",
      "ARTICULO 1536,- Obligaciones del comodatario. Son obligaciones del comodatario:",
      "Texto del artículo 1536.",
    ].join("\n"),
  );

  const article761 = coverage.chunks.find((chunk) =>
    chunk.officialLabel.startsWith("ARTICULO 761"),
  );
  const article762 = coverage.chunks.find((chunk) =>
    chunk.officialLabel.startsWith("ARTICULO 762,-"),
  );
  const article1536 = coverage.chunks.find((chunk) =>
    chunk.officialLabel.startsWith("ARTICULO 1536,-"),
  );

  assert.deepEqual(article761.sourceSpan, { startLine: 3, endLine: 5 });
  assert.deepEqual(article762.sourceSpan, { startLine: 6, endLine: 8 });
  assert.deepEqual(article1536.sourceSpan, { startLine: 9, endLine: 10 });
});
