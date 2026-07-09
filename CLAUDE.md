# CLAUDE.md — Motion-Design System (the visual framework for this project)

This project makes **AI YouTube explainers as dark-tech motion graphics** in
Remotion. This file is the **decision framework** Claude Code MUST apply to all
future long-form videos and Shorts/Reels — before creating or editing any scene.

For the technical *pipeline* (footage → overlay → combined cut → shorts → render/
QC, timing math, sound, render workarounds) see **[AGENTS.md](AGENTS.md)**. That
is *how*; this is *what it should look like and how to decide*.

**Golden rule (never violate):** on-screen graphics appear when the phrase is
SPOKEN, never before (`frame = seconds × 30`, `from ≈ spokenFrame − 6`).

---

## 1. Core visual philosophy

**The screen must not repeat the transcript.** The voiceover explains; the
visuals **simplify, dramatise, prove, or emotionally punch** the idea.

**The subject rule (never violate): for both long-form videos and Shorts, every
non-receipt scene must include an animated SUBJECT doing something.** Text is
only a label; the animation carries the idea. Use cartoons, animated objects,
simple characters, moving systems, visual metaphors, UI simulations, and
cause-and-effect motion instead of title cards. **If a scene only has text, an
icon, an underline, and background movement, it is not finished.**

Acceptable subjects (non-exhaustive): cartoon robot · model brain · speed
rocket · rocket booster module · model engine block · token coins · token pile ·
cost meter · warning siren · lock gate · workflow conveyor belt · prompt cards ·
API call stack · retry wheel · bug character · leaking bucket · Jenga tower ·
traffic jam · server rack · pipe/plumbing system · benchmark scoreboard · test
machine/bench · stopwatch · progress bar · work blocks · tiny developer
character. The subject must ACT: wait, test, block, reroute, speed up, fail,
stack, leak cost, check, retry, break, improve, refuse, unlock, collapse.

**Design the animated moment first** ("what happens in this scene?"), then
label it. Replace static icons with animated objects: a bolt becomes a speed
boost, a shield becomes a blocker, a coin falls into a meter, a warning flash
triggers a failure, a lock slams shut.

**Avoid:** animated PowerPoint slides · sentence-style bullet lists · full
transcript text on screen · repeated centred-title layouts · generic fade-in text
with no metaphor · scenes where nothing has agency.

**Prefer:** characters acting out ideas · machines assembling/launching/failing ·
physical gags (stacks collapsing, walls dropping, coins raining) · visual systems
· diagrams-in-motion · meters · status chips · warning states · source cards.

---

## 2. Scene modes (pick ONE per scene, then design to it)

| Mode | What it is | When |
|---|---|---|
| **A. Character scene** | A cartoon robot acts out the emotion/idea (poses, reactions, speech bubbles) | reactions, boredom, panic, waiting, being crushed by a problem |
| **B. Machine scene** | Blocks/modules/gauges do the action (bolt on, power up, launch, race) | product mechanics, "how it works", speed/upgrade beats |
| **C. Physics gag** | Objects obey cartoon physics (drop, squash, wobble, collapse, bounce off) | escalation, compounding cost, rejection, failure |
| **D. System-in-motion** | A diagram where things flow, queue, retry, break | processes, pipelines, bottlenecks, agent loops |
| **E. Receipt** | Doc/pricing/model-card as a styled source card (EXEMPT from subject rule) | proof of claims, quotes, official numbers |
| **F. Kinetic type** | Impact words + stamp, ≤ 3–4s only | transitions, one-line punches — never a full beat |

Route every beat to a mode FIRST. If a beat lands in F for more than ~4 seconds,
it's a slide — redesign it into A–D.

### Cartoon animation principles (apply in modes A–C)
- **Anticipation** — pull back before launching/dashing.
- **Squash & stretch** — on landings, drops, impacts.
- **Arcs** — spring-driven parabolas for fly-ins, never linear slides.
- **Secondary motion** — `Sparks`, `Puff`, `SpeedTrails`, wobble after landing.
- **Reaction beats** — the subject *responds* (pose change, alarm, celebrate).

---

## 3. Scene decision framework

For **every transcript beat, classify it first**, then design to the class:

