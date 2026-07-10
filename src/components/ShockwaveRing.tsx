import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ELECTRIC_BLUE = "#C15F3C";

// Act 1 — Signal detected.
// A single electric-blue pixel appears dead centre at frame 8, then expands
// outward as a perfect ring (spring, stiffness 300) like a shockwave. When the
// ring reaches the screen edges it triggers a 3-frame pure-white camera flash.
// A low-opacity radial glow bleeds outward behind the ring.
export const ShockwaveRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The dot is born at frame 8.
  const ring = spring({
    frame: frame - 8,
    fps,
    config: { stiffness: 300, damping: 26, mass: 0.6 },
    durationInFrames: 14,
  });

  // Grow from a 6px dot to a diameter that overshoots the screen so the ring
  // travels fully off-frame.
  const diameter = interpolate(ring, [0, 1], [6, 2600]);

  // Crisp ring border that stays thin as the element grows (we animate
  // width/height, not transform scale, so the 2px stroke never thickens).
  const ringOpacity = interpolate(frame, [8, 10, 18, 26], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera flash: full white for exactly frames 20, 21, 22.
  const flash = interpolate(frame, [19, 20, 22, 23], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Radial glow bleed behind the ring.
  const glowOpacity = interpolate(frame, [8, 20, 45], [0, 0.2, 0.12], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Radial glow bleed */}
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle at 50% 50%, ${ELECTRIC_BLUE} 0%, rgba(193,95,60,0.35) 22%, transparent 60%)`,
        }}
      />

      {/* Expanding ring / origin dot */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: diameter,
            height: diameter,
            borderRadius: "50%",
            border: `2px solid ${ELECTRIC_BLUE}`,
            opacity: ringOpacity,
            boxShadow: `0 0 28px ${ELECTRIC_BLUE}, inset 0 0 28px rgba(193,95,60,0.5)`,
          }}
        />
      </AbsoluteFill>

      {/* Camera flash */}
      <AbsoluteFill
        style={{ backgroundColor: "#FFFFFF", opacity: flash }}
      />
    </AbsoluteFill>
  );
};
