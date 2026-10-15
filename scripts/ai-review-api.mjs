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
  return { root, request, list, resolvedCommentIds };
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
