import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

const CYAN = "#06B6D4";

// Act 3 — a thin cyan radar sweep crosses the full composition left to right,
// completing just as the subtitle finishes locking in. A soft trailing glow
// follows the leading edge like a radar ping.
export const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();

  // Sweep from just off the left edge to just off the right edge.
  const x = interpolate(frame, [0, 24], [-2, 102], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 3, 24, 30], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Trailing glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${x}%`,
          width: 160,
          transform: "translateX(-160px)",
          background: `linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.25) 100%)`,
        }}
      />
      {/* Leading edge */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${x}%`,
          width: 2,
          backgroundColor: CYAN,
          boxShadow: `0 0 16px ${CYAN}, 0 0 32px ${CYAN}`,
        }}
      />
    </AbsoluteFill>
  );
};
