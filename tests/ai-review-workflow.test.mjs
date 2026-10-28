import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(
  new URL("../.github/workflows/ai-review.yml", import.meta.url),
  "utf8",
);
const gate = readFileSync(new URL("../scripts/ai-review-gate.mjs", import.meta.url), "utf8");

const validatorSha = "af97cca5edb69a47ead5c5e9675da0677c8fed3d";
const candidateSha = "b".repeat(40);
const upstream = "cucumberfalse/cabadrive";
const fork = "kiaquila/cabadrive";
const evaluator = workflow.split("  ai-review:\n")[1];

function inlineScript(name) {
  const step = workflow.split(`- name: ${name}\n`)[1]?.split(/\n {6}- name:/)[0];
  const script = step?.match(/node --input-type=module <<'NODE'\n([\s\S]*?)\n {10}NODE/);
  assert.ok(script, `Missing executable inline step ${name}`);
  return script[1].replace(/^ {10}/gm, "").replace(/^import .*;\n/gm, "");
}

async function executeStep(name, env = {}, overrides = {}) {
  const output = [];
  const messages = [];
  const process = { env, exitCode: 0 };
  const run = new (Object.getPrototypeOf(async function () {}).constructor)(
    "readFileSync",
    "appendFileSync",
    "existsSync",
    "execFileSync",
    "fetch",
    "process",
    "console",
    inlineScript(name),
  );
  await run(
    () => JSON.stringify(overrides.event || event()),
    (_path, text) => output.push(text),
    overrides.existsSync || (() => true),
    overrides.execFileSync ||
      ((_command, args) =>
        args[0] === "remote" ? `https://github.com/${upstream}` : validatorSha + "\n"),
    overrides.fetch ||
      (() => {
        throw new Error("Unexpected API access");
      }),
    process,
    Object.fromEntries(["log", "warn", "error"].map((key) => [key, (text) => messages.push(text)])),
  );
  return { status: process.exitCode, output: output.join(""), messages: messages.join("\n") };
}

function event(number = 221, headRepository = fork) {
  return {
    repository: { full_name: upstream, default_branch: "main" },
    pull_request: {
      number,
      state: "open",
      draft: false,
      head: {
        sha: candidateSha,
        ref: "codex/native-review-compatibility",
        repo: { full_name: headRepository },
      },
      base: { repo: { full_name: upstream } },
    },
  };
}
function environment(extra = {}) {
  return {
    GITHUB_EVENT_PATH: "/event",
    GITHUB_OUTPUT: "/output",
    GITHUB_EVENT_NAME: "pull_request",
    GITHUB_REPOSITORY: upstream,
    GITHUB_RUN_ATTEMPT: "1",
    GITHUB_REF: "refs/heads/main",
    GITHUB_WORKFLOW_REF: `${upstream}/.github/workflows/ai-review.yml@refs/heads/main`,
    TRIGGER_RESULT: "skipped",
    SELECTED_AGENT: "codex",
    ...extra,
  };
}

test("F42 actual evaluator is uniquely read-only and never receives the custom review secret", () => {
  assert.ok(evaluator, "Missing evaluator job");
  assert.equal((workflow.match(/^ {4}name: AI Review$/gm) || []).length, 1);
  assert.match(evaluator, /needs: normal-trigger/);
  assert.match(evaluator, /always\(\)/);
  assert.match(evaluator, /contents: read\n {6}pull-requests: read\n {6}issues: read/);
  assert.doesNotMatch(
    evaluator,
    /secrets\.|issues: write|checks: write|statuses: write|pnpm|npm install/,
  );
  assert.match(evaluator, /persist-credentials: false/);
  assert.match(evaluator, /AI_REVIEW_TRIGGER_MODE: skip/);
  assert.match(evaluator, /GITHUB_TOKEN: \$\{\{ github.token \}\}/);
  assert.match(evaluator, /name: Route and validate selected native review/);
});

