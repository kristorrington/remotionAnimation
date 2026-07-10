import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, FONT, MONO, PILL_BORDER, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// f17000–17500 — next-video teaser (host Hermes on a VPS with Hostinger).
export const GmailOutro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 6, fps, config: { stiffness: 220, damping: 18, mass: 0.8 }, durationInFrames: 22 });
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const op = interpolate(frame, [6, 18], [0, 1], CLAMP);
  const subOp = interpolate(frame, [40, 56], [0, 1], CLAMP);
  const ctaOp = interpolate(frame, [320, 340], [0, 1], CLAMP);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, transform: `scale(${scale})`, opacity: op }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: CYAN }}>NEXT VIDEO →</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: WHITE, textShadow: `0 0 ${40 + 26 * glow}px rgba(59,130,246,${0.5 + 0.3 * glow})` }}>
          HOST HERMES ON A VPS
        </span>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, opacity: subOp, padding: "12px 24px", borderRadius: 999, background: "rgba(20,16,13,0.8)", border: PILL_BORDER }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
          <span style={{ fontFamily: MONO, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>run 24/7 with Hostinger</span>
        </div>
        <span style={{ marginTop: 12, fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: WHITE, opacity: ctaOp }}>
          Watch the next one →
        </span>
      </div>
    </AbsoluteFill>
  );
};
