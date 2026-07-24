import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// SectionTransition — the small reusable transition SET (CLAUDE.md §15.5). Place
// one full-screen overlay at a cut frame; the content swap happens under it.
// Most edits stay direct cuts — use these only where they earn it. No spins,
// page curls, shakes or glitch wipes.
//   evidence     — fast 6-10f directional orange light-sweep (claim -> evidence)
//   counterpoint — brief tonal drop + subtle desaturation (before a caveat)
//   section      — restrained 10-16f dark / orange gradient wipe (major chapters)
//   verdict      — clean paper flash / reset (before the final recommendation)
export const SectionTransition: React.FC<{
  kind: "evidence" | "counterpoint" | "section" | "verdict";
  durationInFrames?: number;
}> = ({ kind, durationInFrames }) => {
  const frame = useCurrentFrame();

  if (kind === "evidence") {
    const dur = durationInFrames ?? 9;
    const x = interpolate(frame, [0, dur], [-40, 140], CLAMP); // sweep across
    const op = interpolate(frame, [0, 2, dur - 2, dur], [0, 1, 1, 0], CLAMP);
    return (
      <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translateX(${x}%) skewX(-14deg)`, background: `linear-gradient(90deg, transparent, ${PALETTE.opus}cc 45%, #fff 50%, ${PALETTE.opus}cc 55%, transparent)`, width: "60%" }} />
      </AbsoluteFill>
    );
  }

  if (kind === "counterpoint") {
    const dur = durationInFrames ?? 14;
    const op = interpolate(frame, [0, 5, dur - 5, dur], [0, 0.42, 0.42, 0], CLAMP); // brief tonal drop
    return <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(20,18,16,0.6), rgba(20,18,16,0.35))", backdropFilter: "saturate(0.7)", opacity: op }} />;
  }

  if (kind === "section") {
    const dur = durationInFrames ?? 14;
    const w = interpolate(frame, [0, dur * 0.55, dur], [0, 100, 100], CLAMP); // wipe in
    const x = interpolate(frame, [0, dur * 0.55, dur], [0, 0, 100], CLAMP); // then off
    return (
      <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: `${w}%`, background: `linear-gradient(90deg, ${PALETTE.ink}, ${PALETTE.opus})` }} />
      </AbsoluteFill>
    );
  }

  // verdict — a clean paper flash + settle (visual reset before the verdict)
  const dur = durationInFrames ?? 12;
  const op = interpolate(frame, [0, 3, dur], [0, 0.85, 0], CLAMP);
  return <AbsoluteFill style={{ pointerEvents: "none", background: PALETTE.paper, opacity: op }} />;
};
