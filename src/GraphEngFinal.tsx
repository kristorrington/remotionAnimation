import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { GraphEngVideo, GE_WINDOWS, GE_FULLSCREEN, GE_EXTRA_CUTS, GE_PIP } from "./GraphEngVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Final combined cut (natural speed, 13200f): talking head + the Graph
// Engineering investigation overlay. OPEN: FACE full-frame with the punch-in,
// first cover cuts in at ~296 ("Graph engineering.") with a CutFlash. §15
// edit: selective punch-ins + alternating framings on face gaps, keyword
// captions on face-only stretches, named transitions at chapter turns.
const FOOTAGE = "talking-head-160826.mp4"; // Graph engineering (2026-08-16)

const CHAPTERS: Chapter[] = [
  { label: "The Hype", from: 0 },
  { label: "Line → Loop → Graph", from: 1297 },
  { label: "Not New", from: 3392 },
  { label: "Where It Came From", from: 4972 },
  { label: "The False Stat", from: 7460 },
  { label: "The Rule", from: 10635 },
];

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...GE_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...GE_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...GE_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 punch-ins on the face gaps / key lines (selective)
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 100, level: "emphasis", hold: 46 }, // hook
  { at: 940, level: "emphasis", hold: 60 }, // "give me five minutes… one simple rule"
  { at: 2470, level: "emphasis", hold: 44 }, // "here's what that looks like in practice"
  { at: 7043, level: "strong", hold: 48 }, // "just a good day for a phrase"
  { at: 8500, level: "emphasis", hold: 42 }, // "not ideal"
];

// Keyword captions on FACE-ONLY stretches (keywords, not transcripts)
const FACE_CAPTIONS: { at: number; dur: number; text: string }[] = [
  { at: 30, dur: 80, text: "BEFORE THE CUTE NAMES" },
  { at: 210, dur: 66, text: "THE INTERNET LOST IT" },
  { at: 940, dur: 70, text: "FIVE MINUTES" },
  { at: 1030, dur: 74, text: "ONE SIMPLE RULE" },
  { at: 2470, dur: 70, text: "HERE'S THE REAL SHAPE" },
  { at: 7043, dur: 78, text: "A GOOD DAY FOR A PHRASE" },
  { at: 8760, dur: 60, text: "NOT IDEAL." },
  { at: 11960, dur: 78, text: "IT HASN'T EARNED YOUR TRUST" },
];

const FaceCaption: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 7], [1.26, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const op = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 10, dur - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 150, pointerEvents: "none" }}>
      <div style={{ padding: "13px 32px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderBottom: "5px solid #D9502E", boxShadow: "0 14px 40px rgba(0,0,0,0.45)", transform: `scale(${pop})`, opacity: op }}>
        <span style={{ fontFamily: "Anton", fontWeight: 400, fontSize: 44, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

export const GraphEngFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let footage: React.ReactNode = (
    // VO boost 1.3× (peaks −3.9 dB; two-pass linear loudnorm masters at export)
    <FootageDirector footage={FOOTAGE} volume={1.3} framing={[
      { at: 0, scale: 1.03, y: 0 },
      { at: 100, scale: 1.1, y: -1 },
      { at: 240, scale: 1.0, y: 0 },
      { at: 940, scale: 1.09, y: -1 },
      { at: 1120, scale: 1.0, y: 0 },
      { at: 2470, scale: 1.1, y: -1 },
      { at: 2560, scale: 1.0, y: 0 },
      { at: 7043, scale: 1.1, y: -1 },
      { at: 7300, scale: 1.0, y: 0 },
      { at: 8500, scale: 1.09, y: -1 },
      { at: 8790, scale: 1.0, y: 0 },
      { at: 11960, scale: 1.08, y: -1 },
      { at: 12120, scale: 1.0, y: 0 },
    ]} />
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
        <AbsoluteFill style={{ backgroundColor: "#FBFAF7" }} />
        {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
        <SlideLeftPush cuts={CUTS}>
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

          {SPANS.map((s) => (
            <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
              <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
            </Sequence>
          ))}

          <GraphEngVideo />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
          {GE_PIP.filter((s) => FULL.some((f) => f.from === s.from)).map((s) => (
            <CornerPip key={`pipf-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
        </SlideLeftPush>

        {FACE_CAPTIONS.map((c) => (
          <Sequence key={`fc-${c.at}`} from={c.at} durationInFrames={c.dur}>
            <FaceCaption dur={c.dur} text={c.text} />
          </Sequence>
        ))}

        <CutFlash at={296} peak={0.5} />

        <Sequence from={1289} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3384} durationInFrames={14}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={4964} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={7452} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={10627} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
