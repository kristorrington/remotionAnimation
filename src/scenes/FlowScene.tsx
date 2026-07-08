import React from "react";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { WorkflowChain, NodeSpec } from "../motion/WorkflowChain";
import { AMBER } from "../motion/primitives";

// A positive process as a FLOW DIAGRAM (short node labels + a branch loop) rather
// than a sentence list — e.g. "Draft → Verify → Accept ↘ Retry". The structure
// carries the meaning; the narration explains it.
export const FlowScene: React.FC<{
  durationInFrames: number;
  kicker?: string;
  title: string;
  nodes: NodeSpec[];
  retry?: [number, number];
  retryLabel?: string;
  accent?: string;
  nodeAts?: number[];
  tint?: string;
}> = ({ durationInFrames, kicker, title, nodes, retry, retryLabel = "Wrong", accent = "#06B6D4", nodeAts, tint }) => {
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x4f} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={88} accent={accent} />
        <WorkflowChain nodes={nodes} retry={retry} retryColor={AMBER} retryLabel={retryLabel} startAt={24} width={1360} nodeAts={nodeAts} />
      </div>
    </SceneShell>
  );
};
