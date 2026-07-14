import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AiNewsVideo, AINEWS_WINDOWS, AINEWS_FULLSCREEN } from "./AiNewsVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + AI-news animation track + per-span PiP.
// Same structure as ChatGptWorkFinal (transitions v2, paper theme).
const FOOTAGE = "talking-head-140726.mp4"; // rotated 2026-07-15 (go-local video took talking-head.mp4)

const PIP_GAP_MAX = 180; // 6s
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...AINEWS_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...AINEWS_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// CapCut-style pull-left on every full-screen span START (the v2 rule):
// the whole frame slides off left, the incoming cover rides in from the right.
const CUTS = FULL.map((f) => f.from);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const AiNewsFinal: React.FC = () => {
  const frame = useCurrentFrame();
  // OPENING PUNCH-IN (§8): footage starts as a rounded card at 0.5 on the
  // ivory paper, zooms to exactly 1.0 over ~0.7s with the whoosh.
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* ivory backdrop: the pull-left gap must show paper, never black */}
      <AbsoluteFill style={{ backgroundColor: "#F0EEE6" }} />
      {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
      <SlideLeftPush cuts={CUTS}>
      {/* VO boost 1.9× (source peaks ≈ −8.6 dB — probed 2026-07-14) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts retimed to THIS footage's sentence gaps (2026-07-14) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={1.9}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 840, scale: 1.1, y: -2 },
            { at: 1560, scale: 1.0, y: 0 },
            { at: 2410, scale: 1.08, y: -1 },
            { at: 3300, scale: 1.12, y: -2 },
            { at: 4140, scale: 1.0, y: 0 },
            { at: 4960, scale: 1.07, y: -1 },
            { at: 5810, scale: 1.12, y: -2 },
            { at: 6430, scale: 1.05, y: -1 },
            { at: 7250, scale: 1.1, y: -2 },
            { at: 8110, scale: 1.06, y: -1 },
            { at: 8590, scale: 1.0, y: 0 },
            { at: 10020, scale: 1.05, y: -1 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <AiNewsVideo />

      {/* steady PiP — except where the animation owns the whole screen */}
      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}
      </SlideLeftPush>
      <CutFlash at={90} peak={0.5} />
    </AbsoluteFill>
    </ThemeProvider>
  );
};