test("F42 actual context pins only PR221 upstream fork while binding the new PR head", async () => {
  const result = await executeStep(
    "Select trusted validator context",
    environment({ AI_REVIEW_VALIDATOR_REF: candidateSha }),
  );
  assert.equal(result.status, 0, result.messages);
  assert.match(result.output, new RegExp(`validator_ref=${validatorSha}`));
  assert.match(result.output, /validator_repository=cucumberfalse\/cabadrive/);
  assert.match(result.output, /bootstrap=true/);
  for (const [context, env] of [
    [event(222), environment()],
    [event(222, upstream), environment()],
    [
      (() => {
        const other = event();
        other.repository.full_name = "other/repo";
        other.pull_request.base.repo.full_name = "other/repo";
        return other;
      })(),
      environment({ GITHUB_REPOSITORY: "other/repo" }),
    ],
    [event(), environment({ GITHUB_EVENT_NAME: "workflow_dispatch", REQUESTED_PR_NUMBER: "221" })],
  ]) {
    const normal = await executeStep("Select trusted validator context", env, { event: context });
    assert.equal(normal.status, 0, normal.messages);
    assert.match(normal.output, /validator_ref=main/);
    assert.match(normal.output, /bootstrap=false/);
  }
  const rerun = await executeStep(
    "Select trusted validator context",
    environment({ GITHUB_RUN_ATTEMPT: "2" }),
  );
  assert.equal(rerun.status, 0, rerun.messages);
  assert.match(rerun.output, new RegExp(`validator_ref=${validatorSha}`));
});

test("F42 actual context fails malformed bootstrap identity and failed trigger dependencies", async () => {
  const badContexts = [event(221, upstream), event(221, "other/repo"), event(), event(), event()];
  badContexts[3].pull_request.head.ref = "untrusted";
  badContexts[4].pull_request.number = 0;
  badContexts[2].pull_request.head.sha = "abc";
  for (const context of badContexts) {
    const result = await executeStep("Select trusted validator context", environment(), {
      event: context,
    });
    assert.notEqual(result.status, 0);
  }
  for (const extra of [
    { TRIGGER_RESULT: "failure" },
    { TRIGGER_RESULT: "cancelled" },
    { TRIGGER_RESULT: "unknown" },
    { GITHUB_RUN_ATTEMPT: "0" },
    { GITHUB_RUN_ATTEMPT: "invalid" },
    { SELECTED_AGENT: "unknown" },
    { GITHUB_EVENT_NAME: "workflow_dispatch", REQUESTED_PR_NUMBER: "-1" },
  ])
    assert.notEqual(
      (await executeStep("Select trusted validator context", environment(extra))).status,
      0,
    );
  for (const TRIGGER_RESULT of ["success", "skipped"])
    assert.equal(
      (await executeStep("Select trusted validator context", environment({ TRIGGER_RESULT })))
        .status,
      0,
    );
});

test("F42 pinned checkout identity and every transitive module fail closed", async () => {
  const env = environment({
    BOOTSTRAP: "true",
    VALIDATOR_REF: validatorSha,
    VALIDATOR_REPOSITORY: upstream,
  });
  assert.equal((await executeStep("Check trusted gate script availability", env)).status, 0);
  assert.notEqual(
    (
      await executeStep("Check trusted gate script availability", env, {
        execFileSync: (_command, args) =>
          args[0] === "remote" ? `https://github.com/${upstream}` : candidateSha,
      })
    ).status,
    0,
  );
  assert.notEqual(
    (
      await executeStep("Check trusted gate script availability", env, {
        execFileSync: () => "https://github.com/other/repo",
      })
    ).status,
    0,
  );
  for (const missing of [
    "scripts/resolve-pr-context.mjs",
    "scripts/ai-review-gate.mjs",
    "scripts/ai-review-helpers.mjs",
    "scripts/ai-review-api.mjs",
    "scripts/shared.mjs",
    ".unicorn-hub/config.json",
  ]) {
    const result = await executeStep("Check trusted gate script availability", env, {
      existsSync: (path) => path !== missing,
    });
    assert.notEqual(result.status, 0, missing);
  }
  const ordinary = await executeStep(
    "Check trusted gate script availability",
    environment({ BOOTSTRAP: "false" }),
    { existsSync: () => false },
  );
  assert.equal(ordinary.status, 0);
  assert.match(ordinary.output, /available=false/);
});

