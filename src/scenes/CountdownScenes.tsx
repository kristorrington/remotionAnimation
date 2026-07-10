import React from "react";
import { Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, impulse, poseTimeline, RobotPose, glassCard, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { ModelBlock, ConveyorBelt, ServerRack, JengaTower, TokenCoin, CostMeterClimb } from "../motion/objects";
import { ImpactStamp, Odometer, HighlightSweep, WarningBadge } from "../motion/primitives";
import { DonutFill } from "../motion/charts";
import { ClaudeMark } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#E8B84B";

// Premium finish: glass-gradient fill, thin alpha border, inner highlight —
// never flat clip-art panels (they read childish). glassCard handles rgba
// border colours safely.
const chip = (color: string, fontSize = 24): React.CSSProperties => ({
  padding: "9px 20px", borderRadius: 11, ...glassCard(color),
  fontFamily: FONT, fontWeight: 800, fontSize, letterSpacing: 1.5, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

const glass = (color: string): React.CSSProperties => ({
  background: "linear-gradient(180deg, rgba(41,33,27,0.95), rgba(20,16,13,0.88))",
  border: `2px solid ${color}88`,
  boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px ${color}26`,
});

// Rotated sticker chip that spring-slams in (scale 1.6 → 1, tilted).
const Sticker: React.FC<{ label: string; at: number; color?: string; rot?: number; fontSize?: number }> = ({ label, at, color = CYAN, rot = -3, fontSize = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ~0.8s settle — entrances that finish under half a second read frantic
  const pop = spring({ frame: frame - at, fps, config: { stiffness: 170, damping: 15 }, durationInFrames: 24 });
  // tilt capped at ~±2.8° — enough to feel hand-placed, never sloppy
  return (
    <div style={{ ...chip(color, fontSize), width: "fit-content", opacity: frame < at ? 0 : 1, transform: `translateZ(0) rotate(${Math.max(-2.8, Math.min(2.8, rot))}deg) scale(${interpolate(pop, [0, 1], [1.45, 1])})` }}>{label}</div>
  );
};

const Mark: React.FC<{ kind: "check" | "cross"; at: number; size?: number }> = ({ kind, at, size = 90 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 190, damping: 15 }, durationInFrames: 22 });
  if (frame < at) return null;
  const color = kind === "check" ? GREEN : RED;
  return (
    <div style={{ transform: `scale(${interpolate(e, [0, 1], [1.7, 1])})`, opacity: interpolate(e, [0, 0.4], [0, 1]) }}>
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

// A big dark countdown panel with a rolling day counter and a date plate.
const CountdownPanel: React.FC<{ at: number; days?: number; date?: string; width?: number }> = ({ at, days = 5, date = "JULY 12", width = 460 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 15 }, durationInFrames: 26 });
  const tick = 0.5 + 0.5 * Math.sin(frame * 0.24);
  return (
    <div style={{ width, borderRadius: 18, ...glass(AMBER), padding: "26px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `scale(${interpolate(e, [0, 1], [1.3, 1])})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: RED, opacity: 0.4 + 0.6 * tick, boxShadow: `0 0 ${10 * tick}px ${RED}` }} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, letterSpacing: 5, color: "rgba(255,255,255,0.6)", transform: "translateZ(0)" }}>FREE WINDOW ENDS</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <Odometer to={days} at={at + 6} size={110} color={WHITE} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: AMBER, transform: "translateZ(0)" }}>DAYS</span>
      </div>
      {/* day pips deplete toward the deadline */}
      <div style={{ display: "flex", gap: 8 }}>
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} style={{ width: 26, height: 7, borderRadius: 4, background: i < days ? AMBER : "rgba(255,255,255,0.12)", boxShadow: i < days ? `0 0 10px ${AMBER}55` : "none" }} />
        ))}
      </div>
      <div style={{ ...chip(RED, 25), transform: "translateZ(0) rotate(-1.5deg)" }}>{date}</div>
    </div>
  );
};

