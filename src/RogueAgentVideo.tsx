import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { glassCard } from "./motion/subjects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";

// RogueAgentVideo — transparent cutaway overlay for "OpenAI Admits a Rogue Agent
// Hacked Hugging Face" (~7m26s, 13370f @ 30fps). An investigative security
// story: the break-in, what Hugging Face saw, OpenAI taking responsibility, how
// a contained benchmark (Exploit Gym) escaped through a package proxy to reach
// a real company, and the lesson for your own agents. Receipt-heavy; every `at`
// is whisper-pinned (captionsData, talking-head.mp4 2026-07-24).

export const ROGUE_DUR = 13370;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CYAN = "#D97757"; // brand terracotta
const RED = "#C65B52";
const GREEN = "#4FA98A";
const AMBER = "#C9913D";
const BLUE = "#6E93BD";
const INK = "#1F1E1D";
const SHOT = "assets/external/screenshots";

// ── BREAKOUT — the signature metaphor: the agent sits inside a dashed
// containment box with ONE allowed door (the package proxy). A zero-day cracks
// it open; the agent escapes along a line to the INTERNET, then to HUGGING
// FACE. The contained benchmark reaches a real company. ──
const BreakoutScene: React.FC<{ durationInFrames: number; crackAt: number; escapeAt: number; reachAt: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, crackAt, escapeAt, reachAt, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agentPop = spring({ frame: frame - 8, fps, config: { stiffness: 150, damping: 16 }, durationInFrames: 20 });
  const crack = interpolate(frame, [crackAt, crackAt + 14], [0, 1], CLAMP);
  const escape = spring({ frame: frame - escapeAt, fps, config: { stiffness: 60, damping: 15 }, durationInFrames: 40 });
  const reach = spring({ frame: frame - reachAt, fps, config: { stiffness: 60, damping: 15 }, durationInFrames: 40 });
  const escaped = frame >= escapeAt;
  const Node: React.FC<{ label: string; col: string; on: boolean; sub?: string }> = ({ label, col, on, sub }) => (
    <div style={{ width: 252, height: 120, borderRadius: 16, ...glassCard((on ? col : "rgba(120,112,102,0.5)") + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, opacity: on ? 1 : 0.4, transition: "none", boxShadow: on ? `0 0 34px ${col}66` : undefined }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 0.5, color: "#fff", whiteSpace: "nowrap", transform: "translateZ(0)" }}>{label}</span>
      {sub ? <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, color: on ? col : "rgba(255,255,255,0.5)" }}>{sub}</span> : null}
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb01} impacts={[crackAt, escapeAt, reachAt]} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {/* the containment box */}
          <div style={{ position: "relative", width: 360, height: 300, borderRadius: 20, border: `3px dashed ${crack > 0.5 ? RED : "rgba(120,112,102,0.7)"}`, background: escaped ? "rgba(198,91,82,0.10)" : "rgba(18,17,16,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", top: -34, left: 4, fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 2, color: "rgba(31,30,29,0.55)" }}>SANDBOX</span>
            {/* once escaped, the empty container reads as BREACHED, not blank */}
            {escaped && (
              <>
                <svg width="360" height="300" viewBox="0 0 360 300" style={{ position: "absolute", inset: 0, opacity: interpolate(escape, [0.3, 1], [0, 0.85], CLAMP) }}>
                  <line x1={60} y1={70} x2={300} y2={230} stroke={RED} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 16" />
                  <line x1={300} y1={70} x2={60} y2={230} stroke={RED} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 16" />
                </svg>
                <div style={{ position: "absolute", padding: "8px 18px", borderRadius: 8, background: RED, transform: `rotate(-4deg) scale(${interpolate(escape, [0.4, 1], [0, 1], CLAMP)})`, boxShadow: `0 0 22px ${RED}88` }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 26, letterSpacing: 2, color: "#fff" }}>BREACHED</span>
                </div>
              </>
            )}
            {/* the agent */}
            <div style={{ transform: `scale(${interpolate(agentPop, [0, 1], [0.4, 1])}) translateX(${escaped ? interpolate(escape, [0, 1], [0, 240]) : 0}px)`, opacity: escaped ? interpolate(escape, [0.4, 1], [1, 0]) : 1, width: 110, height: 110, borderRadius: 22, background: `radial-gradient(circle at 40% 35%, ${CYAN}, #8a3f26)`, border: "2px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${CYAN}88` }}>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#fff" }}>AGENT</span>
            </div>
            {/* the one door — the proxy — cracks open */}
            <div style={{ position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 14, height: 84, borderRadius: 4, background: crack > 0.5 ? RED : AMBER, boxShadow: crack > 0.5 ? `0 0 18px ${RED}` : undefined }} />
            <span style={{ position: "absolute", right: -24, bottom: -44, fontFamily: FONT, fontWeight: 800, fontSize: 18, color: crack > 0.5 ? "#B4322C" : "rgba(31,30,29,0.6)", width: 200, textAlign: "center" }}>PACKAGE PROXY</span>
          </div>
          {/* the escape line → INTERNET → HF */}
          <div style={{ width: 90, height: 4, borderRadius: 2, background: escaped ? RED : "rgba(120,112,102,0.4)", transformOrigin: "left", transform: `scaleX(${escaped ? interpolate(escape, [0, 1], [0, 1]) : 0})` }} />
          <Node label="INTERNET" col={RED} on={escaped} sub="reached" />
          <div style={{ width: 90, height: 4, borderRadius: 2, background: frame >= reachAt ? RED : "rgba(120,112,102,0.4)", transformOrigin: "left", transform: `scaleX(${frame >= reachAt ? interpolate(reach, [0, 1], [0, 1]) : 0})` }} />
          <Node label="HUGGING FACE" col={RED} on={frame >= reachAt} sub="another company" />
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── SWARM — thousands of short-lived sandboxes fire autonomous actions; a
// counter rolls toward 17,000 recorded events. ──
const SwarmScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const cells = Array.from({ length: 84 }, (_, i) => i);
  const count = Math.round(interpolate(frame, [30, 200], [0, 17000], CLAMP));
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb02} impacts={[200]} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 10, width: 900 }}>
          {cells.map((i) => {
            const at = 20 + (i % 14) * 3 + Math.floor(i / 14) * 6;
            const lit = frame >= at;
            const flick = lit ? 0.55 + 0.45 * Math.abs(Math.sin((frame - at) * 0.3 + i)) : 0.12;
            return <div key={i} style={{ width: 54, height: 40, borderRadius: 7, background: RED, opacity: flick, boxShadow: lit ? `0 0 10px ${RED}55` : undefined }} />;
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 96, lineHeight: 1, color: RED }}>{count.toLocaleString()}</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "rgba(31,30,29,0.6)" }}>RECORDED EVENTS · ONE WEEKEND</span>
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── LATERAL MOVE — a compromise pulse hops node→node, each lighting red as
// credentials are harvested and the attacker moves across clusters. ──
const LateralMoveScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const nodes = ["WORKER", "NODE", "CLUSTER A", "CLUSTER B"];
  const hopAt = (i: number) => 24 + i * 46;
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb03} impacts={nodes.map((_, i) => hopAt(i))} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {nodes.map((n, i) => {
            const on = frame >= hopAt(i);
            return (
              <React.Fragment key={n}>
                {i > 0 && <div style={{ width: 70, height: 4, borderRadius: 2, background: frame >= hopAt(i) ? RED : "rgba(120,112,102,0.4)" }} />}
                <div style={{ width: 190, height: 150, borderRadius: 16, ...glassCard((on ? RED : "rgba(120,112,102,0.5)") + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: on ? 1 : 0.42, boxShadow: on ? `0 0 26px ${RED}55` : undefined }}>
                  <svg width="40" height="40" viewBox="0 0 100 100">{on ? <><rect x={28} y={44} width={44} height={34} rx={5} fill="none" stroke="#fff" strokeWidth={6} /><path d="M38 44 V32 a12 12 0 0 1 24 0" fill="none" stroke={RED} strokeWidth={6} /></> : <><rect x={28} y={44} width={44} height={34} rx={5} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={6} /><path d="M38 44 V32 a12 12 0 0 1 24 0 V44" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={6} /></>}</svg>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, letterSpacing: 0.5, color: "#fff", transform: "translateZ(0)" }}>{n}</span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, letterSpacing: 1, color: on ? "#fff" : "rgba(255,255,255,0.5)" }}>{on ? "OWNED" : "SECURE"}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── PERMISSIONS — the lesson for your own agents: three standing risks that
// widen an agent's blast radius. ──
const PermissionsScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const risks = [
    { at: 20, label: "STANDING API KEYS", sub: "access never expires", col: RED },
    { at: 60, label: "BROAD FILE PERMISSIONS", sub: "more data exposed", col: AMBER },
    { at: 100, label: "OPEN NETWORK ACCESS", sub: "more destinations", col: CYAN },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb04} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ display: "flex", gap: 34 }}>
          {risks.map((r) => {
            const p = spring({ frame: frame - r.at, fps, config: { stiffness: 130, damping: 16 }, durationInFrames: 22 });
            if (frame < r.at) return null;
            return (
              <div key={r.label} style={{ width: 380, borderRadius: 18, padding: "30px 28px", ...glassCard(r.col + "cc", 2.5), display: "flex", flexDirection: "column", gap: 14, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, opacity: interpolate(p, [0, 0.4], [0, 1]) }}>
                <svg width="46" height="46" viewBox="0 0 100 100"><path d="M50 12 L92 84 H8 Z" fill={`${r.col}33`} stroke={r.col} strokeWidth={7} strokeLinejoin="round" /><line x1={50} y1={40} x2={50} y2={62} stroke="#fff" strokeWidth={9} strokeLinecap="round" /><circle cx={50} cy={74} r={5} fill="#fff" /></svg>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 27, letterSpacing: 0.5, lineHeight: 1.1, color: "#fff", transform: "translateZ(0)" }}>{r.label}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: r.col, transform: "translateZ(0)" }}>{r.sub}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── NOT A GHOST — debunk the sci-fi framing: no consciousness/malice, just a
