import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import {
  assertNoOpaqueBlackRegion,
  decodeRgbPng,
  encodeRgbPng,
} from "./png-opaque-black-check.mjs";

const port = Number(process.env.README_SCREENSHOT_PORT || 4399);
const baseURL = `http://127.0.0.1:${port}`;
const outputDir = process.env.README_SCREENSHOT_OUTPUT_DIR || "docs_project/screens/readme";
const forcePreviewExit = process.env.README_SCREENSHOT_FORCE_PREVIEW_EXIT === "1";
const previewCommand = forcePreviewExit ? process.execPath : "pnpm";
const previewArgs = forcePreviewExit
  ? ["-e", "process.exit(23)"]
  : ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"];
const preview = spawn(previewCommand, previewArgs, { stdio: ["ignore", "pipe", "pipe"] });
let previewExitState;
let previewStderr = "";
let previewStdout = "";
preview.stderr.on("data", (chunk) => {
  previewStderr += chunk.toString();
});

const previewReadyPromise = new Promise((resolve) => {
  preview.stdout.on("data", (chunk) => {
    previewStdout += chunk.toString();
    if (previewStdout.includes(baseURL)) resolve();
  });
});

const previewExitPromise = new Promise((resolve, reject) => {
  preview.once("error", reject);
  preview.once("exit", (code, signal) => {
    previewExitState = { code, signal };
    resolve(previewExitState);
  });
});

function currentExitState() {
  if (previewExitState) return previewExitState;
  if (preview.exitCode !== null || preview.signalCode !== null) {
    return { code: preview.exitCode, signal: preview.signalCode };
  }
  return undefined;
}

function earlyExitError(state) {
  const detail = state.signal ? `signal ${state.signal}` : `code ${state.code}`;
  const stderr = previewStderr.trim();
  return new Error(
    `Vite preview exited before readiness with ${detail}${stderr ? `: ${stderr}` : ""}`,
  );
}

async function waitForPreview() {
  let readinessTimer;
  try {
    await Promise.race([
      previewReadyPromise,
      previewExitPromise.then((state) => {
        throw earlyExitError(state);
      }),
      new Promise((_, reject) => {
        readinessTimer = setTimeout(
          () => reject(new Error(`Vite preview did not report readiness at ${baseURL}`)),
          10_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(readinessTimer);
  }
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const exited = currentExitState();
    if (exited) throw earlyExitError(exited);
    try {
      const response = await Promise.race([
        fetch(baseURL),
        previewExitPromise.then((state) => {
          throw earlyExitError(state);
        }),
      ]);
      if (response.ok) {
        const exitedAfterResponse = currentExitState();
        if (exitedAfterResponse) throw earlyExitError(exitedAfterResponse);
        return;
      }
    } catch {
      // The preview server is still starting.
    }
    await Promise.race([
      new Promise((resolve) => setTimeout(resolve, 200)),
      previewExitPromise.then((state) => {
        throw earlyExitError(state);
      }),
    ]);
  }
  throw new Error(`Vite preview did not become ready at ${baseURL}`);
}

async function settlePage(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.getBoundingClientRect().top < innerHeight)
        .map((image) => image.decode()),
    );
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function capture(browser, tabName, fileName) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    Math.random = () => 0.3141592653589793;
  });
  const page = await context.newPage();
  try {
    await page.goto(baseURL, { waitUntil: "load" });
    await page.addStyleTag({
      content:
        "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
    });
    if (tabName !== "Учить")
      await page
        .getByRole("button", { name: tabName, exact: true })
        .evaluate((button) => button.click());
    await settlePage(page);
    if (tabName === "О приложении") {
      await page.getByRole("heading", { name: "О приложении", exact: true }).waitFor();
      await page.getByText("v0.1.0", { exact: true }).waitFor();
      await page.getByText("unofficial_b_fallback", { exact: true }).waitFor();
    }
    const path = `${outputDir}/${fileName}`;
    await page.screenshot({ path });
    writeFileSync(path, encodeRgbPng(decodeRgbPng(readFileSync(path))));
    assertNoOpaqueBlackRegion(path);
  } finally {
    await context.close();
  }
}

let browser;
try {
  await waitForPreview();
  mkdirSync(outputDir, { recursive: true });
  browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
  await capture(browser, "Учить", "learn.png");
  await capture(browser, "Материалы", "materials.png");
  await capture(browser, "О приложении", "about.png");
  console.log(`Captured and pixel-checked 3 README screenshots at 1440x900 from ${baseURL}.`);
} finally {
  if (browser) await browser.close();
  if (!currentExitState()) preview.kill("SIGTERM");
  let exitTimer;
  try {
    await Promise.race([
      previewExitPromise,
      new Promise((_, reject) => {
        exitTimer = setTimeout(
          () => reject(new Error("Timed out waiting for Vite preview to exit")),
          5_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(exitTimer);
  }
}
