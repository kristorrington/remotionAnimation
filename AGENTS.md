# AGENTS.md — how to build animations in this project

Single source of truth for generating videos here. Any AI model (or human) should
read this before writing animation code. For deep Remotion API details, also see
the skill at `.agents/skills/remotion-best-practices/` (SKILL.md + `rules/`).

**Producing a full video from a new transcript + talking-head recording?
Start at §11 — THE PIPELINE.** It is the end-to-end, repeatable process
(intake → overlay track → combined final cut → shorts → QC) with the decision
rules inline; §1–§10 are the reference it points into.

Stack: **Remotion 4.x + React + TypeScript**, **1920×1080 @ 30fps**.

---

## 1. Golden rules (never break these)

- **Frame-based only.** Every animated value derives from `useCurrentFrame()`.
  Use `spring()` for entrances; `interpolate()` for opacity / position / scale /
  color. **No CSS transitions, no `@keyframes`, no Tailwind animation classes** —
  they don't render.
- **Timing = seconds × 30.** Sync every element to the transcript (see §5).
- **One `<Sequence from={…} durationInFrames={…}>` per element.** Add
  `premountFor={30}`.
- **Overlay tracks render transparent** (ProRes 4444) via `calculateMetadata`
  (see §7). Gaps stay transparent so the screen recording / talking head shows.
- **Assets live in `public/`** and are referenced with `staticFile()` — never a
  raw path or a remote URL that Studio must fetch (CORS fails). SFX in
  `public/sfx/`, music in `public/music/`, images/logos in `public/`.
- **Register every composition** in `src/Root.tsx`.
- **Verify:** `npx tsc --noEmit`, then render a still (`npx remotion still <Id>
  out/x.png --frame=N --scale=0.4`) before claiming done.

---

## 2. The two-track model

Most videos are split so the animation composites over the user's footage:

- **Cutaway track** (`*Video`) — full-screen branded segments at conceptual /
  transition beats; **transparent gaps** where the footage carries the demo.
- **Annotation track** (`*Annotations`) — transparent corner chips, prompt
  bubbles and checklists layered over a live screen recording.
