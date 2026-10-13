#!/usr/bin/env node
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  lstatSync,
  readdirSync,
  readFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function guardParents(root, relative) {
  let current = root;
  for (const part of relative.split("/")) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink())
      throw new Error(`Asset copy refuses symlink: ${current}`);
  }
}
function copyDerivatives(source, target) {
  if (
    lstatSync(source).isSymbolicLink() ||
    (existsSync(target) && lstatSync(target).isSymbolicLink())
  )
    throw new Error("Derivative copy refuses symlinks");
  if (lstatSync(source).isDirectory()) {
    mkdirSync(target, { recursive: true });
    for (const name of readdirSync(source)) copyDerivatives(join(source, name), join(target, name));
  } else {
    if (!/-\d+\.[a-f0-9]{8}\.(avif|webp|jpg)$/.test(source))
      throw new Error(`Unexpected derived raster payload: ${source}`);
    if (existsSync(target) && !readFileSync(source).equals(readFileSync(target)))
      throw new Error(`Derivative delivery collision: ${target}`);
    cpSync(source, target);
  }
}
export function syncPublicAssets(root) {
  for (const relative of [
    "content/assets",
    "content/assets-derived/img",
    "public/content/assets",
    "public/content/img",
  ])
    guardParents(root, relative);
  const source = join(root, "content/assets");
  const target = join(root, "public/content/assets");
  if (existsSync(source)) {
    mkdirSync(dirname(target), { recursive: true });
    rmSync(target, { recursive: true, force: true });
    cpSync(source, target, { recursive: true });
  }
  const derivatives = join(root, "content/assets-derived/img");
  if (existsSync(derivatives)) copyDerivatives(derivatives, join(root, "public/content/img"));
  console.log(
    "Synced canonical assets and persistent raster derivatives (masters/SVG audit excluded).",
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  syncPublicAssets(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