| Beat type | Treatment | Scene / components |
|---|---|---|
| **HOOK / BIG CLAIM** | machine assembles + launches; hero text rides below | `HeroLaunchScene`, `FinalTakeawayScene`, `ImpactStamp` |
| **REACTIONS / HYPE** | characters act out both takes, then the point stamps in | `ReactionsScene` (robots + bubbles) |
| **PROBLEM** | bottleneck with a waiting character; broken systems; stalled bars | `WaitingScene`, `SystemBreakScene`, `StalledBar`, `WarningBadge` |
| **ESCALATION / COMPOUNDING** | physical stack grows, wobbles, collapses on someone | `StackCollapseScene`, `EscalationScene` |
| **COST AT SCALE** | user cards multiply + coins rain + meter climbs green→red | `ScaleCostScene`, `CostMeterClimb`, `TokenCoin` |
| **UPGRADE / MECHANISM** | module bolts onto block, gauge sweeps up | `SpeedLayerScene`, `SameCoreScene`, `SpeedModule`, `ModelBlock` |
| **SPEED COMPARISON** | same block races on two lanes, trails on the fast one | `RaceFasterScene` |
| **BARRIERS REMOVED (partially)** | robot obstacle course, some walls drop, one remains | `ObstacleRunScene` |
| **DEBUNK / "NOT MAGIC"** | wand rejected by shield, denied badges bounce off | `NotMagicScene` |
| **BORING-BUT-IMPORTANT** | sleepy robot slammed awake by warning light | `BoredMattersScene` |
| **HIDDEN COST / "CHEAPER?"** | meter drops, then retries/loops pump coins back in | `HiddenCostScene` |
| **SPEED FEEDS THE BILL** | belt of API calls speeds up, bill printer prints faster | `BillPrinterScene` |
| **FAST BUT FAILING** | boosted rocket crashes into the WRONG ANSWER wall | `SpeedWallScene` |
| **REAL STORY vs HYPE METRIC** | one meter crossed out, the other actually moves | `CheaperToServeScene` |
| **RELIEF / PAIN REMOVED** | pain badges pop away one by one, robot relaxes | `LessPainScene` |
| **SHINY METRIC HIDES MESS** | scoreboard placard drops, messy workflow + siren behind | `BenchmarksLieScene` |
| **DON'T DO X, DO Y** | robot + suitcase stopped by STOP sign, turns to test bench | `MigrateStopScene` |
| **DECISION THRESHOLD** | small result falls through trapdoor, big one opens the gate | `ThresholdGateScene` |
| **INFRASTRUCTURE / PLUMBING** | pipes under the flashy model; plumber robot fixes the leak | `PlumbingScene` |
| **OUTCOME > VOLUME** | robot pushes WORK blocks over the line; coins pile up dimly | `WorkOverTokensScene` |
| **CLOSING VERDICT** | stopwatch + work block cross the line, check stamps | `FinishCheckScene` |
| **EXPLANATION** | diagrams-in-motion, node flows, step chains | `FlowScene`, `StepsScene`, `WorkflowChain` |
| **PROOF / RECEIPT** | doc/browser cards, highlight sweep (mode E, exempt) | `SourceCardScene`, `HighlightSweep` |
| **COMPARISON** | side-by-side cards, meters | `CompareCard`, `BenefitMetersScene` |
| **NUMBERS** | animated counters dominate | `StatCountersScene`, `AnimatedCounter` |
| **TAKEAWAY** | one strong phrase + stamp | `FinalTakeawayScene`, `ImpactStamp` |
| **TRANSITION** | quick impact text, camera push (mode F, ≤ 4s) | `SceneCameraPush`, `LightSweep` |

If a beat's purpose isn't covered, **add a new scene type** — don't force it into
a title card.

---

## 4. Visual metaphor map (idea → default metaphor)

| Idea in the narration | Metaphor to reach for |
|---|---|
| speed / faster | speed trails, turbo gauge, race lanes, launch dash |
| upgrade without retrain | module BOLTS onto the same block; core stays constant |
| waiting / latency | queue of request cards in front of a thinking brain + stalled bar + impatient robot |
| costs compounding | cards physically stacking, wobbling, collapsing |
| cost at scale | coins raining + user grid multiplying + meter climbing green→red |
| hype vs indifference | two robots: alarmed vs shrugging — both miss the stamped POINT |
| "not magic" / limits | magic wand rejected by a guard shield |
| boring but important | sleepy robot slammed awake by a red warning wash |
| barriers partially removed | obstacle walls — most drop, ONE stays standing |
| same brain, faster path | identical block on two lanes, only trails differ |
| failure / breakage | workflow chain with an error node + retry loop + shake |
| hidden costs return | meter drops, then RETRY/LOOP/TOOL badges pump coins back in |
| more volume = bigger bill | accelerating conveyor + a bill printer keeping pace |
| fast but wrong | rocket with trails crashes into a labelled wall |
| vanity metric vs real metric | one meter crossed out, the other one moves |
| decision threshold | trapdoor for small results, gate opens for big ones |
| infrastructure / unglamorous work | pipes under the model; plumber robot fixes the leak |
| outcomes over volume | pushing WORK blocks over the finish line past a coin pile |
| proof | styled receipt card + highlight sweep on the exact line |

Use this map before inventing new visuals; extend it when a new idea appears.

---

## 5. Text-density rules

**On-screen text must not narrate.** Use text as *emphasis*, not explanation.

**Long-form YouTube:**
- **1 main headline** per scene — usually **1–4 words** (longer only when the
  phrase IS the whole point).
- **≤ 3 supporting labels**, each **1–4 words**. No full sentences.
- No long subtitles under cards. **≤ 12–16 total words** on screen (a
  source/receipt scene may show a little more).
