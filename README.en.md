# Claude Review Support

> Turns Claude Code into a specialist in **pull-request review**, **project state**, and **security** — powered by a parallel subagent swarm on the strongest model.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/Yefclub/claude-review-support/badge)](https://scorecard.dev/viewer/?uri=github.com/Yefclub/claude-review-support)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-8A2BE2)](https://code.claude.com)

🇬🇧 English (this file) · 🇧🇷 [Português](README.md)

---

Open the repo (or install the plugin), send any message, and Claude understands the purpose, **asks what you
want**, and runs a real review — not a shallow summary.

## What it does

- **PR review** — multi-lens review of one PR, with a binary verdict and optional inline comments.
- **PR stack review** — a sequence of dependent PRs, each reviewed against its own base.
- **Security review** — security audit (diff or whole repo) on the **OWASP 2025** taxonomy, with adversarial false-positive filtering.
- **Project state** — a health snapshot: PRs, CI, issues, stale branches, dependency & security posture.

Under the hood: a **four-stage swarm pipeline** — skip-gate → fan-out by lens (parallel) → adversarial
verification (drops confidence < 8) → synthesis + verdict. See [docs/architecture.md](docs/architecture.md).

## ⚙️ Use the best model and maximum reasoning

High-stakes review depends on deep reasoning. Before running:

- **Model:** `/model opus` (or `best` / Fable 5). Never review on a small model.
- **Reasoning:** `/effort max` (or at least `xhigh`) with extended thinking on (`Alt+T`).

**Every subagent in this toolkit already runs on `opus`.** A cheap model produces confident-but-wrong
findings — and false positives erode trust in the whole review.

## Quickstart

### As a plugin (recommended)
```text
/plugin marketplace add Yefclub/claude-review-support
/plugin install claude-review-support@yefclub
```

### Clone and open
```bash
git clone https://github.com/Yefclub/claude-review-support
cd claude-review-support
claude --plugin-dir .
```

Then just ask:
```text
review PR #128
run a security review of the whole repo
what's the state of the project?
```

Full guide in [docs/usage.md](docs/usage.md).

## Security first

- **Read-only by default.** Reviewers have `Write`/`Edit` disabled. The toolkit never merges/commits/pushes, and **never** auto-merges.
- **Enforcement hooks.** Block destructive shell commands and reads of `.env`/key files — secrets never enter context.
- **Anti prompt-injection.** All reviewed content is treated as **data**, never as instructions. See [docs/prompt-injection.md](docs/prompt-injection.md).
- **AI is a layer, not the whole control.** Skills corroborate with SAST/SCA/secret-scan if installed. Tooling analysis in [docs/security-tooling.md](docs/security-tooling.md).

## Documentation

| Doc | Contents |
| --- | --- |
| [usage.md](docs/usage.md) | Install, flow, examples, posting to GitHub |
| [architecture.md](docs/architecture.md) | The swarm pipeline and design |
| [security-tooling.md](docs/security-tooling.md) | Analysis of OSS security tooling |
| [prompt-injection.md](docs/prompt-injection.md) | The agent threat model |

## Contributing

PRs and issues welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).
To report a vulnerability, use [GitHub Private Vulnerability Reporting](SECURITY.md) — **no email**.

## License

[MIT](LICENSE) © Yef. Independent community project — not affiliated with Anthropic. See [NOTICE](NOTICE).
