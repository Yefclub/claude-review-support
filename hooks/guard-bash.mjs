#!/usr/bin/env node
// PreToolUse(Bash) guard. Blocks destructive / exfiltration-prone shell commands.
// Claude Review Support is a read-only review tool — it should never need these.
// Extend RULES for your environment. Disable by removing this hook from hooks.json.

import { readInput, deny, allow } from "./lib.mjs";

const RULES = [
  // Recursive force delete: rm -rf, rm -fr, rm -Rfv, rm -r -f, rm --recursive --force
  [/\brm\s+-[a-zA-Z]*r[a-zA-Z]*f|\brm\s+-[a-zA-Z]*f[a-zA-Z]*r/i, "recursive force delete (rm -rf)"],
  [/\brm\s+-r\w*\s+-f|\brm\s+-f\w*\s+-r/i, "recursive force delete (rm -r -f)"],
  [/\brm\b[^|;&\n]*--recursive[^|;&\n]*--force|\brm\b[^|;&\n]*--force[^|;&\n]*--recursive/i, "recursive force delete (rm --recursive --force)"],

  // Git destructive
  [/\bgit\s+push\b[^|;&\n]*--force(?!-with-lease)/i, "force push (git push --force)"],
  [/\bgit\s+push\b[^|;&\n]*\s-f(\s|$)/i, "force push (git push -f)"],
  [/--no-verify\b/i, "bypassing hooks (--no-verify)"],
  [/\bgit\s+reset\b[^|;&\n]*--hard/i, "hard reset discards work (git reset --hard)"],
  [/\bgit\s+clean\b[^|;&\n]*-[a-zA-Z]*f/i, "force clean deletes untracked files (git clean -f)"],

  // Database / migrations
  [/\bdrop\s+(database|table|schema)\b/i, "destructive SQL (DROP)"],
  [/\bmigrate\s+reset\b/i, "destructive migration reset"],
  [/\btruncate\s+table\b/i, "destructive SQL (TRUNCATE TABLE)"],

  // Permissions
  [/\bchmod\s+(-[a-zA-Z]*\s+)*0?777\b/i, "world-writable permissions (chmod 777)"],

  // Pipe remote content straight into a shell (RCE / supply-chain)
  [/\b(curl|wget|fetch)\b[^|\n]*\|\s*(sudo\s+)?(sh|bash|zsh|ksh|python3?|node|perl|ruby)\b/i, "piping remote content into a shell"],

  // Disk / device destruction
  [/\bmkfs\b/i, "filesystem format (mkfs)"],
  [/\bdd\b[^|;&\n]*\bof=\/dev\/(sd|nvme|disk|hd|mmcblk)/i, "raw write to a block device (dd of=/dev/...)"],
  [/>\s*\/dev\/(sd|nvme|disk|hd|mmcblk)/i, "redirect to a block device"],

  // Fork bomb
  [/:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/, "fork bomb"],
];

const input = await readInput();
const command = input?.tool_input?.command ?? "";

if (typeof command === "string" && command.length) {
  for (const [pattern, reason] of RULES) {
    if (pattern.test(command)) {
      deny(
        "PreToolUse",
        `Blocked by Claude Review Support guard-bash: ${reason}. This is a read-only review toolkit; if you truly need this, ask the user to run it manually.`
      );
    }
  }
}

allow();
