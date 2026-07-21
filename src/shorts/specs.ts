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
  // "Qwen 3.8 Max — second only to Fable 5?" video (talking-head.mp4, 2026-07-22)
  // ==========================================================================
  {
    id: "Short-SecondOnly",
    label: "THE HOOK: Alibaba's 'second only to Fable 5' claim — try to check it",
    source: "talking-head.mp4",
    from: 0, // "Alibaba just called Qwen 3.8 Max…"
    // LOOP: ends "…testing method behind the ranking." (658) → replays into the claim.
    durationInFrames: 673, // ~22s
    topic: "THE BIG CLAIM",
    hook: "SECOND ONLY TO FABLE 5?",
    context: "Alibaba's new 2.4T Qwen 3.8 Max launch claim",
    beats: [
      // EVIDENCE: the launch tweet, claim line highlighted
      { at: 8, scene: "receipt", tint: "#D97757", text: "the launch post", shot: { src: "assets/external/screenshots/qwen-tweet.png", url: "x.com/Alibaba_Qwen", imageW: 1100, imageH: 1394, from: { x: 0, y: 0, w: 1100, h: 1394 }, to: { x: 0, y: 60, w: 1100, h: 900 }, zoomAt: 20, highlight: { x: 35, y: 390, w: 755, h: 52 }, highlightAt: 40 } }, // "second most powerful… second only to Fable 5" (89-229)
      { at: 379, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "WHERE'S THE PROOF?" }, // "try finding the benchmark that proves it" (372); span.from+13
      { at: 530, scene: "stamp", verdict: "cross", badge: "THE RANKING", tint: "#C65B52", text: "NOTHING PUBLISHED" }, // "hasn't published the benchmark names, scores, prompts (498-650)"
    ],
    fullscreen: [{ from: 366, to: 516 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-KimiTest",
    label: "The only real head-to-head so far: Kimi K3 edges Qwen 3.8 on a 269-file task",
    source: "talking-head.mp4",
    from: 5160, // "An independent tester ran Qwen 3.8 Max Preview and Moonshot's Kimi K3…"
    // LOOP: ends "…handled lifecycle changes more completely." (6002) → replays.
    durationInFrames: 857, // ~29s
    topic: "THE ONLY REAL TEST",
    hook: "KIMI vs QWEN — ONE REAL TEST",
    context: "Same 269-file architecture task, blind-reviewed",
    beats: [
      { at: 8, scene: "race", tint: "#6E93BD", text: "SAME TASK, TWO MODELS" }, // "an independent tester ran both" (5179)
      { at: 299, scene: "queue", labels: ["269 FILES", "SAME PROMPT", "BLIND REVIEW"], tint: "#C9913D", text: "A REAL WORKLOAD" }, // "both inspected the same 269 files" (5459)
      { at: 580, scene: "stamp", verdict: "check", badge: "KIMI K3", tint: "#4FA98A", text: "+3 PTS" }, // "Kimi finished three points ahead after blind review" (5740); span.from+13
      { at: 720, scene: "check", obj: "gauge", verdict: "check", tint: "#6E93BD", text: "LEANER, QUICKER" }, // "completed faster, used fewer tokens" (5850-6000)
    ],
    fullscreen: [{ from: 567, to: 705 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-PriceMess",
    label: "Kimi $3/$15, Fable $10/$50 — and Qwen 3.8 has no public per-token price",
    source: "talking-head.mp4",
    from: 7395, // "that's where the cost comparison becomes messy…"
    // LOOP: ends "…compare it with the API rates for Kimi or Fable." (8580) → replays.
    durationInFrames: 1200, // ~40s
    topic: "THE COST MESS",
    hook: "ONE OF THESE HAS NO PRICE",
    context: "Qwen 3.8 runs on credits — not per-token rates",
    beats: [
      { at: 8, scene: "emote", pose: "worried", tint: "#C9913D", text: "TRY COMPARING COSTS" }, // "the cost comparison becomes messy" (7403)
      { at: 180, scene: "check", obj: "coin", verdict: "check", tint: "#4FA98A", text: "$3 IN · $15 OUT" }, // "Kimi K3: $3 per million in, $15 out" (7575)
      // EVIDENCE: the Claude pricing page — Fable's $10/$50 row
      { at: 395, scene: "receipt", tint: "#C65B52", text: "$10 in · $50 out", shot: { src: "assets/external/screenshots/fable-pricing-wide.png", url: "platform.claude.com", imageW: 1900, imageH: 1720, from: { x: 0, y: 60, w: 1900, h: 980 }, to: { x: 20, y: 200, w: 1860, h: 520 }, zoomAt: 26, highlight: { x: 1555, y: 300, w: 310, h: 100 }, highlightAt: 50 } }, // "Fable 5 costs $10 in, $50 out" (7790)
      { at: 545, scene: "coins", tint: "#C9913D", stamp: "PER MILLION", text: "REAL MONEY" }, // "$50 per million output tokens" (7920-8000)
      { at: 620, scene: "stamp", verdict: "cross", badge: "QWEN 3.8 MAX", tint: "#C65B52", text: "A BLANK PRICE TAG" }, // "doesn't yet have an ordinary published price" (8015); span.from+13
    ],
    fullscreen: [{ from: 607, to: 757 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ThreeQuestions",
    label: "The 3 questions to run on ANY model launch before it touches production",
    source: "talking-head.mp4",
    from: 9690, // "So what should you do with Alibaba's claim? Ask three questions…"
    // LOOP: ends "…licensing and where your data is processed." (10651) → replays.
    durationInFrames: 976, // ~33s
    topic: "THE 3-QUESTION TEST",
    hook: "RUN THIS ON EVERY AI LAUNCH",
    context: "How to judge a model claim before deploying it",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "BEFORE YOU BELIEVE IT" }, // "so what should you do with Alibaba's claim" (9695)
      { at: 105, scene: "check", obj: "gauge", verdict: "warn", tint: "#6E93BD", text: "1 · THE FINE PRINT" }, // "first, compared under what conditions (9795-9915)"
      { at: 379, scene: "check", obj: "coin", verdict: "warn", tint: "#C9913D", text: "2 · REAL COST?" }, // "second, what does one completed task cost (10069)"
      { at: 680, scene: "check", obj: "shield", verdict: "warn", tint: "#C65B52", text: "3 · CAN IT SHIP?" }, // "third, can you actually deploy it (10370)"; span.from+13
    ],
    fullscreen: [{ from: 667, to: 817 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/calm.MP3",
    style: "paper",
  },
];