- **Standalone clips** — a single reusable moment as its own composition,
  **zero-based** (frame 0 = the moment's start) so it can be dropped anywhere on
  an editor timeline.

Examples in this repo: `HermesVideo`/`HermesAnnotations`,
`GmailVideo`/`GmailAnnotations`, `GmailAuthCommand`, `GmailLiveTests`,
`Fable5Video`.

---

## 3. Visual style

- **Palette:** blue `#3B82F6`, cyan `#06B6D4`, white `#FFFFFF`, red `#EF4444`,
  green `#34D399`, amber `#F59E0B`, Claude terracotta `#D97757`. Dark bg
  `#020202` / `#0A0A0A`. Constants + fonts live in
  [src/components/overlayUI.tsx](src/components/overlayUI.tsx).
- **Type:** Inter via `@remotion/google-fonts/Inter`; mono via RobotoMono.
- **Panels/pills:** `rgba(8,12,20,0.8)` bg + `PILL_BORDER` + `DROP_SHADOW`.
- **Positioning — important:** Remotion's `AbsoluteFill` is
  `flex-direction: column`, so `justifyContent` = **vertical**, `alignItems` =
  **horizontal**. Zones (see the `POS` map in
  [ActionBadge.tsx](src/components/ActionBadge.tsx)): command chips bottom-left,
  prompt bubbles top-center, checklists right, badges in corners, cutaways
  centered. Keep long text off the edges; wide panels get `overflow: hidden`.

---

## 4. Component library (`src/components/`)

Reuse these before building anything new:

| Component | Use |
|---|---|
| `overlayUI` | colors, fonts, `Pill`, `DROP_SHADOW`, `PILL_BORDER` |
| `AnimatedBackground` | cinematic dark backdrop for cutaways (aurora + grid + particles + vignette), with a fade envelope |
| `SectionCard` | full-screen title card — `kicker` / `title` / `subtitle` / `items` / `itemDelays` / `icon` |
| `CmdChip` | bottom-left terminal chip that types a command |
| `ChatPrompt` | top-center "prompt to the agent" bubble, typing reveal |
| `ProcessChecklist` | right-side panel whose `steps` check off (`{text, at}`) |
| `ConfigCallout` | floating code panel — `title` / `lines` / `width` |
| `AuthCommand` | code panel that spotlights each path as narrated |
| `ActionBadge` | small corner callout — `pos` (`tl/tr/bl/br/tc/bc`), `check` |
| `ResultCard` | centered result panel (title + staggered items) |
| `CompareCard` | two columns — `left`/`right`, `leftDelay`/`rightDelay` |
| `Fable5Timeline` | dated horizontal timeline with a growing progress line |
| `Cartoons` | `ClaudeMark` (animated logo) + idea icons — see the set below |
| `Sfx` | `SFX` url map + `SfxCue` |
| `MusicBed` | soft background-music bed with fades / loop |
| `FootageDirector` | "directs" talking-head footage — punch-in jump cuts, slow push, grade, vignette, grain (§8) |
| `CornerPip` | small "webcam" of the presenter, bottom-right, during a cutaway (§8) |
| `CutFlash` | fast dip-to-white transition accent at a frame (§8) |
| `LogoBadge` (in `GmailHook`) | white app-icon tile for a logo image |

**Animated icons in `Cartoons`** (pass as `<SectionCard icon={…}>`; all self-animate):
`IconBlock`, `IconGauge`, `IconGuard`, `IconContext`, `IconPrice`, `IconCalendar`,
`IconChange`, `IconGate`, `IconRoute`, `IconSilent`, `IconShieldAlert` (national
security / alert), `IconBug` (exploit / safeguards bypassed), `IconChip` (strategic
tech / hardware), `IconGlobe` (jurisdiction / a foreign provider), `IconStack`
(vendor / single point of failure). **Don't reuse the same icon across nearby
cards** — pick the one that matches the beat, and add a new one to `Cartoons.tsx`
in the same SVG style if nothing fits.

---

## 5. Timing & sync (this is what keeps it professional)

- Convert every transcript timestamp: `frame = round(seconds * 30)`.
- **Anchor each element's `from` to when its title/phrase is actually SPOKEN**,
  not the topic's lead-in. Text must never appear *ahead* of the narration
  (viewers read the punchline early — bad). Let lead-ins play over the
  transparent gap, then snap the graphic in on the phrase.
- **Items:** `itemDelays[i] = (item's spoken frame) − from`.
- **Compare cards:** delay the second column with `rightDelay` until its phrase
  is said.
- **Standalone clips:** zero-based. Internal offset =
  `(spoken time − clip's start time) × 30`. Tell the user which second to drop
  the clip at.
- Leave **transparent gaps** between segments for the footage.
- `SectionCard`'s title slams at local `f6–16`, so set `from ≈ phraseFrame − 6`.
- **The outro/subscribe card is an element too — anchor it to the SPOKEN
  "subscribe", not the end of the last content card.** A wrap-up monologue can
  run 15–20s after the visuals "feel" done; placing the subscribe screen when
  the cards end drops it on top of still-narrated payoff. Find "subscribe" in the
  whisper data, set `from ≈ subscribeFrame − 6`, run it to the footage end, and
  cover the run-up with its own card(s). (See §8 for the combined-cut detail.)

---

## 6. Sound

### SFX palette (local wavs in `public/sfx/`, keyed in `SFX`)

Fire one-shots with `<SfxCue from={F} src={SFX.whoosh} volume={0.5} />`.

| Key | Sound | Use it for | Vol |
|---|---|---|---|
| `whoosh` | air swoosh | every card / prompt / config slam (the base layer) | 0.5 |
| `switch` | soft tick | one per bullet as it appears (quiet, under VO) | 0.3 |
| `click` | mouse click | command chips being "typed" | 0.5 |
| `ding` | bright ding | success badges / dates / payoff lines | 0.5 |
| `whip` | sharp swipe | compare-card columns snapping in, fast list snaps | 0.4 |
| `pageTurn` | paper flip | structural pivots / a timeline unrolling / chapter turns | 0.4 |
| `shutter` | modern camera | dramatic beats / a "snapshot" freeze | 0.45 |
| `shutterOld` | vintage camera | alt flash when `shutter` is already in use nearby | 0.45 |
| `boom` | deep impact | **the one or two biggest reveals of the whole video only** | 0.4 |

- **Layer, don't just whoosh the card in.** Build the mix in tiers: (1) `whoosh`
  on every card `from`; (2) a `switch` **tick per bullet**; (3) accents — `whip`
  on compare columns, `pageTurn` on act boundaries; (4) punctuation — `ding` on
  payoffs, `shutter` on the 2–3 most dramatic lines; (5) `boom` on the single
  biggest turn. Generate the per-bullet ticks from the data so they stay in sync:
  ```tsx
  {CARDS.flatMap((c) => (c.itemDelays ?? []).map((d) => (
    <SfxCue key={`tk-${c.from}-${d}`} from={c.from + d + 6} src={SFX.switch} volume={0.3} />
  )))}
  ```
  (`+6` matches the item's own entrance offset.) Keep ticks quiet so they sit
  under narration; **don't stack two loud SFX on the same frame** — e.g. give a
  compare card `whip` *instead of* another `whoosh`, and use `boom` sparingly.

### Music — low, and cut up over key sections (not one long drone)

Three source beds in `public/music/` — **uppercase `.MP3`**: `calm.MP3` (setup /
positive), `tension.MP3` (stakes / deadline), `outro.MP3` (payoff / subscribe).

- **Keep it quiet — `volume` ≈ 0.06–0.09.** Music sits *far* under the voice and
  SFX; it should be felt, not heard. (SFX stay at their normal 0.3–0.5.)
- **Cut it up. Don't span the whole video with one bed.** Place several *short*
  beds only over the emotional peaks (hook, the stakes turn, the big reveal, the
  payoff/outro) and leave the demo-heavy stretches **music-free** so the beds
  mean something when they enter. Re-use the same source track in pieces across
  the video; vary `startFrom` to pull a different part of the track for a later
  reuse. `MusicBed` fades (`fadeInFrames`/`fadeOutFrames`) and loops by default —
  always fade the tail out (`fadeOutFrames ≈ 90–140`) so a bed exits cleanly into
  the silence.
  ```tsx
  <MusicBed src={staticFile("music/calm.MP3")}    from={60}   durationInFrames={760} volume={0.07} fadeOutFrames={90} />
  <MusicBed src={staticFile("music/tension.MP3")} from={2771} durationInFrames={760} volume={0.08} fadeInFrames={45} fadeOutFrames={120} />
  <MusicBed src={staticFile("music/calm.MP3")}    from={5390} durationInFrames={920} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={120} />
  ```
  `Fable5Video` and `PolicyRiskVideo` are the reference implementations.
- Audio **bakes into the transparent ProRes render** (verified: stereo PCM
  s16le, 48 kHz, alongside the ProRes 4444 video stream). Keep SFX/music
  **local** — remote URLs break Studio. New SFX come from
  `remotion.media/<name>.wav` (e.g. `whip`, `page-turn`, `vine-boom`).

### Mix & master (do this or the export sounds "silent")

- **The VO is the star — it must lead the mix.** Talking-head recordings are
  often quiet; **measure the source** (`ffmpeg -i src -af volumedetect -f null -`)
  and if it peaks low (e.g. −14 dB) boost it in-comp: `<OffthreadVideo volume={3}>`
  so the voice peaks around −3 to −6 dB.
- **Then SFX sit UNDER the boosted VO — but clearly audible.** With the VO
  boosted to peak ≈ −3 dB, use whoosh/ding ≈ 0.45, whip/page-turn/shutter ≈
  0.35–0.4, boom ≈ 0.45, ticks ≈ 0.25, music ≈ 0.06–0.09. (First pass used
  0.13–0.26 and the SFX were inaudible in the final mix — don't repeat that.)
  Balance is *relative*, so fix it in-comp (loudnorm only changes overall
  level, not balance). QC by EAR: play a card transition — if you can't hear
  the whoosh under the voice, raise SFX before rendering.
- **Always master the final export to ~−14 LUFS** (YouTube). Remotion does **not**
  normalize — a raw render measured **−29 LUFS** here (≈ inaudible at normal
  volume). Add a loudnorm pass at mux time:
  `ffmpeg -i raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:a aac out.mp4`.
  Use **system ffmpeg** (`/c/ProgramData/chocolatey/bin/ffmpeg`) — Remotion's
  bundled ffmpeg is built without the `loudnorm`/`volumedetect`/`ebur128` filters.

---

## 7. Rendering & registration

- Register in [src/Root.tsx](src/Root.tsx). Transparent overlays use
  `calculateMetadata={transparentDefaults}` (ProRes 4444 / png / yuva444p10le).
- Render transparent overlay: `npx remotion render <Id> out/<Id>.mov`
  (or hit **Render** in `npx remotion studio`). Explicit flags if needed:
  `--image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444`.
- Render a standalone/full mp4: `npx remotion render <Id> out/x.mp4`.

---

## 8. Combining with real footage (the final cut)

To ship one finished MP4 (footage + animation, rendered together in Remotion):

- **Wrapper composition** (reference: [PolicyRiskFinal.tsx](src/PolicyRiskFinal.tsx)) —
  full-screen footage at the bottom, the overlay track on top, transition accents
  last. Register it **without** `transparentDefaults` so it renders a normal
  H.264 MP4 with mixed audio. Set `durationInFrames` to the footage length.
- **Footage in `public/`**, referenced with `staticFile`. **Transcode a heavy
  source to a 1080p H.264 proxy first** (see §9) — a 4K HEVC file decodes far too
  slowly to render and bloats the bundle copy. Keep the 4K original as a backup
  outside `public/`; render `--scale=2` off it later only if true 4K is needed.
  Match the comp `fps` to the footage.
- **Same-take only.** The overlay is timed to the transcript, so the footage must
  keep that continuous timing. Never do an edit that *removes time* (cutting
  pauses, de-umming) — it desyncs every card. Punch-ins, grade and grain are all
  duration-preserving and safe.
- **Audio mixes automatically** into one AAC stereo stream, but you must set the
  levels and **master it** — boost the (usually quiet) VO to lead, drop SFX under
  it, and loudnorm the export to ~−14 LUFS. See §6 "Mix & master"; an un-mastered
  render measured −29 LUFS (near-silent). Render video/audio split, then mux **and
  loudnorm in the same ffmpeg pass** (§9).

Make the footage look *edited* during the transparent gaps with a **footage
director** (reference: [FootageDirector.tsx](src/components/FootageDirector.tsx)):

- **Punch-in jump cuts + slow push.** A `FRAMING` schedule snaps the framing at
  chosen frames (place cuts inside the visible gaps between cutaways; cuts hidden
  under a cutaway are harmless) and drifts a hair within each segment so it never
  sits still. **Keep punches SUBTLE** — a well-shot medium shot is already good,
  so `scale: 1` IS a valid framing and punches should cap around **1.12**; 1.2+
  crops into the face and reads as "too zoomed." A small negative `y` (only when
  `scale > 1`) lifts the eyeline.
- **Grade / vignette / grain.** A warm CSS `filter`, a `soft-light` warm wash, a
  radial vignette, and an inline-SVG turbulence grain (jittered per frame). Apply
  to the **footage only** so the animation cards keep their palette.

Keep the presenter present during cutaways with a **corner PiP** (reference:
[CornerPip.tsx](src/components/CornerPip.tsx)):

- A small rounded "webcam" of the **same footage/frame** bottom-right while a
  full-screen cutaway covers the main shot — so the viewer never fully loses the
  presenter. Punch the footage ~1.18 inside the box so the face reads small;
  exclude the outro so the subscribe screen is clean.
- **MERGE covers into continuous spans — do NOT render one PiP per card.** A
  fresh `CornerPip` per cutaway fades out at each card's end and back in at the
  next → a visible flicker at every topic change; and short talking gaps
  (1.5–4.5s) between cards briefly cut to the full face. Fix both by unioning the
  covers (+ short gaps) into continuous spans and rendering **one PiP + one
  bridge background per span**, so the PiP mounts once and holds steady across
  the whole span (the cards still animate on top; gaps within the span show the
  bridge bg + steady PiP, never the full face):

  ```tsx
  const PIP_GAP_MAX = 180; // ≤6s gaps stay bridged (steady PiP); >6s = real
                           //   talking beat → full face returns (intended)
  const spans: { from: number; to: number }[] = [];
  for (const c of COVERS_NO_OUTRO) {        // sorted; outro excluded from PiP
    const last = spans[spans.length - 1];
    if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
    else spans.push({ from: c.from, to: c.from + c.dur });
  }
  // render, UNDER <Slug>Video (cards paint on top), ONE per span:
  //   <AnimatedBackground durationInFrames={s.to-s.from} fade={false} />   (bridge)
  //   <CornerPip from={s.from} dur={s.to-s.from} />                        (steady PiP)
  ```
  This supersedes the old per-window `BRIDGES`/`CUTAWAY_WINDOWS.map(<CornerPip>)`
  approach — one span-level PiP means zero mid-span remounts.
- **Sync gotcha (important):** the PiP lives in a `<Sequence from={F}>`, and a
  video inside a Sequence **restarts at 0:00** when the Sequence begins — so the
  corner clip lip-syncs minutes behind the main footage. Fix it by playing from
  the absolute frame: `<OffthreadVideo trimBefore={F} …>` (F = the span's
  `from`). Then the PiP shows video-frame `F + localFrame` = the absolute frame,
  matching the main track and the VO.

**The outro / subscribe card is anchored to the SPOKEN "subscribe", NOT the end
of the cards.** The outro must not appear until the narrator actually says it,
and then it runs to the end of the footage. Find the frame with the whisper data
(`captionsData.ts`), set the outro `from ≈ subscribeFrame − 6`, and give the
run-up content its OWN card(s) through the narration — do not let the subscribe
screen fill a gap where the VO is still delivering the payoff. Measured failure
in PolicyRisk: "please subscribe" is spoken at frame **14106**, but the outro
was placed at **13560** — ~18s early, sitting on top of the still-narrated
"three questions" wrap-up. Right timing: a payoff card holds 13546→~14090, then
the outro fires at ~14090 and runs to the footage end (14453).

Transitions (reference: [CutFlash.tsx](src/components/CutFlash.tsx) +
`@remotion/transitions`, pinned to the Remotion version):

- **Dip-to-white flashes** on the biggest turns, synced to the boom/shutter SFX
  frames. Keep them fast (~7f) and **soft (peak ≈ 0.5)** and rare — only the real
  punch beats. A harder flash (0.7+) strobes and feels cheap on a explainer.
- `@remotion/transitions` provides slide / wipe / fade / flip / clock-wipe presets
  for a `TransitionSeries` when a full scene-to-scene transition is wanted.

---

## 9. Environment gotchas (do not "fix" these)

- **Node 25 + webpack hashing.** [remotion.config.ts](remotion.config.ts) makes
  webpack snapshot by **file timestamp instead of content hash**
  (`snapshot.module/resolve/... = { timestamp: true, hash: false }`), plus
  `cache: false` and `output.hashFunction: "sha256"`. This dodges a crash where
  Node 25 feeds `undefined` into webpack's snapshot content-hashing
  (`ERR_INVALID_ARG_TYPE` in `FileSystemInfo.js` → `Hash.update`) — which becomes
  **deterministic** (every bundle/`npm run dev`/render fails), not just transient,
  once enough deps accumulate. Leave the whole block. Do **not** set
  `snapshot.managedPaths: []` — that force-hashes every dependency and re-triggers
  it.
- **Remote audio fails in Studio** (CORS) — always localize into `public/`.
- **Transient still-render crashes** on Node 25 (`Node.js v25.6.1` + exit) —
  just re-run; it's not a code error.
- **Text/borders that silently don't paint.** The render browser can skip
  rasterizing plain (non-composited) text and borders inside layered cards —
  the element takes layout space but renders nothing. Force a compositing
  layer: `transform: "translateZ(0)"` on the element (elements with any
  transform/filter always paint). Also: **avoid glyphs outside the loaded latin
  subsets** (`◆`, `↗` — draw shapes with CSS instead; `→`/`—`/`✓` are proven
  safe) and keep bare text spans at **fontWeight ≥ 600**. If text is missing in
  a still, suspect these three in that order.
- **Heavy source footage → make a proxy.** A 4K HEVC file decodes far too slowly
  to render (minutes → hours) and bloats every bundle copy. Transcode once to a
  1080p H.264 proxy and point the composition at it:
  `npx remotion ffmpeg -y -i _source-4k.mp4 -vf scale=1920:1080 -c:v libx264 -crf 20 -preset veryfast -c:a aac -b:a 192k public/talking-head.mp4`.
  Keep the 4K original as a backup **outside** `public/`.
- **Render crash `0xC0000142` / `3221225794` at the FFmpeg stitch** (many-core
  Windows). With lots of audio tags (100+ SFX/music cues) Remotion burst-spawns
  FFmpeg subprocesses during the audio mix and Windows hits a process-init limit.
  Fix: render **video and audio separately**, then mux — `--muted` for the video
  at full concurrency, then an audio-only pass (`out/audio.mp3`) at
  `--concurrency=4`, then `remotion ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac out.mp4`.
  A single-pass render at `--concurrency=8` often survives too.
- `AbsoluteFill` is `flex-direction: column` (see §3).

---

## 10. Vertical shorts (TikTok / Reels / YouTube Shorts)

Self-contained system in [src/shorts/](src/shorts/) — **read
[src/shorts/README.md](src/shorts/README.md) before touching it**; it is the
source of truth for the format. The essentials:

- **One short = one `ShortSpec`** in `src/shorts/specs.ts` (start frame, hook,
  topic, cartoon `beats`, CTA) — it auto-registers as a 1080×1920 composition.
  Master toggle: `SHORTS_ENABLED` in `src/shorts/index.tsx`.
- **Layout:** full-screen face for the hook (word-slam entrance + typewriter
  clicks) → animated split (cartoon-beat panel on top, talking head below) →
  full-screen face for the CTA. Progress bar + topic banner pinned on top;
  whisper captions in an opaque pill (docked on the seam in split mode, chest in
  full-screen); an identity lower-third in the opening seconds and the channel
  handle under the CTA button (brand text lives in `src/brand.ts`); text never
  covers the face.
- **Beats obey the golden rule:** appear when SPOKEN, never before. Derive
  spoken frames from the main video's `CARDS`; the first beat may be a
  non-spoiling scene-setter so the panel opens populated.
- **Sound fires from the spec automatically** (hook clicks, reframe whooshes,
  per-beat whoosh + accent + tick, CTA boom + ding, one low music bed).
- **Captions:** `node scripts/transcribe.mjs` (whisper) regenerates word-level
  captions into `src/shorts/captionsData.ts` after new footage.
- Pick moments with the **viral-scoring rubric** in the shorts README.

---

## 11. THE PIPELINE — any transcript + talking head → final video + shorts

This is the complete, repeatable process. Inputs: **(a)** a transcript,
**(b)** a same-take talking-head recording, **(c)** brand text in
[src/brand.ts](src/brand.ts). Outputs: a finished landscape MP4 and 3–4
post-ready vertical shorts. Follow the phases in order; the IF/ELSE lines are
the decisions. `<Slug>` = the new video's name (e.g. `PolicyRisk`).

### Phase 0 — Intake & preflight

1. **Footage in.** Put the recording at `public/talking-head.mp4`.
   - IF a previous video's footage is there → move it to `_footage-backup/`
     first (gitignored). One "active" footage file at a time; the whisper
     captions and shorts always describe the CURRENT file.
   - IF the source is 4K, HEVC, or > ~200 MB → transcode a proxy FIRST (§9
     command), keep the original in `_footage-backup/`. ELSE use as-is.
2. **Probe it:** `ffprobe public/talking-head.mp4` → note duration + fps.
   - IF fps ≠ 30 → add `-r 30` to the proxy transcode so everything stays
     frame = sec × 30. Total frames `N = round(duration_seconds × 30)`.
3. **Transcript.**
   - IF the transcript has per-line timestamps → use them directly
     (frame = seconds × 30).
   - ELSE (no timestamps) → run `node scripts/transcribe.mjs` now and read the
     word timings from `src/shorts/captionsData.ts` (absolute frames). This
     also pre-generates the shorts captions.
4. **Audio level:** `ffmpeg -i public/talking-head.mp4 -af volumedetect -f null -`
   - IF max_volume ≤ −10 dB → the VO needs an in-comp boost; note the factor
     (≈ −14 dB peaked → `volume={3}`). ELSE `volume={1}` is fine.

### Phase 1 — The overlay track (`src/<Slug>Video.tsx`)

Copy `PolicyRiskVideo.tsx` as the template. It must export THREE things:
`<Slug>Visuals` (cards only, NO audio), `<Slug>Video` (visuals + sound), and
`CUTAWAY_WINDOWS` (the `{from, dur}` list of every full-screen cover).

1. **Choose track types.**
   - IF the video is a talking-head explainer → one cutaway track (this phase).
   - IF it includes a screen-recording demo → ALSO build an annotation track
     (chips / prompts / checklists, §2) for those minutes.
   - IF one moment must be dropped anywhere on an editor timeline → make it a
     standalone zero-based clip instead.
2. **Build the `CARDS` array** — one entry per conceptual beat:
   - `from ≈ spokenFrame − 6` (title slams at local f6–16). NEVER earlier —
     the §5 golden rule. `itemDelays[i] = itemSpokenFrame − from`.
   - IF the narration contrasts two things → `CompareCard` with
     `leftDelay`/`rightDelay` on the spoken phrases.
   - IF a beat is a date/timeline → `Fable5Timeline` pattern.
   - Card duration: hold until the topic moves on — and **keep holding while the
     VO is still on that point** (a card that ends mid-explanation drops to the
     face awkwardly). The LAST content card must run right up to the spoken
     "subscribe"; don't leave a long uncovered wrap-up. Gaps ≤ ~6s between covers
     are fine — Phase 2 bridges them with a steady PiP (no face-flash).
3. **Icons:** every card gets one. IF a concept matches an existing icon in
   [Cartoons.tsx](src/components/Cartoons.tsx) (see §4 list) → use it and don't
   repeat an icon on adjacent cards. ELSE add a new SVG icon in the same style
   (100×100 viewBox, frame-driven animation) and add it to the §4 list.
4. **Sound (§6):** whoosh per card, tick per bullet (generated from
   `itemDelays`), ding on payoffs, shutter on 2–3 dramatic lines, ONE boom on
   the single biggest turn. Music: short low beds (vol 0.06–0.09) over the
   hook / stakes / payoff sections only, faded out, cut up (§6).
5. **Register** in `Root.tsx` (transparent defaults, `durationInFrames = N`),
   `npx tsc --noEmit`, render 2–3 stills at busy frames to verify.
6. IF the user edits externally (Premiere/Resolve) → render the transparent
   ProRes 4444 `.mov` (§7) and STOP here. ELSE continue.

### Phase 2 — The combined final cut (`src/<Slug>Final.tsx`)

Copy `PolicyRiskFinal.tsx` as the template; it composites, in order:
`FootageDirector` → per-span bridge backgrounds → `<Slug>Video` → per-span
`CornerPip`s → `CutFlash`es.

1. **FootageDirector schedule:** place jump-cuts inside the VISIBLE gaps
   between cutaways. Subtle only: `scale 1.0–1.12` (1.0 IS a framing), small
   negative `y` when punched. Grade/vignette/grain come free.
2. **Spans + PiP (see §8):** MERGE the covers (+ gaps ≤ `PIP_GAP_MAX` ≈ 180f/6s)
   into continuous spans; render **one bridge bg + one `CornerPip` per span**
   (not per card) so the PiP holds steady — no per-card flicker, and short
   talking gaps stay covered instead of flashing the full face. Exclude the
   outro from the PiP spans. PiP MUST use `trimBefore={span.from}` (§8 sync).
   IF a real >6s talking beat still feels like a flash → raise `PIP_GAP_MAX`.
3. **Outro timing (see §8):** anchor the subscribe/outro card to the frame the
   VO says "subscribe" (whisper data), `from ≈ subscribeFrame − 6`, running to
   the footage end. Give the run-up payoff its own card(s); never let the
   subscribe screen sit over still-narrated content.
4. **Flashes:** `CutFlash` at 4–6 of the biggest turns only, peak ≤ 0.6.
5. **Audio:** set the footage `volume={boost}` from Phase 0.4; SFX sit under
   the boosted VO (§6 "Mix & master" levels).
6. **Register** (NO transparent defaults, `durationInFrames = N`), typecheck,
   verify stills: one gap frame (face), one card frame (cover), one bridge.
7. **Render** with the split chain (§9): muted video at concurrency 12 →
   audio-only at concurrency 4 → mux + `loudnorm=I=-14` master. Output
   `out/<Slug>Final.mp4`; never overwrite a previous deliverable — version the
   filename.
   - IF FFmpeg exits `3221225794` at the stitch → you skipped the split chain.
   - IF webpack `ERR_INVALID_ARG_TYPE` → §9; re-run, config already guards.
   - IF the render ETA looks absurd (>2× realtime per pass) → check for
     orphaned `chrome-headless-shell`/node render processes and kill them.
8. **Verify the file:** `ffprobe` shows video + audio streams; `ebur128` shows
   ≈ −14 LUFS; spot-check a talking frame and a card frame.

### Phase 3 — Shorts (3–4 per video)

Everything lives in [src/shorts/](src/shorts/) and is data-driven — you write
`ShortSpec`s, no new components. Full detail: [src/shorts/README.md](src/shorts/README.md).

1. **Captions:** IF `scripts/transcribe.mjs` hasn't run against THIS footage →
   run it now (`node scripts/transcribe.mjs`).
2. **Mine the transcript** with the rubric (hook / payoff / charge / visual
   mappability / first-second). Score candidates; take the top 3–4.
3. **Per short, write a `ShortSpec`** in `specs.ts`:
   - `from` = a strong spoken line (never cold lead-in); `id` = `Short-<Name>`.
   - `hook` ≤ 6 words, threat/curiosity framing; `topic` = 2–3 word banner.
   - `beats`: one cartoon card per key phrase, `at = spokenFrame − from`
     (golden rule — derive from `CARDS` itemDelays or the caption dump).
     IF the opening narration is a lead-in → beat 0 may be a non-spoiling
     scene-setter. IF the VO has a crisp list → quick-fire beats (~40–60f).
     IF a narration run is long → one card holds; its motion carries it.
   - **Loop ending:** dump the tail words from `captionsData.ts` (snippet in
     the shorts README); set `durationInFrames` ≈ last word's `to` + 15 on an
     OPEN line (question / consequence that re-arms the hook). NEVER cut
     mid-sentence. IF no good loop line exists near the target length →
     extend/shrink the clip to the nearest one (25–40s is all fine).
4. **Typecheck + stills:** hook frame (~30), a split frame (~300), a
   quick-fire frame, the CTA (last 60f). Check: text never on the face,
   captions docked on the seam, beats match what's being said.
5. **Write the publish copy** in `src/shorts/PUBLISH.md` — a YouTube title
   (≤60 chars, hook words first, `#Shorts`) and description (hook line, what
   the viewer learns, a comment-bait question, follow CTA, 4–6 hashtags) per
   short. The format rules live at the top of that file. A spec without
   publish copy isn't done.
6. **Render each short:**
   `npx remotion render Short-<Name> out/_raw.mp4 --concurrency=8`, then
   loudnorm-master to `out/Short-<Name>.mp4` (§6). One 9:16 file posts to
   TikTok + Reels + Shorts.

### Phase 4 — Definition of done (QC gate, all must pass)

- [ ] No text appears before its phrase is spoken (main video AND shorts) —
      including the **outro/subscribe card**: it must not appear before the VO
      says "subscribe" (verify against the whisper data), and it runs to the end.
- [ ] No full-face flash or PiP flicker between adjacent cutaways: PiP is ONE
      element per merged span (not per card), and gaps ≤ `PIP_GAP_MAX` (~6s)
      stay bridged. Scrub every card→card change and every short gap.
- [ ] PiP lip-sync matches the VO (`trimBefore={span.from}` set).
- [ ] Finals measure ≈ −14 LUFS; VO leads; SFX under it; music felt not heard.
- [ ] Shorts: face never covered; captions on the seam; loop ending on an open
      line; lower-third + handle present; every beat has sound; title +
      description written in `src/shorts/PUBLISH.md`.
- [ ] `npx tsc --noEmit` clean; deliverables in `out/`, versioned, never
      overwriting a previous cut.
