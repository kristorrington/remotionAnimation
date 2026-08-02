// Prints the TikTok publish status of every dispatched short in the queue
// (used in the app-review demo + general debugging).
//   node scripts/social/tiktok-status.mjs
import { readFileSync } from "node:fs";
import { loadEnv } from "./lib/env.mjs";

const env = loadEnv(process.cwd());
const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_key: env.TIKTOK_CLIENT_KEY, client_secret: env.TIKTOK_CLIENT_SECRET, grant_type: "refresh_token", refresh_token: env.TIKTOK_REFRESH_TOKEN }),
});
const t = await r.json();
if (!t.access_token) { console.error("token refresh failed:", JSON.stringify(t)); process.exit(1); }

const q = JSON.parse(readFileSync("social-queue.json", "utf8"));
for (const e of q.entries) {
  const id = e.platforms.tiktok?.remoteId;
  if (!id || id === "(dry-run)") { console.log(`${e.id.padEnd(24)} (not dispatched)`); continue; }
  const s = await fetch("https://open.tiktokapis.com/v2/post/publish/status/fetch/", {
    method: "POST", headers: { Authorization: `Bearer ${t.access_token}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ publish_id: id }),
  });
  const j = await s.json();
  console.log(`${e.id.padEnd(24)} ${j.data?.status || JSON.stringify(j.error)}`);
}
