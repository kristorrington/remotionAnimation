import { RobotPose } from "../motion/subjects";

// Which animated cartoon icon a beat shows (legacy kinetic card — use sparingly).
export type IconKey =
  | "claude" | "silent" | "change" | "bug" | "shield" | "route"
  | "gate" | "guard" | "block" | "stack" | "globe" | "gauge" | "chip" | "price"
  | "deepseek" | "thinking" | "clock" | "bolt" | "rocket" | "coindown" | "unlock" | "brain" | "error";

// Animated SUBJECT scenes for beats (BeatScenes.tsx) — a robot/object/system
// acting out the idea. PREFER these over `icon` cards (CLAUDE.md §9).
export type BeatSceneKey =
  | "emote"      // big robot pose + optional speech bubble (sub = bubble text)
  | "queue"      // robot → prompt queue → thinking brain + stalled bar
  | "stack"      // call cards pile up and collapse on a robot
  | "bolt"       // DSpark module bolts onto the model block (trails/warn opts)
  | "coins"      // token coins rain into the climbing cost meter
  | "migrate"    // robot + suitcase → MIGRATE gate → STOP sign → test bench
  | "testbench"  // workflow card into the test rig → verdict chips + check
  | "conveyor"   // workflow card on a belt → two timed lanes (or DONE + check)
  | "reject"     // a badge bounces off the guard shield
  | "retry"      // a call card loops the retry wheel, erroring each lap
  | "check"      // one big object gets a verdict stamped (quick-fire beats)
  | "race"       // same block, two lanes, trails on the fast one
  | "racks"      // server racks + fans (physical-infrastructure beats)
  | "battery"    // segmented allowance battery drains to `value`% (limits)
  | "breaker"    // load meter climbs until the big switch TRIPS (cutoffs)
  | "elevator"   // model-tier lift rides to floor `value` in `labels` (tiers)
  | "hourglass"  // deadline sand FLIPS (date moved) then leaks (pressure stays)
  | "stamp"      // arm slams APPROVED/DENIED (`verdict`) on the `badge` card
  | "signal"     // status tower: static/amber, or clean green (`verdict: check`)
  | "doors"      // path picker: doors from `labels`, door `value` opens
  | "buyers"     // 3-people test: THREE buyer slots (+ robot); verdict "cross" = all ✗
  | "funnel"     // messy docs pour in, ONE clean report (`badge`) pops out
  | "cartridge"  // SKILL.MD (`badge`) clicks into the model; identical runs pop out
  | "receipt";   // REAL page screenshot receipt (`shot`) — zoom hard, big headlines only

// Image-pixel rectangle for receipt shots (crop / highlight regions).
export type ShotRect = { x: number; y: number; w: number; h: number };

// A "beat" = one tiny animated scene in the animation zone. `at` is relative to
// the CLIP start. Beats should tile the whole clip so the zone is never empty.
// `text` is a LABEL (1–4 words, max 6) — the captions carry the speech.
export type Beat = {
  at: number;
  text: string;
  sub?: string; // small chip / bubble text — keep to 1–3 words
  scene?: BeatSceneKey; // animated subject scene (preferred)
  icon?: IconKey; // legacy icon card fallback — max ~1 per short
  pose?: RobotPose; // emote
  accent?: string;
  tint?: string; // ambient wash colour for this beat (TintWash); falls back to a rotating palette
  labels?: string[]; // queue cards / lane names / chips
  badge?: string; // reject: the label that bounces off
  obj?: "clock" | "shield" | "coin" | "bug" | "gauge" | "brain"; // check
  verdict?: "check" | "warn" | "cross"; // check / testbench
  trails?: boolean; // bolt: speed trails after landing
  warn?: string; // bolt: amber warning tag
  blockLabel?: string; // bolt: the machine block's plate (default "V4")
  moduleLabel?: string; // bolt: the bolt-on module's label (default "DSPARK")
  stamp?: string; // coins: impact stamp text
  emoji?: string; // meme punch: ONE emoji pops with the beat (use ~1 per short)
  value?: number; // battery: target % · elevator: target floor index in `labels`
  // receipt: the manifested screenshot + the crop that proves the claim.
  // Crop AGGRESSIVELY (big headlines only — no tiny source text on mobile).
  // Default card is 780×500 — safe under the ×1.32 span zoom even when the
  // beat's window CROSSFADES INTO a fullscreen span; don't override upward.
  shot?: {
    src: string; url: string; imageW: number; imageH: number;
    from?: ShotRect; to: ShotRect; zoomAt?: number;
    highlight?: ShotRect; highlightAt?: number;
    cardW?: number; cardH?: number;
  };
};

