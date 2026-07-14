import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { GoLocalVideo, GOLOCAL_WINDOWS, GOLOCAL_FULLSCREEN } from "./GoLocalVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + go-local animation track + per-span PiP.
// Same structure as AiNewsFinal (transitions v2, paper theme).
const FOOTAGE = "talking-head.mp4"; // go-local footage (rotated in 2026-07-15)

const PIP_GAP_MAX = 180; // 6s
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...GOLOCAL_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...GOLOCAL_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// CapCut-style pull-left on every full-screen span START (the v2 rule).
const CUTS = FULL.map((f) => f.from);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const GoLocalFinal: React.FC = () => {
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
      {/* VO boost 1.8× (source peaks ≈ −7.6 dB — probed 2026-07-15) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts retimed to THIS footage's sentence gaps (2026-07-15) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={1.8}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 710, scale: 1.1, y: -2 },
            { at: 1500, scale: 1.0, y: 0 },
            { at: 2350, scale: 1.08, y: -1 },
            { at: 3390, scale: 1.12, y: -2 },
            { at: 4160, scale: 1.0, y: 0 },
            { at: 4970, scale: 1.07, y: -1 },
            { at: 5890, scale: 1.12, y: -2 },
            { at: 6660, scale: 1.05, y: -1 },
            { at: 7590, scale: 1.1, y: -2 },
            { at: 8480, scale: 1.06, y: -1 },
            { at: 9450, scale: 1.0, y: 0 },
            { at: 10240, scale: 1.05, y: -1 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <GoLocalVideo />

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
