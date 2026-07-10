import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const ELECTRIC_BLUE = "#C15F3C";
const CYAN = "#D97757";
const WHITE = "#FFFFFF";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "800"],
  subsets: ["latin"],
});

// This component owns the name and the subtitle so the Act-4 pulse and the
// Act-5 glow surge wrap both together. It is mounted at frame 30 (immediately
// after the Act-1 flash), so all timing below is LOCAL to that start:
//   global frame = local frame + 30
//   chromatic lock-in (global 50)  -> local 20
//   subtitle reveal (global 75)    -> local 45
//   pulse         (global 105-125) -> local 75-95
//   glow surge    (global 140-150) -> local 110-120
export const TitleReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Act 2: the name slams in from scale 1.8 -> 1.0 (spring, stiffness 400).
  const slam = spring({
    frame,
    fps,
    config: { stiffness: 400, damping: 30, mass: 0.9 },
    durationInFrames: 24,
  });
  const nameScale = interpolate(slam, [0, 1], [1.8, 1]);
  const nameOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chromatic aberration: cyan copy offset left, blue copy offset right. Both
  // start wide and snap toward their 3px resting offset, locking in by local 20.
  const chroma = interpolate(frame, [0, 20], [1, 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cyanX = -(3 + chroma * 21);
  const blueX = 3 + chroma * 21;

  // --- Act 4: a single barely-perceptible pulse, scale 1.0 -> 1.02 -> 1.0.
  const pulse = interpolate(frame, [75, 85, 95], [0, 1, 0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseScale = 1 + pulse * 0.02;

  // --- Act 3: subtitle rises 30px into place below the name.
  const subRise = spring({
    frame: frame - 45,
    fps,
    config: { stiffness: 120, damping: 22 },
    durationInFrames: 24,
  });
  const subOpacity = interpolate(frame, [45, 57], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(subRise, [0, 1], [30, 0]);

  // --- Act 5: the glow behind the name intensifies in the final 10 frames as
  // the system reaches full charge.
  const glowBlur = interpolate(frame, [110, 120], [46, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowSpread = interpolate(frame, [110, 120], [0.35, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nameStyle: React.CSSProperties = {
    margin: 0,
    fontFamily,
    fontWeight: 800,
    fontSize: 96,
    letterSpacing: 18,
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 34,
          transform: `scale(${pulseScale})`,
        }}
      >
        {/* Name block — three layered copies for chromatic aberration. */}
        <div style={{ position: "relative", opacity: nameOpacity }}>
          {/* Cyan copy (offset left) */}
          <h1
            style={{
              ...nameStyle,
              position: "absolute",
              inset: 0,
              color: CYAN,
              opacity: 0.4,
              transform: `translateX(${cyanX}px) scale(${nameScale})`,
            }}
          >
            KRIS TORRINGTON
          </h1>
          {/* Blue copy (offset right) */}
          <h1
            style={{
              ...nameStyle,
              position: "absolute",
              inset: 0,
              color: ELECTRIC_BLUE,
              opacity: 0.4,
              transform: `translateX(${blueX}px) scale(${nameScale})`,
            }}
          >
            KRIS TORRINGTON
          </h1>
          {/* Hot-white base text */}
          <h1
            style={{
              ...nameStyle,
              position: "relative",
              color: WHITE,
              transform: `scale(${nameScale})`,
              textShadow: `0 0 ${glowBlur}px rgba(59,130,246,${glowSpread})`,
            }}
          >
            KRIS TORRINGTON
          </h1>
        </div>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontFamily,
            fontWeight: 400,
            fontSize: 32,
            letterSpacing: "0.4em",
            textIndent: "0.4em",
            color: ELECTRIC_BLUE,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
          }}
        >
          AI AUTOMATION
        </p>
      </div>
    </AbsoluteFill>
  );
};
