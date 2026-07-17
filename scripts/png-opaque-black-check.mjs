import { readFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const pngSignature = Buffer.from("89504e470d0a1a0a", "hex");

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

export function decodeRgbPng(buffer) {
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a")
    throw new Error("Not a PNG file");
  let offset = 8;
  let width;
  let height;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 2 || data[12] !== 0)
        throw new Error("Expected non-interlaced 8-bit RGB PNG");
    }
    if (type === "IDAT") idat.push(data);
    offset += 12 + length;
    if (type === "IEND") break;
  }
  if (!width || !height || idat.length === 0) throw new Error("PNG is missing IHDR or IDAT data");

  const bytesPerPixel = 3;
  const stride = width * bytesPerPixel;
  const filtered = inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(stride * height);
  let inputOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = filtered[inputOffset];
    inputOffset += 1;
    for (let x = 0; x < stride; x += 1) {
      const raw = filtered[inputOffset + x];
      const left = x >= bytesPerPixel ? pixels[y * stride + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upperLeft =
        y > 0 && x >= bytesPerPixel ? pixels[(y - 1) * stride + x - bytesPerPixel] : 0;
      let value;
      if (filter === 0) value = raw;
      else if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + up;
      else if (filter === 3) value = raw + Math.floor((left + up) / 2);
      else if (filter === 4) value = raw + paeth(left, up, upperLeft);
      else throw new Error(`Unsupported PNG filter ${filter}`);
      pixels[y * stride + x] = value & 0xff;
    }
    inputOffset += stride;
  }
  return { width, height, pixels };
}

export function encodeRgbPng({ width, height, pixels }) {
  const stride = width * 3;
  if (pixels.length !== stride * height)
    throw new Error("RGB pixel buffer has an unexpected length");
  const scanlines = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1)
    pixels.copy(scanlines, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    pngSignature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(scanlines, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

export function findOpaqueBlackRegion(
  { width, height, pixels },
  minimumWidth = 96,
  minimumHeight = 8,
) {
  const stride = width * 3;
  let consecutiveRows = 0;
  let maxConsecutiveRows = 0;
  let maxRunWidth = 0;
  for (let y = 0; y < height; y += 1) {
    let currentRun = 0;
    let rowMaxRun = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = y * stride + x * 3;
      const isBlack = pixels[offset] <= 2 && pixels[offset + 1] <= 2 && pixels[offset + 2] <= 2;
      currentRun = isBlack ? currentRun + 1 : 0;
      rowMaxRun = Math.max(rowMaxRun, currentRun);
    }
    maxRunWidth = Math.max(maxRunWidth, rowMaxRun);
    consecutiveRows = rowMaxRun >= minimumWidth ? consecutiveRows + 1 : 0;
    maxConsecutiveRows = Math.max(maxConsecutiveRows, consecutiveRows);
  }
  return {
    found: maxRunWidth >= minimumWidth && maxConsecutiveRows >= minimumHeight,
    maxRunWidth,
    maxConsecutiveRows,
  };
}

export function assertNoOpaqueBlackRegion(path) {
  const result = findOpaqueBlackRegion(decodeRgbPng(readFileSync(path)));
  if (result.found) {
    throw new Error(
      `${path}: unexplained opaque-black rectangle detected (${result.maxRunWidth}px run across ${result.maxConsecutiveRows} consecutive rows)`,
    );
  }
  return result;
}
