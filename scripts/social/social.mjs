#!/usr/bin/env node
// Approval-gated social publisher. YOU tell me to schedule; I run these commands.
// Nothing leaves your machine until `dispatch --go`. Default dispatch is a DRY RUN.
//
//   node scripts/social/social.mjs prepare
//   node scripts/social/social.mjs list
//   node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 2d
//   node scripts/social/social.mjs schedule short-wrong-row --at "2026-08-05T18:00" --platforms youtube,instagram
//   node scripts/social/social.mjs dispatch            # dry run — shows what WOULD post
//   node scripts/social/social.mjs dispatch --go       # actually schedules/posts
//   node scripts/social/social.mjs status
//
import { readdirSync, existsSync, readFileSync, statSync, renameSync, unlinkSync } from "node:fs";
import path from "node:path";
import { loadEnv } from "./lib/env.mjs";
import { loadQueue, saveQueue, findEntry, newEntry, PLATFORMS } from "./lib/store.mjs";
import { dispatch as ytDispatch } from "./adapters/youtube.mjs";
import { dispatch as ttDispatch } from "./adapters/tiktok.mjs";
import { dispatch as igDispatch } from "./adapters/instagram.mjs";

const ROOT = process.cwd();
const ADAPTERS = { youtube: ytDispatch, tiktok: ttDispatch, instagram: igDispatch };
const ALIAS = { yt: "youtube", youtube: "youtube", tt: "tiktok", tiktok: "tiktok", ig: "instagram", insta: "instagram", instagram: "instagram" };

// RULE (Kris, Aug 2026): once a short is SCHEDULED to a platform, PREFIX its
// rendered file with a platform tag so you can see at a glance where it has been
// sent — YT_ → YT_TIK_ → YT_TIK_IG_ (canonical order YouTube, TikTok, Instagram,
// regardless of dispatch order). Rebuilt from the queue on every successful
// dispatch and kept in sync with e.file. Only successful (scheduled/drafted/
// posted) platforms contribute a tag; a failed/pending platform adds nothing.
const PLATFORM_TAG = { youtube: "YT", tiktok: "TIK", instagram: "IG" };
const TAG_ORDER = ["youtube", "tiktok", "instagram"];
const SCHEDULED_STATUSES = new Set(["scheduled", "drafted", "posted", "published"]);

// Queue entries written on Windows carry backslash paths; normalize so the
// same queue works on a Linux runner (GitHub Actions cloud dispatch).
const rel = (p) => String(p).replace(/\\/g, "/");

function applyScheduledPrefix(e) {
  const tags = TAG_ORDER
    .filter((p) => e.platforms[p]?.remoteId && SCHEDULED_STATUSES.has(e.platforms[p].status))
    .map((p) => PLATFORM_TAG[p]);
  if (!tags.length) return;
  const cur = rel(e.file);
  const dir = path.posix.dirname(cur);
  const base = path.posix.basename(cur).replace(/^(YT_|TIK_|IG_)+/, "");
  const nextRel = dir === "." ? `${tags.join("_")}_${base}` : `${dir}/${tags.join("_")}_${base}`;
  if (nextRel === cur) { e.file = cur; return; }
  const from = path.join(ROOT, cur);
  const to = path.join(ROOT, nextRel);
  if (existsSync(from)) {
    renameSync(from, to);
    e.file = nextRel;
    console.log(`      renamed → ${nextRel}`);
  }
}

// ---------- arg parsing ----------
function parseArgs(argv) {
  const flags = {};
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) flags[key] = true;
      else { flags[key] = next; i++; }
    } else pos.push(a);
  }
  return { flags, pos };
}

function parseDuration(s) {
  const m = String(s).match(/^(\d+(?:\.\d+)?)([dhm])$/);
  if (!m) throw new Error(`bad duration "${s}" (use e.g. 2d, 12h, 30m)`);
  const n = Number(m[1]);
  return n * ({ d: 86400000, h: 3600000, m: 60000 })[m[2]];
}

