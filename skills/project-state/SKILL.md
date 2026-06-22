---
name: project-state
description: Produce a health snapshot of a repository — open/blocked PRs, CI status, issue backlog, stale branches, dependency and security posture, and architecture hotspots. Use when the user asks about the state of the project, repo health, what's blocked, or where the risk is.
allowed-tools: Read, Grep, Glob, Bash, Task, AskUserQuestion
---

# Project-state snapshot

A decision-grade picture of where the repo stands and what's risky. Read-only; no changes, no merges, no closing issues.

## Stage 1 — Collect (cheap, mostly `gh` + git)
```bash
gh pr list --state open --json number,title,isDraft,reviewDecision,statusCheckRollup,updatedAt --limit 100
gh pr status
gh issue list --state open --json number,title,labels,updatedAt --limit 100
gh run list --limit 20                                   # recent CI
git for-each-ref --sort=-committerdate refs/remotes --format='%(refname:short) %(committerdate:relative)'
```
Classify PRs: ready-to-merge / awaiting-review / changes-requested / CI-failing / draft / **stale** (no update in N weeks) / conflicting.

## Stage 2 — Risk lenses (parallel where useful, `opus`)
- **Dependency & supply-chain posture:** if available, run `npm audit` / `pip-audit` / `osv-scanner` / `trivy fs` read-only; summarize outdated and vulnerable deps. Or spawn `dependency-supply-chain-reviewer` on the manifests.
- **Security posture:** spot-check for committed secrets (`gitleaks detect` if installed), missing branch protection / unpinned CI actions, absent `SECURITY.md`.
- **Architecture hotspots:** spawn `architecture-reviewer` in repo mode to name the riskiest coupling/drift and tech-debt centers.
- **CI health:** flaky/failing workflows, slowest jobs.

## Stage 3 — Synthesize
```markdown
# Project state — <repo> (<date>)

**Headline:** <one line: healthy / attention needed / at risk>

## Pull requests
- ✅ Ready: #.. · 👀 Awaiting review: #.. · 🔧 Changes requested: #.. · ❌ CI failing: #.. · 🕸 Stale: #..

## CI
- <pass rate, notable failures, flakies>

## Issues
- Open: <n> · by priority/label · oldest untouched: #..

## Dependencies & supply chain
- Outdated: <n> · Known vulns: <n high / m moderate> · Unpinned actions: <n>

## Security posture
- <secrets scan result, branch protection, SECURITY.md, hardening gaps>

## Architecture / tech-debt hotspots
- <top 2–3 areas, with file/module refs>

## Recommended next steps (ranked)
1. <highest-leverage action>
2. ...
```

## Rules
- Cite real numbers and `file:line` / PR / issue references — never vibes.
- Distinguish "blocking risk" from "nice to clean up".
- Read-only. Suggest actions; the user decides and executes.
