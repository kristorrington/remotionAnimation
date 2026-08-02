#!/usr/bin/env node
// One-time: get a TikTok refresh token via the Login Kit DESKTOP flow (opens a
// browser + a localhost callback — like the YouTube helper). TikTok's desktop
// flow allows an http://localhost redirect with a port, so no domain needed.
//
// Needs in .env: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
// In the TikTok app (Login Kit → toggle "Configure for Desktop") register this
// EXACT redirect URI:  http://localhost:4600/callback/
//
// TikTok quirk: the PKCE code_challenge is the SHA256 of the verifier in HEX
// (not base64url). Prints TIKTOK_REFRESH_TOKEN — paste it into .env.
import http from "node:http";
import { exec } from "node:child_process";
import crypto from "node:crypto";
import { loadEnv } from "./lib/env.mjs";

const env = loadEnv(process.cwd());
for (const k of ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"]) {
  if (!env[k]) { console.error(`missing ${k} in .env`); process.exit(1); }
}

const PORT = 4600;
const REDIRECT = env.TIKTOK_REDIRECT_URI || `http://localhost:${PORT}/callback/`;
const SCOPE = "video.upload"; // inbox/draft flow (video.publish needs TikTok audit)

// PKCE — verifier is unreserved chars; TikTok wants the challenge in HEX.
const verifier = crypto.randomBytes(48).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const challenge = crypto.createHash("sha256").update(verifier).digest("hex");

const authUrl =
  "https://www.tiktok.com/v2/auth/authorize/?" +
  new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    scope: SCOPE,
    response_type: "code",
    redirect_uri: REDIRECT,
    state: "tt",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get("code");
  if (!code) {
    const err = url.searchParams.get("error");
    if (!err) { res.end("waiting for TikTok…"); return; }
    res.end(`TikTok error: ${err} — ${url.searchParams.get("error_description") || ""}`);
    console.error(`\nTikTok error: ${err} — ${url.searchParams.get("error_description") || ""}`);
    server.close(); process.exit(1);
  }
  const r = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: env.TIKTOK_CLIENT_KEY,
      client_secret: env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT,
      code_verifier: verifier,
    }),
  });
  const j = await r.json();
  res.end("Done — you can close this tab and return to the terminal.");
  server.close();
  if (!j.refresh_token) { console.error(`\nNo refresh_token returned: ${JSON.stringify(j)}`); process.exit(1); }
  console.log(`\nAdd this line to your .env:\n\nTIKTOK_REFRESH_TOKEN=${j.refresh_token}\n`);
  console.log(`(access token expires ~${Math.round((j.expires_in || 86400) / 3600)}h; the adapter refreshes it. refresh token lasts ~${Math.round((j.refresh_expires_in || 0) / 86400)} days.)`);
});

server.listen(PORT, () => {
  console.log(`Opening browser for TikTok consent…\nIf it doesn't open, paste this URL:\n${authUrl}\n`);
  const opener = process.platform === "win32" ? `start "" "${authUrl}"` : process.platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener);
});
