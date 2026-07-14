import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { FONT } from "../components/overlayUI";
import { CartoonRobot, ThoughtBubble, Sparks, SpeechBubble, RobotPose, glassCard, CYAN, WHITE, RED, AMBER, GREEN, PANEL } from "../motion/subjects";
import { ModelBlock, SpeedModule, SpeedTrails, TokenCoin, CostMeterClimb, PromptQueue, CardStackDrop, ConveyorBelt, RetryWheel, ServerRack } from "../motion/objects";
import { StalledBar, ImpactStamp } from "../motion/primitives";
import { IconBrain, IconClock, IconGuard, IconPrice, IconBug, IconGauge, ChatGptMark } from "../components/Cartoons";
import { TintWash } from "../scenes/SceneShell";
import { useTheme } from "../theme";
import { SourceScreenshot } from "../motion/SourceScreenshot";
import { PanelLayout } from "./panelLayout";
import { Beat } from "./types";

// Per-beat ambient tints — every beat SHIFTS the wash colour (the beats
// crossfade, so the gradient sweeps with each 1.5–3s reset; never the same
// navy twice in a row). Explicit `Beat.tint` wins; the palette rotation covers
// archived specs that predate the field.
const BEAT_TINTS = ["#D97757", "#F59E0B", "#34D399", "#EF4444"];

// Shared glass-gradient fill for the one-off SVG machines (PREMIUM finish).
const GLASS_DEFS = (
  <defs>
    <linearGradient id="beatGlass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#2b2219" />
      <stop offset="100%" stopColor="#16110d" />
    </linearGradient>
  </defs>
);

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ============================================================================
// VERTICAL BEAT SCENES — every Short beat is a tiny animated scene with a
// SUBJECT doing something (CLAUDE.md §9). Text is a label, not narration.
// All scenes fill their parent (the 838px split band OR the full 1920 screen)
// and center their action, so one component works in both layouts.
// ============================================================================

// Big mobile label under the action. 1–4 words; sub is a small chip. The label
// STAMPS down (scale overshoot) and the chip slaps in tilted — meme energy,
// not a slide-up fade. The text is auto-fitted so long labels shrink instead
// of crossing the borders. 92 is the MAX size; the fit width covers the WORST
// case: the full-anim spans zoom the whole panel ×1.32 (VerticalShort) and the
// stamp overshoots ×1.12 — 730 × 1.32 × 1.12 ≈ 1079 ≤ the 1080 frame.
const BeatLabel: React.FC<{ text: string; sub?: string; accent?: string }> = ({ text, sub, accent = CYAN }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const fitted = React.useMemo(
    () => Math.min(92, fitText({ text, withinWidth: 730, fontFamily: FONT, fontWeight: 900 }).fontSize),
    [text],
  );
  const e = spring({ frame: frame - 2, fps, config: { stiffness: 300, damping: 13, mass: 0.7 }, durationInFrames: 14 });
  const subPop = spring({ frame: frame - 8, fps, config: { stiffness: 280, damping: 12 }, durationInFrames: 14 });
  const op = interpolate(frame, [2, 8], [0, 1], CLAMP);
  return (
    // order 2: the label renders at the BOTTOM of every beat scene's column —
    // the panel lives in the TOP band (face-bottom split, Kris July 2026), so
    // punch text hugs the seam by the captions, clear of the topic banner above.
    <div style={{ order: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: op, transform: `scale(${interpolate(e, [0, 1], [1.12, 1])}) translateZ(0)`, padding: "0 40px", textAlign: "center" }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: fitted, lineHeight: 1.02, color: t.text, textShadow: t.glow ? "0 6px 30px rgba(0,0,0,0.6)" : undefined, whiteSpace: "nowrap" }}>{text}</span>
      {sub ? <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: accent, borderRadius: 12, padding: "6px 18px", ...glassCard(accent), opacity: frame < 8 ? 0 : 1, transform: `rotate(-2deg) scale(${interpolate(subPop, [0, 1], [1.5, 1])})` }}>{sub}</span> : null}
    </div>
  );
};

const Wrap: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 44 }) => (
  <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap }}>{children}</AbsoluteFill>
);

