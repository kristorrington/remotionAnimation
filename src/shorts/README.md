# Shorts — vertical clips for TikTok / Reels / YouTube Shorts

Self-contained vertical (1080×1920) system. Everything lives in this folder and
is toggled by one flag, so it can be turned on/off without touching the main
landscape videos.

## Turn on / off
`SHORTS_ENABLED` in [index.tsx](index.tsx). `true` = all shorts appear in Studio
and render; `false` = they vanish entirely. Root only ever renders
`{SHORTS_ENABLED && <ShortsCompositions/>}`.

## The pattern — one short = one spec (+ its publish copy)
Add an entry to `SHORTS` in [specs.ts](specs.ts); it auto-registers as its own
1080×1920 composition. No new components needed. **Every new spec also gets a
title + description entry in [PUBLISH.md](PUBLISH.md)** (copy-paste ready for
YouTube Shorts / TikTok / Reels) — the format rules are at the top of that file.
A spec without publish copy isn't done.

```ts
{
  id: "Short-SilentDowngrade",     // composition id
  source: "talking-head.mp4",      // footage in public/
  from: 10820,                      // START frame in the SOURCE video (sec × 30)
  durationInFrames: 1020,           // clip length (30 = 1s)
  topic: "WOULD YOU EVEN NOTICE?",  // top banner — a short CURIOSITY QUESTION the
                                    // video answers; complements the hook, ≤24 chars
  hook: "YOUR AI IS SECRETLY GETTING DUMBER",  // scroll-stopper, top, first ~3s
  animHook: true,                   // optional: open on FULL-SCREEN ANIMATION under
                                    // the hook (needs a beat at/near frame 0)
  beats: [                          // one tiny animated SCENE per beat — TILE the
    { at: 15, scene: "emote", pose: "alarmed", text: "SILENT SWAP" },  // whole clip
    { at: 205, scene: "coins", text: "STILL BILLED" },
  ],                                // text = LABEL, 1–4 words; captions carry speech
  fullscreen: [                     // spans where the ANIMATION takes the FULL
    { from: 205, to: 380 },         // screen (reveals/punchlines/payoffs) — see
  ],                                // "Layout" below; VO keeps playing
  outro: "FOLLOW FOR MORE",         // CTA end card
  music: "music/tension.MP3",       // optional low bed
}
```
**Beat scenes** (`scene` key → [BeatScenes.tsx](BeatScenes.tsx)) — every beat is a
subject DOING something (CLAUDE.md §9): `emote` (robot pose + bubble) · `queue`
(prompt queue → brain + stalled bar) · `stack` (cards pile + collapse) · `bolt`
(module bolts onto block; `trails`/`warn` opts) · `coins` (coins → cost meter) ·
`migrate` (robot + STOP sign → test bench) · `testbench` (card into test rig →
verdicts) · `conveyor` (belt → two timed lanes, or DONE + check) · `reject`
(badge bounces off shield; `badge`) · `retry` (call loops the retry wheel) ·
`check` (big object + `verdict` stamp; quick-fire) · `race` (two lanes).
Legacy `icon` cards ([CartoonBeat.tsx](CartoonBeat.tsx)) are a fallback — max ~1
per short.

**Extras:** `Beat.emoji` pops ONE oversized meme emoji with the beat (use ~1 per
short — animated-meme energy, not confetti). `ShortSpec.hookAlt` auto-registers
a `<id>-B` composition (same clip, different hook) for A/B testing.
The TopBar progress bar shows a milestone tick per beat automatically. The last
~9 frames dip toward dark so the platform auto-replay (last frame → first) never
visibly jumps — pair that with a loop-back line (see "Loop endings"). While
designing, flip `showSafeZones` in the Studio props panel to overlay the
platform-UI safe zones (preview-only; can never render).

### Layout — dynamic split / full-screen (built for retention)
- **Animated cartoon cards on TOP** (`AnimationPanel` → `ShortAnimation`): one
  `CartoonBeat` per beat (springing icon + shock-ring + phrase) over a cinematic
  backdrop. Beats TILE the clip so the panel is never empty, and the text lives
  **inside** the card (never a separate overlay clashing with it).
- **Talking head on the BOTTOM** (`VerticalStage`) with a slow Ken-Burns push.
- **Dynamic reframe:** FULL-SCREEN face for the hook and the CTA, SPLIT for the
  body — the seam (`seamY`) animates in [VerticalShort.tsx](VerticalShort.tsx);
  `ANIM_H` is the split band height. A whoosh fires on each reframe.
- **Full-screen ANIMATION spans (`spec.fullscreen`):** never force every beat
  into split — pick the strongest layout PER BEAT (CLAUDE.md §9). During a span
  the seam drops to 1920: the animation takes the whole screen, the face hides
  (VO keeps playing — the video stays mounted at 1px), captions drop to y≈1560,
  the lower-third auto-defers past overlapping spans, and a whoosh fires on each
  boundary. Use for reveals, punchlines, big numbers, quick-fire runs, payoffs.
  Constraints: sorted + non-overlapping, `from ≥ ~112` (leave the split ~1.5s
  after the hook settles so the face never blips), `to ≤ dur − 120` (touching
  the CTA window collides with its seam keyframes), ≥ 24f between spans.
  VerticalShort now nudges colliding keyframes by a frame instead of crashing,
  but respect the constraints — a nudge means the layout is fighting itself.
- **Text never covers the face:** captions on the chest, emphasis pops in the top
  band, hook over the hairline, CTA in the lower third.
