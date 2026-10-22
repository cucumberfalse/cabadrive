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
