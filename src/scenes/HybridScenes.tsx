import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, impulse, glassCard, CYAN, WHITE, GREEN, AMBER } from "../motion/subjects";
import { IconBrain } from "../components/Cartoons";


// ============================================================================
// HYBRID-STACK SCENES — the n8n-vs-agents video's signature metaphor: a solid
// deterministic WORKFLOW slab underneath, an agent BRAIN docking into a
// bounded decision slot on top. Less-words pass: one short title, chips only.
// ============================================================================

// THE HYBRID STACK — the workflow slab runs steadily (dashes stream through);
// the agent module arcs in and DOCKS into its decision slot on `dockAt`; duty
// chips pop along the slab on `chipAts` (validate/execute/log/retry).
export const HybridStackScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  slabLabel?: string; agentLabel?: string; dockAt?: number;
  chipLabels?: string[]; chipAts?: number[]; tint?: string;
}> = ({ durationInFrames, kicker, title, slabLabel = "WORKFLOW", agentLabel = "AGENT", dockAt = 60, chipLabels = [], chipAts = [], tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slabW = 900;
  const dock = spring({ frame: frame - dockAt, fps, config: { stiffness: 130, damping: 12 }, durationInFrames: 26 });
  // arc approach: from up-right, swoops into the slot with squash on landing
  const ax = interpolate(dock, [0, 1], [320, 0]);
  const ay = interpolate(dock, [0, 1], [-260, 0]) + Math.sin(dock * Math.PI) * -70;
  const squash = frame > dockAt + 20 && frame < dockAt + 30 ? 1 - 0.12 * Math.sin(((frame - dockAt - 20) / 10) * Math.PI) : 1;
  const landed = frame >= dockAt + 22;
  const dashes = Array.from({ length: 7 }, (_, i) => (i * (slabW / 7) + frame * 3.2) % (slabW - 40));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x571} impacts={[dockAt + 22]} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 64 }}>
          <div style={{ position: "relative", width: slabW, height: 380 }}>
            {/* the agent module (docks into the slot) */}
            <div style={{ position: "absolute", left: slabW / 2 - 86, top: 40, transform: `translate(${ax}px, ${ay}px) scale(1, ${squash})` }}>
              <div style={{ width: 172, height: 118, borderRadius: 18, ...glassCard(landed ? GREEN : AMBER, 2.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, boxShadow: landed ? `0 0 26px ${GREEN}55` : undefined }}>
                <IconBrain size={58} />
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, letterSpacing: 2, color: WHITE, transform: "translateZ(0)" }}>{agentLabel}</span>
              </div>
            </div>
            {/* the docking slot */}
            <div style={{ position: "absolute", left: slabW / 2 - 96, top: 158, width: 192, height: 26, borderRadius: "12px 12px 0 0", border: `3px dashed ${landed ? GREEN : "rgba(120,112,102,0.6)"}`, borderBottom: "none" }} />
            {/* the deterministic slab */}
            <div style={{ position: "absolute", left: 0, top: 184, width: slabW, height: 120, borderRadius: 22, ...glassCard(CYAN, 2.5), overflow: "hidden" }}>
              <span style={{ position: "absolute", left: 28, top: 14, fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 4, color: WHITE, transform: "translateZ(0)" }}>{slabLabel}</span>
              {/* steady step dashes streaming through the core */}
              {dashes.map((x, i) => (
                <div key={i} style={{ position: "absolute", left: x + 20, bottom: 22, width: 64, height: 10, borderRadius: 5, background: `${CYAN}88`, boxShadow: `0 0 10px ${CYAN}44` }} />
              ))}
            </div>
            {/* duty chips slam along the slab on their spoken words */}
            {chipLabels.map((label, i) => {
              const at = chipAts[i] ?? dockAt + 40 + i * 24;
              const e = spring({ frame: frame - at, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 16 });
              if (frame < at) return null;
              return (
                <div key={label} style={{ position: "absolute", left: 40 + i * ((slabW - 120) / Math.max(chipLabels.length - 1, 1)), top: 322, transform: `rotate(${i % 2 ? 2 : -2}deg) scale(${interpolate(e, [0, 1], [1.6, 1])})`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
                  <div style={{ padding: "7px 16px", borderRadius: 10, ...glassCard(GREEN, 2), fontFamily: FONT, fontWeight: 800, fontSize: 21, letterSpacing: 1, color: WHITE, whiteSpace: "nowrap", transform: "translateZ(0)" }}>{label}</div>
                </div>
              );
            })}
            <Sparks at={dockAt + 22} x={slabW / 2} y={170} color={GREEN} size={160} />
            <Puff at={dockAt + 24} x={slabW / 2 - 60} y={200} size={120} />
          </div>
          <div style={{ transform: `translateY(${-Math.abs(impulse(frame, dockAt + 22, 10, 16))}px)` }}>
            <CartoonRobot pose={landed ? "celebrate" : "thinking"} size={220} accent={landed ? GREEN : CYAN} lookX={-9} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};
