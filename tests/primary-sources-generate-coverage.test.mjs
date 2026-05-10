import assert from "node:assert/strict";
import { test } from "node:test";
import { generateDocumentCoverageFromText, isArticleLine } from "../scripts/primary-sources-generate-coverage.mjs";

test("article boundary detection accepts official article heading formats", () => {
  assert.equal(isArticleLine("ARTICULO 1º — AMBITO DE LA APLICACION."), true);
  assert.equal(isArticleLine("ARTICULO 10. — CURSOS DE CAPACITACION."), true);
  assert.equal(isArticleLine("ARTICULO 21 bis: Estructura"), true);
  assert.equal(isArticleLine("ARTICULO 40 bis) Requisitos para circular con bicicletas."), true);
  assert.equal(isArticleLine("ARTICULO 46 bis: Ciclovías. Las"), true);
  assert.equal(isArticleLine("ARTÍCULO 1°.- Establécese la entrada en vigencia."), true);
  assert.equal(isArticleLine("Artículo 1°.- Habrá sociedad si una o más personas."), true);
  assert.equal(isArticleLine("Art. 2. El contrato de seguro puede tener por objeto toda clase de riesgos."), true);
});

test("article boundary detection ignores lowercase narrative cross-references", () => {
  assert.equal(isArticleLine("artículo 68, el cual podrá ser exhibido en formato papel impreso o"), false);
  assert.equal(
    isArticleLine(
      "artículo 68 de la presente ley. (Inciso incorporado por art. 33 de la Ley N° 26.363 B.O. 30/4/2008.)"
    ),
    false
  );
  assert.equal(isArticleLine("art. 33 de la Ley N° 26.363 B.O. 30/4/2008."), false);
});

test("pdf page groups keep hierarchy headings inside the current page chunk", () => {
  const coverage = generateDocumentCoverageFromText(
    {
      id: "gcba-manual-vehiculo-4-ruedas-2023",
      title: "Manual",
      localPath: "content/official-documents/documents/gcba-manual-vehiculo-4-ruedas-2023.md"
    },
    ["# Manual", "", "1", "CAPÍTULO UNO", "Contenido uno", "", "2", "ANEXO I", "Contenido dos"].join("\n")
  );

  const pageOne = coverage.chunks.find((chunk) => chunk.officialLabel === "1");
  const pageTwo = coverage.chunks.find((chunk) => chunk.officialLabel === "2");

  assert.deepEqual(pageOne.sourceSpan, { startLine: 3, endLine: 6 });
  assert.deepEqual(pageTwo.sourceSpan, { startLine: 7, endLine: 9 });
  assert(pageOne.headingPath.includes("Página 1: CAPÍTULO UNO"));
  assert(pageTwo.headingPath.includes("Página 2: ANEXO I"));
  assert.equal(
    coverage.chunks.some((chunk) => chunk.officialLabel === "CAPÍTULO UNO" || chunk.officialLabel === "ANEXO I"),
    false
  );
});
