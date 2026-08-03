import { ShortSpec } from "./types";

// ============================================================================
// THE SHORTS — CURRENT video only (previous videos live in archivedSpecs.ts).
// Gemini Robotics 2 breakdown (talking-head-030826.mp4, 2026-08-03; re-timed
// 1.06× — captions-030826.ts is on the same clock). `from` = start frame in the
// source footage (sec × 30). `beats[].at` is clip-local, anchored to the WHISPER
// word times. FOOTAGE-FIRST: every short OPENS on the FACE hook, then the
// OFFICIAL DeepMind clips ride the top SPLIT band (§10.7 — they fill the top
// half, no dead space); the fullscreen SPANS own the animation payoff beats
// (emote/stamp/reject) so the frame is always full. `text` is a LABEL (captions
// carry the speech). CLAUDE.md §9/§10.
// ============================================================================
const CLIP = "assets/external/clips";

export const SHORTS: ShortSpec[] = [
  {
    id: "Short-LightbulbTest",
    label: "The lightbulb unscrew is the hardest dexterity demo in the reel",
    source: "talking-head-030826.mp4",
    from: 3164, // "The lightbulb task is probably the most interesting though…"
    // LOOP: ends "…different from simply picking up a box." → replays into hook.
    durationInFrames: 840, // 28s
    topic: "THE HARDEST TEST?",
    hook: "THE HARDEST THING IN ROBOTICS.",
    context: "Google's Gemini Robotics 2 unscrews a bulb",
    beats: [
      { at: 8, scene: "clip", tint: "#6E93BD", text: "THE DEMO", clip: { src: `${CLIP}/rob2-lightbulb.mp4` } }, // "the lightbulb task is the most interesting" (band)
      { at: 223, scene: "clip", tint: "#6E93BD", text: "GRIP · TURN · RELEASE", clip: { src: `${CLIP}/rob2-lightbulb.mp4` } }, // "grip round & fragile… reposition as it turns" (band)
      { at: 503, scene: "emote", pose: "thinking", tint: "#C9913D", text: "NOT PICK & PLACE" }, // span; "very different from picking up a box" (3808 → ~644)
      { at: 720, scene: "stamp", verdict: "check", badge: "DEXTERITY", tint: "#4FA98A", text: "HANDS ARE HARD" }, // loop close
    ],
    fullscreen: [{ from: 490, to: 690 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-OneBrain",
    label: "One unified model runs the whole robot body — the real story",
    source: "talking-head-030826.mp4",
    from: 1083, // "one unified AI system can control the robot's entire body…"
    // LOOP: ends "…reduces those handoffs through one system." → replays.
    durationInFrames: 1000, // ~33s
    topic: "ONE AI, WHOLE BODY?",
    hook: "ONE AI RUNS THE ROBOT'S WHOLE BODY.",
    context: "Gemini Robotics 2 = Google's new robot AI",
    beats: [
      { at: 8, scene: "clip", tint: "#6E93BD", text: "THE CLAIM", clip: { src: `${CLIP}/rob2-extra-wholebody.mp4` } }, // "one unified AI system controls the entire body" (band)
      { at: 223, scene: "clip", tint: "#6E93BD", text: "ARMS · HANDS · BALANCE", clip: { src: `${CLIP}/rob2-extra-wholebody.mp4` } }, // "the arms, the hands, the movements, the balance" (band)
      { at: 560, scene: "stack", tint: "#C9913D", text: "EVERY HANDOFF = RISK" }, // span; "every handoff creates another place it can go wrong" (1777 → ~694)
      { at: 820, scene: "stamp", verdict: "check", badge: "ONE SYSTEM", tint: "#4FA98A", text: "FEWER HANDOFFS" }, // loop close
    ],
    fullscreen: [{ from: 547, to: 760 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-ApolloDuo",
    label: "Two robots tidy one garage — but is it real coordination?",
    source: "talking-head-030826.mp4",
    from: 5016, // "two robots operating in the same garage…"
    // LOOP: ends "…each running its own separate copy." → replays.
    durationInFrames: 900, // 30s
    topic: "A HIVE MIND?",
    hook: "TWO ROBOTS. ONE GARAGE.",
    context: "Apollo & Duo, both run Gemini Robotics 2",
    beats: [
      { at: 8, scene: "clip", tint: "#4FA98A", text: "THE GARAGE", clip: { src: `${CLIP}/rob2-garage.mp4` } }, // "two robots operating in the same garage" (band)
      { at: 223, scene: "clip", tint: "#4FA98A", text: "SAME SPACE, SAME TIME", clip: { src: `${CLIP}/rob2-garage.mp4` } }, // "Apollo and Duo tidy and place tools at the same time" (band)
      { at: 503, scene: "emote", pose: "confused", tint: "#6E93BD", text: "SEPARATE COPIES" }, // span; "each robot runs its own separate copy" (5357 → ~341)
      { at: 730, scene: "stamp", verdict: "warn", badge: "NO HIVE MIND", tint: "#C9913D", text: "NOT PROVEN LINKED" }, // loop close
    ],
    fullscreen: [{ from: 490, to: 700 }],
    outro: "FULL BREAKDOWN ON THE CHANNEL",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-MissingProof",
    label: "The four proofs Google's robot demo quietly skips",
    source: "talking-head-030826.mp4",
    from: 7385, // "Google hasn't published success rates…"
    // LOOP: ends "…no comparison against Optimus, Figure or 1X." → replays.
    durationInFrames: 820, // ~27s
    topic: "WHAT'S MISSING?",
    hook: "GOOGLE'S ROBOT DEMO HIDES THIS.",
    context: "The proof Gemini Robotics 2 skips",
    beats: [
      { at: 8, scene: "clip", tint: "#C65B52", text: "THE HIGHLIGHT REEL", clip: { src: `${CLIP}/rob2-extra-sixgrid.mp4` } }, // "Google hasn't published success rates" (band)
      { at: 213, scene: "reject", badge: "SUCCESS RATES", tint: "#C65B52", text: "NONE PUBLISHED" }, // span; "we don't know 9 in 10 or 1 in 10" (7423+)
      { at: 470, scene: "emote", pose: "worried", tint: "#C9913D", text: "NO INDEPENDENT TEST" }, // "no independent researcher attesting it" (7686 → ~298)
      { at: 640, scene: "stamp", verdict: "cross", badge: "vs OPTIMUS?", tint: "#C65B52", text: "NO COMPARISON" }, // "no comparison vs Optimus, Figure, 1X" (loop close)
    ],
    fullscreen: [{ from: 200, to: 420 }],
    outro: "FOLLOW FOR FACT-CHECKED AI NEWS",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
  {
    id: "Short-DemoNotProduct",
    label: "Is Gemini Robotics 2 a real breakthrough? Yes — but not the reel",
    source: "talking-head-030826.mp4",
    from: 8035, // "So is Gemini Robotics 2 actually a breakthrough?"
    // LOOP: ends "…coordinating the full body — genuinely impressive." → replays.
    durationInFrames: 900, // 30s
    topic: "REAL BREAKTHROUGH?",
    hook: "IS THIS A REAL BREAKTHROUGH?",
    context: "Gemini Robotics 2 — hype vs reality",
    beats: [
      { at: 8, scene: "clip", tint: "#4FA98A", text: "THE VERDICT", clip: { src: `${CLIP}/rob2-hero.mp4` } }, // "so is it actually a breakthrough?" (band)
      { at: 223, scene: "clip", tint: "#4FA98A", text: "YES — NOT THE REEL", clip: { src: `${CLIP}/rob2-extra-wholebody.mp4` } }, // "the answer is yes, but not for the reason the reel suggests" (band)
      { at: 503, scene: "emote", pose: "pointing", tint: "#6E93BD", text: "ONE BRAIN, FULL BODY" }, // span; "one AI system coordinating the full body" (8458 → ~423)
      { at: 730, scene: "stamp", verdict: "warn", badge: "DEMO ≠ PRODUCT", tint: "#C9913D", text: "NOT PROVEN YET" }, // loop close
    ],
    fullscreen: [{ from: 490, to: 700 }],
    outro: "FOLLOW FOR THE WEEKLY BREAKDOWN",
    music: "music/tension.MP3",
    voice: 1.2,
    style: "paper",
  },
];
