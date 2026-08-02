# TikTok app review — submission pack

Goal: get **Direct Post** (`video.publish`) approved so posting is fully
automated (captions included, no in-app step). Submit at: your app page →
**App review** section.

---

## 1. Scopes to request

Before submitting, on the app page make sure the products/scopes are exactly:
- **Login Kit** (with the Desktop redirect `http://localhost:4600/`)
- **Content Posting API** with **`video.upload`** AND **`video.publish`**
  (add `video.publish` — Direct Post — if not already ticked)

Remove anything else — unused scopes delay review.

## 2. Explanation text (paste into the required field)

> This is a personal publishing tool for my own TikTok account (Kris
> Torrington — AI news commentary videos). It is a command-line script that
> runs on my own computer; there are no other users.
>
> Products & scopes:
> • Login Kit (desktop): I authorize my own TikTok account once via the OAuth
>   desktop flow (localhost redirect, PKCE). The token is stored locally on my
>   machine only.
> • Content Posting API — video.upload: used today to upload my finished
>   videos to my own account's inbox as drafts, which I review and post in the
>   TikTok app.
> • Content Posting API — video.publish (requested): to schedule my content
>   calendar, my script posts each finished video directly to my own account
>   with its caption at a planned time (max 2 posts/day), using
>   /v2/post/publish/video/init/ with post_info (title, privacy_level) and
>   FILE_UPLOAD. Every video is my own original content, recorded and edited
>   by me.
>
> The tool never posts on behalf of other users, accesses only my single
> authorized account, collects no user data, and respects creator guidelines
> (original content, no spam — at most two posts per day).

*(1000-char limit: the text above fits. If a “changes in this version” line is
required, add: “First submission — requesting video.publish alongside the
already-working video.upload sandbox integration.”)*

## 3. Demo video — shot list (~90s screen recording, mp4, ≤50MB)

Record ONE continuous screen capture (OBS or Xbox Game Bar Win+G). Sandbox
mode is fine — TikTok requires it for first review. Steps:

1. **(5s)** Browser on your TikTok profile page (shows the account the app
   posts to), then the developer portal app page showing **Sandbox** and the
   products (Login Kit + Content Posting API).
2. **(20s)** Terminal: run `node scripts/social/auth-tiktok.mjs` → browser
   opens TikTok consent screen → click **Authorize**. Show the terminal
   printing the success line (blur/crop the token if visible — pause the
   recording, or just don't scroll to it).
3. **(20s)** Terminal: run
   `node scripts/social/social.mjs list` (shows the queued videos + captions),
   then `node scripts/social/social.mjs dispatch --platform tiktok --go`
   → show the “drafted — in your TikTok drafts” / posted output lines.
4. **(25s)** Phone screen (or mirror) — TikTok app: Inbox → System
   notifications showing “your video is ready”, tap it, show the video +
   caption in the editor. (After video.publish approval this step is the
   direct post appearing on the profile instead.)
5. **(10s)** Back to the terminal: `node scripts/social/social.mjs status`
   showing the completed statuses.

Tips: 1080p, no audio needed, keep the domain/app name visible, don't show
.env contents or tokens on screen.

## 4. After approval

1. In `.env` add: `TIKTOK_DIRECT_POST=1`
   (optional: `TIKTOK_PRIVACY=PUBLIC_TO_EVERYONE` — the default.)
2. That's it — the adapter switches to Direct Post (caption included). The
   scheduler fires each post when its time is due; the hourly Task Scheduler
   job (scripts/social/setup-dispatch-task.ps1) makes that hands-off.
3. Note: posts made while still unaudited are forced SELF_ONLY by TikTok —
   after approval they're public per TIKTOK_PRIVACY.
