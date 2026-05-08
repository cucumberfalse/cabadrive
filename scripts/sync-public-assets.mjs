#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "content/assets");
const target = join(root, "public/content/assets");

if (!existsSync(source)) {
  console.log("No content assets to sync.");
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`Synced ${source} -> ${target}`);
