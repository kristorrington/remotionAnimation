# AGENTS.md — how to build animations in this project

Single source of truth for generating videos here. Any AI model (or human) should
read this before writing animation code. For deep Remotion API details, also see
the skill at `.agents/skills/remotion-best-practices/` (SKILL.md + `rules/`).

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
- **Then SFX sit UNDER the boosted VO.** Against a quiet VO the "normal" 0.3–0.5
  SFX levels overpower the voice — drop them (whoosh ≈ 0.26, ticks ≈ 0.13, music
  ≈ 0.06–0.08) so the voice always wins. Balance is *relative*, so fix it in-comp
  (loudnorm only changes overall level, not balance).
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
  presenter. Drive it from an exported `CUTAWAY_WINDOWS` (the card `from`/`dur`
  list); exclude the outro so the subscribe screen is clean. Punch the footage
  ~1.18 inside the box so the face reads at small size; fade/scale in at the edges.
- **Sync gotcha (important):** the PiP lives in a `<Sequence from={F}>`, and a
  video inside a Sequence **restarts at 0:00** when the Sequence begins — so the
  corner clip lip-syncs minutes behind the main footage. Fix it by playing from
  the absolute frame: `<OffthreadVideo trimBefore={F} …>` (F = the window's
  `from`). Then the PiP shows video-frame `F + localFrame` = the absolute frame,
  matching the main track and the VO.

Transitions (reference: [CutFlash.tsx](src/components/CutFlash.tsx) +
`@remotion/transitions`, pinned to the Remotion version):

- **Dip-to-white flashes** on the biggest turns, synced to the boom/shutter SFX
  frames. Keep them fast (~7f) and **soft (peak ≈ 0.5)** and rare — only the real
  punch beats. A harder flash (0.7+) strobes and feels cheap on a explainer.
- `@remotion/transitions` provides slide / wipe / fade / flip / clock-wipe presets
  for a `TransitionSeries` when a full scene-to-scene transition is wanted.

---

## 9. Environment gotchas (do not "fix" these)

- **Node 25 + webpack hashing.** [remotion.config.ts](remotion.config.ts) sets
  `cache: false` and `output.hashFunction: "sha256"` to dodge a crash where Node
  25 feeds `undefined` into webpack's hash (`ERR_INVALID_ARG_TYPE` in
  `FileSystemInfo`). Leave those. Do **not** re-add `snapshot.managedPaths: []` —
  it force-hashes every dependency file and re-triggers the same crash whenever a
  package is installed.
- **Remote audio fails in Studio** (CORS) — always localize into `public/`.
- **Transient still-render crashes** on Node 25 (`Node.js v25.6.1` + exit) —
  just re-run; it's not a code error.
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

## 10. Workflow for a new video

1. Paste the transcript → compute frames (`sec × 30`).
2. Decide the tracks: cutaway and/or annotations and/or standalone clips.
3. Reuse components from §4; theme new ones on the §3 palette.
4. Anchor every title/item to its **spoken** frame (§5).
5. Add sound (§6): whoosh per card, a tick per bullet, shutters on the big
   beats, and three `MusicBed`s (calm / tension / outro).
6. Register in `Root.tsx`, `npx tsc --noEmit`, render stills to verify.
7. To ship a finished cut, combine with footage (§8): wrapper composition +
   `FootageDirector` (punch-ins / grade / grain) + `CutFlash` transitions, then
   render the H.264 MP4.
