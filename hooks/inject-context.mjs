#!/usr/bin/env node
// UserPromptSubmit hook. Injects lightweight, always-current git/PR context so the
// reviewer doesn't have to re-derive it each turn. Best-effort and fail-open:
// any error just means no extra context — it never blocks the prompt.

import { execFileSync } from "node:child_process";
import { readInput, addContext, allow } from "./lib.mjs";

function run(cmd, args, timeout = 4000) {
  try {
    return execFileSync(cmd, args, {
      encoding: "utf8",
      timeout,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

await readInput(); // drain stdin

const parts = [];

const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch) {
  parts.push(`branch: ${branch}`);

  const dirty = run("git", ["status", "--porcelain"]);
  if (dirty) parts.push(`uncommitted changes: ${dirty.split("\n").length} file(s)`);

  // Best-effort PR context for the current branch (skips silently without gh/auth/network).
  const pr = run("gh", ["pr", "view", "--json", "number,state,title,isDraft"], 4000);
  if (pr) {
    try {
      const p = JSON.parse(pr);
      if (p && p.number) {
        parts.push(`PR #${p.number} (${p.state}${p.isDraft ? ", draft" : ""}): ${p.title}`);
      }
    } catch {
      /* ignore */
    }
  }
}

if (parts.length) {
  addContext("UserPromptSubmit", `[Claude Review Support] Repo context — ${parts.join(" · ")}`);
}

allow();
