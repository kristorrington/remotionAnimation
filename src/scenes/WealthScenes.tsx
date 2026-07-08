import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, MoveAlong, poseTimeline, CYAN, WHITE, RED, AMBER, GREEN, PANEL } from "../motion/subjects";
import { ModelBlock, SpeedModule, SpeedTrails, TokenCoin, ServerRack, JengaTower, TrafficJam } from "../motion/objects";
import { WarningBadge } from "../motion/primitives";
import { ClaudeMark } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const chip = (color: string, fontSize = 26): React.CSSProperties => ({
  padding: "10px 20px", borderRadius: 12, background: PANEL, border: `3px solid ${color}`,
  fontFamily: FONT, fontWeight: 800, fontSize, letterSpacing: 1, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

const Mark: React.FC<{ kind: "check" | "cross"; at: number; size?: number }> = ({ kind, at, size = 110 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 280, damping: 14 }, durationInFrames: 14 });
  if (frame < at) return null;
  const color = kind === "check" ? GREEN : RED;
  return (
    <div style={{ transform: `scale(${interpolate(e, [0, 1], [2, 1])})`, opacity: interpolate(e, [0, 0.4], [0, 1]) }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>
        <circle cx={50} cy={50} r={42} fill={`${color}22`} stroke={color} strokeWidth={7} />
        {kind === "check" ? (
          <path d="M30 52 L45 66 L72 36" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <line x1={33} y1={33} x2={67} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
            <line x1={67} y1={33} x2={33} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};

// THE HOOK: the bright question gets CROSSED OUT and drops; the darker question
// rises in its place while the robot's mood turns.
export const QuestionFlipScene: React.FC<{ durationInFrames: number; kicker?: string; q1: string; q2: string; crossAt?: number; q1At?: number; tint?: string }> = ({ durationInFrames, kicker = "THE WRONG QUESTION", q1, q2, crossAt = 150, q1At = 40, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q1In = spring({ frame: frame - q1At, fps, config: { stiffness: 220, damping: 16 }, durationInFrames: 16 });
  const crossed = frame >= crossAt;
  const fall = crossed ? interpolate(Math.min((frame - crossAt - 10) / 20, 1), [0, 1], [0, 240], CLAMP) : 0;
  const q2In = spring({ frame: frame - crossAt - 16, fps, config: { stiffness: 180, damping: 15 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x131} depth tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: CYAN, opacity: interpolate(frame, [0, 10], [0, 1], CLAMP), transform: "translateZ(0)" }}>{kicker}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <CartoonRobot pose={poseTimeline(frame, [[0, "thinking"], [crossAt, "worried"]])} size={230} lookX={crossed ? 5 : 0} />
          <div style={{ position: "relative", width: 900, height: 300 }}>
            {/* the bright question: crossed out, then it drops away */}
            <div style={{ position: "absolute", top: 20, left: 0, opacity: q1In * (crossed ? Math.max(0, 1 - (frame - crossAt - 10) / 22) : 1), transform: `translate(${interpolate(q1In, [0, 1], [80, 0])}px, ${fall}px) rotate(${crossed ? (frame - crossAt) * 0.8 : 0}deg)` }}>
              <div style={{ ...chip(CYAN, 40), padding: "18px 30px", textDecoration: crossed ? "line-through" : "none" }}>{q1}</div>
            </div>
            <div style={{ position: "absolute", top: -8, left: -30 }}>
              <Mark kind="cross" at={crossAt} size={100} />
            </div>
            {/* the darker question rises */}
            <div style={{ position: "absolute", top: 150, left: 30, opacity: interpolate(q2In, [0, 0.4], [0, 1]), transform: `translateY(${interpolate(q2In, [0, 1], [80, 0])}px) scale(${interpolate(q2In, [0, 1], [0.85, 1])})` }}>
              <div style={{ ...chip(RED, 44), padding: "20px 34px", boxShadow: `0 0 40px ${RED}44` }}>{q2}</div>
            </div>
            <Sparks at={crossAt} x={430} y={60} color={RED} size={140} />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// THE STACK: three model blocks thud in side by side — Claude, ChatGPT, Grok.
// Claude's slot glows with the mark above it (product identification, not hype).
export const ToolStackScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; blocks?: { label: string; at: number; hero?: boolean }[] }> = ({ durationInFrames, kicker, title, blocks = [{ label: "CLAUDE", at: 10, hero: true }, { label: "CHAT GPT", at: 95 }, { label: "GROK", at: 123 }] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x142} impacts={blocks.map((b) => b.at + 14)}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
          {blocks.map((b) => {
            const e = spring({ frame: frame - b.at, fps, config: { stiffness: 170, damping: 13 }, durationInFrames: 18 });
            const squash = frame > b.at + 10 && frame < b.at + 20 ? 1 - 0.1 * Math.sin(((frame - b.at - 10) / 10) * Math.PI) : 1;
            return (
              <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-260, 0])}px) scale(1, ${squash})` }}>
                {b.hero ? <ClaudeMark size={90} /> : <div style={{ height: 90 }} />}
                <div style={{ filter: b.hero ? "drop-shadow(0 0 26px rgba(217,119,87,0.55))" : "none", opacity: b.hero ? 1 : 0.72 }}>
                  <ModelBlock label={b.label} width={b.hero ? 300 : 250} coreColor={b.hero ? "#D97757" : undefined} />
                </div>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} />
      </div>
    </SceneShell>
  );
};

// SCALE CUTS BOTH WAYS: the turbo bolts on and capability chips light green —
// but a CRACK spreads across the block and TRUST flashes red. Same machine,
// amplifying both.
export const ScaleTrustScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; goods?: { label: string; at: number }[]; crackAt?: number }> = ({ durationInFrames, kicker, title, goods = [{ label: "OUTPUT", at: 70 }, { label: "OPS", at: 145 }, { label: "SPEED", at: 210 }], crackAt = 300 }) => {
  const frame = useCurrentFrame();
  const cracked = frame >= crackAt;
  const crackT = cracked ? Math.min((frame - crackAt) / 18, 1) : 0;
  const alarm = cracked ? 0.5 + 0.5 * Math.sin((frame - crackAt) * 0.4) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x153} mood={cracked ? "danger" : "neutral"} impacts={[crackAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ position: "relative" }}>
            <ModelBlock label="THE BIZ" width={320} coreColor={cracked ? RED : CYAN} />
            <div style={{ position: "absolute", left: -155, top: 62 }}>
              <SpeedModule at={10} label="CLAUDE" />
            </div>
            {/* the crack spreads */}
            {cracked && (
              <svg width={320} height={200} viewBox="0 0 320 200" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d="M 160 10 L 148 52 L 172 84 L 150 122 L 168 158 L 158 188" stroke={RED} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - crackT)} style={{ filter: `drop-shadow(0 0 ${10 * alarm}px ${RED})` }} />
              </svg>
            )}
            <Sparks at={crackAt} x={160} y={90} color={RED} size={150} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {goods.map((g) => {
              const on = frame >= g.at;
              return (
                <div key={g.label} style={{ ...chip(on ? GREEN : "rgba(255,255,255,0.2)"), opacity: on ? 1 : 0.4 }}>
                  {g.label}
                </div>
              );
            })}
            <div style={{ opacity: cracked ? 1 : 0, transform: `scale(${cracked ? 1 + 0.06 * alarm : 0.8})` }}>
              <WarningBadge label="TRUST" delay={crackAt} danger />
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} accent={cracked ? RED : CYAN} />
      </div>
    </SceneShell>
  );
};

// AD FLOOD: ad cards multiply across a grid — some flip to fake "Dr." personas
// with red borders — while the siren spins up. Growth outrunning trust.
export const AdFloodScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; badgeAt?: number }> = ({ durationInFrames, kicker, title, badgeAt = 170 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = 18;
  const siren = frame >= badgeAt ? 0.4 + 0.6 * Math.abs(Math.sin((frame - badgeAt) * 0.4)) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x164} mood={frame >= badgeAt ? "danger" : "neutral"}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 130px)", gap: 14 }}>
            {Array.from({ length: count }, (_, i) => {
              const at = 8 + i * Math.max(5, (badgeAt - 40) / count);
              const e = spring({ frame: frame - at, fps, config: { stiffness: 240, damping: 16 }, durationInFrames: 12 });
              const fake = i % 5 === 2 && frame >= badgeAt;
              return (
                <div key={i} style={{ width: 130, height: 86, borderRadius: 10, border: `3px solid ${fake ? RED : CYAN}`, background: PANEL, opacity: interpolate(e, [0, 0.4], [0, 1]), transform: `scale(${interpolate(e, [0, 1], [0.5, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, boxShadow: fake ? `0 0 ${14 * siren}px ${RED}` : "none" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: fake ? RED : WHITE }}>{fake ? "DR. ???" : "AD"}</span>
                  <div style={{ width: 84, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.25)" }} />
                  <div style={{ width: 60, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} />
                </div>
              );
            })}
          </div>
          {/* siren above the flood */}
          <div style={{ position: "absolute", top: -74, left: "50%", transform: "translateX(-50%)" }}>
            <svg width={90} height={70} viewBox="0 0 90 70">
              <path d="M20 60 A25 25 0 0 1 70 60 Z" fill={RED} opacity={0.35 + 0.65 * siren} style={{ filter: `drop-shadow(0 0 ${16 * siren}px ${RED})` }} />
              <rect x={12} y={58} width={66} height={10} rx={5} fill={PANEL} stroke={RED} strokeWidth={3} />
            </svg>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} accent={RED} />
      </div>
    </SceneShell>
  );
};

// EXPECTATIONS: the wrong mindset gets crossed out over a facepalm; the right
// one gets the check while the robot is already running. Fully label-driven.
export const ExpectationScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string; leftAt?: number; rightAt?: number;
  leftLabel?: string; rightLabel?: string; leftCaption?: string; rightCaption?: string; tint?: string;
}> = ({ durationInFrames, kicker, title, leftAt = 60, rightAt = 150, leftLabel = "EXPECT RICH", rightLabel = "EXPECT FASTER", leftCaption = "QUITS", rightCaption = "USES IT RIGHT", tint }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x175} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 170 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: interpolate(frame, [leftAt - 10, leftAt], [0.3, 1], CLAMP) }}>
            <div style={{ position: "relative" }}>
              <div style={{ ...chip(RED, 32), textDecoration: frame >= leftAt + 30 ? "line-through" : "none" }}>{leftLabel}</div>
              <div style={{ position: "absolute", top: -34, right: -46 }}>
                <Mark kind="cross" at={leftAt + 30} size={84} />
              </div>
            </div>
            <CartoonRobot pose={frame >= leftAt + 34 ? "facepalm" : "idle"} size={210} accent={RED} />
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: "rgba(255,255,255,0.6)", transform: "translateZ(0)" }}>{leftCaption}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: interpolate(frame, [rightAt - 10, rightAt], [0.3, 1], CLAMP) }}>
            <div style={{ position: "relative" }}>
              <div style={chip(GREEN, 32)}>{rightLabel}</div>
              <div style={{ position: "absolute", top: -34, right: -46 }}>
                <Mark kind="check" at={rightAt + 24} size={84} />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <CartoonRobot pose={frame >= rightAt ? "walking" : "idle"} size={210} accent={GREEN} />
              {frame >= rightAt + 10 && <div style={{ position: "absolute", left: -120, top: 100 }}><SpeedTrails width={120} color={GREEN} /></div>}
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: GREEN, transform: "translateZ(0)" }}>{rightCaption}</span>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={80} />
      </div>
    </SceneShell>
  );
};

