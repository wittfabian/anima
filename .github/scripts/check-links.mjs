#!/usr/bin/env node
// Internal link & asset existence check.
//
// The cabinet is wired together with relative paths and deployed to GitHub
// Pages (case-sensitive Linux FS). A typo'd href, a renamed world folder, or
// a wrong-case filename ships a 404 that local (case-insensitive) browsing
// never reveals. This walks every HTML file and verifies that each internal
// href/src/<meta> image resolves to a real file — with exact case.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, relative, sep, posix } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../../..");
const SKIP_DIRS = new Set([".git", "node_modules", ".github", "fonts"]);
const EXTERNAL = /^(?:[a-z]+:|\/\/|#|data:|blob:|mailto:|tel:)/i;

/** Recursively collect *.html files under ROOT. */
function htmlFiles(dir = ROOT, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) htmlFiles(resolve(dir, entry.name), out);
    } else if (entry.name.endsWith(".html")) {
      out.push(resolve(dir, entry.name));
    }
  }
  return out;
}

/** Pull internal reference targets out of one HTML source. */
function refsIn(rawSource) {
  // Drop <script>/<style> bodies first: they build URLs dynamically
  // (template literals like href="${slug}") which can't be checked statically.
  const source = rawSource
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const refs = [];
  for (const m of source.matchAll(/(?:href|src)\s*=\s*"([^"]*)"|(?:href|src)\s*=\s*'([^']*)'/g)) {
    refs.push(m[1] ?? m[2]);
  }
  // og:image / twitter:image live in <meta ... content="...">.
  for (const m of source.matchAll(/<meta\b[^>]*?(?:property|name)\s*=\s*["'](?:og:image|twitter:image)["'][^>]*?content\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    refs.push(m[1]);
  }
  return refs;
}

/** Does `target` exist under `baseDir` with exactly this casing? */
function existsExact(baseDir, target) {
  const abs = resolve(baseDir, target);
  if (!abs.startsWith(ROOT)) return true; // escaped the repo — not ours to judge
  let cur = ROOT;
  const rel = relative(ROOT, abs);
  if (rel === "") return true;
  for (const segment of rel.split(sep)) {
    let names;
    try {
      names = readdirSync(cur);
    } catch {
      return false;
    }
    if (!names.includes(segment)) return false;
    cur = resolve(cur, segment);
  }
  return true;
}

const failures = [];

for (const file of htmlFiles()) {
  const source = readFileSync(file, "utf8");
  const baseDir = dirname(file);
  const here = relative(ROOT, file).split(sep).join(posix.sep);

  for (const raw of refsIn(source)) {
    const ref = raw.trim();
    if (!ref || EXTERNAL.test(ref)) continue;

    let path = ref.split(/[?#]/)[0];
    if (!path) continue;

    const baseFrom = path.startsWith("/") ? ROOT : baseDir;
    const rel = path.startsWith("/") ? path.slice(1) : path;
    let target = resolve(baseFrom, rel);

    // A directory reference (or trailing slash) resolves to its index.html.
    let isDir = false;
    try {
      isDir = statSync(target).isDirectory();
    } catch {
      /* not a dir or missing — handled below */
    }
    const checkRel = isDir || path.endsWith("/")
      ? relative(baseFrom, resolve(target, "index.html"))
      : relative(baseFrom, target);

    if (!existsExact(baseFrom, checkRel)) {
      failures.push(`${here} → "${ref}" (resolved: ${relative(ROOT, resolve(baseFrom, checkRel)).split(sep).join(posix.sep)})`);
    }
  }
}

if (failures.length) {
  console.error(`✗ Link check: ${failures.length} broken internal reference(s):`);
  for (const f of failures) console.error(`    ${f}`);
  process.exit(1);
}

console.log("✓ Link check: all internal href/src/image references resolve.");
