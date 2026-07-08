import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FableCountdownVideo, FABLE_COUNTDOWN_WINDOWS, FABLE_COUNTDOWN_FULLSCREEN } from "./FableCountdownVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";

// Final combined cut: talking head + countdown animation track + per-span PiP
// (§8 of AGENTS.md — one PiP per merged span, never per card). During
// FABLE_COUNTDOWN_FULLSCREEN spans the animation OWNS the screen — no PiP — so
// the hook, gags, systems and payoffs feel like a cartoon, not a presentation.
const FOOTAGE = "talking-head.mp4";
const VO_BOOST = 1.6; // source peaks at −8.9 dB → lift the voice to lead the mix

const PIP_GAP_MAX = 180; // 6s
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...FABLE_COUNTDOWN_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...FABLE_COUNTDOWN_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// Soft dip-to-white on the biggest turns (spoken-frame beats):
// the countdown slam · the clean rules · the drama timeline · the reroute · the signal.
const FLASHES = [242, 1093, 3952, 6659, 9161];

export const FableCountdownFinal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <FootageDirector footage={FOOTAGE} volume={VO_BOOST} />

      {/* one continuous dark bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <FableCountdownVideo />

      {/* steady PiP — except where the animation owns the whole screen */}
      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}

      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={0.5} />
      ))}
    </AbsoluteFill>
  );
};
