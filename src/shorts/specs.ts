import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — mined from the DeepSeek "DSpark" video. Each = one vertical clip.
// `from` = start frame in the source footage (sec × 30). `beats[].at` is anchored
// to the WHISPER word times in captionsData.ts (NOT line timestamps). Loop endings
// cut on an open line. See README.md for the method + rubric.
// Every beat is an animated SUBJECT scene (BeatScenes.tsx); `text` is a label
// (1–4 words) — captions carry the speech. CLAUDE.md §9.
// ============================================================================
export const SHORTS: ShortSpec[] = [
  {
    id: "Short-Waiting",
    label: "Why agents feel slow — it's not intelligence, it's waiting",
    source: "talking-head.mp4",
    from: 1127, // "the problem with AI agents… is not just intelligence. It's waiting." (0:37.6)
    // LOOP: ends on "…it feels like the product is broken." (abs 1903) → replays into the hook.
    durationInFrames: 800, // ~27s
    topic: "IS IT SLOW OR JUST WAITING?",
    hook: "WHY YOUR AI AGENT FEELS SLOW",
    beats: [
      { at: 79, scene: "emote", pose: "shrug", text: "NOT INTELLIGENCE" }, // "intelligence" abs 1206
      { at: 131, scene: "queue", labels: ["PROMPT", "TOOL", "RETRY"], text: "WAITING" }, // "It's waiting" abs 1258
      { at: 236, scene: "check", obj: "clock", verdict: "warn", text: "TOOL CALLS" }, // "tool to call" abs 1363
      { at: 331, scene: "retry", text: "RETRIES" }, // "the agent to realize it messed up" abs 1458
      { at: 541, scene: "stack", text: "IT COMPOUNDS" }, // "one model call feels fine" abs 1668
      { at: 703, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "BROKEN" }, // "ten calls… broken" abs 1830
    ],
    // full-anim: the "WAITING" bottleneck reveal + the compounding collapse
    fullscreen: [{ from: 131, to: 236 }, { from: 541, to: 680 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-SpeedTrap",
    label: "Speed won't fix a broken AI — a faster failure is still a failure",
    source: "talking-head.mp4",
    from: 5057, // "So the question is not, is D-Spark faster?" (2:48.6)
    // LOOP: ends on "…is still a problem." (abs 5735) → replays into the hook.
    durationInFrames: 696, // ~23s
    topic: "FASTER — BUT IS IT BETTER?",
    hook: "SPEED WON'T FIX A BROKEN AI",
    beats: [
      { at: 64, scene: "bolt", trails: true, text: "FASTER?", sub: "wrong question" }, // "is D-Spark faster?" abs 5121
      { at: 151, scene: "coins", text: "CHEAPER?" }, // "does my workflow get cheaper?" abs 5208
      { at: 348, scene: "reject", badge: "FAILED TASK", text: "STILL FAILED" }, // "a faster failed task is still failed" abs 5405
      { at: 458, scene: "check", obj: "bug", verdict: "cross", text: "STILL WRONG" }, // "faster hallucination…" abs 5515
      { at: 584, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "STILL BREAKS" }, // "breaks your app" abs 5641
    ],
    // full-anim: the "faster, still failed/wrong" punchline run needs full attention
    fullscreen: [{ from: 348, to: 576 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-TestFirst",
    label: "Don't switch AI models on hype — test with 3 questions",
    source: "talking-head.mp4",
    from: 8571, // "Do not migrate because of DSpark. Test." (4:45.7)
    // LOOP: ends on "…if only the benchmark looks good, wait." (abs 9372) → replays into the hook.
    durationInFrames: 819, // ~27s
    topic: "IS THE NEW MODEL WORTH IT?",
    hook: "DON'T SWITCH AI MODELS YET",
    // the migrate gag IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 6, scene: "migrate", text: "DON'T MIGRATE" }, // "Do not migrate" abs 8571
      { at: 84, scene: "testbench", labels: ["CURRENT", "DSPARK"], text: "TEST FIRST" }, // "Test" abs 8655
      { at: 184, scene: "conveyor", labels: ["CURRENT", "DSPARK"], text: "ONE WORKFLOW" }, // "Take one workflow…" abs 8755
      { at: 413, scene: "check", obj: "gauge", labels: ["TIME", "SUCCESS", "COST"], text: "MEASURE 3" }, // abs 8984
      { at: 479, scene: "check", obj: "clock", verdict: "check", text: "FASTER?" }, // "finish faster?" abs 9050
      { at: 539, scene: "check", obj: "shield", verdict: "check", text: "SUCCEED?" }, // "still succeed?" abs 9110
      { at: 602, scene: "check", obj: "coin", verdict: "check", text: "COST LESS?" }, // "cost less?" abs 9173
      { at: 708, scene: "emote", pose: "celebrate", accent: "#34D399", text: "SHIP IT" }, // abs 9199
    ],
    // full-anim: the quick-fire 3-question checklist — cramped in split
    fullscreen: [{ from: 413, to: 648 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Numbers",
    label: "The DSpark speed numbers — and why they're not a bill cut",
    source: "talking-head.mp4",
    from: 3878, // "The reported claim is that DSpark can make V4 Flash…" (2:09.3)
    // LOOP: ends on "…that's not how production works." (abs 4707) → replays into the hook.
    durationInFrames: 848, // ~28s
    topic: "IS IT ACTUALLY CHEAPER?",
    hook: "85% FASTER ISN'T 85% CHEAPER",
    // the speed-layer bolt-on IS the scene-setter — open on full-screen animation
    animHook: true,
    beats: [
      { at: 12, scene: "bolt", text: "DSPARK", sub: "speed layer" }, // scene-setter
      { at: 153, scene: "bolt", trails: true, warn: "NOT ALWAYS CHEAPER", text: "60–85%", sub: "V4 FLASH" }, // abs 4031
      { at: 387, scene: "race", text: "57–78%", sub: "V4 PRO" }, // abs 4265
      { at: 588, scene: "emote", pose: "worried", accent: "#F59E0B", text: "CAREFUL" }, // abs 4466
      { at: 718, scene: "coins", text: "NOT 85% OFF" }, // "your bill drops by 85%" abs 4596
    ],
    // full-anim: the 60–85% number IS the hook payoff — give it the whole screen
    fullscreen: [{ from: 153, to: 380 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Infra",
    label: "DSpark is an infrastructure moment, not an AI moment",
    source: "talking-head.mp4",
    from: 10147, // "So here's the actual takeaway. DSpark is not an AGI moment." (5:38.2)
    // LOOP: ends on "…say their workflows got cheaper." (abs 10892) → replays into the hook.
    durationInFrames: 763, // ~25s
    topic: "AGI OR JUST PLUMBING?",
    hook: "IT'S NOT AN AI MOMENT",
    beats: [
      { at: 19, scene: "emote", pose: "idle", text: "THE TAKEAWAY" }, // "the actual takeaway" abs 10166
      { at: 94, scene: "reject", badge: "AGI", text: "NOT AGI" }, // "not an AGI moment" abs 10241
      { at: 136, scene: "bolt", trails: true, text: "INFRASTRUCTURE" }, // abs 10283
      { at: 287, scene: "coins", text: "NEW ECONOMICS" }, // "change the economics" abs 10434
      { at: 382, scene: "conveyor", labels: ["DONE"], text: "WORK WINS" }, // "faster completed work…" abs 10529
      { at: 460, scene: "emote", pose: "shrug", text: "IGNORE HYPE" }, // "ignore the AGI screaming" abs 10607
      { at: 724, scene: "check", obj: "gauge", verdict: "check", text: "CHEAPER?" }, // abs 10871
    ],
    // full-anim: the "not AGI → infrastructure" reveal is the whole short
    fullscreen: [{ from: 94, to: 280 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
];
