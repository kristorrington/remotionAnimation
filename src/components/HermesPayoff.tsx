import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, CYAN, FONT, MONO, WHITE } from "./overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Local sync points (Sequence starts at f274):
//   "Hermes"          f330 -> 56     "Playwright MCP"   f365 -> 91
//   "real browser"    f410 -> 136    "inside WSL"       f470 -> 196
//   "on Windows"      f488 -> 214
const HERMES_AT = 50;
const PW_AT = 88;
const SUB1_AT = 130; // control a real browser
const SUB2_AT = 196; // inside WSL
const SUB3_AT = 214; // on Windows

// BEAT 3 (f274–520) — "connecting Hermes to Playwright MCP … real browser, WSL, Windows"
// The solution payoff: brand lockup + a building subtitle.
export const HermesPayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kicker that bridges before the brand slams.
  const kicker = interpolate(frame, [5, 15, HERMES_AT - 4, HERMES_AT + 4], [0, 1, 1, 0], CLAMP);

  // HERMES slam.
  const slam = spring({ frame: frame - HERMES_AT, fps, config: { stiffness: 400, damping: 30, mass: 0.9 }, durationInFrames: 26 });
  const hScale = interpolate(slam, [0, 1], [1.6, 1]);
  const hOpacity = interpolate(frame, [HERMES_AT, HERMES_AT + 8], [0, 1], CLAMP);
  const chroma = interpolate(frame, [HERMES_AT, HERMES_AT + 22], [1, 0], CLAMP);
  const off = 6 * chroma;

  // "✕ PLAYWRIGHT MCP" line.
  const pw = spring({ frame: frame - PW_AT, fps, config: { stiffness: 200, damping: 18, mass: 0.7 }, durationInFrames: 18 });
  const pwY = interpolate(pw, [0, 1], [22, 0]);
  const pwOpacity = interpolate(frame, [PW_AT, PW_AT + 10], [0, 1], CLAMP);

  // Glow pulse, intensifies toward the end.
  const glow = (0.5 + 0.5 * Math.sin(frame * 0.12)) * interpolate(frame, [HERMES_AT, HERMES_AT + 20], [0, 1], CLAMP);
  const endGlow = interpolate(frame, [200, 246], [0, 1], CLAMP);

  const subPart = (at: number) => ({
    opacity: interpolate(frame, [at, at + 10], [0, 1], CLAMP),
    transform: `translateY(${interpolate(spring({ frame: frame - at, fps, config: { stiffness: 140, damping: 20 }, durationInFrames: 14 }), [0, 1], [14, 0])}px)`,
  });

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: FONT,
    fontWeight: 800,
    fontSize: 132,
    letterSpacing: 8,
    whiteSpace: "nowrap",
    lineHeight: 1,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", justifyContent: "center", alignItems: "center" }}>
      {/* Brand glow */}
      <AbsoluteFill
        style={{
          opacity: 0.18 + 0.32 * glow + 0.25 * endGlow,
          background: "radial-gradient(circle at 50% 45%, rgba(59,130,246,0.5) 0%, transparent 55%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {/* Kicker */}
        <span style={{ position: "absolute", top: -90, opacity: kicker, fontFamily: MONO, fontSize: 26, letterSpacing: 8, color: CYAN }}>
          CONNECTING
        </span>

        {/* HERMES */}
        <div style={{ position: "relative", opacity: hOpacity, transform: `scale(${hScale})` }}>
          <div style={{ ...titleStyle, position: "absolute", inset: 0, color: CYAN, opacity: 0.4, transform: `translateX(${-off}px)` }}>HERMES</div>
          <div style={{ ...titleStyle, position: "absolute", inset: 0, color: BLUE, opacity: 0.4, transform: `translateX(${off}px)` }}>HERMES</div>
          <div style={{ ...titleStyle, position: "relative", color: WHITE, textShadow: `0 0 ${30 + 30 * endGlow}px rgba(59,130,246,${0.5 + 0.4 * endGlow})` }}>HERMES</div>
        </div>

        {/* ✕ PLAYWRIGHT MCP */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: pwOpacity, transform: `translateY(${pwY}px)` }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: CYAN, textShadow: `0 0 20px ${CYAN}` }}>✕</span>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 52, letterSpacing: 2, color: WHITE }}>PLAYWRIGHT MCP</span>
        </div>

        {/* Building subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontFamily: MONO, fontSize: 30, color: "rgba(255,255,255,0.78)" }}>
          <span style={subPart(SUB1_AT)}>control a real browser</span>
          <span style={{ ...subPart(SUB2_AT), color: CYAN }}>· inside WSL</span>
          <span style={{ ...subPart(SUB3_AT), color: CYAN }}>· on Windows</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
