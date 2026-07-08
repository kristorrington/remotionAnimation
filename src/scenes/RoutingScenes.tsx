import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, Sparks, Puff, impulse, poseTimeline, RobotPose, CYAN, WHITE, RED, AMBER, GREEN, PANEL } from "../motion/subjects";
import { ModelBlock, SpeedModule, TokenCoin, ConveyorBelt, LockGate } from "../motion/objects";
import { ImpactStamp, HighlightSweep } from "../motion/primitives";
import { BarsIn, DonutFill, ChartData } from "../motion/charts";
import { ClaudeMark } from "../components/Cartoons";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const chip = (color: string, fontSize = 24): React.CSSProperties => ({
  padding: "8px 18px", borderRadius: 10, background: PANEL, border: `3px solid ${color}`,
  fontFamily: FONT, fontWeight: 800, fontSize, letterSpacing: 1, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

const Mark: React.FC<{ kind: "check" | "cross"; at: number; size?: number }> = ({ kind, at, size = 100 }) => {
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

// HOOK: two model rigs CRASH onto the shelf (squash + dust + camera shake) —
// the robot sizes them up, hops, and POINTS at the cheaper one: it pops and
// flares green while the premium rig deflates and its $$$$ tag wobbles.
export const PickCheaperScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; chips?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, chips = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pointAt = 90;
  const picked = frame >= pointAt + 4;
  const rig = (label: string, price: string, at: number, hero: boolean) => {
    const e = spring({ frame: frame - at, fps, config: { stiffness: 160, damping: 14 }, durationInFrames: 18 });
    const t = frame - at;
    const land = t > 10 && t < 24 ? Math.sin(((t - 10) / 14) * Math.PI) : 0;
    const pop = spring({ frame: frame - pointAt - 4, fps, config: { stiffness: 240, damping: 11 }, durationInFrames: 20 });
    const scale = hero ? 1 + 0.1 * pop : picked ? interpolate(frame, [pointAt + 4, pointAt + 24], [1, 0.9], CLAMP) : 1;
    const dim = hero ? 1 : picked ? interpolate(frame, [pointAt + 4, pointAt + 24], [0.85, 0.45], CLAMP) : 0.85;
    const tagShake = hero ? 0 : impulse(frame, pointAt + 4, 8, 24);
    return (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-220, 0])}px) scale(${scale * (1 + 0.07 * land)}, ${scale * (1 - 0.09 * land)}) rotate(${!hero && picked ? -2.5 : 0}deg)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, transform: `rotate(${tagShake}deg)` }}>
          <ClaudeMark size={42} />
          <div style={{ ...chip(hero ? GREEN : AMBER, 30) }}>{price}</div>
        </div>
        <div style={{ filter: hero && picked ? `drop-shadow(0 0 42px ${GREEN}99)` : hero ? `drop-shadow(0 0 24px ${GREEN}66)` : "drop-shadow(0 0 20px rgba(245,158,11,0.35))", opacity: dim }}>
          <ModelBlock label={label} width={hero ? 390 : 360} coreColor={hero ? GREEN : AMBER} />
        </div>
        <Puff at={at + 14} x={hero ? 195 : 180} y={hero ? 220 : 210} size={150} />
        {hero && <Sparks at={pointAt + 8} x={195} y={120} color={GREEN} size={180} />}
      </div>
    );
  };
  const hop = Math.abs(impulse(frame, pointAt - 8, 16, 20));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x201} depth impacts={[24, 94]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 90 }}>
          {rig("FABLE 5", "$$$$", 10, false)}
          <div style={{ marginBottom: -10, transform: `translateY(${-hop}px)` }}>
            <CartoonRobot pose={frame >= pointAt ? "pointing" : "thinking"} size={250} lookX={frame >= pointAt - 8 ? 6 : -6} accent={GREEN} />
          </div>
          {rig("OPUS 4.8", "$$", 80, true)}
        </div>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {chips.map((c, i) => {
            const pop = spring({ frame: frame - c.at, fps, config: { stiffness: 280, damping: 13 }, durationInFrames: 16 });
            return (
              <div key={c.label} style={{ ...chip(CYAN, 26), opacity: frame < c.at ? 0 : 1, transform: `rotate(${[-5, 3, -4][i % 3]}deg) translateY(${i % 2 ? 12 : -8}px) scale(${interpolate(pop, [0, 1], [1.8, 1])})` }}>{c.label}</div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={64} />
      </div>
    </SceneShell>
  );
};

// THE STACK: the model block hovers center (alive from frame 0) while a robot
// mechanic pops in and POINTS each PROCESS module into place — the block kicks
// on every bolt, the robot celebrates at the end. The magic is not only the
// model. Reused as the closing callback.
export const ProcessAroundScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; modules?: { label: string; at: number }[] }> = ({ durationInFrames, kicker, title, modules = [{ label: "EFFORT", at: 40 }, { label: "SKILL", at: 90 }, { label: "ROUTING", at: 140 }] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const positions = [
    { left: -295, top: -120 },
    { left: -315, top: 118 },
    { left: 505, top: -8 },
  ];
  const last = modules[modules.length - 1];
  const poseSteps: [number, RobotPose][] = [[0, "idle"], [24, "thinking"]];
  for (const m of modules) poseSteps.push([m.at - 8, "pointing"], [m.at + 42, "thinking"]);
  if (last) poseSteps.push([last.at + 46, "celebrate"]);
  // the block KICKS every time a module bolts on; the robot hops with it
  const kick = 1 + modules.reduce((a, m) => a + impulse(frame, m.at + 26, 0.05, 16), 0);
  const hop = modules.reduce((a, m) => a + Math.abs(impulse(frame, m.at + 26, 10, 16)), 0);
  const bob = Math.sin(frame * 0.05) * 5;
  const enter = spring({ frame: frame - 6, fps, config: { stiffness: 150, damping: 12 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x212} impacts={modules.map((m) => m.at + 26)} tint={CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 360 }}>
          <div style={{ position: "relative", transform: `translateY(${bob}px) scale(${kick})` }}>
            <ModelBlock label="MODEL" width={440} />
            {modules.map((m, i) => (
              <div key={m.label} style={{ position: "absolute", ...positions[i % positions.length] }}>
                <SpeedModule at={m.at} label={m.label} width={185} />
              </div>
            ))}
          </div>
          <div style={{ position: "relative", transform: `scale(${enter}) translateY(${-hop}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, poseSteps)} size={230} lookX={-7} accent={CYAN} />
            <Puff at={16} x={115} y={225} size={140} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// THE LEAK: a "leaked prompt" document slides in looking official — then the
// UNVERIFIED stamp slams; later the one useful part highlights green.
export const LeakDocScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; stampAt?: number; goodAt?: number }> = ({ durationInFrames, kicker, title, stampAt = 171, goodAt = 534 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const docIn = spring({ frame: frame - 10, fps, config: { stiffness: 140, damping: 16 }, durationInFrames: 22 });
  const lines = ["verify context first", "never assume files exist", "resolve unknowns early", "plan before acting"];
  const good = frame >= goodAt;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x223} mood={frame >= stampAt && !good ? "danger" : "neutral"} impacts={[stampAt, goodAt]} tint={good ? GREEN : RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
          <div style={{ position: "relative", opacity: interpolate(docIn, [0, 0.4], [0, 1]), transform: `translateY(${interpolate(docIn, [0, 1], [90, 0])}px) rotate(${-2 + impulse(frame, stampAt, 3, 20)}deg)` }}>
            <div style={{ width: 520, borderRadius: 14, background: "#EDEFF5", padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#22293A", transform: "translateZ(0)", display: "block" }}>fable_system_prompt.txt</span>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 16, color: "#7A8194", display: "block", marginBottom: 14 }}>"leaked" — origin unknown</span>
              {lines.map((l, i) => (
                <div key={l} style={{ position: "relative", margin: "9px 0", padding: "7px 12px", borderRadius: 7, background: good ? "rgba(52,211,153,0.2)" : "rgba(34,41,58,0.08)", overflow: "hidden" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, color: "#38415A" }}>{l}</span>
                  {good && <HighlightSweep at={goodAt + 8 + i * 10} color={GREEN} />}
                </div>
              ))}
            </div>
            {/* the stamp */}
            {frame >= stampAt && !good && (
              <div style={{ position: "absolute", top: 80, left: 60, transform: "rotate(-14deg)" }}>
                <ImpactStamp text="UNVERIFIED" at={stampAt} color={RED} />
              </div>
            )}
            <Sparks at={stampAt} x={260} y={160} color={RED} size={170} />
            {good && (
              <div style={{ position: "absolute", top: -120, left: 0, right: 0, display: "flex", justifyContent: "center", transform: "rotate(-4deg)" }}>
                <ImpactStamp text="STEAL THE BEHAVIOUR" at={goodAt} color={GREEN} />
              </div>
            )}
          </div>
          <div style={{ transform: `translateY(${-Math.abs(impulse(frame, stampAt, 10, 18)) - Math.abs(impulse(frame, goodAt, 8, 16))}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, [[0, "thinking"], [stampAt, "shrug"], [goodAt, "pointing"]])} size={255} lookX={-5} accent={good ? GREEN : CYAN} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// THE EFFORT DIAL: a big dial with five notches. In `sweep` mode the needle
// climbs while cost coins stack; with `stops` it CLICKS notch to notch as each
// level is spoken, chips appear, and the robot's mood tracks the spend.
export const EffortDialScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  stops?: { at: number; label: string; use: string }[];
  sweep?: boolean;
}> = ({ durationInFrames, kicker, title, stops, sweep = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const NOTCHES = ["LOW", "MED", "HIGH", "XHIGH", "MAX"];
  // needle position 0..4
  let pos = 0;
  if (sweep) {
    pos = interpolate(frame, [20, durationInFrames - 60], [0, 4], CLAMP);
  } else if (stops && stops.length > 0) {
    for (let i = 0; i < stops.length; i++) {
      if (frame >= stops[i].at) {
        // spring-click from the previous notch to this one
        const s = spring({ frame: frame - stops[i].at, fps, config: { stiffness: 170, damping: 15 }, durationInFrames: 18 });
        pos = (i === 0 ? 0 : i - 1) + s;
      }
    }
  }
  const deg = interpolate(pos, [0, 4], [-108, 108]);
  const activeIdx = Math.round(Math.min(4, Math.max(0, pos)));
  const active = stops?.filter((s) => frame >= s.at).slice(-1)[0];
  const hot = pos > 3.4;
  // coins DROP in as the dial climbs — spread across the sweep, or more per
  // click as the stops escalate
  const coinAts: number[] = [];
  if (sweep) {
    for (let i = 0; i < 8; i++) coinAts.push(Math.round(interpolate(i, [0, 7], [40, durationInFrames - 90])));
  } else if (stops) {
    stops.forEach((s, i) => {
      const n = i < 2 ? 1 : 2;
      for (let k = 0; k < n; k++) coinAts.push(s.at + 10 + k * 12);
    });
  }
  const clickKick = stops ? stops.reduce((a, s) => a + Math.abs(impulse(frame, s.at, 10, 16)), 0) : 0;
  const stopPop = spring({ frame: frame - ((active?.at ?? 0) + 2), fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 14 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x234} mood={hot ? "danger" : "neutral"} impacts={stops?.map((s) => s.at) ?? []} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 130 }}>
          {/* the dial */}
          <div style={{ position: "relative", width: 460, height: 300 }}>
            <svg width={460} height={300} viewBox="0 0 460 300" style={{ overflow: "visible" }}>
              <path d="M 60 250 A 170 170 0 0 1 400 250" stroke="rgba(255,255,255,0.14)" strokeWidth={22} fill="none" strokeLinecap="round" />
              <path d="M 60 250 A 170 170 0 0 1 230 80" stroke={GREEN} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.8} />
              <path d="M 230 80 A 170 170 0 0 1 350 122" stroke={AMBER} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.8} />
              <path d="M 350 122 A 170 170 0 0 1 400 250" stroke={RED} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.8} />
              {NOTCHES.map((n, i) => {
                const a = interpolate(i, [0, 4], [-108, 108]) * (Math.PI / 180);
                const x = 230 + Math.sin(a) * 200;
                const y = 250 - Math.cos(a) * 200 + 10;
                return (
                  <text key={n} x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={21} fill={i === activeIdx ? WHITE : "rgba(255,255,255,0.45)"}>{n}</text>
                );
              })}
              <line x1={230} y1={250} x2={230 + Math.sin((deg * Math.PI) / 180) * 140} y2={250 - Math.cos((deg * Math.PI) / 180) * 140} stroke={WHITE} strokeWidth={9} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" }} />
              <circle cx={230} cy={250} r={16} fill={hot ? RED : CYAN} />
            </svg>
            {/* cost coins DROP and stack beside the dial as the level rises */}
            <div style={{ position: "absolute", right: -118, bottom: 0, width: 96, height: 230 }}>
              {coinAts.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 2) * 38, bottom: Math.floor(i / 2) * 30 }}>
                  <TokenCoin at={t} fallH={170 + (i % 3) * 30} size={46} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ transform: `translateY(${-clickKick}px)` }}>
              <CartoonRobot pose={hot ? "alarmed" : pos > 1.5 ? "thinking" : "idle"} size={225} accent={hot ? RED : CYAN} lookX={-5} />
            </div>
            {active && (
              <div style={{ ...chip(hot ? RED : CYAN, 24), transform: `scale(${interpolate(stopPop, [0, 1], [1.5, 1])}) rotate(-2deg)` }}>{active.use}</div>
            )}
            {sweep && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* chip times track the spoken words: thinking@4316 / slower@4566 / tokens@4616 */}
                {[{ l: "MORE THINKING", at: 150 }, { l: "SLOWER", at: 400 }, { l: "MORE TOKENS", at: 444 }].map((c, i) => {
                  const pop = spring({ frame: frame - c.at, fps, config: { stiffness: 280, damping: 13 }, durationInFrames: 16 });
                  return (
                    <div key={c.l} style={{ ...chip(i === 0 ? GREEN : AMBER, 21), opacity: frame < c.at ? 0 : 1, transform: `rotate(${[-3, 2, -2][i]}deg) scale(${interpolate(pop, [0, 1], [1.6, 1])})` }}>{c.l}</div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// THE GAG: a gold "senior architect" robot is hired… to rename one tiny label.
// Coins drain the whole time. It works — and it's stupidly expensive.
export const OverkillScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; stampAt?: number }> = ({ durationInFrames, kicker, title, stampAt = 180 }) => {
  const frame = useCurrentFrame();
  const coins = Array.from({ length: 7 }, (_, i) => 20 + i * 22);
  const done = frame >= stampAt - 30;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x245} impacts={[stampAt - 30, stampAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 120 }}>
          {/* the expensive hire */}
          <div style={{ position: "relative", transform: `translateY(${-Math.abs(impulse(frame, stampAt - 30, 12, 18))}px)` }}>
            <CartoonRobot pose={frame < 60 ? "thinking" : done ? "celebrate" : "pointing"} size={300} accent="#E8B84B" lookX={6} />
            <div style={{ position: "absolute", top: -52, left: 90, ...chip("#E8B84B", 20), transform: "rotate(-3deg)" }}>SENIOR ARCHITECT</div>
          </div>
          {/* the tiny job */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 30 }}>
            <div style={{ position: "relative", padding: "12px 26px", borderRadius: 12, background: PANEL, border: `3px solid ${CYAN}`, boxShadow: "0 10px 26px rgba(0,0,0,0.4)", transform: `scale(${1 + impulse(frame, stampAt - 30, 0.07, 16)})` }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE, textDecoration: done ? "line-through" : "none", opacity: done ? 0.5 : 1 }}>btn_label</span>
              {done && <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREEN, marginLeft: 12 }}>buttonLabel</span>}
              <Sparks at={stampAt - 30} x={120} y={26} color={GREEN} size={140} />
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(255,255,255,0.55)", transform: "translateZ(0)" }}>THE ENTIRE TASK</span>
          </div>
          {/* the bill */}
          <div style={{ position: "relative", width: 120, height: 260, marginBottom: 10 }}>
            {coins.map((t, i) => (
              <div key={i} style={{ position: "absolute", left: (i % 2) * 36, bottom: Math.floor(i / 2) * 34 }}>
                <TokenCoin at={t} fallH={200 + (i % 3) * 30} size={46} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={AMBER} />
          <div style={{ position: "absolute", right: -250, top: -100, transform: "rotate(8deg)" }}>
            <ImpactStamp text="OVERKILL" at={stampAt} color={RED} />
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// THE ROUTING TABLE: three lanes (cheap / opus / fable). Task cards drop onto
// the lane that fits; the fable lane sits behind a gate that only opens when
// a card ESCALATES. Route by risk, not ego.
export const RoutingLanesScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  cards?: { label: string; lane: 0 | 1 | 2; at: number }[];
  escalateAt?: number;
  tint?: string;
}> = ({ durationInFrames, kicker, title, cards = [], escalateAt, tint = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lanes = [
    { label: "SONNET / HAIKU", sub: "cheap lane", color: CYAN, y: 0 },
    { label: "OPUS 4.8", sub: "serious work", color: GREEN, y: 125 },
    { label: "FABLE 5", sub: "expensive mistakes", color: "#E8B84B", y: 250 },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x256} depth impacts={cards.map((c) => c.at + 20)} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ position: "relative", width: 1560, height: 360 }}>
          {lanes.map((l, li) => (
            <div key={l.label} style={{ position: "absolute", left: 0, right: 0, top: l.y }}>
              <div style={{ position: "absolute", left: 270, top: 40 }}>
                <ConveyorBelt width={1050} speed={li === 2 ? 2 : 4} color={l.color} />
              </div>
              <div style={{ position: "absolute", left: 0, top: 10, width: 250, display: "flex", alignItems: "center", gap: 10 }}>
                <ClaudeMark size={30} />
                <div>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: l.color, transform: "translateZ(0)", display: "block" }}>{l.label}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: "rgba(255,255,255,0.5)", transform: "translateZ(0)" }}>{l.sub}</span>
                </div>
              </div>
            </div>
          ))}
          {/* the fable gate */}
          <div style={{ position: "absolute", left: 1330, top: 208, transform: "scale(0.62)", transformOrigin: "top left" }}>
            <LockGate at={escalateAt ?? 999999} action="open" label="" size={150} />
          </div>
          {/* task cards drop onto their lane (dust + wobble) and ride it */}
          {cards.map((c) => {
            const e = spring({ frame: frame - c.at, fps, config: { stiffness: 150, damping: 13 }, durationInFrames: 20 });
            // keep riding the whole belt and fade off the end, so cards sharing
            // a lane never pile up at the same x
            const ride = interpolate(frame, [c.at + 22, c.at + 320], [0, 990], CLAMP);
            const exitFade = interpolate(ride, [740, 930], [1, 0], CLAMP);
            const bob = frame > c.at + 26 ? Math.sin((frame - c.at) * 0.28) * 2 : 0;
            return (
              <React.Fragment key={`${c.label}-${c.at}`}>
                <div style={{ position: "absolute", left: 300 + ride, top: lanes[c.lane].y + interpolate(e, [0, 1], [-150, 4]) + bob, opacity: interpolate(e, [0, 0.3], [0, 1]) * exitFade }}>
                  <div style={{ ...chip(lanes[c.lane].color, 22), transform: `rotate(${impulse(frame, c.at + 20, 5, 18)}deg)` }}>{c.label}</div>
                </div>
                <Puff at={c.at + 18} x={340} y={lanes[c.lane].y + 55} size={110} />
              </React.Fragment>
            );
          })}
          {escalateAt !== undefined && <Sparks at={escalateAt + 10} x={1370} y={262} color="#E8B84B" size={150} />}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// THE ACCESS WINDOW: the fable gate SLAMS (restricted), springs open (it came
