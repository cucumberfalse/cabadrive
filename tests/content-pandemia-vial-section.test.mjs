import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const dataPath = "src/data/pandemiaVialSection.ts";
const appPath = "src/App.tsx";
const stylesPath = "src/styles.css";
const dataSource = readFileSync(dataPath, "utf8");
const appSource = readFileSync(appPath, "utf8");
const stylesSource = readFileSync(stylesPath, "utf8");
const prototypeAppSource = appSource.slice(
  appSource.indexOf("const pandemiaPagePreviewWidth"),
  appSource.indexOf("function manualDisplayText")
);
const prototypeStylesSource = stylesSource.slice(
  stylesSource.indexOf(".pandemia-prototype")
);
const introductionDataSource = dataSource.slice(dataSource.indexOf("export const introductionNavigation"));
const roadSafetyPlanArticleSource = introductionDataSource.slice(introductionDataSource.lastIndexOf('id: "intro-road-safety-plan"'));
const introductionAppSource = appSource.slice(appSource.indexOf("function IntroductionArticleBlockView"), appSource.indexOf("function manualDisplayText"));
const pandemiaOnlyDataSource = dataSource.slice(0, dataSource.indexOf("export const introductionNavigation"));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readPngSize(path) {
  const buffer = readFileSync(path);
  assert.equal(buffer.toString("ascii", 1, 4), "PNG", `${path} is a PNG`);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

test("Introduction navigation is driven by four source Index headings, not raw pages", () => {
  const expectedRoutes = [
    {
      id: "intro-road-pandemic",
      hash: "#pandemia-vial",
      titleRu: "Дорожная пандемия",
      titleEs: "Pandemia vial",
      startPage: 15,
      endPage: 15
    },
    {
      id: "intro-ethical-civic-approach",
      hash: "#intro-enfoque-etico",
      titleRu: "Этико-гражданский подход в дорожной культуре",
      titleEs: "Enfoque ético - ciudadano en la cultura vial",
      startPage: 16,
      endPage: 16
    },
    {
      id: "intro-incident",
      hash: "#intro-accidente-incidente",
      titleRu: "Авария или дорожный инцидент?",
      titleEs: "¿Accidente o incidente de tránsito?",
      startPage: 17,
      endPage: 17
    },
    {
      id: "intro-road-safety-plan",
      hash: "#intro-plan-seguridad-vial",
      titleRu: "План дорожной безопасности города Буэнос-Айрес",
      titleEs: "Plan de seguridad vial de la Ciudad de Buenos Aires",
      startPage: 18,
      endPage: 20
    }
  ];

  let lastIndex = -1;
  for (const route of expectedRoutes) {
    const index = introductionDataSource.indexOf(`id: "${route.id}"`);
    assert.ok(index > lastIndex, `${route.id} appears in source Index order`);
    lastIndex = index;
    assert.match(introductionDataSource, new RegExp(`id:\\s*"${route.id}"[\\s\\S]*?routeHash:\\s*"${route.hash}"`, "u"));
    assert.match(introductionDataSource, new RegExp(`id:\\s*"${route.id}"[\\s\\S]*?titleRu:\\s*"${route.titleRu.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "u"));
    assert.ok(introductionDataSource.includes(`titleEs: "${route.titleEs}"`), `${route.id} keeps internal source heading traceability`);
    assert.match(introductionDataSource, new RegExp(`id:\\s*"${route.id}"[\\s\\S]*?startPage:\\s*${route.startPage}[\\s\\S]*?endPage:\\s*${route.endPage}`, "u"));
  }

  assert.match(introductionDataSource, /id:\s*"intro-road-safety-plan"[\s\S]*?startPage:\s*18[\s\S]*?endPage:\s*20/);
  assert.equal((introductionDataSource.match(/id:\s*"intro-road-safety-plan"/g) ?? []).length >= 2, true, "plan appears in navigation and article data");
  assert.doesNotMatch(introductionDataSource, /routeHash:\s*"#(?:page|manual|p)-?\d+/u);
  assert.match(introductionDataSource, /export const manualGuideNavigation/);
  assert.match(introductionAppSource, /data-testid="manual-guide-shell"/);
  assert.match(introductionAppSource, /data-testid="manual-guide-nav"/);
  assert.match(introductionAppSource, /data-active-group-id=\{activeGroupId\}/);
  assert.match(introductionAppSource, /data-active-child-id=\{selectedEntry\.id\}/);
  assert.match(introductionAppSource, /data-testid=\{child\.introductionRouteId \? `intro-route-\$\{child\.introductionRouteId\}`/);
  assert.match(introductionAppSource, /aria-current=\{isActiveChild \? "page" : undefined\}/);
  assert.match(introductionAppSource, /aria-label=\{child\.labelRu\}/);
  assert.doesNotMatch(introductionAppSource, /data-testid="intro-index-nav"/);
  assert.doesNotMatch(introductionAppSource, /manual-page-button-\$\{entry\.startPage\}|pageNumber|raw page/u);
});

test("Руководство uses full-document hierarchy and hides duplicate legacy manual destination", () => {
  for (const requiredEntry of [
    "Предисловие",
    "Глоссарий",
    "Введение",
    "Глава 1. К устойчивой мобильности",
    "Глава 2. Вождение - ответственное действие",
    "Глава 3. Основные правила вождения",
    "Глава 4. Физическое состояние водителя",
    "Глава 5. Поведение за рулем",
    "Приложение I. Легковые автомобили",
    "Приложение II. Пассажирский транспорт",
    "Приложение III. Грузовой транспорт и перевозка товаров",
    "Приложение IV. Дорожные знаки и разметка"
  ]) {
    assert.ok(introductionDataSource.includes(requiredEntry), `full Indice navigation includes ${requiredEntry}`);
  }

  for (const sourceMetadata of [
    "CAPÍTULO 1: HACIA UNA MOVILIDAD SUSTENTABLE",
    "CAPÍTULO 2: CONDUCIR ES UN ACTO DE RESPONSABILIDAD",
    "CAPÍTULO 3: NORMAS BÁSICAS DE CONDUCCIÓN",
    "CAPÍTULO 4: CAPACIDAD NATURAL",
    "CAPÍTULO 5: ACTITUD AL CONDUCIR",
    "ANEXO IV SEÑALES VIALES"
  ]) {
    assert.ok(introductionDataSource.includes(sourceMetadata), `Spanish source metadata retained internally: ${sourceMetadata}`);
  }

  assert.match(introductionDataSource, /status:\s*"pending"/);
  assert.match(introductionAppSource, /disabled=\{child\.status === "pending" \|\| !introEntry\}/);
  assert.match(introductionAppSource, /data-source-title-es=\{child\.sourceTitleEs\}/);
  assert.match(appSource, /> Руководство<\/button>/);
  assert.doesNotMatch(appSource, /> Руководство 4R<\/button>/);
  assert.doesNotMatch(appSource, /> Введение<\/button>/);
  assert.equal((appSource.match(/data-testid="pandemia-nav-entry"/g) ?? []).length, 1, "one user-facing guide destination");
});

test("Introduction article pages use native Russian DOM content without visible Spanish UI text", () => {
  for (const requiredText of [
    "В CABA действует Закон 2148 - Кодекс дорожного движения и транспорта.",
    "Как пользователи общественной дороги мы обязаны",
    "Если этого можно избежать, это не авария.",
    "Факторы риска",
    "Это главный фактор риска.",
    "Основные принципы",
    "Последствия дорожных инцидентов",
    "Безопасная инфраструктура",
    "Коммуникация, обучение и осведомление",
    "Дорожное движение - это система, которую строят все граждане"
  ]) {
    assert.ok(introductionDataSource.includes(requiredText), `missing new intro content: ${requiredText}`);
  }

  for (const visibleSpanish of [
    "Factores de Riesgo",
    "Recomendaciones",
    "Objetivos",
    "Ejes de trabajo",
    "Consecuencias de los",
    "Victimas fatales",
    "En CABA rige"
  ]) {
    assert.doesNotMatch(introductionAppSource, new RegExp(visibleSpanish, "iu"), `runtime article renderer must not contain visible Spanish: ${visibleSpanish}`);
  }

  assert.match(introductionAppSource, /data-testid="intro-article"/);
  assert.match(introductionAppSource, /data-testid="intro-article-block"/);
  assert.match(stylesSource, /\.intro-doc-block[\s\S]*?user-select:\s*text/);
  assert.match(stylesSource, /\.intro-doc-block[\s\S]*?white-space:\s*normal/);
  assert.match(stylesSource, /\.intro-photo-quote blockquote/);
  assert.doesNotMatch(introductionAppSource, /<iframe|<object|<embed|pdfjs|PDFViewer|pandemia-source-mask|source-mask|overlay/i);
  assert.doesNotMatch(stylesSource, /\.intro-document[\s\S]*?background-image:\s*url\([^)]*page-0(?:16|17|18|19|20)\.jpg/);
});

test("Road safety plan opening uses simplified Russian while preserving ticket-critical details", () => {
  const oldFormalParagraphs = [
    "Дорожная безопасность - общая ответственность во всем мире. В городе Буэнос-Айрес план строится на тех же принципах, что и в городах и странах, которые добились лучших результатов.",
    "Программа Vision Zero основана на этическом принципе: никто не должен погибать или получать постоянные травмы в дорожных инцидентах. Она появилась в 1997 году в Швеции, стране, которая более трех десятилетий считается ориентиром в этой сфере.",
    "Транспортная система должна быть спроектирована так, чтобы сдерживать и уменьшать последствия человеческих ошибок и создавать безопасную систему."
  ];

  for (const oldParagraph of oldFormalParagraphs) {
    assert.doesNotMatch(
      roadSafetyPlanArticleSource,
      new RegExp(escapeRegExp(oldParagraph), "u"),
      `old literal Plan wording must not remain: ${oldParagraph}`
    );
  }

  for (const requiredDetail of [
    /Безопасность на дорогах - общее дело во всем мире/u,
    /Буэнос-Айрес[\s\S]*принципы[\s\S]*городов[\s\S]*стран[\s\S]*лучших результатов/u,
    /Vision Zero/u,
    /этическ/u,
    /никто не должен погибать/u,
    /постоянные травмы/u,
    /дорожных инцидентах/u,
    /Швеции в 1997 году/u,
    /больше трех десятилетий/u,
    /ориентир/u,
    /транспортную систему нужно проектировать/u,
    /сдерживала и уменьшала последствия человеческих ошибок/u,
    /делать движение безопасным/u
  ]) {
    assert.match(roadSafetyPlanArticleSource, requiredDetail, `Plan opening lost required detail: ${requiredDetail}`);
  }

  assert.ok(
    roadSafetyPlanArticleSource.indexOf("Безопасность на дорогах") < roadSafetyPlanArticleSource.indexOf('titleRu: "Основные принципы"'),
    "simplified Plan opening stays before the principles list"
  );
  assert.match(roadSafetyPlanArticleSource, /Идея Vision Zero простая и этическая/u, "local simplification is explicit in runtime content");
});

test("Introduction visual assets avoid full-page raster and Spanish quote text", () => {
  const photoAsset = "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/child-seat-photo-source.jpg";
  assert.ok(introductionDataSource.includes(photoAsset), "plan final photo uses a section crop asset");
  assert.equal(existsSync(photoAsset), true, `${photoAsset} exists`);
  assert.match(introductionDataSource, /source photo crop excludes the Spanish quote/);
  assert.doesNotMatch(introductionDataSource, /image:\s*\{[\s\S]*?localPath:\s*"content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/pages\/page-020\.jpg"/u);
  assert.match(introductionAppSource, /assetUrl\(block\.image\.localPath\)/);
  assert.doesNotMatch(introductionAppSource, /page-016\.jpg|page-017\.jpg|page-018\.jpg|page-019\.jpg|page-020\.jpg/u);
});

test("Introduction source-fidelity checker data rejects generic page 17-19 artwork replacements", () => {
  for (const assetPath of [
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-ambiental-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-vehicular-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-humano-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-infrastructure-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-education-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-control-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-participation-source.png"
  ]) {
    assert.ok(introductionDataSource.includes(assetPath), `source-derived visual asset recorded: ${assetPath}`);
    assert.equal(existsSync(assetPath), true, `${assetPath} exists`);
  }
  for (const assetPath of [
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-ambiental-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-vehicular-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-incident/icon-risk-humano-source.png"
  ]) {
    assert.deepEqual(readPngSize(assetPath), { width: 512, height: 512 }, `${assetPath} uses high-DPI padded 512x512 bounds, not the stale 78x78/256x256 tight or under-resolution source crop`);
  }
  assert.doesNotMatch(introductionDataSource, /recommendationIconAssetId|recommendation-clipboard|icon-recommendation-clipboard/u);
  assert.doesNotMatch(introductionAppSource, /intro-recommendation-icon|recommendationIconAssetId|recommendation-clipboard/u);
  for (const assetPath of [
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-infrastructure-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-education-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-control-source.png",
    "content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-019/icon-axis-participation-source.png"
  ]) {
    assert.deepEqual(readPngSize(assetPath), { width: 192, height: 192 }, `${assetPath} uses high-DPI padded 192x192 bounds, not the stale 96x96 source crop`);
  }

  for (const requiredEvidence of [
    "page 17 Factores de Riesgo Ambiental pictogram",
    "transparent 512x512 padded high-DPI PDF source crop of original wind/tree artwork",
    "original pictogram pixels preserved",
    "no clipped or tight crop box",
    "page 18 complete original consequences gauge high-DPI PDF source crop with local source-text cleanup",
    "high-DPI PDF source crop from page 18 approved composition frame x=280 y=560 width=620 height=260 rendered at scale 6 to intrinsic 3720x1560",
    "Spanish/source text cleanup is limited to the original text-bearing regions with local background restoration",
    "category labels retain source-shaped text-free label backings from the asset",
    "center circle uses circular local-field cleanup inside the original circle, not rectangular/block cover-up",
    "rectangular cover-up masks are forbidden even when color-matched to the background",
    "no white rectangular mask remnants at category label corners",
    "no masks cutting connector lines",
    "no white marks on the black fatal-victims label or wedge",
    "no non-source beige horizontal bars below the diagram or under the institutions block",
    "no non-source black horizontal protrusion to the right of the fatal-victims wedge",
    "no hard-edged center ring/circle patch seam",
    "original arcs, pointer, sectors, label boxes, connector lines, icons, black wedge, center ring, proportions, and composition retained as source pixels outside the text-cleaned regions",
    "no redrawn geometry",
    "no native/CSS/SVG reconstruction",
    "page 19 safe infrastructure pictogram",
    "transparent 192x192 padded high-DPI PDF source pictogram from the original page 19 gray circle",
    "full walking/pedestrian extents are centered with alpha padding, no browser upscaling, and no tight crop box",
    "page 19 citizen participation pictogram",
    "visibleSpanish: false",
    "containsText: false"
  ]) {
    assert.ok(introductionDataSource.includes(requiredEvidence), `fidelity evidence includes ${requiredEvidence}`);
  }
  assert.ok(!introductionDataSource.includes("clean source-faithful native reconstruction"), "page 18 must not claim native reconstruction");

  assert.match(appSource, /data-testid="intro-source-artwork"/);
  assert.match(appSource, /data-fidelity-role=\{asset\.fidelityRole\}/);
  assert.match(appSource, /data-visible-spanish=\{asset\.visibleSpanish\}/);
  assert.match(introductionAppSource, /intro-consequence-diagram/);
  assert.doesNotMatch(introductionAppSource, /intro-consequence-summary/);
  assert.match(stylesSource, /\.intro-consequence-background/);
  assert.match(stylesSource, /\.intro-consequence-background\s*\{[\s\S]*?object-fit:\s*contain/);
  assert.doesNotMatch(stylesSource, /\.intro-consequence-arc/);
  assert.doesNotMatch(
    introductionDataSource,
    /sourceRegion:\s*\{\s*x:\s*345,\s*y:\s*545,\s*width:\s*525,\s*height:\s*285\s*\}/,
    "page 18 must not keep the old partial reconstruction crop metadata"
  );
  assert.doesNotMatch(
    introductionDataSource,
    /sourceRegion:\s*\{\s*x:\s*345,\s*y:\s*480,\s*width:\s*500,\s*height:\s*350\s*\}/,
    "page 18 must not keep the rejected 500x350 partial/reconstructed crop metadata"
  );
  assert.doesNotMatch(
    introductionDataSource,
    /intrinsicSize:\s*\{\s*width:\s*525,\s*height:\s*285\s*\}/,
    "page 18 must not keep old partial reconstruction dimensions"
  );
  assert.doesNotMatch(
    introductionDataSource,
    /intrinsicSize:\s*\{\s*width:\s*500,\s*height:\s*350\s*\}/,
    "page 18 must not keep rejected 500x350 dimensions"
  );
  assert.doesNotMatch(
    introductionDataSource,
    /intrinsicSize:\s*\{\s*width:\s*620,\s*height:\s*260\s*\}/,
    "page 18 must not keep the low-resolution 620x260 crop as the runtime intrinsic asset"
  );
  assert.match(
    introductionDataSource,
    /sourceRegion:\s*\{\s*x:\s*280,\s*y:\s*560,\s*width:\s*620,\s*height:\s*260\s*\}/,
    "page 18 records the complete original source crop region"
  );
  assert.match(introductionDataSource, /sourceRenderScale:\s*6/, "source artwork records high-DPI PDF render scale evidence");
  assert.match(
    introductionDataSource,
    /intrinsicSize:\s*\{\s*width:\s*3720,\s*height:\s*1560\s*\}/,
    "page 18 records the high-DPI source crop intrinsic size"
  );
  assert.deepEqual(
    readPngSize("content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/intro-road-safety-plan/page-018/diagram-consequences-clean-source.png"),
    { width: 3720, height: 1560 },
    "page 18 cleaned source crop PNG is the high-DPI 3720x1560 asset"
  );
  assert.doesNotMatch(introductionDataSource, /page-018\/icon-[^"]+source\.jpg/, "page 18 must not keep component icon crop metadata as the accepted diagram strategy");
  const consequenceCenterRule = stylesSource.match(/\.intro-consequence-center\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  assert.match(consequenceCenterRule, /border:\s*0/, "center incident DOM layer must not redraw the source center ring");
  assert.match(consequenceCenterRule, /background:\s*transparent/, "center incident DOM layer keeps a transparent background");
  assert.match(consequenceCenterRule, /background-image:\s*none/, "center incident DOM layer has no image backing");
  assert.match(consequenceCenterRule, /box-shadow:\s*none/, "center incident DOM layer has no rectangular shadow backing");
  assert.match(
    stylesSource,
    /\.intro-consequence-center::before,\n\.intro-consequence-center::after\s*\{[\s\S]*?content:\s*none/,
    "center incident DOM layer has no pseudo-element backing rectangle"
  );
  const consequenceCardHeadingRule =
    [...stylesSource.matchAll(/^\.intro-consequence-card h4\s*\{[\s\S]*?\n\}/gm)].at(-1)?.[0] ?? "";
  assert.match(consequenceCardHeadingRule, /align-items:\s*center/, "page 18 category label text is vertically centered");
  assert.match(consequenceCardHeadingRule, /background:\s*transparent/, "page 18 category label DOM text does not add source-mismatched backing plates");
  assert.match(consequenceCardHeadingRule, /border-radius:\s*0/, "page 18 category label corners come from the cleaned source asset, not DOM plates");
  assert.match(consequenceCardHeadingRule, /box-shadow:\s*none/, "page 18 category label DOM text has no backing rectangle");
  assert.match(consequenceCardHeadingRule, /position:\s*relative/, "page 18 category label text can receive optical centering offsets without drawing a backing");
  assert.match(consequenceCardHeadingRule, /top:\s*var\(--label-optical-y\)/, "page 18 category label text uses vertical offsets only for optical centering");
  assert.match(consequenceCardHeadingRule, /min-width:\s*calc\(var\(--label-source-width\) \/ 620 \* 100cqw\)/, "page 18 DOM label text wrapper keeps at least source label width");
  assert.match(consequenceCardHeadingRule, /width:\s*max-content/, "page 18 DOM label text wrapper may widen only as needed for Russian text");
  assert.match(consequenceCardHeadingRule, /padding:\s*0 var\(--label-padding-inline\)/, "page 18 label text keeps only inline measurement padding for centering over source backings");
  assert.match(consequenceCardHeadingRule, /height:\s*calc\(var\(--label-source-height\) \/ 620 \* 100cqw\)/, "page 18 labels scale to source box height from diagram width");
  assert.match(consequenceCardHeadingRule, /font-size:\s*clamp\(0\.35rem, 1\.65cqw, 0\.78rem\)/, "page 18 category labels use one readable fitting size");
  assert.match(consequenceCardHeadingRule, /font-weight:\s*800/, "page 18 category labels share a strong uppercase style");
  assert.doesNotMatch(stylesSource, /--label-background:/, "page 18 DOM label layer must not keep a CSS backing color token");
  assert.doesNotMatch(stylesSource, /--label-radius:/, "page 18 DOM label layer must not keep a CSS backing radius token");
  assert.match(stylesSource, /\.intro-consequence-card\[data-consequence-id="health"\]\s*\{[\s\S]*?--label-source-width:\s*96/, "health label uses the widened cleaned-source backing needed for Russian fitting");
  assert.match(stylesSource, /\.intro-consequence-card\[data-consequence-id="institutions"\]\s*\{[\s\S]*?--label-source-width:\s*130/, "institutions label keeps its source backing width");
  assert.match(stylesSource, /\.intro-consequence-card\[data-consequence-id="institutions"\]\s*\{[\s\S]*?--label-optical-y:\s*calc\(-1\.2 \/ 620 \* 100cqw\)/, "institutions label has a named optical vertical-centering correction");
  assert.match(stylesSource, /\.intro-consequence-card\.dark\s*\{[\s\S]*?--label-source-height:\s*12/, "fatality label preserves its shorter source label-box height");
  assert.match(stylesSource, /\.intro-consequence-card\.dark\s*\{[\s\S]*?--label-source-width:\s*115/, "fatality label backing keeps the source black label width");
  assert.match(stylesSource, /\.intro-consequence-card\.dark\s*\{[\s\S]*?--label-optical-y:\s*calc\(-0\.9 \/ 620 \* 100cqw\)/, "fatality label has a named optical vertical-centering correction");
  const consequenceDarkHeadingRule = stylesSource.match(/\.intro-consequence-card\.dark h4\s*\{[^}]*\}/u)?.[0] ?? "";
  assert.doesNotMatch(consequenceDarkHeadingRule, /font-size:/, "fatality label must not use a visibly different tiny font-size");
  assert.match(stylesSource, /\.intro-risk-lobe/);
  assert.match(stylesSource, /\.intro-risk-list\s*\{[\s\S]*?gap:\s*18px/);
  const riskCardRule = stylesSource.match(/\.intro-risk-card\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  const riskCardBeforeRule = stylesSource.match(/\.intro-risk-card::before\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  const riskLobeRule = stylesSource.match(/\.intro-risk-lobe\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
  assert.match(riskCardRule, /--risk-panel-bg:\s*#e7e8e6/, "risk rows keep a shared source-gray panel color token");
  assert.match(riskCardRule, /background:\s*transparent/, "risk card container must not paint a full-height rectangle behind the lobe");
  assert.match(riskCardBeforeRule, /height:\s*100px/, "risk-card right rectangle is explicitly shorter than the larger desktop circular lobe");
  assert.match(riskCardBeforeRule, /left:\s*36px/, "risk-card right rectangle starts inside the circle so the lobe masks seam corners");
  assert.match(riskCardBeforeRule, /background:\s*var\(--risk-panel-bg\)/, "risk-card right rectangle uses the same source row color as the lobe");
  assert.match(riskLobeRule, /width:\s*116px;[\s\S]*height:\s*116px/, "desktop risk lobe remains source-like and larger than the right rectangle");
  assert.match(riskLobeRule, /background:\s*var\(--risk-panel-bg\)/, "risk lobe shares the source row color with the inset rectangle");
  assert.match(stylesSource, /\.intro-risk-card\.warning\s*\{[\s\S]*?--risk-panel-bg:\s*#f5e51f/, "human risk row keeps the source yellow color token");
  assert.match(stylesSource, /\.intro-axis-circle/);
  assert.match(stylesSource, /\.intro-axis-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(220px, 1fr\)\)/);
  assert.match(stylesSource, /\.intro-axis-card\s*\{[\s\S]*?grid-template-rows:\s*2\.9rem 82px auto/);
  assert.match(stylesSource, /\.intro-axis-card h4\s*\{[\s\S]*?min-height:\s*2\.9rem/);
  assert.match(stylesSource, /\.intro-axis-symbol\s*\{[\s\S]*?width:\s*66px;[\s\S]*?height:\s*66px;[\s\S]*?object-fit:\s*contain/);
  assert.match(stylesSource, /\.intro-recommendation strong\s*\{[\s\S]*?left:\s*18px/, "recommendation tab is aligned to the border without reserving icon space");
  assert.doesNotMatch(stylesSource, /\.intro-recommendation-icon/);
  assert.doesNotMatch(introductionAppSource, /intro-risk-symbol"\s+aria-hidden="true"\s*\/>/);
  assert.doesNotMatch(introductionAppSource, /intro-axis-symbol"\s+aria-hidden="true"\s*\/>/);
});

test("Introduction recurring style guide guards blue callout drift", () => {
  assert.match(introductionDataSource, /export const introductionDocumentStyleGuide/);
  assert.match(introductionDataSource, /calloutBackground:\s*"#e9f5f8"/);
  assert.match(introductionDataSource, /calloutAccent:\s*"#2787a6"/);
  assert.match(introductionDataSource, /calloutTextAlign:\s*"left"/);
  assert.match(stylesSource, /\.intro-doc-callout,\n\.intro-doc-quote\s*\{[\s\S]*?background:\s*#e9f5f8/);
  assert.match(stylesSource, /\.intro-doc-callout,\n\.intro-doc-quote\s*\{[\s\S]*?border-left:\s*6px solid #2787a6/);
  assert.match(stylesSource, /\.intro-doc-callout,\n\.intro-doc-quote\s*\{[\s\S]*?text-align:\s*left/);
  assert.doesNotMatch(stylesSource.match(/\.intro-doc-quote\s*\{[^}]*\}/u)?.[0] ?? "", /text-align:\s*center/);
});

test("Pandemia vial prototype data names the exact source and reference-only asset", () => {
  assert.match(dataSource, /navigationEntryId:\s*"intro-road-pandemic"/);
  assert.match(dataSource, /pageNumber:\s*15/);
  assert.match(dataSource, /sourcePageMarker:\s*"14"/);
  assert.match(dataSource, /titleRu:\s*"Дорожная пандемия"/);
  assert.match(dataSource, /titleEs:\s*"Pandemia vial"/);
  assert.match(dataSource, /9e25a91abe857426dfcc978e361a2511a6ab7a0c144ccc97f757c72ffe4b1496/);
  assert.match(dataSource, /referenceAsset/);
  assert.match(dataSource, /reference-only layout evidence, not rendered by the prototype/);

  const assetMatch = dataSource.match(/localPath:\s*"([^"]*page-015\.jpg)"/);
  assert.ok(assetMatch, "data module references the local page-015 reference asset");
  assert.equal(existsSync(assetMatch[1]), true, `${assetMatch[1]} exists`);
  assert.doesNotMatch(assetMatch[1], /^https?:\/\//);
});

test("Pandemia vial prototype covers required Russian text and visual-only infographic labels", () => {
  for (const requiredText of [
    "Дорожная пандемия",
    "Дорожное движение - одна из самых сложных систем",
    "В мире",
    "В городе\\nБуэнос-Айрес",
    "1,4 МИЛЛИОНА",
    "50 МИЛЛИОНОВ",
    "людей ранены за год",
    "96\\nпогибших",
    "48%\\nна мото",
    "34%\\nпешком",
    "11%\\nв авто",
    "8 из 10",
    "49%\\nот 25 до 54 лет",
    "Это показывает: чтобы дороги стали безопаснее"
  ]) {
    assert.ok(dataSource.includes(requiredText), `missing required text: ${requiredText}`);
  }

  for (const removedVisibleText of [
    "Эти данные взяты из статистического отчета о погибших",
    "Отчет подготовила Обсерватория",
    "Больше статистических отчетов",
    "1/ Больше"
  ]) {
    assert.doesNotMatch(dataSource, new RegExp(removedVisibleText, "u"), `visible non-ticket source text should be removed: ${removedVisibleText}`);
  }

  for (const sourceText of [
    "= 4700 AVIONES LLENOS",
    "= 715 ESTADIOS LLENOS",
    "VICTIMAS FATALES",
    "OCUPANTES DE AUTOMÓVIL",
    "25 A 54 AÑOS DE EDAD"
  ]) {
    assert.ok(dataSource.normalize("NFC").includes(sourceText.normalize("NFC")), `missing source reference: ${sourceText}`);
  }
});

test("Pandemia vial ordinary paragraphs use adaptive text without forced line breaks", () => {
  for (const segmentId of ["intro", "body"]) {
    const match = dataSource.match(new RegExp(`id:\\s*"${segmentId}"[\\s\\S]*?textRu:\\s*"([^"]*)"`, "u"));
    assert.ok(match, `missing ${segmentId} text segment`);
    assert.doesNotMatch(match[1], /\\n|\n/u, `${segmentId} must not force PDF-style line breaks`);
  }

  assert.doesNotMatch(dataSource, /сложных\\nсистем/u);
  assert.doesNotMatch(dataSource, /безопаснее\\nработать/u);
  assert.match(prototypeStylesSource, /\.pandemia-segment-intro,[\s\S]*?white-space:\s*normal/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-intro,[\s\S]*?font-size:\s*1rem/);
  assert.match(prototypeAppSource, /data-prose-role/);
  assert.match(prototypeAppSource, /pandemia-responsive-prose/);
  assert.match(prototypeAppSource, /pandemia-stage-scroll[\s\S]*?pandemia-page/);
  assert.match(prototypeAppSource, /className="intro-document pandemia-prototype"/);
  assert.match(prototypeAppSource, /className="intro-document-flow"/);
  assert.match(prototypeAppSource, /"intro-doc-block"/);
  assert.match(prototypeStylesSource, /\.pandemia-prose \.pandemia-segment[\s\S]*?position:\s*static/);
  assert.match(prototypeStylesSource, /\.pandemia-text-layer \.pandemia-segment[\s\S]*?position:\s*absolute/);
  assert.match(prototypeStylesSource, /\.pandemia-segment[\s\S]*?pointer-events:\s*auto/);
  assert.match(prototypeStylesSource, /\.pandemia-segment[\s\S]*?user-select:\s*text/);
  assert.doesNotMatch(prototypeStylesSource, /\.pandemia-text-layer\s*\{[^}]*pointer-events:\s*none/u);
});

test("Pandemia vial typography uses the shared Introduction article shell while preserving infographic typography", () => {
  assert.match(prototypeAppSource, /className="intro-document pandemia-prototype"/);
  assert.match(prototypeAppSource, /<header className="intro-document-header">[\s\S]*?<h2 id="pandemia-vial-title">/);
  assert.match(prototypeAppSource, /className="intro-document-flow"/);
  assert.match(prototypeAppSource, /"intro-doc-block"/);
  assert.match(prototypeStylesSource, /\.pandemia-page[\s\S]*?--pandemia-font-family:\s*system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif/);
  assert.doesNotMatch(prototypeStylesSource, /--pandemia-font-family:\s*"SFNSRounded"/);
  assert.doesNotMatch(prototypeStylesSource, /--pandemia-font-family:[^;]*(?:"SF Compact Rounded"|"SF Pro Rounded"|"Arial Rounded MT Bold"|"Arial Rounded Bold")/);
  assert.doesNotMatch(prototypeStylesSource, /--pandemia-font-family:\s*"Avenir Next"/);
  assert.doesNotMatch(prototypeStylesSource.match(/\.pandemia-prototype\s*\{[\s\S]*?\}/u)?.[0] ?? "", /font-family:\s*var\(--pandemia-font-family\)/);
  assert.match(prototypeStylesSource, /\.pandemia-segment[\s\S]*?font-family:\s*var\(--pandemia-font-family\)/);
  assert.doesNotMatch(prototypeStylesSource.match(/\.pandemia-segment\s*\{[\s\S]*?\}/u)?.[0] ?? "", /Inter/u);
  assert.match(prototypeStylesSource, /\.pandemia-segment-heading[\s\S]*?font-weight:\s*700/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-heading[\s\S]*?line-height:\s*1\.12/);
  assert.doesNotMatch(prototypeStylesSource, /\.pandemia-prose \.pandemia-segment-heading\s*\{[\s\S]*?max-width:\s*16ch/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-intro,[\s\S]*?font-weight:\s*400/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-intro,[\s\S]*?line-height:\s*1\.62/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-context-label\s*\{[\s\S]*?font-weight:\s*700/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-stat-strip\s*\{[\s\S]*?font-weight:\s*700/);
  assert.match(prototypeStylesSource, /\.pandemia-segment-stat-card,[\s\S]*?font-weight:\s*700/);
  assert.match(prototypeStylesSource, /\.pandemia-prose \.pandemia-segment-intro,[\s\S]*?width:\s*auto/);
  assert.doesNotMatch(prototypeStylesSource.match(new RegExp(String.raw`^\.pandemia-prose\s*\{[\s\S]*?^\}`, "mu"))?.[0] ?? "", /(?:max-width|margin):/u);
  assert.doesNotMatch(prototypeStylesSource, /\.pandemia-segment-context-label::first-line/u);
  assert.doesNotMatch(prototypeStylesSource, /letter-spacing:\s*-/u);
  assert.doesNotMatch(prototypeStylesSource, /@import\s+url|https?:\/\/|fonts\.googleapis|fonts\.gstatic/u);
});

test("Pandemia vial geometry records native regions and Russian fitting notes", () => {
  for (const role of ["heading", "intro", "context-label", "stat-strip", "stat-card", "city-stat", "body"]) {
    assert.match(dataSource, new RegExp(`role:\\s*"${role}"`), `missing geometry role ${role}`);
  }
  for (const removedRole of ["page-marker", "footnote"]) {
    assert.doesNotMatch(dataSource, new RegExp(`role:\\s*"${removedRole}"`), `book-only role should not be visible: ${removedRole}`);
  }
  assert.match(dataSource, /id:\s*"global-context"/);
  assert.match(dataSource, /id:\s*"city-context"/);
  assert.match(dataSource, /contentFrame/);
  assert.match(dataSource, /meaningful Pandemia vial content block/);
  assert.match(dataSource, /firstMeaningfulContentOffset:\s*\{\s*x:\s*30,\s*y:\s*20\s*\}/);
  assert.match(dataSource, /bottomContentMargin:\s*38/);
  assert.match(appSource, /pandemiaVialSection\.contentFrame/);
  assert.match(prototypeAppSource, /pandemiaInfographicFrame/);
  assert.match(prototypeAppSource, /id:\s*"airplane-strip-panel"[\s\S]*?kind:\s*"blue-strip"[\s\S]*?y:\s*678[\s\S]*?height:\s*31/);
  assert.match(prototypeAppSource, /id:\s*"airplane-strip-cap"[\s\S]*?kind:\s*"blue-cap"[\s\S]*?x:\s*438[\s\S]*?width:\s*94[\s\S]*?height:\s*49/);
  assert.match(prototypeAppSource, /id:\s*"airplane-card-panel"[\s\S]*?x:\s*386,\s*y:\s*708,\s*width:\s*214,\s*height:\s*58/);
  assert.match(prototypeAppSource, /id:\s*"stadium-strip-panel"[\s\S]*?kind:\s*"blue-strip"[\s\S]*?y:\s*678[\s\S]*?height:\s*31/);
  assert.match(prototypeAppSource, /id:\s*"stadium-strip-cap"[\s\S]*?kind:\s*"blue-cap"[\s\S]*?x:\s*674[\s\S]*?width:\s*94[\s\S]*?height:\s*49/);
  assert.match(prototypeAppSource, /id:\s*"stadium-card-panel"[\s\S]*?x:\s*620,\s*y:\s*708,\s*width:\s*214,\s*height:\s*58/);
  assert.match(prototypeAppSource, /id:\s*"male-victims-panel"[\s\S]*?x:\s*552[\s\S]*?height:\s*58/);
  assert.match(prototypeAppSource, /id:\s*"age-range-panel"[\s\S]*?x:\s*552[\s\S]*?height:\s*56/);
  assert.match(dataSource, /id:\s*"people-grid-icon"[\s\S]*?geometry:\s*\{\s*x:\s*424,\s*y:\s*1020,\s*width:\s*104,\s*height:\s*58\s*\}/);
  assert.match(dataSource, /id:\s*"people-pair-icon"[\s\S]*?geometry:\s*\{\s*x:\s*452,\s*y:\s*1110,\s*width:\s*72,\s*height:\s*56\s*\}/);
  assert.match(dataSource, /id:\s*"airplane-card"[\s\S]*?geometry:\s*\{\s*x:\s*398,\s*y:\s*718,\s*width:\s*190,\s*height:\s*38\s*\}/);
  assert.match(dataSource, /id:\s*"stadium-card"[\s\S]*?geometry:\s*\{\s*x:\s*630,\s*y:\s*712,\s*width:\s*194,\s*height:\s*50\s*\}/);
  assert.match(dataSource, /id:\s*"male-victims"[\s\S]*?geometry:\s*\{\s*x:\s*570,\s*y:\s*1026,\s*width:\s*198,\s*height:\s*46\s*\}/);
  assert.match(dataSource, /id:\s*"age-range"[\s\S]*?geometry:\s*\{\s*x:\s*572,\s*y:\s*1116,\s*width:\s*190,\s*height:\s*42\s*\}/);
  const blueStripRule = prototypeStylesSource.match(/\.pandemia-native-shape-blue-strip\s*\{[^}]*\}/u)?.[0] ?? "";
  assert.match(blueStripRule, /border-radius:\s*0/);
  assert.doesNotMatch(blueStripRule, /border-radius:\s*999px 999px 0 0/u);
  assert.match(prototypeStylesSource, /\.pandemia-native-shape-blue-cap\s*\{[\s\S]*?border-radius:\s*999px 999px 0 0/);
  assert.match(dataSource, /rendering:\s*"native-html-css-svg"/);
  assert.match(dataSource, /source-derived icon crops/);
  assert.match(dataSource, /fittingDeviations/);
  assert.match(dataSource, /omits book-only page marker, footnote, upper-left corner motif/);
  assert.match(dataSource, /separated zones/);
  assert.doesNotMatch(dataSource, /PandemiaVialMask/);
  assert.doesNotMatch(dataSource, /\bmasks\s*:/);
});

test("Pandemia vial uses local cleaned visual assets and simple Russian wording", () => {
  assert.match(dataSource, /assets:\s*\[/);
  assert.match(dataSource, /kind:\s*"cleaned-source-crop"/);
  assert.doesNotMatch(dataSource, /kind:\s*"clean-vector-asset"/);
  assert.match(dataSource, /containsText:\s*false/);
  assert.match(dataSource, /sourceArtworkMode:\s*"original-crop"/);
  assert.match(dataSource, /sourceArtworkMode:\s*"cleaned-original"/);
  assert.match(dataSource, /bundled PDF-renderer\/canvas render of PDF page 15 at scale 4/);
  assert.match(dataSource, /fidelityEvidence/);
  const assetPaths = [...dataSource.matchAll(/localPath:\s*"(content\/assets\/manuals\/gcba-manual-vehiculo-4-ruedas-2023\/sections\/pandemia-vial\/[^"]+\.png)"/g)].map((match) => match[1]);
  for (const assetPath of assetPaths) {
    assert.equal(existsSync(assetPath), true, `${assetPath} exists`);
    assert.doesNotMatch(assetPath, /pages\/page-015\.jpg/);
    assert.doesNotMatch(assetPath, /-clean\.svg|icon-people-grid-8m-2f\.svg/);
    assert.match(assetPath, /-source\.png$/, `${assetPath} is a source-derived crop, not a generic generated icon`);
  }
  assert.equal(assetPaths.length, 7, "seven isolated visual assets are recorded");
  for (const sourceAsset of [
    "icon-airplane-source.png",
    "icon-stadium-source.png",
    "icon-motorcyclist-source.png",
    "icon-pedestrian-source.png",
    "icon-car-source.png",
    "icon-people-grid-source.png",
    "icon-people-pair-source.png"
  ]) {
    assert.ok(dataSource.includes(sourceAsset), `accepted artwork uses source-derived asset: ${sourceAsset}`);
  }
  for (const rejectedAsset of [
    "clean-vector-asset",
    "icon-motorcyclist-clean.svg",
    "icon-pedestrian-clean.svg",
    "icon-car-clean.svg",
    "icon-people-grid-8m-2f.svg"
  ]) {
    assert.doesNotMatch(dataSource, new RegExp(rejectedAsset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"), `runtime data must not reference rejected artwork: ${rejectedAsset}`);
    assert.doesNotMatch(prototypeAppSource, new RegExp(rejectedAsset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "u"), `runtime app must not reference rejected artwork: ${rejectedAsset}`);
  }
  assert.match(dataSource, /id:\s*"people-grid-icon"[\s\S]*?maleCount:\s*8/);
  assert.match(dataSource, /id:\s*"people-grid-icon"[\s\S]*?femaleCount:\s*2/);
  assert.match(dataSource, /maleSignature:\s*"source-pdf-male-silhouette"/);
  assert.match(dataSource, /malePictogramsIdentical:\s*true/);
  for (const formalResidue of ["классифицировала", "вследствие", "инцидентов", "травмированных", "каждых"]) {
    assert.doesNotMatch(pandemiaOnlyDataSource, new RegExp(formalResidue, "u"), `Pandemia wording should be simplified: ${formalResidue}`);
  }
});

test("Pandemia vial prototype files require native composition and avoid forbidden runtime patterns", () => {
  const scanned = [dataSource, prototypeAppSource, prototypeStylesSource].join("\n");
  const runtimeScanned = [prototypeAppSource, prototypeStylesSource].join("\n");
  for (const forbidden of [
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /pdfjs/i,
    /PDFViewer/,
    /getDocument\s*\(/,
    /fetch\s*\(/,
    /src=\{?["'`]https?:\/\//i,
    /source\.visualAsset/,
    /pandemiaVialSection\.masks/,
    /PandemiaVialMask/,
    /pandemia-page-base/,
    /pandemia-source-mask/,
    /pandemia-russian-layer/,
    /pandemia-svg-icon/,
    /PandemiaVialIcon/,
    /data-testid="pandemia-source-mask"/,
    /pandemia-zoom/,
    /Вписать/,
    />\s*100%\s*</,
    /data-testid=\{`pandemia-focus-\$\{region\.id\}`\}/,
    /pandemia-focus-frame/,
    /source-colored mask/,
    /закрыт[а-я\s]+маск/ui,
    /manual-page-grid/,
    /manual-visual/,
    /manual-translation/,
    /side-by-side/i,
    /corner-motif/,
    /pandemia-native-shape-corner/,
    /data-testid="pandemia-provenance"/,
    /Источник и реконструкция/,
    /pandemia-controls/
  ]) {
    assert.doesNotMatch(scanned, forbidden, `forbidden prototype pattern: ${forbidden}`);
  }
  for (const rejectedFinalArtwork of [
    /localPath:\s*"[^"]*icon-motorcyclist-clean\.svg"/,
    /localPath:\s*"[^"]*icon-pedestrian-clean\.svg"/,
    /localPath:\s*"[^"]*icon-car-clean\.svg"/,
    /localPath:\s*"[^"]*icon-people-grid-8m-2f\.svg"/,
    /kind:\s*"clean-vector-asset"/
  ]) {
    assert.doesNotMatch(scanned, rejectedFinalArtwork, `rejected final artwork pattern: ${rejectedFinalArtwork}`);
  }
  for (const forbiddenRuntime of [
    /source\.referenceAsset\.localPath/,
    /assetUrl\s*\(\s*pandemiaVialSection\.source\.referenceAsset/
  ]) {
    assert.doesNotMatch(runtimeScanned, forbiddenRuntime, `forbidden runtime reference: ${forbiddenRuntime}`);
  }

  assert.match(prototypeAppSource, /data-testid="pandemia-page"/);
  assert.match(prototypeAppSource, /data-rendering="native-html-css-svg"/);
  assert.match(prototypeAppSource, /const pandemiaPagePreviewWidth = 960/);
  assert.match(prototypeAppSource, /data-testid="pandemia-native-layer"/);
  assert.match(prototypeAppSource, /data-testid="pandemia-native-shape"/);
  assert.match(prototypeAppSource, /data-testid="pandemia-crop-asset"/);
  assert.match(prototypeAppSource, /assetUrl\(asset\.localPath\)/);
  assert.match(prototypeAppSource, /kind:\s*"circle-stat"/);
  assert.match(prototypeAppSource, /data-shape-id=\{shape\.id\}/);
  assert.match(prototypeAppSource, /data-asset-id=\{asset\.id\}/);
  assert.match(prototypeAppSource, /data-male-count=\{asset\.pictogramSemantics\?\.maleCount\}/);
  assert.match(stylesSource, /\.pandemia-page/);
  assert.match(prototypeStylesSource, /\.pandemia-native-shape/);
  assert.match(prototypeStylesSource, /\.pandemia-crop-asset/);
  assert.match(prototypeStylesSource, /font-size:\s*max\(14px/);
  assert.doesNotMatch(prototypeStylesSource, /font-size:\s*max\(12px/);
});
