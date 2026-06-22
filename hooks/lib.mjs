// Shared helpers for Claude Review Support hooks.
// Pure Node, no dependencies — works the same on Windows and Unix.

/** Read all of stdin and parse it as JSON. Returns {} on empty/invalid input. */
export async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** Emit a PreToolUse "deny" decision and exit without blocking the session. */
export function deny(eventName, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: eventName,
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

/** Emit additionalContext for SessionStart / UserPromptSubmit and exit. */
export function addContext(eventName, text) {
  if (text && text.trim()) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: eventName, additionalContext: text },
      })
    );
  }
  process.exit(0);
}

/** Allow (no-op) and exit cleanly. */
export function allow() {
  process.exit(0);
}