const triggerJob = workflow.split("  normal-trigger:\n")[1]?.split("  ai-review:\n")[0];
function triggerJobAllows(eventName, context, attempt = 1) {
  const condition = triggerJob.match(/ {4}if: \|\n([\s\S]*?) {4}permissions:/)[1].trim();
  return Boolean(
    Function(
      "github",
      `return (${condition});`,
    )({
      event_name: eventName,
      event: context,
      repository: context.repository.full_name,
      run_attempt: attempt,
    }),
  );
}
async function trigger(extra = {}, options = {}) {
  const calls = [];
  let pullCount = 0;
  const context = options.event || event(222, upstream);
  const result = await executeStep(
    "Request selected native review",
    environment({
      HAS_AI_REVIEW_GITHUB_TOKEN: "true",
      GITHUB_TOKEN: "test-token",
      ...extra,
    }),
    {
      event: context,
      fetch: async (url, request) => {
        calls.push({ url, ...request });
        let payload = {};
        let status = 200;
        if (request.method === "POST") status = options.postStatus || 201;
        else if (url.includes("/contents/")) status = options.contentStatus || 200;
        else if (url.endsWith(`/pulls/${context.pull_request.number}`)) {
          payload = structuredClone(context.pull_request);
          pullCount += 1;
          options.changePull?.(payload, pullCount);
        } else throw new Error(`Unexpected API URL: ${url}`);
        return { ok: status < 400, status, json: async () => payload };
      },
    },
  );
  return { ...result, calls, posts: calls.filter((call) => call.method === "POST") };
}

test("F42 trigger job never runs on bootstrap, fork automatic requests, or reruns", async () => {
  assert.doesNotMatch(triggerJob, /uses:|checkout@|node scripts|npm|pnpm/);
  assert.match(triggerJob, /issues: write/);
  assert.match(triggerJob, /secrets.AI_REVIEW_GITHUB_TOKEN/);
  for (const context of [event(), event(222)]) {
    assert.equal(triggerJobAllows("pull_request", context), false);
    const result = await trigger({}, { event: context });
    assert.equal(result.status, 0, result.messages);
    assert.equal(result.calls.length, 0);
  }
  assert.equal(triggerJobAllows("pull_request", event(222, upstream), 2), false);
  assert.equal(triggerJobAllows("pull_request", event(222, upstream)), true);
  assert.equal(triggerJobAllows("workflow_dispatch", event(222, upstream)), true);
  assert.equal((await trigger({ GITHUB_RUN_ATTEMPT: "2" })).calls.length, 0);
  assert.equal((await trigger({ HAS_AI_REVIEW_GITHUB_TOKEN: "false" })).calls.length, 0);
});

test("F42 static trigger retains all selected backends and read-only checks before POST", async () => {
  for (const [SELECTED_AGENT, body] of [
    ["codex", `@codex review ${candidateSha}`],
    ["claude", "@claude review once"],
    ["gemini", "/gemini review"],
  ]) {
    const result = await trigger({ SELECTED_AGENT });
    assert.equal(result.status, 0, result.messages);
    assert.equal(result.posts.length, 1);
    assert.equal(result.calls.filter((call) => call.url.endsWith("/pulls/222")).length, 2);
    assert.equal(result.calls.at(-1).method, "POST");
    assert.ok(JSON.parse(result.posts[0].body).body.startsWith(body + "\n"));
    assert.match(result.posts[0].url, /\/issues\/222\/comments$/);
  }
  const absent = await trigger({}, { contentStatus: 404 });
  assert.equal(absent.status, 0, absent.messages);
  assert.equal(absent.posts.length, 0);
  assert.equal((await trigger({}, { contentStatus: 500 })).status, 1);
});

