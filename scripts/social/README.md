# Social publisher

Approval-gated scheduling of the rendered shorts in `out/` to **YouTube Shorts**,
**TikTok**, and **Instagram Reels**. You tell me to schedule; I run the commands.
**Nothing is posted until `dispatch --go`** — `dispatch` alone is a dry run.

## The flow

```
prepare  →  schedule  →  dispatch (dry run)  →  dispatch --go
seed the    approve +     see exactly what        actually schedule
queue       set times     would post              / post
```

```bash
# 1. seed social-queue.json from out/short-*.mp4 + captions in PUBLISH.md
node scripts/social/social.mjs prepare

# 2. schedule — BATCH the whole set, staggered one every 2 days from a start time
node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 2d

#    or one short, specific time, chosen platforms
node scripts/social/social.mjs schedule short-wrong-row --at "2026-08-05T18:00" --platforms youtube,instagram

#    keep platforms from colliding at the same second
node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 2d --platform-stagger 30m

# 3. review
node scripts/social/social.mjs list

# 4. dry run — prints every action, changes nothing
node scripts/social/social.mjs dispatch

# 5. go live
node scripts/social/social.mjs dispatch --go
```

## Scheduling many at once

`schedule` takes several ids or `--all`, and with `--start` + `--every` it
auto-staggers them: short 1 at the start time, short 2 `+every`, short 3
`+2×every`, and so on. `--every` accepts `2d` / `12h` / `30m`. Use `--at` when
every selected short should share one time. `--platform-stagger` offsets the
platforms within each short (e.g. YouTube 09:00, TikTok 09:30, IG 10:00).

Times without a timezone offset are read as **this machine's local time** and
shown back as `… local`; stored as UTC for the APIs. Pin a zone explicitly with
`"2026-08-02T09:00-04:00"` if you want a fixed offset regardless of the machine.

## What each platform actually does

| Platform | On `dispatch --go` |
|---|---|
| **YouTube** | uploads as **private** with your `publishAt` → YouTube publishes it itself at that time, PC on or off. Real scheduling. |
| **TikTok** | uploads to your **drafts/inbox** → you open the app and post (true API scheduling needs an audited app). |
| **Instagram** | publishes **when the time is due** (IG has no scheduling field). Fires only if dispatch runs at/after the time — run it then, or use a cron. `--force` fires early. |

## One-time setup (on your machine — I never touch your secrets)

1. `cp .env.example .env`
2. **YouTube:** Google Cloud project → enable *YouTube Data API v3* → OAuth
   *Desktop app* client → put `YT_CLIENT_ID`/`YT_CLIENT_SECRET` in `.env` →
   `node scripts/social/auth-youtube.mjs` → paste the printed `YT_REFRESH_TOKEN`.
3. **TikTok:** TikTok for Developers app (Content Posting API) → `TIKTOK_ACCESS_TOKEN`.
4. **Instagram:** Business/Creator account + linked FB Page + Meta app with
   `instagram_content_publish` → `IG_USER_ID`, `IG_ACCESS_TOKEN`, and a
   `SOCIAL_UPLOAD_CMD` that puts the file at a public URL (see `.env.example`).

Skip any platform by leaving its vars blank — `dispatch` reports the missing key
and moves on.

## Files

- `social.mjs` — the CLI (prepare / list / schedule / unschedule / dispatch / status)
- `adapters/{youtube,tiktok,instagram}.mjs` — per-platform request logic
- `lib/{env,store,hosting}.mjs` — .env loader, queue read/write, IG public-URL step
- `auth-youtube.mjs` — one-time YouTube refresh-token helper
- `social-queue.json` — local state (gitignored): captions, times, statuses, remote IDs
