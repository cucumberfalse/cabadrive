export const trustedAssociations = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);

export function isTrustedAssociation(value) {
  return trustedAssociations.has(String(value || "").toUpperCase());
}

export function extractClaudeOutcome(body) {
  const match = String(body || "").match(/^AI_REVIEW_OUTCOME:\s*(pass|advisory|block)\s*$/im);
  return match?.[1]?.toLowerCase() || null;
}

export function extractMarkerSha(body) {
  const match = String(body || "").match(/^AI_REVIEW_SHA:\s*([A-Fa-f0-9]{7,40})\s*$/im);
  return match?.[1]?.toLowerCase() || null;
}

export function normalizeLogin(login) {
  return String(login || "").toLowerCase();
}

const defaultTrustedReviewLogins = {
  codex: ["chatgpt-codex-connector[bot]", "chatgpt-codex-connector"],
  claude: ["claude[bot]"],
  gemini: ["gemini-code-assist[bot]"],
};

export function trustedReviewLoginsForAgent(agent, config = {}) {
  return new Set(
    [
      ...(defaultTrustedReviewLogins[agent] || []),
      ...(config.trustedReviewLogins || []),
      ...(config.trustedReviewLoginsByAgent?.[agent] || []),
    ].map(normalizeLogin),
  );
}

export function isTrustedReviewLogin(login, agent, config = {}) {
  return trustedReviewLoginsForAgent(agent, config).has(normalizeLogin(login));
}

function extractShaLikeMarkers(body) {
  return [
    ...String(body || "").matchAll(/(?:^|[^A-Za-z0-9])([A-Fa-f0-9]{7,40})(?![A-Za-z0-9])/g),
  ].map((match) => match[1].toLowerCase());
}

export function containsBlockingSeverity(body, agent) {
  const text = String(body || "");
  if (agent === "codex") {
    return /\bP[0-2]\b/i.test(text);
  }
  if (agent === "gemini") {
    return /\b(critical|high)\b/i.test(text);
  }
  return false;
}

export function extractCodexPriority(body) {
  const match = String(body || "").match(/\bP([0-3])\b/i);
  return match ? Number(match[1]) : null;
}

export function codexCommentMarkers(body) {
  return extractShaLikeMarkers(body);
}

export function isCodexWakeupComment(body) {
  return /^(?:<!-- codex-review-receipt:|Codex Review:|<!-- codex-pull-request-review-summary|<!-- codex-review-state:)/i.test(
    String(body || "").trim(),
  );
}

function hasCodexSummaryContradiction(body) {
  if (
    /\bP[0-3]\b|review (?:is )?(?:still )?(?:pending|running|in progress|incomplete|failed)/i.test(
      body,
    ) ||
    /\bfound\s+(?:(?:an?(?:\s+additional)?|another|one|some|several|multiple|0*[1-9][0-9]*)(?:\s+remaining)?\s+(?:issues?|findings?)|remaining\s+(?:issues?|findings?)|issues|findings)\b/i.test(
      body,
    )
  )
    return true;
  // Only complete enumerated neutral units exempt their own unresolved wording.
  // Keep the original body intact so a separate claim can never be hidden.
  const neutralUnits = [
    ...body.matchAll(
      /(?:^|[.!?;\r\n])\s*no\s+unresolved\s+(?:issues?|findings?)(?:\s+remains?)?[ \t]*(?=$|[.!?;\r\n])/gi,
    ),
  ];
  return [...body.matchAll(/\bunresolved\s+(?:issues?|findings?)\b/gi)].some(
    (claim) =>
      !neutralUnits.some(
        (unit) =>
          claim.index >= unit.index && claim.index + claim[0].length <= unit.index + unit[0].length,
      ),
  );
}

// Only the whole observed terminal summary advertisement is non-review text.
// Schema/marker checks still inspect the original body before this scan.
function codexSummaryReviewText(body) {
  const details = body.indexOf("<details>");
  if (details === -1) return body;
  const nativeAbout = `<details> <summary>ℹ️ About Codex in GitHub</summary> <br/>
[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review" or "@codex security review".
Codex reacts with 👀 while any review is running, comments if it has suggestions, and reacts with 👍 once all reviews finish with no findings.
</details>`;
  const normalizeAbout = (value) =>
    value
      .replace(/\s+/g, " ")
      .trim()
      .replace(
        /^<details> <summary>ℹ️ About Codex in GitHub<\/summary>/,
        "<details> <summary>About Codex in GitHub</summary>",
      );
  return normalizeAbout(body.slice(details)) === normalizeAbout(nativeAbout)
    ? body.slice(0, details)
    : body;
}

