import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// AI-news DeepSeek/OpenAI/Qwen roundup (talking-head-020826.mp4, 2026-08-02).
// `from` = start frame in the source footage (sec × 30). `beats[].at` is
// clip-local, anchored to the WHISPER word times (captions-020826.ts). Every
// short opens on the FACE, cuts to an evidence/animation beat, loops on an open
// line. `text` is a LABEL (captions carry the speech). CLAUDE.md §9.
// ============================================================================
export const SHORTS: ShortSpec[] = [
  {
    id: "Short-DeepSeekCost",
    label: "DeepSeek fixed the same bug for 2¢ that GLM charged $4 for",
    source: "talking-head-020826.mp4",
    from: 2150, // "there is one real-world test worth looking at…"
    // LOOP: ends "…the larger V4 Pro is coming soon." → replays into the hook.
    durationInFrames: 900, // 30s
    topic: "IS CHEAP AI WORSE?",
    hook: "SAME BUG. 2¢ vs $4.",
    context: "DeepSeek V4 Flash vs GLM on one real bug",
    beats: [
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "the receipt", shot: { src: "assets/external/screenshots/ai2-ds-pricing.png", url: "api-docs.deepseek.com/quick_start/pricing", imageW: 1560, imageH: 1800, from: { x: 0, y: 0, w: 1560, h: 1400 }, to: { x: 0, y: 0, w: 1560, h: 1800 }, zoomAt: 0 } }, // "DeepSeek's per-token cost"
      { at: 269, scene: "coins", tint: "#4FA98A", text: "SAME FIX", stamp: "~200× CHEAPER" }, // span; "2 cents vs $4 · massive difference" (2419-2700)
      { at: 556, scene: "emote", pose: "worried", tint: "#C9913D", text: "NOT PROVEN YET" }, // "only one bug, tested by one person" (2706)
      { at: 800, scene: "stamp", verdict: "warn", badge: "API ONLY", tint: "#6E93BD", text: "STILL EARLY" }, // "available through the API, not a chatbot" (loop close)
    ],
    fullscreen: [{ from: 256, to: 456 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-OpenAIPriceCut",
    label: "OpenAI cut its cheapest model 80% — the price war heats up",
    source: "talking-head-020826.mp4",
    from: 3648, // "OpenAI officially announced two major price cuts"
    // LOOP: ends "…the AI price war is heating up." → replays.
    durationInFrames: 1000, // ~33s
    topic: "A PRICE WAR?",
    hook: "OPENAI JUST CUT AI PRICES 80%.",
    context: "GPT-5.6 Luna, its cheapest model",
    beats: [
      { at: 8, scene: "receipt", tint: "#4FA98A", text: "official", shot: { src: "assets/external/screenshots/ai2-altman.png", url: "x.com/sama", imageW: 1100, imageH: 1330, from: { x: 0, y: 0, w: 1100, h: 1000 }, to: { x: 0, y: 0, w: 1100, h: 1330 }, zoomAt: 0 } }, // Altman announces the cuts (8)
      { at: 216, scene: "coins", tint: "#4FA98A", text: "CHEAPEST TIER", stamp: "−80%" }, // span; "Luna is now 80% cheaper" (3756-4030)
      { at: 470, scene: "emote", pose: "alarmed", tint: "#C9913D", text: "UNDERCUTTING RIVALS" }, // "a serious move at the cheap end" (4059-4148)
      { at: 800, scene: "stamp", verdict: "cross", badge: "RACE TO $0", tint: "#C65B52", text: "IT'S ON" }, // "the AI price war is heating up" (loop close)
    ],
    fullscreen: [{ from: 203, to: 403 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-120Typo",
    label: "The viral $120 GPT-5.6 price is almost certainly a typo for $1.20",
    source: "talking-head-020826.mp4",
    from: 5454, // "a pricing number spreading online that looks wrong"
    // LOOP: ends "…that is the confirmed OpenAI news." → replays.
    durationInFrames: 820, // ~27s
    topic: "$120 OR $1.20?",
    hook: "NO, THIS AI ISN'T $120.",
    context: "A viral OpenAI price that's just a typo",
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#C9913D", text: "SMELLS OFF" }, // "a number spreading online that looks wrong" (8)
      { at: 216, scene: "reject", badge: "$120 / M", tint: "#C65B52", text: "DOESN'T ADD UP" }, // span; "doesn't make sense beside its lower input" (5747)
      { at: 568, scene: "receipt", tint: "#4FA98A", text: "the real price", shot: { src: "assets/external/screenshots/ai2-openai-luna.png", url: "developers.openai.com/api/docs/models/gpt-5.6-luna", imageW: 2010, imageH: 800, from: { x: 0, y: 0, w: 2010, h: 800 }, to: { x: 0, y: 0, w: 2010, h: 800 }, zoomAt: 0 } }, // "the figure that fits is $1.20" (6022)
      { at: 700, scene: "stamp", verdict: "cross", badge: "IT'S A TYPO", tint: "#C65B52", text: "IT'S $1.20" }, // "treating $120 as a typo" (loop close)
    ],
    fullscreen: [{ from: 203, to: 403 }],
    outro: "FOLLOW FOR FACT-CHECKED AI NEWS",
    music: "music/calm.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-Mew3",
    label: "OpenAI flashed a mystery model name in a promo, then deleted it",
    source: "talking-head-020826.mp4",
    from: 6284, // "a mystery model named Mew3 appeared briefly…"
    // LOOP: ends "…a huge leap from very little evidence." → replays.
    durationInFrames: 1050, // ~35s
    topic: "IS GPT-6 NEXT?",
    hook: "OPENAI LEAKED A MODEL — THEN DELETED IT.",
    context: "A name spotted in an OpenAI promo, then pulled",
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#C65B52", text: "A SECRET NAME" }, // "a mystery model appeared" (8)
      { at: 216, scene: "stamp", verdict: "cross", badge: "MEW3", tint: "#C65B52", text: "THEN DELETED" }, // span; "the video was removed" (6437-6784)
      { at: 560, scene: "emote", pose: "shrug", tint: "#C9913D", text: "ALREADY 'GPT-6'?" }, // "people are already calling it GPT-6" (6890)
      { at: 820, scene: "stamp", verdict: "warn", badge: "UNCONFIRMED", tint: "#6E93BD", text: "NOT A LAUNCH" }, // "a hidden name is not a release" (loop close)
    ],
    fullscreen: [{ from: 203, to: 403 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-EvidenceRule",
    label: "The 3-level rule for telling real AI news from hype",
    source: "talking-head-020826.mp4",
    from: 9757, // "there are three levels of evidence"
    // LOOP: ends "…until something stronger appears." → replays.
    durationInFrames: 1120, // ~37s
    topic: "REAL OR HYPE?",
    hook: "HOW TO SPOT FAKE AI NEWS.",
    context: "My 3-level rule for every AI headline",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "THREE LEVELS" }, // "three levels of evidence" (8)
      { at: 216, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "1 · STATE IT" }, // span; "level one is official" (9919)
      { at: 560, scene: "check", obj: "gauge", verdict: "warn", tint: "#C9913D", text: "2 · CITE IT" }, // "level two is reported / self-tested" (10357)
      { at: 900, scene: "stamp", verdict: "cross", badge: "UNVERIFIED", tint: "#C65B52", text: "3 · IGNORE IT" }, // "level three is a leak or rumour" (10813)
    ],
    fullscreen: [{ from: 203, to: 403 }],
    outro: "FOLLOW FOR THE WEEKLY BREAKDOWN",
    music: "music/calm.MP3",
    voice: 1.2,
    style: "paper",
  },
];
