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
  // "Claude Fable 5 is now permanent" video (talking-head.mp4, 2026-07-21)
  // ==========================================================================
  {
    id: "Short-FiftyPercent",
    label: "THE HOOK: Fable 5 is permanent — but only at 50% of weekly limits",
    source: "talking-head.mp4",
    from: 0, // "Claude Fable 5 is no longer a temporary bonus…"
    // LOOP: ends "…and is it worth upgrading for?" (986) → replays into the hook.
    durationInFrames: 1000, // ~33s
    topic: "THE 50% CATCH",
    hook: "PERMANENT — BUT NOT UNLIMITED",
    context: "Fable 5 is now permanent on Max & Team Premium",
    beats: [
      // EVIDENCE: the @claudeai permanence tweet (opens on the receipt)
      { at: 8, scene: "receipt", tint: "#D97757", text: "the announcement", shot: { src: "assets/external/screenshots/fable-permanent-tweet.png", url: "x.com/claudeai", imageW: 1100, imageH: 786, from: { x: 0, y: 0, w: 1100, h: 786 }, to: { x: 0, y: 0, w: 1100, h: 786 }, highlight: { x: 30, y: 150, w: 1040, h: 110 }, highlightAt: 40 } }, // "a permanent part of Claude's highest tiers" (98-317)
      { at: 505, scene: "emote", pose: "confused", tint: "#C65B52", text: "THERE'S A CATCH" }, // "but permanent does not mean unlimited" (503)
      { at: 690, scene: "battery", value: 50, tint: "#C65B52", text: "IT'S HALVED" }, // "only 50% of their weekly limits" (763); span.from+13
      { at: 850, scene: "emote", pose: "thinking", tint: "#C9913D", text: "SO IS IT WORTH IT?" }, // "and is it worth upgrading for?" (960)
    ],
    fullscreen: [{ from: 677, to: 830 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-WhoGetsIt",
    label: "Only Max & Team Premium get Fable 5 free — Pro & Team Standard pay",
    source: "talking-head.mp4",
    from: 2050, // "here is how the new structure affects each subscription…"
    // LOOP: ends "…do not receive it as a permanent bundled feature either." (2870) → replays.
    durationInFrames: 900, // ~30s
    topic: "WHO GETS IT FREE",
    hook: "NOT EVERY PLAN GETS FABLE 5",
    context: "Included on Max & Team Premium — Pro pays with credits",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#6E93BD", text: "WHO GETS IT FREE?" }, // "how the new structure affects each subscription" (2060)
      // EVIDENCE: the tweet spelling out the split
      { at: 200, scene: "receipt", tint: "#D97757", text: "the split", shot: { src: "assets/external/screenshots/fable-permanent-tweet.png", url: "x.com/claudeai", imageW: 1100, imageH: 786, from: { x: 0, y: 0, w: 1100, h: 786 }, to: { x: 0, y: 0, w: 1100, h: 786 }, highlight: { x: 30, y: 300, w: 1040, h: 200 }, highlightAt: 44 } }, // "Pro and Team Standard via usage credits" (2250-2560)
      { at: 620, scene: "stamp", verdict: "cross", badge: "PRO", tint: "#C9913D", text: "NOT INCLUDED" }, // "Pro users do not receive Fable 5 as permanent" (2650); span.from+13
    ],
    fullscreen: [{ from: 607, to: 760 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-PriceShock",
    label: "Outside the bundle, Fable 5 is the most expensive Claude model — $10/$50",
    source: "talking-head.mp4",
    from: 5290, // "that limit matters, because Fable 5 is extremely expensive…"
    // LOOP: ends "…during these long agentic sessions." (6540) → replays.
    durationInFrames: 1200, // ~40s
    topic: "THE REAL PRICE",
    hook: "THE MOST EXPENSIVE CLAUDE MODEL",
    context: "Fable 5 API: $10 in, $50 out per million tokens",
    beats: [
      { at: 8, scene: "emote", pose: "worried", tint: "#C65B52", text: "THE STEEPEST PRICE" }, // "Fable 5 is extremely expensive" (5290)
      // EVIDENCE: the pricing page, zoomed to the Fable 5 row
      { at: 650, scene: "receipt", tint: "#C65B52", text: "$10 in · $50 out", shot: { src: "assets/external/screenshots/fable-pricing-wide.png", url: "platform.claude.com", imageW: 1900, imageH: 1720, from: { x: 0, y: 60, w: 1900, h: 980 }, to: { x: 20, y: 200, w: 1860, h: 520 }, zoomAt: 26, highlight: { x: 1555, y: 300, w: 310, h: 100 }, highlightAt: 60 } }, // "$10 per million input, $50 per million output" (5940-6020)
      { at: 943, scene: "coins", tint: "#C65B52", stamp: "IT ADDS UP", text: "TOKENS ADD UP" }, // "output tokens accumulate quickly" (6491 → shown a touch early); span.from+13
    ],
    fullscreen: [{ from: 930, to: 1060 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ReserveIt",
    label: "Don't upgrade just for Fable 5 — reserve it for the tasks that need it",
    source: "talking-head.mp4",
    from: 9500, // "if you regularly use Claude Code for difficult work…"
    // LOOP: ends "…genuinely changes the result." (10120) → replays.
    durationInFrames: 900, // ~30s
    topic: "DON'T OVERPAY",
    hook: "DON'T UPGRADE JUST FOR FABLE 5",
    context: "Reserve Fable 5 for the hard tasks that need it",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "DON'T OVERPAY" }, // "upgrading purely because it's permanent may not make sense" (9200s)
      // EVIDENCE: Fable was #1 at launch (why it's worth it for hard work)
      { at: 60, scene: "receipt", tint: "#E8B84B", text: "#1 at launch", shot: { src: "assets/external/screenshots/fable-bench-tweet.png", url: "x.com/ArtificialAnlys", imageW: 1100, imageH: 1100, from: { x: 0, y: 0, w: 1100, h: 1100 }, to: { x: 0, y: 0, w: 1100, h: 1100 } } }, // it IS the strongest model — reserve it for that (9560)
      { at: 475, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "RESERVE IT FOR HARD STUFF" }, // "reserve Fable 5 for the tasks where it changes the result" (9962); span.from+13
    ],
    fullscreen: [{ from: 462, to: 615 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
