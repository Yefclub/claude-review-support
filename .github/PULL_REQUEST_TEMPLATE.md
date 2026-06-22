<!-- Thanks for contributing to Claude Review Support! -->

## What & why

<!-- What does this change do, and why? Link any related issue: Closes #__ -->

## Checklist

- [ ] Conventional commit title (`feat:`, `fix:`, `docs:`, `chore:`, ...).
- [ ] Commits are **signed**.
- [ ] Machine-facing files (`CLAUDE.md`, `skills/`, `agents/`, `hooks/`) are in **English**; `README`/`docs/` in PT-BR.
- [ ] Preserves the design principles: **read-only by default, never auto-merge, human gate on writes**.
- [ ] New agents include the **anti prompt-injection** clause and `model: opus` with read-only tools.
- [ ] New/changed hooks are Node (`.mjs`), cross-platform, and fail-closed for security.
- [ ] No secrets, emails, or company identifiers added.
- [ ] Docs/CHANGELOG updated if behavior changed.
- [ ] `claude --plugin-dir .` loads cleanly; relevant skills tested.
