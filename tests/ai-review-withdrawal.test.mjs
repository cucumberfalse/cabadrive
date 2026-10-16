import test from "node:test";
import assert from "node:assert/strict";
import { routeReviewWakeup } from "../scripts/ai-review-wakeup.mjs";
import { createReviewApi } from "../scripts/ai-review-api.mjs";
import { runReviewGate } from "../scripts/ai-review-gate.mjs";

const head = "06773d28e808374cbbba8e93ebd7c5f0ec81211a";
const repo = "owner/repo";
const root = `/repos/${repo}`;
const bot = { login: "chatgpt-codex-connector[bot]", type: "Bot" };
const receipt = `<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn't find any major issues.\n\n**Reviewed commit:** \`${head}\``;
const iso = (minute) => `2026-10-16T12:${minute}:00.000Z`;
const comment = (body = receipt) => ({
  id: 44,
  user: bot,
  body,
  issue_url: `https://api.github.com${root}/issues/12`,
  created_at: iso("00"),
  updated_at: iso("10"),
});
function harness() {
  let clock = Date.parse(iso("30"));
  const h = {
    comments: [],
    reviews: [],
    inline: [],
    ledger: null,
    writes: 0,
    posts: 0,
    reads: [],
    pull: {
      number: 12,
      state: "open",
      draft: false,
      head: { sha: head, ref: "feature", repo: { full_name: repo } },
      base: { repo: { full_name: repo } },
    },
    run: {
      id: 100,
      workflow_id: 7,
      path: ".github/workflows/ai-review.yml",
      event: "pull_request",
      repository: { full_name: repo },
      head_repository: { full_name: repo },
      head_branch: "feature",
      head_sha: head,
      pull_requests: [{ number: 12 }],
      run_attempt: 1,
      run_started_at: iso("00"),
      status: "completed",
      conclusion: "success",
    },
    jobs: [
      {
        id: 200,
        run_id: 100,
        head_sha: head,
        name: "AI Review",
        status: "completed",
        conclusion: "success",
        started_at: iso("01"),
        completed_at: iso("05"),
        steps: [
          {
            name: "Route and validate selected native review",
            number: 4,
            status: "completed",
            conclusion: "success",
            started_at: iso("02"),
            completed_at: iso("04"),
          },
        ],
      },
    ],
    log: `2026-10-16T12:03:00.0000000Z AI Review gate passed for codex on ${head}.\r\n`,
    currentComment: null,
    onRead: () => {},
  };
  const api = (h.api = {
    root,
    async list(path) {
      h.reads.push(path);
      h.onRead(path);
      if (path.includes("/attempts/")) return structuredClone(h.jobs);
      if (path.includes("/runs?")) return [structuredClone(h.run)];
      if (path.endsWith("/reviews")) return structuredClone(h.reviews);
      if (path.includes("/pulls/") && path.endsWith("/comments")) return structuredClone(h.inline);
      return structuredClone([...h.comments, ...(h.ledger ? [h.ledger] : [])]);
    },
    async readJobLog(id) {
      h.reads.push(`log:${id}`);
      return h.log;
    },
    async resolvedCommentIds() {
      return new Set();
    },
    async request(path, options = {}) {
      h.reads.push(path);
      h.onRead(path, options);
      if (path.endsWith("/pulls/12")) return structuredClone(h.pull);
      if (path.endsWith("/workflows/ai-review.yml"))
        return { id: 7, name: "AI Review", path: ".github/workflows/ai-review.yml" };
      if (path.endsWith("/runs/100")) return structuredClone(h.run);
      if (path.includes("/commits/")) return { sha: head };
      if (path.endsWith("/rerun")) {
        h.posts++;
        h.run = {
          ...h.run,
          run_attempt: h.run.run_attempt + 1,
          status: "queued",
          run_started_at: new Date(clock).toISOString(),
        };
        return null;
      }
      if (options.method === "PATCH" || options.method === "POST") {
        h.writes++;
        h.ledger = {
          id: 900,
          user: { login: "github-actions[bot]", type: "Bot" },
          body: JSON.parse(options.body).body,
          updated_at: new Date(Math.floor(clock / 1000) * 1000).toISOString(),
        };
        return structuredClone(h.ledger);
      }
      if (path.endsWith("/issues/comments/44")) {
        if (h.currentComment) return structuredClone(h.currentComment);
        const e = new Error("Not Found");
        e.status = 404;
        throw e;
      }
      throw new Error(`Unexpected request ${path}`);
    },
  });
  h.event = (action = "edited") => ({
    action,
    repository: { full_name: repo },
    issue: { number: 12, pull_request: {} },
    comment: comment(action === "deleted" ? receipt : "Withdrawn."),
    changes: { body: { from: receipt } },
  });
  h.route = (options = {}) =>
    routeReviewWakeup({
      api,
      eventName: "schedule",
      event: { repository: { full_name: repo } },
      repository: repo,
      scheduledPull: { number: 12, head_sha: head },
      now: () => clock,
      sleep: async (ms) => {
        clock += ms;
      },
      ...options,
    });
  return h;
}

