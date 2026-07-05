import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { Sparks, Puff, SpeedTrails, CYAN, BLUE, WHITE, RED, AMBER, GREEN, PANEL } from "./subjects";

// ============================================================================
// CARTOON OBJECT LIBRARY — mechanical subjects (model blocks, boosters, coins,
// queues, stacks, meters). Frame-driven, with anticipation / arcs / squash.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A "model" machine block with a glowing brain core and a label plate.
export const ModelBlock: React.FC<{ label?: string; width?: number; coreColor?: string; running?: boolean }> = ({ label = "V4", width = 300, coreColor = CYAN, running = true }) => {
  const frame = useCurrentFrame();
  const pulse = running ? 0.55 + 0.45 * Math.sin(frame * 0.12) : 0.3;
  const h = width * 0.62;
  return (
    <svg width={width} height={h} viewBox="0 0 300 186" style={{ overflow: "visible" }}>
      <rect x={8} y={10} width={284} height={156} rx={22} fill={PANEL} stroke={BLUE} strokeWidth={5} />
      {/* rivets */}
      {[30, 270].map((x) => [34, 142].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={4} fill="rgba(255,255,255,0.25)" />))}
      {/* brain core */}
      <g opacity={0.9}>
        <path d="M128 62 C114 62 108 74 113 82 C104 86 104 98 115 102 C115 112 128 118 136 110 V70 C136 65 133 62 128 62 Z" stroke={coreColor} strokeWidth={5} fill={`${coreColor}18`} />
        <path d="M172 62 C186 62 192 74 187 82 C196 86 196 98 185 102 C185 112 172 118 164 110 V70 C164 65 167 62 172 62 Z" stroke={coreColor} strokeWidth={5} fill={`${coreColor}18`} />
        <circle cx={150} cy={88} r={7} fill={WHITE} opacity={pulse} style={{ filter: `drop-shadow(0 0 ${10 * pulse}px ${coreColor})` }} />
      </g>
      {/* label plate */}
      <rect x={112} y={128} width={76} height={30} rx={8} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
      <text x={150} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={WHITE}>{label}</text>
    </svg>
  );
};

