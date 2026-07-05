import React from "react";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { AnimatedCounter, FloatingPanel } from "../motion/primitives";

export type Stat = { value: number; suffix?: string; decimals?: number; label: string; at: number; accent?: string };

// Big animated counters in floating panels — for stat-heavy beats like model size
// ("284B params… 1M context"), so numbers land with weight instead of as bullets.
export const StatCountersScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; stats: Stat[]; accent?: string }> = ({
  durationInFrames,
  kicker,
  title,
  stats,
  accent = "#06B6D4",
}) => {
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x77c}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 52 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={82} accent={accent} />
        <div style={{ display: "flex", gap: 36, alignItems: "stretch" }}>
          {stats.map((s) => (
            <FloatingPanel key={s.label} delay={s.at} accent={s.accent ?? accent} style={{ width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <AnimatedCounter to={s.value} at={s.at + 4} suffix={s.suffix} decimals={s.decimals} color={s.accent ?? accent} size={96} />
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: 1, color: "rgba(255,255,255,0.78)", textAlign: "center" }}>{s.label}</span>
            </FloatingPanel>
          ))}
        </div>
      </div>
    </SceneShell>
  );
};
