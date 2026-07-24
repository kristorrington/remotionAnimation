// ============================================================================
// EDIT MAP — the central timeline config for a model-review edit (CLAUDE.md §15,
// AGENTS.md §12). One typed row per beat; wire `from`/`to` to sentence-level
// whisper timestamps so timings move without touching components. The <Slug>Video
// overlay maps rows -> editkit components + SoundCues.
//
// ADJUST THESE FIRST — the "easiest config values" (all one-liners):
// ============================================================================

export const PALETTE = {
  opus: "#D97757", // Opus 5  = terracotta / orange (Claude brand accent)
  fable: "#8A7CA8", // Fable 5 = restrained muted purple (desaturated, §13.8)
  sonnet: "#6E93BD", // Sonnet  = slate blue
  ink: "#1F1E1D",
  paper: "#F0EEE6",
  win: "#4FA98A",
  cost: "#C9913D",
  danger: "#C65B52",
} as const;

export const MUSIC_VOL = { main: 0.075, caveat: 0.055 } as const; // 20-30 dB under VO
export const SFX_VOL = 0.42; // base one-shot level (sits under the boosted VO)
export const ZOOM_INTENSITY = 1; // multiplier on every CameraPunchIn amount
export const ANIM_SPEED = 1; // multiplier on entrance durations (1 = house default)

// ── the map ────────────────────────────────────────────────────────────────
export type EditEffect =
  | "cut" // direct cut (the default — no effect)
  | "punchIn" // CameraPunchIn on the footage
  | "kinetic" // KineticText phrase
  | "modelCompare" // ModelComparison
  | "priceCompare" // PriceComparison
  | "benchmark" // BenchmarkBar
  | "effort" // EffortSelector
  | "decision" // DecisionFramework
  | "transition"; // SectionTransition only

export type EditRow = {
  from: number; // start frame (sec x 30) — wire to a whisper word
  to: number; // end frame
  effect: EditEffect;
  text?: string; // exact transcript wording only — never invented
  visual?: string; // asset/component key the overlay switches on
  sound?: string; // SFX key in components/Sfx.tsx (e.g. "softWhoosh")
  zoom?: "emphasis" | "strong" | number; // punchIn level
  transition?: "evidence" | "counterpoint" | "section" | "verdict";
  note?: string; // director's note (not rendered)
};

// EXAMPLE map — the Opus-5-vs-Fable-5 skeleton (frames are placeholders until
// the transcript lands; replace `from`/`to` with whisper timestamps). Shows the
// intended shape: hook (3 beats) -> evidence -> effort -> safety -> verdict.
export const EDIT_MAP: EditRow[] = [
  { from: 30, to: 120, effect: "kinetic", text: "OPUS 5 IS HERE", sound: "softWhoosh", note: "hook beat 1 — establish the model" },
  { from: 120, to: 240, effect: "modelCompare", visual: "opus-vs-fable", sound: "lowImpact", note: "hook beat 1b — two competitors" },
  { from: 240, to: 360, effect: "priceCompare", text: "HALF THE PRICE", sound: "confirmation", note: "hook beat 2 — the price gap" },
  { from: 360, to: 470, effect: "kinetic", text: "STILL WORTH IT?", sound: "shortRiser", note: "hook beat 3 — the open question" },
  { from: 470, to: 560, effect: "punchIn", zoom: "strong", note: "land the question on the face" },
  { from: 900, to: 1080, effect: "benchmark", visual: "coding-bench", sound: "confirmation", note: "a major benchmark result" },
  { from: 1400, to: 1560, effect: "effort", visual: "effort-dial", sound: "interfaceClick", note: "effort/cost dial" },
  { from: 1800, to: 1820, effect: "transition", transition: "counterpoint", note: "into the safety caveat" },
  { from: 1820, to: 2100, effect: "kinetic", text: "SAFETY FIRST", sound: "warningPulse", note: "safety section — quieter" },
  { from: 2400, to: 2420, effect: "transition", transition: "verdict", note: "reset before the recommendation" },
  { from: 2420, to: 2700, effect: "decision", visual: "sonnet-opus-fable", sound: "confirmation", note: "final 3-column recommendation" },
];
