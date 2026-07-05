import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CardStackDrop, TokenCoin, CostMeterClimb } from "../motion/objects";
import { CartoonRobot, CYAN, WHITE, GREEN } from "../motion/subjects";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// CALLS STACK UP: call cards physically DROP onto a pile; the stack wobbles as it
// grows and finally COLLAPSES onto a worried little robot. Escalation, dramatised.
export const StackCollapseScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; drops?: number[]; collapseAt?: number }> = ({
  durationInFrames,
  kicker,
  title,
  drops = [6, 40, 63, 100, 130, 160, 180, 195],
  collapseAt = 205,
}) => {
  const frame = useCurrentFrame();
  const collapsed = frame >= collapseAt;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x91}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
          <CardStackDrop drops={drops} collapseAt={collapseAt} />
          <div style={{ marginLeft: -70, marginBottom: 6 }}>
            <CartoonRobot pose={collapsed ? "alarmed" : "worried"} size={180} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={88} accent="#F59E0B" />
      </div>
    </SceneShell>
  );
};

// AT SCALE IT ADDS UP: user cards multiply, token coins rain, and the cost meter
// climbs green → red. The compounding is VISIBLE.
export const ScaleCostScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; phases?: [number, number, number] }> = ({
  durationInFrames,
  kicker,
  title,
  phases = [6, 237, 567],
}) => {
  const frame = useCurrentFrame();
  // meter jumps with each spoken phase, then keeps creeping
  const level = interpolate(frame, [phases[0], phases[1], phases[1] + 90, phases[2], phases[2] + 40], [0.08, 0.3, 0.5, 0.72, 0.95], CLAMP);
  // user cards grid grows across phases
  const usersShown = frame < phases[1] ? 1 : frame < phases[2] ? 12 : 18;
  const coinTimes = Array.from({ length: 14 }, (_, i) => phases[0] + 20 + i * Math.max(16, (durationInFrames - 140) / 14));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa1}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {/* multiplying user cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 74px)", gap: 12, width: 6 * 74 + 5 * 12 }}>
            {Array.from({ length: 18 }, (_, i) => {
              const on = i < usersShown;
              const wob = 3 * Math.sin(frame * 0.12 + i);
              return (
                <div key={i} style={{ width: 74, height: 54, borderRadius: 10, border: `3px solid ${on ? CYAN : "rgba(255,255,255,0.12)"}`, background: on ? "rgba(6,182,212,0.12)" : "transparent", opacity: on ? 1 : 0.25, transform: `translateY(${on ? wob : 0}px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: on ? WHITE : "rgba(255,255,255,0.3)" }}>◉</span>
                </div>
              );
            })}
          </div>
          {/* coins raining into the meter */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 26 }}>
            <div style={{ position: "absolute", left: -96, bottom: 76, display: "flex", gap: 10 }}>
              {coinTimes.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 3) * 24 - 20, bottom: 0 }}>
                  <TokenCoin at={Math.round(t)} fallH={260 + (i % 4) * 40} size={44} />
                </div>
              ))}
            </div>
            <CostMeterClimb level={level} label="COST" />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} accent={level > 0.7 ? "#EF4444" : GREEN} />
      </div>
    </SceneShell>
  );
};