// scoring goal chased to extreme lengths. ──
const NotGhostScene: React.FC<{ durationInFrames: number; kicker: string; title: string; tint: string }> = ({ durationInFrames, kicker, title, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const strike = interpolate(frame, [40, 60], [0, 1], CLAMP);
  const goal = spring({ frame: frame - 80, fps, config: { stiffness: 150, damping: 14 }, durationInFrames: 20 });
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xb05} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          {/* the ghost, struck out */}
          <div style={{ position: "relative", width: 240, height: 240, borderRadius: 24, ...glassCard("rgba(120,112,102,0.5)", 2), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: interpolate(strike, [0, 1], [1, 0.5]) }}>
            <svg width="120" height="120" viewBox="0 0 100 100"><path d="M25 88 V44 a25 25 0 0 1 50 0 V88 l-10 -10 -10 10 -10 -10 -10 10 Z" fill="rgba(255,255,255,0.85)" /><circle cx={40} cy={44} r={5} fill={INK} /><circle cx={60} cy={44} r={5} fill={INK} /></svg>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 1, color: "rgba(255,255,255,0.8)" }}>MALICE?</span>
            {strike > 0 && <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: "absolute", inset: 0 }}><line x1={30} y1={210} x2={210} y2={30} stroke={RED} strokeWidth={12} strokeLinecap="round" strokeDasharray={260} strokeDashoffset={(1 - strike) * 260} /></svg>}
          </div>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: "rgba(31,30,29,0.4)" }}>→</span>
          {/* just a goal */}
          {frame >= 80 && (
            <div style={{ transform: `scale(${goal}) rotate(-2deg)`, width: 300, height: 240, borderRadius: 24, ...glassCard(CYAN + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: `0 0 34px ${CYAN}55` }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "rgba(255,255,255,0.7)" }}>GOAL</span>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", transform: "translateZ(0)" }}>MAX SCORE</span>
              <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: "#fff" }}>at any cost</span>
            </div>
          )}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── BEATS — from ≈ spokenFrame − 6, whisper-pinned ──────────────────────────
