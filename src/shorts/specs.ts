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
  // The-5-habits video (talking-head.mp4, 2026-07-26).
  {
    id: "Short-VagueBrief",
    label: "THE HOOK: managing agents like interns you brief once and abandon",
    source: "talking-head.mp4",
    from: 0, // "Imagine hiring five brilliant interns…"
    // LOOP: ends "…the fix is a management system built from five habits." (~820) → replays.
    durationInFrames: 900, // ~30s
    topic: "WHY YOUR AGENTS FAIL",
    hook: "YOU'RE MANAGING THEM WRONG",
    context: "Most agent 'unreliability' is really weak management",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#C9913D", text: "ONE VAGUE SENTENCE" }, // "one vague instruction... walk away" (10-140)
      { at: 191, scene: "stamp", verdict: "cross", badge: "THE INTERNS", tint: "#C65B52", text: "GET THE BLAME" }, // "blaming them when the project falls apart" (191); span.from+13
      { at: 500, scene: "reject", badge: "SMARTER MODEL", tint: "#C65B52", text: "WON'T FIX IT" }, // "everyone searches for a smarter model" (498-649)
      { at: 748, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "MANAGE, DON'T SWAP" }, // "the fix is a management system" (748)
    ],
    fullscreen: [{ from: 178, to: 328 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-CleanMeans",
    label: "Habit 1: 'clean up this spreadsheet' means four different jobs",
    source: "talking-head.mp4",
    from: 1900, // "A lot of people type 'clean up this spreadsheet'…"
    // LOOP: ends "…same spreadsheet, far less guessing." (~4900) → replays.
    durationInFrames: 1150, // ~38s
    topic: "WHAT DOES 'CLEAN' MEAN?",
    hook: "YOUR AGENT IS JUST GUESSING",
    context: "Habit 1: brief it like a new employee on day one",
    beats: [
      { at: 217, scene: "queue", labels: ["DELETE DUPES?", "FIX FORMATS?", "REBUILD IT?"], tint: "#C9913D", text: "ONE WORD, FOUR JOBS" }, // "clean could mean..." (2117-2394)
      { at: 682, scene: "emote", pose: "confused", tint: "#C9913D", text: "NO BUSINESS CONTEXT" }, // "the agent only has the words you gave it" (~2582)
      { at: 950, scene: "check", obj: "gauge", verdict: "warn", tint: "#6E93BD", text: "OUTCOME · LIMITS · PROOF" }, // "define finished, protected, approval" (span); span.from+13
      { at: 1060, scene: "stamp", verdict: "check", badge: "A REAL BRIEF", tint: "#4FA98A", text: "FAR LESS GUESSING" }, // "far less guessing" (loop close)
    ],
    fullscreen: [{ from: 937, to: 1087 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-WrongRow",
    label: "Habit 3: a confident answer is worthless until you trace the source",
    source: "talking-head.mp4",
    from: 10850, // "You've seen an agent deliver a polished answer…"
    // LOOP: ends "…trace the figure back to its origin." (~12900) → replays.
    durationInFrames: 1130, // ~38s
    topic: "IS THE ANSWER REAL?",
    hook: "CONFIDENT ISN'T CORRECT",
    context: "Habit 3: reward evidence, not confident wording",
    beats: [
      { at: 85, scene: "emote", pose: "thinking", tint: "#6E93BD", text: "IT SOUNDS RIGHT" }, // "polished answer... number, explanation" (10935)
      { at: 355, scene: "stamp", verdict: "cross", badge: "WRONG ROW", tint: "#C65B52", text: "CHECK ONE DETAIL" }, // "the number came from the wrong row" (11205); span.from+13
      { at: 700, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "'ARE YOU SURE?' FAILS" }, // "asking are you sure gets confidence" (~11550)
      { at: 950, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "ASK FOR THE SOURCE" }, // "trace the figure back to its origin" (12773)
    ],
    fullscreen: [{ from: 342, to: 492 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-EarnedAutonomy",
    label: "Habit 5: the Earned Autonomy Rule — expand freedom only after proof",
    source: "talking-head.mp4",
    from: 20400, // "Habit five is expanding autonomy only after the agent earns it."
    // LOOP: ends "…reduce oversight for that specific task." (~22400) → replays.
    durationInFrames: 1150, // ~38s
    topic: "WHEN TO TRUST YOUR AGENT",
    hook: "THE EARNED AUTONOMY RULE",
    context: "Habit 5: expand freedom only after proven success",
    beats: [
      { at: 126, scene: "emote", pose: "pointing", tint: "#D97757", text: "ONE WIN ISN'T PROOF" }, // "one successful run = one observation" (20585)
      { at: 400, scene: "check", obj: "gauge", verdict: "warn", tint: "#6E93BD", text: "REPEATED · TRACED · EARNED" }, // "repeated, evidence-backed success" (~20800)
      { at: 604, scene: "doors", labels: ["SUPERVISED", "FEWER CHECKS", "AUTONOMOUS"], value: 0, tint: "#D97757", text: "MOVE UP ON PROOF" }, // "weekly report perfect — still one run" (21479); span.from+13
      { at: 900, scene: "stamp", verdict: "check", badge: "EARN IT FIRST", tint: "#D97757", text: "THEN EXPAND" }, // verdict payoff
    ],
    fullscreen: [{ from: 591, to: 741 }],
    outro: "FOLLOW FOR MORE",
    music: "music/calm.MP3",
    style: "paper",
  },
];
