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
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "THE REAL WIN" }, // "not a dramatic benchmark victory" (3231)
      // EVIDENCE EARLY (Kris, July 2026): the cost article lands on "the change
      // in cost and speed" — first beat visible at the split settle, logo here
      { at: 127, scene: "receipt", tint: "#34D399", text: "THE PAPER TRAIL", shot: { src: "assets/external/screenshots/aa-gpt56-landed-wide.png", url: "artificialanalysis.ai", imageW: 3840, imageH: 2052, from: { x: 700, y: 740, w: 1810, h: 375 }, to: { x: 560, y: 100, w: 2440, h: 1150 }, zoomAt: 8 } }, // "It is the change in cost and speed" (3288-3390); tall ~2:1 crop so the card fills the band
      { at: 303, scene: "conveyor", labels: ["SOL PRO"], tint: "#E8B84B", text: "THE TEST RUN", logo: "chatgpt" }, // "GPT 5.6 Sol Pro completed…" (3464); logo here — receipts stay lean
      { at: 425, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "1 MIN · 77¢" }, // "one minute (3586) for 77 cents (3624)"; span.from+13 = push midpoint
      { at: 591, scene: "coins", tint: "#EF4444", text: "6 MIN · $4" }, // "six minutes (3752)… cost $4 (3787)" — crossfades inside the span
      { at: 741, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "NIGHT AND DAY", emoji: "💸" }, // "massive efficiency difference" (3902)
      { at: 847, scene: "race", tint: "#34D399", text: "THE MATH: 1/6 · 1/5" }, // "one sixth of the time (4008), one fifth of the cost (4065)"
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
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "THE REAL UPGRADE" }, // "may be the biggest change right now" (100)
      // EVIDENCE EARLY (Kris, July 2026): @OpenAI's own launch tweet lands as
      // the brand is first named — first beat visible at the split settle
      { at: 147, scene: "receipt", tint: "#34D399", text: "THE ANNOUNCEMENT", shot: { src: "assets/external/screenshots/openai-tweet-work-launch.png", url: "x.com/OpenAI", imageW: 1100, imageH: 1010, from: { x: 100, y: 120, w: 940, h: 380 }, to: { x: 0, y: 0, w: 1100, h: 1010 }, zoomAt: 8 } }, // "OpenAI brought ChatGPT, Codex…" (153-305); holds ~4.2s
      // No span here: the tweet receipt runs right up to this beat, and a
      // span must NEVER start while a receipt is active (the card would blow
      // up full-screen and get swept by the push — Kris, July 2026).
      // No LogoPop needed: the CHATGPT block badge IS the brand mark here.
      { at: 273, scene: "bolt", trails: true, blockLabel: "CHATGPT", moduleLabel: "CODEX", tint: "#E8B84B", text: "THE MEGA-MERGE" }, // "together inside of one unified app" (305-400)
      { at: 457, scene: "doors", labels: ["WORK", "CODEX"], value: 0, tint: "#D97757", text: "PICK YOUR MODE" }, // "choose between work mode and Codex mode" (463)
      { at: 617, scene: "queue", labels: ["FILES", "BROWSER", "TOOLS"], tint: "#34D399", text: "ALL IN ONE CHAT" }, // "files, browsers, and connected tools" (701-830); span.from+13
    ],
    // full-anim: the one-conversation queue (the bolt gag stays split — see above)
    fullscreen: [{ from: 604, to: 698 }],
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
      // EVIDENCE EARLY (Kris, July 2026): the leaderboard being warned about,
      // on screen as it's spoken — first beat visible at the split settle
      { at: 92, scene: "receipt", tint: "#D97757", text: "THE BAIT", shot: { src: "assets/external/screenshots/benchlm-leaderboard-wide.png", url: "benchlm.ai", imageW: 3840, imageH: 2052, from: { x: 300, y: 820, w: 1200, h: 340 }, to: { x: 260, y: 460, w: 3320, h: 1566 }, zoomAt: 8 } }, // "one model reached the top of a leaderboard" (8977-9010); tall crop: headline + top-3 cards + table
      { at: 204, scene: "check", obj: "coin", verdict: "check", tint: "#E8B84B", text: "1 · THE BILL", logo: "chatgpt" }, // "cost per usable result" (9134); logo here — receipts stay lean
      { at: 263, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "2 · THE CLOCK" }, // "how long the task takes" (9193)
      { at: 334, scene: "retry", tint: "#F59E0B", text: "3 · THE FIXES" }, // "how much correction work is still required" (9264)
      { at: 457, scene: "stamp", verdict: "check", badge: "THE RULE", tint: "#34D399", text: "SWITCH AT 2 OF 3" }, // "at least two of those three" (9394); span.from+13
      { at: 544, scene: "coins", tint: "#EF4444", text: "FALSE ECONOMY" }, // "cheap output becomes expensive… repair" (9468) — crossfades inside the span
      { at: 645, scene: "check", obj: "gauge", verdict: "cross", tint: "#F59E0B", text: "SPEED TRAP" }, // "fast output… consistently wrong" (9575-9690)
    ],
    // full-anim: the 2-of-3 stamp + the repair-bill coin rain
    fullscreen: [{ from: 444, to: 590 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-GptLive",
    label: "GPT-Live: the real-time voice mode + the interrupt-it test",
    source: "talking-head.mp4",
    from: 1930, // "OpenAI also released GPT-Live during the same week."
    // LOOP: ends right after "…keeps track of the conversation." (abs 2796) →
    // replays into "OpenAI also released GPT-Live".
    durationInFrames: 880, // ~29s
    topic: "CHATGPT CAN TALK NOW",
    hook: "THE AI YOU CAN INTERRUPT",
    hookAlt: "CHATGPT'S NEW VOICE MODE", // A/B variant → Short-GptLive-B
    context: "GPT-Live = OpenAI's real-time voice model",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "ANOTHER LAUNCH" }, // "OpenAI also released GPT-Live during the same week" (1936-1985)
      // logo rides the receipt: beat 8 hands over right at the split settle
      // (~122), so this is the first beat fully visible when the band lands
      { at: 138, scene: "receipt", tint: "#E8B84B", text: "GPT-LIVE IS HERE", shot: { src: "assets/external/screenshots/siliconangle-gptlive-wide.png", url: "siliconangle.com", imageW: 2280, imageH: 1219, from: { x: 500, y: 120, w: 1600, h: 624 }, to: { x: 600, y: 380, w: 1640, h: 770 }, zoomAt: 8 } }, // "the new real-time voice experience" (2074-2136) — settles tight on the photo + headline column (no page margin in the card; byline row excluded); holds ~3.7s
      { at: 250, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "MORE THAN TALK", logo: "chatgpt" }, // "not simply that ChatGPT can speak" (2177-2245); logo here — receipts stay lean
      { at: 362, scene: "signal", tint: "#D97757", text: "KEEPS UP, OR LAGS?" }, // "feel responsive enough to become part of a real workflow" (2298-2410)
      { at: 499, scene: "queue", labels: ["WALK", "PRACTICE", "GAME"], tint: "#E8B84B", text: "REAL USES" }, // "brainstorm while walking (2435) / practice (2481) / tabletop game (2555)"; span.from+13
      { at: 703, scene: "emote", pose: "pointing", accent: "#EF4444", tint: "#EF4444", text: "TRY TO DERAIL IT", sub: "mid-sentence" }, // "interrupt it (2639), change one instruction (2669)"
    ],
    // full-anim: the three use-case chips carry the middle
    fullscreen: [{ from: 486, to: 660 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-JustBehindFable",
    label: "GDPval: Sol sits just behind Claude Fable — efficiency release, not IQ leap",
    source: "talking-head.mp4",
    from: 5136, // "On GDPval, the Sol tier reportedly sits just behind Claude Fable."
    // LOOP: ends right after "…for cost and latency are much clearer." (abs
    // 5882) → replays into "On GDPval".
    durationInFrames: 760, // ~25s
    topic: "CLAUDE STILL ON TOP?",
    hook: "OPENAI ALMOST CAUGHT CLAUDE",
    hookAlt: "CLAUDE'S LEAD IS SHRINKING", // A/B variant → Short-JustBehindFable-B
    context: "GDPval measures real work-task performance",
    beats: [
      { at: 8, scene: "check", obj: "brain", verdict: "warn", tint: "#E8B84B", text: "GDPVAL: REAL WORK" }, // "On GDPval" (5142-5182)
      // the head-to-head receipt lands ON "sits just behind Claude Fable";
      // it is also the first beat visible at the split settle → logo here
      { at: 82, scene: "receipt", tint: "#34D399", text: "91 VS 86", shot: { src: "assets/external/screenshots/benchlm-fable-vs-sol-wide.png", url: "benchlm.ai", imageW: 3840, imageH: 2052, from: { x: 700, y: 250, w: 2400, h: 640 }, to: { x: 480, y: 30, w: 2900, h: 1370 }, zoomAt: 8 } }, // "sits just behind Claude Fable" (5224-5290); tall crop: headline + full 91/86 score card
      { at: 243, scene: "check", obj: "gauge", verdict: "check", tint: "#60A5FA", text: "WHERE IT SHINES", logo: "chatgpt" }, // "performs strongly on browser based computer use" (5327-5440); logo here — receipts stay lean
      { at: 392, scene: "conveyor", labels: ["NAVIGATE", "COMPLETE"], tint: "#D97757", text: "AGENT-READY" }, // "agents that need to navigate websites and complete tasks" (5534-5592)
      { at: 509, scene: "stamp", verdict: "cross", badge: "IQ LEAP?", tint: "#F59E0B", text: "CHEAPER, NOT SMARTER" }, // "an efficiency release before… a massive intelligence leap" (5651-5770); span.from+13
    ],
    // full-anim: the IQ-LEAP? DENIED stamp is the payoff
    fullscreen: [{ from: 496, to: 614 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-PremiumWar",
    label: "Grok 4.5 + Fable 5 access back — three models now share the premium tier",
    source: "talking-head.mp4",
    from: 5960, // "…xAI also announced Grok 4.5" (5982)
    // LOOP: ends right after "…one of the strongest competitors of GPT 5.6."
    // (abs ~7015) → replays into the Grok announcement.
    durationInFrames: 1062, // ~35s
    topic: "THE PREMIUM AI WAR",
    hook: "3 AI GIANTS IN ONE WEEK",
    hookAlt: "GROK JUST CRASHED THE AI PARTY", // A/B variant → Short-PremiumWar-B
    context: "Grok 4.5 and Fable 5 landed the same week",
    // no logo beat: this short covers xAI/Anthropic moves — the ChatGPT mark
    // would mislabel it (the §9 logo rule is per-product)
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#D97757", text: "THE WEEK GOT CROWDED" }, // "xAI also announced Grok 4.5" (5982-6100)
      // brand first-mention receipt: xAI's own announcement page
      { at: 96, scene: "receipt", tint: "#EF4444", text: "THE NEW CHALLENGER", shot: { src: "assets/external/screenshots/xai-grok45-wide.png", url: "x.ai/news/grok-4-5", imageW: 3840, imageH: 2052, from: { x: 1050, y: 60, w: 1900, h: 481 }, to: { x: 1080, y: 20, w: 1720, h: 811 }, zoomAt: 8 } }, // "Grok 4.5" (6034-6100); tall crop tight on the announcement column
      // No span here: the Grok receipt runs right up to this beat — a span
      // must never start while a receipt is active (Kris, July 2026)
      { at: 216, scene: "doors", labels: ["GROK", "GPT-5.6", "FABLE"], tint: "#D97757", text: "THREE AT THE TOP" }, // "same premium category as GPT 5.6 and Claude Fable" (6123-6299)
      { at: 360, scene: "reject", badge: "BLIND SWITCH", tint: "#F59E0B", text: "NOT SO FAST" }, // "not seen enough evidence… move their workloads" (6274-6359)
      { at: 510, scene: "testbench", tint: "#34D399", text: "ONE FAIR FIGHT" }, // "give both models the same difficult task" (6476-6515)
      { at: 578, scene: "queue", labels: ["QUALITY", "TIME", "FIXES"], tint: "#E8B84B", text: "JUDGE 3 THINGS" }, // "output quality (6544), time taken, correction work (6617)"
      // brand first-mention receipt: Anthropic's own redeploy post
      { at: 732, scene: "receipt", tint: "#34D399", text: "BACK IN THE RING", shot: { src: "assets/external/screenshots/anthropic-fable5-redeploy-wide.png", url: "anthropic.com", imageW: 3840, imageH: 2052, from: { x: 1100, y: 340, w: 1650, h: 435 }, to: { x: 780, y: 40, w: 2280, h: 1075 }, zoomAt: 8 } }, // "Anthropic widened access to Claude Fable 5" (6670-6780); tall crop: headline + UPDATE badge + restored line
      { at: 836, scene: "breaker", tint: "#D97757", text: "MORE ROOM TO TEST" }, // "reset Claude Devs' rate limits" (6802-6833)
    ],
    // NO spans: both would start while a receipt beat is active (Grok at 96,
    // Anthropic at 732), and a span must never blow a receipt up full-screen
    // (Kris, July 2026) — this evidence-heavy short stays split throughout
    fullscreen: [],
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
      { at: 99, scene: "receipt", tint: "#60A5FA", text: "DROP 1 OF 3", shot: { src: "assets/external/screenshots/seedream5-pro-wide.png", url: "seed.bytedance.com", imageW: 3840, imageH: 2052, from: { x: 1100, y: 100, w: 2000, h: 360 }, to: { x: 160, y: 20, w: 3480, h: 1641 }, zoomAt: 8 } }, // "ByteDance released Seedream 5.0 Pro" (7757) — tall crop: the headline carries, body is context
      { at: 180, scene: "receipt", tint: "#D97757", text: "DROP 2 OF 3", shot: { src: "assets/external/screenshots/meta-musespark-wide.png", url: "ai.meta.com", imageW: 3840, imageH: 2052, from: { x: 400, y: 30, w: 2000, h: 864 }, to: { x: 300, y: 20, w: 3240, h: 1400 }, zoomAt: 8 } }, // "Meta released Muse Spark 1.1" (7838); dark hero vs light page — layouts differ
      { at: 324, scene: "stamp", verdict: "check", badge: "GOOGLE PHOTOS", tint: "#34D399", text: "DROP 3 OF 3" }, // "added Video Remix to Google Photos" (7988)
      { at: 476, scene: "reject", badge: "LAUNCH DEMO", tint: "#EF4444", text: "SHINY ≠ PROVEN" }, // "would not change the image tools because of a launch demo" (8020-8140); span.from+13
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
