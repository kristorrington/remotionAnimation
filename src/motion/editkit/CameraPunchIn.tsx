import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ZOOM_INTENSITY } from "./editMap";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// CameraPunchIn — synthesised digital camera movement on the talking-head layer
// (CLAUDE.md §15.2). Wrap the footage (OffthreadVideo) in this; it ramps the
// scale up on an emphasis line and returns smoothly to 100%. Eased, NO overshoot.
// - level "emphasis" = 106%, "strong" = 110%, or pass a raw scale (≤ ~1.12).
// - ramp 8-14f in AND out; hold at peak in between.
// - xShift = a subtle horizontal reframe (% of width) instead of a bigger zoom.
// Keep transformOrigin near the eyeline (default 50% 42%) so the chin/forehead
// never crop awkwardly. Never stack constant punch-ins (once per 15-30s).
export const CameraPunchIn: React.FC<{
  children: React.ReactNode;
  at: number;
  level?: "emphasis" | "strong" | number;
  hold?: number;
  ramp?: number;
  xShift?: number;
  origin?: string;
}> = ({ children, at, level = "emphasis", hold = 40, ramp = 11, xShift = 0, origin = "50% 42%" }) => {
  const frame = useCurrentFrame();
  const rawPeak = typeof level === "number" ? level : level === "strong" ? 1.1 : 1.06;
  // ZOOM_INTENSITY scales the delta from 1.0 so the whole edit dials in one place
  const peak = 1 + (rawPeak - 1) * ZOOM_INTENSITY;
  const inEnd = at + ramp;
  const outStart = at + ramp + hold;
  const outEnd = outStart + ramp;
  const ease = { ...CLAMP, easing: Easing.inOut(Easing.cubic) } as const;
  const scale = interpolate(frame, [at, inEnd, outStart, outEnd], [1, peak, peak, 1], ease);
  const tx = interpolate(frame, [at, inEnd, outStart, outEnd], [0, xShift, xShift, 0], ease);
  return (
    <AbsoluteFill style={{ transform: `translateX(${tx}%) scale(${scale})`, transformOrigin: origin, overflow: "hidden" }}>
      {children}
    </AbsoluteFill>
  );
};
