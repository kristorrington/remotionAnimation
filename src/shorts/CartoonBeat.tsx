import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";
import {
  ClaudeMark, IconSilent, IconChange, IconBug, IconShieldAlert, IconRoute,
  IconGate, IconGuard, IconBlock, IconStack, IconGlobe, IconGauge, IconChip, IconPrice,
  DeepSeekMark, IconThinking, IconClock, IconBolt, IconRocket, IconCoinDown, IconUnlock, IconBrain, IconError,
} from "../components/Cartoons";
import { IconKey } from "./types";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const renderIcon = (key: IconKey, size: number) => {
  switch (key) {
    case "claude": return <ClaudeMark size={size} />;
    case "silent": return <IconSilent size={size} />;
    case "change": return <IconChange size={size} />;
    case "bug": return <IconBug size={size} />;
    case "shield": return <IconShieldAlert size={size} />;
    case "route": return <IconRoute size={size} />;
    case "gate": return <IconGate size={size} />;
    case "guard": return <IconGuard size={size} />;
    case "block": return <IconBlock size={size} />;
    case "stack": return <IconStack size={size} />;
    case "globe": return <IconGlobe size={size} />;
    case "gauge": return <IconGauge size={size} />;
    case "chip": return <IconChip size={size} />;
    case "price": return <IconPrice size={size} />;
    case "deepseek": return <DeepSeekMark size={size} />;
    case "thinking": return <IconThinking size={size} />;
    case "clock": return <IconClock size={size} />;
    case "bolt": return <IconBolt size={size} />;
    case "rocket": return <IconRocket size={size} />;
    case "coindown": return <IconCoinDown size={size} />;
    case "unlock": return <IconUnlock size={size} />;
    case "brain": return <IconBrain size={size} />;
    case "error": return <IconError size={size} />;
  }
};

// One animated cartoon card for the top panel: a big springing icon with an
// expanding shock-ring behind it, then the phrase snaps in. Floats gently so it
// never sits still. Fills the panel; the panel sizes it.
export const CartoonBeat: React.FC<{ icon: IconKey; text: string; sub?: string; dur: number }> = ({
  icon,
  text,
  sub,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 15, mass: 0.7 }, durationInFrames: 18 });
  const op = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], CLAMP);
  // exit: whip out to the left instead of a flat fade
  const exitX = interpolate(frame, [dur - 8, dur], [0, -70], CLAMP);
  // continuous life: float + a slow breathing pulse so a long hold never sits still
  const pulse = 1 + 0.035 * Math.sin(frame * 0.11);
  const iconScale = interpolate(enter, [0, 1], [0.3, 1]) * pulse;
  const float = Math.sin(frame * 0.06) * 8;
  const tilt = Math.sin(frame * 0.045) * 2.2;
  // shock-ring on entry, then a soft ring re-fires every ~2.5s to re-catch the eye
  const RING_EVERY = 75;
  const ringT = frame % RING_EVERY;
  const firstCycle = frame < RING_EVERY;
  const ring = interpolate(ringT, [0, 30], [0.2, 1.5], CLAMP);
  const ringOp = interpolate(ringT, [1, 32], [firstCycle ? 0.7 : 0.35, 0], CLAMP);
  // text slams in fast — quick-fire beats can be as short as ~40 frames
  const textOp = interpolate(frame, [3, 10], [0, 1], CLAMP);
  const textY = interpolate(spring({ frame: frame - 2, fps, config: { stiffness: 260, damping: 17 }, durationInFrames: 12 }), [0, 1], [44, 0]);
  const subOp = interpolate(frame, [12, 22], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 34, opacity: op, transform: `translateX(${exitX}px)` }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${float}px) rotate(${tilt}deg)` }}>
        <div style={{ position: "absolute", width: 300 * ring, height: 300 * ring, borderRadius: "50%", border: `4px solid ${t.accent}`, opacity: ringOp }} />
        <div style={{ transform: `scale(${iconScale})` }}>{renderIcon(icon, 200)}</div>
      </div>
      <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: t.fontDisplay, fontWeight: t.name === "bold" ? t.titleWeight : 900, fontSize: t.name === "bold" ? 98 : 90, lineHeight: 0.98, letterSpacing: t.name === "bold" ? 0.5 : -1.5, color: t.text, textTransform: "uppercase", textShadow: "0 6px 30px rgba(0,0,0,0.65)" }}>
          {text}
        </div>
        {sub && (
          <div style={{ marginTop: 16, opacity: subOp, fontFamily: t.fontKicker, fontWeight: 700, fontSize: t.name === "bold" ? 34 : 42, letterSpacing: t.name === "bold" ? 3 : 1, color: t.textDim, textTransform: "uppercase" }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};
