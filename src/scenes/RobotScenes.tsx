import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, SpeechBubble, RobotPose, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { SpeedTrails } from "../motion/objects";
import { WarningBadge, ImpactStamp } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// TWO REACTIONS: two robots act out opposing takes, then the stamp lands in the
// middle. Defaults = the DSpark "AGI?! vs who cares" beat; fully reusable via props.
export const ReactionsScene: React.FC<{
  durationInFrames: number; kicker?: string; leftAt?: number; rightAt?: number; pointAt?: number;
  leftBubble?: string; rightBubble?: string; leftPose?: RobotPose; rightPose?: RobotPose;
  leftAccent?: string; rightAccent?: string; stamp?: string; stampColor?: string; tint?: string;
}> = ({
  durationInFrames, kicker = "TWO REACTIONS", leftAt = 100, rightAt = 172, pointAt = 262,
  leftBubble = "AGI?!", rightBubble = "who cares", leftPose = "alarmed", rightPose = "shrug",
  leftAccent = RED, rightAccent = AMBER, stamp = "THE POINT", stampColor = GREEN, tint,
}) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x21} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: CYAN, opacity: interpolate(frame, [0, 10], [0, 1], CLAMP) }}>{kicker}</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 120, marginTop: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <SpeechBubble text={leftBubble} at={leftAt} color={leftAccent} shout={leftPose === "alarmed"} />
            <CartoonRobot pose={frame >= leftAt ? leftPose : "idle"} size={250} accent={leftAccent} />
          </div>
          <div style={{ paddingBottom: 90 }}>
            <ImpactStamp text={stamp} at={pointAt} color={stampColor} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <SpeechBubble text={rightBubble} at={rightAt} color={rightAccent} flip />
            <CartoonRobot pose={frame >= rightAt ? rightPose : "idle"} size={250} accent={rightAccent} />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// BORING — BUT IT MATTERS: a robot literally falls asleep at "boring", then a
