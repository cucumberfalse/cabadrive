import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  classifyCodexSummaryComment,
  isAcceptableCodexSummaryComment,
  latestCodexResult,
} from "../scripts/ai-review-helpers.mjs";

export const headSha = "2667f79cd7676ff331730cabf661d38dbbcddb0d";
export const nativeReceipt = [
  "<!-- codex-review-receipt:v1 -->",
  "",
  "Codex Review: Didn't find any major issues. :rocket:",
  "",
  "**Reviewed commit:** `2667f79cd7`",
].join("\n");
export const codexUser = { login: "chatgpt-codex-connector[bot]" };

test("real native receipt preserves the explicit reviewed commit", () => {
  assert.equal(
    isAcceptableCodexSummaryComment({ body: nativeReceipt, user: codexUser }, headSha),
    true,
  );
});

test("legacy comment without the receipt prefix remains supported", () => {
  const body = nativeReceipt.replace("<!-- codex-review-receipt:v1 -->\n\n", "");
  assert.equal(isAcceptableCodexSummaryComment({ body, user: codexUser }, headSha), true);
});

const comment = (body, extra = {}) => ({
  id: 1,
  body,
  user: codexUser,
  created_at: "2026-10-15T12:00:00Z",
  ...extra,
});
const details = `<details> <summary>ℹ️ About Codex in GitHub</summary>
<br/>
[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review".
If Codex has suggestions, it will comment; otherwise it will react with 👍.
Codex can also answer questions or update the PR. Try commenting "@codex address that feedback".
</details>`;

test("real native optional About details and CRLF are preserved", () => {
  assert.equal(
    isAcceptableCodexSummaryComment(comment(`${nativeReceipt}\n\n${details}`), headSha),
    true,
  );
  assert.equal(
    isAcceptableCodexSummaryComment(comment(nativeReceipt.replaceAll("\n", "\r\n")), headSha),
    true,
  );
});

for (const [name, body] of Object.entries({
  "wrong SHA": nativeReceipt.replace("2667f79cd7", "deadbeef00"),
  "missing SHA": nativeReceipt.replace(/\n\n\*\*Reviewed commit:[\s\S]*/, ""),
  "malformed SHA": nativeReceipt.replace("2667f79cd7", "2667f79cd7z"),
  "old receipt version": nativeReceipt.replace(":v1", ":v2"),
  "duplicate receipt": `${nativeReceipt}\n<!-- codex-review-receipt:v1 -->`,
  "duplicate commit": `${nativeReceipt}\n\n**Reviewed commit:** \`2667f79cd7\``,
  "conflicting commit": `${nativeReceipt}\n\n**Reviewed commit:** \`deadbeef00\``,
  "negative verdict": nativeReceipt.replace(
    "Didn't find any major issues",
    "Found a P2 regression",
  ),
  "unfinished verdict": nativeReceipt.replace(
    "Didn't find any major issues",
    "Review is still running",
  ),
  "contradictory content": `${nativeReceipt}\n\n[P2] Found another issue`,
  "contradictory footer": `${nativeReceipt}\n\n<details><summary>About Codex in GitHub</summary>Found a P1 issue</details>`,
  "duplicate verdict": `${nativeReceipt}\nCodex Review: Didn't find any major issues.`,
  "malformed marker": nativeReceipt.replace("<!--", "<!-"),
})) {
  test(`receipt rejects ${name}`, () =>
    assert.equal(isAcceptableCodexSummaryComment(comment(body), headSha), false));
}

test("native text copied by an owner is rejected", () => {
  assert.equal(
    isAcceptableCodexSummaryComment(
      comment(nativeReceipt, { user: { login: "repo-owner" }, author_association: "OWNER" }),
      headSha,
    ),
    false,
  );
});

test("timestamp-only legacy comment cannot approve", () => {
  assert.equal(
    isAcceptableCodexSummaryComment(
      comment("Codex Review: Didn't find any major issues."),
      headSha,
      "2020-01-01T00:00:00Z",
    ),
    false,
  );
});

for (const text of [
  "Review is still running.",
  "There are unresolved findings.",
  "Review failed.",
  "This review is incomplete.",
  "I found several issues.",
  "Everything looks good.",
]) {
  test(`About footer rejects arbitrary additional prose: ${text}`, () => {
    assert.equal(
      isAcceptableCodexSummaryComment(
        comment(`${nativeReceipt}\n\n${details.replace("</details>", `${text}</details>`)}`),
        headSha,
      ),
      false,
    );
  });
}

const { headSha: chefHead, comment: chefComment } = JSON.parse(
  readFileSync(new URL("./fixtures/codex-review-receipt-6206390117.json", import.meta.url), "utf8"),
);
const chefSuffix = " Chef's kiss.";

