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
  // Claude-skills ranking video (talking-head.mp4, 2026-07-16).
  // ==========================================================================
  {
    id: "Short-Superpowers",
    label: "THE HOOK: the #1 pick — Superpowers stops Claude jumping into the build",
    source: "talking-head.mp4",
    from: 6958, // "Number one on my list is Superpowers"
    // LOOP: ends right after "…creates more work later." (abs 7688) → replays
    // into "Number one is Superpowers" (the fix for exactly that).
    durationInFrames: 736, // ~25s
    topic: "THE #1 SKILL",
    hook: "THE #1 CLAUDE CODE SKILL",
    hookAlt: "STOP CLAUDE JUMPING IN", // A/B variant → Short-Superpowers-B
    context: "Superpowers = 941k-install planning skill",
    beats: [
      { at: 8, scene: "emote", pose: "celebrate", tint: "#E8B84B", text: "THE #1 PICK" }, // "Number one… is Superpowers" (6970-7090)
      // EVIDENCE EARLY: the official marketplace listing carries the install count
      { at: 128, scene: "receipt", tint: "#D97757", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/superpowers-plugin-wide.png", url: "claude.com/plugins/superpowers", imageW: 2560, imageH: 1368, from: { x: 1790, y: 330, w: 760, h: 380 }, to: { x: 1660, y: 140, w: 900, h: 450 }, zoomAt: 8 } }, // "gives Claude a structured workflow" (7097-7232); holds ~6.8s
      { at: 331, scene: "bolt", tint: "#60A5FA", text: "THINK FIRST" }, // "an operating system for Claude" (7295-7334)
      { at: 450, scene: "stamp", verdict: "cross", badge: "BUILD NOW", tint: "#EF4444", text: "PUMP THE BRAKES" }, // "stopping Claude from jumping straight into the build" (7414-7514); span.from+13
      { at: 612, scene: "check", obj: "gauge", verdict: "warn", tint: "#F59E0B", text: "DEMO ≠ DELIVERY" }, // "looks impressive early but creates more work later" (7576-7688)
    ],
    // full-anim: the BUILD NOW stamp gag
    fullscreen: [{ from: 437, to: 590 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-80Percent",
    label: "Loop Library: Claude stops at 80% and calls it finished",
    source: "talking-head.mp4",
    from: 2318, // "Claude completes part of a task…"
    // LOOP: ends right after "…the job is not actually finished." (abs 3168)
    // → replays into "Claude completes part of a task".
    durationInFrames: 872, // ~29s
    topic: "CLAUDE'S 80% HABIT",
    hook: "CLAUDE STOPS AT 80%",
    hookAlt: "THE 80% PROBLEM", // A/B variant → Short-80Percent-B
    context: "Loop Library = free prompts that finish the job",
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#F59E0B", text: "SOUND FAMILIAR?" }, // "completes part of a task" (2322-2400)
      { at: 130, scene: "stamp", verdict: "check", badge: "80% DONE", tint: "#EF4444", text: "DECLARES VICTORY" }, // "confidently says the job is finished" (2434-2510)
      // EVIDENCE: Matthew Berman's own launch tweet, on the claim it fixes
      { at: 323, scene: "receipt", tint: "#34D399", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/berman-loop-tweet.png", url: "x.com/MatthewBerman", imageW: 1100, imageH: 1058, from: { x: 20, y: 10, w: 1060, h: 530 }, to: { x: 10, y: 5, w: 1080, h: 640 }, zoomAt: 8 } }, // "Loop Library gives you reusable prompts" (2635-2712); holds ~3.6s
      { at: 445, scene: "retry", tint: "#60A5FA", text: "RUN IT AGAIN" }, // "keep Claude working until… finish condition" (2718-2830); span.from+13
      { at: 579, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "GREEN OR NOTHING" }, // "every test passes… checklist completed" (2903-2985)
      { at: 706, scene: "emote", pose: "shrug", tint: "#EF4444", text: "GOOD ENOUGH ≠ DONE" }, // "stops when the answer looks acceptable" (3030-3092)
    ],
    // full-anim: the retry wheel loop gag
    fullscreen: [{ from: 432, to: 570 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-PxPipe",
    label: "PX Pipe: context is the hidden token bill — turn it into images",
    source: "talking-head.mp4",
    from: 3805, // "Context becomes expensive."
    // LOOP: ends right after "…could make a meaningful difference." (abs 4807)
    // → replays into "context becomes expensive".
    durationInFrames: 1030, // ~34s
    topic: "THE TOKEN DIET",
    hook: "CLAUDE'S CONTEXT TAX",
    hookAlt: "CUT CLAUDE TOKENS 70%", // A/B variant → Short-PxPipe-B
    context: "PX Pipe = turns bulky context into images",
    beats: [
      { at: 8, scene: "coins", tint: "#F59E0B", text: "TOKENS ADD UP" }, // "context becomes expensive" (3811-3860)
      { at: 110, scene: "stack", tint: "#D97757", text: "THE PILE GROWS" }, // "files, screenshots, logs… previous outputs" (3921-4019)
      { at: 381, scene: "emote", pose: "alarmed", tint: "#EF4444", text: "THE MEMORY TAX" }, // "more tokens reminding Claude than completing it" (4192-4290)
      { at: 531, scene: "funnel", tint: "#60A5FA", text: "WORDS → PICTURES" }, // "convert bulky context into images" (4342-4390); span.from+13
      // EVIDENCE: pxpipe's own README paragraph with the 59-70% line
      { at: 776, scene: "receipt", tint: "#34D399", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/pxpipe-github-wide.png", url: "github.com/teamchong/pxpipe", imageW: 2100, imageH: 1122, from: { x: 30, y: 622, w: 1000, h: 500 }, to: { x: 20, y: 180, w: 1560, h: 780 }, zoomAt: 8 } }, // "up to 70% fewer tokens" (4575-4622); opens on the what-the-model-sees noise image, settles on the claim paragraph; holds ~4.7s into the CTA
    ],
    // full-anim: the funnel swap gag
    fullscreen: [{ from: 518, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-Taste",
    label: "Taste: kill the AI-slop look — same brief, with and without",
    source: "talking-head.mp4",
    from: 5448, // "So number two on my list is Taste."
    // LOOP: ends right after "…then compare the results." (abs 6371) → replays
    // into "number two is Taste".
    durationInFrames: 943, // ~31s
    topic: "THE ANTI-SLOP SKILL",
    hook: "AI APPS ALL LOOK THE SAME",
    hookAlt: "KILL THE AI SLOP LOOK", // A/B variant → Short-Taste-B
    context: "Taste = free anti-slop skill for Claude",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "SEEN THIS BEFORE?" }, // "push Claude away from the generic look" (5582-5629)
      // EVIDENCE EARLY: tasteskill.dev's own hero
      { at: 110, scene: "receipt", tint: "#34D399", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/taste-site-wide.png", url: "tasteskill.dev", imageW: 2800, imageH: 1497, from: { x: 180, y: 380, w: 900, h: 450 }, to: { x: 140, y: 80, w: 1300, h: 650 }, zoomAt: 8 } }, // "the generic look seen across many AI interfaces" (5616-5710); holds ~6.5s
      { at: 306, scene: "conveyor", labels: ["SAME UI AGAIN"], tint: "#EF4444", text: "SPOT THE DIFFERENCE" }, // "the same gradients, the same oversized heading" (5760-5804)
      { at: 470, scene: "check", obj: "gauge", verdict: "warn", tint: "#F59E0B", text: "RUNS FINE. LOOKS OFF." }, // "working doesn't mean it's always well designed" (5915-5972); span.from+13
      { at: 690, scene: "testbench", tint: "#60A5FA", text: "RUN IT TWICE" }, // "give Claude the same design brief and test it with and without Taste" (6194-6320)
    ],
    // full-anim: the warning gauge gag
    fullscreen: [{ from: 457, to: 610 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-Ranked",
    label: "The final ranking: why Superpowers beats Taste, PX Pipe, Loop and Reach",
    source: "talking-head.mp4",
    from: 8764, // "And this is why Superpowers ranks first on my list."
    // LOOP: ends right after "…following the wrong path." (abs 9327) → replays
    // into "why Superpowers ranks first".
    durationInFrames: 587, // ~20s
    topic: "FINAL RANKING",
    hook: "I RANKED 5 CLAUDE SKILLS",
    hookAlt: "THE 5-SKILL LEADERBOARD", // A/B variant → Short-Ranked-B
    context: "Superpowers, Taste, PX Pipe, Loop, Reach",
    beats: [
      { at: 8, scene: "emote", pose: "celebrate", tint: "#E8B84B", text: "No.1 DECIDED" }, // "Superpowers ranks first" (8804-8856)
      // EVIDENCE EARLY: the marketplace listing behind the winner
      { at: 128, scene: "receipt", tint: "#D97757", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/superpowers-plugin-wide.png", url: "claude.com/plugins/superpowers", imageW: 2560, imageH: 1368, from: { x: 1790, y: 330, w: 760, h: 380 }, to: { x: 1660, y: 140, w: 900, h: 450 }, zoomAt: 8 } }, // "Taste… fastest visible improvement" (8872-8924); holds ~4s
      { at: 250, scene: "doors", labels: ["SUPER", "TASTE", "PX", "LOOP", "REACH"], tint: "#60A5FA", text: "THE LEADERBOARD" }, // "PX Pipe (8948)… Loop Library (9040)… Agent Reach (9116)"
      // no fullscreen span: the receipt + five doors carry the whole 20s recap
    ],
    fullscreen: [],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
