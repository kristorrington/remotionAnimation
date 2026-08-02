#!/usr/bin/env node
// One-time: get a TikTok refresh token. RUN THIS ON YOUR OWN MACHINE (opens a
// browser + a localhost callback). Needs TIKTOK_CLIENT_KEY + TIKTOK_CLIENT_SECRET
// in .env from a TikTok for Developers app (Content Posting API, scope
// video.upload), with `http://localhost:4600` registered as a redirect URI.
// It prints TIKTOK_REFRESH_TOKEN — paste that into .env. Nothing is committed.
// The adapter refreshes the short-lived access token from it automatically.
import http from "node:http";
import { exec } from "node:child_process";
import crypto from "node:crypto";
import { loadEnv } from "./lib/env.mjs";

const env = loadEnv(process.cwd());
for (const k of ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"]) {
  if (!env[k]) { console.error(`missing ${k} in .env`); process.exit(1); }
}

const PORT = 4600;
const REDIRECT = `http://localhost:${PORT}/`;
const SCOPE = "video.upload"; // inbox/draft flow (video.publish needs TikTok audit)
// PKCE (TikTok recommends/requires it for some app types; harmless otherwise)
const b64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const codeVerifier = b64url(crypto.randomBytes(48));
const codeChallenge = b64url(crypto.createHash("sha256").update(codeVerifier).digest());

const authUrl =
  "https://www.tiktok.com/v2/auth/authorize/?" +
  new URLSearchParams({
    client_key: env.TIKTOK_CLIENT_KEY,
    scope: SCOPE,
    response_type: "code",
    redirect_uri: REDIRECT,
    state: "tt",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  const code = url.searchParams.get("code");
  if (!code) {
    const err = url.searchParams.get("error");
    res.end(err ? `TikTok returned an error: ${err} — ${url.searchParams.get("error_description") || ""}` : "no code");
    if (err) { console.error(`\nTikTok error: ${err} — ${url.searchParams.get("error_description") || ""}`); server.close(); process.exit(1); }
    return;
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
      code_verifier: codeVerifier,
    }),
  });
  const j = await r.json();
  res.end("Done — you can close this tab and return to the terminal.");
  server.close();
  if (!j.refresh_token) {
    console.error(`\nNo refresh_token returned: ${JSON.stringify(j)}`);
    process.exit(1);
  }
  console.log(`\nAdd this line to your .env:\n\nTIKTOK_REFRESH_TOKEN=${j.refresh_token}\n`);
  console.log(`(access token expires in ~${Math.round((j.expires_in || 86400) / 3600)}h; the adapter refreshes it automatically. refresh token lasts ~${Math.round((j.refresh_expires_in || 0) / 86400)} days — re-run this if it lapses.)`);
});

server.listen(PORT, () => {
  console.log(`Opening browser for TikTok consent…\nIf it doesn't open, paste this URL:\n${authUrl}\n`);
  const opener = process.platform === "win32" ? `start "" "${authUrl}"` : process.platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener);
});
