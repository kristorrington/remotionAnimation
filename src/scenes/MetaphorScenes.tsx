import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, CYAN, WHITE, RED, AMBER, GREEN, PANEL } from "../motion/subjects";
import { ModelBlock, SpeedTrails, TokenCoin, CostMeterClimb, ConveyorBelt } from "../motion/objects";
import { ImpactStamp, WarningBadge } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// METAPHOR SCENES — the second-half beats as tiny animated scenes (a subject
// doing something with cause and effect), replacing the old title cards.
// ============================================================================

// SVG check/cross that slams in at `at` (never a font glyph — render-safe).
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

const chipStyle = (color: string): React.CSSProperties => ({
  padding: "8px 18px", borderRadius: 10, background: PANEL, border: `3px solid ${color}`,
  fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

// FASTER ≠ CHEAPER BILL — the belt speeds up, API-call cards stream faster, and
// the bill printer prints FASTER too. Cause and effect: speed feeds the bill.
export const BillPrinterScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const speed = interpolate(frame, [0, durationInFrames], [4, 10]);
  const beltW = 760;
  const paperH = interpolate(frame, [20, durationInFrames - 20], [30, 300], { ...CLAMP, easing: (t) => t * t });
  const shake = paperH > 120 ? Math.sin(frame * 0.9) * 2.5 : 0;
  const cards = Array.from({ length: 5 }, (_, i) => (i * (beltW / 5) + frame * speed) % (beltW + 40));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x71}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
          {/* speeding belt of API calls */}
          <div style={{ position: "relative", width: beltW, height: 150, marginTop: 60 }}>
            {cards.map((x, i) => (
              <div key={i} style={{ position: "absolute", left: x - 20, top: 0, ...chipStyle(CYAN) }}>API CALL</div>
            ))}
            <div style={{ position: "absolute", top: 70, left: 0 }}><ConveyorBelt width={beltW} speed={speed} /></div>
            <div style={{ position: "absolute", left: -170, top: 26 }}><SpeedTrails width={150} /></div>
          </div>
          {/* the bill printer keeps pace */}
          <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
            <svg width={230} height={130} viewBox="0 0 230 130">
              <rect x={10} y={20} width={210} height={90} rx={18} fill={PANEL} stroke={AMBER} strokeWidth={5} />
              <rect x={40} y={100} width={150} height={10} rx={5} fill="#0a0f18" stroke={AMBER} strokeWidth={3} />
              <circle cx={190} cy={45} r={8} fill={RED} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame * 0.4))} />
              <text x={100} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={WHITE}>BILLING</text>
            </svg>
            {/* the bill grows */}
            <div style={{ position: "absolute", left: 55, top: 112, width: 120, height: paperH, background: "rgba(240,244,255,0.92)", borderRadius: "0 0 8px 8px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} style={{ margin: "12px 12px 0", height: 8, borderRadius: 4, background: i % 3 === 2 ? "rgba(239,68,68,0.75)" : "rgba(10,15,24,0.5)", width: i % 3 === 2 ? 50 : 96 }} />
              ))}
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={88} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// GET CHEAPER? — the cost meter DROPS at small scale… then hidden loops, retries
// and tool calls pump coins straight back in and it climbs past where it started.
export const HiddenCostScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; chipLabels?: [string, string, string]; chipAts?: [number, number, number]; tint?: string }> = ({ durationInFrames, kicker, title, chipLabels = ["RETRY", "LOOP", "TOOL CALLS"], chipAts, tint }) => {
  const frame = useCurrentFrame();
  const riseAt = Math.round(durationInFrames * 0.38);
  const level = interpolate(frame, [10, riseAt - 20, riseAt + 60, durationInFrames - 30], [0.55, 0.28, 0.6, 0.92], CLAMP);
  const chips = [
    { label: chipLabels[0], at: chipAts?.[0] ?? riseAt },
    { label: chipLabels[1], at: chipAts?.[1] ?? riseAt + 45 },
    { label: chipLabels[2], at: chipAts?.[2] ?? riseAt + 90 },
  ];
  const coins = Array.from({ length: 8 }, (_, i) => riseAt + 10 + i * 22);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x82} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 70 }}>
          <CartoonRobot pose={frame < riseAt ? "idle" : "worried"} size={210} accent={frame < riseAt ? GREEN : AMBER} />
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -40, bottom: 120 }}>
              {coins.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 3) * 26 - 26, bottom: 0 }}>
                  <TokenCoin at={Math.round(t)} fallH={220 + (i % 3) * 40} size={44} />
                </div>
              ))}
            </div>
            <CostMeterClimb level={level} height={320} label="COST" />
          </div>
          {/* the hidden culprits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 60 }}>
            {chips.map((c) => (
              <WarningBadge key={c.label} label={c.label} delay={c.at} danger />
            ))}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={frame < riseAt ? GREEN : RED} />
      </div>
    </SceneShell>
  );
};

// SPEED ≠ SUCCESS — a boosted rocket flies FAST, straight into the WRONG ANSWER
// wall. Fast, and still failed.
export const SpeedWallScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; wallLabel?: string; rocketLabel?: string }> = ({ durationInFrames, kicker, title, wallLabel = "WRONG ANSWER", rocketLabel = "FAST" }) => {
  const frame = useCurrentFrame();
  const hitAt = 88;
  const antic = interpolate(frame, [30, 44], [0, -34], CLAMP);
  const dash = interpolate(frame, [44, hitAt], [0, 880], { ...CLAMP, easing: (t) => t * t });
  const crashed = frame >= hitAt;
  const crumple = crashed ? interpolate(Math.min((frame - hitAt) / 12, 1), [0, 1], [1, 0.62]) : 1;
  const fall = crashed ? interpolate(Math.min((frame - hitAt) / 26, 1), [0, 1], [0, 130]) : 0;
  const rot = crashed ? Math.min((frame - hitAt) * 2.4, 38) : 0;
  const wallShake = crashed && frame < hitAt + 14 ? Math.sin(frame * 1.3) * 6 : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x93} mood="danger" depth impacts={[hitAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1340, height: 320 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, height: 4, background: "rgba(255,255,255,0.16)" }} />
          {/* the wall */}
          <div style={{ position: "absolute", right: 120, bottom: 34, transform: `translateX(${wallShake}px)` }}>
            <div style={{ width: 34, height: 230, background: "rgba(239,68,68,0.5)", border: `4px solid ${RED}`, borderRadius: 8 }} />
            <span style={{ position: "absolute", top: -44, left: -80, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE, transform: "translateZ(0)" }}>{wallLabel}</span>
            {crashed && <div style={{ position: "absolute", top: 40, left: 14, width: 5, height: 120, background: RED, transform: "rotate(14deg)", opacity: 0.8 }} />}
          </div>
          {/* the rocket */}
          <div style={{ position: "absolute", left: 40 + antic + dash, bottom: 90 }}>
            <div style={{ transform: `translateY(${fall}px) rotate(${rot}deg) scaleX(${crumple})`, transformOrigin: "right center" }}>
              <svg width={220} height={100} viewBox="0 0 220 100" style={{ overflow: "visible" }}>
                {!crashed && <path d={`M8 40 L${-18 - 10 * Math.abs(Math.sin(frame * 0.6))} 50 L8 60 Z`} fill={AMBER} opacity={0.9} />}
                <rect x={8} y={26} width={150} height={48} rx={18} fill={PANEL} stroke={CYAN} strokeWidth={5} />
                <path d="M158 26 C 196 34 196 66 158 74 Z" fill={CYAN} opacity={0.9} />
                <path d="M22 26 L40 6 L66 26 Z" fill={CYAN} opacity={0.85} />
                <path d="M22 74 L40 94 L66 74 Z" fill={CYAN} opacity={0.85} />
                <text x={86} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={22} fill={WHITE}>{rocketLabel}</text>
              </svg>
            </div>
            {!crashed && frame > 46 && <div style={{ position: "absolute", left: -160, top: 26 }}><SpeedTrails width={150} /></div>}
          </div>
          <Sparks at={hitAt} x={1180} y={170} color={RED} size={190} />
          <Puff at={hitAt + 14} x={1120} y={280} size={170} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={RED} />
      </div>
    </SceneShell>
  );
};