// KNOWING → DOING: two platforms with a gap; the CLAUDE bridge slides across
// and the robot WALKS over it. The gap-shrinking, literally.
export const GapBridgeScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; bridgeAt?: number }> = ({ durationInFrames, kicker, title, bridgeAt = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bridge = spring({ frame: frame - bridgeAt, fps, config: { stiffness: 120, damping: 16 }, durationInFrames: 26 });
  const bridgeW = interpolate(bridge, [0, 1], [0, 380]);
  const walkStart = bridgeAt + 34;
  const platform = (label: string, x: number) => (
    <div style={{ position: "absolute", left: x, bottom: 0, width: 330, height: 120, borderRadius: "14px 14px 0 0", background: PANEL, border: `4px solid ${CYAN}`, borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 3, color: WHITE, transform: "translateZ(0)" }}>{label}</span>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x186} depth>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 1240, height: 400 }}>
          {platform("KNOWING", 40)}
          {platform("DOING", 870)}
          {/* the Claude bridge slides across the gap */}
          <div style={{ position: "absolute", left: 370, bottom: 104, width: bridgeW, height: 18, borderRadius: 9, background: `linear-gradient(90deg, #D97757, ${AMBER})`, boxShadow: "0 0 18px rgba(217,119,87,0.6)", overflow: "hidden" }}>
            <span style={{ position: "absolute", left: 130, top: -1, fontFamily: FONT, fontWeight: 900, fontSize: 15, letterSpacing: 2, color: "#1A0F0A" }}>CLAUDE</span>
          </div>
          {/* the robot crosses once the bridge lands */}
          <MoveAlong start={walkStart} end={walkStart + 70} fromX={150} toX={950} bottom={112} puffs={false}>
            <CartoonRobot pose={frame >= walkStart && frame <= walkStart + 70 ? "walking" : frame > walkStart + 70 ? "celebrate" : "waiting"} size={190} accent={frame > walkStart + 70 ? GREEN : CYAN} />
          </MoveAlong>
          <Sparks at={bridgeAt + 26} x={750} y={290} color={AMBER} size={130} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={88} />
      </div>
    </SceneShell>
  );
};

