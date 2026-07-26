import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { ReactionsScene, NotMagicScene, BoredMattersScene } from "./scenes/RobotScenes";
import { SystemBreakScene } from "./scenes/SystemBreakScene";
import { StackCollapseScene } from "./scenes/CostScenes";
import { GatesScene, ScannerScene } from "./scenes/GptScenes";
import { MigrateStopScene, ThresholdGateScene, CheaperToServeScene, SpeedWallScene } from "./scenes/MetaphorScenes";
import { SkillCartridgeScene, DocFunnelScene } from "./scenes/SideHustleScenes";
import { CartoonRobot, glassCard, poseTimeline, Puff, Sparks } from "./motion/subjects";
import { RetryWheel } from "./motion/objects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";
import { KineticText, MusicController, PALETTE } from "./motion/editkit";

// HabitsVideo — transparent cutaway overlay for "The 5 habits of people who
// manage AI agents well" (~14m18s, 25749f @ 30fps). A management-system
// explainer: the edit is SUBJECT scenes acting out each habit (§1-§4), doc
// receipts proving every Anthropic/Claude claim (brand-first), and the official
// Claude Code film as a montage card. Chapters: Hook / The Brief / The
// Checkpoint / The Evidence / The Correction / Earned Autonomy / The Payoff.
// Every `at` is whisper-pinned (captionsData, talking-head.mp4 2026-07-26).

export const HABITS_DUR = 25749;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CORAL = PALETTE.opus; // #D97757 house accent
const GREEN = PALETTE.win;
const AMBER = PALETTE.cost;
const RED = PALETTE.danger;
const BLUE = PALETTE.sonnet;
const PURPLE = PALETTE.fable;
const SHOT = "assets/external/screenshots";