export function classifyCodexStructuredSummary(comment, headSha, config = {}) {
  if (!isTrustedReviewLogin(comment?.user?.login, "codex", config)) return { result: null };
  const body = String(comment.body || "").trim();
  if (!/codex-pull-request-review-summary|codex-review-state:/i.test(body)) return { result: null };
  const invalid = { result: "fail" };
  if (/Codex Review:|codex-review-receipt:/i.test(body)) return invalid;
  if (
    [...body.matchAll(/codex-pull-request-review-summary/gi)].length !== 1 ||
    [...body.matchAll(/codex-review-state:/gi)].length !== 1
  )
    return invalid;
  const match = body.match(
    /^<!-- codex-pull-request-review-summary -->\s*<!-- codex-review-state:v1 (\{[^\n]+\}) -->/,
  );
  if (!match) return invalid;
  // Native keys are plain ASCII. Reject escaped keys before JSON decoding can
  // collapse duplicate aliases (for example \u0068as_any_findings).
  if ([...match[1].matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)].some((entry) => entry[1].includes("\\")))
    return invalid;
  let state;
  try {
    state = JSON.parse(match[1]);
  } catch {
    return invalid;
  }
  const sameKeys = (object, keys) =>
    object &&
    typeof object === "object" &&
    !Array.isArray(object) &&
    Object.keys(object).sort().join() === keys.sort().join();
  if (!sameKeys(state, ["code_review", "security_review"])) return invalid;
  for (const section of Object.values(state)) {
    if (!sameKeys(section, ["commit_sha", "has_any_findings", "has_unresolved_findings", "status"]))
      return invalid;
    if (section.commit_sha !== null && !/^[a-f0-9]{40}$/.test(section.commit_sha || ""))
      return invalid;
    if (
      ![null, true, false].includes(section.has_any_findings) ||
      ![null, true, false].includes(section.has_unresolved_findings) ||
      (section.status !== null && (typeof section.status !== "string" || !section.status.trim()))
    )
      return invalid;
    if (
      section.status === "completed" &&
      (typeof section.has_any_findings !== "boolean" ||
        typeof section.has_unresolved_findings !== "boolean" ||
        section.commit_sha === null)
    )
      return invalid;
    if (section.has_unresolved_findings === true && section.has_any_findings !== true)
      return invalid;
    if (section.commit_sha === null && Object.values(section).some((value) => value !== null))
      return invalid;
  }
  for (const key of [
    "code_review",
    "security_review",
    "commit_sha",
    "has_any_findings",
    "has_unresolved_findings",
    "status",
  ]) {
    const expected = key.endsWith("_review") ? 1 : 2;
    if ([...match[1].matchAll(new RegExp(`"${key}"\\s*:`, "g"))].length !== expected)
      return invalid;
  }
  const applicable = Object.values(state).filter((section) => section.commit_sha === headSha);
  if (!applicable.length) return { result: null };
  if (applicable.some((section) => section.has_unresolved_findings === true))
    return { result: "fail", unresolved: true };
  if (hasCodexSummaryContradiction(codexSummaryReviewText(body))) return invalid;
  return {
    result: applicable.some(
      (section) =>
        section.status !== "completed" ||
        section.has_any_findings !== false ||
        section.has_unresolved_findings !== false,
    )
      ? "fail"
      : null,
  };
}

