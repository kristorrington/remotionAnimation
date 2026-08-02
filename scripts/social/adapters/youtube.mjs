// YouTube Shorts adapter — uploads a video as PRIVATE with a future publishAt
// so YouTube schedules it natively (publishes itself at the time, PC off or not).
// Needs (in .env): YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN.
// Get the refresh token once via scripts/social/auth-youtube.mjs.
import { readFile } from "node:fs/promises";

async function accessToken(env) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.YT_CLIENT_ID,
      client_secret: env.YT_CLIENT_SECRET,
      refresh_token: env.YT_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`YouTube token refresh failed: ${JSON.stringify(j)}`);
  return j.access_token;
}

// entry: { file, caption, title, publishAt (ISO, future), tags?, categoryId? }
export async function dispatch(entry, env, dryRun) {
  const title = (entry.title || entry.caption || "Untitled").split("\n")[0].slice(0, 100);
  const snippet = {
    title,
    description: entry.caption || "",
    categoryId: entry.categoryId || "28", // 28 = Science & Technology
    defaultLanguage: "en",
    defaultAudioLanguage: "en",
  };
  if (Array.isArray(entry.tags) && entry.tags.length) snippet.tags = entry.tags.slice(0, 40);
  const body = {
    snippet,
    status: { privacyStatus: "private", publishAt: entry.publishAt, selfDeclaredMadeForKids: false },
  };
  if (dryRun) {
    return { status: "scheduled", remoteId: "(dry-run)", detail: `would upload ${entry.file} as PRIVATE, publishAt=${entry.publishAt}, title="${title}", tags=${(entry.tags || []).length}` };
  }
  for (const k of ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"]) {
    if (!env[k]) throw new Error(`missing ${k} in .env`);
  }
  if (!entry.publishAt || new Date(entry.publishAt).getTime() <= Date.now()) {
    throw new Error("YouTube publishAt must be a FUTURE ISO timestamp");
  }
  const token = await accessToken(env);
  const init = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": "video/*",
    },
    body: JSON.stringify(body),
  });
  if (!init.ok) throw new Error(`YouTube init failed ${init.status}: ${await init.text()}`);
  const uploadUrl = init.headers.get("location");
  if (!uploadUrl) throw new Error("YouTube init returned no upload URL");
  const bytes = await readFile(entry.file);
  const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": "video/*" }, body: bytes });
  const res = await put.json();
  if (!res.id) throw new Error(`YouTube upload failed: ${JSON.stringify(res)}`);
  return { status: "scheduled", remoteId: res.id, detail: `scheduled https://youtu.be/${res.id} for ${entry.publishAt}` };
}
