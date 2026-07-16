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
  // 7 GitHub repos video (talking-head.mp4, 2026-07-17).
  // ==========================================================================
  {
    id: "Short-SevenRepos",
    label: "THE HOOK: the full 7-repo recap — pick by bottleneck",
    source: "talking-head.mp4",
    from: 6345, // "So, in conclusion, Awesome Claude Code helps you discover tools…"
    // LOOP: ends right after "…the bottleneck you already have." (abs 7245)
    // → replays into the recap list.
    durationInFrames: 907, // ~30s
    topic: "THE 7-REPO STACK",
    hook: "7 REPOS THAT 10X CLAUDE CODE",
    hookAlt: "MY CLAUDE CODE STARTER PACK", // A/B → Short-SevenRepos-B
    context: "GitHub repos for Claude Code, one job each",
    beats: [
      { at: 8, scene: "emote", pose: "thinking", tint: "#D97757", text: "SAVE THIS LIST" }, // "in conclusion… helps you discover tools" (6351-6450)
      // EVIDENCE EARLY: the directory index itself
      { at: 130, scene: "receipt", tint: "#4FA98A", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/awesome-toc-wide.png", url: "github.com/hesreallyhim/awesome-claude-code", imageW: 1400, imageH: 748, from: { x: 40, y: 30, w: 800, h: 400 }, to: { x: 20, y: 15, w: 1360, h: 680 }, zoomAt: 8 } }, // "Anthropic Skills keeps instructions organised" (6475-6548); holds ~7s
      { at: 345, scene: "conveyor", labels: ["7 REPOS"], tint: "#C9913D", text: "ONE JOB EACH" }, // "Everything Claude Code… library (6688-6774)"; span.from+13
      { at: 658, scene: "receipt", tint: "#E8B84B", text: "LAST ONE IN", shot: { src: "assets/external/screenshots/superpowers-top-wide.png", url: "github.com/obra/superpowers", imageW: 3840, imageH: 2052, from: { x: 2300, y: 200, w: 1300, h: 694 }, to: { x: 1980, y: 100, w: 1800, h: 900 }, zoomAt: 8 } }, // "Superpowers improves the decisions" (7009-7127); holds ~4.5s
    ],
    // full-anim: the seven-repos belt
    fullscreen: [{ from: 332, to: 490 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-TagClaude",
    label: "Claude Code Action: tag @claude on an issue, get a proposed fix",
    source: "talking-head.mp4",
    from: 3681, // "Fifth is Claude Code Action."
    // LOOP: ends right after "…already runs your development workflow." (abs 4479)
    durationInFrames: 798, // ~27s
    topic: "CLAUDE IN YOUR PRs",
    hook: "TAG @CLAUDE ON A BUG",
    hookAlt: "CLAUDE LIVES IN GITHUB NOW", // A/B → Short-TagClaude-B
    context: "Claude Code Action = official GitHub action",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "THE OFFICIAL PLUG-IN" }, // "Fifth is Claude Code Action" (3693-3779)
      // EVIDENCE EARLY: the README hero — the @claude conversation
      { at: 128, scene: "receipt", tint: "#4FA98A", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/cc-action-hero-wide.png", url: "github.com/anthropics/claude-code-action", imageW: 1900, imageH: 1016, from: { x: 480, y: 260, w: 900, h: 481 }, to: { x: 350, y: 130, w: 1360, h: 680 }, zoomAt: 8 } }, // "brings Claude into GitHub issues and pull requests" (3787-3877); holds ~7.7s
      { at: 371, scene: "check", obj: "shield", verdict: "check", tint: "#6E93BD", text: "FILES THE FIX" }, // "investigate the issue and prepare a proposed fix" (4117-4238); span.from+13
      { at: 620, scene: "emote", pose: "celebrate", tint: "#4FA98A", text: "ALL IN ONE THREAD" }, // "task, code changes and discussion all in one place" (4247-4373)
    ],
    // full-anim: the fix-check gag
    fullscreen: [{ from: 358, to: 520 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-ClaudeMem",
    label: "Claude-Mem: searchable memory across sessions — no more re-explaining",
    source: "talking-head.mp4",
    from: 4479, // "Sixth is Claude-Mem."
    // LOOP: ends right after "…assumptions can become outdated." (abs 5373)
    durationInFrames: 894, // ~30s
    topic: "CLAUDE WITH A MEMORY",
    hook: "CLAUDE FORGETS EVERYTHING",
    hookAlt: "STOP RE-EXPLAINING YOUR PROJECT", // A/B → Short-ClaudeMem-B
    context: "Claude-Mem = memory across coding sessions",
    beats: [
      { at: 8, scene: "emote", pose: "confused", tint: "#C9913D", text: "GROUNDHOG DAY?" }, // "Sixth is Claude-Mem" (4485-4553)
      // EVIDENCE EARLY: the tagline + #1 Repository Of The Day
      { at: 128, scene: "receipt", tint: "#4FA98A", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/claude-mem-hero-wide.png", url: "github.com/thedotmack/claude-mem", imageW: 1900, imageH: 1016, from: { x: 380, y: 20, w: 1100, h: 550 }, to: { x: 300, y: 10, w: 1440, h: 720 }, zoomAt: 8 } }, // "searchable memory across separate coding sessions" (4561-4671); holds ~7.9s
      { at: 385, scene: "check", obj: "shield", verdict: "check", tint: "#6E93BD", text: "IT REMEMBERS" }, // "reopen the project two days later" (4866-4911); span.from+13
      { at: 736, scene: "stamp", verdict: "warn", badge: "OLD NOTES", tint: "#EF9F76", text: "TRUST, THEN VERIFY" }, // "review the old context… assumptions become outdated" (5236-5373)
    ],
    // full-anim: the memory check gag
    fullscreen: [{ from: 372, to: 540 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
  {
    id: "Short-PartsStore",
    label: "Everything Claude Code: 38 agents, 156 skills — treat it like a parts store",
    source: "talking-head.mp4",
    from: 2775, // "Fourth is Everything Claude Code."
    // LOOP: ends right after "…a package you install all at once." (abs 3693)
    durationInFrames: 918, // ~31s
    topic: "THE 156-SKILL LIBRARY",
    hook: "156 SKILLS IN ONE REPO",
    hookAlt: "THE CLAUDE CODE MEGA PACK", // A/B → Short-PartsStore-B
    context: "Everything Claude Code = agents + skills library",
    beats: [
      { at: 8, scene: "emote", pose: "alarmed", tint: "#D97757", text: "THE MEGA PACK" }, // "Fourth is Everything Claude Code" (2781-2866)
      // EVIDENCE EARLY: the skills table IS the claim
      { at: 130, scene: "receipt", tint: "#4FA98A", text: "THE RECEIPT", shot: { src: "assets/external/screenshots/ecc-skills-table-wide.png", url: "github.com/affaan-m/everything-claude-code", imageW: 1760, imageH: 941, from: { x: 40, y: 20, w: 1000, h: 500 }, to: { x: 20, y: 10, w: 1720, h: 860 }, zoomAt: 8 } }, // "claims 38 agents and 156 skills" (2873-2980); holds ~7.4s
      { at: 453, scene: "funnel", tint: "#6E93BD", text: "CHERRY-PICK IT" }, // "pull out one planning agent or a useful testing rule" (3234-3331); span.from+13
      { at: 667, scene: "stack", tint: "#C9913D", text: "INSTALL-ALL BACKFIRES" }, // "duplicated instructions and unnecessary complexity" (3448-3547)
    ],
    // full-anim: the cherry-pick funnel gag
    fullscreen: [{ from: 440, to: 610 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];
