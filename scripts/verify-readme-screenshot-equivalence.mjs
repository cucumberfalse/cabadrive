import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { decodeRgbPng, findOpaqueBlackRegion } from "./png-opaque-black-check.mjs";

const execFileAsync = promisify(execFile);
const screenshotNames = ["learn.png", "materials.png", "about.png"];

export const roundedCornerMasks = {
  "learn.png": [
    { name: "question-pace lower-left rounded corner", x: 144, y: 553, width: 8, height: 9 },
    { name: "question image upper-left rounded corner", x: 144, y: 696, width: 8, height: 9 },
  ],
  "materials.png": [
    { name: "learning image upper-left rounded corner", x: 450, y: 631, width: 11, height: 11 },
    { name: "learning image upper-right rounded corner", x: 599, y: 631, width: 11, height: 11 },
    { name: "learning image lower-left rounded corner", x: 450, y: 738, width: 11, height: 11 },
    { name: "learning image lower-right rounded corner", x: 599, y: 738, width: 11, height: 11 },
  ],
  "about.png": [],
};

function insideMask(x, y, mask) {
  return x >= mask.x && x < mask.x + mask.width && y >= mask.y && y < mask.y + mask.height;
}

export function compareBoundedScreenshotPixels(first, second, masks, maximumDifferences = 16) {
  if (first.width !== second.width || first.height !== second.height) {
    throw new Error(
      `screenshot dimensions differ: ${first.width}x${first.height} versus ${second.width}x${second.height}`,
    );
  }
  const differences = [];
  for (let offset = 0; offset < first.pixels.length; offset += 3) {
    const delta = [0, 1, 2].map((channel) =>
      Math.abs(first.pixels[offset + channel] - second.pixels[offset + channel]),
    );
    if (delta.every((value) => value === 0)) continue;
    const pixel = offset / 3;
    const x = pixel % first.width;
    const y = Math.floor(pixel / first.width);
    const mask = masks.find((candidate) => insideMask(x, y, candidate));
    differences.push({ x, y, delta: [...delta, 0], mask: mask?.name });
    if (delta.some((value) => value > 1))
      throw new Error(`pixel (${x},${y}) exceeds per-channel delta 1: ${delta.join(",")}`);
    if (!mask) throw new Error(`pixel (${x},${y}) differs outside declared rounded-corner masks`);
    if (differences.length > maximumDifferences)
      throw new Error(`more than ${maximumDifferences} pixels differ`);
  }
  return differences;
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

async function captureTo(outputDir) {
  const port = await availablePort();
  await execFileAsync(process.execPath, ["scripts/capture-readme-screenshots.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      README_SCREENSHOT_OUTPUT_DIR: outputDir,
      README_SCREENSHOT_PORT: String(port),
    },
    timeout: 30_000,
  });
}

export async function verifyIndependentCaptures() {
  const root = mkdtempSync(join(tmpdir(), "cabadrive-readme-captures-"));
  const firstDir = join(root, "first");
  const secondDir = join(root, "second");
  try {
    await captureTo(firstDir);
    await captureTo(secondDir);
    const result = {};
    for (const name of screenshotNames) {
      const first = decodeRgbPng(readFileSync(join(firstDir, name)));
      const second = decodeRgbPng(readFileSync(join(secondDir, name)));
      for (const [label, image] of [
        ["first", first],
        ["second", second],
      ]) {
        const black = findOpaqueBlackRegion(image);
        if (black.found)
          throw new Error(`${name} ${label} capture contains an opaque-black region`);
      }
      result[name] = compareBoundedScreenshotPixels(first, second, roundedCornerMasks[name]);
    }
    return result;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await verifyIndependentCaptures();
  for (const name of screenshotNames)
    console.log(
      `${name}: ${result[name].length} differing pixel(s) ${JSON.stringify(result[name])}`,
    );
  console.log("Independent README captures satisfy bounded rounded-corner pixel equivalence.");
}
