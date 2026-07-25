import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, SFX_POOLS, pick, vary } from "./components/Sfx";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { SceneShell, SceneHeadline } from "./scenes/SceneShell";
import { glassCard } from "./motion/subjects";
import { FONT, SERIF } from "./components/overlayUI";
import { ThemeProvider } from "./theme";
import {
  KineticText, ModelComparison, PriceComparison, EffortSelector, DecisionFramework,
  BenchmarkBar, MusicController, PALETTE,
} from "./motion/editkit";
import { ChartData } from "./motion/charts";

// Opus5Video — the transparent cutaway overlay for "Anthropic released Claude
// Opus 5" (~10m02s, 18069f @ 30fps). The FIRST real use of the model-review
// edit kit (CLAUDE.md §15): restrained editorial edit, direct cuts by default,
// editkit comparison graphics + b-roll receipts, whisper-pinned to the SRT.
// Chapters: The Claim / What It Is / The Benchmarks / The Catch / Safety / The
// Verdict. Every benchmark number is EXACT from the transcript; internal evals
// are labelled internal, Artificial Analysis is the independent check.

export const OPUS5_DUR = 18069;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OPUS = PALETTE.opus; // #D97757 terracotta
const FABLE = PALETTE.fable; // #8A7CA8 muted purple
const SONNET = PALETTE.sonnet; // #6E93BD slate blue
const GREEN = PALETTE.win;
const AMBER = PALETTE.cost;
const RED = PALETTE.danger;
const SHOT = "assets/external/screenshots";

// ── benchmark charts (EXACT transcript numbers; Anthropic internal evals) ──
const internal = { name: "Anthropic — internal evals", url: "anthropic.com" };
const SWE: ChartData = { title: "SWE-bench Pro", unit: "%", source: internal, data: [{ label: "Opus 5", value: 79.2 }, { label: "Fable 5", value: 80.0 }, { label: "Opus 4.8", value: 69.2 }] };
const FRONTIER: ChartData = { title: "FrontierBench", unit: "%", source: internal, data: [{ label: "Opus 5", value: 43.3 }, { label: "Fable 5", value: 33.7 }, { label: "Opus 4.8", value: 18.7 }, { label: "GPT-5.6 Sol", value: 37.5 }] };
const OSWORLD: ChartData = { title: "OSWorld 2.0", unit: "%", source: internal, data: [{ label: "Opus 5", value: 70.6 }, { label: "Fable 5", value: 66.1 }, { label: "GPT-5.6 Sol", value: 62.6 }] };
const PROGRAM: ChartData = { title: "ProgramBench", unit: "%", source: internal, data: [{ label: "Opus 5 · 5 tries", value: 93 }, { label: "Fable 5 · 5 tries", value: 93 }, { label: "Opus 5 · 1st try", value: 83 }] };
const AUTO: ChartData = { title: "AutomationBench", unit: "%", source: internal, data: [{ label: "Max effort", value: 26 }, { label: "Medium effort", value: 24 }] };

// ── custom inline scenes ────────────────────────────────────────────────────

