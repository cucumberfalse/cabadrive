import test from "node:test";
import assert from "node:assert/strict";
import { runReviewGate } from "../scripts/ai-review-gate.mjs";
import { resolvePrContext } from "../scripts/resolve-pr-context.mjs";
import { createReviewApi } from "../scripts/ai-review-api.mjs";
import { latestCodexResult } from "../scripts/ai-review-helpers.mjs";
import {
  routeReviewWakeup,
  wakeupPrNumber,
  discoverWakeupPulls,
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
      if (path === `${root}/pulls/12`) return makePull();
      if (path.includes("/commits/")) return { sha: head };
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
  assert.equal(await h.route({ event: { ...h.event, action: "deleted" } }), "ignored-event");
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
  const route = (extra = {}) => h.route({ repository: actualRepository, event, ...extra });
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
        assert.equal(await h.route({ event, config }), "rerun-confirmed");
        const unknown = { ...event, comment: { ...event.comment, user: { login: "unknown" } } };
        assert.equal(await h.route({ event: unknown, config }), "ignored-event");
        assert.equal(h.mutations, 1);
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
