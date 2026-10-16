import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
    resolved: new Set(),
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
      return new Set(h.resolved);
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
  h.advance = (ms) => {
    clock += ms;
  };
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

async function consumedSuccessfulRerun(version = 1, phase = "posting") {
  const h = harness();
  h.run.name = "AI Review";
  h.run.conclusion = "failure";
  h.comments = [comment()];
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.posts, 1);
  const value = JSON.parse(h.ledger.body.match(/v1 (\{.*\}) -->$/)[1]);
  value.phase = phase;
  if (version === 2)
    Object.assign(value, {
      pr_number: 12,
      workflow_id: 7,
      agent: "codex",
      acceptance: {
        attempt: 1,
        job_id: 200,
        started_at: iso("00"),
        accepted_at: iso("04"),
        sources: [{ id: 44, login: bot.login }],
      },
    });
  h.ledger.body = `<!-- ai-review-wakeup:v${version} ${JSON.stringify(value)} -->`;
  h.run.status = "completed";
  h.run.conclusion = "success";
  h.jobs[0] = {
    ...h.jobs[0],
    id: 201,
    run_attempt: 2,
    started_at: iso("31"),
    completed_at: iso("35"),
    steps: [{ ...h.jobs[0].steps[0], started_at: iso("32"), completed_at: iso("34") }],
  };
  h.log = `2026-10-16T12:33:00.0000000Z AI Review gate passed for codex on ${head}.\r\n`;
  h.advance(10 * 60 * 1000);
  return h;
}
for (const version of [1, 2])
  for (const mode of ["completion", "schedule"])
    for (const action of ["edited", "deleted"])
      for (const remainder of ["empty", "neutral"])
        test(`F24 consumed v${version} ${mode}: retain new acceptance then ${action}/${remainder} after logs expire`, async () => {
          const h = await consumedSuccessfulRerun(version);
          const before = h.writes;
          const options = mode === "completion" ? completionOptions() : {};
          assert.equal(await h.route(options), "observed-native-acceptance");
          const proof = ledgerValue(h);
          assert.equal(proof.phase, "observed");
          assert.equal(proof.source_attempt, 2);
          assert.equal(proof.acceptance.attempt, 2);
          assert.equal(proof.acceptance.job_id, 201);
          assert.equal(proof.acceptance.accepted_at, iso("34"));
          assert.equal(h.writes, before + 1);
          assert.equal(h.posts, 1);
          h.api.readJobLog = async () => {
            throw new Error("Logs expired");
          };
          assert.equal(await h.route(options), "already-observed");
          assert.equal(h.writes, before + 1);
          h.comments = remainder === "empty" ? [] : [{ ...summary(), id: 45 }];
          if (action === "edited") h.currentComment = comment("Withdrawn.");
          assert.equal(
            await h.route({ eventName: "issue_comment", event: h.event(action) }),
            "rerun-confirmed",
          );
          const absence = ledgerValue(h);
          assert.ok(Number.isFinite(Date.parse(absence.signal_updated_at)));
          assert.equal(absence.acceptance.attempt, 2);
          assert.equal(h.posts, 2);
          h.run.status = "completed";
          h.run.conclusion = "failure";
          assert.equal(await h.route(completionOptions()), "already-evaluated");
          assert.equal(await h.route(), "already-evaluated");
          assert.equal(ledgerValue(h).signal_hash, absence.signal_hash);
          assert.equal(h.posts, 2);
        });

test("F25 actual P3 thread resolution changes terminal native outcome once", async () => {
  const h = harness();
  h.run.conclusion = "failure";
  h.reviews = [
    {
      id: 50,
      user: bot,
      commit_id: head,
      state: "COMMENTED",
      body: "[P3] Found an issue",
      submitted_at: iso("10"),
    },
  ];
  h.inline = [
    {
      id: 51,
      user: bot,
      commit_id: head,
      pull_request_review_id: 50,
      body: "[P3] Found an issue",
      created_at: iso("10"),
      updated_at: iso("10"),
    },
  ];
  assert.equal(await h.route(), "matching-outcome");
  assert.equal(h.writes + h.posts, 0);
  h.resolved.add(51);
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.posts, 1);
  assert.equal(await h.route(), "already-evaluated");
  assert.equal(h.posts, 1);
});