// three headline specs (1M context / 128k output / adaptive thinking)
const SpecsRow: React.FC<{ durationInFrames: number; tint: string }> = ({ durationInFrames, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const specs = [
    { big: "1M", label: "token context" },
    { big: "128K", label: "max output" },
    { big: "AUTO", label: "adaptive thinking" },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa1} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
        <div style={{ display: "flex", gap: 30 }}>
          {specs.map((s, i) => {
            const at = 8 + i * 12;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
            return (
              <div key={s.label} style={{ width: 360, padding: "40px 28px", borderRadius: 18, ...glassCard(OPUS + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 84, lineHeight: 1, color: "#fff", transform: "translateZ(0)" }}>{s.big}</span>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 1, color: OPUS, transform: "translateZ(0)" }}>{s.label}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="THE SPEC SHEET" title="BUILT LIKE A FLAGSHIP" titleSize={58} accent={tint} />
      </div>
    </SceneShell>
  );
};

// a caveat checklist (max effort / 5 trials / own harnesses / prerelease)
const ChecklistScene: React.FC<{ durationInFrames: number; kicker: string; title: string; items: string[]; tint: string }> = ({ durationInFrames, kicker, title, items, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa2} tint={tint} mood="danger">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 900 }}>
          {items.map((it, i) => {
            const at = 10 + i * 16;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 130, damping: 17 }, durationInFrames: 22 });
            return (
              <div key={it} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 26px", borderRadius: 14, ...glassCard(AMBER + "cc", 2), transform: `translateX(${interpolate(e, [0, 1], [-30, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <svg width="34" height="34" viewBox="0 0 100 100"><path d="M50 12 L92 84 H8 Z" fill={`${AMBER}33`} stroke={AMBER} strokeWidth={8} strokeLinejoin="round" /><line x1={50} y1={40} x2={50} y2={60} stroke="#fff" strokeWidth={9} strokeLinecap="round" /><circle cx={50} cy={73} r={5} fill="#fff" /></svg>
                <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#fff", transform: "translateZ(0)" }}>{it}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker={kicker} title={title} titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// safety routing — find vulns ✓ allowed, pentest/exploits ✗ blocked → Opus 4.8
const SafetyRouting: React.FC<{ durationInFrames: number; tint: string }> = ({ durationInFrames, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const okE = spring({ frame: frame - 12, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
  const noE = spring({ frame: frame - 40, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
  const routeE = spring({ frame: frame - 74, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 26 });
  const Card: React.FC<{ e: number; col: string; title: string; sub: string; ok: boolean }> = ({ e, col, title, sub, ok }) => (
    <div style={{ width: 440, padding: "30px 28px", borderRadius: 18, ...glassCard(col + "cc", 2.5), display: "flex", flexDirection: "column", gap: 12, transform: `scale(${interpolate(e, [0, 1], [0.8, 1])})`, opacity: interpolate(e, [0, 0.4], [0, 1]) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <svg width="42" height="42" viewBox="0 0 100 100">{ok ? <path d="M20 52 L42 74 L82 30" fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : <><line x1={28} y1={28} x2={72} y2={72} stroke={col} strokeWidth={12} strokeLinecap="round" /><line x1={72} y1={28} x2={28} y2={72} stroke={col} strokeWidth={12} strokeLinecap="round" /></>}</svg>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", transform: "translateZ(0)" }}>{title}</span>
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21, color: col, transform: "translateZ(0)" }}>{sub}</span>
    </div>
  );
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa3} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ display: "flex", gap: 34, alignItems: "flex-start" }}>
          <Card e={okE} col={GREEN} title="FIND VULNS" sub="in source code — allowed" ok />
          <Card e={noE} col={RED} title="PENTEST · EXPLOITS" sub="binary scans — blocked" ok={false} />
        </div>
        {frame >= 74 && (
          <div style={{ transform: `scale(${routeE})`, padding: "14px 30px", borderRadius: 12, background: SONNET, boxShadow: `0 0 30px ${SONNET}55` }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: "#fff" }}>↳ ROUTED TO OPUS 4.8</span>
          </div>
        )}
        <SceneHeadline kicker="MORE USABLE — WITH GUARDRAILS" title="SAFER FOR REAL SECURITY WORK" titleSize={54} accent={tint} />
      </div>
    </SceneShell>
  );
};

// the three modes — max reaches Fable / medium keeps most / fast trades price
const ModesScene: React.FC<{ durationInFrames: number; tint: string }> = ({ durationInFrames, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const modes = [
    { name: "MAX", sub: "reaches Fable 5", col: OPUS },
    { name: "MEDIUM", sub: "most of it, far cheaper", col: GREEN },
    { name: "FAST", sub: "2.5× speed · 2× price", col: AMBER },
  ];
  return (
    <SceneShell durationInFrames={durationInFrames} particleSeed={0xa4} tint={tint}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ display: "flex", gap: 30 }}>
          {modes.map((m, i) => {
            const at = 8 + i * 14;
            const e = spring({ frame: frame - at, fps, config: { stiffness: 120, damping: 18 }, durationInFrames: 24 });
            return (
              <div key={m.name} style={{ width: 380, padding: "38px 26px", borderRadius: 18, ...glassCard(m.col + "cc", 2.5), display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `translateY(${interpolate(e, [0, 1], [44, 0])}px)`, opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP) }}>
                <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, letterSpacing: 1, color: "#fff", transform: "translateZ(0)" }}>{m.name}</span>
                <div style={{ width: 50, height: 5, borderRadius: 3, background: m.col }} />
                <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: m.col, textAlign: "center", transform: "translateZ(0)" }}>{m.sub}</span>
              </div>
            );
          })}
        </div>
        <SceneHeadline kicker="ONE MODEL, THREE DIALS" title="EFFORT IS THE NEW LEVER" titleSize={56} accent={tint} />
      </div>
    </SceneShell>
  );
};