- **Retention furniture:** `TopBar` (progress bar + the `topic` question banner
  — a short, INFORMATIVE curiosity question that names the subject, e.g. "IS
  YOUR AI BEING SWAPPED?"), `HookTitle` (word-slam, first ~3.2s), `Captions`
  (whisper karaoke in an opaque pill, **split mode only** — docked on the seam;
  never during the hook or CTA, so the open stays clean),
  `LowerThird` (identity strip just below the seam, left, over the set wall —
  never the face), `ShortOutro` (CTA + handle). One text element per zone —
  if a frame has more than 3 text blocks, cut something.
- **Brand:** name / tag / handle live in [src/brand.ts](../brand.ts) — edit once,
  the lower-third and CTA update everywhere.

### Editing effects in play
hook · dynamic split↔full reframe · animated cartoon cards (icon + shock-ring +
phrase) · Ken-Burns push · progress bar · topic banner · karaoke captions ·
per-beat sound (whoosh + boom/ding/whip + tick) · transition whooshes · spring
entrances · grade + vignette · CTA. To dial energy up/down, edit the `seamY`
keyframes (`VerticalShort.tsx`) and add/space `beats` in `specs.ts`.

## Finding viral moments in a transcript (the repeatable method)
Scan for a **self-contained 20–40s span**, then score each candidate 1–5 on:

| Signal | What to look for |
|---|---|
| Hook strength | works with ZERO context: threat, surprising claim, number, "nobody tells you" |
| Payoff | a clear "so what" lands within ~30s — end the clip just after it |
| Emotional charge | fear / stakes / counter-intuitive beats > neutral explanation |
| Visual mappability | every key phrase maps to an icon/cartoon beat |
| First second | the first SPOKEN line must relate to the hook — no cold lead-in |

Take the top scorers (ship 3–4 per video). Hooks ≤ 6 words, negativity/curiosity
bias travels ("secretly getting dumber" > "model quality can change"). Crisp
spoken lists (one vendor / one jurisdiction / one failure point) make perfect
quick-fire beat runs.

### Loop endings (free replays)
Shorts auto-replay, and the replay counts as a view — so **end on a line that
hands back into the hook**, never on closure. Use the whisper data to find the
exact cut: dump the words near the tail and set `durationInFrames` to just after
the last word of an open-ended sentence (≈ word `to` + 15 frames of air):

```js
// print spoken words between two ABSOLUTE frames
const src = readFileSync("src/shorts/captionsData.ts", "utf8");
const words = JSON.parse(src.slice(src.indexOf("= [") + 2).replace(/;\s*$/, ""));
words.filter(w => w.from >= F1 && w.from <= F2).map(w => `${w.from}:${w.text}`)
```

Best loop lines: an open question ("…what runs instead?" → hook), or a
consequence that re-arms the premise ("…cut off by policy that afternoon." →
"CAN VANISH OVERNIGHT"). **Never cut mid-sentence** — always check the tail
words; two of the first three shorts originally chopped a sentence in half.

### Sequence offset gotcha (caption/PiP desync)
`useCurrentFrame()` RESETS to 0 inside a `<Sequence from={F}>`. Any
absolute-timed element rendered inside one (captions sliced by source frame, a
PiP playing the source video) must add `F` back (`clipFrom={spec.from + F}`,
`trimBefore={F}`) or it lags the audio by exactly `F` frames. This has bitten
twice — check it whenever captions or footage "don't match the audio".

### Beats: sync to the voice (the golden rule applies here too)
`beats[].at` = **(frame the phrase is SPOKEN) − from** — never earlier, or the
viewer reads the punchline before it's said. **Derive spoken frames from the
whisper data in `captionsData.ts`** (dump words with the snippet below) — it is
word-level ground truth. Do NOT anchor to the transcript's line timestamps or
the main video's `CARDS`: those are line STARTS, and the key phrase inside a
line lands **1–2.5 s later** (measured), which makes beats spoil early. The
FIRST beat may be a thematic scene-setter that matches the hook (spoils
nothing) so the panel opens populated.
Beats tile the clip (each holds until the next); when narration runs long, one
card holds — its internal motion (pulse, float, re-firing ring) carries it. A
crisp spoken list = a quick-fire run of 1–2s beats (big energy spike).

### Sound per short (all fires automatically from the spec)
- **Hook**: typewriter clicks under the word-slam.
- **Reframes** (full↔split): whoosh ×2.
- **Every beat**: whoosh + alternating accent (boom on beat 0, then whip/ding) +
  a soft tick.
- **CTA**: low boom on the reveal + ding as the button pops.
- **Music**: one low bed (~0.05) the whole clip. VO stays ×3 boosted and leads.
- Master each rendered short to **−14 LUFS** like everything else (§ render).

## Captions (whisper)
Word-level captions are auto-generated from the VO and stored (in absolute source
frames) in [captionsData.ts](captionsData.ts). Regenerate after new footage:

```bash
node scripts/transcribe.mjs   # extracts 16k wav, runs whisper, writes captionsData.ts
```

Each short slices the words inside its window automatically — one transcript
feeds every clip. Empty data = shorts still render, just without subtitles.

## Preview & render
- **Preview:** `npx remotion studio` → pick a `Short-*` composition.
- **Render (per short, 9:16 H.264 + −14 LUFS master):**
  ```bash
  npx remotion render Short-SilentDowngrade out/_raw.mp4 --concurrency=8
  ffmpeg -i out/_raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:a aac out/Short-SilentDowngrade.mp4
  ```
  (Few audio tags, so a single-pass render is fine — no split needed like the
  8-minute cut.) One 9:16 file posts to all three platforms.

## Safe zones
Keep text/faces in the center band: avoid the right ~12% and bottom ~18% (platform
UI). Captions sit ~360px up from the bottom; the hook sits below the top ~190px.
