import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SideHustleVideo, SIDE_HUSTLE_WINDOWS, SIDE_HUSTLE_FULLSCREEN } from "./SideHustleVideo";
import { CutFlash } from "./components/CutFlash";
import { FootageDirector } from "./components/FootageDirector";
import { CornerPip } from "./components/CornerPip";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { ThemeProvider } from "./theme";

// Final combined cut: talking head + side-hustle animation track + per-span
// PiP (§8 of AGENTS.md — one PiP per merged span, never per card). During
// SIDE_HUSTLE_FULLSCREEN spans the animation OWNS the screen — no PiP.
const FOOTAGE = "talking-head.mp4";

const PIP_GAP_MAX = 180; // 6s
const PIP_MIN = 90; // never show a PiP segment shorter than 3s (flicker)
const COVERS = [...SIDE_HUSTLE_WINDOWS].sort((a, b) => a.from - b.from);
const SPANS: { from: number; to: number }[] = [];
for (const c of COVERS) {
  const last = SPANS[SPANS.length - 1];
  if (last && c.from - last.to <= PIP_GAP_MAX) last.to = Math.max(last.to, c.from + c.dur);
  else SPANS.push({ from: c.from, to: c.from + c.dur });
}

// PiP segments = spans minus the fullscreen windows (animation-only moments)
const FULL = [...SIDE_HUSTLE_FULLSCREEN].sort((a, b) => a.from - b.from);
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

// Soft dip-to-white on the biggest turns: the face→animation open cut (§8
// face-first rule) · the five doors · path 1 · path 3 · the three-buyers gate ·
// the 30-day window.
const FLASHES = [90, 505, 3343, 7500, 12844, 13423];

export const SideHustleFinal: React.FC = () => {
  return (
    // paper theme: the per-span bridges + PiP chrome match the overlay's ivory
    <ThemeProvider style="paper">
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* VO boost 1.6× (source peaks ≈ −9 dB, same rig as the last recording —
          re-probe with volumedetect after the proxy lands if the mix drifts) */}
      <FootageDirector footage={FOOTAGE} volume={1.6} />

      {/* one continuous dark bridge per span, UNDER the cards */}
      {SPANS.map((s) => (
        <Sequence key={`bg-${s.from}`} from={s.from} durationInFrames={s.to - s.from}>
          <AnimatedBackground durationInFrames={s.to - s.from} fade={false} />
        </Sequence>
      ))}

      <SideHustleVideo />

      {/* steady PiP — except where the animation owns the whole screen */}
      {PIP_SEGMENTS.map((s) => (
        <CornerPip key={`pip-${s.from}`} footage={FOOTAGE} from={s.from} dur={s.to - s.from} />
      ))}

      {FLASHES.map((f) => (
        <CutFlash key={f} at={f} peak={0.5} />
      ))}
    </AbsoluteFill>
    </ThemeProvider>
  );
};
