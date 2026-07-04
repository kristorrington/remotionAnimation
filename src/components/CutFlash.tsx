import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A fast dip-to-white flash used as a transition accent at a dramatic cut.
// Kept short (a few frames) so it reads as energy, not a slow cheap wipe.
const Flash: React.FC<{ peak: number; dur: number; color: string }> = ({ peak, dur, color }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, dur / 2, dur], [0, peak, 0], CLAMP);
  return <AbsoluteFill style={{ backgroundColor: color, opacity, pointerEvents: "none" }} />;
};

// Fire a flash centered on frame `at`.
export const CutFlash: React.FC<{ at: number; peak?: number; dur?: number; color?: string }> = ({
  at,
  peak = 0.7,
  dur = 7,
  color = "#FFFFFF",
}) => (
  <Sequence from={Math.round(at - dur / 2)} durationInFrames={dur}>
    <Flash peak={peak} dur={dur} color={color} />
  </Sequence>
);
