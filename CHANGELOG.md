# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `verify-closure` skill — verifies whether merged PRs actually closed a prior audit/issue, with a per-finding verdict (FIXED/PARTIAL/NOT_FIXED/REGRESSED) and a regression hunt over the fix diffs.
- `house-rules-reviewer` agent — reviews a diff against the target repo's own contract (CLAUDE.md/CONTRIBUTING/AGENTS.md/.cursorrules); wired into `review-pr` and `project-state`.
- `review-pr` optional output mode: open a tracking issue with a P0/P1 checklist.

### Changed
- `review-pr-stack` — added a Stage 0 scale/cost guard (group/sample/Workflow above ~20 PRs).
- `finding-verifier` — corroborate findings by running cheap read-only checks (`tsc --noEmit`, the relevant test, `prisma migrate diff`).
- `correctness-reviewer` — added refactor/extraction regression checks.
- `test-quality-reviewer` — flag tests that cement current buggy behavior.
- docs/usage.md — Windows/PowerShell encoding footgun note.

## [0.1.0] — 2026-06-22

Initial release.

### Added
- **Plugin packaging** — installable via marketplace (`yefclub`) or `--plugin-dir .`; usable as a
  clone-and-open repo (`CLAUDE.md` auto-loads).
- **`CLAUDE.md`** — review-specialist persona, boot protocol (menu via `AskUserQuestion`), operating
  principles, and a prominent "use the strongest model + maximum reasoning" recommendation.
- **Skills** — `start` (router), `review-pr`, `review-pr-stack`, `security-review`, `project-state`.
- **Subagent swarm** (`agents/`) — `correctness`, `security`, `performance`, `test-quality`,
  `dependency-supply-chain`, `architecture`, `simplification` reviewers, plus an adversarial
  `finding-verifier`. All run on `opus`, read-only, with an anti prompt-injection clause.
- **Enforcement hooks** (`hooks/`, Node, cross-platform) — `guard-bash` (blocks destructive shell
  commands), `guard-sensitive-read` (blocks `.env`/key reads), `inject-context` (git/PR context),
  `session-start` (setup + menu reminder).
- **Docs** — usage, architecture, security-tooling analysis, and the agent prompt-injection threat model.
- **Repository hardening** — OpenSSF Scorecard, CodeQL, secret scanning, Actions linting, Dependabot,
  SHA-pinned workflows; `SECURITY.md` via GitHub Private Vulnerability Reporting (no email).

[Unreleased]: https://github.com/Yefclub/claude-review-support/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Yefclub/claude-review-support/releases/tag/v0.1.0