export function classifyCodexSummaryComment(comment, headSha, config = {}) {
  if (!isTrustedReviewLogin(comment?.user?.login, "codex", config)) return null;
  let body = String(comment?.body || "")
    .replaceAll("\r\n", "\n")
    .trim();
  if (!isCodexWakeupComment(body)) return null;
  // Structured summaries may veto or wake the scheduler, but never approve.
  if (/codex-pull-request-review-summary|codex-review-state:/i.test(body)) {
    return classifyCodexStructuredSummary(comment, headSha, config).result;
  }
  const fullSha = String(headSha || "").toLowerCase();
  if (!/^[a-f0-9]{40}$/.test(fullSha)) return "fail";
  const markers = extractShaLikeMarkers(body);
  if (markers.length && markers.every((marker) => !fullSha.startsWith(marker))) return null;
  if (markers.some((marker) => !fullSha.startsWith(marker))) return "fail";
  const hasReceiptPrefix = /codex-review-receipt:/i.test(body);
  if (hasReceiptPrefix) {
    if (!body.startsWith("<!-- codex-review-receipt:v1 -->\n\n")) return "fail";
    body = body.slice("<!-- codex-review-receipt:v1 -->\n\n".length);
    if (/codex-review-receipt:/i.test(body)) return "fail";
  }
  // Only the native About block is allowed after the verdict/commit pair.
  const details = body.indexOf("<details>");
  if (details !== -1) {
    const footer = body.slice(details);
    const nativeAbout = `<details> <summary>ℹ️ About Codex in GitHub</summary> <br/>
[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you
- Open a pull request for review
- Mark a draft as ready
- Comment "@codex review".
If Codex has suggestions, it will comment; otherwise it will react with 👍.
Codex can also answer questions or update the PR. Try commenting "@codex address that feedback".
</details>`;
    const normalizeAbout = (value) =>
      value
        .replace(/\s+/g, " ")
        .trim()
        .replace(
          /^<details> <summary>(?:ℹ️ )?About Codex in GitHub<\/summary>/,
          "<details> <summary>About Codex in GitHub</summary>",
        );
    if (normalizeAbout(footer) !== normalizeAbout(nativeAbout)) return "fail";
    body = body.slice(0, details).trim();
  }
  const verdict = "Codex Review:\\s*did(?:\\s+not|\\s*n['’]?t)\\s+find\\s+any\\s+major\\s+issues";
  const sha = "([a-fA-F0-9]{7,40})";
  // The observed praise is a v1 receipt alternative, never arbitrary legacy prose.
  const verdictEnding = hasReceiptPrefix
    ? "(?:\\.?(?: :rocket:| 🚀| :tada:| :\\+1:)?|\\. Chef's kiss\\.|\\. More of your lovely PRs please\\.)"
    : "\\.?(?: :rocket:| 🚀)?";
  const patterns = [
    new RegExp(
      "^" + verdict + verdictEnding + "\\s*\\n\\n\\*\\*Reviewed commit:\\*\\* `" + sha + "`$",
      "i",
    ),
    new RegExp(`^${verdict} in head \\(?${sha}\\)?\\.$`, "i"),
    new RegExp(`^${verdict}\\. Reviewed \\[${sha}\\]\\.$`, "i"),
  ];
  const match = patterns.map((pattern) => body.match(pattern)).find(Boolean);
  return match && fullSha.startsWith(match[1].toLowerCase()) && markers.length === 1
    ? "pass"
    : "fail";
}

export function isAcceptableCodexSummaryComment(
  comment,
  headSha,
  _headCommittedAt = null,
  config = {},
) {
  void _headCommittedAt; // Retain the public call signature; timestamps are never evidence.
  return classifyCodexSummaryComment(comment, headSha, config) === "pass";
}

export function latestCodexResult(reviews, reviewComments, comments, headSha, config = {}) {
  // Any unresolved inline finding blocks, including P3 and findings on older heads.
  if (reviewComments.some((comment) => isTrustedReviewLogin(comment.user?.login, "codex", config)))
    return { result: "fail" };
  if (
    comments.some((comment) => classifyCodexStructuredSummary(comment, headSha, config).unresolved)
  )
    return { result: "fail" };
  // An issue receipt cannot clear the latest blocking formal review.
  if (latestCodexNativeReviewResult(reviews, reviewComments, headSha, config) === "fail")
    return { result: "fail" };
  const candidates = [
    ...reviews.map((review) => ({
      result: classifyCodexNativeReview(review, [], headSha, config),
      timestamp: review.submitted_at,
      id: review.id,
      review,
    })),
    ...comments.map((comment) => ({
      result: classifyCodexSummaryComment(comment, headSha, config),
      timestamp: comment.updated_at || comment.created_at,
      id: comment.id,
      comment,
    })),
  ].filter((entry) => entry.result !== null);
  // Conflicting same-second results fail closed regardless of endpoint order.
  candidates.sort(
    (left, right) =>
      (Date.parse(right.timestamp) || 0) - (Date.parse(left.timestamp) || 0) ||
      (left.result === "fail"
        ? -1
        : right.result === "fail"
          ? 1
          : Number(right.id) - Number(left.id)),
  );
  return candidates[0] || { result: null };
}

