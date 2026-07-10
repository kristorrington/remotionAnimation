import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CYAN, FONT, PILL_BORDER, RED, WHITE } from "./overlayUI";
import { AnimatedBackground } from "./AnimatedBackground";
import { ClaudeMark } from "./Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Outro — subscribe + a one-line takeaway. Reused across videos via props.
export const Fable5Outro: React.FC<{ durationInFrames: number; kicker?: string; tag?: string }> = ({
  durationInFrames,
  kicker = "FOUND THIS USEFUL?",
  tag = "Test Fable 5 now — but keep a backup plan",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 6, fps, config: { stiffness: 200, damping: 18, mass: 0.8 }, durationInFrames: 20 });
  const enterOp = interpolate(frame, [6, 18], [0, 1], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16);
  const btnScale = interpolate(enter, [0, 1], [0.6, 1]) * (1 + 0.05 * pulse);
  const tagOp = interpolate(frame, [40, 56], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: enterOp }}>
        <ClaudeMark size={110} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 6, color: CYAN }}>{kicker}</span>
        <div style={{ transform: `scale(${btnScale})`, display: "inline-flex", alignItems: "center", gap: 16, padding: "20px 44px", borderRadius: 14, background: RED, boxShadow: "0 18px 44px rgba(0,0,0,0.5)" }}>
          <span style={{ display: "inline-block", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `20px solid ${WHITE}` }} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, letterSpacing: 2, color: WHITE }}>SUBSCRIBE</span>
        </div>
        <div style={{ opacity: tagOp, display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 999, background: "rgba(20,16,13,0.8)", border: PILL_BORDER }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>{tag}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
