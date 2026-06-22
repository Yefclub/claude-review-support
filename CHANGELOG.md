# Changelog

All notable changes to this project are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