for (const action of ["edited", "deleted"]) {
  test(`withdrawal fail-first: initial accepted gate without ledger, sole receipt ${action}`, async () => {
    const h = harness();
    if (action === "edited") h.currentComment = comment("Withdrawn.");
    assert.equal(
      await h.route({ eventName: "issue_comment", event: h.event(action) }),
      "rerun-confirmed",
    );
    assert.equal(h.posts, 1);
    assert.equal(await h.route(), "already-evaluated");
    assert.equal(h.posts, 1);
  });
}
test("withdrawal fail-first: scheduled empty snapshot bootstraps actual accepted gate once", async () => {
  const h = harness();
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.posts, 1);
  assert.equal(await h.route(), "already-evaluated");
  assert.equal(h.posts, 1);
});
test("withdrawal fail-first: genuine positive creates one observation and no rerun", async () => {
  const h = harness();
  h.comments = [comment()];
  assert.equal(await h.route(), "observed-native-acceptance");
  assert.equal(h.writes, 1);
  assert.equal(h.posts, 0);
  assert.equal(await h.route(), "already-observed");
  assert.equal(h.writes, 1);
  h.comments = [];
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.posts, 1);
});

const ledgerValue = (h) => JSON.parse(h.ledger.body.match(/v2 (\{.*\}) -->$/)[1]);
const setLedgerValue = (h, value) => {
  h.ledger.body = `<!-- ai-review-wakeup:v2 ${JSON.stringify(value)} -->`;
};
const summary = () =>
  comment(
    `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify({ code_review: { commit_sha: head, status: "completed", has_any_findings: false, has_unresolved_findings: false }, security_review: { commit_sha: null, status: null, has_any_findings: null, has_unresolved_findings: null } })} -->\n\n## Codex Review Summary`,
  );
for (const action of ["edited", "deleted"])
  for (const remainder of ["empty", "neutral"]) {
    test(`observed acceptance survives ${action} to ${remainder}; finite history and stable absence dedup`, async () => {
      const h = harness();
      h.comments = [comment()];
      await h.route();
      assert.equal(ledgerValue(h).phase, "observed");
      h.comments = remainder === "empty" ? [] : [summary()];
      if (action === "edited") h.currentComment = comment("Withdrawn.");
      assert.equal(
        await h.route({ eventName: "issue_comment", event: h.event(action) }),
        "rerun-confirmed",
      );
      const value = ledgerValue(h);
      assert.ok(Number.isFinite(Date.parse(value.signal_updated_at)));
      assert.equal(value.acceptance.attempt, 1);
      assert.equal(value.phase, "posting");
      const hash = value.signal_hash;
      h.run.status = "completed";
      h.run.conclusion = "failure";
      assert.equal(await h.route(), "already-evaluated");
      assert.equal(ledgerValue(h).signal_hash, hash);
      assert.equal(h.posts, 1);
    });
  }
test("remaining genuine formal positive records observation without invalidation", async () => {
  const h = harness();
  h.reviews = [
    { id: 50, user: bot, commit_id: head, state: "COMMENTED", body: "", submitted_at: iso("10") },
  ];
  assert.equal(await h.route(), "observed-native-acceptance");
  assert.equal(h.posts, 0);
});
test("actual gate independently fails after historical acceptance loses its last positive", async () => {
  const h = harness();
  await h.route();
  assert.equal(
    await runReviewGate({
      api: h.api,
      number: 12,
      headSha: head,
      runAttempt: 2,
      maxWaitMs: 0,
      log: { log() {}, error() {}, warn() {} },
    }),
    false,
  );
  assert.equal(h.posts, 1);
});
for (const status of ["failure", "cancelled", "skipped", "active"])
  test(`no blind absence rerun for ${status} target`, async () => {
    const h = harness();
    h.run.conclusion = status;
    if (status === "active") h.run.status = "in_progress";
    assert.match(await h.route(), /no-signal|active-no-baseline/);
    assert.equal(h.posts + h.writes, 0);
  });