export function classifyCodexNativeReview(review, reviewComments = [], headSha, config = {}) {
  if (!review) return null;
  if (!/^[a-f0-9]{40}$/i.test(review.commit_id || "") || review.commit_id !== headSha) return null;
  const login = normalizeLogin(review.user?.login);
  if (!isTrustedReviewLogin(login, "codex", config)) return null;
  if (review.state === "DISMISSED") return null;
  const body = review.body || "";
  // The exception requires the entire body to contain only bounded P3 units.
  // Any residual prose keeps the original body under all existing vetoes.
  const advisoryRemainder = body.replace(
    /^[ \t]*\[P3\][ \t]+found (?:an? |[0-9]+ )?(?:issues?|findings?)[.!]?[ \t]*$/gim,
    "",
  );
  const findingBody =
    review.state === "COMMENTED" && advisoryRemainder !== body && !advisoryRemainder.trim()
      ? ""
      : body;
  if (
    containsBlockingSeverity(body, "codex") ||
    /review (?:is )?(?:still )?(?:pending|running|in progress|incomplete|failed)|changes requested|unresolved (?:an? |[0-9]+ )?(?:issues?|findings?)/i.test(
      body,
    ) ||
    /found (?:an? |[0-9]+ )?(?:issues?|findings?)/i.test(findingBody)
  )
    return "fail";

  if (review.state === "APPROVED") return "pass";
  if (review.state === "CHANGES_REQUESTED") return "fail";
  if (review.state !== "COMMENTED") return null;

  const commentsForReview = reviewComments.filter(
    (comment) =>
      comment.pull_request_review_id === review.id &&
      isTrustedReviewLogin(comment.user?.login, "codex", config),
  );
  if (commentsForReview.length === 0) return "pass";

  const priorities = commentsForReview.map((comment) => extractCodexPriority(comment.body));
  if (priorities.some((priority) => priority === null)) return "fail";
  return Math.min(...priorities) <= 2 ? "fail" : "pass";
}

export function latestCodexNativeReviewResult(
  reviews = [],
  reviewComments = [],
  headSha,
  config = {},
) {
  return (
    reviews
      .map((review) => ({
        review,
        result: classifyCodexNativeReview(review, reviewComments, headSha, config),
      }))
      .filter((entry) => entry.result !== null)
      .sort(
        (left, right) =>
          (Date.parse(right.review.submitted_at || "") || 0) -
            (Date.parse(left.review.submitted_at || "") || 0) ||
          (left.result === "fail"
            ? -1
            : right.result === "fail"
              ? 1
              : Number(right.review.id) - Number(left.review.id)),
      )[0]?.result || null
  );
}

export function isAcceptableNativeReview(review, agent, headSha, config = {}) {
  if (!review) return false;
  if (!review.commit_id || review.commit_id !== headSha) return false;
  const login = normalizeLogin(review.user?.login);
  const body = review.body || "";

  if (agent === "codex") {
    return (
      isTrustedReviewLogin(login, agent, config) &&
      review.state === "APPROVED" &&
      !containsBlockingSeverity(body, agent)
    );
  }

  if (agent === "gemini") {
    return isTrustedReviewLogin(login, agent, config) && !containsBlockingSeverity(body, agent);
  }

  return false;
}

export function isAcceptableClaudeComment(comment, headSha, config = {}) {
  const body = comment?.body || "";
  const login = normalizeLogin(comment?.user?.login);
  if (!isTrustedReviewLogin(login, "claude", config)) return false;
  if (extractMarkerSha(body) !== headSha) return false;
  return extractClaudeOutcome(body) === "pass";
}
