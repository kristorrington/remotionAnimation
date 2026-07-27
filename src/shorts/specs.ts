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
  // AI-news-this-week video (talking-head.mp4, 2026-07-27).
  {
    id: "Short-BenchmarkBreach",
    label: "THE HOOK: a cyber benchmark breached Hugging Face for real",
    source: "talking-head.mp4",
    from: 1290, // "how does a benchmark end with a company getting compromised?"
    // LOOP: ends "…against Hugging Face itself." (~2260) → replays into the hook.
    durationInFrames: 1050, // ~35s
    topic: "AI SECURITY",
    hook: "A TEST THAT HACKED A COMPANY",
    context: "A cyber eval breached Hugging Face for real",
    beats: [
      { at: 8, scene: "receipt", tint: "#C65B52", text: "the disclosure", shot: { src: "assets/external/screenshots/ainews-delangue-hf.png", url: "x.com/ClementDelangue", imageW: 1100, imageH: 1440, from: { x: 0, y: 0, w: 1100, h: 1000 }, to: { x: 0, y: 0, w: 1100, h: 1440 }, zoomAt: 0 } }, // "caught, contained at record speed" (8)
      { at: 245, scene: "emote", pose: "alarmed", tint: "#C9913D", text: "NO GUARDRAILS ON" }, // "ran without production classifiers" (1530-1715)
      { at: 573, scene: "stamp", verdict: "cross", badge: "IT CHAINED THE HOLES", tint: "#C65B52", text: "STRAIGHT INTO A BREACH" }, // span.from+13; "chained weaknesses into one attack path" (1840-2165)
      { at: 880, scene: "check", obj: "shield", verdict: "warn", tint: "#6E93BD", text: "LOCK EGRESS + SCOPE" }, // "network egress, credential scope, tool permissions" (loop close)
    ],
    fullscreen: [{ from: 560, to: 760 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-CompletionCost",
    label: "Opus 5: same token price, but completion cost is the real bill",
    source: "talking-head.mp4",
    from: 4324, // "price per token is only half the picture for agent work"
    // LOOP: ends "…on work that actually resembles what you do." (~5350) → replays.
    durationInFrames: 1120, // ~37s
    topic: "OPUS 5 COST",
    hook: "CHEAP TOKENS AREN'T CHEAP TASKS",
    context: "Opus 5: same token price, very different bill",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#6E93BD", text: "THE STICKER PRICE LIES" }, // "only half the picture" (4374)
      { at: 216, scene: "queue", labels: ["RETRIES", "EXTRA TOOL CALLS", "STALLED RUNS"], tint: "#C9913D", text: "WHAT REALLY BILLS YOU" }, // span.from+13; "retries, tool calls, runs that stall" (4450-4590)
      { at: 477, scene: "receipt", tint: "#D97757", text: "scored on whole tasks", shot: { src: "assets/external/screenshots/ainews-opus5-effort.png", url: "anthropic.com/news/claude-opus-5", imageW: 3840, imageH: 1150, from: { x: 0, y: 0, w: 3840, h: 1150 }, to: { x: 0, y: 0, w: 3840, h: 1150 }, zoomAt: 0 } }, // "Frontier-Bench scores whole tasks" (4788)
      { at: 763, scene: "check", obj: "gauge", verdict: "check", tint: "#4FA98A", text: "JUDGE COMPLETION COST" }, // "judge by completion cost" (loop close)
    ],
    fullscreen: [{ from: 203, to: 403 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-OpenWeights",
    label: "Open weights are a market story: leverage, routing, no lock-in",
    source: "talking-head.mp4",
    from: 7037, // "on July 24 a coalition pushed for downloadable weights"
    // LOOP: ends "…route each task to whatever capability fits." (~8180) → replays.
    durationInFrames: 1150, // ~38s
    topic: "OPEN WEIGHTS",
    hook: "OPEN WEIGHTS = A MONEY STORY",
    context: "Why Jensen Huang is backing open models",
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "the backing", shot: { src: "assets/external/screenshots/ainews-jensen.png", url: "x.com/JensenHuang", imageW: 1100, imageH: 1300, from: { x: 0, y: 0, w: 1100, h: 900 }, to: { x: 0, y: 0, w: 1100, h: 1300 }, zoomAt: 0 } }, // "Jensen Huang: safety, innovation, sovereignty" (8)
      { at: 315, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "MORE SUPPLIERS = LEVERAGE" }, // "more suppliers, hosting, bargaining" (7791-7823)
      { at: 563, scene: "doors", labels: ["ROUTINE", "MID", "HARD"], value: 0, tint: "#D97757", text: "ROUTE TASK TO ITS FIT" }, // span.from+13; "route each task to whatever fits" (8128)
      { at: 880, scene: "stamp", verdict: "check", badge: "PORTABLE BY DESIGN", tint: "#4FA98A", text: "DON'T LOCK IN" }, // loop close
    ],
    fullscreen: [{ from: 550, to: 750 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-NewsFilter",
    label: "The 3-part filter for judging any AI announcement",
    source: "talking-head.mp4",
    from: 12900, // "here's the rule I use whenever new AI news drops"
    // LOOP: ends "…today, not eventually." (~13380) → replays into the hook.
    durationInFrames: 900, // ~30s
    topic: "THE FILTER",
    hook: "JUDGE AI NEWS IN ONE QUESTION",
    context: "The 3-part test I run on every drop",
    beats: [
      { at: 31, scene: "emote", pose: "pointing", tint: "#D97757", text: "THE ONLY TEST" }, // "judge every announcement by one question" (12931)
      { at: 203, scene: "doors", labels: ["CAPABILITY", "RISK", "COST"], value: 1, tint: "#6E93BD", text: "DID IT CHANGE THESE?" }, // span.from+13; "capability, risk, cost & access" (13003-13069)
      { at: 430, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "TODAY, NOT SOMEDAY" }, // "today, not eventually" (13170)
      { at: 650, scene: "stamp", verdict: "check", badge: "RUN THE FILTER", tint: "#4FA98A", text: "ON EVERY DROP" }, // loop close
    ],
    fullscreen: [{ from: 190, to: 390 }],
    outro: "FOLLOW FOR THE WEEKLY BREAKDOWN",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
];
