#!/usr/bin/env node
// PreToolUse(Read) guard. Blocks reads of secret-bearing files so a review never
// pulls live credentials into context (and can't be tricked into exfiltrating them).
// Example/sample/template variants are allowed. Extend or disable as needed.

import { readInput, deny, allow } from "./lib.mjs";

const SENSITIVE = [
  // .env and friends, but NOT .env.example / .env.sample / .env.template / .env.dist
  /(^|[\\/])\.env(\.[\w-]+)?$/i,
  // Private keys
  /(^|[\\/])id_(rsa|dsa|ecdsa|ed25519)$/i,
  /\.(pem|key|pfx|p12|keystore|jks)$/i,
  // Credential stores
  /(^|[\\/])\.npmrc$/i,
  /(^|[\\/])\.netrc$/i,
  /(^|[\\/])\.pypirc$/i,
  /(^|[\\/])\.ssh[\\/]/i,
  /(^|[\\/])\.aws[\\/]credentials$/i,
  /(^|[\\/])\.docker[\\/]config\.json$/i,
  /(^|[\\/])(secrets?|credentials?)\.(ya?ml|json|toml|ini|txt)$/i,
];

const ALLOW = /\.(example|sample|template|dist|tpl)$/i;

const input = await readInput();
const filePath = input?.tool_input?.file_path ?? "";

if (typeof filePath === "string" && filePath.length && !ALLOW.test(filePath)) {
  for (const pattern of SENSITIVE) {
    if (pattern.test(filePath)) {
      deny(
        "PreToolUse",
        `Blocked by Claude Review Support guard-sensitive-read: "${filePath}" looks like a secret-bearing file. A review must not load real credentials. Read a redacted/example version, or ask the user.`
      );
    }
  }
}

allow();
