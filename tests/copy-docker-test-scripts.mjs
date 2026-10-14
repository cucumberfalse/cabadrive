import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Test-only: enumerate names before touching entries so concurrent removal of
// the quality test's one ephemeral root sentinel cannot race a recursive stat.
export function copyDockerTestScripts(source, destination, afterEnumeration = () => {}) {
  source = source instanceof URL ? fileURLToPath(source) : source;
  const names = readdirSync(source).filter((name) => name !== "__quality_format_sentinel.mjs");
  afterEnumeration();
  mkdirSync(destination, { recursive: true });
  for (const name of names)
    cpSync(join(source, name), join(destination, name), { recursive: true });
}
