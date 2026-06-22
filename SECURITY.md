# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for security vulnerabilities.**

Report privately through **GitHub Private Vulnerability Reporting**:

1. Go to the repository's **Security** tab → **Report a vulnerability**
   (or: <https://github.com/Yefclub/claude-review-support/security/advisories/new>).
2. Describe the issue, affected component, and reproduction steps.

There is intentionally **no email contact** — GitHub Security Advisories keep the report private,
tracked, and tied to a coordinated fix and disclosure.

### What to expect
- Acknowledgement of your report through the advisory thread.
- A fix or mitigation tracked in the advisory, with credit to you (if you want it) on disclosure.
- Coordinated public disclosure once a fix is available.

## Scope

This project is a **read-only review toolkit** for Claude Code. Most relevant reports concern:

- A hook that fails open when it should block (e.g. a destructive command or secret read slips past
  `hooks/guard-bash.mjs` / `hooks/guard-sensitive-read.mjs`).
- A skill or agent that could be steered into a write/exfiltration action (prompt-injection resistance).
- Supply-chain issues in the repository's own CI/build.

Out of scope: vulnerabilities in *your* codebase that the toolkit reviews (that's the tool working), and
issues in Claude Code itself (report those to Anthropic).

## Using this toolkit safely

- Keep reviews on **trusted** PRs; treat output on untrusted PRs as advisory and verify manually.
- Keep the enforcement hooks enabled.
- See [docs/prompt-injection.md](docs/prompt-injection.md) for the agent threat model.

## Supported versions

This project is pre-1.0. Only the latest released version receives security fixes.
