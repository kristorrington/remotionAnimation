import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ClaudeWealthVideo, CLAUDE_WEALTH_WINDOWS } from "./ClaudeWealthVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";

// Final combined cut: talking head + Claude-wealth animation track + steady
// per-span PiP + flashes (§8 of AGENTS.md — one PiP per merged span, never per
// card, so topic changes never flicker).
const FOOTAGE = "talking-head-070726.mp4";

const PIP_GAP_MAX = 180; // 6s
const COVERS = [...CLAUDE_WEALTH_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// Soft dip-to-white on the biggest turns (spoken-frame beats):
// Medvi intro · Vulcan pivot · Jensen's grenade · the closing verdict.
const FLASHES = [1884, 4590, 9528, 15087];

export const ClaudeWealthFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FootageDirector footage={FOOTAGE} />

      {/* one continuous dark bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <ClaudeWealthVideo />

      {/* one steady PiP per span */}
      {SPANS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}

      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={0.5} />
      ))}
    </AbsoluteFill>
  );
};