// back), then coins + a credits chip appear — don't build on shaky access.
export const AccessWindowScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; closeAt?: number; openAt?: number; creditsAt?: number }> = ({ durationInFrames, kicker, title, closeAt = 164, openAt = 231, creditsAt = 435 }) => {
  const frame = useCurrentFrame();
  const phase = frame < openAt ? "closed" : "open";
  const coins = Array.from({ length: 5 }, (_, i) => creditsAt + i * 14);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x267} mood={phase === "closed" && frame >= closeAt ? "danger" : "neutral"} impacts={[closeAt, openAt]} tint={phase === "closed" && frame >= closeAt ? RED : AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 120 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ ...chip("#E8B84B", 24), transform: `rotate(${impulse(frame, closeAt, 6, 20)}deg)` }}>FABLE ACCESS</div>
            {/* the gate closes, then reopens */}
            <div style={{ position: "relative" }}>
              {frame < openAt ? <LockGate at={closeAt} action="close" size={260} /> : <LockGate at={openAt} action="open" size={260} />}
              <Sparks at={closeAt} x={130} y={150} color={RED} size={170} />
            </div>
          </div>
          <div style={{ transform: `translateY(${-Math.abs(impulse(frame, closeAt, 12, 18)) - Math.abs(impulse(frame, openAt, 8, 16))}px)` }}>
            <CartoonRobot pose={poseTimeline(frame, [[0, "idle"], [closeAt, "alarmed"], [openAt, "confused"], [creditsAt, "worried"]])} size={250} lookX={-6} accent={frame >= closeAt && frame < openAt ? RED : CYAN} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ position: "relative", width: 130, height: 190 }}>
              {coins.map((t, i) => (
                <div key={i} style={{ position: "absolute", left: (i % 2) * 40, bottom: Math.floor(i / 2) * 32 }}>
                  <TokenCoin at={t} fallH={150 + (i % 3) * 24} size={44} />
                </div>
              ))}
            </div>
            <div style={{ ...chip(AMBER, 22), opacity: interpolate(frame, [creditsAt, creditsAt + 10], [0, 1], CLAMP) }}>USAGE CREDITS</div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// THE RATE CARD: a native two-bar chart — fable at 2×, opus at 1× — cited to
