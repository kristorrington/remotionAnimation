import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { ChatGptWorkVideo, CHATGPT_WORK_WINDOWS, CHATGPT_WORK_FULLSCREEN } from "./ChatGptWorkVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SceneTransition, TransitionKind } from "./motion/transitions";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + ChatGPT Work animation track + per-span
// PiP. Same structure as N8nHybridFinal (transitions v2, paper theme).
const FOOTAGE = "talking-head.mp4";

const PIP_GAP_MAX = 180; // 6s
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...CHATGPT_WORK_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...CHATGPT_WORK_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// Kinetic transitions on every full-screen span START (rotating kinds).
const KINDS: TransitionKind[] = ["whip", "iris", "bar"];
const TRANSITIONS = FULL.map((f, i) => ({ at: f.from, kind: KINDS[i % KINDS.length] }));

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ChatGptWorkFinal: React.FC = () => {
  const frame = useCurrentFrame();
  // OPENING PUNCH-IN (§8): footage starts as a rounded card at 0.5 on the
  // ivory paper, zooms to exactly 1.0 over ~0.7s with the whoosh.
  const introZoom = interpolate(frame, [0, 22], [0.5, 1], { ...CLAMP, easing: Easing.out(Easing.cubic) });
  const introRadius = interpolate(frame, [0, 22], [40, 0], CLAMP);
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {frame < 26 && <AnimatedBackground durationInFrames={30} fade={false} />}
      {/* VO boost 2.5× (source peaks ≈ −11.4 dB — probed 2026-07-13) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts retimed to THIS footage's visible face gaps (2026-07-13) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={2.5}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 640, scale: 1.1, y: -2 },
            { at: 1680, scale: 1.0, y: 0 },
            { at: 2750, scale: 1.08, y: -1 },
            { at: 3880, scale: 1.12, y: -2 },
            { at: 5100, scale: 1.0, y: 0 },
            { at: 5850, scale: 1.07, y: -1 },
            { at: 6640, scale: 1.12, y: -2 },
            { at: 7360, scale: 1.05, y: -1 },
            { at: 8600, scale: 1.1, y: -2 },
            { at: 9200, scale: 1.06, y: -1 },
            { at: 9760, scale: 1.0, y: 0 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <ChatGptWorkVideo />

      {/* steady PiP — except where the animation owns the whole screen */}
      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}

      {/* kinetic cut moves on the big turns (rotating whip / iris / bar) */}
      {TRANSITIONS.map((t) => (
        <SceneTransition key={`tr-${t.at}`} at={t.at} kind={t.kind} />
      ))}
      <CutFlash at={90} peak={0.5} />
    </AbsoluteFill>
    </ThemeProvider>
  );
};
