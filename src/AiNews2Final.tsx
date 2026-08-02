import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AiNews2Video, AI_NEWS2_WINDOWS, AI_NEWS2_FULLSCREEN, AI_NEWS2_EXTRA_CUTS, AI_NEWS2_PIP } from "./AiNews2Video";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + the AI-news logo/receipt overlay + per-span
// PiP. B-ROLL/LOGO FIRST (Kris): the face opens with a punch-in, the first cover
// at ~100f is the five-lab lineup, and every section opens on its lab logo or
// real receipt before the animation. §15 edit: selective CameraPunchIn on the
// face, named SectionTransitions at the chapter turns, pull-left cuts otherwise.
const FOOTAGE = "talking-head-020826.mp4"; // AI-news DeepSeek/OpenAI/Qwen (2026-08-02)

const CHAPTERS: Chapter[] = [
  { label: "The Feed", from: 0 },
  { label: "DeepSeek", from: 964 },
  { label: "OpenAI", from: 3527 },
  { label: "The Rumours", from: 6284 },
  { label: "Also This Week", from: 8680 },
  { label: "The Rule", from: 9757 },
];

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...AI_NEWS2_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...AI_NEWS2_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...AI_NEWS2_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 emphasis punch-ins — selective, on the face during the full-face windows.
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 40, level: "strong", hold: 54 }, // the hook: "five labs, one day"
  { at: 900, level: "emphasis", hold: 42 }, // "let's get into it"
  { at: 13300, level: "emphasis", hold: 44 }, // the sign-off
];

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const AiNews2Final: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);

  let footage: React.ReactNode = (
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
          {/* VO boost 1.3× (source peaks ≈ −4.1 dB — probed 2026-08-02) */}
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

          <AiNews2Video />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
          ))}
          {/* extra PiP on explanation/verdict/data/list fullscreen scenes (more face) */}
          {AI_NEWS2_PIP.map((s) => (
            <CornerPip key={`pipf-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
          ))}
        </SlideLeftPush>

        {/* face → first cover (the five-lab lineup) at ~100 */}
        <CutFlash at={100} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns (over the pull-left) */}
        <Sequence from={956} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3519} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={6276} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={8672} durationInFrames={10}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={9749} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapter markers (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
