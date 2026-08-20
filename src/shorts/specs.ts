import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// Claude invisible watermark (talking-head-190826.mp4, 2026-08-19 cut_synced).
// `from` = start frame in the source (sec × 30); `beats[].at` is clip-local,
// anchored to the WHISPER word times (captions-190826.ts). Every short OPENS
// on the FACE hook, then an evidence receipt in the split band, and a
// fullscreen span for the payoff. faceX: 49 (face sits ~48.5%). voice 1.3.
// NOTE: shorts stay "paper" style until Kris converts them (brand v2 note).
// ============================================================================
const SHOT = "assets/external/screenshots";

export const SHORTS: ShortSpec[] = [
  {
    id: "Short-WmProvesLess",
    label: "The thesis: a hit shows contact, not authorship — 4 uses, same signal",
    source: "talking-head-190826.mp4",
    from: 7399, // "If somebody detects this watermark, what have they actually proven?"
    durationInFrames: 859, // ~29s
    topic: "WHAT'S IT PROVE?",
    hook: "THE WATERMARK DOESN'T PROVE CLAUDE WROTE IT.",
    context: "Claude now watermarks all its text",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#C65B52", text: "anthropic's own answer", shot: { src: `${SHOT}/wmc-blog-prove.png`, url: "anthropic.com/news/claude-text-watermark", imageW: 3840, imageH: 1020, from: { x: 1180, y: 60, w: 1620, h: 918 }, to: { x: 1080, y: 0, w: 1800, h: 1020 }, zoomAt: 8, highlight: { x: 1190, y: 350, w: 1560, h: 260 }, highlightAt: 130 } }, // "cannot distinguish 'Claude wrote this' from 'Claude heavily edited this'"
      { at: 253, scene: "stamp", verdict: "warn", badge: "CONTACT ONLY", tint: "#C9913D", text: "THAT'S ALL IT SHOWS" }, // span; "can show that the text passed through Claude" (7648)
      { at: 540, scene: "queue", labels: ["Proofread", "Translate", "Edit", "Write"], tint: "#6E93BD", text: "ONE FLAG FITS ALL" }, // "proofread it… translate it… summarize or edit" (7943-8074)
    ],
    fullscreen: [{ from: 240, to: 440 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-WmCantSeeIt",
    label: "The mechanism: word forks + a secret key — invisible by design",
    source: "talking-head-190826.mp4",
    from: 2574, // "The watermark is created through the words Claude chooses"
    durationInFrames: 707, // ~24s
    topic: "CAN YOU SEE IT?",
    hook: "THERE'S A PATTERN HIDDEN IN CLAUDE'S WORDS.",
    context: "Claude watermarks text via word choice now",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "it travels with the text", shot: { src: `${SHOT}/wm-tweet-m1astra.png`, url: "x.com/M1Astra", imageW: 640, imageH: 1200, from: { x: 20, y: 40, w: 600, h: 700 }, to: { x: 0, y: 0, w: 640, h: 830 }, zoomAt: 8 } }, // public reaction: invisible, survives copy-paste
      { at: 315, scene: "doors", labels: ["grey", "overcast"], value: 1, tint: "#C9913D", text: "BOTH FIT. ONE WINS." }, // span; "maybe grey or overcast" (2903)
      { at: 505, scene: "stamp", verdict: "warn", badge: "A SECRET KEY", tint: "#C65B52", text: "TIPS THE CHOICE" }, // "uses a secret key to gently favour one" (3071)
    ],
    fullscreen: [{ from: 305, to: 495 }],
    outro: "FULL EXPLAINER ON THE CHANNEL",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-WmStudentEssay",
    label: "The stakes: your own essay + a grammar pass = same flag as AI-written",
    source: "talking-head-190826.mp4",
    from: 8252, // "So imagine that a student writes an essay entirely on their own…"
    durationInFrames: 682, // ~23s
    topic: "WHO WROTE IT?",
    hook: "YOUR OWN ESSAY COULD GET FLAGGED AS AI.",
    context: "Claude's invisible watermark, explained",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#C9913D", text: "anthropic's own limitations", shot: { src: `${SHOT}/wmc-support-limits.png`, url: "support.claude.com", imageW: 3840, imageH: 1560, from: { x: 1100, y: 220, w: 1750, h: 1200 }, to: { x: 1050, y: 120, w: 1900, h: 1300 }, zoomAt: 8, highlight: { x: 1130, y: 560, w: 1700, h: 180 }, highlightAt: 120 } }, // "Claude may not be the original author…"
      { at: 268, scene: "stamp", verdict: "cross", badge: "FLAGGED ANYWAY", tint: "#C65B52", text: "NO WAY TO KNOW" }, // span; "same type of detection as an essay Claude generated from scratch" (8516)
      { at: 520, scene: "reject", badge: "USER ID", tint: "#4FA98A", text: "NOTHING TO TRACE" }, // "doesn't carry a user ID… trace it back" (8807)
    ],
    fullscreen: [{ from: 255, to: 455 }],
    outro: "FULL STORY ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-WmEasyBreak",
    label: "The weakness: removal repos in days; one rewrite kills the signal",
    source: "talking-head-190826.mp4",
    from: 9331, // "Then we get to the other big limitation."
    durationInFrames: 667, // ~22s
    topic: "HOW STRONG IS IT?",
    hook: "THE CLAUDE WATERMARK BREAKS EASILY.",
    context: "Removal tools appeared within days",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#C65B52", text: "the removal repos, dated", shot: { src: `${SHOT}/wm-github-cleaner-commits.png`, url: "github.com/mikiane/claude-watermark-cleaner", imageW: 1920, imageH: 2000, from: { x: 130, y: 180, w: 1240, h: 500 }, to: { x: 0, y: 0, w: 1400, h: 760 }, zoomAt: 8, highlight: { x: 170, y: 315, w: 680, h: 110 }, highlightAt: 130 } }, // commits days after the blog
      { at: 443, scene: "breaker", tint: "#C65B52", text: "ONE PASS KILLS IT" }, // span; "another model rewrite it… break the signal" (9779-9914)
    ],
    fullscreen: [{ from: 430, to: 527 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-WmWhyNow",
    label: "The why: EU Article 50(2) + six labs signed; one global system",
    source: "talking-head-190826.mp4",
    from: 6100, // "So why roll this out globally in the first place?"
    durationInFrames: 928, // ~31s
    topic: "WHY NOW?",
    hook: "WHY DID EVERY AI LAB DO THIS AT ONCE?",
    context: "Claude now watermarks all text worldwide",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "the actual regulation", shot: { src: `${SHOT}/wmc-eu-header.png`, url: "digital-strategy.ec.europa.eu", imageW: 3840, imageH: 1500, from: { x: 460, y: 100, w: 2200, h: 1290 }, to: { x: 420, y: 0, w: 2400, h: 1400 }, zoomAt: 8 } }, // EU Code of Practice page
      { at: 553, scene: "queue", labels: ["OpenAI", "Google", "Meta", "Microsoft", "Mistral"], tint: "#C9913D", text: "SAME SIGNATURE" }, // span; the co-signatories as named (6720-6882)
      { at: 715, scene: "stamp", verdict: "check", badge: "NO EU-ONLY BUILD", tint: "#4FA98A", text: "EVERYONE GETS IT" }, // "rather than maintaining one version for Europe…" (6882)
    ],
    fullscreen: [{ from: 540, to: 700 }],
    outro: "SUBSCRIBE — AI NEWS WITHOUT THE HYPE",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
];
