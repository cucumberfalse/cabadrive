import { defineConfig, devices } from "@playwright/test";

function defaultPortForWorktree() {
  let hash = 0;
  for (const character of process.cwd()) {
    hash = (hash * 31 + character.charCodeAt(0)) % 1000;
  }
  return 4300 + hash;
}

const port = Number(process.env.PLAYWRIGHT_PORT || defaultPortForWorktree());
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000
  },
  webServer: {
    command: `pnpm exec vite preview --host 0.0.0.0 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI && process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "1"
  },
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