- Big **numbers** are allowed to dominate; the narration explains them.
- Cut filler ("the", "a", "still", "actually", "basically", "it", "this") unless
  needed for meaning. Turn sentences into **labels / chips / states**:
  - "A small model guesses ahead" → **Draft**
  - "Right → skip ahead, faster" → **Correct → Skip**
  - "Base: DeepSeek V4 checkpoint / + speculative decoding module" → **V4
    checkpoint / + draft module**

**Shorts/Reels:**
- **One idea per beat**, **1–6 words**, large + mobile-readable.
- Visual reset every **1.5–3s**. Captions carry the speech; visual text is
  **punches** — warnings, numbers, labels, arrows, stamps, payoff lines.

---

## 6. Scene acceptance checklist (run before accepting ANY scene)

- [ ] **Is there an animated subject doing something?** (If not and it's not a
      receipt, redesign.)
- [ ] Would the scene still communicate something if the headline was removed?
- [ ] Is this more than a title card? More than icon + text + underline?
- [ ] Is there a cartoon/object/system/metaphor (§4)?
- [ ] Does the animation show **cause and effect**?
- [ ] Does the scene have a **beginning, action, and payoff**?
- [ ] Does the subject *react* at least once (pose change, impact, celebrate)?
- [ ] Is there anticipation before the big move, and secondary motion after?
- [ ] Is the text only supporting the animation? Can it be cut by ~40%?
- [ ] Is there ONE clear dominant idea? Can a viewer get it in under 1 second?
- [ ] Does something move every few seconds?
- [ ] Is it visually different from the previous scene (different mode §2)?
- [ ] Would this feel native to YouTube, not a corporate deck?
- [ ] (Shorts) Readable on mobile, muted? One idea? Resets every 1.5–3s?

If any answer is weak, **redesign the scene**. The goal is never "animated text
screens" — it is **tiny animated scenes**.

---

## 7. Visual component library (reuse/extend before writing one-offs)

**Subjects** (`src/motion/subjects.tsx`) — characters with agency:
- `GLASS` / `glassCard(color, borderW?)` — THE house finish for every card-like
  element (glass gradient + 2px alpha border + inner highlight + soft glow;
  rgba colours pass through safely). Never hand-roll `PANEL` + thick border.
- `CartoonRobot` — poses: `idle | waiting | sleepy | alarmed | shrug | celebrate |
  worried | walking | thinking | confused | facepalm | pointing`; blinks, bobs,
  hops, squashes; `accent` color; `lookX`/`lookY` eye-targeting (make it WATCH
  the action). PREMIUM build: glass shell, dark visor + glowing LED eyes,
  mitten hands, grounded contact shadow — never revert to flat outlines/white
  oval eyes.
- `BugCharacter` (`crawl | attack | squashed`) — the antagonist for bug/failure
  beats. `TinyDev` (`typing | panic | happy`) — the human proxy.
- `SpeechBubble` — THE shared comic bubble (`shout` variant); never re-implement.
- `MoveAlong` — walks a subject between two points (auto-flip + step puffs).
- `poseTimeline(frame, [[at, pose]…])` — one-line reaction beats;
  `impulse(frame, at)` — decaying hit shake; `useCartoonSpring(at)` — shared
  entrance squash-and-stretch physics.
- `ThoughtBubble` (animated dots), `Zzz`, `AlarmLines`, `Sweat` — attach to a subject.
- `Sparks` (impact burst at `at`), `Puff` (dust on landing).

**Objects** (`src/motion/objects.tsx`) — machines & physical props:
- `ModelBlock` — the model as a machine block (pulsing brain core + label plate).
- `SpeedModule` — flies in on an arc, BOLTS on (clunk + sparks), flame flickers.
- `SpeedTrails` — looping dash trails behind anything fast.
- `TokenCoin` — drops with squash; `CostMeterClimb` — green→amber→red level meter.
- `PromptQueue` — labelled request cards queueing (staggered entry, impatient nudge).
- `CardStackDrop` — cards drop/stack/wobble, then scatter-collapse at `collapseAt`.
- `ConveyorBelt` — THE shared belt (speed ramps); `RetryWheel` — THE shared
  retry loop; `JengaTower` — pull one block → wobble → collapse (risk-of-change);
  `LeakingBucket` — drains until the patch bolts on; `TrafficJam` — requests
  bunch + honk (2nd latency metaphor); `ServerRack` — LEDs/fans + `overheatAt`;
  `LockGate` — slams shut or springs open.

**Cinematics** (`src/motion/cinematics.tsx`) — camera feel & continuity:
- `SceneShell` props: `mood` (`danger` red pulse / `win` green sweep), `depth`
  (background grid + drifting props), `impacts=[frames]` (the CAMERA shakes on
  hits — use on every crash/slam/collapse), `tint` (ambient TOPIC hue — see the
  background-tint rule in §8).
- `LightLeak` — ONE premium moment per video (hero launch / final takeaway).
- `ExitWrap` — scene exits (`push | fade | puff | drop`) instead of hard cuts.
- `exitRight`/`enterLeft` — carry a subject across adjacent scenes (continuity).
- `DebugZones` — Studio-only bounding boxes to catch text/action overlaps.

