import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// `from` = start frame in the source footage (sec × 30). `beats[].at` is
// anchored to the WHISPER word times in captionsData.ts (NOT line timestamps).
// Loop endings cut on an open line. Every beat is an animated SUBJECT scene
// (BeatScenes.tsx); `text` is a label (1–4 words) — captions carry the speech.
// See README.md for the method + rubric. CLAUDE.md §9.
// ============================================================================
export const SHORTS: ShortSpec[] = [
  // ==========================================================================
  // FABLE-COUNTDOWN video (talking-head.mp4) — whisper frames from
  // captionsData.ts.
  // ==========================================================================
  {
    id: "Short-PriceReal",
    label: "Free window ends July 12 — then $10/M in, $50/M out",
    source: "talking-head.mp4",
    from: 613, // "and that is where the price gets very real" (0:20.4)
    // LOOP: ends on "…every Fable 5 run becomes a cost decision." (abs 1514) → replays into the price.
    durationInFrames: 916, // ~31s
    topic: "5 DAYS OF FREE FABLE 5",
    hook: "YOUR FREE AI EXPIRES SOON",
    hookAlt: "FABLE 5 GOES PAID JULY 12", // A/B variant → Short-PriceReal-B
    context: "Fable 5 free access ends July 12",
    animHook: true,
    beats: [
      { at: 8, scene: "coins", tint: "#F59E0B", text: "THE PRICE GETS REAL" }, // scene-setting under the hook; "price gets very real" abs 645
      { at: 73, scene: "check", obj: "coin", verdict: "warn", tint: "#EF4444", text: "$10 / M INPUT" }, // "$10 per million input" abs 692
      { at: 153, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "$50 / M OUTPUT", emoji: "💸" }, // "$50 per million output" abs 772
      { at: 263, scene: "check", obj: "brain", verdict: "check", tint: "#06B6D4", text: "WORTH IT?" }, // "should you use fable 5" abs 882
      { at: 476, scene: "conveyor", labels: ["CLEAN RULES"], tint: "#34D399", text: "MY CLEAN RULES" }, // "clean rules" abs 1093
      { at: 576, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "RESULT", tint: "#06B6D4", text: "CHANGES THE RESULT?" }, // "smarter model changes the result" abs 1195
      { at: 636, scene: "reject", badge: "ROUTINE PROMPTS", tint: "#EF4444", text: "DON'T WASTE IT" }, // "routine prompts" abs 1255
      { at: 751, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "AFTER JULY 12" }, // "after July 12th" abs 1370
    ],
    // full-anim: the $50 shock + the don't-waste-it payoff
    fullscreen: [{ from: 150, to: 300 }, { from: 640, to: 780 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-MessyLaunch",
    label: "Launched, restricted, back, countdown — the messiest launch yet",
    source: "talking-head.mp4",
    from: 3865, // "Still, the timing is messy." (2:08.8)
    // LOOP: ends on "…the controversy is not clean." (abs 5290) → replays into "timing is messy".
    durationInFrames: 1440, // ~48s
    topic: "FABLE 5'S WEIRD LAUNCH",
    hook: "THE MESSIEST AI LAUNCH YET",
    context: "Fable 5 = Claude's new top model",
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#06B6D4", text: "A MESSY LAUNCH" }, // scene-setting under the hook; "timing is messy" abs 3920
      { at: 154, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "LAUNCH", tint: "#34D399", text: "LAUNCHED" }, // "it launched" abs 4025
      { at: 184, scene: "check", obj: "shield", verdict: "cross", tint: "#EF4444", text: "RESTRICTED" }, // "got restricted" abs 4055
      { at: 216, scene: "conveyor", labels: ["BACK"], tint: "#06B6D4", text: "CAME BACK" }, // "came back" abs 4087
      { at: 258, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "BEHIND A COUNTDOWN" }, // "shoved behind a countdown" abs 4129
      { at: 356, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#EF4444", text: "SO MUCH DRAMA", emoji: "🎭" }, // "a lot more drama" abs 4227
      { at: 494, scene: "stack", tint: "#F59E0B", text: "JUNE 12: SHUTDOWN" }, // "June 12th… export controls" abs 4365
      { at: 924, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "LIFTED → BACK GLOBAL" }, // "controls were lifted" abs 4795
      { at: 1106, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "SAFETY", tint: "#06B6D4", text: "NEW SAFETY LAYER" }, // "new safety layer" abs 4977
      { at: 1284, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "BLOCKS 99%" }, // "over 99% of cases" abs 5155
    ],
    // full-anim: the four-act drama run + the safety-layer reveal
    fullscreen: [{ from: 154, to: 330 }, { from: 1180, to: 1309 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Swapped",
    label: "Risky requests get rerouted — you may not get the model you picked",
    source: "talking-head.mp4",
    from: 6429, // "do not blindly build your entire workflow around it" (3:34.3)
    // LOOP: ends on "…some requests depend on safety routing." (abs 7347) → replays into the warning.
    durationInFrames: 933, // ~31s
    topic: "IS IT EVEN FABLE 5?",
    hook: "YOUR AI CAN BE SWAPPED",
    context: "Anthropic can reroute risky Fable 5 requests",
    animHook: true,
    beats: [
      { at: 8, scene: "stack", tint: "#F59E0B", text: "DON'T BUILD ON IT" }, // scene-setting under the hook; "blindly build" abs 6472
      { at: 139, scene: "check", obj: "shield", verdict: "warn", labels: ["SECURITY", "COMPLIANCE", "CODE"], tint: "#06B6D4", text: "HIGH-STAKES WORK?" }, // "security, compliance…" abs 6574
      { at: 321, scene: "reject", badge: "RISKY REQUEST", tint: "#EF4444", text: "REROUTED AWAY" }, // "route risky requests away" abs 6756
      { at: 409, scene: "emote", pose: "confused", tint: "#F59E0B", text: "NOT WHAT YOU PICKED", emoji: "🤨" }, // "not getting the model you thought" abs 6844
      { at: 503, scene: "check", obj: "brain", verdict: "warn", tint: "#06B6D4", text: "MOST PEOPLE MISS THIS" }, // "the part most people miss" abs 6938
      { at: 626, scene: "coins", tint: "#EF4444", text: "EXPENSIVE…" }, // "not just expensive" abs 7061
      { at: 715, scene: "queue", labels: ["PLAN", "LIMITS", "ROUTING"], tint: "#F59E0B", text: "…AND CONDITIONAL" }, // "it is also conditional" abs 7131
    ],
    // full-anim: the reroute gag + the reveal
    fullscreen: [{ from: 321, to: 470 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Specialist",
    label: "Don't burn the window on FOMO — use Fable 5 like a specialist",
    source: "talking-head.mp4",
    from: 7895, // "But do not use it just because the timer is running out." (4:23.2)
    // LOOP: ends on "…only use it when the output is worth the credit cost." (abs 8867) → replays into the warning.
    durationInFrames: 987, // ~33s
    topic: "USE FABLE 5 RIGHT",
    hook: "STOP WASTING YOUR FREE AI",
    context: "Free Fable 5 access ends July 12",
    animHook: true,
    beats: [
      { at: 8, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "TIMER FOMO?" }, // scene-setting under the hook; "timer is running out" abs 7940
      { at: 102, scene: "coins", tint: "#EF4444", text: "A WASTED WINDOW" }, // "waste the free window" abs 8003
      { at: 234, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "HIRE THE SPECIALIST", sub: "Fable 5" }, // "knowledgeable specialist" abs 8135
      { at: 312, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "HARD PART", tint: "#06B6D4", text: "THE HARDEST PARTS" }, // "hardest parts" abs 8213
      { at: 385, scene: "conveyor", labels: ["OPUS", "SONNET"], tint: "#34D399", text: "THE REST → CHEAPER" }, // "back to Opus or Sonnet" abs 8286
      { at: 514, scene: "emote", pose: "celebrate", tint: "#06B6D4", text: "EXPENSIVE THINKING", sub: "cheap execution" }, // "expensive thinking" abs 8415
      { at: 706, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "BEFORE: HARDEST WORK" }, // "before July 12" abs 8607
      { at: 840, scene: "check", obj: "coin", verdict: "warn", tint: "#F59E0B", text: "AFTER: WORTH IT?" }, // "after July 12" abs 8741
    ],
    // full-anim: the specialist handoff + the decision rule
    fullscreen: [{ from: 234, to: 400 }, { from: 700, to: 855 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
];

