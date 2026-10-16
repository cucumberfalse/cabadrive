export function createReviewApi(token, repository, fetchImpl = fetch) {
  const root = `/repos/${repository}`;
  async function request(path, options = {}) {
    const response = await fetchImpl(`https://api.github.com${path}`, {
      ...options,
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "content-type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const error = new Error(
        `${response.status} ${response.statusText}: ${await response.text()}`,
      );
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
  async function list(path, key = null) {
    const items = [];
    for (let page = 1; ; page += 1) {
      const payload = await request(
        `${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`,
      );
      const batch = key ? payload[key] : payload;
      if (!Array.isArray(batch)) throw new Error("Invalid paginated API response");
      items.push(...batch);
      if (batch.length < 100) return items;
    }
  }
  async function resolvedCommentIds(number) {
    const [owner, repo] = repository.split("/");
    const ids = new Set();
    let cursor = null;
    do {
      const payload = await request("/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `query($owner: String!, $repo: String!, $number: Int!, $cursor: String) {
            repository(owner: $owner, name: $repo) { pullRequest(number: $number) {
              reviewThreads(first: 100, after: $cursor) {
                pageInfo { hasNextPage endCursor }
                nodes { isResolved comments(first: 1) { nodes { databaseId } } }
              }
            } }
          }`,
          variables: { owner, repo, number: Number(number), cursor },
        }),
      });
      if (payload.errors?.length) throw new Error("Could not read complete review thread state");
      const threads = payload.data?.repository?.pullRequest?.reviewThreads;
      if (!threads) throw new Error("Missing review thread state");
      // The first inline comment is the finding. Replies are not new findings;
      // review REST comments are mapped to their root via in_reply_to_id.
      for (const thread of threads.nodes) {
        if (thread.isResolved)
          for (const comment of thread.comments.nodes) ids.add(comment.databaseId);
      }
      if (threads.pageInfo.hasNextPage && !threads.pageInfo.endCursor)
        throw new Error("Missing thread cursor");
      cursor = threads.pageInfo.hasNextPage ? threads.pageInfo.endCursor : null;
    } while (cursor);
    return ids;
  }
  // Job logs are historical scheduling data. Never forward API credentials to
  // the server-returned download host, or search an incomplete response.
  async function readJobLog(jobId) {
    if (!Number.isSafeInteger(jobId) || jobId <= 0) throw new Error("Invalid job log identity.");
    let response;
    try {
      response = await fetchImpl(`https://api.github.com${root}/actions/jobs/${jobId}/logs`, {
        redirect: "manual",
        signal: AbortSignal.timeout(20000),
        headers: {
          authorization: `Bearer ${token}`,
          accept: "application/vnd.github+json",
          "x-github-api-version": "2022-11-28",
        },
      });
      if (response.status === 302) {
        const target = new URL(response.headers.get("location"));
        if (target.protocol !== "https:" || target.username || target.password || target.hash)
          throw new Error("Invalid redirect.");
        response = await fetchImpl(target.href, {
          redirect: "manual",
          signal: AbortSignal.timeout(20000),
        });
      }
      const limit = 2 * 1024 * 1024;
      const length = response.headers.get("content-length");
      if (
        response.status !== 200 ||
        response.headers.has("content-range") ||
        (length !== null && (!/^\d+$/.test(length) || Number(length) > limit)) ||
        !response.body
      )
        throw new Error("Incomplete log response.");
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > limit) throw new Error("Oversized log.");
          chunks.push(value);
        }
      } catch (error) {
        await reader.cancel().catch(() => {});
        throw error;
      }
      if (length !== null && size !== Number(length)) throw new Error("Truncated log.");
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      // Do not expose signed download URLs, response bodies or credentials.
      throw new Error("Complete bounded job log unavailable.");
    }
  }
  return { root, request, list, resolvedCommentIds, readJobLog };
}

export async function assertCurrentPull(api, number, headSha) {
  const pull = await api.request(`${api.root}/pulls/${number}`);
  if (
    !/^[a-f0-9]{40}$/i.test(headSha || "") ||
    pull.number !== Number(number) ||
    pull.state !== "open" ||
    pull.draft ||
    pull.head?.sha !== headSha ||
    pull.base?.repo?.full_name !== api.root.slice(7)
  ) {
    throw new Error(
      `Pull request ${number} is closed, draft, foreign, or superseded from ${headSha}.`,
    );
  }
  return pull;
}