**Text & sync**: `SceneHeadline` auto-fits long titles (never wraps); `Odometer`
(rolling-digit counter for money/scale), `LabelArrow` (draw-on callout for
screenshots/charts), `WordPop`/`SpokenWordPop` (pop ONE spoken word, whisper-timed).

**Sound**: scenes' action beats live in `src/motion/sfx-cues.ts` (retiming a
scene retimes its sound); `SfxCue rate={vary(i)}` pitch-varies repeated samples;
VO-reactive glow via `useVoiceLevel`/`VoiceGlow` (run `node scripts/voice-levels.mjs`
after new footage).

**Preview catalog**: the `TemplateLab` composition shows every component (~3s
each) — scrub it in Studio before designing scenes.

**Scenes** (`src/scenes/`) — full-screen, sit on `SceneShell` (bg + particles +
light sweep + camera push):
- `HeroLaunchScene` — module bolts onto block, rig launches with trails (hook).
- `ReactionsScene` — two robots (alarmed vs shrug) + THE POINT stamp.
- `BoredMattersScene` — sleepy robot slammed awake (boring-but-important).
- `ObstacleRunScene` — robot vs walls; most drop, one stays.
- `NotMagicScene` — wand rejected by shield + denied badges.
- `SpeedLayerScene` — module powers up + turbo gauge.
- `SameCoreScene` — constant core, shell segments click on around it.
- `RaceFasterScene` — same block, two lanes, trails on the fast one.
- `StackCollapseScene` — call cards pile up and collapse on a robot.
- `ScaleCostScene` — user grid multiplies + coins rain + meter climbs.
- `WaitingScene` — robot → prompt queue → thinking brain + stalled bar.
- **Metaphor scenes** (`src/scenes/MetaphorScenes.tsx`): `BillPrinterScene`,
  `HiddenCostScene`, `SpeedWallScene`, `CheaperToServeScene`, `LessPainScene`,
  `BenchmarksLieScene`, `MigrateStopScene`, `ThresholdGateScene`,
  `PlumbingScene`, `WorkOverTokensScene`, `FinishCheckScene` — as classified
  in §3.
- `TitleScene` / `FinalTakeawayScene` — kinetic type (mode F, ≤ ~1s transition
  beats ONLY — never a full beat).
- `SourceCardScene` — receipts (mode E). `FlowScene`, `StepsScene`,
  `StatCountersScene`, `EscalationScene`, `SystemBreakScene`,
  `BenefitMetersScene`, `CompareCard` — as classified in §3.

**Motion** (`src/motion/`): `LightSweep`, `ParticleField`, `SceneCameraPush`,
`ParallaxLayer`, `StatusChip`, `WarningBadge`, `ImpactStamp`, `LoadingRing`,
`StalledBar`, `GlowDivider`, `AnimatedCounter`, `FloatingPanel`, `HighlightSweep`,
`MetricCard` (cost/speed/usable), `WorkflowChain`/`WorkflowNode`/retry-loop.

**Icons/logos** (`src/components/Cartoons.tsx`): frame-animated SVG icons +
`DeepSeekMark`/`ClaudeMark`. Add new icons here in the same 100×100 SVG style;
never repeat an icon on adjacent scenes.

### 7.1 Animation backlog — approved concepts, build on demand

Twenty vetted subject/machine/gag concepts that fit the house style (premium
glass finish, cause-and-effect, a subject that ACTS). When a beat needs a new
visual, pull from here FIRST and extend the §4 metaphor map; build in
`src/motion/objects.tsx` or a scene file, then move it to the §7 list above.

| Concept | The action | Beats it serves |
|---|---|---|
| `BillPrinterOdometer` | rolling money counter feeds a printer; the receipt physically grows | cost accumulation |
| `PressureGauge` | needle climbs into the red, bolts rattle, steam vents at redline | load / limits / capacity |
| `TokenFaucet` | faucet drips token coins into a bucket; a wrench tightens it, drips slow | cost control / savings |
| `CircuitBreaker` — BUILT (shorts `breaker`) | overload meter climbs, the big switch TRIPS with sparks, robot resets it | rate limits / outage |
| `PipelineValve` | glowing packets flow through glass pipes; a valve reroutes them to a branch | routing / pipelines |
| `ForkliftBot` | robot forklift strains under a huge CONTEXT crate, tips, drops it | heavy context / payload |
| `LaunchHoldClock` | rocket on the pad, countdown clock PAUSES on a hold, then resumes | delays / windows / launches |
| `FirewallGrid` | laser gate — safe request cards pass, the flagged one is zapped mid-flight | safety filters / blocking |
| `BalanceScale` | items drop onto COST vs OUTPUT pans; the scale tips hard, subject reacts | tradeoffs / "worth it?" |
| `BatteryDrain` — BUILT (shorts `battery`) | segmented battery drains a chunk per task icon; docks to recharge | usage limits / credits |
| `TierElevator` — BUILT (shorts `elevator`) | elevator rides between HAIKU→SONNET→OPUS→FABLE floors; doors open on the pick | model tiers / routing |
| `InspectionScanner` | conveyor arch x-rays passing cards; one scans red and gets pulled | review / moderation |
| `BlueprintTable` | blueprint unrolls; robot draws nodes that light up into a live diagram | planning / architecture |
| `DominoChain` | labeled dominos topple in sequence; ONE gap stops the cascade | dependency chains / failure |
| `VaultDoor` | vault wheel spins, bolts retract, door swings open on a glowing core | access granted / premium unlock |
| `SignalTower` — BUILT (shorts `signal`) | antenna pulses rings; static interference cuts in; robot re-tunes the dish | uptime / API status |
| `TugOfWar` | two robots haul a rope across a metric line; one heaves, flag crosses | benchmarks / competition |
| `IceBlockThaw` | a feature frozen in ice; heat lamp + countdown melt it free, drips pool | frozen access thawing / promos |
| `StampArm` — BUILT (shorts `stamp`) | a factory stamper slams APPROVED / DENIED on passing cards at a gate | policy / decisions |
| `HourglassBudget` — BUILT (shorts `hourglass`) | hourglass of coin-sand flipped by the robot; grains leak from a crack | time-boxed budget / deadline |

