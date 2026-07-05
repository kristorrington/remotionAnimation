import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT, WHITE } from "../components/overlayUI";
import { SceneShell } from "./SceneShell";
import { ImpactStamp, GlowDivider } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// A strong single-message payoff — kicker, oversized glow title, subtitle, and a
// slamming stamp. Stronger camera push + no bullets. For "an infrastructure
// moment" / the closing question.
export const FinalTakeawayScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; subtitle?: string; stamp?: string; accent?: string; stampAt?: number }> = ({
  durationInFrames,
  kicker,
  title,
  subtitle,
  stamp,
  accent = "#06B6D4",
  stampAt = 40,
}) => {
  const frame = useCurrentFrame();
  const kOp = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const tOp = interpolate(frame, [8, 20], [0, 1], CLAMP);
  const tScale = interpolate(frame, [8, 26], [1.18, 1], CLAMP);
  const sOp = interpolate(frame, [22, 34], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xf1}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center", padding: "0 90px" }}>
        {kicker ? <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: accent, opacity: kOp }}>{kicker}</span> : null}
        <div style={{ opacity: tOp, transform: `scale(${tScale})`, fontFamily: FONT, fontWeight: 800, fontSize: 118, lineHeight: 1.0, color: WHITE, letterSpacing: 1, textShadow: `0 0 60px ${accent}66` }}>{title}</div>
        <GlowDivider width={380} color={accent} />
        {subtitle ? <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 40, color: "rgba(255,255,255,0.82)", opacity: sOp }}>{subtitle}</span> : null}
        {stamp ? <div style={{ marginTop: 22 }}><ImpactStamp text={stamp} at={stampAt} color={accent} /></div> : null}
      </div>
    </SceneShell>
  );
};
