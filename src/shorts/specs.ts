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
  // AI-news / GPT-5.6 super-app video (talking-head.mp4, 2026-07-14).
  // ==========================================================================
  {
    id: "Short-77Cents",
    label: "THE stat: Sol Pro does in 1 min / 77¢ what 5.5 Pro did in 6 min / $4",
    source: "talking-head.mp4",
    from: 3155, // "The strongest result is not a dramatic benchmark victory."
    // LOOP: ends on "…one fifth of the cost in that example." (abs 4125) →
    // replays into "not a dramatic benchmark victory" cleanly.
    durationInFrames: 980, // ~33s
    topic: "5× CHEAPER OVERNIGHT?",
    hook: "77¢ VS $4 — SAME AI JOB",
    hookAlt: "AI JUST GOT 5× CHEAPER", // A/B variant → Short-77Cents-B
    context: "GPT-5.6 = OpenAI's new flagship model",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "NOT A BENCHMARK STORY", logo: "chatgpt" }, // "not a dramatic benchmark victory" (3231); first beat visible at the split settle
      // Artificial Analysis is the spoken source — their cost article is the receipt
      { at: 204, scene: "receipt", tint: "#34D399", text: "THE COST REPORT", shot: { src: "assets/external/screenshots/aa-gpt56-landed-wide.png", url: "artificialanalysis.ai", imageW: 3840, imageH: 2052, from: { x: 700, y: 740, w: 1810, h: 375 }, to: { x: 490, y: 130, w: 2900, h: 600 }, zoomAt: 8 } }, // "Artificial Analysis report" (3365) — opens on the one-third-cost takeaway, settles on the headline banner
      { at: 303, scene: "conveyor", labels: ["SOL PRO"], tint: "#E8B84B", text: "SOL PRO, TESTED" }, // "GPT 5.6 Sol Pro completed…" (3464)
      { at: 425, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "1 MIN · 77¢" }, // "one minute (3586) for 77 cents (3624)"; span.from+13 = push midpoint
      { at: 591, scene: "coins", tint: "#EF4444", text: "6 MIN · $4" }, // "six minutes (3752)… cost $4 (3787)" — crossfades inside the span
      { at: 741, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "MASSIVE GAP", emoji: "💸" }, // "massive efficiency difference" (3902)
      { at: 847, scene: "race", tint: "#34D399", text: "1/6 TIME · 1/5 COST" }, // "one sixth of the time (4008), one fifth of the cost (4065)"
    ],
    // full-anim: the two bills, back to back (77¢ check → $4 coin rain)
    fullscreen: [{ from: 412, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-SuperApp",
    label: "The super-app: ChatGPT + Codex + browser fold into one app, two modes",
    source: "talking-head.mp4",
    from: 0, // "GPT 5.6 was the headline, but the new ChatGPT app…"
    // LOOP: ends right after "…inside of the same conversation." (abs 825) →
    // replays into "the biggest change right now".
    durationInFrames: 838, // ~28s
    topic: "THE CHATGPT SUPER-APP",
    hook: "3 APPS JUST BECAME ONE",
    hookAlt: "THE NEW CHATGPT SUPER-APP", // A/B variant → Short-SuperApp-B
    context: "OpenAI merged ChatGPT, Codex + browser",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "BIGGER THAN GPT-5.6?", logo: "chatgpt" }, // "may be the biggest change right now" (100)
      // span-owning beat sits at span.from+13 — the push's HIDDEN midpoint —
      // so the pull-left slides the PREVIOUS beat out (never the new one)
      { at: 203, scene: "bolt", trails: true, blockLabel: "CHATGPT", moduleLabel: "CODEX", tint: "#34D399", text: "ONE UNIFIED APP" }, // "brought ChatGPT, Codex… together" (250-371)
      { at: 340, scene: "check", obj: "brain", verdict: "check", tint: "#E8B84B", text: "+ THE BROWSER" }, // "its browser experience" (305; label trails the phrase)
      { at: 457, scene: "doors", labels: ["WORK", "CODEX"], value: 0, tint: "#D97757", text: "PICK YOUR MODE" }, // "choose between work mode and Codex mode" (463)
      { at: 617, scene: "queue", labels: ["FILES", "BROWSER", "TOOLS"], tint: "#34D399", text: "ONE CONVERSATION" }, // "files, browsers, and connected tools" (701-830); span.from+13
    ],
    // full-anim: the Codex bolt gag + the one-conversation queue
    fullscreen: [{ from: 190, to: 320 }, { from: 604, to: 698 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-SwitchTest",
    label: "The takeaway rule: measure cost/time/corrections, switch at 2 of 3",
    source: "talking-head.mp4",
    from: 8924, // "So do not switch because one model reached the top of a leaderboard."
    // LOOP: ends right after "…consistently wrong." (abs 9712) → replays into
    // "do not switch" — the trap loops into the rule.
    durationInFrames: 800, // ~27s
    topic: "SHOULD YOU SWITCH AI?",
    hook: "STOP SWITCHING AI FOR RANKINGS",
    hookAlt: "THE 3-METRIC AI TEST", // A/B variant → Short-SwitchTest-B
    context: "GPT-5.6 just beat rivals on cost + speed",
    beats: [
      { at: 8, scene: "migrate", tint: "#EF4444", text: "DON'T CHASE RANKINGS" }, // "do not switch… top of a leaderboard" (8940-9000)
      // logo rides THIS beat: beat 8 hands over right at the split settle
      // (~122) — the opening logo must sit on the first fully VISIBLE beat
      { at: 128, scene: "testbench", tint: "#D97757", text: "ONE REAL WORKFLOW", logo: "chatgpt" }, // "test one real workflow" (9040)
      { at: 204, scene: "check", obj: "coin", verdict: "check", tint: "#E8B84B", text: "1 · COST PER RESULT" }, // "cost per usable result" (9134)
      { at: 263, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "2 · TIME TAKEN" }, // "how long the task takes" (9193)
      { at: 334, scene: "retry", tint: "#F59E0B", text: "3 · FIX-UP WORK" }, // "how much correction work is still required" (9264)
      { at: 457, scene: "stamp", verdict: "check", badge: "THE RULE", tint: "#34D399", text: "SWITCH AT 2 OF 3" }, // "at least two of those three" (9394); span.from+13
      { at: 544, scene: "coins", tint: "#EF4444", text: "CHEAP → EXPENSIVE" }, // "cheap output becomes expensive… repair" (9468) — crossfades inside the span
      { at: 645, scene: "check", obj: "gauge", verdict: "cross", tint: "#F59E0B", text: "FAST BUT WRONG" }, // "fast output… consistently wrong" (9575-9690)
    ],
    // full-anim: the 2-of-3 stamp + the repair-bill coin rain
    fullscreen: [{ from: 444, to: 590 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ImageWeek",
    label: "Seedream 5.0 Pro + Muse Spark 1.1 + Video Remix — same-prompt test advice",
    source: "talking-head.mp4",
    from: 7658, // "The image model competition also kept moving."
    // LOOP: ends right after "…how many results you would actually keep." (abs
    // 8430) → replays into "the image model competition kept moving".
    durationInFrames: 782, // ~26s
    topic: "3 IMAGE AIS, ONE WEEK",
    hook: "3 IMAGE AIs DROPPED AT ONCE",
    hookAlt: "DON'T BUY THE LAUNCH DEMO", // A/B variant → Short-ImageWeek-B
    context: "Seedream 5.0 · Muse Spark 1.1 · Video Remix",
    // no logo beat: this short covers ByteDance/Meta/Google launches — the
    // ChatGPT mark would mislabel it (the §9 logo rule is per-product)
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "IMAGE AI WEEK" }, // "the image model competition also kept moving" (7664)
      // brand first-mention receipts from the brands' OWN pages (max 2/short)
      { at: 99, scene: "receipt", tint: "#60A5FA", text: "SEEDREAM 5.0 PRO", shot: { src: "assets/external/screenshots/seedream5-pro-wide.png", url: "seed.bytedance.com", imageW: 3840, imageH: 2052, from: { x: 1100, y: 100, w: 2000, h: 360 }, to: { x: 180, y: 40, w: 3440, h: 620 }, zoomAt: 8 } }, // "ByteDance released Seedream 5.0 Pro" (7757) — headline banner only, body text never carries the card
      { at: 180, scene: "receipt", tint: "#D97757", text: "MUSE SPARK 1.1", shot: { src: "assets/external/screenshots/meta-musespark-wide.png", url: "ai.meta.com", imageW: 3840, imageH: 2052, from: { x: 400, y: 30, w: 2000, h: 864 }, to: { x: 300, y: 20, w: 3240, h: 1400 }, zoomAt: 8 } }, // "Meta released Muse Spark 1.1" (7838); dark hero vs light page — layouts differ
      { at: 324, scene: "stamp", verdict: "check", badge: "GOOGLE PHOTOS", tint: "#34D399", text: "VIDEO REMIX" }, // "added Video Remix to Google Photos" (7988)
      { at: 476, scene: "reject", badge: "LAUNCH DEMO", tint: "#EF4444", text: "DON'T TRUST DEMOS" }, // "would not change the image tools because of a launch demo" (8020-8140); span.from+13
      { at: 517, scene: "conveyor", labels: ["SAME PROMPT"], tint: "#D97757", text: "RUN IT EVERYWHERE" }, // "use the same prompt across your current models" (8181) — crossfades inside the span
      { at: 633, scene: "queue", labels: ["ACCURACY", "CONSISTENCY", "KEEPERS"], tint: "#F59E0B", text: "SCORE 3 THINGS" }, // "prompt accuracy, consistency… actually keep" (8297-8430)
    ],
    // full-anim: the demo-reject gag + the same-prompt belt
    fullscreen: [{ from: 463, to: 600 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
