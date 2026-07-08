// External-asset fetcher (CLAUDE.md §10, made executable).
// Usage: node scripts/fetch-assets.mjs <wishlist.json>
//
// wishlist.json:
// { "assets": [ {
//     "url": "https://…",                    // page (screenshot) or file (download)
//     "type": "logo|screenshot|chart|doc|reference",
//     "filename": "deepseek-logo.svg",       // clean descriptive name
//     "sourceName": "DeepSeek official site",
//     "usageNote": "Official logo for commentary/reference",
//     "attributionRequired": false            // optional
// } ] }
//
// Downloads/captures into public/assets/external/<type folder>/, NEVER
// overwrites, and appends entries to asset-manifest.json (deduped by filename).
// Licence judgement stays HUMAN: only list official sources in the wishlist.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const wishlistPath = process.argv[2];
if (!wishlistPath) {
  console.error("Usage: node scripts/fetch-assets.mjs <wishlist.json>");
  process.exit(1);
}
const wishlist = JSON.parse(readFileSync(wishlistPath, "utf8"));
const ROOT = "public/assets/external";
const FOLDERS = { logo: "logos", screenshot: "screenshots", chart: "charts", doc: "docs", reference: "references" };
const MANIFEST = join(ROOT, "asset-manifest.json");

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { assets: [] };
const today = new Date().toISOString().slice(0, 10);

const findBrowser = () => {
  const candidates = [
    process.env["CHROME_PATH"],
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  return candidates.find((c) => existsSync(c));
};

const report = { saved: [], skipped: [], failed: [] };

for (const a of wishlist.assets ?? []) {
  const folder = FOLDERS[a.type] ?? "references";
  const dir = join(ROOT, folder);
  mkdirSync(dir, { recursive: true });
  const dest = join(dir, a.filename);
  const localPath = `${ROOT}/${folder}/${a.filename}`.replace(/\\/g, "/");

  if (existsSync(dest)) {
    report.skipped.push(`${a.filename} (already exists — never overwritten)`);
  } else if (a.type === "screenshot") {
    const browser = findBrowser();
    if (!browser) {
      report.failed.push(`${a.filename}: no Chrome/Edge found for screenshots (set CHROME_PATH)`);
      continue;
    }
    const r = spawnSync(browser, ["--headless=new", `--screenshot=${dest}`, "--window-size=1600,1200", "--hide-scrollbars", "--disable-gpu", a.url], { timeout: 60000 });
    if (r.status !== 0 || !existsSync(dest)) {
      report.failed.push(`${a.filename}: screenshot capture failed`);
      continue;
    }
    report.saved.push(localPath);
  } else {
    try {
      const res = await fetch(a.url, { headers: { "user-agent": "Mozilla/5.0 (asset fetch for video source card)" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      report.saved.push(localPath);
    } catch (err) {
      report.failed.push(`${a.filename}: ${err.message}`);
      continue;
    }
  }

  // manifest entry (dedupe by filename)
  if (!manifest.assets.some((m) => m.filename === a.filename)) {
    manifest.assets.push({
      filename: a.filename,
      localPath,
      type: a.type,
      sourceUrl: a.url,
      sourceName: a.sourceName ?? null,
      dateAccessed: today,
      usageNote: a.usageNote ?? null,
      usedIn: [],
      attributionRequired: a.attributionRequired ?? false,
      concerns: a.concerns ?? null,
    });
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Saved:   ${report.saved.length ? report.saved.join(", ") : "—"}`);
console.log(`Skipped: ${report.skipped.length ? report.skipped.join(", ") : "—"}`);
console.log(`Failed:  ${report.failed.length ? report.failed.join(", ") : "—"}`);
console.log(`Manifest updated: ${MANIFEST}. Fill in "usedIn" once assets are placed in scenes.`);
if (report.failed.length) process.exit(1);
