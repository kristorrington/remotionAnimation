// Link the long-form video into every already-scheduled YouTube short:
// updates each short's DESCRIPTION with "▶ Full video: <url>" and posts a
// comment with the link. Needs the youtube.force-ssl scope (re-auth first).
//   node scripts/social/link-longform.mjs [--go] ["<video url or id>"]
// With no url/id, finds the long-form on your channel by title (LONGFORM_TITLE).
import { loadEnv } from "./lib/env.mjs";
import { loadQueue, saveQueue } from "./lib/store.mjs";

const LONGFORM_TITLE = "DeepSeek V4 Flash Is Out, OpenAI Cuts Prices 80% and GPT-6 May Have Leaked";
const ROOT = process.cwd();
const args = process.argv.slice(2);
const go = args.includes("--go");
const urlArg = args.find((a) => !a.startsWith("--"));

const env = loadEnv(ROOT);
for (const k of ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"]) {
  if (!env[k]) { console.error(`missing ${k} in .env`); process.exit(1); }
}

async function accessToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.YT_CLIENT_ID, client_secret: env.YT_CLIENT_SECRET, refresh_token: env.YT_REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`token refresh failed: ${JSON.stringify(j)}`);
  return j.access_token;
}
const idFrom = (s) => { const m = String(s).match(/(?:v=|youtu\.be\/|shorts\/)?([A-Za-z0-9_-]{11})(?:[?&]|$)/); return m ? m[1] : null; };

async function findLongform(token) {
  if (urlArg) { const id = idFrom(urlArg); if (id) return id; }
  const u = new URL("https://www.googleapis.com/youtube/v3/search");
  u.search = new URLSearchParams({ part: "snippet", forMine: "true", type: "video", q: LONGFORM_TITLE, maxResults: "5" }).toString();
  const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
  const j = await r.json();
  if (!j.items?.length) throw new Error(`no video found by title (search): ${JSON.stringify(j).slice(0, 300)}`);
  const exact = j.items.find((it) => it.snippet.title.trim() === LONGFORM_TITLE.trim());
  return (exact || j.items[0]).id.videoId;
}

const main = async () => {
  const token = await accessToken();
  const lfId = await findLongform(token);
  const url = `https://youtu.be/${lfId}`;
  const linkLine = `▶ Full video: ${url}`;
  console.log(`${go ? "LIVE" : "DRY RUN"} — long-form: ${url}\n`);

  const queue = loadQueue(ROOT);
  const shorts = queue.entries.filter((e) => e.platforms?.youtube?.remoteId && e.platforms.youtube.remoteId !== "(dry-run)");
  if (!shorts.length) { console.log("no scheduled YouTube shorts in the queue"); return; }

  for (const e of shorts) {
    const vid = e.platforms.youtube.remoteId;
    // fetch current snippet + status (update replaces snippet, so preserve fields;
    // status tells us whether the video is PUBLIC yet — you can't comment on a
    // private/scheduled video, only edit its description).
    const gr = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${vid}`, { headers: { Authorization: `Bearer ${token}` } });
    const gj = await gr.json();
    const snip = gj.items?.[0]?.snippet;
    const isPublic = gj.items?.[0]?.status?.privacyStatus === "public";
    if (!snip) { console.log(`  ${e.id}: SKIP — could not read snippet (${JSON.stringify(gj).slice(0, 160)})`); continue; }
    const desc = /▶ Full[^\n]*/.test(snip.description || "") ? snip.description.replace(/▶ Full[^\n]*/, linkLine) : `${linkLine}\n\n${snip.description || ""}`;
    const commentText = `▶ Watch the full breakdown → ${url}`;
    if (!go) { console.log(`  ${e.id} (${vid}): would set description link${isPublic ? " + post comment" : " (scheduled — comment deferred until it's public)"}`); continue; }
    // 1) update description — works on scheduled/private videos (owner edit)
    const up = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet", {
      method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id: vid, snippet: { title: snip.title, categoryId: snip.categoryId, description: desc, tags: snip.tags, defaultLanguage: snip.defaultLanguage || "en" } }),
    });
    if (!up.ok) { console.log(`  ${e.id}: description update FAILED ${up.status}: ${(await up.text()).slice(0, 200)}`); continue; }
    e.platforms.youtube.caption = desc;
    e.platforms.youtube.commentPending = !isPublic; // post the comment on a later run, once public
    // 2) comment — ONLY if the video is already public (can't comment on private/scheduled)
    let note = "";
    if (isPublic) {
      const cm = await fetch("https://www.googleapis.com/youtube/v3/commentThreads?part=snippet", {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ snippet: { videoId: vid, topLevelComment: { snippet: { textOriginal: commentText } } } }),
      });
      if (cm.ok) { note = " + comment posted"; e.platforms.youtube.commentPending = false; }
      else note = ` (comment failed ${cm.status})`;
    } else {
      note = " (comment deferred — re-run this after it publishes)";
    }
    saveQueue(queue, ROOT);
    console.log(`  ${e.id} (${vid}): description linked${note}`);
  }
  console.log(`\ndone. NOTE: the clickable end-screen "Related video" is Studio-only — add it there if you want the on-player element.`);
};
main().catch((e) => { console.error("link-longform failed:", e?.message ?? e); process.exit(1); });
