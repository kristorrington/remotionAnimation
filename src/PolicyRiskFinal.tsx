import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { PolicyRiskVideo, CUTAWAY_WINDOWS } from "./PolicyRiskVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";

// Final combined cut: talking head + PolicyRiskVideo animation track + PiP + flashes.
const FOOTAGE = "talking-head.mp4";

// Every full-screen cover in the timeline (cards + compare + outro). Used to find
// the SHORT gaps between them, where the big talking-head face would otherwise
// flash for a fraction of a second between two cutaways.
const COVERS = [...CUTAWAY_WINDOWS, { from: 13560, dur: 890 }].sort((a, b) => a.from - b.from);

// Bridge any gap ≤ ~1.3s: hold the dark cutaway background (and the corner PiP)
// across it so it cuts card → card without revealing the full face. Overlap 16f
// into each neighbour so the background's fade edges stay hidden under the cards.
const BRIDGE_MAX = 40;
const BRIDGES: { from: number; dur: number }[] = [];
for (let i = 0; i < COVERS.length - 1; i++) {
  const end = COVERS[i].from + COVERS[i].dur;
  const gap = COVERS[i + 1].from - end;
  if (gap > 0 && gap <= BRIDGE_MAX) BRIDGES.push({ from: end - 16, dur: gap + 32 });
}

// Soft dip-to-white on the biggest turns.
const FLASHES = [628, 2771, 5390, 10268, 13560];

export const PolicyRiskFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FootageDirector footage={FOOTAGE} />

      {/* dark cutaway background bridging the short gaps (below the cards).
          fade={false}: the bridge must stay FULLY OPAQUE — it sits under two
          crossfading cards, and a fading bridge lets the face bleed through. */}
      {BRIDGES.map((b) => (
        <Sequence key={`bridge-${b.from}`} from={b.from} durationInFrames={b.dur}>
          <AnimatedBackground durationInFrames={b.dur} fade={false} />
        </Sequence>
      ))}

      <PolicyRiskVideo />

      {/* corner PiP during every cutaway AND every bridge, so the presenter stays
          in the corner instead of the frame cutting to the full face */}
      {[...CUTAWAY_WINDOWS, ...BRIDGES].map((w) => (
        <CornerPip key={`pip-${w.from}`} footage={FOOTAGE} from={w.from} dur={w.dur} />
      ))}

      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={f === 13560 ? 0.6 : 0.5} />
      ))}
    </AbsoluteFill>
  );
};