// ── BEATS (from ≈ spokenFrame − 6, SRT-pinned) ──────────────────────────────
const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // CH1 · THE CLAIM
  { scene: "modelCompare", from: 150, dur: 220, fullscreen: true }, // "Fable 5 still holds that title" (294) — establish both
  { scene: "priceCompare", from: 380, dur: 300, fullscreen: true }, // "costing half as much through the API" (360-634)
  { scene: "aaHook", from: 660, dur: 320, fullscreen: true }, // "Artificial Analysis placed Opus 5 #1... 1 pt ahead" (645-915)
  { scene: "questionKinetic", from: 1080, dur: 190, fullscreen: true }, // "should Opus 5 become your default?" (1161)
  // CH2 · WHAT IT IS
  { scene: "releaseReceipt", from: 1252, dur: 420 }, // "released July 24... available across plans, Code, API, cloud" (1252-1650)
  { scene: "specs", from: 1938, dur: 280, fullscreen: true }, // "1M context, 128k output, adaptive thinking" (1938-2217)
  { scene: "effort", from: 2226, dur: 300, fullscreen: true }, // "5 effort levels, low through max" (2217-2500)
  { scene: "priceReceipt", from: 2506, dur: 360 }, // "$5/$25... exactly half the price of Fable 5" (2500-2810)
  { scene: "fastMode", from: 2880, dur: 340, fullscreen: true }, // "Fast mode 2.5×... doubles to $10/$50" (2870-3240)
  { scene: "positioning", from: 3246, dur: 470, fullscreen: true }, // "Sonnet speed / Opus complex / Fable ambitious" (3240-3720)
  // CH3 · THE BENCHMARKS
  { scene: "boundariesKinetic", from: 3720, dur: 150, fullscreen: true }, // "benchmarks make boundaries less clear" (3720)
  { scene: "sweBench", from: 3900, dur: 600, fullscreen: true }, // SWE-bench Pro (3860-4500)
  { scene: "frontierBench", from: 4536, dur: 580, fullscreen: true }, // FrontierBench (4530-5130)
  { scene: "osworld", from: 5316, dur: 540, fullscreen: true }, // OSWorld 2.0 (5310-5880)
  { scene: "programBench", from: 5886, dur: 600, fullscreen: true }, // ProgramBench (5880-6510)
  { scene: "tableReceipt", from: 6540, dur: 470 }, // "published numbers don't show a large gap" (6510-7020)
  { scene: "aaIndex", from: 7050, dur: 520 }, // "AA Intelligence Index: Opus 5 max 61, #1; Fable 60" (7020-7800)
  { scene: "frontierKinetic", from: 7806, dur: 174, fullscreen: true }, // "frontier level, not a cheaper compromise" (7800-7980)
  // CH4 · THE CATCH
  { scene: "caveats", from: 8010, dur: 560, fullscreen: true }, // "max effort, 5 trials, own harnesses, prerelease" (7980-8880)
  { scene: "productionKinetic", from: 8760, dur: 290 }, // "not the same as customers in production" (8787)
  { scene: "costReceipt", from: 9210, dur: 540 }, // "100M tokens vs 63M avg, ~$4000, 60 tps verbose" (9180-9780)
  { scene: "cheapKinetic", from: 9786, dur: 400, fullscreen: true }, // "$5/$25 doesn't make every task cheap" (9780-10200)
  { scene: "automationBench", from: 10236, dur: 560, fullscreen: true }, // AutomationBench 24%/26%, 89¢ (10230-10800)
  { scene: "effortMatters", from: 10806, dur: 520, fullscreen: true }, // "medium/high nearly all capability, fewer tokens" (10800-11340)
  // CH5 · SAFETY
  { scene: "safetyKinetic", from: 11340, dur: 190 }, // "the second complication is safety" (11340-11520)
  { scene: "alignedKinetic", from: 11550, dur: 540, fullscreen: true }, // "most aligned... 85% less intervention than Fable" (11520-12090)
  { scene: "safetyRouting", from: 12120, dur: 600, fullscreen: true }, // "find vulns ✓ / pentest ✗ → routed to 4.8" (12090-12720)
  { scene: "incidentKinetic", from: 12750, dur: 570, fullscreen: true }, // "tried to work around classifiers; password incident" (12720-13320)
  { scene: "noMaliceKinetic", from: 13350, dur: 560 }, // "no malicious behaviour; intermediate snapshot" (13320-13920)
  { scene: "hallucKinetic", from: 13950, dur: 560, fullscreen: true }, // "more accurate but more hallucinations" (13920-14520)
  // CH6 · THE VERDICT
  { scene: "adjustableKinetic", from: 14520, dur: 390, fullscreen: true }, // "intelligence, cost and effort are adjustable" (14520-14910)
  { scene: "modes", from: 14940, dur: 690, fullscreen: true }, // "max reaches Fable / medium keeps most / fast trades" (14910-15630)
  { scene: "effortNameKinetic", from: 15636, dur: 150 }, // "effort setting almost as important as model name" (15630-15780)
  { scene: "newDefaultKinetic", from: 15786, dur: 360, fullscreen: true }, // "Opus 5 = new strongest default" (15780-16140)
  { scene: "decision", from: 16140, dur: 900, fullscreen: true }, // "Sonnet routine / Opus difficult / Fable ambitious" (16140-17160)
  { scene: "conclusionKinetic", from: 17190, dur: 340 }, // "not right for every prompt; max effort not automatic" (17160-17550)
];

