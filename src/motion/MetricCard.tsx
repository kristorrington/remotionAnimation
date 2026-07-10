import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, BLUE, CYAN, WHITE } from "../components/overlayUI";
import { IconCoinDown, IconRocket, IconUnlock } from "../components/Cartoons";
import { AMBER, GREEN } from "./primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type MetricMode = "cost" | "speed" | "usable";

const CONFIG: Record<MetricMode, { accent: string; icon: React.FC<{ size?: number }>; label: string }> = {
  cost: { accent: GREEN, icon: IconCoinDown, label: "CHEAPER" },
  speed: { accent: CYAN, icon: IconRocket, label: "FASTER" },
  usable: { accent: AMBER, icon: IconUnlock, label: "USABLE" },
};

// One benefit as a motion-graphics card, not a bullet: a springing panel with an
// animated cartoon icon and a mode-specific meter — cost ticks DOWN, speed fills
// UP, usable lights up. Subtle 3D tilt on entrance.
export const MetricCard: React.FC<{ mode: MetricMode; delay?: number; width?: number }> = ({ mode, delay = 0, width = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = CONFIG[mode];
  const Icon = c.icon;

  const e = spring({ frame: frame - delay, fps, config: { stiffness: 200, damping: 16, mass: 0.8 }, durationInFrames: 20 });
  const op = interpolate(frame, [delay, delay + 10], [0, 1], CLAMP);
  const y = interpolate(e, [0, 1], [60, 0]);
  const rotX = interpolate(e, [0, 1], [18, 0]);

  // meter fill: speed/usable rise to 1; cost "falls" (bar drains from the top)
  const t = interpolate(frame, [delay + 12, delay + 44], [0, 1], CLAMP);
  const fill = mode === "cost" ? 1 - 0.72 * t : 0.28 + 0.72 * t;

  return (
    <div
      style={{
        width,
        padding: "34px 26px 30px",
        borderRadius: 20,
        background: "linear-gradient(180deg, rgba(16,22,34,0.92), rgba(20,16,13,0.92))",
        border: `1px solid ${c.accent}55`,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), inset 0 0 40px ${c.accent}12`,
        opacity: op,
        transform: `translateY(${y}px) perspective(900px) rotateX(${rotX}deg)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <Icon size={104} />
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 1, color: WHITE, textTransform: "uppercase" }}>{c.label}</span>

      {/* meter */}
      <div style={{ width: "100%", height: 16, borderRadius: 999, background: "rgba(255,255,255,0.09)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${BLUE}, ${c.accent})`, boxShadow: `0 0 14px ${c.accent}`, marginLeft: mode === "cost" ? "auto" : 0 }} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: c.accent }}>
        {mode === "cost" ? "▼ COST" : mode === "speed" ? "▲ SPEED" : "● UNLOCKED"}
      </span>
    </div>
  );
};