// One short = one data entry. To turn a viral transcript moment into a Short,
// add a ShortSpec (see specs.ts + README.md). `from` is the start frame in the
// SOURCE footage timeline (frame = seconds × 30); everything else is clip-local.
import { VideoStyle } from "../theme";

export type ShortSpec = {
  id: string; // Remotion composition id, e.g. "Short-SilentDowngrade"
  label: string; // human note — why this moment is a good short
  source: string; // footage file in public/, e.g. "talking-head.mp4"
  from: number; // start frame in the source footage
  durationInFrames: number; // clip length (30 fps → 900 = 30s, 1200 = 40s)
  // Persistent top-center banner. Phrase it as a short CURIOSITY QUESTION that
  // the video answers ("WOULD YOU EVEN NOTICE?") — an open loop that keeps
  // people watching. Complement the hook, don't repeat it. Keep ≤ ~24 chars.
  topic: string;
  // Scroll-stopping line, held over the first ~3.2s. IF the hook alone doesn't
  // tell a cold viewer what the video is about, make the `topic` question carry
  // the subject ("IS YOUR AI BEING SWAPPED?") AND set `context` below.
  hook: string;
  // ONE plain-words setup line shown under the hook (sentence case, unboxed,
  // dim — it must not compete with the hook). Names the subject for cold
  // viewers, e.g. "Fable 5 = Claude's newest, priciest model". Keep ≤ ~45
  // chars so it stays a SINGLE line. REQUIRED whenever the short references a
  // product, model or event that the hook doesn't explain by itself.
  context?: string;
  beats: Beat[]; // big key-phrase pops on the punch lines (lower third)
  // Layout: spans (clip-local frames) where the ANIMATION takes the FULL screen
  // (face hidden, VO keeps playing). Use for reveals, punchlines, big numbers and
  // payoffs where the metaphor carries the beat better than the face — never
  // force every beat into split-screen (CLAUDE.md §9). Constraints: sorted,
  // non-overlapping, from ≥ ~112 (after the hook split settles; leave the
  // split ~1.5s before the first span so the face never blips), to ≤
  // durationInFrames − 140 (layout transitions are ~26f eased ramps as of
  // 07/2026 — a span ending later collides with the CTA return at dur−114).
  // The split must DWELL ≥ ~3s: VerticalShort auto-merges
  // spans closer than 90f, and a first span starting < 90f after the hook
  // settles extends the opening full-screen phase instead (no face blip).
  fullscreen?: { from: number; to: number }[];
  // Animation-first hook (opt-in EXCEPTION): open on full-screen animation
  // instead of the face. HOUSE DEFAULT is the FACE opener — every short
  // starts on the presenter (full shot, hook + context over it) and the
  // animation arrives with the split. Use animHook only when the first
  // beat's gag IS the hook. Either way keep a beat at frame ~8 so the panel
  // is populated the moment it appears.
  animHook?: boolean;
  // A/B hook test: registers a second composition (`<id>-B`) identical except
  // for this hook line. Render both, post both, keep the winner.
  hookAlt?: string;
  outro: string; // CTA shown in the last ~3s (e.g. "FOLLOW FOR MORE")
  music?: string; // optional low bed in public/music/ (e.g. "music/tension.MP3")
  style?: VideoStyle; // brand look — "paper" (shorts default look), "cinematic", "bold"
};
