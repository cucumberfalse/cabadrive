import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runReviewGate } from "../scripts/ai-review-gate.mjs";
import { resolvePrContext } from "../scripts/resolve-pr-context.mjs";
import { createReviewApi } from "../scripts/ai-review-api.mjs";
import {
  classifyCodexStructuredSummary,
  classifyCodexSummaryComment,
  latestCodexResult,
} from "../scripts/ai-review-helpers.mjs";
import {
  routeReviewWakeup,
  wakeupPrNumber,
  discoverWakeupPulls,
  resolveWakeupPrNumber,
} from "../scripts/ai-review-wakeup.mjs";

const head = "2667f79cd7676ff331730cabf661d38dbbcddb0d";
const other = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const user = { login: "chatgpt-codex-connector[bot]", type: "Bot" };
const repository = "owner/repo";
const root = `/repos/${repository}`;
const receipt = `<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn't find any major issues. :rocket:\n\n**Reviewed commit:** \`${head.slice(0, 10)}\``;
const at = "2026-10-15T12:00:00Z";
const makeComment = (extra = {}) => ({
  id: 1,
  body: receipt,
  user,
  created_at: at,
  updated_at: at,
  ...extra,
});
const makeReview = (extra = {}) => ({
  id: 3,
  body: "",
  user,
  commit_id: head,
  state: "COMMENTED",
  submitted_at: at,
  ...extra,
});
const makePull = (extra = {}) => ({
  number: 12,
  state: "open",
  draft: false,
  head: { sha: head, ref: "feature", repo: { full_name: repository } },
  base: { ref: "main", repo: { full_name: repository } },
  ...extra,
});
const quiet = { log() {}, warn() {}, error() {} };

function gateApi({
  headSha = head,
  comments = [makeComment()],
  reviews = [],
  inline = [],
  resolved = [],
  onRequest = () => {},
} = {}) {
  const posted = [];
  let pulls = 0;
  return {
    root,
    posted,
    async request(path, options = {}) {
      const override = onRequest(path, options, ++pulls);
      if (override !== undefined) return override;
      if (path === `${root}/pulls/12`)
        return makePull({ head: { ...makePull().head, sha: headSha } });
      if (path.includes("/commits/")) return { sha: headSha };
      if (options.method === "POST") {
        posted.push(JSON.parse(options.body));
        return {};
      }
      throw new Error(`Unexpected request ${path}`);
    },
    async list(path) {
      return path.endsWith("/reviews") ? reviews : path.includes("/pulls/") ? inline : comments;
    },
    async resolvedCommentIds() {
      return new Set(resolved);
    },
  };
}
const gate = (api, options = {}) =>
  runReviewGate({ api, number: 12, headSha: head, maxWaitMs: 0, log: quiet, ...options });

test("actual gate passes receipt after unique short-SHA resolution and final head guard", async () =>
  assert.equal(await gate(gateApi()), true));
test("actual gate preserves formal COMMENTED reviews", async () =>
  assert.equal(await gate(gateApi({ comments: [], reviews: [makeReview()] })), true));
for (const priority of ["P0", "P1", "P2", "P3", "unknown"]) {
  test(`unresolved ${priority} finding on an older head blocks despite receipt and new request`, async () => {
    const api = gateApi({
      comments: [
        makeComment(),
        {
          id: 99,
          body: `@codex review ${head}`,
          user: { login: "owner" },
          updated_at: "2026-10-15T13:00:00Z",
        },
      ],
      inline: [
        {
          id: 44,
          body: `[${priority}] finding`,
          user,
          commit_id: other,
          pull_request_review_id: 999,
        },
      ],
    });
    assert.equal(await gate(api), false);
  });
}
test("resolved finding and its replies do not block", async () =>
  assert.equal(
    await gate(
      gateApi({
        inline: [
          { id: 44, user },
          { id: 45, in_reply_to_id: 44, user },
        ],
        resolved: [44],
      }),
    ),
    true,
  ));
test("missing formal commit identity cannot pass", async () =>
  assert.equal(
    await gate(
      gateApi({ comments: [], reviews: [makeReview({ commit_id: null, state: "APPROVED" })] }),
    ),
    false,
  ));
test("ambiguous abbreviated SHA API rejection cannot pass", async () =>
  assert.equal(
    await gate(
      gateApi({
        onRequest(path) {
          if (path.includes("/commits/"))
            throw Object.assign(new Error("Ambiguous commit"), { status: 422 });
        },
      }),
    ),
    false,
  ));
test("short SHA resolving to another full object cannot pass", async () =>
  assert.equal(
    await gate(
      gateApi({
        onRequest(path) {
          if (path.includes("/commits/")) return { sha: other };
        },
      }),
    ),
    false,
  ));
for (const body of [
  "<!-- codex-pull-request-review-summary -->\nCompleted 👍",
  `<!-- codex-review-state:v1 {"code_review":{"commit_sha":"${head}","status":"completed","has_any_findings":false,"has_unresolved_findings":false}} -->`,
]) {
  test("structured summary alone cannot pass the actual gate", async () =>
    assert.equal(await gate(gateApi({ comments: [makeComment({ body })] })), false));
}
test("latest edited negative beats a newer-created positive", () => {
  const positive = makeComment({
    id: 2,
    created_at: "2026-10-15T12:30:00Z",
    updated_at: "2026-10-15T12:30:00Z",
  });
  const negative = makeComment({
    body: receipt.replace("Didn't find any major issues", "Found P2 regression"),
    updated_at: "2026-10-15T13:00:00Z",
  });
  assert.equal(latestCodexResult([], [], [positive, negative], head).result, "fail");
  assert.equal(
    latestCodexResult([makeReview({ state: "CHANGES_REQUESTED" })], [], [makeComment()], head)
      .result,
    "fail",
  );
});
for (const boundary of [1, 2, 3]) {
  test(`new push at gate guard ${boundary} never passes`, async () => {
    let read = 0;
    const api = gateApi({
      onRequest(path) {
        if (path === `${root}/pulls/12` && ++read >= boundary)
          return makePull({ head: { sha: other } });
      },
    });
    await assert.rejects(gate(api), /superseded/);
    assert.equal(api.posted.length, 0);
  });
}
test("trigger contains the full immutable SHA and permission denial remains nonfatal", async () => {
  const api = gateApi({
    onRequest(path, options) {
      if (options.method === "POST") {
        assert.match(JSON.parse(options.body).body, new RegExp(`^@codex review ${head}`));
        throw Object.assign(new Error("Denied"), { status: 403 });
      }
    },
  });
  assert.equal(await gate(api, { triggerMode: "comment" }), true);
});
test("rerun runtime never posts another native trigger even with explicit comment mode", async () => {
  const api = gateApi();
  assert.equal(await gate(api, { triggerMode: "comment", runAttempt: 2 }), true);
  assert.deepEqual(api.posted, []);
});
for (const runAttempt of [0, -1, 1.5, NaN])
  test(`invalid run attempt ${runAttempt} cannot enable a trigger`, async () => {
    const api = gateApi();
    await assert.rejects(gate(api, { triggerMode: "comment", runAttempt }), /attempt/i);
    assert.deepEqual(api.posted, []);
  });
test("resolver rejects a new head instead of replacing the pull_request event head", async () => {
  const api = gateApi({
    onRequest(path) {
      if (path.endsWith("/pulls/12")) return makePull({ head: { sha: other } });
    },
  });
  await assert.rejects(
    resolvePrContext(api, { pull_request: makePull() }, null, "pull_request"),
    /superseded/,
  );
});
test("resolver rejects conflicting explicit PR and rechecks its final live head", async () => {
  await assert.rejects(
    resolvePrContext(gateApi(), { pull_request: makePull() }, 99, "pull_request"),
    /conflicting/,
  );
  let reads = 0;
  const api = gateApi({
    onRequest(path) {
      if (path.endsWith("/pulls/12") && ++reads === 2) return makePull({ draft: true });
    },
  });
  await assert.rejects(
    resolvePrContext(api, { pull_request: makePull() }, null, "pull_request"),
    /draft/,
  );
});

test("real API boundary paginates REST and complete thread roots", async () => {
  const urls = [];
  const api = createReviewApi("test-token", repository, async (url, options) => {
    urls.push(url);
    if (url.endsWith("/graphql")) {
      const cursor = JSON.parse(options.body).variables.cursor;
      return Response.json({
        data: {
          repository: {
            pullRequest: {
              reviewThreads: {
                nodes: [
                  { isResolved: true, comments: { nodes: [{ databaseId: cursor ? 101 : 1 }] } },
                ],
                pageInfo: { hasNextPage: !cursor, endCursor: "next" },
              },
            },
          },
        },
      });
    }
    return Response.json(
      url.includes("&page=1") ? Array.from({ length: 100 }, (_, id) => ({ id })) : [{ id: 101 }],
    );
  });
  assert.equal((await api.list(`${root}/pulls/12/reviews`)).length, 101);
  assert.deepEqual([...(await api.resolvedCommentIds(12))], [1, 101]);
  assert.equal(urls.length, 4);
});

function routerHarness({
  status = "completed",
  started = "2026-10-15T11:59:00Z",
  comments = [makeComment()],
  postError = false,
  confirm = true,
  beforeRerun = () => {},
} = {}) {
  let current = Date.parse(at) + 500;
  let run = {
    id: 100,
    workflow_id: 7,
    path: ".github/workflows/ai-review.yml",
    event: "pull_request",
    head_sha: head,
    repository: { full_name: repository },
    head_repository: { full_name: repository },
    head_branch: "feature",
    pull_requests: [{ number: 12 }],
    run_attempt: 1,
    run_started_at: started,
    status,
    conclusion: "success",
  };
  let checkpoint = null;
  let mutations = 0;
  let pull = makePull();
  const api = {
    root,
    async list(path) {
      if (path.includes("/runs?")) return [structuredClone(run)];
      if (path.endsWith("/reviews") || path.includes("/pulls/")) return [];
      return [...comments, ...(checkpoint ? [checkpoint] : [])];
    },
    async resolvedCommentIds() {
      return new Set();
    },
    async request(path, options = {}) {
      if (path === `${root}/pulls/12`) return structuredClone(pull);
      if (path.endsWith("/workflows/ai-review.yml"))
        return { id: 7, name: "AI Review", path: ".github/workflows/ai-review.yml" };
      if (path.endsWith("/rerun")) {
        beforeRerun();
        mutations += 1;
        if (confirm)
          run = {
            ...run,
            run_attempt: run.run_attempt + 1,
            status: "queued",
            run_started_at: new Date(current).toISOString(),
          };
        if (postError) throw new Error("Connection reset after POST");
        return null;
      }
      if (path.endsWith("/runs/100")) return structuredClone(run);
      if (path.includes("/commits/")) return { sha: head };
      if (options.method === "POST" || options.method === "PATCH") {
        checkpoint = {
          id: 900,
          user: { login: "github-actions[bot]", type: "Bot" },
          body: JSON.parse(options.body).body,
          updated_at: new Date(Math.floor(current / 1000) * 1000).toISOString(),
        };
        return structuredClone(checkpoint);
      }
      throw new Error(`Unexpected router request ${path}`);
    },
  };
  const event = {
    action: "edited",
    repository: { full_name: repository },
    issue: { number: 12, pull_request: {} },
    comment: makeComment(),
  };
  const route = (extra = {}) =>
    routeReviewWakeup({
      api,
      eventName: "issue_comment",
      event,
      repository,
      now: () => current,
      sleep: async (ms) => {
        current += ms;
      },
      ...(extra.eventName === "workflow_run"
        ? { scheduledPull: { number: 12, head_sha: head } }
        : {}),
      ...extra,
    });
  return {
    api,
    event,
    route,
    get run() {
      return run;
    },
    set run(value) {
      run = value;
    },
    get checkpoint() {
      return checkpoint;
    },
    set checkpoint(value) {
      checkpoint = value;
    },
    get mutations() {
      return mutations;
    },
    set pull(value) {
      pull = value;
    },
    comments,
  };
}

for (const action of ["created", "edited"])
  for (const body of [
    receipt,
    "Codex Review: Didn't find any major issues.",
    "<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 {} -->",
  ]) {
    test(`runtime routes trusted ${action} native signal including old edited summary`, () => {
      const event = {
        action,
        repository: { full_name: repository },
        issue: { number: 12, pull_request: {} },
        comment: makeComment({ body, created_at: "2020-01-01T00:00:00Z" }),
      };
      assert.equal(wakeupPrNumber("issue_comment", event, repository), 12);
      event.comment.user = { login: "owner" };
      assert.equal(wakeupPrNumber("issue_comment", event, repository), null);
    });
  }
test("router validates event kind/repository/backend/PR again", async () => {
  const h = routerHarness();
  assert.equal(await h.route({ agent: "claude" }), "ignored-backend");
  assert.equal(
    await h.route({ event: { ...h.event, repository: { full_name: "wrong/repo" } } }),
    "ignored-event",
  );
  assert.equal(await h.route({ event: { ...h.event, action: "unsupported" } }), "ignored-event");
  assert.equal(await h.route({ event: { ...h.event, issue: { number: 12 } } }), "ignored-event");
  assert.equal(h.mutations, 0);
});
test("terminal SUCCESS reruns exactly once; duplicate signal and own completion converge", async () => {
  const h = routerHarness();
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(await h.route(), "already-evaluated");
  h.run = { ...h.run, status: "completed" };
  const event = {
    action: "completed",
    repository: { full_name: repository },
    workflow_run: { ...h.run, name: "AI Review" },
  };
  assert.equal(await h.route({ eventName: "workflow_run", event }), "already-evaluated");
  assert.equal(h.mutations, 1);
});
for (const status of ["queued", "in_progress"])
  test(`${status} signal survives completion boundary via checkpoint`, async () => {
    const h = routerHarness({ status });
    assert.equal(await h.route(), "pending-active-completion");
    assert.equal(h.mutations, 0);
    h.run = { ...h.run, status: "completed", conclusion: "failure" };
    const event = {
      action: "completed",
      repository: { full_name: repository },
      workflow_run: { ...h.run, name: "AI Review" },
    };
    assert.equal(await h.route({ eventName: "workflow_run", event }), "rerun-confirmed");
    assert.equal(h.mutations, 1);
  });
