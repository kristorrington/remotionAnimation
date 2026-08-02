#!/usr/bin/env node
// One-time: get a YouTube refresh token. RUN THIS ON YOUR OWN MACHINE (it opens
// a browser + a localhost callback). Needs YT_CLIENT_ID + YT_CLIENT_SECRET in .env
// from a Google Cloud OAuth "Desktop app" client (YouTube Data API v3 enabled).
// It prints YT_REFRESH_TOKEN — paste that into .env. Nothing is committed.
import http from "node:http";
import { exec } from "node:child_process";
import { loadEnv } from "./lib/env.mjs";

const env = loadEnv(process.cwd());
for (const k of ["YT_CLIENT_ID", "YT_CLIENT_SECRET"]) {
  if (!env[k]) { console.error(`missing ${k} in .env`); process.exit(1); }
}

const PORT = 4599;
const REDIRECT = `http://localhost:${PORT}`;
// upload = insert videos; force-ssl = edit descriptions + post comments + search
// your own uploads (needed to link the long-form into each short after upload).
const SCOPE = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl";
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: env.YT_CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  const code = url.searchParams.get("code");
  if (!code) { res.end("no code"); return; }
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.YT_CLIENT_ID,
      client_secret: env.YT_CLIENT_SECRET,
      redirect_uri: REDIRECT,
      grant_type: "authorization_code",
    }),
  });
  const j = await r.json();
  res.end("Done — you can close this tab and return to the terminal.");
  server.close();
  if (!j.refresh_token) {
    console.error(`\nNo refresh_token returned: ${JSON.stringify(j)}\n(if you've consented before, revoke access at myaccount.google.com/permissions and retry)`);
    process.exit(1);
  }
  console.log(`\nAdd this line to your .env:\n\nYT_REFRESH_TOKEN=${j.refresh_token}\n`);
});

server.listen(PORT, () => {
  console.log(`Opening browser for Google consent…\nIf it doesn't open, paste this URL:\n${authUrl}\n`);
  const platform = process.platform;
  const opener = platform === "win32" ? `start "" "${authUrl}"` : platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener);
});
