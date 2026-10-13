import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";
import { jsonBytes } from "../scripts/image-pipeline.mjs";

export async function fixturePng(profile, width = 2400, height = 640) {
  if (profile === "photo") {
    const pixels = Buffer.alloc(width * height * 3);
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 3;
        const hill = y > height * (0.52 + 0.1 * Math.sin(x / 210));
        const texture = ((x * 13 + y * 7) % 11) - 5;
        pixels[offset] = (hill ? 67 : 110) + (y / height) * 34 + texture;
        pixels[offset + 1] = (hill ? 103 : 170) + (y / height) * 20 + texture;
        pixels[offset + 2] = (hill ? 56 : 220) - (y / height) * 28 + texture;
      }
    return sharp(pixels, { raw: { width, height, channels: 3 } })
      .png()
      .toBuffer();
  }
  let shapes = "";
  for (let row = 0; row < 12; row++)
    for (let column = 0; column < 90; column++) {
      const x = 15 + column * 26;
      const y = 18 + row * 50;
      shapes += `<path d="M${x} ${y}v26h14v-12h-10M${x} ${y}h14" stroke="${row % 3 ? "#142a41" : "#ce2626"}" stroke-width="3" fill="none"/>`;
    }
  return sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="white"/>${shapes}</svg>`,
    ),
  )
    .png()
    .toBuffer();
}
export async function createRasterFixture(root, profiles = ["photo", "text"], width = 2400) {
  const sources = [];
  for (const profile of profiles) {
    const sourcePath = `content/assets/${profile}.jpg`;
    const masterPath = `content/assets-masters/${profile}.png`;
    await mkdir(dirname(join(root, sourcePath)), { recursive: true });
    await mkdir(dirname(join(root, masterPath)), { recursive: true });
    const png = await fixturePng(profile, width, width < 480 ? 160 : 640);
    await writeFile(join(root, masterPath), png);
    await writeFile(join(root, sourcePath), await sharp(png).jpeg().toBuffer());
    sources.push({
      sourcePath,
      masterPath,
      class: profile === "photo" ? "a" : "b",
      profile,
      targetWidth: width,
    });
  }
  await writeFile(
    join(root, "content/image-pipeline.sources.json"),
    jsonBytes({ schemaVersion: 1, sources }),
  );
  return sources;
}
