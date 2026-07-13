# Plan: Improvement Backlog Audit Memory

## Approach

Use PR #207 as the single documentation slice. Perform a focused validation of
the already authored backlog, not a fresh repository audit. Correct only
specific documentation defects found by the checks, keep feature memory current
in the same PR, then run independent review and ordered final validation.

## Phase 1 — Establish the contract

1. Preserve the Analyst intake, existing `docs/improvements/**`, commits,
   review history, branch, and sibling work.
2. Add Architect-owned `spec.md`, `plan.md`, and `tasks.md` on
   `docs/improvement-specs` for PR #207.
3. Treat the current P1 as valid: incomplete feature memory is a merge blocker,
   not a documentation-style disagreement.

## Phase 2 — Focused documentation validation

1. Verify the 24-file inventory and unique identities: README, overview, three
   priority documents, and `04..22`.
2. Resolve all relative Markdown links and verify README coverage of the 22
   detail documents (three priority plus nineteen numbered).
3. Compare README rows and sequencing/dependency statements to the linked
   detail documents. Record intentional variation; correct contradictions with
   the smallest docs-only edit.
4. Scan the details for the minimum future-intake fields. Semantic equivalents
   are acceptable; do not mechanically rewrite every file to a uniform template.
5. Add or confirm central snapshot language applying the audit date and audited
   revision `bd0ce1dd3e367f07db8528248f9cb00e2b296441` to measurements. Reproduce
   only a focused measurement needed to resolve a concrete doubt.
6. Confirm the base diff touches only `docs/improvements/**` and
   `specs/042-improvement-backlog/**`; remove no sibling work and implement no
   backlog proposal.

## Phase 3 — Verification and review

Implementation Agent records results in the required `tasks.md` sections and
uses these exact commands from the repository root:

```sh
git diff --check
node scripts/check-feature-memory.mjs --worktree

test "$(find docs/improvements -type f -name '*.md' | wc -l | tr -d ' ')" = 24
test "$(find docs/improvements/priority -maxdepth 1 -type f -name '*.md' | wc -l | tr -d ' ')" = 3
for n in $(seq -w 4 22); do test "$(find docs/improvements -maxdepth 1 -type f -name "${n}-*.md" | wc -l | tr -d ' ')" = 1 || exit 1; done

node --input-type=module - <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
const root = 'docs/improvements';
const files = [];
const walk = d => fs.readdirSync(d, {withFileTypes: true}).forEach(e => {
  const p = path.join(d, e.name);
  e.isDirectory() ? walk(p) : e.name.endsWith('.md') && files.push(p);
});
walk(root);
const failures = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0].split('?')[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(target)))) failures.push(`${file} -> ${match[1]}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`resolved local Markdown links in ${files.length} files`);
NODE

node --input-type=module - <<'NODE'
import fs from 'node:fs';
const readme = fs.readFileSync('docs/improvements/README.md', 'utf8');
const expected = [
  'priority/01-usability.md', 'priority/02-document-quality.md',
  'priority/03-image-quality.md',
  ...Array.from({length: 19}, (_, i) => String(i + 4).padStart(2, '0'))
].map(x => x.includes('/') ? x : fs.readdirSync('docs/improvements').find(f => f.startsWith(`${x}-`) && f.endsWith('.md')));
const failures = expected.filter(target => !target || (readme.match(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length !== 1);
if (failures.length) { console.error(`README coverage failure: ${failures.join(', ')}`); process.exit(1); }
console.log(`README uniquely indexes ${expected.length} detail documents`);
NODE

rg -n '2026-07-11|bd0ce1dd3e367f07db8528248f9cb00e2b296441|snapshot|сним' docs/improvements/README.md docs/improvements/00-analysis-overview.md

git diff --name-only bd0ce1dd3e367f07db8528248f9cb00e2b296441...HEAD
test -z "$(git diff --name-only bd0ce1dd3e367f07db8528248f9cb00e2b296441...HEAD | grep -Ev '^(docs/improvements/|specs/042-improvement-backlog/)')"
```

The semantic index/detail and minimum-field review is recorded as a 22-row or
equivalent checklist in `Verification Evidence`; shell success alone cannot
prove semantic agreement.

Review Agent then reviews the current PR head without editing files. The review
must check scope, all acceptance/negative cases, snapshot qualification,
feature-memory completeness, P1 disposition, and the exact verification
evidence. Findings remain open for Implementation Agent follow-up routed by
Orchestrator; Review Agent never fixes them directly.

## Phase 4 — Final validation and merge handoff

1. Orchestrator confirms the complete cycle PR set, current head, green required
   checks, no conflict, resolved/outdated P1 and any new blocking findings, and
   complete Implementation Agent feedback disposition.
2. Architect performs final validation first. It records the pass/timestamp and
   full effective content SHA only after reviewing the complete PR set,
   acceptance evidence, task state, review, and customer intent.
3. Orchestrator invokes Analyst final validation only after the Architect marker
   exists. Analyst validates the same effective content SHA against the intake.
4. If later changes are role-owned validation evidence only, Orchestrator proves
   the current-head delta from the effective content head contains no docs,
   implementation, review-disposition, or other behavioral content. Otherwise
   prior validation is stale and must be repeated in Architect-then-Analyst order.
5. Orchestrator runs the repository finalization helper with the actual final
   current head and feature path; merge is not an Architect action.

## Risk Controls

- Do not turn a proposed tool/version/legal/security recommendation into an
  approved permanent guarantee; mark it for later discovery where appropriate.
- Do not normalize headings at the cost of needless churn.
- Do not resolve the P1 until independent current-head review confirms the full
  memory gap and evidence are closed.
- Do not treat previous green checks as final evidence after any pushed commit.
