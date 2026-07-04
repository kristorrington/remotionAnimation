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

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// f13999–14589 — "subscribe for more AI tutorials" + next-video teaser (host on a VPS).
export const HermesVideoOutro: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame: frame - 5, fps, config: { stiffness: 170, damping: 16, mass: 0.8 }, durationInFrames: 20 });
  const enterScale = interpolate(enter, [0, 1], [0.6, 1]);
  const enterOpacity = interpolate(frame, [5, 16], [0, 1], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16);
  const btnScale = enterScale * (1 + 0.05 * pulse);

  // Next-video teaser slides up later (L183+).
  const teaser = spring({ frame: frame - 150, fps, config: { stiffness: 150, damping: 19 }, durationInFrames: 18 });
  const teaserY = interpolate(teaser, [0, 1], [40, 0]);
  const teaserOpacity = interpolate(frame, [150, 166], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, opacity: enterOpacity }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: CYAN }}>ENJOYED THIS?</span>

        <div style={{ transform: `scale(${btnScale})`, display: "inline-flex", alignItems: "center", gap: 16, padding: "20px 44px", borderRadius: 14, background: RED, boxShadow: "0 18px 44px rgba(0,0,0,0.5)" }}>
          <span style={{ display: "inline-block", width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: `20px solid ${WHITE}` }} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, letterSpacing: 2, color: WHITE }}>SUBSCRIBE</span>
        </div>

        {/* Next video teaser */}
        <div style={{ opacity: teaserOpacity, transform: `translateY(${teaserY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 40px", borderRadius: 18, background: "rgba(8,12,20,0.8)", border: PILL_BORDER, marginTop: 10 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: CYAN }}>NEXT VIDEO</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: WHITE }}>Host Hermes on a VPS</span>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,0.72)" }}>keep it running 24/7, off your machine</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