// the official pricing page; then the real-cost multipliers pop beside it.
export const RateCardScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; multipliersAt?: number }> = ({ durationInFrames, kicker, title, multipliersAt = 360 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data: ChartData = {
    title: "Price per token (relative)",
    unit: "×",
    source: { name: "Anthropic pricing", url: "https://platform.claude.com/docs/en/pricing" },
    data: [
      { label: "Fable 5", value: 2 },
      { label: "Opus 4.8", value: 1 },
    ],
  };
  const mults = ["× EFFORT", "× RETRIES", "× TOOL CALLS"];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x278} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <BarsIn chart={data} at={16} width={900} maxValue={2.3} barH={54} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: "rgba(255,255,255,0.6)", opacity: interpolate(frame, [multipliersAt - 14, multipliersAt - 4], [0, 1], CLAMP), transform: "translateZ(0)" }}>THE REAL COST:</span>
            {mults.map((m, i) => {
              const at = multipliersAt + i * 40;
              const pop = spring({ frame: frame - at, fps, config: { stiffness: 250, damping: 12 }, durationInFrames: 18 });
              return (
                <div key={m} style={{ ...chip(RED, 26), opacity: frame < at ? 0 : 1, transform: `translateZ(0) translateX(${interpolate(pop, [0, 1], [70, 0])}px) scale(${interpolate(pop, [0, 1], [1.3, 1])}) rotate(${[-3, 2, -2][i]}deg)` }}>{m}</div>
              );
            })}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// THE 80/20 RULE: the opus donut fills to 80% at half price and gets the
