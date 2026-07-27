import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AiWeeklyVideo, AI_WEEKLY_WINDOWS, AI_WEEKLY_FULLSCREEN, AI_WEEKLY_EXTRA_CUTS } from "./AiWeeklyVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Chapters for the top progress bar — the feed + three stories + watchlist +
// the closing filter.
const CHAPTERS: Chapter[] = [
  { label: "The Feed", from: 0 },
  { label: "Hugging Face", from: 744 },
  { label: "Opus 5", from: 3986 },
  { label: "Open Weights", from: 7037 },
  { label: "The Watchlist", from: 10047 },
  { label: "The Filter", from: 12921 },
];

// Final combined cut: talking head + the AI-news editkit/receipt track + per-span
// PiP. B-ROLL FIRST (Kris, 2026): the face opens with a punch-in, then the first
// cover at ~100f is the lead STORY'S SOURCE (Hugging Face disclosure), and every
// section opens on its real receipt/film before the animation. §15 model-review
// edit: selective CameraPunchIn on the face, named SectionTransitions at the
// chapter turns, minimal pull-left cuts otherwise.
const FOOTAGE = "talking-head.mp4"; // AI-news-this-week recording (2026-07-27)

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...AI_WEEKLY_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...AI_WEEKLY_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...AI_WEEKLY_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 emphasis punch-ins — selective, on the face during the full-face gaps.
// Nested so at most one is >100%.
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 40, level: "strong", hold: 54 }, // the opening promise
  { at: 680, level: "emphasis", hold: 40 }, // "let's get straight into it"
  { at: 3370, level: "emphasis", hold: 44 }, // "a better agent does unintended work faster too"
  { at: 6960, level: "emphasis", hold: 40 }, // "the economics of using one model"
  { at: 12720, level: "strong", hold: 48 }, // "same standard, both times"
  { at: 13900, level: "emphasis", hold: 42 }, // "you already know the drill by now"
];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const AiWeeklyFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);

  // fold the emphasis punch-ins around the footage (audio lives in FootageDirector)
  let footage: React.ReactNode = (
    <FootageDirector footage={FOOTAGE} volume={1.3} framing={[{ at: 0, scale: 1.03, y: 0 }]} />
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
          {/* VO boost 1.3× (source peaks ≈ −3.9 dB — probed 2026-07-27) */}
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

          <AiWeeklyVideo />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
          ))}
        </SlideLeftPush>

        {/* face → first cover (the Hugging Face disclosure) at ~100 */}
        <CutFlash at={100} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns (over the pull-left) */}
        <Sequence from={736} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3978} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={7029} durationInFrames={10}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={10039} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={12913} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapter markers (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
