import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { Sparks, Puff, SpeedTrails, glassCard, CYAN, BLUE, WHITE, RED, AMBER, GREEN, PANEL } from "./subjects";

// ============================================================================
// CARTOON OBJECT LIBRARY — mechanical subjects (model blocks, boosters, coins,
// queues, stacks, meters). Frame-driven, with anticipation / arcs / squash.
// ============================================================================

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Shared glass-gradient fill for SVG machine shells (PREMIUM finish, CLAUDE.md
// §12). Same id in every svg is safe — the defs are identical everywhere.
const GLASS_DEFS = (
  <defs>
    <linearGradient id="objGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2b2219" />
      <stop offset="100%" stopColor="#16110d" />
    </linearGradient>
  </defs>
);

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
      {GLASS_DEFS}
      <rect x={8} y={10} width={284} height={156} rx={22} fill="url(#objGlass)" stroke={BLUE} strokeWidth={3} />
      <rect x={18} y={17} width={264} height={9} rx={4.5} fill="rgba(255,255,255,0.06)" />
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
        {GLASS_DEFS}
        <rect x={6} y={20} width={140} height={54} rx={16} fill="url(#objGlass)" stroke={CYAN} strokeWidth={3} style={{ filter: landed ? `drop-shadow(0 0 ${14 * glow}px ${CYAN})` : undefined }} />
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
        <defs>
          <radialGradient id="coinGlass" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#2c5f48" />
            <stop offset="100%" stopColor="#0f231a" />
          </radialGradient>
        </defs>
        <circle cx={30} cy={30} r={26} fill="url(#coinGlass)" stroke={`${GREEN}CC`} strokeWidth={3} />
        <circle cx={30} cy={30} r={20} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
        {/* rim shine */}
        <path d="M 12 20 A 22 22 0 0 1 24 8" stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <text x={30} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={GREEN}>¢</text>
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
      <div style={{ width: 74, height, borderRadius: 18, border: "2px solid rgba(255,255,255,0.22)", background: "linear-gradient(180deg, rgba(16,22,36,0.9), rgba(20,16,13,0.82))", position: "relative", overflow: "hidden", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.4)${alarm ? `, 0 0 ${26 * alarm}px ${RED}` : ""}` }}>
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
            <div style={{ width: cardW, padding: "16px 10px", borderRadius: 12, textAlign: "center", ...glassCard(i === 0 ? AMBER : CYAN) }}>
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
            <div key={d} style={{ position: "absolute", bottom: 0, left: 0, width: cardW, height: cardH, transform: `translate(${cx}px, ${y + cy}px) rotate(${crot}deg) scale(1, ${squash})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", ...glassCard(collapsed || hot ? RED : CYAN) }}>
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

// A conveyor belt strip with moving tread dashes. THE shared belt — scenes must
// not re-implement it. `speed` px/frame; `accelerate` ramps speed over `dur`.
export const ConveyorBelt: React.FC<{ width: number; speed?: number; accelerate?: { to: number; dur: number }; color?: string; y?: number }> = ({ width, speed = 4, accelerate, color = CYAN }) => {
  const frame = useCurrentFrame();
  const v = accelerate ? interpolate(frame, [0, accelerate.dur], [speed, accelerate.to], CLAMP) : speed;
  return (
    <svg width={width} height={26} viewBox={`0 0 ${width} 26`}>
      <rect x={0} y={4} width={width} height={18} rx={9} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" strokeWidth={2} />
      {Array.from({ length: Math.ceil(width / 46) }, (_, i) => {
        const x = (i * 46 + frame * v) % width;
        return <line key={i} x1={x} y1={8} x2={x + 18} y2={18} stroke={color} strokeWidth={3} opacity={0.5} />;
      })}
    </svg>
  );
};

// A Jenga-style tower: one block gets PULLED OUT at `pullAt`, the tower leans,
// and (optionally) collapses at `collapseAt`. Risk-of-change, dramatised.
export const JengaTower: React.FC<{ pullAt: number; collapseAt?: number; rows?: number; pullRow?: number; blockW?: number; blockH?: number; labels?: string[] }> = ({ pullAt, collapseAt, rows = 6, pullRow = 2, blockW = 200, blockH = 40, labels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pull = spring({ frame: frame - pullAt, fps, config: { stiffness: 90, damping: 16 }, durationInFrames: 26 });
  const pulledX = interpolate(pull, [0, 1], [0, blockW * 1.5]);
  const pulled = frame >= pullAt;
  const collapsed = collapseAt !== undefined && frame >= collapseAt;
  const ct = collapseAt !== undefined ? Math.min((frame - collapseAt) / 20, 1) : 0;
  const lean = collapsed ? 0 : pulled ? Math.min(1, (frame - pullAt) / 30) * 5 * Math.sin(frame * 0.14) : 0;
  const rand = mulberry32(0xbeef);
  const scatter = Array.from({ length: rows }, () => ({ dx: (rand() - 0.5) * 360, rot: (rand() - 0.5) * 120, dy: 30 + rand() * 70 }));
  return (
    <div style={{ position: "relative", width: blockW * 1.6, height: rows * (blockH + 4) + 30 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, transform: `rotate(${lean}deg)`, transformOrigin: "bottom center", width: blockW }}>
        {Array.from({ length: rows }, (_, i) => {
          const isPulled = i === pullRow;
          const sc = scatter[i];
          const cx = collapsed && ct > 0 ? interpolate(ct, [0, 1], [0, sc.dx]) : 0;
          const cy = collapsed && ct > 0 ? interpolate(ct, [0, 1], [0, sc.dy]) : 0;
          const crot = collapsed && ct > 0 ? interpolate(ct, [0, 1], [0, sc.rot]) : 0;
          return (
            <div key={i} style={{ position: "absolute", bottom: i * (blockH + 4), left: 0, width: blockW, height: blockH, transform: `translate(${(isPulled ? pulledX : 0) + cx}px, ${cy}px) rotate(${crot}deg)`, opacity: isPulled && pull > 0.9 ? Math.max(0, 1 - (frame - pullAt - 24) / 16) : 1, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", ...glassCard(isPulled ? AMBER : collapsed ? RED : CYAN) }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 1, color: WHITE }}>{labels?.[i] ?? (isPulled ? "ONE CHANGE" : "PROD")}</span>
            </div>
          );
        })}
      </div>
      {collapseAt !== undefined && <Puff at={collapseAt + 8} x={blockW / 2} y={rows * (blockH + 4)} size={200} />}
      {collapseAt !== undefined && <Sparks at={collapseAt} x={blockW / 2} y={rows * (blockH + 2) - 60} color={RED} size={140} />}
    </div>
  );
};

// A bucket with a level that LEAKS from a hole (drip stream + falling level).
// `patchAt` bolts a patch over the hole — the leak stops, the level holds.
export const LeakingBucket: React.FC<{ level?: number; patchAt?: number; width?: number; label?: string }> = ({ level = 0.75, patchAt, width = 190, label = "BUDGET" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const patched = patchAt !== undefined && frame >= patchAt;
  const drain = patched ? Math.max(0.3, level - (patchAt ?? 0) * 0.001) : Math.max(0.18, level - frame * 0.001);
  const h = width * 0.95;
  const patch = patchAt !== undefined ? spring({ frame: frame - patchAt, fps, config: { stiffness: 240, damping: 14 }, durationInFrames: 14 }) : 0;
  return (
    <div style={{ position: "relative", width: width + 90, height: h + 70 }}>
      <svg width={width} height={h} viewBox="0 0 100 95" style={{ overflow: "visible" }}>
        {/* bucket */}
        <path d="M14 12 L86 12 L78 88 L22 88 Z" fill="rgba(20,16,13,0.85)" stroke="#8899AA" strokeWidth={5} strokeLinejoin="round" />
        {/* liquid */}
        <path d={`M${18 + (1 - drain) * 3} ${16 + (1 - drain) * 66} L${82 - (1 - drain) * 3} ${16 + (1 - drain) * 66} L78 88 L22 88 Z`} fill={GREEN} opacity={0.5} />
        {/* hole + drips */}
        <circle cx={76} cy={66} r={4} fill={patched ? "transparent" : "#05070C"} stroke={patched ? "transparent" : "#8899AA"} strokeWidth={2} />
        {!patched && [0, 0.35, 0.7].map((o, i) => {
          const t = (frame * 0.03 + o) % 1;
          return <circle key={i} cx={80 + t * 16} cy={68 + t * t * 90} r={4 * (1 - t * 0.4)} fill={GREEN} opacity={(1 - t) * 0.85} />;
        })}
        {/* the patch */}
        {patchAt !== undefined && frame >= patchAt && (
          <g transform={`translate(${interpolate(patch, [0, 1], [40, 0])} ${interpolate(patch, [0, 1], [-40, 0])})`}>
            <rect x={68} y={58} width={18} height={16} rx={3} fill={PANEL} stroke={CYAN} strokeWidth={3} />
            <circle cx={72} cy={62} r={1.6} fill={CYAN} />
            <circle cx={82} cy={70} r={1.6} fill={CYAN} />
          </g>
        )}
      </svg>
      {patchAt !== undefined && <Sparks at={patchAt + 8} x={width * 0.78} y={h * 0.68} color={CYAN} size={100} />}
      <span style={{ position: "absolute", left: 0, width, textAlign: "center", bottom: 26, fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: WHITE, transform: "translateZ(0)" }}>{label}</span>
    </div>
  );
};

// A row of request "cars" bunching up behind a blocker — impatient nudges, honk
// flashes. An alternative latency metaphor to PromptQueue.
export const TrafficJam: React.FC<{ cars?: string[]; at?: number; width?: number }> = ({ cars = ["REQ", "REQ", "REQ", "REQ"], at = 0, width = 560 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width, height: 110 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, height: 4, background: "rgba(255,255,255,0.16)" }} />
      {cars.map((label, i) => {
        const e = spring({ frame: frame - at - i * 8, fps, config: { stiffness: 150, damping: 15 }, durationInFrames: 18 });
        const baseX = width - 120 - i * 118;
        const nudge = Math.max(0, Math.sin(frame * 0.13 + i * 1.7)) * 10;
        const honk = (frame + i * 23) % 96 < 5;
        return (
          <div key={i} style={{ position: "absolute", left: interpolate(e, [0, 1], [baseX - 240, baseX]) + nudge, bottom: 14, opacity: interpolate(e, [0, 0.3], [0, 1], CLAMP) }}>
            <svg width={104} height={62} viewBox="0 0 104 62" style={{ overflow: "visible" }}>
              {GLASS_DEFS}
              <path d="M8 42 L14 24 Q18 14 30 14 L66 14 Q78 14 84 26 L96 42 Q100 44 98 50 L6 50 Q4 44 8 42 Z" fill="url(#objGlass)" stroke={i === 0 ? AMBER : CYAN} strokeWidth={3} />
              <circle cx={28} cy={52} r={9} fill="#14100c" stroke={i === 0 ? AMBER : CYAN} strokeWidth={3.5} />
              <circle cx={76} cy={52} r={9} fill="#14100c" stroke={i === 0 ? AMBER : CYAN} strokeWidth={3.5} />
              <text x={50} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={16} fill={WHITE}>{label}</text>
              {honk && <text x={80} y={10} fontFamily={FONT} fontWeight={900} fontSize={16} fill={AMBER}>!</text>}
            </svg>
          </div>
        );
      })}
    </div>
  );
};

// A server rack: LED activity patterns + spinning fans; `overheatAt` flips it
// into a red alarm state (fast fans, red LEDs, heat shimmer lines).
export const ServerRack: React.FC<{ width?: number; units?: number; overheatAt?: number }> = ({ width = 220, units = 4, overheatAt }) => {
  const frame = useCurrentFrame();
  const hot = overheatAt !== undefined && frame >= overheatAt;
  const fanSpeed = hot ? 34 : 9;
  const h = units * 54 + 24;
  return (
    <svg width={width} height={(h / 160) * width * 0.9} viewBox={`0 0 160 ${h}`} style={{ overflow: "visible" }}>
      {GLASS_DEFS}
      <rect x={6} y={6} width={148} height={h - 12} rx={12} fill="url(#objGlass)" stroke={hot ? RED : BLUE} strokeWidth={3} />
      <rect x={12} y={10} width={136} height={6} rx={3} fill="rgba(255,255,255,0.06)" />
      {Array.from({ length: units }, (_, u) => {
        const y = 18 + u * 54;
        return (
          <g key={u}>
            <rect x={16} y={y} width={128} height={42} rx={6} fill="rgba(20,16,13,0.9)" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
            {/* LEDs */}
            {[0, 1, 2, 3, 4].map((l) => {
              const on = hot ? (frame + l * 3) % 10 < 5 : (frame * 0.4 + l * 7 + u * 13) % 17 < 8;
              return <circle key={l} cx={28 + l * 14} cy={y + 12} r={3.4} fill={on ? (hot ? RED : GREEN) : "rgba(255,255,255,0.12)"} />;
            })}
            {/* fan */}
            <g transform={`rotate(${frame * fanSpeed} 122 ${y + 21})`}>
              {[0, 120, 240].map((a) => (
                <path key={a} d={`M122 ${y + 21} L${122 + 11 * Math.cos((a * Math.PI) / 180)} ${y + 21 + 11 * Math.sin((a * Math.PI) / 180)}`} stroke={hot ? RED : CYAN} strokeWidth={3.5} strokeLinecap="round" />
              ))}
            </g>
            <circle cx={122} cy={y + 21} r={14} fill="none" stroke={hot ? RED : CYAN} strokeWidth={2.5} />
            {/* slots */}
            <rect x={28} y={y + 24} width={70} height={5} rx={2.5} fill="rgba(255,255,255,0.14)" />
            <rect x={28} y={y + 33} width={54} height={5} rx={2.5} fill="rgba(255,255,255,0.1)" />
          </g>
        );
      })}
      {/* heat shimmer when overheating */}
      {hot && [0, 1, 2].map((i) => {
        const t = (frame * 0.03 + i * 0.33) % 1;
        return <path key={i} d={`M${40 + i * 40} ${8 - t * 26} q6 -8 0 -14`} stroke={RED} strokeWidth={3} fill="none" opacity={(1 - t) * 0.7} strokeLinecap="round" />;
      })}
    </svg>
  );
};

// A lock gate that SLAMS shut (or springs open) at `at` — access granted/denied.
export const LockGate: React.FC<{ at: number; action?: "close" | "open"; size?: number; label?: string }> = ({ at, action = "close", size = 200, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 });
  const t = action === "close" ? e : 1 - e;
  const shackleY = interpolate(t, [0, 1], [-26, 0]);
  const closed = t > 0.6;
  const color = action === "close" ? RED : GREEN;
  const slam = impulseLocal(frame, at + 8);
  return (
    <div style={{ position: "relative", transform: `translateX(${slam}px)` }}>
      <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={{ overflow: "visible" }}>
        {/* shackle */}
        <path d={`M30 ${46 + shackleY} V34 a20 20 0 0 1 40 0 v${12 - shackleY}`} stroke={closed ? color : "#8899AA"} strokeWidth={9} fill="none" strokeLinecap="round" />
        {GLASS_DEFS}
        {/* body */}
        <rect x={18} y={46} width={64} height={52} rx={12} fill="url(#objGlass)" stroke={closed ? color : "#8899AA"} strokeWidth={3.5} style={{ filter: closed ? `drop-shadow(0 0 12px ${color})` : undefined }} />
        <rect x={23} y={50} width={54} height={5} rx={2.5} fill="rgba(255,255,255,0.07)" />
        <circle cx={50} cy={68} r={8} fill={closed ? color : "rgba(255,255,255,0.25)"} />
        <rect x={47} y={72} width={6} height={14} rx={3} fill={closed ? color : "rgba(255,255,255,0.25)"} />
      </svg>
      <Sparks at={at + 8} x={size / 2} y={size * 0.5} color={color} size={size * 0.7} />
      {label ? <span style={{ position: "absolute", left: -20, right: -20, textAlign: "center", bottom: -30, fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: WHITE, transform: "translateZ(0)" }}>{label}</span> : null}
    </div>
  );
};

// A request card looping the RETRY wheel, flashing red each lap. THE shared
// retry metaphor (also used by the shorts' retry beat).
export const RetryWheel: React.FC<{ size?: number; label?: string; cardLabel?: string }> = ({ size = 400, label = "RETRY", cardLabel = "CALL" }) => {
  const frame = useCurrentFrame();
  const angle = frame * 0.09;
  const lapT = (angle % (Math.PI * 2)) / (Math.PI * 2);
  const flash = lapT > 0.88;
  const r = size * 0.375;
  const c = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <circle cx={c} cy={c} r={r} stroke={flash ? RED : AMBER} strokeWidth={size * 0.03} fill="none" strokeDasharray={`${size * 0.075} ${size * 0.055}`} strokeDashoffset={-frame * 3} opacity={0.9} />
        <path d={`M ${c - r * 0.92} ${c - r * 0.45} L ${c - r * 0.62} ${c - r * 0.2} L ${c - r * 0.55} ${c - r * 0.62} Z`} fill={flash ? RED : AMBER} />
        <text x={c} y={c + size * 0.03} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size * 0.1} fill={flash ? RED : WHITE}>{label}</text>
      </svg>
      <div style={{ position: "absolute", left: c + r * Math.sin(angle) - size * 0.15, top: c - r * Math.cos(angle) - size * 0.065, padding: `${size * 0.02}px ${size * 0.04}px`, borderRadius: 10, ...glassCard(flash ? RED : CYAN) }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.055, color: WHITE }}>{cardLabel}</span>
      </div>
    </div>
  );
};

// tiny local impact helper (decaying shake) — avoids importing back into subjects
const impulseLocal = (frame: number, at: number, strength = 5, decay = 12) => {
  const t = frame - at;
  if (t < 0) return 0;
  return Math.sin(t * 0.9) * strength * Math.max(0, 1 - t / decay);
};

export { SpeedTrails };
