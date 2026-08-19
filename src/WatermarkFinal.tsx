import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { WatermarkVideo, WM_WINDOWS, WM_FULLSCREEN, WM_EXTRA_CUTS, WM_PIP } from "./WatermarkVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { CameraPunchIn, SectionTransition } from "./motion/editkit";
import { ThemeProvider } from "./theme";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: CAPTION_FONT } = loadInter("normal", { weights: ["600", "700"], subsets: ["latin"] });

// Final combined cut (13476f, 7:29): the _cut_synced talking head + the
// watermark investigation overlay. Kris's brief: face-led, evidence appears
// when needed; punch-ins 105-115% max; strong returns to face on the reversal
// lines and the whole takeaway. First cover cuts in at 150 with a CutFlash.
const FOOTAGE = "talking-head-190826.mp4"; // Claude watermark (2026-08-19 cut_synced)

const CHAPTERS: Chapter[] = [
  { label: "The Quiet Rollout", from: 0 },
  { label: "How It Works", from: 2311 },
  { label: "Where It Runs", from: 4942 },
  { label: "Why", from: 6106 },
  { label: "What A Hit Proves", from: 7304 },
  { label: "The Weakness", from: 9337 },
  { label: "The Takeaway", from: 11700 },
];

const PIP_GAP_MAX = 90;
const PIP_MIN = 90;
const COVERS = [...WM_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}
const FULL = [...WM_FULLSCREEN].sort((a, b) => a.from - b.from);
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
const CUTS = [...new Set([...FULL.map((f) => f.from), ...WM_EXTRA_CUTS])].sort((a, b) => a - b);

// §15.2 punch-ins — selective, on the lines the brief marks
const PUNCHES: { at: number; level: "emphasis" | "strong"; hold: number }[] = [
  { at: 34, level: "emphasis", hold: 48 }, // "quietly started watermarking"
  { at: 240, level: "emphasis", hold: 46 }, // "the part I think matters most"
  { at: 650, level: "strong", hold: 48 }, // "except that's not really…" (reversal #1)
  { at: 2110, level: "emphasis", hold: 46 }, // "much narrower than you might expect"
  { at: 7250, level: "emphasis", hold: 46 }, // "much more interesting"
  { at: 7572, level: "strong", hold: 46 }, // "not nearly as much as you might think"
  { at: 9400, level: "emphasis", hold: 44 }, // "isn't especially difficult to disrupt"
  { at: 10180, level: "strong", hold: 48 }, // "that's Anthropic's own wording"
  { at: 12930, level: "strong", hold: 50 }, // "catching the watermark doesn't catch cheating"
];

// Keyword captions on FACE-ONLY stretches — BRAND v2: no pill, cream Inter
// over the footage with ONE orange word, 4-6f fade + small rise, ~1.5-2s.
const FACE_CAPTIONS: { at: number; dur: number; pre?: string; hot: string; post?: string }[] = [
  { at: 372, dur: 56, pre: "WHAT DOES IT", hot: "PROVE?" },
  { at: 1900, dur: 56, pre: "NO EVIDENCE", hot: "AT SCALE" },
  { at: 2140, dur: 50, pre: "MUCH", hot: "NARROWER" },
  { at: 6150, dur: 48, pre: "WHY", hot: "GLOBAL?" },
  { at: 7330, dur: 54, pre: "BACK TO THE", hot: "QUESTION" },
  { at: 8650, dur: 54, pre: "WHICH ONE", hot: "WAS IT?" },
  { at: 9360, dur: 54, pre: "THE BIG", hot: "LIMITATION" },
  { at: 10290, dur: 56, pre: "UPFRONT", hot: "ABOUT IT" },
  { at: 11730, dur: 58, pre: "ONE", hot: "SIGNAL" },
  { at: 11990, dur: 52, pre: "HOW MUCH?", hot: "UNKNOWN" },
  { at: 12100, dur: 48, pre: "WHO?", hot: "UNKNOWN" },
  { at: 12170, dur: 58, pre: "AUTHORSHIP?", hot: "NOT PROVEN" },
];