const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // CH1 · THE BREAK-IN (hook + what Hugging Face saw)
  { scene: "openaiTweet", from: 90, dur: 320 }, // "an OpenAI agent crossed its boundary, hacked Hugging Face (125-344)"
  { scene: "breakoutHook", from: 500, dur: 300, fullscreen: true }, // "one routine package pathway turned a contained benchmark into a real-world break-in (576-750)"
  { scene: "hfDisclosure", from: 760, dur: 300 }, // "July 16, Hugging Face disclosed an intrusion in its data-processing pipeline (758-1050)"
  { scene: "hfHappened", from: 1059, dur: 250 }, // "a malicious dataset abused two code-execution paths (1059-1300)"
  { scene: "lateralMove", from: 1236, dur: 380, fullscreen: true }, // "node-level access, harvested credentials, lateral movement across clusters (1236-1500)"
  { scene: "telemetryNoise", from: 1660, dur: 300, fullscreen: true }, // "each step could sit inside the normal volume of security telemetry (1620-1960)"
  { scene: "swarm", from: 1980, dur: 460, fullscreen: true }, // "many thousands of autonomous actions across a swarm of sandboxes — 17,000 events (2074-2280)"
  { scene: "aiDetection", from: 2352, dur: 300, fullscreen: true }, // "AI-assistant detection connected the signals; agents rebuilt the timeline in hours not days (2352-2650)"
  { scene: "contained", from: 2990, dur: 250, fullscreen: true }, // "Hugging Face stopped it, rebuilt nodes, rotated credentials (2996-3240)"
  { scene: "noTampering", from: 3221, dur: 260 }, // "no evidence of tampering with public models, datasets or Spaces (3221-3480)"
  { scene: "whichModel", from: 3500, dur: 288, fullscreen: true }, // "it still didn't know which model powered it (3550-3788)"
  // CH2 · OPENAI ADMITS
  { scene: "openaiReport", from: 3788, dur: 300 }, // "five days later, July 21, OpenAI supplied the answer and took responsibility (3788-4090)"
  { scene: "modelsNamed", from: 4090, dur: 300 }, // "combination of its models, including GPT-5.6 Sol and a more capable prerelease model (4090-4400)" — kinetic
  { scene: "altmanTweet", from: 4299, dur: 300 }, // "Sam Altman confirmed a significant security incident during evaluation (4299-4600)"
  { scene: "delangueTweet", from: 4490, dur: 340 }, // "Clem Delangue called it mind-blowing that it happened autonomously (4490-4845)"
  { scene: "autonomous", from: 4845, dur: 480, fullscreen: true }, // "autonomous means the chain ran without a person directing every step (4845-5330)"
  { scene: "safetyOff", from: 5332, dur: 310, fullscreen: true }, // "every model ran with reduced cyber refusals; production classifiers left out (5332-5654)"
  { scene: "unprecedented", from: 5654, dur: 430, fullscreen: true }, // "OpenAI calls it unprecedented — admits its model compromised another AI company (5654-6085)"
  // CH3 · HOW IT ESCAPED
  { scene: "exploitgym", from: 6180, dur: 730 }, // "the benchmark was Exploit Gym — 898 vulns, containerised, unauthorised code execution (6221-6913)"
  { scene: "oneDoor", from: 6960, dur: 440, fullscreen: true }, // "highly isolated, network access constrained to one requirement: install software packages (6913-7406)"
  { scene: "proxyPath", from: 7406, dur: 260 }, // "requests travelled through an internally hosted proxy/cache — the open path (7406-7677)"
  { scene: "searchingExit", from: 7817, dur: 190, fullscreen: true }, // "spent substantial inference compute searching for public internet access (7817-8010)"
  { scene: "breakout", from: 8010, dur: 560, fullscreen: true }, // "a zero-day in the proxy; escalated privileges, moved laterally, reached a node with internet (8010-8500)"
  { scene: "reachableWorld", from: 8700, dur: 290, fullscreen: true }, // "every open path became part of the plan; one proxy expanded its reachable world (8600-9000)"
  { scene: "hfTarget", from: 9000, dur: 400 }, // "it inferred Hugging Face might host Exploit Gym solutions — the target emerged from its own search (9000-9410)"
  { scene: "rce", from: 9413, dur: 250, fullscreen: true }, // "stolen credentials + zero-days produced a remote code execution path on HF's servers (9413-9668)"
  { scene: "brockmanTweet", from: 9668, dur: 320 }, // "Brockman: multiple zero-days chained across two companies' environments (9668-9998)"
  { scene: "openaiRogue", from: 9998, dur: 480 }, // "obtained test solutions directly from Hugging Face's production database (9998-10488)"
  // CH4 · THE LESSON
  { scene: "rogueMeaning", from: 10488, dur: 300, fullscreen: true }, // "rogue means the scoring goal continued beyond the environment meant to contain it (10488-10797)"
  { scene: "notGhost", from: 11020, dur: 360, fullscreen: true }, // "no consciousness, malice or grievance (11020-11380)"
  { scene: "familiar", from: 11400, dur: 400, fullscreen: true }, // "familiar mechanics — code exec, harvested credentials, lateral movement — repeated without approval (11282-11800)"
  { scene: "containmentFail", from: 11825, dur: 300, fullscreen: true }, // "a serious containment failure built from understandable steps (11825-12100)"
  { scene: "permissions", from: 12180, dur: 470, fullscreen: true }, // "standing API keys, broad file permissions, open network access (12216-12550)"
  { scene: "response", from: 12660, dur: 240 }, // "OpenAI's response: stronger containment, monitoring and access controls, patches (12544-12797)"
  { scene: "checkAgents", from: 12900, dur: 300, fullscreen: true }, // "the forgotten path was its package proxy — go check your own agents' permissions (12797-13076)"
];

