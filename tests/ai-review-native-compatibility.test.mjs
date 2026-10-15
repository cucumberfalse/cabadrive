import test from "node:test";
import assert from "node:assert/strict";
import { isAcceptableCodexSummaryComment } from "../scripts/ai-review-helpers.mjs";

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