test("equal-second native signal and attempt triggers one provably later attempt", async () => {
  const h = routerHarness({ started: at });
  assert.equal(await h.route(), "rerun-confirmed");
  assert.ok(Date.parse(h.run.run_started_at) > Date.parse(h.checkpoint.updated_at));
  assert.equal(await h.route(), "already-evaluated");
});
test("edited signal with same-second timestamp but changed body gets a new bounded attempt", async () => {
  const h = routerHarness();
  await h.route();
  h.run = { ...h.run, status: "completed" };
  h.comments[0].body = receipt.replace("Didn't find any major issues", "Found P2 regression");
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(await h.route(), "already-evaluated");
  assert.equal(h.mutations, 2);
});
test("API uncertainty reconciles actual accepted attempt without duplicate POST", async () => {
  const h = routerHarness({ postError: true });
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
test("API denial/uncertainty fails honestly, pending claim never authorizes a review", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  assert.equal(h.mutations, 1);
});
test("fake human checkpoint cannot suppress scheduling", async () => {
  const h = routerHarness();
  h.comments.push({
    id: 999,
    user: { login: "owner", type: "User" },
    body: "<!-- ai-review-wakeup:v1 {} -->",
    updated_at: at,
  });
  assert.equal(await h.route(), "rerun-confirmed");
});
test("duplicate trusted checkpoints fail closed", async () => {
  const h = routerHarness();
  await h.route();
  h.comments.push(structuredClone(h.checkpoint));
  await assert.rejects(h.route(), /Duplicate trusted/);
  assert.equal(h.mutations, 1);
});
test("wrong PR/head/workflow candidate never reruns", async () => {
  for (const change of [
    { head_sha: other },
    { workflow_id: 88 },
    { pull_requests: [{ number: 99 }] },
    { repository: { full_name: "wrong/repo" } },
  ]) {
    const h = routerHarness();
    h.run = { ...h.run, ...change };
    await assert.rejects(h.route(), /No exact-head/);
    assert.equal(h.mutations, 0);
  }
});
test("push immediately before rerun mutation is rejected", async () => {
  const h = routerHarness();
  const request = h.api.request;
  let posting = false;
  h.api.request = async (path, options) => {
    if (options?.method === "PATCH" && JSON.parse(options.body).body.includes('"phase":"posting"'))
      posting = true;
    if (path.endsWith("/pulls/12") && posting) h.pull = makePull({ head: { sha: other } });
    return request(path, options);
  };
  await assert.rejects(h.route(), /superseded/);
  assert.equal(h.mutations, 0);
});

test("mixed receipt and structured markers cannot hide a newer negative behind an older pass", () => {
  const mixed = makeComment({
    id: 2,
    body: `${receipt}\n[P2] regression\n<!-- codex-review-state:v1 {} -->`,
    updated_at: "2026-10-15T12:01:00Z",
  });
  assert.equal(latestCodexResult([], [], [makeComment(), mixed], head).result, "fail");
});

const summaryComment = (section = {}, extra = {}) =>
  makeComment({
    id: 99,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2026-10-15T12:01:00Z",
    body: `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify({ code_review: { commit_sha: head, has_any_findings: false, has_unresolved_findings: false, status: "completed", ...section }, security_review: { commit_sha: null, has_any_findings: null, has_unresolved_findings: null, status: null } })} -->\n\n## Codex Review Summary`,
    ...extra,
  });
for (const section of [
  { has_any_findings: true, has_unresolved_findings: true },
  { status: "in_progress", has_any_findings: null, has_unresolved_findings: null },
  { status: "queued" },
  { has_any_findings: true },
  { has_any_findings: "false" },
  { commit_sha: head.slice(0, 10) },
  { unexpected: true },
  { has_unresolved_findings: true },
]) {
  test(`newer exact-head structured veto rejects older positive: ${JSON.stringify(section)}`, async () => {
    assert.equal(
      await gate(gateApi({ comments: [makeComment(), summaryComment(section)] })),
      false,
    );
  });
}
test("completed clean summary stays neutral; summary-only cannot approve", async () => {
  assert.equal(await gate(gateApi({ comments: [summaryComment()] })), false);
  assert.equal(await gate(gateApi({ comments: [makeComment(), summaryComment()] })), true);
});
test("valid explicit other-head summary cannot veto current review", async () => {
  assert.equal(
    await gate(
      gateApi({
        comments: [
          makeComment(),
          summaryComment({
            commit_sha: other,
            has_any_findings: true,
            has_unresolved_findings: true,
          }),
        ],
      }),
    ),
    true,
  );
});
test("valid other-head summary with a rendered resolved finding stays neutral", async () => {
  const previous = summaryComment({
    commit_sha: other,
    has_any_findings: true,
    has_unresolved_findings: false,
  });
  previous.body += "\n[P2] Previous-head finding (resolved).";
  assert.equal(await gate(gateApi({ comments: [makeComment(), previous] })), true);
});
test("structured current unresolved finding survives newer receipt/request until actual summary update", async () => {
  const laterReceipt = makeComment({ updated_at: "2026-10-15T13:00:00Z" });
  const unresolved = summaryComment({ has_any_findings: true, has_unresolved_findings: true });
  assert.equal(await gate(gateApi({ comments: [unresolved, laterReceipt] })), false);
  assert.equal(await gate(gateApi({ comments: [summaryComment(), laterReceipt] })), true);
});
test("structured tie-time unfinished veto fails closed", () => {
  assert.equal(
    latestCodexResult(
      [],
      [],
      [makeComment(), summaryComment({ status: "in_progress" }, { updated_at: at })],
      head,
    ).result,
    "fail",
  );
});
for (const mutate of [
  (body) => `${body}\n<!-- codex-review-state:v1 {} -->`,
  (body) => body.replace('"code_review":', '"code_review_broken":'),
  (body) => body.replace('"status":"completed"', '"status":false'),
  (body) => body.replace('"has_any_findings":false', '"has_any_findings":null'),
  (body) => body.replace('"code_review":{', '"code_review":invalid{'),
]) {
  test("malformed/duplicate structured signal never falls back to older positive", () => {
    const malformed = summaryComment();
    malformed.body = mutate(malformed.body);
    assert.equal(latestCodexResult([], [], [makeComment(), malformed], head).result, "fail");
  });
}
test("pending posting claim cannot repeat POST after an uncertain call or newer signal", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  h.comments[0].body += "\nnew native update";
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.equal(h.mutations, 1);
});
test("crash before POST in claimed phase is retried by completion backstop", async () => {
  const h = routerHarness({ status: "in_progress" });
  assert.equal(await h.route(), "pending-active-completion");
  assert.equal(
    JSON.parse(h.checkpoint.body.slice("<!-- ai-review-wakeup:v1 ".length, -4)).phase,
    "claimed",
  );
  h.run = { ...h.run, status: "completed" };
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
test("inline and formal native event changes are validated at runtime", () => {
  for (const [name, key, actions] of [
    ["pull_request_review", "review", ["submitted", "edited", "dismissed"]],
    ["pull_request_review_comment", "comment", ["created", "edited", "deleted"]],
  ]) {
    for (const action of actions) {
      const event = {
        action,
        repository: { full_name: repository },
        pull_request: makePull(),
        [key]: { user },
      };
      assert.equal(wakeupPrNumber(name, event, repository), 12);
      event[key].user = { login: "owner" };
      assert.equal(wakeupPrNumber(name, event, repository), null);
    }
  }
});

test("new issue receipts cannot clear latest blocking formal result", async () => {
  for (const review of [
    makeReview({ state: "CHANGES_REQUESTED" }),
    makeReview({ body: "[P2] Blocking regression" }),
    makeReview({ body: "Review is still running" }),
  ]) {
    assert.equal(
      await gate(
        gateApi({
          reviews: [review],
          comments: [makeComment({ updated_at: "2026-10-15T13:00:00Z" })],
        }),
      ),
      false,
    );
  }
  assert.equal(
    await gate(gateApi({ reviews: [makeReview({ state: "DISMISSED", body: "[P2] Addressed" })] })),
    true,
  );
  assert.equal(
    await gate(
      gateApi({
        reviews: [
          makeReview({ state: "CHANGES_REQUESTED" }),
          makeReview({ id: 4, state: "APPROVED", submitted_at: "2026-10-15T12:01:00Z" }),
        ],
      }),
    ),
    true,
  );
});
test("impossible future checkpoint attempt is not overwritten", async () => {
  const h = routerHarness();
  await h.route();
  const state = JSON.parse(h.checkpoint.body.slice("<!-- ai-review-wakeup:v1 ".length, -4));
  state.source_attempt = 999;
  h.checkpoint = { ...h.checkpoint, body: `<!-- ai-review-wakeup:v1 ${JSON.stringify(state)} -->` };
  await assert.rejects(h.route(), /impossible future/);
  assert.equal(h.mutations, 1);
});

test("structured schema rejects escaped duplicate property aliases, empty status, and rendered contradictions", async () => {
  const escaped = summaryComment();
  escaped.body = escaped.body.replace(
    '"has_any_findings":false',
    '"has_any_findings":true,"\\u0068as_any_findings":false',
  );
  assert.equal(await gate(gateApi({ comments: [makeComment(), escaped] })), false);
  const emptySecurity = summaryComment();
  emptySecurity.body = emptySecurity.body.replace(
    '"security_review":{"commit_sha":null,"has_any_findings":null,"has_unresolved_findings":null,"status":null}',
    `"security_review":{"commit_sha":"${head}","has_any_findings":false,"has_unresolved_findings":false,"status":""}`,
  );
  assert.equal(await gate(gateApi({ comments: [makeComment(), emptySecurity] })), false);
  for (const text of [
    "[P2] regression",
    "Review is still running.",
    "There are unresolved findings.",
    "Review failed.",
  ]) {
    const contradictory = summaryComment();
    contradictory.body += `\n${text}`;
    assert.equal(await gate(gateApi({ comments: [makeComment(), contradictory] })), false);
  }
});

function nativeBridgeHarness({
  association = true,
  merge = false,
  candidateCount = 1,
  sourceChange = {},
} = {}) {
  const h = routerHarness();
  const fork = "contributor/fork";
  const pull = makePull({
    head: { sha: head, ref: "feature", repo: { full_name: fork } },
    merge_commit_sha: other,
  });
  h.pull = pull;
  h.run = { ...h.run, head_repository: { full_name: fork } };
  const source = {
    id: 88,
    created_at: at,
    workflow_id: 8,
    path: ".github/workflows/ai-review-native-signal.yml",
    name: "AI Review Native Signal",
    repository: { full_name: repository },
    event: "pull_request_review",
    pull_requests: association ? [{ number: 12 }] : [],
    head_sha: merge ? other : head,
    head_repository: { full_name: fork },
    head_branch: "feature",
    status: "completed",
    run_attempt: 1,
    actor: user,
    triggering_actor: user,
    ...sourceChange,
  };
  const request = h.api.request;
  const list = h.api.list;
  h.api.request = async (path, options) => {
    if (path.endsWith("/actions/runs/88")) return structuredClone(source);
    if (path.endsWith("/workflows/ai-review-native-signal.yml"))
      return { id: 8, path: source.path, name: source.name };
    return request(path, options);
  };
  h.api.list = async (path, key) =>
    path.includes("/pulls?state=open&head=")
      ? Array.from({ length: candidateCount }, () => structuredClone(pull))
      : list(path, key);
  const event = {
    action: "completed",
    repository: { full_name: repository },
    workflow_run: { id: 88, name: "AI Review Native Signal" },
  };
  return { h, event };
}

// Selected fields from the actual PR #221 fork run that exposed D-14.
// The descriptor ID is supplied by the injected workflow API in this test.
function actualForkGateHarness({ candidateChanges = [{}], runChange = {} } = {}) {
  const h = routerHarness();
  const actualRepository = "cucumberfalse/cabadrive";
  const actualRoot = `/repos/${actualRepository}`;
  const actualHead = "fac64ec451c43530976a13de0eb014700e40e9aa";
  // Association positives need genuine current-head evidence, not the generic
  // harness's older-head receipt (which correctly has no applicable outcome).
  h.comments[0] = makeComment({ body: receipt.replace(head.slice(0, 10), actualHead) });
  h.event.comment = h.comments[0];
  const pull = makePull({
    number: 221,
    head: {
      sha: actualHead,
      ref: "codex/native-review-compatibility",
      repo: { full_name: "kiaquila/cabadrive" },
    },
    base: { ref: "main", repo: { full_name: actualRepository } },
  });
  h.pull = pull;
  h.run = {
    ...h.run,
    id: 38819142507,
    name: "AI Review",
    head_sha: actualHead,
    repository: { full_name: actualRepository },
    head_repository: { full_name: "kiaquila/cabadrive" },
    head_branch: "codex/native-review-compatibility",
    pull_requests: [],
    ...runChange,
  };
  h.api.root = actualRoot;
  const request = h.api.request;
  const list = h.api.list;
  const remap = (path) =>
    path
      .replace(actualRoot, root)
      .replace("/pulls/221", "/pulls/12")
      .replace("/runs/38819142507", "/runs/100");
  h.api.request = (path, options) => request(remap(path), options);
  h.api.list = (path, key) =>
    path.includes("/pulls?state=open&head=")
      ? Promise.resolve(candidateChanges.map((change) => ({ ...structuredClone(pull), ...change })))
      : list(remap(path), key);
  const event = {
    ...h.event,
    repository: { full_name: actualRepository },
    issue: { number: 221, pull_request: {} },
  };
  const route = (extra = {}) =>
    h.route({
      repository: actualRepository,
      event,
      ...(extra.eventName === "workflow_run"
        ? { scheduledPull: { number: 221, head_sha: actualHead } }
        : {}),
      ...extra,
    });
  return { h, pull, route, actualRoot, actualHead, actualRepository };
}
test("actual fork AI Review target with an empty PR array reruns the exact raw head", async () => {
  const { h, route } = actualForkGateHarness();
  assert.equal(await route(), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
test("actual fork AI Review completion with an empty PR array wakes its exact-head gate", async () => {
  const { h, route, actualRepository } = actualForkGateHarness();
  const event = {
    action: "completed",
    repository: { full_name: actualRepository },
    workflow_run: structuredClone(h.run),
  };
  assert.equal(await route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
function actualNativeBaseSignalHarness({ merge = false, sourceChange = {}, ...options } = {}) {
  const fixture = actualForkGateHarness(options);
  const { h, pull, actualRoot, actualRepository } = fixture;
  if (merge) pull.merge_commit_sha = other;
  const source = {
    ...h.run,
    id: 38820589148,
    workflow_id: 8,
    name: "AI Review Native Signal",
    path: ".github/workflows/ai-review-native-signal.yml",
    event: "pull_request_review",
    head_repository: { full_name: actualRepository },
    head_sha: merge ? other : pull.head.sha,
    created_at: "2026-10-15T22:57:51Z",
    actor: user,
    triggering_actor: user,
    ...sourceChange,
  };
  const request = h.api.request;
  const list = h.api.list;
  h.api.request = (path, requestOptions) => {
    if (path.endsWith(`/runs/${source.id}`)) return Promise.resolve(structuredClone(source));
    if (path.endsWith("/workflows/ai-review-native-signal.yml"))
      return Promise.resolve({
        id: 8,
        path: ".github/workflows/ai-review-native-signal.yml",
        name: "AI Review Native Signal",
      });
    return request(path, requestOptions);
  };
  h.api.list = (path, key) =>
    path === `${actualRoot}/pulls?state=open`
      ? Promise.resolve(
          (options.candidateChanges || [{}]).map((change) => ({
            ...structuredClone(pull),
            ...change,
          })),
        )
      : list(path, key);
  const event = {
    action: "completed",
    repository: { full_name: actualRepository },
    workflow_run: { id: source.id, name: source.name },
  };
  return { ...fixture, event };
}
test("actual native review signal with base head_repository associates its unique fork PR", async () => {
  const { h, route, event } = actualNativeBaseSignalHarness();
  assert.equal(await route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
test("native base-repository metadata may prove a live merge identity while pinning raw head", async () => {
  const { h, route, event, actualHead } = actualNativeBaseSignalHarness({ merge: true });
  assert.equal(await route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(
    JSON.parse(h.checkpoint.body.slice("<!-- ai-review-wakeup:v1 ".length, -4)).head_sha,
    actualHead,
  );
  assert.equal(h.mutations, 1);
});
for (const sourceChange of [
  { head_repository: { full_name: "attacker/cabadrive" } },
  { head_branch: "different-branch" },
  { head_sha: other },
  { event: "workflow_dispatch" },
  { workflow_id: 999 },
]) {
  test(`native base-metadata exception rejects foreign/stale source ${JSON.stringify(sourceChange)}`, async () => {
    const { h, route, event } = actualNativeBaseSignalHarness({ sourceChange });
    await assert.rejects(
      route({ eventName: "workflow_run", event }),
      /identity|one current exact-head/,
    );
    assert.equal(h.mutations, 0);
    assert.equal(h.checkpoint, null);
  });
}
for (const second of [
  { number: 222 },
  { number: 222, draft: true },
  { number: 222, base: { ref: "release", repo: { full_name: "cucumberfalse/cabadrive" } } },
]) {
  test(`native base metadata rejects same-head cross-fork ambiguity ${JSON.stringify(second)}`, async () => {
    const { h, route, event } = actualNativeBaseSignalHarness({
      candidateChanges: [
        {},
        {
          ...second,
          head: {
            sha: "fac64ec451c43530976a13de0eb014700e40e9aa",
            ref: "codex/native-review-compatibility",
            repo: { full_name: "another/cabadrive" },
          },
        },
      ],
    });
    await assert.rejects(route({ eventName: "workflow_run", event }), /one current exact-head/);
    assert.equal(h.mutations, 0);
    assert.equal(h.checkpoint, null);
  });
}
test("native base metadata cannot repin a new head after API candidate enumeration", async () => {
  const { h, route, event, pull } = actualNativeBaseSignalHarness();
  const request = h.api.request;
  h.api.request = (path, options) => {
    if (path.endsWith("/pulls/221")) h.pull = { ...pull, head: { ...pull.head, sha: other } };
    return request(path, options);
  };
  await assert.rejects(route({ eventName: "workflow_run", event }), /one current exact-head/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("actual empty-association fork target retains its signal through active completion", async () => {
  const { h, route, actualRepository } = actualForkGateHarness({
    runChange: { status: "in_progress" },
  });
  assert.equal(await route(), "pending-active-completion");
  assert.equal(h.mutations, 0);
  h.run = { ...h.run, status: "completed" };
  const event = {
    action: "completed",
    repository: { full_name: actualRepository },
    workflow_run: structuredClone(h.run),
  };
  assert.equal(await route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(await route({ eventName: "workflow_run", event }), "already-evaluated");
  assert.equal(h.mutations, 1);
});
for (const runChange of [
  { repository: { full_name: "attacker/repo" } },
  { head_repository: { full_name: "attacker/cabadrive" } },
  { head_repository: { full_name: "cucumberfalse/cabadrive" } },
  { head_branch: "other-branch" },
  { head_sha: other },
  { workflow_id: 999 },
  { path: ".github/workflows/unrelated.yml" },
  { event: "workflow_dispatch" },
  { run_attempt: 0 },
  { pull_requests: [{ number: 221 }, { number: 222 }] },
]) {
  for (const completion of [false, true]) {
    test(`fork gate refuses foreign/stale run metadata ${JSON.stringify(runChange)} via ${completion ? "completion" : "issue"}`, async () => {
      const { h, route, actualRepository } = actualForkGateHarness({ runChange });
      const extra = completion
        ? {
            eventName: "workflow_run",
            event: {
              action: "completed",
              repository: { full_name: actualRepository },
              workflow_run: structuredClone(h.run),
            },
          }
        : {};
      await assert.rejects(route(extra), /No exact-head|identity|one current exact-head/);
      assert.equal(h.mutations, 0);
      assert.equal(h.checkpoint, null);
    });
  }
}
for (const candidateChanges of [
  [{ draft: true }],
  [{ state: "closed" }],
  [{ base: { ref: "main", repo: { full_name: "attacker/repo" } } }],
  [
    {
      head: {
        sha: other,
        ref: "codex/native-review-compatibility",
        repo: { full_name: "kiaquila/cabadrive" },
      },
    },
  ],
  [
    {
      head: {
        sha: "fac64ec451",
        ref: "codex/native-review-compatibility",
        repo: { full_name: "kiaquila/cabadrive" },
      },
    },
  ],
  [{}, { number: 222, draft: true }],
  [{}, { number: 222, base: { ref: "release", repo: { full_name: "cucumberfalse/cabadrive" } } }],
]) {
  for (const completion of [false, true]) {
    test(`empty association refuses ineligible/ambiguous API PRs ${JSON.stringify(candidateChanges)} via ${completion ? "completion" : "issue"}`, async () => {
      const { h, route, actualRepository } = actualForkGateHarness({ candidateChanges });
      const extra = completion
        ? {
            eventName: "workflow_run",
            event: {
              action: "completed",
              repository: { full_name: actualRepository },
              workflow_run: structuredClone(h.run),
            },
          }
        : {};
      await assert.rejects(route(extra), /No exact-head|one current exact-head/);
      assert.equal(h.mutations, 0);
      assert.equal(h.checkpoint, null);
    });
  }
}
test("linked fork run proves its explicit PR despite other base-branch candidates", async () => {
  const { h, route } = actualForkGateHarness({
    runChange: { pull_requests: [{ number: 221 }] },
    candidateChanges: [{}, { number: 222, draft: true }],
  });
  assert.equal(await route(), "rerun-confirmed");
  assert.equal(h.mutations, 1);
});
test("linked completion rejects an API PR number conflicting with its explicit association", async () => {
  const { h, route, pull, actualRepository } = actualForkGateHarness({
    runChange: { pull_requests: [{ number: 221 }] },
  });
  const request = h.api.request;
  h.api.request = (path, options) =>
    path.endsWith("/pulls/221")
      ? Promise.resolve({ ...pull, number: 222 })
      : request(path, options);
  const event = {
    action: "completed",
    repository: { full_name: actualRepository },
    workflow_run: structuredClone(h.run),
  };
  await assert.rejects(route({ eventName: "workflow_run", event }), /one current exact-head/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("target empty association cannot replace the pinned issue PR number", async () => {
  const { h, route } = actualForkGateHarness({ candidateChanges: [{ number: 222 }] });
  const request = h.api.request;
  h.api.request = (path, options) =>
    path.endsWith("/pulls/222")
      ? Promise.resolve({
          number: 222,
          state: "open",
          draft: false,
          head: {
            sha: "fac64ec451c43530976a13de0eb014700e40e9aa",
            ref: "codex/native-review-compatibility",
            repo: { full_name: "kiaquila/cabadrive" },
          },
          base: { repo: { full_name: "cucumberfalse/cabadrive" } },
        })
      : request(path, options);
  await assert.rejects(route(), /No exact-head/);
  assert.equal(h.mutations, 0);
});
for (const readBoundary of [1, 2, 3, 4]) {
  test(`fork association revalidation rejects a push at run-read boundary ${readBoundary}`, async () => {
    const { h, route, pull } = actualForkGateHarness();
    const request = h.api.request;
    let reads = 0;
    h.api.request = (path, options) => {
      if (path.endsWith("/runs/38819142507") && ++reads === readBoundary)
        h.pull = { ...pull, head: { ...pull.head, sha: other } };
      return request(path, options);
    };
    await assert.rejects(route(), /identity changed|Scheduling inputs changed/);
    assert.equal(h.mutations, 0);
  });
}
test("fork AI completion keeps the API-associated raw head across the router boundary", async () => {
  const { h, route, pull, actualRepository } = actualForkGateHarness();
  const request = h.api.request;
  let reads = 0;
  h.api.request = (path, options) => {
    if (path.endsWith("/pulls/221") && ++reads === 2) {
      h.pull = { ...pull, head: { ...pull.head, sha: other } };
      h.run = { ...h.run, head_sha: other };
    }
    return request(path, options);
  };
  const event = {
    action: "completed",
    repository: { full_name: actualRepository },
    workflow_run: structuredClone(h.run),
  };
  await assert.rejects(route({ eventName: "workflow_run", event }), /superseded/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
for (const association of [true, false])
  for (const merge of [true, false]) {
    test(`fork native bridge independently verifies ${association ? "linked" : "empty-association"} ${merge ? "merge" : "raw"} head`, async () => {
      const { h, event } = nativeBridgeHarness({ association, merge });
      assert.equal(await h.route({ eventName: "workflow_run", event }), "rerun-confirmed");
      assert.equal(h.mutations, 1);
    });
  }
for (const options of [
  { association: false, candidateCount: 2 },
  { sourceChange: { head_sha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" } },
  { sourceChange: { head_repository: { full_name: "attacker/wrong" } } },
  { sourceChange: { workflow_id: 999 } },
  { sourceChange: { event: "workflow_dispatch" } },
]) {
  test(`fork bridge refuses ambiguous/forged/stale source: ${JSON.stringify(options)}`, async () => {
    const { h, event } = nativeBridgeHarness(options);
    await assert.rejects(
      h.route({ eventName: "workflow_run", event }),
      /identity|one current exact-head/,
    );
    assert.equal(h.mutations, 0);
  });
}
test("polling gate checks immutable head after sleep before next evidence fetch", async () => {
  let changed = false;
  let time = 0;
  const api = gateApi({
    comments: [],
    onRequest(path) {
      if (path.endsWith("/pulls/12") && changed) return makePull({ head: { sha: other } });
    },
  });
  await assert.rejects(
    gate(api, {
      maxWaitMs: 10,
      initialPollMs: 5,
      now: () => time,
      sleep: async (ms) => {
        time += ms;
        changed = true;
      },
    }),
    /superseded/,
  );
});
test("a tied blocking formal result cannot be cleared by a later issue receipt", async () => {
  assert.equal(
    await gate(
      gateApi({
        reviews: [
          makeReview({ state: "APPROVED" }),
          makeReview({ id: 4, state: "CHANGES_REQUESTED" }),
        ],
        comments: [makeComment({ updated_at: "2026-10-15T13:00:00Z" })],
      }),
    ),
    false,
  );
});

test("native completion association cannot switch to a new head between resolver and router", async () => {
  const { h, event } = nativeBridgeHarness();
  const request = h.api.request;
  let reads = 0;
  h.api.request = async (path, options) => {
    if (path.endsWith("/pulls/12") && ++reads === 2) {
      h.pull = makePull({
        head: { sha: other, ref: "feature", repo: { full_name: "contributor/fork" } },
      });
      h.run = { ...h.run, head_sha: other };
    }
    return request(path, options);
  };
  await assert.rejects(h.route({ eventName: "workflow_run", event }), /superseded/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});

test("late formal dismissal with unchanged submitted_at and no checkpoint requeues terminal gate", async () => {
  const { h, event } = nativeBridgeHarness({
    sourceChange: { created_at: "2026-10-15T14:00:00Z" },
  });
  h.run = { ...h.run, run_started_at: "2026-10-15T13:00:00Z" };
  const list = h.api.list;
  h.api.list = async (path, key) =>
    path.endsWith("/reviews")
      ? [makeReview({ state: "DISMISSED", submitted_at: at })]
      : list(path, key);
  assert.equal(await h.route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(h.mutations, 1);
  assert.equal(await h.route({ eventName: "workflow_run", event }), "already-evaluated");
});
test("late inline deletion with only older remaining native timestamps requeues once", async () => {
  const { h, event } = nativeBridgeHarness({
    sourceChange: { event: "pull_request_review_comment", created_at: "2026-10-15T14:00:00Z" },
  });
  h.run = { ...h.run, run_started_at: "2026-10-15T13:00:00Z" };
  assert.equal(await h.route({ eventName: "workflow_run", event }), "rerun-confirmed");
  assert.equal(await h.route({ eventName: "workflow_run", event }), "already-evaluated");
  assert.equal(h.mutations, 1);
});

for (const sourceChange of [
  { id: 38819773038, actor: { login: "kiaquila" }, triggering_actor: { login: "kiaquila" } },
  { actor: { login: "owner" } },
  { triggering_actor: { login: "owner" } },
  { actor: null },
  { triggering_actor: null },
])
  test(`native source rejects API actor provenance ${JSON.stringify(sourceChange)}`, async () => {
    const { h, route, event } = actualNativeBaseSignalHarness({ sourceChange });
    event.workflow_run.actor = user;
    event.workflow_run.triggering_actor = user;
    await assert.rejects(route({ eventName: "workflow_run", event }), /actor|provenance/i);
    assert.equal(h.mutations, 0);
    assert.equal(h.checkpoint, null);
  });
test("actual inline bot source and configured Codex actors remain schedulable", async () => {
  for (const sourceChange of [
    { id: 38820589793, event: "pull_request_review_comment", created_at: "2026-10-15T22:57:52Z" },
    { actor: { login: "Custom-Codex" }, triggering_actor: { login: "custom-codex" } },
  ]) {
    const { h, route, event } = actualNativeBaseSignalHarness({ sourceChange });
    assert.equal(
      await route({
        eventName: "workflow_run",
        event,
        config: { trustedReviewLoginsByAgent: { codex: ["custom-codex"] } },
      }),
      "rerun-confirmed",
    );
    assert.equal(h.mutations, 1);
  }
});
for (const action of ["created", "edited"])
  test(`configured trusted ${action} native comment reaches runtime; copied unknown text cannot mutate`, async () => {
    for (const body of [receipt, summaryComment().body])
      for (const key of ["trustedReviewLogins", "trustedReviewLoginsByAgent"]) {
        const h = routerHarness();
        const config =
          key === "trustedReviewLogins"
            ? { trustedReviewLogins: ["custom-codex"] }
            : { trustedReviewLoginsByAgent: { codex: ["custom-codex"] } };
        const event = {
          ...h.event,
          action,
          comment: makeComment({ body, user: { login: "CUSTOM-CODEX" } }),
        };
        h.comments[0] = event.comment;
        const positive = body === receipt;
        assert.equal(
          await h.route({ event, config }),
          positive ? "rerun-confirmed" : "no-native-outcome",
        );
        const unknown = { ...event, comment: { ...event.comment, user: { login: "unknown" } } };
        assert.equal(await h.route({ event: unknown, config }), "ignored-event");
        assert.equal(h.mutations, positive ? 1 : 0);
        if (!positive) assert.equal(h.checkpoint, null);
      }
  });

const schedule = (h, extra = {}) =>
  h.route({
    eventName: "schedule",
    event: { repository: { full_name: repository } },
    scheduledPull: { number: 12, head_sha: head },
    ...extra,
  });
test("scheduled resolution with old native timestamps requeues failed gate once then converges", async () => {
  const h = routerHarness({ started: "2026-10-15T13:00:00Z" });
  h.run = { ...h.run, conclusion: "failure" };
  let resolved = false;
  const list = h.api.list;
  h.api.list = (path, key) =>
    path.endsWith("/pulls/12/comments")
      ? Promise.resolve([{ id: 44, user, body: "[P2] finding", created_at: at, updated_at: at }])
      : list(path, key);
  h.api.resolvedCommentIds = async () => new Set(resolved ? [44] : []);
  assert.equal(await schedule(h), "matching-outcome");
  assert.equal(h.checkpoint, null);
  resolved = true;
  assert.equal(await schedule(h), "rerun-confirmed");
  assert.equal(await schedule(h), "already-evaluated");
  h.run = { ...h.run, status: "completed", conclusion: "success" };
  assert.equal(await schedule(h), "already-evaluated");
  const event = {
    action: "completed",
    repository: { full_name: repository },
    workflow_run: { ...h.run, name: "AI Review" },
  };
  assert.equal(await h.route({ eventName: "workflow_run", event }), "already-evaluated");
  assert.equal(h.mutations, 1);
});
test("scheduled reopened finding requeues an old successful gate without a native request", async () => {
  const h = routerHarness({ started: "2026-10-15T13:00:00Z" });
  const list = h.api.list;
  h.api.list = (path, key) =>
    path.endsWith("/pulls/12/comments")
      ? Promise.resolve([{ id: 44, user, body: "[P3] finding", created_at: at, updated_at: at }])
      : list(path, key);
  assert.equal(await schedule(h), "rerun-confirmed");
  assert.equal(await schedule(h), "already-evaluated");
  assert.equal(h.mutations, 1);
});
test("scheduled matching success, no evidence and active baseline do not create checkpoints", async () => {
  for (const options of [{}, { comments: [] }, { status: "in_progress" }]) {
    const h = routerHarness({ started: "2026-10-15T13:00:00Z", ...options });
    assert.match(await schedule(h), /matching-outcome|no-signal|active-no-baseline/);
    assert.equal(h.checkpoint, null);
    assert.equal(h.mutations, 0);
  }
});
test("scheduled baseline defers active failure until terminal, and pending uncertain POST never repeats", async () => {
  const h = routerHarness({
    started: "2026-10-15T13:00:00Z",
    status: "in_progress",
    confirm: false,
  });
  h.run = { ...h.run, conclusion: null };
  assert.equal(await schedule(h), "active-no-baseline");
  h.run = { ...h.run, status: "completed", conclusion: "failure" };
  await assert.rejects(schedule(h), /could not be confirmed/);
  await assert.rejects(schedule(h), /uncertain/);
  assert.equal(h.mutations, 1);
});
test("scheduled pinned discovery head cannot follow a new push", async () => {
  const h = routerHarness();
  h.pull = makePull({ head: { sha: other } });
  await assert.rejects(schedule(h), /superseded/);
  assert.equal(h.mutations, 0);
});
test("scheduled discovery paginates actual API open PRs and validates every pinned head read-only", async () => {
  const urls = [];
  const api = createReviewApi("test-token", repository, async (url, options) => {
    assert.equal(options.method, undefined);
    urls.push(url);
    if (url.includes("pulls?")) {
      const page = Number(new URL(url).searchParams.get("page"));
      assert.ok(page <= 2, "discovery pagination must terminate");
      return Response.json(
        page === 1
          ? Array.from({ length: 100 }, (_, index) => makePull({ number: index + 1 }))
          : [makePull({ number: 101 }), makePull({ number: 102, draft: true })],
      );
    }
    return Response.json(makePull({ number: Number(url.split("/").at(-1)) }));
  });
  const targets = await discoverWakeupPulls(api, repository);
  assert.equal(targets.length, 101);
  assert.deepEqual(targets.at(-1), { number: 101, head_sha: head });
  assert.equal(urls.filter((url) => url.includes("pulls?")).length, 2);
  assert.equal(urls.length, 103);
});
test("scheduled discovery rejects duplicate/foreign identity and API-pinned push races", async () => {
  const h = routerHarness();
  h.api.list = async () => [makePull(), makePull()];
  await assert.rejects(discoverWakeupPulls(h.api, repository), /Duplicate/);
  await assert.rejects(discoverWakeupPulls(h.api, "foreign/repo"), /Foreign/);
  h.api.list = async () => [makePull()];
  h.pull = makePull({ head: { sha: other } });
  await assert.rejects(discoverWakeupPulls(h.api, repository), /superseded/);
  assert.equal(h.mutations, 0);
});
test("scheduled null native result, other backend, or unresolvable short SHA cannot schedule", async () => {
  const neutral = routerHarness({ comments: [summaryComment()], started: "2026-10-15T13:00:00Z" });
  assert.equal(await schedule(neutral), "no-native-outcome");
  assert.equal(await schedule(neutral, { agent: "claude" }), "ignored-backend");
  assert.equal(neutral.mutations, 0);
  assert.equal(neutral.checkpoint, null);
  const h = routerHarness();
  h.run = { ...h.run, conclusion: "failure" };
  const request = h.api.request;
  h.api.request = (path, options) =>
    path.includes("/commits/")
      ? Promise.reject(new Error("Ambiguous commit"))
      : request(path, options);
  await assert.rejects(schedule(h), /Ambiguous/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("scheduled trusted fail-closed native contradiction re-evaluates successful gate once", async () => {
  const h = routerHarness({
    comments: [makeComment(), summaryComment({ has_any_findings: "false" })],
    started: "2026-10-15T13:00:00Z",
  });
  assert.equal(await schedule(h), "rerun-confirmed");
  assert.equal(await schedule(h), "already-evaluated");
  assert.equal(h.mutations, 1);
});
test("resolution changes after a consumed checkpoint re-evaluate actual native state without schedule freshness", async () => {
  const h = routerHarness();
  const list = h.api.list;
  let resolved = true;
  h.api.list = (path, key) =>
    path.endsWith("/pulls/12/comments")
      ? Promise.resolve([{ id: 44, user, body: "[P3] finding", created_at: at, updated_at: at }])
      : list(path, key);
  h.api.resolvedCommentIds = async () => new Set(resolved ? [44] : []);
  assert.equal(await h.route(), "rerun-confirmed");
  h.run = { ...h.run, status: "completed" };
  assert.equal(await schedule(h), "already-evaluated");
  resolved = false;
  assert.equal(await schedule(h), "rerun-confirmed");
  assert.equal(await schedule(h), "already-evaluated");
  assert.equal(h.mutations, 2);
});
test("scheduled claimed state survives active completion and no-signal posting uncertainty cannot be overwritten", async () => {
  const h = routerHarness({ status: "in_progress", confirm: false });
  assert.equal(await h.route(), "pending-active-completion");
  assert.equal(await schedule(h), "pending-active-completion");
  h.run = { ...h.run, status: "completed", conclusion: "failure" };
  await assert.rejects(schedule(h), /could not be confirmed/);
  h.comments.length = 0;
  await assert.rejects(schedule(h), /uncertain/);
  assert.equal(h.mutations, 1);
});
test("periodic configured-native authors use the same policy and preserve source-to-completion convergence", async () => {
  const h = routerHarness({
    started: "2026-10-15T13:00:00Z",
    comments: [makeComment({ user: { login: "custom-codex" } })],
  });
  h.run = { ...h.run, conclusion: "failure" };
  const config = { trustedReviewLoginsByAgent: { codex: ["custom-codex"] } };
  assert.equal(await schedule(h, { config }), "rerun-confirmed");
  const api = gateApi({ comments: h.comments });
  assert.equal(
    await gate(api, { config, triggerMode: "comment", runAttempt: h.run.run_attempt }),
    true,
  );
  assert.deepEqual(api.posted, []);
  h.run = { ...h.run, status: "completed", conclusion: "success" };
  const event = {
    action: "completed",
    repository: { full_name: repository },
    workflow_run: { ...h.run, name: "AI Review" },
  };
  assert.equal(await h.route({ eventName: "workflow_run", event, config }), "already-evaluated");
  assert.equal(await schedule(h, { config }), "already-evaluated");
  assert.equal(h.mutations, 1);
});

async function priorLedgerHarness({ oldHead = head, settled = true } = {}) {
  const h = routerHarness();
  await h.route();
  const prior = { ...h.run, head_sha: oldHead };
  const value = JSON.parse(h.checkpoint.body.slice("<!-- ai-review-wakeup:v1 ".length, -4));
  value.head_sha = oldHead;
  h.checkpoint = { ...h.checkpoint, body: `<!-- ai-review-wakeup:v1 ${JSON.stringify(value)} -->` };
  if (!settled) prior.run_attempt = value.source_attempt;
  h.run = {
    ...h.run,
    id: 200,
    run_attempt: 1,
    status: "completed",
    conclusion: "success",
    run_started_at: "2026-10-15T13:00:00Z",
  };
  const request = h.api.request;
  h.api.request = (path, options) =>
    path.endsWith("/runs/100")
      ? Promise.resolve(structuredClone(prior))
      : request(path.replace("/runs/200", "/runs/100"), options);
  return { h, prior };
}
for (const oldHead of [head, other])
  for (const outcome of ["pass", "fail"])
    test(`stale ${oldHead === head ? "other-run" : "prior-head"} ledger cannot force matching ${outcome} baseline rerun`, async () => {
      const { h } = await priorLedgerHarness({ oldHead });
      h.run = { ...h.run, conclusion: outcome === "pass" ? "success" : "failure" };
      if (outcome === "fail")
        h.comments[0].body = receipt.replace("Didn't find any major issues", "Found P2 regression");
      const before = structuredClone(h.checkpoint);
      assert.equal(await schedule(h), "matching-outcome");
      assert.deepEqual(h.checkpoint, before);
      assert.equal(h.mutations, 1);
    });
for (const oldHead of [head, other])
  test(`settled stale ${oldHead === head ? "other-run" : "prior-head"} ledger allows one genuine current mismatch`, async () => {
    const { h } = await priorLedgerHarness({ oldHead });
    h.run = { ...h.run, conclusion: "failure" };
    assert.equal(await schedule(h), "rerun-confirmed");
    assert.equal(await schedule(h), "already-evaluated");
    assert.equal(h.mutations, 2);
  });
test("uncertain old-head posting state is reconciled against its own run and never overwritten", async () => {
  const { h } = await priorLedgerHarness({ oldHead: other, settled: false });
  const before = structuredClone(h.checkpoint);
  await assert.rejects(schedule(h), /uncertain/);
  assert.deepEqual(h.checkpoint, before);
  assert.equal(h.mutations, 1);
});
for (const change of [
  { workflow_id: 88 },
  { path: ".github/workflows/other.yml" },
  { event: "workflow_dispatch" },
  { head_sha: head },
  { repository: { full_name: "foreign/repo" } },
  { head_repository: { full_name: "foreign/fork" } },
  { head_branch: "other" },
  { pull_requests: [{ number: 99 }] },
  { pull_requests: [{ number: 12 }, { number: 99 }] },
  { run_attempt: 0 },
  { run_started_at: at },
])
  test(`historical posting settlement rejects missing identity/temporal proof ${JSON.stringify(change)}`, async () => {
    const { h, prior } = await priorLedgerHarness({ oldHead: other });
    Object.assign(prior, change);
    const before = structuredClone(h.checkpoint);
    await assert.rejects(schedule(h), /identity|attempt|uncertain/);
    assert.deepEqual(h.checkpoint, before);
    assert.equal(h.mutations, 1);
  });
test("native source actor is fetched again before checkpoint mutation", async () => {
  const { h, event } = nativeBridgeHarness();
  const request = h.api.request;
  let reads = 0;
  h.api.request = async (path, options) => {
    const value = await request(path, options);
    return path.endsWith("/runs/88") && ++reads > 1
      ? { ...value, triggering_actor: { login: "owner" } }
      : value;
  };
  await assert.rejects(h.route({ eventName: "workflow_run", event }), /actor provenance/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("real trusted native source with no independently fetched native evidence cannot schedule", async () => {
  const { h, route, event } = actualNativeBaseSignalHarness();
  h.comments.length = 0;
  assert.equal(await route({ eventName: "workflow_run", event }), "no-signal");
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("schedule revalidates configured trust before a claim", async () => {
  const h = routerHarness({ comments: [makeComment({ user: { login: "custom-codex" } })] });
  h.run = { ...h.run, conclusion: "failure" };
  const config = { trustedReviewLogins: ["custom-codex"] };
  const list = h.api.list;
  let snapshots = 0;
  h.api.list = (path, key) => {
    if (path.endsWith("/reviews") && ++snapshots === 2) config.trustedReviewLogins.length = 0;
    return list(path, key);
  };
  await assert.rejects(schedule(h, { config }), /Scheduling inputs changed/);
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});
test("schedule revalidates resolution after the posting boundary before the rerun POST", async () => {
  const h = routerHarness();
  const list = h.api.list;
  let reopened = true;
  h.api.list = (path, key) =>
    path.endsWith("/pulls/12/comments")
      ? Promise.resolve([{ id: 44, user, body: "[P2] finding", created_at: at, updated_at: at }])
      : list(path, key);
  h.api.resolvedCommentIds = async () => new Set(reopened ? [] : [44]);
  const request = h.api.request;
  h.api.request = (path, options) => {
    if (options?.method === "PATCH" && JSON.parse(options.body).body.includes('"phase":"posting"'))
      reopened = false;
    return request(path, options);
  };
  await assert.rejects(schedule(h), /Scheduling inputs changed before rerun/);
  assert.equal(h.mutations, 0);
});

function deliverPosting(h, channel) {
  if (channel === "schedule") return schedule(h);
  if (channel === "completion")
    return h.route({
      eventName: "workflow_run",
      event: {
        action: "completed",
        repository: { full_name: repository },
        workflow_run: { ...h.run, name: "AI Review" },
      },
    });
  return h.route();
}

const unprovenPostingStarts = {
  "same second": at,
  older: "2026-10-15T11:59:59Z",
  missing: undefined,
  invalid: "not a server timestamp",
  future: "2099-10-15T12:00:01Z",
};

function observePostingWrites(h) {
  const writes = [];
  const request = h.api.request;
  h.api.request = (path, options) => {
    if (options?.method) writes.push({ path, method: options.method });
    return request(path, options);
  };
  return writes;
}

for (const channel of ["direct", "completion", "schedule"])
  for (const changed of [false, true])
    for (const [chronology, started] of Object.entries(unprovenPostingStarts))
      test(`advanced posting ${channel} preserves ${changed ? "changed" : "same"} snapshot with ${chronology} start`, async () => {
        const h = routerHarness();
        assert.equal(await h.route(), "rerun-confirmed");
        h.run = { ...h.run, status: "completed", run_started_at: started };
        if (changed)
          h.comments[0].body = receipt.replace(
            "Didn't find any major issues",
            "Found P2 regression",
          );
        const before = structuredClone(h.checkpoint);
        const writes = observePostingWrites(h);
        for (let delivery = 0; delivery < 2; delivery += 1)
          await assert.rejects(deliverPosting(h, channel), /acceptance remains uncertain/);
        assert.deepEqual(h.checkpoint, before);
        assert.deepEqual(writes, []);
        assert.equal(h.mutations, 1);
      });

for (const channel of ["direct", "completion", "schedule"])
  for (const oldHead of [head, other])
    for (const [chronology, started] of Object.entries(unprovenPostingStarts))
      test(`historical posting ${channel} preserves ${oldHead === head ? "other-run" : "prior-head"} ledger with ${chronology} start`, async () => {
        const { h, prior } = await priorLedgerHarness({ oldHead });
        prior.run_started_at = started;
        h.comments[0].body = receipt.replace("Didn't find any major issues", "Found P2 regression");
        const before = structuredClone(h.checkpoint);
        const writes = observePostingWrites(h);
        await assert.rejects(deliverPosting(h, channel), /acceptance remains uncertain/);
        assert.deepEqual(h.checkpoint, before);
        assert.deepEqual(writes, []);
        assert.equal(h.mutations, 1);
      });

for (const channel of ["direct", "completion", "schedule"])
  for (const changed of [false, true])
    test(`strictly later posting ${channel} settles prior POST without consuming ${changed ? "new" : "duplicate"} snapshot`, async () => {
      const h = routerHarness();
      assert.equal(await h.route(), "rerun-confirmed");
      h.run = { ...h.run, status: "completed" };
      const before = structuredClone(h.checkpoint);
      if (changed)
        h.comments[0].body = receipt.replace("Didn't find any major issues", "Found P2 regression");
      const writes = observePostingWrites(h);
      assert.equal(
        await deliverPosting(h, channel),
        changed ? "rerun-confirmed" : "already-evaluated",
      );
      assert.equal(await deliverPosting(h, channel), "already-evaluated");
      assert.equal(h.mutations, changed ? 2 : 1);
      if (!changed) {
        assert.deepEqual(h.checkpoint, before);
        assert.deepEqual(writes, []);
      }
    });

for (const channel of ["direct", "completion", "schedule"])
  for (const ledger of ["current", "other-run", "prior-head"])
    test(`posting ${channel} requires strict persisted signal chronology for ${ledger} ledger`, async () => {
      let h;
      let prior;
      if (ledger === "current") {
        h = routerHarness();
        await h.route();
        h.run = { ...h.run, status: "completed" };
        prior = h.run;
      } else
        ({ h, prior } = await priorLedgerHarness({
          oldHead: ledger === "prior-head" ? other : head,
        }));
      const value = JSON.parse(h.checkpoint.body.slice("<!-- ai-review-wakeup:v1 ".length, -4));
      value.signal_updated_at = "2026-10-15T12:00:01Z";
      h.checkpoint = {
        ...h.checkpoint,
        body: `<!-- ai-review-wakeup:v1 ${JSON.stringify(value)} -->`,
      };
      prior.run_started_at = value.signal_updated_at;
      const before = structuredClone(h.checkpoint);
      const writes = observePostingWrites(h);
      await assert.rejects(deliverPosting(h, channel), /acceptance remains uncertain/);
      assert.deepEqual(h.checkpoint, before);
      assert.deepEqual(writes, []);
      assert.equal(h.mutations, 1);
    });

for (const channel of ["direct", "completion", "schedule"]) {
  test(`posting ${channel} reconciles delayed strict proof without any write`, async () => {
    const h = routerHarness();
    await h.route();
    h.run = { ...h.run, status: "completed", run_started_at: at };
    const before = structuredClone(h.checkpoint);
    const writes = observePostingWrites(h);
    const route = h.route;
    let waits = 0;
    h.route = (extra) =>
      route({
        ...extra,
        sleep: async () => {
          waits += 1;
          h.run = { ...h.run, run_started_at: "2026-10-15T12:00:01Z" };
        },
      });
    assert.equal(await deliverPosting(h, channel), "already-evaluated");
    assert.equal(waits, 1);
    assert.deepEqual(h.checkpoint, before);
    assert.deepEqual(writes, []);
    assert.equal(h.mutations, 1);
  });
  test(`unposted claimed ${channel} state can retry an advanced ambiguous boundary once`, async () => {
    const h = routerHarness({ status: "in_progress" });
    assert.equal(await h.route(), "pending-active-completion");
    h.run = { ...h.run, run_attempt: 2, status: "completed", run_started_at: at };
    assert.equal(await deliverPosting(h, channel), "rerun-confirmed");
    assert.equal(await deliverPosting(h, channel), "already-evaluated");
    assert.equal(h.run.run_attempt, 3);
    assert.equal(h.mutations, 1);
  });
}

const { headSha: chefHead, comment: chefComment } = JSON.parse(
  readFileSync(new URL("./fixtures/codex-review-receipt-6206390117.json", import.meta.url), "utf8"),
);

test("actual gate accepts observed Chef's kiss receipt only after unique short-SHA proof", async () => {
  const requests = [];
  const api = gateApi({
    headSha: chefHead,
    comments: [chefComment],
    onRequest(path) {
      requests.push(path);
    },
  });
  assert.equal(await gate(api, { headSha: chefHead }), true);
  assert.equal(requests.filter((path) => path === `${root}/commits/80fa2f6b75`).length, 1);
  assert.equal(requests.filter((path) => path === `${root}/pulls/12`).length, 3);
  assert.deepEqual(api.posted, []);
});

for (const proof of [
  "wrong full SHA",
  "missing SHA object",
  "missing commit",
  "ambiguous commit",
]) {
  test(`observed Chef's kiss gate rejects ${proof}`, async () => {
    const api = gateApi({
      headSha: chefHead,
      comments: [chefComment],
      onRequest(path) {
        if (!path.includes("/commits/")) return;
        if (proof === "wrong full SHA") return { sha: other };
        if (proof === "missing SHA object") return {};
        throw Object.assign(new Error(proof), { status: proof === "ambiguous commit" ? 422 : 404 });
      },
    });
    assert.equal(await gate(api, { headSha: chefHead }), false);
  });
}

for (const boundary of [1, 2, 3]) {
  test(`observed Chef's kiss gate rejects a push at head guard ${boundary}`, async () => {
    let reads = 0;
    const api = gateApi({
      headSha: chefHead,
      comments: [chefComment],
      onRequest(path) {
        if (path === `${root}/pulls/12` && ++reads >= boundary)
          return makePull({ head: { sha: other } });
      },
    });
    await assert.rejects(gate(api, { headSha: chefHead }), /superseded/);
    assert.deepEqual(api.posted, []);
  });
}

for (const blocker of [
  "unresolved older-head finding",
  "blocking formal review",
  "negative summary",
  "newer negative receipt",
  "untrusted receipt",
]) {
  test(`observed Chef's kiss gate preserves ${blocker} veto`, async () => {
    const options = { headSha: chefHead, comments: [chefComment] };
    if (blocker === "unresolved older-head finding")
      options.inline = [{ id: 44, body: "[P3] Still unresolved", user, commit_id: other }];
    if (blocker === "blocking formal review")
      options.reviews = [makeReview({ commit_id: chefHead, state: "CHANGES_REQUESTED" })];
    if (blocker === "negative summary") {
      const state = {
        code_review: {
          commit_sha: chefHead,
          has_any_findings: true,
          has_unresolved_findings: true,
          status: "completed",
        },
        security_review: {
          commit_sha: null,
          has_any_findings: null,
          has_unresolved_findings: null,
          status: null,
        },
      };
      options.comments.push({
        ...chefComment,
        id: 2,
        body: `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->`,
        updated_at: "2026-10-16T02:05:00Z",
      });
    }
    if (blocker === "newer negative receipt")
      options.comments.push({
        ...chefComment,
        id: 2,
        body: chefComment.body.replace("Didn't find any major issues", "Found a P2 regression"),
        updated_at: "2026-10-16T02:05:00Z",
      });
    if (blocker === "untrusted receipt")
      options.comments = [
        { ...chefComment, user: { login: "repo-owner" }, author_association: "OWNER" },
      ];
    assert.equal(await gate(gateApi(options), { headSha: chefHead }), false);
  });
}

function completionMatrixHarness({ native = false, linked = false } = {}) {
  const { h, event: nativeEvent } = nativeBridgeHarness({ association: linked });
  h.run = { ...h.run, name: "AI Review", pull_requests: linked ? [{ number: 12 }] : [] };
  let currentNumber = 12;
  const currentPull = (number = currentNumber) =>
    makePull({
      number,
      state: number === currentNumber ? "open" : "closed",
      head: { sha: head, ref: "feature", repo: { full_name: "contributor/fork" } },
    });
  const writes = [];
  const request = h.api.request;
  const list = h.api.list;
  h.api.request = (path, options = {}) => {
    const pullNumber = path.match(/\/pulls\/(12|13)$/)?.[1];
    if (pullNumber) return Promise.resolve(currentPull(Number(pullNumber)));
    if (["POST", "PATCH"].includes(options.method) && path.includes("/issues/"))
      writes.push({ path, body: options.body });
    return request(path, options);
  };
  h.api.list = (path, key) =>
    path.includes("/pulls?state=open&head=")
      ? Promise.resolve([currentPull()])
      : list(path.replace("/issues/13/", "/issues/12/").replace("/pulls/13/", "/pulls/12/"), key);
  const event = native
    ? nativeEvent
    : {
        action: "completed",
        repository: { full_name: repository },
        workflow_run: structuredClone(h.run),
      };
  const route = (pin = { number: 12, head_sha: head }) =>
    h.route({ eventName: "workflow_run", event, scheduledPull: pin });
  return {
    h,
    event,
    route,
    writes,
    replacePull: () => {
      currentNumber = 13;
    },
  };
}

for (const native of [false, true]) {
  test(`completion matrix pin rejects A-keyed delivery after ${native ? "native" : "AI Review"} empty association moves to replacement B`, async () => {
    const { h, event, route, writes, replacePull } = completionMatrixHarness({ native });
    assert.equal(await resolveWakeupPrNumber(h.api, "workflow_run", event, repository), 12);
    assert.equal(writes.length, 0);
    replacePull();
    await assert.rejects(route(), /pinned PR\/head/);
    assert.deepEqual(writes, []);
    assert.equal(h.mutations, 0);
    assert.equal(h.checkpoint, null);
    assert.equal(await route({ number: 13, head_sha: head }), "rerun-confirmed");
    assert.equal(h.mutations, 1);
    assert.equal(writes[0].path, `${root}/issues/13/comments`);
    assert.ok(writes.every(({ path }) => !path.includes("/issues/12/")));
  });
  for (const pin of [
    null,
    {},
    { head_sha: head },
    { number: 12 },
    { number: 0, head_sha: head },
    { number: -1, head_sha: head },
    { number: 12.5, head_sha: head },
    { number: Number.MAX_SAFE_INTEGER + 1, head_sha: head },
    { number: "12", head_sha: head },
    { number: 12, head_sha: head.slice(0, 10) },
    { number: 12, head_sha: "g".repeat(40) },
    { number: 13, head_sha: head },
    { number: 12, head_sha: other },
  ])
    test(`completion matrix pin rejects ${native ? "native" : "AI Review"} missing/malformed/mismatched pair ${JSON.stringify(pin)}`, async () => {
      const { h, route, writes } = completionMatrixHarness({ native });
      await assert.rejects(route(pin), /pinned .*context|pinned PR\/head/);
      assert.deepEqual(writes, []);
      assert.equal(h.mutations, 0);
      assert.equal(h.checkpoint, null);
    });
  for (const linked of [false, true])
    test(`completion matrix pin accepts independently verified ${native ? "native" : "AI Review"} ${linked ? "linked" : "empty"} association`, async () => {
      const { h, route, writes } = completionMatrixHarness({ native, linked });
      assert.equal(await route(), "rerun-confirmed");
      assert.equal(h.mutations, 1);
      assert.equal(writes[0].path, `${root}/issues/12/comments`);
      assert.equal(await route(), "already-evaluated");
      assert.equal(h.mutations, 1);
    });
  test(`completion matrix pin preserves A identity when ${native ? "native" : "AI Review"} source association changes before claim`, async () => {
    const { h, route, writes, replacePull } = completionMatrixHarness({ native });
    h.api.resolvedCommentIds = async () => {
      replacePull();
      return new Set();
    };
    await assert.rejects(route(), /source identity|superseded/);
    assert.deepEqual(writes, []);
    assert.equal(h.mutations, 0);
    assert.equal(h.checkpoint, null);
  });
}

test("fork association alone cannot schedule a stale receipt with no applicable native outcome", async () => {
  const { h, route } = actualForkGateHarness();
  h.comments[0] = makeComment();
  assert.equal(await route(), "no-native-outcome");
  assert.equal(h.mutations, 0);
  assert.equal(h.checkpoint, null);
});

for (const resolved of [false, true])
  test(`F25 actual gate exact P3 formal root ${resolved ? "resolved" : "unresolved"}`, async () => {
    const body = "[P3] Found an issue";
    const api = gateApi({
      comments: [],
      reviews: [makeReview({ body })],
      inline: [{ id: 44, user, body, commit_id: head, pull_request_review_id: 3 }],
      resolved: resolved ? [44] : [],
    });
    assert.equal(await gate(api), resolved);
  });

for (const priority of ["P3", "unknown"])
  for (const commit_id of [head, other])
    test(`F25 P3 formal advisory cannot hide unresolved ${priority}/${commit_id}`, async () =>
      assert.equal(
        await gate(
          gateApi({
            reviews: [makeReview({ body: "[P3] Found an issue" })],
            inline: [
              {
                id: 44,
                user,
                body: `[${priority}] Found an issue`,
                commit_id,
                pull_request_review_id: 999,
              },
            ],
          }),
        ),
        false,
      ));
for (const body of [
  "[P3] Found an issue\n[P2] Regression",
  "[P3] Found an issue\nFound an issue",
  "[P3] Found an issue\nReview is still running.",
  "[P3] Found an issue\nThere are unresolved findings.",
])
  test(`F25 actual gate preserves formal veto ${JSON.stringify(body)}`, async () =>
    assert.equal(await gate(gateApi({ reviews: [makeReview({ body })] })), false));
test("F25 corrected or dismissed latest formal permits actual resolved advisory", async () => {
  const advisory = makeReview({ body: "[P3] Found an issue" });
  const blocking = makeReview({
    id: 4,
    body: "Found an issue",
    submitted_at: "2026-10-15T12:01:00Z",
  });
  assert.equal(await gate(gateApi({ reviews: [advisory, blocking] })), false);
  assert.equal(
    await gate(gateApi({ reviews: [advisory, { ...blocking, body: advisory.body }] })),
    true,
  );
  assert.equal(
    await gate(gateApi({ reviews: [advisory, { ...blocking, state: "DISMISSED" }] })),
    true,
  );
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
    test(`F26 actual gate resolved P3 root preserves original mixed formal veto ${JSON.stringify(body)}`, async () => {
      const api = gateApi({
        comments: [makeComment({ updated_at: "2026-10-15T12:02:00Z" })],
        reviews: [makeReview({ body })],
        inline: [
          { id: 44, user, body: "[P3] Found an issue", commit_id: head, pull_request_review_id: 3 },
        ],
        resolved: [44],
      });
      assert.equal(await gate(api), false);
    });

// F28 fixtures exercise the supported native schema; they are not native API payloads.
const f28Empty = () => ({
  commit_sha: null,
  has_any_findings: null,
  has_unresolved_findings: null,
  status: null,
});
const f28Clean = (commit_sha = head) => ({
  commit_sha,
  has_any_findings: false,
  has_unresolved_findings: false,
  status: "completed",
});
const f28Summary = (state, extra = {}) =>
  makeComment({
    id: 280,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2026-10-15T12:01:00Z",
    body: `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->\n\n## Codex Review Summary`,
    ...extra,
  });
const f28NegativeSections = [
  ...["running", "pending", "in_progress", "failed", "incomplete", null, "vendor_waiting"].map(
    (status) => ({ status, has_any_findings: null, has_unresolved_findings: null }),
  ),
  { status: "completed", has_any_findings: true, has_unresolved_findings: false },
  { status: "completed", has_any_findings: true, has_unresolved_findings: true },
];
for (const slot of ["code_review", "security_review"])
  for (const peer of ["clean", "absent", "other-head"])
    for (const section of f28NegativeSections) {
      const peerSlot = slot === "code_review" ? "security_review" : "code_review";
      const state = {
        [slot]: { commit_sha: head, ...section },
        [peerSlot]: peer === "absent" ? f28Empty() : f28Clean(peer === "clean" ? head : other),
      };
      const label = `${slot} ${section.status}/${section.has_any_findings}/${section.has_unresolved_findings}, peer ${peer}`;
      test(`F28 every applicable slot vetoes in classifier/latest: ${label}`, () => {
        const summary = f28Summary(state);
        assert.equal(classifyCodexStructuredSummary(summary, head).result, "fail");
        assert.equal(classifyCodexSummaryComment(summary, head), "fail");
        assert.equal(latestCodexResult([], [], [makeComment(), summary], head).result, "fail");
      });
      test(`F28 actual gate rejects older receipt for every applicable slot: ${label}`, async () => {
        assert.equal(await gate(gateApi({ comments: [makeComment(), f28Summary(state)] })), false);
      });
    }

for (const [label, state] of [
  ["both absent", { code_review: f28Empty(), security_review: f28Empty() }],
  ["both clean", { code_review: f28Clean(), security_review: f28Clean() }],
  ["code clean security absent", { code_review: f28Clean(), security_review: f28Empty() }],
  ["security clean code absent", { code_review: f28Empty(), security_review: f28Clean() }],
  [
    "code clean security other-head",
    {
      code_review: f28Clean(),
      security_review: { ...f28Clean(other), has_any_findings: true, status: "failed" },
    },
  ],
  [
    "security clean code other-head",
    {
      code_review: { ...f28Clean(other), has_any_findings: true, status: "failed" },
      security_review: f28Clean(),
    },
  ],
  [
    "both other-head",
    {
      code_review: f28Clean(other),
      security_review: { ...f28Clean(other), status: "running", has_any_findings: true },
    },
  ],
]) {
  test(`F28 canonical neutral state never supplies approval: ${label}`, async () => {
    const summary = f28Summary(state);
    assert.equal(classifyCodexStructuredSummary(summary, head).result, null);
    assert.equal(latestCodexResult([], [], [summary], head).result, null);
    assert.equal(await gate(gateApi({ comments: [summary] })), false);
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
  });
}

for (const slot of ["code_review", "security_review"]) {
  for (const timing of ["newer", "tie", "old created edited after request"])
    test(`F28 ${slot} unfinished ${timing} summary wins over receipt`, async () => {
      const summary = f28Summary(
        {
          code_review: f28Clean(),
          security_review: f28Clean(),
          [slot]: { ...f28Clean(), status: "pending" },
        },
        timing === "tie" ? { updated_at: at } : {},
      );
      const comments = [makeComment(), summary];
      if (timing === "old created edited after request")
        comments.push(
          makeComment({
            id: 91,
            user: { login: "owner" },
            body: `@codex review ${head}`,
            updated_at: "2026-10-15T12:00:30Z",
          }),
        );
      assert.equal(latestCodexResult([], [], comments, head).result, "fail");
      assert.equal(await gate(gateApi({ comments })), false);
    });
  test(`F28 explicit ${slot} unresolved survives later request/receipt until cleared`, async () => {
    const state = {
      code_review: f28Clean(),
      security_review: f28Clean(),
      [slot]: { ...f28Clean(), has_any_findings: true, has_unresolved_findings: true },
    };
    const comments = [
      f28Summary(state),
      makeComment({ updated_at: "2026-10-15T13:00:00Z" }),
      makeComment({
        id: 91,
        body: `@codex review ${head}`,
        user: { login: "owner" },
        updated_at: "2026-10-15T13:01:00Z",
      }),
    ];
    assert.equal(classifyCodexStructuredSummary(comments[0], head).unresolved, true);
    assert.equal(await gate(gateApi({ comments })), false);
    comments[0] = f28Summary({ ...state, [slot]: f28Clean() });
    assert.equal(await gate(gateApi({ comments })), true);
    assert.equal(
      await gate(
        gateApi({
          comments,
          inline: [{ id: 44, user, commit_id: other, body: "[P3] Actual root" }],
        }),
      ),
      false,
    );
    assert.equal(
      await gate(gateApi({ comments, reviews: [makeReview({ state: "CHANGES_REQUESTED" })] })),
      false,
    );
  });
  for (const [label, section] of [
    ["short SHA", { commit_sha: head.slice(0, 10) }],
    ["empty SHA", { commit_sha: "" }],
    ["completed null any", { has_any_findings: null }],
    ["completed null unresolved", { has_unresolved_findings: null }],
    ["incoherent unresolved", { has_any_findings: false, has_unresolved_findings: true }],
    ["string verdict", { has_any_findings: "false" }],
    ["empty status", { status: "" }],
    ["whitespace status", { status: " " }],
    ["nonstring status", { status: false }],
    ["absent commit nonnull state", { commit_sha: null, status: "pending" }],
    ["extra key", { unexpected: false }],
  ])
    test(`F28 ${slot} schema stays strict: ${label}`, async () => {
      const summary = f28Summary({
        code_review: f28Clean(),
        security_review: f28Clean(),
        [slot]: { ...f28Clean(), ...section },
      });
      assert.equal(classifyCodexSummaryComment(summary, head), "fail");
      assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
    });
}
for (const [label, mutate] of [
  ["missing section", (body) => body.replace('"security_review":', '"not_security_review":')],
  ["missing field", (body) => body.replace('"status":"completed"', '"not_status":"completed"')],
  ["duplicate root", (body) => body.replace('"security_review":', '"code_review":')],
  [
    "duplicate field",
    (body) =>
      body.replace('"has_any_findings":false', '"has_any_findings":true,"has_any_findings":false'),
  ],
  [
    "escaped duplicate key",
    (body) =>
      body.replace(
        '"has_any_findings":false',
        '"has_any_findings":true,"\\u0068as_any_findings":false',
      ),
  ],
  ["extra root", (body) => body.replace('{"code_review":', '{"extra":null,"code_review":')],
  ["duplicate marker", (body) => `${body}\n<!-- codex-review-state:v1 {} -->`],
  ["mixed receipt", (body) => `${body}\n${receipt}`],
  ["rendered negative", (body) => `${body}\n[P2] Actual finding`],
])
  test(`F28 summary schema/marker/rendered boundary: ${label}`, () => {
    const summary = f28Summary({ code_review: f28Clean(), security_review: f28Clean() });
    summary.body = mutate(summary.body);
    assert.equal(classifyCodexSummaryComment(summary, head), "fail");
    assert.equal(latestCodexResult([], [], [makeComment(), summary], head).result, "fail");
  });

test("F28 configured trust and explicit other-head applicability stay unchanged", async () => {
  const summary = f28Summary({
    code_review: f28Clean(),
    security_review: { ...f28Clean(), status: "pending" },
  });
  summary.user = { login: "copied-bot" };
  assert.equal(classifyCodexSummaryComment(summary, head), null);
  assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
  const config = { trustedReviewLogins: ["copied-bot"] };
  assert.equal(classifyCodexSummaryComment(summary, head, config), "fail");
  assert.equal(await gate(gateApi({ comments: [makeComment(), summary] }), { config }), false);
  const old = f28Summary({
    code_review: f28Empty(),
    security_review: {
      ...f28Clean(other),
      status: "failed",
      has_any_findings: true,
      has_unresolved_findings: true,
    },
  });
  old.body += "\n[P2] Previous-head finding (resolved).";
  assert.equal(classifyCodexSummaryComment(old, head), null);
  assert.equal(await gate(gateApi({ comments: [makeComment(), old] })), true);
});

for (const action of ["created", "edited"])
  for (const repeat of ["completion", "schedule"])
    test(`F28 production router ${action} security finding reruns once then ${repeat} deduplicates`, async () => {
      const h = routerHarness({ started: "2026-10-15T11:59:50Z" });
      assert.equal(await gate(gateApi({ comments: h.comments })), true);
      const list = h.api.list;
      h.api.list = (path, ...args) =>
        path.includes("/attempts/")
          ? Promise.resolve([
              {
                id: 200,
                run_id: 100,
                head_sha: head,
                name: "AI Review",
                status: "completed",
                conclusion: "success",
                started_at: "2026-10-15T11:59:51Z",
                completed_at: "2026-10-15T12:00:00.200Z",
                steps: [
                  {
                    name: "Route and validate selected native review",
                    number: 4,
                    status: "completed",
                    conclusion: "success",
                    started_at: "2026-10-15T11:59:59Z",
                    completed_at: "2026-10-15T12:00:00.100Z",
                  },
                ],
              },
            ])
          : list(path, ...args);
      h.api.readJobLog = async () => `AI Review gate passed for codex on ${head}.\n`;
      const summary = f28Summary(
        { code_review: f28Clean(), security_review: { ...f28Clean(), has_any_findings: true } },
        { updated_at: "2026-10-15T12:00:00.250Z" },
      );
      h.comments.push(summary);
      h.event.action = action;
      h.event.comment = summary;
      assert.equal(await h.route(), "rerun-confirmed");
      assert.equal(h.mutations, 1);
      assert.equal(await gate(gateApi({ comments: h.comments })), false);
      h.run = { ...h.run, status: "completed", conclusion: "failure" };
      const replay =
        repeat === "schedule"
          ? { eventName: "schedule", scheduledPull: { number: 12, head_sha: head } }
          : {
              eventName: "workflow_run",
              event: {
                action: "completed",
                repository: { full_name: repository },
                workflow_run: { ...h.run, name: "AI Review" },
              },
            };
      assert.equal(await h.route(replay), "already-evaluated");
      assert.equal(await h.route(replay), "already-evaluated");
      assert.equal(h.mutations, 1);
    });

test("F28 active security summary defers until completion then actual failure converges", async () => {
  const summary = f28Summary(
    { code_review: f28Clean(), security_review: { ...f28Clean(), status: "running" } },
    { updated_at: at },
  );
  const h = routerHarness({ status: "in_progress", comments: [makeComment(), summary] });
  h.event.comment = summary;
  assert.equal(await h.route(), "pending-active-completion");
  assert.equal(h.mutations, 0);
  assert.equal(await gate(gateApi({ comments: h.comments })), false);
  h.run = { ...h.run, status: "completed", conclusion: "failure" };
  const completion = () =>
    h.route({
      eventName: "workflow_run",
      event: {
        action: "completed",
        repository: { full_name: repository },
        workflow_run: { ...h.run, name: "AI Review" },
      },
    });
  assert.equal(await completion(), "rerun-confirmed");
  h.run = { ...h.run, status: "completed", conclusion: "failure" };
  assert.equal(await completion(), "already-evaluated");
  assert.equal(h.mutations, 1);
});

test("F28 changed security state cannot overwrite an uncertain posting", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  const before = structuredClone(h.checkpoint);
  h.comments.push(
    f28Summary(
      { code_review: f28Clean(), security_review: { ...f28Clean(), status: "pending" } },
      { updated_at: at },
    ),
  );
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.deepEqual(h.checkpoint, before);
  assert.equal(h.mutations, 1);
});

// F29 rendering fixtures are private contract probes, not native API payloads.
const f29Summary = (
  rendering,
  state = { code_review: f28Clean(), security_review: f28Clean() },
  extra = {},
) => {
  const summary = f28Summary(state, extra);
  summary.body += `\n\n${rendering}`;
  return summary;
};
const f29Affirmative = [
  "Found a finding",
  "[Unknown] Found another finding",
  "Found an issue",
  "Found a remaining issue.",
  "Found another remaining finding.",
  "Found several issues.",
  "Found several findings.",
  "Found multiple findings.",
  "Found multiple remaining issues.",
  "Found remaining findings.",
  "Found 1 issue.",
  "Found 2 findings.",
  "Found 25 remaining findings.",
  "Found 01 remaining issues.",
  "Found issues",
  "Found findings",
  "FOUND ANOTHER FINDING!",
  "Found\tmultiple\tremaining\tissues.",
  "Found\nseveral\nfindings.",
  "Found no findings. Found another finding.",
  "No findings found; [Unknown] Found several findings.",
  "Found 0 issues\nFound a finding.",
  "No unresolved findings remain. Found another remaining finding.",
];
const f29ActualReceiptBody = JSON.parse(
  readFileSync(new URL("./fixtures/codex-review-receipt-6206390117.json", import.meta.url), "utf8"),
).comment.body;
const f29Neutral = [
  "Found 0 issues",
  "FOUND 0 ISSUES.",
  "Found 0 findings",
  "Found 000 issues.",
  "Found no issues",
  "Found no findings.",
  "No issues found",
  "No findings found.",
  "No unresolved issues",
  "No unresolved findings",
  "No unresolved findings remain.",
  "No unresolved issues remain.",
  "No\tunresolved\tfindings.",
  "No unresolved findings.\nFound 0 issues.",
  "Findings\nCodex Review Summary",
  "Found a findinghood.",
  "## Codex Review Summary\n\n| Review | Status |\n| --- | --- |\n| Code review | Completed |\n| Security review | Completed |",
  f29ActualReceiptBody.slice(f29ActualReceiptBody.indexOf("<details>")),
];
for (const [kind, renderings, expected] of [
  ["affirmative", f29Affirmative, "fail"],
  ["neutral", f29Neutral, null],
])
  for (const rendering of renderings)
    for (const [label, state] of [
      ["both current", { code_review: f28Clean(), security_review: f28Clean() }],
      ["code with absent peer", { code_review: f28Clean(), security_review: f28Empty() }],
      [
        "security with other-head peer",
        { code_review: f28Clean(other), security_review: f28Clean() },
      ],
    ]) {
      test(`F29 ${kind} classifier/latest/actual gate ${label}: ${JSON.stringify(rendering)}`, async () => {
        assert.equal(typeof rendering, "string");
        const summary = f29Summary(rendering, state);
        assert.equal(classifyCodexStructuredSummary(summary, head).result, expected);
        assert.equal(classifyCodexSummaryComment(summary, head), expected);
        assert.equal(
          latestCodexResult([], [], [makeComment(), summary], head).result,
          expected || "pass",
        );
        assert.equal(
          await gate(gateApi({ comments: [makeComment(), summary] })),
          expected !== "fail",
        );
        assert.equal(await gate(gateApi({ comments: [summary] })), false);
      });
    }

for (const rendering of f29Affirmative.slice(0, 2))
  for (const timing of ["newer", "tie", "edited after request", "later genuine receipt"])
    test(`F29 rendered contradiction ordering ${timing}: ${rendering}`, async () => {
      const summary = f29Summary(rendering, undefined, timing === "tie" ? { updated_at: at } : {});
      const comments = [makeComment(), summary];
      if (timing === "edited after request")
        comments.push(
          makeComment({
            id: 90,
            user: { login: "owner" },
            body: `@codex review ${head}`,
            updated_at: "2026-10-15T12:00:30Z",
          }),
        );
      if (timing === "later genuine receipt")
        comments.push(makeComment({ id: 91, updated_at: "2026-10-15T12:02:00Z" }));
      const expected = timing === "later genuine receipt" ? "pass" : "fail";
      assert.equal(latestCodexResult([], [], comments, head).result, expected);
      assert.equal(await gate(gateApi({ comments })), expected === "pass");
    });

for (const rendering of ["Found 0 findings", "No unresolved findings remain."])
  for (const blocker of [
    "Found another finding.",
    "Review is still running.",
    "[P2] Regression.",
    "There are unresolved findings.",
    "Unresolved findings remain.",
  ])
    test(`F29 neutral unit cannot erase separate blocker: ${rendering} / ${blocker}`, async () => {
      for (const body of [
        `${rendering} ${blocker}`,
        `${rendering}\n${blocker}`,
        `${blocker}\n${rendering}`,
      ]) {
        const summary = f29Summary(body);
        assert.equal(classifyCodexSummaryComment(summary, head), "fail");
        assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
      }
    });

for (const rendering of ["No unresolved findings remain.", "Found 0 issues."])
  for (const slot of ["code_review", "security_review"])
    for (const section of [
      { status: "running", has_any_findings: null, has_unresolved_findings: null },
      { status: "completed", has_any_findings: true, has_unresolved_findings: false },
      { status: "completed", has_any_findings: true, has_unresolved_findings: true },
    ])
      test(`F29 neutral rendering cannot clear ${slot} ${JSON.stringify(section)}`, async () => {
        const summary = f29Summary(rendering, {
          code_review: f28Clean(),
          security_review: f28Clean(),
          [slot]: { commit_sha: head, ...section },
        });
        const comments = [summary, makeComment({ updated_at: "2026-10-15T12:02:00Z" })];
        assert.equal(classifyCodexSummaryComment(summary, head), "fail");
        assert.equal(await gate(gateApi({ comments })), !section.has_unresolved_findings);
      });

test("F29 configured trust, other-head applicability and unique receipt proof remain mandatory", async () => {
  const summary = f29Summary("[Unknown] Found another finding", undefined, {
    user: { login: "configured-reviewer" },
  });
  assert.equal(classifyCodexSummaryComment(summary, head), null);
  assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
  for (const config of [
    { trustedReviewLogins: ["configured-reviewer"] },
    { trustedReviewLoginsByAgent: { codex: ["configured-reviewer"] } },
  ]) {
    assert.equal(classifyCodexSummaryComment(summary, head, config), "fail");
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] }), { config }), false);
  }
  const old = f29Summary("[P2] Found another finding", {
    code_review: f28Clean(other),
    security_review: f28Empty(),
  });
  assert.equal(classifyCodexSummaryComment(old, head), null);
  assert.equal(await gate(gateApi({ comments: [makeComment(), old] })), true);
  const neutral = f29Summary("Found 0 findings");
  let shortProofCalls = 0;
  assert.equal(
    await gate(
      gateApi({
        comments: [makeComment(), neutral],
        onRequest(path) {
          if (path.includes("/commits/")) {
            shortProofCalls += 1;
            return { sha: other };
          }
        },
      }),
    ),
    false,
  );
  assert.equal(shortProofCalls, 1);
});

for (const [label, change] of [
  [
    "missing full head",
    (s) => {
      s.code_review.commit_sha = head.slice(0, 10);
    },
  ],
  [
    "incoherent null slot",
    (s) => {
      s.security_review.commit_sha = null;
    },
  ],
  [
    "typed verdict",
    (s) => {
      s.security_review.has_any_findings = "false";
    },
  ],
  [
    "unknown field",
    (s) => {
      s.security_review.extra = false;
    },
  ],
])
  test(`F29 neutral wording cannot hide invalid schema: ${label}`, () => {
    const state = { code_review: f28Clean(), security_review: f28Clean() };
    change(state);
    assert.equal(
      classifyCodexSummaryComment(f29Summary("No unresolved findings", state), head),
      "fail",
    );
  });

for (const [label, change] of [
  [
    "duplicate key",
    (s) => s.replace('"status":"completed"', '"status":"completed","status":"completed"'),
  ],
  ["escaped key", (s) => s.replace('"has_any_findings"', '"\\u0068as_any_findings"')],
  ["mixed receipt", (s) => `${s}\n${receipt}`],
  ["duplicate summary marker", (s) => `${s}\n<!-- codex-pull-request-review-summary -->`],
])
  test(`F29 neutral wording cannot hide malformed native encoding: ${label}`, () => {
    const summary = f29Summary("Found 0 findings");
    summary.body = change(summary.body);
    assert.equal(classifyCodexSummaryComment(summary, head), "fail");
  });

for (const priority of ["P3", "Unknown"])
  test(`F29 neutral prose preserves actual unresolved older-head ${priority} roots and latest formal veto`, async () => {
    const comments = [makeComment(), f29Summary("No unresolved findings remain.")];
    const inline = [
      {
        id: 44,
        user,
        body: `[${priority}] Found an issue`,
        commit_id: other,
        pull_request_review_id: 3,
      },
    ];
    assert.equal(await gate(gateApi({ comments, inline })), false);
    assert.equal(await gate(gateApi({ comments, inline, resolved: [44] })), true);
    assert.equal(
      await gate(
        gateApi({
          comments,
          reviews: [
            makeReview({ state: "CHANGES_REQUESTED", submitted_at: "2026-10-15T11:00:00Z" }),
          ],
        }),
      ),
      false,
    );
  });

for (const action of ["created", "edited"])
  for (const repeat of ["completion", "schedule"])
    test(`F29 production router ${action} contradiction reruns once then ${repeat} deduplicates`, async () => {
      const h = routerHarness({ started: "2026-10-15T11:59:50Z" });
      assert.equal(await gate(gateApi({ comments: h.comments })), true);
      const summary = f29Summary(
        action === "created" ? "Found a finding" : "[Unknown] Found another finding",
        undefined,
        { updated_at: "2026-10-15T12:00:00.250Z" },
      );
      h.comments.push(summary);
      h.event.action = action;
      h.event.comment = summary;
      assert.equal(await h.route(), "rerun-confirmed");
      assert.equal(h.mutations, 1);
      assert.equal(await gate(gateApi({ comments: h.comments })), false);
      h.run = { ...h.run, status: "completed", conclusion: "failure" };
      const replay =
        repeat === "schedule"
          ? { eventName: "schedule", scheduledPull: { number: 12, head_sha: head } }
          : {
              eventName: "workflow_run",
              event: {
                action: "completed",
                repository: { full_name: repository },
                workflow_run: { ...h.run, name: "AI Review" },
              },
            };
      assert.equal(await h.route(replay), "already-evaluated");
      assert.equal(await h.route(replay), "already-evaluated");
      assert.equal(h.mutations, 1);
    });

for (const rendering of ["Found 0 issues", "No unresolved findings remain."])
  test(`F29 neutral scheduled summary creates no failure-mismatch rerun: ${rendering}`, async () => {
    const summary = f29Summary(rendering, undefined, { updated_at: at });
    const h = routerHarness({ comments: [makeComment(), summary] });
    await h.route({ eventName: "schedule", scheduledPull: { number: 12, head_sha: head } });
    assert.equal(h.mutations, 0);
    assert.equal(await gate(gateApi({ comments: h.comments })), true);
  });

test("F29 changed rendered contradiction cannot overwrite uncertain posting", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  const before = structuredClone(h.checkpoint);
  h.comments.push(f29Summary("Found another finding", undefined, { updated_at: at }));
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.deepEqual(h.checkpoint, before);
  assert.equal(h.mutations, 1);
});

for (const rendering of [
  "No unresolved findings remain. There are unresolved findings.",
  "No unresolved findings because another check is pending.",
  "[Unknown] No unresolved findings",
  "No unresolved findings, Found another finding.",
  "Found 0 remaining findings. Found 1 remaining issue.",
  "Found no issues. [P3] Advisory.",
])
  test(`F29 complete neutral-unit boundary retains separate contradiction: ${rendering}`, async () => {
    const summary = f29Summary(rendering);
    assert.equal(classifyCodexSummaryComment(summary, head), "fail");
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
  });

test("F29 bounded neutral units tolerate layout without approving", async () => {
  const summary = f29Summary(
    "No\nunresolved\nfindings;\n  Found 0 remaining issues.\nNo unresolved findings remain.  ",
  );
  assert.equal(classifyCodexSummaryComment(summary, head), null);
  assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
  assert.equal(await gate(gateApi({ comments: [summary] })), false);
});

// F29 follow-up retains the four missed independent replay rows and bounded grammar controls.
const f29CoverageReported = [
  "Found one finding",
  "Found some findings",
  "Found one issue",
  "Found an additional finding",
];
const f29CoverageClaims = [
  ...new Set([
    ...f29CoverageReported,
    ...["one", "some", "a additional", "an additional"].flatMap((determiner) =>
      ["issue", "issues", "finding", "findings"].flatMap((noun) => [
        `Found ${determiner} ${noun}`,
        `Found ${determiner} remaining ${noun}`,
      ]),
    ),
    "FOUND ONE FINDING!",
    "[Unknown] Found some issues.",
    "Found\tone\tremaining\tfinding.",
    "Found\nsome\nfindings.",
    "Found\tan\tadditional\tremaining\tissue.",
    "Found\na\nadditional\nfindings.",
  ]),
];
for (const [index, rendering] of f29CoverageClaims.entries())
  test(`F29 coverage affirmative classifier/latest/actual gate: ${JSON.stringify(rendering)}`, async () => {
    const states = [
      { code_review: f28Clean(), security_review: f28Clean() },
      { code_review: f28Clean(), security_review: f28Empty() },
      { code_review: f28Clean(other), security_review: f28Clean() },
    ];
    const summary = f29Summary(rendering, states[index % states.length]);
    assert.equal(classifyCodexStructuredSummary(summary, head).result, "fail");
    assert.equal(classifyCodexSummaryComment(summary, head), "fail");
    assert.equal(latestCodexResult([], [], [makeComment(), summary], head).result, "fail");
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
    assert.equal(await gate(gateApi({ comments: [summary] })), false);
  });

for (const rendering of [
  "one finding",
  "some findings",
  "an additional finding",
  "Found oneness findings.",
  "Found someone findings.",
  "Found a additionally finding.",
  "Found an additionality issue.",
  "Found one findinghood.",
  "Found some issuehood.",
  "Unfound one finding.",
  "Found additional findings.",
  "Found two findings.",
  "Found one, finding.",
  "Found 0 findings. No findings found.",
  "Found no issues. No unresolved findings remain.",
  "No unresolved issues remain. Found no additional findings.",
])
  test(`F29 coverage neutral/token boundary never approves: ${rendering}`, async () => {
    const summary = f29Summary(rendering);
    assert.equal(classifyCodexSummaryComment(summary, head), null);
    assert.equal(latestCodexResult([], [], [makeComment(), summary], head).result, "pass");
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
    assert.equal(await gate(gateApi({ comments: [summary] })), false);
  });

for (const rendering of f29CoverageReported)
  for (const neutral of ["Found 0 issues.", "Found no findings.", "No unresolved findings remain."])
    test(`F29 coverage neutral unit retains separate claim: ${neutral} / ${rendering}`, async () => {
      for (const body of [
        `${neutral} ${rendering}`,
        `${neutral}\n${rendering}`,
        `${rendering}\n${neutral}`,
      ]) {
        const summary = f29Summary(body);
        assert.equal(classifyCodexSummaryComment(summary, head), "fail");
        assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
      }
    });

for (const rendering of f29CoverageReported)
  for (const timing of ["newer", "tie", "edited after request"])
    test(`F29 coverage ordering ${timing}: ${rendering}`, async () => {
      const summary = f29Summary(rendering, undefined, timing === "tie" ? { updated_at: at } : {});
      const comments = [makeComment(), summary];
      if (timing === "edited after request")
        comments.push(
          makeComment({
            id: 90,
            user: { login: "owner" },
            body: `@codex review ${head}`,
            updated_at: "2026-10-15T12:00:30Z",
          }),
        );
      assert.equal(latestCodexResult([], [], comments, head).result, "fail");
      assert.equal(await gate(gateApi({ comments })), false);
    });

for (const rendering of f29CoverageReported)
  for (const action of ["created", "edited"])
    test(`F29 coverage production router ${action} fails once and converges: ${rendering}`, async () => {
      const h = routerHarness({ started: "2026-10-15T11:59:50Z" });
      assert.equal(await gate(gateApi({ comments: h.comments })), true);
      const summary = f29Summary(rendering, undefined, {
        updated_at: "2026-10-15T12:00:00.250Z",
      });
      h.comments.push(summary);
      h.event.action = action;
      h.event.comment = summary;
      assert.equal(await h.route(), "rerun-confirmed");
      assert.equal(h.mutations, 1);
      assert.equal(await gate(gateApi({ comments: h.comments })), false);
      h.run = { ...h.run, status: "completed", conclusion: "failure" };
      for (const delivery of [
        {
          eventName: "workflow_run",
          event: {
            action: "completed",
            repository: { full_name: repository },
            workflow_run: { ...h.run, name: "AI Review" },
          },
        },
        { eventName: "schedule", scheduledPull: { number: 12, head_sha: head } },
      ]) {
        assert.equal(await h.route(delivery), "already-evaluated");
        assert.equal(await h.route(delivery), "already-evaluated");
      }
      assert.equal(h.mutations, 1);
    });

for (const rendering of f29CoverageReported)
  test(`F29 coverage configured trust/head/schema policy remains: ${rendering}`, async () => {
    const configured = f29Summary(rendering, undefined, { user: { login: "configured-reviewer" } });
    assert.equal(classifyCodexSummaryComment(configured, head), null);
    assert.equal(await gate(gateApi({ comments: [makeComment(), configured] })), true);
    const config = { trustedReviewLoginsByAgent: { codex: ["configured-reviewer"] } };
    assert.equal(classifyCodexSummaryComment(configured, head, config), "fail");
    assert.equal(await gate(gateApi({ comments: [makeComment(), configured] }), { config }), false);
    const old = f29Summary(rendering, {
      code_review: f28Clean(other),
      security_review: f28Empty(),
    });
    assert.equal(classifyCodexSummaryComment(old, head), null);
    assert.equal(await gate(gateApi({ comments: [makeComment(), old] })), true);
    for (const invalidHead of [null, head.slice(0, 10)]) {
      const invalid = f29Summary(rendering, {
        code_review: { ...f28Clean(), commit_sha: invalidHead },
        security_review: f28Empty(),
      });
      assert.equal(classifyCodexSummaryComment(invalid, head), "fail");
    }
  });

for (const rendering of ["Found one issuehood.", "Found no additional findings."])
  test(`F29 coverage neutral controls preserve state/root/formal veto and no mismatch: ${rendering}`, async () => {
    const neutral = f29Summary(rendering, undefined, { updated_at: at });
    const h = routerHarness({ comments: [makeComment(), neutral] });
    await h.route({ eventName: "schedule", scheduledPull: { number: 12, head_sha: head } });
    assert.equal(h.mutations, 0);
    for (const blocker of [
      "Review is incomplete.",
      "[P2] Regression.",
      "Unresolved findings remain.",
    ]) {
      const summary = f29Summary(`${rendering}\n${blocker}`);
      assert.equal(classifyCodexSummaryComment(summary, head), "fail");
      assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
    }
    assert.equal(
      await gate(
        gateApi({
          comments: [makeComment(), neutral],
          inline: [{ id: 44, user, body: "[Unknown] Still open", commit_id: other }],
        }),
      ),
      false,
    );
    assert.equal(
      await gate(
        gateApi({
          comments: [makeComment(), neutral],
          reviews: [makeReview({ state: "CHANGES_REQUESTED" })],
        }),
      ),
      false,
    );
  });

test("F29 coverage new determiner cannot overwrite uncertain posting", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  const before = structuredClone(h.checkpoint);
  h.comments.push(f29Summary("Found an additional finding", undefined, { updated_at: at }));
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.deepEqual(h.checkpoint, before);
  assert.equal(h.mutations, 1);
});

// F30 private rendered-summary probes retain all published F29 tests above.
const f30Nouns = ["issue", "issues", "finding", "findings"];
const f30States = [
  ["both current", { code_review: f28Clean(), security_review: f28Clean() }],
  ["code with absent peer", { code_review: f28Clean(), security_review: f28Empty() }],
  ["code with other-head peer", { code_review: f28Clean(), security_review: f28Clean(other) }],
  ["security with absent peer", { code_review: f28Empty(), security_review: f28Clean() }],
  ["security with other-head peer", { code_review: f28Clean(other), security_review: f28Clean() }],
];
async function f30AssertRendering(rendering, expected, state) {
  const summary = f29Summary(rendering, state);
  assert.equal(classifyCodexStructuredSummary(summary, head).result, expected);
  assert.equal(classifyCodexSummaryComment(summary, head), expected);
  assert.equal(
    latestCodexResult([], [], [makeComment(), summary], head).result,
    expected || "pass",
  );
  assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), expected !== "fail");
  assert.equal(await gate(gateApi({ comments: [summary] })), false);
}
for (const noun of f30Nouns)
  for (const rendering of [
    `unresolved ${noun}`,
    `There is an unresolved ${noun}`,
    `[Unknown] There are unresolved ${noun}.`,
    `UNRESOLVED ${noun.toUpperCase()}!`,
    `There are unresolved\t\n${noun}.`,
  ])
    for (const [label, state] of f30States)
      test(`F30 unresolved classifier/latest/actual gate ${label}: ${JSON.stringify(rendering)}`, async () =>
        f30AssertRendering(rendering, "fail", state));

const f30Neutral = f30Nouns.flatMap((noun) => [
  ...["", " remain", " remains"].flatMap((suffix) => [
    `No unresolved ${noun}${suffix}`,
    `No unresolved ${noun}${suffix}.`,
    `\n  No unresolved ${noun}${suffix};\n`,
  ]),
  `NO UNRESOLVED ${noun.toUpperCase()} REMAINS!`,
  `No\tunresolved\t${noun}\tremain?`,
  `No\nunresolved\n${noun}\nremains.`,
]);
for (const rendering of f30Neutral)
  test(`F30 complete neutral unit never approves: ${JSON.stringify(rendering)}`, async () =>
    f30AssertRendering(rendering, null));

for (const neutralNoun of f30Nouns)
  for (const negativeNoun of f30Nouns)
    test(`F30 own-span exception preserves separate ${neutralNoun}/${negativeNoun} contradiction`, async () => {
      for (const rendering of [
        `No unresolved ${neutralNoun}. There is an unresolved ${negativeNoun}.`,
        `No unresolved ${neutralNoun}; unresolved ${negativeNoun}`,
        `[Unknown] unresolved ${negativeNoun}\nNo unresolved ${neutralNoun} remains.`,
        `No unresolved ${neutralNoun} remain.\n[Unknown] unresolved ${negativeNoun}`,
      ])
        await f30AssertRendering(rendering, "fail");
    });

for (const noun of f30Nouns)
  for (const rendering of [
    `No unresolved ${noun} because another check is pending.`,
    `[Unknown] No unresolved ${noun}`,
    `No unresolved ${noun} remains pending.`,
    `No unresolved ${noun}, additional prose`,
  ])
    test(`F30 incomplete neutral unit retains actual claim: ${JSON.stringify(rendering)}`, async () =>
      f30AssertRendering(rendering, "fail"));

for (const noun of f30Nouns)
  for (const rendering of [
    `notunresolved ${noun}`,
    `unresolvedly ${noun}`,
    `unresolved ${noun}hood`,
    `unresolved_${noun}`,
  ])
    test(`F30 token boundaries stay neutral: ${rendering}`, async () =>
      f30AssertRendering(rendering, null));
test("F30 clean header/status/JSON keys/About remain neutral", async () => {
  for (const rendering of [
    "## Codex Review Summary\n\n| Review | Status |\n| --- | --- |\n| Code review | Completed |",
    f29ActualReceiptBody.slice(f29ActualReceiptBody.indexOf("<details>")),
    "unresolved\nissues_status: completed",
  ])
    await f30AssertRendering(rendering, null);
});

for (const noun of f30Nouns)
  for (const timing of ["newer", "tie", "edited after request"])
    test(`F30 unresolved ${noun} preserves ${timing} ordering`, async () => {
      const summary = f29Summary(
        `There is an unresolved ${noun}`,
        undefined,
        timing === "tie" ? { updated_at: at } : {},
      );
      const comments = [makeComment(), summary];
      if (timing === "edited after request")
        comments.push(
          makeComment({
            id: 90,
            user: { login: "owner" },
            body: `@codex review ${head}`,
            updated_at: "2026-10-15T12:00:30Z",
          }),
        );
      assert.equal(latestCodexResult([], [], comments, head).result, "fail");
      assert.equal(await gate(gateApi({ comments })), false);
    });

for (const noun of f30Nouns)
  for (const slot of ["code_review", "security_review"])
    test(`F30 neutral ${noun} cannot clear ${slot} or independent blockers`, async () => {
      const rendering = `No unresolved ${noun} remains.`;
      for (const section of [
        { status: "running", has_any_findings: null, has_unresolved_findings: null },
        { status: "completed", has_any_findings: true, has_unresolved_findings: false },
        { status: "completed", has_any_findings: true, has_unresolved_findings: true },
      ]) {
        const summary = f29Summary(rendering, {
          code_review: f28Clean(),
          security_review: f28Clean(),
          [slot]: { ...f28Clean(), ...section },
        });
        assert.equal(classifyCodexSummaryComment(summary, head), "fail");
        assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), false);
      }
      for (const blocker of ["Review is still running.", "[P2] Regression.", "Found one issue."])
        await f30AssertRendering(`${rendering}\n${blocker}`, "fail");
      const comments = [makeComment(), f29Summary(rendering)];
      const inline = [{ id: 44, user, body: "[P3] Advisory", commit_id: other }];
      assert.equal(await gate(gateApi({ comments, inline })), false);
      assert.equal(await gate(gateApi({ comments, inline, resolved: [44] })), true);
      assert.equal(
        await gate(gateApi({ comments, reviews: [makeReview({ state: "CHANGES_REQUESTED" })] })),
        false,
      );
    });

for (const noun of f30Nouns)
  test(`F30 unresolved ${noun} preserves configured trust/head/schema/unique SHA`, async () => {
    const rendering = `There is an unresolved ${noun}`;
    const spoof = f29Summary(rendering, undefined, { user: { login: "configured-reviewer" } });
    assert.equal(classifyCodexSummaryComment(spoof, head), null);
    assert.equal(await gate(gateApi({ comments: [makeComment(), spoof] })), true);
    const config = { trustedReviewLoginsByAgent: { codex: ["configured-reviewer"] } };
    assert.equal(classifyCodexSummaryComment(spoof, head, config), "fail");
    assert.equal(await gate(gateApi({ comments: [makeComment(), spoof] }), { config }), false);
    const old = f29Summary(rendering, {
      code_review: f28Clean(other),
      security_review: f28Empty(),
    });
    assert.equal(classifyCodexSummaryComment(old, head), null);
    assert.equal(await gate(gateApi({ comments: [makeComment(), old] })), true);
    for (const invalidHead of [null, head.slice(0, 10)]) {
      const invalid = f29Summary(`No unresolved ${noun} remains.`, {
        code_review: { ...f28Clean(), commit_sha: invalidHead },
        security_review: f28Empty(),
      });
      assert.equal(classifyCodexSummaryComment(invalid, head), "fail");
    }
    const neutral = f29Summary(`No unresolved ${noun} remains.`);
    assert.equal(
      await gate(
        gateApi({
          comments: [makeComment(), neutral],
          onRequest(path) {
            if (path.includes("/commits/"))
              throw Object.assign(new Error("Ambiguous commit"), { status: 422 });
          },
        }),
      ),
      false,
    );
  });

for (const noun of f30Nouns)
  for (const action of ["created", "edited"])
    test(`F30 production router ${action} unresolved ${noun} fails once and deduplicates`, async () => {
      const h = routerHarness({ started: "2026-10-15T11:59:50Z" });
      assert.equal(await gate(gateApi({ comments: h.comments })), true);
      const summary = f29Summary(`There is an unresolved ${noun}`, undefined, {
        updated_at: "2026-10-15T12:00:00.250Z",
      });
      h.comments.push(summary);
      h.event.action = action;
      h.event.comment = summary;
      assert.equal(await h.route(), "rerun-confirmed");
      assert.equal(h.mutations, 1);
      assert.equal(await gate(gateApi({ comments: h.comments })), false);
      h.run = { ...h.run, status: "completed", conclusion: "failure" };
      for (const delivery of [
        {
          eventName: "workflow_run",
          event: {
            action: "completed",
            repository: { full_name: repository },
            workflow_run: { ...h.run, name: "AI Review" },
          },
        },
        { eventName: "schedule", scheduledPull: { number: 12, head_sha: head } },
      ]) {
        assert.equal(await h.route(delivery), "already-evaluated");
        assert.equal(await h.route(delivery), "already-evaluated");
      }
      assert.equal(h.mutations, 1);
    });

for (const noun of f30Nouns)
  for (const suffix of ["", " remain", " remains"])
    test(`F30 neutral ${noun}${suffix} does not create a mismatch rerun`, async () => {
      const summary = f29Summary(`No unresolved ${noun}${suffix}.`, undefined, { updated_at: at });
      const h = routerHarness({ comments: [makeComment(), summary] });
      await h.route({ eventName: "schedule", scheduledPull: { number: 12, head_sha: head } });
      assert.equal(h.mutations, 0);
      assert.equal(await gate(gateApi({ comments: h.comments })), true);
    });

test("F30 unresolved issue change cannot overwrite uncertain posting", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  const before = structuredClone(h.checkpoint);
  h.comments.push(f29Summary("There is an unresolved issue", undefined, { updated_at: at }));
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.deepEqual(h.checkpoint, before);
  assert.equal(h.mutations, 1);
});

// F31: genuine receipt 6297970297 is unchanged; all mutations below are private unit fixtures.
const f31ActualComment = {
  id: 6297970297,
  body: '<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn\'t find any major issues. More of your lovely PRs please.\n\n**Reviewed commit:** `e786b4028c`\n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment "@codex review".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting "@codex address that feedback".\n            \n</details>',
  user: {
    login: "chatgpt-codex-connector[bot]",
    id: 199175422,
    node_id: "BOT_kgDOC98s_g",
    avatar_url: "https://avatars.githubusercontent.com/in/1144995?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D",
    html_url: "https://github.com/apps/chatgpt-codex-connector",
    followers_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/followers",
    following_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/following{/other_user}",
    gists_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/starred{/owner}{/repo}",
    subscriptions_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/subscriptions",
    organizations_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/orgs",
    repos_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/repos",
    events_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/received_events",
    type: "Bot",
    user_view_type: "public",
    site_admin: false,
  },
  created_at: "2026-10-20T18:18:44Z",
  updated_at: "2026-10-20T18:18:44Z",
  html_url: "https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297",
  issue_url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/221",
};
const f31Head = "e786b4028c6b335512f758fc3fca6d17e8f6eafc";
const f31Ending = ". More of your lovely PRs please.";
const f31Comment = (body = f31ActualComment.body, extra = {}) => ({
  ...f31ActualComment,
  body,
  ...extra,
});
const f31Body = (ending) => f31ActualComment.body.replace(f31Ending, ending);
const f31Gate = (comments = [f31ActualComment], options = {}, gateOptions = {}) =>
  gate(gateApi({ headSha: f31Head, comments, ...options }), { headSha: f31Head, ...gateOptions });

test("F31 verbatim actual receipt binding and classifier", async () => {
  const { createHash } = await import("node:crypto");
  assert.equal(
    createHash("sha256").update(f31ActualComment.body).digest("hex"),
    "925ac8e73ef936400886297817df94a723dfc3f7e36d8644a403f6c7e65c719d",
  );
  assert.equal(f31ActualComment.id, 6297970297);
  assert.equal(f31ActualComment.user.login, "chatgpt-codex-connector[bot]");
  assert.equal(f31ActualComment.created_at, "2026-10-20T18:18:44Z");
  assert.equal(f31ActualComment.updated_at, f31ActualComment.created_at);
  assert.equal(classifyCodexSummaryComment(f31ActualComment, f31Head), "pass");
});
test("F31 verbatim actual receipt latest selection", () => {
  assert.equal(latestCodexResult([], [], [f31ActualComment], f31Head).result, "pass");
});
test("F31 isolated actual-body gate requires the actual uniquely resolved short SHA", async () => {
  const requests = [];
  assert.equal(
    await f31Gate(undefined, {
      onRequest(path) {
        requests.push(path);
        if (path.endsWith("/commits/e786b4028c")) return { sha: f31Head };
      },
    }),
    true,
  );
  assert.equal(requests.filter((path) => path.endsWith("/commits/e786b4028c")).length, 1);
});

const f31Positive = [
  ["existing base", f31Body(".")],
  ["existing textual rocket", f31Body(". :rocket:")],
  ["existing emoji rocket", f31Body(". 🚀")],
  ["existing Chef", f31Body(". Chef's kiss.")],
  [
    "case and CRLF",
    f31ActualComment.body
      .replace("More of your lovely PRs please.", "MORE OF YOUR LOVELY PRS PLEASE.")
      .replaceAll("\n", "\r\n"),
  ],
  [
    "outer and footer layout",
    ` \n${f31ActualComment.body.replace("<details> <summary>", "<details>\n<summary>")}\n `,
  ],
  ["full current SHA", f31ActualComment.body.replace("`e786b4028c`", `\`${f31Head}\``)],
  ["unique seven-digit SHA", f31ActualComment.body.replace("`e786b4028c`", "`e786b40`")],
];
for (const [label, body] of f31Positive)
  test(`F31 positive unit variant preserves ${label}`, async () => {
    assert.equal(classifyCodexSummaryComment(f31Comment(body), f31Head), "pass");
    assert.equal(await f31Gate([f31Comment(body)]), true);
  });

const f31Invalid = [
  ["changed adjective", f31Body(". More of your wonderful PRs please.")],
  ["changed plural", f31Body(". More of your lovely PR please.")],
  ["missing terminal period", f31Body(". More of your lovely PRs please")],
  ["extra terminal punctuation", f31Body(`${f31Ending}.`)],
  ["double internal space", f31Body(". More  of your lovely PRs please.")],
  ["internal newline", f31Body(". More of your lovely\nPRs please.")],
  ["repeated ending", f31Body(`${f31Ending} More of your lovely PRs please.`)],
  ["combined Chef", f31Body(`${f31Ending} Chef's kiss.`)],
  ["combined rocket", f31Body(`${f31Ending} 🚀`)],
  ["rocket before ending", f31Body(`. :rocket:${f31Ending}`)],
  ["duplicate verdict", f31Body(`${f31Ending} Codex Review: Didn't find any major issues.`)],
  ["negative extra prose", f31Body(`${f31Ending} Found one issue.`)],
  ["unfinished extra prose", f31Body(`${f31Ending} Review is still running.`)],
  ["priority extra prose", f31Body(`${f31Ending} [P2] Regression.`)],
  ["ending before verdict", f31Body(".").replace("Codex Review:", `${f31Ending} Codex Review:`)],
  ["ending after commit", f31Body(".").replace("`e786b4028c`", `\`e786b4028c\`${f31Ending}`)],
  ["ending in footer", f31Body(".").replace("</details>", `${f31Ending}</details>`)],
  ["unprefixed form", f31ActualComment.body.replace("<!-- codex-review-receipt:v1 -->\n\n", "")],
  ["duplicate marker", `<!-- codex-review-receipt:v1 -->\n\n${f31ActualComment.body}`],
  ["wrong version", f31ActualComment.body.replace("receipt:v1", "receipt:v2")],
  ["mixed summary marker", `${f31ActualComment.body}\n<!-- codex-review-state:v1 {} -->`],
  [
    "missing reviewed commit",
    f31ActualComment.body.replace("**Reviewed commit:** `e786b4028c`", ""),
  ],
  [
    "altered canonical footer",
    f31ActualComment.body.replace(
      "If Codex has suggestions, it will comment",
      "If Codex has suggestions, it might comment",
    ),
  ],
  [
    "legacy inline head",
    `Codex Review: Didn't find any major issues in head ${f31Head}.${f31Ending}`,
  ],
  [
    "legacy Reviewed",
    `Codex Review: Didn't find any major issues. Reviewed [${f31Head}].${f31Ending}`,
  ],
];
for (const [label, body] of f31Invalid)
  test(`F31 bounded ending rejects ${label}`, async () => {
    assert.equal(classifyCodexSummaryComment(f31Comment(body), f31Head), "fail");
    assert.equal(await f31Gate([f31Comment(body)]), false);
  });

test("F31 configured trust and untrusted copied body", async () => {
  const copied = f31Comment(undefined, { user: { login: "configured-codex" } });
  assert.equal(classifyCodexSummaryComment(copied, f31Head), null);
  assert.equal(await f31Gate([copied]), false);
  const config = { trustedReviewLoginsByAgent: { codex: ["configured-codex"] } };
  assert.equal(classifyCodexSummaryComment(copied, f31Head, config), "pass");
  assert.equal(await f31Gate([copied], {}, { config }), true);
});
for (const proof of ["foreign", "missing", "ambiguous"])
  test(`F31 actual-body gate rejects ${proof} short-SHA API proof`, async () => {
    assert.equal(
      await f31Gate(undefined, {
        onRequest(path) {
          if (!path.includes("/commits/")) return;
          if (proof === "foreign") return { sha: other };
          if (proof === "missing") return {};
          throw Object.assign(new Error("Ambiguous SHA"), { status: 422 });
        },
      }),
      false,
    );
  });
test("F31 foreign and mixed reviewed markers do not approve current head", async () => {
  const foreign = f31Comment(f31ActualComment.body.replace("e786b4028c", other));
  assert.equal(classifyCodexSummaryComment(foreign, f31Head), null);
  assert.equal(await f31Gate([foreign]), false);
  const mixed = f31Comment(`${f31ActualComment.body}\n${other}`);
  assert.equal(classifyCodexSummaryComment(mixed, f31Head), "fail");
  assert.equal(await f31Gate([mixed]), false);
});
for (const blocker of [
  "formal",
  "P3 root",
  "unknown old root",
  "code unfinished",
  "security findings",
  "rendered contradiction",
  "newer negative",
  "tied negative",
])
  test(`F31 actual-body gate preserves ${blocker}`, async () => {
    const comments = [f31ActualComment];
    const options = {};
    if (blocker === "formal")
      options.reviews = [makeReview({ commit_id: f31Head, state: "CHANGES_REQUESTED" })];
    if (blocker.includes("root"))
      options.inline = [
        {
          id: 44,
          user,
          body: blocker === "P3 root" ? "[P3] Advisory" : "[Unknown] Finding",
          commit_id: other,
        },
      ];
    if (blocker.includes("negative"))
      comments.push(
        f31Comment(f31Body(". Found one finding."), {
          id: 2,
          updated_at:
            blocker === "tied negative" ? f31ActualComment.updated_at : "2026-10-20T18:19:00Z",
        }),
      );
    if (["code unfinished", "security findings", "rendered contradiction"].includes(blocker)) {
      const state = { code_review: f28Clean(f31Head), security_review: f28Clean(f31Head) };
      if (blocker === "code unfinished")
        state.code_review = {
          ...state.code_review,
          status: "running",
          has_any_findings: null,
          has_unresolved_findings: null,
        };
      if (blocker === "security findings")
        state.security_review = {
          ...state.security_review,
          has_any_findings: true,
          has_unresolved_findings: true,
        };
      comments.push(
        f31Comment(
          `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->${blocker === "rendered contradiction" ? "\nThere is an unresolved issue." : ""}`,
          { id: 2, updated_at: "2026-10-20T18:19:00Z" },
        ),
      );
    }
    assert.equal(
      latestCodexResult(options.reviews || [], options.inline || [], comments, f31Head).result,
      "fail",
    );
    assert.equal(await f31Gate(comments, options), false);
  });
test("F31 clean summary never approves without independent receipt", async () => {
  const state = { code_review: f28Clean(f31Head), security_review: f28Empty() };
  const summary = f31Comment(
    `<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->`,
    { id: 2 },
  );
  assert.equal(classifyCodexSummaryComment(summary, f31Head), null);
  assert.equal(await f31Gate([summary]), false);
  assert.equal(await f31Gate([summary, f31ActualComment]), true);
});

// Router fixtures preserve the ending while using the harness's explicitly constructed PR/head/time.
const f31RouteComment = () =>
  makeComment({
    body: f31ActualComment.body.replaceAll("e786b4028c", head.slice(0, 10)),
  });
function f31SuccessfulAttempt(h) {
  const started = h.run.run_started_at;
  const accepted = new Date(Date.parse(started) + 100).toISOString();
  const observed = new Date(Date.parse(started) + 1000).toISOString();
  h.run = { ...h.run, status: "completed", conclusion: "success" };
  const list = h.api.list;
  h.api.list = (path, ...args) =>
    path.includes("/attempts/")
      ? Promise.resolve([
          {
            id: 200,
            run_id: 100,
            run_attempt: h.run.run_attempt,
            head_sha: head,
            name: "AI Review",
            status: "completed",
            conclusion: "success",
            started_at: started,
            completed_at: accepted,
            steps: [
              {
                name: "Route and validate selected native review",
                number: 4,
                status: "completed",
                conclusion: "success",
                started_at: started,
                completed_at: accepted,
              },
            ],
          },
        ])
      : list(path, ...args);
  h.api.readJobLog = async () => `AI Review gate passed for codex on ${head}.\n`;
  const request = h.api.request;
  h.api.request = async (path, options = {}) => {
    const response = await request(path, options);
    if (options.method === "POST" || options.method === "PATCH") {
      response.updated_at = observed;
      h.checkpoint = structuredClone(response);
    }
    return response;
  };
  const route = h.route;
  h.route = (options = {}) => route({ now: () => Date.parse(observed), ...options });
}
for (const action of ["created", "edited"])
  test(`F31 production ${action} receipt reruns once, passes evaluator and deduplicates`, async () => {
    const comment = f31RouteComment();
    const h = routerHarness({ comments: [comment] });
    h.run = { ...h.run, conclusion: "failure" };
    h.event.action = action;
    h.event.comment = comment;
    assert.equal(await h.route(), "rerun-confirmed");
    assert.equal(await gate(gateApi({ comments: h.comments })), true);
    assert.equal(await h.route(), "already-evaluated");
    // This unit fixture supplies exact successful-attempt jobs/log chronology, never remote evidence.
    f31SuccessfulAttempt(h);
    assert.equal(await deliverPosting(h, "completion"), "observed-native-acceptance");
    assert.equal(await deliverPosting(h, "schedule"), "already-observed");
    assert.equal(await h.route(), "already-observed");
    assert.equal(h.mutations, 1);
  });
test("F31 active receipt waits for completion before a single rerun", async () => {
  const comment = f31RouteComment();
  const h = routerHarness({ comments: [comment], status: "in_progress" });
  h.event.comment = comment;
  assert.equal(await h.route(), "pending-active-completion");
  assert.equal(h.mutations, 0);
  h.run = { ...h.run, status: "completed", conclusion: "failure" };
  assert.equal(await deliverPosting(h, "completion"), "rerun-confirmed");
  assert.equal(await gate(gateApi({ comments: h.comments })), true);
  assert.equal(h.mutations, 1);
});
test("F31 new ending cannot bypass uncertain posting reconciliation", async () => {
  const h = routerHarness({ postError: true, confirm: false });
  await assert.rejects(h.route(), /could not be confirmed/);
  const prior = structuredClone(h.checkpoint);
  h.comments[0] = f31RouteComment();
  h.event.comment = h.comments[0];
  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);
  assert.deepEqual(h.checkpoint, prior);
  assert.equal(h.mutations, 1);
});

// F33 genuine 333 native bodies remain verbatim; mutations below are unit fixtures only.
const f33Head = "333f164f77f974d5f839e45dcb4f2cb975e3ab85";
const f33ActualReceipt = {
  url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/comments/6349943842",
  html_url: "https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6349943842",
  issue_url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/221",
  id: 6349943842,
  node_id: "IC_kwDOSX65IM8AAAABenx0Ig",
  user: {
    login: "chatgpt-codex-connector[bot]",
    id: 199175422,
    node_id: "BOT_kgDOC98s_g",
    avatar_url: "https://avatars.githubusercontent.com/in/1144995?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D",
    html_url: "https://github.com/apps/chatgpt-codex-connector",
    followers_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/followers",
    following_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/following{/other_user}",
    gists_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/starred{/owner}{/repo}",
    subscriptions_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/subscriptions",
    organizations_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/orgs",
    repos_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/repos",
    events_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/received_events",
    type: "Bot",
    user_view_type: "public",
    site_admin: false,
  },
  created_at: "2026-10-22T19:55:05Z",
  updated_at: "2026-10-22T19:55:05Z",
  body: '<!-- codex-review-receipt:v1 -->\n\nCodex Review: Didn\'t find any major issues. :tada:\n\n**Reviewed commit:** `333f164f77`\n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment "@codex review".\n\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\n\n\n\n\nCodex can also answer questions or update the PR. Try commenting "@codex address that feedback".\n            \n</details>',
  author_association: "NONE",
  reactions: {
    url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/comments/6349943842/reactions",
    total_count: 0,
    "+1": 0,
    "-1": 0,
    laugh: 0,
    hooray: 0,
    confused: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
  },
  performed_via_github_app: {
    id: 1144995,
    client_id: "Iv23liVemv8A9if9v0F2",
    slug: "chatgpt-codex-connector",
    node_id: "A_kwHOAOQ6Gs4AEXij",
    owner: {
      login: "openai",
      id: 14957082,
      node_id: "MDEyOk9yZ2FuaXphdGlvbjE0OTU3MDgy",
      avatar_url: "https://avatars.githubusercontent.com/u/14957082?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/openai",
      html_url: "https://github.com/openai",
      followers_url: "https://api.github.com/users/openai/followers",
      following_url: "https://api.github.com/users/openai/following{/other_user}",
      gists_url: "https://api.github.com/users/openai/gists{/gist_id}",
      starred_url: "https://api.github.com/users/openai/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/openai/subscriptions",
      organizations_url: "https://api.github.com/users/openai/orgs",
      repos_url: "https://api.github.com/users/openai/repos",
      events_url: "https://api.github.com/users/openai/events{/privacy}",
      received_events_url: "https://api.github.com/users/openai/received_events",
      type: "Organization",
      user_view_type: "public",
      site_admin: false,
    },
    name: "ChatGPT Codex Connector",
    description: "Bring ChatGPT and Codex to your GitHub repositories.",
    external_url: "https://www.chatgpt.com",
    html_url: "https://github.com/apps/chatgpt-codex-connector",
    created_at: "2025-02-14T01:37:05Z",
    updated_at: "2026-09-23T18:52:59Z",
    permissions: {
      actions: "write",
      checks: "read",
      contents: "write",
      emails: "read",
      issues: "write",
      metadata: "read",
      pull_requests: "write",
      statuses: "read",
      workflows: "write",
    },
    events: [
      "check_run",
      "check_suite",
      "commit_comment",
      "issues",
      "issue_comment",
      "pull_request",
      "pull_request_review",
      "pull_request_review_comment",
      "pull_request_review_thread",
      "repository",
      "status",
      "sub_issues",
    ],
  },
  minimized: null,
};
const f33ActualSummary = {
  url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/comments/6203835030",
  html_url: "https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6203835030",
  issue_url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/221",
  id: 6203835030,
  node_id: "IC_kwDOSX65IM8AAAABcccClg",
  user: {
    login: "chatgpt-codex-connector[bot]",
    id: 199175422,
    node_id: "BOT_kgDOC98s_g",
    avatar_url: "https://avatars.githubusercontent.com/in/1144995?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D",
    html_url: "https://github.com/apps/chatgpt-codex-connector",
    followers_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/followers",
    following_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/following{/other_user}",
    gists_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/starred{/owner}{/repo}",
    subscriptions_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/subscriptions",
    organizations_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/orgs",
    repos_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/repos",
    events_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/received_events",
    type: "Bot",
    user_view_type: "public",
    site_admin: false,
  },
  created_at: "2026-10-15T22:45:17Z",
  updated_at: "2026-10-22T19:55:09Z",
  body: '<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 {"code_review":{"commit_sha":"333f164f77f974d5f839e45dcb4f2cb975e3ab85","has_any_findings":false,"has_unresolved_findings":false,"status":"completed"},"security_review":{"commit_sha":null,"has_any_findings":null,"has_unresolved_findings":null,"status":null}} -->\n\n## Codex Review Summary\n\nThis comment shows the latest Codex review activity on this pull request.\n\n| Review | Status | Commit | Review trigger |\n| --- | --- | --- | --- |\n| 📝 **Code Review** | ✅ **Completed** <relative-time datetime="2026-10-22T19:55:08.181459Z">2026-10-22T19:55:08.181459Z</relative-time> | `333f164` | Manual request |\n\n\n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment "@codex review" or "@codex security review".\n\nCodex reacts with 👀 while any review is running, comments if it has suggestions, and reacts with 👍 once all reviews finish with no findings.\n\n</details>',
  author_association: "NONE",
  reactions: {
    url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/comments/6203835030/reactions",
    total_count: 0,
    "+1": 0,
    "-1": 0,
    laugh: 0,
    hooray: 0,
    confused: 0,
    heart: 0,
    rocket: 0,
    eyes: 0,
  },
  performed_via_github_app: {
    id: 1144995,
    client_id: "Iv23liVemv8A9if9v0F2",
    slug: "chatgpt-codex-connector",
    node_id: "A_kwHOAOQ6Gs4AEXij",
    owner: {
      login: "openai",
      id: 14957082,
      node_id: "MDEyOk9yZ2FuaXphdGlvbjE0OTU3MDgy",
      avatar_url: "https://avatars.githubusercontent.com/u/14957082?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/openai",
      html_url: "https://github.com/openai",
      followers_url: "https://api.github.com/users/openai/followers",
      following_url: "https://api.github.com/users/openai/following{/other_user}",
      gists_url: "https://api.github.com/users/openai/gists{/gist_id}",
      starred_url: "https://api.github.com/users/openai/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/openai/subscriptions",
      organizations_url: "https://api.github.com/users/openai/orgs",
      repos_url: "https://api.github.com/users/openai/repos",
      events_url: "https://api.github.com/users/openai/events{/privacy}",
      received_events_url: "https://api.github.com/users/openai/received_events",
      type: "Organization",
      user_view_type: "public",
      site_admin: false,
    },
    name: "ChatGPT Codex Connector",
    description: "Bring ChatGPT and Codex to your GitHub repositories.",
    external_url: "https://www.chatgpt.com",
    html_url: "https://github.com/apps/chatgpt-codex-connector",
    created_at: "2025-02-14T01:37:05Z",
    updated_at: "2026-09-23T18:52:59Z",
    permissions: {
      actions: "write",
      checks: "read",
      contents: "write",
      emails: "read",
      issues: "write",
      metadata: "read",
      pull_requests: "write",
      statuses: "read",
      workflows: "write",
    },
    events: [
      "check_run",
      "check_suite",
      "commit_comment",
      "issues",
      "issue_comment",
      "pull_request",
      "pull_request_review",
      "pull_request_review_comment",
      "pull_request_review_thread",
      "repository",
      "status",
      "sub_issues",
    ],
  },
  minimized: null,
};
const f33ActualCommit = {
  sha: "333f164f77f974d5f839e45dcb4f2cb975e3ab85",
  node_id: "C_kwDOSX65INoAKDMzM2YxNjRmNzdmOTc0ZDVmODM5ZTQ1ZGNiNGYyY2I5NzVlM2FiODU",
  commit: {
    author: {
      name: "Kristina Aquila",
      email: "krisredlips@gmail.com",
      date: "2026-10-22T19:43:00Z",
    },
    committer: {
      name: "Kristina Aquila",
      email: "krisredlips@gmail.com",
      date: "2026-10-22T19:43:00Z",
    },
    message:
      "fix: accept bounded native Codex receipt praise\n\nCo-authored-by: OpenAI Codex <codex@openai.com>",
    tree: {
      sha: "9b1ef10bad8da607bcc31cdc255bc92e030b2f9c",
      url: "https://api.github.com/repos/cucumberfalse/cabadrive/git/trees/9b1ef10bad8da607bcc31cdc255bc92e030b2f9c",
    },
    url: "https://api.github.com/repos/cucumberfalse/cabadrive/git/commits/333f164f77f974d5f839e45dcb4f2cb975e3ab85",
    comment_count: 0,
    verification: {
      verified: false,
      reason: "unsigned",
      signature: null,
      payload: null,
      verified_at: null,
    },
  },
  url: "https://api.github.com/repos/cucumberfalse/cabadrive/commits/333f164f77f974d5f839e45dcb4f2cb975e3ab85",
  html_url:
    "https://github.com/cucumberfalse/cabadrive/commit/333f164f77f974d5f839e45dcb4f2cb975e3ab85",
  comments_url:
    "https://api.github.com/repos/cucumberfalse/cabadrive/commits/333f164f77f974d5f839e45dcb4f2cb975e3ab85/comments",
  author: {
    login: "kiaquila",
    id: 36407683,
    node_id: "MDQ6VXNlcjM2NDA3Njgz",
    avatar_url: "https://avatars.githubusercontent.com/u/36407683?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/kiaquila",
    html_url: "https://github.com/kiaquila",
    followers_url: "https://api.github.com/users/kiaquila/followers",
    following_url: "https://api.github.com/users/kiaquila/following{/other_user}",
    gists_url: "https://api.github.com/users/kiaquila/gists{/gist_id}",
    starred_url: "https://api.github.com/users/kiaquila/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/kiaquila/subscriptions",
    organizations_url: "https://api.github.com/users/kiaquila/orgs",
    repos_url: "https://api.github.com/users/kiaquila/repos",
    events_url: "https://api.github.com/users/kiaquila/events{/privacy}",
    received_events_url: "https://api.github.com/users/kiaquila/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  committer: {
    login: "kiaquila",
    id: 36407683,
    node_id: "MDQ6VXNlcjM2NDA3Njgz",
    avatar_url: "https://avatars.githubusercontent.com/u/36407683?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/kiaquila",
    html_url: "https://github.com/kiaquila",
    followers_url: "https://api.github.com/users/kiaquila/followers",
    following_url: "https://api.github.com/users/kiaquila/following{/other_user}",
    gists_url: "https://api.github.com/users/kiaquila/gists{/gist_id}",
    starred_url: "https://api.github.com/users/kiaquila/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/kiaquila/subscriptions",
    organizations_url: "https://api.github.com/users/kiaquila/orgs",
    repos_url: "https://api.github.com/users/kiaquila/repos",
    events_url: "https://api.github.com/users/kiaquila/events{/privacy}",
    received_events_url: "https://api.github.com/users/kiaquila/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  parents: [
    {
      sha: "e786b4028c6b335512f758fc3fca6d17e8f6eafc",
      url: "https://api.github.com/repos/cucumberfalse/cabadrive/commits/e786b4028c6b335512f758fc3fca6d17e8f6eafc",
      html_url:
        "https://github.com/cucumberfalse/cabadrive/commit/e786b4028c6b335512f758fc3fca6d17e8f6eafc",
    },
  ],
  stats: { total: 453, additions: 448, deletions: 5 },
  files: [
    {
      sha: "83c0e2d81e61ee81d92db0c111be6a74ceb8135a",
      filename: "docs_project/project/devops/ai-pr-workflow.md",
      status: "modified",
      additions: 3,
      deletions: 2,
      changes: 5,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/docs_project%2Fproject%2Fdevops%2Fai-pr-workflow.md",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/docs_project%2Fproject%2Fdevops%2Fai-pr-workflow.md",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/docs_project%2Fproject%2Fdevops%2Fai-pr-workflow.md?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        "@@ -484,8 +484,9 @@ Codex evidence comes only from configured trusted connector identities. A\n no-findings comment may use the legacy `Codex Review:` header or exactly one\n leading `<!-- codex-review-receipt:v1 -->` marker, followed by the explicit\n no-findings verdict and matching `**Reviewed commit:**` line. That v1 receipt\n-form also accepts the observed ASCII ` Chef's kiss.` verdict ending as an\n-explicit alternative to the existing rocket suffix. Verdict matching retains\n+form also accepts the observed ASCII `. Chef's kiss.` and\n+`. More of your lovely PRs please.` verdict endings as explicit alternatives\n+to the existing base/rocket endings, never combined with another ending. Verdict matching retains\n its case-insensitive and CRLF handling; misplaced, repeated, combined, or\n modified endings and additional prose are rejected. Existing explicit legacy\n `in head <sha>` and `Reviewed [<sha>]` forms remain supported. The exact observed native",
    },
    {
      sha: "fec3bc665ca7c526ee436e8978fc8c56bdaedc15",
      filename: "docs_project/project/devops/review-contract.md",
      status: "modified",
      additions: 3,
      deletions: 2,
      changes: 5,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/docs_project%2Fproject%2Fdevops%2Freview-contract.md",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/docs_project%2Fproject%2Fdevops%2Freview-contract.md",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/docs_project%2Fproject%2Fdevops%2Freview-contract.md?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        "@@ -208,8 +208,9 @@ A trusted issue comment can approve only with an explicit supported no-findings\n verdict and matching reviewed commit. Supported forms are the legacy\n `Codex Review:` header and exactly one leading\n `<!-- codex-review-receipt:v1 -->` marker. The bounded v1\n-`**Reviewed commit:**` form accepts the observed ASCII ` Chef's kiss.` ending\n-as an explicit alternative to the existing rocket ending. Legacy `in head <sha>`\n+`**Reviewed commit:**` form accepts the observed ASCII `. Chef's kiss.` and\n+`. More of your lovely PRs please.` endings as explicit alternatives to the\n+existing base/rocket endings, never combined with another ending. Legacy `in head <sha>`\n and `Reviewed [<sha>]` forms remain supported. Case and CRLF normalization are\n preserved. Only the canonical observed About Codex in GitHub details footer is\n permitted, with whitespace and optional information-icon normalization. Repeated,",
    },
    {
      sha: "2919217acf093cc926301ec6b40c6ae1aabe4381",
      filename: "scripts/ai-review-helpers.mjs",
      status: "modified",
      additions: 1,
      deletions: 1,
      changes: 2,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/scripts%2Fai-review-helpers.mjs",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/scripts%2Fai-review-helpers.mjs",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/scripts%2Fai-review-helpers.mjs?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        '@@ -220,7 +220,7 @@ Codex can also answer questions or update the PR. Try commenting "@codex address\n   const sha = "([a-fA-F0-9]{7,40})";\n   // The observed praise is a v1 receipt alternative, never arbitrary legacy prose.\n   const verdictEnding = hasReceiptPrefix\n-    ? "(?:\\\\.?(?: :rocket:| 🚀)?|\\\\. Chef\'s kiss\\\\.)"\n+    ? "(?:\\\\.?(?: :rocket:| 🚀)?|\\\\. Chef\'s kiss\\\\.|\\\\. More of your lovely PRs please\\\\.)"\n     : "\\\\.?(?: :rocket:| 🚀)?";\n   const patterns = [\n     new RegExp(',
    },
    {
      sha: "5e2018de1ae873a21b8e4e5f2a97dd5de0330f53",
      filename: "specs/059-codex-native-review-compatibility/plan.md",
      status: "modified",
      additions: 59,
      deletions: 0,
      changes: 59,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/specs%2F059-codex-native-review-compatibility%2Fplan.md",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/specs%2F059-codex-native-review-compatibility%2Fplan.md",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/specs%2F059-codex-native-review-compatibility%2Fplan.md?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        "@@ -542,3 +542,62 @@ The full command preserved all six frozen file bytes, all 17 control paths, comp\n After separate bounded Root authorization, ONLY the sole generated `scripts/__pycache__/ci-docker-resources.cpython-314.pyc` was preserved byte-for-byte in fresh private 0700/0600 evidence, then its exact source file unlinked following fresh drain/no-handle and repeated identity/hash guards. Original device 16777232, inode 121662276, size 81691, mtime_ns 1792516249311558807, mode 0644, SHA-256 `56d11053f5556a2f06ce886ec8c7252f92ac2ef80733a49eaea7f2d15fcb96b9`. Proof `/private/tmp/cabadrive-059-f30-cache-evidence-pbevsew5/proof.json`, SHA-256 `26e828cd30a1eba8b7d793aa68ce387854bf996ca4cdae7affe5d04ea092d45c`. The empty source parent, every other artifact/dependency/environment and sibling/user work were preserved; no broad cleanup occurred.\n \n These factual Implementation notes append only AFTER the ENTIRE original full-start plan **184338 bytes** / `e053b20007d54afd2ad26709313eae8b3c17dfb1dce291eb63972a611639a469` and tasks **144549 bytes** / `95ba336f9150b9e446714a95ff978a5d14c17c71a4f349ac1749318264782b0a`. No earlier byte, Architect disposition, spec/intake, final-role/counter marker or functional file is edited. Only notes-appropriate feature-memory and diff checks follow; no successful functional/full/native/build/browser check is repeated for this append. Independent notes/full-evidence Review, separately authorized commit/publication, genuine new-head native review, five required remote gates, final Architect then Analyst validation, stable 120-second hold and protected merge remain pending. No delivery-complete, final-role, gate-waiver or merge claim is made.\n+\n+\n+### Architect FR-002 / D-20 conformance addendum: observed lovely-PRs receipt ending (F-31)\n+\n+Accept the independent P2 compatibility gap demonstrated by actual trusted issue receipt [6297970297](https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297), created/updated `2026-10-20T18:18:44Z` by `chatgpt-codex-connector[bot]` for historical published full head `e786b4028c6b335512f758fc3fca6d17e8f6eafc`. Its verbatim verdict line is `Codex Review: Didn't find any major issues. More of your lovely PRs please.` followed by the normal Reviewed commit `e786b4028c` and genuine canonical About footer. This is an independently identified parser compatibility defect based on a genuine native receipt, not a new native inline finding. Architect inspected the complete actual packet, independently bound receipt metadata and current anchored parser. Packet SHA-256 is `e00a2132bbb15236ae1c6d046dd09c1bca030494182553e35672fed8f6e4760d`; raw-binding proof is `1263d8379c76bd3fd2e3c72dcd5290ce27b510653622c766167f198192349b59`; receipt-body SHA-256 is `925ac8e73ef936400886297817df94a723dfc3f7e36d8644a403f6c7e65c719d`. The actual commit API uniquely resolves the short marker to that full head; this does not authorize treating prefixes or timestamps alone as identity.\n+\n+Published helper `f275b5dcdc6735220c7c8432e777cf83470bf4f19aa63af64bb06ef138da4061` allows base/rocket or the observed Chef's kiss ending for v1 receipts, but excludes this genuine sentence. The one already executed official actual-packet comparison, proof `90b617c139d8154e20831f793c24c0e112e5040f329a8a77815fe64ae88c865a`, records current evaluator fail without error and trusted-main accepted false; actual remote AI Review also failed. Preserve those executions as historical facts. This is a fixable current-source FR-002/D-20 compatibility gap, not evidence of a trusted-main-only D-05 bootstrap gap. The actual completed false/false structured summary remains neutral, the owner's empty COMMENTED review is untrusted, and all actual resolved roots remain independently checked. Genuine clean native content does not by itself prove current parser acceptance or a green required check.\n+\n+Add exactly one supported verdict-ending alternative: literal `. More of your lovely PRs please.` after the existing canonical no-major-issues verdict, only in the v1 receipt-prefix plus Reviewed commit form. Preserve the existing outer case-insensitive matching, line-ending normalization and already supported layout rules; keep the sentence's exact word sequence, ASCII punctuation, literal internal spaces and terminal period. Do not turn it into arbitrary trailing praise/prose, optional words, synonym matching, wildcard punctuation or a new legacy form. The new ending is an alternative to existing endings, not a combinable suffix list: unobserved combinations with Chef's kiss or rocket, repeated praise, misplaced text, missing/extra punctuation and added verdict/body prose must remain rejected. Legacy inline head/reviewed forms and a receipt lacking the v1 prefix do not gain this new ending. Preserve all previously supported base/rocket/Chef forms and exact canonical About policy without weakening any other receipt boundary.\n+\n+Before production edits, retain meaningful fail-first on the immutable e786/helper identity using the complete verbatim actual receipt body, metadata and full expected head. Its standalone classifier/latest selection and actual gate reproduction must fail for the currently missing ending, separately from the genuine positive native content and historical official comparison. After correction the same real-body fixture must pass classification and actual gate evaluation only when configured author trust, unique actual short-SHA API proof, head/request ordering and every independent veto allow it. Keep the actual fixture's body bytes unchanged; identify adversarial/generated mutations separately. A test fixture cannot become fabricated production review evidence, and a passing local reproduction cannot relabel the prior remote failure or waive a future native cycle.\n+\n+Positive controls preserve the existing base, textual/emoji rocket and Chef endings, genuine footer and its existing layout normalization, supported full/uniquely resolved short identities, and configured trusted login handling. Reject altered/repeated/truncated new praise, an extra sentence or duplicate verdict, placement before the verdict/after the commit/in the footer, a new line inside the literal sentence, suffix plus rocket/Chef, unsupported legacy/unprefixed use, malformed/duplicate/mixed receipt/summary markers, missing/foreign/ambiguous commit identity and an untrusted copied actual body. Retain actual update-time ordering and fail-closed ties. A new praise ending cannot clear a current blocking formal review, P3/unknown/older-head actual unresolved root, applicable negative/unfinished structured summary in either slot, or explicit unresolved state. Include the F-29/F-30 rendered-contradiction and neutral-never-approval controls; a clean summary without an eligible receipt/formal result still cannot pass.\n+\n+Through the existing production created/edited receipt route, verify that the genuine allowed ending arriving after a failed exact-head gate causes at most one real exact-head re-evaluation, whose actual evaluator passes only with otherwise clean evidence. Repeated unchanged direct/completion/schedule deliveries must converge without another native request or duplicate POST. Keep active/completion boundaries, immutable context/source/matrix/full-head/run/attempt checks, push races, uncertain-POST reconciliation first, acceptance/history and consumed-absence/blocking safeguards from F-24 onward. Reuse the current evaluator and routing; no workflow, credentials, backend, event or privilege changes are needed for a literal receipt alternative.\n+\n+Root separately assigns Implementation. Limit functional edits to the anchored v1 verdict-ending alternative, meaningful retained fixture/runtime tests and the two directly corresponding Codex receipt-contract descriptions. Preserve every earlier praise/form and all historical evidence. After focused compatibility/runtime, quality/format and feature-memory/diff checks, freeze corrected source/process notes, obtain independent source/process Review, then run a new unchanged original suitable-Node-20 full preflight before publication. Historical e786/F-30 passes do not cover this change. Changed-head publication needs a fresh genuine native cycle and all existing remote/final Architect-then-Analyst/120-second hold gates; upstream READ/trusted-main rollout limitations remain separate blockers rather than an explanation for omitting a fixable parser correction. This Architect update appends only plan/tasks after their entire supplied 190,097/150,308-byte prefixes; all 21 non-plan/task controls, spec/intake, prior evidence and final-role/counter markers remain unchanged. Architect executes no tests, comparison rerun, staging, GitHub action, source approval or final validation.\n+\n+\n+### Implementation evidence: F-31 observed lovely-PRs receipt ending\n+\n+Assigned the same isolated `codex/native-review-compatibility` / PR 221 slice on published baseline `e786b4028c6b335512f758fc3fca6d17e8f6eafc`. Genuine trusted receipt [6297970297](https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297) remains bound to its original author, creation/update `2026-10-20T18:18:44Z`, full e786 head, Reviewed commit `e786b4028c`, canonical About footer and verbatim body SHA-256 `925ac8e73ef936400886297817df94a723dfc3f7e36d8644a403f6c7e65c719d`. Complete actual packet `e00a2132bbb15236ae1c6d046dd09c1bca030494182553e35672fed8f6e4760d` and real unique short-commit resolution are preserved. The already executed official comparison `90b617c139d8154e20831f793c24c0e112e5040f329a8a77815fe64ae88c865a` and historical remote AI Review failed; genuine positive native content is distinct from parser/check acceptance. This fixable source defect is not a trusted-main-only D-05 bootstrap case. No official comparison or native request was repeated.\n+\n+Before production edits, private evidence `/private/tmp/cabadrive-059-f31-lovely-2n_a943a` captured all six starting files, 17 controls and ENTIRE post-Architect prefixes in `baseline-proof.json` (SHA-256 `009ff78250a9cb4f8110164e7cf1c9e0c59eb47405bfa6579b69acf449aa1096`). Appended 54 selected retained F-31 cases on exact published helper `f275b5dcdc6735220c7c8432e777cf83470bf4f19aa63af64bb06ef138da4061` produced **12 intended ERR_ASSERTION failures and 42 passing controls**, actual EXIT1, with zero setup/runtime exceptions. The 1,007 old name-filtered cases are excluded from passes. Helper identity stayed byte-exact before/after. Fail-first raw log `46040401a5a05edffe0d77c8f970daa9624c8a78cb42fea34c1eacc9c5fa3720`, proof `60252173feec5fa0bedc693e6fad89b845e51118d24e54eb01c462437402c51c` retain the full assertions and original test append. The verbatim actual receipt independently failed classification, latest-result selection and the isolated actual-body gate with captured unique short-SHA identity. Generated body mutations and constructed router PR/head/time fixtures are labelled private unit fixtures, not production review evidence.\n+\n+The sole helper change adds literal `. More of your lovely PRs please.` as one anchored v1 Reviewed-commit verdict-ending alternative. Existing base/textual rocket/emoji rocket/Chef forms, case/CRLF and existing outer/footer layout handling remain. Literal internal spaces, word sequence, punctuation and terminal period remain strict. New praise is not granted to legacy/unprefixed forms; altered, truncated, repeated, combined, misplaced, newline-split, extra-prose or malformed/mixed-marker variants remain rejected. Only the two directly corresponding Codex receipt descriptions are synchronized. API, gate, wakeup/router, workflows, trust/head/schema/summary/formal/P3 rules and other backends remain byte-exact.\n+\n+Coverage retains configured-author trust and copied-body rejection, full/uniquely resolved short head identity, missing/foreign/ambiguous API proofs, newer/tied negative selection, formal veto, actual P3/unknown older-head unresolved roots, applicable unfinished code and findings/unresolved security summaries, F-29/F-30 rendered contradictions and clean-summary-never-approval. Created/edited and active-completion production routes re-evaluate once and use the real gate evaluator. After baseline reproduction, the two created/edited unit lifecycle controls were strengthened to model the new attempt's successful jobs/step/log chronology explicitly; acceptance observation plus repeated completion/schedule/direct delivery deduplicates without a second rerun POST. Those job/log/time objects are private fixtures, not remote acceptance. Uncertain prior POST still reconciles before any new scheduling mutation. All earlier consumed-absence, matrix/source/head/attempt, push-race and history controls remain in the full focused suites.\n+\n+On final formatted functional bytes, all six affected review suites passed **1,754/1,754**, zero failures/cancellations/skips (1,700 retained + 54 F-31), actual EXIT0; raw log `97f498fe89284b7fff4b6fe5355c467011f438b1e6b94275996378b18d74f9e4`, proof `620969a479accad93e8e95cb9ab0348c174a8f60e47f0af0f416fd34114d392c`. `pnpm run quality:fast` and `pnpm run format:check` each exited 0; raw logs `bfe6ad8e4f9fe67d51b7c2a81df84b3802885968445ab06d04f9402146488316` / `8fd66d90151dc073d368f0d4507316ab0cf4ad8a2256bd5b564c52fabd7bdb1a`. Genuine existing Node20.20.2, original eight credential-free environment keys/descriptor `5959ce9de17b7d27cb8ada2961a8101e098fba5fa944d72be34e665a6b88d847` and explicit subprocess CHILD umask 022 were used; private evidence uses 0700/0600. No unchanged successful suite was repeated.\n+\n+Independent immutable-e786 baseline proof `a2a49b9851efd85c4a87561d5efcbf1537506f05fb0dd1625cbe357cd9d6c5a3` had 10 positive misses plus 25 correct classifier controls, with one of three isolated gate fixtures missing. Local offline replay preserves ALL 35 ordered input objects/expectations byte-for-byte (`39e34d0f25747407e0f4bde7640303fc3d860fff7a16410f5172fd0606dca3c9`), including the unchanged full genuine receipt object, and uses only captured actual commit responses: **35/35 classifier and 3/3 isolated gate expectations now match**, all 25 controls preserved. Replay proof `72f8d2c3f670dfbc2d7d1621f57066ee374f3b180921ef77e490a868cb9c71cb`, raw results/log `5ec53218fa2cf85ab6ea307ea4e5aa3ba1adaec3d4c65ed0813fda946732ae14`. This constructed local replay does not relabel historical remote failure or constitute independent source/native approval.\n+\n+Read-only prerequisite proof `eff475e0750dc549a2c8953bad7f3c0412b20a660ec0abaa2f0d41d326d689c4` confirms the unchanged genuine image-QA receipt, DSSIM/SSIMULACRA/Chromium/Node hashes and all 23 existing dependency links; source cache parent remains empty. No native validation, browser/build stage, install/relink/cleanup or original full preflight ran for F-31. Four-file functional diff SHA-256 `bac63bdb389a75eab153fa244ab4202b71be13a4ef89ae307da2b848e60e19fa`. These own notes append only AFTER ENTIRE post-Architect plan **197173 bytes** / `8304967cf12b9b101d3e85c7db5d2d78f1a55f6d436e319ee9d5672ecd576ca0` and tasks **153029 bytes** / `3bb3eafb4d20f197645b243592c7a0de6c8ddfd6db64580b8259fae4b4458f70`. The ENTIRE published runtime-test prefix **123104 bytes** / `5ce076d6b4f3ce96a494c53e57b5adf3a63a8ac18cf6ff780c41261dde564c5b`, 17 controls, prior evidence and final-role/counter markers remain preserved. Only notes-appropriate feature-memory/diff checks and exact six-file freeze follow.\n+\n+Independent source/process Review, separately authorized NEW original full preflight, changed-head commit/publication, genuine new-head native cycle, every required remote gate, final Architect then Analyst validation, stable 120-second hold and protected merge remain pending. Historical F-30 full EXIT0 is not F-31 coverage. No staging/commit/push/GitHub action, final validation, counter change, gate waiver or completion claim is made. Parallel/sibling/user work and PR 220 remain preserved.\n+\n+\n+### Architect F-31 validation-feedback disposition: failed full and one bounded reproduction\n+\n+The original unchanged `pnpm run preflight` actually exited 1: 2,578 unit passes, three genuine native validations and two builds passed; browser results were 179 passes, two timeouts and the same five historical skips. Preserve the failed run `/private/tmp/cabadrive-059-f31-preflight-nkxmynyc` and raw log SHA-256 `9b023ed6905aa09aa4ac4a080e31a227e40931483071d070bf0aa39fc50a32b3`. Root's independent failed-full audit `33d0acb9db87b5062afb1f12ada457f0bca408ba7f8b03c5f2b9653a0c8b5036` and read-only diagnosis `80650bd3cda3c0695bc5b5830d4d9ddeb1bb49e9e9b9a4b12f0037f068143b8f` establish no cause. The two failures occurred before the reset/offline assertions, with initial question/answers visible; unchanged counterparts and historical F-30 cases passed. Source/config equality and matching historical asset names do not establish historical dist-byte identity or prove an environmental/flaky cause. UTC 3605.113426 seconds, monotonic 2970.504 seconds and reported long case durations remain separate observations. Do not extend D-13, waive a gate or change source/tests on this evidence.\n+\n+Accept one bounded diagnostic task for Root to assign separately: `pnpm exec playwright test tests/e2e/app.spec.ts:7261 tests/e2e/app.spec.ts:8230 --output <fresh-private-results-directory>`. Exactly these two unchanged selectors across both unchanged projects must select four cases: the two failures plus their counterproject controls. Use genuine existing Node20.20.2, the original eight credential-free environment keys/descriptor, child umask 022, unchanged Playwright configuration and its fresh strict-port-4697 production preview. Hash and reuse the failed-run production dist; no rebuild, dev/manual/reused server, port override, retries/workers/timeouts/trace/assertion/config/test changes, extra selection or repeated attempt. Only private output location may differ so original failure artifacts remain immutable. Verify source/config/dist identity, genuine prerequisites, expected selection and an unoccupied port before execution; stop and report drift/conflict/uncertainty without terminating unrelated processes or cleaning caches.\n+\n+Record exact command/environment, true exit, all selected case outcomes and complete private stdout/status/artifacts, plus before/after source/dist guards and owned-server lifecycle. Any failure, wrong count/skip, startup problem or unresolved uncertainty returns to bounded triage; no automatic retry, case expansion or full run. Four genuine passes mean only nonreproduction in this targeted run. They do not erase original EXIT1, establish a cause, replace original full validation or prove merge readiness. After an audit confirms all four passed and source/config/dist stayed unchanged, Root may separately authorize one new unchanged original full preflight; preserve every failed/full/targeted result. Another full failure returns to triage rather than a blind rerun loop. Existing source Review/focused passes remain valid for unchanged source, with process-note evidence reviewed as needed before publication. All publication/native/remote/final-role/120-second gates remain pending. Architect now appends only this plan/tasks disposition, executes nothing, preserves all entire current prefixes and 21 non-plan/task controls, and returns HOLD; no final validation or counter change.\n+\n+### Implementation: F31 completed postflight evidence (2026-10-21)\n+\n+Independent source review remains source-only APPROVE (`/private/tmp/cabadrive-059-f31-independent-koru3zhb/proof.json`, SHA256 `10ce93065acdb9d3eb69f43b67487f6f1ae772104dd6e0b8fdeb99d9dd5e481d`). The first original full remains EXIT 1: 179 browser passes, two timeouts and the same five historical skips, after 2578 unit passes, three native validations and two builds. Its original log/artifacts remain retained in `/private/tmp/cabadrive-059-f31-preflight-nkxmynyc` (raw SHA256 `9b023ed6905aa09aa4ac4a080e31a227e40931483071d070bf0aa39fc50a32b3`). The separately authorized four-case diagnostic passed selectors 7261/8230 in both projects; that is selective lower-load nonreproduction only, not a cause finding or full-run replacement. Its completion proof SHA256 is `91068da9f5425da62bf19b224cc623f35ca5d768fd16dbe255179edd4844d88b` under `/private/tmp/cabadrive-059-f31-readonly-diagnosis-wppqfxd1/proposed-reproduction`.\n+\n+The separately authorized second original, unchanged `pnpm run preflight` completed EXIT 0 with genuine Node 20.20.2, the original eight-key credential-free environment (SHA256 `5959ce9de17b7d27cb8ada2961a8101e098fba5fa944d72be34e665a6b88d847`) and explicit child umask 022. UTC start/end: `2026-10-20T23:01:30.883431Z` / `2026-10-21T00:39:28.363267Z`; UTC elapsed 5877.479836 seconds and monotonic elapsed 3272.277 seconds are separate observations. Actual totals: 2578/2578 unit passes, zero failed/cancelled/skipped/todo (2932732.785125 ms); three native validations each with 275 verified PNG masters, 1382 SVGs, 30 real DSSIM samples and class (e) absent; builds 8.82/9.56 seconds; and 181 browser passes plus five historical skips (2.6 minutes). Both formerly failing selectors passed in chromium and mobile. No retries, workers, timeouts, environment values, tests or dependencies were changed.\n+\n+The five exact skipped selectors match F27/F28/F29/F30 and first F31: mobile `tests/e2e/ticket-raster.spec.ts:47:1` (fresh DPR1/2 mobile slots and a desktop 620px slot select sufficient encoded widths); mobile `tests/e2e/service-worker-update.spec.ts:180:1` (legacy A auto-activates complete B once, then C waits for the prompt); `:275:1` (failed compatibility install cannot mark or replace legacy A); `:305:1` (authentic legacy A lazy cache miss returns 404 under destructive B publication); and `:332:1` (new-protocol A precaches its never-loaded lazy hash for retained-cache B activation). No new skips were introduced.\n+\n+Attempt-two evidence is retained in `/private/tmp/cabadrive-059-f31-full-attempt2-x6m5a2m3`: raw log 622221 bytes/SHA256 `278bcae340c68e7c1d19f41c5bdf4222746419c7a1848e004e97d8ce93e63a41`, status SHA256 `e63c31ee624ffde06f5c7336ab7b60d6644fe4017caca3b771b9a7c321aba325`, completion proof SHA256 `f8cee8a2bdf68285723df0c04fe807193993e189b5eb58d2bd6ff37e71244f43`. Root independently audited the actual pass in `/private/tmp/cabadrive-059-f31-attempt2-root-full-audit-c3monttb/proof.json`, SHA256 `da1dbf197efe85e3406e06692769d1ac7883d27ae44cb0a1d080ff0aa47c096c`. All six frozen files, 17 controls and entire prefixes remained exact through completion: full diff `842465aca53682eb0d73fa4be277613097a52151ecec9cac516e441c351c0f16`, functional diff `bac63bdb389a75eab153fa244ab4202b71be13a4ef89ae307da2b848e60e19fa`, and independently audited current notes diff `0314219ebea92a44f1b46c7aa782008ae218f015f2900ae4a473085e1c755e2f` before this append. Inherited old notes-patch/empty-cache metadata describes only the historical source freeze. Current snapshots supersede those historical fields. All 84 failed-output files (164582191 bytes) were archived byte-for-byte before normal runner replacement of live outputs; prior private histories remain immutable.\n+\n+Events-only power proofs `08d6ac77db9c670ab7d7db52852cf722f67e0db1be7bbde3c17a5f0988b5e343` / `71b754bd9bfab9f609b96cc08543e87a01aafa883c9c2a06248ee628cf13a42c` establish actual overlap only. They establish no individual timeout cause, exact suspension duration or UTC/monotonic discrepancy cause; no power setting was changed. Separately authorized cache preservation proof `/private/tmp/cabadrive-059-f31-attempt2-cache-preservation-pkm84tv8/proof.json`, SHA256 `489ac0ea641ab38bf1812765782d6c4cbb7fb9c8b1549cfb887c5c0d252838f2`, records fresh no-handles, drained PGID 23432 and free strict port 4697 checks. Only the exact current 81691-byte pyc (inode 122172062, not the older F30 artifact; SHA256 `56d11053f5556a2f06ce886ec8c7252f92ac2ef80733a49eaea7f2d15fcb96b9`) was privately preserved at mode 0600 and unlinked after identity revalidation. Its parent remains empty; index/untracked status remains empty; no broader cleanup occurred.\n+\n+A private notes-preparation guard initially expected two trailing newlines, stopped before any repository write, and was corrected to preserve the actual single-newline prefixes with an append-only separator. This is a private harness correction, not another validation failure. Earlier failures and reviews remain unchanged. No D13 expansion or D05 claim follows. Publication, genuine new-head native review, all five required remote gates, final Architect then Analyst roles (counters zero), the 120-second hold and protected merge remain pending.",
    },
    {
      sha: "76b96dca0d0baa27a60900b59544b4574619da22",
      filename: "specs/059-codex-native-review-compatibility/tasks.md",
      status: "modified",
      additions: 46,
      deletions: 0,
      changes: 46,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/specs%2F059-codex-native-review-compatibility%2Ftasks.md",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/specs%2F059-codex-native-review-compatibility%2Ftasks.md",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/specs%2F059-codex-native-review-compatibility%2Ftasks.md?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        "@@ -376,3 +376,49 @@ The full command preserved all six frozen file bytes, all 17 control paths, comp\n After separate bounded Root authorization, ONLY the sole generated `scripts/__pycache__/ci-docker-resources.cpython-314.pyc` was preserved byte-for-byte in fresh private 0700/0600 evidence, then its exact source file unlinked following fresh drain/no-handle and repeated identity/hash guards. Original device 16777232, inode 121662276, size 81691, mtime_ns 1792516249311558807, mode 0644, SHA-256 `56d11053f5556a2f06ce886ec8c7252f92ac2ef80733a49eaea7f2d15fcb96b9`. Proof `/private/tmp/cabadrive-059-f30-cache-evidence-pbevsew5/proof.json`, SHA-256 `26e828cd30a1eba8b7d793aa68ce387854bf996ca4cdae7affe5d04ea092d45c`. The empty source parent, every other artifact/dependency/environment and sibling/user work were preserved; no broad cleanup occurred.\n \n These factual Implementation notes append only AFTER the ENTIRE original full-start plan **184338 bytes** / `e053b20007d54afd2ad26709313eae8b3c17dfb1dce291eb63972a611639a469` and tasks **144549 bytes** / `95ba336f9150b9e446714a95ff978a5d14c17c71a4f349ac1749318264782b0a`. No earlier byte, Architect disposition, spec/intake, final-role/counter marker or functional file is edited. Only notes-appropriate feature-memory and diff checks follow; no successful functional/full/native/build/browser check is repeated for this append. Independent notes/full-evidence Review, separately authorized commit/publication, genuine new-head native review, five required remote gates, final Architect then Analyst validation, stable 120-second hold and protected merge remain pending. No delivery-complete, final-role, gate-waiver or merge claim is made.\n+\n+\n+## Architect F-31 disposition: genuine lovely-PRs receipt suffix\n+\n+- Accept independent P2 compatibility gap from actual trusted receipt [6297970297](https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297) at 2026-10-20T18:18:44Z on historical e786b4028c6b335512f758fc3fca6d17e8f6eafc. Architect inspected packet `e00a2132bbb15236ae1c6d046dd09c1bca030494182553e35672fed8f6e4760d`, raw-binding proof `1263d8379c76bd3fd2e3c72dcd5290ce27b510653622c766167f198192349b59` and helper `f275b5dcdc6735220c7c8432e777cf83470bf4f19aa63af64bb06ef138da4061`. Genuine current native content is distinct from the historical official current-fail/trusted-main-false comparison and remote AI failure; this fixable current-parser gap is not D-05.\n+- Add only literal `. More of your lovely PRs please.` as a v1-prefix + Reviewed commit ending alternative under existing case/layout normalization. Preserve base/rocket/Chef alternatives. Reject arbitrary/combined/repeated/altered praise, misplaced/newline/extra prose and unprefixed/legacy use of this new suffix. Keep exact About, configured-author trust, unique full-head identity and all schema/marker/chronology boundaries unchanged; document only the corresponding two receipt-contract clauses.\n+- Retain fail-first against unchanged e786 using complete verbatim actual-body fixture for classifier/latest/actual gate, then meaningful positive/prior-form and adversarial controls. Actual short marker must resolve uniquely; body copies from untrusted authors, wrong/missing/ambiguous SHA, stale/tied negative, malformed/duplicate/mixed markers and any root/formal/both-slot-summary veto must still fail. Clean summary remains neutral, owner-empty COMMENTED remains untrusted. Preserve F-24–F-30 lifecycle/history/consumption and rendered-prose defenses. Existing created/edited production route must perform at most one real exact-head re-evaluation for the newly accepted receipt and converge on unchanged deliveries, retaining active/completion, head/source/matrix/run/attempt/race and uncertain-POST-first guards.\n+- After Root's separate Implementation assignment: minimal ending/test/direct-contract edit -> focused compatibility/runtime/quality/format/memory checks and exact freeze -> independent source/process Review -> new original unchanged suitable-Node-20 full preflight -> authorized publication/new-head genuine native review plus all existing remote/final-role/120-second gates. Historical passes/comparisons stay historical. Only Architect plan/tasks appendices change now; entire supplied prefixes and all 21 controls/counters remain intact. No source approval, test/comparison execution, staging, GitHub action, final validation or merge waiver.\n+\n+\n+### Implementation evidence: F-31 observed lovely-PRs receipt ending\n+\n+Assigned the same isolated `codex/native-review-compatibility` / PR 221 slice on published baseline `e786b4028c6b335512f758fc3fca6d17e8f6eafc`. Genuine trusted receipt [6297970297](https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297) remains bound to its original author, creation/update `2026-10-20T18:18:44Z`, full e786 head, Reviewed commit `e786b4028c`, canonical About footer and verbatim body SHA-256 `925ac8e73ef936400886297817df94a723dfc3f7e36d8644a403f6c7e65c719d`. Complete actual packet `e00a2132bbb15236ae1c6d046dd09c1bca030494182553e35672fed8f6e4760d` and real unique short-commit resolution are preserved. The already executed official comparison `90b617c139d8154e20831f793c24c0e112e5040f329a8a77815fe64ae88c865a` and historical remote AI Review failed; genuine positive native content is distinct from parser/check acceptance. This fixable source defect is not a trusted-main-only D-05 bootstrap case. No official comparison or native request was repeated.\n+\n+Before production edits, private evidence `/private/tmp/cabadrive-059-f31-lovely-2n_a943a` captured all six starting files, 17 controls and ENTIRE post-Architect prefixes in `baseline-proof.json` (SHA-256 `009ff78250a9cb4f8110164e7cf1c9e0c59eb47405bfa6579b69acf449aa1096`). Appended 54 selected retained F-31 cases on exact published helper `f275b5dcdc6735220c7c8432e777cf83470bf4f19aa63af64bb06ef138da4061` produced **12 intended ERR_ASSERTION failures and 42 passing controls**, actual EXIT1, with zero setup/runtime exceptions. The 1,007 old name-filtered cases are excluded from passes. Helper identity stayed byte-exact before/after. Fail-first raw log `46040401a5a05edffe0d77c8f970daa9624c8a78cb42fea34c1eacc9c5fa3720`, proof `60252173feec5fa0bedc693e6fad89b845e51118d24e54eb01c462437402c51c` retain the full assertions and original test append. The verbatim actual receipt independently failed classification, latest-result selection and the isolated actual-body gate with captured unique short-SHA identity. Generated body mutations and constructed router PR/head/time fixtures are labelled private unit fixtures, not production review evidence.\n+\n+The sole helper change adds literal `. More of your lovely PRs please.` as one anchored v1 Reviewed-commit verdict-ending alternative. Existing base/textual rocket/emoji rocket/Chef forms, case/CRLF and existing outer/footer layout handling remain. Literal internal spaces, word sequence, punctuation and terminal period remain strict. New praise is not granted to legacy/unprefixed forms; altered, truncated, repeated, combined, misplaced, newline-split, extra-prose or malformed/mixed-marker variants remain rejected. Only the two directly corresponding Codex receipt descriptions are synchronized. API, gate, wakeup/router, workflows, trust/head/schema/summary/formal/P3 rules and other backends remain byte-exact.\n+\n+Coverage retains configured-author trust and copied-body rejection, full/uniquely resolved short head identity, missing/foreign/ambiguous API proofs, newer/tied negative selection, formal veto, actual P3/unknown older-head unresolved roots, applicable unfinished code and findings/unresolved security summaries, F-29/F-30 rendered contradictions and clean-summary-never-approval. Created/edited and active-completion production routes re-evaluate once and use the real gate evaluator. After baseline reproduction, the two created/edited unit lifecycle controls were strengthened to model the new attempt's successful jobs/step/log chronology explicitly; acceptance observation plus repeated completion/schedule/direct delivery deduplicates without a second rerun POST. Those job/log/time objects are private fixtures, not remote acceptance. Uncertain prior POST still reconciles before any new scheduling mutation. All earlier consumed-absence, matrix/source/head/attempt, push-race and history controls remain in the full focused suites.\n+\n+On final formatted functional bytes, all six affected review suites passed **1,754/1,754**, zero failures/cancellations/skips (1,700 retained + 54 F-31), actual EXIT0; raw log `97f498fe89284b7fff4b6fe5355c467011f438b1e6b94275996378b18d74f9e4`, proof `620969a479accad93e8e95cb9ab0348c174a8f60e47f0af0f416fd34114d392c`. `pnpm run quality:fast` and `pnpm run format:check` each exited 0; raw logs `bfe6ad8e4f9fe67d51b7c2a81df84b3802885968445ab06d04f9402146488316` / `8fd66d90151dc073d368f0d4507316ab0cf4ad8a2256bd5b564c52fabd7bdb1a`. Genuine existing Node20.20.2, original eight credential-free environment keys/descriptor `5959ce9de17b7d27cb8ada2961a8101e098fba5fa944d72be34e665a6b88d847` and explicit subprocess CHILD umask 022 were used; private evidence uses 0700/0600. No unchanged successful suite was repeated.\n+\n+Independent immutable-e786 baseline proof `a2a49b9851efd85c4a87561d5efcbf1537506f05fb0dd1625cbe357cd9d6c5a3` had 10 positive misses plus 25 correct classifier controls, with one of three isolated gate fixtures missing. Local offline replay preserves ALL 35 ordered input objects/expectations byte-for-byte (`39e34d0f25747407e0f4bde7640303fc3d860fff7a16410f5172fd0606dca3c9`), including the unchanged full genuine receipt object, and uses only captured actual commit responses: **35/35 classifier and 3/3 isolated gate expectations now match**, all 25 controls preserved. Replay proof `72f8d2c3f670dfbc2d7d1621f57066ee374f3b180921ef77e490a868cb9c71cb`, raw results/log `5ec53218fa2cf85ab6ea307ea4e5aa3ba1adaec3d4c65ed0813fda946732ae14`. This constructed local replay does not relabel historical remote failure or constitute independent source/native approval.\n+\n+Read-only prerequisite proof `eff475e0750dc549a2c8953bad7f3c0412b20a660ec0abaa2f0d41d326d689c4` confirms the unchanged genuine image-QA receipt, DSSIM/SSIMULACRA/Chromium/Node hashes and all 23 existing dependency links; source cache parent remains empty. No native validation, browser/build stage, install/relink/cleanup or original full preflight ran for F-31. Four-file functional diff SHA-256 `bac63bdb389a75eab153fa244ab4202b71be13a4ef89ae307da2b848e60e19fa`. These own notes append only AFTER ENTIRE post-Architect plan **197173 bytes** / `8304967cf12b9b101d3e85c7db5d2d78f1a55f6d436e319ee9d5672ecd576ca0` and tasks **153029 bytes** / `3bb3eafb4d20f197645b243592c7a0de6c8ddfd6db64580b8259fae4b4458f70`. The ENTIRE published runtime-test prefix **123104 bytes** / `5ce076d6b4f3ce96a494c53e57b5adf3a63a8ac18cf6ff780c41261dde564c5b`, 17 controls, prior evidence and final-role/counter markers remain preserved. Only notes-appropriate feature-memory/diff checks and exact six-file freeze follow.\n+\n+Independent source/process Review, separately authorized NEW original full preflight, changed-head commit/publication, genuine new-head native cycle, every required remote gate, final Architect then Analyst validation, stable 120-second hold and protected merge remain pending. Historical F-30 full EXIT0 is not F-31 coverage. No staging/commit/push/GitHub action, final validation, counter change, gate waiver or completion claim is made. Parallel/sibling/user work and PR 220 remain preserved.\n+\n+\n+## Architect F-31 failed-full verification disposition\n+\n+- Preserve original full EXIT1 (2,578 unit passes / three native validations / two builds / 179 browser passes, two timeout failures, five historical skips), immutable raw log `9b023ed6905aa09aa4ac4a080e31a227e40931483071d070bf0aa39fc50a32b3`, audit `33d0acb9db87b5062afb1f12ada457f0bca408ba7f8b03c5f2b9653a0c8b5036` and diagnosis `80650bd3cda3c0695bc5b5830d4d9ddeb1bb49e9e9b9a4b12f0037f068143b8f`. Cause is unestablished; no source/test change, environment attribution, D-13 extension or waiver is justified.\n+- Root may separately assign exactly one targeted reproduction: `pnpm exec playwright test tests/e2e/app.spec.ts:7261 tests/e2e/app.spec.ts:8230 --output <fresh-private-results-directory>`, four cases across unchanged projects. Keep Node20/original eight-key credential-free environment/022/config-owned fresh strict4697 preview/current hashed production dist unchanged. Private output only; no rebuild, manual/reused server, tuning/retries/trace/assertion edits or cache cleanup. Stop on identity drift, occupied port, wrong selection or uncertainty; retain true exit/logs/artifacts and preserve old failures.\n+- Four passes establish nonreproduction only. Any targeted failure/skip/startup issue returns to triage with no automatic retry/full. Only after an evidence audit and unchanged freeze may Root separately authorize one new original unchanged full; another failure returns to triage. Prior source/focused approval is not a full pass. Existing publication/native/remote/final-role/120-second gates stay mandatory. Architect changes only appendices now, performs no execution/GitHub/staging/cleanup/final-role action, and returns HOLD.\n+\n+### Implementation: F31 postflight record and pending handoff (2026-10-21)\n+\n+The first original full remains EXIT 1 (179 browser passes, two timeouts, five historical skips). Original raw/artifacts and all earlier failed/review histories remain retained. The separately authorized four-case diagnostic passed both selectors 7261/8230 in chromium/mobile: lower-load nonreproduction only, not cause proof or replacement for the full run. Source review `10ce93065acdb9d3eb69f43b67487f6f1ae772104dd6e0b8fdeb99d9dd5e481d` remains source-only APPROVE.\n+\n+The separately authorized second original unchanged `pnpm run preflight` actually completed EXIT 0 under Node 20.20.2, original eight-key credential-free environment and child umask 022. UTC start/end `2026-10-20T23:01:30.883431Z` / `2026-10-21T00:39:28.363267Z`; UTC 5877.479836 seconds and monotonic 3272.277 seconds remain separate facts. Actual results: 2578/2578 unit passes, zero failed/cancelled/skipped/todo (2932732.785125 ms); three native validations each with 275 PNG masters, 1382 SVGs, 30 real DSSIM samples and class (e) absent; builds 8.82/9.56 seconds; 181 browser passes and the same five historical skips (2.6 minutes). All four formerly affected selector/project pairs passed. The exact mobile ticket-raster:47 and service-worker-update:180/275/305/332 selector titles match F27–F30 and the failed first F31 in the completion proof. No retries/worker/timeout/environment/test/dependency changes or new skips were used.\n+\n+Private directory `/private/tmp/cabadrive-059-f31-full-attempt2-x6m5a2m3` retains raw 622221 bytes/SHA256 `278bcae340c68e7c1d19f41c5bdf4222746419c7a1848e004e97d8ce93e63a41`, status `e63c31ee624ffde06f5c7336ab7b60d6644fe4017caca3b771b9a7c321aba325` and completion `f8cee8a2bdf68285723df0c04fe807193993e189b5eb58d2bd6ff37e71244f43`. Independent Root audit `/private/tmp/cabadrive-059-f31-attempt2-root-full-audit-c3monttb/proof.json` has SHA256 `da1dbf197efe85e3406e06692769d1ac7883d27ae44cb0a1d080ff0aa47c096c`. All six files, 17 controls and entire prefixes remained exact; before this append, full/functional/current-notes digests were `842465aca53682eb0d73fa4be277613097a52151ecec9cac516e441c351c0f16`, `bac63bdb389a75eab153fa244ab4202b71be13a4ef89ae307da2b848e60e19fa` and `0314219ebea92a44f1b46c7aa782008ae218f015f2900ae4a473085e1c755e2f`. Inherited old notes/cache fields remain historical only. All 84 failed-output files (164582191 bytes) were privately archived exactly before normal runner replacement; prior private evidence remains immutable.\n+\n+Bounded power proofs `08d6ac77db9c670ab7d7db52852cf722f67e0db1be7bbde3c17a5f0988b5e343` / `71b754bd9bfab9f609b96cc08543e87a01aafa883c9c2a06248ee628cf13a42c` establish overlap only, not individual timeout cause, exact suspension or clock discrepancy cause. Exact-leaf preservation proof `/private/tmp/cabadrive-059-f31-attempt2-cache-preservation-pkm84tv8/proof.json`, SHA256 `489ac0ea641ab38bf1812765782d6c4cbb7fb9c8b1549cfb887c5c0d252838f2`, records the current pyc inode 122172062 (not F30), 81691 bytes/SHA256 `56d11053f5556a2f06ce886ec8c7252f92ac2ef80733a49eaea7f2d15fcb96b9`, private copy and exact-leaf unlink after fresh identity/no-handle/PGID 23432 drain/strict-4697 checks. Its empty parent, all other artifacts/dependencies/siblings and empty index/untracked status were preserved. A notes-only newline guard failure preceded any repository write; its private proof is retained, and the correction changes only the appended separator.\n+\n+This evidence append rewrites no historical checkbox, architecture disposition, final-role marker or counter. No D13 expansion or D05 inference follows. Publication, new-head native result, five remote gates, final Architect then Analyst roles (counters zero), the 120-second hold and protected merge remain pending.",
    },
    {
      sha: "c1817b4e29b48c6d762d185614735d54a9a0968c",
      filename: "tests/ai-review-runtime.test.mjs",
      status: "modified",
      additions: 336,
      deletions: 0,
      changes: 336,
      blob_url:
        "https://github.com/cucumberfalse/cabadrive/blob/333f164f77f974d5f839e45dcb4f2cb975e3ab85/tests%2Fai-review-runtime.test.mjs",
      raw_url:
        "https://github.com/cucumberfalse/cabadrive/raw/333f164f77f974d5f839e45dcb4f2cb975e3ab85/tests%2Fai-review-runtime.test.mjs",
      contents_url:
        "https://api.github.com/repos/cucumberfalse/cabadrive/contents/tests%2Fai-review-runtime.test.mjs?ref=333f164f77f974d5f839e45dcb4f2cb975e3ab85",
      patch:
        '@@ -3121,3 +3121,339 @@ test("F30 unresolved issue change cannot overwrite uncertain posting", async ()\n   assert.deepEqual(h.checkpoint, before);\n   assert.equal(h.mutations, 1);\n });\n+\n+// F31: genuine receipt 6297970297 is unchanged; all mutations below are private unit fixtures.\n+const f31ActualComment = {\n+  id: 6297970297,\n+  body: \'<!-- codex-review-receipt:v1 -->\\n\\nCodex Review: Didn\\\'t find any major issues. More of your lovely PRs please.\\n\\n**Reviewed commit:** `e786b4028c`\\n\\n<details> <summary>ℹ️ About Codex in GitHub</summary>\\n<br/>\\n\\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\\n- Open a pull request for review\\n- Mark a draft as ready\\n- Comment "@codex review".\\n\\nIf Codex has suggestions, it will comment; otherwise it will react with 👍.\\n\\n\\n\\n\\nCodex can also answer questions or update the PR. Try commenting "@codex address that feedback".\\n            \\n</details>\',\n+  user: {\n+    login: "chatgpt-codex-connector[bot]",\n+    id: 199175422,\n+    node_id: "BOT_kgDOC98s_g",\n+    avatar_url: "https://avatars.githubusercontent.com/in/1144995?v=4",\n+    gravatar_id: "",\n+    url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D",\n+    html_url: "https://github.com/apps/chatgpt-codex-connector",\n+    followers_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/followers",\n+    following_url:\n+      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/following{/other_user}",\n+    gists_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/gists{/gist_id}",\n+    starred_url:\n+      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/starred{/owner}{/repo}",\n+    subscriptions_url:\n+      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/subscriptions",\n+    organizations_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/orgs",\n+    repos_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/repos",\n+    events_url: "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/events{/privacy}",\n+    received_events_url:\n+      "https://api.github.com/users/chatgpt-codex-connector%5Bbot%5D/received_events",\n+    type: "Bot",\n+    user_view_type: "public",\n+    site_admin: false,\n+  },\n+  created_at: "2026-10-20T18:18:44Z",\n+  updated_at: "2026-10-20T18:18:44Z",\n+  html_url: "https://github.com/cucumberfalse/cabadrive/pull/221#issuecomment-6297970297",\n+  issue_url: "https://api.github.com/repos/cucumberfalse/cabadrive/issues/221",\n+};\n+const f31Head = "e786b4028c6b335512f758fc3fca6d17e8f6eafc";\n+const f31Ending = ". More of your lovely PRs please.";\n+const f31Comment = (body = f31ActualComment.body, extra = {}) => ({\n+  ...f31ActualComment,\n+  body,\n+  ...extra,\n+});\n+const f31Body = (ending) => f31ActualComment.body.replace(f31Ending, ending);\n+const f31Gate = (comments = [f31ActualComment], options = {}, gateOptions = {}) =>\n+  gate(gateApi({ headSha: f31Head, comments, ...options }), { headSha: f31Head, ...gateOptions });\n+\n+test("F31 verbatim actual receipt binding and classifier", async () => {\n+  const { createHash } = await import("node:crypto");\n+  assert.equal(\n+    createHash("sha256").update(f31ActualComment.body).digest("hex"),\n+    "925ac8e73ef936400886297817df94a723dfc3f7e36d8644a403f6c7e65c719d",\n+  );\n+  assert.equal(f31ActualComment.id, 6297970297);\n+  assert.equal(f31ActualComment.user.login, "chatgpt-codex-connector[bot]");\n+  assert.equal(f31ActualComment.created_at, "2026-10-20T18:18:44Z");\n+  assert.equal(f31ActualComment.updated_at, f31ActualComment.created_at);\n+  assert.equal(classifyCodexSummaryComment(f31ActualComment, f31Head), "pass");\n+});\n+test("F31 verbatim actual receipt latest selection", () => {\n+  assert.equal(latestCodexResult([], [], [f31ActualComment], f31Head).result, "pass");\n+});\n+test("F31 isolated actual-body gate requires the actual uniquely resolved short SHA", async () => {\n+  const requests = [];\n+  assert.equal(\n+    await f31Gate(undefined, {\n+      onRequest(path) {\n+        requests.push(path);\n+        if (path.endsWith("/commits/e786b4028c")) return { sha: f31Head };\n+      },\n+    }),\n+    true,\n+  );\n+  assert.equal(requests.filter((path) => path.endsWith("/commits/e786b4028c")).length, 1);\n+});\n+\n+const f31Positive = [\n+  ["existing base", f31Body(".")],\n+  ["existing textual rocket", f31Body(". :rocket:")],\n+  ["existing emoji rocket", f31Body(". 🚀")],\n+  ["existing Chef", f31Body(". Chef\'s kiss.")],\n+  [\n+    "case and CRLF",\n+    f31ActualComment.body\n+      .replace("More of your lovely PRs please.", "MORE OF YOUR LOVELY PRS PLEASE.")\n+      .replaceAll("\\n", "\\r\\n"),\n+  ],\n+  [\n+    "outer and footer layout",\n+    ` \\n${f31ActualComment.body.replace("<details> <summary>", "<details>\\n<summary>")}\\n `,\n+  ],\n+  ["full current SHA", f31ActualComment.body.replace("`e786b4028c`", `\\`${f31Head}\\``)],\n+  ["unique seven-digit SHA", f31ActualComment.body.replace("`e786b4028c`", "`e786b40`")],\n+];\n+for (const [label, body] of f31Positive)\n+  test(`F31 positive unit variant preserves ${label}`, async () => {\n+    assert.equal(classifyCodexSummaryComment(f31Comment(body), f31Head), "pass");\n+    assert.equal(await f31Gate([f31Comment(body)]), true);\n+  });\n+\n+const f31Invalid = [\n+  ["changed adjective", f31Body(". More of your wonderful PRs please.")],\n+  ["changed plural", f31Body(". More of your lovely PR please.")],\n+  ["missing terminal period", f31Body(". More of your lovely PRs please")],\n+  ["extra terminal punctuation", f31Body(`${f31Ending}.`)],\n+  ["double internal space", f31Body(". More  of your lovely PRs please.")],\n+  ["internal newline", f31Body(". More of your lovely\\nPRs please.")],\n+  ["repeated ending", f31Body(`${f31Ending} More of your lovely PRs please.`)],\n+  ["combined Chef", f31Body(`${f31Ending} Chef\'s kiss.`)],\n+  ["combined rocket", f31Body(`${f31Ending} 🚀`)],\n+  ["rocket before ending", f31Body(`. :rocket:${f31Ending}`)],\n+  ["duplicate verdict", f31Body(`${f31Ending} Codex Review: Didn\'t find any major issues.`)],\n+  ["negative extra prose", f31Body(`${f31Ending} Found one issue.`)],\n+  ["unfinished extra prose", f31Body(`${f31Ending} Review is still running.`)],\n+  ["priority extra prose", f31Body(`${f31Ending} [P2] Regression.`)],\n+  ["ending before verdict", f31Body(".").replace("Codex Review:", `${f31Ending} Codex Review:`)],\n+  ["ending after commit", f31Body(".").replace("`e786b4028c`", `\\`e786b4028c\\`${f31Ending}`)],\n+  ["ending in footer", f31Body(".").replace("</details>", `${f31Ending}</details>`)],\n+  ["unprefixed form", f31ActualComment.body.replace("<!-- codex-review-receipt:v1 -->\\n\\n", "")],\n+  ["duplicate marker", `<!-- codex-review-receipt:v1 -->\\n\\n${f31ActualComment.body}`],\n+  ["wrong version", f31ActualComment.body.replace("receipt:v1", "receipt:v2")],\n+  ["mixed summary marker", `${f31ActualComment.body}\\n<!-- codex-review-state:v1 {} -->`],\n+  [\n+    "missing reviewed commit",\n+    f31ActualComment.body.replace("**Reviewed commit:** `e786b4028c`", ""),\n+  ],\n+  [\n+    "altered canonical footer",\n+    f31ActualComment.body.replace(\n+      "If Codex has suggestions, it will comment",\n+      "If Codex has suggestions, it might comment",\n+    ),\n+  ],\n+  [\n+    "legacy inline head",\n+    `Codex Review: Didn\'t find any major issues in head ${f31Head}.${f31Ending}`,\n+  ],\n+  [\n+    "legacy Reviewed",\n+    `Codex Review: Didn\'t find any major issues. Reviewed [${f31Head}].${f31Ending}`,\n+  ],\n+];\n+for (const [label, body] of f31Invalid)\n+  test(`F31 bounded ending rejects ${label}`, async () => {\n+    assert.equal(classifyCodexSummaryComment(f31Comment(body), f31Head), "fail");\n+    assert.equal(await f31Gate([f31Comment(body)]), false);\n+  });\n+\n+test("F31 configured trust and untrusted copied body", async () => {\n+  const copied = f31Comment(undefined, { user: { login: "configured-codex" } });\n+  assert.equal(classifyCodexSummaryComment(copied, f31Head), null);\n+  assert.equal(await f31Gate([copied]), false);\n+  const config = { trustedReviewLoginsByAgent: { codex: ["configured-codex"] } };\n+  assert.equal(classifyCodexSummaryComment(copied, f31Head, config), "pass");\n+  assert.equal(await f31Gate([copied], {}, { config }), true);\n+});\n+for (const proof of ["foreign", "missing", "ambiguous"])\n+  test(`F31 actual-body gate rejects ${proof} short-SHA API proof`, async () => {\n+    assert.equal(\n+      await f31Gate(undefined, {\n+        onRequest(path) {\n+          if (!path.includes("/commits/")) return;\n+          if (proof === "foreign") return { sha: other };\n+          if (proof === "missing") return {};\n+          throw Object.assign(new Error("Ambiguous SHA"), { status: 422 });\n+        },\n+      }),\n+      false,\n+    );\n+  });\n+test("F31 foreign and mixed reviewed markers do not approve current head", async () => {\n+  const foreign = f31Comment(f31ActualComment.body.replace("e786b4028c", other));\n+  assert.equal(classifyCodexSummaryComment(foreign, f31Head), null);\n+  assert.equal(await f31Gate([foreign]), false);\n+  const mixed = f31Comment(`${f31ActualComment.body}\\n${other}`);\n+  assert.equal(classifyCodexSummaryComment(mixed, f31Head), "fail");\n+  assert.equal(await f31Gate([mixed]), false);\n+});\n+for (const blocker of [\n+  "formal",\n+  "P3 root",\n+  "unknown old root",\n+  "code unfinished",\n+  "security findings",\n+  "rendered contradiction",\n+  "newer negative",\n+  "tied negative",\n+])\n+  test(`F31 actual-body gate preserves ${blocker}`, async () => {\n+    const comments = [f31ActualComment];\n+    const options = {};\n+    if (blocker === "formal")\n+      options.reviews = [makeReview({ commit_id: f31Head, state: "CHANGES_REQUESTED" })];\n+    if (blocker.includes("root"))\n+      options.inline = [\n+        {\n+          id: 44,\n+          user,\n+          body: blocker === "P3 root" ? "[P3] Advisory" : "[Unknown] Finding",\n+          commit_id: other,\n+        },\n+      ];\n+    if (blocker.includes("negative"))\n+      comments.push(\n+        f31Comment(f31Body(". Found one finding."), {\n+          id: 2,\n+          updated_at:\n+            blocker === "tied negative" ? f31ActualComment.updated_at : "2026-10-20T18:19:00Z",\n+        }),\n+      );\n+    if (["code unfinished", "security findings", "rendered contradiction"].includes(blocker)) {\n+      const state = { code_review: f28Clean(f31Head), security_review: f28Clean(f31Head) };\n+      if (blocker === "code unfinished")\n+        state.code_review = {\n+          ...state.code_review,\n+          status: "running",\n+          has_any_findings: null,\n+          has_unresolved_findings: null,\n+        };\n+      if (blocker === "security findings")\n+        state.security_review = {\n+          ...state.security_review,\n+          has_any_findings: true,\n+          has_unresolved_findings: true,\n+        };\n+      comments.push(\n+        f31Comment(\n+          `<!-- codex-pull-request-review-summary -->\\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->${blocker === "rendered contradiction" ? "\\nThere is an unresolved issue." : ""}`,\n+          { id: 2, updated_at: "2026-10-20T18:19:00Z" },\n+        ),\n+      );\n+    }\n+    assert.equal(\n+      latestCodexResult(options.reviews || [], options.inline || [], comments, f31Head).result,\n+      "fail",\n+    );\n+    assert.equal(await f31Gate(comments, options), false);\n+  });\n+test("F31 clean summary never approves without independent receipt", async () => {\n+  const state = { code_review: f28Clean(f31Head), security_review: f28Empty() };\n+  const summary = f31Comment(\n+    `<!-- codex-pull-request-review-summary -->\\n<!-- codex-review-state:v1 ${JSON.stringify(state)} -->`,\n+    { id: 2 },\n+  );\n+  assert.equal(classifyCodexSummaryComment(summary, f31Head), null);\n+  assert.equal(await f31Gate([summary]), false);\n+  assert.equal(await f31Gate([summary, f31ActualComment]), true);\n+});\n+\n+// Router fixtures preserve the ending while using the harness\'s explicitly constructed PR/head/time.\n+const f31RouteComment = () =>\n+  makeComment({\n+    body: f31ActualComment.body.replaceAll("e786b4028c", head.slice(0, 10)),\n+  });\n+function f31SuccessfulAttempt(h) {\n+  const started = h.run.run_started_at;\n+  const accepted = new Date(Date.parse(started) + 100).toISOString();\n+  const observed = new Date(Date.parse(started) + 1000).toISOString();\n+  h.run = { ...h.run, status: "completed", conclusion: "success" };\n+  const list = h.api.list;\n+  h.api.list = (path, ...args) =>\n+    path.includes("/attempts/")\n+      ? Promise.resolve([\n+          {\n+            id: 200,\n+            run_id: 100,\n+            run_attempt: h.run.run_attempt,\n+            head_sha: head,\n+            name: "AI Review",\n+            status: "completed",\n+            conclusion: "success",\n+            started_at: started,\n+            completed_at: accepted,\n+            steps: [\n+              {\n+                name: "Route and validate selected native review",\n+                number: 4,\n+                status: "completed",\n+                conclusion: "success",\n+                started_at: started,\n+                completed_at: accepted,\n+              },\n+            ],\n+          },\n+        ])\n+      : list(path, ...args);\n+  h.api.readJobLog = async () => `AI Review gate passed for codex on ${head}.\\n`;\n+  const request = h.api.request;\n+  h.api.request = async (path, options = {}) => {\n+    const response = await request(path, options);\n+    if (options.method === "POST" || options.method === "PATCH") {\n+      response.updated_at = observed;\n+      h.checkpoint = structuredClone(response);\n+    }\n+    return response;\n+  };\n+  const route = h.route;\n+  h.route = (options = {}) => route({ now: () => Date.parse(observed), ...options });\n+}\n+for (const action of ["created", "edited"])\n+  test(`F31 production ${action} receipt reruns once, passes evaluator and deduplicates`, async () => {\n+    const comment = f31RouteComment();\n+    const h = routerHarness({ comments: [comment] });\n+    h.run = { ...h.run, conclusion: "failure" };\n+    h.event.action = action;\n+    h.event.comment = comment;\n+    assert.equal(await h.route(), "rerun-confirmed");\n+    assert.equal(await gate(gateApi({ comments: h.comments })), true);\n+    assert.equal(await h.route(), "already-evaluated");\n+    // This unit fixture supplies exact successful-attempt jobs/log chronology, never remote evidence.\n+    f31SuccessfulAttempt(h);\n+    assert.equal(await deliverPosting(h, "completion"), "observed-native-acceptance");\n+    assert.equal(await deliverPosting(h, "schedule"), "already-observed");\n+    assert.equal(await h.route(), "already-observed");\n+    assert.equal(h.mutations, 1);\n+  });\n+test("F31 active receipt waits for completion before a single rerun", async () => {\n+  const comment = f31RouteComment();\n+  const h = routerHarness({ comments: [comment], status: "in_progress" });\n+  h.event.comment = comment;\n+  assert.equal(await h.route(), "pending-active-completion");\n+  assert.equal(h.mutations, 0);\n+  h.run = { ...h.run, status: "completed", conclusion: "failure" };\n+  assert.equal(await deliverPosting(h, "completion"), "rerun-confirmed");\n+  assert.equal(await gate(gateApi({ comments: h.comments })), true);\n+  assert.equal(h.mutations, 1);\n+});\n+test("F31 new ending cannot bypass uncertain posting reconciliation", async () => {\n+  const h = routerHarness({ postError: true, confirm: false });\n+  await assert.rejects(h.route(), /could not be confirmed/);\n+  const prior = structuredClone(h.checkpoint);\n+  h.comments[0] = f31RouteComment();\n+  h.event.comment = h.comments[0];\n+  await assert.rejects(h.route(), /Prior rerun acceptance remains uncertain/);\n+  assert.deepEqual(h.checkpoint, prior);\n+  assert.equal(h.mutations, 1);\n+});',
    },
  ],
};
const f33Comment = (body, base = f33ActualReceipt) => ({ ...base, body });
const f33Gate = (comments = [f33ActualReceipt, f33ActualSummary], options = {}) =>
  gate(gateApi({ headSha: f33Head, comments, ...options }), { headSha: f33Head });
const f33FooterStart = f33ActualSummary.body.indexOf("<details>");
const f33Footer = f33ActualSummary.body.slice(f33FooterStart);
const f33SummaryText = f33ActualSummary.body.slice(0, f33FooterStart);

test("F33 actual receipt body hash and v1 tada verdict", async () => {
  const { createHash } = await import("node:crypto");
  assert.equal(
    createHash("sha256").update(f33ActualReceipt.body).digest("hex"),
    "051d651399aae04c68395f69bf1f8da5da4887184c7dc4c42dfad55c9c428e56",
  );
  assert.equal(classifyCodexSummaryComment(f33ActualReceipt, f33Head), "pass");
});
test("F33 actual summary body hash and canonical advertisement stays neutral", async () => {
  const { createHash } = await import("node:crypto");
  assert.equal(
    createHash("sha256").update(f33ActualSummary.body).digest("hex"),
    "eef95081f0df07bca78f1f6d560c1fa9b9ed3befa4765be88e47e960a61744cf",
  );
  assert.deepEqual(classifyCodexStructuredSummary(f33ActualSummary, f33Head), { result: null });
});
test("F33 actual pair passes selection and gate using captured unique commit lookup", async () => {
  assert.equal(
    latestCodexResult([], [], [f33ActualReceipt, f33ActualSummary], f33Head).result,
    "pass",
  );
  const lookedUp = [];
  assert.equal(
    await f33Gate(undefined, {
      onRequest(path) {
        if (!path.includes("/commits/")) return;
        lookedUp.push(path);
        assert.equal(path, `${root}/commits/333f164f77`);
        return f33ActualCommit;
      },
    }),
    true,
  );
  assert.ok(lookedUp.length > 0);
});
test("F33 summary advertisement alone cannot approve", async () => {
  assert.equal(await f33Gate([f33ActualSummary]), false);
});
for (const [name, body] of [
  [
    "legacy without prefix",
    f33ActualReceipt.body.replace("<!-- codex-review-receipt:v1 -->\n\n", ""),
  ],
  ["repeat", f33ActualReceipt.body.replace(":tada:", ":tada: :tada:")],
  ["combined rocket", f33ActualReceipt.body.replace(":tada:", ":tada: :rocket:")],
  ["combined praise", f33ActualReceipt.body.replace(":tada:", ":tada: Chef's kiss.")],
  ["unknown shortcode", f33ActualReceipt.body.replace(":tada:", ":other:")],
  ["malformed shortcode", f33ActualReceipt.body.replace(":tada:", ":tada")],
  ["added verdict prose", f33ActualReceipt.body.replace(":tada:", ":tada: review is pending")],
  ["legacy head form", `Codex Review: Didn't find any major issues in head ${f33Head}. :tada:`],
  [
    "legacy reviewed form",
    `Codex Review: Didn't find any major issues. Reviewed [${f33Head}]. :tada:`,
  ],
])
  test(`F33 tada rejects ${name}`, async () => {
    const comment = f33Comment(body);
    assert.equal(classifyCodexSummaryComment(comment, f33Head), "fail");
    assert.equal(await f33Gate([comment]), false);
  });
test("F33 canonical summary footer preserves existing bounded layout normalization", () => {
  const comment = f33Comment(
    f33ActualSummary.body.replaceAll("ℹ️ ", "").replaceAll("\n", "\r\n"),
    f33ActualSummary,
  );
  assert.deepEqual(classifyCodexStructuredSummary(comment, f33Head), { result: null });
});
for (const [name, body] of [
  [
    "modified link",
    f33ActualSummary.body.replace(
      "https://chatgpt.com/codex/cloud/settings/general",
      "https://example.invalid",
    ),
  ],
  ["modified text", f33ActualSummary.body.replace("Codex reacts", "The bot reacts")],
  ["duplicate footer", f33ActualSummary.body + f33Footer],
  ["nested footer", f33SummaryText + "<details>" + f33Footer + "</details>"],
  ["nonterminal footer", f33ActualSummary.body + "\nExtra prose"],
  ["truncated footer", f33ActualSummary.body.replace("</details>", "")],
  [
    "unknown details",
    f33SummaryText + "<details><summary>Other</summary>Review is running</details>",
  ],
  ["substantive pending before", f33SummaryText + "Review is pending.\n" + f33Footer],
  ["substantive found before", f33SummaryText + "Found an issue.\n" + f33Footer],
  ["substantive unresolved before", f33SummaryText + "Unresolved findings remain.\n" + f33Footer],
  ["substantive severity before", f33SummaryText + "P3 issue.\n" + f33Footer],
  [
    "negative in modified footer",
    f33ActualSummary.body.replace("Codex reacts", "Found an issue. Codex reacts"),
  ],
  ["negative after footer", f33ActualSummary.body + "\nFound an issue."],
  ["unfinished state", f33ActualSummary.body.replace('"status":"completed"', '"status":"pending"')],
  [
    "unresolved state",
    f33ActualSummary.body.replace(
      '"has_any_findings":false,"has_unresolved_findings":false',
      '"has_any_findings":true,"has_unresolved_findings":true',
    ),
  ],
  [
    "duplicate marker in footer",
    f33ActualSummary.body.replace("</details>", "<!-- codex-review-state:v1 {} -->\n</details>"),
  ],
])
  test(`F33 summary veto survives ${name}`, async () => {
    const comment = f33Comment(body, f33ActualSummary);
    assert.equal(classifyCodexStructuredSummary(comment, f33Head).result, "fail");
    assert.equal(await f33Gate([f33ActualReceipt, comment]), false);
  });
test("F33 clean advertisement cannot clear independent inline or formal blockers", async () => {
  assert.equal(
    await f33Gate(undefined, { inline: [{ id: 500, body: "P3 issue", user, commit_id: other }] }),
    false,
  );
  assert.equal(
    await f33Gate(undefined, {
      reviews: [
        makeReview({
          commit_id: f33Head,
          state: "CHANGES_REQUESTED",
          submitted_at: f33ActualSummary.updated_at,
        }),
      ],
    }),
    false,
  );
});
test("F33 created native pair reruns once, passes gate and deduplicates successful completion", async () => {
  // Only this router fixture uses the harness PR/head/time; it is not remote acceptance evidence.
  const comments = [f33ActualReceipt, f33ActualSummary].map((comment, index) =>
    makeComment({
      id: index + 1,
      body: comment.body
        .replaceAll(f33Head, head)
        .replaceAll("333f164f77", head.slice(0, 10))
        .replaceAll("333f164", head.slice(0, 7)),
    }),
  );
  const h = routerHarness({ comments });
  h.run = { ...h.run, conclusion: "failure" };
  h.event.action = "created";
  h.event.comment = comments[0];
  assert.equal(await h.route(), "rerun-confirmed");
  assert.equal(await gate(gateApi({ comments: h.comments })), true);
  assert.equal(await h.route(), "already-evaluated");
  f31SuccessfulAttempt(h);
  assert.equal(await deliverPosting(h, "completion"), "observed-native-acceptance");
  assert.equal(await deliverPosting(h, "schedule"), "already-observed");
  assert.equal(await h.route(), "already-observed");
  assert.equal(h.mutations, 1);
});

// F34: this finding-bearing native c8d summary stays verbatim. Clean variants below
// are explicitly synthetic regression fixtures, never native acceptance evidence.
const f34ActualHead = "c8d5a7b75c4584c0910bd64ed1405e9292038136";
const f34ActualSummary = {
  id: 6203835030,
  body: '<!-- codex-pull-request-review-summary -->\n<!-- codex-review-state:v1 {"code_review":{"commit_sha":"c8d5a7b75c4584c0910bd64ed1405e9292038136","has_any_findings":true,"has_unresolved_findings":true,"status":"completed"},"security_review":{"commit_sha":null,"has_any_findings":null,"has_unresolved_findings":null,"status":null}} -->\n\n## Codex Review Summary\n\nThis comment shows the latest Codex review activity on this pull request.\n\n| Review | Status | Commit | Review trigger |\n| --- | --- | --- | --- |\n| 📝 **Code Review** | ✅ **Completed** <relative-time datetime="2026-10-22T22:43:59.358944Z">2026-10-22T22:43:59.358944Z</relative-time> | `c8d5a7b` | Manual request |\n\n\n\n<details> <summary>ℹ️ About Codex in GitHub</summary>\n<br/>\n\n[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you\n- Open a pull request for review\n- Mark a draft as ready\n- Comment "@codex review" or "@codex security review".\n\nCodex reacts with 👀 while any review is running, comments if it has suggestions, and reacts with 👍 once all reviews finish with no findings.\n\n</details>',
  user: {
    login: "chatgpt-codex-connector[bot]",
    type: "Bot",
  },
  created_at: "2026-10-15T22:45:17Z",
  updated_at: "2026-10-22T22:44:00Z",
};
const f34CleanBody = f34ActualSummary.body
  .replaceAll(f34ActualHead, head)
  .replace('"has_any_findings":true', '"has_any_findings":false')
  .replace('"has_unresolved_findings":true', '"has_unresolved_findings":false');
const f34CleanSummary = (body = f34CleanBody) =>
  makeComment({
    id: 34,
    body,
    updated_at: f34ActualSummary.updated_at,
  });

test("F34 actual c8d finding summary remains immutable and blocking", async () => {
  const { createHash } = await import("node:crypto");
  assert.equal(
    createHash("sha256").update(f34ActualSummary.body).digest("hex"),
    "637f6b332f1adc81bab8aec58da2b9e1a7b3dc4bd1a1f8b8b77f3ab80358fe97",
  );
  assert.deepEqual(classifyCodexStructuredSummary(f34ActualSummary, f34ActualHead), {
    result: "fail",
    unresolved: true,
  });
  assert.equal(
    await gate(gateApi({ headSha: f34ActualHead, comments: [f34ActualSummary] }), {
      headSha: f34ActualHead,
    }),
    false,
  );
});
for (const [name, body] of [
  ["single heading icon", f34CleanBody],
  ["absent heading icon", f34CleanBody.replace("<summary>ℹ️ About", "<summary>About")],
  [
    "heading icon with whitespace and CRLF",
    f34CleanBody
      .replace("<details> <summary>ℹ️ About", "<details>\n\t<summary>ℹ️ \t About")
      .replaceAll("\n", "\r\n"),
  ],
  [
    "absent heading icon with whitespace and CRLF",
    f34CleanBody
      .replace("<details> <summary>ℹ️ About", "<details>\n\t<summary>About")
      .replaceAll("\n", "\r\n"),
  ],
])
  test(`F34 synthetic canonical footer accepts only ${name}`, async () => {
    const summary = f34CleanSummary(body);
    assert.deepEqual(classifyCodexStructuredSummary(summary, head), { result: null });
    assert.equal(latestCodexResult([], [], [makeComment(), summary], head).result, "pass");
    assert.equal(await gate(gateApi({ comments: [makeComment(), summary] })), true);
    assert.equal(await gate(gateApi({ comments: [summary] })), false);
  });
for (const [name, body] of [
  ["duplicated heading icon", f34CleanBody.replace("<summary>ℹ️ About", "<summary>ℹ️ ℹ️ About")],
  ["prose icon", f34CleanBody.replace("Codex reacts with", "ℹ️ Codex reacts with")],
  ["trigger icon", f34CleanBody.replace("- Open a pull request", "- ℹ️ Open a pull request")],
  ["link icon", f34CleanBody.replace("[Your team", "[ℹ️ Your team")],
  ["closing icon", f34CleanBody.replace("</details>", "ℹ️ </details>")],
  [
    "icon inside heading text",
    f34CleanBody.replace("About Codex in GitHub", "About ℹ️ Codex in GitHub"),
  ],
  [
    "two icons without heading icon",
    f34CleanBody
      .replace("<summary>ℹ️ About", "<summary>About")
      .replace("Codex reacts with", "ℹ️ ℹ️ Codex reacts with"),
  ],
])
  test(`F34 synthetic modified footer vetoes older receipt: ${name}`, async () => {
    const summary = f34CleanSummary(body);
    const actual = {
      structured: classifyCodexStructuredSummary(summary, head),
      latest: latestCodexResult([], [], [makeComment(), summary], head).result,
      gate: await gate(gateApi({ comments: [makeComment(), summary] })),
    };
    assert.deepEqual(actual, { structured: { result: "fail" }, latest: "fail", gate: false });
  });

// F35: use the retained genuine F33 receipt unchanged. Only the footer mutations
// below are synthetic regressions for the separate positive-receipt parser.
const f35Receipt = (body = f33ActualReceipt.body, extra = {}) => ({
  ...f33ActualReceipt,
  body,
  ...extra,
});

// F37: this constructs the byte-asserted actual receipt from the retained
// canonical fixture; all variants after it are local boundary fixtures.
const f37Head = "fe80844da92c9665752f3de8332a0920e1420f9b";
const f37ActualReceipt = {
  ...f33ActualReceipt,
  id: 6356272035,
  body: f33ActualReceipt.body.replace("333f164f77", "fe80844da9").replace(":tada:", ":+1:"),
  created_at: "2026-10-23T02:56:00Z",
  updated_at: "2026-10-23T02:56:00Z",
};
const f37Receipt = (body = f37ActualReceipt.body, extra = {}) => ({
  ...f37ActualReceipt,
  body,
  ...extra,
});
const f37Gate = (comments = [f37ActualReceipt]) =>
  gate(gateApi({ headSha: f37Head, comments }), { headSha: f37Head });

test("F37 actual plus-one receipt binds classifier/latest/gate", async () => {
  const { createHash } = await import("node:crypto");
  assert.equal(
    createHash("sha256").update(f37ActualReceipt.body).digest("hex"),
    "e3be5881c735b7686f761db8637fda9353d4a5b581f1816fc7f970d7bcfd2607",
  );
  assert.equal(f37ActualReceipt.id, 6356272035);
  assert.equal(classifyCodexSummaryComment(f37ActualReceipt, f37Head), "pass");
  assert.equal(latestCodexResult([], [], [f37ActualReceipt], f37Head).result, "pass");
  assert.equal(await f37Gate(), true);
});
for (const [name, body] of [
  ["repeated", f37ActualReceipt.body.replace(":+1:", ":+1: :+1:")],
  ["combined", f37ActualReceipt.body.replace(":+1:", ":+1: :tada:")],
  ["extra prose", f37ActualReceipt.body.replace(":+1:", ":+1: approved")],
  ["malformed plus", f37ActualReceipt.body.replace(":+1:", ":+1")],
  ["numeric lookalike", f37ActualReceipt.body.replace(":+1:", ":+2:")],
  ["negative", f37ActualReceipt.body.replace(":+1:", ":+1: Found an issue")],
  ["unknown", f37ActualReceipt.body.replace(":+1:", ":other:")],
  ["unicode alias", f37ActualReceipt.body.replace(":+1:", " 👍")],
  ["shortcode alias", f37ActualReceipt.body.replace(":+1:", ":thumbsup:")],
  [
    "legacy without prefix",
    f37ActualReceipt.body.replace("<!-- codex-review-receipt:v1 -->\n\n", ""),
  ],
])
  test(`F37 plus-one rejects ${name}`, async () => {
    const receipt = f37Receipt(body);
    assert.equal(classifyCodexSummaryComment(receipt, f37Head), "fail");
    assert.equal(await f37Gate([receipt]), false);
  });
for (const [name, body] of [
  ["single heading icon", f33ActualReceipt.body],
  [
    "absent heading icon with whitespace and CRLF",
    f33ActualReceipt.body
      .replace("<details> <summary>ℹ️ About", "<details>\n\t<summary>About")
      .replaceAll("\n", "\r\n"),
  ],
])
  test(`F35 canonical positive receipt accepts ${name}`, async () => {
    const receipt = f35Receipt(body);
    assert.equal(classifyCodexSummaryComment(receipt, f33Head), "pass");
    assert.equal(latestCodexResult([], [], [receipt], f33Head).result, "pass");
    assert.equal(await f33Gate([receipt]), true);
  });
for (const [name, body] of [
  [
    "duplicated heading icon",
    f33ActualReceipt.body.replace("<summary>ℹ️ About", "<summary>ℹ️ ℹ️ About"),
  ],
  [
    "injected prose icon",
    f33ActualReceipt.body.replace("If Codex has suggestions", "ℹ️ If Codex has suggestions"),
  ],
  [
    "injected trigger icon",
    f33ActualReceipt.body.replace("- Open a pull request", "- ℹ️ Open a pull request"),
  ],
  ["injected link icon", f33ActualReceipt.body.replace("[Your team", "[ℹ️ Your team")],
  ["injected closing icon", f33ActualReceipt.body.replace("</details>", "ℹ️ </details>")],
])
  test(`F35 modified newer receipt vetoes older valid receipt: ${name}`, async () => {
    const modified = f35Receipt(body, { id: 35, updated_at: "2026-10-22T19:55:06Z" });
    assert.equal(classifyCodexSummaryComment(modified, f33Head), "fail");
    assert.equal(latestCodexResult([], [], [f33ActualReceipt, modified], f33Head).result, "fail");
    assert.equal(await f33Gate([f33ActualReceipt, modified]), false);
  });