for (const [name, mutate] of [
  ["never accepted", (h) => (h.jobs = [])],
  ["duplicate jobs", (h) => h.jobs.push(structuredClone(h.jobs[0]))],
  ["wrong job name", (h) => (h.jobs[0].name = "Other")],
  ["wrong run", (h) => h.jobs[0].run_id++],
  ["wrong head", (h) => (h.jobs[0].head_sha = "a".repeat(40))],
  ["job failed", (h) => (h.jobs[0].conclusion = "failure")],
  ["bootstrap skipped step", (h) => (h.jobs[0].steps[0].conclusion = "skipped")],
  ["missing step", (h) => (h.jobs[0].steps = [])],
  ["duplicate step", (h) => h.jobs[0].steps.push(structuredClone(h.jobs[0].steps[0]))],
  ["invalid chronology", (h) => (h.jobs[0].steps[0].completed_at = "invalid")],
  ["reversed chronology", (h) => (h.jobs[0].steps[0].completed_at = iso("00"))],
  ["future chronology", (h) => (h.jobs[0].completed_at = "2099-01-01T00:00:00Z")],
  ["generic success", (h) => (h.log = "Bootstrap skipped.\nWorkflow success.\n")],
  ["wrong backend", (h) => (h.log = h.log.replace("codex", "claude"))],
  ["wrong head line", (h) => (h.log = h.log.replace(head, "a".repeat(40)))],
  ["duplicate success line", (h) => (h.log += h.log)],
  ["conflicting success line", (h) => (h.log += h.log.replace("codex", "gemini"))],
  ["partial line", (h) => (h.log = h.log.trimEnd().slice(0, -1))],
  ["arbitrary prefix", (h) => (h.log = "echo " + h.log)],
  ["oversized complete log", (h) => (h.log += "x".repeat(2 * 1024 * 1024))],
  [
    "log unavailable",
    (h) =>
      (h.api.readJobLog = async () => {
        throw new Error("Denied");
      }),
  ],
  [
    "jobs API uncertain",
    (h) =>
      (h.onRead = (path) => {
        if (path.includes("/attempts/")) throw new Error("Denied");
      }),
  ],
])
  test(`historical acceptance rejects ${name} without mutation`, async () => {
    const h = harness();
    mutate(h);
    assert.equal(await h.route(), "no-signal");
    assert.equal(h.writes + h.posts, 0);
  });
for (const field of ["run_attempt", "head_sha", "status"])
  test(`proof retrieval cannot reuse changed ${field}`, async () => {
    const h = harness();
    h.api.readJobLog = async () => {
      h.run[field] = field === "run_attempt" ? 2 : field === "status" ? "queued" : "a".repeat(40);
      return h.log;
    };
    await assert.rejects(h.route(), /changed/);
    assert.equal(h.writes + h.posts, 0);
  });
for (const pin of [
  null,
  {},
  { number: 13, head_sha: head },
  { number: 12, head_sha: "a".repeat(40) },
  { number: 12, head_sha: head.slice(0, 10) },
])
  test(`withdrawal requires actual immutable matrix pin ${JSON.stringify(pin)}`, async () => {
    const h = harness();
    h.currentComment = comment("Withdrawn.");
    await assert.rejects(
      h.route({ eventName: "issue_comment", event: h.event(), scheduledPull: pin }),
      /pinned/,
    );
    assert.equal(h.writes + h.posts, 0);
  });
for (const action of ["edited", "deleted"]) {
  for (const [name, mutate] of [
    ["untrusted author", (e) => (e.comment.user = { login: "human" })],
    [
      "unrelated original",
      (e) => {
        e.comment.body = "unrelated";
        e.changes.body.from = "unrelated";
      },
    ],
    ["foreign repository", (e) => (e.repository.full_name = "foreign/repo")],
  ])
    test(`${action} ${name} has no withdrawal authority`, async () => {
      const h = harness();
      const event = h.event(action);
      mutate(event);
      assert.ok(
        ["ignored-event", "rejected"].includes(
          await h.route({ eventName: "issue_comment", event }).catch(() => "rejected"),
        ),
      );
      assert.equal(h.posts + h.writes, 0);
    });
  for (const status of [403, 500])
    test(`${action} API ${status} cannot establish absence`, async () => {
      const h = harness();
      h.onRead = (path, options = {}) => {
        if (path.endsWith("/issues/comments/44") && !options.method) {
          const e = new Error("denied");
          e.status = status;
          throw e;
        }
      };
      await assert.rejects(
        h.route({ eventName: "issue_comment", event: h.event(action) }),
        /denied/,
      );
      assert.equal(h.writes + h.posts, 0);
    });
}
for (const [name, mutate] of [
  ["wrong id", (c) => c.id++],
  ["wrong author", (c) => (c.user = { login: "human" })],
  ["wrong PR", (c) => (c.issue_url += "3")],
  ["changed body", (c) => (c.body = "something else")],
  ["changed update", (c) => (c.updated_at = iso("11"))],
])
  test(`edited receipt independently verifies ${name}`, async () => {
    const h = harness();
    h.currentComment = comment("Withdrawn.");
    mutate(h.currentComment);
    await assert.rejects(
      h.route({ eventName: "issue_comment", event: h.event() }),
      /identity|state/,
    );
    assert.equal(h.posts + h.writes, 0);
  });
