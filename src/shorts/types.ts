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
  | "racks";     // server racks + fans (physical-infrastructure beats)

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
  // Scroll-stopping line, held over the first ~2.2s. IF the hook alone doesn't
  // tell a cold viewer what the video is about, make the `topic` question carry
  // the subject ("IS YOUR AI BEING SWAPPED?") — no separate context strip.
  hook: string;
  beats: Beat[]; // big key-phrase pops on the punch lines (lower third)
  // Layout: spans (clip-local frames) where the ANIMATION takes the FULL screen
  // (face hidden, VO keeps playing). Use for reveals, punchlines, big numbers and
  // payoffs where the metaphor carries the beat better than the face — never
  // force every beat into split-screen (CLAUDE.md §9). Constraints: sorted,
  // non-overlapping, from ≥ ~82 (after the hook split settles), to ≤
  // durationInFrames − 116 (before the CTA close), ≥ 24 frames between spans.
  fullscreen?: { from: number; to: number }[];
  // Animation-first hook: the short OPENS on full-screen animation (under the
  // HookTitle) instead of the full-screen face. Use when the first beat's gag
  // IS the hook. Requires a beat at/near frame 0 so the screen is never empty.
  animHook?: boolean;
  // A/B hook test: registers a second composition (`<id>-B`) identical except
  // for this hook line. Render both, post both, keep the winner.
  hookAlt?: string;
  outro: string; // CTA shown in the last ~3s (e.g. "FOLLOW FOR MORE")
  music?: string; // optional low bed in public/music/ (e.g. "music/tension.MP3")
  style?: VideoStyle; // brand look — "cinematic" (default) or "bold"
};
