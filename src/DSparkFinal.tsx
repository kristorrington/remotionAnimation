import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { DSparkVideo, CUTAWAY_WINDOWS } from "./DSparkVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";

// Final combined cut: talking head + DSpark animation track + steady PiP + flashes.
const FOOTAGE = "talking-head.mp4";

// Merge the covers (+ gaps ≤ PIP_GAP_MAX) into continuous spans, then render ONE
// bridge background + ONE CornerPip per span (§8). The PiP mounts once and holds
// steady across the whole span — no per-card flicker at topic changes — and short
// talking gaps stay covered instead of flashing the full face. Only real >6s
// talking beats (outside any span) show the full face.
const PIP_GAP_MAX = 180; // 6s
const COVERS = [...CUTAWAY_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// Soft dip-to-white on the biggest turns (spoken-frame beats).
const FLASHES = [629, 3875, 5807, 10278];

export const DSparkFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FootageDirector footage={FOOTAGE} />

      {/* one continuous dark bridge per span, UNDER the cards (cards paint on top) */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <DSparkVideo />

      {/* one steady PiP per span — no remount at topic changes */}
      {SPANS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}

      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={0.5} />
      ))}
    </AbsoluteFill>
  );
};