// ── INTERNS — the hook: five interns pop in, ONE vague brief drops, the
// manager walks off, the project collapses. ────────────────────────────────
const InternsScene: React.FC<{ durationInFrames: number; briefAt: number; leaveAt: number; crashAt: number }> = ({ durationInFrames, briefAt, leaveAt, crashAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crash = frame >= crashAt;
  const briefIn = spring({ frame: frame - briefAt, fps, config: { stiffness: 140, damping: 15 }, durationInFrames: 22 });
  const mgrX = frame >= leaveAt ? interpolate(frame, [leaveAt, leaveAt + 50], [0, 620], CLAMP) : 0;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc1} impacts={[briefAt, crashAt]} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ position: "relative", width: 1460, height: 430 }}>
          {/* five interns — LARGE (§8 proportions), spread on a ground line */}
          {[0, 1, 2, 3, 4].map((i) => {
            const at = 8 + i * 9;
            const pop = spring({ frame: frame - at, fps, config: { stiffness: 150, damping: 14 }, durationInFrames: 20 });
            const pose = crash ? (i % 2 ? "worried" : "confused") : frame >= briefAt ? "thinking" : "celebrate";
            return (
              <div key={i} style={{ position: "absolute", left: 20 + i * 240, bottom: 0, transform: `scale(${interpolate(pop, [0, 1], [0, 0.88])})`, transformOrigin: "bottom center" }}>
                <CartoonRobot pose={pose as never} accent={[CORAL, BLUE, GREEN, PURPLE, AMBER][i]} lookX={frame >= briefAt ? 0.4 : 0} />
                {frame >= at && frame <= at + 14 && <Puff at={at} />}
              </div>
            );
          })}
          {/* the manager walks off right after dropping the brief */}
          <div style={{ position: "absolute", right: -30, bottom: 0, transform: `translateX(${mgrX}px) scale(1.02)`, transformOrigin: "bottom center", opacity: interpolate(mgrX, [0, 500], [1, 0]) }}>
            <CartoonRobot pose={frame >= leaveAt ? "walking" : "pointing"} accent="#5B5751" />
          </div>
          {/* the ONE vague brief */}
          {frame >= briefAt && (
            <div style={{ position: "absolute", left: "44%", top: 0, transform: `translateX(-50%) rotate(-2deg) scale(${interpolate(briefIn, [0, 1], [1.6, 1])})`, opacity: interpolate(briefIn, [0, 0.3], [0, 1]), padding: "16px 30px", borderRadius: 12, background: "rgba(255,255,255,0.96)", border: `2px solid ${AMBER}`, boxShadow: "0 16px 40px rgba(31,30,29,0.25)" }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 36, color: "#1F1E1D" }}>“just… handle the project”</span>
            </div>
          )}
          {crash && <Sparks at={crashAt} />}
          {crash && (
            <div style={{ position: "absolute", left: "50%", bottom: 250, transform: "translateX(-50%) rotate(-3deg)", padding: "12px 28px", borderRadius: 10, background: RED, border: "3px solid rgba(255,255,255,0.5)", boxShadow: `0 0 30px ${RED}88` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 2, color: "#fff" }}>PROJECT DOWN</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="FIVE BRILLIANT HIRES · ONE VAGUE SENTENCE" title="THEN EVERYONE BLAMES THE INTERNS" titleSize={52} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// ── STICKER CHIPS — the five-part system (hook preview + payoff recap). ────
const StickerChipsScene: React.FC<{ durationInFrames: number; kicker: string; title: string; chips: { label: string; at: number }[]; checks?: boolean; tint: string }> = ({ durationInFrames, kicker, title, chips, checks = false, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slots = [
    { x: -470, y: -30, rot: -3 },
    { x: -235, y: 42, rot: 2 },
    { x: 0, y: -44, rot: -2 },
    { x: 235, y: 38, rot: 3 },
    { x: 470, y: -22, rot: -2 },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc2} impacts={chips.map((c) => c.at)} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
        <div style={{ position: "relative", width: 1360, height: 200 }}>
          {chips.map((c, i) => {
            const e = spring({ frame: frame - c.at, fps, config: { stiffness: 170, damping: 15, mass: 0.9 }, durationInFrames: 20 });
            if (frame < c.at) return null;
            const s = slots[i % slots.length];
            return (
              <div key={c.label} style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) translate(${s.x}px,${s.y}px) rotate(${s.rot}deg) scale(${interpolate(e, [0, 1], [1.7, 1])})`, opacity: interpolate(e, [0, 0.25], [0, 1]), display: "flex", alignItems: "center", gap: 10, padding: "16px 24px", borderRadius: 12, ...glassCard(CORAL + "cc", 2.5), boxShadow: `0 14px 36px rgba(31,30,29,0.28)` }}>
                {checks && (
                  <svg width="30" height="30" viewBox="0 0 100 100"><path d="M20 52 L42 74 L82 30" fill="none" stroke={GREEN} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 1, color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{c.label}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── AMBIGUOUS — "clean up this spreadsheet": one vague prompt card, four
// contradictory readings fan out around a confused robot. ──────────────────
const AmbiguousScene: React.FC<{ durationInFrames: number; readAts: number[] }> = ({ durationInFrames, readAts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reads = ["DELETE DUPES?", "FIX FORMATTING?", "RENAME COLUMNS?", "REBUILD IT ALL?"];
  const slots = [
    { x: -430, y: -110 },
    { x: 430, y: -110 },
    { x: -430, y: 70 },
    { x: 430, y: 70 },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc3} impacts={readAts} tint={AMBER}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", width: 1340, height: 400 }}>
          <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%) rotate(-1.5deg)", padding: "16px 30px", borderRadius: 12, background: "rgba(255,255,255,0.96)", border: `2px solid ${AMBER}`, boxShadow: "0 16px 40px rgba(31,30,29,0.22)" }}>
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 33, color: "#1F1E1D" }}>“clean up this spreadsheet”</span>
          </div>
          <div style={{ position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%) scale(0.95)", transformOrigin: "bottom center" }}>
            <CartoonRobot pose={frame >= readAts[1] ? "confused" : "thinking"} accent={CORAL} />
          </div>
          {reads.map((r, i) => {
            const at = readAts[i];
            const e = spring({ frame: frame - at, fps, config: { stiffness: 160, damping: 15 }, durationInFrames: 20 });
            if (frame < at) return null;
            return (
              <div key={r} style={{ position: "absolute", left: "50%", top: "56%", transform: `translate(-50%,-50%) translate(${slots[i].x}px,${slots[i].y}px) rotate(${i % 2 ? 2.5 : -2.5}deg) scale(${interpolate(e, [0, 1], [1.6, 1])})`, opacity: interpolate(e, [0, 0.3], [0, 1]), padding: "13px 22px", borderRadius: 10, ...glassCard((i === 3 ? RED : AMBER) + "cc", 2), boxShadow: "0 12px 30px rgba(31,30,29,0.24)" }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{r}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="ONE WORD, FOUR JOBS" title="WHAT DOES 'CLEAN' MEAN?" titleSize={56} accent={AMBER} />
      </div>
    </SceneShell>
  );
};

// ── CHIP LIST — vertical whisper-pinned rows (brief items, tests, rules). ──
const ChipListScene: React.FC<{ durationInFrames: number; kicker: string; title: string; items: { label: string; at: number }[]; color?: string; icon?: "check" | "warn" | "arrow"; tint: string }> = ({ durationInFrames, kicker, title, items, color = GREEN, icon = "check", tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc4} impacts={items.map((i) => i.at)} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 940 }}>
          {items.map((it) => {
            const e = spring({ frame: frame - it.at, fps, config: { stiffness: 130, damping: 17 }, durationInFrames: 22 });
            if (frame < it.at) return null;
            return (
              <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 14, ...glassCard(color + "cc", 2), transform: `translateX(${interpolate(e, [0, 1], [-34, 0])}px)`, opacity: interpolate(e, [0, 0.35], [0, 1]) }}>
                <svg width="34" height="34" viewBox="0 0 100 100">
                  {icon === "check" && <path d="M20 52 L42 74 L82 30" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />}
                  {icon === "warn" && <><path d="M50 12 L92 84 H8 Z" fill={`${color}33`} stroke={color} strokeWidth={8} strokeLinejoin="round" /><line x1={50} y1={40} x2={50} y2={60} stroke="#fff" strokeWidth={9} strokeLinecap="round" /><circle cx={50} cy={73} r={5} fill="#fff" /></>}
                  {icon === "arrow" && <path d="M14 50 H74 M52 26 L78 50 L52 74" fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: "#fff", transform: "translateZ(0)" }}>{it.label}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── ANSWER CARD — a polished, confident answer… stamped WRONG ROW. ─────────
const AnswerCardScene: React.FC<{ durationInFrames: number; wrongAt: number }> = ({ durationInFrames, wrongAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inE = spring({ frame: frame - 14, fps, config: { stiffness: 110, damping: 18 }, durationInFrames: 28 });
  const stamp = spring({ frame: frame - wrongAt, fps, config: { stiffness: 220, damping: 14, mass: 0.9 }, durationInFrames: 18 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc5} impacts={[wrongAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ position: "relative", transform: `translateY(${interpolate(inE, [0, 1], [40, 0])}px)`, opacity: interpolate(inE, [0, 0.3], [0, 1]) }}>
          <div style={{ width: 760, borderRadius: 16, padding: "34px 40px", ...glassCard(BLUE + "cc", 2.5), display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: BLUE }}>THE ANSWER</span>
            <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 74, lineHeight: 1, color: "#fff", transform: "translateZ(0)" }}>+38%</span>
            <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 24, color: "rgba(255,255,255,0.85)", transform: "translateZ(0)" }}>“Category A clearly leads — recommend doubling budget.”</span>
            <div style={{ alignSelf: "flex-start", padding: "6px 16px", borderRadius: 999, background: BLUE, opacity: 0.95 }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: "#fff" }}>CONFIDENT ✦</span>
            </div>
          </div>
          {frame >= wrongAt && (
            <div style={{ position: "absolute", right: -46, top: -34, transform: `rotate(8deg) scale(${interpolate(stamp, [0, 1], [1.8, 1])})`, opacity: interpolate(stamp, [0, 0.3], [0, 1]), padding: "14px 26px", borderRadius: 12, background: RED, border: "3px solid rgba(255,255,255,0.5)", boxShadow: `0 0 34px ${RED}88` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, letterSpacing: 1, color: "#fff" }}>WRONG ROW</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="POLISHED · PLAUSIBLE · UNCHECKED" title="CONFIDENCE ISN'T A SIGNAL" titleSize={54} accent={RED} />
      </div>
    </SceneShell>
  );
};

// ── EVIDENCE CHAIN — claim card → chain → the SOURCE row; the wrong subtotal
// flashes red, the trace lands on the real row. ────────────────────────────
const EvidenceChainScene: React.FC<{ durationInFrames: number; wrongAt: number; traceAt: number }> = ({ durationInFrames, wrongAt, traceAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chain = interpolate(frame, [traceAt, traceAt + 30], [0, 1], CLAMP);
  const landed = frame >= traceAt + 30;
  const rowE = spring({ frame: frame - (traceAt + 26), fps, config: { stiffness: 140, damping: 16 }, durationInFrames: 22 });
  const Row: React.FC<{ y: number; label: string; val: string; state: "wrong" | "right" | "dim" }> = ({ y, label, val, state }) => (
    <div style={{ position: "absolute", left: 0, top: y, width: 560, display: "flex", justifyContent: "space-between", padding: "12px 22px", borderRadius: 10, background: state === "wrong" && frame >= wrongAt && frame < traceAt + 26 ? `${RED}33` : state === "right" && landed ? `${GREEN}33` : "rgba(255,255,255,0.07)", border: `2px solid ${state === "wrong" && frame >= wrongAt && frame < traceAt + 26 ? RED : state === "right" && landed ? GREEN : "rgba(120,112,102,0.35)"}` }}>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 23, color: "#fff", transform: "translateZ(0)" }}>{label}</span>
      <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 23, color: state === "right" && landed ? GREEN : state === "wrong" && frame >= wrongAt ? RED : "rgba(255,255,255,0.75)" }}>{val}</span>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc6} impacts={[wrongAt, traceAt + 26]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* the claim */}
          <div style={{ width: 380, borderRadius: 16, padding: "26px 30px", ...glassCard(BLUE + "cc", 2.5), display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: BLUE }}>THE CLAIM</span>
            <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 56, lineHeight: 1, color: "#fff" }}>+38%</span>
            <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.8)" }}>“Category A leads”</span>
          </div>
          {/* the chain draws toward the source */}
          <svg width="150" height="60" viewBox="0 0 150 60">
            <line x1={0} y1={30} x2={150 * chain} y2={30} stroke={landed ? GREEN : AMBER} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
          </svg>
          {/* the source table */}
          <div style={{ position: "relative", width: 560, height: 250 }}>
            <span style={{ position: "absolute", top: -36, left: 4, fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 3, color: "rgba(31,30,29,0.55)" }}>THE SOURCE</span>
            <Row y={0} label="Q2 · filtered view" val="+38%" state="wrong" />
            <Row y={86} label="Q2 · full period" val="+11%" state="right" />
            <Row y={172} label="Q1 · full period" val="+9%" state="dim" />
            {landed && (
              <div style={{ position: "absolute", right: -30, top: 74, transform: `rotate(4deg) scale(${rowE})`, padding: "8px 18px", borderRadius: 9, background: GREEN, boxShadow: `0 0 24px ${GREEN}77` }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#fff" }}>THE REAL ROW</span>
              </div>
            )}
          </div>
        </div>
        <SceneHeadline kicker="FOLLOW THE CHAIN, NOT THE TONE" title="TRACE IT TO THE ROW" titleSize={56} accent={GREEN} />
      </div>
    </SceneShell>
  );
};

// ── EVIDENCE GATE — the CITED card passes the decision gate; UNSUPPORTED
// bounces off and stays outside. ───────────────────────────────────────────
const EvidenceGateScene: React.FC<{ durationInFrames: number; bounceAt: number; passAt: number }> = ({ durationInFrames, bounceAt, passAt }) => {
  const frame = useCurrentFrame();
  // unsupported card approaches, hits the gate, bounces back
  const uX = frame < bounceAt ? interpolate(frame, [10, bounceAt], [-420, -130], CLAMP) : interpolate(frame, [bounceAt, bounceAt + 26], [-130, -390], { ...CLAMP, easing: (t) => 1 - (1 - t) * (1 - t) });
  const uRot = frame >= bounceAt ? interpolate(frame, [bounceAt, bounceAt + 26], [0, -9], CLAMP) : 0;
  // cited card sails through after passAt
  const cX = interpolate(frame, [passAt, passAt + 46], [-420, 330], CLAMP);
  const passed = frame >= passAt + 40;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc7} impacts={[bounceAt]} tint={CORAL}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ position: "relative", width: 1200, height: 300 }}>
          {/* the decision gate */}
          <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: 18, height: 300, borderRadius: 6, background: `linear-gradient(180deg, ${CORAL}, #8a3f26)`, boxShadow: `0 0 26px ${CORAL}66` }} />
          <span style={{ position: "absolute", left: "50%", top: -40, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: "rgba(31,30,29,0.6)" }}>THE DECISION</span>
          {/* unsupported */}
          <div style={{ position: "absolute", left: "50%", top: 44, transform: `translateX(${uX}px) rotate(${uRot}deg)`, width: 300, padding: "18px 24px", borderRadius: 12, ...glassCard(RED + "cc", 2.5) }}>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", display: "block" }}>“TRUST ME”</span>
            <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: RED }}>no source attached</span>
          </div>
          {/* cited */}
          {frame >= passAt && (
            <div style={{ position: "absolute", left: "50%", top: 176, transform: `translateX(${cX}px)`, width: 300, padding: "18px 24px", borderRadius: 12, ...glassCard(GREEN + "cc", 2.5), boxShadow: passed ? `0 0 30px ${GREEN}66` : undefined }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", display: "block" }}>“ROW 214”</span>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: GREEN }}>source attached ✓</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="UNSUPPORTED CLAIMS WAIT OUTSIDE" title="EVIDENCE DRIVES ACTIONS" titleSize={54} accent={CORAL} />
      </div>
    </SceneShell>
  );
};

// ── RETRY LOOP — the same correction goes around the wheel; the robot
// facepalms as the identical mistake comes back. ───────────────────────────
const RetryLoopScene: React.FC<{ durationInFrames: number; palmAt: number }> = ({ durationInFrames, palmAt }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc8} impacts={[palmAt]} tint={RED}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
          <RetryWheel size={330} label="NEXT WEEK" cardLabel="SAME FIX" />
          <div style={{ transform: "scale(0.85)", transformOrigin: "bottom center" }}>
            <CartoonRobot pose={poseTimeline(frame, [[0, "thinking"], [palmAt, "facepalm"]])} accent={RED} lookX={-0.5} />
          </div>
        </div>
        <SceneHeadline kicker="CORRECTED IN CHAT · FORGOTTEN BY MONDAY" title="THE SAME LESSON, AGAIN" titleSize={54} accent={RED} />
      </div>
    </SceneShell>
  );
};

// ── AUTONOMY LADDER — three responsibility levels; proof stamps fill, the
// robot steps UP one rung; repeated failures send it back DOWN. ────────────
const AutonomyLadderScene: React.FC<{ durationInFrames: number; upAt: number; downAt: number }> = ({ durationInFrames, upAt, downAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const levels = [
    { label: "SUPERVISED", sub: "review everything", col: BLUE },
    { label: "FEWER CHECKS", sub: "proven tasks only", col: CORAL },
    { label: "AUTONOMOUS", sub: "high stakes stay gated", col: PURPLE },
  ];
  const upE = spring({ frame: frame - upAt, fps, config: { stiffness: 120, damping: 15 }, durationInFrames: 26 });
  const downE = spring({ frame: frame - downAt, fps, config: { stiffness: 160, damping: 13 }, durationInFrames: 22 });
  const level = frame < upAt ? 0 : frame < downAt ? interpolate(upE, [0, 1], [0, 1]) : interpolate(downE, [0, 1], [1, 0]);
  const stepW = 340;
  const checks = [24, 52, 80]; // proof accumulating on level 1 before the step up
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xc9} impacts={[upAt, downAt]} tint={CORAL}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ position: "relative", width: 1160, height: 360 }}>
          {levels.map((l, i) => (
            <div key={l.label} style={{ position: "absolute", left: i * (stepW + 50), bottom: 0, width: stepW, height: 96 + i * 86, borderRadius: 14, ...glassCard(l.col + (i === 2 ? "88" : "cc"), 2), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 14, gap: 4 }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", transform: "translateZ(0)" }}>{l.label}</span>
              <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17, color: l.col === PURPLE ? "#d8cfe8" : l.col, transform: "translateZ(0)" }}>{l.sub}</span>
            </div>
          ))}
          {/* proof stamps accumulate ABOVE level 1, left of the robot's path */}
          {checks.map((at, i) =>
            frame >= at && frame < upAt + 30 ? (
              <div key={at} style={{ position: "absolute", left: 8 + i * 92, bottom: 250, transform: `rotate(${i % 2 ? 4 : -4}deg)`, padding: "6px 14px", borderRadius: 8, background: GREEN, opacity: 0.95, boxShadow: `0 0 16px ${GREEN}55` }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 19, color: "#fff" }}>RUN ✓</span>
              </div>
            ) : null,
          )}
          {/* the robot climbs the rungs (and gets sent back down) */}
          <div style={{ position: "absolute", left: 96 + level * (stepW + 50), bottom: 96 + level * 86, transform: "scale(0.6)", transformOrigin: "bottom center" }}>
            <CartoonRobot pose={frame >= downAt + 10 ? "worried" : frame >= upAt + 20 ? "celebrate" : "idle"} accent={CORAL} />
          </div>
          {frame >= downAt && (
            <div style={{ position: "absolute", right: 40, top: 6, transform: "rotate(3deg)", padding: "10px 20px", borderRadius: 10, background: AMBER, boxShadow: `0 0 24px ${AMBER}77` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 24, color: "#fff" }}>NARROW THE SCOPE</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker="UP ON PROOF · DOWN ON FAILURES" title="AUTONOMY IS A LADDER" titleSize={56} accent={CORAL} />
      </div>
    </SceneShell>
  );
};

// ── TWO MANAGERS — the ending: chaos manager buried in corrections vs the
// system manager beside five clean habit chips. ────────────────────────────
const TwoManagersScene: React.FC<{ durationInFrames: number; leftAt: number; rightAt: number; stampAt: number }> = ({ durationInFrames, leftAt, rightAt, stampAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stamp = spring({ frame: frame - stampAt, fps, config: { stiffness: 210, damping: 14, mass: 0.9 }, durationInFrames: 18 });
  const chips = ["BRIEF", "CHECK", "PROOF", "RULES", "LEVELS"];
  const fixCards = [0, 1, 2, 3, 4, 5];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xca} impacts={[leftAt, rightAt, stampAt]} tint={GREEN}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end" }}>
          {/* chaos manager */}
          <div style={{ position: "relative", width: 420, height: 320, opacity: frame >= leftAt ? 1 : 0 }}>
            {fixCards.map((i) => {
              const at = leftAt + 14 + i * 12;
              const drop = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 13 }, durationInFrames: 24 });
              if (frame < at) return null;
              return (
                <div key={i} style={{ position: "absolute", left: 30 + (i % 3) * 120 + (i % 2) * 18, top: interpolate(drop, [0, 1], [-60, 150 + (i % 2) * 34]), transform: `rotate(${(i % 2 ? 7 : -6) + i}deg)`, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.94)", border: `2px solid ${RED}`, boxShadow: "0 8px 20px rgba(31,30,29,0.2)" }}>
                  <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: RED }}>FIX IT AGAIN</span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%) scale(0.7)", transformOrigin: "bottom center" }}>
              <CartoonRobot pose={frame >= leftAt + 40 ? "facepalm" : "worried"} accent={RED} />
            </div>
            <span style={{ position: "absolute", left: "50%", bottom: -44, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: "rgba(31,30,29,0.6)", whiteSpace: "nowrap" }}>STILL CORRECTING EVERYTHING</span>
          </div>
          {/* system manager */}
          <div style={{ position: "relative", width: 460, height: 320, opacity: frame >= rightAt ? 1 : 0 }}>
            {chips.map((c, i) => {
              const at = rightAt + 12 + i * 10;
              const e = spring({ frame: frame - at, fps, config: { stiffness: 150, damping: 16 }, durationInFrames: 20 });
              if (frame < at) return null;
              return (
                <div key={c} style={{ position: "absolute", left: 6 + i * 88, top: 60, transform: `scale(${e}) rotate(${i % 2 ? 2 : -2}deg)`, padding: "8px 13px", borderRadius: 8, ...glassCard(GREEN + "cc", 2) }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 16, color: "#fff" }}>{c}</span>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%) scale(0.7)", transformOrigin: "bottom center" }}>
              <CartoonRobot pose={frame >= stampAt ? "celebrate" : "idle"} accent={GREEN} />
            </div>
            <span style={{ position: "absolute", left: "50%", bottom: -44, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: "rgba(31,30,29,0.6)", whiteSpace: "nowrap" }}>PROVEN WORK, LESS SUPERVISION</span>
          </div>
        </div>
        {frame >= stampAt && (
          <div style={{ transform: `rotate(-2deg) scale(${interpolate(stamp, [0, 1], [1.7, 1])})`, opacity: interpolate(stamp, [0, 0.3], [0, 1]), padding: "12px 30px", borderRadius: 12, background: CORAL, boxShadow: `0 0 34px ${CORAL}66`, marginTop: 26 }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, letterSpacing: 1, color: "#fff" }}>SAME HIRES · DIFFERENT SYSTEM</span>
          </div>
        )}
      </div>
    </SceneShell>
  );
};

// ── FILM CARD — the official Claude Code film as a play-framed montage card
// (never full-bleed raw; §10). ─────────────────────────────────────────────
const FilmCardScene: React.FC<{ durationInFrames: number; kicker: string; title: string; src: string; tint: string }> = ({ durationInFrames, kicker, title, src, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 22 });
  const cardW = 1120;
  const cardH = Math.round((cardW * 9) / 16);
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xcb} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <SceneHeadline kicker={kicker} title={title} titleSize={54} accent={tint} />
        <div style={{ position: "relative", width: cardW, height: cardH, borderRadius: 16, overflow: "hidden", border: `2px solid ${tint}`, boxShadow: "0 24px 60px rgba(31,30,29,0.28)", background: "#0e0d0c", transform: `scale(${interpolate(pop, [0, 1], [0.93, 1])})`, opacity: interpolate(pop, [0, 0.3], [0, 1]) }}>
          <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 10, background: "rgba(14,13,12,0.74)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#E03E36", boxShadow: "0 0 8px #E03E36" }} />
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, letterSpacing: 2, color: "#fff", transform: "translateZ(0)" }}>INTRODUCING CLAUDE CODE · OFFICIAL FILM</span>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

