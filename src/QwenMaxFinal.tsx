import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { QwenMaxVideo, QWEN_WINDOWS, QWEN_FULLSCREEN, QWEN_EXTRA_CUTS } from "./QwenMaxVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { TopProgressBar, Chapter } from "./components/TopProgressBar";
import { ThemeProvider } from "./theme";

// Chapter markers for the top progress bar — mapped to the transcript's
// structure (What Happened → the launch/what was released; The Evidence → the
// benchmark claim + independent comparisons; The Catch → cost + access; What
// It Means → the three questions + verdict).
const CHAPTERS: Chapter[] = [
  { label: "What Happened", from: 0 },
  { label: "The Evidence", from: 2545 },
  { label: "The Catch", from: 7420 },
  { label: "What It Means", from: 9695 },
];

// Final combined cut: talking head + the Qwen-3.8-Max receipt track + per-span
// PiP. Face-first punch-in open (the presenter delivers the hook, first cover
// — the Alibaba launch tweet — cuts in at ~88f). Transitions v2 (pull-left).
const FOOTAGE = "talking-head-220726.mp4"; // Qwen-3.8-Max recording (2026-07-22, rotated 07-24)

const PIP_GAP_MAX = 90; // 3s — a longer VO-only gap BREAKS the span back to full footage
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...QWEN_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

const FULL = [...QWEN_FULLSCREEN].sort((a, b) => a.from - b.from);
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

const CUTS = [...new Set([...FULL.map((f) => f.from), ...QWEN_EXTRA_CUTS])].sort((a, b) => a - b);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const QwenMaxFinal: React.FC = () => {
  const frame = useCurrentFrame();
  // OPENING PUNCH-IN (§8): footage starts as a rounded card at 0.5 on the
  // ivory paper, zooms to exactly 1.0 over ~0.7s with the whoosh.
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ backgroundColor: "#F0EEE6" }} />
      {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
      <SlideLeftPush cuts={CUTS}>
      {/* VO boost 1.8× (source peaks ≈ −7.3 dB — probed 2026-07-22) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts at THIS footage's sentence gaps (2026-07-22) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={1.8}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 1285, scale: 1.1, y: -2 },
            { at: 2540, scale: 1.0, y: 0 },
            { at: 3700, scale: 1.08, y: -1 },
            { at: 5170, scale: 1.0, y: 0 },
            { at: 6540, scale: 1.1, y: -2 },
            { at: 7560, scale: 1.05, y: -1 },
            { at: 8970, scale: 1.0, y: 0 },
            { at: 9770, scale: 1.08, y: -1 },
            { at: 10640, scale: 1.0, y: 0 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <QwenMaxVideo />

      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}
      </SlideLeftPush>
      {/* face → first cover (the Alibaba launch tweet) at ~88 */}
      <CutFlash at={88} peak={0.5} />
      {/* persistent top progress + chapter markers (outside the push, on top) */}
      <TopProgressBar sections={CHAPTERS} accent="#D97757" />
    </AbsoluteFill>
    </ThemeProvider>
  );
};
