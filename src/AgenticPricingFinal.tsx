import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { AgenticPricingVideo, AGP_WINDOWS, AGP_FULLSCREEN, AGP_EXTRA_CUTS } from "./AgenticPricingVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SlideLeftPush } from "./motion/transitions";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + the agentic-pricing receipt track + per-
// span PiP. Transitions v2 (pull-left on fullscreen starts + receipt swaps),
// paper theme. Face-first punch-in open (the presenter delivers the hook).
const FOOTAGE = "talking-head.mp4"; // agentic-pricing recording (2026-07-19)

const PIP_GAP_MAX = 90; // 3s — a longer VO-only gap BREAKS the span back to full footage
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...AGP_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

const FULL = [...AGP_FULLSCREEN].sort((a, b) => a.from - b.from);
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

const CUTS = [...new Set([...FULL.map((f) => f.from), ...AGP_EXTRA_CUTS])].sort((a, b) => a - b);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const AgenticPricingFinal: React.FC = () => {
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
      {/* VO boost 1.8× (source peaks ≈ −8.2 dB — probed 2026-07-19) */}
      <AbsoluteFill
        style={{
          transform: `scale(${introZoom})`,
          transformOrigin: "50% 40%",
          borderRadius: introRadius,
          overflow: "hidden",
          boxShadow: introZoom < 1 ? "0 24px 70px rgba(31,30,29,0.30)" : undefined,
        }}
      >
        {/* jump-cuts at THIS footage's sentence gaps (2026-07-19) */}
        <FootageDirector
          footage={FOOTAGE}
          volume={1.8}
          framing={[
            { at: 0, scale: 1.05, y: -1 },
            { at: 774, scale: 1.1, y: -2 },
            { at: 1030, scale: 1.0, y: 0 },
            { at: 2000, scale: 1.08, y: -1 },
            { at: 2660, scale: 1.0, y: 0 },
            { at: 3560, scale: 1.1, y: -2 },
            { at: 4310, scale: 1.05, y: -1 },
            { at: 5230, scale: 1.0, y: 0 },
            { at: 5900, scale: 1.08, y: -1 },
            { at: 6690, scale: 1.0, y: 0 },
            { at: 7020, scale: 1.06, y: -1 },
          ]}
        />
      </AbsoluteFill>

      {/* one continuous paper bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <AgenticPricingVideo />

      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}
      </SlideLeftPush>
      {/* face → first cover (the $800 invoice) at ~90 */}
      <CutFlash at={90} peak={0.5} />
    </AbsoluteFill>
    </ThemeProvider>
  );
};
