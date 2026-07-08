import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, CYAN, WHITE, RED } from "../components/overlayUI";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type NodeSpec = { label: string; state?: "ok" | "error" };

const NODE_W = 244;
const NODE_H = 104;
const BAND_H = 260;

// A single node in the chain — springs in; the error state pulses red + shakes.
const WorkflowNode: React.FC<{ node: NodeSpec; x: number; delay: number }> = ({ node, x, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const err = node.state === "error";
  const e = spring({ frame: frame - delay, fps, config: { stiffness: 220, damping: 17, mass: 0.7 }, durationInFrames: 16 });
  const op = interpolate(frame, [delay, delay + 8], [0, 1], CLAMP);
  const scale = interpolate(e, [0, 1], [0.6, 1]);
  const pulse = err ? 0.55 + 0.45 * Math.sin(frame * 0.45) : 0;
  const shake = err ? 2.2 * Math.sin(frame * 0.9) : 0;
  const color = err ? RED : CYAN;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: (BAND_H - NODE_H) / 2,
        width: NODE_W,
        height: NODE_H,
        transform: `translateX(${shake}px) scale(${scale})`,
        opacity: op,
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: err ? "rgba(40,12,14,0.92)" : "rgba(12,18,30,0.92)",
        border: `2px solid ${color}`,
        boxShadow: err ? `0 0 ${26 * (0.4 + pulse)}px ${RED}` : `0 0 22px ${CYAN}33`,
      }}
    >
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 1, color: WHITE, textTransform: "uppercase" }}>{node.label}</span>
    </div>
  );
};

// A connector with a pulse dot travelling along it (idle = cyan, error side = red).
const Connector: React.FC<{ x1: number; x2: number; y: number; delay: number; danger?: boolean }> = ({ x1, x2, y, delay, danger }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [delay, delay + 12], [0, 1], CLAMP);
  const color = danger ? RED : CYAN;
  const travel = ((frame - delay) * 0.05) % 1;
  const px = x1 + (x2 - x1) * travel;
  return (
    <>
      <div style={{ position: "absolute", left: x1, top: y - 2, width: (x2 - x1) * grow, height: 4, background: `${color}88`, borderRadius: 2 }} />
      {grow > 0.98 && <div style={{ position: "absolute", left: px - 5, top: y - 5, width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />}
    </>
  );
};

// Prompt → Model → Tool → Output as an animated node chain. Optionally flash a
// node (error) and draw a retry loop arc from one node back to another.
// `nodeAts` pins each node to a spoken frame (falls back to a quick stagger).
export const WorkflowChain: React.FC<{ nodes: NodeSpec[]; retry?: [number, number]; retryColor?: string; retryLabel?: string; startAt?: number; width?: number; nodeAts?: number[] }> = ({ nodes, retry, retryColor = RED, retryLabel = "RETRY", startAt = 0, width = 1500, nodeAts }) => {
  const frame = useCurrentFrame();
  const n = nodes.length;
  const gap = n > 1 ? (width - n * NODE_W) / (n - 1) : 0;
  const xOf = (i: number) => i * (NODE_W + gap);
  const cy = BAND_H / 2;

  // retry arc (from right edge of `from` node, curving under, to `to` node)
  let retryPath: string | null = null;
  let arrow: { x: number; y: number } | null = null;
  let retryDraw = 0;
  if (retry) {
    const [a, b] = retry;
    const x1 = xOf(a) + NODE_W / 2;
    const x2 = xOf(b) + NODE_W / 2;
    const yB = cy + NODE_H / 2;
    const dip = yB + 96;
    retryPath = `M ${x1} ${yB} C ${x1} ${dip}, ${x2} ${dip}, ${x2} ${yB}`;
    arrow = { x: x2, y: yB };
    retryDraw = interpolate(frame, [startAt + 40, startAt + 64], [0, 1], CLAMP);
  }

  return (
    <div style={{ position: "relative", width, height: BAND_H + (retry ? 120 : 0), margin: "0 auto" }}>
      {/* connectors first (behind nodes) */}
      {nodes.slice(0, -1).map((_, i) => (
        <Connector key={`c-${i}`} x1={xOf(i) + NODE_W} x2={xOf(i + 1)} y={cy} delay={nodeAts ? nodeAts[i + 1] - 12 : startAt + 10 + i * 12} danger={nodes[i + 1].state === "error"} />
      ))}
      {/* retry loop */}
      {retryPath && (
        <svg width={width} height={BAND_H + 120} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }}>
          <path d={retryPath} stroke={retryColor} strokeWidth="4" fill="none" strokeDasharray="1000" strokeDashoffset={1000 * (1 - retryDraw)} />
          {arrow && retryDraw > 0.9 && <path d={`M ${arrow.x - 9} ${arrow.y + 14} L ${arrow.x} ${arrow.y} L ${arrow.x + 9} ${arrow.y + 14}`} stroke={retryColor} strokeWidth="4" fill="none" />}
          {retryDraw > 0.5 && (
            <text x={(xOf(retry![0]) + xOf(retry![1])) / 2 + NODE_W / 2} y={cy + NODE_H / 2 + 88} fill={retryColor} fontFamily={FONT} fontSize="26" fontWeight="800" textAnchor="middle" opacity={retryDraw}>
              {retryLabel}
            </text>
          )}
        </svg>
      )}
      {/* nodes on top */}
      {nodes.map((node, i) => (
        <WorkflowNode key={`n-${i}`} node={node} x={xOf(i)} delay={nodeAts?.[i] ?? startAt + i * 12} />
      ))}
    </div>
  );
};
