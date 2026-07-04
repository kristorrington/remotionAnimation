import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const GRID = 64; // px cell size

// Act 4 — a faint grid fades in at ~4% opacity to give a HUD / data-environment
// feel. A soft radial mask keeps the edges dark so it never reads as clutter.
export const HUDGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 18], [0, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(to right, rgba(59,130,246,1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59,130,246,1) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID}px ${GRID}px`,
        WebkitMaskImage:
          "radial-gradient(circle at 50% 50%, black 0%, black 40%, transparent 75%)",
        maskImage:
          "radial-gradient(circle at 50% 50%, black 0%, black 40%, transparent 75%)",
      }}
    />
  );
};
