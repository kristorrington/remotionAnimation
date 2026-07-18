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
  // Kimi K3 video (talking-head.mp4, 2026-07-18).
  // ==========================================================================
  {
    id: "Short-KimiIntro",
    label: "THE TEASER: the video's own hook — #1 claim + the three catches",
    source: "talking-head.mp4",
    from: 0, // "Moonshot AI just revealed…"
    // LOOP: ends right after "…the results that changed the story." (abs 1030)
    // → replays into the reveal.
    durationInFrames: 1036, // ~35s
    topic: "THE 2.8T CHALLENGER",
    hook: "THE NEW AI KING?",
    hookAlt: "3 CATCHES BEFORE THE CROWN", // A/B → Short-KimiIntro-B
    context: "Kimi K3 = Moonshot's giant new open model",
    beats: [
      // SCENE 1 = the FACE hook. The reveal montage is the FIRST scene in the
      // TOP split band (face below), where the emote used to be (Kris, July 2026)
      { at: 8, scene: "clip", tint: "#D97757", text: "the reveal", clip: { src: "assets/external/clips/kimi-open-montage.mp4" } }, // "Moonshot AI just revealed the world's most powerful open model" (1-256) — montage TOP, face bottom
      // EVIDENCE: the arena table — K3 #1, Claude + GPT right below
      { at: 260, scene: "receipt", tint: "#4FA98A", text: "the arena table", shot: { src: "assets/external/screenshots/arena-webdev-top-wide.png", url: "arena.ai/leaderboard/code/webdev", imageW: 2820, imageH: 1507, to: { x: 40, y: 300, w: 2740, h: 800 }, waypoints: [{ rect: { x: 40, y: 300, w: 2740, h: 800 }, at: 0 }, { rect: { x: 40, y: 430, w: 2740, h: 640 }, at: 24 }, { rect: { x: 40, y: 470, w: 2740, h: 520 }, at: 150 }], highlight: { x: 46, y: 500, w: 2720, h: 100 }, highlightAt: 30 } }, // zoom K3 #1 → pan to Claude/GPT: "number one spot" (194-282) then "behind Claude Fable 5" (357-470)
      // the three catches, quick-fire inside the span
      { at: 553, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "CATCH 1" }, // "slower than some competing open models" (555-607)
      { at: 682, scene: "coins", tint: "#C65B52", text: "CATCH 2" }, // "a surprising number of tokens" (644-688)
      { at: 796, scene: "stamp", verdict: "cross", badge: "WEIGHTS", tint: "#C65B52", text: "CATCH 3" }, // "you still can't download the weights" (766-802)
    ],
    // full-anim: the catches trio (the reveal montage rides the TOP split band)
    fullscreen: [{ from: 540, to: 890 }],
    outro: "FULL VERDICT ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-HalfAPoint",
    label: "Vals: independent test puts K3 0.44 behind Claude, ahead of GPT",
    source: "talking-head.mp4",
    from: 1036, // "Vals AI independently tested Kimi K3…"
    // LOOP: ends right after "…close enough to take it seriously." (abs 1962)
    durationInFrames: 926, // ~31s
    topic: "CAN IT BEAT CLAUDE?",
    hook: "0.44% FROM THE THRONE",
    hookAlt: "THE TEST MOONSHOT DIDN'T RUN", // A/B → Short-HalfAPoint-B
    context: "Vals AI = independent model benchmarks",
    beats: [
      // SCENE 1 = the FACE hook. The reveal montage rides the TOP split band
      // (face below), where the emote used to be (Kris, July 2026)
      { at: 8, scene: "clip", tint: "#4FA98A", text: "the reveal", clip: { src: "assets/external/clips/kimi-open-montage.mp4" } }, // "Vals AI independently tested Kimi K3 across coding, finance, professional tasks" (1036-1205) — montage TOP, face bottom
      // EVIDENCE: the evaluation card with the 74.70% / #2-of-38 claim
      { at: 260, scene: "receipt", tint: "#4FA98A", text: "the vals card", shot: { src: "assets/external/screenshots/vals-kimi-card-wide.png", url: "vals.ai", imageW: 2900, imageH: 1550, to: { x: 80, y: 160, w: 1500, h: 802 }, waypoints: [{ rect: { x: 40, y: 40, w: 2820, h: 1507 }, at: 0 }, { rect: { x: 80, y: 160, w: 1500, h: 802 }, at: 26 }], highlight: { x: 120, y: 460, w: 900, h: 180 }, highlightAt: 40 } }, // zoom into "Kimi K3 scores 74.70%, placing #2 of 38" (1244-1452)
      { at: 620, scene: "check", obj: "brain", verdict: "check", tint: "#6E93BD", text: "JUST 0.44 SHORT" }, // "within half a percentage point" (1725-1768); span.from+13
      { at: 780, scene: "stamp", verdict: "check", badge: "FRONTIER", tint: "#4FA98A", text: "AHEAD OF GPT-5.6" }, // "finished ahead of GPT-5.6 Sol" (1790-1860)
    ],
    // full-anim: the 0.44-short check (the reveal montage rides the TOP band)
    fullscreen: [{ from: 607, to: 767 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-TokenTax",
    label: "The hidden catch: 130M output tokens — twice the median",
    source: "talking-head.mp4",
    from: 7400, // "…and slower output is only half the problem."
    // LOOP: ends right after "…running for an hour, you probably will." (abs 8292)
    durationInFrames: 907, // ~30s
    topic: "THE TOKEN TAX",
    hook: "SLOW AND EXPENSIVE?",
    hookAlt: "THE 130-MILLION-TOKEN PROBLEM", // A/B → Short-TokenTax-B
    context: "Kimi K3 = Moonshot's new 2.8T model",
    beats: [
      // SCENE 1 = the FACE hook. The reveal montage rides the TOP split band
      // (face below), where the emote used to be (Kris, July 2026)
      { at: 8, scene: "clip", tint: "#6E93BD", text: "the reveal", clip: { src: "assets/external/clips/kimi-open-montage.mp4" } }, // "slower output is only half the problem" (7409-7596) — montage TOP, face bottom
      // EVIDENCE: the AA verbosity tile
      { at: 260, scene: "receipt", tint: "#C65B52", text: "the 130M tile", shot: { src: "assets/external/screenshots/aa-kimi-tokens.png", url: "artificialanalysis.ai/models/kimi-k3", imageW: 660, imageH: 560, to: { x: 40, y: 70, w: 580, h: 420 }, waypoints: [{ rect: { x: 0, y: 0, w: 660, h: 560 }, at: 0 }, { rect: { x: 40, y: 70, w: 580, h: 420 }, at: 22 }] } }, // zoom into the 130M output-tokens number (7617-7673)
      { at: 543, scene: "coins", tint: "#C9913D", text: "2× THE MEDIAN" }, // "twice the median number of tokens" (7850-7897); span.from+13
      { at: 720, scene: "stack", tint: "#C65B52", text: "THE BILL STACKS UP" }, // "for a coding agent running for an hour" (8209-8257)
    ],
    // full-anim: the token rain (the reveal montage rides the TOP split band)
    fullscreen: [{ from: 530, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-NotOpenYet",
    label: "The open-model claim: API today, weights July 27, serious iron",
    source: "talking-head.mp4",
    from: 8911, // "Then there's the open-model claim."
    // LOOP: ends right after "…loading into a gaming PC." (abs 9843)
    durationInFrames: 947, // ~32s
    topic: "IS IT EVEN OPEN?",
    hook: "CALLED OPEN. CAN'T DOWNLOAD.",
    hookAlt: "THE OPEN MODEL YOU CAN'T HAVE", // A/B → Short-NotOpenYet-B
    context: "Kimi K3's weights ship July 27 — API only today",
    beats: [
      // SCENE 1 = the FACE hook. The reveal montage rides the TOP split band
      // (face below), where the emote used to be (Kris, July 2026)
      { at: 8, scene: "clip", tint: "#D97757", text: "the reveal", clip: { src: "assets/external/clips/kimi-open-montage.mp4" } }, // "then there's the open-model claim… available through an API" (8920-9071) — montage TOP, face bottom
      // EVIDENCE: Moonshot's own availability paragraph
      { at: 260, scene: "receipt", tint: "#6E93BD", text: "the July-27 line", shot: { src: "assets/external/screenshots/kimi-blog-july27-wide.png", url: "kimi.com/blog/kimi-k3", imageW: 2400, imageH: 1283, to: { x: 380, y: 240, w: 1560, h: 470 }, waypoints: [{ rect: { x: 300, y: 60, w: 2000, h: 1069 }, at: 0 }, { rect: { x: 380, y: 240, w: 1560, h: 470 }, at: 26 }], highlight: { x: 435, y: 372, w: 1280, h: 84 }, highlightAt: 40 } }, // zoom into "full model weights are promised for July 27" (9113-9166)
      { at: 498, scene: "stamp", verdict: "cross", badge: "WEIGHTS", tint: "#C65B52", text: "LOCKED UNTIL JULY 27" }, // "they don't make the weights available" (9441-9479); span.from+13
      { at: 700, scene: "racks", tint: "#C9913D", text: "NOT A GAMING PC" }, // "running it will require serious infrastructure" (9640-9701)
    ],
    // full-anim: the DENIED stamp (the reveal montage rides the TOP split band)
    fullscreen: [{ from: 485, to: 655 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
