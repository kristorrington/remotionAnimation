import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, MONO } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, TinyDev, Sparks, Puff, glassCard, impulse, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { ModelBlock, ServerRack, CostMeterClimb, TokenCoin, LockGate } from "../motion/objects";
import { ImpactStamp } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// GO-LOCAL SCENES — the three hardware tiers + the licence lock-gate for the
// "just go local solves nothing" video (July 2026). Every `at` prop is pinned
// to whisper word frames by the caller (CLAUDE.md golden rule).
// ============================================================================

const label = (size = 22, color = WHITE): React.CSSProperties => ({
  fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 1, color, transform: "translateZ(0)", whiteSpace: "nowrap",
});

// Sticker chip that spring-slams in with a tilt (§8 proportions rule).
const Chip: React.FC<{ text: string; at: number; color?: string; tilt?: number }> = ({ text, at, color = CYAN, tilt = -2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const e = spring({ frame: frame - at, fps, config: { stiffness: 190, damping: 14 }, durationInFrames: 24 });
  return (
    <div style={{ transform: `scale(${interpolate(e, [0, 1], [1.6, 1])}) rotate(${tilt}deg)`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
      <div style={{ ...glassCard(color, 2), borderRadius: 12, padding: "10px 22px" }}>
        <span style={label(24)}>{text}</span>
      </div>
    </div>
  );
};

// ── TIER 1: the genuine local tier — a dev, a desktop tower, a small model ──
export const TierOneScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  chipAts?: [number, number, number]; tint?: string;
}> = ({ durationInFrames, kicker = "TIER 1", title, chipAts = [140, 300, 410], tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const towerPop = spring({ frame: frame - 8, fps, config: { stiffness: 130, damping: 14 }, durationInFrames: 26 });
  const blockPop = spring({ frame: frame - 26, fps, config: { stiffness: 150, damping: 15 }, durationInFrames: 24 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa11} tint={tint} depth impacts={[chipAts[0]]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <TinyDev pose="typing" size={230} />
          {/* the desktop tower — consumer hardware, not a rack */}
          <div style={{ transform: `scale(${interpolate(towerPop, [0, 1], [0.5, 1])})`, opacity: interpolate(towerPop, [0, 0.3], [0, 1]) }}>
            <div style={{ ...glassCard(CYAN, 2), borderRadius: 18, width: 150, height: 320, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 999, background: i === 0 ? GREEN : "rgba(255,255,255,0.25)", opacity: i === 0 ? 0.5 + 0.5 * Math.sin(frame * 0.2) : 1 }} />
                ))}
              </div>
              <div style={{ flex: 1, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...label(16, "rgba(255,255,255,0.6)"), fontFamily: MONO }}>GPU ×1</span>
              </div>
              <div style={{ height: 26, borderRadius: 8, background: "rgba(255,255,255,0.08)" }} />
            </div>
          </div>
          <div style={{ transform: `scale(${interpolate(blockPop, [0, 1], [0.4, 1])})`, opacity: interpolate(blockPop, [0, 0.3], [0, 1]) }}>
            <ModelBlock label="≤35B" width={280} />
          </div>
          <Puff at={30} x={0} y={40} />
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          <Chip text="≤35B PARAMS" at={chipAts[0]} color={CYAN} tilt={-3} />
          <Chip text="GAMING PC" at={chipAts[1]} color={GREEN} tilt={2} />
          <Chip text="THE ONE YOU PICTURE" at={chipAts[2]} color={AMBER} tilt={-2} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// ── TIER 2: hundreds of billions — racks you rent, a meter that climbs ──────
export const TierTwoScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  chipAts?: [number, number, number]; tint?: string;
}> = ({ durationInFrames, kicker = "TIER 2", title, chipAts = [112, 209, 324], tint }) => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [chipAts[2], durationInFrames - 20], [0.25, 0.85], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa22} tint={tint} depth impacts={[chipAts[2]]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 44 }}>
          <CartoonRobot pose="worried" size={210} accent={AMBER} lookX={0.7} />
          <ServerRack width={210} units={4} />
          <ServerRack width={210} units={4} />
          <div style={{ position: "relative" }}>
            <CostMeterClimb level={level} height={300} label="RENT" />
            <div style={{ position: "absolute", left: 10, top: -40 }}>
              <TokenCoin at={chipAts[2]} fallH={180} size={40} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          <Chip text="100s OF BILLIONS" at={chipAts[0]} color={AMBER} tilt={-3} />
          <Chip text="DATA-CENTRE GPUS" at={chipAts[1]} color={CYAN} tilt={2} />
          <Chip text="YOU RENT IT" at={chipAts[2]} color={RED} tilt={-2} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// ── TIER 3: the giants — a rack WALL, a 1.6T block, a very small robot ──────