// SVG verdict marks (never font glyphs — render-safe).
const Verdict: React.FC<{ kind: "check" | "warn" | "cross"; at: number; size?: number }> = ({ kind, at, size = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - at, fps, config: { stiffness: 280, damping: 14 }, durationInFrames: 14 });
  if (frame < at) return null;
  const color = kind === "check" ? GREEN : kind === "warn" ? AMBER : RED;
  return (
    <div style={{ transform: `scale(${interpolate(e, [0, 1], [2.2, 1])})`, opacity: interpolate(e, [0, 0.4], [0, 1]) }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 14px ${color})` }}>
        {kind === "warn" ? (
          <>
            <path d="M50 10 L92 84 H8 Z" fill="rgba(245,158,11,0.15)" stroke={AMBER} strokeWidth={7} strokeLinejoin="round" />
            <line x1={50} y1={38} x2={50} y2={62} stroke={AMBER} strokeWidth={9} strokeLinecap="round" />
            <circle cx={50} cy={74} r={5} fill={AMBER} />
          </>
        ) : (
          <>
            <circle cx={50} cy={50} r={42} fill={`${color}22`} stroke={color} strokeWidth={7} />
            {kind === "check" ? (
              <path d="M30 52 L45 66 L72 36" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <line x1={33} y1={33} x2={67} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
                <line x1={67} y1={33} x2={33} y2={67} stroke={color} strokeWidth={10} strokeLinecap="round" />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// emote — a big robot POPS in and acts out the emotion; bubble/label carry the words.
const EmoteBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 2, fps, config: { stiffness: 260, damping: 12, mass: 0.8 }, durationInFrames: 16 });
  return (
    <Wrap gap={30}>
      {beat.sub ? <SpeechBubble text={beat.sub} at={8} fontSize={40} color={beat.accent ?? CYAN} /> : null}
      <div style={{ transform: `scale(${interpolate(e, [0, 1], [0.5, 1])})` }}>
        <CartoonRobot pose={beat.pose ?? "idle"} size={400} accent={beat.accent ?? CYAN} />
      </div>
      <BeatLabel text={beat.text} accent={beat.accent} />
    </Wrap>
  );
};

// buyers — the 3-people test: THREE buyer slots pop in beside the robot (the
// on-screen count must match the spoken "three" — CLAUDE.md §9). Default:
// each slot holds a silhouette + "?" (name them); `verdict: "cross"` slams a
// red ✗ on every slot instead (you can't).
const BuyersBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const cross = beat.verdict === "cross";
  const c = cross ? RED : CYAN;
  return (
    <Wrap gap={44}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <CartoonRobot pose={beat.pose ?? "pointing"} size={180} accent={c} lookX={7} />
        <div style={{ display: "flex", gap: 18 }}>
          {[1, 2, 3].map((n, i) => {
            const e = spring({ frame: frame - 6 - i * 9, fps, config: { stiffness: 160, damping: 14 }, durationInFrames: 20 });
            const q = spring({ frame: frame - 26 - i * 9, fps, config: { stiffness: 240, damping: 12 }, durationInFrames: 14 });
            return (
              <div key={n} style={{ opacity: interpolate(e, [0, 0.3], [0, 1], CLAMP), transform: `translateY(${interpolate(e, [0, 1], [46, 0])}px)` }}>
                <div style={{ position: "relative", width: 148, height: 196, borderRadius: 16, border: `3px dashed ${cross ? "rgba(239,68,68,0.6)" : `${c}77`}`, background: t.name === "paper" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width={70} height={70} viewBox="0 0 100 100">
                    <circle cx={50} cy={32} r={19} fill="none" stroke={c} strokeWidth={7} opacity={0.8} />
                    <path d="M14 92 C22 62 78 62 86 92" fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" opacity={0.8} />
                  </svg>
                  {!cross && (
                    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: t.name === "paper" ? "rgba(31,30,29,0.7)" : "rgba(255,255,255,0.75)", transform: `scale(${interpolate(q, [0, 1], [1.8, 1])})`, opacity: interpolate(q, [0, 0.3], [0, 1], CLAMP) }}>?</span>
                  )}
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 1, color: t.name === "paper" ? "rgba(31,30,29,0.55)" : "rgba(255,255,255,0.5)", transform: "translateZ(0)" }}>#{n}</span>
                  {cross && (
                    <div style={{ position: "absolute", left: "50%", top: "38%", transform: "translate(-50%, -50%)" }}>
                      <Verdict kind="cross" at={30 + i * 12} size={86} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={c} />
    </Wrap>
  );
};

// queue — the bottleneck: robot waits → prompt cards queue → brain thinks slowly.
const QueueBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  // 4-label queues shrink the whole row so it survives the ×1.32 span zoom
  // (the brain tile used to clip the right frame edge — overlap rule 1)
  const wide = (beat.labels ?? []).length >= 4;
  return (
    <Wrap gap={40}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ marginTop: 26 }}>
          <CartoonRobot pose="waiting" size={wide ? 150 : 180} />
        </div>
        <PromptQueue labels={(beat.labels ?? ["PROMPT", "TOOL", "RETRY"]).slice(0, 4)} at={4} cardW={wide ? 96 : 108} />
        <div style={{ position: "relative", marginLeft: 14 }}>
          <div style={{ width: wide ? 128 : 160, height: wide ? 128 : 160, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", ...glassCard("#C15F3C") }}>
            <IconBrain size={wide ? 88 : 110} />
          </div>
          <div style={{ position: "absolute", top: wide ? -64 : -80, right: wide ? -24 : -46 }}>
            <ThoughtBubble size={wide ? 84 : 100} />
          </div>
        </div>
      </div>
      <StalledBar width={560} />
      <BeatLabel text={beat.text} accent={beat.accent} />
    </Wrap>
  );
};

// stack — call cards pile up, wobble, collapse on a worried robot.
const StackBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const long = dur > 110;
  const n = long ? 6 : 4;
  const spread = (dur * (long ? 0.55 : 0.7)) / n;
  const drops = Array.from({ length: n }, (_, i) => Math.round(4 + i * spread));
  const collapseAt = long ? Math.round(dur * 0.72) : undefined;
  const collapsed = collapseAt !== undefined && frame >= collapseAt;
  return (
    <Wrap gap={10}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ transform: "scale(0.9)", transformOrigin: "bottom center" }}>
          <CardStackDrop drops={drops} collapseAt={collapseAt} />
        </div>
        <div style={{ marginLeft: -90, marginBottom: 6 }}>
          <CartoonRobot pose={collapsed ? "alarmed" : "worried"} size={170} accent={collapsed ? RED : CYAN} />
        </div>
      </div>
      <BeatLabel text={beat.text} accent={beat.accent ?? "#F59E0B"} />
    </Wrap>
  );
};

// bolt — the DSpark module bolts onto the model block (opt. trails + warn tag).
const BoltBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const showTrails = beat.trails && frame >= 42;
  const warnOp = interpolate(frame, [56, 66], [0, 1], CLAMP);
  return (
    <Wrap gap={54}>
      <div style={{ position: "relative", transform: "scale(1.25)" }}>
        <ModelBlock label={beat.blockLabel ?? "V4"} width={300} />
        {/* the real app icon badges the block's corner when the block IS
            ChatGPT — never above it (props must stay inside the stage; a
            floating mark escapes into the BeatLabel under the span zoom) */}
        {beat.blockLabel === "CHATGPT" && (
          <div style={{ position: "absolute", left: 246, top: 128, transform: `translateY(${Math.sin(frame * 0.09) * 4}px)` }}>
            <ChatGptMark size={58} glow />
          </div>
        )}
        <div style={{ position: "absolute", left: -150, top: 56 }}>
          <SpeedModule at={8} label={beat.moduleLabel ?? "DSPARK"} />
        </div>
        {showTrails ? (
          <div style={{ position: "absolute", left: -215, top: 66 }}>
            <SpeedTrails width={200} />
          </div>
        ) : null}
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={beat.accent} />
      {beat.warn ? (
        <div style={{ opacity: warnOp, transform: "translateZ(0)", padding: "10px 22px", borderRadius: 12, border: `3px solid ${AMBER}`, background: "rgba(245,158,11,0.12)" }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: AMBER }}>{beat.warn}</span>
        </div>
      ) : null}
    </Wrap>
  );
};

// coins — token coins rain into the cost meter; it climbs green → red.
const CoinsBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const level = interpolate(frame, [8, dur * 0.45, Math.max(dur - 24, dur * 0.5 + 1)], [0.14, 0.5, 0.95], CLAMP);
  const coins = Array.from({ length: 9 }, (_, i) => 12 + i * Math.max(12, (dur - 60) / 9));
  return (
    <Wrap gap={46}>
      <div style={{ position: "relative", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", left: -120, bottom: 90 }}>
          {coins.map((t, i) => (
            <div key={i} style={{ position: "absolute", left: (i % 3) * 30 - 30, bottom: 0 }}>
              <TokenCoin at={Math.round(t)} fallH={240 + (i % 4) * 40} size={48} />
            </div>
          ))}
        </div>
        <CostMeterClimb level={level} height={300} label={beat.labels?.[0] ?? "COST"} />
        {/* the robot watches the meter climb and panics past the red line */}
        <div style={{ marginLeft: 34 }}>
          <CartoonRobot pose={level > 0.7 ? "alarmed" : "worried"} size={200} accent={level > 0.7 ? RED : CYAN} lookX={-7} />
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={level > 0.7 ? RED : GREEN} />
      {beat.stamp ? <ImpactStamp text={beat.stamp} at={Math.round(dur * 0.6)} color={AMBER} /> : null}
    </Wrap>
  );
};

// migrate — robot carries its workflow suitcase toward the MIGRATE gate, a STOP
// sign slams down, and it turns back to the TEST BENCH instead.
const MigrateBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stopAt = Math.round(dur * 0.42);
  const turnAt = stopAt + 14;
  const walk = interpolate(frame, [4, stopAt], [90, 560], CLAMP);
  const back = interpolate(frame, [turnAt, dur - 8], [0, -330], CLAMP);
  const x = walk + back;
  const flipped = frame >= turnAt;
  const stop = spring({ frame: frame - stopAt, fps, config: { stiffness: 240, damping: 13 }, durationInFrames: 16 });
  const stopY = interpolate(stop, [0, 1], [-360, 0]);
  const hop = Math.abs(Math.sin(frame * 0.22)) * 8;
  const pose: RobotPose = frame < stopAt ? "idle" : frame < turnAt ? "alarmed" : "celebrate";
  const sign = (label: string, color: string) => (
    <div style={{ padding: "10px 18px", borderRadius: 10, ...glassCard(color, 2.5), transform: "translateZ(0)" }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: WHITE }}>{label}</span>
    </div>
  );
  return (
    <Wrap gap={26}>
      <div style={{ position: "relative", width: 980, height: 430 }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, height: 5, background: "rgba(255,255,255,0.16)" }} />
        {/* destination gate */}
        <div style={{ position: "absolute", right: 10, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {sign("MIGRATE", RED)}
          <div style={{ width: 12, height: 130, background: "rgba(255,255,255,0.2)", borderRadius: 6 }} />
        </div>
        {/* test bench, the better destination */}
        <div style={{ position: "absolute", left: 6, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: interpolate(frame, [turnAt, turnAt + 10], [0.4, 1], CLAMP) }}>
          {sign("TEST BENCH", GREEN)}
          <div style={{ width: 150, height: 16, borderRadius: 6, background: "rgba(52,211,153,0.3)", border: `3px solid ${GREEN}` }} />
        </div>
        {/* STOP sign drops in front of the gate */}
        {frame >= stopAt && (
          <div style={{ position: "absolute", right: 200, bottom: 90, transform: `translateY(${stopY}px)` }}>
            <svg width={150} height={190} viewBox="0 0 100 130" style={{ overflow: "visible" }}>
              <line x1={50} y1={70} x2={50} y2={126} stroke="rgba(255,255,255,0.4)" strokeWidth={7} />
              <polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill={RED} stroke={WHITE} strokeWidth={5} />
              <text x={50} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={WHITE}>STOP</text>
            </svg>
          </div>
        )}
        <Sparks at={stopAt} x={700} y={220} color={RED} size={150} />
        {/* the robot + its workflow suitcase */}
        <div style={{ position: "absolute", left: x, bottom: 30, transform: `scaleX(${flipped ? -1 : 1})` }}>
          <div style={{ position: "relative" }}>
            <CartoonRobot pose={pose} size={210} accent={pose === "celebrate" ? GREEN : CYAN} />
            {/* counter-flip so the APP label never mirrors when the robot turns */}
            <div style={{ position: "absolute", right: -46, bottom: 26, transform: `translateY(${-hop}px) scaleX(${flipped ? -1 : 1})` }}>
              <svg width={84} height={72} viewBox="0 0 84 72">
                <rect x={6} y={20} width={72} height={48} rx={10} fill={PANEL} stroke={AMBER} strokeWidth={4} />
                <path d="M30 20 V12 a6 6 0 0 1 6-6 h12 a6 6 0 0 1 6 6 v8" stroke={AMBER} strokeWidth={4} fill="none" />
                <text x={42} y={51} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={16} fill={WHITE}>APP</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <BeatLabel text={beat.text} accent={RED} />
    </Wrap>
  );
};

// testbench — the workflow card feeds into a test machine; CURRENT vs DSPARK
// verdicts pop out with a check.
const TestBenchBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inX = interpolate(frame, [6, 30], [-340, -40], CLAMP);
  const swallowed = frame >= 30;
  const shake = swallowed && frame < dur ? Math.sin(frame * 0.9) * 3 : 0;
  const outAt = 48;
  const labels = beat.labels ?? ["CURRENT", "DSPARK"];
  return (
    <Wrap gap={44}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", transform: `translateX(${shake}px)` }}>
          {/* the machine */}
          <svg width={360} height={230} viewBox="0 0 360 230" style={{ overflow: "visible" }}>
            {GLASS_DEFS}
            <rect x={30} y={30} width={300} height={170} rx={24} fill="url(#beatGlass)" stroke={CYAN} strokeWidth={3} />
            <rect x={40} y={37} width={280} height={8} rx={4} fill="rgba(255,255,255,0.06)" />
            <rect x={0} y={95} width={44} height={44} rx={8} fill="#14100c" stroke={CYAN} strokeWidth={4} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={90 + i * 40} cy={62} r={9} fill={[GREEN, AMBER, CYAN][i]} opacity={0.4 + 0.6 * Math.max(0, Math.sin(frame * 0.3 - i))} />
            ))}
            <text x={180} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} letterSpacing={2} fill={WHITE}>TEST RIG</text>
            <rect x={70} y={150} width={220} height={16} rx={8} fill="rgba(255,255,255,0.1)" />
            <rect x={70} y={150} width={220 * interpolate(frame, [30, outAt], [0, 1], CLAMP)} height={16} rx={8} fill={CYAN} />
          </svg>
          {/* workflow card slides into the hopper */}
          {!swallowed && (
            <div style={{ position: "absolute", left: inX, top: 88, padding: "14px 20px", borderRadius: 12, ...glassCard(AMBER, 2.5) }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE }}>WORKFLOW</span>
            </div>
          )}
          <Sparks at={30} x={20} y={115} color={CYAN} size={110} />
        </div>
        {/* verdict chips pop out */}
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          {labels.slice(0, 2).map((l, i) => {
            const e = spring({ frame: frame - outAt - i * 8, fps, config: { stiffness: 220, damping: 15 }, durationInFrames: 16 });
            return (
              <div key={l} style={{ opacity: interpolate(e, [0, 0.4], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px) rotate(${i === 0 ? -2 : 2}deg) scale(${interpolate(e, [0, 1], [1.35, 1])})`, padding: "12px 24px", borderRadius: 12, ...glassCard(i === 0 ? "rgba(255,255,255,0.35)" : CYAN) }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: i === 0 ? "rgba(255,255,255,0.7)" : WHITE }}>{l}</span>
              </div>
            );
          })}
          <Verdict kind={beat.verdict ?? "check"} at={outAt + 22} size={96} />
        </div>
      </div>
      <BeatLabel text={beat.text} accent={GREEN} />
    </Wrap>
  );
};

