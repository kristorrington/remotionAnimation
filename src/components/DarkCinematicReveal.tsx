import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

const BLUE = "#C15F3C";
const CYAN = "#D97757";
const WHITE = "#FFFFFF";
const TITLE = "KRIS TORRINGTON";
const CHROMA_PX = 4; // chromatic aberration offset at the slam (per spec)

// BEAT 1 (f0–54) — "want to make animations like this"
// Dark cinematic reveal: shockwave ring → camera flash → chromatic title slam.
export const DarkCinematicReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // f8–20: electric-blue shockwave ring scales 0 → full screen width.
  const ring = spring({
    frame: frame - 8,
    fps,
    config: { stiffness: 300, damping: 26, mass: 0.6 },
    durationInFrames: 12,
  });
  const ringDiameter = interpolate(ring, [0, 1], [0, 1920]);
  const ringOpacity = interpolate(frame, [8, 11, 18, 24], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Soft radial blue glow behind everything (~20%).
  const glowOpacity = interpolate(frame, [8, 20], [0, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // f18–20: full white flash for exactly 3 frames.
  const flash = interpolate(frame, [17, 18, 20, 21], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // f21+: "KRIS TORRINGTON" slams in (scale 1.6 → 1.0, spring stiffness 400).
  const slam = spring({
    frame: frame - 21,
    fps,
    config: { stiffness: 400, damping: 30, mass: 0.9 },
    durationInFrames: 26,
  });
  const titleScale = interpolate(slam, [0, 1], [1.6, 1]);
  const titleOpacity = interpolate(frame, [21, 29], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Chromatic offset starts at 4px and locks to aligned by f40.
  const chroma = interpolate(frame, [21, 40], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const off = CHROMA_PX * chroma;

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily,
    fontWeight: 800,
    fontSize: 90,
    letterSpacing: 12,
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", justifyContent: "center", alignItems: "center" }}>
      {/* Radial blue glow */}
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,1) 0%, rgba(59,130,246,0.35) 25%, transparent 60%)",
        }}
      />

      {/* Shockwave ring */}
      <div
        style={{
          position: "absolute",
          width: ringDiameter,
          height: ringDiameter,
          borderRadius: "50%",
          border: `3px solid ${BLUE}`,
          opacity: ringOpacity,
          boxShadow: `0 0 30px ${BLUE}, inset 0 0 30px rgba(59,130,246,0.5)`,
        }}
      />

      {/* Chromatic title */}
      <div style={{ position: "relative", opacity: titleOpacity, transform: `scale(${titleScale})` }}>
        <div style={{ ...titleStyle, position: "absolute", inset: 0, color: CYAN, opacity: 0.4, transform: `translateX(${-off}px)` }}>
          {TITLE}
        </div>
        <div style={{ ...titleStyle, position: "absolute", inset: 0, color: BLUE, opacity: 0.4, transform: `translateX(${off}px)` }}>
          {TITLE}
        </div>
        <div style={{ ...titleStyle, position: "relative", color: WHITE, textShadow: "0 0 36px rgba(59,130,246,0.5)" }}>
          {TITLE}
        </div>
      </div>

      {/* Camera flash */}
      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash }} />
    </AbsoluteFill>
  );
};
