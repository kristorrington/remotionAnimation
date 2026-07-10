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
  // GPT-5.6 "sandbox it" video (talking-head.mp4) — anchors from whisper words.
  // ==========================================================================
  {
    id: "Short-SandboxRule",
    label: "THE HOOK: efficient but it cheated — sandbox it before you scale it",
    source: "talking-head.mp4",
    from: 0, // the video's hook question, verbatim
    // LOOP: the CTA lands right as "…scale it." (700) ends; the tail trails
    // into "GPT-5.6 launched publicly…" which loops cleanly back into the
    // hook question. 800f so the rule-stamp beat gets ≥3s of split BEFORE the
    // CTA return (at 720 the CTA seized the layout mid-payoff).
    durationInFrames: 800, // ~27s
    topic: "GPT-5.6 IN PRODUCTION?",
    hook: "DON'T SHIP GPT-5.6 BLIND",
    hookAlt: "GPT-5.6 IS FAST. AND IT CHEATS.", // A/B variant → Short-SandboxRule-B
    context: "OpenAI's new model: efficient — but it cheats",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "MOVE YOUR STACK?" }, // hook question spoken at open
      { at: 170, scene: "bolt", trails: true, blockLabel: "GPT-5.6", moduleLabel: "SOL", tint: "#34D399", text: "54% MORE EFFICIENT" }, // "Sol is 54% more token-efficient" abs 176
      { at: 332, scene: "check", obj: "coin", verdict: "check", tint: "#F59E0B", text: "CHEAPER AGENTS AT SCALE" }, // "could reduce real-agent costs" abs 338
      { at: 419, scene: "check", obj: "shield", verdict: "warn", tint: "#D97757", text: "BUT THE SAFETY CARD…" }, // "OpenAI's own safety card" abs 425
      { at: 506, scene: "reject", badge: "IT CHEATED", tint: "#EF4444", text: "UNAUTHORIZED ACTIONS", emoji: "🚨" }, // "cheated" abs 512, "unauthorized" abs 542
      { at: 592, scene: "stamp", verdict: "check", badge: "MY RULE", tint: "#34D399", text: "SANDBOX → THEN SCALE" }, // "my rule is simple: sandbox it" abs 594→649 (slam ~632)
    ],
    // full-anim: the bolt-on efficiency gag + the cheat/rule payoff
    fullscreen: [{ from: 190, to: 376 }, { from: 470, to: 578 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ItCheated",
    label: "OpenAI's own system card: cheating, faked results, moved credentials",
    source: "talking-head.mp4",
    from: 2810, // "OpenAI's June 26 system card changes the production conversation."
    // LOOP: ends on "…can touch client infrastructure." (abs 3585) → replays into the system card.
    durationInFrames: 780, // ~26s
    topic: "OPENAI'S SAFETY CARD",
    hook: "OPENAI SAYS IT CHEATED",
    context: "GPT-5.6's own system card, June 26",
    beats: [
      { at: 8, scene: "stamp", verdict: "cross", badge: "SYSTEM CARD", tint: "#EF4444", text: "THE JUNE 26 DROP" }, // spoken at open
      { at: 170, scene: "queue", labels: ["CHEATED", "FABRICATED", "DESTRUCTIVE"], tint: "#F59E0B", text: "IT DID ALL THREE" }, // "task cheating" abs 2986 → the three documented behaviours
      { at: 402, scene: "reject", badge: "CACHED CREDENTIALS", tint: "#EF4444", text: "IT MOVED YOUR KEYS", emoji: "🔑" }, // "moving cached credentials" abs 3218
      { at: 545, scene: "emote", pose: "worried", accent: "#F59E0B", tint: "#D97757", text: "RISK = TOOL ACCESS" }, // "the production risk sits in tool access" abs 3360
      { at: 610, scene: "check", obj: "gauge", verdict: "cross", tint: "#EF4444", text: "SCORES ≠ SAFE TOOLS" }, // "does not prove safe tool use" abs 3453
    ],
    // full-anim: the three-behaviours gauntlet
    fullscreen: [{ from: 190, to: 470 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-MetrGaveUp",
    label: "METR's capability estimate: 11.3h to 270h — treated as unusable",
    source: "talking-head.mp4",
    from: 3588, // "METR then tried to estimate Sol's capability…"
    // LOOP: ends on "…around poorly constrained tools." (abs 4522) → replays into METR's attempt.
    durationInFrames: 950, // ~32s
    topic: "CAN YOU TRUST GPT-5.6?",
    hook: "THE SAFETY TESTERS GAVE UP",
    context: "METR couldn't measure GPT-5.6's limits",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "METR RAN THE TESTS" }, // spoken at open
      { at: 120, scene: "signal", tint: "#EF4444", text: "REWARD HACKING", sub: "tests contaminated" }, // "contaminated by reward hacking" abs 3716
      { at: 334, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "11 HOURS? OR 270?" }, // "11.3 hours to more than 270" abs 3928
      { at: 467, scene: "emote", pose: "shrug", tint: "#D97757", text: "A RANGE THAT WIDE?", emoji: "🤷" }, // "the range was so wide" abs 4061
      { at: 574, scene: "stamp", verdict: "cross", badge: "METR VERDICT", tint: "#EF4444", text: "UNUSABLE" }, // "treated the estimate as unusable" abs 4168 (slam ~614)
      { at: 692, scene: "check", obj: "brain", verdict: "warn", tint: "#F59E0B", text: "SCOREBOARD ≠ TRUST" }, // "the scoreboard cannot carry the trust decision" abs 4286
      { at: 766, scene: "emote", pose: "worried", accent: "#EF4444", tint: "#D97757", text: "CAPABLE BUT UNRELIABLE" }, // "highly capable while still behaving unreliably" abs 4383
    ],
    // full-anim: the static-signal gag + the UNUSABLE stamp
    fullscreen: [{ from: 190, to: 430 }, { from: 560, to: 690 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-InYourCopilot",
    label: "GPT-5.6 became Copilot's preferred model on day one — audit permissions",
    source: "talking-head.mp4",
    from: 4542, // "Now look at where the model landed on launch day."
    // LOOP: ends on "…matter more than leaderboard position." (abs 5583) → replays into launch day.
    durationInFrames: 1060, // ~35s
    topic: "CHECK YOUR COPILOT",
    hook: "IT'S ALREADY IN YOUR TOOLS",
    context: "GPT-5.6 became Copilot's default on day one",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "WHERE IT LANDED, DAY 1" }, // spoken at open
      { at: 125, scene: "bolt", blockLabel: "COPILOT", moduleLabel: "GPT-5.6", tint: "#34D399", text: "INSIDE GITHUB COPILOT" }, // "rolled into GitHub Copilot" abs 4673
      { at: 268, scene: "check", obj: "brain", verdict: "check", tint: "#F59E0B", text: "M365'S PREFERRED MODEL" }, // "the preferred model in Microsoft 365" abs 4794
      { at: 350, scene: "queue", labels: ["CHATGPT WORK", "CODEX", "CROSS-APP"], tint: "#D97757", text: "WORKPLACE AUTOMATION" }, // "ChatGPT Work launched alongside" abs 4898
      { at: 630, scene: "conveyor", labels: ["TOOL-RICH"], tint: "#F59E0B", text: "STRAIGHT INTO WORKFLOWS" }, // "moving directly into tool-rich workplaces" abs 5176
      { at: 823, scene: "emote", pose: "confused", tint: "#EF4444", text: "ALREADY IN YOUR STACK?", emoji: "👀" }, // "if you use Copilot… may already be part" abs 5352
      { at: 970, scene: "stamp", verdict: "check", badge: "PERMISSIONS", tint: "#34D399", text: "PERMISSIONS > LEADERBOARDS" }, // "permissions now matter more" abs 5518 (slam ~1010)
    ],
    // full-anim: the bolt-into-Copilot gag + the "already in yours?" punch
    fullscreen: [{ from: 190, to: 330 }, { from: 790, to: 910 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];

