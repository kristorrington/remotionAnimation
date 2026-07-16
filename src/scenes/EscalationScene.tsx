import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, WHITE } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { AMBER, GREEN } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Colour ramps green → amber → red as items stack — "pressure building".
const ramp = (i: number, n: number) => {
  const t = n > 1 ? i / (n - 1) : 0;
  if (t < 0.5) return GREEN;
  if (t < 0.85) return AMBER;
  return "#C65B52";
};

const Rung: React.FC<{ label: string; at: number; color: string; i: number; n: number }> = ({ label, at, color, i, n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 220, damping: 16, mass: 0.7 }, durationInFrames: 16 });
  const op = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const width = 420 + (i / Math.max(1, n - 1)) * 560; // each rung wider = escalating
  const danger = color === "#C65B52";
  const pulse = danger ? 0.6 + 0.4 * Math.sin(frame * 0.4) : 1;
  return (
    <div
      style={{
        width: width * interpolate(e, [0, 1], [0.6, 1]),
        opacity: op,
        padding: "18px 30px",
        borderRadius: 14,
        background: `linear-gradient(90deg, ${color}22, ${color}0a)`,
        border: `2px solid ${color}`,
        boxShadow: danger ? `0 0 ${24 * pulse}px ${color}66` : `0 0 16px ${color}22`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        transform: `translateY(${interpolate(e, [0, 1], [24, 0])}px)`,
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: WHITE, letterSpacing: 0.5 }}>{label}</span>
    </div>
  );
};

// Items that ESCALATE — each rung is wider and hotter than the last (green→red),
// the final one pulses. For "1 call → 10 calls broken" / "1 customer → real cost".
export const EscalationScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; items: { label: string; at: number }[]; titleSize?: number }> = ({
  durationInFrames,
  kicker,
  title,
  items,
  titleSize = 84,
}) => {
  const n = items.length;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x8a}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={titleSize} accent={AMBER} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          {items.map((it, i) => (
            <Rung key={it.label} label={it.label} at={it.at} color={ramp(i, n)} i={i} n={n} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
