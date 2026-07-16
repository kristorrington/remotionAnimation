import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { SkillsVideo, SKILLS_WINDOWS, SKILLS_FULLSCREEN } from "./SkillsVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + skills-ranking animation track + per-span
// PiP. Same structure as GoLocalFinal (transitions v2, paper theme).
const FOOTAGE = "talking-head.mp4"; // skills footage (rotated in 2026-07-16)

const PIP_GAP_MAX = 90; // 3s - a longer VO-only gap BREAKS the span back to full footage (no bare-paper holds)
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...SKILLS_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...SKILLS_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// CapCut-style pull-left on every full-screen span START (the v2 rule), plus
// one on every "Number N is…" chapter intro (Kris, July 2026) — the wipe's
// hidden midpoint sits just before each skill's receipt takes over.
const CHAPTER_CUTS = [756, 2147, 3609, 5537];
const CUTS = [...FULL.map((f) => f.from), ...CHAPTER_CUTS].sort((a, b) => a - b);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SkillsFinal: React.FC = () => {
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
      {/* VO boost 2.0× (source peaks ≈ −8.8 dB — probed 2026-07-16) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts retimed to THIS footage's sentence gaps (2026-07-16) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={2.0}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 740, scale: 1.1, y: -2 },
            { at: 1525, scale: 1.0, y: 0 },
            { at: 2340, scale: 1.08, y: -1 },
            { at: 3170, scale: 1.12, y: -2 },
            { at: 3860, scale: 1.0, y: 0 },
            { at: 4660, scale: 1.07, y: -1 },
            { at: 5445, scale: 1.12, y: -2 },
            { at: 6180, scale: 1.05, y: -1 },
            { at: 6945, scale: 1.1, y: -2 },
            { at: 7690, scale: 1.06, y: -1 },
            { at: 8770, scale: 1.0, y: 0 },
            { at: 9340, scale: 1.05, y: -1 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <SkillsVideo />

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
