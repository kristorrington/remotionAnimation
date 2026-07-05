import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { WorkflowChain } from "../motion/WorkflowChain";
import { WarningBadge } from "../motion/primitives";
import { IconError } from "../components/Cartoons";

// "IT ALL STILL BREAKS" as a live system: a Prompt → Model → Tool → Output chain
// where the Tool node flashes red and a Retry loops back to Model, warning badges
// (prompts/tools/retries) pop in, and the whole frame shakes on failure.
export const SystemBreakScene: React.FC<{ durationInFrames: number; kicker?: string; title?: string; badges: { label: string; at: number }[]; errorAt?: number }> = ({
  durationInFrames,
  kicker = "PRODUCTION IS MESSIER",
  title = "IT ALL STILL BREAKS",
  badges,
  errorAt = 120,
}) => {
  const frame = useCurrentFrame();
  // whole-scene shake once the error hits, decaying quickly
  const since = frame - errorAt;
  const shake = since > 0 && since < 26 ? Math.sin(since * 1.2) * 5 * (1 - since / 26) : 0;

  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x2b0}>
      <AbsoluteFill style={{ transform: `translateX(${shake}px)`, justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
          <SceneHeadline kicker={kicker} title={title} titleSize={96} accent="#EF4444" />

          <WorkflowChain
            nodes={[{ label: "Prompt" }, { label: "Model" }, { label: "Tool", state: "error" }, { label: "Output" }]}
            retry={[2, 1]}
            startAt={30}
            width={1500}
          />

          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {badges.map((b) => (
              <WarningBadge key={b.label} label={b.label} delay={b.at} danger />
            ))}
            <div style={{ marginLeft: 6 }}><IconError size={72} /></div>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
