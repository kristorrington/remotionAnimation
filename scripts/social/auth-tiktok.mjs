#!/usr/bin/env node
// One-time: get a TikTok refresh token. RUN THIS ON YOUR OWN MACHINE.
// TikTok requires an HTTPS redirect URI (no http://localhost, unlike Google), so
// this uses a PASTE-THE-CODE flow: it prints an auth URL that redirects to your
// verified domain, you approve, then paste the redirected URL back here.
//
// Needs in .env:
//   TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET   (TikTok app, Content Posting API)
//   TIKTOK_REDIRECT_URI                        (an HTTPS URL registered on the
//                                               app AND on your verified domain,
//                                               e.g. https://kristorrington.com/)
// Register that exact redirect URI in the app. The page it points to doesn't
// need to do anything — you just copy the ?code=… from the address bar.
// Prints TIKTOK_REFRESH_TOKEN — paste it into .env. Nothing is committed.
import crypto from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadEnv } from "./lib/env.mjs";

const env = loadEnv(process.cwd());
for (const k of ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"]) {
  if (!env[k]) { console.error(`missing ${k} in .env`); process.exit(1); }
}
const REDIRECT = env.TIKTOK_REDIRECT_URI || "https://kristorrington.com/";
const SCOPE = "video.upload"; // inbox/draft flow (video.publish needs TikTok audit)

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

const extractCode = (pasted) => {
  const s = pasted.trim();
  try { const u = new URL(s); return u.searchParams.get("code"); } catch { /* not a URL */ }
  return s.replace(/^code=/, "");
};

const main = async () => {
  console.log(`\n1) Open this URL in your browser and approve (signed in to your TikTok account):\n\n${authUrl}\n`);
  console.log(`2) You'll be redirected to ${REDIRECT}?code=…  — copy the FULL address-bar URL.\n`);
  const rl = createInterface({ input, output });
  const pasted = await rl.question("Paste the redirected URL (or just the code) here:\n> ");
  rl.close();
  const code = extractCode(pasted);
  if (!code) { console.error("couldn't find a code in what you pasted"); process.exit(1); }
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
  if (!j.refresh_token) { console.error(`\nNo refresh_token returned: ${JSON.stringify(j)}`); process.exit(1); }
  console.log(`\nAdd this line to your .env:\n\nTIKTOK_REFRESH_TOKEN=${j.refresh_token}\n`);
  console.log(`(access token expires ~${Math.round((j.expires_in || 86400) / 3600)}h; the adapter refreshes it. refresh token lasts ~${Math.round((j.refresh_expires_in || 0) / 86400)} days.)`);
};
main().catch((e) => { console.error("auth-tiktok failed:", e?.message ?? e); process.exit(1); });
