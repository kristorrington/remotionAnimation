import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, CYAN, WHITE } from "../components/overlayUI";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { LightSweep, ParticleField, SceneCameraPush, GlowDivider } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The cinematic base every rich scene sits on: the project's dark aurora/grid
// backdrop + a particle field + a light sweep, with a slow camera push on the
// FOREGROUND content only (bg stays for parallax depth). Keeps the current
// identity; adds motion so it never reads as a static slide.
export const SceneShell: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  particleSeed?: number;
  sweep?: boolean;
  bgWords?: string[];
}> = ({ durationInFrames, children, particleSeed, sweep = true, bgWords }) => {
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} words={bgWords} />
      <ParticleField seed={particleSeed} />
      {sweep && <LightSweep />}
      <SceneCameraPush>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
      </SceneCameraPush>
    </AbsoluteFill>
  );
};

// Kicker + slamming glow headline + drawn divider — matches SectionCard's look so
// scenes feel like the same video. `titleSize` lets long titles fit.
export const SceneHeadline: React.FC<{ kicker?: string; title: string; titleSize?: number; accent?: string }> = ({ kicker, title, titleSize = 92, accent = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 300, damping: 26, mass: 0.8 }, durationInFrames: 20 });
  const titleScale = interpolate(slam, [0, 1], [1.35, 1]);
  const titleOp = interpolate(frame, [6, 16], [0, 1], CLAMP);
  const kickerOp = interpolate(frame, [0, 10], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      {kicker ? (
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: accent, opacity: kickerOp, filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" }}>{kicker}</span>
      ) : null}
      <div style={{ opacity: titleOp, transform: `scale(${titleScale})`, fontFamily: FONT, fontWeight: 800, fontSize: titleSize, letterSpacing: 1, color: WHITE, lineHeight: 1.02, textShadow: "0 0 40px rgba(59,130,246,0.55)" }}>
        {title}
      </div>
      <GlowDivider color={accent} />
    </div>
  );
};
