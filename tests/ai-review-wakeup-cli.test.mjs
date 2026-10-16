import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = "owner/repo";
const head = "2667f79cd7676ff331730cabf661d38dbbcddb0d";
const other = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const root = fileURLToPath(new URL("../", import.meta.url));
const script = join(root, "scripts/ai-review-wakeup.mjs");
const workflow = readFileSync(
  new URL("../.github/workflows/ai-review-wakeup.yml", import.meta.url),
  "utf8",
);
const matrixFields = Object.fromEntries(
  [
    ...workflow.matchAll(
      /^ {10}(AI_REVIEW_[A-Z_]+): \$\{\{ matrix\.pull\.(number|head_sha) \}\}$/gm,
    ),
  ].map(([, name, field]) => [name, field]),
);

// Only the child CLI's API and clock are mocked. Its actual executable, environment
// parsing, read-only matrix output, config, router and checkpoint lifecycle run.
async function installApiFixture({ repository, head, number, native, withdrawal, resultPath }) {
  const { writeFileSync } = await import("node:fs");
  const root = `/repos/${repository}`;
  const at = "2026-10-15T12:00:00Z";
  let current = Date.parse(at) + 500;
  Date.now = () => current;
  globalThis.setTimeout = (callback, delay) => {
    current += delay;
    callback();
    return 0;
  };
  const user = { login: "chatgpt-codex-connector[bot]", type: "Bot" };
  const pull = {
    number,
    state: "open",
    draft: false,
    head: { sha: head, ref: "feature", repo: { full_name: "contributor/fork" } },
    base: { ref: "main", repo: { full_name: repository } },
  };
  let run = {
    id: 100,
    workflow_id: 7,
    path: ".github/workflows/ai-review.yml",
    name: "AI Review",
    repository: { full_name: repository },
    event: "pull_request",
    pull_requests: [],
    head_repository: { full_name: "contributor/fork" },
    head_branch: "feature",
    head_sha: head,
    run_attempt: 1,
    run_started_at: "2026-10-15T11:59:00Z",
    status: "completed",
    conclusion: withdrawal ? "success" : "failure",
  };
  const source = {
    ...run,
    id: 88,
    workflow_id: 8,
    path: ".github/workflows/ai-review-native-signal.yml",
    name: "AI Review Native Signal",
    event: "pull_request_review",
    created_at: at,
    actor: user,
    triggering_actor: user,
  };
  const comment = {
    id: 1,
    user,
    issue_url: `https://api.github.com${root}/issues/${number}`,
    created_at: at,
    updated_at: at,
    body: `<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn't find any major issues.\n\n**Reviewed commit:** \`${head}\``,
  };
  let checkpoint = null;
  const requests = [];
  const mutations = [];
  process.on("exit", () => writeFileSync(resultPath, JSON.stringify({ requests, mutations })));
  globalThis.fetch = async (url, options = {}) => {
    const path = new URL(url).pathname;
    const method = options.method || "GET";
    requests.push({ path, method });
    if (["POST", "PATCH"].includes(method) && path !== "/graphql") mutations.push({ path, method });
    if (path === "/graphql")
      return Response.json({
        data: {
          repository: {
            pullRequest: {
              reviewThreads: { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } },
            },
          },
        },
      });
    if (path === `${root}/pulls/${number}`) return Response.json(pull);
    if (path === `${root}/pulls`) return Response.json([pull]);
    if (path === `${root}/actions/workflows/ai-review.yml`)
      return Response.json({ id: 7, name: "AI Review", path: ".github/workflows/ai-review.yml" });
    if (path === `${root}/actions/workflows/ai-review-native-signal.yml`)
      return Response.json({ id: 8, name: source.name, path: source.path });
    if (native && path === `${root}/actions/runs/88`) return Response.json(source);
    if (path === `${root}/actions/runs/100`) return Response.json(run);
    if (withdrawal && path === `${root}/actions/runs/100/attempts/1/jobs`)
      return Response.json({
        jobs: [
          {
            id: 200,
            run_id: 100,
            head_sha: head,
            name: "AI Review",
            status: "completed",
            conclusion: "success",
            started_at: "2026-10-15T11:59:01Z",
            completed_at: "2026-10-15T11:59:30Z",
            steps: [
              {
                name: "Route and validate selected native review",
                number: 4,
                status: "completed",
                conclusion: "success",
                started_at: "2026-10-15T11:59:02Z",
                completed_at: "2026-10-15T11:59:20Z",
              },
            ],
          },
        ],
      });
    if (withdrawal && path === `${root}/actions/jobs/200/logs`)
      return new Response(
        `2026-10-15T11:59:10.0000000Z AI Review gate passed for codex on ${head}.\n`,
      );
    if (withdrawal && path === `${root}/issues/comments/1`)
      return withdrawal === "deleted"
        ? new Response("Not Found", { status: 404 })
        : Response.json({ ...comment, body: "Withdrawn." });
    if (path === `${root}/actions/workflows/7/runs`) return Response.json({ workflow_runs: [run] });
    if ([`${root}/pulls/${number}/reviews`, `${root}/pulls/${number}/comments`].includes(path))
      return Response.json([]);
    if (path === `${root}/issues/${number}/comments` && method === "GET")
      return Response.json([...(withdrawal ? [] : [comment]), ...(checkpoint ? [checkpoint] : [])]);
    if (
      (path === `${root}/issues/${number}/comments` && method === "POST") ||
      (path === `${root}/issues/comments/900` && method === "PATCH")
    ) {
      checkpoint = {
        id: 900,
        user: { login: "github-actions[bot]", type: "Bot" },
        body: JSON.parse(options.body).body,
        updated_at: new Date(Math.floor(current / 1000) * 1000).toISOString(),
      };
      return Response.json(checkpoint);
    }
    if (path === `${root}/actions/runs/100/rerun` && method === "POST") {
      run = {
        ...run,
        run_attempt: run.run_attempt + 1,
        status: "queued",
        run_started_at: new Date(current).toISOString(),
      };
      return new Response(null, { status: 204 });
    }
    if (path === `${root}/commits/${head}`) return Response.json({ sha: head });
    throw new Error(`Unmocked CLI fixture request ${method} ${path}`);
  };
}

