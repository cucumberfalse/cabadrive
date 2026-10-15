#!/usr/bin/env node
import { readFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { assertCurrentPull, createReviewApi } from "./ai-review-api.mjs";

export async function resolvePrContext(api, event, explicitPrNumber, eventName) {
  const number = explicitPrNumber || event.pull_request?.number || event.issue?.number;
  if (!number) throw new Error("Could not resolve pull request number.");
  const expected = eventName === "pull_request" ? event.pull_request?.head?.sha : null;
  if (
    eventName === "pull_request" &&
    (!/^[a-f0-9]{40}$/i.test(expected || "") || Number(number) !== event.pull_request?.number)
  )
    throw new Error("Missing or conflicting pull-request event identity.");
  const pull = expected
    ? await assertCurrentPull(api, number, expected)
    : await api.request(`${api.root}/pulls/${number}`);
  await assertCurrentPull(api, number, expected || pull.head.sha);
  return {
    pr_number: String(pull.number),
    head_sha: expected || pull.head.sha,
    base_ref: pull.base.ref,
    head_ref: pull.head.ref,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const env = process.env;
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPOSITORY)
      throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required.");
    const event = env.GITHUB_EVENT_PATH
      ? JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf8"))
      : {};
    const output = await resolvePrContext(
      createReviewApi(env.GITHUB_TOKEN, env.GITHUB_REPOSITORY),
      event,
      env.AI_REVIEW_PR_NUMBER,
      env.GITHUB_EVENT_NAME,
    );
    if (env.GITHUB_OUTPUT)
      appendFileSync(
        env.GITHUB_OUTPUT,
        Object.entries(output)
          .map(([key, value]) => `${key}=${value}`)
          .join("\n") + "\n",
      );
    else console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
