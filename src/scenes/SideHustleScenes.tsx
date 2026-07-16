import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../components/overlayUI";
import { SceneShell, SceneHeadline } from "./SceneShell";
import { CartoonRobot, TinyDev, Sparks, Puff, impulse, poseTimeline, RobotPose, glassCard, CYAN, WHITE, RED, AMBER, GREEN } from "../motion/subjects";
import { ModelBlock } from "../motion/objects";
import { ImpactStamp } from "../motion/primitives";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#E8B84B";

const chip = (color: string, fontSize = 24): React.CSSProperties => ({
  padding: "9px 20px", borderRadius: 11, ...glassCard(color),
  fontFamily: FONT, fontWeight: 800, fontSize, letterSpacing: 1.5, color: WHITE, transform: "translateZ(0)", whiteSpace: "nowrap",
});

const Sticker: React.FC<{ label: string; at: number; color?: string; rot?: number; fontSize?: number }> = ({ label, at, color = CYAN, rot = -3, fontSize = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { stiffness: 170, damping: 15 }, durationInFrames: 24 });
  return (
    <div style={{ ...chip(color, fontSize), width: "fit-content", opacity: frame < at ? 0 : 1, transform: `translateZ(0) rotate(${Math.max(-2.8, Math.min(2.8, rot))}deg) scale(${interpolate(pop, [0, 1], [1.45, 1])})` }}>{label}</div>
  );
};