const consumedDelivery = (h, mode) =>
  mode === "completion"
    ? completionOptions()
    : mode === "native-completion"
      ? nativeCompletionOptions(h)
      : mode === "direct"
        ? {
            eventName: "issue_comment",
            event: {
              action: "created",
              repository: { full_name: repo },
              issue: { number: 12, pull_request: {} },
              comment: comment(),
            },
          }
        : {};
for (const version of [1, 2])
  for (const phase of ["claimed", "posting"])
    for (const mode of ["direct", "native-completion", "completion", "schedule"])
      test(`F24 v${version} consumed ${phase} ${mode} records new attempt exactly once`, async () => {
        const h = await consumedSuccessfulRerun(version, phase);
        const before = h.writes;
        const options = consumedDelivery(h, mode);
        assert.equal(await h.route(options), "observed-native-acceptance");
        assert.equal(ledgerValue(h).acceptance.attempt, 2);
        assert.equal(ledgerValue(h).acceptance.job_id, 201);
        assert.equal(await h.route(options), "already-observed");
        assert.equal(h.writes, before + 1);
        assert.equal(h.posts, 1);
      });
for (const version of [1, 2])
  for (const mode of ["completion", "schedule"])
    for (const [name, mutate] of [
      [
        "active",
        (h) => {
          h.run.status = "in_progress";
          h.run.conclusion = null;
        },
      ],
      [
        "failed",
        (h) => {
          h.run.conclusion = "failure";
        },
      ],
      [
        "skipped",
        (h) => {
          h.jobs[0].steps[0].conclusion = "skipped";
        },
      ],
      [
        "generic success",
        (h) => {
          h.log = "Bootstrap success.\n";
        },
      ],
      [
        "wrong attempt",
        (h) => {
          h.jobs[0].run_attempt = 1;
        },
      ],
      [
        "old job chronology",
        (h) => {
          h.jobs[0].started_at = iso("01");
        },
      ],
      [
        "future job chronology",
        (h) => {
          h.jobs[0].completed_at = "2099-01-01T00:00:00Z";
        },
      ],
      [
        "unavailable log",
        (h) => {
          h.api.readJobLog = async () => {
            throw new Error("Expired");
          };
        },
      ],
    ])
      test(`F24 consumed v${version}/${mode}/${name} cannot acquire native acceptance`, async () => {
        const h = await consumedSuccessfulRerun(version);
        mutate(h);
        const before = h.writes,
          body = h.ledger.body;
        const result = await h.route(consumedDelivery(h, mode));
        assert.equal(result, "already-evaluated");
        assert.equal(h.writes, before);
        assert.equal(h.ledger.body, body);
        assert.equal(h.posts, 1);
      });
for (const version of [1, 2])
  for (const mode of ["completion", "schedule"])
    for (const started of ["equal", "older", "invalid", "missing", "future"])
      test(`F24 v${version}/${mode} unknown posting ${started} reconciles before observing`, async () => {
        const h = await consumedSuccessfulRerun(version);
        h.run.run_started_at =
          started === "equal"
            ? h.ledger.updated_at
            : started === "older"
              ? iso("00")
              : started === "future"
                ? "2099-01-01T00:00:00Z"
                : started === "invalid"
                  ? "invalid"
                  : undefined;
        const before = h.writes,
          body = h.ledger.body;
        await assert.rejects(h.route(consumedDelivery(h, mode)), /uncertain/);
        assert.equal(h.writes, before);
        assert.equal(h.ledger.body, body);
        assert.equal(h.posts, 1);
      });
for (const mode of ["completion", "schedule"])
  test(`F24 consumed ${mode} observation write error remains retryable without POST`, async () => {
    const h = await consumedSuccessfulRerun(2);
    const before = h.writes,
      body = h.ledger.body;
    const options = consumedDelivery(h, mode);
    h.onRead = (_path, options = {}) => {
      if (options.method === "PATCH") throw new Error("Observation write denied");
    };
    await assert.rejects(h.route(options), /Observation write denied/);
    assert.equal(h.writes, before);
    assert.equal(h.ledger.body, body);
    assert.equal(h.posts, 1);
    h.onRead = () => {};
    assert.equal(await h.route(options), "observed-native-acceptance");
    assert.equal(h.posts, 1);
    assert.equal(h.writes, before + 1);
  });
