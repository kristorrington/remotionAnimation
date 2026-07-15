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
  // go-local video (talking-head.mp4, 2026-07-15).
  // ==========================================================================
  {
    id: "Short-71Percent",
    label: "THE HOOK: the viral 71% claim + the three checks that actually decide it",
    source: "talking-head.mp4",
    from: 0, // "71% of ChatGPT questions can supposedly be run locally"
    // LOOP: ends right after "…waste an entire weekend." (abs 700) → replays
    // into the 71% claim.
    durationInFrames: 716, // ~24s
    topic: "GO LOCAL? NOT SO FAST",
    hook: "71% OF CHATGPT — LOCAL?",
    hookAlt: "THE 3 CHECKS BEFORE LOCAL AI", // A/B variant → Short-71Percent-B
    context: "A Stanford study says local AI covers 71%",
    // multi-brand topic — no product logo (the §9 logo rule is per-product)
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "THE VIRAL CLAIM" }, // "71%… can supposedly be run locally" (4-180)
      // EVIDENCE EARLY: the Hugging Face CEO's own tweet carries the claim
      { at: 110, scene: "receipt", tint: "#34D399", text: "THE 71% TWEET", shot: { src: "assets/external/screenshots/delangue-71pct-tweet.png", url: "x.com/ClementDelangue", imageW: 1440, imageH: 1860, from: { x: 0, y: 60, w: 1200, h: 750 }, to: { x: 0, y: 30, w: 1440, h: 900 }, zoomAt: 8 } }, // the claim's source, on screen as it's spoken; holds ~3.6s
      { at: 217, scene: "coins", tint: "#EF4444", text: "PAID LOCAL?" }, // "local might mean renting a GPU cluster" (223-275)
      { at: 329, scene: "doors", labels: ["TIER?", "LICENCE?", "HARDWARE?"], tint: "#D97757", text: "THE TRIPLE CHECK" }, // "really three: tier (409), licence (451), hardware (494)"; span.from+13
      { at: 553, scene: "check", obj: "gauge", verdict: "cross", tint: "#F59E0B", text: "EXPENSIVE MISTAKE" }, // "get one wrong… overspend or waste an entire weekend" (559-700)
    ],
    // full-anim: the three decision doors own the middle
    fullscreen: [{ from: 316, to: 500 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-Tier3Giants",
    label: "1.6T params: downloadable is not deployable — ask which tier made the stat",
    source: "talking-head.mp4",
    from: 2744, // "and tier three covers the giants"
    // LOOP: ends right after "…which tier produced that answer?" (abs 3525) →
    // replays into the giants.
    durationInFrames: 791, // ~26s
    topic: "THE 1.6T MONSTER",
    hook: "YOU CAN'T RUN THIS AI AT HOME",
    hookAlt: "1.6 TRILLION PARAMETERS. LOCAL?", // A/B variant → Short-Tier3Giants-B
    context: "DeepSeek's biggest model = 1.6T parameters",
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#EF4444", text: "THE MONSTERS" }, // "tier three covers the giants" (2748-2798)
      // EVIDENCE EARLY: NVIDIA's model card carries the number
      { at: 130, scene: "receipt", tint: "#60A5FA", text: "1.6T ON PAPER", shot: { src: "assets/external/screenshots/nvidia-dsv4-modelcard-wide.png", url: "build.nvidia.com", imageW: 3840, imageH: 2052, from: { x: 760, y: 390, w: 1160, h: 547 }, to: { x: 620, y: 300, w: 1560, h: 736 }, zoomAt: 8 } }, // "1.6 trillion parameters" (2912-2949); tight on the claim paragraph (mobile-readable, column edge clear); holds ~6s
      { at: 316, scene: "check", obj: "gauge", verdict: "warn", tint: "#F59E0B", text: "PAPER VS PRACTICE" }, // "weights may be downloadable, running them is another story" (2985-3086)
      { at: 374, scene: "racks", tint: "#D97757", text: "DATA-CENTRE TERRITORY" }, // "H100 or B100-class clusters" (3124-3196)
      { at: 468, scene: "reject", badge: "SPARE LAPTOP", tint: "#F59E0B", text: "DREAM ON" }, // "not a spare laptop under your desk" (3218-3270); span.from+13
      { at: 630, scene: "stamp", verdict: "cross", badge: "THE FILE", tint: "#EF4444", text: "DOWNLOAD ≠ DEPLOY" }, // "downloadable is not deployable" (3281-3344; label trails the phrase)
    ],
    // full-anim: the spare laptop bounces off the guard shield
    fullscreen: [{ from: 455, to: 620 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-LicenceTrap",
    label: "Free to download ≠ free to sell: MIT vs credit-required vs non-commercial",
    source: "talking-head.mp4",
    from: 4614, // "Free to download does not automatically mean free to use…"
    // LOOP: ends right after "…may now require a signed agreement." (abs 5636)
    // → replays into "free to download".
    durationInFrames: 1036, // ~35s
    topic: "FREE AI ISN'T FREE",
    hook: "FREE TO DOWNLOAD ≠ FREE TO USE",
    hookAlt: "THE AI LICENCE TRAP", // A/B variant → Short-LicenceTrap-B
    context: "DeepSeek, Kimi & MiniMax licence check",
    beats: [
      { at: 8, scene: "reject", badge: "FREE DOWNLOAD", tint: "#D97757", text: "READ THE FINE PRINT" }, // "free to download ≠ free to use inside a commercial product" (4620-4762)
      // EVIDENCE EARLY: DeepSeek's MIT permissions card, commercial use ticked
      { at: 151, scene: "receipt", tint: "#34D399", text: "MIT = GO", shot: { src: "assets/external/screenshots/deepseek-mit-licence-wide.png", url: "github.com/deepseek-ai", imageW: 3840, imageH: 2052, from: { x: 2200, y: 240, w: 1100, h: 550 }, to: { x: 2150, y: 150, w: 1500, h: 750 }, zoomAt: 8 } }, // "DeepSeek and GLM… MIT terms" (4771-4886); CLAIM-focused: Permissions header + ✓ Commercial-use block fills the card; holds ~6.8s
      { at: 355, scene: "check", obj: "shield", verdict: "warn", tint: "#F59E0B", text: "VERSION BY VERSION" }, // "check the exact release you are downloading" (4976-5040)
      { at: 501, scene: "emote", pose: "confused", tint: "#EF4444", text: "TRUST NO DEFAULTS" }, // "do not assume… identical terms" (5040-5166)
      { at: 553, scene: "stamp", verdict: "check", badge: "KIMI K2", tint: "#34D399", text: "NAME-DROP REQUIRED" }, // "commercial use with attribution… credit the model" (5167-5372); span.from+13
      { at: 758, scene: "receipt", tint: "#EF4444", text: "PULLED BACK", shot: { src: "assets/external/screenshots/minimax-licence-wide.png", url: "github.com/MiniMax-AI", imageW: 3840, imageH: 2052, from: { x: 780, y: 340, w: 1360, h: 680 }, to: { x: 680, y: 140, w: 1700, h: 850 }, zoomAt: 8 } }, // "MiniMax… free terms to non-commercial terms" (5372-5532); CLAIM-focused: NON-COMMERCIAL LICENSE lines 1-2 fully inside, long lines run off the card edge like a real narrow browser; holds ~3.8s
      { at: 871, scene: "check", obj: "shield", verdict: "cross", tint: "#F59E0B", text: "LAWYERS FIRST" }, // "commercial use may now require a signed agreement" (5540-5636)
    ],
    // full-anim: the Kimi NAME-DROP stamp gag
    fullscreen: [{ from: 540, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-VanishingAI",
    label: "Fable 5 went offline days after launch — stable access is never guaranteed",
    source: "talking-head.mp4",
    from: 6206, // "even a good licence does not guarantee stable access"
    // LOOP: ends right after "…revenue depend on it." (abs 7060) → replays
    // into "even a good licence…".
    durationInFrames: 864, // ~29s
    topic: "CAN YOU TRUST ACCESS?",
    hook: "YOUR AI CAN VANISH OVERNIGHT",
    hookAlt: "FABLE 5 DISAPPEARED FOR WEEKS", // A/B variant → Short-VanishingAI-B
    context: "Fable 5 went offline days after launch",
    beats: [
      { at: 8, scene: "check", obj: "shield", verdict: "warn", tint: "#D97757", text: "LICENCE ≠ LIFELINE" }, // "a good licence does not guarantee stable access" (6212-6302)
      // EVIDENCE EARLY: Anthropic's own page, both availability badges
      { at: 128, scene: "receipt", tint: "#34D399", text: "THE PAPER TRAIL", shot: { src: "assets/external/screenshots/anthropic-fable-timeline-wide.png", url: "anthropic.com", imageW: 3840, imageH: 2052, from: { x: 1240, y: 1502, w: 1100, h: 550 }, to: { x: 1180, y: 1370, w: 1364, h: 682 }, zoomAt: 8 } }, // "launched June 9th (6364)… taken offline (6427)"; CLAIM-focused: the update timeline block centered, dead left margin cut; holds ~6.8s
      { at: 331, scene: "signal", tint: "#EF4444", text: "BACK… FOR NOW" }, // "it was later restored… explanation still limited" (6531-6650)
      { at: 533, scene: "breaker", tint: "#F59E0B", text: "LIGHTS OUT, NO WARNING" }, // "available today… inaccessible days later" (6700-6839); span.from+13
      { at: 700, scene: "stack", tint: "#EF4444", text: "ALL YOUR EGGS" }, // "risky as your only dependency… products, clients, revenue" (6886-7060)
    ],
    // full-anim: the breaker trips the lights
    fullscreen: [{ from: 520, to: 690 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