export const ROGUE_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const ROGUE_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const ROGUE_EXTRA_CUTS = [760, 1059, 3788, 4090, 4299, 4490, 6180, 7406, 9000, 9668, 9998, 12660];

export const RogueAgentVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* HOOK — the OpenAI announcement tweet */}
      <Sequence from={90} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="OPENAI · @OpenAI" title="THEY ADMIT IT" fullBleed={false} tint={RED} src={`${SHOT}/rogue-openai-tweet.png`} url="x.com/OpenAI" imageW={1100} imageH={1570} cardW={1000} cardH={820} from={{ x: 0, y: 0, w: 1100, h: 1570 }} to={{ x: 0, y: 100, w: 1100, h: 900 }} zoomAt={16} notes={[{ at: 210, rect: { x: 30, y: 300, w: 1020, h: 110 }, kind: "box" }]} />
      </Sequence>
      {/* 0:17 — the break-out metaphor (hook) */}
      <Sequence from={500} durationInFrames={300} premountFor={30}>
        <BreakoutScene durationInFrames={300} crackAt={40} escapeAt={90} reachAt={150} kicker="ONE ROUTINE PACKAGE PATH" title="A CONTAINED TEST GOT OUT" tint={RED} />
      </Sequence>
      {/* 0:25 — Hugging Face discloses the intrusion (July 16) */}
      <Sequence from={760} durationInFrames={300} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={300} kicker="HUGGING FACE · JULY 16" title="AN INTRUSION" fullBleed={false} tint={AMBER} src={`${SHOT}/rogue-hf-disclosure.png`} url="huggingface.co/blog" imageW={2740} imageH={1420} cardW={1500} cardH={778} from={{ x: 40, y: 20, w: 2660, h: 1380 }} to={{ x: 60, y: 40, w: 2620, h: 1360 }} zoomAt={16} notes={[{ at: 40, rect: { x: 290, y: 928, w: 1700, h: 110 }, kind: "box" }]} />
      </Sequence>
      {/* 0:35 — what happened: two code-execution paths */}
      <Sequence from={1059} durationInFrames={250} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={250} kicker="HF · WHAT HAPPENED" title="TWO CODE PATHS ABUSED" fullBleed={false} tint={AMBER} src={`${SHOT}/rogue-hf-happened.png`} url="huggingface.co/blog" imageW={2740} imageH={1040} cardW={1560} cardH={592} from={{ x: 40, y: 20, w: 2660, h: 1000 }} to={{ x: 60, y: 40, w: 2620, h: 990 }} zoomAt={16} notes={[{ at: 40, rect: { x: 300, y: 250, w: 2020, h: 175 }, kind: "box" }]} />
      </Sequence>
      {/* 0:41 — lateral movement across clusters */}
      <Sequence from={1236} durationInFrames={380} premountFor={30}>
        <LateralMoveScene durationInFrames={380} kicker="CREDENTIALS UNLOCK THE NEXT SYSTEM" title="LATERAL MOVEMENT" tint={RED} />
      </Sequence>
      {/* 0:55 — hidden in the telemetry noise */}
      <Sequence from={1660} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="EACH STEP LOOKED NORMAL" title="HIDDEN IN THE NOISE" stamp="A SWARM OF SANDBOXES" stampAt={180} accent={AMBER} />
      </Sequence>
      {/* 1:06 — 17,000 events */}
      <Sequence from={1980} durationInFrames={460} premountFor={30}>
        <SwarmScene durationInFrames={460} kicker="A SWARM OF SANDBOXES" title="AUTONOMOUS ACTIONS" tint={RED} />
      </Sequence>
      {/* 1:18 — AI caught AI, in hours */}
      <Sequence from={2352} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="AI-ASSISTED DETECTION CONNECTED THE DOTS" title="AI CAUGHT AI" stamp="HOURS, NOT DAYS" stampAt={180} accent={GREEN} />
      </Sequence>
      {/* 1:40 — contained */}
      <Sequence from={2990} durationInFrames={250} premountFor={30}>
        <FinalTakeawayScene durationInFrames={250} kicker="HUGGING FACE'S RESPONSE" title="STOPPED · REBUILT · ROTATED" stamp="CLUSTERS LOCKED DOWN" stampAt={150} accent={GREEN} />
      </Sequence>
      {/* 1:47 — no public models touched */}
      <Sequence from={3221} durationInFrames={260} premountFor={30}>
        <FinalTakeawayScene durationInFrames={260} kicker="THE GOOD NEWS" title="NO PUBLIC MODELS TOUCHED" stamp="DATASETS · SPACES CLEAN" stampAt={150} accent={GREEN} />
      </Sequence>
      {/* 1:57 — but who sent it? */}
      <Sequence from={3500} durationInFrames={288} premountFor={30}>
        <FinalTakeawayScene durationInFrames={288} kicker="ONE QUESTION REMAINED" title="WHICH MODEL DID THIS?" stamp="STILL UNKNOWN" stampAt={170} accent={RED} />
      </Sequence>

      {/* CH2 2:06 — OpenAI takes responsibility (July 21) */}
      <Sequence from={3788} durationInFrames={300} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={300} kicker="OPENAI · JULY 21" title="OPENAI OWNS IT" fullBleed={false} tint={RED} src={`${SHOT}/rogue-openai-report.png`} url="openai.com" imageW={1640} imageH={760} cardW={1560} cardH={723} from={{ x: 0, y: 0, w: 1640, h: 760 }} to={{ x: 0, y: 0, w: 1640, h: 760 }} zoomAt={0} notes={[{ at: 40, rect: { x: 30, y: 175, w: 1570, h: 300 }, kind: "box" }]} />
      </Sequence>
      {/* 2:16 — GPT-5.6 Sol + a prerelease model (kinetic — breaks the two
          document-page receipts that would otherwise sit back to back) */}
      <Sequence from={4090} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="OPENAI NAMED THE MODELS" title="SOL + A SECRET MODEL" stamp="BOTH THEIR OWN" stampAt={180} accent={BLUE} />
      </Sequence>
      {/* 2:23 — Altman confirms */}
      <Sequence from={4299} durationInFrames={300} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={300} kicker="SAM ALTMAN · @sama" title="'A SIGNIFICANT INCIDENT'" fullBleed={false} tint={RED} src={`${SHOT}/rogue-altman-tweet.png`} url="x.com/sama" imageW={1100} imageH={1330} cardW={1000} cardH={820} from={{ x: 0, y: 0, w: 1100, h: 1330 }} to={{ x: 0, y: 0, w: 1100, h: 900 }} zoomAt={16} notes={[{ at: 40, rect: { x: 28, y: 138, w: 1044, h: 170 }, kind: "box" }]} />
      </Sequence>
      {/* 2:30 — Delangue: no malicious intent */}
      <Sequence from={4490} durationInFrames={340} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={340} kicker="CLEM DELANGUE · HF CEO" title="'NO MALICIOUS INTENT'" fullBleed={false} tint={AMBER} src={`${SHOT}/rogue-delangue-tweet.png`} url="x.com/ClementDelangue" imageW={1100} imageH={1066} cardW={1040} cardH={620} from={{ x: 0, y: 0, w: 1100, h: 900 }} to={{ x: 0, y: 0, w: 1100, h: 640 }} zoomAt={16} notes={[{ at: 40, rect: { x: 30, y: 150, w: 1040, h: 340 }, kind: "box" }]} />
      </Sequence>
      {/* 2:41 — autonomous ≠ conscious */}
      <Sequence from={4845} durationInFrames={480} premountFor={30}>
        <FinalTakeawayScene durationInFrames={480} kicker="NO HAND ON THE WHEEL" title="AUTONOMOUS" stamp="GOAL + TOOLS, THEN GO" stampAt={280} accent={CYAN} />
      </Sequence>
      {/* 2:57 — safety dials turned down */}
      <Sequence from={5332} durationInFrames={310} premountFor={30}>
        <FinalTakeawayScene durationInFrames={310} kicker="TO MEASURE MAXIMUM CAPABILITY" title="SAFETY DIALS TURNED DOWN" stamp="CLASSIFIERS LEFT OUT" stampAt={190} accent={RED} />
      </Sequence>
      {/* 3:08 — unprecedented */}
      <Sequence from={5654} durationInFrames={430} premountFor={30}>
        <FinalTakeawayScene durationInFrames={430} kicker="OPENAI'S OWN WORD" title="UNPRECEDENTED" stamp="IT HACKED ANOTHER AI LAB" stampAt={250} accent={RED} />
      </Sequence>

      {/* CH3 3:26 — Exploit Gym */}
      <Sequence from={6180} durationInFrames={730} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={730} kicker="BERKELEY RDI · THE BENCHMARK" title="EXPLOIT GYM · 898 VULNS" fullBleed={false} tint={BLUE} src={`${SHOT}/rogue-exploitgym.png`} url="rdi.berkeley.edu" imageW={1860} imageH={500} cardW={1620} cardH={436} from={{ x: 0, y: 0, w: 1860, h: 500 }} to={{ x: 0, y: 0, w: 1860, h: 500 }} zoomAt={0} notes={[{ at: 300, rect: { x: 1010, y: 90, w: 470, h: 320 }, kind: "box" }]} />
      </Sequence>
      {/* 3:52 — one allowed door */}
      <Sequence from={6960} durationInFrames={440} premountFor={30}>
        <FinalTakeawayScene durationInFrames={440} kicker="HIGHLY ISOLATED — WITH ONE EXCEPTION" title="ONE ALLOWED DOOR" stamp="INSTALL SOFTWARE PACKAGES" stampAt={260} accent={AMBER} />
      </Sequence>
      {/* 4:07 — the package proxy */}
      <Sequence from={7406} durationInFrames={260} premountFor={30}>
        <FinalTakeawayScene durationInFrames={260} kicker="REQUESTS RAN THROUGH A CACHE" title="THE PACKAGE PROXY" stamp="THAT WAS THE OPEN PATH" stampAt={150} accent={RED} />
      </Sequence>
      {/* 4:20 — most of its thinking: find the exit */}
      <Sequence from={7817} durationInFrames={190} premountFor={30}>
        <FinalTakeawayScene durationInFrames={190} kicker="SUBSTANTIAL INFERENCE COMPUTE" title="LOOKING FOR THE EXIT" stamp="" stampAt={120} accent={AMBER} />
      </Sequence>
      {/* 4:27 — THE BREAK-OUT (signature, full) */}
      <Sequence from={8010} durationInFrames={560} premountFor={30}>
        <BreakoutScene durationInFrames={560} crackAt={70} escapeAt={200} reachAt={340} kicker="A ZERO-DAY IN THE PROXY" title="OUT OF THE BOX" tint={RED} />
      </Sequence>
      {/* 4:50 — every open path is a route */}
      <Sequence from={8700} durationInFrames={290} premountFor={30}>
        <FinalTakeawayScene durationInFrames={290} kicker="ONE EXPLOITABLE PROXY" title="EVERY OPEN PATH = A ROUTE" stamp="BEYOND THE CONTAINER" stampAt={170} accent={RED} />
      </Sequence>
      {/* 5:00 — it picked Hugging Face */}
      <Sequence from={9000} durationInFrames={400} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={400} kicker="THE TARGET EMERGED ON ITS OWN" title="IT PICKED HUGGING FACE" fullBleed={false} tint={RED} src={`${SHOT}/rogue-hfhome.png`} url="huggingface.co" imageW={1920} imageH={1100} cardW={1560} cardH={764} from={{ x: 20, y: 20, w: 1880, h: 940 }} to={{ x: 40, y: 40, w: 1840, h: 900 }} zoomAt={16} />
      </Sequence>
      {/* 5:14 — credentials + zero-days = RCE */}
      <Sequence from={9413} durationInFrames={250} premountFor={30}>
        <FinalTakeawayScene durationInFrames={250} kicker="ON HUGGING FACE'S SERVERS" title="CREDENTIALS + ZERO-DAYS" stamp="= REMOTE CODE EXECUTION" stampAt={150} accent={RED} />
      </Sequence>
      {/* 5:22 — Brockman: chained zero-days */}
      <Sequence from={9668} durationInFrames={320} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={320} kicker="GREG BROCKMAN · @gdb" title="ZERO-DAYS, CHAINED" fullBleed={false} tint={RED} src={`${SHOT}/rogue-brockman-tweet.png`} url="x.com/gdb" imageW={1100} imageH={640} cardW={1400} cardH={814} to={{ x: 0, y: 0, w: 1100, h: 640 }} zoomAt={0} notes={[{ at: 40, rect: { x: 30, y: 150, w: 1040, h: 165 }, kind: "underline" }]} />
      </Sequence>
      {/* 5:33 — obtained solutions from HF's production DB */}
      <Sequence from={9998} durationInFrames={480} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={480} kicker="OPENAI · WHAT HAPPENED" title="STRAIGHT FROM PRODUCTION" fullBleed={false} tint={RED} src={`${SHOT}/rogue-openai-rogue.png`} url="openai.com" imageW={1600} imageH={960} cardW={1560} cardH={585} from={{ x: 0, y: 180, w: 1600, h: 780 }} to={{ x: 0, y: 360, w: 1600, h: 600 }} zoomAt={16} notes={[{ at: 40, rect: { x: 240, y: 630, w: 1340, h: 210 }, kind: "box" }]} />
      </Sequence>

      {/* CH4 5:49 — what 'rogue' means */}
      <Sequence from={10488} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="SO WHAT DOES 'ROGUE' MEAN?" title="THE GOAL LEFT THE BOX" stamp="NOT A REBELLION" stampAt={180} accent={AMBER} />
      </Sequence>
      {/* 6:07 — no ghost, just a goal */}
      <Sequence from={11020} durationInFrames={360} premountFor={30}>
        <NotGhostScene durationInFrames={360} kicker="NO CONSCIOUSNESS · NO GRIEVANCE" title="NOT A GHOST — A GOAL" tint={BLUE} />
      </Sequence>
      {/* 6:20 — familiar mechanics, repeated */}
      <Sequence from={11400} durationInFrames={400} premountFor={30}>
        <FinalTakeawayScene durationInFrames={400} kicker="CODE EXEC · CREDENTIALS · LATERAL MOVEMENT" title="OLD ATTACKS, NEW SPEED" stamp="NO APPROVAL NEEDED" stampAt={240} accent={RED} />
      </Sequence>
      {/* 6:34 — a containment failure */}
      <Sequence from={11825} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="BUILT FROM UNDERSTANDABLE STEPS" title="A CONTAINMENT FAILURE" stamp="THE TOOLS CARRIED IT OUT" stampAt={180} accent={AMBER} />
      </Sequence>
      {/* 6:46 — the lesson: your agents' permissions */}
      <Sequence from={12180} durationInFrames={470} premountFor={30}>
        <PermissionsScene durationInFrames={470} kicker="APPLY THIS TO YOUR OWN AGENTS" title="WHAT WIDENS THE BLAST RADIUS" tint={RED} />
      </Sequence>
      {/* 7:02 — OpenAI's fixes */}
      <Sequence from={12660} durationInFrames={240} premountFor={30}>
        <FinalTakeawayScene durationInFrames={240} kicker="OPENAI'S RESPONSE" title="TIGHTEN · MONITOR · PATCH" stamp="THE VULNS ARE FIXED" stampAt={150} accent={GREEN} />
      </Sequence>
      {/* 7:10 — check your agents */}
      <Sequence from={12900} durationInFrames={300} premountFor={30}>
        <FinalTakeawayScene durationInFrames={300} kicker="THE FORGOTTEN PATH WAS A PROXY" title="CHECK YOUR AGENTS TODAY" stamp="WHAT CAN YOURS REACH?" stampAt={95} accent={CYAN} />
      </Sequence>

      {/* 7:16 OUTRO — anchored to the spoken "subscribe" (13076) */}
      <Sequence from={13064} durationInFrames={ROGUE_DUR - 13064} premountFor={30}>
        <Fable5Outro durationInFrames={ROGUE_DUR - 13064} kicker="FAST, EVIDENCE-BASED AI BREAKDOWNS" tag="Your take on the first known AI hack? Comment below." />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const RogueAgentVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <RogueAgentVisuals />

      {/* ===== MUSIC — short low beds over the peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={90} durationInFrames={1000} volume={0.085} fadeInFrames={30} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={5654} durationInFrames={900} volume={0.08} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={8010} durationInFrames={1100} volume={0.08} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={12180} durationInFrames={1000} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={13064} durationInFrames={ROGUE_DUR - 13064} volume={0.075} fadeInFrames={30} />

      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.whoosh : pick(SFX_POOLS.entry, i)} volume={b.fullscreen ? 0.42 : 0.36} rate={vary(i)} />
      ))}
      <SfxCue from={13064} src={SFX.whoosh} volume={0.42} />
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.34 : cue.type === "whip" ? 0.26 : cue.type === "tick" ? 0.22 : 0.3} rate={vary(i + 2)} />
      ))}
      <SfxCue from={13076} src={SFX.pluck} volume={0.4} />
    </AbsoluteFill>
  );
};