// CHEAPER TO SERVE — the "got smarter" meter tries to rise and gets crossed out;
// the serve-cost meter actually DROPS. The real story, animated.
export const CheaperToServeScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; leftLabel?: string; rightLabel?: string }> = ({ durationInFrames, kicker, title, leftLabel = "SMARTER?", rightLabel = "COST TO SERVE" }) => {
  const frame = useCurrentFrame();
  // timings scale with the beat so short cards still land the check
  const crossAt = Math.round(durationInFrames * 0.28);
  const serveStart = Math.round(durationInFrames * 0.44);
  const smart = interpolate(frame, [20, crossAt - 30, crossAt - 5], [0.2, 0.42, 0.38], CLAMP);
  const serve = interpolate(frame, [serveStart, serveStart + durationInFrames * 0.28], [0.82, 0.24], CLAMP);
  const meter = (label: string, level: number, color: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 70, height: 280, borderRadius: 16, border: "3px solid rgba(255,255,255,0.25)", background: "rgba(8,12,20,0.8)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${level * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}88)`, boxShadow: `0 0 16px ${color}` }} />
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: WHITE, transform: "translateZ(0)" }}>{label}</span>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa4}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 130 }}>
          <div style={{ position: "relative" }}>
            {meter(leftLabel, smart, RED)}
            <div style={{ position: "absolute", top: 60, left: -20 }}>
              <Mark kind="cross" at={crossAt} size={120} />
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {meter(rightLabel, serve, GREEN)}
            <div style={{ position: "absolute", top: 60, left: -14 }}>
              <Mark kind="check" at={Math.round(serveStart + durationInFrames * 0.3)} size={120} />
            </div>
            <div style={{ position: "absolute", left: 90, bottom: 40 }}>
              <TokenCoin at={serveStart + 40} fallH={200} size={44} />
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// BIG MODELS, LESS PAIN — the big block powers up and the pain badges POP away
// one by one; the robot finally relaxes.
export const LessPainScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const pains = [
    { label: "LATENCY", at: 70 },
    { label: "RETRIES", at: 120 },
    { label: "COST", at: 170 },
  ];
  const relieved = frame >= 180;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb6}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          <ModelBlock label="V4" width={340} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
            {pains.map((p) => {
              const gone = frame >= p.at;
              const shrink = gone ? Math.max(0, 1 - (frame - p.at) / 10) : 1;
              return (
                <div key={p.label} style={{ position: "relative", transform: `scale(${shrink})`, opacity: shrink }}>
                  <WarningBadge label={p.label} delay={6} danger />
                  <Puff at={p.at} x={70} y={20} size={120} />
                </div>
              );
            })}
          </div>
          <CartoonRobot pose={relieved ? "celebrate" : "worried"} size={220} accent={relieved ? GREEN : AMBER} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={88} />
      </div>
    </SceneShell>
  );
};