// THE PHYSICAL BOTTLENECK: racks power the AI — one overheats, and the robot
// ELECTRICIAN with the wrench is the one who matters.
export const DataCenterScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; overheatAt?: number; fixAt?: number }> = ({ durationInFrames, kicker, title, overheatAt = 70, fixAt = 160 }) => {
  const frame = useCurrentFrame();
  const fixed = frame >= fixAt + 20;
  const wrenchRot = frame >= fixAt && !fixed ? 22 * Math.sin((frame - fixAt) * 0.7) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x197} mood={fixed ? "win" : "neutral"} impacts={[overheatAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          <ServerRack width={230} />
          <div style={{ position: "relative" }}>
            <ServerRack width={230} overheatAt={fixed ? 999999 : overheatAt} />
            <Sparks at={fixAt + 20} x={115} y={200} color={GREEN} size={140} />
          </div>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <CartoonRobot pose={fixed ? "celebrate" : frame >= overheatAt ? "worried" : "idle"} size={210} accent={fixed ? GREEN : AMBER} lookX={-5} />
            <div style={{ position: "absolute", left: -66, top: 96, transform: `rotate(${wrenchRot}deg)`, transformOrigin: "80% 20%" }}>
              <svg width={80} height={80} viewBox="0 0 100 100">
                <path d="M74 20 a16 16 0 1 0 6 26 L40 86 a10 10 0 0 1-14-14 L66 32 Z" fill="#B9C4D4" stroke="#DDE5F0" strokeWidth={3} />
              </svg>
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} />
      </div>
    </SceneShell>
  );
};

