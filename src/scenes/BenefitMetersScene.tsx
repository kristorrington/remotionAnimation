import React from "react";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { MetricCard } from "../motion/MetricCard";
import { ImpactStamp } from "../motion/primitives";

// "CHEAPER · FASTER · USABLE" as three animated benefit cards (cost ticks down,
// speed fills up, usable unlocks), then an "IF IT WORKS" stamp — not a bullet list.
export const BenefitMetersScene: React.FC<{ durationInFrames: number; kicker?: string; delays?: [number, number, number]; stampAt?: number }> = ({
  durationInFrames,
  kicker = "IF IT WORKS",
  delays = [12, 60, 120],
  stampAt = 190,
}) => {
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3c0}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
        <SceneHeadline kicker={kicker} title="THE PAYOFF" titleSize={78} accent="#34D399" />

        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
          <MetricCard mode="cost" delay={delays[0]} />
          <MetricCard mode="speed" delay={delays[1]} />
          <MetricCard mode="usable" delay={delays[2]} />
        </div>

        <ImpactStamp text="IF IT WORKS" at={stampAt} color="#34D399" />
      </div>
    </SceneShell>
  );
};
