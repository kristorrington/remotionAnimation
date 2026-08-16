import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// Graph Engineering debunk (talking-head-160826.mp4, 2026-08-16). `from` =
// start frame in the source (sec × 30); `beats[].at` is clip-local, anchored to
// the WHISPER word times (captions-160826.ts — audio +133ms baked into the
// proxy, so these captions run ~4f early: harmless lead). Every short OPENS on
// the FACE hook, then an evidence receipt / official clip in the split band,
// and a fullscreen span for the payoff stamp. faceX: 49 → the talking head is
// CENTRED (this recording sits ~48.5% left-of-frame). voice 1.3. CLAUDE.md §9.
// ============================================================================
const SHOT = "assets/external/screenshots";
const CLIP = "assets/external/clips";

export const SHORTS: ShortSpec[] = [
  {
    id: "Short-GraphOld",
    label: "The 'new' trend launched Jan 2024 — LangChain's own blog says 3 years",
    source: "talking-head-160826.mp4",
    from: 3392, // "None of this is new. LangGraph… launched in January 2024"
    durationInFrames: 704, // ~23s
    topic: "NEW… OR 2 YEARS OLD?",
    hook: "THIS 'NEW' AI TREND IS 2 YEARS OLD.",
    context: "Graph engineering = July's viral AI term",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "langchain's own blog", shot: { src: `${SHOT}/ge-langchain-blog-wide.png`, url: "langchain.com/blog", imageW: 1884, imageH: 1007, from: { x: 110, y: 340, w: 1330, h: 710 }, to: { x: 0, y: 0, w: 1884, h: 1007 }, zoomAt: 8 } }, // "3 Years of Graph Engineering with LangGraph"
      { at: 253, scene: "stamp", verdict: "warn", badge: "SINCE JAN 2024", tint: "#C9913D", text: "BEFORE THE NAME" }, // span; "2.5 years before people started calling it this" (3649)
      { at: 450, scene: "receipt", tint: "#4FA98A", text: "the live counter", shot: { src: `${SHOT}/ge-pypistats.png`, url: "pypistats.org/packages/langgraph", imageW: 1000, imageH: 645, from: { x: 20, y: 250, w: 960, h: 390 }, to: { x: 0, y: 0, w: 1000, h: 645 }, zoomAt: 8, highlight: { x: 35, y: 583, w: 520, h: 48 }, highlightAt: 110 } }, // "65 million downloads a month" (3950) → the 72.7M row, before the CTA
    ],
    fullscreen: [{ from: 240, to: 430 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-GraphFakeStat",
    label: "The +18%/−85% claim traced to nothing — Turing Post debunked it in 48h",
    source: "talking-head-160826.mp4",
    from: 7352, // "By July 19, a claim started spreading…"
    durationInFrames: 906, // ~30s
    topic: "WHO CHECKED IT?",
    hook: "THE VIRAL AI STAT WAS NEVER REAL.",
    context: "The +18%/−85% graph-engineering claim",
    faceX: 49,
    beats: [
      { at: 8, scene: "stamp", verdict: "cross", badge: "“REPLACED RAG”", tint: "#C9913D", text: "THE VIRAL CLAIM" }, // band lands as "had replaced RAG at Microsoft" (7484)
      { at: 263, scene: "stamp", verdict: "cross", badge: "+18% / −85%", tint: "#C65B52", text: "THE PROOF?" }, // span; the numbers land ON "18%" (7609) / "85%" (7676)
      { at: 599, scene: "receipt", tint: "#6E93BD", text: "the debunk", shot: { src: `${SHOT}/ge-turingpost.png`, url: "turingpost.com", imageW: 1796, imageH: 960, from: { x: 40, y: 0, w: 1520, h: 810 }, to: { x: 0, y: 0, w: 1796, h: 960 }, zoomAt: 8, highlight: { x: 50, y: 8, w: 1450, h: 180 }, highlightAt: 100 } }, // "Turing Post actually checked the claim" (7957)
      { at: 720, scene: "stamp", verdict: "cross", badge: "DEBUNKED", tint: "#C65B52", text: "THE CLAIM COLLAPSED" }, // "published a debunk on July 20" (8059)
    ],
    fullscreen: [{ from: 250, to: 470 }],
    outro: "FULL FACT-CHECK ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-GraphExplained",
    label: "The explainer: one agent run — dead end, loop back, split, merge = a graph",
    source: "talking-head-160826.mp4",
    from: 2544, // "In an AI agent researching a question…"
    durationInFrames: 772, // ~26s
    topic: "WHAT IS IT REALLY?",
    hook: "GRAPH ENGINEERING, IN ONE AGENT RUN.",
    context: "The AI buzzword taking over your feed",
    faceX: 49,
    beats: [
      { at: 8, scene: "clip", tint: "#6E93BD", text: "ONE AGENT. ONE RUN.", clip: { src: `${CLIP}/ge-langgraph-a.mp4` } }, // LangChain's own node-graph film (band)
      { at: 143, scene: "retry", tint: "#C9913D", text: "DEAD END? GO AGAIN" }, // span; "so loops back, researches the problem again" (2681)
      { at: 380, scene: "funnel", badge: "MERGED ✓", tint: "#4FA98A", text: "2 → 1" }, // "the agent combines both answers together" (2924)
      { at: 505, scene: "stamp", verdict: "check", badge: "A GRAPH", tint: "#C65B52", text: "NOT A LINE" }, // "the whole shape, that's a graph" (3061)
    ],
    fullscreen: [{ from: 130, to: 330 }],
    outro: "FOLLOW FOR AI EXPLAINERS",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-GraphOrigin",
    label: "Named in a quiet Jul 4 blog, ignored 2 weeks, then 2.8M views on Jul 18",
    source: "talking-head-160826.mp4",
    from: 5418, // "So who actually gave this thing a name?"
    durationInFrames: 934, // ~31s
    topic: "WHO NAMED IT?",
    hook: "FROM A QUIET BLOG TO 2.8M VIEWS.",
    context: "'Graph engineering' — named July 4, 2026",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "jul 4 — nobody noticed", shot: { src: `${SHOT}/ge-josh-simmons.png`, url: "drjoshcsimmons.com", imageW: 1446, imageH: 773, from: { x: 50, y: 300, w: 1340, h: 470 }, to: { x: 0, y: 0, w: 1446, h: 773 }, zoomAt: 8 } }, // "Josh Simmons used the phrase in a blog post" (5573)
      { at: 363, scene: "signal", verdict: "warn", sub: "14 days, 0 buzz", tint: "#C9913D", text: "STILL NOTHING" }, // span; static tower — "sat there for about two weeks" (5815)
      { at: 560, scene: "receipt", tint: "#C65B52", text: "jul 18 — it catches fire", shot: { src: `${SHOT}/ge-tweet-steipete.png`, url: "x.com/steipete", imageW: 1100, imageH: 450, from: { x: 60, y: 20, w: 980, h: 401 }, to: { x: 0, y: 0, w: 1100, h: 450 }, zoomAt: 8, highlight: { x: 70, y: 145, w: 960, h: 95 }, highlightAt: 140 } }, // "Steinberger posted a question… loops or graphs" (6054)
    ],
    fullscreen: [{ from: 350, to: 540 }],
    outro: "FULL ORIGIN STORY ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.3,
    style: "paper",
  },
  {
    id: "Short-GraphRule",
    label: "The rule that survives every buzzword: who actually shipped it?",
    source: "talking-head-160826.mp4",
    from: 10992, // "If a new term shows up everywhere…"
    durationInFrames: 876, // ~29s
    topic: "HYPE OR REAL?",
    hook: "ONE RULE KILLS EVERY AI BUZZWORD.",
    context: "Works on any viral AI term",
    faceX: 49,
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "what 'shipped' looks like", shot: { src: `${SHOT}/ge-adk.png`, url: "developers.googleblog.com", imageW: 2300, imageH: 1229, from: { x: 170, y: 300, w: 1560, h: 260 }, to: { x: 90, y: 20, w: 2120, h: 1060 }, zoomAt: 8 } }, // official docs = the bar (Google ADK blog)
      { at: 209, scene: "stamp", verdict: "check", badge: "SHOW ME THE DOCS", tint: "#4FA98A", text: "NOT THE HYPE" }, // span; "start by asking who actually shipped it" (11198)
      { at: 440, scene: "testbench", tint: "#C9913D", text: "PROVE IT WORKS" }, // "test it, build it, see what it does" (11432)
      { at: 643, scene: "reject", badge: "JUST A TWEET", tint: "#C65B52", text: "TALK ≠ SHIPPING" }, // span 2; "only exists inside tweets, blog posts…" (11636)
    ],
    fullscreen: [{ from: 196, to: 396 }, { from: 630, to: 730 }],
    outro: "SUBSCRIBE — HYPE-FREE AI NEWS",
    music: "music/calm.MP3",
    voice: 1.3,
    style: "paper",
  },
];
