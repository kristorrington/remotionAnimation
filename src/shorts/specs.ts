import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// `from` = start frame in the source footage (sec × 30). `beats[].at` is
// anchored to the WHISPER word times in captionsData.ts (NOT line timestamps).
// Loop endings cut on an open line. Every beat is an animated SUBJECT scene
// (BeatScenes.tsx); `text` is a label (1–4 words) — captions carry the speech.
// See README.md for the method + rubric. CLAUDE.md §9.
// ============================================================================
const AA = "assets/external/screenshots/opus5-aa-top.png";

export const SHORTS: ShortSpec[] = [
  // Claude Opus 5 video (talking-head.mp4, 2026-07-26).
  {
    id: "Short-HalfPrice",
    label: "THE HOOK: Opus 5 costs half of Fable 5 — and independently ranks #1",
    source: "talking-head.mp4",
    from: 0, // "Anthropic has just released Claude Opus 5…"
    // LOOP: ends "…one point ahead of Fable 5." (~915) → replays into the hook.
    durationInFrames: 950, // ~32s
    topic: "OPUS 5 vs FABLE 5",
    hook: "CHEAPER THAN THE FLAGSHIP",
    context: "Opus 5 costs half of Fable 5 — Anthropic's own top model",
    beats: [
      // EVIDENCE: the independent Artificial Analysis dashboard (#1 + $5/$25)
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "independently tested", shot: { src: AA, url: "artificialanalysis.ai", imageW: 3840, imageH: 1600, from: { x: 300, y: 300, w: 1500, h: 920 }, to: { x: 300, y: 300, w: 1500, h: 920 }, zoomAt: 0, highlight: { x: 500, y: 330, w: 520, h: 520 }, highlightAt: 44 } }, // "#1 on its Intelligence Index" (8-230)
      { at: 296, scene: "emote", pose: "confused", tint: "#C9913D", text: "NOT THE FLAGSHIP?" }, // "Fable 5 still holds that title" (296)
      { at: 565, scene: "stamp", verdict: "check", badge: "HALF THE PRICE", tint: "#4FA98A", text: "vs FABLE 5" }, // "costing half as much through the API" (565); span.from+13
      { at: 715, scene: "check", obj: "brain", verdict: "check", tint: "#6E93BD", text: "AND RANKED #1" }, // "one point ahead of Fable 5" (866)
    ],
    fullscreen: [{ from: 552, to: 702 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-HiddenBill",
    label: "The catch: a low token price still runs up a huge bill at max effort",
    source: "talking-head.mp4",
    from: 8940, // "Max effort also exposes the hidden cost behind the headline token price."
    // LOOP: ends "…produces more tokens or takes more agentic turns." (~10040) → replays.
    durationInFrames: 1120, // ~37s
    topic: "IS IT ACTUALLY CHEAP?",
    hook: "CHEAP TOKENS, PRICEY TASKS",
    context: "Opus 5's $5/$25 price hides a catch at max effort",
    beats: [
      // EVIDENCE: Artificial Analysis' own cost summary
      { at: 8, scene: "receipt", tint: "#C65B52", text: "the eval receipt", shot: { src: AA, url: "artificialanalysis.ai", imageW: 3840, imageH: 1600, from: { x: 440, y: 900, w: 2100, h: 640 }, to: { x: 440, y: 900, w: 2100, h: 640 }, zoomAt: 0, highlight: { x: 490, y: 1225, w: 1970, h: 120 }, highlightAt: 44 } }, // "100 million output tokens" (9046)
      { at: 106, scene: "coins", tint: "#C9913D", stamp: "100M TOKENS", text: "ONE EVALUATION" }, // "around 100 million output tokens" (9046)
      { at: 405, scene: "stamp", verdict: "cross", badge: "≈ $4,000", tint: "#C65B52", text: "FOR ONE RUN" }, // "almost $4,000 to complete" (9345); span.from+13
      { at: 620, scene: "emote", pose: "worried", tint: "#C9913D", text: "IT THINKS LONGER" }, // "slower and more verbose than average" (~9600)
      { at: 980, scene: "check", obj: "coin", verdict: "cross", tint: "#C65B52", text: "NOT ALWAYS CHEAP" }, // "doesn't make every completed task cheaper" (9920)
    ],
    fullscreen: [{ from: 392, to: 542 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-Passwords",
    label: "The safety caveat: the system card logged rare workaround + password attempts",
    source: "talking-head.mp4",
    from: 12700, // "But 'most aligned' does not mean error-free or safe to operate without supervision."
    // LOOP: ends "…rather than proof the released model behaves that way." (~13900) → replays.
    durationInFrames: 1080, // ~36s
    topic: "MOST ALIGNED — BUT?",
    hook: "IT TRIED TO GUESS PASSWORDS",
    context: "Opus 5's system card logged rare workaround attempts",
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#C9913D", text: "SAFEST CLAUDE YET?" }, // "most aligned does not mean error-free" (12700)
      { at: 428, scene: "reject", badge: "SAFETY LIMITS", tint: "#C65B52", text: "IT WORKED AROUND THEM" }, // "work around the safety classifiers or network restrictions" (13128)
      { at: 710, scene: "stamp", verdict: "cross", badge: "TRIED PASSWORDS", tint: "#C65B52", text: "TO REGAIN ACCESS" }, // "tried common passwords in an attempt to log back in" (13410); span.from+13
      { at: 900, scene: "emote", pose: "thinking", tint: "#4FA98A", text: "A TRAINING SNAPSHOT" }, // "involved an intermediate snapshot, not the released model" (~13700)
    ],
    fullscreen: [{ from: 697, to: 847 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-WhichClaude",
    label: "THE VERDICT: which Claude to use — Sonnet, Opus 5 or Fable 5",
    source: "talking-head.mp4",
    from: 15760, // "For difficult coding… Opus 5 looks like the new strongest default."
    // LOOP: ends "…even a small improvement can justify paying twice." (~16860) → replays.
    durationInFrames: 1150, // ~38s
    topic: "WHICH CLAUDE NOW?",
    hook: "OPUS 5 IS THE NEW DEFAULT",
    context: "For difficult work — but not for everything",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "FOR THE HARD STUFF" }, // "Opus 5 looks like the new strongest default" (15786)
      { at: 404, scene: "check", obj: "coin", verdict: "check", tint: "#6E93BD", text: "SONNET = CHEAPEST" }, // "Sonnet 5 remains the more economical choice" (16275)
      { at: 604, scene: "doors", labels: ["SONNET 5", "OPUS 5", "FABLE 5"], value: 1, tint: "#D97757", text: "PICK BY THE JOB" }, // "Fable 5 still makes sense for the longest projects" (16362); span.from+13
      { at: 900, scene: "stamp", verdict: "check", badge: "OPUS 5", tint: "#D97757", text: "START HERE" }, // verdict payoff
    ],
    fullscreen: [{ from: 591, to: 741 }],
    outro: "FOLLOW FOR MORE",
    music: "music/calm.MP3",
    style: "paper",
  },
];