Keep everything render-safe (React/SVG/CSS, frame-driven, no heavy deps).

---

## 8. Long-form video rules

- **Long-form scenes must not default to centred title cards.** A scene is only
  acceptable if it has a visual idea and animated action. Prefer cartoon
  explainer moments, object metaphors, workflow systems, UI simulations, and
  cause-and-effect animations. Talking head can appear as a supporting layer,
  but the main visual should usually be the animated concept.
- Keep the dark-tech cinematic motion-graphics identity.
- Do NOT make the edit mostly talking head — talking head is corner PiP / a quick
  reaction / an emphasis beat; motion graphics drive the visuals.
- **Every non-receipt scene has a subject doing something** (§1); route each beat
  to a mode (§2) and metaphor (§4) before writing code.
- Give subjects **reaction beats** synced to the VO — a pose change or impact on
  the spoken emphasis word sells the meaning.
- Every **30–45s** a larger visual reset (new scene MODE / metaphor / background
  treatment). Never two consecutive scenes in the same mode with the same layout.
- Sync animation beats tightly to the transcript; nothing lags the VO. **Every
  in-scene element with an `at` (chips, checks, stamps, dial stops, cards, flow
  nodes) must be pinned to its whisper word frame** — never a hardcoded stagger
  like `140 + i * 60`. If a shared scene has fixed internal timing, add
  per-element `at`/`nodeAts`/`chipAts` props instead of accepting drift.
- **Background tints match the topic** (`SceneShell tint`): green =
  savings/win, amber = cost/effort, red = trap/danger, cyan = system/process.
  Tints are BOLD (`TintWash`: ~25% alpha, three gradient geometries rotated by
  `particleSeed`) — a scene must never read as "the same dark navy". EVERY
  scene in a final cut gets a tint (pass it through shared scenes if missing),
  and adjacent scenes never share one — it's part of the visual reset.