test("F42 static dispatch trigger accepts only trusted default workflow/ref and explicit modes", async () => {
  const dispatch = {
    GITHUB_EVENT_NAME: "workflow_dispatch",
    REQUESTED_PR_NUMBER: "222",
    REQUESTED_TRIGGER_MODE: "comment",
  };
  assert.equal((await trigger(dispatch)).posts.length, 1);
  assert.equal((await trigger({ ...dispatch, REQUESTED_TRIGGER_MODE: "skip" })).calls.length, 0);
  for (const extra of [
    { GITHUB_REF: "refs/heads/untrusted" },
    { GITHUB_WORKFLOW_REF: `${upstream}/.github/workflows/ai-review.yml@refs/heads/untrusted` },
    { REQUESTED_TRIGGER_MODE: "invalid" },
    { REQUESTED_PR_NUMBER: "-1" },
    { REQUESTED_PR_NUMBER: "9007199254740992" },
  ]) {
    const result = await trigger({ ...dispatch, ...extra });
    assert.notEqual(result.status, 0);
    assert.equal(result.posts.length, 0);
  }
});

test("F42 static trigger fails live identity races before POST and handles only POST403 as warn-and-wait", async () => {
  for (const change of [
    (pull) => {
      pull.head.sha = "c".repeat(40);
    },
    (pull) => {
      pull.state = "closed";
    },
    (pull) => {
      pull.draft = true;
    },
    (pull) => {
      pull.base.repo.full_name = "other/repo";
    },
    (pull) => {
      pull.head.repo.full_name = fork;
    },
    (pull) => {
      pull.number = 223;
    },
    (pull) => {
      pull.head.ref = "other";
    },
  ]) {
    const result = await trigger(
      {},
      {
        changePull: (pull, count) => {
          if (count === 2) change(pull);
        },
      },
    );
    assert.equal(result.status, 1, result.messages);
    assert.equal(result.posts.length, 0);
  }
  for (const extra of [
    { SELECTED_AGENT: "unknown" },
    { GITHUB_RUN_ATTEMPT: "0" },
    { GITHUB_REPOSITORY: "other/repo" },
  ]) {
    const result = await trigger(extra);
    assert.equal(result.status, 1);
    assert.equal(result.posts.length, 0);
  }
  const denied = await trigger({}, { postStatus: 403 });
  assert.equal(denied.status, 0, denied.messages);
  assert.match(denied.messages, /waiting for existing or human-triggered/);
  assert.equal((await trigger({}, { postStatus: 500 })).status, 1);
});

test("AI Review gate handles trigger comment permission denial without a stack trace", () => {
  assert.match(gate, /Could not post AI Review trigger comment/);
  assert.match(gate, /error\.status !== 403/);
  assert.match(gate, /waiting for existing or human-triggered review evidence/);
  assert.match(gate, /throw error/);
});

test("AI Review gate ignores resolved Codex root findings without filtering by request or head", () => {
  assert.match(gate, /api.resolvedCommentIds\(number\)/);
  assert.match(gate, /!comment.in_reply_to_id && !resolvedIds.has\(comment.id\)/);
});

const wakeup = readFileSync(
  new URL("../.github/workflows/ai-review-wakeup.yml", import.meta.url),
  "utf8",
);
const signalWorkflow = readFileSync(
  new URL("../.github/workflows/ai-review-native-signal.yml", import.meta.url),
  "utf8",
);
const condition = wakeup.match(/ {4}if: \|\n([\s\S]*?) {4}runs-on:/)[1].trim();
function workflowAllows(eventName, event) {
  const github = {
    event_name: eventName,
    event: {
      comment: { user: { login: "" }, body: "" },
      review: { user: { login: "" } },
      issue: {},
      ...event,
    },
  };
  return Boolean(
    Function(
      "github",
      "contains",
      `return (${condition});`,
    )(github, (body, marker) => String(body).toLowerCase().includes(marker.toLowerCase())),
  );
}

