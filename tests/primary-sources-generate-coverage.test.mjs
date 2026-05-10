import assert from "node:assert/strict";
import { test } from "node:test";
import { isArticleLine } from "../scripts/primary-sources-generate-coverage.mjs";

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