// check; the missing 20% glows red — if THAT part matters, fable earns it.
export const Rule8020Scene: React.FC<{ durationInFrames: number; kicker?: string; title: string; sonnetAt?: number; missingAt?: number; checkAt?: number }> = ({ durationInFrames, kicker, title, sonnetAt = 381, missingAt = 564, checkAt = 140 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const missing = frame >= missingAt;
  const missPop = spring({ frame: frame - missingAt, fps, config: { stiffness: 210, damping: 12 }, durationInFrames: 18 });
  const sonnetPop = spring({ frame: frame - sonnetAt, fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 });
  const fablePop = spring({ frame: frame - (missingAt + 50), fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 });
  const pricePop = spring({ frame: frame - (checkAt - 40), fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x289} mood={missing ? "danger" : "neutral"} impacts={[missingAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 110 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <DonutFill value={80} label="OPUS GETS YOU" size={340} at={30} color={GREEN} />
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...chip(GREEN, 24), opacity: frame < checkAt - 40 ? 0 : 1, transform: `rotate(-2deg) scale(${interpolate(pricePop, [0, 1], [1.5, 1])})` }}>½ THE PRICE</div>
              <Mark kind="check" at={checkAt} size={54} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ ...chip(CYAN, 22), opacity: frame < sonnetAt ? 0 : 1, transform: `rotate(2deg) scale(${interpolate(sonnetPop, [0, 1], [1.5, 1])})` }}>SONNET? EVEN CHEAPER</div>
            <div style={{ opacity: interpolate(missPop, [0, 0.4], [0.25, 1]), transform: `scale(${interpolate(missPop, [0, 1], [0.85, 1])})` }}>
              <DonutFill value={20} label="THE MISSING 20%" size={270} at={missingAt} color={RED} />
            </div>
            <div style={{ ...chip(RED, 26), opacity: frame < missingAt + 50 ? 0 : 1, transform: `rotate(-2deg) scale(${interpolate(fablePop, [0, 1], [1.5, 1])})` }}>MATTERS? → FABLE</div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} />
      </div>
    </SceneShell>
  );
};

