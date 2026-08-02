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

# 2. schedule — BATCH the whole set. DEFAULT cadence is one per day (see
#    "Posting cadence — THE RULE" below); 2/day max, 4–6h apart, never >3/day.
node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 1d

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

## Posting cadence — THE RULE (Kris, Aug 2026 — researched)

When scheduling a set of shorts, DEFAULT to the per-platform cadence below
unless Kris says otherwise. Two constants across every platform: **quality
beats quantity** (a weak post sends negative algorithm signals that drag the
whole account), and **consistency beats volume** (a steady, predictable rhythm
with no skipped weeks).

| Platform | Default | Max/day | Min spacing (same day) | Notes |
|---|---|---|---|---|
| **YouTube Shorts** | **1 / day** | 3 (only if quality holds) | 4–6 h | daily ≈ 40% faster growth than weekly; each short needs its own evaluation window |
| **TikTok** | **1–2 / day** | ~4 (diminishing past 4–5) | 3–4 h | 2–3/day is the growth sweet spot; new/small accounts can push 1–2/day, established do better with fewer, stronger posts |
| **Instagram Reels** | **~1 / day (4–5 / week)** | 1 Reel/day | — (don't post 2 Reels the same day) | 2–4 Reels/week is the conservative sweet spot; Reels are the discovery engine (60%+ views from non-followers); never skip a week ("no-post penalty") |

- **Never dump a whole batch in one day** on any platform. A 5-short set →
  **1/day for 5 days** is the safe default everywhere.
- **Never post two of the same platform back-to-back** — same-day posts must be
  spaced (YT/TikTok 3–6 h) so each gets its own algorithmic test window; on
  Instagram, keep Reels to one per day.
- Pick slots at the audience's high-traffic times (late-afternoon/evening skews
  best); keep the *gap* between posts consistent so the cadence is predictable.

Canonical batch command — a **daily** drip (works for all three):

```bash
node scripts/social/social.mjs schedule --all --start "2026-08-02T09:00" --every 1d
```

For a TikTok/YouTube 2/day push, run two schedules 3–6 h apart (or `--every 5h`
and stop each evening). Keep Instagram at 1 Reel/day. Sources: [YT — FluxNote](https://fluxnote.io/guides/how-many-youtube-shorts-per-day) · [TikTok — SociallyIn](https://sociallyin.com/resources/how-often-should-you-post-on-tiktok/) / [JoinBrands](https://joinbrands.com/blog/how-often-to-post-on-tiktok/) · [IG — Hopper HQ](https://www.hopperhq.com/blog/instagram-posting-frequency-2026/) / [Buffer](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/) · cross-platform [HeyOrca](https://www.heyorca.com/blog/social-media-posting-frequency-by-platform-2026).

## What each platform actually does

| Platform | On `dispatch --go` |
|---|---|
| **YouTube** | uploads as **private** with your `publishAt` → YouTube publishes it itself at that time, PC on or off. Real scheduling. |
| **TikTok** | uploads to your **drafts/inbox** → you open the app and post (true API scheduling needs an audited app). |
| **Instagram** | publishes **when the time is due** (IG has no scheduling field). Fires only if dispatch runs at/after the time — run it then, or use a cron. `--force` fires early. |

## Scheduled-file prefix (RULE, Kris Aug 2026)

The moment a short is successfully scheduled to a platform on `dispatch --go`,
its rendered file is **renamed with a platform tag** so you can see at a glance
where it has gone, straight from the filename:

```
Short-DeepSeekCost.mp4      (not scheduled yet)
YT_Short-DeepSeekCost.mp4       → scheduled to YouTube
YT_TIK_Short-DeepSeekCost.mp4   → + TikTok
YT_TIK_IG_Short-DeepSeekCost.mp4 → + Instagram
```

Tags are always in canonical order **YT_ → TIK_ → IG_** regardless of the order
you dispatch, rebuilt from the queue each time, and `social-queue.json` is kept
in sync (its `file` path updates too). Only a *successful* platform
(scheduled / drafted / posted) adds its tag; a failed or pending one adds
nothing.

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
