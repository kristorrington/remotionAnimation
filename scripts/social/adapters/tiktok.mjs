// TikTok adapter — pushes the video to your TikTok INBOX (drafts). You open the
// app, review, and post (or use TikTok's own web scheduler). True unattended API
// scheduling needs an audited app (video.publish / Direct Post); this uses the
// inbox flow which any app can do.
// Needs (in .env): TIKTOK_ACCESS_TOKEN (from your TikTok OAuth; refresh as needed).
import { readFile, stat } from "node:fs/promises";

// entry: { file, caption }  (caption is shown to you in-app before you post)
export async function dispatch(entry, env, dryRun) {
  const size = (await stat(entry.file)).size;
  if (dryRun) {
    return { status: "drafted", remoteId: "(dry-run)", detail: `would push ${entry.file} (${(size / 1e6).toFixed(1)}MB) to your TikTok drafts` };
  }
  if (!env.TIKTOK_ACCESS_TOKEN) throw new Error("missing TIKTOK_ACCESS_TOKEN in .env");
  // 1) init an inbox upload (single chunk — shorts are < 64MB)
  const init = await fetch("https://open.tiktokapis.com/v2/post/publish/inbox/video/init/", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`, "Content-Type": "application/json; charset=UTF-8" },
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
