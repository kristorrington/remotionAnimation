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
  // SIDE-HUSTLES video (talking-head.mp4) — anchors from the SRT (sec × 30);
  // tighten against captionsData.ts word times if any label feels early/late.
  // ==========================================================================
  {
    id: "Short-ThreeBuyers",
    label: "If you can't name three people who'd pay, you have an idea, not an offer",
    source: "talking-head.mp4",
    from: 12846, // "name three people who could pay for this exact service this month" (7:08.2)
    // LOOP: ends on "…start selling your services." (abs 13709) → replays into the test.
    durationInFrames: 878, // ~29s
    topic: "THE 3-PEOPLE TEST",
    hook: "NO BUYERS = NO BUSINESS",
    context: "The test before you build any AI side hustle",
    beats: [
      { at: 8, scene: "buyers", pose: "pointing", tint: "#D97757", text: "NAME THREE PEOPLE" }, // spoken at open (abs 12851) — THREE slots on screen, matching the spoken count
      { at: 118, scene: "check", obj: "brain", verdict: "warn", tint: "#F59E0B", text: "WHO PAYS THIS MONTH?" }, // "this month" abs 12964
      { at: 165, scene: "reject", badge: "SOMEDAY", tint: "#EF4444", text: "NOT SOMEDAY" }, // "not some day" abs 13010
      { at: 310, scene: "buyers", pose: "facepalm", verdict: "cross", tint: "#F59E0B", text: "CAN'T NAME THREE?" }, // "if you can't name three people" abs 13160 — three slots, all ✗
      { at: 356, scene: "stamp", verdict: "cross", badge: "YOUR PLAN", tint: "#EF4444", text: "JUST AN IDEA" }, // "an idea with a name" abs 13268 (stamp slams ~396)
      { at: 444, scene: "emote", pose: "pointing", tint: "#34D399", text: "START WITH THE BUYER" }, // "flip it start with the buyer" abs 13290
      { at: 583, scene: "hourglass", tint: "#F59E0B", text: "30-DAY PROOF WINDOW" }, // "give yourself a 30 day proof window" abs 13429
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
    source: "talking-head.mp4",
    from: 490, // "I'm walking you through five Claude side hustles…" (0:16.3)
    // LOOP: ends on "…your fastest path to money." (abs 1606) → replays into the five.
    durationInFrames: 1131, // ~38s
    topic: "5 CLAUDE SIDE HUSTLES",
    hook: "FIVE AI HUSTLES, ZERO CODE",
    context: "Beginner Claude side hustles — no coding needed",
    beats: [
      { at: 8, scene: "doors", labels: ["1", "2", "3", "4", "5"], value: 1, tint: "#D97757", text: "FIVE WAYS IN" }, // "five Claude side hustles" abs 516 — FIVE doors, matching the spoken count
      { at: 180, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "ZERO CODE NEEDED" }, // "no coding background" abs 665
      { at: 255, scene: "reject", badge: "FAKE ENGINEER", tint: "#EF4444", text: "NO PRETENDING" }, // "no pretending you are suddenly a software engineer" abs 745
      { at: 420, scene: "emote", pose: "shrug", tint: "#F59E0B", text: "BUT ZERO EFFORT? NO", emoji: "😅" }, // "zero experience does not mean zero effort" abs 912
      { at: 502, scene: "queue", labels: ["TASTE", "JUDGEMENT", "SELLING"], tint: "#D97757", text: "YOU STILL NEED" }, // "you still need the taste…" abs 992
      { at: 752, scene: "stamp", verdict: "check", badge: "THIS VIDEO", tint: "#34D399", text: "A DECISION GUIDE" }, // "this is the decision walkthrough" abs 1242
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
    source: "talking-head.mp4",
    from: 6564, // "and this works because most people hate research" (3:38.8)
    // LOOP: ends on "…the upside is speed to payment." (abs 7133) → replays into the pain.
    durationInFrames: 584, // ~19s
    topic: "FIRST AI DOLLAR",
    hook: "PEOPLE HATE RESEARCH. CHARGE THEM.",
    context: "Claude research reports = an easy first sale",
    beats: [
      { at: 8, scene: "emote", pose: "facepalm", tint: "#F59E0B", text: "PEOPLE HATE RESEARCH" }, // spoken at open (abs 6570)
      { at: 95, scene: "queue", labels: ["TAB", "TAB", "TAB"], tint: "#D97757", text: "STUCK IN 30 TABS" }, // "they get stuck in tabs" abs 6659
      { at: 230, scene: "funnel", badge: "THE FINDINGS", tint: "#34D399", text: "CLAUDE DOES THE READING" }, // "Claude can handle the heavy reading" abs 6800
      { at: 291, scene: "emote", pose: "pointing", tint: "#F59E0B", text: "YOU MAKE THE CALL" }, // "you still need to make the judgement call" abs 6855
      { at: 361, scene: "check", obj: "coin", verdict: "check", tint: "#34D399", text: "VALUE = THE DECISION" }, // "the value…is in the final decision" abs 6925
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
    source: "talking-head.mp4",
    from: 11163, // "you gotta remember that this product is not just the prompt" (6:12.1)
    // LOOP: ends on "…if anyone actually wants it." (abs 11847) → replays into the pitch.
    durationInFrames: 699, // ~23s
    topic: "SELL SKILLS, NOT PROMPTS",
    hook: "PROMPTS ARE DISPOSABLE",
    context: "Claude skills are sellable, reusable systems",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "NOT JUST A PROMPT" }, // spoken at open (abs 11175)
      { at: 127, scene: "cartridge", badge: "SKILL.MD", tint: "#34D399", text: "A REPEATABLE SYSTEM" }, // "a repeatable way to get a better result" abs 11290
      { at: 227, scene: "reject", badge: "ONE-OFF PROMPT", tint: "#EF4444", text: "DISPOSABLE" }, // "a prompt is usually disposable" abs 11390
      { at: 337, scene: "emote", pose: "pointing", accent: "#E8B84B", tint: "#F59E0B", text: "A MINI OS FOR ONE TASK" }, // "mini operating system for one specific task" abs 11500
      { at: 437, scene: "queue", labels: ["BUILD", "EXPLAIN", "MARKET"], tint: "#D97757", text: "THE REAL WORK" }, // "you'll have to build the thing…" abs 11600
    ],
    // full-anim: the cartridge click-in + the disposable-prompt rejection
    fullscreen: [{ from: 190, to: 330 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];