function runCli({ native = false, withdrawal = null, number = 12, pin, resolveOnly = false } = {}) {
  const directory = mkdtempSync(join(tmpdir(), "cabadrive-review-matrix-cli-"));
  try {
    const eventPath = join(directory, "event.json");
    const resultPath = join(directory, "result.json");
    const outputPath = join(directory, "output.txt");
    const preload = join(directory, "preload.mjs");
    writeFileSync(
      preload,
      `await (${installApiFixture.toString()})(${JSON.stringify({ repository, head, number, native, withdrawal, resultPath })});\n`,
    );
    writeFileSync(
      eventPath,
      JSON.stringify(
        withdrawal
          ? {
              action: withdrawal,
              repository: { full_name: repository },
              issue: { number, pull_request: {} },
              comment: {
                id: 1,
                user: { login: "chatgpt-codex-connector[bot]", type: "Bot" },
                issue_url: `https://api.github.com/repos/${repository}/issues/${number}`,
                created_at: "2026-10-15T12:00:00Z",
                updated_at: "2026-10-15T12:00:00Z",
                body: withdrawal === "deleted" ? "Codex Review: original receipt" : "Withdrawn.",
              },
              changes: { body: { from: "Codex Review: original receipt" } },
            }
          : {
              action: "completed",
              repository: { full_name: repository },
              workflow_run: {
                id: native ? 88 : 100,
                name: native ? "AI Review Native Signal" : "AI Review",
              },
            },
      ),
    );
    const env = {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      LANG: "C.UTF-8",
      GITHUB_TOKEN: "fixture-token-not-a-credential",
      GITHUB_REPOSITORY: repository,
      GITHUB_EVENT_NAME: withdrawal ? "issue_comment" : "workflow_run",
      GITHUB_EVENT_PATH: eventPath,
      GITHUB_OUTPUT: outputPath,
      AI_REVIEW_AGENT: "codex",
    };
    for (const [variable, field] of Object.entries(matrixFields))
      if (pin && Object.hasOwn(pin, field)) env[variable] = String(pin[field]);
    const result = spawnSync(
      process.execPath,
      ["--import", pathToFileURL(preload).href, script, ...(resolveOnly ? ["--resolve-only"] : [])],
      { cwd: root, env, encoding: "utf8", timeout: 10000 },
    );
    assert.equal(result.error, undefined);
    const observed = JSON.parse(readFileSync(resultPath, "utf8"));
    const matrix =
      resolveOnly && result.status === 0
        ? JSON.parse(readFileSync(outputPath, "utf8").match(/^pr_matrix=(.+)$/m)[1])
        : null;
    return { ...result, ...observed, matrix };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("actual CLI consumes both matrix fields from the workflow's serialized PR context", () => {
  assert.deepEqual(matrixFields, { AI_REVIEW_PR_NUMBER: "number", AI_REVIEW_HEAD_SHA: "head_sha" });
});
for (const native of [false, true]) {
  test(`actual CLI ${native ? "native" : "AI Review"} read-only context output pins its mutation delivery`, () => {
    const resolved = runCli({ native, resolveOnly: true });
    assert.equal(resolved.status, 0, resolved.stderr);
    assert.deepEqual(resolved.matrix, [{ number: 12, head_sha: head }]);
    assert.deepEqual(resolved.mutations, []);
    const delivered = runCli({ native, pin: resolved.matrix[0] });
    assert.equal(delivered.status, 0, delivered.stderr);
    assert.match(delivered.stdout, /rerun-confirmed/);
    assert.equal(delivered.mutations.length, 3);
    assert.equal(delivered.mutations.at(-1).path, `/repos/${repository}/actions/runs/100/rerun`);
  });
  for (const pin of [
    undefined,
    {},
    { number: 12 },
    { head_sha: head },
    { number: "not-a-number", head_sha: head },
    { number: 12, head_sha: head.slice(0, 10) },
    { number: 13, head_sha: head },
    { number: 12, head_sha: other },
  ])
    test(`actual CLI ${native ? "native" : "AI Review"} rejects missing/mismatched matrix fields ${JSON.stringify(pin)}`, () => {
      const delivered = runCli({ native, pin });
      assert.equal(delivered.status, 1);
      assert.match(delivered.stderr, /pinned .*context|pinned PR\/head/);
      assert.deepEqual(delivered.mutations, []);
    });
  test(`actual CLI ${native ? "native" : "AI Review"} rejects queued A pin after replacement B reuses its head`, () => {
    const resolvedA = runCli({ native, resolveOnly: true });
    const stale = runCli({ native, number: 13, pin: resolvedA.matrix[0] });
    assert.equal(stale.status, 1);
    assert.match(stale.stderr, /pinned PR\/head/);
    assert.deepEqual(stale.mutations, []);
    const resolvedB = runCli({ native, number: 13, resolveOnly: true });
    const current = runCli({ native, number: 13, pin: resolvedB.matrix[0] });
    assert.equal(current.status, 0, current.stderr);
    assert.equal(current.mutations[0].path, `/repos/${repository}/issues/13/comments`);
  });
}

for (const withdrawal of ["edited", "deleted"]) {
  test(`actual CLI ${withdrawal} withdrawal resolver pins full head and mutation reevaluates absence`, () => {
    const resolved = runCli({ withdrawal, resolveOnly: true });
    assert.equal(resolved.status, 0, resolved.stderr);
    assert.deepEqual(resolved.matrix, [{ number: 12, head_sha: head }]);
    assert.deepEqual(resolved.mutations, []);
    const delivered = runCli({ withdrawal, pin: resolved.matrix[0] });
    assert.equal(delivered.status, 0, delivered.stderr);
    assert.match(delivered.stdout, /rerun-confirmed/);
    assert.equal(delivered.mutations.length, 3);
  });
  for (const pin of [undefined, { number: 13, head_sha: head }, { number: 12, head_sha: other }])
    test(`actual CLI ${withdrawal} withdrawal rejects missing/mismatched pair ${JSON.stringify(pin)}`, () => {
      const result = runCli({ withdrawal, pin });
      assert.equal(result.status, 1);
      assert.deepEqual(result.mutations, []);
      assert.match(result.stderr, /pinned/);
    });
}
