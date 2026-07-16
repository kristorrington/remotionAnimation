import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { FONT, SERIF, CYAN } from "../components/overlayUI";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { LightSweep, ParticleField, SceneCameraPush, GlowDivider } from "../motion/primitives";
import { DepthProps, useImpactShake } from "../motion/cinematics";
import { useTheme } from "../theme";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scene mood: a subtle emotional wash matched to the beat. "danger" pulses a
// red vignette; "win" sweeps a green glow. Neutral = the classic shell.
const MoodWash: React.FC<{ mood: "danger" | "win" }> = ({ mood }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16);
  if (mood === "danger") {
    // edge-only vignette — the center must stay clean (no milky wash)
    return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 58%, rgba(198,91,82,${0.1 + 0.07 * pulse}) 100%)` }} />;
  }
  return <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 50% 100%, rgba(79,169,138,${0.06 + 0.04 * pulse}), transparent 55%)` }} />;
};

// Ambient TOPIC tint — SOFT (premium pass 13.6): each scene reads as a
// different chapter via HUE, but colour never becomes a nursery wash. Three
// gradient geometries rotate by the
// scene's seed (top aurora / diagonal sweep / bottom horizon), so even two
// same-colour scenes get a different wash shape. Exported for scenes that
// don't sit on SceneShell (e.g. CompareCard).
export const TintWash: React.FC<{ tint: string; seed?: number }> = ({ tint, seed = 0 }) => {
  const variant = seed % 3;
  const background =
    variant === 0
      ? `linear-gradient(175deg, ${tint}22 0%, transparent 46%), radial-gradient(ellipse 120% 50% at 50% 112%, ${tint}18, transparent 70%)`
      : variant === 1
        ? `linear-gradient(118deg, ${tint}24 0%, transparent 52%), radial-gradient(ellipse 70% 90% at 88% 78%, ${tint}16, transparent 68%)`
        : `radial-gradient(ellipse 95% 75% at 50% 28%, ${tint}20, transparent 68%), linear-gradient(0deg, ${tint}1e 0%, transparent 38%)`;
  return <AbsoluteFill style={{ background, pointerEvents: "none" }} />;
};

// The cinematic base every rich scene sits on: the project's dark aurora/grid
// backdrop + a particle field + a light sweep, with a slow camera push on the
// FOREGROUND content only (bg stays for parallax depth).
// `mood` tints the shell to the beat's emotion; `depth` adds background props;
// `impacts` are frames where hits land — the CAMERA shakes with them.
// `tint` is an ambient TOPIC hue (green = savings, amber = cost, red = trap,
// cyan = system) rendered via TintWash.
export const SceneShell: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  particleSeed?: number;
  sweep?: boolean;
  bgWords?: string[];
  mood?: "neutral" | "danger" | "win";
  depth?: boolean;
  impacts?: number[];
  tint?: string;
}> = ({ durationInFrames, children, particleSeed, sweep = true, bgWords, mood = "neutral", depth = false, impacts, tint }) => {
  const shake = useImpactShake(impacts ?? []);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <AnimatedBackground durationInFrames={durationInFrames} words={bgWords} />
      {tint && <TintWash tint={tint} seed={particleSeed} />}
      <ParticleField seed={particleSeed} />
      {depth && <DepthProps seed={particleSeed} />}
      {sweep && <LightSweep />}
      {mood !== "neutral" && <MoodWash mood={mood} />}
      <SceneCameraPush>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translate(${shake.x}px, ${shake.y}px)` }}>{children}</AbsoluteFill>
      </SceneCameraPush>
    </AbsoluteFill>
  );
};

// Kicker + slamming glow headline + drawn divider — matches SectionCard's look so
// scenes feel like the same video. `titleSize` is the MAX size; long titles are
// auto-fitted to the frame width so they never wrap or overflow.
export const SceneHeadline: React.FC<{ kicker?: string; title: string; titleSize?: number; accent?: string }> = ({ kicker, title, titleSize = 92, accent = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const fitted = React.useMemo(
    () => Math.min(titleSize, fitText({ text: title, withinWidth: 1560, fontFamily: FONT, fontWeight: 800, letterSpacing: "1px" }).fontSize),
    [title, titleSize],
  );
  // ~0.9s settle — the slam should land, not blink in (sub-0.5s reads frantic)
  const slam = spring({ frame: frame - 6, fps, config: { stiffness: 190, damping: 24, mass: 0.9 }, durationInFrames: 30 });
  const titleScale = interpolate(slam, [0, 1], [1.28, 1]);
  const titleOp = interpolate(frame, [6, 20], [0, 1], CLAMP);
  const kickerOp = interpolate(frame, [0, 14], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      {/* serif tracked caps — the editorial voice (premium pass §13.1-2) */}
      {kicker ? (
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 27, letterSpacing: 6, color: accent, opacity: kickerOp, filter: t.glow ? "drop-shadow(0 4px 14px rgba(0,0,0,0.6))" : undefined }}>{kicker}</span>
      ) : null}
      {/* paper: near-black editorial type, no neon glow (theme-aware) */}
      <div style={{ opacity: titleOp, transform: `scale(${titleScale})`, fontFamily: FONT, fontWeight: 800, fontSize: fitted, letterSpacing: 1, color: t.text, lineHeight: 1.02, textShadow: t.glow ? "0 0 40px rgba(193,95,60,0.55)" : undefined, whiteSpace: "nowrap" }}>
        {title}
      </div>
      <GlowDivider color={accent} />
    </div>
  );
};
