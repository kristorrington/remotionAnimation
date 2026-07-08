// Asset preflight QC (CLAUDE.md §10.5/§10.9) — run before rendering a video.
//   node scripts/check-assets.mjs
// Verifies: every manifest entry has its file + required fields; every file
// under public/assets/external has a manifest entry; every asset referenced
// from src via staticFile("assets/external/…") exists AND is in the manifest.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "public/assets/external";
const MANIFEST = join(ROOT, "asset-manifest.json");
const problems = [];
const warns = [];

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { assets: [] };

// 1) manifest entries → files + required fields
for (const a of manifest.assets ?? []) {
  if (!a.localPath || !existsSync(a.localPath)) problems.push(`manifest: "${a.filename}" → missing file ${a.localPath}`);
  for (const field of ["type", "sourceName", "dateAccessed", "usageNote"]) {
    if (!a[field]) problems.push(`manifest: "${a.filename}" missing "${field}"`);
  }
  if (!a.sourceUrl) warns.push(`manifest: "${a.filename}" has no sourceUrl (record where it came from)`);
  if (!a.usedIn || a.usedIn.length === 0) warns.push(`manifest: "${a.filename}" has empty usedIn (decoration-only? §10.6)`);
}

// 2) files on disk → manifest entries
const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p.replace(/\\/g, "/")];
  });
};
for (const file of walk(ROOT)) {
  if (file.endsWith("asset-manifest.json")) continue;
  if (!(manifest.assets ?? []).some((a) => a.localPath === file)) {
    problems.push(`untracked asset file (no manifest entry): ${file}`);
  }
}

// 3) src references → files + manifest
const srcFiles = walk("src").filter((f) => /\.(tsx?|jsx?)$/.test(f));
const refRe = /staticFile\(\s*["'`](assets\/external\/[^"'`]+)["'`]\s*\)/g;
for (const f of srcFiles) {
  const code = readFileSync(f, "utf8");
  for (const m of code.matchAll(refRe)) {
    const rel = `public/${m[1]}`;
    if (!existsSync(rel)) problems.push(`${f}: references missing asset ${rel}`);
    else if (!(manifest.assets ?? []).some((a) => a.localPath === rel)) problems.push(`${f}: references un-manifested asset ${rel}`);
  }
}

if (warns.length) console.log(`WARN:\n  ${warns.join("\n  ")}`);
if (problems.length) {
  console.error(`FAIL:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`Asset preflight OK — ${(manifest.assets ?? []).length} manifest entr${(manifest.assets ?? []).length === 1 ? "y" : "ies"}, no orphans, all references resolve.`);