export const OPUS5_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const OPUS5_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const OPUS5_EXTRA_CUTS = [1252, 2506, 6540, 7050, 9210];

const bench = (chart: ChartData) => <BenchmarkBar chart={chart} sourceType="internal" at={20} width={1180} />;

export const Opus5Visuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {/* CH1 — THE CLAIM */}
        <Sequence from={150} durationInFrames={220} premountFor={30}>
          <SceneShell durationInFrames={220} particleSeed={0x11} tint={OPUS}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
              <ModelComparison left={{ name: "OPUS 5", accent: OPUS, tagline: "new · cheaper" }} right={{ name: "FABLE 5", accent: FABLE, tagline: "still the flagship" }} />
              <SceneHeadline kicker="ANTHROPIC'S NEW MODEL" title="OPUS 5 vs FABLE 5" titleSize={58} accent={OPUS} />
            </div>
          </SceneShell>
        </Sequence>

        <Sequence from={380} durationInFrames={300} premountFor={30}>
          <SceneShell durationInFrames={300} particleSeed={0x12} tint={GREEN}>
            <PriceComparison lower={{ name: "OPUS 5", input: 5, output: 25, accent: OPUS }} higher={{ name: "FABLE 5", input: 10, output: 50, accent: FABLE }} at={10} />
          </SceneShell>
        </Sequence>

        <Sequence from={660} durationInFrames={320} premountFor={30}>
          <FinalTakeawayScene durationInFrames={320} kicker="ARTIFICIAL ANALYSIS · INDEPENDENT" title="#1 INTELLIGENCE INDEX" stamp="1 POINT AHEAD OF FABLE" stampAt={190} accent={SONNET} />
        </Sequence>

        <Sequence from={1080} durationInFrames={190} premountFor={30}>
          <SceneShell durationInFrames={190} particleSeed={0x13} tint={AMBER}>
            <KineticText text="STILL WORTH IT?" durationInFrames={190} highlight="WORTH" y={520} size={110} />
          </SceneShell>
        </Sequence>

        {/* CH2 — WHAT IT IS */}
        <Sequence from={1252} durationInFrames={420} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={420} kicker="ANTHROPIC · JULY 24" title="OPUS 5 IS HERE" fullBleed={false} tint={OPUS} src={`${SHOT}/opus5-anthropic-hero.png`} url="anthropic.com/news/claude-opus-5" imageW={3840} imageH={2000} cardW={1580} cardH={823} from={{ x: 0, y: 0, w: 3840, h: 2000 }} to={{ x: 0, y: 0, w: 3840, h: 2000 }} zoomAt={0} notes={[{ at: 40, rect: { x: 700, y: 1515, w: 2950, h: 92 }, kind: "box" }]} />
        </Sequence>

        <Sequence from={1938} durationInFrames={280} premountFor={30}>
          <SpecsRow durationInFrames={280} tint={OPUS} />
        </Sequence>

        <Sequence from={2226} durationInFrames={300} premountFor={30}>
          <SceneShell durationInFrames={300} particleSeed={0x14} tint={SONNET}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
              <EffortSelector value={4} at={10} accent={OPUS} />
              <SceneHeadline kicker="LOW → MAX" title="FIVE EFFORT LEVELS" titleSize={58} accent={SONNET} />
            </div>
          </SceneShell>
        </Sequence>

        <Sequence from={2506} durationInFrames={360} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={360} kicker="CLAUDE PLATFORM · PRICING" title="HALF THE PRICE OF FABLE" fullBleed={false} tint={GREEN} src={`${SHOT}/opus5-pricing.png`} url="platform.claude.com/docs" imageW={1880} imageH={560} cardW={1620} cardH={482} from={{ x: 0, y: 0, w: 1880, h: 560 }} to={{ x: 0, y: 0, w: 1880, h: 560 }} zoomAt={0} notes={[{ at: 36, rect: { x: 360, y: 110, w: 1500, h: 62 }, kind: "box" }, { at: 70, rect: { x: 360, y: 230, w: 1500, h: 62 }, kind: "box" }]} />
        </Sequence>

        <Sequence from={2880} durationInFrames={340} premountFor={30}>
          <SceneShell durationInFrames={340} particleSeed={0x15} tint={AMBER}>
            <FinalTakeawayScene durationInFrames={340} kicker="FAST MODE" title="2.5× THE SPEED" stamp="…BUT DOUBLE THE PRICE" stampAt={200} accent={AMBER} />
          </SceneShell>
        </Sequence>

        <Sequence from={3246} durationInFrames={470} premountFor={30}>
          <SceneShell durationInFrames={470} particleSeed={0x16} tint={SONNET}>
            <DecisionFramework
              title="ANTHROPIC'S PITCH"
              columns={[
                { name: "SONNET 5", use: "Speed & high volume", accent: SONNET },
                { name: "OPUS 5", use: "Complex & enterprise", accent: OPUS, highlight: true },
                { name: "FABLE 5", use: "Days-long autonomy", accent: FABLE },
              ]}
              revealAts={[20, 150, 300]}
            />
          </SceneShell>
        </Sequence>

        {/* CH3 — THE BENCHMARKS */}
        <Sequence from={3720} durationInFrames={150} premountFor={30}>
          <SceneShell durationInFrames={150} particleSeed={0x17} tint={AMBER}>
            <KineticText text="THE LINES BLUR" durationInFrames={150} highlight="BLUR" y={520} size={110} />
          </SceneShell>
        </Sequence>

        <Sequence from={3900} durationInFrames={600} premountFor={30}>
          <SceneShell durationInFrames={600} particleSeed={0x18} tint={OPUS}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>{bench(SWE)}<SceneHeadline kicker="DIFFICULT SOFTWARE ENGINEERING" title="ONE POINT FROM THE FLAGSHIP" titleSize={50} accent={OPUS} /></div>
          </SceneShell>
        </Sequence>

        <Sequence from={4536} durationInFrames={580} premountFor={30}>
          <SceneShell durationInFrames={580} particleSeed={0x19} tint={OPUS}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>{bench(FRONTIER)}<SceneHeadline kicker="IT DIDN'T APPROACH FABLE" title="IT PASSED IT" titleSize={54} accent={OPUS} /></div>
          </SceneShell>
        </Sequence>

        <Sequence from={5316} durationInFrames={540} premountFor={30}>
          <SceneShell durationInFrames={540} particleSeed={0x1a} tint={SONNET}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>{bench(OSWORLD)}<SceneHeadline kicker="OPERATING A REAL COMPUTER" title="AHEAD ON COMPUTER USE" titleSize={52} accent={SONNET} /></div>
          </SceneShell>
        </Sequence>

        <Sequence from={5886} durationInFrames={600} premountFor={30}>
          <SceneShell durationInFrames={600} particleSeed={0x1b} tint={FABLE}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>{bench(PROGRAM)}<SceneHeadline kicker="REBUILD PROGRAMS FROM DOCS" title="A DEAD HEAT AT FIVE TRIES" titleSize={50} accent={FABLE} /></div>
          </SceneShell>
        </Sequence>

        <Sequence from={6540} durationInFrames={470} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={470} kicker="ANTHROPIC · OWN TESTING" title="NO LARGE, CONSISTENT GAP" fullBleed={false} tint={AMBER} src={`${SHOT}/opus5-anthropic-table.png`} url="anthropic.com/news/claude-opus-5" imageW={1760} imageH={1150} cardW={1160} cardH={758} from={{ x: 0, y: 0, w: 1760, h: 1150 }} to={{ x: 0, y: 0, w: 1760, h: 1150 }} zoomAt={0} />
        </Sequence>

        <Sequence from={7050} durationInFrames={520} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={520} kicker="ARTIFICIAL ANALYSIS · INDEPENDENT" title="GENUINELY #1" fullBleed={false} tint={SONNET} src={`${SHOT}/opus5-aa-top.png`} url="artificialanalysis.ai" imageW={3840} imageH={1600} cardW={1620} cardH={675} from={{ x: 300, y: 300, w: 2400, h: 1000 }} to={{ x: 300, y: 320, w: 2360, h: 983 }} zoomAt={16} notes={[{ at: 44, rect: { x: 500, y: 330, w: 520, h: 520 }, kind: "box" }]} />
        </Sequence>

        <Sequence from={7806} durationInFrames={174} premountFor={30}>
          <SceneShell durationInFrames={174} particleSeed={0x1c} tint={SONNET}>
            <KineticText text="FRONTIER, NOT A COMPROMISE" durationInFrames={174} highlight="FRONTIER" y={520} size={82} />
          </SceneShell>
        </Sequence>

        {/* CH4 — THE CATCH */}
        <Sequence from={8010} durationInFrames={560} premountFor={30}>
          <ChecklistScene durationInFrames={560} kicker="READ THE FINE PRINT" title="HOW THOSE SCORES WERE MADE" tint={AMBER} items={["Max effort", "Often over five trials", "Anthropic's own harnesses", "Some prerelease configs"]} />
        </Sequence>

        <Sequence from={8760} durationInFrames={290} premountFor={30}>
          <SceneShell durationInFrames={290} particleSeed={0x1d} tint={AMBER}>
            <FinalTakeawayScene durationInFrames={290} kicker="USEFUL — BUT NOT THE SAME AS" title="REAL PRODUCTION" stamp="THOUSANDS OF LIVE USERS" stampAt={170} accent={AMBER} />
          </SceneShell>
        </Sequence>

        <Sequence from={9210} durationInFrames={540} premountFor={30}>
          <ScreenshotReceiptScene durationInFrames={540} kicker="ARTIFICIAL ANALYSIS · MAX EFFORT" title="THE HIDDEN BILL" fullBleed={false} tint={RED} src={`${SHOT}/opus5-aa-top.png`} url="artificialanalysis.ai" imageW={3840} imageH={1600} cardW={1600} cardH={720} from={{ x: 440, y: 900, w: 2100, h: 640 }} to={{ x: 460, y: 940, w: 2060, h: 618 }} zoomAt={16} notes={[{ at: 44, rect: { x: 490, y: 1225, w: 1970, h: 235 }, kind: "box" }]} />
        </Sequence>

        <Sequence from={9786} durationInFrames={400} premountFor={30}>
          <SceneShell durationInFrames={400} particleSeed={0x1e} tint={RED}>
            <FinalTakeawayScene durationInFrames={400} kicker="A LOWER TOKEN PRICE ISN'T" title="CHEAP TOKENS ≠ CHEAP TASKS" stamp="IT THINKS LONGER" stampAt={240} accent={RED} />
          </SceneShell>
        </Sequence>

        <Sequence from={10236} durationInFrames={560} premountFor={30}>
          <SceneShell durationInFrames={560} particleSeed={0x1f} tint={GREEN}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>{bench(AUTO)}<SceneHeadline kicker="MAX ADDS 2 POINTS FOR THE COST" title="MEDIUM = 89¢ A TASK" titleSize={50} accent={GREEN} /></div>
          </SceneShell>
        </Sequence>

        <Sequence from={10806} durationInFrames={520} premountFor={30}>
          <SceneShell durationInFrames={520} particleSeed={0x20} tint={GREEN}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
              <EffortSelector value={1} at={10} accent={GREEN} />
              <SceneHeadline kicker="MOST CAPABILITY, FEWER TOKENS" title="MAX ISN'T THE DEFAULT" titleSize={54} accent={GREEN} />
            </div>
          </SceneShell>
        </Sequence>

        {/* CH5 — SAFETY */}
        <Sequence from={11340} durationInFrames={190} premountFor={30}>
          <SceneShell durationInFrames={190} particleSeed={0x21} tint={SONNET}>
            <KineticText text="NOW — SAFETY" durationInFrames={190} highlight="SAFETY" y={520} size={104} />
          </SceneShell>
        </Sequence>

        <Sequence from={11550} durationInFrames={540} premountFor={30}>
          <SceneShell durationInFrames={540} particleSeed={0x22} tint={GREEN}>
            <FinalTakeawayScene durationInFrames={540} kicker="ANTHROPIC'S MOST ALIGNED MODEL YET" title="85% LESS INTERVENTION" stamp="…THAN FABLE 5" stampAt={300} accent={GREEN} />
          </SceneShell>
        </Sequence>

        <Sequence from={12120} durationInFrames={600} premountFor={30}>
          <SafetyRouting durationInFrames={600} tint={SONNET} />
        </Sequence>

        <Sequence from={12750} durationInFrames={570} premountFor={30}>
          <SceneShell durationInFrames={570} particleSeed={0x23} tint={RED} mood="danger">
            <FinalTakeawayScene durationInFrames={570} kicker="A TRAINING SNAPSHOT, IN RARE CASES" title="IT TRIED THE PASSWORDS" stamp="TO GET BACK INTO A SERVICE" stampAt={320} accent={RED} />
          </SceneShell>
        </Sequence>

        <Sequence from={13350} durationInFrames={560} premountFor={30}>
          <SceneShell durationInFrames={560} particleSeed={0x24} tint={GREEN}>
            <FinalTakeawayScene durationInFrames={560} kicker="NO MALICE, NO STRATEGIC DECEPTION" title="AN INTERMEDIATE SNAPSHOT" stamp="NOT THE SHIPPED MODEL" stampAt={320} accent={GREEN} />
          </SceneShell>
        </Sequence>

        <Sequence from={13950} durationInFrames={560} premountFor={30}>
          <SceneShell durationInFrames={560} particleSeed={0x25} tint={AMBER}>
            <FinalTakeawayScene durationInFrames={560} kicker="MORE ACCURATE OVERALL, YET…" title="MORE CONFIDENT MISTAKES" stamp="CAPABLE — AND WRONG" stampAt={320} accent={AMBER} />
          </SceneShell>
        </Sequence>

        {/* CH6 — THE VERDICT */}
        <Sequence from={14520} durationInFrames={390} premountFor={30}>
          <SceneShell durationInFrames={390} particleSeed={0x26} tint={OPUS}>
            <FinalTakeawayScene durationInFrames={390} kicker="THE REAL STORY" title="INTELLIGENCE IS NOW A DIAL" stamp="COST · EFFORT · SPEED" stampAt={230} accent={OPUS} />
          </SceneShell>
        </Sequence>

        <Sequence from={14940} durationInFrames={690} premountFor={30}>
          <ModesScene durationInFrames={690} tint={OPUS} />
        </Sequence>

        <Sequence from={15636} durationInFrames={150} premountFor={30}>
          <SceneShell durationInFrames={150} particleSeed={0x27} tint={SONNET}>
            <KineticText text="EFFORT ≈ THE MODEL NAME" durationInFrames={150} highlight="EFFORT" y={520} size={84} />
          </SceneShell>
        </Sequence>

        <Sequence from={15786} durationInFrames={360} premountFor={30}>
          <SceneShell durationInFrames={360} particleSeed={0x28} tint={OPUS}>
            <FinalTakeawayScene durationInFrames={360} kicker="FOR DIFFICULT WORK" title="THE NEW DEFAULT" stamp="OPUS 5" stampAt={210} accent={OPUS} />
          </SceneShell>
        </Sequence>

        <Sequence from={16140} durationInFrames={900} premountFor={30}>
          <SceneShell durationInFrames={900} particleSeed={0x29} tint={SONNET}>
            <DecisionFramework
              title="SO WHICH ONE?"
              columns={[
                { name: "SONNET 5", use: "Routine, high-volume", accent: SONNET },
                { name: "OPUS 5", use: "Difficult practical work", accent: OPUS, highlight: true },
                { name: "FABLE 5", use: "Longest autonomous runs", accent: FABLE },
              ]}
              revealAts={[40, 300, 560]}
            />
          </SceneShell>
        </Sequence>

        <Sequence from={17190} durationInFrames={340} premountFor={30}>
          <SceneShell durationInFrames={340} particleSeed={0x2a} tint={AMBER}>
            <FinalTakeawayScene durationInFrames={340} kicker="NOT FOR EVERY PROMPT" title="MAX EFFORT ISN'T AUTOMATIC" stamp="MATCH EFFORT TO THE TASK" stampAt={200} accent={AMBER} />
          </SceneShell>
        </Sequence>

        {/* OUTRO — the close (no explicit "subscribe" in the VO; end card holds
            the last ~9s while the face delivers the verdict recap under it) */}
        <Sequence from={17800} durationInFrames={OPUS5_DUR - 17800} premountFor={30}>
          <Fable5Outro durationInFrames={OPUS5_DUR - 17800} kicker="EVERY MODEL LAUNCH, BROKEN DOWN" tag="Sonnet for volume · Opus for hard work · Fable for the rest" />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const Opus5Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <Opus5Visuals />

      {/* ===== MUSIC — main analytical bed, caveat bed over the safety section ===== */}
      <MusicController state="main" from={150} durationInFrames={3700} volume={0.075} duck={[{ from: 380, to: 680 }]} />
      <MusicController state="main" from={3720} durationInFrames={4260} volume={0.07} duck={[{ from: 3900, to: 6486 }]} />
      <MusicController state="caveat" from={8010} durationInFrames={3330} volume={0.06} duck={[{ from: 9210, to: 9750 }]} />
      <MusicController state="caveat" from={11340} durationInFrames={3180} volume={0.055} />
      <MusicController state="main" from={14520} durationInFrames={3080} volume={0.07} duck={[{ from: 16140, to: 17040 }]} />

      {/* ===== SFX — restrained: entrance whoosh per beat, accents on key beats ===== */}
      {BEATS.map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={b.fullscreen ? SFX.softWhoosh : pick(SFX_POOLS.entry, i)} volume={0.4} rate={vary(i)} />
      ))}
      {/* benchmark reveals — a soft confirmation as the bars settle */}
      {[3900, 4536, 5316, 5886, 10236].map((f, i) => (
        <SfxCue key={`bench-${f}`} from={f + 40} src={SFX.confirmation} volume={0.4} rate={vary(i)} />
      ))}
      {/* section starts — one low impact */}
      {[3720, 8010, 11340, 14520].map((f) => (
        <SfxCue key={`sec-${f}`} from={f} src={SFX.lowImpact} volume={0.4} />
      ))}
      {/* the price payoff + the safety warning */}
      <SfxCue from={380 + 70} src={SFX.confirmation} volume={0.42} />
      <SfxCue from={12750} src={SFX.warningPulse} volume={0.38} />
      <SfxCue from={16140} src={SFX.confirmation} volume={0.42} />
    </AbsoluteFill>
  );
};
