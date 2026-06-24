#!/usr/bin/env node
/* ============================================================================
 * Documentation freshness checker.
 *
 * For every page in src/lib/page-meta.ts, compare the stamped `updated` date to
 * the date of the route file's most recent git commit. If git is newer than the
 * stamp, the page was changed without bumping its stamp: an undocumented change.
 *
 * Run: npm run check:docs
 * Exits non-zero if any drift is found, so it can gate CI if desired.
 * ========================================================================== */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metaPath = join(root, "src/lib/page-meta.ts");

/* Path -> route file. "/" is index.tsx; "/x" is src/routes/x.tsx. */
function routeFile(p) {
  return p === "/" ? "src/routes/index.tsx" : `src/routes${p}.tsx`;
}

function gitLastDate(file) {
  try {
    const out = execSync(`git log -1 --format=%as -- "${file}"`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const src = readFileSync(metaPath, "utf8");
const re = /"([^"]+)":\s*\{\s*created:\s*"([\d-]+)",\s*updated:\s*"([\d-]+)"\s*\}/g;

const rows = [];
let drift = 0;
let uncommitted = 0;
let m;
while ((m = re.exec(src)) !== null) {
  const [, path, , updated] = m;
  const file = routeFile(path);
  const git = gitLastDate(file);
  let status;
  if (git === null) {
    status = "new (uncommitted)";
    uncommitted++;
  } else if (git > updated) {
    status = `DRIFT: git ${git} > stamp ${updated}`;
    drift++;
  } else {
    status = "ok";
  }
  rows.push({ path, updated, git: git ?? "-", status });
}

const pad = (s, n) => String(s).padEnd(n);
console.log(pad("PAGE", 26) + pad("STAMP", 12) + pad("GIT", 12) + "STATUS");
for (const r of rows) {
  console.log(pad(r.path, 26) + pad(r.updated, 12) + pad(r.git, 12) + r.status);
}
console.log("");
console.log(
  `${rows.length} pages · ${drift} drift · ${uncommitted} uncommitted · ${rows.length - drift - uncommitted} ok`,
);

if (drift > 0) {
  console.error(
    `\n${drift} page(s) changed after their documented date. Bump "updated" in src/lib/page-meta.ts.`,
  );
  process.exit(1);
}
