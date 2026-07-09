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
      { at: 8, scene: "coins", tint: "#F59E0B", text: "THE PRICE GETS REAL" }, // scene-setting under the hook; "price gets very real" abs 645
      { at: 73, scene: "check", obj: "coin", verdict: "warn", tint: "#EF4444", text: "$10 / M INPUT" }, // "$10 per million input" abs 692
      { at: 153, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "$50 / M OUTPUT", emoji: "💸" }, // "$50 per million output" abs 772
      { at: 263, scene: "check", obj: "brain", verdict: "check", tint: "#06B6D4", text: "WORTH IT?" }, // "should you use fable 5" abs 882
      { at: 476, scene: "conveyor", labels: ["CLEAN RULES"], tint: "#34D399", text: "MY CLEAN RULES" }, // "clean rules" abs 1093
      { at: 576, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "RESULT", tint: "#06B6D4", text: "CHANGES THE RESULT?" }, // "smarter model changes the result" abs 1195
      { at: 636, scene: "reject", badge: "ROUTINE PROMPTS", tint: "#EF4444", text: "DON'T WASTE IT" }, // "routine prompts" abs 1255
      { at: 751, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "AFTER JULY 12" }, // "after July 12th" abs 1370
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
      { at: 154, scene: "bolt", trails: true, blockLabel: "FABLE 5", moduleLabel: "LAUNCH", tint: "#34D399", text: "LAUNCHED" }, // "it launched" abs 4025
      { at: 184, scene: "check", obj: "shield", verdict: "cross", tint: "#EF4444", text: "RESTRICTED" }, // "got restricted" abs 4055
      { at: 216, scene: "conveyor", labels: ["BACK"], tint: "#06B6D4", text: "CAME BACK" }, // "came back" abs 4087
      { at: 258, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "BEHIND A COUNTDOWN" }, // "shoved behind a countdown" abs 4129
      { at: 356, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#EF4444", text: "SO MUCH DRAMA", emoji: "🎭" }, // "a lot more drama" abs 4227
      { at: 494, scene: "stack", tint: "#F59E0B", text: "JUNE 12: SHUTDOWN" }, // "June 12th… export controls" abs 4365
      { at: 924, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "LIFTED → BACK GLOBAL" }, // "controls were lifted" abs 4795
      { at: 1106, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "SAFETY", tint: "#06B6D4", text: "NEW SAFETY LAYER" }, // "new safety layer" abs 4977
      { at: 1284, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "BLOCKS 99%" }, // "over 99% of cases" abs 5155
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
      { at: 8, scene: "stack", tint: "#F59E0B", text: "DON'T BUILD ON IT" }, // scene-setting under the hook; "blindly build" abs 6472
      { at: 139, scene: "check", obj: "shield", verdict: "warn", labels: ["SECURITY", "COMPLIANCE", "CODE"], tint: "#06B6D4", text: "HIGH-STAKES WORK?" }, // "security, compliance…" abs 6574
      { at: 321, scene: "reject", badge: "RISKY REQUEST", tint: "#EF4444", text: "REROUTED AWAY" }, // "route risky requests away" abs 6756
      { at: 409, scene: "emote", pose: "confused", tint: "#F59E0B", text: "NOT WHAT YOU PICKED", emoji: "🤨" }, // "not getting the model you thought" abs 6844
      { at: 503, scene: "check", obj: "brain", verdict: "warn", tint: "#06B6D4", text: "MOST PEOPLE MISS THIS" }, // "the part most people miss" abs 6938
      { at: 626, scene: "coins", tint: "#EF4444", text: "EXPENSIVE…" }, // "not just expensive" abs 7061
      { at: 715, scene: "queue", labels: ["PLAN", "LIMITS", "ROUTING"], tint: "#F59E0B", text: "…AND CONDITIONAL" }, // "it is also conditional" abs 7131
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
      { at: 8, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "TIMER FOMO?" }, // scene-setting under the hook; "timer is running out" abs 7940
      { at: 102, scene: "coins", tint: "#EF4444", text: "A WASTED WINDOW" }, // "waste the free window" abs 8003
      { at: 234, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "HIRE THE SPECIALIST", sub: "Fable 5" }, // "knowledgeable specialist" abs 8135
      { at: 312, scene: "bolt", blockLabel: "FABLE 5", moduleLabel: "HARD PART", tint: "#06B6D4", text: "THE HARDEST PARTS" }, // "hardest parts" abs 8213
      { at: 385, scene: "conveyor", labels: ["OPUS", "SONNET"], tint: "#34D399", text: "THE REST → CHEAPER" }, // "back to Opus or Sonnet" abs 8286
      { at: 514, scene: "emote", pose: "celebrate", tint: "#06B6D4", text: "EXPENSIVE THINKING", sub: "cheap execution" }, // "expensive thinking" abs 8415
      { at: 706, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "BEFORE: HARDEST WORK" }, // "before July 12" abs 8607
      { at: 840, scene: "check", obj: "coin", verdict: "warn", tint: "#F59E0B", text: "AFTER: WORTH IT?" }, // "after July 12" abs 8741
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
      { at: 8, scene: "battery", value: 100, tint: "#34D399", text: "THE FREE WINDOW" }, // scene-setting; "promo window" abs 1899
      { at: 89, scene: "battery", value: 50, tint: "#F59E0B", text: "50% OF WEEKLY LIMITS" }, // "50% of your weekly plan limits" abs 1988
      { at: 147, scene: "stamp", verdict: "check", badge: "FABLE 5 ACCESS", tint: "#34D399", text: "NOTHING TO CLAIM" }, // "nothing special to claim" abs 2046 (stamp slams on "claim" abs 2086)
      { at: 209, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "JUST PICK IT" }, // "just select fable 5" abs 2108
      { at: 320, scene: "breaker", tint: "#EF4444", text: "THEN THE PROMO ENDS" }, // "once the promo ends" abs 2219 (trips on "no longer part" abs ~2326)
      { at: 575, scene: "coins", tint: "#F59E0B", text: "CREDIT TERRITORY" }, // "usage credits" abs 2474
      { at: 659, scene: "elevator", value: 2, tint: "#06B6D4", text: "OR RIDE A TIER DOWN" }, // "switch back to another Claude model" abs 2558
      { at: 845, scene: "emote", pose: "shrug", tint: "#34D399", text: "PRESSURE'S GONE?" }, // "think the pressure is gone" abs 2749
      { at: 955, scene: "hourglass", tint: "#F59E0B", text: "IT JUST MOVED 5 DAYS", emoji: "⏳" }, // "only moved five days away" abs 2849
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
      { at: 8, scene: "signal", tint: "#F59E0B", text: "WAITING FOR NEWS?" }, // scene-setting; "waiting for it to return" abs 8877
      { at: 85, scene: "emote", pose: "pointing", tint: "#06B6D4", text: "WATCH THE WORDING" }, // "watch the wording" abs 8956
      { at: 140, scene: "stamp", verdict: "cross", badge: "RANDOM SCREENSHOT", tint: "#EF4444", text: "NOT SCREENSHOTS" }, // "random screenshots" abs 9011 (DENIED slams abs ~9051)
      { at: 264, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "OFFICIAL + A REAL DATE" }, // "standard plans are a real date" abs 9128
      { at: 306, scene: "signal", verdict: "check", tint: "#06B6D4", text: "THAT'S THE SIGNAL" }, // "that is the signal" abs 9177
      { at: 424, scene: "hourglass", tint: "#F59E0B", text: "LAST CONFIRMED WINDOW" }, // "last confirmed free window" abs 9295
      { at: 466, scene: "reject", badge: "A FORMALITY?", tint: "#EF4444", text: "NO GUARANTEES" }, // "not a formality, not a guarantee" abs 9337
      { at: 532, scene: "emote", pose: "alarmed", tint: "#F59E0B", text: "JUST A WINDOW" }, // "a window" abs 9400
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
      { at: 8, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "SENIOR ARCHITECT", sub: "renames a button" }, // "senior architect" abs 4700
      { at: 180, scene: "coins", tint: "#EF4444", text: "STUPIDLY EXPENSIVE" }, // "stupidly expensive" abs 4836
      { at: 308, scene: "check", obj: "clock", verdict: "check", tint: "#34D399", text: "LOW = QUICK CHECKS" }, // "Low" abs 4964
      { at: 496, scene: "conveyor", labels: ["NORMAL WORK"], tint: "#06B6D4", text: "MEDIUM = BALANCE" }, // "Medium" abs 5152
      { at: 671, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "HIGH = JUDGMENT" }, // "High" abs 5327
      { at: 822, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "XHIGH = AGENTS" }, // "Extra high" abs 5478
      { at: 1115, scene: "reject", badge: "DEFAULT", tint: "#EF4444", text: "MAX ≠ DEFAULT", emoji: "💸" }, // "max should not be your default" abs 5771
      { at: 1235, scene: "emote", pose: "alarmed", accent: "#EF4444", tint: "#F59E0B", text: "WRONG = EXPENSIVE" }, // "being wrong is expensive" abs 5891
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
      { at: 8, scene: "coins", tint: "#F59E0B", text: "THE COST TRAP" }, // "cost trap" abs 12071
      { at: 138, scene: "check", obj: "coin", verdict: "warn", tint: "#EF4444", text: "2× THE PRICE" }, // "double Opus 4.8" abs 12167
      { at: 415, scene: "retry", tint: "#F59E0B", text: "× EFFORT × RETRIES" }, // "effort level, retries, tool calls" abs 12444
      { at: 618, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "ONE CLEAN PASS?" }, // "one clean pass" abs 12647
      { at: 678, scene: "emote", pose: "shrug", accent: "#F59E0B", tint: "#06B6D4", text: "OPUS DID THE SAME", sub: "the ½-price Claude" }, // "waste if Opus…" abs 12707
      { at: 796, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "80%? USE OPUS" }, // "the 80…rule" abs 12825
      { at: 1123, scene: "conveyor", labels: ["SONNET"], tint: "#06B6D4", text: "EVEN CHEAPER?" }, // "Sonnet…even cheaper" abs 13152
      { at: 1215, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "THE 20% MATTERS?", sub: "then Fable", emoji: "💰" }, // "missing 20%…matters" abs 13244
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
      { at: 162, scene: "coins", tint: "#F59E0B", text: "WASTED SPEND" }, // "waste money" abs 8695
      { at: 255, scene: "reject", badge: "FEELS SAFER", tint: "#EF4444", text: "NOT SMARTER" }, // "feels safer" abs 8788
      { at: 413, scene: "emote", pose: "shrug", tint: "#06B6D4", text: "DOESN'T NEED FABLE", sub: "the premium tier", emoji: "🤷" }, // "do not need Fable" abs 8946
      { at: 592, scene: "check", obj: "brain", verdict: "warn", tint: "#F59E0B", text: "BARELY NEEDS OPUS" }, // "barely need Opus" abs 9125
      { at: 636, scene: "queue", labels: ["EXTRACT", "FORMAT", "CLASSIFY"], tint: "#06B6D4", text: "CHEAP LANE" }, // "extraction, formatting…" abs 9169
      { at: 799, scene: "conveyor", labels: ["SONNET", "HAIKU"], tint: "#34D399", text: "HANDLED" }, // "Sonnet or haiku" abs 9332
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
      { at: 200, scene: "check", obj: "shield", verdict: "cross", tint: "#EF4444", text: "RESTRICTED" }, // "it was restricted" abs 11000
      { at: 241, scene: "check", obj: "shield", verdict: "check", tint: "#34D399", text: "THEN IT'S BACK" }, // "came back" abs 11041
      { at: 398, scene: "check", obj: "clock", verdict: "warn", tint: "#F59E0B", text: "WEEKLY LIMITS" }, // "part of the weekly usage" abs 11198
      { at: 471, scene: "coins", tint: "#EF4444", text: "USAGE CREDITS", emoji: "😬" }, // "usage credits" abs 11271
      { at: 624, scene: "stack", tint: "#F59E0B", text: "IT BREAKS" }, // "that is going to break" abs 11424
      { at: 784, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "A ROUTING RULE" }, // "routing rule" abs 11584
      { at: 880, scene: "bolt", trails: true, blockLabel: "OPUS", moduleLabel: "XHIGH", tint: "#06B6D4", text: "THE FALLBACK" }, // "try Opus extra high" abs 11680
      { at: 997, scene: "check", obj: "gauge", verdict: "check", tint: "#34D399", text: "STEP DOWN" }, // "step down to high" abs 11797
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
      { at: 127, scene: "check", obj: "brain", verdict: "warn", tint: "#F59E0B", text: "FABLE'S PROMPT?" }, // "Fable system prompt" abs 2107
      { at: 224, scene: "reject", badge: "OFFICIAL", tint: "#EF4444", text: "JUST A RUMOR", emoji: "🤨" }, // "like a rumor" abs 2204
      { at: 301, scene: "check", obj: "brain", verdict: "cross", tint: "#F59E0B", text: "DON'T COPY-PASTE" }, // "don't copy it word for word" abs 2281
      { at: 413, scene: "stack", tint: "#EF4444", text: "DON'T BUILD ON IT" }, // "build your workflow around a leak" abs 2393
      { at: 692, scene: "emote", pose: "pointing", accent: "#34D399", tint: "#34D399", text: "STEAL THE BEHAVIOUR" }, // "worth stealing" abs 2672
      { at: 780, scene: "check", obj: "clock", verdict: "cross", tint: "#06B6D4", text: "NO STALE FACTS" }, // "don't trust stale knowledge" abs 2760
      { at: 838, scene: "testbench", labels: ["ASSUMPTIONS", "REALITY"], tint: "#F59E0B", text: "VERIFY FIRST" }, // "don't assume a file exists" abs 2818
      { at: 1008, scene: "emote", pose: "celebrate", accent: "#34D399", tint: "#34D399", text: "GOOD AGENT BEHAVIOUR" }, // "good agent behavior" abs 3010
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
      { at: 703, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "BROKEN" }, // "ten calls… broken" abs 1830
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
      { at: 584, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "STILL BREAKS" }, // "breaks your app" abs 5641
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
      { at: 708, scene: "emote", pose: "celebrate", accent: "#34D399", text: "SHIP IT", emoji: "🚀" }, // abs 9199
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
      { at: 588, scene: "emote", pose: "worried", accent: "#F59E0B", text: "CAREFUL" }, // abs 4466
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
      { at: 572, scene: "emote", pose: "alarmed", accent: "#EF4444", text: "FAKE DOCTORS?", emoji: "😳" }, // "personas" abs 3956
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
      { at: 556, scene: "emote", pose: "celebrate", accent: "#34D399", text: "REAL RECEIPTS", emoji: "🧾" }, // abs 5146
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
  },];
