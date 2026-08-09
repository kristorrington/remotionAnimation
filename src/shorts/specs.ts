import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// Astra ten-proofs fact-check (talking-head-090826.mp4, 2026-08-09). `from` =
// start frame in the source (sec × 30); `beats[].at` is clip-local, anchored to
// the WHISPER word times (captions-090826.ts). Every short OPENS on the FACE
// hook, then an evidence receipt / clip in the split band, and a fullscreen
// span for the payoff stamp. faceX: 51 → the talking head is CENTRED (this
// recording sits face-centre). voice 1.3 (source peaks −3.7 dB). CLAUDE.md §9.
// ============================================================================
const SHOT = "assets/external/screenshots";
const CLIP = "assets/external/clips";

export const SHORTS: ShortSpec[] = [
  {
    id: "Short-Astra27",
    label: "The viral '80-year-old problem' is really 27 years (1999 non-sofic)",
    source: "talking-head-090826.mp4",
    from: 3266, // "the number everybody's repeating… an 80-year-old problem"
    durationInFrames: 680, // ~23s
    topic: "80 OR 27?",
    hook: "NO, IT WASN'T AN 80-YEAR PROBLEM.",
    context: "The viral OpenAI-math number is wrong",
    faceX: 51,
    beats: [
      { at: 8, scene: "receipt", tint: "#C65B52", text: "the actual list", shot: { src: `${SHOT}/astra-nonsofic.png`, url: "openai.com/index/ten-advances-in-mathematics", imageW: 1500, imageH: 750, from: { x: 80, y: 60, w: 1340, h: 630 }, to: { x: 0, y: 0, w: 1500, h: 750 }, zoomAt: 8, highlight: { x: 115, y: 330, w: 1270, h: 100 }, highlightAt: 120 } }, // "the hardest one is non-sofic groups"
      { at: 300, scene: "stamp", verdict: "warn", badge: "OPEN SINCE 1999", tint: "#C9913D", text: "NOT 80" }, // span; "open since 1999" (3661)
      { at: 520, scene: "stamp", verdict: "cross", badge: "27 ≠ 80", tint: "#C65B52", text: "DO THE MATH" }, // "about 27 years, not eighty" (loop)
    ],
    fullscreen: [{ from: 290, to: 500 }],
    outro: "FULL FACT-CHECK ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-AstraLean",
    label: "Why the math can't be faked — every proof machine-checked in Lean 4",
    source: "talking-head-090826.mp4",
    from: 1600, // "every proof… machine-checked in Lean 4"
    durationInFrames: 660, // ~22s
    topic: "CAN AI FAKE IT?",
    hook: "THE ONE REVIEWER AI CAN'T FOOL.",
    context: "Lean 4 = a proof checker that re-derives every step",
    faceX: 51,
    beats: [
      { at: 8, scene: "clip", tint: "#4FA98A", text: "MACHINE-CHECKED", clip: { src: `${CLIP}/astra-stock-code.mp4` } }, // "machine-checked in Lean 4" (band)
      { at: 300, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "RE-DERIVES EVERY STEP" }, // span; "re-derives every logical step"
      { at: 500, scene: "stamp", verdict: "check", badge: "CAN'T BE FOOLED", tint: "#4FA98A", text: "APPROVED = PROVEN" }, // "can't be talked into approving" (loop)
    ],
    fullscreen: [{ from: 290, to: 480 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-AstraWrongPost",
    label: "The 80-year headline belongs to a SEPARATE May post, not the Aug one",
    source: "talking-head-090826.mp4",
    from: 4380, // "back in May 20th… same co-author, Gowers again"
    durationInFrames: 640, // ~21s
    topic: "WHO GOOFED?",
    hook: "THE HEADLINE'S ON THE WRONG POST.",
    context: "The real 80-year result shipped back in May",
    faceX: 51,
    beats: [
      { at: 8, scene: "receipt", tint: "#4FA98A", text: "may 20 — the real one", shot: { src: `${SHOT}/astra-may-erdos-wide.png`, url: "openai.com/index/model-disproves-discrete-geometry-conjecture", imageW: 3840, imageH: 2052, from: { x: 1011, y: 287, w: 1822, h: 974 }, to: { x: 154, y: 82, w: 3532, h: 1888 }, zoomAt: 8 } }, // "the real 80-year result, May 20"
      { at: 300, scene: "stamp", verdict: "warn", badge: "WRONG POST", tint: "#C9913D", text: "BOTH ARE REAL" }, // span; "hung the headline on the wrong post"
      { at: 500, scene: "stamp", verdict: "cross", badge: "MAY ≠ AUG", tint: "#C65B52", text: "CHECK THE DATE" }, // loop
    ],
    fullscreen: [{ from: 290, to: 480 }],
    outro: "FULL FACT-CHECK ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-AstraTwoStandards",
    label: "Public checkable math vs an unverifiable closed-door briefing",
    source: "talking-head-090826.mp4",
    from: 6446, // "OpenAI puts its name on math… briefing nobody can verify"
    durationInFrames: 700, // ~23s
    topic: "WHICH HALF IS REAL?",
    hook: "ONE STORY. TWO STANDARDS.",
    context: "Proven math vs an unsourced jobs briefing",
    faceX: 51,
    beats: [
      { at: 8, scene: "receipt", tint: "#4FA98A", text: "public & checkable", shot: { src: `${SHOT}/astra-tweet-noam.png`, url: "x.com/polynoamial", imageW: 1100, imageH: 1490, from: { x: 20, y: 60, w: 1060, h: 1000 }, to: { x: 0, y: 0, w: 1100, h: 1490 }, zoomAt: 8 } }, // "recheck on your own laptop"
      { at: 320, scene: "reject", badge: "NO SOURCE", tint: "#C9913D", text: "NOTHING PUBLISHED" }, // span; "they've said nothing at all"
      { at: 540, scene: "check", obj: "gauge", verdict: "warn", tint: "#C9913D", text: "PROOF vs RUMOUR" }, // "capability vs stakes signal" (loop)
    ],
    fullscreen: [{ from: 310, to: 520 }],
    outro: "FOLLOW FOR FACT-CHECKED AI NEWS",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-AstraSystemCard",
    label: "The one document that settles whether Astra = the next flagship",
    source: "talking-head-090826.mp4",
    from: 8740, // "if the next release ships citing these ten proofs…"
    durationInFrames: 820, // ~27s
    topic: "PROVEN OR HYPE?",
    hook: "HOW TO KNOW IF IT'S REAL.",
    context: "Watch for one document: the system card",
    faceX: 51,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "still undecided", shot: { src: `${SHOT}/astra-tweet-testingcatalog.png`, url: "x.com/testingcatalog", imageW: 1100, imageH: 1550, from: { x: 25, y: 100, w: 1050, h: 900 }, to: { x: 0, y: 0, w: 1100, h: 1550 }, zoomAt: 8 } }, // "code name vs the model that shipped"
      { at: 320, scene: "stamp", verdict: "warn", badge: "SYSTEM CARD", tint: "#6E93BD", text: "DOESN'T EXIST YET" }, // span; "one document… doesn't exist yet"
      { at: 620, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "PROOF > HEADLINE" }, // "backed by public proofs / waiting on its footnote" (loop)
    ],
    fullscreen: [{ from: 310, to: 520 }],
    outro: "SUBSCRIBE FOR THE SYSTEM-CARD BREAKDOWN",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
];
