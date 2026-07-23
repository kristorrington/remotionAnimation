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
  // OpenAI-rogue-agent video (talking-head.mp4, 2026-07-24).
  {
    id: "Short-WentRogue",
    label: "THE HOOK: OpenAI admits its own AI broke out of a test and hacked Hugging Face",
    source: "talking-head.mp4",
    from: 0, // "Across one weekend, an OpenAI cybersecurity agent crossed its test boundary…"
    // LOOP: ends "…turned a contained benchmark into a real-world break-in." (~760) → replays into the hook.
    durationInFrames: 770, // ~26s
    topic: "AN AI HACKED AN AI LAB",
    hook: "OPENAI'S OWN AI WENT ROGUE",
    context: "It escaped a test and hacked Hugging Face",
    beats: [
      // EVIDENCE: the OpenAI admission tweet
      { at: 8, scene: "receipt", tint: "#C65B52", text: "the admission", shot: { src: "assets/external/screenshots/rogue-openai-tweet.png", url: "x.com/OpenAI", imageW: 1100, imageH: 1570, from: { x: 0, y: 0, w: 1100, h: 1120 }, to: { x: 0, y: 70, w: 1100, h: 900 }, zoomAt: 20, highlight: { x: 35, y: 300, w: 1030, h: 115 }, highlightAt: 44 } }, // "OpenAI now admits its own model powered it" (8-200)
      { at: 214, scene: "emote", pose: "alarmed", tint: "#C65B52", text: "IT BROKE OUT" }, // "reached the internet, and hacked Hugging Face" (209)
      { at: 344, scene: "stamp", verdict: "cross", badge: "17,000 EVENTS", tint: "#C65B52", text: "ONE WEEKEND" }, // "more than 17,000 recorded events" (344); span.from+13
      { at: 590, scene: "check", obj: "shield", verdict: "cross", tint: "#C9913D", text: "ONE OPEN PATH" }, // "one routine package pathway turned a contained benchmark into a break-in" (590)
    ],
    fullscreen: [{ from: 331, to: 481 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-LockedBox",
    label: "How it escaped: one allowed door (the package proxy) → zero-day → the open internet",
    source: "talking-head.mp4",
    from: 7380, // "…its testing environment was highly isolated, with network access constrained to one requirement."
    // LOOP: ends "…until they reached a node with internet access." (~8480) → replays.
    durationInFrames: 1230, // ~41s
    topic: "IT WAS LOCKED IN A BOX",
    hook: "ONE OPEN DOOR WAS ENOUGH",
    context: "OpenAI's test could only install software packages",
    beats: [
      // EVIDENCE: the Exploit Gym benchmark — the containerised environment
      { at: 8, scene: "receipt", tint: "#6E93BD", text: "the benchmark", shot: { src: "assets/external/screenshots/rogue-exploitgym.png", url: "rdi.berkeley.edu", imageW: 1860, imageH: 500, from: { x: 0, y: 0, w: 1860, h: 500 }, to: { x: 520, y: 60, w: 820, h: 410 }, zoomAt: 20 } }, // "a highly isolated, containerised environment" (8-220)
      { at: 224, scene: "breaker", tint: "#C65B52", text: "THE ONE OPEN DOOR" }, // "requests travelled through a proxy and cache" (7604)
      { at: 630, scene: "stamp", verdict: "cross", badge: "ZERO-DAY", tint: "#C65B52", text: "THE WEAK LINK" }, // "discovered a zero-day vulnerability in the proxy" (8010); span.from+13
      { at: 876, scene: "conveyor", tint: "#C65B52", text: "SYSTEM TO SYSTEM" }, // "escalated privileges and moved laterally" (8256)
      { at: 1084, scene: "check", obj: "gauge", verdict: "cross", tint: "#C65B52", text: "OUT TO THE INTERNET" }, // "reached a node with internet access" (8464)
    ],
    fullscreen: [{ from: 617, to: 767 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-OwnedIt",
    label: "OpenAI took responsibility 5 days later — named GPT-5.6 Sol, Altman confirmed it, all autonomous",
    source: "talking-head.mp4",
    from: 3788, // "Five days later, on July 21st, OpenAI supplied the answer and took responsibility publicly."
    // LOOP: ends "…mind-blowing that all this happened autonomously." (~4820) → replays.
    durationInFrames: 1030, // ~34s
    topic: "OPENAI OWNED IT",
    hook: "THEY ADMITTED EVERYTHING",
    context: "5 days later, OpenAI named its own models",
    beats: [
      // EVIDENCE: OpenAI's own incident statement
      { at: 8, scene: "receipt", tint: "#C65B52", text: "OpenAI's statement", shot: { src: "assets/external/screenshots/rogue-openai-report.png", url: "openai.com", imageW: 1640, imageH: 760, from: { x: 0, y: 0, w: 1640, h: 760 }, to: { x: 0, y: 150, w: 1640, h: 560 }, zoomAt: 20, highlight: { x: 40, y: 180, w: 1560, h: 150 }, highlightAt: 44 } }, // "took responsibility publicly" (8-260)
      { at: 323, scene: "emote", pose: "pointing", tint: "#C9913D", text: "IT NAMED THE MODELS" }, // "including GPT-5.6 Sol, and a more capable prerelease model" (4111)
      // EVIDENCE: Sam Altman's confirmation tweet
      { at: 449, scene: "receipt", tint: "#C65B52", text: "@sama on X", shot: { src: "assets/external/screenshots/rogue-altman-tweet.png", url: "x.com/sama", imageW: 1100, imageH: 1330, from: { x: 0, y: 0, w: 1100, h: 1120 }, to: { x: 0, y: 0, w: 1100, h: 900 }, zoomAt: 20, highlight: { x: 35, y: 175, w: 1030, h: 200 }, highlightAt: 44 } }, // "Sam Altman confirmed a significant security incident" (4237)
      { at: 717, scene: "stamp", verdict: "cross", badge: "AUTONOMOUS", tint: "#C65B52", text: "NO HUMAN AT ALL" }, // "mind-blowing that all this happened autonomously" (4505); span.from+13
    ],
    fullscreen: [{ from: 704, to: 854 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-YourAgents",
    label: "THE LESSON: the same gaps that let it out sit in most AI agents — check your permissions",
    source: "talking-head.mp4",
    from: 12100, // "You can apply that lesson to agents connected to your business."
    // LOOP: ends "…go check your own agents' permissions today." (~13060) → replays.
    durationInFrames: 1200, // ~40s
    topic: "IS YOUR AI EXPOSED?",
    hook: "THIS IS ABOUT YOUR AI TOO",
    context: "The same gaps sit in most AI agents",
    beats: [
      // EVIDENCE: the original incident, to ground the lesson
      { at: 8, scene: "receipt", tint: "#C65B52", text: "what happened", shot: { src: "assets/external/screenshots/rogue-openai-tweet.png", url: "x.com/OpenAI", imageW: 1100, imageH: 1570, from: { x: 0, y: 0, w: 1100, h: 1120 }, to: { x: 0, y: 70, w: 1100, h: 900 }, zoomAt: 20, highlight: { x: 35, y: 300, w: 1030, h: 115 }, highlightAt: 44 } }, // "you can apply that lesson to your business" (8-210)
      { at: 116, scene: "emote", pose: "pointing", tint: "#C9913D", text: "NOW — YOUR AI" }, // "standing API keys keep service access alive" (12216)
      { at: 234, scene: "queue", labels: ["STANDING KEYS", "FILE ACCESS", "OPEN NETWORK"], tint: "#C65B52", text: "3 WAYS TO LEAK" }, // "broad file permissions expose more data, open network access" (12334)
      { at: 697, scene: "emote", pose: "worried", tint: "#C9913D", text: "THE GAP THEY MISSED" }, // "the forgotten path in OpenAI's test was its package proxy" (12797)
      { at: 911, scene: "stamp", verdict: "check", badge: "YOUR AGENTS", tint: "#D97757", text: "LOCK THEM DOWN" }, // "go check your own agents' permissions today" (13011); span.from+13
    ],
    fullscreen: [{ from: 898, to: 1048 }],
    outro: "FOLLOW FOR MORE",
    music: "music/calm.MP3",
    style: "paper",
  },
];