// THE YES RUN: the original claim's questions land one by one, each slammed
// with a green check — and the last one gets the big ABSOLUTELY.
export const YesRunScene: React.FC<{ durationInFrames: number; kicker?: string; title: string; qs?: { label: string; at: number; yesAt?: number; big?: boolean }[] }> = ({ durationInFrames, kicker, title, qs = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lastYes = qs.length > 0 ? qs[qs.length - 1].yesAt ?? qs[qs.length - 1].at + 14 : 0;
  const allIn = qs.length > 0 && frame >= lastYes + 26;
  // the robot HOPS with every landed check
  const hops = qs.reduce((a, q) => a + Math.abs(impulse(frame, q.yesAt ?? q.at + 14, 9, 15)), 0);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x29a} mood={allIn ? "win" : "neutral"} impacts={qs.map((q) => q.yesAt ?? q.at + 14)} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 70 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {qs.map((q) => {
              // chip pops when the QUESTION is asked; the check lands on the spoken "Yes"
              const yesAt = q.yesAt ?? q.at + 14;
              const on = frame >= q.at;
              const pop = spring({ frame: frame - q.at, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 16 });
              return (
                <div key={q.label} style={{ display: "flex", alignItems: "center", gap: 20, opacity: on ? 1 : 0.2, transform: `translateZ(0) translateX(${interpolate(pop, [0, 1], [-40, 0])}px) scale(${on ? interpolate(pop, [0, 1], [1.15, 1]) : 1})` }}>
                  <div style={{ ...chip(on ? CYAN : "rgba(255,255,255,0.2)", 26) }}>{q.label}</div>
                  <div style={{ position: "relative" }}>
                    <Mark kind="check" at={yesAt} size={q.big ? 108 : 72} />
                    {q.big && <Sparks at={yesAt} x={54} y={54} color={GREEN} size={200} />}
                  </div>
                  {q.big && frame >= yesAt + 6 && (
                    <ImpactStamp text="ABSOLUTELY" at={yesAt + 8} color={GREEN} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 30, transform: `translateY(${-hops}px)` }}>
            <CartoonRobot pose={allIn ? "celebrate" : "pointing"} size={265} accent={allIn ? GREEN : CYAN} lookX={-6} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={GREEN} />
      </div>
    </SceneShell>
  );
};
