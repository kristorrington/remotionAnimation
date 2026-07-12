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
  // n8n-hybrid video (talking-head.mp4) — anchors from whisper words.
  // ==========================================================================
  {
    id: "Short-DontAbandon",
    label: "THE HOOK: about to abandon n8n for agents? the evidence says slow down",
    source: "talking-head.mp4",
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
      { at: 134, scene: "stamp", verdict: "cross", badge: "THE EVIDENCE", tint: "#EF4444", text: "SLOW DOWN" }, // "evidence says slow down" abs 140 (slam ~174)
      // FACE → FULL-SCREEN SCREENSHOT (Kris's pattern): the n8n canvas takes
      // the first span on the ×10 claim ("revenue grew 10-fold" abs 208)
      { at: 196, scene: "receipt", tint: "#34D399", text: "N8N REVENUE ×10", shot: { src: "assets/external/screenshots/n8n-canvas-wide.png", url: "n8n.io", imageW: 1800, imageH: 962, from: { x: 72, y: 38, w: 1656, h: 885 }, to: { x: 0, y: 0, w: 1800, h: 962 }, zoomAt: 10 } },
      // Klarna's FIRST MENTION → Klarna's OWN site (brand rule, July 2026);
      // the Forbes rehire proof lives in Short-KlarnaLesson instead.
      // No emoji here: EmojiPop docks top-right and would touch the wide label.
      { at: 352, scene: "receipt", tint: "#F59E0B", text: "KLARNA REHIRED HUMANS", shot: { src: "assets/external/screenshots/klarna-pr-wide.png", url: "klarna.com/press", imageW: 2152, imageH: 1150, from: { x: 8, y: 48, w: 2062, h: 1102 }, to: { x: 8, y: 50, w: 900, h: 330 }, zoomAt: 14 } },
      { at: 490, scene: "emote", pose: "worried", accent: "#EF4444", tint: "#EF4444", text: "PUSHED TOO HARD" }, // "pushing AI-led customer service too hard" abs 466-557 (ends the receipt before the span)
      { at: 590, scene: "bolt", blockLabel: "WORKFLOW", moduleLabel: "AI", tint: "#34D399", text: "HYBRID STACK" }, // "favor a hybrid stack" abs 607
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
    source: "talking-head.mp4",
    from: 1862, // "Klarna is the cleanest warning…"
    // LOOP: ends on "…did not switch the AI off." (abs 2860) → replays into the warning.
    durationInFrames: 1000, // ~33s
    topic: "THE KLARNA WARNING",
    hook: "AI REPLACED 700 PEOPLE. BRIEFLY.",
    context: "Klarna's AI support story, 2024-2025",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "THE CLEANEST WARNING" }, // spoken at open
      { at: 295, scene: "check", obj: "brain", verdict: "check", tint: "#34D399", text: "WORK OF 700 AGENTS" }, // "roughly 700 customer service agents" abs 2163
      // Klarna's OWN press release as the receipt ("from 11 minutes to around 2" abs 2273 → beat-rel 6)
      { at: 405, scene: "receipt", tint: "#F59E0B", text: "11 MIN → 2", shot: { src: "assets/external/screenshots/klarna-pr-wide.png", url: "klarna.com/press", imageW: 2152, imageH: 1150, from: { x: 8, y: 48, w: 2062, h: 1102 }, to: { x: 40, y: 525, w: 1560, h: 620 }, zoomAt: 4, highlight: { x: 115, y: 838, w: 1260, h: 72 }, highlightAt: 10 } },
      { at: 592, scene: "reject", badge: "QUALITY", tint: "#EF4444", text: "THEN IT BROKE", emoji: "📉" }, // "the quality problem surfaced" abs 2460
      // Forbes receipt as proof of the admission ("over-indexed on efficiency and cost" abs 2591).
      // Lives purely in split view (spans end at 700; the CTA owns the frame
      // from dur−114=886) — fills the band like every receipt.
      { at: 723, scene: "receipt", tint: "#D97757", text: "OVER-INDEXED ON COST", shot: { src: "assets/external/screenshots/forbes-klarna-wide.png", url: "forbes.com", imageW: 1600, imageH: 855, from: { x: 0, y: 20, w: 1600, h: 835 }, to: { x: 0, y: 60, w: 1600, h: 620 }, zoomAt: 14, highlight: { x: 2, y: 148, w: 1396, h: 112 }, highlightAt: 110 } },
      { at: 897, scene: "stamp", verdict: "check", badge: "THE FIX", tint: "#34D399", text: "HUMANS CAME BACK" }, // "began hiring people again" abs 2765 (rides under the CTA)
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
    source: "talking-head.mp4",
    from: 5551, // "McKinsey found 62%…"
    // LOOP: cuts as "so rapid adoption…" begins → replays into the McKinsey stat.
    durationInFrames: 990, // ~33s
    topic: "AGENTS: HYPE VS SCALE",
    hook: "EVERYONE'S TESTING. FEW SHIP.",
    context: "McKinsey + Gartner on AI agents in business",
    beats: [
      { at: 8, scene: "check", obj: "brain", verdict: "warn", tint: "#D97757", text: "62% ARE TESTING" }, // "62% of organizations" abs 5579
      { at: 178, scene: "check", obj: "gauge", verdict: "cross", tint: "#EF4444", text: "ONLY 23% SCALED" }, // "only 23% reported scaling" abs 5735
      { at: 330, scene: "emote", pose: "shrug", tint: "#F59E0B", text: "A SNAPSHOT, NOT FATE", emoji: "🤷" }, // "a snapshot, not a permanent failure rate" abs 5888
      { at: 519, scene: "queue", labels: ["RELIABILITY", "GOVERNANCE", "COST"], tint: "#EF4444", text: "WHERE IT HURTS" }, // "reliability, governance and cost" abs 6076
      // Gartner receipt ("40% of enterprise applications" abs 6209 → beat-rel 6):
      // opens zoomed on the "40%", settles on the FULL banner headline — the
      // card is sized to the banner so no line ever slices at an edge.
      { at: 652, scene: "receipt", tint: "#34D399", text: "40% ADOPT BY 2026", shot: { src: "assets/external/screenshots/gartner-40pct-agents-2026.png", url: "gartner.com/newsroom", imageW: 2000, imageH: 600, from: { x: 480, y: 0, w: 1040, h: 312 }, to: { x: 0, y: 0, w: 2000, h: 600 }, zoomAt: 4, highlight: { x: 765, y: 120, w: 230, h: 105 }, highlightAt: 10 } },
      { at: 864, scene: "stamp", verdict: "cross", badge: "GARTNER", tint: "#EF4444", text: "40% CANCELLED BY 2027" }, // "over 40%… cancelled" abs 6421 (slam ~904)
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
    source: "talking-head.mp4",
    from: 7218, // "For builders, this turns it into a simple decision rule."
    // LOOP: ends on "…retry and escalate." (abs 8270) → replays into the rule.
    durationInFrames: 1050, // ~35s
    topic: "WORKFLOW OR AGENT?",
    hook: "ONE RULE DECIDES IT",
    context: "When to use n8n workflows vs AI agents",
    beats: [
      { at: 8, scene: "emote", pose: "pointing", tint: "#D97757", text: "ONE DECISION RULE" }, // spoken at open
      // The n8n canvas IS the deterministic workflow ("use a deterministic workflow when…" abs 7325)
      { at: 101, scene: "receipt", tint: "#34D399", text: "EXPENSIVE MISTAKES? WORKFLOW", shot: { src: "assets/external/screenshots/n8n-canvas-wide.png", url: "n8n.io", imageW: 1800, imageH: 962, from: { x: 100, y: 52, w: 1620, h: 866 }, to: { x: 0, y: 0, w: 1800, h: 962 }, zoomAt: 10 } },
      { at: 240, scene: "queue", labels: ["PAYMENTS", "CHANGES", "APPROVALS", "COMPLIANCE"], tint: "#EF4444", text: "NO IMPROVISING" }, // the four named no-go areas abs 7463→7538
      { at: 477, scene: "check", obj: "brain", verdict: "check", tint: "#D97757", text: "MESSY + BOUNDED? AGENT" }, // "use an agent when the input is messy" abs 7701
      { at: 606, scene: "funnel", badge: "DECISION", tint: "#F59E0B", text: "BOUNDED JOBS ONLY" }, // "classification, document interpretation…" abs 7830
      { at: 801, scene: "bolt", blockLabel: "WORKFLOW", moduleLabel: "AGENT", tint: "#34D399", text: "CONNECT THE TWO" }, // "then connect the two" abs 8019
      { at: 940, scene: "stamp", verdict: "check", badge: "WORKFLOW", tint: "#34D399", text: "VALIDATE → ESCALATE" }, // "let the workflow validate… escalate" abs 8164 (slam ~980)
    ],
    // full-anim: the no-improvising queue + the connect payoff — the canvas
    // receipt at 101 stays in the split band
    fullscreen: [{ from: 240, to: 380 }, { from: 780, to: 900 }],
    outro: "FOLLOW FOR MORE",
    music: "music/tension.MP3",
    style: "paper",
  },
];

