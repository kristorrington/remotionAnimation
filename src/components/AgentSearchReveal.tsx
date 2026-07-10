import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, WHITE } from "./overlayUI";

const GREEN = "#34D399";
const TITLE = "AI AGENTS";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// BEAT 1 (f0–63) — "most AI agents can search the web"
// Dark cinematic reveal establishing the baseline: search works (green check).
export const AgentSearchReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ring = spring({ frame: frame - 6, fps, config: { stiffness: 300, damping: 26, mass: 0.6 }, durationInFrames: 12 });
  const ringDiameter = interpolate(ring, [0, 1], [0, 1920]);
  const ringOpacity = interpolate(frame, [6, 9, 16, 22], [0, 1, 1, 0], CLAMP);
  const glowOpacity = interpolate(frame, [6, 18], [0, 0.2], CLAMP);
  const flash = interpolate(frame, [15, 16, 18, 19], [0, 1, 1, 0], CLAMP);

  const slam = spring({ frame: frame - 20, fps, config: { stiffness: 400, damping: 30, mass: 0.9 }, durationInFrames: 26 });
  const titleScale = interpolate(slam, [0, 1], [1.6, 1]);
  const titleOpacity = interpolate(frame, [20, 28], [0, 1], CLAMP);
  const chroma = interpolate(frame, [20, 40], [1, 0], CLAMP);
  const off = 6 * chroma;

  const subSpring = spring({ frame: frame - 22, fps, config: { stiffness: 120, damping: 20 }, durationInFrames: 18 });
  const subY = interpolate(subSpring, [0, 1], [16, 0]);
  const subOpacity = interpolate(frame, [22, 34], [0, 1], CLAMP);

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 96,
    letterSpacing: 12,
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#020202", justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(circle at 50% 50%, rgba(193,95,60,1) 0%, rgba(193,95,60,0.35) 25%, transparent 60%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: ringDiameter,
          height: ringDiameter,
          borderRadius: "50%",
          border: `3px solid ${BLUE}`,
          opacity: ringOpacity,
          boxShadow: `0 0 30px ${BLUE}, inset 0 0 30px rgba(193,95,60,0.5)`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", opacity: titleOpacity, transform: `scale(${titleScale})` }}>
          <div style={{ ...titleStyle, position: "absolute", inset: 0, color: CYAN, opacity: 0.4, transform: `translateX(${-off}px)` }}>{TITLE}</div>
          <div style={{ ...titleStyle, position: "absolute", inset: 0, color: BLUE, opacity: 0.4, transform: `translateX(${off}px)` }}>{TITLE}</div>
          <div style={{ ...titleStyle, position: "relative", color: WHITE, textShadow: "0 0 36px rgba(193,95,60,0.5)" }}>{TITLE}</div>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          <span style={{ color: GREEN, fontWeight: 800, textShadow: `0 0 16px ${GREEN}` }}>✓</span>
          can search the web
        </div>
      </div>

      <AbsoluteFill style={{ backgroundColor: WHITE, opacity: flash }} />
    </AbsoluteFill>
  );
};