export const TierThreeScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  clusterChipAt?: number; laptopAt?: number; stampAt?: number; tint?: string;
}> = ({ durationInFrames, kicker = "TIER 3", title, clusterChipAt = 38, laptopAt = 130, stampAt = 195, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const laptopIn = spring({ frame: frame - laptopAt, fps, config: { stiffness: 200, damping: 14 }, durationInFrames: 20 });
  const kick = impulse(frame, stampAt);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa33} tint={tint} mood="danger" impacts={[stampAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, transform: `translateY(${kick * 6}px)` }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
          {/* the rack wall — this is a building, not a desk */}
          <div style={{ display: "flex", gap: 14 }}>
            {[0, 1, 2, 3].map((i) => (
              <ServerRack key={i} width={150} units={5} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <ModelBlock label="1.6T" width={330} coreColor={RED} />
            <CartoonRobot pose="confused" size={120} lookY={-0.8} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          <Chip text="H100 / B100 CLUSTERS" at={clusterChipAt} color={RED} tilt={-2} />
          {/* the spare laptop, politely declined */}
          {frame >= laptopAt && (
            <div style={{ position: "relative", transform: `scale(${interpolate(laptopIn, [0, 1], [1.6, 1])})`, opacity: interpolate(laptopIn, [0, 0.3], [0, 1]) }}>
              <div style={{ ...glassCard("rgba(255,255,255,0.4)", 2), borderRadius: 12, padding: "10px 22px" }}>
                <span style={label(24, "rgba(255,255,255,0.75)")}>SPARE LAPTOP</span>
              </div>
              <svg width={120} height={64} viewBox="0 0 120 64" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", overflow: "visible" }}>
                {frame >= laptopAt + 14 && (
                  <>
                    <line x1={8} y1={8} x2={112} y2={56} stroke={RED} strokeWidth={9} strokeLinecap="round" />
                    <line x1={112} y1={8} x2={8} y2={56} stroke={RED} strokeWidth={9} strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
        <ImpactStamp text="DOWNLOADABLE ≠ DEPLOYABLE" at={stampAt} color={RED} />
        <Sparks at={stampAt} x={0} y={-30} color={RED} />
      </div>
    </SceneShell>
  );
};

// ── LICENCE / ACCESS LOCK-GATE: a model card meets the gate. It slams shut on
// slamAt; with reopenAt it springs open again (the Fable availability story).
export const LockGateScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  cardLabel: string; slamAt: number; reopenAt?: number;
  warnLabel?: string; warnAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, cardLabel, slamAt, reopenAt, warnLabel, warnAt, tint }) => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [10, slamAt], [-430, -120], CLAMP);
  const bounce = frame >= slamAt ? Math.max(0, 1 - (frame - slamAt) / 14) * -46 : 0;
  const through = reopenAt !== undefined ? interpolate(frame, [reopenAt + 12, reopenAt + 44], [0, 300], CLAMP) : 0;
  const pose = frame < slamAt ? "walking" : reopenAt !== undefined && frame >= reopenAt ? "celebrate" : "alarmed";
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa44} tint={tint} depth impacts={[slamAt, ...(reopenAt !== undefined ? [reopenAt] : [])]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1200, height: 400 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, height: 4, background: "rgba(120,112,102,0.5)" }} />
          <div style={{ position: "absolute", left: "50%", bottom: 34, transform: "translateX(-50%)" }}>
            <LockGate at={slamAt} action="close" size={240} />
            {reopenAt !== undefined && frame >= reopenAt && (
              <div style={{ position: "absolute", inset: 0 }}>
                <LockGate at={reopenAt} action="open" size={240} />
              </div>
            )}
          </div>
          {/* the model card walks up, bounces off — and maybe gets through */}
          <div style={{ position: "absolute", left: "50%", bottom: 60, transform: `translateX(${walk + bounce + through}px)` }}>
            <div style={{ ...glassCard(CYAN, 2), borderRadius: 14, padding: "14px 26px" }}>
              <span style={label(28)}>{cardLabel}</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: "50%", bottom: 40, transform: `translateX(${-330 + through * 0.4}px)` }}>
            <CartoonRobot pose={pose} size={180} accent={pose === "celebrate" ? GREEN : CYAN} lookX={0.8} />
          </div>
          <Sparks at={slamAt} x={600} y={200} color={RED} size={160} />
          {warnLabel && warnAt !== undefined && frame >= warnAt && (
            <div style={{ position: "absolute", right: 30, top: 20 }}>
              <Chip text={warnLabel} at={warnAt} color={AMBER} tilt={3} />
            </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};
