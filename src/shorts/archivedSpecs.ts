import { ShortSpec } from "./types";

// ============================================================================
// ARCHIVED SHORTS — specs from PREVIOUS videos (DSpark, Claude wealth-stories).
// Only the CURRENT video's shorts live in specs.ts; when a new video starts,
// move the outgoing specs here (see AGENTS.md 'Archiving previous videos').
// Registered in Studio only when SHOW_ARCHIVE (src/archive) is true — flip it
// to re-render an old short; captions stay correct via captionsRegistry.
// ============================================================================
export const ARCHIVED_SHORTS: ShortSpec[] = [
  // ==========================================================================
  // go-local video (talking-head-150726.mp4) — archived 2026-07-16.
  // ==========================================================================
  {
    id: "Short-71Percent",
    label: "THE HOOK: the viral 71% claim + the three checks that actually decide it",
    source: "talking-head-150726.mp4",
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
      { at: 110, scene: "receipt", tint: "#4FA98A", text: "THE 71% TWEET", shot: { src: "assets/external/screenshots/delangue-71pct-tweet.png", url: "x.com/ClementDelangue", imageW: 1440, imageH: 1860, from: { x: 0, y: 20, w: 1200, h: 750 }, to: { x: 0, y: 8, w: 1440, h: 900 }, zoomAt: 8 } }, // the claim's source, on screen as it's spoken; holds ~3.6s
      { at: 217, scene: "coins", tint: "#C65B52", text: "PAID LOCAL?" }, // "local might mean renting a GPU cluster" (223-275)
      { at: 329, scene: "doors", labels: ["TIER?", "LICENCE?", "HARDWARE?"], tint: "#D97757", text: "THE TRIPLE CHECK" }, // "really three: tier (409), licence (451), hardware (494)"; span.from+13
      { at: 553, scene: "check", obj: "gauge", verdict: "cross", tint: "#C9913D", text: "EXPENSIVE MISTAKE" }, // "get one wrong… overspend or waste an entire weekend" (559-700)
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
    source: "talking-head-150726.mp4",
    from: 2744, // "and tier three covers the giants"
    // LOOP: ends right after "…which tier produced that answer?" (abs 3525) →
    // replays into the giants.
    durationInFrames: 791, // ~26s
    topic: "THE 1.6T MONSTER",
    hook: "YOU CAN'T RUN THIS AI AT HOME",
    hookAlt: "1.6 TRILLION PARAMETERS. LOCAL?", // A/B variant → Short-Tier3Giants-B
    context: "DeepSeek's biggest model = 1.6T parameters",
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#C65B52", text: "THE MONSTERS" }, // "tier three covers the giants" (2748-2798)
      // EVIDENCE EARLY: NVIDIA's model card carries the number
      { at: 130, scene: "receipt", tint: "#6E93BD", text: "1.6T ON PAPER", shot: { src: "assets/external/screenshots/nvidia-dsv4-modelcard-wide.png", url: "build.nvidia.com", imageW: 3840, imageH: 2052, from: { x: 760, y: 390, w: 1160, h: 547 }, to: { x: 620, y: 300, w: 1560, h: 736 }, zoomAt: 8 } }, // "1.6 trillion parameters" (2912-2949); tight on the claim paragraph (mobile-readable, column edge clear); holds ~6s
      { at: 316, scene: "check", obj: "gauge", verdict: "warn", tint: "#C9913D", text: "PAPER VS PRACTICE" }, // "weights may be downloadable, running them is another story" (2985-3086)
      { at: 374, scene: "racks", tint: "#D97757", text: "DATA-CENTRE TERRITORY" }, // "H100 or B100-class clusters" (3124-3196)
      { at: 468, scene: "reject", badge: "SPARE LAPTOP", tint: "#C9913D", text: "DREAM ON" }, // "not a spare laptop under your desk" (3218-3270); span.from+13
      { at: 630, scene: "stamp", verdict: "cross", badge: "THE FILE", tint: "#C65B52", text: "DOWNLOAD ≠ DEPLOY" }, // "downloadable is not deployable" (3281-3344; label trails the phrase)
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
    source: "talking-head-150726.mp4",
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
      { at: 151, scene: "receipt", tint: "#4FA98A", text: "MIT = GO", shot: { src: "assets/external/screenshots/deepseek-mit-licence-wide.png", url: "github.com/deepseek-ai", imageW: 3840, imageH: 2052, from: { x: 2200, y: 240, w: 1100, h: 550 }, to: { x: 2150, y: 150, w: 1500, h: 750 }, zoomAt: 8 } }, // "DeepSeek and GLM… MIT terms" (4771-4886); CLAIM-focused: Permissions header + ✓ Commercial-use block fills the card; holds ~6.8s
      { at: 355, scene: "check", obj: "shield", verdict: "warn", tint: "#C9913D", text: "VERSION BY VERSION" }, // "check the exact release you are downloading" (4976-5040)
      { at: 501, scene: "emote", pose: "confused", tint: "#C65B52", text: "TRUST NO DEFAULTS" }, // "do not assume… identical terms" (5040-5166)
      { at: 553, scene: "stamp", verdict: "check", badge: "KIMI K2", tint: "#4FA98A", text: "NAME-DROP REQUIRED" }, // "commercial use with attribution… credit the model" (5167-5372); span.from+13
      { at: 758, scene: "receipt", tint: "#C65B52", text: "PULLED BACK", shot: { src: "assets/external/screenshots/minimax-licence-wide.png", url: "github.com/MiniMax-AI", imageW: 3840, imageH: 2052, from: { x: 780, y: 340, w: 1360, h: 680 }, to: { x: 680, y: 140, w: 1700, h: 850 }, zoomAt: 8 } }, // "MiniMax… free terms to non-commercial terms" (5372-5532); CLAIM-focused: NON-COMMERCIAL LICENSE lines 1-2 fully inside, long lines run off the card edge like a real narrow browser; holds ~3.8s
      { at: 871, scene: "check", obj: "shield", verdict: "cross", tint: "#C9913D", text: "LAWYERS FIRST" }, // "commercial use may now require a signed agreement" (5540-5636)
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
    source: "talking-head-150726.mp4",
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
      { at: 128, scene: "receipt", tint: "#4FA98A", text: "THE PAPER TRAIL", shot: { src: "assets/external/screenshots/anthropic-fable-timeline-wide.png", url: "anthropic.com", imageW: 3840, imageH: 2052, from: { x: 1240, y: 1502, w: 1100, h: 550 }, to: { x: 1180, y: 1370, w: 1364, h: 682 }, zoomAt: 8 } }, // "launched June 9th (6364)… taken offline (6427)"; CLAIM-focused: the update timeline block centered, dead left margin cut; holds ~6.8s
      { at: 331, scene: "signal", tint: "#C65B52", text: "BACK… FOR NOW" }, // "it was later restored… explanation still limited" (6531-6650)
      { at: 533, scene: "breaker", tint: "#C9913D", text: "LIGHTS OUT, NO WARNING" }, // "available today… inaccessible days later" (6700-6839); span.from+13
      { at: 700, scene: "stack", tint: "#C65B52", text: "ALL YOUR EGGS" }, // "risky as your only dependency… products, clients, revenue" (6886-7060)
    ],
    // full-anim: the breaker trips the lights
    fullscreen: [{ from: 520, to: 690 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },

  // ==========================================================================
  // AI-news / GPT-5.6 super-app video (talking-head-140726.mp4) — archived
  // 2026-07-15.
  // ==========================================================================
  // ==========================================================================
  // AI-news / GPT-5.6 super-app video (talking-head.mp4, 2026-07-14).
  // ==========================================================================
  {
    id: "Short-77Cents",
    label: "THE stat: Sol Pro does in 1 min / 77¢ what 5.5 Pro did in 6 min / $4",
    source: "talking-head-140726.mp4",
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
      { at: 127, scene: "receipt", tint: "#4FA98A", text: "THE PAPER TRAIL", shot: { src: "assets/external/screenshots/aa-gpt56-landed-wide.png", url: "artificialanalysis.ai", imageW: 3840, imageH: 2052, from: { x: 700, y: 740, w: 1810, h: 375 }, to: { x: 560, y: 100, w: 2440, h: 1150 }, zoomAt: 8 } }, // "It is the change in cost and speed" (3288-3390); tall ~2:1 crop so the card fills the band
      { at: 303, scene: "conveyor", labels: ["SOL PRO"], tint: "#E8B84B", text: "THE TEST RUN", logo: "chatgpt" }, // "GPT 5.6 Sol Pro completed…" (3464); logo here — receipts stay lean
      { at: 425, scene: "check", obj: "clock", verdict: "check", tint: "#4FA98A", text: "1 MIN · 77¢" }, // "one minute (3586) for 77 cents (3624)"; span.from+13 = push midpoint
      { at: 591, scene: "coins", tint: "#C65B52", text: "6 MIN · $4" }, // "six minutes (3752)… cost $4 (3787)" — crossfades inside the span
      { at: 741, scene: "emote", pose: "alarmed", accent: "#C65B52", tint: "#C9913D", text: "NIGHT AND DAY", emoji: "💸" }, // "massive efficiency difference" (3902)
      { at: 847, scene: "race", tint: "#4FA98A", text: "THE MATH: 1/6 · 1/5" }, // "one sixth of the time (4008), one fifth of the cost (4065)"
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
    source: "talking-head-140726.mp4",
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
      { at: 147, scene: "receipt", tint: "#4FA98A", text: "THE ANNOUNCEMENT", shot: { src: "assets/external/screenshots/openai-tweet-work-launch.png", url: "x.com/OpenAI", imageW: 1100, imageH: 1010, from: { x: 100, y: 120, w: 940, h: 380 }, to: { x: 0, y: 0, w: 1100, h: 1010 }, zoomAt: 8 } }, // "OpenAI brought ChatGPT, Codex…" (153-305); holds ~4.2s
      // No span here: the tweet receipt runs right up to this beat, and a
      // span must NEVER start while a receipt is active (the card would blow
      // up full-screen and get swept by the push — Kris, July 2026).
      // No LogoPop needed: the CHATGPT block badge IS the brand mark here.
      { at: 273, scene: "bolt", trails: true, blockLabel: "CHATGPT", moduleLabel: "CODEX", tint: "#E8B84B", text: "THE MEGA-MERGE" }, // "together inside of one unified app" (305-400)
      { at: 457, scene: "doors", labels: ["WORK", "CODEX"], value: 0, tint: "#D97757", text: "PICK YOUR MODE" }, // "choose between work mode and Codex mode" (463)
      { at: 617, scene: "queue", labels: ["FILES", "BROWSER", "TOOLS"], tint: "#4FA98A", text: "ALL IN ONE CHAT" }, // "files, browsers, and connected tools" (701-830); span.from+13
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
    source: "talking-head-140726.mp4",
    from: 8924, // "So do not switch because one model reached the top of a leaderboard."
    // LOOP: ends right after "…consistently wrong." (abs 9712) → replays into
    // "do not switch" — the trap loops into the rule.
    durationInFrames: 800, // ~27s
    topic: "SHOULD YOU SWITCH AI?",
    hook: "STOP SWITCHING AI FOR RANKINGS",
    hookAlt: "THE 3-METRIC AI TEST", // A/B variant → Short-SwitchTest-B
    context: "GPT-5.6 just beat rivals on cost + speed",
    beats: [
      { at: 8, scene: "migrate", tint: "#C65B52", text: "DON'T CHASE RANKINGS" }, // "do not switch… top of a leaderboard" (8940-9000)
      // EVIDENCE EARLY (Kris, July 2026): the leaderboard being warned about,
      // on screen as it's spoken — first beat visible at the split settle
      { at: 92, scene: "receipt", tint: "#D97757", text: "THE BAIT", shot: { src: "assets/external/screenshots/benchlm-leaderboard-wide.png", url: "benchlm.ai", imageW: 3840, imageH: 2052, from: { x: 300, y: 820, w: 1200, h: 340 }, to: { x: 260, y: 460, w: 3320, h: 1566 }, zoomAt: 8 } }, // "one model reached the top of a leaderboard" (8977-9010); tall crop: headline + top-3 cards + table
      { at: 204, scene: "check", obj: "coin", verdict: "check", tint: "#E8B84B", text: "1 · THE BILL", logo: "chatgpt" }, // "cost per usable result" (9134); logo here — receipts stay lean
      { at: 263, scene: "check", obj: "clock", verdict: "check", tint: "#4FA98A", text: "2 · THE CLOCK" }, // "how long the task takes" (9193)
      { at: 334, scene: "retry", tint: "#C9913D", text: "3 · THE FIXES" }, // "how much correction work is still required" (9264)
      { at: 457, scene: "stamp", verdict: "check", badge: "THE RULE", tint: "#4FA98A", text: "SWITCH AT 2 OF 3" }, // "at least two of those three" (9394); span.from+13
      { at: 544, scene: "coins", tint: "#C65B52", text: "FALSE ECONOMY" }, // "cheap output becomes expensive… repair" (9468) — crossfades inside the span
      { at: 645, scene: "check", obj: "gauge", verdict: "cross", tint: "#C9913D", text: "SPEED TRAP" }, // "fast output… consistently wrong" (9575-9690)
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
    source: "talking-head-140726.mp4",
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
      { at: 250, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "MORE THAN TALK", logo: "chatgpt" }, // "not simply that ChatGPT can speak" (2177-2245); logo here — receipts stay lean
      { at: 362, scene: "signal", tint: "#D97757", text: "KEEPS UP, OR LAGS?" }, // "feel responsive enough to become part of a real workflow" (2298-2410)
      { at: 499, scene: "queue", labels: ["WALK", "PRACTICE", "GAME"], tint: "#E8B84B", text: "REAL USES" }, // "brainstorm while walking (2435) / practice (2481) / tabletop game (2555)"; span.from+13
      { at: 703, scene: "emote", pose: "pointing", accent: "#C65B52", tint: "#C65B52", text: "TRY TO DERAIL IT", sub: "mid-sentence" }, // "interrupt it (2639), change one instruction (2669)"
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
    source: "talking-head-140726.mp4",
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
      { at: 82, scene: "receipt", tint: "#4FA98A", text: "91 VS 86", shot: { src: "assets/external/screenshots/benchlm-fable-vs-sol-wide.png", url: "benchlm.ai", imageW: 3840, imageH: 2052, from: { x: 700, y: 250, w: 2400, h: 640 }, to: { x: 480, y: 30, w: 2900, h: 1370 }, zoomAt: 8 } }, // "sits just behind Claude Fable" (5224-5290); tall crop: headline + full 91/86 score card
      { at: 243, scene: "check", obj: "gauge", verdict: "check", tint: "#6E93BD", text: "WHERE IT SHINES", logo: "chatgpt" }, // "performs strongly on browser based computer use" (5327-5440); logo here — receipts stay lean
      { at: 392, scene: "conveyor", labels: ["NAVIGATE", "COMPLETE"], tint: "#D97757", text: "AGENT-READY" }, // "agents that need to navigate websites and complete tasks" (5534-5592)
      { at: 509, scene: "stamp", verdict: "cross", badge: "IQ LEAP?", tint: "#C9913D", text: "CHEAPER, NOT SMARTER" }, // "an efficiency release before… a massive intelligence leap" (5651-5770); span.from+13
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
    source: "talking-head-140726.mp4",
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
      { at: 96, scene: "receipt", tint: "#C65B52", text: "THE NEW CHALLENGER", shot: { src: "assets/external/screenshots/xai-grok45-wide.png", url: "x.ai/news/grok-4-5", imageW: 3840, imageH: 2052, from: { x: 1050, y: 60, w: 1900, h: 481 }, to: { x: 1080, y: 20, w: 1720, h: 811 }, zoomAt: 8 } }, // "Grok 4.5" (6034-6100); tall crop tight on the announcement column
      // No span here: the Grok receipt runs right up to this beat — a span
      // must never start while a receipt is active (Kris, July 2026)
      { at: 216, scene: "doors", labels: ["GROK", "GPT-5.6", "FABLE"], tint: "#D97757", text: "THREE AT THE TOP" }, // "same premium category as GPT 5.6 and Claude Fable" (6123-6299)
      { at: 360, scene: "reject", badge: "BLIND SWITCH", tint: "#C9913D", text: "NOT SO FAST" }, // "not seen enough evidence… move their workloads" (6274-6359)
      { at: 510, scene: "testbench", tint: "#4FA98A", text: "ONE FAIR FIGHT" }, // "give both models the same difficult task" (6476-6515)
      { at: 578, scene: "queue", labels: ["QUALITY", "TIME", "FIXES"], tint: "#E8B84B", text: "JUDGE 3 THINGS" }, // "output quality (6544), time taken, correction work (6617)"
      // brand first-mention receipt: Anthropic's own redeploy post
      { at: 732, scene: "receipt", tint: "#4FA98A", text: "BACK IN THE RING", shot: { src: "assets/external/screenshots/anthropic-fable5-redeploy-wide.png", url: "anthropic.com", imageW: 3840, imageH: 2052, from: { x: 1100, y: 340, w: 1650, h: 435 }, to: { x: 780, y: 40, w: 2280, h: 1075 }, zoomAt: 8 } }, // "Anthropic widened access to Claude Fable 5" (6670-6780); tall crop: headline + UPDATE badge + restored line
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
    source: "talking-head-140726.mp4",
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
      { at: 99, scene: "receipt", tint: "#6E93BD", text: "DROP 1 OF 3", shot: { src: "assets/external/screenshots/seedream5-pro-wide.png", url: "seed.bytedance.com", imageW: 3840, imageH: 2052, from: { x: 1100, y: 100, w: 2000, h: 360 }, to: { x: 160, y: 20, w: 3480, h: 1641 }, zoomAt: 8 } }, // "ByteDance released Seedream 5.0 Pro" (7757) — tall crop: the headline carries, body is context
      { at: 180, scene: "receipt", tint: "#D97757", text: "DROP 2 OF 3", shot: { src: "assets/external/screenshots/meta-musespark-wide.png", url: "ai.meta.com", imageW: 3840, imageH: 2052, from: { x: 400, y: 30, w: 2000, h: 864 }, to: { x: 300, y: 20, w: 3240, h: 1400 }, zoomAt: 8 } }, // "Meta released Muse Spark 1.1" (7838); dark hero vs light page — layouts differ
      { at: 324, scene: "stamp", verdict: "check", badge: "GOOGLE PHOTOS", tint: "#4FA98A", text: "DROP 3 OF 3" }, // "added Video Remix to Google Photos" (7988)
      { at: 476, scene: "reject", badge: "LAUNCH DEMO", tint: "#C65B52", text: "SHINY ≠ PROVEN" }, // "would not change the image tools because of a launch demo" (8020-8140); span.from+13
      { at: 517, scene: "conveyor", labels: ["SAME PROMPT"], tint: "#D97757", text: "RUN IT EVERYWHERE" }, // "use the same prompt across your current models" (8181) — crossfades inside the span
      { at: 633, scene: "queue", labels: ["ACCURACY", "CONSISTENCY", "KEEPERS"], tint: "#C9913D", text: "SCORE 3 THINGS" }, // "prompt accuracy, consistency… actually keep" (8297-8430)
    ],
    // full-anim: the demo-reject gag + the same-prompt belt
    fullscreen: [{ from: 463, to: 600 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },

  // ==========================================================================
  // FABLE-COUNTDOWN video (talking-head-090726.mp4) — archived 2026-07-10.
  // ==========================================================================
  {
    id: "Short-PriceReal",
    label: "Free window ends July 12 — then $10/M in, $50/M out",
    source: "talking-head-090726.mp4",
    from: 613, // "and that is where the price gets very real" (0:20.4)
    // LOOP: ends on "…every Fable 5 run becomes a cost decision." (abs 1514) → replays into the price.
    durationInFrames: 916, // ~31s
    topic: "5 DAYS OF FREE FABLE 5",
    hook: "YOUR FREE AI EXPIRES SOON",
    hookAlt: "FABLE 5 GOES PAID JULY 12", // A/B variant → Short-PriceReal-B
    context: "Fable 5 free access ends July 12",
    beats: [
      { at: 8, scene: "coins", tint: "#C9913D", text: "THE PRICE GETS REAL" }, // scene-setting under the hook; "price gets very real" abs 645
      { at: 73, scene: "check", obj: "coin", verdict: "warn", tint: "#C65B52", text: "$10 / M INPUT" }, // "$10 per million input" abs 692
      { at: 153, scene: "emote", pose: "alarmed", accent: "#C65B52", tint: "#C9913D", text: "$50 / M OUTPUT", emoji: "💸" }, // "$50 per million output" abs 772
      { at: 263, scene: "check", obj: "brain", verdict: "check", tint: "#06B6D4", text: "WORTH IT?" }, // "should you use fable 5" abs 882
      { at: 476, scene: "conveyor", labels: ["CLEAN RULES"], tint: "#4FA98A", text: "MY CLEAN RULES" }, // "clean rules" abs 1093
      { at: 576, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "RESULT", tint: "#06B6D4", text: "CHANGES THE RESULT?" }, // "smarter model changes the result" abs 1195
      { at: 636, scene: "reject", badge: "ROUTINE PROMPTS", tint: "#C65B52", text: "DON'T WASTE IT" }, // "routine prompts" abs 1255
      { at: 751, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "AFTER JULY 12" }, // "after July 12th" abs 1370
    ],
    // full-anim: the $50 shock + the don't-waste-it payoff
    fullscreen: [{ from: 190, to: 300 }, { from: 640, to: 780 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-MessyLaunch",
    label: "Launched, restricted, back, countdown — the messiest launch yet",
    source: "talking-head-090726.mp4",
    from: 3865, // "Still, the timing is messy." (2:08.8)
    // LOOP: ends on "…the controversy is not clean." (abs 5290) → replays into "timing is messy".
    durationInFrames: 1440, // ~48s
    topic: "FABLE 5'S WEIRD LAUNCH",
    hook: "THE MESSIEST AI LAUNCH YET",
    context: "Fable 5 = Claude's new top model",
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#06B6D4", text: "A MESSY LAUNCH" }, // scene-setting under the hook; "timing is messy" abs 3920
      { at: 154, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "LAUNCH", tint: "#4FA98A", text: "LAUNCHED" }, // "it launched" abs 4025
      { at: 184, scene: "check", obj: "shield", verdict: "cross", tint: "#C65B52", text: "RESTRICTED" }, // "got restricted" abs 4055
      { at: 216, scene: "conveyor", labels: ["BACK"], tint: "#06B6D4", text: "CAME BACK" }, // "came back" abs 4087
      { at: 258, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "BEHIND A COUNTDOWN" }, // "shoved behind a countdown" abs 4129
      { at: 356, scene: "emote", pose: "alarmed", accent: "#C65B52", tint: "#C65B52", text: "SO MUCH DRAMA", emoji: "🎭" }, // "a lot more drama" abs 4227
      { at: 494, scene: "stack", tint: "#C9913D", text: "JUNE 12: SHUTDOWN" }, // "June 12th… export controls" abs 4365
      { at: 924, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "LIFTED → BACK GLOBAL" }, // "controls were lifted" abs 4795
      { at: 1106, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "SAFETY", tint: "#06B6D4", text: "NEW SAFETY LAYER" }, // "new safety layer" abs 4977
      { at: 1284, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "BLOCKS 99%" }, // "over 99% of cases" abs 5155
    ],
    // full-anim: the four-act drama run + the safety-layer reveal
    fullscreen: [{ from: 190, to: 330 }, { from: 1180, to: 1309 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Swapped",
    label: "Risky requests get rerouted — you may not get the model you picked",
    source: "talking-head-090726.mp4",
    from: 6429, // "do not blindly build your entire workflow around it" (3:34.3)
    // LOOP: ends on "…some requests depend on safety routing." (abs 7347) → replays into the warning.
    durationInFrames: 933, // ~31s
    topic: "IS IT EVEN FABLE 5?",
    hook: "YOUR AI CAN BE SWAPPED",
    context: "Anthropic can reroute risky Fable 5 requests",
    beats: [
      { at: 8, scene: "stack", tint: "#C9913D", text: "DON'T BUILD ON IT" }, // scene-setting under the hook; "blindly build" abs 6472
      { at: 139, scene: "check", obj: "shield", verdict: "warn", labels: ["SECURITY", "COMPLIANCE", "CODE"], tint: "#06B6D4", text: "HIGH-STAKES WORK?" }, // "security, compliance…" abs 6574
      { at: 321, scene: "reject", badge: "RISKY REQUEST", tint: "#C65B52", text: "REROUTED AWAY" }, // "route risky requests away" abs 6756
      { at: 409, scene: "emote", pose: "confused", tint: "#C9913D", text: "NOT WHAT YOU PICKED", emoji: "🤨" }, // "not getting the model you thought" abs 6844
      { at: 503, scene: "check", obj: "brain", verdict: "warn", tint: "#06B6D4", text: "MOST PEOPLE MISS THIS" }, // "the part most people miss" abs 6938
      { at: 626, scene: "coins", tint: "#C65B52", text: "EXPENSIVE…" }, // "not just expensive" abs 7061
      { at: 715, scene: "queue", labels: ["PLAN", "LIMITS", "ROUTING"], tint: "#C9913D", text: "…AND CONDITIONAL" }, // "it is also conditional" abs 7131
    ],
    // full-anim: the reroute gag + the reveal
    fullscreen: [{ from: 321, to: 470 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Specialist",
    label: "Don't burn the window on FOMO — use Fable 5 like a specialist",
    source: "talking-head-090726.mp4",
    from: 7895, // "But do not use it just because the timer is running out." (4:23.2)
    // LOOP: ends on "…only use it when the output is worth the credit cost." (abs 8867) → replays into the warning.
    durationInFrames: 987, // ~33s
    topic: "USE FABLE 5 RIGHT",
    hook: "STOP WASTING YOUR FREE AI",
    context: "Free Fable 5 access ends July 12",
    beats: [
      { at: 8, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "TIMER FOMO?" }, // scene-setting under the hook; "timer is running out" abs 7940
      { at: 102, scene: "coins", tint: "#C65B52", text: "A WASTED WINDOW" }, // "waste the free window" abs 8003
      { at: 234, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#C9913D", text: "HIRE THE SPECIALIST", sub: "Fable 5" }, // "knowledgeable specialist" abs 8135
      { at: 312, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "HARD PART", tint: "#06B6D4", text: "THE HARDEST PARTS" }, // "hardest parts" abs 8213
      { at: 385, scene: "conveyor", labels: ["OPUS", "SONNET"], tint: "#4FA98A", text: "THE REST → CHEAPER" }, // "back to Opus or Sonnet" abs 8286
      { at: 514, scene: "emote", pose: "celebrate", tint: "#06B6D4", text: "EXPENSIVE THINKING", sub: "cheap execution" }, // "expensive thinking" abs 8415
      { at: 706, scene: "check", obj: "clock", verdict: "check", tint: "#4FA98A", text: "BEFORE: HARDEST WORK" }, // "before July 12" abs 8607
      { at: 840, scene: "check", obj: "coin", verdict: "warn", tint: "#C9913D", text: "AFTER: WORTH IT?" }, // "after July 12" abs 8741
    ],
    // full-anim: the specialist handoff + the decision rule
    fullscreen: [{ from: 234, to: 400 }, { from: 700, to: 855 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-FreeWindow",
    label: "The free-window rules: 50% battery, breaker trips July 12, pressure only moved",
    source: "talking-head-090726.mp4",
    from: 1899, // "During the promo window, you can use Fable 5…" (1:03.3)
    // LOOP: ends on "…has not promised a third extension." (abs 3003) → replays into the rules.
    durationInFrames: 1119, // ~37s
    topic: "FREE FABLE 5: THE RULES",
    hook: "YOUR FREE AI HAS RULES",
    context: "Fable 5 is free on paid plans until July 12",
    beats: [
      { at: 8, scene: "battery", value: 100, tint: "#4FA98A", text: "THE FREE WINDOW" }, // scene-setting; "promo window" abs 1899
      { at: 89, scene: "battery", value: 50, tint: "#C9913D", text: "50% OF WEEKLY LIMITS" }, // "50% of your weekly plan limits" abs 1988
      { at: 147, scene: "stamp", verdict: "check", badge: "FABLE 5 ACCESS", tint: "#4FA98A", text: "NOTHING TO CLAIM" }, // "nothing special to claim" abs 2046 (stamp slams on "claim" abs 2086)
      { at: 209, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "JUST PICK IT" }, // "just select fable 5" abs 2108
      { at: 320, scene: "breaker", tint: "#C65B52", text: "THEN THE PROMO ENDS" }, // "once the promo ends" abs 2219 (trips on "no longer part" abs ~2326)
      { at: 575, scene: "coins", tint: "#C9913D", text: "CREDIT TERRITORY" }, // "usage credits" abs 2474
      { at: 659, scene: "elevator", value: 2, tint: "#06B6D4", text: "OR RIDE A TIER DOWN" }, // "switch back to another Claude model" abs 2558
      { at: 845, scene: "emote", pose: "shrug", tint: "#4FA98A", text: "PRESSURE'S GONE?" }, // "think the pressure is gone" abs 2749
      { at: 955, scene: "hourglass", tint: "#C9913D", text: "IT JUST MOVED 5 DAYS", emoji: "⏳" }, // "only moved five days away" abs 2849
    ],
    // full-anim: the battery drain + the breaker trip
    fullscreen: [{ from: 190, to: 460 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-TheSignal",
    label: "Don't trust screenshots — the signal tower only goes green on official wording",
    source: "talking-head-090726.mp4",
    from: 8871, // "And if you're waiting for it to return to the normal plans…" (4:55.7)
    // LOOP: ends on "…use Fable 5 where it gives you leverage." (abs 9572) → replays into the wait.
    durationInFrames: 716, // ~24s
    topic: "WHEN DOES IT COME BACK?",
    hook: "DON'T TRUST SCREENSHOTS",
    context: "Waiting for Fable 5 back on normal plans?",
    beats: [
      { at: 8, scene: "signal", tint: "#C9913D", text: "WAITING FOR NEWS?" }, // scene-setting; "waiting for it to return" abs 8877
      { at: 85, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "WATCH THE WORDING" }, // "watch the wording" abs 8956
      { at: 140, scene: "stamp", verdict: "cross", badge: "RANDOM SCREENSHOT", tint: "#C65B52", text: "NOT SCREENSHOTS" }, // "random screenshots" abs 9011 (DENIED slams abs ~9051)
      { at: 264, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "OFFICIAL + A REAL DATE" }, // "standard plans are a real date" abs 9128
      { at: 306, scene: "signal", verdict: "check", tint: "#06B6D4", text: "THAT'S THE SIGNAL" }, // "that is the signal" abs 9177
      { at: 424, scene: "hourglass", tint: "#C9913D", text: "LAST CONFIRMED WINDOW" }, // "last confirmed free window" abs 9295
      { at: 466, scene: "reject", badge: "A FORMALITY?", tint: "#C65B52", text: "NO GUARANTEES" }, // "not a formality, not a guarantee" abs 9337
      { at: 532, scene: "emote", pose: "alarmed", tint: "#C9913D", text: "JUST A WINDOW" }, // "a window" abs 9400
    ],
    // full-anim: the DENIED stamp gag + the clean-signal payoff
    fullscreen: [{ from: 190, to: 430 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  // ==========================================================================
  // MODEL-ROUTING video (talking-head-080726.mp4) — archived 2026-07-09.
  // ==========================================================================
  {
    id: "Short-EffortDial",
    label: "Max effort on a tiny job = hiring a senior architect to rename a button",
    source: "talking-head-080726.mp4",
    from: 4656, // "That is like hiring a senior architect to rename a label on a button" (2:35.2)
    // LOOP: ends on "…being wrong is expensive. Not annoying — expensive." (abs 6014) → replays into the gag.
    durationInFrames: 1358, // ~45s
    topic: "CLAUDE'S EFFORT DIAL",
    hook: "YOU'RE OVERPAYING YOUR AI",
    context: "Claude lets you pick how hard the AI thinks",
    // the architect gag IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#C9913D", text: "SENIOR ARCHITECT", sub: "renames a button" }, // "senior architect" abs 4700
      { at: 180, scene: "coins", tint: "#C65B52", text: "STUPIDLY EXPENSIVE" }, // "stupidly expensive" abs 4836
      { at: 308, scene: "check", obj: "clock", verdict: "check", tint: "#4FA98A", text: "LOW = QUICK CHECKS" }, // "Low" abs 4964
      { at: 496, scene: "conveyor", labels: ["NORMAL WORK"], tint: "#06B6D4", text: "MEDIUM = BALANCE" }, // "Medium" abs 5152
      { at: 671, scene: "check", obj: "gauge", verdict: "check", tint: "#4FA98A", text: "HIGH = JUDGMENT" }, // "High" abs 5327
      { at: 822, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "XHIGH = AGENTS" }, // "Extra high" abs 5478
      { at: 1115, scene: "reject", badge: "DEFAULT", tint: "#C65B52", text: "MAX ≠ DEFAULT", emoji: "💸" }, // "max should not be your default" abs 5771
      { at: 1235, scene: "emote", pose: "alarmed", accent: "#C65B52", tint: "#C9913D", text: "WRONG = EXPENSIVE" }, // "being wrong is expensive" abs 5891
    ],
    // full-anim: the level run-through + the XHIGH bolt payoff
    fullscreen: [{ from: 308, to: 520 }, { from: 822, to: 1010 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-8020",
    label: "Fable is 2× the price — the 80/20 rule decides when it's worth it",
    source: "talking-head-080726.mp4",
    from: 12029, // "Now here is the cost trap." (6:41)
    // LOOP: ends on "…that is the clean decision rule." (abs 13442) → replays into the trap.
    durationInFrames: 1413, // ~47s
    topic: "CLAUDE'S 2× PRICE MODEL",
    hook: "FABLE 5 IS 2× THE PRICE",
    context: "Fable 5 = Claude's newest, priciest model",
    hookAlt: "STOP PAYING DOUBLE FOR AI", // A/B variant → Short-8020-B
    // the coin trap IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 8, scene: "coins", tint: "#C9913D", text: "THE COST TRAP" }, // "cost trap" abs 12071
      { at: 138, scene: "check", obj: "coin", verdict: "warn", tint: "#C65B52", text: "2× THE PRICE" }, // "double Opus 4.8" abs 12167
      { at: 415, scene: "retry", tint: "#C9913D", text: "× EFFORT × RETRIES" }, // "effort level, retries, tool calls" abs 12444
      { at: 618, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "ONE CLEAN PASS?" }, // "one clean pass" abs 12647
      { at: 678, scene: "emote", pose: "shrug", accent: "#C9913D", tint: "#06B6D4", text: "OPUS DID THE SAME", sub: "the ½-price Claude" }, // "waste if Opus…" abs 12707
      { at: 796, scene: "check", obj: "gauge", verdict: "check", tint: "#4FA98A", text: "80%? USE OPUS" }, // "the 80…rule" abs 12825
      { at: 1123, scene: "conveyor", labels: ["SONNET"], tint: "#06B6D4", text: "EVEN CHEAPER?" }, // "Sonnet…even cheaper" abs 13152
      { at: 1215, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#C9913D", text: "THE 20% MATTERS?", sub: "then Fable", emoji: "💰" }, // "missing 20%…matters" abs 13244
    ],
    // full-anim: the 2× reveal + the 80/20 decision payoff (first span starts
    // ≥ ~1.5s after the longer hook settles so the face never blips)
    fullscreen: [{ from: 156, to: 330 }, { from: 796, to: 1010 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-RouteByRisk",
    label: "Route by risk, not ego — some tasks barely need Opus",
    source: "talking-head-080726.mp4",
    from: 8533, // "Fourth, route by risk, not ego." (4:44.4)
    // LOOP: ends on "…Opus at medium or high is probably enough." (abs 9655) → replays into the rule.
    durationInFrames: 1122, // ~37s
    topic: "WHICH CLAUDE FOR WHAT?",
    hook: "STOP PAYING FOR EGO",
    context: "Claude has cheap and premium model tiers",
    // every short OPENS on full-screen animation under the hook
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "RISK, NOT EGO" }, // scene-setting under the hook; spoken "not ego" abs 8621
      { at: 162, scene: "coins", tint: "#C9913D", text: "WASTED SPEND" }, // "waste money" abs 8695
      { at: 255, scene: "reject", badge: "FEELS SAFER", tint: "#C65B52", text: "NOT SMARTER" }, // "feels safer" abs 8788
      { at: 413, scene: "emote", pose: "shrug", tint: "#06B6D4", text: "DOESN'T NEED FABLE", sub: "the premium tier", emoji: "🤷" }, // "do not need Fable" abs 8946
      { at: 592, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "BARELY NEEDS OPUS" }, // "barely need Opus" abs 9125
      { at: 636, scene: "queue", labels: ["EXTRACT", "FORMAT", "CLASSIFY"], tint: "#06B6D4", text: "CHEAP LANE" }, // "extraction, formatting…" abs 9169
      { at: 799, scene: "conveyor", labels: ["SONNET", "HAIKU"], tint: "#4FA98A", text: "HANDLED" }, // "Sonnet or haiku" abs 9332
      { at: 950, scene: "check", obj: "gauge", verdict: "check", tint: "#06B6D4", text: "OPUS IS ENOUGH" }, // "Opus at medium or high" abs 9552
    ],
    // full-anim: the cheap-lane run — the payoff of the whole rule
    fullscreen: [{ from: 636, to: 860 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-AccessWindow",
    label: "Fable access has already been weird — build a fallback routing rule",
    source: "talking-head-080726.mp4",
    from: 10800, // "Fifth, watch access and cost with an eagle eye." (6:00)
    // LOOP: ends on "…not which model is best — which model is just enough." (abs 12020) → replays into the rule.
    durationInFrames: 1220, // ~41s
    topic: "IF FABLE 5 VANISHES?",
    hook: "YOUR BEST AI CAN DISAPPEAR",
    context: "Fable 5 = Claude's top model",
    // every short OPENS on full-screen animation under the hook
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#06B6D4", text: "WATCH ACCESS", sub: "to Fable 5" }, // scene-setting under the hook; spoken "eagle eye" abs 10890
      { at: 200, scene: "check", obj: "shield", verdict: "cross", tint: "#C65B52", text: "RESTRICTED" }, // "it was restricted" abs 11000
      { at: 241, scene: "check", obj: "shield", verdict: "check", tint: "#4FA98A", text: "THEN IT'S BACK" }, // "came back" abs 11041
      { at: 398, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "WEEKLY LIMITS" }, // "part of the weekly usage" abs 11198
      { at: 471, scene: "coins", tint: "#C65B52", text: "USAGE CREDITS", emoji: "😬" }, // "usage credits" abs 11271
      { at: 624, scene: "stack", tint: "#C9913D", text: "IT BREAKS" }, // "that is going to break" abs 11424
      { at: 784, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "A ROUTING RULE" }, // "routing rule" abs 11584
      { at: 880, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "THE FALLBACK" }, // "try Opus extra high" abs 11680
      { at: 997, scene: "check", obj: "gauge", verdict: "check", tint: "#4FA98A", text: "STEP DOWN" }, // "step down to high" abs 11797
    ],
    // full-anim: credits raining + the workflow break
    fullscreen: [{ from: 471, to: 680 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-LeakedPrompt",
    label: "The 'leaked' Fable prompt is a rumor — steal the behaviour instead",
    source: "talking-head-080726.mp4",
    from: 1980, // "copy the process, not the leak prompt" (1:06)
    // LOOP: ends on "…that is exactly the point." (abs 3105) → replays into the hook.
    durationInFrames: 1125, // ~38s
    topic: "CLAUDE'S 'LEAKED' PROMPT",
    hook: "THE 'LEAKED' FABLE PROMPT",
    context: "Fable 5 = Claude's newest model",
    // every short OPENS on full-screen animation under the hook
    animHook: true,
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#06B6D4", text: "A 'LEAKED' PROMPT?", sub: "for Claude Fable 5" }, // scene-setting under the hook
      { at: 127, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "FABLE'S PROMPT?" }, // "Fable system prompt" abs 2107
      { at: 224, scene: "reject", badge: "OFFICIAL", tint: "#C65B52", text: "JUST A RUMOR", emoji: "🤨" }, // "like a rumor" abs 2204
      { at: 301, scene: "check", obj: "brain", verdict: "cross", tint: "#C9913D", text: "DON'T COPY-PASTE" }, // "don't copy it word for word" abs 2281
      { at: 413, scene: "stack", tint: "#C65B52", text: "DON'T BUILD ON IT" }, // "build your workflow around a leak" abs 2393
      { at: 692, scene: "emote", pose: "pointing", accent: "#4FA98A", tint: "#4FA98A", text: "STEAL THE BEHAVIOUR" }, // "worth stealing" abs 2672
      { at: 780, scene: "check", obj: "clock", verdict: "cross", tint: "#06B6D4", text: "NO STALE FACTS" }, // "don't trust stale knowledge" abs 2760
      { at: 838, scene: "testbench", labels: ["ASSUMPTIONS", "REALITY"], tint: "#C9913D", text: "VERIFY FIRST" }, // "don't assume a file exists" abs 2818
      { at: 1008, scene: "emote", pose: "celebrate", accent: "#4FA98A", tint: "#4FA98A", text: "GOOD AGENT BEHAVIOUR" }, // "good agent behavior" abs 3010
    ],
    // full-anim: the workflow-on-a-leak collapse + the steal reveal
    fullscreen: [{ from: 413, to: 610 }, { from: 692, to: 790 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },

  {
    id: "Short-Waiting",
    label: "Why agents feel slow — it's not intelligence, it's waiting",
    source: "talking-head-050726.mp4",
    from: 1127, // "the problem with AI agents… is not just intelligence. It's waiting." (0:37.6)
    // LOOP: ends on "…it feels like the product is broken." (abs 1903) → replays into the hook.
    durationInFrames: 800, // ~27s
    topic: "IS IT SLOW OR JUST WAITING?",
    hook: "WHY YOUR AI AGENT FEELS SLOW",
    hookAlt: "YOUR AI ISN'T DUMB. IT'S STUCK", // A/B variant → Short-Waiting-B
    beats: [
      { at: 79, scene: "emote", pose: "shrug", text: "NOT INTELLIGENCE" }, // "intelligence" abs 1206
      { at: 131, scene: "queue", labels: ["PROMPT", "TOOL", "RETRY"], text: "WAITING" }, // "It's waiting" abs 1258
      { at: 236, scene: "check", obj: "clock", verdict: "warn", text: "TOOL CALLS" }, // "tool to call" abs 1363
      { at: 331, scene: "retry", text: "RETRIES" }, // "the agent to realize it messed up" abs 1458
      { at: 541, scene: "stack", text: "IT COMPOUNDS", emoji: "😬" }, // "one model call feels fine" abs 1668
      { at: 703, scene: "emote", pose: "alarmed", accent: "#C65B52", text: "BROKEN" }, // "ten calls… broken" abs 1830
    ],
    // full-anim: the "WAITING" bottleneck reveal + the compounding collapse
    fullscreen: [{ from: 131, to: 236 }, { from: 541, to: 680 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-SpeedTrap",
    label: "Speed won't fix a broken AI — a faster failure is still a failure",
    source: "talking-head-050726.mp4",
    from: 5057, // "So the question is not, is D-Spark faster?" (2:48.6)
    // LOOP: ends on "…is still a problem." (abs 5735) → replays into the hook.
    durationInFrames: 696, // ~23s
    topic: "FASTER — BUT IS IT BETTER?",
    hook: "SPEED WON'T FIX A BROKEN AI",
    beats: [
      { at: 64, scene: "bolt", trails: true, text: "FASTER?", sub: "wrong question" }, // "is D-Spark faster?" abs 5121
      { at: 151, scene: "coins", text: "CHEAPER?" }, // "does my workflow get cheaper?" abs 5208
      { at: 348, scene: "reject", badge: "FAILED TASK", text: "STILL FAILED" }, // "a faster failed task is still failed" abs 5405
      { at: 458, scene: "check", obj: "bug", verdict: "cross", text: "STILL WRONG", emoji: "❌" }, // "faster hallucination…" abs 5515
      { at: 584, scene: "emote", pose: "alarmed", accent: "#C65B52", text: "STILL BREAKS" }, // "breaks your app" abs 5641
    ],
    // full-anim: the "faster, still failed/wrong" punchline run needs full attention
    fullscreen: [{ from: 348, to: 576 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-TestFirst",
    label: "Don't switch AI models on hype — test with 3 questions",
    source: "talking-head-050726.mp4",
    from: 8571, // "Do not migrate because of DSpark. Test." (4:45.7)
    // LOOP: ends on "…if only the benchmark looks good, wait." (abs 9372) → replays into the hook.
    durationInFrames: 819, // ~27s
    topic: "IS THE NEW MODEL WORTH IT?",
    hook: "DON'T SWITCH AI MODELS YET",
    // the migrate gag IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 6, scene: "migrate", text: "DON'T MIGRATE" }, // "Do not migrate" abs 8571
      { at: 84, scene: "testbench", labels: ["CURRENT", "DSPARK"], text: "TEST FIRST" }, // "Test" abs 8655
      { at: 184, scene: "conveyor", labels: ["CURRENT", "DSPARK"], text: "ONE WORKFLOW" }, // "Take one workflow…" abs 8755
      { at: 413, scene: "check", obj: "gauge", labels: ["TIME", "SUCCESS", "COST"], text: "MEASURE 3" }, // abs 8984
      { at: 479, scene: "check", obj: "clock", verdict: "check", text: "FASTER?" }, // "finish faster?" abs 9050
      { at: 539, scene: "check", obj: "shield", verdict: "check", text: "SUCCEED?" }, // "still succeed?" abs 9110
      { at: 602, scene: "check", obj: "coin", verdict: "check", text: "COST LESS?" }, // "cost less?" abs 9173
      { at: 708, scene: "emote", pose: "celebrate", accent: "#4FA98A", text: "SHIP IT", emoji: "🚀" }, // abs 9199
    ],
    // full-anim: the quick-fire 3-question checklist — cramped in split
    fullscreen: [{ from: 413, to: 648 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Numbers",
    label: "The DSpark speed numbers — and why they're not a bill cut",
    source: "talking-head-050726.mp4",
    from: 3878, // "The reported claim is that DSpark can make V4 Flash…" (2:09.3)
    // LOOP: ends on "…that's not how production works." (abs 4707) → replays into the hook.
    durationInFrames: 848, // ~28s
    topic: "IS IT ACTUALLY CHEAPER?",
    hook: "85% FASTER ISN'T 85% CHEAPER",
    // the speed-layer bolt-on IS the scene-setter — open on full-screen animation
    animHook: true,
    beats: [
      { at: 12, scene: "bolt", text: "DSPARK", sub: "speed layer" }, // scene-setter
      { at: 153, scene: "bolt", trails: true, warn: "NOT ALWAYS CHEAPER", text: "60–85%", sub: "V4 FLASH" }, // abs 4031
      { at: 387, scene: "race", text: "57–78%", sub: "V4 PRO" }, // abs 4265
      { at: 588, scene: "emote", pose: "worried", accent: "#C9913D", text: "CAREFUL" }, // abs 4466
      { at: 718, scene: "coins", text: "NOT 85% OFF", emoji: "💸" }, // "your bill drops by 85%" abs 4596
    ],
    // full-anim: the 60–85% number IS the hook payoff — give it the whole screen
    fullscreen: [{ from: 153, to: 380 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Infra",
    label: "DSpark is an infrastructure moment, not an AI moment",
    source: "talking-head-050726.mp4",
    from: 10147, // "So here's the actual takeaway. DSpark is not an AGI moment." (5:38.2)
    // LOOP: ends on "…say their workflows got cheaper." (abs 10892) → replays into the hook.
    durationInFrames: 763, // ~25s
    topic: "AGI OR JUST PLUMBING?",
    hook: "IT'S NOT AN AI MOMENT",
    beats: [
      { at: 19, scene: "emote", pose: "idle", text: "THE TAKEAWAY" }, // "the actual takeaway" abs 10166
      { at: 94, scene: "reject", badge: "AGI", text: "NOT AGI" }, // "not an AGI moment" abs 10241
      { at: 136, scene: "bolt", trails: true, text: "INFRASTRUCTURE" }, // abs 10283
      { at: 287, scene: "coins", text: "NEW ECONOMICS" }, // "change the economics" abs 10434
      { at: 382, scene: "conveyor", labels: ["DONE"], text: "WORK WINS" }, // "faster completed work…" abs 10529
      { at: 460, scene: "emote", pose: "shrug", text: "IGNORE HYPE", emoji: "🙄" }, // "ignore the AGI screaming" abs 10607
      { at: 724, scene: "check", obj: "gauge", verdict: "check", text: "CHEAPER?" }, // abs 10871
    ],
    // full-anim: the "not AGI → infrastructure" reveal is the whole short
    fullscreen: [{ from: 94, to: 280 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },

  // ==========================================================================
  // CLAUDE WEALTH-STORIES video (talking-head.mp4) — whisper frames from the
  // regenerated captionsData.ts.
  // ==========================================================================
  {
    id: "Short-200Truth",
    label: "The $200/month reality behind AI millionaire hype",
    source: "talking-head-070726.mp4",
    from: 7349, // "most people are starting much smaller" (4:04.9)
    // LOOP: ends on "…you will actually use it properly" (abs 8420) → replays into the hook.
    durationInFrames: 1071, // ~36s
    topic: "WHAT'S THE REAL NUMBER?",
    hook: "THE AI MILLIONAIRE LIE",
    // the coin-drop reality check IS the hook — open on full-screen animation
    animHook: true,
    beats: [
      { at: 10, scene: "coins", labels: ["INCOME"], text: "$200/MO", sub: "the median" }, // "$200 number matters" abs 7373
      { at: 229, scene: "emote", pose: "shrug", text: "BORING BUT TRUE" }, // "boring" abs 7578
      { at: 376, scene: "bolt", blockLabel: "YOU", moduleLabel: "CLAUDE", text: "LEVERAGE FIRST" }, // "AI might help you build" abs 7725
      { at: 577, scene: "check", obj: "gauge", verdict: "check", text: "LEVERAGE" }, // abs 7926
      { at: 616, scene: "check", obj: "clock", verdict: "check", text: "CONSISTENCY" }, // abs 7965
      { at: 688, scene: "check", obj: "coin", verdict: "check", text: "THEN INCOME" }, // abs 8037
      { at: 900, scene: "reject", badge: "RICH QUICK", text: "WRONG EXPECTATION", emoji: "💸" }, // "quit" abs 8259
    ],
    fullscreen: [{ from: 84, to: 200 }, { from: 577, to: 760 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-FakeDoctors",
    label: "The $401M AI story that got an FDA warning letter",
    source: "talking-head-070726.mp4",
    from: 3384, // "what happened was the FDA sent a warning letter…" (1:52.8)
    // LOOP: ends on "…messy case studies make dangerous roadmaps" (abs 4576) → replays into the hook.
    durationInFrames: 1192, // ~40s
    topic: "IS THE $401M REAL?",
    hook: "AI BUILT IT. THE FDA CALLED.",
    beats: [
      { at: 6, scene: "reject", badge: "FDA", text: "WARNING LETTER" }, // "FDA" abs 3396
      { at: 248, scene: "emote", pose: "confused", text: "AN AFFILIATE?" }, // abs 3632
      { at: 484, scene: "stack", text: "1000s OF ADS" }, // "meta ads" abs 3868
      { at: 572, scene: "emote", pose: "alarmed", accent: "#C65B52", text: "FAKE DOCTORS?", emoji: "😳" }, // "personas" abs 3956
      { at: 940, scene: "bolt", trails: true, blockLabel: "THE BIZ", moduleLabel: "CLAUDE", warn: "TRUST CAN'T KEEP UP", text: "TOO FAST" }, // "trust" abs 4330
    ],
    fullscreen: [{ from: 484, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Vulcan",
    label: "Non-tech founders + Claude Code → gov customer + $10.9M seed",
    source: "talking-head-070726.mp4",
    from: 4590, // "now compare that with Vulcan Technologies" (2:33)
    // LOOP: ends on "…find a painful bottleneck, use AI to move faster" (abs 5700) → replays into the hook.
    durationInFrames: 1110, // ~37s
    topic: "THE SMARTER CLAUDE STORY",
    hook: "NO CODE. GOV CONTRACT. $11M.",
    beats: [
      { at: 27, scene: "bolt", blockLabel: "VULCAN", moduleLabel: "CLAUDE", text: "THE QUIET ONE" }, // "Vulcan" abs 4617
      { at: 209, scene: "emote", pose: "thinking", text: "NON-TECH FOUNDERS" }, // abs 4799
      { at: 343, scene: "check", obj: "shield", verdict: "warn", text: "REG COMPLEXITY" }, // abs 4933
      { at: 408, scene: "check", obj: "shield", verdict: "check", text: "GOV CUSTOMER" }, // "Virginia" abs 4998
      { at: 491, scene: "coins", labels: ["SEED"], text: "$10.9M SEED", sub: "reported" }, // "seed" abs 5081
      { at: 556, scene: "emote", pose: "celebrate", accent: "#4FA98A", text: "REAL RECEIPTS", emoji: "🧾" }, // abs 5146
      { at: 643, scene: "reject", badge: "TRUST ME", text: "NOT NEEDED" }, // "not trust the founder" abs 5233
      { at: 749, scene: "check", obj: "shield", verdict: "check", text: "A REAL BUYER" }, // abs 5339
      { at: 880, scene: "emote", pose: "pointing", text: "THAT MATTERS" }, // abs 5410
    ],
    fullscreen: [{ from: 408, to: 620 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-Plumbers",
    label: "Jensen Huang: the next AI millionaires might be plumbers",
    source: "talking-head-070726.mp4",
    from: 9511, // "and then Jensen Huang throws a grenade…" (5:17)
    // LOOP: ends on "…people who use AI near a valuable constraint" (abs 10692) → replays into the hook.
    durationInFrames: 1181, // ~39s
    topic: "WHO GETS RICH OFF AI?",
    hook: "AI MILLIONAIRES = PLUMBERS?",
    beats: [
      { at: 44, scene: "emote", pose: "alarmed", text: "JENSEN'S GRENADE", emoji: "💣" }, // abs 9555
      { at: 242, scene: "emote", pose: "confused", text: "PLUMBERS?!" }, // abs 9753
      { at: 437, scene: "bolt", trails: true, blockLabel: "SAME STORY", moduleLabel: "NEW NECK", text: "DIFFERENT BOTTLENECK" }, // abs 9948
      { at: 516, scene: "racks", text: "AI NEEDS POWER" }, // "data centers" abs 10027
      { at: 656, scene: "conveyor", labels: ["DONE"], text: "REAL-WORLD WORK" }, // "build wire cool" abs 10167
      { at: 888, scene: "queue", labels: ["SOFTWARE", "REGS", "INFRA"], text: "AT THE BOTTLENECK" }, // abs 10399
    ],
    fullscreen: [{ from: 437, to: 640 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  {
    id: "Short-BSTest",
    label: "The 3-second test for 'AI made me rich' stories",
    source: "talking-head-070726.mp4",
    from: 14592, // "so next time you see an AI made me rich story" (8:06.4)
    // LOOP: ends on "…less sexy, much more useful" (abs 15240) → replays into the hook.
    durationInFrames: 660, // ~22s
    topic: "SPOT THE FAKE AI STORY",
    hook: "THE 3-SECOND BS TEST",
    beats: [
      { at: 149, scene: "reject", badge: "IMPRESSIVE?", text: "WRONG QUESTION" }, // abs 14741
      { at: 198, scene: "testbench", labels: ["STORY", "RECEIPTS"], text: "CHECK RECEIPTS" }, // abs 14790
      { at: 258, scene: "queue", labels: ["BOTTLENECK?"], text: "WHAT DID AI REMOVE?" }, // abs 14850
      { at: 336, scene: "check", obj: "coin", verdict: "check", text: "WHO PAID?" }, // abs 14928
      { at: 405, scene: "conveyor", labels: ["DONE"], text: "CLEAR? STUDY IT" }, // abs 14997
      { at: 455, scene: "emote", pose: "shrug", text: "VAGUE? SCROLL", emoji: "🙄" }, // abs 15047
    ],
    fullscreen: [{ from: 198, to: 380 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
  },
  // ==========================================================================
  // SIDE-HUSTLES video (talking-head-100726.mp4) — archived 2026-07-11.
  // ==========================================================================
  {
    id: "Short-ThreeBuyers",
    label: "If you can't name three people who'd pay, you have an idea, not an offer",
    source: "talking-head-100726.mp4",
    from: 12846, // "name three people who could pay for this exact service this month" (7:08.2)
    // LOOP: ends on "…start selling your services." (abs 13709) → replays into the test.
    durationInFrames: 878, // ~29s
    topic: "THE 3-PEOPLE TEST",
    hook: "NO BUYERS = NO BUSINESS",
    context: "The test before you build any AI side hustle",
    beats: [
      { at: 8, scene: "buyers", pose: "pointing", tint: "#D97757", text: "NAME THREE PEOPLE" }, // spoken at open (abs 12851) — THREE slots on screen, matching the spoken count
      { at: 118, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "WHO PAYS THIS MONTH?" }, // "this month" abs 12964
      { at: 165, scene: "reject", badge: "SOMEDAY", tint: "#C65B52", text: "NOT SOMEDAY" }, // "not some day" abs 13010
      { at: 310, scene: "buyers", pose: "facepalm", verdict: "cross", tint: "#C9913D", text: "CAN'T NAME THREE?" }, // "if you can't name three people" abs 13160 — three slots, all ✗
      { at: 356, scene: "stamp", verdict: "cross", badge: "YOUR PLAN", tint: "#C65B52", text: "JUST AN IDEA" }, // "an idea with a name" abs 13268 (stamp slams ~396)
      { at: 444, scene: "emote", pose: "pointing", tint: "#4FA98A", text: "START WITH THE BUYER" }, // "flip it start with the buyer" abs 13290
      { at: 583, scene: "hourglass", tint: "#C9913D", text: "30-DAY PROOF WINDOW" }, // "give yourself a 30 day proof window" abs 13429
      { at: 700, scene: "doors", labels: ["WRITE", "RESEARCH", "AUTOMATE", "SUPPORT", "SKILLS"], value: 0, tint: "#D97757", text: "PICK ONE. GO." }, // "pick one of the FIVE options" abs 13515 — five doors, matching the spoken count
    ],
    // full-anim: the someday/idea gauntlet + the pick-one payoff. Second span
    // ends 726 (not 758): the ~26f exit ramp must clear the CTA return at
    // dur−114 (spec rule: `to ≤ dur − 140`).
    fullscreen: [{ from: 190, to: 470 }, { from: 656, to: 726 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-FivePaths",
    label: "Five beginner Claude side hustles — no code, no pretending",
    source: "talking-head-100726.mp4",
    from: 490, // "I'm walking you through five Claude side hustles…" (0:16.3)
    // LOOP: ends on "…your fastest path to money." (abs 1606) → replays into the five.
    durationInFrames: 1131, // ~38s
    topic: "5 CLAUDE SIDE HUSTLES",
    hook: "FIVE AI HUSTLES, ZERO CODE",
    context: "Beginner Claude side hustles — no coding needed",
    beats: [
      { at: 8, scene: "doors", labels: ["1", "2", "3", "4", "5"], value: 1, tint: "#D97757", text: "FIVE WAYS IN" }, // "five Claude side hustles" abs 516 — FIVE doors, matching the spoken count
      { at: 180, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "ZERO CODE NEEDED" }, // "no coding background" abs 665
      { at: 255, scene: "reject", badge: "FAKE ENGINEER", tint: "#C65B52", text: "NO PRETENDING" }, // "no pretending you are suddenly a software engineer" abs 745
      { at: 420, scene: "emote", pose: "shrug", tint: "#C9913D", text: "BUT ZERO EFFORT? NO", emoji: "😅" }, // "zero experience does not mean zero effort" abs 912
      { at: 502, scene: "queue", labels: ["TASTE", "JUDGEMENT", "SELLING"], tint: "#D97757", text: "YOU STILL NEED" }, // "you still need the taste…" abs 992
      { at: 752, scene: "stamp", verdict: "check", badge: "THIS VIDEO", tint: "#4FA98A", text: "A DECISION GUIDE" }, // "this is the decision walkthrough" abs 1242
      { at: 970, scene: "emote", pose: "thinking", tint: "#D97757", text: "WHICH FITS YOU?" }, // "which cloud side hustles fit your skills" abs 1466
    ],
    // full-anim: the doors reveal run + the you-still-need list
    fullscreen: [{ from: 190, to: 330 }, { from: 502, to: 620 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-HateResearch",
    label: "People hate research — charge them for it (first-dollar Claude hustle)",
    source: "talking-head-100726.mp4",
    from: 6564, // "and this works because most people hate research" (3:38.8)
    // LOOP: ends on "…the upside is speed to payment." (abs 7133) → replays into the pain.
    durationInFrames: 584, // ~19s
    topic: "FIRST AI DOLLAR",
    hook: "PEOPLE HATE RESEARCH. CHARGE THEM.",
    context: "Claude research reports = an easy first sale",
    beats: [
      { at: 8, scene: "emote", pose: "facepalm", tint: "#C9913D", text: "PEOPLE HATE RESEARCH" }, // spoken at open (abs 6570)
      { at: 95, scene: "queue", labels: ["TAB", "TAB", "TAB"], tint: "#D97757", text: "STUCK IN 30 TABS" }, // "they get stuck in tabs" abs 6659
      { at: 230, scene: "funnel", badge: "THE FINDINGS", tint: "#4FA98A", text: "CLAUDE DOES THE READING" }, // "Claude can handle the heavy reading" abs 6800
      { at: 291, scene: "emote", pose: "pointing", tint: "#C9913D", text: "YOU MAKE THE CALL" }, // "you still need to make the judgement call" abs 6855
      { at: 361, scene: "check", obj: "coin", verdict: "check", tint: "#4FA98A", text: "VALUE = THE DECISION" }, // "the value…is in the final decision" abs 6925
    ],
    // full-anim: the tabs → funnel run
    fullscreen: [{ from: 190, to: 320 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-SkillNotPrompt",
    label: "Prompts are disposable — sell reusable Claude skills instead",
    source: "talking-head-100726.mp4",
    from: 11163, // "you gotta remember that this product is not just the prompt" (6:12.1)
    // LOOP: ends on "…if anyone actually wants it." (abs 11847) → replays into the pitch.
    durationInFrames: 699, // ~23s
    topic: "SELL SKILLS, NOT PROMPTS",
    hook: "PROMPTS ARE DISPOSABLE",
    context: "Claude skills are sellable, reusable systems",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "NOT JUST A PROMPT" }, // spoken at open (abs 11175)
      { at: 127, scene: "cartridge", badge: "SKILL.MD", tint: "#4FA98A", text: "A REPEATABLE SYSTEM" }, // "a repeatable way to get a better result" abs 11290
      { at: 227, scene: "reject", badge: "ONE-OFF PROMPT", tint: "#C65B52", text: "DISPOSABLE" }, // "a prompt is usually disposable" abs 11390
      { at: 337, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#C9913D", text: "A MINI OS FOR ONE TASK" }, // "mini operating system for one specific task" abs 11500
      { at: 437, scene: "queue", labels: ["BUILD", "EXPLAIN", "MARKET"], tint: "#D97757", text: "THE REAL WORK" }, // "you'll have to build the thing…" abs 11600
    ],
    // full-anim: the cartridge click-in + the disposable-prompt rejection
    fullscreen: [{ from: 190, to: 330 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  // ==========================================================================
  // GPT-5.6 "sandbox it" video (talking-head-110726.mp4) — archived 2026-07-11.
  // ==========================================================================
  // ==========================================================================
  // GPT-5.6 "sandbox it" video (talking-head.mp4) — anchors from whisper words.
  // ==========================================================================
  {
    id: "Short-SandboxRule",
    label: "THE HOOK: efficient but it cheated — sandbox it before you scale it",
    source: "talking-head-110726.mp4",
    from: 0, // the video's hook question, verbatim
    // LOOP: the CTA lands right as "…scale it." (700) ends; the tail trails
    // into "GPT-5.6 launched publicly…" which loops cleanly back into the
    // hook question. 800f so the rule-stamp beat gets ≥3s of split BEFORE the
    // CTA return (at 720 the CTA seized the layout mid-payoff).
    durationInFrames: 800, // ~27s
    topic: "GPT-5.6 IN PRODUCTION?",
    hook: "DON'T SHIP GPT-5.6 BLIND",
    hookAlt: "GPT-5.6 IS FAST. AND IT CHEATS.", // A/B variant → Short-SandboxRule-B
    context: "OpenAI's new model: efficient — but it cheats",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "MOVE YOUR STACK?" }, // hook question spoken at open
      { at: 170, scene: "bolt", trails: true, blockLabel: "GPT-5.6", moduleLabel: "SOL", tint: "#4FA98A", text: "54% MORE EFFICIENT" }, // "Sol is 54% more token-efficient" abs 176
      { at: 332, scene: "check", obj: "coin", verdict: "check", tint: "#C9913D", text: "CHEAPER AGENTS AT SCALE" }, // "could reduce real-agent costs" abs 338
      { at: 419, scene: "check", obj: "shield", verdict: "warn", tint: "#D97757", text: "BUT THE SAFETY CARD…" }, // "OpenAI's own safety card" abs 425
      { at: 506, scene: "reject", badge: "IT CHEATED", tint: "#C65B52", text: "UNAUTHORIZED ACTIONS", emoji: "🚨" }, // "cheated" abs 512, "unauthorized" abs 542
      { at: 592, scene: "stamp", verdict: "check", badge: "MY RULE", tint: "#4FA98A", text: "SANDBOX → THEN SCALE" }, // "my rule is simple: sandbox it" abs 594→649 (slam ~632)
    ],
    // full-anim: the bolt-on efficiency gag + the cheat/rule payoff
    fullscreen: [{ from: 190, to: 376 }, { from: 470, to: 578 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ItCheated",
    label: "OpenAI's own system card: cheating, faked results, moved credentials",
    source: "talking-head-110726.mp4",
    from: 2810, // "OpenAI's June 26 system card changes the production conversation."
    // LOOP: ends on "…can touch client infrastructure." (abs 3585) → replays into the system card.
    durationInFrames: 780, // ~26s
    topic: "OPENAI'S SAFETY CARD",
    hook: "OPENAI SAYS IT CHEATED",
    context: "GPT-5.6's own system card, June 26",
    beats: [
      { at: 8, scene: "stamp", verdict: "cross", badge: "SYSTEM CARD", tint: "#C65B52", text: "THE JUNE 26 DROP" }, // spoken at open
      { at: 170, scene: "queue", labels: ["CHEATED", "FABRICATED", "DESTRUCTIVE"], tint: "#C9913D", text: "IT DID ALL THREE" }, // "task cheating" abs 2986 → the three documented behaviours
      { at: 402, scene: "reject", badge: "CACHED CREDENTIALS", tint: "#C65B52", text: "IT MOVED YOUR KEYS", emoji: "🔑" }, // "moving cached credentials" abs 3218
      { at: 545, scene: "emote", pose: "worried", accent: "#C9913D", tint: "#D97757", text: "RISK = TOOL ACCESS" }, // "the production risk sits in tool access" abs 3360
      { at: 610, scene: "check", obj: "gauge", verdict: "cross", tint: "#C65B52", text: "SCORES ≠ SAFE TOOLS" }, // "does not prove safe tool use" abs 3453
    ],
    // full-anim: the three-behaviours gauntlet
    fullscreen: [{ from: 190, to: 470 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-MetrGaveUp",
    label: "METR's capability estimate: 11.3h to 270h — treated as unusable",
    source: "talking-head-110726.mp4",
    from: 3588, // "METR then tried to estimate Sol's capability…"
    // LOOP: ends on "…around poorly constrained tools." (abs 4522) → replays into METR's attempt.
    durationInFrames: 950, // ~32s
    topic: "CAN YOU TRUST GPT-5.6?",
    hook: "THE SAFETY TESTERS GAVE UP",
    context: "METR couldn't measure GPT-5.6's limits",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "METR RAN THE TESTS" }, // spoken at open
      { at: 120, scene: "signal", tint: "#C65B52", text: "REWARD HACKING", sub: "tests contaminated" }, // "contaminated by reward hacking" abs 3716
      { at: 334, scene: "check", obj: "clock", verdict: "warn", tint: "#C9913D", text: "11 HOURS? OR 270?" }, // "11.3 hours to more than 270" abs 3928
      { at: 467, scene: "emote", pose: "shrug", tint: "#D97757", text: "A RANGE THAT WIDE?", emoji: "🤷" }, // "the range was so wide" abs 4061
      { at: 574, scene: "stamp", verdict: "cross", badge: "METR VERDICT", tint: "#C65B52", text: "UNUSABLE" }, // "treated the estimate as unusable" abs 4168 (slam ~614)
      { at: 692, scene: "check", obj: "brain", verdict: "warn", tint: "#C9913D", text: "SCOREBOARD ≠ TRUST" }, // "the scoreboard cannot carry the trust decision" abs 4286
      { at: 766, scene: "emote", pose: "worried", accent: "#C65B52", tint: "#D97757", text: "CAPABLE BUT UNRELIABLE" }, // "highly capable while still behaving unreliably" abs 4383
    ],
    // full-anim: the static-signal gag + the UNUSABLE stamp
    fullscreen: [{ from: 190, to: 430 }, { from: 560, to: 690 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-InYourCopilot",
    label: "GPT-5.6 became Copilot's preferred model on day one — audit permissions",
    source: "talking-head-110726.mp4",
    from: 4542, // "Now look at where the model landed on launch day."
    // LOOP: ends on "…matter more than leaderboard position." (abs 5583) → replays into launch day.
    durationInFrames: 1060, // ~35s
    topic: "CHECK YOUR COPILOT",
    hook: "IT'S ALREADY IN YOUR TOOLS",
    context: "GPT-5.6 became Copilot's default on day one",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "WHERE IT LANDED, DAY 1" }, // spoken at open
      { at: 125, scene: "bolt", blockLabel: "COPILOT", moduleLabel: "GPT-5.6", tint: "#4FA98A", text: "INSIDE GITHUB COPILOT" }, // "rolled into GitHub Copilot" abs 4673
      { at: 268, scene: "check", obj: "brain", verdict: "check", tint: "#C9913D", text: "M365'S PREFERRED MODEL" }, // "the preferred model in Microsoft 365" abs 4794
      { at: 350, scene: "queue", labels: ["CHATGPT WORK", "CODEX", "CROSS-APP"], tint: "#D97757", text: "WORKPLACE AUTOMATION" }, // "ChatGPT Work launched alongside" abs 4898
      { at: 630, scene: "conveyor", labels: ["TOOL-RICH"], tint: "#C9913D", text: "STRAIGHT INTO WORKFLOWS" }, // "moving directly into tool-rich workplaces" abs 5176
      { at: 823, scene: "emote", pose: "confused", tint: "#C65B52", text: "ALREADY IN YOUR STACK?", emoji: "👀" }, // "if you use Copilot… may already be part" abs 5352
      { at: 970, scene: "stamp", verdict: "check", badge: "PERMISSIONS", tint: "#4FA98A", text: "PERMISSIONS > LEADERBOARDS" }, // "permissions now matter more" abs 5518 (slam ~1010)
    ],
    // full-anim: the bolt-into-Copilot gag + the "already in yours?" punch
    fullscreen: [{ from: 190, to: 330 }, { from: 790, to: 910 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },

  // ==========================================================================
  // n8n-hybrid video (talking-head-120726.mp4) — archived 2026-07-13.
  // ==========================================================================
  {
    id: "Short-DontAbandon",
    label: "THE HOOK: about to abandon n8n for agents? the evidence says slow down",
    source: "talking-head-120726.mp4",
    from: 0,
    // LOOP: tail trails into "the strongest automation setup…" → replays into
    // "if you're about to abandon n8n" cleanly.
    durationInFrames: 780, // ~26s
    topic: "N8N VS AI AGENTS",
    hook: "DON'T ABANDON N8N YET",
    hookAlt: "THE NO-CODE DEATH IS FAKE", // A/B variant → Short-DontAbandon-B
    context: "Agent hype vs what the evidence shows",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "ABANDON N8N?" }, // populates the band as the split lands
      { at: 134, scene: "stamp", verdict: "cross", badge: "THE EVIDENCE", tint: "#C65B52", text: "SLOW DOWN" }, // "evidence says slow down" abs 140 (slam ~174)
      // FACE → FULL-SCREEN SCREENSHOT (Kris's pattern): the n8n canvas takes
      // the first span on the ×10 claim ("revenue grew 10-fold" abs 208)
      { at: 196, scene: "receipt", tint: "#4FA98A", text: "N8N REVENUE ×10", shot: { src: "assets/external/screenshots/n8n-canvas-wide.png", url: "n8n.io", imageW: 1800, imageH: 962, from: { x: 72, y: 38, w: 1656, h: 885 }, to: { x: 0, y: 0, w: 1800, h: 962 }, zoomAt: 10 } },
      // Klarna's FIRST MENTION → Klarna's OWN site (brand rule, July 2026);
      // the Forbes rehire proof lives in Short-KlarnaLesson instead.
      // No emoji here: EmojiPop docks top-right and would touch the wide label.
      { at: 352, scene: "receipt", tint: "#C9913D", text: "KLARNA REHIRED HUMANS", shot: { src: "assets/external/screenshots/klarna-pr-wide.png", url: "klarna.com/press", imageW: 2152, imageH: 1150, from: { x: 8, y: 48, w: 2062, h: 1102 }, to: { x: 8, y: 50, w: 900, h: 330 }, zoomAt: 14 } },
      { at: 490, scene: "emote", pose: "worried", accent: "#C65B52", tint: "#C65B52", text: "PUSHED TOO HARD" }, // "pushing AI-led customer service too hard" abs 466-557 (ends the receipt before the span)
      { at: 590, scene: "bolt", blockLabel: "WORKFLOW", moduleLabel: "AI", tint: "#4FA98A", text: "HYBRID STACK" }, // "favor a hybrid stack" abs 607
    ],
    // full-anim: ONLY the animated hybrid payoff — receipts stay in the split
    // band (Kris's rule: screenshots fill the half, never the whole screen)
    fullscreen: [{ from: 550, to: 640 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-KlarnaLesson",
    label: "Klarna: 700 agents' work, then quality broke and humans came back",
    source: "talking-head-120726.mp4",
    from: 1862, // "Klarna is the cleanest warning…"
    // LOOP: ends on "…did not switch the AI off." (abs 2860) → replays into the warning.
    durationInFrames: 1000, // ~33s
    topic: "THE KLARNA WARNING",
    hook: "AI REPLACED 700 PEOPLE. BRIEFLY.",
    context: "Klarna's AI support story, 2024-2025",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "THE CLEANEST WARNING" }, // spoken at open
      { at: 295, scene: "check", obj: "brain", verdict: "check", tint: "#4FA98A", text: "WORK OF 700 AGENTS" }, // "roughly 700 customer service agents" abs 2163
      // Klarna's OWN press release as the receipt ("from 11 minutes to around 2" abs 2273 → beat-rel 6)
      { at: 405, scene: "receipt", tint: "#C9913D", text: "11 MIN → 2", shot: { src: "assets/external/screenshots/klarna-pr-wide.png", url: "klarna.com/press", imageW: 2152, imageH: 1150, from: { x: 8, y: 48, w: 2062, h: 1102 }, to: { x: 40, y: 525, w: 1560, h: 620 }, zoomAt: 4, highlight: { x: 115, y: 838, w: 1260, h: 72 }, highlightAt: 10 } },
      { at: 592, scene: "reject", badge: "QUALITY", tint: "#C65B52", text: "THEN IT BROKE", emoji: "📉" }, // "the quality problem surfaced" abs 2460
      // Forbes receipt as proof of the admission ("over-indexed on efficiency and cost" abs 2591).
      // Lives purely in split view (spans end at 700; the CTA owns the frame
      // from dur−114=886) — fills the band like every receipt.
      { at: 723, scene: "receipt", tint: "#D97757", text: "OVER-INDEXED ON COST", shot: { src: "assets/external/screenshots/forbes-klarna-wide.png", url: "forbes.com", imageW: 1600, imageH: 855, from: { x: 0, y: 20, w: 1600, h: 835 }, to: { x: 0, y: 60, w: 1600, h: 620 }, zoomAt: 14, highlight: { x: 2, y: 148, w: 1396, h: 112 }, highlightAt: 110 } },
      { at: 897, scene: "stamp", verdict: "check", badge: "THE FIX", tint: "#4FA98A", text: "HUMANS CAME BACK" }, // "began hiring people again" abs 2765 (rides under the CTA)
    ],
    // full-anim: the quality-break reject only — the Klarna-PR receipt stays
    // in the split band (screenshots fill the half, never the whole screen)
    fullscreen: [{ from: 592, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-AgentGap",
    label: "62% experimenting, 23% scaled — and Gartner's 40/40 whiplash",
    source: "talking-head-120726.mp4",
    from: 5551, // "McKinsey found 62%…"
    // LOOP: cuts as "so rapid adoption…" begins → replays into the McKinsey stat.
    durationInFrames: 990, // ~33s
    topic: "AGENTS: HYPE VS SCALE",
    hook: "EVERYONE'S TESTING. FEW SHIP.",
    context: "McKinsey + Gartner on AI agents in business",
    beats: [
      { at: 8, scene: "check", obj: "brain", verdict: "warn", tint: "#D97757", text: "62% ARE TESTING" }, // "62% of organizations" abs 5579
      { at: 178, scene: "check", obj: "gauge", verdict: "cross", tint: "#C65B52", text: "ONLY 23% SCALED" }, // "only 23% reported scaling" abs 5735
      { at: 330, scene: "emote", pose: "shrug", tint: "#C9913D", text: "A SNAPSHOT, NOT FATE", emoji: "🤷" }, // "a snapshot, not a permanent failure rate" abs 5888
      { at: 519, scene: "queue", labels: ["RELIABILITY", "GOVERNANCE", "COST"], tint: "#C65B52", text: "WHERE IT HURTS" }, // "reliability, governance and cost" abs 6076
      // Gartner receipt ("40% of enterprise applications" abs 6209 → beat-rel 6):
      // opens zoomed on the "40%", settles on the FULL banner headline — the
      // card is sized to the banner so no line ever slices at an edge.
      { at: 652, scene: "receipt", tint: "#4FA98A", text: "40% ADOPT BY 2026", shot: { src: "assets/external/screenshots/gartner-40pct-agents-2026.png", url: "gartner.com/newsroom", imageW: 2000, imageH: 600, from: { x: 480, y: 0, w: 1040, h: 312 }, to: { x: 0, y: 0, w: 2000, h: 600 }, zoomAt: 4, highlight: { x: 765, y: 120, w: 230, h: 105 }, highlightAt: 10 } },
      { at: 864, scene: "stamp", verdict: "cross", badge: "GARTNER", tint: "#C65B52", text: "40% CANCELLED BY 2027" }, // "over 40%… cancelled" abs 6421 (slam ~904)
    ],
    // full-anim: the 62/23 gap + the hurt list only — the Gartner receipt
    // stays in the split band (its 40% mega-zoom fills the half)
    fullscreen: [{ from: 190, to: 400 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-DecisionRule",
    label: "The one rule: deterministic core, agent decision points",
    source: "talking-head-120726.mp4",
    from: 7218, // "For builders, this turns it into a simple decision rule."
    // LOOP: ends on "…retry and escalate." (abs 8270) → replays into the rule.
    durationInFrames: 1050, // ~35s
    topic: "WORKFLOW OR AGENT?",
    hook: "ONE RULE DECIDES IT",
    context: "When to use n8n workflows vs AI agents",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "ONE DECISION RULE" }, // spoken at open
      // The n8n canvas IS the deterministic workflow ("use a deterministic workflow when…" abs 7325)
      { at: 101, scene: "receipt", tint: "#4FA98A", text: "EXPENSIVE MISTAKES? WORKFLOW", shot: { src: "assets/external/screenshots/n8n-canvas-wide.png", url: "n8n.io", imageW: 1800, imageH: 962, from: { x: 100, y: 52, w: 1620, h: 866 }, to: { x: 0, y: 0, w: 1800, h: 962 }, zoomAt: 10 } },
      { at: 240, scene: "queue", labels: ["PAYMENTS", "CHANGES", "APPROVALS", "COMPLIANCE"], tint: "#C65B52", text: "NO IMPROVISING" }, // the four named no-go areas abs 7463→7538
      { at: 477, scene: "check", obj: "brain", verdict: "check", tint: "#D97757", text: "MESSY + BOUNDED? AGENT" }, // "use an agent when the input is messy" abs 7701
      { at: 606, scene: "funnel", badge: "DECISION", tint: "#C9913D", text: "BOUNDED JOBS ONLY" }, // "classification, document interpretation…" abs 7830
      { at: 801, scene: "bolt", blockLabel: "WORKFLOW", moduleLabel: "AGENT", tint: "#4FA98A", text: "CONNECT THE TWO" }, // "then connect the two" abs 8019
      { at: 940, scene: "stamp", verdict: "check", badge: "WORKFLOW", tint: "#4FA98A", text: "VALIDATE → ESCALATE" }, // "let the workflow validate… escalate" abs 8164 (slam ~980)
    ],
    // full-anim: the no-improvising queue + the connect payoff — the canvas
    // receipt at 101 stays in the split band
    fullscreen: [{ from: 240, to: 380 }, { from: 780, to: 900 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },

  // ==========================================================================
  // ChatGPT Work video (talking-head-130726.mp4) — archived 2026-07-14.
  // ==========================================================================
  {
    id: "Short-WorkLaunch",
    label: "THE HOOK: ChatGPT Work explained — one window, Codex inside, the catches",
    source: "talking-head-130726.mp4",
    from: 0,
    // LOOP: cuts mid "…unverified report describes two Sol incidents" → replays
    // into "ChatGPT Work wants one window" cleanly.
    durationInFrames: 780, // ~26s
    topic: "CHATGPT WORK, EXPLAINED",
    hook: "CHATGPT JUST ATE YOUR WORK APPS",
    hookAlt: "ONE WINDOW FOR ALL YOUR WORK", // A/B variant → Short-WorkLaunch-B
    context: "ChatGPT Work launched July 9 with GPT-5.6",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "ONE WINDOW?", logo: "chatgpt" }, // populates the band as the split lands
      // span-owning beat sits at span.from+13 — the push's HIDDEN midpoint —
      // so the pull-left slides the PREVIOUS beat out (never the new one)
      { at: 203, scene: "bolt", blockLabel: "CHATGPT", moduleLabel: "CODEX", tint: "#4FA98A", text: "CODEX, FOLDED IN" }, // "folds Codex technology into ChatGPT" (190-250)
      // The directory receipt — brand first-mention shot is OpenAI's own page
      { at: 300, scene: "receipt", tint: "#C9913D", text: "EVERY APP, ONE DIRECTORY", shot: { src: "assets/external/screenshots/openai-plugins-grid.png", url: "openai.com/business/plugins", imageW: 2880, imageH: 5500, from: { x: 480, y: 1600, w: 1920, h: 1026 }, to: { x: 0, y: 60, w: 2880, h: 1539 }, zoomAt: 8 } },
      { at: 440, scene: "stamp", verdict: "check", badge: "THE PROMISE", tint: "#4FA98A", text: "FEWER TABS" }, // "fewer tabs" (420)
      { at: 616, scene: "queue", labels: ["PRICING ?", "ACCESS ?", "FILES ?"], tint: "#C65B52", text: "THE CATCHES" }, // "pricing is unclear, access is uneven" (616)
    ],
    // full-anim: the Codex bolt gag only — the receipt stays in the split band
    fullscreen: [{ from: 190, to: 290 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-SolIncident",
    label: "Launch-week trust test: quota noise + the unverified Sol file deletions",
    source: "talking-head-130726.mp4",
    from: 6651, // "Then launch week turns into a trust test."
    // LOOP: ends on "…without pretending that the bug is confirmed" → replays
    // into the trust test.
    durationInFrames: 800, // ~27s
    topic: "THE FILE-DELETION REPORTS",
    hook: "AI DELETED USER FILES?",
    hookAlt: "DON'T GIVE AI YOUR ONLY COPY", // A/B variant → Short-SolIncident-B
    context: "Unverified ChatGPT Work launch-week reports",
    beats: [
      { at: 8, scene: "emote", pose: "worried", tint: "#D97757", text: "THE TRUST TEST", logo: "chatgpt" }, // spoken at open (6712)
      { at: 178, scene: "queue", labels: ["QUOTA RESETS", "REDESIGN CONFUSION"], tint: "#C9913D", text: "JULY 11 NOISE" }, // "quota resets" (6829)
      { at: 343, scene: "check", obj: "bug", verdict: "cross", tint: "#C65B52", text: "FILES DELETED?" }, // "two Sol incidents… deleted" (6993); span.from+13 = push midpoint
      { at: 511, scene: "stamp", verdict: "cross", badge: "OPENAI", tint: "#D97757", text: "NOT CONFIRMED" }, // "official OpenAI acknowledgment" (7162)
      { at: 640, scene: "emote", pose: "pointing", accent: "#4FA98A", tint: "#4FA98A", text: "CAUTION, NOT PANIC" }, // "the right response is caution" (7291)
    ],
    // full-anim: the deleted-files check beat carries the scare
    fullscreen: [{ from: 330, to: 500 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-BackupRule",
    label: "The rule: permissions vs limits, what demos hide, no backup no agent",
    source: "talking-head-130726.mp4",
    from: 7646, // "A useful agent needs permissions…"
    // LOOP: ends right after "…patch note addressing file safety" → replays
    // into the permissions line.
    durationInFrames: 780, // ~26s
    topic: "AGENT SAFETY 101",
    hook: "NO BACKUP, NO AGENT",
    context: "ChatGPT Work wants access to your files",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "NEEDS PERMISSIONS" }, // spoken at open (7660)
      // logo rides THIS beat: beat 8 ends at 100, before the split settles
      // (~122) — the opening logo must sit on the first VISIBLE beat
      { at: 100, scene: "reject", badge: "NO LIMITS", tint: "#C65B52", text: "TRUST NEEDS LIMITS", logo: "chatgpt" }, // "a trustworthy agent needs limits" (7746)
      { at: 214, scene: "queue", labels: ["FILE SAFETY", "PERMISSIONS", "RECOVERY"], tint: "#C9913D", text: "WHAT DEMOS HIDE" }, // "focused on models… polished demos" (7860)
      { at: 453, scene: "migrate", tint: "#D97757", text: "MY RULE" }, // "My rule is simple: do not run…" (8092+); span.from+13 = push midpoint
      { at: 622, scene: "stamp", verdict: "check", badge: "THE RULE", tint: "#4FA98A", text: "BACK UP FIRST" }, // "…lacks a backup" (8268)
    ],
    // full-anim: the STOP-sign migrate gag
    fullscreen: [{ from: 440, to: 610 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-SolTerraLuna",
    label: "Sol/Terra/Luna + the Trump-administration security review delay",
    source: "talking-head-130726.mp4",
    from: 2860, // "GPT-5.6 launched with three named models…"
    // LOOP: ends on "…for a public chatbot release." → replays into the models.
    durationInFrames: 940, // ~31s
    topic: "GPT-5.6: SOL·TERRA·LUNA",
    hook: "TRUMP DELAYED GPT-5.6",
    context: "GPT-5.6 launched July 9 after a security review",
    beats: [
      { at: 8, scene: "elevator", labels: ["LUNA", "TERRA", "SOL"], value: 2, tint: "#D97757", text: "THREE NEW MODELS", logo: "chatgpt" }, // "Sol, Terra, and Luna" (2904)
      { at: 260, scene: "check", obj: "gauge", verdict: "warn", tint: "#C9913D", text: "ROLES UNCLEAR" }, // "does not define those roles clearly" (3120)
      // TechSpot headline receipt — split-band card, zooms out from the headline
      { at: 390, scene: "receipt", tint: "#C15F3C", text: "STAGGERED RELEASE", shot: { src: "assets/external/screenshots/techspot-staggered-wide.png", url: "techspot.com", imageW: 2900, imageH: 1550, from: { x: 300, y: 120, w: 1740, h: 930 }, to: { x: 116, y: 62, w: 2668, h: 1426 }, zoomAt: 8, highlight: { x: 300, y: 150, w: 1715, h: 340 }, highlightAt: 14 } }, // "the release got delayed" (3250)
      { at: 533, scene: "check", obj: "shield", verdict: "cross", tint: "#C65B52", text: "ACCESS RESTRICTED" }, // "Trump administration restricted access" (3387); span.from+13 = push midpoint
      { at: 730, scene: "queue", labels: ["CYBER", "BIO", "MILITARY"], tint: "#C9913D", text: "THE REVIEW SCOPE" }, // "cyber, biological, and military risk" (3590)
    ],
    // full-anim: the restricted-shield beat
    fullscreen: [{ from: 520, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
