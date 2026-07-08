import { ShortSpec } from "./types";

// ============================================================================
// ARCHIVED SHORTS — specs from PREVIOUS videos (DSpark, Claude wealth-stories).
// Only the CURRENT video's shorts live in specs.ts; when a new video starts,
// move the outgoing specs here (see AGENTS.md 'Archiving previous videos').
// Registered in Studio only when SHOW_ARCHIVE (src/archive) is true — flip it
// to re-render an old short; captions stay correct via captionsRegistry.
// ============================================================================
export const ARCHIVED_SHORTS: ShortSpec[] = [
  {
    id: "Short-Waiting",
    label: "Why agents feel slow — it's not intelligence, it's waiting",
    source: "talking-head-050726.mp4",
    from: 1127, // "the problem with AI agents… is not just intelligence. It's waiting." (0:37.6)
    // LOOP: ends on "…it feels like the product is broken." (abs 1903) → replays into the hook.
    durationInFrames: 800, // ~27s
    topic: "IS IT SLOW OR JUST WAITING?",
    hook: "WHY YOUR AI AGENT FEELS SLOW",
    hookAlt: "YOUR AI ISN'T DUMB. IT'S STUCK", // A/B variant → Short-Waiting-B
    beats: [
      { at: 79, scene: "emote", pose: "shrug", text: "NOT INTELLIGENCE" }, // "intelligence" abs 1206
      { at: 131, scene: "queue", labels: ["PROMPT", "TOOL", "RETRY"], text: "WAITING" }, // "It's waiting" abs 1258
      { at: 236, scene: "check", obj: "clock", verdict: "warn", text: "TOOL CALLS" }, // "tool to call" abs 1363
      { at: 331, scene: "retry", text: "RETRIES" }, // "the agent to realize it messed up" abs 1458
      { at: 541, scene: "stack", text: "IT COMPOUNDS", emoji: "😬" }, // "one model call feels fine" abs 1668
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
    source: "talking-head-050726.mp4",
    from: 5057, // "So the question is not, is D-Spark faster?" (2:48.6)
    // LOOP: ends on "…is still a problem." (abs 5735) → replays into the hook.
    durationInFrames: 696, // ~23s
    topic: "FASTER — BUT IS IT BETTER?",
    hook: "SPEED WON'T FIX A BROKEN AI",
    beats: [
      { at: 64, scene: "bolt", trails: true, text: "FASTER?", sub: "wrong question" }, // "is D-Spark faster?" abs 5121
      { at: 151, scene: "coins", text: "CHEAPER?" }, // "does my workflow get cheaper?" abs 5208
      { at: 348, scene: "reject", badge: "FAILED TASK", text: "STILL FAILED" }, // "a faster failed task is still failed" abs 5405
      { at: 458, scene: "check", obj: "bug", verdict: "cross", text: "STILL WRONG", emoji: "❌" }, // "faster hallucination…" abs 5515
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
    source: "talking-head-050726.mp4",
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
      { at: 708, scene: "emote", pose: "celebrate", accent: "#34D399", text: "SHIP IT", emoji: "🚀" }, // abs 9199
    ],
    // full-anim: the quick-fire 3-question checklist — cramped in split
    fullscreen: [{ from: 413, to: 648 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Numbers",
    label: "The DSpark speed numbers — and why they're not a bill cut",
    source: "talking-head-050726.mp4",
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
      { at: 718, scene: "coins", text: "NOT 85% OFF", emoji: "💸" }, // "your bill drops by 85%" abs 4596
    ],
    // full-anim: the 60–85% number IS the hook payoff — give it the whole screen
    fullscreen: [{ from: 153, to: 380 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Infra",
    label: "DSpark is an infrastructure moment, not an AI moment",
    source: "talking-head-050726.mp4",
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
      { at: 460, scene: "emote", pose: "shrug", text: "IGNORE HYPE", emoji: "🙄" }, // "ignore the AGI screaming" abs 10607
      { at: 724, scene: "check", obj: "gauge", verdict: "check", text: "CHEAPER?" }, // abs 10871
    ],
    // full-anim: the "not AGI → infrastructure" reveal is the whole short
    fullscreen: [{ from: 94, to: 280 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },

  // ==========================================================================
  // CLAUDE WEALTH-STORIES video (talking-head.mp4) — whisper frames from the
  // regenerated captionsData.ts.
  // ==========================================================================
  {
    id: "Short-200Truth",
    label: "The $200/month reality behind AI millionaire hype",
    source: "talking-head-070726.mp4",
    from: 7349, // "most people are starting much smaller" (4:04.9)
    // LOOP: ends on "…you will actually use it properly" (abs 8420) → replays into the hook.
    durationInFrames: 1071, // ~36s
    topic: "WHAT'S THE REAL NUMBER?",
    hook: "THE AI MILLIONAIRE LIE",
    // the coin-drop reality check IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 10, scene: "coins", labels: ["INCOME"], text: "$200/MO", sub: "the median" }, // "$200 number matters" abs 7373
      { at: 229, scene: "emote", pose: "shrug", text: "BORING BUT TRUE" }, // "boring" abs 7578
      { at: 376, scene: "bolt", blockLabel: "YOU", moduleLabel: "CLAUDE", text: "LEVERAGE FIRST" }, // "AI might help you build" abs 7725
      { at: 577, scene: "check", obj: "gauge", verdict: "check", text: "LEVERAGE" }, // abs 7926
      { at: 616, scene: "check", obj: "clock", verdict: "check", text: "CONSISTENCY" }, // abs 7965
      { at: 688, scene: "check", obj: "coin", verdict: "check", text: "THEN INCOME" }, // abs 8037
      { at: 900, scene: "reject", badge: "RICH QUICK", text: "WRONG EXPECTATION", emoji: "💸" }, // "quit" abs 8259
    ],
    fullscreen: [{ from: 84, to: 200 }, { from: 577, to: 760 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-FakeDoctors",
    label: "The $401M AI story that got an FDA warning letter",
    source: "talking-head-070726.mp4",
    from: 3384, // "what happened was the FDA sent a warning letter…" (1:52.8)
    // LOOP: ends on "…messy case studies make dangerous roadmaps" (abs 4576) → replays into the hook.
    durationInFrames: 1192, // ~40s
    topic: "IS THE $401M REAL?",
    hook: "AI BUILT IT. THE FDA CALLED.",
    beats: [
      { at: 6, scene: "reject", badge: "FDA", text: "WARNING LETTER" }, // "FDA" abs 3396
      { at: 248, scene: "emote", pose: "confused", text: "AN AFFILIATE?" }, // abs 3632
      { at: 484, scene: "stack", text: "1000s OF ADS" }, // "meta ads" abs 3868
      { at: 572, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "FAKE DOCTORS?", emoji: "😳" }, // "personas" abs 3956
      { at: 940, scene: "bolt", trails: true, blockLabel: "THE BIZ", moduleLabel: "CLAUDE", warn: "TRUST CAN'T KEEP UP", text: "TOO FAST" }, // "trust" abs 4330
    ],
    fullscreen: [{ from: 484, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Vulcan",
    label: "Non-tech founders + Claude Code → gov customer + $10.9M seed",
    source: "talking-head-070726.mp4",
    from: 4590, // "now compare that with Vulcan Technologies" (2:33)
    // LOOP: ends on "…find a painful bottleneck, use AI to move faster" (abs 5700) → replays into the hook.
    durationInFrames: 1110, // ~37s
    topic: "THE SMARTER CLAUDE STORY",
    hook: "NO CODE. GOV CONTRACT. $11M.",
    beats: [
      { at: 27, scene: "bolt", blockLabel: "VULCAN", moduleLabel: "CLAUDE", text: "THE QUIET ONE" }, // "Vulcan" abs 4617
      { at: 209, scene: "emote", pose: "thinking", text: "NON-TECH FOUNDERS" }, // abs 4799
      { at: 343, scene: "check", obj: "shield", verdict: "warn", text: "REG COMPLEXITY" }, // abs 4933
      { at: 408, scene: "check", obj: "shield", verdict: "check", text: "GOV CUSTOMER" }, // "Virginia" abs 4998
      { at: 491, scene: "coins", labels: ["SEED"], text: "$10.9M SEED", sub: "reported" }, // "seed" abs 5081
      { at: 556, scene: "emote", pose: "celebrate", accent: "#34D399", text: "REAL RECEIPTS", emoji: "🧾" }, // abs 5146
      { at: 643, scene: "reject", badge: "TRUST ME", text: "NOT NEEDED" }, // "not trust the founder" abs 5233
      { at: 749, scene: "check", obj: "shield", verdict: "check", text: "A REAL BUYER" }, // abs 5339
      { at: 880, scene: "emote", pose: "pointing", text: "THAT MATTERS" }, // abs 5410
    ],
    fullscreen: [{ from: 408, to: 620 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Plumbers",
    label: "Jensen Huang: the next AI millionaires might be plumbers",
    source: "talking-head-070726.mp4",
    from: 9511, // "and then Jensen Huang throws a grenade…" (5:17)
    // LOOP: ends on "…people who use AI near a valuable constraint" (abs 10692) → replays into the hook.
    durationInFrames: 1181, // ~39s
    topic: "WHO GETS RICH OFF AI?",
    hook: "AI MILLIONAIRES = PLUMBERS?",
    beats: [
      { at: 44, scene: "emote", pose: "alarmed", text: "JENSEN'S GRENADE", emoji: "💣" }, // abs 9555
      { at: 242, scene: "emote", pose: "confused", text: "PLUMBERS?!" }, // abs 9753
      { at: 437, scene: "bolt", trails: true, blockLabel: "SAME STORY", moduleLabel: "NEW NECK", text: "DIFFERENT BOTTLENECK" }, // abs 9948
      { at: 516, scene: "racks", text: "AI NEEDS POWER" }, // "data centers" abs 10027
      { at: 656, scene: "conveyor", labels: ["DONE"], text: "REAL-WORLD WORK" }, // "build wire cool" abs 10167
      { at: 888, scene: "queue", labels: ["SOFTWARE", "REGS", "INFRA"], text: "AT THE BOTTLENECK" }, // abs 10399
    ],
    fullscreen: [{ from: 437, to: 640 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-BSTest",
    label: "The 3-second test for 'AI made me rich' stories",
    source: "talking-head-070726.mp4",
    from: 14592, // "so next time you see an AI made me rich story" (8:06.4)
    // LOOP: ends on "…less sexy, much more useful" (abs 15240) → replays into the hook.
    durationInFrames: 660, // ~22s
    topic: "SPOT THE FAKE AI STORY",
    hook: "THE 3-SECOND BS TEST",
    beats: [
      { at: 149, scene: "reject", badge: "IMPRESSIVE?", text: "WRONG QUESTION" }, // abs 14741
      { at: 198, scene: "testbench", labels: ["STORY", "RECEIPTS"], text: "CHECK RECEIPTS" }, // abs 14790
      { at: 258, scene: "queue", labels: ["BOTTLENECK?"], text: "WHAT DID AI REMOVE?" }, // abs 14850
      { at: 336, scene: "check", obj: "coin", verdict: "check", text: "WHO PAID?" }, // abs 14928
      { at: 405, scene: "conveyor", labels: ["DONE"], text: "CLEAR? STUDY IT" }, // abs 14997
      { at: 455, scene: "emote", pose: "shrug", text: "VAGUE? SCROLL", emoji: "🙄" }, // abs 15047
    ],
    fullscreen: [{ from: 198, to: 380 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },];