// HOOK — not a comeback, a COUNTDOWN: the day-counter panel slams in, the gate
// starts sliding shut, and the robot goes from relieved to alarmed. `titleAt`
// delays the headline to the spoken "countdown" (the action starts at frame 0,
// the words wait for the VO — golden rule).
export const CountdownGateScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; panelAt?: number; alarmAt?: number; titleAt?: number }> = ({ durationInFrames, kicker, title, panelAt = 90, alarmAt = 236, titleAt = 0 }) => {
  const frame = useCurrentFrame();
  const hop = Math.abs(impulse(frame, alarmAt, 14, 20));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x301} depth mood={frame >= alarmAt ? "danger" : "neutral"} impacts={[panelAt + 8, alarmAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
          <CountdownPanel at={panelAt} />
          <div style={{ transform: `translateY(${-hop}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, [[0, "celebrate"], [alarmAt - 30, "thinking"], [alarmAt, "alarmed"]])} size={250} accent={frame >= alarmAt ? RED : GREEN} lookX={-6} />
          </div>
          {/* the model rig powers DOWN at the alarm — flicker, red core, lock tag */}
          <div style={{ position: "relative", opacity: frame >= alarmAt ? 0.62 + 0.12 * Math.sin(frame * 0.5) * Math.max(0, 1 - (frame - alarmAt) / 40) : 1, filter: frame >= alarmAt ? "saturate(0.8)" : "none" }}>
            <ModelBlock label="FABLE 5" width={370} coreColor={frame >= alarmAt ? RED : "#E8B84B"} />
            <div style={{ position: "absolute", top: -34, right: -26, transform: "rotate(4deg)" }}>
              <Sticker label="LOCKS JULY 12" at={alarmAt} color={RED} rot={4} fontSize={22} />
            </div>
            <Sparks at={alarmAt} x={185} y={70} color={RED} size={160} />
          </div>
        </div>
        {/* reserve the headline's space so the layout doesn't jump when it lands */}
        <div style={{ height: 150, display: "flex", alignItems: "flex-start" }}>
          <Sequence from={titleAt} layout="none">
            <SceneHeadline kicker={kicker} title={title} titleSize={64} accent={RED} />
          </Sequence>
        </div>
      </div>
    </SceneShell>
  );
};

// THE PRICE — two big rate panels slam in and coins hammer down; the robot
// facepalms at the output price.
export const PriceRevealScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; inAt?: number; outAt?: number }> = ({ durationInFrames, kicker, title, inAt = 20, outAt = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const price = (label: string, value: number, at: number, color: string) => {
    const e = spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 14 }, durationInFrames: 26 });
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "26px 40px", borderRadius: 18, ...glass(color), opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `scale(${interpolate(e, [0, 1], [1.35, 1])}) rotate(${at === inAt ? -1.5 : 1.5}deg)` }}>
        <Odometer to={value} at={at + 4} size={100} color={color} prefix="$" />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: "rgba(255,255,255,0.7)", transform: "translateZ(0)" }}>{label}</span>
      </div>
    );
  };
  const coins = Array.from({ length: 7 }, (_, i) => outAt + 8 + i * 9);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x312} mood={frame >= outAt ? "danger" : "neutral"} impacts={[inAt + 8, outAt + 8]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {price("PER M INPUT", 10, inAt, AMBER)}
          <div style={{ position: "relative", transform: `translateY(${-Math.abs(impulse(frame, outAt + 6, 12, 18))}px)` }}>
            <CartoonRobot pose={frame >= outAt + 6 ? "facepalm" : frame >= inAt + 6 ? "worried" : "idle"} size={240} accent={frame >= outAt ? RED : CYAN} />
            <div style={{ position: "absolute", left: -40, top: -30, width: 90, height: 200 }}>
              {coins.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 2) * 34, bottom: Math.floor(i / 2) * 26 }}>
                  <TokenCoin at={t} fallH={200 + (i % 3) * 30} size={42} />
                </div>
              ))}
            </div>
          </div>
          {price("PER M OUTPUT", 50, outAt, RED)}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// WHAT CHANGED — the window flag slides from JUL 7 to JUL 12 on a date rail;
// plan chips sticker-slam in underneath as they're named.
export const ExtensionTimelineScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; slideAt?: number; chips?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, slideAt = 90, chips = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame: frame - slideAt, fps, config: { stiffness: 70, damping: 17 }, durationInFrames: 44 });
  const x = interpolate(slide, [0, 1], [0, 640]);
  const land = frame > slideAt + 26 && frame < slideAt + 44 ? Math.sin(((frame - slideAt - 26) / 18) * Math.PI) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x323} depth impacts={[slideAt + 30]} tint={CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", width: 1200, height: 300 }}>
          <div style={{ position: "absolute", left: 100, right: 100, top: 190, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} />
          {/* date pins */}
          {[{ d: "JUL 7", left: 190, dim: true }, { d: "JUL 12", left: 830, dim: false }].map((p) => (
            <div key={p.d} style={{ position: "absolute", left: p.left, top: 214, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 26, background: p.dim ? "rgba(255,255,255,0.3)" : AMBER, borderRadius: 3, marginTop: -40 }} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: p.dim ? "rgba(255,255,255,0.45)" : AMBER, transform: "translateZ(0)" }}>{p.d}</span>
            </div>
          ))}
          {/* the sliding window flag: robot rides it */}
          <div style={{ position: "absolute", left: 130 + x, top: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${1 + 0.06 * land}, ${1 - 0.08 * land})` }}>
            <div style={{ ...chip(GREEN, 24), transform: "translateZ(0) rotate(-2deg)" }}>FREE WINDOW</div>
            <CartoonRobot pose={frame < slideAt ? "idle" : frame < slideAt + 30 ? "celebrate" : "thinking"} size={170} accent={GREEN} lookX={frame < slideAt + 34 ? 6 : -4} />
            <Puff at={slideAt + 30} x={85} y={165} size={110} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          {chips.map((c, i) => (
            <Sticker key={c.label} label={c.label} at={c.at} color={CYAN} rot={[-4, 3, -2, 4][i % 4]} />
          ))}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// THE PROMO DEAL — 50% donut fills, "nothing to claim" gets the check, the
// robot celebrates: just pick the model.
export const PromoMeterScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; donutAt?: number; checkAt?: number; selectAt?: number }> = ({ durationInFrames, kicker, title, donutAt = 60, checkAt = 150, selectAt = 210 }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x334} impacts={[checkAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
          <DonutFill value={50} label="OF WEEKLY LIMITS" size={330} at={donutAt} color={GREEN} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `translateY(${-Math.abs(impulse(frame, checkAt, 10, 16))}px)` }}>
            <CartoonRobot pose={frame >= checkAt ? "celebrate" : "thinking"} size={235} accent={frame >= checkAt ? GREEN : CYAN} lookX={-6} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Sticker label="NOTHING TO CLAIM" at={checkAt - 10} color={GREEN} rot={-3} />
              <Mark kind="check" at={checkAt} size={64} />
            </div>
            <Sticker label="JUST SELECT FABLE 5" at={selectAt} color={CYAN} rot={2} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// WHY EXTEND? — racks run hot, the demand meter climbs, and the boring-but-true
// chips slam in; the robot shrugs at the "boring answer".
export const CapacityScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; chips?: { label: string; at: number }[]; shrugAt?: number }> = ({ durationInFrames, kicker, title, chips = [], shrugAt = 260 }) => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [20, Math.max(shrugAt - 20, 21)], [0.2, 0.92], CLAMP);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x345} mood={level > 0.8 ? "danger" : "neutral"} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 80 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
            <ServerRack width={200} />
            <ServerRack width={200} overheatAt={Math.round(shrugAt * 0.45)} />
          </div>
          <CostMeterClimb level={level} height={300} label="DEMAND" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <CartoonRobot pose={frame >= shrugAt ? "shrug" : "worried"} size={235} accent={frame >= shrugAt ? CYAN : AMBER} lookX={-7} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              {chips.map((c, i) => (
                <Sticker key={c.label} label={c.label} at={c.at} color={i === 2 ? RED : AMBER} rot={[-3, 2, -2][i % 3]} fontSize={22} />
              ))}
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// NOT A NORMAL LAUNCH — the little Fable block hops station to station
// (launched → restricted → back → countdown) and the DRAMA stamp slams.
export const DramaTimelineScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; stopAts?: number[]; stampAt?: number }> = ({ durationInFrames, kicker, title, stopAts = [110, 145, 180, 220], stampAt = 300 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stations = [
    { label: "LAUNCHED", color: GREEN, x: 60 },
    { label: "RESTRICTED", color: RED, x: 420 },
    { label: "CAME BACK", color: GREEN, x: 780 },
    { label: "COUNTDOWN", color: AMBER, x: 1140 },
  ];
  // the block hops to station i at stopAts[i]
  let x = stations[0].x;
  let hopY = 0;
  for (let i = 1; i < stations.length; i++) {
    const at = stopAts[i] ?? 0;
    if (frame >= at - 14) {
      const p = spring({ frame: frame - (at - 14), fps, config: { stiffness: 110, damping: 14 }, durationInFrames: 28 });
      x = interpolate(p, [0, 1], [stations[i - 1].x, stations[i].x]);
      hopY = Math.sin(Math.min(1, p) * Math.PI) * -90;
    }
  }
  const land = stopAts.some((a) => frame >= a + 10 && frame < a + 22);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x356} depth mood={frame >= stampAt ? "danger" : "neutral"} impacts={[...stopAts.slice(1).map((a) => a + 10), stampAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ position: "relative", width: 1380, height: 330 }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 236, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.15)" }} />
          {stations.map((s, i) => (
            <div key={s.label} style={{ position: "absolute", left: s.x - 60, top: 254, width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Sticker label={s.label} at={stopAts[i] ?? 0} color={s.color} rot={i % 2 ? 2 : -3} fontSize={24} />
            </div>
          ))}
          {/* the model block rides the drama */}
          <div style={{ position: "absolute", left: x, top: 96 + hopY, transform: `scale(${land ? 1.06 : 1}, ${land ? 0.92 : 1})` }}>
            <ModelBlock label="FABLE 5" width={220} coreColor={frame >= (stopAts[3] ?? 9999) ? AMBER : frame >= (stopAts[1] ?? 9999) && frame < (stopAts[2] ?? 9999) ? RED : GREEN} />
            {stopAts.map((a, i) => (i > 0 ? <Puff key={a} at={a + 10} x={110} y={110} size={110} /> : null))}
          </div>
          {/* watching robot, hops on every station hit */}
          <div style={{ position: "absolute", right: -40, top: 40, transform: `translateY(${-stopAts.reduce((acc, a) => acc + Math.abs(impulse(frame, a, 8, 14)), 0)}px)` }}>
            <CartoonRobot pose={frame >= stampAt ? "confused" : "thinking"} size={200} accent={CYAN} lookX={-8} />
          </div>
          {frame >= stampAt && (
            <div style={{ position: "absolute", left: 520, top: 20, transform: "rotate(-8deg)" }}>
              <ImpactStamp text="DRAMA" at={stampAt} color={RED} />
            </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={RED} />
      </div>
    </SceneShell>
  );
};

// THE JUNE STORY — three dated receipt cards slam in along a line while the
// robot points at each one (export controls → lifted → back globally).
export const JuneTimelineScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; cards?: { date: string; label: string; color: string; at: number }[] }> = ({ durationInFrames, kicker, title, cards = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const poseSteps: [number, RobotPose][] = [[0, "thinking"]];
  for (const c of cards) poseSteps.push([c.at - 6, "pointing"], [c.at + 40, "thinking"]);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x367} impacts={cards.map((c) => c.at)} tint={CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          <div style={{ display: "flex", gap: 34 }}>
            {cards.map((c, i) => {
              const e = spring({ frame: frame - c.at, fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 26 });
              return (
                <div key={c.label} style={{ width: 270, borderRadius: 16, ...glass(c.color), padding: "22px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `rotate(${[-2, 1.5, -1.5][i % 3]}deg) scale(${interpolate(e, [0, 1], [1.35, 1])}) translateY(${i % 2 ? 14 : -8}px)` }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: c.color, transform: "translateZ(0)" }}>{c.date}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: WHITE, textAlign: "center", lineHeight: 1.25, transform: "translateZ(0)" }}>{c.label}</span>
                </div>
              );
            })}
          </div>
          <div style={{ transform: `translateY(${-cards.reduce((a, c) => a + Math.abs(impulse(frame, c.at, 8, 14)), 0)}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, poseSteps)} size={225} accent={CYAN} lookX={-8} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// THE NEW SAFETY LAYER — a badge flies at the shield and bounces, the 99% donut
// fills… then the CONTROVERSY badge cracks the clean story.
export const ClassifierScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; blockAt?: number; donutAt?: number; crackAt?: number }> = ({ durationInFrames, kicker, title, blockAt = 60, donutAt = 130, crackAt = 250 }) => {
  const frame = useCurrentFrame();
  const c = Math.max(0, frame - blockAt);
  const approach = interpolate(Math.min(c, 26), [0, 26], [-330, -90], CLAMP);
  const bounce = c >= 26 ? interpolate(Math.min((c - 26) / 20, 1), [0, 1], [0, -160]) : 0;
  const fallY = c >= 26 ? interpolate(Math.min((c - 26) / 20, 1), [0, 1], [0, 70]) : 0;
  const badgeOp = interpolate(c, [0, 6, 40, 56], [0, 1, 1, 0], CLAMP);
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.3);
  const cracked = frame >= crackAt;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x378} mood={cracked ? "danger" : "neutral"} impacts={[blockAt + 18, crackAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 100 }}>
          <div style={{ position: "relative", width: 480, height: 320 }}>
            <div style={{ position: "absolute", left: 40 + approach + bounce, top: 120 + fallY, ...chip(RED, 24), opacity: badgeOp, transform: `translateZ(0) rotate(${c >= 18 ? -30 : 0}deg)` }}>REPORTED TECHNIQUE</div>
            <div style={{ position: "absolute", right: 30, top: 40 }}>
              <svg width={230} height={250} viewBox="0 0 100 110" style={{ filter: `drop-shadow(0 0 ${14 * pulse}px ${cracked ? AMBER : CYAN})` }}>
                <path d="M50 6 L88 20 V52 C88 78 71 94 50 102 C29 94 12 78 12 52 V20 Z" stroke={cracked ? AMBER : CYAN} strokeWidth={6} fill={cracked ? "rgba(245,158,11,0.12)" : "rgba(217,119,87,0.14)"} />
                <path d="M42 30 L54 48 L44 62 L56 80" stroke={WHITE} strokeWidth={5} fill="none" strokeLinecap="round" opacity={cracked ? 0.9 : 0} />
              </svg>
              <Sparks at={blockAt + 26} x={40} y={120} color={CYAN} size={150} />
              <Sparks at={crackAt} x={115} y={125} color={AMBER} size={160} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <DonutFill value={99} label="BLOCKED" size={270} at={donutAt} color={GREEN} />
            {cracked && <WarningBadge label="CONTROVERSY NOT CLEAN" danger delay={crackAt} />}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={cracked ? AMBER : GREEN} />
      </div>
    </SceneShell>
  );
};

// TRUST NOT SETTLED — the WORKFLOW Jenga tower gets a block pulled and wobbles
// hard while risk stickers slam in; the robot braces.
export const TrustJengaScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; pullAt?: number; chips?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, pullAt = 120, chips = [] }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x389} mood={frame >= pullAt ? "danger" : "neutral"} impacts={[pullAt]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 100 }}>
          <JengaTower pullAt={pullAt} rows={6} pullRow={2} blockW={230} blockH={44} labels={["DEPLOY", "REVIEW", "TESTS", "AGENTS", "PROMPTS", "FABLE 5"]} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, pullAt, 12, 18))}px)` }}>
              <CartoonRobot pose={frame >= pullAt ? "worried" : "thinking"} size={240} accent={frame >= pullAt ? AMBER : CYAN} lookX={-7} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              {chips.map((c, i) => (
                <Sticker key={c.label} label={c.label} at={c.at} color={RED} rot={[-3, 3, -2][i % 3]} fontSize={22} />
              ))}
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// SAFETY ROUTING — requests ride the belt toward FABLE 5, but the flagged one
// gets flipped down to the OPUS belt: you may not get the model you picked.
export const RerouteScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; rerouteAt?: number; revealAt?: number }> = ({ durationInFrames, kicker, title, rerouteAt = 120, revealAt = 210 }) => {
  const frame = useCurrentFrame();
  const cards = [
    { label: "REQUEST", at: 10, risky: false },
    { label: "RISKY REQUEST", at: rerouteAt - 60, risky: true },
    { label: "REQUEST", at: rerouteAt + 30, risky: false },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x39a} depth mood={frame >= rerouteAt ? "danger" : "neutral"} impacts={[rerouteAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 1400, height: 400 }}>
          {/* top lane → FABLE */}
          <div style={{ position: "absolute", left: 40, top: 80 }}>
            <ConveyorBelt width={900} speed={4} color={GOLD} />
          </div>
          <div style={{ position: "absolute", right: 20, top: 10 }}>
            <ModelBlock label="FABLE 5" width={300} coreColor={GOLD} />
          </div>
          {/* bottom lane → OPUS */}
          <div style={{ position: "absolute", left: 240, top: 300 }}>
            <ConveyorBelt width={700} speed={4} color={CYAN} />
          </div>
          <div style={{ position: "absolute", right: 20, top: 250 }}>
            <ModelBlock label="OPUS 4.8" width={260} coreColor={CYAN} />
          </div>
          {/* the safety barrier — hazard-striped arm on a glowing pivot */}
          <div style={{ position: "absolute", left: 610, top: 26, transform: `rotate(${frame >= rerouteAt - 6 && frame < rerouteAt + 40 ? impulse(frame, rerouteAt, 10, 22) - 40 : 0}deg)`, transformOrigin: "top center" }}>
            <div style={{ width: 18, height: 130, borderRadius: 9, background: `repeating-linear-gradient(45deg, ${RED} 0 9px, #33121a 9px 18px)`, border: "2px solid rgba(255,255,255,0.22)", boxShadow: `0 6px 18px rgba(0,0,0,0.5), 0 0 16px ${RED}55` }} />
            <div style={{ position: "absolute", top: -12, left: -6, width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(180deg, rgba(41,33,27,0.95), rgba(20,16,13,0.88))", border: `3px solid ${RED}`, boxShadow: `0 0 14px ${RED}66` }} />
          </div>
          <div style={{ position: "absolute", left: 480, top: -12 }}>
            <Sticker label="SAFETY ROUTING" at={rerouteAt - 20} color={RED} rot={-3} fontSize={22} />
          </div>
          {/* cards ride; the risky one gets flipped to the bottom lane */}
          {cards.map((c, i) => {
            const t = frame - c.at;
            if (t < 0) return null;
            const ride = Math.min(t * 6, c.risky ? 560 : 830);
            const flip = c.risky && frame >= rerouteAt;
            const dropP = flip ? Math.min((frame - rerouteAt) / 26, 1) : 0;
            const y = 40 + dropP * 220 - Math.sin(dropP * Math.PI) * 60;
            const rideOn = flip ? Math.min((frame - rerouteAt) * 5, 300) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: 60 + (flip ? 560 + rideOn * 0.4 : ride), top: c.risky ? y : 40, opacity: interpolate(t, [0, 6], [0, 1]), transform: `rotate(${flip ? dropP * 360 : 0}deg)` }}>
                <div style={{ ...chip(c.risky ? RED : "rgba(255,255,255,0.5)", 21) }}>{c.label}</div>
              </div>
            );
          })}
          <Sparks at={rerouteAt} x={640} y={120} color={RED} size={150} />
          {/* the confused user robot */}
          <div style={{ position: "absolute", left: -30, top: 170, transform: `translateY(${-Math.abs(impulse(frame, revealAt, 10, 16))}px)` }}>
            <CartoonRobot pose={frame >= revealAt ? "confused" : "idle"} size={210} accent={frame >= revealAt ? RED : CYAN} lookX={8} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={RED} />
      </div>
    </SceneShell>
  );
};

// THE SPECIALIST — the gold expert pops in, hammers the HARD block (sparks),
// then hands the routine blocks back to the cheaper robots.
export const SpecialistScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; inAt?: number; workAt?: number; handoffAt?: number; chips?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, inAt = 40, workAt = 120, handoffAt = 240, chips = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - inAt, fps, config: { stiffness: 120, damping: 13 }, durationInFrames: 28 });
  const working = frame >= workAt && frame < handoffAt;
  const workKick = working ? impulse(frame, workAt + ((frame - workAt) % 34), 5, 30) : 0;
  const hand = spring({ frame: frame - handoffAt, fps, config: { stiffness: 85, damping: 16 }, durationInFrames: 36 });
  const shift = interpolate(hand, [0, 1], [0, 360]);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3ab} depth impacts={[inAt + 10, handoffAt]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ position: "relative", width: 1400, height: 400 }}>
          {/* the specialist + the hard block */}
          <div style={{ position: "absolute", left: 120, top: 30, display: "flex", alignItems: "flex-end", gap: 30 }}>
            <div style={{ position: "relative", opacity: interpolate(enter, [0, 0.3], [0, 1]), transform: `scale(${enter}) translateY(${-Math.abs(impulse(frame, handoffAt, 10, 16))}px)` }}>
              <CartoonRobot pose={working ? "pointing" : frame >= handoffAt ? "celebrate" : "idle"} size={260} accent={GOLD} lookX={7} />
              <div style={{ position: "absolute", top: -46, left: 60, ...chip(GOLD, 20), transform: "translateZ(0) rotate(-3deg)" }}>SPECIALIST</div>
              <Puff at={inAt + 10} x={130} y={250} size={140} />
            </div>
            <div style={{ position: "relative", transform: `translateY(${workKick}px)` }}>
              <ModelBlock label="THE HARD PART" width={330} coreColor={GOLD} />
              {working && <Sparks at={workAt + 8} x={165} y={60} color={GOLD} size={130} />}
              {working && <Sparks at={workAt + 60} x={200} y={40} color={GOLD} size={110} />}
            </div>
          </div>
          {/* the cheap crew waiting right; routine blocks slide over on handoff */}
          <div style={{ position: "absolute", right: 60, top: 90, display: "flex", gap: 40, alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <CartoonRobot pose={frame >= handoffAt + 20 ? "celebrate" : "idle"} size={180} accent={CYAN} lookX={-7} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: CYAN, transform: "translateZ(0)" }}>OPUS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <CartoonRobot pose={frame >= handoffAt + 20 ? "celebrate" : "idle"} size={160} accent={GREEN} lookX={-7} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: GREEN, transform: "translateZ(0)" }}>SONNET</span>
            </div>
          </div>
          {/* routine blocks handed across */}
          {[0, 1].map((i) => (
            <div key={i} style={{ position: "absolute", left: 520 + shift + i * 190, top: 300 + (i % 2) * 24, opacity: frame >= handoffAt ? 1 : 0.35 }}>
              <div style={{ ...chip("rgba(255,255,255,0.5)", 20) }}>{i === 0 ? "THE REST" : "EXECUTION"}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {chips.map((c, i) => (
            <Sticker key={c.label} label={c.label} at={c.at} color={i === 0 ? GOLD : GREEN} rot={i === 0 ? -3 : 3} />
          ))}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={GOLD} />
      </div>
    </SceneShell>
  );
};

// WATCH THE WORDING — the blurry screenshot gets the X; the official line with
// a real date gets the sweep + check; THE SIGNAL stamps.
export const WatchWordingScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; crossAt?: number; checkAt?: number; stampAt?: number; windowAts?: number[] }> = ({ durationInFrames, kicker, title, crossAt = 70, checkAt = 190, stampAt = 235, windowAts = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardIn = (at: number) => spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 15 }, durationInFrames: 26 });
  const l = cardIn(crossAt - 40);
  const r = cardIn(checkAt - 40);
  const labels = ["NOT A FORMALITY", "NOT A GUARANTEE", "A WINDOW"];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x3bc} impacts={[crossAt, checkAt, ...windowAts.slice(-1)]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {/* blurry screenshot card */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(l, [0, 0.3], [0, 1]), transform: `rotate(-3deg) scale(${interpolate(l, [0, 1], [1.35, 1])})` }}>
            <div style={{ width: 330, borderRadius: 14, background: "linear-gradient(180deg, rgba(41,33,27,0.95), rgba(20,16,13,0.88))", border: "2px solid rgba(255,255,255,0.22)", boxShadow: "0 16px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", padding: "20px 22px", filter: "saturate(0.6)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,0.6)", transform: "translateZ(0)", display: "block", marginBottom: 10 }}>random screenshot</span>
              {[86, 64, 74].map((w, i) => (
                <div key={i} style={{ width: `${w}%`, height: 13, borderRadius: 6, background: "rgba(255,255,255,0.14)", margin: "8px 0", filter: "blur(2.5px)" }} />
              ))}
            </div>
            <Mark kind="cross" at={crossAt} size={74} />
          </div>
          <div style={{ transform: `translateY(${-Math.abs(impulse(frame, checkAt, 10, 16))}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, [[0, "thinking"], [crossAt, "shrug"], [checkAt - 10, "pointing"]])} size={230} accent={frame >= checkAt ? GREEN : CYAN} lookX={frame >= crossAt + 20 ? 7 : -7} />
          </div>
          {/* the official wording card */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(r, [0, 0.3], [0, 1]), transform: `rotate(2deg) scale(${interpolate(r, [0, 1], [1.35, 1])})` }}>
            <div style={{ width: 380, borderRadius: 14, ...glass(GREEN), padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <ClaudeMark size={26} />
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: WHITE, transform: "translateZ(0)" }}>Anthropic — official</span>
              </div>
              <div style={{ position: "relative", padding: "8px 12px", borderRadius: 8, background: "rgba(52,211,153,0.14)", overflow: "hidden" }}>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: WHITE, transform: "translateZ(0)" }}>standard plans + a REAL DATE</span>
                <HighlightSweep at={checkAt - 14} color={GREEN} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Mark kind="check" at={checkAt} size={74} />
              {frame >= stampAt && <ImpactStamp text="THE SIGNAL" at={stampAt} color={GREEN} />}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {windowAts.map((a, i) => (
            <Sticker key={labels[i] ?? a} label={labels[i] ?? ""} at={a} color={i === 2 ? AMBER : "rgba(255,255,255,0.55)"} rot={[-3, 2, -2][i % 3]} fontSize={22} />
          ))}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={GREEN} />
      </div>
    </SceneShell>
  );
};