// BENCHMARKS LIE — the shiny scoreboard placard DROPS, revealing the messy
// real-world workflow behind it while the siren spins up.
export const BenchmarksLieScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; messLabels?: [string, string, string] }> = ({ durationInFrames, kicker, title, messLabels = ["RETRY LOOP", "TOOL FAIL", "TIMEOUT"] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealAt = Math.round(durationInFrames * 0.4);
  const drop = spring({ frame: frame - revealAt, fps, config: { stiffness: 120, damping: 12 }, durationInFrames: 24 });
  const boardY = interpolate(drop, [0, 1], [0, 340]);
  const boardRot = interpolate(drop, [0, 1], [0, 16]);
  const boardOp = 1 - drop; // fully gone once dropped — never sits on the headline
  const revealed = frame >= revealAt;
  const siren = revealed ? 0.4 + 0.6 * Math.abs(Math.sin((frame - revealAt) * 0.4)) : 0;
  const mess = [
    { label: messLabels[0], x: -180, y: -30, rot: -8 },
    { label: messLabels[1], x: 40, y: 40, rot: 6 },
    { label: messLabels[2], x: -60, y: 110, rot: -4 },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc8} mood="danger" impacts={[revealAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 700, height: 360 }}>
          {/* the messy reality (behind) */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: revealed ? 1 : 0 }}>
            {mess.map((m) => (
              <div key={m.label} style={{ position: "absolute", left: 300 + m.x, top: 120 + m.y, transform: `rotate(${m.rot + (revealed ? Math.sin(frame * 0.3) * 2 : 0)}deg)`, ...chipStyle(RED) }}>{m.label}</div>
            ))}
            {/* siren */}
            <div style={{ position: "absolute", top: -8, left: 310 }}>
              <svg width={90} height={70} viewBox="0 0 90 70">
                <path d="M20 60 A25 25 0 0 1 70 60 Z" fill={RED} opacity={0.4 + 0.6 * siren} style={{ filter: `drop-shadow(0 0 ${16 * siren}px ${RED})` }} />
                <rect x={12} y={58} width={66} height={10} rx={5} fill={PANEL} stroke={RED} strokeWidth={3} />
              </svg>
            </div>
          </div>
          {/* the shiny scoreboard (drops away) */}
          <div style={{ position: "absolute", left: 130, top: 20, transform: `translateY(${boardY}px) rotate(${boardRot}deg)`, opacity: boardOp }}>
            <div style={{ width: 440, borderRadius: 20, border: `4px solid ${CYAN}`, background: PANEL, padding: "24px 30px", display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 16px 44px rgba(0,0,0,0.5)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: CYAN, transform: "translateZ(0)" }}>BENCHMARK</span>
              {[96, 98, 99].map((v, i) => (
                <div key={v} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${v * interpolate(frame, [10 + i * 12, 34 + i * 12], [0, 1], CLAMP)}%`, height: "100%", background: GREEN, boxShadow: `0 0 10px ${GREEN}` }} />
                  </div>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: GREEN, width: 64, transform: "translateZ(0)" }}>{v}%</span>
                </div>
              ))}
            </div>
          </div>
          <Puff at={revealAt + 18} x={350} y={340} size={200} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={RED} />
      </div>
    </SceneShell>
  );
};

// DON'T MIGRATE — TEST: the robot carries its app toward the MIGRATE gate, the
// STOP sign slams down, and it walks back to the TEST BENCH instead.
export const MigrateStopScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stopAt = Math.round(durationInFrames * 0.34);
  const turnAt = stopAt + 16;
  const walk = interpolate(frame, [8, stopAt], [140, 830], CLAMP);
  const back = interpolate(frame, [turnAt, durationInFrames - 40], [0, -560], CLAMP);
  const x = walk + back;
  const flipped = frame >= turnAt;
  const stop = spring({ frame: frame - stopAt, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 16 });
  const stopY = interpolate(stop, [0, 1], [-420, 0]);
  const pose = frame < stopAt ? "idle" : frame < turnAt ? "alarmed" : frame > durationInFrames - 70 ? "celebrate" : "worried";
  const sign = (label: string, color: string) => (
    <div style={{ ...chipStyle(color), fontSize: 28 }}>{label}</div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xd2} depth impacts={[stopAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", width: 1400, height: 380 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 42, height: 5, background: "rgba(255,255,255,0.16)" }} />
          <div style={{ position: "absolute", right: 20, bottom: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {sign("MIGRATE", RED)}
            <div style={{ width: 12, height: 120, background: "rgba(255,255,255,0.2)", borderRadius: 6 }} />
          </div>
          <div style={{ position: "absolute", left: 20, bottom: 56, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: interpolate(frame, [turnAt, turnAt + 10], [0.45, 1], CLAMP) }}>
            {sign("TEST BENCH", GREEN)}
            <div style={{ width: 170, height: 18, borderRadius: 6, background: "rgba(52,211,153,0.3)", border: `3px solid ${GREEN}` }} />
          </div>
          {frame >= stopAt && (
            <div style={{ position: "absolute", right: 240, bottom: 86, transform: `translateY(${stopY}px)` }}>
              <svg width={170} height={215} viewBox="0 0 100 130" style={{ overflow: "visible" }}>
                <line x1={50} y1={70} x2={50} y2={126} stroke="rgba(255,255,255,0.4)" strokeWidth={7} />
                <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill={RED} stroke={WHITE} strokeWidth={5} />
                <text x={50} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={WHITE}>STOP</text>
              </svg>
            </div>
          )}
          <Sparks at={stopAt} x={1080} y={190} color={RED} size={170} />
          <div style={{ position: "absolute", left: x, bottom: 26, transform: `scaleX(${flipped ? -1 : 1})` }}>
            <div style={{ position: "relative" }}>
              <CartoonRobot pose={pose} size={230} accent={pose === "celebrate" ? GREEN : CYAN} />
              {/* counter-flip so the APP label never mirrors when the robot turns */}
              <div style={{ position: "absolute", right: -50, bottom: 30, transform: `scaleX(${flipped ? -1 : 1})` }}>
                <svg width={92} height={80} viewBox="0 0 84 72">
                  <rect x={6} y={20} width={72} height={48} rx={10} fill={PANEL} stroke={AMBER} strokeWidth={4} />
                  <path d="M30 20 V12 a6 6 0 0 1 6-6 h12 a6 6 0 0 1 6 6 v8" stroke={AMBER} strokeWidth={4} fill="none" />
                  <text x={42} y={51} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={16} fill={WHITE}>APP</text>
                </svg>
              </div>
            </div>
          </div>
          <Sparks at={durationInFrames - 66} x={260} y={220} color={GREEN} size={150} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={84} />
      </div>
    </SceneShell>
  );
};

// 20–30% OR SKIP — the decision gate: a 5% result hits the trapdoor; a 25%
// result opens the gate and sails through with trails.
export const ThresholdGateScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; failLabel?: string; passLabel?: string; zoneLabel?: string; skipStamp?: string; tint?: string }> = ({ durationInFrames, kicker, title, failLabel = "5%", passLabel = "25%", zoneLabel = "20–30%", skipStamp = "SKIP", tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gateX = 760;
  // attempt 1: 5% → trapdoor
  const dropAt = 84;
  const x1 = interpolate(frame, [14, 64], [60, gateX - 150], CLAMP);
  const trap = spring({ frame: frame - dropAt, fps, config: { stiffness: 180, damping: 14 }, durationInFrames: 18 });
  const trapRot = interpolate(trap, [0, 1], [0, 78]); // swings DOWN (a trapdoor)
  const fall1 = frame >= dropAt ? interpolate(Math.min((frame - dropAt) / 20, 1), [0, 1], [0, 140]) : 0;
  const rot1 = frame >= dropAt ? Math.min((frame - dropAt) * 4, 50) : 0;
  const card1Op = interpolate(frame, [dropAt + 12, dropAt + 26], [1, 0], CLAMP);
  // attempt 2: 25% → gate lifts
  const startAt2 = Math.round(durationInFrames * 0.52);
  const liftAt = startAt2 + 52;
  const x2 = interpolate(frame, [startAt2, startAt2 + 50], [60, gateX - 150], CLAMP) + interpolate(frame, [liftAt + 6, liftAt + 40], [0, 560], CLAMP);
  const lift = spring({ frame: frame - liftAt, fps, config: { stiffness: 160, damping: 15 }, durationInFrames: 20 });
  const gateY = interpolate(lift, [0, 1], [0, -150]);
  const passed = frame >= liftAt + 20;
  const card = (label: string, x: number, extra: React.CSSProperties, color: string) => (
    <div style={{ position: "absolute", left: x, bottom: 96, ...chipStyle(color), fontSize: 30, ...extra }}>{label}</div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xe3} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1340, height: 340 }}>
          {/* ground with a trapdoor segment before the gate */}
          <div style={{ position: "absolute", left: 0, width: gateX - 210, bottom: 86, height: 5, background: "rgba(255,255,255,0.16)" }} />
          <div style={{ position: "absolute", left: gateX - 210, bottom: 88, width: 120, height: 5, background: RED, transformOrigin: "left center", transform: `rotate(${trapRot}deg)`, opacity: 0.8 }} />
          <div style={{ position: "absolute", left: gateX - 10, right: 0, bottom: 86, height: 5, background: "rgba(255,255,255,0.16)" }} />
          {/* the gate */}
          <div style={{ position: "absolute", left: gateX, bottom: 90 }}>
            <div style={{ position: "absolute", left: 0, bottom: 0, width: 14, height: 210, background: "rgba(255,255,255,0.22)", borderRadius: 6 }} />
            <div style={{ position: "absolute", left: -150, bottom: 130, transform: `translateY(${gateY}px)`, width: 160, height: 16, borderRadius: 8, background: passed ? GREEN : AMBER, boxShadow: `0 0 14px ${passed ? GREEN : AMBER}` }} />
            <div style={{ position: "absolute", left: -66, bottom: 226, ...chipStyle(GREEN), fontSize: 22 }}>{zoneLabel}</div>
          </div>
          {/* attempt 1: the small/vague one falls through */}
          {frame < dropAt + 28 && card(failLabel, x1, { transform: `translateY(${fall1}px) rotate(${rot1}deg) translateZ(0)`, opacity: card1Op }, RED)}
          {frame >= dropAt && frame < startAt2 - 10 && (
            <div style={{ position: "absolute", left: 180, top: 6 }}>
              <ImpactStamp text={skipStamp} at={dropAt + 12} color={RED} />
            </div>
          )}
          <Puff at={dropAt + 20} x={gateX - 140} y={330} size={150} />
          {/* attempt 2: 25% passes */}
          {frame >= startAt2 && (
            <div style={{ position: "absolute", left: x2, bottom: 96 }}>
              <div style={{ position: "relative" }}>
                <div style={{ ...chipStyle(GREEN), fontSize: 30 }}>{passLabel}</div>
                {passed && <div style={{ position: "absolute", left: -140, top: 6 }}><SpeedTrails width={130} color={GREEN} /></div>}
              </div>
            </div>
          )}
          <Sparks at={liftAt + 12} x={gateX + 60} y={190} color={GREEN} size={150} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// PLUMBING > HYPE — the flashy model sits on top; underneath, the pipes do the
// real work. A plumber robot tightens the leaking joint and the flow goes green.
export const PlumbingScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const fixAt = Math.round(durationInFrames * 0.44);
  const fixed = frame >= fixAt + 24;
  const wrenchRot = frame >= fixAt && !fixed ? 20 * Math.sin((frame - fixAt) * 0.7) : 0;
  const flow = fixed ? (frame * 6) % 60 : 0;
  const leakT = ((frame * 0.045) % 1);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xf4}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 1000, height: 400 }}>
          {/* the flashy model up top */}
          <div style={{ position: "absolute", left: 330, top: 0, transform: `translateY(${4 * Math.sin(frame * 0.06)}px)` }}>
            <ModelBlock label="V4" width={300} />
          </div>
          {/* the pipes underneath */}
          <svg width={1000} height={170} viewBox="0 0 1000 170" style={{ position: "absolute", left: 0, top: 210, overflow: "visible" }}>
            <path d="M40 30 H 380 V 90 H 960" stroke={fixed ? GREEN : "#8899AA"} strokeWidth={26} fill="none" strokeLinecap="round" style={{ filter: fixed ? `drop-shadow(0 0 10px ${GREEN})` : undefined }} />
            {/* flanges */}
            {[[380, 30], [380, 90], [660, 90]].map(([fx, fy]) => (
              <rect key={`${fx}-${fy}`} x={fx - 20} y={fy - 22} width={40} height={44} rx={8} fill={PANEL} stroke={fixed ? GREEN : "#8899AA"} strokeWidth={5} />
            ))}
            {/* flow dashes once fixed */}
            {fixed && Array.from({ length: 10 }, (_, i) => (
              <circle key={i} cx={420 + ((i * 60 + flow) % 520)} cy={90} r={7} fill={GREEN} opacity={0.8} />
            ))}
            {/* leak drips before the fix */}
            {!fixed && (
              <>
                <circle cx={660} cy={116 + leakT * 44} r={7} fill={CYAN} opacity={(1 - leakT) * 0.9} />
                <circle cx={672} cy={116 + ((leakT + 0.4) % 1) * 44} r={5} fill={CYAN} opacity={(1 - ((leakT + 0.4) % 1)) * 0.8} />
              </>
            )}
          </svg>
          {/* plumber robot + wrench at the leaking joint */}
          <div style={{ position: "absolute", left: 700, top: 216 }}>
            <CartoonRobot pose={fixed ? "celebrate" : "worried"} size={180} accent={fixed ? GREEN : AMBER} />
          </div>
          <div style={{ position: "absolute", left: 640, top: 262, transform: `rotate(${wrenchRot}deg)`, transformOrigin: "80% 20%" }}>
            <svg width={90} height={90} viewBox="0 0 100 100">
              <path d="M74 20 a16 16 0 1 0 6 26 L40 86 a10 10 0 0 1-14-14 L66 32 Z" fill="#B9C4D4" stroke="#DDE5F0" strokeWidth={3} />
            </svg>
          </div>
          <Sparks at={fixAt + 24} x={680} y={300} color={GREEN} size={150} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// WORK > TOKENS — the robot pushes completed WORK blocks over the finish line
// while token coins just pile up dimly in the background.
export const WorkOverTokensScene: React.FC<{ durationInFrames: number; kicker?: string; title: string }> = ({ durationInFrames, kicker, title }) => {
  const frame = useCurrentFrame();
  const crossAt = Math.round(durationInFrames * 0.55);
  const push = interpolate(frame, [14, crossAt], [0, 560], { ...CLAMP, easing: (t) => t * t * (3 - 2 * t) });
  const crossed = frame >= crossAt;
  const lean = crossed ? 0 : 7;
  const coins = Array.from({ length: 6 }, (_, i) => 20 + i * 34);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x105} mood="win" impacts={[crossAt]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1340, height: 340 }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: 4, background: "rgba(255,255,255,0.16)" }} />
          {/* dim token pile, background left */}
          <div style={{ position: "absolute", left: 40, bottom: 46, opacity: 0.4 }}>
            <div style={{ position: "relative", width: 160, height: 200 }}>
              {coins.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 3) * 40, bottom: Math.floor(i / 3) * 20 }}>
                  <TokenCoin at={t} fallH={200} size={46} />
                </div>
              ))}
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.5)", transform: "translateZ(0)" }}>TOKENS</span>
          </div>
          {/* finish line */}
          <div style={{ position: "absolute", right: 200, bottom: 44, width: 12, height: 220 }}>
            <svg width={12} height={220} viewBox="0 0 12 220">
              {Array.from({ length: 11 }, (_, i) => (
                <rect key={i} x={0} y={i * 20} width={12} height={10} fill={i % 2 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)"} />
              ))}
            </svg>
            <span style={{ position: "absolute", top: -36, left: -46, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: GREEN, transform: "translateZ(0)" }}>DONE</span>
          </div>
          {/* robot pushing the work blocks */}
          <div style={{ position: "absolute", left: 420 + push, bottom: 30 }}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div style={{ transform: `rotate(${lean}deg)`, transformOrigin: "bottom center" }}>
                <CartoonRobot pose={crossed ? "celebrate" : "idle"} size={200} accent={crossed ? GREEN : CYAN} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: -26, marginBottom: 14 }}>
                {["WORK", "WORK"].map((w, i) => (
                  <div key={i} style={{ ...chipStyle(GREEN), fontSize: 26, transform: `rotate(${i ? -2 : 2}deg) translateZ(0)` }}>{w}</div>
                ))}
              </div>
            </div>
          </div>
          <Sparks at={crossAt} x={1150} y={200} color={GREEN} size={170} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={96} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// CHEAPER TO FINISH? — the work block crosses the line, the stopwatch and cost
// tag land, and the big check stamps the real test.
export const FinishCheckScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; stamp?: string; stampAt?: number }> = ({ durationInFrames, kicker, title, stamp, stampAt = 150 }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [14, 96], [0, 430], CLAMP);
  const crossed = frame >= 96;
  const hand = interpolate(frame, [14, 96], [0, 300], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x116} mood="win" impacts={[96]}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          {/* stopwatch */}
          <svg width={170} height={190} viewBox="0 0 100 114">
            <line x1={50} y1={14} x2={50} y2={4} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
            <circle cx={50} cy={62} r={44} fill={PANEL} stroke={CYAN} strokeWidth={6} />
            <line x1={50} y1={62} x2={50 + 30 * Math.sin((hand * Math.PI) / 180)} y2={62 - 30 * Math.cos((hand * Math.PI) / 180)} stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
            <circle cx={50} cy={62} r={6} fill={CYAN} />
          </svg>
          {/* work block crossing a small finish flag */}
          <div style={{ position: "relative", width: 640, height: 170 }}>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, height: 4, background: "rgba(255,255,255,0.16)" }} />
            <div style={{ position: "absolute", right: 90, bottom: 30, width: 8, height: 110, background: "rgba(255,255,255,0.5)" }}>
              <div style={{ position: "absolute", top: 0, left: 8, width: 46, height: 30, background: GREEN, clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
            </div>
            <div style={{ position: "absolute", left: 30 + move, bottom: 36, ...chipStyle(crossed ? GREEN : CYAN), fontSize: 30 }}>WORK</div>
            {crossed && <div style={{ position: "absolute", left: move - 100, bottom: 42 }}><SpeedTrails width={120} color={GREEN} /></div>}
            <Sparks at={96} x={540} y={90} color={GREEN} size={150} />
          </div>
          <Mark kind="check" at={stampAt - 24} size={130} />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={92} accent={GREEN} />
        {stamp ? <ImpactStamp text={stamp} at={stampAt} color={GREEN} /> : null}
      </div>
    </SceneShell>
  );
};