// conveyor — one workflow card rides the belt; with two labels it splits into
// two timed lanes (stopwatch starts); with one label it completes with a check.
const ConveyorBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labels = beat.labels ?? ["CURRENT", "DSPARK"];
  const split = labels.length >= 2;
  const splitAt = Math.round(dur * 0.35);
  const belt = (y: number, w: number, x = 0) => (
    <div style={{ position: "absolute", left: x, top: y }}>
      <ConveyorBelt width={w} speed={4} />
    </div>
  );
  const card = (label: string, x: number, y: number, color: string) => (
    <div style={{ position: "absolute", left: x, top: y, padding: "10px 18px", borderRadius: 10, ...glassCard(color), transform: `translateY(${2 * Math.sin(frame * 0.3)}px)` }}>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: WHITE, whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
  const mainX = interpolate(frame, [4, splitAt], [0, 330], CLAMP);
  const laneX = interpolate(frame, [splitAt + 6, dur - 16], [330, 700], CLAMP);
  const watch = spring({ frame: frame - splitAt, fps, config: { stiffness: 220, damping: 15 }, durationInFrames: 16 });
  const hand = interpolate(frame, [splitAt, dur], [0, 320], CLAMP);
  return (
    <Wrap gap={40}>
      <div style={{ position: "relative", width: 940, height: 320 }}>
        {split ? (
          <>
            {belt(60, 420)}
            {belt(150, 500, 420)}
            {belt(250, 500, 420)}
            {frame < splitAt + 6 && card("WORKFLOW", mainX, 22, AMBER)}
            {frame >= splitAt + 6 && (
              <>
                {card(labels[0], laneX, 112, "rgba(255,255,255,0.4)")}
                {card(labels[1], laneX + 40, 212, CYAN)}
              </>
            )}
            {/* stopwatch starts at the split */}
            {frame >= splitAt && (
              <div style={{ position: "absolute", left: 20, top: 130, transform: `scale(${interpolate(watch, [0, 1], [0.4, 1])})`, opacity: interpolate(watch, [0, 0.4], [0, 1]) }}>
                <svg width={150} height={170} viewBox="0 0 100 114">
                  <line x1={50} y1={14} x2={50} y2={4} stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
                  <circle cx={50} cy={62} r={44} fill={PANEL} stroke={CYAN} strokeWidth={6} />
                  <line x1={50} y1={62} x2={50 + 30 * Math.sin((hand * Math.PI) / 180)} y2={62 - 30 * Math.cos((hand * Math.PI) / 180)} stroke={AMBER} strokeWidth={6} strokeLinecap="round" />
                  <circle cx={50} cy={62} r={6} fill={CYAN} />
                </svg>
              </div>
            )}
            <Sparks at={splitAt} x={420} y={60} color={CYAN} size={120} />
          </>
        ) : (
          <>
            {belt(160, 700, 40)}
            {card(labels[0] === "DONE" ? "WORKFLOW" : labels[0], interpolate(frame, [4, dur * 0.6], [40, 560], CLAMP), 118, CYAN)}
            {/* done tray + check */}
            <div style={{ position: "absolute", right: 40, top: 96, width: 170, height: 110, borderRadius: 14, border: `2px solid ${GREEN}AA`, background: "rgba(52,211,153,0.1)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 16px ${GREEN}22`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8 }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: GREEN }}>DONE</span>
            </div>
            <div style={{ position: "absolute", right: 80, top: 40 }}>
              <Verdict kind="check" at={Math.round(dur * 0.62)} size={90} />
            </div>
            <Sparks at={Math.round(dur * 0.62)} x={760} y={140} color={GREEN} size={130} />
          </>
        )}
      </div>
      <BeatLabel text={beat.text} accent={CYAN} />
    </Wrap>
  );
};

// reject — a hype badge flies at the guard shield and BOUNCES off.
const RejectBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const hitAt = 22;
  // the badge re-attacks every 88 frames so long beats stay alive
  const c = frame % 88;
  const approach = interpolate(c, [4, hitAt], [-380, -110], CLAMP);
  const bounce = c >= hitAt ? interpolate(Math.min((c - hitAt) / 16, 1), [0, 1], [0, -190]) : 0;
  const fallY = c >= hitAt ? interpolate(Math.min((c - hitAt) / 16, 1), [0, 1], [0, 60]) : 0;
  const rot = c >= hitAt ? Math.max(-55, (c - hitAt) * -5) : 0;
  const badgeOp = interpolate(c, [0, 4, hitAt + 12, hitAt + 26], [0, 1, 1, 0], CLAMP);
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.3);
  return (
    <Wrap gap={48}>
      <div style={{ position: "relative", width: 760, height: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* the badge */}
        <div style={{ position: "absolute", left: 370 + approach + bounce, top: 120 + fallY, transform: `rotate(${rot}deg)`, padding: "14px 26px", borderRadius: 14, ...glassCard(RED, 2.5), opacity: badgeOp }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: WHITE, whiteSpace: "nowrap" }}>{beat.badge ?? "HYPE"}</span>
        </div>
        {/* the shield */}
        <div style={{ position: "absolute", right: 130, top: 60 }}>
          <svg width={210} height={230} viewBox="0 0 100 110" style={{ filter: `drop-shadow(0 0 ${16 * pulse}px ${CYAN})` }}>
            <path d="M50 6 L88 20 V52 C88 78 71 94 50 102 C29 94 12 78 12 52 V20 Z" stroke={CYAN} strokeWidth={6} fill="rgba(217,119,87,0.14)" />
            <line x1={32} y1={40} x2={68} y2={72} stroke={RED} strokeWidth={8} strokeLinecap="round" />
            <line x1={68} y1={40} x2={32} y2={72} stroke={RED} strokeWidth={8} strokeLinecap="round" />
          </svg>
        </div>
        <Sparks at={hitAt} x={470} y={160} color={CYAN} size={150} />
        <Sparks at={hitAt + 88} x={470} y={160} color={CYAN} size={150} />
      </div>
      <BeatLabel text={beat.text} accent={RED} />
    </Wrap>
  );
};