for (const mode of ["completion", "schedule"])
  for (const boundary of [
    "history-head",
    "history-attempt",
    "source",
    "snapshot",
    "final-head",
    "final-run",
  ])
    test(`F24 consumed ${mode} ${boundary} race rejects observation`, async () => {
      const h = await consumedSuccessfulRerun(2);
      const before = h.writes,
        body = h.ledger.body;
      let proofRead = false,
        liveSnapshot = false;
      const readLog = h.api.readJobLog;
      h.api.readJobLog = async (id) => {
        const log = await readLog(id);
        proofRead = true;
        if (boundary === "history-head") h.pull.head.sha = "a".repeat(40);
        if (boundary === "history-attempt") h.run.run_attempt++;
        if (boundary === "source") h.run.head_sha = "b".repeat(40);
        return log;
      };
      h.onRead = (path) => {
        if (!proofRead) return;
        if (path.endsWith("/pulls/12") && liveSnapshot && boundary === "final-head")
          h.pull.head.sha = "a".repeat(40);
        if (path.endsWith("/runs/100") && liveSnapshot && boundary === "final-run")
          h.run.status = "in_progress";
        if (path.endsWith("/issues/12/comments")) {
          liveSnapshot = true;
          if (boundary === "snapshot") h.comments.push({ ...comment(), id: 45 });
        }
      };
      await assert.rejects(h.route(consumedDelivery(h, mode)), /changed|head|superseded/i);
      assert.equal(h.writes, before);
      assert.equal(h.ledger.body, body);
      assert.equal(h.posts, 1);
    });

for (const version of [1, 2])
  test(`F24 consumed v${version} new genuine negative still schedules real reevaluation`, async () => {
    const h = await consumedSuccessfulRerun(version);
    h.reviews = [
      {
        id: 50,
        commit_id: head,
        user: bot,
        state: "CHANGES_REQUESTED",
        body: "",
        submitted_at: iso("20"),
      },
    ];
    const reads = h.reads.length;
    assert.equal(await h.route(), "rerun-confirmed");
    assert.equal(h.posts, 2);
    assert.ok(
      !h.reads.slice(reads).some((path) => path.includes("/attempts/") || path.startsWith("log:")),
    );
    assert.equal(await h.route(), "already-evaluated");
    assert.equal(h.posts, 2);
  });

for (const residual of [
  "Found another issue.",
  "Found a remaining issue.",
  "[Unknown] Found another finding.",
])
  for (const body of [
    `[P3] Found an issue.\n${residual}`,
    `${residual}\n[P3] Found an issue.`,
    `\n[P3] Found an issue.\n\n${residual}\n`,
    `[P3] Found an issue. ${residual}`,
  ])
    test(`F26 terminal success with resolved P3 mixed residual reevaluates once ${JSON.stringify(body)}`, async () => {
      const h = harness();
      h.reviews = [
        { id: 50, user: bot, commit_id: head, state: "COMMENTED", body, submitted_at: iso("10") },
      ];
      h.comments = [{ ...comment(), updated_at: iso("20") }];
      h.inline = [
        {
          id: 51,
          user: bot,
          commit_id: head,
          pull_request_review_id: 50,
          body: "[P3] Found an issue",
          created_at: iso("10"),
          updated_at: iso("10"),
        },
      ];
      h.resolved.add(51);
      assert.equal(await h.route(), "rerun-confirmed");
      assert.equal(h.posts, 1);
      h.run.status = "completed";
      h.run.conclusion = "failure";
      assert.equal(await h.route(), "already-evaluated");
      assert.equal(h.posts, 1);
    });

for (const version of [1, 2])
  test(`F26 mixed formal residual cannot overwrite uncertain v${version} posting`, async () => {
    const h = await consumedSuccessfulRerun(version);
    h.run.run_started_at = h.ledger.updated_at;
    h.reviews = [
      {
        id: 50,
        user: bot,
        commit_id: head,
        state: "COMMENTED",
        body: "[P3] Found an issue.\nFound another issue.",
        submitted_at: iso("10"),
      },
    ];
    const before = h.writes,
      body = h.ledger.body;
    await assert.rejects(h.route(), /uncertain/);
    assert.equal(h.writes, before);
    assert.equal(h.ledger.body, body);
    assert.equal(h.posts, 1);
  });