// A turbo/booster unit that FLIES IN on an arc (with anticipation), BOLTS on
// (sparks + clunk) and POWERS UP (flame + glow). `at` = when it starts.
export const SpeedModule: React.FC<{ at: number; width?: number; label?: string }> = ({ at, width = 170, label = "DSPARK" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  // anticipation: hangs up-right, pulls back slightly, then swoops in on an arc
  const approach = spring({ frame: t, fps, config: { stiffness: 120, damping: 15, mass: 1 }, durationInFrames: 26 });
  const x = interpolate(approach, [0, 1], [260, 0]);
  const y = interpolate(approach, [0, 1], [-190, 0]) + Math.sin(approach * Math.PI) * -60; // arc
  const rot = interpolate(approach, [0, 1], [24, 0]);
  const landed = t >= 26;
  const clunk = landed && t < 34 ? Math.sin((t - 26) * 1.4) * 3 : 0;
  const glow = landed ? 0.5 + 0.5 * Math.sin(frame * 0.25) : 0;
  const flame = landed ? 10 + 8 * Math.abs(Math.sin(frame * 0.6)) : 0;
  if (t < 0) return null;
  return (
    <div style={{ position: "relative", transform: `translate(${x + clunk}px, ${y}px) rotate(${rot}deg)` }}>
      <svg width={width} height={width * 0.55} viewBox="0 0 170 94" style={{ overflow: "visible" }}>
        {/* flame (after landing) */}
        {landed && <path d={`M156 38 L${156 + flame} 47 L156 56 Z`} fill={AMBER} opacity={0.9} />}
        <rect x={6} y={20} width={140} height={54} rx={16} fill={PANEL} stroke={CYAN} strokeWidth={5} style={{ filter: landed ? `drop-shadow(0 0 ${14 * glow}px ${CYAN})` : undefined }} />
        {/* fins */}
        <path d="M18 20 L34 4 L58 20 Z" fill={CYAN} opacity={0.85} />
        <path d="M18 74 L34 90 L58 74 Z" fill={CYAN} opacity={0.85} />
        <circle cx={36} cy={47} r={10} fill={AMBER} opacity={0.4 + 0.6 * glow} />
        <text x={92} y={54} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={20} letterSpacing={1} fill={WHITE}>{label}</text>
      </svg>
      <Sparks at={at + 26} x={10} y={45} />
    </div>
  );
};

// A falling token coin with a bounce (squash on landing). Positioned by parent.
export const TokenCoin: React.FC<{ at: number; fallH?: number; size?: number; delayLoop?: boolean }> = ({ at, fallH = 300, size = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  if (t < 0) return null;
  const drop = spring({ frame: t, fps, config: { stiffness: 110, damping: 11, mass: 0.9 }, durationInFrames: 30 });
  const y = interpolate(drop, [0, 1], [-fallH, 0]);
  const squash = t > 12 && t < 20 ? 1 - 0.2 * Math.sin(((t - 12) / 8) * Math.PI) : 1;
  const op = interpolate(t, [0, 6], [0, 1], CLAMP);
  return (
    <div style={{ transform: `translateY(${y}px) scale(1, ${squash})`, opacity: op }}>
      <svg width={size} height={size} viewBox="0 0 60 60">
        <circle cx={30} cy={30} r={26} fill="#173226" stroke={GREEN} strokeWidth={5} />
        <text x={30} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={28} fill={GREEN}>¢</text>
      </svg>
    </div>
  );
};

// A vertical cost meter that climbs (green → amber → red) as `level` 0..1 rises.
export const CostMeterClimb: React.FC<{ level: number; height?: number; label?: string }> = ({ level, height = 340, label = "COST" }) => {
  const frame = useCurrentFrame();
  const l = Math.max(0, Math.min(1, level));
  const color = l < 0.45 ? GREEN : l < 0.75 ? AMBER : RED;
  const alarm = l > 0.85 ? 0.5 + 0.5 * Math.sin(frame * 0.5) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 74, height, borderRadius: 18, border: "3px solid rgba(255,255,255,0.25)", background: "rgba(8,12,20,0.8)", position: "relative", overflow: "hidden", boxShadow: alarm ? `0 0 ${26 * alarm}px ${RED}` : undefined }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${l * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}88)`, boxShadow: `0 0 18px ${color}` }} />
        {[0.25, 0.5, 0.75].map((m) => (
          <div key={m} style={{ position: "absolute", bottom: `${m * 100}%`, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.18)" }} />
        ))}
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: WHITE }}>{label}</span>
    </div>
  );
};

// A queue of labelled cards bunched up waiting (impatient bobbing; the first one
// periodically nudges forward and bounces back — a bottleneck).
export const PromptQueue: React.FC<{ labels: string[]; at?: number; cardW?: number }> = ({ labels, at = 0, cardW = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nudge = Math.max(0, Math.sin(frame * 0.11)) * 14; // first card tries to enter
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      {labels.map((label, i) => {
        const e = spring({ frame: frame - at - i * 10, fps, config: { stiffness: 190, damping: 17 }, durationInFrames: 16 });
        const bob = 4 * Math.sin(frame * 0.14 + i * 1.3);
        const x = i === 0 ? nudge : 0;
        return (
          <div key={label} style={{ opacity: interpolate(e, [0, 0.4], [0, 1], CLAMP), transform: `translate(${interpolate(e, [0, 1], [-120, 0]) + x}px, ${bob}px)` }}>
            <div style={{ width: cardW, padding: "16px 10px", borderRadius: 12, background: PANEL, border: `3px solid ${i === 0 ? AMBER : CYAN}`, textAlign: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: WHITE, letterSpacing: 1 }}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Call cards that DROP onto a stack (squash on landing). The stack sways more as
// it grows; at `collapseAt` it topples and cards scatter (with dust puffs).
export const CardStackDrop: React.FC<{ drops: number[]; labels?: string[]; collapseAt?: number; cardW?: number; cardH?: number }> = ({ drops, labels, collapseAt, cardW = 190, cardH = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const collapsed = collapseAt !== undefined && frame >= collapseAt;
  const ct = collapseAt !== undefined ? frame - collapseAt : -1;
  const rand = mulberry32(0xdead);
  const scatter = drops.map(() => ({ dx: (rand() - 0.5) * 420, rot: (rand() - 0.5) * 140, dy: 40 + rand() * 60 }));
  const landedCount = drops.filter((d) => frame >= d + 16).length;
  const sway = collapsed ? 0 : Math.min(1, landedCount / drops.length) * 6 * Math.sin(frame * 0.16) * (landedCount >= drops.length - 1 ? 1.8 : 1);

  return (
    <div style={{ position: "relative", width: 480, height: 420 }}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: `translateX(-50%) rotate(${sway}deg)`, transformOrigin: "bottom center", width: cardW }}>
        {drops.map((d, i) => {
          const t = frame - d;
          if (t < 0) return null;
          const fall = spring({ frame: t, fps, config: { stiffness: 130, damping: 12, mass: 0.9 }, durationInFrames: 22 });
          const restY = -(i * (cardH + 6));
          const y = interpolate(fall, [0, 1], [restY - 380, restY]);
          const squash = t > 10 && t < 18 ? 1 - 0.18 * Math.sin(((t - 10) / 8) * Math.PI) : 1;
          const sc = scatter[i];
          const cx = collapsed ? interpolate(Math.min(ct / 20, 1), [0, 1], [0, sc.dx]) : 0;
          const cy = collapsed ? interpolate(Math.min(ct / 20, 1), [0, 1], [0, sc.dy + i * 8]) : 0;
          const crot = collapsed ? interpolate(Math.min(ct / 20, 1), [0, 1], [0, sc.rot]) : 0;
          const hot = i >= drops.length - 2;
          return (
            <div key={d} style={{ position: "absolute", bottom: 0, left: 0, width: cardW, height: cardH, transform: `translate(${cx}px, ${y + cy}px) rotate(${crot}deg) scale(1, ${squash})`, borderRadius: 10, background: PANEL, border: `3px solid ${collapsed || hot ? RED : CYAN}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.45)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: WHITE, letterSpacing: 1 }}>{labels?.[i] ?? `CALL ${i + 1}`}</span>
            </div>
          );
        })}
      </div>
      {/* landing + collapse dust */}
      {drops.map((d) => (
        <Puff key={`p-${d}`} at={d + 14} x={240} y={400} />
      ))}
      {collapseAt !== undefined && <Puff at={collapseAt + 6} x={240} y={400} size={220} />}
      {collapseAt !== undefined && <Sparks at={collapseAt} x={240} y={330} color={RED} size={140} />}
    </div>
  );
};

export { SpeedTrails };
