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
  // "Should you charge more for 'agentic'?" video (talking-head.mp4, 2026-07-19)
  // ==========================================================================
  {
    id: "Short-RipOff",
    label: "THE HOOK: the $800 line item + are you the reason 40% get cancelled?",
    source: "talking-head.mp4",
    from: 0, // "You've got a proposal open…"
    // LOOP: ends "…the answer isn't about the word at all." (894) → replays into the hook.
    durationInFrames: 909, // ~30s
    topic: "IS $800 FAIR?",
    hook: "AM I RIPPING THEM OFF?",
    context: "Pricing 'agentic' automation for small-business clients",
    beats: [
      { at: 8, scene: "emote", pose: "worried", tint: "#C9913D", text: "THE $800 GUILT" }, // "proposal… Agentic Workflow +$800… rip off a small business owner" (21-260)
      // EVIDENCE: Gartner's 40% cancellation stat
      { at: 474, scene: "receipt", tint: "#C65B52", text: "the 40% stat", shot: { src: "assets/external/screenshots/gartner-40-wide.png", url: "gartner.com/newsroom", imageW: 3644, imageH: 1948, to: { x: 140, y: 60, w: 2000, h: 1070 }, waypoints: [{ rect: { x: 0, y: 0, w: 3644, h: 1948 }, at: 0 }, { rect: { x: 140, y: 60, w: 2000, h: 1070 }, at: 26 }], highlight: { x: 170, y: 90, w: 1960, h: 300 }, highlightAt: 40 } }, // "Gartner said over 40% cancelled by 2027" (474-660)
      { at: 663, scene: "check", obj: "coin", verdict: "warn", tint: "#C9913D", text: "VALUE — OR THE PROBLEM?" }, // "are you charging for real value or are you the reason the stat exists?" (490-660); span.from+13
    ],
    fullscreen: [{ from: 650, to: 800 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-AgentWashing",
    label: "Only ~130 of thousands of 'agentic' vendors are real — the rest is agent-washing",
    source: "talking-head.mp4",
    from: 1140, // "Because Gartner didn't just predict cancellations…"
    // LOOP: ends "…whether that fear is justified for your work." (2033) → replays.
    durationInFrames: 908, // ~30s
    topic: "SPOT THE FAKE",
    hook: "MOST 'AGENTIC' AI IS FAKE",
    context: "Gartner: only ~130 vendors are genuinely agentic",
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#C9913D", text: "IS IT EVEN REAL?" }, // "Gartner looked at the market and said" (1180-1264)
      // EVIDENCE: only ~130 real vendors
      { at: 124, scene: "receipt", tint: "#C65B52", text: "only ~130 real", shot: { src: "assets/external/screenshots/gartner-130-wide.png", url: "gartner.com/newsroom", imageW: 3840, imageH: 2052, to: { x: 440, y: 940, w: 1820, h: 973 }, waypoints: [{ rect: { x: 300, y: 800, w: 2400, h: 1283 }, at: 0 }, { rect: { x: 440, y: 940, w: 1820, h: 973 }, at: 26 }], highlight: { x: 470, y: 1075, w: 1720, h: 100 }, highlightAt: 40 } }, // "only about 130 vendors out of thousands" (1264-1470)
      { at: 357, scene: "stamp", verdict: "cross", badge: "'AGENTIC'", tint: "#C65B52", text: "AGENT-WASHING" }, // "everybody else is agent-washing, slapping the word on ordinary automation" (1484-1650); span.from+13
      { at: 560, scene: "emote", pose: "facepalm", tint: "#C9913D", text: "A NEW COAT OF PAINT" }, // "relabelled workflows wearing a new coat of paint" (1560-1720)
    ],
    fullscreen: [{ from: 344, to: 524 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-MarketSettled",
    label: "The biggest vendors already price on outcomes — Deloitte, SAP, Zendesk",
    source: "talking-head.mp4",
    from: 4940, // "…the market already settled this argument."
    // LOOP: ends "…they're just caught up." (5950) → replays.
    durationInFrames: 1025, // ~34s
    topic: "OUTCOMES, NOT HOURS",
    hook: "THE BIG VENDORS ALREADY DO THIS",
    context: "Outcome-based pricing is now the default",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#6E93BD", text: "YOU'RE NOT OVERCHARGING" }, // "the market already settled this argument" (4870-4952)
      // EVIDENCE: Deloitte accounting guidance
      { at: 130, scene: "receipt", tint: "#6E93BD", text: "Deloitte guidance", shot: { src: "assets/external/screenshots/deloitte-outcome-wide.png", url: "dart.deloitte.com", imageW: 3840, imageH: 2052, to: { x: 1240, y: 640, w: 1900, h: 1016 }, waypoints: [{ rect: { x: 1000, y: 500, w: 2500, h: 1337 }, at: 0 }, { rect: { x: 1240, y: 640, w: 1900, h: 1016 }, at: 26 }], highlight: { x: 1280, y: 720, w: 1810, h: 250 }, highlightAt: 40 } }, // "Deloitte published accounting guidance on outcome-based pricing" (4952-5200)
      // OFFICIAL FILM: SAP Joule
      { at: 352, scene: "clip", tint: "#6E93BD", text: "SAP Joule", clip: { src: "assets/external/clips/sap-joule-clip.mp4" } }, // "SAP's own Joule agents now bill on consumption, not seats" (5279-5400); span.from+13
      // EVIDENCE: Zendesk per-resolution
      { at: 530, scene: "receipt", tint: "#4FA98A", text: "pay per resolution", shot: { src: "assets/external/screenshots/zendesk-pricing-wide.png", url: "zendesk.com/newsroom", imageW: 3840, imageH: 2052, to: { x: 980, y: 60, w: 2100, h: 1123 }, waypoints: [{ rect: { x: 900, y: 40, w: 2400, h: 1283 }, at: 0 }, { rect: { x: 980, y: 60, w: 2100, h: 1123 }, at: 26 }], highlight: { x: 1000, y: 600, w: 1600, h: 130 }, highlightAt: 44 } }, // "Zendesk charges $1.50 to $2 per automated resolution" (5400-5620)
      { at: 800, scene: "stamp", verdict: "check", badge: "JUST CAUGHT UP", tint: "#4FA98A", text: "NOT OVERCHARGING" }, // "a freelancer doing the same thing isn't overcharging, they're just caught up" (5720-5950)
    ],
    fullscreen: [{ from: 339, to: 519 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-TheNumber",
    label: "The number: $50-$250/hr, +30-50% for shipped proof, +20-40% for a niche",
    source: "talking-head.mp4",
    from: 5980, // "So here's the number."
    // LOOP: ends "…the $800 was never the question." (6823) → replays.
    durationInFrames: 858, // ~29s
    topic: "WHAT TO CHARGE",
    hook: "CHARGE $50–$250+ AN HOUR",
    context: "2026 agentic-automation freelance rates",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "HERE'S THE NUMBER" }, // "so here's the number" (5960-5996)
      // EVIDENCE: the rate table
      { at: 130, scene: "receipt", tint: "#4FA98A", text: "the rate table", shot: { src: "assets/external/screenshots/rates-table-wide.png", url: "ai-agentsplus.com", imageW: 2694, imageH: 1440, to: { x: 440, y: 320, w: 1860, h: 995 }, waypoints: [{ rect: { x: 0, y: 0, w: 2694, h: 1440 }, at: 0 }, { rect: { x: 440, y: 320, w: 1860, h: 995 }, at: 26 }], highlight: { x: 460, y: 380, w: 1830, h: 700 }, highlightAt: 44 } }, // "$50 to $250-plus an hour" (5996-6190)
      // EVIDENCE: the premiums
      { at: 340, scene: "receipt", tint: "#4FA98A", text: "the premiums", shot: { src: "assets/external/screenshots/rates-premium-wide.png", url: "ai-agentsplus.com", imageW: 2960, imageH: 1582, to: { x: 380, y: 40, w: 2100, h: 1123 }, waypoints: [{ rect: { x: 380, y: 300, w: 1900, h: 1016 }, at: 0 }, { rect: { x: 380, y: 20, w: 1900, h: 1016 }, at: 180 }], highlight: { x: 500, y: 500, w: 1780, h: 130 }, highlightAt: 20 } }, // "5+ shipped projects → 30-50%… niche → another 20-40%" (6199-6560)
      { at: 573, scene: "stamp", verdict: "check", badge: "SHIPPED PROOF", tint: "#4FA98A", text: "PROOF > THE WORD" }, // "shipped proof earns that premium more than the word agentic ever will" (6560-6720); span.from+13
    ],
    fullscreen: [{ from: 560, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