// retry — a request card loops around the shared retry wheel while a confused
// robot watches it go round.
const RetryBeat: React.FC<{ beat: Beat }> = ({ beat }) => (
  <Wrap gap={50}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <RetryWheel size={400} />
      <CartoonRobot pose="confused" size={190} accent={AMBER} lookX={-7} />
    </div>
    <BeatLabel text={beat.text} accent={AMBER} />
  </Wrap>
);

// check — one big animated object gets a verdict stamped on it (quick-fire beats).
const CheckBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { stiffness: 200, damping: 15, mass: 0.7 }, durationInFrames: 16 });
  const stampAt = Math.min(30, Math.round(dur * 0.4));
  const react = frame >= stampAt ? 1 + 0.1 * Math.max(0, Math.sin((frame - stampAt) * 0.5)) * Math.max(0, 1 - (frame - stampAt) / 20) : 1;
  const float = Math.sin(frame * 0.07) * 8;
  const obj = beat.obj ?? "gauge";
  const icon =
    obj === "clock" ? <IconClock size={185} /> :
    obj === "shield" ? <IconGuard size={185} /> :
    obj === "coin" ? <IconPrice size={185} /> :
    obj === "bug" ? <IconBug size={185} /> :
    obj === "brain" ? <IconBrain size={185} /> :
    <IconGauge size={185} />;
  const tileColor = beat.verdict === "cross" ? RED : beat.verdict === "warn" ? AMBER : beat.verdict === "check" ? GREEN : CYAN;
  return (
    <Wrap gap={40}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `translateY(${float}px)` }}>
        {/* the icon sits on a glass app-tile — big icons never float bare */}
        <div style={{ width: 270, height: 270, borderRadius: 48, display: "flex", alignItems: "center", justifyContent: "center", ...glassCard(tileColor), transform: `scale(${interpolate(enter, [0, 1], [0.3, 1]) * react})` }}>
          {icon}
        </div>
        {beat.verdict ? <Verdict kind={beat.verdict} at={stampAt} size={130} /> : null}
      </div>
      {beat.labels ? (
        <div style={{ display: "flex", gap: 18 }}>
          {beat.labels.map((l, i) => {
            const e = spring({ frame: frame - stampAt - i * 8, fps, config: { stiffness: 220, damping: 15 }, durationInFrames: 14 });
            return (
              <div key={l} style={{ opacity: interpolate(e, [0, 0.4], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) rotate(${[-3, 2, -2][i % 3]}deg) scale(${interpolate(e, [0, 1], [1.4, 1])})`, padding: "10px 20px", borderRadius: 12, ...glassCard(CYAN) }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: WHITE }}>{l}</span>
              </div>
            );
          })}
        </div>
      ) : null}
      <BeatLabel text={beat.text} sub={beat.sub} accent={beat.accent} />
    </Wrap>
  );
};

// race — same brain block, two lanes; only the DSPARK lane flies.
const RaceBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const loop = dur * 0.6;
  const slowX = interpolate(frame % loop, [0, loop], [0, 210]);
  const fastX = interpolate(frame % loop, [0, loop], [0, 620]);
  const lane = (label: string, x: number, fast: boolean, y: number) => (
    <div style={{ position: "absolute", top: y, left: 0, right: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 58, height: 3, background: "rgba(255,255,255,0.12)" }} />
      <span style={{ position: "absolute", left: 4, top: 2, fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: fast ? CYAN : "rgba(255,255,255,0.5)", transform: "translateZ(0)" }}>{label}</span>
      <div style={{ position: "absolute", left: 110 + x, top: 8 }}>
        <div style={{ position: "relative" }}>
          <ModelBlock label="V4" width={130} />
          {fast && <div style={{ position: "absolute", left: -130, top: 22 }}><SpeedTrails width={130} /></div>}
        </div>
      </div>
    </div>
  );
  return (
    <Wrap gap={44}>
      <div style={{ position: "relative", width: 940, height: 300 }}>
        {lane("BEFORE", slowX, false, 0)}
        {lane("DSPARK", fastX, true, 158)}
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={CYAN} />
    </Wrap>
  );
};

// racks — physical infrastructure: server racks hum, one runs hot, fans spin.
const RacksBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => (
  <Wrap gap={46}>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
      <ServerRack width={210} />
      <ServerRack width={210} overheatAt={Math.round(dur * 0.35)} />
    </div>
    <BeatLabel text={beat.text} sub={beat.sub} accent={AMBER} />
  </Wrap>
);

// battery — the weekly allowance as a segmented battery draining to `value`%.
const BatteryDrainBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const target = beat.value ?? 50;
  const pct = Math.round(interpolate(frame, [14, Math.min(dur * 0.55, 150)], [100, target], CLAMP));
  const segs = 8;
  const litFloat = (pct / 100) * segs;
  const lit = Math.floor(litFloat);
  const color = pct > 60 ? GREEN : pct > 35 ? AMBER : RED;
  return (
    <Wrap gap={56}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 430, height: 190, borderRadius: 26, padding: 14, display: "flex", gap: 10, ...glassCard(color, 2.5) }}>
            {Array.from({ length: segs }, (_, i) => {
              const draining = i === lit && litFloat - lit > 0.1;
              const on = i < lit || (draining && frame % 12 < 7);
              return <div key={i} style={{ flex: 1, borderRadius: 10, background: on ? `linear-gradient(180deg, ${color}, ${color}77)` : "rgba(255,255,255,0.07)", boxShadow: on ? `0 0 14px ${color}55` : "none" }} />;
            })}
          </div>
          <div style={{ width: 22, height: 74, borderRadius: 8, background: "rgba(255,255,255,0.18)" }} />
        </div>
        <div style={{ position: "absolute", top: -72, left: "50%", transform: "translateX(-50%) rotate(-2deg)", borderRadius: 12, padding: "8px 24px", ...glassCard(color) }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 42, color: WHITE, transform: "translateZ(0)" }}>{pct}%</span>
        </div>
        <div style={{ position: "absolute", left: 40, right: 50, bottom: -28, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(6px)" }} />
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={color} />
    </Wrap>
  );
};

// breaker — the load meter climbs until the big switch TRIPS with sparks.
const CircuitBreakerBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tripAt = Math.min(Math.round(dur * 0.42), 120);
  const level = interpolate(frame, [6, tripAt], [0.15, 0.98], CLAMP);
  const tripped = frame >= tripAt;
  const flip = spring({ frame: frame - tripAt, fps, config: { stiffness: 240, damping: 11 }, durationInFrames: 18 });
  const lever = interpolate(flip, [0, 1], [-34, 34]);
  const c = tripped ? RED : CYAN;
  return (
    <Wrap gap={44}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
        <CostMeterClimb level={level} height={280} label="USAGE" />
        <div style={{ position: "relative", width: 260, height: 320, borderRadius: 26, ...glassCard(c, 2.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: tripped ? RED : GREEN, boxShadow: `0 0 12px ${tripped ? RED : GREEN}` }} />
          <div style={{ width: 78, height: 154, borderRadius: 16, background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 32, height: 112, borderRadius: 12, background: `linear-gradient(180deg, ${c}, ${tripped ? "#7f1d1d" : "#0e7490"})`, boxShadow: `0 6px 14px rgba(0,0,0,0.5), 0 0 14px ${c}66`, transform: `rotate(${lever}deg)` }} />
          </div>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: tripped ? RED : "rgba(255,255,255,0.7)", transform: "translateZ(0)" }}>{tripped ? "TRIPPED" : "ARMED"}</span>
          <Sparks at={tripAt} x={130} y={160} color={RED} size={170} />
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={c} />
    </Wrap>
  );
};

// elevator — the model-tier lift rides to `value` (floor index in `labels`,
// bottom → top) and the doors open on a celebrating mini robot.
const TierElevatorBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const floors = beat.labels ?? ["HAIKU", "SONNET", "OPUS", "FABLE 5"];
  const target = Math.min(beat.value ?? 2, floors.length - 1);
  const floorH = 118;
  const colors = [GREEN, CYAN, "#C15F3C", "#E8B84B"];
  const ride = spring({ frame: frame - 20, fps, config: { stiffness: 60, damping: 16 }, durationInFrames: 40 });
  const carFloor = interpolate(ride, [0, 1], [floors.length - 1, target]);
  const doors = spring({ frame: frame - 58, fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 22 });
  const doorGap = interpolate(doors, [0, 1], [0, 46]);
  const tc = colors[target % colors.length];
  return (
    <Wrap gap={40}>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: 180, height: floors.length * floorH + 22, borderRadius: 22, ...glassCard(CYAN, 2), overflow: "hidden" }}>
          {floors.map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 10, right: 10, bottom: 12 + i * floorH, height: 2, background: "rgba(255,255,255,0.1)" }} />
          ))}
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 + carFloor * floorH, height: floorH - 16, borderRadius: 14, background: "linear-gradient(180deg, rgba(30,40,62,0.98), rgba(12,18,30,0.95))", border: `2px solid ${tc}AA`, boxShadow: `0 0 18px ${tc}33`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CartoonRobot pose={doors > 0.5 ? "celebrate" : "idle"} size={80} accent={tc} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `calc(50% - ${doorGap}px)`, background: "linear-gradient(180deg, #3a2f28, #1e1814)", borderRight: "2px solid rgba(255,255,255,0.14)" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: `calc(50% - ${doorGap}px)`, background: "linear-gradient(180deg, #3a2f28, #1e1814)", borderLeft: "2px solid rgba(255,255,255,0.14)" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column-reverse", gap: floorH - 60, paddingBottom: 30 }}>
          {floors.map((f, i) => (
            <div key={f} style={{ padding: "10px 20px", borderRadius: 12, ...glassCard(i === target ? tc : "rgba(255,255,255,0.25)"), opacity: i === target ? 1 : 0.55, width: "fit-content" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={tc} />
    </Wrap>
  );
};

// hourglass — the deadline as coin-sand; it FLIPS (the date moved), and after
// the flip grains leak from a crack (the pressure didn't stop).
const HourglassBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flipAt = Math.min(Math.round(dur * 0.38), 110);
  const flip = spring({ frame: frame - flipAt, fps, config: { stiffness: 110, damping: 14 }, durationInFrames: 30 });
  const rot = interpolate(flip, [0, 1], [0, 180]);
  const topFill = interpolate(frame, [0, dur], [0.8, 0.3], CLAMP);
  const leak = frame >= flipAt + 24;
  return (
    <Wrap gap={50}>
      <div style={{ position: "relative" }}>
        <div style={{ transform: `rotate(${rot}deg)` }}>
          <svg width={300} height={380} viewBox="0 0 150 190" style={{ overflow: "visible" }}>
            {GLASS_DEFS}
            <rect x={18} y={2} width={114} height={15} rx={7.5} fill="url(#beatGlass)" stroke={`${AMBER}AA`} strokeWidth={2} />
            <rect x={18} y={173} width={114} height={15} rx={7.5} fill="url(#beatGlass)" stroke={`${AMBER}AA`} strokeWidth={2} />
            <path d="M35 18 H115 L82 92 V98 L115 172 H35 L68 98 V92 Z" fill="rgba(160,200,255,0.07)" stroke="rgba(255,255,255,0.28)" strokeWidth={2.5} />
            <path d={`M${75 - 34 * topFill} ${88 - 58 * topFill} h${68 * topFill} L78 90 h-6 Z`} fill={AMBER} opacity={0.85} />
            <line x1={75} y1={94} x2={75} y2={152} stroke={AMBER} strokeWidth={4} strokeDasharray="6 7" strokeDashoffset={-frame * 2.2} opacity={0.9} />
            <path d={`M${75 - 40 * (1 - topFill)} 168 Q75 ${168 - 46 * (1 - topFill)} ${75 + 40 * (1 - topFill)} 168 Z`} fill={AMBER} opacity={0.9} />
          </svg>
        </div>
        {leak && [0, 1, 2].map((i) => {
          const lt = ((frame - flipAt) * 0.02 + i * 0.33) % 1;
          return <div key={i} style={{ position: "absolute", right: -6 - lt * 64, top: 188 + lt * 92, width: 9, height: 9, borderRadius: "50%", background: AMBER, opacity: (1 - lt) * 0.9 }} />;
        })}
        {leak && <div style={{ position: "absolute", right: 24, top: 196, width: 32, height: 3, background: "rgba(255,255,255,0.35)", transform: "rotate(24deg)" }} />}
        <div style={{ position: "absolute", left: 30, right: 30, bottom: -26, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(6px)" }} />
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={AMBER} />
    </Wrap>
  );
};

// stamp — a card rides in, the hazard-striped arm SLAMS an APPROVED/DENIED
// imprint (`verdict`: check = approved, cross = denied; `badge` = card label).
const StampArmBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ok = beat.verdict !== "cross";
  const color = ok ? GREEN : RED;
  const slideIn = spring({ frame: frame - 4, fps, config: { stiffness: 90, damping: 16 }, durationInFrames: 26 });
  const cardX = interpolate(slideIn, [0, 1], [-420, 0]);
  const stampAt = 40;
  const slam = spring({ frame: frame - stampAt, fps, config: { stiffness: 320, damping: 13 }, durationInFrames: 14 });
  const armY = frame < stampAt ? -120 : interpolate(slam, [0, 0.5, 1], [-120, 0, -64]);
  const stamped = frame >= stampAt + 6;
  const wob = stamped ? Math.sin((frame - stampAt) * 0.8) * Math.max(0, 1 - (frame - stampAt) / 16) * 4 : 0;
  return (
    <Wrap gap={46}>
      {/* 130px of headroom INSIDE the stage — the raised arm must never escape
          upward into the BeatLabel above (overlap rule, CLAUDE.md §9) */}
      <div style={{ position: "relative", width: 760, height: 560 }}>
        <div style={{ position: "absolute", left: 330, top: 130, transform: `translateY(${armY}px)` }}>
          <div style={{ width: 26, height: 150, margin: "0 auto", borderRadius: 10, background: "repeating-linear-gradient(45deg, #443428 0 10px, #1a2338 10px 20px)", border: "2px solid rgba(255,255,255,0.15)" }} />
          <div style={{ width: 132, height: 56, borderRadius: 14, ...glassCard(color, 2.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, letterSpacing: 2, color, transform: "translateZ(0)" }}>STAMP</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 466 }}>
          <ConveyorBelt width={680} speed={stamped ? 0.6 : 3} color={color} />
        </div>
        <div style={{ position: "absolute", left: 240 + cardX, top: 370, transform: `rotate(${wob}deg)` }}>
          <div style={{ width: 300, padding: "22px 24px", borderRadius: 14, ...glassCard("rgba(255,255,255,0.3)"), textAlign: "center", position: "relative" }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: WHITE, transform: "translateZ(0)" }}>{beat.badge ?? "REQUEST"}</span>
            {stamped && (
              <div style={{ position: "absolute", left: "50%", top: -52, transform: `translateX(-50%) rotate(-8deg) scale(${interpolate(slam, [0.5, 1], [1.6, 1])})`, padding: "6px 18px", border: `4px solid ${color}`, borderRadius: 10, background: "rgba(6,9,16,0.5)", boxShadow: `0 0 22px ${color}66` }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, letterSpacing: 2, color, transform: "translateZ(0)" }}>{ok ? "APPROVED" : "DENIED"}</span>
              </div>
            )}
          </div>
        </div>
        <Sparks at={stampAt + 4} x={395} y={416} color={color} size={150} />
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={color} />
    </Wrap>
  );
};

// signal — the status tower: static + jittery amber rings while waiting; with
// `verdict: "check"` it broadcasts clean green pulses (the REAL signal).
const SignalTowerBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const clean = beat.verdict === "check";
  const color = clean ? GREEN : AMBER;
  const jitter = clean ? 0 : Math.sin(frame * 1.7) * 2.5;
  return (
    <Wrap gap={46}>
      <div style={{ position: "relative", width: 460, height: 430 }}>
        {[0, 1, 2].map((i) => {
          const t = (frame * 0.016 + i / 3) % 1;
          const r = 40 + t * 185;
          return <div key={i} style={{ position: "absolute", left: 230 - r + jitter * (i + 1), top: 120 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `3px solid ${color}`, opacity: (1 - t) * (clean ? 0.75 : 0.4) }} />;
        })}
        {!clean && [0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 120 + ((frame * (7 + i * 3)) % 220), top: 46 + i * 50, width: 42 + (i % 2) * 26, height: 4, borderRadius: 2, background: RED, opacity: 0.3 + 0.3 * Math.sin(frame * 0.9 + i) }} />
        ))}
        <svg width={460} height={430} viewBox="0 0 460 430" style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
          {GLASS_DEFS}
          <polygon points="230,96 196,404 264,404" fill="url(#beatGlass)" stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} />
          {[180, 255, 330].map((y) => (
            <line key={y} x1={230 - (y - 96) * 0.11 - 6} y1={y} x2={230 + (y - 96) * 0.11 + 6} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
          ))}
          <circle cx={230} cy={96} r={13} fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} opacity={0.5 + 0.5 * Math.sin(frame * (clean ? 0.18 : 0.7))} />
        </svg>
        <div style={{ position: "absolute", left: 150, right: 150, bottom: 6, height: 16, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(6px)" }} />
        {clean && <div style={{ position: "absolute", left: "50%", top: 26, transform: "translateX(-50%)" }}><Verdict kind="check" at={16} size={84} /></div>}
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={color} />
    </Wrap>
  );
};

// doors — compact path picker: up to 4 glass doors (`labels`), the door at
// index `value` glows and slides open on a celebrating mini robot.
const DoorsBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  // up to FIVE doors — the on-screen count must MATCH the spoken count
  // (CLAUDE.md §9); sizes shrink so five still fit the ×1.32 full-anim zoom
  const labels = (beat.labels ?? ["A", "B", "C"]).slice(0, 5);
  const five = labels.length >= 5;
  const doorW = five ? 146 : 190;
  const doorH = five ? 215 : 280;
  const doorGap = five ? 18 : 22;
  const pick = Math.min(beat.value ?? 0, labels.length - 1);
  const pickAt = Math.min(Math.round(dur * 0.4), 90);
  const picked = frame >= pickAt;
  return (
    <Wrap gap={44}>
      <div style={{ display: "flex", gap: doorGap, alignItems: "flex-end" }}>
        {labels.map((l, i) => {
          const e = spring({ frame: frame - 6 - i * 7, fps, config: { stiffness: 130, damping: 14 }, durationInFrames: 24 });
          const isPick = picked && i === pick;
          const open = isPick ? spring({ frame: frame - pickAt, fps, config: { stiffness: 120, damping: 15 }, durationInFrames: 26 }) : 0;
          return (
            <div key={l} style={{ opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-90, 0])}px)` }}>
              <div style={{ position: "relative", width: doorW, height: doorH, borderRadius: 18, ...glassCard(isPick ? "#E8B84B" : CYAN, isPick ? 2.5 : 2), overflow: "hidden", opacity: picked && !isPick ? 0.4 : 1 }}>
                <div style={{ position: "absolute", inset: 4, borderRadius: 14, background: "radial-gradient(ellipse at 50% 80%, rgba(232,184,75,0.28), transparent 70%)", opacity: open }} />
                <div style={{ position: "absolute", left: 4, right: 4, bottom: 4, top: 4 + open * (doorH - 36), borderRadius: 14, background: "linear-gradient(180deg, #3a2f28, #1e1814)", borderBottom: "3px solid rgba(255,255,255,0.12)" }}>
                  <div style={{ position: "absolute", right: 14, top: doorH * 0.46, width: 11, height: 11, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
                </div>
                {isPick && open > 0.5 && (
                  <div style={{ position: "absolute", left: "50%", bottom: 14, transform: "translateX(-50%)" }}>
                    <CartoonRobot pose="celebrate" size={five ? 86 : 110} accent="#E8B84B" />
                  </div>
                )}
                {isPick && <Sparks at={pickAt + 14} x={doorW / 2} y={doorH / 2} color="#E8B84B" size={140} />}
              </div>
              <div style={{ marginTop: 10, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: five ? 19 : 21, letterSpacing: 1, color: isPick ? "#E8B84B" : t.name === "paper" ? "rgba(31,30,29,0.65)" : "rgba(255,255,255,0.7)", transform: "translateZ(0)" }}>{l}</div>
            </div>
          );
        })}
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={picked ? "#E8B84B" : CYAN} />
    </Wrap>
  );
};

// funnel — messy docs pour into the glass funnel; ONE clean report pops out.
const FunnelBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reportAt = Math.min(Math.round(dur * 0.5), 120);
  const out = spring({ frame: frame - reportAt, fps, config: { stiffness: 130, damping: 14 }, durationInFrames: 26 });
  return (
    <Wrap gap={40}>
      <div style={{ position: "relative", width: 620, height: 500 }}>
        {[10, 34, 56, 78].map((at, i) => {
          const t = frame - at;
          if (t < 0) return null;
          const fall = spring({ frame: t, fps, config: { stiffness: 80, damping: 13 }, durationInFrames: 30 });
          return (
            <div key={at} style={{ position: "absolute", left: 110 + (i % 3) * 150, top: interpolate(fall, [0, 1], [-70, 160]), opacity: interpolate(t, [0, 6], [0, 1], CLAMP) * interpolate(fall, [0.85, 1], [1, 0], CLAMP), transform: `rotate(${(i % 2 ? 1 : -1) * (14 - fall * 10)}deg)` }}>
              <div style={{ width: 92, height: 114, borderRadius: 10, ...glassCard("rgba(255,255,255,0.3)"), padding: "10px 10px" }}>
                {[80, 60, 72].map((w, k) => (
                  <div key={k} style={{ width: `${w}%`, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.18)", margin: "9px 0" }} />
                ))}
              </div>
            </div>
          );
        })}
        <svg width={620} height={500} viewBox="0 0 620 500" style={{ overflow: "visible" }}>
          <path d="M 110 190 L 510 190 L 350 340 L 350 420 L 270 420 L 270 340 Z" fill="rgba(160,200,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
        </svg>
        <div style={{ position: "absolute", left: 212, top: 414, opacity: interpolate(out, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(out, [0, 1], [-26, 4])}px) scale(${interpolate(out, [0, 1], [0.7, 1])})` }}>
          <div style={{ width: 196, borderRadius: 12, ...glassCard(GREEN, 2.5), padding: "16px 16px", textAlign: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 21, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{beat.badge ?? "THE REPORT"}</span>
            {[86, 70].map((w, k) => (
              <div key={k} style={{ width: `${w}%`, height: 8, borderRadius: 4, background: "rgba(52,211,153,0.4)", margin: "10px auto" }} />
            ))}
          </div>
          <Sparks at={reportAt + 8} x={98} y={26} color={GREEN} size={140} />
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={GREEN} />
    </Wrap>
  );
};

// cartridge — a SKILL.MD cartridge clicks into the model block; identical RUN
// cards pop out (repeatable beats disposable).
const CartridgeBeat: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slotAt = 24;
  const slot = spring({ frame: frame - slotAt, fps, config: { stiffness: 110, damping: 14 }, durationInFrames: 28 });
  const seated = frame >= slotAt + 24;
  const runs = [Math.round(dur * 0.45), Math.round(dur * 0.6), Math.round(dur * 0.75)];
  return (
    <Wrap gap={48}>
      <div style={{ position: "relative", transform: "scale(1.12)", marginTop: 30 }}>
        <ModelBlock label="CLAUDE" width={340} coreColor={seated ? GREEN : CYAN} />
        <div style={{ position: "absolute", left: 96, top: interpolate(slot, [0, 1], [-150, -30]), transform: `rotate(${interpolate(slot, [0, 1], [-6, 0])}deg)` }}>
          <div style={{ width: 148, height: 50, borderRadius: 10, ...glassCard("#E8B84B", 2.5), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 21, letterSpacing: 1, color: WHITE, transform: "translateZ(0)" }}>{beat.badge ?? "SKILL.MD"}</span>
          </div>
        </div>
        <Sparks at={slotAt + 24} x={170} y={-4} color="#E8B84B" size={130} />
        <div style={{ position: "absolute", left: -36, top: 230, display: "flex", gap: 18 }}>
          {runs.map((at, i) => {
            const e = spring({ frame: frame - at, fps, config: { stiffness: 140, damping: 14 }, durationInFrames: 24 });
            if (frame < at) return <div key={at} style={{ width: 128 }} />;
            return (
              <div key={at} style={{ opacity: interpolate(e, [0, 0.3], [0, 1]), transform: `translateY(${interpolate(e, [0, 1], [-36, 0])}px)` }}>
                <div style={{ width: 128, borderRadius: 12, ...glassCard(GREEN, 2), padding: "10px 12px" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, letterSpacing: 1, color: GREEN, transform: "translateZ(0)" }}>RUN {i + 1}</span>
                  {[84, 70].map((w, k) => (
                    <div key={k} style={{ width: `${w}%`, height: 6, borderRadius: 3, background: "rgba(52,211,153,0.4)", margin: "7px 0" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BeatLabel text={beat.text} sub={beat.sub} accent={seated ? GREEN : CYAN} />
    </Wrap>
  );
};

// Meme punch: ONE oversized emoji pops with the beat (animated-meme energy).
// receipt — a REAL page screenshot as proof: the browser card pops in and
// zooms to the claim (SourceScreenshot). Shorts receipts show BIG headlines
// only (§9/§10) — the BeatLabel carries the message, the page proves it.
// White sticker label for bleed mode — theme text is unreadable over a page.
const BleedLabel: React.FC<{ text: string; top: number }> = ({ text, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { stiffness: 260, damping: 13 }, durationInFrames: 16 });
  const fitted = React.useMemo(
    () => Math.min(64, fitText({ text, withinWidth: 840, fontFamily: FONT, fontWeight: 900 }).fontSize),
    [text],
  );
  return (
    <div style={{ position: "absolute", top, left: "50%", transform: `translateX(-50%) rotate(-1.5deg) scale(${interpolate(pop, [0, 1], [1.16, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
      <div style={{ padding: "12px 30px", borderRadius: 16, background: "rgba(255,255,255,0.96)", boxShadow: "0 16px 44px rgba(31,30,29,0.35)" }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: fitted, color: "#1F1E1D", whiteSpace: "nowrap" }}>{text}</span>
      </div>
    </div>
  );
};

const ReceiptBeat: React.FC<{ beat: Beat }> = ({ beat }) => {
  // PADDED CARD (Kris, July 2026 — supersedes the 100% bleed): the page is a
  // centered browser card with paper margin around it. The card viewport is
  // sized to the shot's `to` aspect so the settled view shows the WHOLE
  // authored rect — claim text never slices at a card edge. The
  // counter-transform nets out the panel zoom/shift so the card stays
  // screen-true around seam moves.
  const { zoom, shift, panelH } = React.useContext(PanelLayout);
  const s = beat.shot;
  if (!s) return null;
  // face-bottom split (Kris, July 2026): the band is the TOP of the frame, so
  // the banner zone is at the top and the sticker label drops to the BOTTOM,
  // hugging the seam with the captions cluster below it.
  const bannerZone = 118; // topic banner overlays the band's top edge
  const labelZone = 164; // sticker label above the seam
  const availH = Math.max(220, panelH - bannerZone - labelZone);
  const aspect = s.to.w / s.to.h;
  let contentW = 952;
  let contentH = contentW / aspect;
  if (contentH > availH - 54) {
    contentH = availH - 54;
    contentW = contentH * aspect;
  }
  const cardW = Math.round(contentW);
  const cardH = Math.round(contentH) + 54;
  return (
    <AbsoluteFill style={{ transform: `translateY(${-shift}px) scale(${1 / zoom})` }}>
      <div style={{ position: "absolute", left: (1080 - cardW) / 2, top: bannerZone + Math.max(0, (availH - cardH) / 2) }}>
        <SourceScreenshot src={s.src} url={s.url} imageW={s.imageW} imageH={s.imageH} from={s.from} to={s.to} zoomAt={s.zoomAt} highlight={s.highlight} highlightAt={s.highlightAt} width={cardW} height={cardH} fit="cover" />
      </div>
      {/* the sticker rides just above the seam (receipts are split-only) */}
      <BleedLabel text={beat.text} top={Math.min(panelH - labelZone + 22, 1560)} />
    </AbsoluteFill>
  );
};

// Brand-mark pop — the product's real logo rides the beat (right dock under
// the banner zone — the band owns the TOP of the frame since the face-bottom
// flip; same collision rules as EmojiPop). Opening beats of product videos use it.
const LogoPop: React.FC<{ logo: "chatgpt" }> = ({ logo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 6, fps, config: { stiffness: 260, damping: 13, mass: 0.8 }, durationInFrames: 16 });
  const bob = Math.sin(frame * 0.08) * 5;
  return (
    <div style={{ position: "absolute", top: 132, right: 74, transform: `translateY(${bob}px) scale(${interpolate(e, [0, 1], [0.3, 1])}) rotate(${interpolate(e, [0, 1], [-14, -4])}deg)`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
      {logo === "chatgpt" && <ChatGptMark size={116} glow />}
    </div>
  );
};

const EmojiPop: React.FC<{ emoji: string }> = ({ emoji }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({ frame: frame - 4, fps, config: { stiffness: 300, damping: 12, mass: 0.7 }, durationInFrames: 14 });
  const wob = Math.sin(frame * 0.2) * 5;
  return (
    <div style={{ position: "absolute", top: 128, right: 70, transform: `scale(${interpolate(e, [0, 1], [0.2, 1])}) rotate(${-8 + wob}deg)`, opacity: interpolate(e, [0, 0.3], [0, 1]) }}>
      <span style={{ fontSize: 130, filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.5))" }}>{emoji}</span>
    </div>
  );
};

// Router: one animated scene per beat.
export const BeatSceneView: React.FC<{ beat: Beat; dur: number }> = ({ beat, dur }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], CLAMP);
  const scene = () => {
    switch (beat.scene) {
      case "emote": return <EmoteBeat beat={beat} />;
      case "buyers": return <BuyersBeat beat={beat} />;
      case "queue": return <QueueBeat beat={beat} />;
      case "stack": return <StackBeat beat={beat} dur={dur} />;
      case "bolt": return <BoltBeat beat={beat} />;
      case "coins": return <CoinsBeat beat={beat} dur={dur} />;
      case "migrate": return <MigrateBeat beat={beat} dur={dur} />;
      case "testbench": return <TestBenchBeat beat={beat} dur={dur} />;
      case "conveyor": return <ConveyorBeat beat={beat} dur={dur} />;
      case "reject": return <RejectBeat beat={beat} />;
      case "retry": return <RetryBeat beat={beat} />;
      case "check": return <CheckBeat beat={beat} dur={dur} />;
      case "race": return <RaceBeat beat={beat} dur={dur} />;
      case "racks": return <RacksBeat beat={beat} dur={dur} />;
      case "battery": return <BatteryDrainBeat beat={beat} dur={dur} />;
      case "breaker": return <CircuitBreakerBeat beat={beat} dur={dur} />;
      case "elevator": return <TierElevatorBeat beat={beat} />;
      case "hourglass": return <HourglassBeat beat={beat} dur={dur} />;
      case "stamp": return <StampArmBeat beat={beat} />;
      case "signal": return <SignalTowerBeat beat={beat} />;
      case "doors": return <DoorsBeat beat={beat} dur={dur} />;
      case "funnel": return <FunnelBeat beat={beat} dur={dur} />;
      case "cartridge": return <CartridgeBeat beat={beat} dur={dur} />;
      case "receipt": return <ReceiptBeat beat={beat} />;
      default: return null;
    }
  };
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <TintWash tint={beat.tint ?? BEAT_TINTS[beat.at % BEAT_TINTS.length]} seed={beat.at} />
      {scene()}
      {beat.emoji ? <EmojiPop emoji={beat.emoji} /> : null}
      {beat.logo ? <LogoPop logo={beat.logo} /> : null}
    </AbsoluteFill>
  );
};