const FaceCaption: React.FC<{ dur: number; pre?: string; hot: string; post?: string }> = ({ dur, pre, hot, post }) => {
  const frame = useCurrentFrame();
  const riseY = interpolate(frame, [0, 12], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.33, 0, 0.2, 1) });
  const op = Math.min(
    interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [dur - 8, dur - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", paddingLeft: 128, paddingBottom: 132, pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: "0.34em", transform: `translateY(${riseY}px)`, opacity: op, textShadow: "0 2px 18px rgba(0,0,0,0.75)" }}>
        {pre ? <span style={{ fontFamily: CAPTION_FONT, fontWeight: 600, fontSize: 46, letterSpacing: 0.5, color: "#F2EEE6", textTransform: "uppercase" }}>{pre}</span> : null}
        <span style={{ fontFamily: CAPTION_FONT, fontWeight: 700, fontSize: 46, letterSpacing: 0.5, color: "#D97745", textTransform: "uppercase" }}>{hot}</span>
        {post ? <span style={{ fontFamily: CAPTION_FONT, fontWeight: 600, fontSize: 46, letterSpacing: 0.5, color: "#F2EEE6", textTransform: "uppercase" }}>{post}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

export const WatermarkFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let footage: React.ReactNode = (
    <FootageDirector footage={FOOTAGE} volume={1.3} framing={[
      { at: 0, scale: 1.03, y: 0 },
      { at: 200, scale: 1.0, y: 0 },
      { at: 660, scale: 1.09, y: -1 },
      { at: 800, scale: 1.0, y: 0 },
      { at: 1850, scale: 1.08, y: -1 },
      { at: 1990, scale: 1.0, y: 0 },
      { at: 2568, scale: 1.09, y: -1 },
      { at: 2700, scale: 1.0, y: 0 },
      { at: 3775, scale: 1.08, y: -1 },
      { at: 4812, scale: 1.0, y: 0 },
      { at: 5593, scale: 1.08, y: -1 },
      { at: 6100, scale: 1.0, y: 0 },
      { at: 6220, scale: 1.08, y: -1 },
      { at: 7190, scale: 1.0, y: 0 },
      { at: 7420, scale: 1.1, y: -1 },
      { at: 7642, scale: 1.0, y: 0 },
      { at: 8624, scale: 1.08, y: -1 },
      { at: 9325, scale: 1.0, y: 0 },
      { at: 9430, scale: 1.08, y: -1 },
      { at: 10250, scale: 1.0, y: 0 },
      { at: 10380, scale: 1.09, y: -1 },
      { at: 10788, scale: 1.0, y: 0 },
      { at: 11700, scale: 1.06, y: 0 },
      { at: 11890, scale: 1.0, y: 0 },
      { at: 12080, scale: 1.08, y: -1 },
      { at: 12240, scale: 1.0, y: 0 },
      { at: 12863, scale: 1.06, y: -1 },
      { at: 13040, scale: 1.0, y: 0 },
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
    <ThemeProvider style="cinematic">
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        <AbsoluteFill style={{ backgroundColor: "#0B0B0A" }} />
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

          <WatermarkVideo />

          {PIP_SEGMENTS.map((s) => (
            <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
          {WM_PIP.filter((s) => FULL.some((f) => f.from === s.from)).map((s) => (
            <CornerPip key={`pipf-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} faceX={0} />
          ))}
        </SlideLeftPush>

        {FACE_CAPTIONS.map((c) => (
          <Sequence key={`fc-${c.at}`} from={c.at} durationInFrames={c.dur}>
            <FaceCaption dur={c.dur} pre={c.pre} hot={c.hot} post={c.post} />
          </Sequence>
        ))}

        <CutFlash at={150} peak={0.5} />

        <Sequence from={2303} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={4934} durationInFrames={14}><SectionTransition kind="evidence" /></Sequence>
        <Sequence from={6098} durationInFrames={16}><SectionTransition kind="section" /></Sequence>
        <Sequence from={7296} durationInFrames={14}><SectionTransition kind="section" /></Sequence>
        <Sequence from={9329} durationInFrames={14}><SectionTransition kind="counterpoint" /></Sequence>
        <Sequence from={11692} durationInFrames={12}><SectionTransition kind="verdict" /></Sequence>

        <TopProgressBar sections={CHAPTERS} accent="#D97745" />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
