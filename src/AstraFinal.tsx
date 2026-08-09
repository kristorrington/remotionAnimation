import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AstraVideo, ASTRA_WINDOWS, ASTRA_FULLSCREEN, ASTRA_EXTRA_CUTS, ASTRA_PIP } from "./AstraVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";

// Final combined cut (natural speed, 9864f): talking head + the Astra
// ten-proofs fact-check overlay. OPEN: FACE full-frame with the punch-in, the
// first receipt cuts in at ~242 with a CutFlash. §15 edit: selective punch-ins
// + alternating framings on face gaps, keyword captions on face-only
// stretches, named transitions at chapter turns, pull-left cuts otherwise.
const FOOTAGE = "talking-head-090826.mp4"; // Astra fact-check (2026-08-09)

const CHAPTERS: Chapter[] = [
  { label: "The Post", from: 0 },
  { label: "The Proof", from: 1071 },
  { label: "Wrong Number", from: 3369 },
  { label: "Two Stories", from: 5554 },
  { label: "The Test", from: 8060 },
];

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...ASTRA_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...ASTRA_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...ASTRA_EXTRA_CUTS])].sort((a, b) => a - b);

// Hide the corner PiP where the stray retake phrase was MUTED (~1:40) — the
// audio is silent there, so the face must not be seen mouthing it (Kris).
const PIP_HIDE = [{ from: 2980, to: 3034 }];
const punch = (segs: { from: number; to: number }[]) =>
  segs.flatMap((s) => {
    let parts = [s];
    for (const h of PIP_HIDE) {
      parts = parts.flatMap((p) => {
        if (h.to <= p.from || h.from >= p.to) return [p];
        const out: { from: number; to: number }[] = [];
        if (h.from > p.from) out.push({ from: p.from, to: h.from });
        if (h.to < p.to) out.push({ from: h.to, to: p.to });
        return out;
      });
    }
    return parts;
  }).filter((p) => p.to - p.from >= 20);

// §15.2 punch-ins on the face gaps (selective)
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 452, level: "emphasis", hold: 44 }, // "a second claim… never confirmed"
  { at: 3100, level: "emphasis", hold: 42 }, // "genuinely strong claim"
  { at: 5400, level: "strong", hold: 48 }, // "bet a business decision on"
  { at: 7600, level: "emphasis", hold: 42 }, // "anonymous sourcing"
];

// Keyword captions on the FACE-ONLY stretches (retention pass — keywords,
// never transcripts; whisper-pinned)
const FACE_CAPTIONS: { at: number; dur: number; text: string }[] = [
  { at: 30, dur: 80, text: "EVERYONE'S POSTING THE SAME SCREENSHOT" },
  { at: 150, dur: 74, text: "I PULLED THE 249 PAGES" },
  { at: 452, dur: 60, text: "A SECOND, UNCONFIRMED CLAIM" },
  { at: 795, dur: 70, text: "WHAT OPENAI ACTUALLY PROVED" },
  { at: 900, dur: 80, text: "WHERE THE HEADLINE WENT WRONG" },
  { at: 1250, dur: 76, text: "NO TEASE — THE FULL DROP" },
  { at: 3040, dur: 70, text: "A GENUINELY STRONG CLAIM" },
  { at: 3280, dur: 76, text: "THE NUMBER EVERYONE REPEATS" },
  { at: 5310, dur: 76, text: "BET A DECISION ON THIS?" },
  { at: 5450, dur: 76, text: "TWO VERY DIFFERENT STORIES" },
  { at: 7580, dur: 80, text: "THE HALF THAT ACTUALLY MATTERS" },
];

const FaceCaption: React.FC<{ dur: number; text: string }> = ({ dur, text }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 7], [1.28, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const op = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 10, dur - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 150, pointerEvents: "none" }}>
      <div style={{ padding: "14px 34px", borderRadius: 12, background: "rgba(16,14,12,0.92)", borderBottom: "5px solid #D9502E", boxShadow: "0 14px 40px rgba(0,0,0,0.45)", transform: `scale(${pop})`, opacity: op }}>
        <span style={{ fontFamily: "Anton", fontWeight: 400, fontSize: 46, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff" }}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

export const AstraFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let footage: React.ReactNode = (
    // VO boost 1.3× (peaks −3.7 dB; two-pass linear loudnorm masters at export)
    <FootageDirector footage={FOOTAGE} volume={1.3} framing={[
      { at: 0, scale: 1.03, y: 0 },
      { at: 120, scale: 1.1, y: -1 },   // hook build
      { at: 452, scale: 1.0, y: 0 },
      { at: 640, scale: 1.08, y: -1 },
      { at: 800, scale: 1.0, y: 0 },
      { at: 940, scale: 1.1, y: -1 },
      { at: 1250, scale: 1.02, y: 0 },
      { at: 3040, scale: 1.1, y: -1 },  // "genuinely strong claim"
      { at: 3180, scale: 1.0, y: 0 },
      { at: 3290, scale: 1.08, y: -1 },
      { at: 5300, scale: 1.1, y: -1 },  // "bet a business decision"
      { at: 5430, scale: 1.0, y: 0 },
      { at: 7570, scale: 1.08, y: -1 }, // into the sourcing gap
      { at: 7660, scale: 1.0, y: 0 },
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

          {/* one continuous paper bridge per span, UNDER the cards */}
          {SPANS.map((s) => (
            <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
              <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
            </Sequence>
          ))}

          <AstraVideo />

          {punch(PIP_SEGMENTS).map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
          {/* face presence on the fullscreen scenes flagged pip */}
          {punch(ASTRA_PIP.filter((s) => FULL.some((f) => f.from === s.from))).map((s) => (
            <CornerPip key={`pipf-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
        </SlideLeftPush>

        {/* keyword captions on the face-only stretches */}
        {FACE_CAPTIONS.map((c) => (
          <Sequence key={`fc-${c.at}`} from={c.at} durationInFrames={c.dur}>
            <FaceCaption dur={c.dur} text={c.text} />
          </Sequence>
        ))}

        {/* face → first cover (the OpenAI post receipt) at ~242 */}
        <CutFlash at={242} peak={0.5} />

        {/* §15.5 editorial transitions at the chapter turns */}
        <Sequence from={1063} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={3361} durationInFrames={12}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={5546} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={8052} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={9182} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        {/* persistent top progress + chapters (outside the push, on top) */}
        <TopProgressBar sections={CHAPTERS} accent="#D97757" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
