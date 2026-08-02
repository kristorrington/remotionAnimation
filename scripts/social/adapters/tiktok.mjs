// TikTok adapter — pushes the video to your TikTok INBOX (drafts). You open the
// app, review, and post (or use TikTok's own web scheduler). True unattended API
// scheduling needs an audited app (video.publish / Direct Post); this uses the
// inbox flow which any app can do.
// Auth (in .env): either TIKTOK_ACCESS_TOKEN (quick, expires ~24h), OR
// TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET + TIKTOK_REFRESH_TOKEN (from
// scripts/social/auth-tiktok.mjs) — the adapter then refreshes the access token
// automatically on every run.
import { readFile, stat } from "node:fs/promises";

// Prefer a static access token if present; otherwise mint a fresh one from the
// refresh token so you never re-paste an expired token.
async function accessToken(env) {
  if (env.TIKTOK_ACCESS_TOKEN) return env.TIKTOK_ACCESS_TOKEN;
  for (const k of ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"]) {
    if (!env[k]) throw new Error(`missing ${k} in .env (run scripts/social/auth-tiktok.mjs), or set TIKTOK_ACCESS_TOKEN`);
  }
  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: env.TIKTOK_REFRESH_TOKEN }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`TikTok token refresh failed: ${JSON.stringify(j)}`);
  return j.access_token;
}

// entry: { file, caption, publishAt }  (caption shown in-app before you post —
// or posted directly when TIKTOK_DIRECT_POST=1).
export async function dispatch(entry, env, dryRun) {
  const size = (await stat(entry.file)).size;
  // ── DIRECT POST (audited apps: video.publish scope; set TIKTOK_DIRECT_POST=1
  // after TikTok approves the app review). Posts WITH the caption, no manual
  // step. TikTok has no future-publish field, so social.mjs fires this when the
  // scheduled time is DUE (same pattern as Instagram). While the app is
  // unaudited TikTok forces privacy SELF_ONLY — public after approval.
  if (env.TIKTOK_DIRECT_POST === "1") {
    if (entry.publishAt && new Date(entry.publishAt).getTime() > Date.now() && !dryRun) {
      return { status: "approved", remoteId: null, detail: `waiting until ${entry.publishAt} (direct post fires when due)` };
    }
    if (dryRun) {
      return { status: "posted", remoteId: "(dry-run)", detail: `would DIRECT POST ${entry.file} (${(size / 1e6).toFixed(1)}MB) with caption` };
    }
    const token = await accessToken(env);
    const title = (entry.caption || "").slice(0, 2200);
    const init = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        post_info: { title, privacy_level: env.TIKTOK_PRIVACY || "PUBLIC_TO_EVERYONE", disable_duet: false, disable_comment: false, disable_stitch: false },
        source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 },
      }),
    });
    const j = await init.json();
    if (j?.error?.code && j.error.code !== "ok") throw new Error(`TikTok direct-post init failed: ${JSON.stringify(j.error)}`);
    const uploadUrl = j?.data?.upload_url;
    const publishId = j?.data?.publish_id;
    if (!uploadUrl) throw new Error(`TikTok direct-post init returned no upload_url: ${JSON.stringify(j)}`);
    const bytes = await readFile(entry.file);
    const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${size - 1}/${size}` }, body: bytes });
    if (!put.ok) throw new Error(`TikTok direct-post upload failed ${put.status}: ${await put.text()}`);
    return { status: "posted", remoteId: publishId, detail: "direct-posted to TikTok (caption included)" };
  }

  // ── INBOX flow (unaudited default): lands in your drafts, you post in-app.
  if (dryRun) {
    return { status: "drafted", remoteId: "(dry-run)", detail: `would push ${entry.file} (${(size / 1e6).toFixed(1)}MB) to your TikTok drafts` };
  }
  const token = await accessToken(env);
  // 1) init an inbox upload (single chunk — shorts are < 64MB)
  const init = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: size, total_chunk_count: 1 } }),
  });
  const j = await init.json();
  if (j?.error?.code && j.error.code !== "ok") throw new Error(`TikTok init failed: ${JSON.stringify(j.error)}`);
  const uploadUrl = j?.data?.upload_url;
  const publishId = j?.data?.publish_id;
  if (!uploadUrl) throw new Error(`TikTok init returned no upload_url: ${JSON.stringify(j)}`);
  // 2) PUT the bytes
  const bytes = await readFile(entry.file);
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Range": `bytes 0-${size - 1}/${size}` },
    body: bytes,
  });
  if (!put.ok) throw new Error(`TikTok upload failed ${put.status}: ${await put.text()}`);
  return { status: "drafted", remoteId: publishId, detail: "in your TikTok drafts — open the app to review + post" };
}
