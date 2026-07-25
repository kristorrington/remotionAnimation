import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Opus5Video, OPUS5_WINDOWS, OPUS5_FULLSCREEN, OPUS5_EXTRA_CUTS } from "./Opus5Video";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Chapters for the top progress bar — the six movements of the review.
const CHAPTERS: Chapter[] = [
  { label: "The Claim", from: 0 },
  { label: "What It Is", from: 1252 },
  { label: "The Benchmarks", from: 3720 },
  { label: "The Catch", from: 7980 },
  { label: "Safety", from: 11340 },
  { label: "The Verdict", from: 14520 },
];

// Final combined cut: talking head + the Opus-5 editkit/receipt track + per-span
// PiP. Face-first punch-in open; first cover (Opus vs Fable) at ~150f. §15
// model-review edit: CameraPunchIn emphasis on the face, four named
// SectionTransitions at the chapter turns, minimal pull-left cuts otherwise.
const FOOTAGE = "talking-head.mp4"; // Claude Opus 5 recording (2026-07-26)

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...OPUS5_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...OPUS5_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...OPUS5_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 emphasis punch-ins — selective, on the lines that matter, during the
// full-face windows (the open + inter-beat gaps). Nested so at most one is >100%.
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 55, level: "strong", hold: 60 }, // the opening contradiction, on the face
  { at: 1000, level: "emphasis", hold: 40 }, // "should Opus 5 become your default?"
  { at: 1740, level: "emphasis", hold: 50 }, // "the specifications are substantial"
  { at: 7620, level: "strong", hold: 44 }, // "genuinely operating at the frontier"
  { at: 9080, level: "emphasis", hold: 40 }, // into the hidden cost
  { at: 17090, level: "emphasis", hold: 44 }, // "not the right model for every prompt"
  { at: 17640, level: "strong", hold: 60 }, // the final verdict recap
];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Opus5Final: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);

  // fold the emphasis punch-ins around the footage (audio lives in FootageDirector)
  let footage: React.ReactNode = (
    <FootageDirector footage={FOOTAGE} volume={1.2} framing={[{ at: 0, scale: 1.03, y: 0 }]} />
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
          {/* VO boost 1.2× (source peaks ≈ −2.8 dB — probed 2026-07-26) */}
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

          <Opus5Video />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
          ))}
        </SlideLeftPush>

        {/* face → first cover (Opus vs Fable) at ~148 */}
        <CutFlash at={148} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns (over the pull-left) */}
        <Sequence from={7050} durationInFrames={10}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={3712} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={7992} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={11332} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={14512} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapter markers (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