test("actual wakeup workflow filter admits created/edited/deleted receipt, summary, and whitespace legacy", () => {
  assert.match(wakeup, /issue_comment:\s*types: \[created, edited, deleted\]/);
  for (const action of ["created", "edited"])
    for (const body of [
      "Codex Review: clean",
      " \nCodex Review: clean",
      "<!-- codex-review-receipt:v1 -->",
      "<!-- codex-pull-request-review-summary -->",
      "<!-- codex-review-state:v1 {} -->",
    ]) {
      assert.equal(
        workflowAllows("issue_comment", {
          action,
          issue: { pull_request: {} },
          comment: { body, user: { login: "chatgpt-codex-connector[bot]" } },
        }),
        true,
      );
    }
  assert.equal(
    workflowAllows("issue_comment", {
      issue: { pull_request: {} },
      comment: { body: "Codex Review:", user: { login: "owner" } },
    }),
    true,
  );
  assert.equal(
    workflowAllows("issue_comment", {
      comment: { body: "Codex Review:", user: { login: "chatgpt-codex-connector[bot]" } },
    }),
    false,
  );
});
test("coarse workflow routing admits configured identities and keeps unrelated text out", () => {
  for (const action of ["created", "edited"])
    for (const login of ["custom-codex", "CUSTOM-CODEX", "unknown"])
      for (const body of [
        "<!-- codex-review-receipt:v1 -->",
        "<!-- codex-pull-request-review-summary -->",
      ])
        assert.equal(
          workflowAllows("issue_comment", {
            action,
            issue: { pull_request: {} },
            comment: { body, user: { login } },
          }),
          true,
        );
  assert.equal(
    workflowAllows("issue_comment", {
      issue: { pull_request: {} },
      comment: { body: "unrelated", user: { login: "custom-codex" } },
    }),
    false,
  );
});
test("resolution schedules discover pinned PRs read-only and share direct-event per-PR serialization", () => {
  assert.match(wakeup, /schedule:\s*- cron: ["']\*\/15 \* \* \* \*["']/);
  assert.match(wakeup, /matrix:[\s\S]*fromJSON\(needs.context.outputs.pr_matrix\)/);
  assert.match(wakeup, /group: ai-review-wakeup-\$\{\{ matrix.pull.number \}\}/);
  assert.match(wakeup, /AI_REVIEW_PR_NUMBER: \$\{\{ matrix.pull.number \}\}/);
  assert.match(wakeup, /AI_REVIEW_HEAD_SHA: \$\{\{ matrix.pull.head_sha \}\}/);
  assert.match(wakeup, /github.event_name == 'schedule'/);
  assert.doesNotMatch(wakeup, /pull_request_review_thread/);
});

test("wakeup uses trusted default scripts and bot token with shared serialized completion backstop", () => {
  assert.match(
    wakeup,
    /workflow_run:\s*workflows: \[AI Review, AI Review Native Signal\]\s*types: \[completed\]/,
  );
  assert.match(signalWorkflow, /pull_request_review:\s*types: \[submitted, edited, dismissed\]/);
  assert.match(
    signalWorkflow,
    /pull_request_review_comment:\s*types: \[created, edited, deleted\]/,
  );
  assert.match(wakeup, /run: node scripts\/ai-review-wakeup\.mjs/);
  assert.match(wakeup, /ref: \$\{\{ github\.event\.repository\.default_branch \}\}/);
  assert.match(wakeup, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
  assert.match(wakeup, /needs\.context\.outputs\.pr_matrix/);
  assert.match(wakeup, /cancel-in-progress: false/);
  assert.doesNotMatch(
    wakeup,
    /workflow_dispatch|pull_request\.head\.ref|AI_REVIEW_GITHUB_TOKEN|actions\/github-script/,
  );
});

test("fork native signal bridge has no privileged execution or credentials", () => {
  assert.match(signalWorkflow, /permissions: \{\}/);
  assert.doesNotMatch(signalWorkflow, /uses:|checkout|secrets|GITHUB_TOKEN|node scripts/);
  assert.doesNotMatch(wakeup, /^ {2}pull_request_review(?:_comment)?:/m);
  assert.match(wakeup, /run: node scripts\/ai-review-wakeup\.mjs --resolve-only/);
  assert.match(wakeup, /group: ai-review-wakeup-\$\{\{ matrix.pull.number \}\}/);
});

for (const action of ["edited", "deleted"])
  test(`coarse issue filter admits ${action} withdrawal without native markers`, () => {
    assert.equal(
      workflowAllows("issue_comment", {
        action,
        issue: { pull_request: {} },
        comment: { body: "Withdrawn.", user: { login: "unknown" } },
      }),
      true,
    );
  });
