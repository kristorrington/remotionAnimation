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
  // MODEL-ROUTING video (talking-head.mp4) — whisper frames from the
  // regenerated captionsData.ts.
  // ==========================================================================
  {
    id: "Short-EffortDial",
    label: "Max effort on a tiny job = hiring a senior architect to rename a button",
    source: "talking-head.mp4",
    from: 4656, // "That is like hiring a senior architect to rename a label on a button" (2:35.2)
    // LOOP: ends on "…being wrong is expensive. Not annoying — expensive." (abs 6014) → replays into the gag.
    durationInFrames: 1358, // ~45s
    topic: "HOW MUCH THINKING?",
    hook: "YOU'RE OVERPAYING YOUR AI",
    // the architect gag IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "SENIOR ARCHITECT", sub: "renames a button" }, // "senior architect" abs 4700
      { at: 180, scene: "coins", tint: "#EF4444", text: "STUPIDLY EXPENSIVE" }, // "stupidly expensive" abs 4836
      { at: 308, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "LOW = QUICK CHECKS" }, // "Low" abs 4964
      { at: 496, scene: "conveyor", labels: ["NORMAL WORK"], tint: "#06B6D4", text: "MEDIUM = BALANCE" }, // "Medium" abs 5152
      { at: 671, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "HIGH = JUDGMENT" }, // "High" abs 5327
      { at: 822, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "XHIGH = AGENTS" }, // "Extra high" abs 5478
      { at: 1115, scene: "reject", badge: "DEFAULT", tint: "#EF4444", text: "MAX ≠ DEFAULT", emoji: "💸" }, // "max should not be your default" abs 5771
      { at: 1235, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "WRONG = EXPENSIVE" }, // "being wrong is expensive" abs 5891
    ],
    // full-anim: the level run-through + the XHIGH bolt payoff
    fullscreen: [{ from: 308, to: 520 }, { from: 822, to: 1010 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-8020",
    label: "Fable is 2× the price — the 80/20 rule decides when it's worth it",
    source: "talking-head.mp4",
    from: 12029, // "Now here is the cost trap." (6:41)
    // LOOP: ends on "…that is the clean decision rule." (abs 13442) → replays into the trap.
    durationInFrames: 1413, // ~47s
    topic: "IS FABLE WORTH 2×?",
    hook: "FABLE 5 IS 2× THE PRICE",
    hookAlt: "STOP PAYING DOUBLE FOR AI", // A/B variant → Short-8020-B
    // the coin trap IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 8, scene: "coins", tint: "#F59E0B", text: "THE COST TRAP" }, // "cost trap" abs 12071
      { at: 138, scene: "check", obj: "coin", verdict: "warn", tint: "#EF4444", text: "2× THE PRICE" }, // "double Opus 4.8" abs 12167
      { at: 415, scene: "retry", tint: "#F59E0B", text: "× EFFORT × RETRIES" }, // "effort level, retries, tool calls" abs 12444
      { at: 618, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "ONE CLEAN PASS?" }, // "one clean pass" abs 12647
      { at: 678, scene: "emote", pose: "shrug", accent: "#F59E0B", tint: "#06B6D4", text: "OPUS DID THE SAME" }, // "waste if Opus…" abs 12707
      { at: 796, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "80%? USE OPUS" }, // "the 80…rule" abs 12825
      { at: 1123, scene: "conveyor", labels: ["SONNET"], tint: "#06B6D4", text: "EVEN CHEAPER?" }, // "Sonnet…even cheaper" abs 13152
      { at: 1215, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "THE 20% MATTERS?", sub: "then Fable", emoji: "💰" }, // "missing 20%…matters" abs 13244
    ],
    // full-anim: the 2× reveal + the 80/20 decision payoff
    fullscreen: [{ from: 138, to: 330 }, { from: 796, to: 1010 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-RouteByRisk",
    label: "Route by risk, not ego — some tasks barely need Opus",
    source: "talking-head.mp4",
    from: 8533, // "Fourth, route by risk, not ego." (4:44.4)
    // LOOP: ends on "…Opus at medium or high is probably enough." (abs 9655) → replays into the rule.
    durationInFrames: 1122, // ~37s
    topic: "PICKING AI BY EGO?",
    hook: "STOP PAYING FOR EGO",
    beats: [
      { at: 88, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "RISK, NOT EGO" }, // "not ego" abs 8621
      { at: 162, scene: "coins", tint: "#F59E0B", text: "WASTED SPEND" }, // "waste money" abs 8695
      { at: 255, scene: "reject", badge: "FEELS SAFER", tint: "#EF4444", text: "NOT SMARTER" }, // "feels safer" abs 8788
      { at: 413, scene: "emote", pose: "shrug", tint: "#06B6D4", text: "DOESN'T NEED FABLE", emoji: "🤷" }, // "do not need Fable" abs 8946
      { at: 592, scene: "check", obj: "brain", verdict: "warn", tint: "#F59E0B", text: "BARELY NEEDS OPUS" }, // "barely need Opus" abs 9125
      { at: 636, scene: "queue", labels: ["EXTRACT", "FORMAT", "CLASSIFY"], tint: "#06B6D4", text: "CHEAP LANE" }, // "extraction, formatting…" abs 9169
      { at: 799, scene: "conveyor", labels: ["SONNET", "HAIKU"], tint: "#34D399", text: "HANDLED" }, // "Sonnet or haiku" abs 9332
      { at: 950, scene: "check", obj: "gauge", verdict: "check", tint: "#06B6D4", text: "OPUS IS ENOUGH" }, // "Opus at medium or high" abs 9552
    ],
    // full-anim: the cheap-lane run — the payoff of the whole rule
    fullscreen: [{ from: 636, to: 860 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-AccessWindow",
    label: "Fable access has already been weird — build a fallback routing rule",
    source: "talking-head.mp4",
    from: 10800, // "Fifth, watch access and cost with an eagle eye." (6:00)
    // LOOP: ends on "…not which model is best — which model is just enough." (abs 12020) → replays into the rule.
    durationInFrames: 1220, // ~41s
    topic: "WHAT IF IT VANISHES?",
    hook: "YOUR BEST AI CAN DISAPPEAR",
    beats: [
      { at: 90, scene: "emote", pose: "thinking", tint: "#06B6D4", text: "WATCH ACCESS" }, // "eagle eye" abs 10890
      { at: 200, scene: "check", obj: "shield", verdict: "cross", tint: "#EF4444", text: "RESTRICTED" }, // "it was restricted" abs 11000
      { at: 241, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "THEN IT'S BACK" }, // "came back" abs 11041
      { at: 398, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "WEEKLY LIMITS" }, // "part of the weekly usage" abs 11198
      { at: 471, scene: "coins", tint: "#EF4444", text: "USAGE CREDITS", emoji: "😬" }, // "usage credits" abs 11271
      { at: 624, scene: "stack", tint: "#F59E0B", text: "IT BREAKS" }, // "that is going to break" abs 11424
      { at: 784, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "A ROUTING RULE" }, // "routing rule" abs 11584
      { at: 880, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "THE FALLBACK" }, // "try Opus extra high" abs 11680
      { at: 997, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "STEP DOWN" }, // "step down to high" abs 11797
    ],
    // full-anim: credits raining + the workflow break
    fullscreen: [{ from: 471, to: 680 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-LeakedPrompt",
    label: "The 'leaked' Fable prompt is a rumor — steal the behaviour instead",
    source: "talking-head.mp4",
    from: 1980, // "copy the process, not the leak prompt" (1:06)
    // LOOP: ends on "…that is exactly the point." (abs 3105) → replays into the hook.
    durationInFrames: 1125, // ~38s
    topic: "IS THE LEAK REAL?",
    hook: "THE 'LEAKED' FABLE PROMPT",
    beats: [
      { at: 127, scene: "emote", pose: "confused", tint: "#06B6D4", text: "A 'LEAKED' PROMPT?" }, // "Fable system prompt" abs 2107
      { at: 224, scene: "reject", badge: "OFFICIAL", tint: "#EF4444", text: "JUST A RUMOR", emoji: "🤨" }, // "like a rumor" abs 2204
      { at: 301, scene: "check", obj: "brain", verdict: "cross", tint: "#F59E0B", text: "DON'T COPY-PASTE" }, // "don't copy it word for word" abs 2281
      { at: 413, scene: "stack", tint: "#EF4444", text: "DON'T BUILD ON IT" }, // "build your workflow around a leak" abs 2393
      { at: 692, scene: "emote", pose: "pointing", accent: "#34D399", tint: "#34D399", text: "STEAL THE BEHAVIOUR" }, // "worth stealing" abs 2672
      { at: 780, scene: "check", obj: "clock", verdict: "cross", tint: "#06B6D4", text: "NO STALE FACTS" }, // "don't trust stale knowledge" abs 2760
      { at: 838, scene: "testbench", labels: ["ASSUMPTIONS", "REALITY"], tint: "#F59E0B", text: "VERIFY FIRST" }, // "don't assume a file exists" abs 2818
      { at: 1008, scene: "emote", pose: "celebrate", accent: "#34D399", tint: "#34D399", text: "GOOD AGENT BEHAVIOUR" }, // "good agent behavior" abs 3010
    ],
    // full-anim: the workflow-on-a-leak collapse + the steal reveal
    fullscreen: [{ from: 413, to: 610 }, { from: 692, to: 790 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
];