test("deletion requires current API404 rather than payload claim", async () => {
  const h = harness();
  h.currentComment = comment();
  await assert.rejects(
    h.route({ eventName: "issue_comment", event: h.event("deleted") }),
    /still exists/,
  );
  assert.equal(h.posts + h.writes, 0);
});
for (const when of ["before observation", "before claim", "before posting", "before POST"])
  test(`withdrawal push race ${when} never reruns superseded head`, async () => {
    const h = harness();
    if (when === "before observation") h.comments = [comment()];
    let snapshots = 0,
      pulled = 0;
    h.onRead = (path) => {
      if (path.endsWith("/issues/12/comments")) snapshots++;
      if (path.endsWith("/pulls/12")) {
        pulled++;
        const change =
          when === "before observation"
            ? snapshots >= 2
            : when === "before claim"
              ? snapshots >= 2
              : when === "before posting"
                ? h.writes >= 1
                : h.writes >= 2;
        if (change && pulled > 2) h.pull.head.sha = "a".repeat(40);
      }
    };
    await assert.rejects(h.route(), /superseded|changed/);
    assert.equal(h.posts, 0);
  });
for (const malformed of [
  "pr_number",
  "workflow_id",
  "agent",
  "attempt",
  "time",
  "extra",
  "source",
  "future",
])
  test(`strict v2 observation rejects ${malformed}`, async () => {
    const h = harness();
    h.comments = [comment()];
    await h.route();
    const v = ledgerValue(h);
    if (malformed === "pr_number") v.pr_number = 13;
    if (malformed === "workflow_id") v.workflow_id++;
    if (malformed === "agent") v.agent = "claude";
    if (malformed === "attempt") v.acceptance.attempt = 0;
    if (malformed === "time") v.acceptance.accepted_at = "invalid";
    if (malformed === "extra") v.extra = 1;
    if (malformed === "source") v.acceptance.sources.push(v.acceptance.sources[0]);
    if (malformed === "future") v.source_attempt = 999;
    setLedgerValue(h, v);
    h.comments = [];
    await assert.rejects(h.route(), /history|schema|future|another/);
    assert.equal(h.posts, 0);
    assert.equal(h.writes, 1);
  });
for (const old of [false, true])
  for (const advanced of [false, true])
    test(`uncertain ${old ? "old" : "current"} posting ${advanced ? "advanced" : "same"} attempt blocks history writes`, async () => {
      const h = harness();
      await h.route();
      const v = ledgerValue(h);
      if (!advanced) h.run.run_attempt = v.source_attempt;
      h.run.run_started_at = h.ledger.updated_at;
      h.run.status = "completed";
      if (old) h.pull.head.sha = "a".repeat(40);
      const before = h.writes;
      await assert.rejects(h.route(), /uncertain|superseded|exact-head/);
      assert.equal(h.writes, before);
      assert.equal(h.posts, 1);
    });