const Check: React.FC<{ at: number; size?: number; cross?: boolean }> = ({ at, size = 84, cross }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 190, damping: 15 }, durationInFrames: 22 });
  if (frame < at) return null;
  const color = cross ? RED : GREEN;
  return (
    <div style={{ transform: `scale(${interpolate(e, [0, 1], [1.7, 1])})`, opacity: interpolate(e, [0, 0.4], [0, 1]) }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>
        <circle cx={50} cy={50} r={42} fill={`${color}22`} stroke={color} strokeWidth={7} />
        {cross ? (
          <>
            <line x1={33} y1={33} x2={67} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
            <line x1={67} y1={33} x2={33} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
          </>
        ) : (
          <path d="M30 52 L45 66 L72 36" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// SIDE-HUSTLE TEMPLATES — professional, reusable scenes for "beginner paths /
// offers / assisted work" videos. All premium finish (glassCard), subjects
// act, every element takes a whisper-pinnable `at`.
// ============================================================================

// THE PATH PICKER — N glass doors pop in; at `pickAt` the robot hops to door
// `pickIndex`, it glows and swings open. Serves "five options, pick one".
export const PathDoorsScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  doors?: { label: string; at: number }[]; pickIndex?: number; pickAt?: number; tint?: string; subject?: boolean;
}> = ({ durationInFrames, kicker, title, doors = [], pickIndex = 0, pickAt = 99999, tint, subject = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const picked = frame >= pickAt;
  const doorW = 190;
  const hopP = spring({ frame: frame - pickAt, fps, config: { stiffness: 110, damping: 14 }, durationInFrames: 28 });
  const robotX = interpolate(hopP, [0, 1], [-((doors.length * (doorW + 26)) / 2) - 120, (pickIndex - (doors.length - 1) / 2) * (doorW + 26)]);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x401} depth impacts={[...doors.map((d) => d.at + 12), pickAt + 22]} tint={tint ?? CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", display: "flex", gap: 26, alignItems: "flex-end" }}>
          {doors.map((d, i) => {
            const e = spring({ frame: frame - d.at, fps, config: { stiffness: 118, damping: 18 }, durationInFrames: 26 });
            const isPick = picked && i === pickIndex;
            const open = isPick ? spring({ frame: frame - pickAt - 16, fps, config: { stiffness: 120, damping: 15 }, durationInFrames: 26 }) : 0;
            return (
              <div key={i} style={{ opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-120, 0])}px)` }}>
                <div style={{ position: "relative", width: doorW, height: 300, borderRadius: 18, ...glassCard(isPick ? GOLD : CYAN, isPick ? 2.5 : 2), overflow: "hidden", opacity: picked && !isPick ? 0.45 : 1 }}>
                  {/* interior glow revealed as the door slides up */}
                  <div style={{ position: "absolute", inset: 4, borderRadius: 14, background: `radial-gradient(ellipse at 50% 80%, ${GOLD}44, transparent 70%)`, opacity: open }} />
                  <div style={{ position: "absolute", left: 4, right: 4, bottom: 4, top: 4 + open * 262, borderRadius: 14, background: "linear-gradient(180deg, #3a2f28, #1e1814)", borderBottom: "3px solid rgba(255,255,255,0.12)" }}>
                    <div style={{ position: "absolute", right: 16, top: 140, width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                  </div>
                  {isPick && <Sparks at={pickAt + 22} x={doorW / 2} y={150} color={GOLD} size={150} />}
                </div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                  <Sticker label={d.label} at={d.at + 6} color={isPick ? GOLD : CYAN} rot={i % 2 ? 2 : -2} fontSize={21} />
                </div>
              </div>
            );
          })}
          {/* the chooser — walks the row, then hops into the picked doorway */}
          {subject && (
          <div style={{ position: "absolute", left: "50%", bottom: 46, transform: `translateX(${robotX}px)` }}>
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, pickAt + 22, 12, 18))}px) translateX(-50%)` }}>
              <CartoonRobot pose={picked ? "celebrate" : "thinking"} size={170} accent={picked ? GOLD : CYAN} lookX={picked ? 0 : 5} />
            </div>
            <Puff at={pickAt + 24} x={0} y={160} size={120} />
          </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// ASSISTED, NOT AUTOMATED — the robot types a messy DRAFT; it slides to the
// human who fixes the angle; the polished card gets the OUTCOME tag + check.
export const DraftPolishScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  polishAt?: number; outcomeAt?: number; outcomeLabel?: string;
}> = ({ durationInFrames, kicker, title, polishAt = 120, outcomeAt = 240, outcomeLabel = "2 POSTS / WEEK" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slide = spring({ frame: frame - polishAt, fps, config: { stiffness: 90, damping: 16 }, durationInFrames: 32 });
  const clean = interpolate(slide, [0.4, 1], [0, 1], CLAMP);
  const page = (x: number) => (
    <div style={{ width: 330, borderRadius: 16, ...glassCard(x ? GREEN : CYAN, 2), padding: "24px 26px", position: "relative" }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 21, letterSpacing: 2, color: "rgba(255,255,255,0.6)", transform: "translateZ(0)" }}>{x ? "THE OUTCOME" : "CLAUDE'S DRAFT"}</span>
      {[92, 78, 86, 64, 82].map((w, i) => {
        const wob = x ? (1 - clean) * Math.sin(i * 2.7) * 4 : Math.sin(frame * 0.06 + i * 2.1) * 2.5;
        return <div key={i} style={{ width: `${w}%`, height: 12, borderRadius: 6, background: x ? `rgba(79,169,138,${0.25 + 0.3 * clean})` : "rgba(255,255,255,0.16)", margin: "13px 0", transform: `translateY(${wob}px)` }} />;
      })}
      {/* red edit marks fade away as the human polishes */}
      {x && [1, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 40 + i * 60, top: 66 + i * 25, width: 60, height: 14, borderRadius: 7, border: `3px solid ${RED}`, opacity: (1 - clean) * 0.8, transform: "rotate(-4deg)" }} />
      ))}
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x412} impacts={[polishAt, outcomeAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <CartoonRobot pose="thinking" size={185} accent={CYAN} lookX={6} />
            {page(0)}
          </div>
          {/* the handoff arrow draws at polishAt */}
          <svg width={110} height={60} viewBox="0 0 110 60" style={{ overflow: "visible" }}>
            <line x1={4} y1={30} x2={4 + 78 * interpolate(slide, [0, 0.4], [0, 1], CLAMP)} y2={30} stroke={GREEN} strokeWidth={6} strokeLinecap="round" />
            {slide > 0.4 && <path d="M82 14 L106 30 L82 46 Z" fill={GREEN} />}
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, position: "relative" }}>
            <TinyDev pose={frame >= outcomeAt ? "happy" : "typing"} size={185} accent={GREEN} />
            {page(1)}
            <div style={{ position: "absolute", right: -46, bottom: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Sticker label={outcomeLabel} at={outcomeAt} color={GOLD} rot={2.5} fontSize={22} />
              <Check at={outcomeAt + 14} size={64} />
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// MANY → ONE — messy docs drop into the glass funnel; one clean, bound REPORT
// pops out with a price chip. Serves research-for-hire / distillation beats.
export const DocFunnelScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  dropAts?: number[]; reportAt?: number; reportLabel?: string; priceLabel?: string; tint?: string;
}> = ({ durationInFrames, kicker, title, dropAts = [20, 44, 66, 88, 108], reportAt = 170, reportLabel = "ONE-PAGE SUMMARY", priceLabel = "PAID THIS WEEK", tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = spring({ frame: frame - reportAt, fps, config: { stiffness: 130, damping: 14 }, durationInFrames: 26 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x423} impacts={[reportAt]} tint={tint ?? CYAN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {/* 560 tall so the popped-out report never reaches the headline below */}
          <div style={{ position: "relative", width: 560, height: 560 }}>
            {/* falling messy docs */}
            {dropAts.map((at, i) => {
              const t = frame - at;
              if (t < 0) return null;
              const fall = spring({ frame: t, fps, config: { stiffness: 80, damping: 13 }, durationInFrames: 30 });
              const x = 60 + (i % 3) * 160 + (i % 2) * 40;
              return (
                <div key={at} style={{ position: "absolute", left: x, top: interpolate(fall, [0, 1], [-80, 150]), opacity: interpolate(t, [0, 6], [0, 1], CLAMP) * interpolate(fall, [0.85, 1], [1, 0], CLAMP), transform: `rotate(${(i % 2 ? 1 : -1) * (14 - fall * 10)}deg)` }}>
                  <div style={{ width: 96, height: 120, borderRadius: 10, ...glassCard("rgba(255,255,255,0.3)"), padding: "12px 10px" }}>
                    {[80, 60, 74, 52].map((w, k) => (
                      <div key={k} style={{ width: `${w}%`, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.18)", margin: "9px 0" }} />
                    ))}
                  </div>
                </div>
              );
            })}
            {/* the glass funnel */}
            <svg width={560} height={470} viewBox="0 0 560 470" style={{ overflow: "visible" }}>
              <path d="M 90 180 L 470 180 L 320 320 L 320 400 L 240 400 L 240 320 Z" fill="rgba(120,112,102,0.08)" stroke="rgba(120,112,102,0.6)" strokeWidth={2.5} />
              <path d="M 100 186 L 460 186" stroke="rgba(120,112,102,0.25)" strokeWidth={5} strokeLinecap="round" />
            </svg>
            {/* the distilled report */}
            <div style={{ position: "absolute", left: 190, top: 396, opacity: interpolate(out, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(out, [0, 1], [-30, 6])}px) scale(${interpolate(out, [0, 1], [0.7, 1])})` }}>
              <div style={{ width: 180, borderRadius: 12, ...glassCard(GREEN, 2.5), padding: "16px 16px", textAlign: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 19, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{reportLabel}</span>
                {[86, 70, 78].map((w, k) => (
                  <div key={k} style={{ width: `${w}%`, height: 8, borderRadius: 4, background: `rgba(79,169,138,0.4)`, margin: "10px auto" }} />
                ))}
              </div>
              <Sparks at={reportAt + 8} x={90} y={30} color={GREEN} size={130} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, reportAt, 10, 16))}px)` }}>
              <CartoonRobot pose={frame >= reportAt ? "pointing" : "thinking"} size={230} accent={frame >= reportAt ? GREEN : CYAN} lookX={-7} />
            </div>
            <Sticker label={priceLabel} at={reportAt + 20} color={GOLD} rot={-2} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} />
      </div>
    </SceneShell>
  );
};

// FEWER MANUAL STEPS — the owner's app tiles wire into ONE workflow line; the
// manual-step pile collapses into a single automated chip.
export const AppFlowScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  apps?: { label: string; at: number }[]; connectAt?: number; collapseAt?: number; tint?: string;
}> = ({ durationInFrames, kicker, title, apps = [], connectAt = 200, collapseAt = 300, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wire = spring({ frame: frame - connectAt, fps, config: { stiffness: 70, damping: 17 }, durationInFrames: 40 });
  const collapsed = frame >= collapseAt;
  const n = Math.max(apps.length, 1);
  const tileW = 172;
  const rowW = n * (tileW + 24) - 24;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x434} depth impacts={[connectAt, collapseAt]} tint={tint ?? GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
        <div style={{ position: "relative", width: Math.max(rowW, 900), height: 330 }}>
          {/* app tiles */}
          {apps.map((a, i) => {
            const e = spring({ frame: frame - a.at, fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 26 });
            const x = (Math.max(rowW, 900) - rowW) / 2 + i * (tileW + 24);
            return (
              <div key={a.label} style={{ position: "absolute", left: x, top: 30 + (i % 2) * 16, opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `rotate(${i % 2 ? 1.5 : -1.5}deg) scale(${interpolate(e, [0, 1], [1.35, 1])})` }}>
                <div style={{ width: tileW, height: 92, borderRadius: 18, ...glassCard(CYAN), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{a.label}</span>
                </div>
              </div>
            );
          })}
          {/* the workflow wire draws through every tile at connectAt */}
          <svg width={Math.max(rowW, 900)} height={330} viewBox={`0 0 ${Math.max(rowW, 900)} 330`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path
              d={`M ${(Math.max(rowW, 900) - rowW) / 2 + tileW / 2} 150 ${apps.map((_, i) => `L ${(Math.max(rowW, 900) - rowW) / 2 + i * (tileW + 24) + tileW / 2} ${150 + (i % 2) * 16}`).join(" ")} L ${Math.max(rowW, 900) - 60} 158`}
              stroke={GREEN} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={2200} strokeDashoffset={2200 * (1 - wire)}
              style={{ filter: `drop-shadow(0 0 8px ${GREEN}66)` }}
            />
          </svg>
          {/* manual steps collapse into one automated chip */}
          <div style={{ position: "absolute", left: "50%", top: 226, transform: "translateX(-50%)", display: "flex", gap: 14, alignItems: "center" }}>
            {!collapsed ? (
              Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ ...chip("rgba(255,255,255,0.35)", 18), opacity: 0.85, transform: `translateZ(0) rotate(${(i % 2 ? 1 : -1) * 2}deg)` }}>STEP {i + 1}</div>
              ))
            ) : (
              <>
                <Sticker label="ONE WORKFLOW" at={collapseAt} color={GREEN} rot={-2} fontSize={26} />
                <Check at={collapseAt + 16} size={64} />
              </>
            )}
          </div>
          {collapsed && <Puff at={collapseAt + 2} x={Math.max(rowW, 900) / 2} y={250} size={190} />}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// FIRST-LINE HELPER — question bubbles rain onto the assistant's desk and get
// answered; the flagged one routes over the gate to the HUMAN for approval.
export const FirstLineDeskScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  bubbles?: { label: string; at: number }[]; routeAt?: number; approveAt?: number;
}> = ({ durationInFrames, kicker, title, bubbles = [], routeAt = 220, approveAt = 280 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const routed = frame >= routeAt;
  const routeP = spring({ frame: frame - routeAt, fps, config: { stiffness: 90, damping: 15 }, durationInFrames: 32 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x445} impacts={[routeAt, approveAt]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 38 }}>
        <div style={{ position: "relative", width: 1200, height: 400 }}>
          {/* the assistant at its desk */}
          <div style={{ position: "absolute", left: 130, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CartoonRobot pose="idle" size={200} accent={CYAN} lookX={2} lookY={-4} />
            <div style={{ width: 300, height: 26, borderRadius: 10, ...glassCard(CYAN, 2), marginTop: -8 }} />
            {/* ink-dim: these scenes render on the ivory paper theme */}
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: "rgba(31,30,29,0.6)", marginTop: 10, transform: "translateZ(0)" }}>FIRST-LINE HELPER</span>
          </div>
          {/* raining questions — answered with a quick check */}
          {bubbles.map((b, i) => {
            const t = frame - b.at;
            if (t < 0) return null;
            const fall = spring({ frame: t, fps, config: { stiffness: 90, damping: 14 }, durationInFrames: 28 });
            const x = 60 + (i % 3) * 130;
            return (
              <div key={b.label} style={{ position: "absolute", left: x, top: interpolate(fall, [0, 1], [-60, 150 + (i % 3) * 24]), opacity: interpolate(t, [0, 6], [0, 1], CLAMP) }}>
                <div style={{ ...chip(CYAN, 19), display: "flex", gap: 10, alignItems: "center" }}>
                  {b.label}
                  {t > 34 && <Check at={b.at + 34} size={30} />}
                </div>
              </div>
            );
          })}
          {/* the flagged question arcs over the gate to the human */}
          <div style={{ position: "absolute", left: interpolate(routeP, [0, 1], [430, 830]), top: 160 - Math.sin(routeP * Math.PI) * 120, opacity: routed ? 1 : 0 }}>
            <div style={{ ...chip(RED, 20) }}>THE BIG ONE</div>
          </div>
          {/* gate divider */}
          <div style={{ position: "absolute", left: 640, bottom: 0, width: 8, height: 170, borderRadius: 4, background: `repeating-linear-gradient(45deg, ${AMBER} 0 10px, #3a2c12 10px 20px)`, border: "2px solid rgba(255,255,255,0.18)" }} />
          <div style={{ position: "absolute", left: 596, bottom: 180 }}>
            <Sticker label="HUMAN GATE" at={routeAt - 10} color={AMBER} rot={-2} fontSize={19} />
          </div>
          {/* the human handles the important stuff */}
          <div style={{ position: "absolute", right: 120, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, approveAt, 10, 16))}px)` }}>
              <TinyDev pose={frame >= approveAt ? "happy" : "typing"} size={200} accent={GREEN} />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Sticker label="HUMAN APPROVES" at={approveAt} color={GREEN} rot={2} fontSize={20} />
              <Check at={approveAt + 12} size={54} />
            </div>
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// THE SKILL CARTRIDGE — a SKILL.MD cartridge clicks into the model; every run
// produces the SAME clean output (repeatable > disposable prompts).
export const SkillCartridgeScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  slotAt?: number; runAts?: number[]; cartridgeLabel?: string; subject?: boolean;
}> = ({ durationInFrames, kicker, title, slotAt = 90, runAts = [170, 220, 270], cartridgeLabel = "SKILL.MD", subject = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slot = spring({ frame: frame - slotAt, fps, config: { stiffness: 110, damping: 14 }, durationInFrames: 28 });
  const seated = frame >= slotAt + 24;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x456} impacts={[slotAt + 24, ...runAts]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          {/* paddingBottom reserves the run-card row INSIDE the stage — the
              cards must never spill into the headline below */}
          <div style={{ position: "relative", paddingBottom: 150 }}>
            <ModelBlock label="CLAUDE" width={400} coreColor={seated ? GREEN : CYAN} />
            {/* the cartridge slides down into the slot */}
            <div style={{ position: "absolute", left: 120, top: interpolate(slot, [0, 1], [-170, -34]), transform: `rotate(${interpolate(slot, [0, 1], [-6, 0])}deg)` }}>
              <div style={{ width: 160, height: 54, borderRadius: 10, ...glassCard(GOLD, 2.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{cartridgeLabel}</span>
              </div>
              <div style={{ width: 100, height: 12, margin: "0 auto", borderRadius: "0 0 8px 8px", background: "linear-gradient(180deg, #3a2f28, #1e1814)", border: "2px solid rgba(255,255,255,0.14)", borderTop: "none" }} />
            </div>
            <Sparks at={slotAt + 24} x={200} y={-6} color={GOLD} size={140} />
            {/* identical outputs pop out per run — consistency is the product */}
            <div style={{ position: "absolute", left: -30, top: 270, display: "flex", gap: 22 }}>
              {runAts.map((at, i) => {
                const e = spring({ frame: frame - at, fps, config: { stiffness: 140, damping: 14 }, durationInFrames: 24 });
                if (frame < at) return <div key={at} style={{ width: 140 }} />;
                return (
                  <div key={at} style={{ opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-40, 0])}px)` }}>
                    <div style={{ width: 140, borderRadius: 12, ...glassCard(GREEN, 2), padding: "12px 14px" }}>
                      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, letterSpacing: 1, color: GREEN, transform: "translateZ(0)" }}>RUN {i + 1}</span>
                      {[84, 70, 78].map((w, k) => (
                        <div key={k} style={{ width: `${w}%`, height: 7, borderRadius: 4, background: "rgba(79,169,138,0.4)", margin: "8px 0" }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {subject && (
              <div style={{ transform: `translateY(${-runAts.reduce((a, at) => a + Math.abs(impulse(frame, at, 8, 14)), 0)}px)` }}>
                <CartoonRobot pose={frame >= (runAts[runAts.length - 1] ?? 0) ? "celebrate" : seated ? "pointing" : "thinking"} size={220} accent={seated ? GREEN : CYAN} lookX={-7} />
              </div>
            )}
            <Sticker label="SAME RESULT, EVERY RUN" at={(runAts[1] ?? 0) + 10} color={GREEN} rot={-2} fontSize={21} />
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={60} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// THE THREE-BUYERS TEST — three contact slots; filled = a real OFFER (check),
// empty = the "JUST AN IDEA" stamp. The gate every plan must pass.
export const ThreeBuyersScene: React.FC<{
  durationInFrames: number; kicker?: string; title: string;
  fillAts?: number[]; verdictAt?: number; filled?: boolean;
}> = ({ durationInFrames, kicker, title, fillAts = [], verdictAt = 220, filled = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.14);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0x467} mood={!filled && frame >= verdictAt ? "danger" : "neutral"} impacts={[verdictAt]} tint={filled ? GREEN : RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ display: "flex", gap: 30 }}>
            {[0, 1, 2].map((i) => {
              const at = fillAts[i];
              const has = filled && at !== undefined && frame >= at;
              const e = spring({ frame: frame - (at ?? 0), fps, config: { stiffness: 140, damping: 14 }, durationInFrames: 24 });
              return (
                <div key={i} style={{ position: "relative", width: 230, height: 290, borderRadius: 18, border: has ? undefined : `3px dashed rgba(255,255,255,${0.2 + 0.15 * pulse})`, ...(has ? glassCard(GREEN, 2.5) : { background: "rgba(20,16,13,0.4)" }), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: has ? `rotate(${i % 2 ? 1.5 : -1.5}deg) scale(${interpolate(e, [0, 1], [1.3, 1])})` : undefined }}>
                  {has ? (
                    <>
                      <div style={{ width: 84, height: 84, borderRadius: "50%", background: "linear-gradient(180deg, #46362a, #17203a)", border: `3px solid ${GREEN}AA`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: GREEN, transform: "translateZ(0)" }}>{i + 1}</span>
                      </div>
                      {[70, 50].map((w, k) => (
                        <div key={k} style={{ width: `${w}%`, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.2)" }} />
                      ))}
                      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: GREEN, transform: "translateZ(0)" }}>PAYS THIS MONTH</span>
                    </>
                  ) : (
                    <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 21, letterSpacing: 2, color: `rgba(255,255,255,${0.3 + 0.2 * pulse})`, transform: "translateZ(0)" }}>WHO PAYS #{i + 1}?</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ transform: `translateY(${-Math.abs(impulse(frame, verdictAt, 12, 18))}px)` }}>
              <CartoonRobot pose={poseTimeline(frame, [[0, "thinking"], [verdictAt, filled ? "celebrate" : "facepalm"]] as [number, RobotPose][])} size={235} accent={frame >= verdictAt ? (filled ? GREEN : RED) : CYAN} lookX={-7} />
            </div>
            {frame >= verdictAt && (filled ? (
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <Sticker label="THAT'S AN OFFER" at={verdictAt} color={GREEN} rot={-2} />
                <Check at={verdictAt + 12} size={64} />
              </div>
            ) : (
              <div style={{ transform: "rotate(-6deg)" }}>
                <ImpactStamp text="JUST AN IDEA" at={verdictAt} color={RED} />
              </div>
            ))}
          </div>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={62} accent={filled ? GREEN : RED} />
      </div>
    </SceneShell>
  );
};
