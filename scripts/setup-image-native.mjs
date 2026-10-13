#!/usr/bin/env node
// Dependency-free installer shared by host/CI and the Alpine compiler stage.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile, copyFile, mkdtemp, rm } from "node:fs/promises";
import { join, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import {
  nativePins,
  nativeChecksums,
  nativeIdentity,
  reviewedLockPaths,
  repositoryRoot,
} from "./image-native-policy.mjs";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function command(args, environment) {
  await new Promise((done, reject) => {
    const child = spawn(args[0], args.slice(1), { stdio: "inherit", env: environment });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? done() : reject(new Error(`Native setup failed: ${args.join(" ")} (${code})`)),
    );
  });
}
async function cachedArchive(cargoHome, crate, version) {
  const cache = join(cargoHome, "registry/cache");
  if (!existsSync(cache)) return null;
  const registry = (await readdir(cache)).find((name) =>
    existsSync(join(cache, name, `${crate}-${version}.crate`)),
  );
  return registry ? readFile(join(cache, registry, `${crate}-${version}.crate`)) : null;
}
export async function installNative(root = join(repositoryRoot, ".cache/image-qa")) {
  await mkdir(root, { recursive: true });
  const cargoHome = join(root, "cargo");
  const environment = {
    ...process.env,
    CARGO_HOME: cargoHome,
    CARGO_TARGET_DIR: join(root, "target"),
  };
  const receiptPath = join(root, "install-receipt.json");
  const identity = nativeIdentity();
  const binaries = {};
  let oldReceipt;
  try {
    oldReceipt = JSON.parse(await readFile(receiptPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  for (const [crate, version, key] of [
    ["dssim", nativePins.dssim, "dssim"],
    ["ssimulacra2_rs", nativePins.ssimulacra2, "ssimulacra2"],
  ]) {
    const binary = join(root, "bin", crate);
    if (
      existsSync(binary) &&
      JSON.stringify(oldReceipt?.identity?.[key]) === JSON.stringify(identity[key]) &&
      oldReceipt?.binaries?.[key] === hash(await readFile(binary))
    ) {
      binaries[key] = oldReceipt.binaries[key];
      continue;
    }
    // Cargo's root-local registration establishes ownership; it refuses unknown
    // binaries. A stale same-version graph is explicitly uninstalled, not forced.
    if (existsSync(binary))
      await command(["cargo", "uninstall", "--root", root, crate], environment);
    {
      const scratch = await mkdtemp(join(root, "source-build-"));
      try {
        let bytes = await cachedArchive(cargoHome, crate, version);
        if (!bytes) {
          const response = await fetch(
            `https://static.crates.io/crates/${crate}/${crate}-${version}.crate`,
          );
          if (!response.ok) throw new Error(`Native source download failed (${response.status})`);
          bytes = Buffer.from(await response.arrayBuffer());
        }
        if (hash(bytes) !== nativeChecksums[crate])
          throw new Error(`${crate} source archive checksum mismatch`);
        const archive = join(scratch, "source.crate");
        await writeFile(archive, bytes);
        await command(["tar", "-xzf", archive, "-C", scratch], environment);
        const source = join(scratch, `${crate}-${version}`);
        await copyFile(reviewedLockPaths[key], join(source, "Cargo.lock"));
        await command(
          [
            "cargo",
            "install",
            "--path",
            source,
            "--locked",
            ...(key === "ssimulacra2" ? ["--no-default-features"] : []),
            "--root",
            root,
          ],
          environment,
        );
      } finally {
        await rm(scratch, { recursive: true, force: true });
      }
    }
    binaries[key] = hash(await readFile(binary));
  }
  await writeFile(receiptPath, `${JSON.stringify({ identity, binaries })}\n`);
  console.log(`Native source/lock/features verified: ${JSON.stringify(identity)}`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--root" || !isAbsolute(args[1])))
    throw new Error("Usage: setup-image-native.mjs [--root /absolute/owned-tool-root]");
  await installNative(args[1]);
}