test("job log reader authenticates only fixed API and reads complete HTTPS redirect without credentials", async () => {
  const calls = [];
  const api = createReviewApi("secret", repo, async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? new Response(null, {
          status: 302,
          headers: { location: "https://logs.example/job.txt?signature=opaque" },
        })
      : new Response("whole log", { headers: { "content-length": "9" } });
  });
  assert.equal(await api.readJobLog(200), "whole log");
  assert.equal(calls[0].url, `https://api.github.com${root}/actions/jobs/200/logs`);
  assert.equal(calls[0].options.headers.authorization, "Bearer secret");
  assert.equal(calls[1].options.headers, undefined);
  assert.equal(calls[1].options.redirect, "manual");
});
for (const [name, response] of [
  ["HTTP", () => new Response(null, { status: 302, headers: { location: "http://logs.example" } })],
  [
    "credentials",
    () =>
      new Response(null, { status: 302, headers: { location: "https://user:pass@logs.example" } }),
  ],
  ["missing redirect", () => new Response(null, { status: 302 })],
  ["denied", () => new Response("secret", { status: 403 })],
  ["partial", () => new Response("part", { status: 206 })],
  ["content range", () => new Response("part", { headers: { "content-range": "bytes 0-3/99" } })],
  ["truncated", () => new Response("short", { headers: { "content-length": "100" } })],
  [
    "oversized header",
    () => new Response("short", { headers: { "content-length": String(2 * 1024 * 1024 + 1) } }),
  ],
  ["oversized stream", () => new Response("x".repeat(2 * 1024 * 1024 + 1))],
  ["invalid utf8", () => new Response(new Uint8Array([255]))],
  [
    "second redirect",
    () => new Response(null, { status: 302, headers: { location: "https://logs.example/again" } }),
  ],
])
  test(`job log reader rejects ${name} without exposing body/token/redirect`, async () => {
    const api = createReviewApi("secret", repo, async () => response());
    await assert.rejects(
      api.readJobLog(200),
      (e) => e.message === "Complete bounded job log unavailable.",
    );
  });
test("job log reader validates identity before any network and handles exact byte cap", async () => {
  let calls = 0;
  const api = createReviewApi("secret", repo, async () => {
    calls++;
    return new Response("x".repeat(2 * 1024 * 1024));
  });
  for (const id of [0, -1, "200", 1.1]) await assert.rejects(api.readJobLog(id), /identity/);
  assert.equal(calls, 0);
  assert.equal((await api.readJobLog(200)).length, 2 * 1024 * 1024);
});

const completionOptions = () => ({
  eventName: "workflow_run",
  event: {
    action: "completed",
    repository: { full_name: repo },
    workflow_run: { id: 100, name: "AI Review" },
  },
});
for (const mode of ["direct", "completion", "schedule"])
  test(`accepted absence ${mode} reruns once and completion/schedule deduplicate`, async () => {
    const h = harness();
    h.run.name = "AI Review";
    h.currentComment = comment("Withdrawn.");
    const options =
      mode === "direct"
        ? { eventName: "issue_comment", event: h.event() }
        : mode === "completion"
          ? completionOptions()
          : {};
    assert.equal(await h.route(options), "rerun-confirmed");
    h.run.status = "completed";
    h.run.conclusion = "failure";
    assert.equal(await h.route(completionOptions()), "already-evaluated");
    assert.equal(await h.route(), "already-evaluated");
    assert.equal(h.posts, 1);
  });
for (const mode of ["direct", "completion", "schedule"])
  for (const historical of [false, true])
    test(`${mode} cannot replace ${historical ? "historical" : "same-run"} uncertain v2 posting with absence proof`, async () => {
      const h = harness();
      h.run.name = "AI Review";
      await h.route();
      h.run.status = "completed";
      h.run.conclusion = "success";
      h.run.run_started_at = h.ledger.updated_at;
      if (historical) {
        const v = ledgerValue(h);
        v.head_sha = "a".repeat(40);
        v.run_id = 99;
        setLedgerValue(h, v);
        const request = h.api.request;
        h.api.request = (path, options) =>
          path.endsWith("/runs/99")
            ? Promise.resolve({ ...h.run, id: 99, head_sha: v.head_sha })
            : request(path, options);
      }
      h.currentComment = comment("Withdrawn.");
      const writes = h.writes;
      const options =
        mode === "direct"
          ? { eventName: "issue_comment", event: h.event() }
          : mode === "completion"
            ? completionOptions()
            : {};
      await assert.rejects(h.route(options), /uncertain/);
      assert.equal(h.writes, writes);
      assert.equal(h.posts, 1);
    });
for (const alter of ["old head", "other run"])
  test(`${alter} observation is not proof for current success`, async () => {
    const h = harness();
    h.comments = [comment()];
    await h.route();
    const value = ledgerValue(h);
    if (alter === "old head") value.head_sha = "a".repeat(40);
    else value.run_id = 99;
    setLedgerValue(h, value);
    h.comments = [];
    h.jobs = [];
    assert.equal(await h.route(), "no-signal");
    assert.equal(h.posts, 0);
    assert.equal(h.writes, 1);
  });
