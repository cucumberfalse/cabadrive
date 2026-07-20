import { spawn } from "node:child_process";

function run(command, args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: process.env, stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else
        reject(new Error(`${label} failed with ${signal ? `signal ${signal}` : `code ${code}`}`));
    });
  });
}

if (process.env.README_SCREENSHOT_FORCE_BUILD_FAILURE === "1") {
  await run(process.execPath, ["-e", "process.exit(24)"], "forced README screenshot SPA build");
} else {
  await run("pnpm", ["run", "build:app"], "README screenshot SPA build");
}

await run(
  process.execPath,
  ["scripts/capture-readme-screenshots.mjs"],
  "README screenshot capture",
);
await run("pnpm", ["run", "validate:attribution"], "README screenshot attribution validation");