test("observed Chef's kiss receipt 6206390117 preserves its complete native body", () => {
  assert.equal(classifyCodexSummaryComment(chefComment, chefHead), "pass");
  assert.equal(isAcceptableCodexSummaryComment(chefComment, chefHead), true);
});

test("latest result selects the observed Chef's kiss receipt over an older issue verdict", () => {
  const older = {
    ...chefComment,
    id: 1,
    body: chefComment.body.replace("Didn't find any major issues", "Found a P2 regression"),
    created_at: "2026-10-16T01:00:00Z",
    updated_at: "2026-10-16T01:00:00Z",
  };
  const result = latestCodexResult([], [], [older, chefComment], chefHead);
  assert.equal(result.result, "pass");
  assert.equal(result.comment.id, 6206390117);
});

for (const [name, body] of Object.entries({
  "no suffix": chefComment.body.replace(chefSuffix, ""),
  CRLF: chefComment.body.replaceAll("\n", "\r\n"),
  "verdict case": chefComment.body.replace(
    "Codex Review: Didn't find any major issues. Chef's kiss.",
    "CODEX REVIEW: DIDN'T FIND ANY MAJOR ISSUES. CHEF'S KISS.",
  ),
})) {
  test(`observed Chef's kiss receipt preserves ${name} handling`, () => {
    assert.equal(isAcceptableCodexSummaryComment({ ...chefComment, body }, chefHead), true);
  });
}

for (const [name, body] of Object.entries({
  "modified suffix": chefComment.body.replace(chefSuffix, " Chef kiss."),
  "non-ASCII suffix apostrophe": chefComment.body.replace(chefSuffix, " Chef’s kiss."),
  "missing verdict period": chefComment.body.replace("issues. Chef", "issues Chef"),
  "missing suffix period": chefComment.body.replace(chefSuffix, " Chef's kiss"),
  "repeated suffix period": chefComment.body.replace(chefSuffix, " Chef's kiss.."),
  "repeated suffix": chefComment.body.replace(chefSuffix, chefSuffix.repeat(2)),
  "suffix before verdict": chefComment.body
    .replace(chefSuffix, "")
    .replace("Codex Review:", "Chef's kiss. Codex Review:"),
  "suffix after commit": chefComment.body
    .replace(chefSuffix, "")
    .replace("`80fa2f6b75`", "`80fa2f6b75` Chef's kiss."),
  "rocket then suffix": chefComment.body.replace(chefSuffix, ` :rocket:${chefSuffix}`),
  "suffix then rocket": chefComment.body.replace(chefSuffix, `${chefSuffix} :rocket:`),
  "emoji then suffix": chefComment.body.replace(chefSuffix, ` 🚀${chefSuffix}`),
  "suffix then emoji": chefComment.body.replace(chefSuffix, `${chefSuffix} 🚀`),
  "arbitrary prose": chefComment.body.replace(chefSuffix, `${chefSuffix} Everything looks good.`),
  "negative prose": chefComment.body.replace(
    chefSuffix,
    `${chefSuffix} There are unresolved findings.`,
  ),
  "incomplete prose": chefComment.body.replace(
    chefSuffix,
    `${chefSuffix} Review is still running.`,
  ),
  "priority prose": chefComment.body.replace(chefSuffix, `${chefSuffix} [P2] Blocking regression.`),
  "unprefixed suffix": chefComment.body.replace("<!-- codex-review-receipt:v1 -->\n\n", ""),
  "wrong receipt version": chefComment.body.replace(":v1", ":v2"),
  "malformed marker": chefComment.body.replace(
    "<!-- codex-review-receipt:",
    "<!- codex-review-receipt:",
  ),
  "duplicate receipt marker": chefComment.body.replace(
    "\n\nCodex Review:",
    "\n\n<!-- codex-review-receipt:v1 -->\n\nCodex Review:",
  ),
  "mixed summary marker": `${chefComment.body}\n<!-- codex-pull-request-review-summary -->`,
  "wrong SHA": chefComment.body.replace("80fa2f6b75", "deadbeef00"),
  "missing SHA": chefComment.body.replace("**Reviewed commit:** `80fa2f6b75`", ""),
})) {
  test(`observed Chef's kiss receipt rejects ${name}`, () => {
    assert.equal(isAcceptableCodexSummaryComment({ ...chefComment, body }, chefHead), false);
  });
}

test("observed Chef's kiss receipt copied by an owner remains untrusted", () => {
  assert.equal(
    isAcceptableCodexSummaryComment(
      { ...chefComment, user: { login: "repo-owner" }, author_association: "OWNER" },
      chefHead,
    ),
    false,
  );
});
