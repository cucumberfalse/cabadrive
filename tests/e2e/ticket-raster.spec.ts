import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

type Variant = { width: number; height: number; format: string; path: string };
const delivery = JSON.parse(readFileSync("content/image-delivery.manifest.json", "utf8")) as {
  sources: { sourcePath: string; variants: Variant[] }[];
};

async function bitmap(page: Page, selector = ".question-image-frame") {
  const frame = page.locator(selector).first();
  await expect(frame.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      frame
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  return frame.evaluate(async (element) => {
    const image = element.querySelector("img")!;
    const bounds = image.getBoundingClientRect();
    const decoded = await createImageBitmap(await (await fetch(image.currentSrc)).blob());
    const result = {
      source: element.getAttribute("data-ticket-source"),
      currentSrc: new URL(image.currentSrc).pathname.slice(1),
      sizes: image.sizes,
      intrinsicWidth: image.width,
      width: bounds.width,
      height: bounds.height,
      frameWidth: element.clientWidth,
      frameHeight: element.clientHeight,
      encodedWidth: decoded.width,
      encodedHeight: decoded.height,
      dpr: devicePixelRatio,
    };
    decoded.close();
    return result;
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999999;
  });
});

test("fresh DPR1/2 mobile slots and a desktop 620px slot select sufficient encoded widths", async ({
  browser,
  baseURL,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium", "explicit density matrix runs once");
  const wide = delivery.sources.find((source) =>
    source.variants.some((variant) => variant.width === 1240 && variant.height < 600),
  )!;
  const questions = JSON.parse(
    readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"),
  ) as { id: string; image?: { localPath: string } }[];
  const question = questions.find((item) => item.image?.localPath === wide.sourcePath)!;
  const evidence = [];
  for (const dpr of [1, 2]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 900 },
      deviceScaleFactor: dpr,
    });
    try {
      const page = await context.newPage();
      await page.goto(baseURL!);
      await page.getByPlaceholder("Поиск по испанскому, русскому, теме").fill(question.id);
      await expect(page.locator(".question-image-frame")).toHaveAttribute(
        "data-ticket-source",
        wide.sourcePath,
      );
      for (const viewport of [390, 1280]) {
        await page.setViewportSize({ width: viewport, height: 900 });
        const actual = await bitmap(page);
        const variant = wide.variants.find((item) => item.path === actual.currentSrc)!;
        expect(actual.dpr).toBe(dpr);
        expect(variant.width).toBeGreaterThanOrEqual(Math.floor(actual.width * dpr));
        if (viewport === 390) expect(variant.width).toBeLessThanOrEqual(800);
        if (viewport === 1280 && dpr === 2) expect(variant.width).toBe(1240);
        evidence.push({ viewport, ...actual });
      }
    } finally {
      await context.close();
    }
  }
  await testInfo.attach("explicit-dpr1-dpr2.json", {
    body: JSON.stringify(evidence, null, 2),
    contentType: "application/json",
  });
});

test("ticket pictures choose actual container/DPR variants and preserve rapid navigation geometry", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const measurements = [];
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const actual = await bitmap(page);
    const source = delivery.sources.find((item) => item.sourcePath === actual.source)!;
    const selected = source.variants.find((variant) => variant.path === actual.currentSrc)!;
    expect(selected).toBeTruthy();
    expect(selected.format).toBe("avif");
    expect(actual.encodedWidth).toBe(selected.width);
    expect(actual.encodedHeight).toBe(selected.height);
    expect(Math.abs(Number.parseFloat(actual.sizes) - actual.frameWidth)).toBeLessThanOrEqual(1);
    expect(actual.height).toBeLessThanOrEqual(361);
    expect(Math.abs(actual.frameHeight - actual.height)).toBeLessThanOrEqual(1);
    expect(Math.abs(actual.frameWidth - actual.width)).toBeLessThanOrEqual(1);
    // Browsers can retain a previously fetched larger candidate after shrinking.
    const ceiling = Math.max(...source.variants.map((variant) => variant.width));
    expect(selected.width).toBeGreaterThanOrEqual(
      Math.min(ceiling, Math.floor(actual.width * actual.dpr)),
    );
    measurements.push(actual);
  }
  const card = page.getByTestId("question-card");
  const next = card.locator(".question-flow-nav").getByRole("button", { name: "Следующий" });
  for (let step = 0; step < 4; step++) await next.click();
  const current = await bitmap(page);
  expect(current.source).not.toBe(measurements[0].source);
  expect(Math.abs(current.frameHeight - current.height)).toBeLessThanOrEqual(1);
  await testInfo.attach("slot-dpr-currentSrc.json", {
    body: JSON.stringify({ measurements, rapidNavigation: current }, null, 2),
    contentType: "application/json",
  });
  await page.screenshot({ path: testInfo.outputPath("ticket-responsive.png") });
});

test("delayed ticket decode reserves geometry and unsupported sources use JPEG", async ({
  page,
}, testInfo) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/content/img/c/**", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const frame = page.locator(".question-image-frame").first();
  await expect(frame).toBeVisible();
  const before = await frame.boundingBox();
  expect(before?.height).toBeGreaterThan(100);
  release();
  const decoded = await bitmap(page);
  const after = await frame.boundingBox();
  expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(after!.width - before!.width)).toBeLessThanOrEqual(1);
  await frame.locator("source").evaluateAll((sources) =>
    sources.forEach((source) => {
      source.type = "image/x-unsupported-test-codec";
    }),
  );
  await expect
    .poll(() =>
      frame
        .locator("img")
        .evaluate((image: HTMLImageElement) =>
          image.currentSrc ? new URL(image.currentSrc).pathname : "",
        ),
    )
    .toMatch(/\.jpg$/);
  const jpeg = await bitmap(page);
  expect(jpeg.encodedWidth).toBeGreaterThan(0);
  await testInfo.attach("delayed-decode-and-jpeg.json", {
    body: JSON.stringify({ before, decoded, jpeg }, null, 2),
    contentType: "application/json",
  });
});

test("Materials/manual pictures keep the 300px height cap and decode responsive derivatives", async ({
  page,
}, testInfo) => {
  await page.goto("/#manual-section-app1-safety-elements");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await appendix.getByText(/Показать билеты/).click();
  const selector = "[data-testid='manual-ticket-appendix'] .question-image-frame";
  await page.locator(selector).first().scrollIntoViewIfNeeded();
  const actual = await bitmap(page, selector);
  expect(actual.height).toBeLessThanOrEqual(301);
  expect(actual.currentSrc).toMatch(/^content\/img\/c\/.*\.avif$/);
  expect(Math.abs(Number.parseFloat(actual.sizes) - actual.frameWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(actual.frameHeight - actual.height)).toBeLessThanOrEqual(1);
  await testInfo.attach("materials-slot.json", {
    body: JSON.stringify(actual, null, 2),
    contentType: "application/json",
  });
  await page
    .locator(selector)
    .first()
    .screenshot({ path: testInfo.outputPath("materials-ticket.png") });
});
