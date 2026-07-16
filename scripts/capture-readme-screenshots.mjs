import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const port = Number(process.env.README_SCREENSHOT_PORT || 4399);
const baseURL = `http://127.0.0.1:${port}`;
const outputDir = "docs_project/screens/readme";
const preview = spawn("pnpm", ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
  stdio: ["ignore", "pipe", "pipe"]
});

async function waitForPreview() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Vite preview did not become ready at ${baseURL}`);
}

async function capture(page, tabName, fileName) {
  await page.goto(baseURL, { waitUntil: "networkidle" });
  if (tabName !== "Учить") await page.getByRole("button", { name: tabName, exact: true }).click();
  await page.screenshot({ path: `${outputDir}/${fileName}`, animations: "disabled" });
}

try {
  await waitForPreview();
  mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await capture(page, "Учить", "learn.png");
  await capture(page, "Материалы", "materials.png");
  await capture(page, "О приложении", "about.png");
  await browser.close();
  console.log(`Captured 3 README screenshots at 1440x900 from ${baseURL}.`);
} finally {
  preview.kill("SIGTERM");
  await new Promise((resolve) => preview.once("exit", resolve));
}