test("observation never overwrites changed native snapshot while fetching actual history", async () => {
  const h = harness();
  h.comments = [comment()];
  h.api.readJobLog = async () => {
    h.comments = [];
    return h.log;
  };
  await assert.rejects(h.route(), /inputs changed/);
  assert.equal(h.writes + h.posts, 0);
});
for (const boundary of [1, 2])
  test(`withdrawal current edit changes after ${boundary} writes; no POST`, async () => {
    const h = harness();
    h.currentComment = comment("Withdrawn.");
    h.onRead = (path) => {
      if (path.endsWith("/issues/comments/44") && h.writes >= boundary)
        h.currentComment.updated_at = iso("11");
    };
    await assert.rejects(h.route({ eventName: "issue_comment", event: h.event() }), /changed/);
    assert.equal(h.posts, 0);
  });
for (const boundary of [0, 1, 2])
  test(`accepted-run chronology cannot change before mutation boundary ${boundary}`, async () => {
    const h = harness();
    let snapshots = 0;
    h.onRead = (path) => {
      if (path.endsWith("/issues/12/comments")) snapshots++;
      if (snapshots >= 2 && h.writes >= boundary && path.endsWith("/runs/100"))
        h.run.run_started_at = iso("01");
    };
    await assert.rejects(h.route(), /changed/);
    assert.equal(h.posts, 0);
  });
test("legacy opaque checkpoint cannot bootstrap native acceptance or bypass skipped actual gate", async () => {
  const h = harness();
  h.ledger = {
    id: 900,
    user: { login: "github-actions[bot]", type: "Bot" },
    updated_at: iso("10"),
    body: `<!-- ai-review-wakeup:v1 ${JSON.stringify({ head_sha: head, run_id: 100, source_attempt: 1, signal_hash: "a".repeat(64), signal_updated_at: iso("10"), phase: "claimed" })} -->`,
  };
  h.jobs[0].steps[0].conclusion = "skipped";
  assert.equal(await h.route(), "no-signal");
  assert.equal(h.posts + h.writes, 0);
});
test("configured original author trust applies to withdrawal, not hardcoded YAML identities", async () => {
  const h = harness();
  const event = h.event();
  event.comment.user = { login: "custom-review-bot" };
  h.currentComment = structuredClone(event.comment);
  assert.equal(
    await h.route({
      eventName: "issue_comment",
      event,
      config: { trustedReviewLoginsByAgent: { codex: ["custom-review-bot"] } },
    }),
    "rerun-confirmed",
  );
  assert.equal(h.posts, 1);
});
test("job log reader rejects interrupted stream without retaining a partial success", async () => {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("partial secret"));
      controller.error(new Error("signed URL secret"));
    },
  });
  const api = createReviewApi("secret", repo, async () => new Response(stream));
  await assert.rejects(
    api.readJobLog(200),
    (e) => e.message === "Complete bounded job log unavailable.",
  );
});
test("attempt-specific jobs pagination is complete before history selection", async () => {
  let pages = 0;
  const api = createReviewApi("secret", repo, async (url) => {
    pages++;
    assert.match(url, /\/runs\/100\/attempts\/1\/jobs\?per_page=100&page=[12]$/);
    return Response.json({
      jobs: pages === 1 ? Array.from({ length: 100 }, (_, i) => ({ id: i })) : [],
    });
  });
  assert.equal((await api.list(`${root}/actions/runs/100/attempts/1/jobs`, "jobs")).length, 100);
  assert.equal(pages, 2);
});
for (const [name, mutate] of [
  ["invalid outcome timestamp", (h) => (h.log = h.log.replace("12:03:00", "99:03:00"))],
  ["outcome outside gate step", (h) => (h.log = h.log.replace("12:03:00", "12:10:00"))],
  ["contradictory attempt metadata", (h) => (h.jobs[0].run_attempt = 2)],
  ["contradictory failed completion", (h) => (h.log += "AI Review gate failed for codex.\n")],
])
  test(`actual gate history rejects ${name}`, async () => {
    const h = harness();
    mutate(h);
    assert.equal(await h.route(), "no-signal");
    assert.equal(h.writes + h.posts, 0);
  });
for (const line of ["untimestamped", "CRLF", "LF"])
  test(`recognized ${line} whole completion line proves history`, async () => {
    const h = harness();
    if (line === "untimestamped") h.log = `AI Review gate passed for codex on ${head}.\n`;
    if (line === "LF") h.log = h.log.replace(/\r\n/g, "\n");
    assert.equal(await h.route(), "rerun-confirmed");
    assert.equal(h.posts, 1);
  });
