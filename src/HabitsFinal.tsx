import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { HabitsVideo, HABITS_WINDOWS, HABITS_FULLSCREEN, HABITS_EXTRA_CUTS } from "./HabitsVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Chapter markers — the hook, the five habits, the payoff.
const CHAPTERS: Chapter[] = [
  { label: "The Setup", from: 0 },
  { label: "1 · The Brief", from: 1480 },
  { label: "2 · The Checkpoint", from: 6424 },
  { label: "3 · The Evidence", from: 10603 },
  { label: "4 · The Correction", from: 14714 },
  { label: "5 · Earned Autonomy", from: 18988 },
  { label: "The Payoff", from: 23493 },
];

// Final combined cut: talking head + the habits subject-scene/receipt track +
// per-span PiP. Face-first punch-in open; first cover (the interns) at ~90f.
// §15 model-review edit grammar: selective CameraPunchIns, the four named
// SectionTransitions at chapter turns, pull-left on fullscreen-span starts.
const FOOTAGE = "talking-head.mp4"; // 5-habits recording (2026-07-26)

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...HABITS_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...HABITS_FULLSCREEN].sort((a, b) => a.from - b.from);
const PIP_SEGMENTS: { from: number; to: number }[] = [];
for (const s of SPANS) {
  let cursor = s.from;
  for (const f of FULL) {
    if (f.to <= cursor || f.from >= s.to) continue;
    if (f.from - cursor >= PIP_MIN) PIP_SEGMENTS.push({ from: cursor, to: f.from });
    cursor = Math.max(cursor, f.to);
  }
  if (s.to - cursor >= PIP_MIN) PIP_SEGMENTS.push({ from: cursor, to: s.to });
}
const CUTS = [...new Set([...FULL.map((f) => f.from), ...HABITS_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 punch-ins — selective, on the lines that matter, inside face windows.
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 500, level: "strong", hold: 50 }, // "the output comes back wrong…"
  { at: 2600, level: "emphasis", hold: 44 }, // "the agent only has the words you gave it"
  { at: 4500, level: "emphasis", hold: 44 }, // "now it understands what success means"
  { at: 8000, level: "emphasis", hold: 40 }, // "your project may rely on…"
  { at: 10100, level: "emphasis", hold: 40 }, // "polished language can hide a terrible decision"
  { at: 13450, level: "emphasis", hold: 44 }, // "checking should follow the consequence"
  { at: 15250, level: "strong", hold: 44 }, // "blame the agent for forgetting"
  { at: 18800, level: "emphasis", hold: 40 }, // "ready for more responsibility"
  { at: 23050, level: "strong", hold: 50 }, // "reducing authority is competent management"
  { at: 24880, level: "emphasis", hold: 40 }, // into "the actual fix"
];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const HabitsFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);

  // fold the punch-ins around the footage layer
  let footage: React.ReactNode = (
    <FootageDirector footage={FOOTAGE} volume={2.4} framing={[{ at: 0, scale: 1.03, y: 0 }]} />
  );
  for (const p of PUNCHES) {
    footage = (
      <CameraPunchIn at={p.at} level={p.level} hold={p.hold} ramp={12}>
        {footage}
      </CameraPunchIn>
    );
  }

  return (
    <ThemeProvider style="paper">
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <AbsoluteFill style={{ backgroundColor: "#F0EEE6" }} />
        {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
        <SlideLeftPush cuts={CUTS}>
          {/* VO boost 2.4× (source peaks ≈ −10.7 dB — probed 2026-07-26) */}
          <AbsoluteFill
            style={{
              transform: `scale(${introZoom})`,
              transformOrigin: "50% 40%",
              borderRadius: introRadius,
              overflow: "hidden",
              boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
            }}
          >
            {footage}
          </AbsoluteFill>

          {/* one continuous paper bridge per span, UNDER the cards */}
          {SPANS.map((s) => (
            <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
              <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
            </Sequence>
          ))}

          <HabitsVideo />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
          ))}
        </SlideLeftPush>

        {/* face → first cover (the interns) at ~88 */}
        <CutFlash at={88} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns */}
        <Sequence from={1472} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3117} durationInFrames={10}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={6416} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={10595} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={14706} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={18980} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={23485} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapter markers (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
