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
  // ChatGPT Work video (talking-head.mp4) — anchors from whisper words.
  // ==========================================================================
  {
    id: "Short-WorkLaunch",
    label: "THE HOOK: ChatGPT Work explained — one window, Codex inside, the catches",
    source: "talking-head.mp4",
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
      { at: 185, scene: "bolt", blockLabel: "CHATGPT", moduleLabel: "CODEX", tint: "#34D399", text: "CODEX, FOLDED IN" }, // "folds Codex technology into ChatGPT" (190)
      // The directory receipt — brand first-mention shot is OpenAI's own page
      { at: 300, scene: "receipt", tint: "#F59E0B", text: "EVERY APP, ONE DIRECTORY", shot: { src: "assets/external/screenshots/openai-plugins-grid.png", url: "openai.com/business/plugins", imageW: 2880, imageH: 5500, from: { x: 480, y: 1600, w: 1920, h: 1026 }, to: { x: 0, y: 60, w: 2880, h: 1539 }, zoomAt: 8 } },
      { at: 440, scene: "stamp", verdict: "check", badge: "THE PROMISE", tint: "#34D399", text: "FEWER TABS" }, // "fewer tabs" (420)
      { at: 616, scene: "queue", labels: ["PRICING ?", "ACCESS ?", "FILES ?"], tint: "#EF4444", text: "THE CATCHES" }, // "pricing is unclear, access is uneven" (616)
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
    source: "talking-head.mp4",
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
      { at: 178, scene: "queue", labels: ["QUOTA RESETS", "REDESIGN CONFUSION"], tint: "#F59E0B", text: "JULY 11 NOISE" }, // "quota resets" (6829)
      { at: 342, scene: "check", obj: "bug", verdict: "cross", tint: "#EF4444", text: "FILES DELETED?" }, // "two Sol incidents… deleted" (6993)
      { at: 511, scene: "stamp", verdict: "cross", badge: "OPENAI", tint: "#D97757", text: "NOT CONFIRMED" }, // "official OpenAI acknowledgment" (7162)
      { at: 640, scene: "emote", pose: "pointing", accent: "#34D399", tint: "#34D399", text: "CAUTION, NOT PANIC" }, // "the right response is caution" (7291)
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
    source: "talking-head.mp4",
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
      { at: 100, scene: "reject", badge: "NO LIMITS", tint: "#EF4444", text: "TRUST NEEDS LIMITS", logo: "chatgpt" }, // "a trustworthy agent needs limits" (7746)
      { at: 214, scene: "queue", labels: ["FILE SAFETY", "PERMISSIONS", "RECOVERY"], tint: "#F59E0B", text: "WHAT DEMOS HIDE" }, // "focused on models… polished demos" (7860)
      { at: 464, scene: "migrate", tint: "#D97757", text: "MY RULE" }, // "do not run agentic tasks…" (8110)
      { at: 622, scene: "stamp", verdict: "check", badge: "THE RULE", tint: "#34D399", text: "BACK UP FIRST" }, // "…lacks a backup" (8268)
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
    source: "talking-head.mp4",
    from: 2860, // "GPT-5.6 launched with three named models…"
    // LOOP: ends on "…for a public chatbot release." → replays into the models.
    durationInFrames: 940, // ~31s
    topic: "GPT-5.6: SOL·TERRA·LUNA",
    hook: "TRUMP DELAYED GPT-5.6",
    context: "GPT-5.6 launched July 9 after a security review",
    beats: [
      { at: 8, scene: "elevator", labels: ["LUNA", "TERRA", "SOL"], value: 2, tint: "#D97757", text: "THREE NEW MODELS", logo: "chatgpt" }, // "Sol, Terra, and Luna" (2904)
      { at: 260, scene: "check", obj: "gauge", verdict: "warn", tint: "#F59E0B", text: "ROLES UNCLEAR" }, // "does not define those roles clearly" (3120)
      // TechSpot headline receipt — split-band card, zooms out from the headline
      { at: 390, scene: "receipt", tint: "#C15F3C", text: "STAGGERED RELEASE", shot: { src: "assets/external/screenshots/techspot-staggered-wide.png", url: "techspot.com", imageW: 2900, imageH: 1550, from: { x: 300, y: 120, w: 1740, h: 930 }, to: { x: 116, y: 62, w: 2668, h: 1426 }, zoomAt: 8, highlight: { x: 300, y: 150, w: 1715, h: 340 }, highlightAt: 14 } }, // "the release got delayed" (3250)
      { at: 540, scene: "check", obj: "shield", verdict: "cross", tint: "#EF4444", text: "ACCESS RESTRICTED" }, // "Trump administration restricted access" (3387)
      { at: 730, scene: "queue", labels: ["CYBER", "BIO", "MILITARY"], tint: "#F59E0B", text: "THE REVIEW SCOPE" }, // "cyber, biological, and military risk" (3590)
    ],
    // full-anim: the restricted-shield beat
    fullscreen: [{ from: 520, to: 700 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