// MONEY FLOWS TO THE CONSTRAINT: requests jam at the funnel's neck; the robot
// standing AT the bottleneck is the one the coins fall on.
export const NearBottleneckScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; coinsAt?: number; labels?: string[] }> = ({ durationInFrames, kicker, title, coinsAt = 200, labels = ["SOFTWARE", "REGULATION", "INFRA"] }) => {
  const frame = useCurrentFrame();
  const coins = Array.from({ length: 6 }, (_, i) => coinsAt + i * 16);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x1a8} mood={frame >= coinsAt ? "win" : "neutral"}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ position: "relative", width: 1200, height: 380 }}>
          {/* funnel walls */}
          <svg width={1200} height={300} viewBox="0 0 1200 300" style={{ position: "absolute", top: 0 }}>
            <path d="M 80 20 L 640 120 L 640 190 L 80 290" stroke="rgba(255,255,255,0.3)" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M 1120 20 L 700 120 L 700 190 L 1120 290" stroke="rgba(255,255,255,0.3)" strokeWidth={6} fill="none" strokeLinecap="round" />
          </svg>
          {/* jam of requests on the wide side */}
          <div style={{ position: "absolute", left: 60, top: 100 }}>
            <TrafficJam cars={["REQ", "REQ", "REQ", "REQ"]} at={6} width={520} />
          </div>
          {/* constraint labels over the neck */}
          <div style={{ position: "absolute", left: 560, top: -8, display: "flex", gap: 12 }}>
            {labels.map((l, i) => (
              <div key={l} style={{ ...chip(AMBER, 20), opacity: interpolate(frame, [40 + i * 22, 52 + i * 22], [0, 1], CLAMP) }}>{l}</div>
            ))}
          </div>
          {/* the robot AT the neck, coins landing on it */}
          <div style={{ position: "absolute", left: 620, top: 128 }}>
            <CartoonRobot pose={frame >= coinsAt + 20 ? "celebrate" : "pointing"} size={190} accent={frame >= coinsAt + 20 ? GREEN : CYAN} />
          </div>
          {coins.map((t, i) => (
            <div key={i} style={{ position: "absolute", left: 640 + (i % 3) * 34, top: 70 }}>
              <TokenCoin at={Math.round(t)} fallH={190} size={44} />
            </div>
          ))}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={80} />
      </div>
    </SceneShell>
  );
};

