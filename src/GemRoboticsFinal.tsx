import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { GemRoboticsVideo, GEMROB_WINDOWS, GEMROB_FULLSCREEN, GEMROB_EXTRA_CUTS, GEMROB_PIP } from "./GemRoboticsVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + the footage-first Gemini Robotics 2
// overlay. OPEN (Kris): the FACE full-frame with the standard punch-in
// (0.5→1.0 card zoom), then the lightbulb film card cuts in at ~90f (first
// phrase break) with a CutFlash. §15 edit: selective punch-ins on the face
// gaps, named transitions at chapter turns, pull-left cuts otherwise.
const FOOTAGE = "talking-head-030826.mp4"; // Gemini Robotics 2 (2026-08-03)

const CHAPTERS: Chapter[] = [
  { label: "The Reel", from: 0 },
  { label: "One Brain", from: 1148 },
  { label: "The Demos", from: 2664 },
  { label: "The Garage", from: 5400 },
  { label: "The Gaps", from: 7690 },
  { label: "Verdict", from: 8580 },
];

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...GEMROB_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...GEMROB_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...GEMROB_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 punch-ins on the face gaps (selective)
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 400, level: "emphasis", hold: 44 }, // "the footage looks incredible — but…"
  { at: 3090, level: "emphasis", hold: 42 }, // "you can't hide a dropped lightbulb"
  { at: 5060, level: "strong", hold: 48 }, // "where Google wants this to stand out"
  { at: 7580, level: "emphasis", hold: 42 }, // into the gaps
];

export const GemRoboticsFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let footage: React.ReactNode = (
    // VO boost 1.15× (hot recording; two-pass linear loudnorm masters at export)
    <FootageDirector footage={FOOTAGE} volume={1.15} framing={[{ at: 0, scale: 1.03, y: 0 }]} />
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

          {/* one continuous paper bridge per span, UNDER the cards */}
          {SPANS.map((s) => (
            <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
              <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
            </Sequence>
          ))}

          <GemRoboticsVideo />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={4} />
          ))}
          {/* face presence on the long film cards + diagram scenes */}
          {GEMROB_PIP.filter((s) => FULL.some((f) => f.from === s.from)).map((s) => (
            <CornerPip key={`pipf-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={4} />
          ))}
        </SlideLeftPush>

        {/* face → first cover (the lightbulb film card) at ~90 */}
        <CutFlash at={90} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns */}
        <Sequence from={1140} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={2656} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={5392} durationInFrames={12}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={7682} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={8572} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapters (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