// blaring money/warning light slams in and wakes it up at "matters".
export const BoredMattersScene: React.FC<{ durationInFrames: number; kicker?: string; wakeAt?: number }> = ({ durationInFrames, kicker = "ONE OF THOSE CHANGES", wakeAt = 90 }) => {
  const frame = useCurrentFrame();
  const awake = frame >= wakeAt;
  const flash = awake ? 0.5 + 0.5 * Math.sin((frame - wakeAt) * 0.45) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x36}>
      {/* red wake-up wash */}
      {awake && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, rgba(239,68,68,${0.12 * flash}), transparent 60%)` }} />}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          <CartoonRobot pose={awake ? "alarmed" : "sleepy"} size={260} accent={awake ? RED : CYAN} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: "rgba(255,255,255,0.5)", textDecoration: awake ? "line-through" : "none", lineHeight: 1 }}>BORING…</span>
            {awake && <ImpactStamp text="BUT IT MATTERS" at={wakeAt + 4} color={AMBER} />}
          </div>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: CYAN, opacity: interpolate(frame, [0, 10], [0, 1], CLAMP) }}>{kicker}</span>
      </div>
      <Sparks at={wakeAt} x={960} y={420} color={AMBER} size={160} />
    </SceneShell>
  );
};

// AGENTS, LESS PAINFUL: an agent robot slides along a track and BUMPS into walls
// (LATENCY / COST / TOOLS). The speed layer sweeps in, two walls drop — the robot
// moves on faster, but one smaller wall stays. Improved, not magical.
export const ObstacleRunScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; walls?: { label: string; drops: boolean }[] }> = ({ durationInFrames, kicker, title, walls: wallsProp }) => {
  const frame = useCurrentFrame();
  const clearAt = Math.round(durationInFrames * 0.52);
  const wallDefs = wallsProp ?? [
    { label: "LATENCY", drops: true },
    { label: "COST", drops: true },
    { label: "TOOLS", drops: false },
  ];
  const walls = wallDefs.map((w, i) => ({ ...w, x: 380 + i * 280 }));
  // robot advances, pauses at first wall bumping, then proceeds after clear
  const phase1 = interpolate(frame, [10, 60], [0, 300], CLAMP); // reach wall 1
  const bump = frame > 60 && frame < clearAt ? Math.abs(Math.sin(frame * 0.25)) * 10 : 0;
  const phase2 = interpolate(frame, [clearAt + 8, durationInFrames - 30], [0, 480], CLAMP);
  const rx = phase1 + phase2;
  const cleared = frame >= clearAt;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x44}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", width: 1300, height: 330 }}>
          {/* ground */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 4, background: "rgba(255,255,255,0.16)" }} />
          {/* walls */}
          {walls.map((w, i) => {
            const dropped = cleared && w.drops;
            const t = dropped ? Math.min(1, (frame - clearAt - i * 6) / 16) : 0;
            const h = w.drops ? 170 : 120;
            return (
              <div key={w.label} style={{ position: "absolute", left: w.x, bottom: 44, width: 26, height: h * (1 - 0.9 * t), background: dropped ? `rgba(239,68,68,${0.5 * (1 - t)})` : "rgba(239,68,68,0.55)", border: `3px solid ${RED}`, borderRadius: 6, opacity: 1 - 0.55 * t }}>
                <span style={{ position: "absolute", top: -34, left: -34, width: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 1, color: dropped ? "rgba(255,255,255,0.4)" : WHITE, textDecoration: dropped ? "line-through" : "none" }}>{w.label}</span>
              </div>
            );
          })}
          {/* the agent robot */}
          <div style={{ position: "absolute", left: rx - bump, bottom: 26 }}>
            <div style={{ position: "relative" }}>
              <CartoonRobot pose={cleared ? "celebrate" : "worried"} size={190} accent={cleared ? GREEN : CYAN} />
              {cleared && <div style={{ position: "absolute", left: -130, top: 90 }}><SpeedTrails width={130} /></div>}
            </div>
          </div>
          <Sparks at={clearAt} x={400} y={140} color={CYAN} size={150} />
          <Sparks at={clearAt + 6} x={680} y={140} color={CYAN} size={150} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} />
      </div>
    </SceneShell>
  );
};

// NOT MAGIC: a magic wand swings in and gets REJECTED by the guard shield —
// denied labels bounce off. Speed doesn't fix quality.
export const NotMagicScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; badges: { label: string; at: number }[]; tint?: string }> = ({ durationInFrames, kicker, title, badges, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wandIn = spring({ frame: frame - 14, fps, config: { stiffness: 150, damping: 13 }, durationInFrames: 22 });
  const hitAt = 34;
  const rejected = frame >= hitAt;
  const recoil = rejected ? interpolate(Math.min((frame - hitAt) / 14, 1), [0, 1], [0, -120]) : 0;
  const wandX = interpolate(wandIn, [0, 1], [-320, -40]) + recoil;
  const wandRot = rejected ? -34 : interpolate(wandIn, [0, 1], [-60, -18]);
  const shieldPulse = 0.6 + 0.4 * Math.sin(frame * 0.3);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x66} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 900, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* wand */}
          <div style={{ position: "absolute", left: 210 + wandX, top: 70, transform: `rotate(${wandRot}deg)` }}>
            <svg width={190} height={90} viewBox="0 0 190 90" style={{ overflow: "visible" }}>
              <line x1={10} y1={80} x2={150} y2={26} stroke="#C9A15A" strokeWidth={10} strokeLinecap="round" />
              <path d="M158 8 L164 24 L180 26 L166 36 L170 52 L156 42 L142 52 L146 36 L132 26 L148 24 Z" fill={AMBER} opacity={rejected ? 0.35 : 0.95} />
            </svg>
          </div>
          {/* shield */}
          <svg width={190} height={210} viewBox="0 0 100 110" style={{ filter: `drop-shadow(0 0 ${16 * shieldPulse}px ${CYAN})` }}>
            <path d="M50 6 L88 20 V52 C88 78 71 94 50 102 C29 94 12 78 12 52 V20 Z" stroke={CYAN} strokeWidth={6} fill="rgba(6,182,212,0.14)" />
            <line x1={32} y1={40} x2={68} y2={72} stroke={RED} strokeWidth={8} strokeLinecap="round" />
            <line x1={68} y1={40} x2={32} y2={72} stroke={RED} strokeWidth={8} strokeLinecap="round" />
          </svg>
          <Sparks at={hitAt} x={330} y={120} color={CYAN} size={150} />
          {/* denied labels */}
          <div style={{ position: "absolute", right: 20, top: 40, display: "flex", flexDirection: "column", gap: 18 }}>
            {badges.map((b) => (
              <WarningBadge key={b.label} label={b.label} delay={b.at} danger />
            ))}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={RED} />
      </div>
    </SceneShell>
  );
};