for (const change of [
  "version",
  "escaped duplicate",
  "extra property",
  "duplicate ledger",
  "human lookalike",
])
  test(`strict scheduling observation handles ${change}`, async () => {
    const h = harness();
    h.comments = [comment()];
    await h.route();
    h.comments = [];
    if (change === "version") h.ledger.body = h.ledger.body.replace("wakeup:v2", "wakeup:v3");
    if (change === "escaped duplicate")
      h.ledger.body = h.ledger.body.replace(
        '"agent":"codex"',
        '"agent":"gemini","\\u0061gent":"codex"',
      );
    if (change === "extra property")
      h.ledger.body = h.ledger.body.replace('"agent":"codex"', '"agent":"codex","extra":1');
    if (change === "duplicate ledger") h.comments.push(structuredClone(h.ledger));
    if (change === "human lookalike") {
      h.ledger.user = { login: "human" };
      h.jobs = [];
      assert.equal(await h.route(), "no-signal");
    } else await assert.rejects(h.route(), /schema|Malformed|Duplicate/);
    assert.equal(h.posts, 0);
    assert.equal(h.writes, 1);
  });

// Retain the complete independent 27-row no-acceptance-proof reproduction.
for (const mode of ["direct", "completion", "schedule"])
  for (const baseline of ["none", "settled-v1-claimed", "settled-v1-posting"])
    for (const actual of ["failure", "bootstrap-skipped", "log-unavailable"])
      test(`F23 fail-first neutral absence ${mode}/${baseline}/${actual} cannot schedule`, async () => {
        const h = harness();
        h.run.name = "AI Review";
        h.comments = [{ ...summary(), id: 45 }];
        h.currentComment = comment("Withdrawn.");
        if (baseline !== "none") {
          h.run.run_attempt = 2;
          h.ledger = {
            id: 900,
            user: { login: "github-actions[bot]", type: "Bot" },
            updated_at: "2026-10-16T11:50:00.000Z",
            body: `<!-- ai-review-wakeup:v1 ${JSON.stringify({ head_sha: head, run_id: 100, source_attempt: 1, signal_hash: "a".repeat(64), signal_updated_at: "2026-10-16T11:49:00.000Z", phase: baseline === "settled-v1-posting" ? "posting" : "claimed" })} -->`,
          };
        }
        if (actual === "failure") h.run.conclusion = "failure";
        if (actual === "bootstrap-skipped") h.jobs[0].steps[0].conclusion = "skipped";
        if (actual === "log-unavailable")
          h.api.readJobLog = async () => {
            throw new Error("Unavailable");
          };
        const options =
          mode === "direct"
            ? { eventName: "issue_comment", event: h.event() }
            : mode === "completion"
              ? completionOptions()
              : {};
        await h.route(options);
        assert.equal(
          h.writes,
          0,
          "absence without accepted native history must not write a checkpoint",
        );
        assert.equal(h.posts, 0, "absence without accepted native history must not rerun");
      });

function nativeCompletionOptions(h) {
  const source = {
    ...h.run,
    id: 88,
    workflow_id: 8,
    name: "AI Review Native Signal",
    path: ".github/workflows/ai-review-native-signal.yml",
    event: "pull_request_review",
    actor: bot,
    triggering_actor: bot,
    created_at: iso("10"),
    run_attempt: 1,
  };
  const request = h.api.request;
  h.api.request = (path, options) =>
    path.endsWith("/runs/88")
      ? Promise.resolve(structuredClone(source))
      : path.endsWith("/workflows/ai-review-native-signal.yml")
        ? Promise.resolve({ id: 8, name: source.name, path: source.path })
        : request(path, options);
  return {
    eventName: "workflow_run",
    event: {
      action: "completed",
      repository: { full_name: repo },
      workflow_run: { id: 88, name: source.name },
    },
  };
}
for (const mode of ["direct", "completion", "native-completion", "schedule"])
  for (const remainder of ["empty", "neutral"])
    for (const actual of ["failure", "active", "bootstrap-skipped", "log-unavailable"])
      test(`shared unproven absence ${mode}/${remainder}/${actual} never mutates`, async () => {
        const h = harness();
        h.run.name = "AI Review";
        h.currentComment = comment("Withdrawn.");
        h.comments = remainder === "neutral" ? [{ ...summary(), id: 45 }] : [];
        if (actual === "failure") h.run.conclusion = "failure";
        if (actual === "active") h.run.status = "in_progress";
        if (actual === "bootstrap-skipped") h.jobs[0].steps[0].conclusion = "skipped";
        if (actual === "log-unavailable")
          h.api.readJobLog = async () => {
            throw new Error("Unavailable");
          };
        const options =
          mode === "direct"
            ? { eventName: "issue_comment", event: h.event() }
            : mode === "completion"
              ? completionOptions()
              : mode === "native-completion"
                ? nativeCompletionOptions(h)
                : {};
        await h.route(options);
        assert.equal(h.posts + h.writes, 0);
      });
