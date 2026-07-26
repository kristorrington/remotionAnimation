# Social publishing plan — approval-gated scheduling to YouTube Shorts, TikTok & Instagram Reels

**Goal:** take the rendered shorts in `out/`, let you **review + approve** each one
(caption, thumbnail time, target platforms, publish time), then have them go out
on a **future schedule** — with nothing published until you press approve.

This is a plan, not built yet. It lays out what's genuinely automatable per
platform, the architecture, exactly what YOU need to set up, and the build order.

---

## 1. The honest per-platform reality (read this first)

The three platforms are NOT equal. "Approve now → auto-publishes later, unattended"
only fully works on YouTube. The others have hard constraints set by the platforms,
not by us:

| Platform | Programmatic upload? | Native future-scheduling via API? | What "approve → publish later" actually means |
|---|---|---|---|
| **YouTube Shorts** | ✅ Data API v3 (`videos.insert`) | ✅ Yes — upload as `private` + `publishAt` timestamp | Full: approve → it's scheduled on YouTube; publishes itself at the time even if your PC is off. |
| **TikTok** | ✅ Content Posting API | ⚠️ Only for **audited** apps | v1 without audit: push to your TikTok **drafts/inbox** on approve → you open the app and post (or use TikTok's own web scheduler). True API scheduling needs TikTok app review (weeks). |
| **Instagram Reels** | ✅ Graph API (`media` → `media_publish`) | ❌ No `publishAt` at all | Approve → we **queue** it; a scheduler process fires the publish at the time. Needs a Business/Creator account + the video at a **public URL**. Publishing only happens if the scheduler is running (your PC on, or a tiny cloud cron). |

**Implication:** the cleanest reliable path is **YouTube = true API scheduling**,
**TikTok = approve-to-drafts**, **Instagram = queue + a scheduler that must be
running at fire time**. If you want IG/TikTok to fire unattended on an exact
future time, the scheduler needs to live in the cloud (see §6, Option B).

---

## 2. The approval-gated flow

```
 render (done)  →  prepare  →  REVIEW & APPROVE  →  dispatch  →  scheduler
 out/*.mp4         builds a      you edit caption/    per-platform    fires the
                   queue with    time/platforms       actions on      time-based
                   draft copy    + flip to APPROVED    approve         posts (IG)
```

1. **Prepare** — a script reads the rendered shorts + `PUBLISH.md` and writes a
   `social-queue.json`: one entry per short × platform, with a suggested caption
   and a proposed publish time, all `status: "pending"`.
2. **Review & approve** — a tiny local dashboard (localhost web page) shows each
   short with a video preview, the per-platform caption (editable), the target
   time (editable), platform on/off toggles, and an **Approve** button. Nothing
   leaves your machine until you approve. (v0 can just be hand-editing the JSON.)
3. **Dispatch** — on approve, per platform:
   - **YouTube:** upload now as `private` with `publishAt` = your time → YouTube
     schedules it. Done.
   - **TikTok:** upload to your **inbox/drafts** now → the entry is marked
     "in your TikTok drafts, finish in-app".
   - **Instagram:** write to the scheduler queue with the fire time.
4. **Scheduler** — a small always-available process wakes at each IG fire time,
   creates the media container from the public video URL, and publishes.

---

## 3. Architecture (what gets built, in the repo)

```
scripts/social/
  prepare.mjs        # out/*.mp4 + PUBLISH.md  ->  social-queue.json (status: pending)
  dashboard.mjs      # localhost review UI: preview, edit caption/time, approve
  dispatch.mjs       # for APPROVED entries: YouTube schedule / TikTok draft / IG enqueue
  scheduler.mjs      # long-running (or cron): fires IG publishes at their time
  adapters/
    youtube.mjs      # OAuth + resumable upload + publishAt
    tiktok.mjs       # OAuth + inbox(draft) upload  (direct-post later if audited)
    instagram.mjs    # Graph API create-container -> publish
  lib/
    hosting.mjs      # expose a short at a public URL for IG (see §5)
    store.mjs        # read/write social-queue.json (the single source of truth)
social-queue.json    # the state: entries, captions, times, statuses (gitignored)
.env                 # all API keys/tokens (gitignored — never committed)
```

**`social-queue.json` entry shape:**
```json
{
  "id": "short-vague-brief",
  "file": "out/short-vague-brief.mp4",
  "platforms": {
    "youtube":   { "enabled": true,  "caption": "…", "publishAt": "2026-08-02T09:00:00-04:00", "status": "pending", "remoteId": null },
    "tiktok":    { "enabled": true,  "caption": "…", "publishAt": null,                          "status": "pending", "remoteId": null },
    "instagram": { "enabled": true,  "caption": "…", "publishAt": "2026-08-02T18:00:00-04:00",  "status": "pending", "remoteId": null }
  }
}
```
`status` moves: `pending → approved → dispatched → scheduled → published` (or `failed`).
The queue is the audit trail; nothing publishes unless its status is `approved`.

---

## 4. Per-platform API detail (so the build is grounded)

**YouTube Data API v3**
- `videos.insert` (resumable upload), `status.privacyStatus = "private"`,
  `status.publishAt = <future ISO-8601>`. Vertical <60s auto-classifies as a Short.
- Auth: OAuth 2.0, one-time consent → refresh token stored in `.env`.
- Quota: an upload ≈ **1600 units**, default **10,000/day** → ~6 uploads/day.
  Fine for our volume; note it exists.

**TikTok Content Posting API**
- v1 (unaudited): `POST /v2/post/publish/inbox/video/init/` → uploads to your
  **inbox as a draft**; you finish + post in the app. Scope `video.upload`.
- Audited later: `POST /v2/post/publish/video/init/` (Direct Post) supports
  scheduling. Scope `video.publish`. Requires TikTok app review.
- Auth: OAuth 2.0 (TikTok for Developers app).

**Instagram Graph API** (Reels)
- Requires: IG **Business/Creator** account ↔ linked **Facebook Page** ↔ a Meta
  app with `instagram_content_publish` (App Review) + a long-lived token.
- Flow: `POST /{ig-user-id}/media` (`media_type=REELS`, `video_url=<public>`,
  `caption`) → `creation_id` → poll `status_code=FINISHED` → `POST
  /{ig-user-id}/media_publish`. Limit ~50 posts/24h.
- No scheduling field → the `scheduler.mjs` cron calls this at the target time.

---

## 5. The Instagram "public URL" problem

IG's API **fetches** the video from a URL you give it — it won't accept a local
file. Options, cheapest first:
- **Cloudflare R2 / AWS S3** bucket with a temporary signed URL (recommended).
- A short-lived tunnel (`cloudflared`) serving `out/` while a publish runs.
- Any static host you control.

`lib/hosting.mjs` uploads the mp4, returns the public URL, and deletes it after
IG confirms `published`.

---

## 6. Where the scheduler runs (the one real decision)

- **Option A — local:** `scheduler.mjs` runs on your PC (a background process or
  Windows Task Scheduler). Zero hosting cost, but IG/TikTok-timed posts only fire
  **if the PC is on** at that moment. YouTube is unaffected (it self-publishes).
- **Option B — tiny cloud cron:** a free/cheap serverless cron (Cloudflare
  Workers Cron, GitHub Actions schedule, or a small VPS) runs `scheduler.mjs`.
  Fires reliably 24/7. Slightly more setup + secrets live in the cloud.

Recommendation: **A for YouTube-first** (YouTube already self-schedules, so a
laptop-only scheduler covers IG/TikTok "good enough"); move to **B** if you want
guaranteed unattended IG posting.

---

## 7. What YOU need to set up (I can't do these from here)

One-time, on your accounts (I'll write step-by-steps for each when we build):
1. **Google Cloud project** → enable YouTube Data API → OAuth consent screen →
   OAuth client → run a one-time consent to get a refresh token.
2. **TikTok for Developers** app → Content Posting API access → OAuth.
3. **Instagram**: convert to a Business/Creator account, link it to a Facebook
   Page, create a **Meta app**, request `instagram_content_publish`, generate a
   long-lived token. (This is the heaviest step + needs Meta App Review.)
4. **Object storage** (R2/S3) for the IG public-URL step.
5. Paste all keys/tokens into `.env` (gitignored). **I never hardcode secrets.**

I handle: all the scripts, the review dashboard, the queue/state, retries,
error handling, and the per-platform request logic.

---

## 8. Build order (phased — each phase is independently useful)

- **Phase 1 — YouTube end-to-end.** `prepare` + minimal review + `youtube.mjs`
  scheduling. This alone gives you real "approve → scheduled on YouTube". Highest
  value, lowest setup. Test by scheduling one short 10 min out to a private slot.
- **Phase 2 — Review dashboard.** The localhost page: preview + edit captions/times
  + approve toggles across all platforms.
- **Phase 3 — TikTok drafts.** `tiktok.mjs` inbox upload on approve.
- **Phase 4 — Instagram.** `hosting.mjs` + `instagram.mjs` + `scheduler.mjs`
  (after your Business account + Meta app are approved).
- **Phase 5 — (optional) cloud scheduler + TikTok audit** for fully unattended,
  scheduled IG/TikTok.

**Safety rails throughout:** dry-run mode (prints what it *would* post), first
real post goes to **private/self**, nothing dispatches without `status:approved`,
and the queue is the reviewable record.

---

## 9. The zero-build alternative

If the setup above (3 app registrations + Meta review + hosting) is more than you
want to own, **Publer** or **Metricool** already do "upload → preview/review →
schedule to YouTube + TikTok + Instagram" today, no code. Trade-off: a monthly
fee and your captions live in their tool instead of `PUBLISH.md`. I'd still
generate the per-platform captions + a posting calendar for you to paste in.

---

## 10. Decisions I need from you before building

1. **Custom in-repo tool** (this plan) **or Publer/Metricool** (no build)?
2. If custom: **scheduler local (A) or cloud (B)?**
3. **Instagram** — do you already have a Business/Creator account linked to a
   Facebook Page? (Determines whether Phase 4 is days or minutes.)
4. **TikTok** — happy with "approve → lands in drafts, you post in-app" for v1,
   or do you want to pursue the app audit for true API scheduling?
5. Default **posting cadence** (e.g. one short every 2–3 days, staggered times
   per platform) so `prepare.mjs` can propose sensible times.