// F27 uses actual gate evaluations between router deliveries. Gate diagnostics
// are separate issue comments, never the scheduler's trusted checkpoint ledger.
async function f27Gate(h, expected) {
  const lines = [];
  const api = {
    ...h.api,
    async request(path, options = {}) {
      if (
        options.method === "POST" &&
        path.endsWith("/issues/12/comments") &&
        JSON.parse(options.body).body.startsWith("AI Review gate failed.")
      ) {
        h.gateFailures = (h.gateFailures || 0) + 1;
        return { id: 1000 + h.gateFailures };
      }
      return h.api.request(path, options);
    },
  };
  assert.equal(
    await runReviewGate({
      api,
      number: 12,
      headSha: head,
      runAttempt: h.run.run_attempt,
      maxWaitMs: 0,
      log: { log: (line) => lines.push(line), error() {}, warn() {} },
    }),
    expected,
  );
  return lines;
}
function f27Value(h) {
  return JSON.parse(h.ledger.body.match(/v[12] (\{.*\}) -->$/)[1]);
}
function f27Hash(h) {
  // Independently encode just the fixture's current trusted native inputs;
  // edited-away receipt prose and the scheduler ledger are deliberately absent.
  const signals = [
    ...h.comments
      .filter((c) => c.body.includes("<!-- codex-"))
      .map((c) => ({
        type: "comment",
        id: c.id,
        at: c.updated_at || c.created_at,
        body: c.body,
        login: c.user.login,
      })),
    ...h.inline.map((c) => ({
      type: "inline",
      id: c.id,
      at: c.updated_at || c.created_at,
      body: c.body,
      resolved: h.resolved.has(c.in_reply_to_id || c.id),
      login: c.user.login,
    })),
  ].sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`));
  return createHash("sha256")
    .update(JSON.stringify({ headSha: head, agent: "codex", signals }))
    .digest("hex");
}
function f27AssertConsumed(h) {
  const value = f27Value(h);
  assert.equal(value.signal_hash, f27Hash(h), "restored snapshot must be exactly the old H");
  assert.equal(value.source_attempt, 1);
  assert.equal(h.run.run_attempt, 2);
  assert.ok(Date.parse(h.run.run_started_at) > Date.parse(h.ledger.updated_at));
  assert.ok(Date.parse(h.run.run_started_at) > Date.parse(value.signal_updated_at));
  return value.signal_hash;
}
async function f27Lifecycle({
  version = 2,
  remainder = "empty",
  negative = null,
  action = "deleted",
} = {}) {
  const h = harness();
  h.run.name = "AI Review";
  h.comments = [comment()];
  assert.equal((await f27Gate(h, true)).at(-1), `AI Review gate passed for codex on ${head}.`);
  assert.equal(await h.route(), "observed-native-acceptance");
  const rest = remainder === "neutral" ? [{ ...summary(), id: 45 }] : [];
  if (negative) {
    h.inline = [
      {
        id: 60,
        user: bot,
        body: negative === "P3" ? "[P3] Advisory" : "Unknown finding",
        commit_id: negative === "older-head" ? "a".repeat(40) : head,
        created_at: iso("10"),
        updated_at: iso("10"),
      },
    ];
  } else h.comments = rest;
  await f27Gate(h, false);
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.posts, 1);
  let value = f27Value(h);
  if (version === 1) {
    for (const key of ["pr_number", "workflow_id", "agent", "acceptance"]) delete value[key];
  } else if (!value.acceptance) {
    Object.assign(value, {
      pr_number: 12,
      workflow_id: 7,
      agent: "codex",
      acceptance: {
        attempt: 1,
        job_id: 200,
        started_at: iso("00"),
        accepted_at: iso("04"),
        sources: [{ id: 44, login: bot.login }],
      },
    });
  }
  h.ledger.body = `<!-- ai-review-wakeup:v${version} ${JSON.stringify(value)} -->`;
  if (negative) h.resolved.add(60);
  else
    h.comments = [...rest, { ...comment(), id: 46, created_at: iso("31"), updated_at: iso("32") }];
  const lines = await f27Gate(h, true);
  h.run.status = "completed";
  h.run.conclusion = "success";
  h.jobs[0] = {
    ...h.jobs[0],
    id: 201,
    run_attempt: 2,
    started_at: iso("31"),
    completed_at: iso("35"),
    steps: [{ ...h.jobs[0].steps[0], started_at: iso("32"), completed_at: iso("34") }],
  };
  h.log = `2026-10-16T12:33:00.0000000Z ${lines.at(-1)}\r\n`;
  h.advance(10 * 60 * 1000);
  if (negative) h.resolved.delete(60);
  else {
    h.comments =
      action === "edited"
        ? [...rest, { ...comment("Withdrawn."), id: 46, updated_at: iso("36") }]
        : rest;
    const request = h.api.request;
    h.api.request = async (path, options = {}) => {
      if (path.endsWith("/issues/comments/46") && !options.method) {
        if (action === "edited") return structuredClone(h.comments.find((c) => c.id === 46));
        const error = new Error("Not Found");
        error.status = 404;
        throw error;
      }
      return request(path, options);
    };
  }
  h.oldHash = f27AssertConsumed(h);
  h.withdrawalOptions = {
    eventName: "issue_comment",
    event: {
      ...h.event(action),
      comment: {
        ...comment(action === "edited" ? "Withdrawn." : receipt),
        id: 46,
        updated_at: action === "edited" ? iso("36") : iso("32"),
      },
    },
  };
  return h;
}
async function f27Converge(h, options) {
  const before = h.writes;
  assert.equal(await h.route(options), "rerun-confirmed");
  const value = ledgerValue(h);
  assert.equal(value.signal_hash, h.oldHash);
  assert.equal(value.source_attempt, 2);
  assert.equal(value.acceptance.attempt, 2);
  assert.equal(value.acceptance.job_id, 201);
  assert.equal(value.acceptance.accepted_at, iso("34"));
  assert.ok(Date.parse(value.signal_updated_at) >= Date.parse(iso("34")));
  assert.equal(h.writes, before + 2);
  assert.equal(h.posts, 2);
  assert.equal(await h.route(completionOptions()), "already-evaluated");
  assert.equal(await h.route(), "already-evaluated");
  await f27Gate(h, false);
  h.run.status = "completed";
  h.run.conclusion = "failure";
  assert.equal(await h.route(completionOptions()), "already-evaluated");
  assert.equal(await h.route(), "already-evaluated");
  assert.equal(h.posts, 2);
  assert.equal(h.writes, before + 2);
}
for (const version of [1, 2])
  for (const mode of ["completion", "schedule"])
    for (const action of ["edited", "deleted"])
      for (const remainder of ["empty", "neutral"])
        test(`F27 actual absence lifecycle v${version} ${mode} ${action}/${remainder}: repeated consumed H reconciles latest B`, async () => {
          const h = await f27Lifecycle({ version, action, remainder });
          await f27Converge(h, mode === "completion" ? completionOptions() : {});
        });
for (const version of [1, 2])
  for (const mode of ["completion", "schedule"])
    for (const negative of ["P3", "unknown", "older-head"])
      test(`F27 actual reopened ${negative} root v${version} ${mode}: same REST data restores consumed negative H`, async () => {
        const h = await f27Lifecycle({ version, negative });
        await f27Converge(h, mode === "completion" ? completionOptions() : {});
      });
for (const outcome of ["absence", "negative"])
  for (const version of [1, 2])
    for (const mode of ["completion", "schedule"])
      for (const [label, corrupt] of [
        [
          "expired latest log",
          (h) => {
            h.api.readJobLog = async () => {
              throw new Error("Expired");
            };
          },
        ],
        [
          "generic success",
          (h) => {
            h.log = "Build passed.\n";
          },
        ],
        [
          "skipped native step",
          (h) => {
            h.jobs[0].steps[0].conclusion = "skipped";
          },
        ],
        [
          "old attempt only",
          (h) => {
            h.jobs[0].run_attempt = 1;
          },
        ],
        [
          "missing jobs",
          (h) => {
            h.jobs = [];
          },
        ],
      ])
        test(`F27 consumed ${outcome} v${version} ${mode}: ${label} is an explicit blocker, never old-A acceptance`, async () => {
          const h = await f27Lifecycle({ version, negative: outcome === "negative" ? "P3" : null });
          corrupt(h);
          const before = { writes: h.writes, posts: h.posts, body: h.ledger.body };
          await assert.rejects(
            h.route(mode === "completion" ? completionOptions() : {}),
            /latest.*acceptance|acceptance.*reconcil/i,
          );
          assert.deepEqual({ writes: h.writes, posts: h.posts, body: h.ledger.body }, before);
        });

for (const outcome of ["absence", "negative"])
  for (const mode of ["direct", "native-completion"])
    test(`F27 ${outcome} ${mode} preserves exact delivery guards and converges`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      const options =
        mode === "native-completion"
          ? nativeCompletionOptions(h)
          : outcome === "negative"
            ? consumedDelivery(h, "direct")
            : h.withdrawalOptions;
      await f27Converge(h, options);
    });
for (const outcome of ["absence", "negative"])
  for (const version of [1, 2])
    for (const phase of ["claimed", "posting"])
      test(`F27 ${outcome} v${version} consumed ${phase} reconciles latest attempt`, async () => {
        const h = await f27Lifecycle({
          version,
          negative: outcome === "negative" ? "unknown" : null,
        });
        const value = f27Value(h);
        value.phase = phase;
        h.ledger.body = `<!-- ai-review-wakeup:v${version} ${JSON.stringify(value)} -->`;
        await f27Converge(h, {});
      });
for (const outcome of ["absence", "negative"])
  for (const [label, corrupt] of [
    [
      "wrong head",
      (h) => {
        h.jobs[0].head_sha = "a".repeat(40);
      },
    ],
    [
      "wrong run",
      (h) => {
        h.jobs[0].run_id = 101;
      },
    ],
    [
      "wrong job",
      (h) => {
        h.jobs[0].name = "Bootstrap";
      },
    ],
    [
      "duplicate jobs",
      (h) => {
        h.jobs.push(structuredClone(h.jobs[0]));
      },
    ],
    [
      "wrong step",
      (h) => {
        h.jobs[0].steps[0].name = "Skipped native review";
      },
    ],
    [
      "duplicate steps",
      (h) => {
        h.jobs[0].steps.push(structuredClone(h.jobs[0].steps[0]));
      },
    ],
    [
      "wrong backend",
      (h) => {
        h.log = h.log.replace("for codex", "for claude");
      },
    ],
    [
      "wrong log head",
      (h) => {
        h.log = h.log.replace(head, "a".repeat(40));
      },
    ],
    [
      "duplicate outcome",
      (h) => {
        h.log += h.log;
      },
    ],
    [
      "malformed log time",
      (h) => {
        h.log = "not-a-time " + h.log;
      },
    ],
    [
      "oversized log",
      (h) => {
        h.log += "x".repeat(2 * 1024 * 1024);
      },
    ],
    [
      "future completion",
      (h) => {
        h.jobs[0].completed_at = "2099-01-01T00:00:00Z";
      },
    ],
    [
      "before attempt",
      (h) => {
        h.jobs[0].started_at = iso("01");
      },
    ],
    [
      "invalid step time",
      (h) => {
        h.jobs[0].steps[0].completed_at = "invalid";
      },
    ],
    [
      "before step log",
      (h) => {
        h.log = h.log.replace("12:33", "12:31");
      },
    ],
    [
      "unavailable jobs",
      (h) => {
        const list = h.api.list;
        h.api.list = (path) => {
          if (path.includes("/attempts/")) throw new Error("Unavailable");
          return list(path);
        };
      },
    ],
  ])
    test(`F27 restored ${outcome}: ${label} cannot prove latest acceptance`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      corrupt(h);
      const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
      await assert.rejects(
        h.route(),
        /Latest successful native acceptance requires evidence reconciliation/,
      );
      assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
    });
for (const outcome of ["absence", "negative"])
  for (const state of ["active", "failure"])
    test(`F27 restored ${outcome} ${state} stays deduplicated without log proof`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      h.run.status = state === "active" ? "in_progress" : "completed";
      h.run.conclusion = state === "active" ? null : "failure";
      const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
      h.reads.length = 0;
      assert.equal(await h.route(), "already-evaluated");
      assert.ok(!h.reads.some((path) => path.includes("/attempts/") || path.startsWith("log:")));
      assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
    });
for (const outcome of ["absence", "negative"])
  for (const chronology of ["equal", "older", "missing", "invalid", "future"])
    test(`F27 ${outcome}: uncertain posting ${chronology} settles before latest proof`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      h.run.run_started_at =
        chronology === "equal"
          ? h.ledger.updated_at
          : chronology === "older"
            ? iso("00")
            : chronology === "missing"
              ? undefined
              : chronology === "invalid"
                ? "invalid"
                : "2099-01-01T00:00:00Z";
      const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
      h.reads.length = 0;
      await assert.rejects(h.route(), /uncertain/);
      assert.ok(!h.reads.some((path) => path.includes("/attempts/") || path.startsWith("log:")));
      assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
    });
for (const outcome of ["absence", "negative"])
  for (const mode of ["completion", "schedule"])
    for (const boundary of ["claim-write", "before-posting"])
      test(`F27 ${outcome} ${mode} ${boundary}: latest retained proof survives expiry and retries once`, async () => {
        const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
        const options = mode === "completion" ? completionOptions() : {};
        let failed = false;
        h.onRead = (_path, request = {}) => {
          if (request.method === "PATCH") {
            const next = JSON.parse(JSON.parse(request.body).body.match(/v2 (\{.*\}) -->$/)[1]);
            if (
              next.source_attempt === 2 &&
              next.phase === (boundary === "claim-write" ? "claimed" : "posting") &&
              !failed
            ) {
              failed = true;
              throw new Error("Injected checkpoint write failure");
            }
          }
        };
        await assert.rejects(h.route(options), /Injected checkpoint/);
        assert.equal(h.posts, 1);
        h.onRead = () => {};
        if (boundary === "claim-write") {
          // No successful write retained B proof: read-only proof recovery still works.
          assert.equal(f27Value(h).source_attempt, 1);
          assert.equal(await h.route(options), "rerun-confirmed");
        } else {
          assert.equal(ledgerValue(h).phase, "claimed");
          assert.equal(ledgerValue(h).acceptance.attempt, 2);
          h.api.readJobLog = async () => {
            throw new Error("Expired");
          };
          h.jobs = [];
          h.reads.length = 0;
          assert.equal(await h.route(options), "rerun-confirmed");
          assert.ok(
            !h.reads.some((path) => path.includes("/attempts/") || path.startsWith("log:")),
          );
        }
        assert.equal(h.posts, 2);
        h.run.status = "completed";
        h.run.conclusion = "failure";
        assert.equal(await h.route(options), "already-evaluated");
        assert.equal(h.posts, 2);
      });
for (const outcome of ["absence", "negative"])
  test(`F27 ${outcome}: network-uncertain C POST never replays or overwrites`, async () => {
    const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
    const request = h.api.request;
    h.api.request = (path, options) => {
      if (path.endsWith("/rerun")) {
        h.posts++;
        throw new Error("Unknown HTTP acceptance");
      }
      return request(path, options);
    };
    await assert.rejects(h.route(), /acceptance could not be confirmed/);
    const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
    assert.equal(ledgerValue(h).phase, "posting");
    assert.equal(ledgerValue(h).source_attempt, 2);
    await assert.rejects(h.route(completionOptions()), /uncertain/);
    await assert.rejects(h.route(), /uncertain/);
    assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
  });
for (const outcome of ["absence", "negative"])
  for (const boundary of [
    "proof-head",
    "proof-source",
    "proof-attempt",
    "claim-snapshot",
    "posting-head",
    "posting-attempt",
    "post-snapshot",
    "post-attempt",
  ])
    test(`F27 ${outcome}: ${boundary} race cannot rerun from stale proof`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      let proofRead = false,
        fired = false;
      const readLog = h.api.readJobLog;
      h.api.readJobLog = async (id) => {
        const result = await readLog(id);
        proofRead = true;
        if (boundary === "proof-head") h.pull.head.sha = "a".repeat(40);
        if (boundary === "proof-source") h.run.head_sha = "a".repeat(40);
        if (boundary === "proof-attempt") h.run.run_attempt++;
        return result;
      };
      h.onRead = (path, options = {}) => {
        if (!proofRead || fired) return;
        const value = f27Value(h);
        if (boundary === "claim-snapshot" && path.endsWith("/issues/12/comments")) {
          h.comments.push({ ...comment(), id: 47 });
          fired = true;
        }
        if (
          value.source_attempt === 2 &&
          value.phase === "claimed" &&
          path.endsWith("/pulls/12") &&
          boundary === "posting-head"
        ) {
          h.pull.head.sha = "b".repeat(40);
          fired = true;
        }
        if (
          value.source_attempt === 2 &&
          value.phase === "claimed" &&
          path.endsWith("/runs/100") &&
          boundary === "posting-attempt"
        ) {
          h.run.run_attempt++;
          fired = true;
        }
        if (
          value.source_attempt === 2 &&
          value.phase === "posting" &&
          !options.method &&
          boundary === "post-snapshot" &&
          path.endsWith("/issues/12/comments")
        ) {
          h.comments.push({ ...comment(), id: 47 });
          fired = true;
        }
        if (
          value.source_attempt === 2 &&
          value.phase === "posting" &&
          path.endsWith("/runs/100") &&
          boundary === "post-attempt"
        ) {
          h.run.run_attempt++;
          fired = true;
        }
      };
      await assert.rejects(h.route(), /changed|immutable|current|rerun|exact-head|closed|invalid/i);
      assert.equal(h.posts, 1);
      if (boundary.startsWith("proof-") || boundary === "claim-snapshot")
        assert.equal(f27Value(h).source_attempt, 1);
    });

for (const remainder of ["empty", "neutral"])
  test(`F27 direct exact current edit with ${remainder} remainder invalidates latest attempt once`, async () => {
    const h = await f27Lifecycle({ action: "edited", remainder });
    await f27Converge(h, h.withdrawalOptions);
  });
for (const outcome of ["absence", "negative"])
  for (const mode of ["direct", "native-completion"])
    test(`F27 ${outcome} ${mode} unavailable latest proof is nonmutating`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      h.api.readJobLog = async () => {
        throw new Error("Unavailable");
      };
      const options =
        mode === "native-completion"
          ? nativeCompletionOptions(h)
          : outcome === "negative"
            ? consumedDelivery(h, "direct")
            : h.withdrawalOptions;
      const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
      await assert.rejects(
        h.route(options),
        /Latest successful native acceptance requires evidence reconciliation/,
      );
      assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
    });
for (const outcome of ["absence", "negative"])
  for (const boundary of ["proof", "posting"])
    test(`F27 ${outcome} native actor changes at ${boundary} boundary cannot mutate another source`, async () => {
      const h = await f27Lifecycle({ negative: outcome === "negative" ? "P3" : null });
      const options = nativeCompletionOptions(h);
      const request = h.api.request;
      let proofRead = false;
      const readLog = h.api.readJobLog;
      h.api.readJobLog = async (id) => {
        const result = await readLog(id);
        proofRead = true;
        return result;
      };
      h.api.request = async (path, opts) => {
        const result = await request(path, opts);
        if (
          path.endsWith("/runs/88") &&
          proofRead &&
          (boundary === "proof" || f27Value(h).source_attempt === 2)
        )
          result.triggering_actor = { login: "untrusted-user" };
        return result;
      };
      const before = h.writes;
      await assert.rejects(h.route(options), /actor provenance/);
      assert.equal(h.posts, 1);
      assert.equal(h.writes, before + (boundary === "proof" ? 0 : 1));
    });
for (const kind of ["head", "other-run"])
  test(`F27 prior ${kind} uncertain posting must settle before latest success reconciliation`, async () => {
    const h = await f27Lifecycle();
    const value = f27Value(h);
    if (kind === "head") value.head_sha = "a".repeat(40);
    else value.run_id = 101;
    setLedgerValue(h, value);
    const before = { body: h.ledger.body, writes: h.writes, posts: h.posts };
    const request = h.api.request;
    h.api.request = async (path, options) =>
      path.endsWith("/runs/101")
        ? { ...h.run, id: 101, run_attempt: 1, run_started_at: iso("00") }
        : request(path, options);
    h.reads.length = 0;
    await assert.rejects(h.route(), /Prior checkpoint|uncertain/);
    assert.ok(!h.reads.some((path) => path.includes("/attempts/") || path.startsWith("log:")));
    assert.deepEqual({ body: h.ledger.body, writes: h.writes, posts: h.posts }, before);
  });
test("F27 a remaining genuine formal positive records latest acceptance without absence rerun", async () => {
  const h = await f27Lifecycle();
  h.reviews = [
    { id: 70, user: bot, commit_id: head, state: "APPROVED", body: "", submitted_at: iso("32") },
  ];
  assert.equal(await h.route(), "observed-native-acceptance");
  assert.equal(ledgerValue(h).acceptance.attempt, 2);
  assert.equal(h.posts, 1);
  assert.equal(await h.route(), "already-observed");
  assert.equal(h.posts, 1);
});