- **Proportions kill the slide look**: subjects LARGE (robots ~230–300px,
  machine blocks ~390–440px wide), `SceneHeadline` titleSize ~60–64 (never
  80+ — if the text dominates the frame it's a presentation), something
  animating from frame 0 (idle bob, pop-in subject with `Puff`, running belt —
  never dead air before the first whisper anchor), and supporting chips as
  rotated STICKERS that spring-slam in (scale ~1.5–1.8 → 1, ±2–5° tilt,
  scattered offsets) — never a flat fading row. Camera `impacts` + a subject
  hop/kick on every landing, bolt, stamp and check.
- **Pacing breathes too**: element entrances settle in ~0.7–1.0s (spring
  stiffness ~110–190, `durationInFrames` 22–30, gentler for big panels/slides)
  — never everything snapping in under half a second; that reads frantic.
  Reserve the hard sub-0.5s snap for impact stamps. Grouped elements stagger
  ≥ 8–10f apart, and physical landings (hops, drops) get their Puff/impact at
  the TOUCHDOWN frame, not the launch frame.
- **Layout must breathe**: main subject groups sit ≥ ~110px apart at 1080p;
  absolutely-positioned props (coins, modules, stamps) never cover labels or
  the headline; piles/stacks actually stack (offset every item) — never render
  N items at identical coordinates.
- **Full-screen animation spans (no PiP):** the final cut must not show the
  corner PiP wall-to-wall. Mark hook, gag, system and payoff beats as
  `fullscreen` in the overlay's BEATS table and export the spans; the Final
  subtracts them from its PiP segments (min PiP segment ~3s — no flicker).
  Explanation/receipt beats keep the PiP. Aim for roughly a third of the
  runtime full-screen so the edit feels like a cartoon, not a presentation.
- Reusable components over one-off messy code; preserve render performance.

---

## 9. Shorts/Reels rules

**For Shorts/Reels, do not default to talking head or split-screen. The
animation can be full-screen and should often be the main visual. Each beat has
ONE animated subject doing one obvious action. Use text as labels, not
narration (1–6 words; visual text punches, captions carry the speech). Use
full-screen animation for hooks, reveals, jokes, failures, comparisons, and
payoffs. Use talking head only when it adds personality, credibility, or
reaction. Redesign Shorts vertically — never crop long-form layouts.**

Shorts use even STRONGER cartoon/action animation than long-form:

- Vertical-first 9:16; larger text than long-form; faster.
- **Animated-meme energy**: exaggerated cartoon reactions, bigger squash &
  stretch, harder pose snaps than long-form. Subjects overreact on purpose.
- Visual reset every **1.5–3s** — a new action, pose, or object event, not just
  new text.
- One simple idea per scene; no tiny source cards / dense diagrams / long
  captions as the main design / slow title-card reveals.
- Design for **muted** viewing; big action in the first second (a subject
  already mid-action beats a title fading in); understandable without audio.
- Shorts should feel like: animated meme explainer · cartoon metaphor · fast
  motion-graphic story · kinetic object animation · simple UI simulation ·
  visual punchline. NOT like: cropped long-form slides · talking head under a
  title card · text-heavy presentation clips · title/subtitle/icon templates.
- Final beat = a payoff or a **loop back to the hook** (loops = free replays).
- **Every short OPENS on the FACE** (Kris's call, July 2026): the hook +
  context line sit over the full-shot presenter for ~3.2s (`hookHold = 96`),
  then the split slides in — the layout is always either full shot or split
  screen at the open, never an animation cold-open. **The opener PUNCHES IN
  with a sound** (rule): the video starts SMALL — scale 0.5, floating on
  black — and zooms up to full frame over the first ~0.7s (ease-out cubic)
  with a whoosh at frame ~1, landing at exactly 1.0 so the framing is normal
  by the time the hook settles — built into VerticalShort, never remove it.
  Never zoom PAST 1.0 into the face: the 9:16 cover-crop is already tight,
  so 1.1+ reads "too zoomed in". **The 1-second gate** (viral-shorts data,
  2026): viewers decide in <1s, so the FIRST FRAME must already carry the
  promise — hook word 1 visible by ~0.1s, ALL hook words by ~0.4s, context by
  ~0.5s (HookTitle's near-instant stagger; never slow it back down), and the
  first frame doubles as the feed thumbnail — never open on an empty frame.
  Prefer 15–30s total (20–25s is the algorithm's sweet spot; >45s bleeds
  retention); plant a secondary hook beat around ~14s. `animHook: true` is an
  opt-in exception for when the first beat's gag IS the hook. Keep a beat at
  frame ~8 so the panel is populated the moment the split arrives. **Layout
  changes must DWELL**: the split view shows for ≥ ~3s or not at all —
  VerticalShort merges `fullscreen` spans closer than 90f, pushes a first
  span that starts < 90f after the split settles (face-first default), and
  with animHook runs the opening phase straight into an early first span.
  Never design a full → split → full bounce shorter than 3s; first
  `fullscreen` span starts ≥ ~190.
- **Cold-viewer context is mandatory** when the short names a product/model/
  event the hook doesn't explain: `ShortSpec.context` — ONE unboxed, dim,
  sentence-case line under the hook (≤ ~45 chars, single line), e.g.
  "Fable 5 = Claude's newest, priciest model". The `topic` banner carries the
  SUBJECT (e.g. "CLAUDE'S EFFORT DIAL"), not a vague tease, and fades in only
  AFTER the hook so the opening stays minimal (hook + context only — never
  three stacked boxes). Beats that name-drop cold get a clarifying `sub`
  bubble ("the ½-price Claude").
- **Every beat sets `Beat.tint`** — beats crossfade, so the wash colour sweeps
  with each 1.5–3s reset; no two adjacent beats share a colour.
- **Never hand-size big text**: beat labels go through `BeatLabel`'s auto-fit
  (≤ 730px), because full-anim spans zoom the panel ×1.32 and text must never
  cross the frame borders.
- **ALWAYS proofread the captions before shipping a short.** Whisper mangles
  product names ("Anthropic" → "Thorpek", "Claude" → "cloud"). After every
  whisper run: `transcribe.mjs` auto-fixes known mishears (extend its
  `JOINS`/`FIX` maps whenever a new one appears) and prints a REVIEW list of
  ambiguous ones — resolve every flagged word in context, then scrub each
  short's captions in Studio before rendering.

**In code** (`src/shorts/`): every beat is a `BeatScenes.tsx` subject scene
(`emote / queue / stack / bolt / coins / migrate / testbench / conveyor /
reject / retry / check / race / racks / battery / breaker / elevator /
hourglass / stamp / signal`) routed via `Beat.scene`; the legacy icon card is
a fallback (max ~1 per short). `ShortSpec.fullscreen` spans give the animation
the whole screen; `ShortSpec.animHook` opens the short on full-screen animation
under the hook title (house default — set it on every short). Also:
`ShortSpec.context` renders the plain-words setup line under the hook;
`Beat.tint` drives the per-beat `TintWash`; `Beat.emoji` pops ONE meme emoji on
a beat (~1 per short); the progress bar shows beat milestone ticks
automatically and fades in with the topic banner after the hook;
`ShortSpec.hookAlt` registers a `<id>-B` composition for A/B hook testing; the
final ~9 frames dip to dark so the auto-replay loop never visibly jumps; toggle
`showSafeZones` in Studio props to see platform-UI safe zones (never renders).

### Short-scene acceptance checklist (every beat)

- [ ] Is this just a title card?
- [ ] Is split-screen actually needed?
- [ ] Could this work better full-screen?
- [ ] Is there an animated subject doing something?
- [ ] Can the text be cut by half?
- [ ] Is the visual understandable without audio?
- [ ] Is the text readable instantly on mobile?
- [ ] Does the beat reset fast enough (1.5–3s)?
- [ ] Does it feel native to Shorts?

If the answer is weak, redesign the scene.

### Layout per beat (never force one template)

**Do not force every Short into split-screen or talking-head layouts.** Never
crop long-form layouts into a Short — redesign it. For each Short, choose the
strongest layout **per beat**: full-screen animation · split-screen ·
talking-head with overlays · source/screenshot zoom · kinetic text scene.

**Full-screen animation** (allowed and encouraged) when:
- the animated scene explains the idea better than the face
- the scene has a strong visual metaphor
- the text needs more space to be readable on mobile
- the action would feel cramped in split-screen
- the moment is a hook, reveal, joke, failure, comparison, or payoff
- the animation needs the viewer's full attention

**Talking head / split-screen** when:
- giving an opinion; the beat needs personal credibility
- reacting to something
- the animation is simple enough to sit beside the face
- a source, UI, or chart benefits from the face being present

**Default approach:** the hook can be full-screen animation; explanation
alternates full-screen ↔ split; punchlines/reveals are usually full-screen;
talking head is used **intentionally, not automatically**. The priority is
retention and clarity on mobile.

**In code:** `ShortSpec.fullscreen` spans drive the seam in
`src/shorts/VerticalShort.tsx` — the animation panel takes the whole screen
during a span (VO keeps playing; captions drop low; lower-third dodges spans).

---

## 10. External Asset Research for Videos and Shorts

For **every future Remotion video or Short**, run an asset research pass BEFORE
building or editing scenes. Goal: find external visual assets that make the video
more credible, current, and visually rich.

**Asset types to look for:** official logos · official product icons · brand
assets · official screenshots · model cards · pricing screenshots · benchmark
charts · public documentation screenshots · public GitHub screenshots · official
announcement images · source/reference cards · simple charts recreatable from
public data.

**Never:** randomly download from Google Images, or use copyrighted editorial
images, stock photos, or creator-made graphics unless the licence clearly allows
reuse. Prefer official sources: brand asset pages, documentation, GitHub repos,
press kits, screenshots of official pages.

**Tooling (use it — don't do §10 by hand):**
- `node scripts/fetch-assets.mjs <wishlist.json>` — downloads whitelisted brand
  files and captures page screenshots (headless Chrome/Edge) into
  `public/assets/external/…`, never overwrites, and auto-appends manifest
  entries. Licence judgement stays human: only put official sources in the wishlist.
- `node scripts/check-assets.mjs` — preflight before render: every manifest
  entry has its file + fields, no orphan files, every `staticFile("assets/external/…")`
  reference resolves and is manifested.
- **Data-as-assets:** extracted chart numbers live in
  `public/assets/external/charts/*.json` (with `sourceUrl` + `dateAccessed`,
  manifested like any asset); chart components import the JSON directly.
- **Components:** `SourceScreenshot` (browser-chrome card + pan/zoom to the crop
  + highlight sweep — the ONLY way screenshots appear), `LogoBadge`
  (tile/transparent treatment for any manifest logo), chart kit in
  `src/motion/charts.tsx` (`BarsIn`, `LineDraw`, `DonutFill`, `BarRace` + the
  `SourceChip` citation that must travel with every recreated chart), and
  `StatReceiptScene` (one big cited number).

### 10.1 Asset research pass
Before designing scenes, search the web for assets matching the transcript topic:
product/company logos, official docs, release notes, model cards, benchmark
pages, pricing pages, public charts, GitHub repos, screenshots supporting the
narration. Examples:
- **Claude video** → Anthropic/Claude logos, docs, pricing, model cards, release notes.
- **DeepSeek video** → DeepSeek logos, official announcements, model cards, benchmark tables, GitHub repos, API pricing pages.
- **OpenAI video** → OpenAI docs, model pages, pricing, release posts, API docs.
- **Agent video** → tool logos, MCP icons, GitHub pages, terminal screenshots, workflow diagrams, docs.

### 10.2 Licence and safety check
Before downloading/using any asset, check: official source? publicly accessible?
a logo/brand asset, doc screenshot, or source page that is fair to reference?
clear licence or brand-usage page? attribution required? likely copyrighted
editorial/stock/creator content?

**Avoid:** random Google Images results · copyrighted photos · paid stock ·
news images · other creators' thumbnails · other creators' charts unless clearly
licensed · assets with unclear origin · watermarked images · low-res/suspicious
files. **When unsure, do not use it** — recreate the idea as a Remotion graphic.

### 10.3 Prefer recreating charts
If a chart is useful, recreate it in Remotion from the underlying public data
instead of downloading someone else's chart image: find the original data source
→ extract the numbers → build a native Remotion chart/card/meter in project style
→ cite the source URL in the asset manifest. Only use a downloaded chart image if
it is from an official source with acceptable licence/usage.

### 10.4 Save assets properly
```
public/assets/external/logos/
public/assets/external/screenshots/
public/assets/external/charts/
public/assets/external/docs/
public/assets/external/references/
```
Clean descriptive filenames · optimise file size · preserve transparency for
SVG/PNG logos · avoid huge images unless needed · never overwrite existing assets.

### 10.5 Asset manifest
For every video, create/update `public/assets/external/asset-manifest.json`.
Each entry:
```json
{
  "filename": "deepseek-logo.svg",
  "localPath": "public/assets/external/logos/deepseek-logo.svg",
  "type": "logo",
  "sourceUrl": "https://...",
  "sourceName": "DeepSeek official site",
  "dateAccessed": "YYYY-MM-DD",
  "usageNote": "Official logo used for commentary/reference in video",
  "usedIn": ["intro", "comparison scene"],
  "attributionRequired": false,
  "concerns": null
}
```

### 10.6 Use assets meaningfully
No decoration-only logos. Use external assets for: credibility · source receipts
· product identification · comparisons · timelines · pricing/model-card
references · proof of claims · visual context. Examples: logo on a model
comparison card; official pricing page as a receipt card; model-card screenshot
sliding in with highlight sweep; GitHub screenshot during implementation talk;
recreated benchmark chart during the performance section.

### 10.7 Remotion integration
- Import/reference from `public/assets/external/`.
- Animate in the project's dark-tech style: masks, cards, glows, borders,
  parallax, highlight sweeps.
- Never dump raw screenshots full-screen without design treatment; crop and zoom
  to the relevant section; keep them readable; use source-card styling for
  credibility moments.
- **Long-form:** assets for source cards, comparisons, timelines, model cards,
  logos, credibility moments; don't clutter every scene with logos; one
  source/receipt moment every time a factual claim needs proof.
- **Shorts:** fewer external assets — logos, simple screenshots, big numbers,
  recreated charts; no tiny source text; zoom aggressively into the relevant
  part; keep each asset on screen long enough to understand.

### 10.8 If no safe asset exists
Create a native Remotion graphic instead: abstract UI cards, text labels, simple
icons, a recreated chart. Do not force external images.

### 10.9 Final asset report
After editing the video, report: assets found · assets downloaded · assets
rejected and why · where each asset is used · sources used · any remaining
attribution/licence concerns.

### 10.10 Apply automatically
Run this asset research process before final scene design on all future videos
and Shorts. Never blindly download — **search, evaluate, save, document, then
integrate only assets that improve the video.**

---

## 11. Default design pattern (per scene)

1. Identify the beat purpose (§3) and pick a scene mode (§2).
2. Pick the metaphor from the map (§4) — extend the map if it's new.
3. Decide **who the subject is and what it does** (with a reaction beat).
4. Cut on-screen text to the minimum (§5).
5. Add motion that matches the meaning (anticipation → action → secondary motion).
6. If Shorts: check mobile readability / muted clarity / 1.5–3s resets.
7. Run the acceptance checklist (§6).

---

## 12. Anti-patterns (explicitly avoid)

- Centred headline + three bullets as the default layout.
- A scene where nothing has agency — text and icons floating with no actor.
- Long subheadings; repeating every spoken phrase on screen.
- Generic fade-in text; static cards that don't animate meaningfully.
- Linear slides where an arc/spring should be; impacts with no squash or sparks.
- **Flat clip-art props** — giant solid-colour icons (a big padlock), plain
  solid rectangles as machinery, 3px flat borders. Panels get a PREMIUM finish:
  glass gradient fill + thin (2px) alpha border + inner top highlight + soft
  colour glow; props get texture (hazard stripes, bezels, pivots); sticker
  tilts cap at ~±3°. Big icons NEVER float bare — seat them on a glass
  app-tile (rounded glass panel, accent glow). Prefer the tech objects
  (ModelBlock, meters, racks) over oversized icons for hero moments.
- Diagrams with too many tiny labels; source text unreadable on mobile.
- The same layout or mode in consecutive scenes.

---

## 13. Apply this automatically

For **all future Remotion work in this project**, Claude Code MUST apply this
framework before creating or editing scenes: **run the asset research pass (§10)
→ classify the beat (§3) → pick the mode (§2) and metaphor (§4) → give it a
subject that DOES something (§1) → apply the text-density rules (§5) → use the
component library (§7) → run the checklist (§6).** When in doubt, fewer words +
a stronger visual + a subject acting it out.