function toISO(input) {
  const d = new Date(input);
  if (isNaN(d.getTime())) throw new Error(`bad date "${input}" (use ISO, e.g. 2026-08-02T09:00 or with -04:00)`);
  return d.toISOString();
}

function resolvePlatforms(flags) {
  if (!flags.platforms || flags.platforms === true) return [...PLATFORMS];
  return String(flags.platforms).split(",").map((p) => {
    const norm = ALIAS[p.trim().toLowerCase()];
    if (!norm) throw new Error(`unknown platform "${p}"`);
    return norm;
  });
}

// ---------- PUBLISH.md caption extraction ----------
function kebab(compId) {
  return compId.replace(/^Short-/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function captionsFromPublishMd() {
  const file = path.join(ROOT, "PUBLISH.md");
  if (!existsSync(file)) return {};
  const md = readFileSync(file, "utf8");
  const out = {};
  const re = /###[^\n]*`(Short-[A-Za-z0-9]+)`[^\n]*\n\*\*Title:\*\*\s*(.+)\n\*\*Description:\*\*\n((?:>.*\n?)+)/g;
  let m;
  while ((m = re.exec(md))) {
    const id = "short-" + kebab(m[1]);
    const title = m[2].trim();
    const desc = m[3].split("\n").map((l) => l.replace(/^>\s?/, "").trim()).filter(Boolean).join(" ");
    out[id] = { title, caption: `${title}\n\n${desc}` };
  }
  return out;
}

// ---------- commands ----------
function cmdPrepare() {
  const outDir = path.join(ROOT, "out");
  if (!existsSync(outDir)) { console.error("no out/ directory — render the shorts first"); process.exit(1); }
  const files = readdirSync(outDir).filter((f) => /^short-.*\.mp4$/.test(f)).sort();
  if (!files.length) { console.error("no out/short-*.mp4 files found"); process.exit(1); }
  const caps = captionsFromPublishMd();
  const queue = loadQueue(ROOT);
  let added = 0, refreshed = 0;
  for (const f of files) {
    const id = f.replace(/\.mp4$/, "");
    const rel = `out/${f}`;
    const cap = caps[id]?.caption || "";
    const existing = findEntry(queue, id);
    if (existing) {
      existing.file = rel;
      if (caps[id]?.title) existing.title = caps[id].title;
      refreshed++;
    } else {
      const entry = newEntry(id, rel, cap);
      if (caps[id]?.title) entry.title = caps[id].title;
      queue.entries.push(entry);
      added++;
    }
  }
  saveQueue(queue, ROOT);
  console.log(`prepared social-queue.json — ${added} new, ${refreshed} refreshed, ${queue.entries.length} total`);
  for (const f of files) {
    const id = f.replace(/\.mp4$/, "");
    console.log(`  • ${id}${caps[id] ? "" : "   (no caption in PUBLISH.md — set with --caption)"}`);
  }
  console.log(`\nnext: schedule them, e.g.\n  node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 2d`);
}

function fmt(p) {
  const t = p.publishAt
    ? new Date(p.publishAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) + " local"
    : "—";
  const tag = p.enabled ? p.status : "off";
  return `${tag.padEnd(10)} ${t}`;
}

function cmdList() {
  const queue = loadQueue(ROOT);
  if (!queue.entries.length) { console.log("queue empty — run `prepare` first"); return; }
  for (const e of queue.entries) {
    console.log(`\n${e.id}   (${e.file})`);
    for (const p of PLATFORMS) {
      const pl = e.platforms[p];
      console.log(`  ${p.padEnd(10)} ${fmt(pl)}${pl.remoteId ? "  " + pl.remoteId : ""}${pl.error ? "  ERR: " + pl.error : ""}`);
    }
  }
}

function selectEntries(queue, flags, pos) {
  if (flags.all) return queue.entries;
  const ids = pos.length ? pos : [];
  if (!ids.length) throw new Error("name one or more shorts, or pass --all");
  return ids.map((id) => {
    const e = findEntry(queue, id);
    if (!e) throw new Error(`no queue entry "${id}" (run prepare / check list)`);
    return e;
  });
}

function cmdSchedule(flags, pos) {
  const queue = loadQueue(ROOT);
  const entries = selectEntries(queue, flags, pos);
  const platforms = resolvePlatforms(flags);
  const pStagger = flags["platform-stagger"] ? parseDuration(flags["platform-stagger"]) : 0;

  let baseTimes = null; // per-entry base time in ms
  if (flags.at) {
    const iso = toISO(flags.at);
    baseTimes = entries.map(() => new Date(iso).getTime());
  } else if (flags.start) {
    const start = new Date(toISO(flags.start)).getTime();
    const every = flags.every ? parseDuration(flags.every) : 0;
    baseTimes = entries.map((_, i) => start + i * every);
  }

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    for (let j = 0; j < platforms.length; j++) {
      const p = platforms[j];
      const pl = e.platforms[p];
      pl.enabled = true;
      pl.status = "approved";
      pl.error = null;
      if (flags.caption && flags.caption !== true) pl.caption = String(flags.caption);
      if (baseTimes) pl.publishAt = new Date(baseTimes[i] + j * pStagger).toISOString();
      if ((p === "youtube" || p === "instagram") && !pl.publishAt) {
        throw new Error(`${e.id}/${p} needs a time — pass --at or --start/--every`);
      }
    }
  }
  saveQueue(queue, ROOT);
  console.log(`approved ${entries.length} short(s) × ${platforms.join(", ")}`);
  for (const e of entries) {
    console.log(`\n${e.id}`);
    for (const p of platforms) console.log(`  ${p.padEnd(10)} ${fmt(e.platforms[p])}`);
  }
  console.log(`\nreview with \`list\`, then \`dispatch\` (dry run) and \`dispatch --go\``);
}

function cmdUnschedule(flags, pos) {
  const queue = loadQueue(ROOT);
  const entries = selectEntries(queue, flags, pos);
  const platforms = resolvePlatforms(flags);
  for (const e of entries) for (const p of platforms) {
    e.platforms[p].status = "pending";
  }
  saveQueue(queue, ROOT);
  console.log(`reverted ${entries.length} short(s) × ${platforms.join(", ")} to pending`);
}

async function cmdDispatch(flags) {
  const env = loadEnv(ROOT);
  const queue = loadQueue(ROOT);
  const dryRun = !flags.go;
  const only = flags.platform ? [ALIAS[String(flags.platform).toLowerCase()]] : PLATFORMS;
  const onlyId = flags.id && flags.id !== true ? String(flags.id) : null;
  const now = Date.now();

  console.log(dryRun ? "DRY RUN — nothing will be posted (add --go to execute)\n" : "LIVE — executing approved posts\n");
  let acted = 0;
  for (const e of queue.entries) {
    if (onlyId && e.id !== onlyId) continue;
    for (const p of only) {
      const pl = e.platforms[p];
      if (!pl.enabled || pl.status !== "approved") continue;
      if (!existsSync(path.join(ROOT, rel(e.file)))) { console.log(`  ${e.id}/${p}: SKIP — file missing (${e.file})`); continue; }
      // Instagram has no native scheduling: only fire when due.
      if (p === "instagram" && pl.publishAt && new Date(pl.publishAt).getTime() > now && !flags.force && !dryRun) {
        console.log(`  ${e.id}/${p}: waiting until ${pl.publishAt} (IG fires when due; run scheduler or dispatch at that time)`);
        continue;
      }
      const entry = { file: path.join(ROOT, rel(e.file)), caption: pl.caption, title: e.title, publishAt: pl.publishAt, tags: e.tags, categoryId: e.categoryId };
      try {
        const res = await ADAPTERS[p](entry, env, dryRun);
        acted++;
        console.log(`  ${e.id}/${p}: ${res.status} — ${res.detail}`);
        if (!dryRun) {
          pl.status = res.status;
          pl.remoteId = res.remoteId;
          pl.error = null;
          applyScheduledPrefix(e); // prefix the file: YT_ → YT_TIK_ → YT_TIK_IG_
          saveQueue(queue, ROOT);
        }
      } catch (err) {
        console.log(`  ${e.id}/${p}: FAILED — ${err.message}`);
        if (!dryRun) { pl.status = "failed"; pl.error = err.message; saveQueue(queue, ROOT); }
      }
    }
  }
  if (!acted) console.log("  (nothing approved to dispatch — schedule some first)");
  pruneDoneMasters(queue, dryRun);
}

// STORAGE HYGIENE (Kris, Aug 2026): a rendered master is only needed until its
// short has finished dispatching to every ENABLED platform. Once all of them are
// in a terminal-success state (SCHEDULED_STATUSES), the file is dead weight in
// the repo — delete it so the tree self-limits to in-flight shorts instead of
// growing ~120MB per batch forever. The dispatch workflow's `git add -A out/shorts`
// stages the deletion and commits it. A `failed`/`approved` platform keeps the
// file (it may still be retried). Never touches the queue entry itself.
function pruneDoneMasters(queue, dryRun) {
  const isDone = (e) => {
    const enabled = Object.values(e.platforms).filter((p) => p.enabled);
    return enabled.length > 0 && enabled.every((p) => SCHEDULED_STATUSES.has(p.status));
  };
  // files still referenced by a not-yet-finished entry must be kept
  const needed = new Set(queue.entries.filter((e) => !isDone(e)).map((e) => rel(e.file)));
  let n = 0, freed = 0;
  for (const e of queue.entries) {
    if (!isDone(e)) continue;
    const r = rel(e.file);
    if (needed.has(r)) continue;
    const abs = path.join(ROOT, r);
    if (!existsSync(abs)) continue;
    const mb = statSync(abs).size / 1048576;
    if (dryRun) { console.log(`  prune (dry): ${r} (${mb.toFixed(1)}MB) — fully published`); n++; freed += mb; continue; }
    unlinkSync(abs);
    console.log(`  pruned published master: ${r} (${mb.toFixed(1)}MB)`);
    n++; freed += mb;
  }
  if (n) console.log(`${dryRun ? "would prune" : "pruned"} ${n} fully-published master(s), ${freed.toFixed(1)}MB`);
}

function cmdStatus() {
  const queue = loadQueue(ROOT);
  const counts = {};
  for (const e of queue.entries) for (const p of PLATFORMS) {
    const s = e.platforms[p].enabled ? e.platforms[p].status : "off";
    counts[s] = (counts[s] || 0) + 1;
  }
  console.log(`queue: ${queue.entries.length} short(s)`);
  console.log(Object.entries(counts).map(([k, v]) => `  ${k}: ${v}`).join("\n") || "  (empty)");
}

function help() {
  console.log(`social publisher — approval-gated

  prepare                      seed social-queue.json from out/short-*.mp4 + PUBLISH.md
  list                         show every short and its per-platform state
  status                       one-line counts
  schedule <ids…|--all> [opts] approve + set times (this is you telling me to schedule)
      --platforms yt,tt,ig     which platforms (default: all)
      --at "2026-08-05T18:00"  same time for every selected short
      --start "..." --every 2d stagger multiple shorts from a start time (BATCH)
      --platform-stagger 30m   offset platforms within a short so they don't collide
      --caption "..."          override caption for the selected platforms
  unschedule <ids…|--all>      revert to pending (before dispatch)
  dispatch [--go]              DRY RUN by default; --go actually posts/schedules
      --platform yt            limit to one platform
      --id short-wrong-row     limit to one short
      --force                  fire IG even if its time hasn't arrived

  Times are ISO. YouTube schedules natively (publishAt). TikTok goes to drafts.
  Instagram publishes when due (needs a public URL via SOCIAL_UPLOAD_CMD).`);
}

const { flags, pos } = parseArgs(process.argv.slice(3));
const cmd = process.argv[2];
try {
  if (cmd === "prepare") cmdPrepare();
  else if (cmd === "list") cmdList();
  else if (cmd === "status") cmdStatus();
  else if (cmd === "schedule") cmdSchedule(flags, pos);
  else if (cmd === "unschedule") cmdUnschedule(flags, pos);
  else if (cmd === "dispatch") await cmdDispatch(flags);
  else help();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
