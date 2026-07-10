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

const DARK = "#0A0A0A";

// Each word bursts in from a different direction, staggered 2 frames apart.
const WORDS: { text: string; from: "top" | "left" | "bottom" }[] = [
  { text: "PROMPT.", from: "top" },
  { text: "BUILD.", from: "left" },
  { text: "ANIMATE.", from: "bottom" },
];

// BEAT 2 (f54–69, 15 frames) — "or this"
// HARD CUT to opposite energy: bright gradient, dark words punching in fast.
export const KineticBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        // Bright diagonal gradient — full energy from frame 0 (no fade-in).
        background: `linear-gradient(135deg, ${"#D97757"} 0%, ${"#C15F3C"} 50%, ${"#FFFFFF"} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {WORDS.map((w, i) => {
          const s = spring({
            frame: frame - i * 2,
            fps,
            config: { stiffness: 350, damping: 20, mass: 0.6 },
            durationInFrames: 14,
          });
          const tx = w.from === "left" ? interpolate(s, [0, 1], [-560, 0]) : 0;
          const ty =
            w.from === "top"
              ? interpolate(s, [0, 1], [-320, 0])
              : w.from === "bottom"
                ? interpolate(s, [0, 1], [320, 0])
                : 0;
          const opacity = interpolate(s, [0, 0.4], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={w.text}
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 96,
                letterSpacing: 2,
                color: DARK,
                lineHeight: 1.02,
                transform: `translate(${tx}px, ${ty}px)`,
                opacity,
              }}
            >
              {w.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