for (const mode of ["direct", "completion", "native-completion", "schedule"])
  for (const remainder of ["empty", "neutral"])
    for (const baseline of ["initial", "observed"])
      test(`shared proven native loss ${mode}/${remainder}/${baseline} reruns once and consumes`, async () => {
        const h = harness();
        h.run.name = "AI Review";
        h.currentComment = comment("Withdrawn.");
        if (baseline === "observed") {
          h.comments = [comment()];
          await h.route();
        }
        h.comments = remainder === "neutral" ? [{ ...summary(), id: 45 }] : [];
        const options =
          mode === "direct"
            ? { eventName: "issue_comment", event: h.event() }
            : mode === "completion"
              ? completionOptions()
              : mode === "native-completion"
                ? nativeCompletionOptions(h)
                : {};
        assert.equal(await h.route(options), "rerun-confirmed");
        assert.equal(h.posts, 1);
        h.run.status = "completed";
        h.run.conclusion = "failure";
        assert.equal(await h.route(options), "already-evaluated");
        assert.equal(await h.route(), "already-evaluated");
        assert.equal(h.posts, 1);
      });
for (const phase of ["claimed", "posting"])
  for (const mode of ["direct", "completion", "native-completion", "schedule"])
    test(`unsettled v1 ${phase} ${mode} cannot gain authority from neutral remainder`, async () => {
      const h = harness();
      h.run.name = "AI Review";
      h.comments = [{ ...summary(), id: 45 }];
      h.currentComment = comment("Withdrawn.");
      h.jobs = [];
      h.ledger = {
        id: 900,
        user: { login: "github-actions[bot]", type: "Bot" },
        updated_at: iso("20"),
        body: `<!-- ai-review-wakeup:v1 ${JSON.stringify({ head_sha: head, run_id: 100, source_attempt: 1, signal_hash: "a".repeat(64), signal_updated_at: iso("10"), phase })} -->`,
      };
      const options =
        mode === "direct"
          ? { eventName: "issue_comment", event: h.event() }
          : mode === "completion"
            ? completionOptions()
            : mode === "native-completion"
              ? nativeCompletionOptions(h)
              : {};
      if (phase === "posting") await assert.rejects(h.route(options), /uncertain/);
      else assert.equal(await h.route(options), "no-native-outcome");
      assert.equal(h.writes + h.posts, 0);
    });
for (const invalid of ["old head", "other run", "other attempt"])
  for (const mode of ["direct", "completion", "native-completion", "schedule"])
    test(`unrelated v2 ${invalid} ${mode} is not neutral-absence acceptance`, async () => {
      const h = harness();
      h.comments = [comment()];
      await h.route();
      const v = ledgerValue(h);
      if (invalid === "old head") v.head_sha = "a".repeat(40);
      if (invalid === "other run") v.run_id = 99;
      if (invalid === "other attempt") {
        h.run.run_attempt = 2;
        h.run.run_started_at = iso("06");
      }
      setLedgerValue(h, v);
      h.jobs = [];
      h.comments = [{ ...summary(), id: 45 }];
      h.currentComment = comment("Withdrawn.");
      h.run.name = "AI Review";
      const options =
        mode === "direct"
          ? { eventName: "issue_comment", event: h.event() }
          : mode === "completion"
            ? completionOptions()
            : mode === "native-completion"
              ? nativeCompletionOptions(h)
              : {};
      assert.equal(await h.route(options), "no-native-outcome");
      assert.equal(h.posts, 0);
      assert.equal(h.writes, 1);
    });
for (const mode of ["direct", "completion", "native-completion", "schedule"])
  test(`shared guard preserves explicit pass/fail mismatch for ${mode}`, async () => {
    for (const desired of ["pass", "fail"]) {
      const h = harness();
      h.run.name = "AI Review";
      h.currentComment = comment("Withdrawn.");
      h.run.conclusion = desired === "pass" ? "failure" : "success";
      h.comments = [
        comment(desired === "pass" ? receipt : `Codex Review: [P2] Regression in head ${head}`),
      ];
      h.jobs = [];
      const options =
        mode === "direct"
          ? { eventName: "issue_comment", event: h.event() }
          : mode === "completion"
            ? completionOptions()
            : mode === "native-completion"
              ? nativeCompletionOptions(h)
              : {};
      assert.equal(await h.route(options), "rerun-confirmed");
      assert.equal(h.posts, 1);
    }
  });
