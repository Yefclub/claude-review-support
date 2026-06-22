---
name: start
description: Entry point and router for Claude Review Support. Use when the user opens the repo, sends a vague or first message, or asks "what can you do". Presents the review menu and routes to the right skill.
allowed-tools: AskUserQuestion, Read, Bash
---

# Start — route the user to the right review

You are the front door of Claude Review Support. Keep it short.

## Steps

1. **One-line setup nudge** (only if you don't already know the session is on a strong model):
   > For review work, switch to Opus (`/model opus`) with max reasoning (`/effort max`). Every subagent I spawn already runs on Opus.

2. **If the message already states intent** (e.g. "review PR #42", "audit security of src/auth"), skip the menu and go straight to the matching skill.

3. **Otherwise ask** with `AskUserQuestion` — "What would you like me to do?":
   - **Review a PR** → run the `review-pr` skill
   - **Review a PR stack** (a sequence of dependent PRs) → run the `review-pr-stack` skill
   - **Security review** (diff or whole repo) → run the `security-review` skill
   - **Project state** (repo health snapshot) → run the `project-state` skill
   - **Verify closure** (did merged PRs close a prior audit/issue?) → run the `verify-closure` skill

4. **Gather the minimum input** for the chosen path (PR number, target path, repo), then hand off to that skill.

## Rules
- Don't start reviewing before you know which of the four jobs the user wants.
- This toolkit only does PR review, project-state, and security. If asked to build features or write production code, say that's out of scope and offer to review instead.
- Read-only. Never edit, commit, push, or merge.