// BREAKTHROUGH: the mirror of SpeedWallScene — aimed at the RIGHT wall, the
// rocket punches THROUGH it and the win chips land behind it.
export const BreakthroughScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; wallLabel?: string; chips?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, wallLabel = "BOTTLENECK", chips = [] }) => {
  const frame = useCurrentFrame();
  const hitAt = 88;
  const antic = interpolate(frame, [30, 44], [0, -34], CLAMP);
  const dash = interpolate(frame, [44, hitAt], [0, 620], { ...CLAMP, easing: (t) => t * t });
  const through = interpolate(frame, [hitAt, hitAt + 30], [0, 150], CLAMP);
  const broke = frame >= hitAt;
  const gapT = broke ? Math.min((frame - hitAt) / 12, 1) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x1b9} mood="win" impacts={[hitAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1340, height: 320 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, height: 4, background: "rgba(255,255,255,0.16)" }} />
          {/* the wall breaks into two halves */}
          <div style={{ position: "absolute", right: 460, bottom: 34 }}>
            <div style={{ position: "absolute", bottom: 0, width: 34, height: 230 * (1 - gapT * 0.15), transform: `translateX(${-gapT * 26}px) rotate(${-gapT * 16}deg)`, transformOrigin: "bottom left", background: "rgba(52,211,153,0.35)", border: `4px solid ${broke ? GREEN : AMBER}`, borderRadius: 8, clipPath: "polygon(0 0, 100% 12%, 100% 100%, 0 100%)" }} />
            <div style={{ position: "absolute", bottom: 0, width: 34, height: 230 * (1 - gapT * 0.15), transform: `translateX(${gapT * 40}px) rotate(${gapT * 18}deg)`, transformOrigin: "bottom right", background: "rgba(52,211,153,0.35)", border: `4px solid ${broke ? GREEN : AMBER}`, borderRadius: 8, clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0 100%)" }} />
            <span style={{ position: "absolute", top: -270, left: -80, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE, transform: "translateZ(0)" }}>{wallLabel}</span>
          </div>
          {/* the rocket punches through and keeps going */}
          <div style={{ position: "absolute", left: 40 + antic + dash + through, bottom: 96 }}>
            <svg width={220} height={100} viewBox="0 0 220 100" style={{ overflow: "visible" }}>
              <path d={`M8 40 L${-18 - 10 * Math.abs(Math.sin(frame * 0.6))} 50 L8 60 Z`} fill={AMBER} opacity={0.9} />
              <rect x={8} y={26} width={150} height={48} rx={18} fill={PANEL} stroke={broke ? GREEN : CYAN} strokeWidth={5} />
              <path d="M158 26 C 196 34 196 66 158 74 Z" fill={broke ? GREEN : CYAN} opacity={0.9} />
              <path d="M22 26 L40 6 L66 26 Z" fill={broke ? GREEN : CYAN} opacity={0.85} />
              <path d="M22 74 L40 94 L66 74 Z" fill={broke ? GREEN : CYAN} opacity={0.85} />
              <text x={86} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={20} fill={WHITE}>SPEED</text>
            </svg>
            {frame > 46 && <div style={{ position: "absolute", left: -160, top: 26 }}><SpeedTrails width={150} color={broke ? GREEN : CYAN} /></div>}
          </div>
          <Sparks at={hitAt} x={880} y={160} color={GREEN} size={190} />
          <Puff at={hitAt + 10} x={890} y={280} size={160} />
          {/* what starts once you're through — on the empty run-up side */}
          <div style={{ position: "absolute", left: 30, top: 10, display: "flex", flexDirection: "column", gap: 14 }}>
            {chips.map((c) => (
              <div key={c.label} style={{ ...chip(GREEN, 24), opacity: interpolate(frame, [c.at, c.at + 10], [0, 1], CLAMP), transform: `translateZ(0) translateY(${interpolate(frame, [c.at, c.at + 12], [24, 0], CLAMP)}px)` }}>{c.label}</div>
            ))}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// MISSING FOUNDATIONS: the average person's tower — one foundation block gets
// pulled and the whole thing comes down on the worried robot.
export const MissingPiecesScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; labels?: string[]; pullAt?: number; collapseAt?: number }> = ({ durationInFrames, kicker, title, labels = ["THE OUTLIER", "TEAM", "BUYER", "DISTRIBUTION", "BIG MARKET"], pullAt = 60, collapseAt = 200 }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x1ca} impacts={[collapseAt]} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, transform: "translateY(-44px)" }}>
          <JengaTower pullAt={pullAt} collapseAt={collapseAt} rows={labels.length} pullRow={1} labels={[...labels].reverse()} blockW={280} blockH={48} />
          <div style={{ marginBottom: 10 }}>
            <CartoonRobot pose={frame >= collapseAt ? "alarmed" : frame >= pullAt ? "worried" : "idle"} size={190} accent={frame >= collapseAt ? RED : CYAN} lookX={-5} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={80} accent={RED} />
      </div>
    </SceneShell>
  );
};
