import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { StalledBar } from "../motion/primitives";
import { PromptQueue } from "../motion/objects";
import { ThoughtBubble, CartoonRobot } from "../motion/subjects";
import { IconBrain } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// "IT'S WAITING" as a SYSTEM BOTTLENECK: labelled request cards queue up in front
// of a thinking model brain (thought bubble dots), an impatient robot waits at the
// back, and the progress bar underneath stalls and jitters.
export const WaitingScene: React.FC<{ durationInFrames: number; kicker?: string; chips: { label: string; at: number }[] }> = ({ durationInFrames, kicker = "THE REAL PROBLEM", chips }) => {
  const frame = useCurrentFrame();
  const brainOp = interpolate(frame, [10, 24], [0, 1], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x11a}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        {/* the bottleneck: robot → queue → thinking brain */}
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ marginTop: 30 }}>
            <CartoonRobot pose="waiting" size={190} />
          </div>
          <PromptQueue labels={chips.slice(0, 4).map((c) => c.label)} at={chips[0]?.at ?? 6} />
          <div style={{ position: "relative", opacity: brainOp, marginLeft: 24 }}>
            <div style={{ width: 190, height: 190, borderRadius: 26, border: "4px solid #C15F3C", background: "rgba(12,18,30,0.9)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}>
              <IconBrain size={130} />
            </div>
            <div style={{ position: "absolute", top: -86, right: -60 }}>
              <ThoughtBubble />
            </div>
          </div>
        </div>

        <StalledBar width={640} />
        <SceneHeadline kicker={kicker} title="IT'S WAITING" titleSize={92} />
      </div>
    </SceneShell>
  );
};
