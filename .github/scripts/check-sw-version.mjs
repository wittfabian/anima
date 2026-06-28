#!/usr/bin/env node
// SW version-bump guard.
//
// The service worker is cache-first and pre-caches the app shell (the CORE
// list). The only way returning visitors receive changed shell files is a
// bump of `VERSION` in service-worker.js. Forgetting that ships an update
// that nobody actually sees (stale cache). This check fails a PR when a
// cached CORE file changed but VERSION did not.
//
// Usage: node check-sw-version.mjs [baseRef]
//   baseRef defaults to $SW_GUARD_BASE, then "origin/main".
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SW_FILE = "service-worker.js";
const baseRef = process.argv[2] || process.env.SW_GUARD_BASE || "origin/main";

// No shell — args are passed directly to git, so refs can't inject commands.
const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const fail = (msg) => {
  console.error(`✗ SW version guard: ${msg}`);
  process.exit(1);
};

/** Extract the VERSION string literal from a service-worker.js source. */
function versionOf(source) {
  const m = source.match(/const\s+VERSION\s*=\s*["']([^"']+)["']/);
  return m ? m[1] : null;
}

/** Parse the CORE = [ ... ] array into normalised repo-relative paths. */
function corePaths(source) {
  const block = source.match(/const\s+CORE\s*=\s*\[([\s\S]*?)\]/);
  if (!block) return [];
  return [...block[1].matchAll(/["']([^"']+)["']/g)]
    .map((m) => m[1])
    .map((p) => (p === "./" || p === "." ? "index.html" : p.replace(/^\.\//, "")));
}

let mergeBase;
try {
  mergeBase = git("merge-base", baseRef, "HEAD");
} catch {
  fail(`could not resolve merge-base with "${baseRef}". Fetch the base branch (fetch-depth: 0).`);
}

const changed = git("diff", "--name-only", mergeBase, "HEAD")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const headSource = readFileSync(SW_FILE, "utf8");
const core = new Set(corePaths(headSource));
const touchedCore = changed.filter((f) => core.has(f));

if (touchedCore.length === 0) {
  console.log("✓ SW version guard: no cached shell files changed — no bump required.");
  process.exit(0);
}

let baseSource = "";
try {
  baseSource = git("show", `${mergeBase}:${SW_FILE}`);
} catch {
  // service-worker.js did not exist at the base — treat as a fresh bump.
  console.log("✓ SW version guard: service worker is new in this branch.");
  process.exit(0);
}

const before = versionOf(baseSource);
const after = versionOf(headSource);

if (after === null) fail(`could not find "const VERSION = ..." in ${SW_FILE}.`);

if (before === after) {
  fail(
    `cached shell file(s) changed but VERSION is still "${after}".\n` +
      `  Changed CORE files:\n` +
      touchedCore.map((f) => `    - ${f}`).join("\n") +
      `\n  Bump VERSION in ${SW_FILE} (e.g. "${after}" → next) so returning visitors get the update.`
  );
}

console.log(`✓ SW version guard: VERSION bumped "${before}" → "${after}" for ${touchedCore.length} changed shell file(s).`);
