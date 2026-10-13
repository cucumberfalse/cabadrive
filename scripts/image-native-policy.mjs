import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
export const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const nativePins = { dssim: "3.4.0", ssimulacra2: "0.5.2" };
export const nativeChecksums = {
  dssim: "7eaa333e059ea555ff38041ef8245d9b9207a208ed221126a516b840a7a5562f",
  ssimulacra2_rs: "364369f363935c619d4ea749ca38a9ba2143ce80fe2910cdb09b2d0cc291a310",
};
export const reviewedLockPaths = {
  dssim: join(repositoryRoot, "scripts/image-qa-locks/dssim-3.4.0/Cargo.lock"),
  ssimulacra2: join(repositoryRoot, "scripts/image-qa-locks/ssimulacra2_rs-0.5.2/Cargo.lock"),
};
const lockHash = (key) =>
  createHash("sha256").update(readFileSync(reviewedLockPaths[key])).digest("hex");
export function nativeIdentity() {
  return {
    dssim: {
      version: nativePins.dssim,
      sourceSha256: nativeChecksums.dssim,
      lockSha256: lockHash("dssim"),
      features: "default",
    },
    ssimulacra2: {
      version: nativePins.ssimulacra2,
      sourceSha256: nativeChecksums.ssimulacra2_rs,
      lockSha256: lockHash("ssimulacra2"),
      features: "--no-default-features",
    },
  };
}