// ── BEATS (from ≈ spokenFrame − 6, whisper-pinned) ──────────────────────────
const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // HOOK
  { scene: "interns", from: 90, dur: 360, fullscreen: true }, // five hires, one vague sentence, collapse (10-380)
  { scene: "stopSearch", from: 660, dur: 220, fullscreen: true }, // "well stop — searching for a smarter model" (649-880)
  { scene: "oneRuleKinetic", from: 1150, dur: 140 }, // "one rule for deciding... earned more freedom" (1150-1290)
  { scene: "fiveChips", from: 1300, dur: 300, fullscreen: true }, // brief 1313 / checkpoint 1331 / evidence 1359 / correction 1383 / permission 1421
  // H1 · THE BRIEF (1480)
  { scene: "twoResults", from: 1621, dur: 370, fullscreen: true }, // same agent, different results (1627-1990)
  { scene: "ambiguous", from: 2110, dur: 450, fullscreen: true }, // "clean up this spreadsheet" → 4 readings (2117-2560)
  { scene: "drift", from: 2830, dur: 290, fullscreen: true }, // reasonable guess → whole task drifts (2837-3120)
  { scene: "clearDirectReceipt", from: 3125, dur: 470 }, // docs: clear/direct + capable-new-employee (3131-3595)
  { scene: "newHireTest", from: 3600, dur: 445, fullscreen: true }, // outcome 3688 / boundaries 3710 / proof 3741
  { scene: "briefList", from: 4050, dur: 430, fullscreen: true }, // dupes 4083 / standardise 4141 / preserve 4195 / flag 4362
  { scene: "lessGuessing", from: 4770, dur: 130 }, // "same agent... far less guessing" (~4790)
  { scene: "notSmarter", from: 4890, dur: 430, fullscreen: true }, // swap models / add tools / rewrite (4884-5320)
  { scene: "costume", from: 5540, dur: 220 }, // "weak management wearing a technical costume" (5558)
  { scene: "threeThings", from: 5790, dur: 510, fullscreen: true }, // finished 5805 / untouched 5872 / approval 5956
  // H2 · THE CHECKPOINT (6424)
  { scene: "planScanner", from: 6510, dur: 440, fullscreen: true }, // check the route before consequential actions (6523-6950)
  { scene: "agentsReceipt", from: 6954, dur: 246 }, // Building Effective Agents guidance (6960-7200)
  { scene: "ccFilm", from: 7204, dur: 260, fullscreen: true }, // Claude Code official film montage (7210+)
  { scene: "planModeReceipt", from: 7480, dur: 330 }, // permission-modes: the plan row (7480-7810)
  { scene: "soundsOrganised", from: 8180, dur: 150 }, // "the plan sounds organised" (~8200)
  { scene: "filesCollapse", from: 8430, dur: 370, fullscreen: true }, // files move 8456, references break 8564
  { scene: "cheapestKinetic", from: 8850, dur: 140 }, // "cheapest while it is still one sentence" (8860)
  { scene: "approvalNoise", from: 9110, dur: 160, fullscreen: true }, // noise trains you to ignore (9119-9270)
  { scene: "consequenceGate", from: 9270, dur: 430, fullscreen: true }, // internal draft 9362 / deleting records 9464
  { scene: "gradeKinetic", from: 9890, dur: 170 }, // "grading the reasoning" (9900)
  { scene: "readsWellKinetic", from: 10430, dur: 170 }, // "correct answer vs one that reads well" (~10500)
  // H3 · THE EVIDENCE (10603)
  { scene: "answerCard", from: 10930, dur: 360, fullscreen: true }, // polished answer... wrong row (10935-11280)
  { scene: "areYouSure", from: 11281, dur: 260, fullscreen: true }, // "are you sure" → confident again; ask for the source (11287-11540)
  { scene: "hallucReceipt", from: 11542, dur: 360 }, // reduce-hallucinations docs (11548-11900)
  { scene: "evidenceChain", from: 12280, dur: 620, fullscreen: true }, // subtotal 12569 → trace 12773
  { scene: "evidenceKinds", from: 12890, dur: 490, fullscreen: true }, // passage 12956 / steps 13095 / record 13194 — starts AFTER chain ends? overlap fix below
  { scene: "evidenceGate", from: 13700, dur: 320, fullscreen: true }, // unsupported stays outside the decision (13711-14010)
  { scene: "confidenceMeters", from: 14020, dur: 380, fullscreen: true }, // confidence crossed out, evidence moves (14014-14400)
  // H4 · THE CORRECTION (14714)
  { scene: "retryLoop", from: 14810, dur: 390, fullscreen: true }, // the same mistake returns (14821-15200)
  { scene: "memoryReceipt", from: 15460, dur: 440 }, // CLAUDE.md: same mistake a second time (15465-15900)
  { scene: "ruleCartridge", from: 16520, dur: 540, fullscreen: true }, // citation rule 16533 → next task 16714
  { scene: "manyToOne", from: 17320, dur: 420, fullscreen: true }, // doc-specific 17435 → operating rule 17600
  { scene: "ruleList", from: 17750, dur: 560, fullscreen: true }, // fields 17760 / citations 17951 / uncertainty 18116
  { scene: "lessonKinetic", from: 18560, dur: 180 }, // "paying for the same lesson" (~18580)
  // H5 · EARNED AUTONOMY (18988)
  { scene: "trustWall", from: 19120, dur: 440, fullscreen: true }, // one good run → bigger job crashes (19133-19560)
  { scene: "permReceipt", from: 19904, dur: 296 }, // permission modes table (19910-20200)
  { scene: "automodeReceipt", from: 20204, dur: 312 }, // Auto Mode graduated trust (20209-20520)
  { scene: "earnedRule", from: 20520, dur: 320 }, // THE EARNED AUTONOMY RULE (20526-20840)
  { scene: "ruleDefs", from: 20800, dur: 660, fullscreen: true }, // repeated 20814 / evidence-backed ~21000 / level 21250
  { scene: "oneRun", from: 21500, dur: 380, fullscreen: true }, // weekly report: every number correct — still one run (21479-21880)
  { scene: "oneDataPoint", from: 21890, dur: 150 }, // "one run = one data point" (keep-review 21884)
  { scene: "ladder", from: 22150, dur: 750, fullscreen: true }, // up 22299 / narrow 22516 / restore 22631
  { scene: "trailKinetic", from: 23170, dur: 230 }, // "autonomy should leave a trail of proof" (23180)
  // PAYOFF (23493)
  { scene: "recapChips", from: 23590, dur: 330, fullscreen: true }, // brief✓ 23610 / checkpoint✓ 23679 / evidence✓ 23738 / correction✓ 23797 / permission✓ 23858
  { scene: "twoManagers", from: 24010, dur: 690, fullscreen: true }, // one manager 24019 / other 24208 / months later 24513
  { scene: "actualFix", from: 24940, dur: 390 }, // "responsibility at the speed it proves" (24949-25330)
];

export const HABITS_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const HABITS_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const HABITS_EXTRA_CUTS = [3125, 6954, 7480, 11542, 15460, 19904, 20204, 20520, 24940];

export const HabitsVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {/* ===== HOOK ===== */}
        <Sequence from={90} durationInFrames={360} premountFor={30}>
          <InternsScene durationInFrames={360} briefAt={34} leaveAt={60} crashAt={165} />
        </Sequence>
        <Sequence from={660} durationInFrames={220} premountFor={30}>
          <MigrateStopScene durationInFrames={220} kicker="BEFORE YOU SWAP MODELS" title="STOP — IT'S A SYSTEM PROBLEM" stopAtFrame={40} tint={RED} />
        </Sequence>
        <Sequence from={1150} durationInFrames={140} premountFor={30}>
          <SceneShell durationInFrames={140} particleSeed={0xd1} tint={CORAL}>
            <KineticText text="WHEN HAS IT EARNED FREEDOM?" durationInFrames={140} highlight="EARNED" y={520} size={82} />
          </SceneShell>
        </Sequence>
        <Sequence from={1300} durationInFrames={300} premountFor={30}>
          <StickerChipsScene durationInFrames={300} kicker="THE WHOLE SYSTEM" title="FIVE HABITS, ONE ORDER" tint={CORAL} chips={[
            { label: "THE BRIEF", at: 13 },
            { label: "THE CHECKPOINT", at: 31 },
            { label: "THE EVIDENCE", at: 59 },
            { label: "THE CORRECTION", at: 83 },
            { label: "THE PERMISSION", at: 121 },
          ]} />
        </Sequence>

        {/* ===== H1 · THE BRIEF ===== */}
        <Sequence from={1621} durationInFrames={370} premountFor={30}>
          <ReactionsScene durationInFrames={370} kicker="SAME AGENT · SAME MODEL · SAME DATA" leftAt={60} rightAt={130} pointAt={270} leftBubble="perfect!" rightBubble="what is this?!" leftPose="celebrate" rightPose="confused" leftAccent={GREEN} rightAccent={RED} stamp="THE BRIEF DECIDES" stampColor={CORAL} tint={BLUE} />
        </Sequence>
        <Sequence from={2110} durationInFrames={450} premountFor={30}>
          <AmbiguousScene durationInFrames={450} readAts={[188, 223, 259, 284]} />
        </Sequence>
        <Sequence from={2830} durationInFrames={290} premountFor={30}>
          <SystemBreakScene durationInFrames={290} kicker="A REASONABLE GUESS, THEN…" title="THE WHOLE TASK DRIFTS" badges={[{ label: "GUESS #1", at: 30 }, { label: "STILL LOOKS LOGICAL", at: 110 }]} errorAt={150} tint={AMBER} />
        </Sequence>
        <Sequence from={3125} durationInFrames={470} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={470} kicker="CLAUDE DOCS · PROMPTING" title="BE CLEAR AND DIRECT" fullBleed={false} tint={CORAL} src={`${SHOT}/habits-clear-direct.png`} url="docs.claude.com" imageW={1800} imageH={800} cardW={1560} cardH={693} from={{ x: 0, y: 0, w: 1800, h: 800 }} to={{ x: 0, y: 0, w: 1800, h: 800 }} zoomAt={0} notes={[{ at: 216, rect: { x: 40, y: 280, w: 1720, h: 105 }, kind: "box" }]} />
        </Sequence>
        <Sequence from={3600} durationInFrames={445} premountFor={30}>
          <GatesScene durationInFrames={445} kicker="THE NEW-EMPLOYEE TEST" title="COULD A NEW HIRE RUN THIS?" gates={[{ label: "THE OUTCOME", at: 88 }, { label: "THE BOUNDARIES", at: 110 }, { label: "PROOF IT'S DONE", at: 141 }]} tint={GREEN} />
        </Sequence>
        <Sequence from={4050} durationInFrames={430} premountFor={30}>
          <ChipListScene durationInFrames={430} kicker="THE SAME SPREADSHEET, BRIEFED PROPERLY" title="NOW 'CLEAN' MEANS SOMETHING" tint={GREEN} color={GREEN} icon="check" items={[
            { label: "Remove exact duplicates", at: 33 },
            { label: "Standardise the phone formats", at: 91 },
            { label: "Preserve every customer ID", at: 145 },
            { label: "Flag uncertain matches first", at: 312 },
          ]} />
        </Sequence>
        <Sequence from={4770} durationInFrames={130} premountFor={30}>
          <SceneShell durationInFrames={130} particleSeed={0xd2} tint={GREEN}>
            <KineticText text="FAR LESS GUESSING" durationInFrames={130} highlight="GUESSING" y={520} size={96} />
          </SceneShell>
        </Sequence>
        <Sequence from={4890} durationInFrames={430} premountFor={30}>
          <NotMagicScene durationInFrames={430} kicker="THE BEGINNER REFLEX" title="A SMARTER MODEL WON'T SAVE A WEAK BRIEF" badges={[{ label: "SWAP MODELS", at: 40 }, { label: "ADD TOOLS", at: 100 }, { label: "REWRITE THE FLOW", at: 160 }]} tint={RED} />
        </Sequence>
        <Sequence from={5540} durationInFrames={220} premountFor={30}>
          <FinalTakeawayScene durationInFrames={220} kicker="MOST 'UNRELIABILITY' IS JUST" title="MANAGEMENT IN A COSTUME" stamp="A TECHNICAL ONE" stampAt={130} accent={AMBER} />
        </Sequence>
        <Sequence from={5790} durationInFrames={510} premountFor={30}>
          <ChipListScene durationInFrames={510} kicker="BEFORE THE FIRST PROMPT" title="DEFINE THREE THINGS" tint={AMBER} color={AMBER} icon="warn" items={[
            { label: "What does FINISHED look like?", at: 15 },
            { label: "What must stay UNTOUCHED?", at: 82 },
            { label: "Where is APPROVAL required?", at: 166 },
          ]} />
        </Sequence>

        {/* ===== H2 · THE CHECKPOINT ===== */}
        <Sequence from={6510} durationInFrames={440} premountFor={30}>
          <ScannerScene durationInFrames={440} kicker="AFTER THE PLAN, BEFORE THE DAMAGE" title="CHECK THE ROUTE" cardLabel="THE PLAN" archLabel="CHECKPOINT" tagLabel="ONE SENTENCE TO FIX" scanAt={182} tagAt={280} tint={BLUE} />
        </Sequence>
        <Sequence from={6954} durationInFrames={246} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={246} kicker="ANTHROPIC ENGINEERING" title="THEIR OWN PLAYBOOK" fullBleed={false} tint={BLUE} src={`${SHOT}/habits-agents-hero.png`} url="anthropic.com/engineering" imageW={2600} imageH={1050} cardW={1560} cardH={630} from={{ x: 0, y: 0, w: 2600, h: 1050 }} to={{ x: 0, y: 0, w: 2600, h: 1050 }} zoomAt={0} />
        </Sequence>
        <Sequence from={7204} durationInFrames={260} premountFor={30}>
          <FilmCardScene durationInFrames={260} kicker="PLAN MODE LIVES HERE" title="CLAUDE CODE, OFFICIALLY" src="assets/external/clips/habits-cc-montage.mp4" tint={CORAL} />
        </Sequence>
        <Sequence from={7480} durationInFrames={330} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={330} kicker="CLAUDE CODE DOCS" title="PLAN FIRST, TOUCH NOTHING" fullBleed={false} tint={BLUE} src={`${SHOT}/habits-permission-modes.png`} url="code.claude.com/docs" imageW={1680} imageH={2020} cardW={860} cardH={768} from={{ x: 0, y: 0, w: 1680, h: 1500 }} to={{ x: 0, y: 0, w: 1680, h: 1500 }} zoomAt={0} notes={[{ at: 40, rect: { x: 25, y: 1370, w: 1620, h: 92 }, kind: "box" }]} />
        </Sequence>
        <Sequence from={8180} durationInFrames={150} premountFor={30}>
          <SceneShell durationInFrames={150} particleSeed={0xd3} tint={AMBER}>
            <KineticText text="SOUNDS ORGANISED…" durationInFrames={150} highlight="SOUNDS" y={520} size={96} />
          </SceneShell>
        </Sequence>
        <Sequence from={8430} durationInFrames={370} premountFor={30}>
          <StackCollapseScene durationInFrames={370} kicker="HUNDREDS OF FILES MOVE" title="THEN THE REFERENCES BREAK" drops={[10, 40, 70]} labels={["COMPONENTS", "CONFIGS", "TESTS"]} collapseAt={134} tint={RED} />
        </Sequence>
        <Sequence from={8850} durationInFrames={140} premountFor={30}>
          <SceneShell durationInFrames={140} particleSeed={0xd4} tint={GREEN}>
            <KineticText text="CHEAPEST AS A SENTENCE" durationInFrames={140} highlight="CHEAPEST" y={520} size={88} />
          </SceneShell>
        </Sequence>
        <Sequence from={9110} durationInFrames={160} premountFor={30}>
          <BoredMattersScene durationInFrames={160} kicker="APPROVE · APPROVE · APPROVE — UNTIL YOU STOP READING" wakeAt={70} />
        </Sequence>
        <Sequence from={9270} durationInFrames={430} premountFor={30}>
          <ThresholdGateScene durationInFrames={430} kicker="CHECKPOINTS FOLLOW CONSEQUENCE" title="DRAFTS PASS · DELETES WAIT" failLabel="INTERNAL DRAFT" passLabel="DELETE RECORDS" zoneLabel="LIGHT REVIEW" skipStamp="TIGHT OVERSIGHT" dropAt={92} attempt2At={194} tint={AMBER} />
        </Sequence>
        <Sequence from={9890} durationInFrames={170} premountFor={30}>
          <SceneShell durationInFrames={170} particleSeed={0xd5} tint={BLUE}>
            <KineticText text="GRADE THE REASONING" durationInFrames={170} highlight="REASONING" y={520} size={92} />
          </SceneShell>
        </Sequence>
        <Sequence from={10430} durationInFrames={170} premountFor={30}>
          <SceneShell durationInFrames={170} particleSeed={0xd6} tint={RED}>
            <KineticText text="SOUNDS RIGHT ≠ IS RIGHT" durationInFrames={170} highlight="SOUNDS" y={520} size={88} />
          </SceneShell>
        </Sequence>

        {/* ===== H3 · THE EVIDENCE ===== */}
        <Sequence from={10930} durationInFrames={360} premountFor={30}>
          <AnswerCardScene durationInFrames={360} wrongAt={275} />
        </Sequence>
        <Sequence from={11281} durationInFrames={260} premountFor={30}>
          <ReactionsScene durationInFrames={260} kicker="'ARE YOU SURE?' GETS YOU CONFIDENCE" leftAt={30} rightAt={90} pointAt={157} leftBubble="are you sure?" rightBubble="definitely!" leftPose="thinking" rightPose="celebrate" leftAccent={BLUE} rightAccent={RED} stamp="ASK WHERE IT CAME FROM" stampColor={GREEN} tint={RED} />
        </Sequence>
        <Sequence from={11542} durationInFrames={360} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={360} kicker="CLAUDE DOCS · GUARDRAILS" title="GROUND IT IN SOURCES" fullBleed={false} tint={GREEN} src={`${SHOT}/habits-hallucinations.png`} url="platform.claude.com/docs" imageW={1810} imageH={1100} cardW={1400} cardH={851} from={{ x: 0, y: 0, w: 1810, h: 1100 }} to={{ x: 0, y: 0, w: 1810, h: 1100 }} zoomAt={0} notes={[{ at: 40, rect: { x: 30, y: 95, w: 1740, h: 135 }, kind: "box" }, { at: 160, rect: { x: 60, y: 730, w: 1700, h: 115 }, kind: "underline" }]} />
        </Sequence>
        <Sequence from={12280} durationInFrames={620} premountFor={30}>
          <EvidenceChainScene durationInFrames={620} wrongAt={289} traceAt={493} />
        </Sequence>
        <Sequence from={12940} durationInFrames={440} premountFor={30}>
          <ChipListScene durationInFrames={440} kicker="THE HABIT, BY TASK TYPE" title="ASK FOR THE TRAIL" tint={GREEN} color={GREEN} icon="arrow" items={[
            { label: "Documents → the supporting passage", at: 16 },
            { label: "Calculations → inputs + steps", at: 155 },
            { label: "Actions → the change record", at: 254 },
          ]} />
        </Sequence>
        <Sequence from={13700} durationInFrames={320} premountFor={30}>
          <EvidenceGateScene durationInFrames={320} bounceAt={60} passAt={170} />
        </Sequence>
        <Sequence from={14020} durationInFrames={380} premountFor={30}>
          <CheaperToServeScene durationInFrames={380} kicker="FEELING vs PROOF" title="EVIDENCE EARNS RESPONSIBILITY" leftLabel="CONFIDENCE" rightLabel="EVIDENCE" crossAt={80} serveAt={150} checkAt={280} tint={GREEN} />
        </Sequence>

        {/* ===== H4 · THE CORRECTION ===== */}
        <Sequence from={14810} durationInFrames={390} premountFor={30}>
          <RetryLoopScene durationInFrames={390} palmAt={200} />
        </Sequence>
        <Sequence from={15460} durationInFrames={440} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={440} kicker="CLAUDE CODE DOCS · MEMORY" title="SECOND MISTAKE → WRITE THE RULE" fullBleed={false} tint={CORAL} src={`${SHOT}/habits-memory.png`} url="code.claude.com/docs" imageW={1680} imageH={820} cardW={1500} cardH={732} from={{ x: 0, y: 0, w: 1680, h: 820 }} to={{ x: 0, y: 0, w: 1680, h: 820 }} zoomAt={0} notes={[{ at: 80, rect: { x: 40, y: 205, w: 1600, h: 90 }, kind: "box" }]} />
        </Sequence>
        <Sequence from={16520} durationInFrames={540} premountFor={30}>
          <SkillCartridgeScene durationInFrames={540} kicker="CORRECTION → STANDING INSTRUCTION" title="THE RULE LOADS EVERY RUN" cartridgeLabel="CLAUDE.md" slotAt={20} runAts={[194, 254, 314]} />
        </Sequence>
        <Sequence from={17320} durationInFrames={420} premountFor={30}>
          <DocFunnelScene durationInFrames={420} kicker="YESTERDAY'S FIXES, DISTILLED" title="MANY CORRECTIONS → ONE RULE" dropAts={[20, 48, 76, 104]} reportAt={280} reportLabel="ONE OPERATING RULE" priceLabel="EVERY FUTURE RUN" tint={CORAL} />
        </Sequence>
        <Sequence from={17750} durationInFrames={560} premountFor={30}>
          <ChipListScene durationInFrames={560} kicker="WRITE THEM BROAD ENOUGH" title="RULES, NOT PATCHES" tint={AMBER} color={AMBER} icon="arrow" items={[
            { label: "Protected fields → approval first", at: 10 },
            { label: "Citations → one fixed format", at: 201 },
            { label: "Uncertainty → stop and escalate", at: 366 },
          ]} />
        </Sequence>
        <Sequence from={18560} durationInFrames={180} premountFor={30}>
          <SceneShell durationInFrames={180} particleSeed={0xd7} tint={CORAL}>
            <KineticText text="PAY FOR THE LESSON ONCE" durationInFrames={180} highlight="ONCE" y={520} size={88} />
          </SceneShell>
        </Sequence>

        {/* ===== H5 · EARNED AUTONOMY ===== */}
        <Sequence from={19120} durationInFrames={440} premountFor={30}>
          <SpeedWallScene durationInFrames={440} kicker="ONE GOOD RUN → A MUCH BIGGER JOB" title="TRUST OUTRAN THE EVIDENCE" rocketLabel="ONE GOOD RUN" wallLabel="THE NEXT TASK" tint={RED} />
        </Sequence>
        <Sequence from={19904} durationInFrames={296} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={296} kicker="CLAUDE CODE DOCS" title="OVERSIGHT IS A DIAL" fullBleed={false} tint={BLUE} src={`${SHOT}/habits-permission-modes.png`} url="code.claude.com/docs" imageW={1680} imageH={2020} cardW={860} cardH={768} from={{ x: 0, y: 430, w: 1680, h: 1500 }} to={{ x: 0, y: 430, w: 1680, h: 1500 }} zoomAt={0} /></Sequence>
        <Sequence from={20204} durationInFrames={312} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={312} kicker="CLAUDE BLOG" title="GRADUATED TRUST, OFFICIALLY" fullBleed={false} tint={CORAL} src={`${SHOT}/habits-automode-hero.png`} url="claude.com/blog" imageW={2000} imageH={1050} cardW={1460} cardH={766} from={{ x: 0, y: 0, w: 2000, h: 1050 }} to={{ x: 0, y: 0, w: 2000, h: 1050 }} zoomAt={0} notes={[{ at: 60, rect: { x: 70, y: 380, w: 1500, h: 175 }, kind: "box" }]} />
        </Sequence>
        <Sequence from={20520} durationInFrames={320} premountFor={30}>
          <FinalTakeawayScene durationInFrames={320} kicker="CARRY THIS OUT OF THE VIDEO" title="THE EARNED AUTONOMY RULE" stamp="EXPAND ONLY AFTER PROOF" stampAt={80} accent={CORAL} />
        </Sequence>
        <Sequence from={20800} durationInFrames={660} premountFor={30}>
          <ChipListScene durationInFrames={660} kicker="THREE WORDS, THREE TESTS" title="WHAT 'EARNED' MEANS" tint={CORAL} color={CORAL} icon="check" items={[
            { label: "REPEATED — across varied runs", at: 24 },
            { label: "EVIDENCE-BACKED — outputs traced", at: 200 },
            { label: "AT THIS LEVEL — proven before more", at: 450 },
          ]} />
        </Sequence>
        <Sequence from={21500} durationInFrames={380} premountFor={30}>
          <SceneShell durationInFrames={380} particleSeed={0xd8} tint={GREEN}>
            <FinalTakeawayScene durationInFrames={380} kicker="THE WEEKLY REPORT WAS PERFECT" title="THAT'S STILL ONE RUN" stamp="KEEP THE CHECKPOINT" stampAt={230} accent={GREEN} />
          </SceneShell>
        </Sequence>
        <Sequence from={21890} durationInFrames={150} premountFor={30}>
          <SceneShell durationInFrames={150} particleSeed={0xd9} tint={BLUE}>
            <KineticText text="ONE RUN = ONE DATA POINT" durationInFrames={150} highlight="ONE" y={520} size={84} />
          </SceneShell>
        </Sequence>
        <Sequence from={22150} durationInFrames={750} premountFor={30}>
          <AutonomyLadderScene durationInFrames={750} upAt={149} downAt={481} />
        </Sequence>
        <Sequence from={23170} durationInFrames={230} premountFor={30}>
          <SceneShell durationInFrames={230} particleSeed={0xda} tint={CORAL}>
            <KineticText text="AUTONOMY LEAVES A TRAIL" durationInFrames={230} highlight="TRAIL" y={520} size={88} />
          </SceneShell>
        </Sequence>

        {/* ===== THE PAYOFF ===== */}
        <Sequence from={23590} durationInFrames={330} premountFor={30}>
          <StickerChipsScene durationInFrames={330} kicker="THE SYSTEM, PROVEN" title="PERMISSION FOLLOWS THE RECORD" checks tint={GREEN} chips={[
            { label: "BRIEF", at: 20 },
            { label: "CHECKPOINT", at: 89 },
            { label: "EVIDENCE", at: 148 },
            { label: "CORRECTION", at: 207 },
            { label: "PERMISSION", at: 268 },
          ]} />
        </Sequence>
        <Sequence from={24010} durationInFrames={690} premountFor={30}>
          <TwoManagersScene durationInFrames={690} leftAt={20} rightAt={198} stampAt={540} />
        </Sequence>
        <Sequence from={24940} durationInFrames={390} premountFor={30}>
          <FinalTakeawayScene durationInFrames={390} kicker="THE ACTUAL FIX" title="RESPONSIBILITY AT PROVEN SPEED" stamp="EARN IT, THEN EXPAND IT" stampAt={172} accent={CORAL} />
        </Sequence>

        {/* OUTRO — pinned to the spoken "subscribe" (25337) */}
        <Sequence from={25340} durationInFrames={HABITS_DUR - 25340} premountFor={30}>
          <Fable5Outro durationInFrames={HABITS_DUR - 25340} kicker="EVIDENCE-FIRST AI BREAKDOWNS, WEEKLY" tag="Next week: does this rule survive a more autonomous agent?" />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const HabitsVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <HabitsVisuals />

      {/* ===== MUSIC — beds over the peaks, caveat bed on the cautionary turns ===== */}
      <MusicController state="main" from={90} durationInFrames={1520} volume={0.075} duck={[{ from: 660, to: 880 }]} />
      <MusicController state="main" from={2110} durationInFrames={1500} volume={0.07} duck={[{ from: 3125, to: 3595 }]} />
      <MusicController state="caveat" from={4890} durationInFrames={1410} volume={0.055} />
      <MusicController state="main" from={7204} durationInFrames={1600} volume={0.07} duck={[{ from: 7480, to: 7810 }]} />
      <MusicController state="caveat" from={10930} durationInFrames={1500} volume={0.055} duck={[{ from: 11542, to: 11902 }]} />
      <MusicController state="main" from={14810} durationInFrames={1400} volume={0.07} duck={[{ from: 15460, to: 15900 }]} />
      <MusicController state="main" from={19120} durationInFrames={2400} volume={0.07} duck={[{ from: 19904, to: 20516 }]} />
      <MusicController state="main" from={23590} durationInFrames={HABITS_DUR - 23590} volume={0.075} />

      {/* ===== SFX — restrained: rotating entries, editkit accents on the peaks ===== */}
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.softWhoosh : pick(SFX_POOLS.entry, i)} volume={0.4} rate={vary(i)} />
      ))}
      {/* the three big hits: project down, references break, ladder step-down */}
      <SfxCue from={90 + 165} src={SFX.lowImpact} volume={0.45} />
      <SfxCue from={8430 + 134} src={SFX.boom} volume={0.32} />
      <SfxCue from={22150 + 481} src={SFX.lowImpact} volume={0.45} />
      {/* chapter turns */}
      {[1480, 6424, 10603, 14714, 18988, 23493].map((f) => (
        <SfxCue key={`ch-${f}`} from={f} src={SFX.transitionSweep} volume={0.36} />
      ))}
      {/* payoffs + warnings */}
      <SfxCue from={20520 + 80} src={SFX.confirmation} volume={0.42} />
      <SfxCue from={23590 + 268} src={SFX.confirmation} volume={0.42} />
      <SfxCue from={19120 + 88} src={SFX.warningPulse} volume={0.36} />
      <SfxCue from={24010 + 540} src={SFX.confirmation} volume={0.42} />
      <SfxCue from={25340} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
