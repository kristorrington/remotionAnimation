import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { StepsScene } from "./scenes/StepsScene";
import { FlowScene } from "./scenes/FlowScene";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { StatCountersScene } from "./scenes/StatCountersScene";
import { MigrateStopScene, SpeedWallScene, PlumbingScene, HiddenCostScene } from "./scenes/MetaphorScenes";
import { DocFunnelScene, AppFlowScene, FirstLineDeskScene } from "./scenes/SideHustleScenes";
import { BalanceScaleScene, BenchBarsScene, GatesScene } from "./scenes/GptScenes";
import { HybridStackScene } from "./scenes/HybridScenes";
import { ThemeProvider } from "./theme";
import mckinsey from "../public/assets/external/charts/mckinsey-agent-adoption.json";

// N8nHybridVideo — transparent cutaway overlay for the "don't abandon n8n —
// hybrid stack" explainer (~5m16s, 9475f @ 30fps). Beats classified per
// CLAUDE.md §3; every `at` is pinned to whisper word frames (captionsData).
// LESS-WORDS pass (editing research, July 2026): titles ≤ 3–4 words, kickers
// dropped on fast beats, kinetic one-word payoffs between chapters.

export const N8N_HYBRID_DUR = 9475;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8): the hook question is delivered to camera
  { scene: "migrateStop", from: 90, dur: 255, fullscreen: true },
  { scene: "tenfold", from: 350, dur: 190 },
  { scene: "klarnaBack", from: 545, dur: 90 },
  { scene: "hybridIntro", from: 641, dur: 229, fullscreen: true },
  { scene: "blurLabels", from: 906, dur: 190 },
  { scene: "predictable", from: 1104, dur: 320 },
  { scene: "messFunnel", from: 1433, dur: 237, fullscreen: true },
  { scene: "bothCompare", from: 1678, dur: 175 },
  { scene: "intelVsRely", from: 1862, dur: 113, fullscreen: true },
  { scene: "klarnaStats", from: 1987, dur: 343, fullscreen: true },
  { scene: "qualityWall", from: 2350, dur: 310, fullscreen: true },
  { scene: "splitWork", from: 2867, dur: 170 },
  { scene: "tooMuchTrust", from: 3161, dur: 279, fullscreen: true },
  { scene: "moneyRound", from: 3449, dur: 540 },
  { scene: "onePlace", from: 4250, dur: 212, fullscreen: true },
  { scene: "zapierBet", from: 4469, dur: 470 },
  { scene: "controlLayer", from: 4954, dur: 400 },
  { scene: "mckinseyGap", from: 5551, dur: 319, fullscreen: true },
  { scene: "gapHurts", from: 5976, dur: 190 },
  { scene: "fortyForty", from: 6179, dur: 341, fullscreen: true },
  { scene: "bothHappen", from: 6535, dur: 125, fullscreen: true },
  { scene: "sellOff", from: 6806, dur: 195 },
  { scene: "knownSteps", from: 7316, dur: 330 },
  { scene: "boundedGates", from: 7651, dur: 355 },
  { scene: "hybridPayoff", from: 8018, dur: 412, fullscreen: true },
  { scene: "skillsSurvive", from: 8623, dur: 240 },
  { scene: "oneFramework", from: 8868, dur: 240 },
  { scene: "autonomyMatters", from: 9117, dur: 213, fullscreen: true },
];

export const N8N_HYBRID_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const N8N_HYBRID_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

export const N8nHybridVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 HOOK — about to abandon n8n? STOP: slow down */}
      <Sequence from={90} durationInFrames={255} premountFor={30}>
        <MigrateStopScene durationInFrames={255} title="SLOW DOWN" />
      </Sequence>

      {/* 0:06 n8n grew 10× while no-code was "dying" */}
      <Sequence from={350} durationInFrames={190} premountFor={30}>
        <StatCountersScene durationInFrames={190} title="WHILE NO-CODE 'DIED'" stats={[{ label: "N8N REVENUE", value: 10, suffix: "×", at: 43 }]} accent="#34D399" />
      </Sequence>

      {/* 0:12 Klarna pulled humans back */}
      <Sequence from={545} durationInFrames={90} premountFor={30}>
        <FinalTakeawayScene durationInFrames={90} title="HUMANS CAME BACK" accent="#F59E0B" />
      </Sequence>

      {/* 0:21 the verdict: hybrid — the workflow slab + the AI judgement module */}
      <Sequence from={641} durationInFrames={229} premountFor={30}>
        <HybridStackScene durationInFrames={229} title="WORKFLOW + JUDGEMENT" slabLabel="WORKFLOW" agentLabel="AI" dockAt={171} tint="#34D399" />
      </Sequence>

      {/* 0:30 the labels are blurring */}
      <Sequence from={906} durationInFrames={190} premountFor={30}>
        <FlowScene durationInFrames={190} title="BLURRED LABELS" nodes={[{ label: "n8n" }, { label: "Zapier" }, { label: "Make" }]} nodeAts={[30, 120, 132]} tint="#D97757" />
      </Sequence>

      {/* 0:37 all three: trigger → run → predictable */}
      <Sequence from={1104} durationInFrames={320} premountFor={30}>
        <StepsScene durationInFrames={320} title="PREDICTABLE STEPS" accent="#F59E0B" tint="#F59E0B" steps={[{ label: "Trigger fires", at: 179 }, { label: "Workflow runs", at: 216 }, { label: "Steps behave", at: 295 }]} />
      </Sequence>

      {/* 0:48 AI-native freedom: messy input in, a decision out */}
      <Sequence from={1433} durationInFrames={237} premountFor={30}>
        <DocFunnelScene durationInFrames={237} title="BUILT FOR MESS" dropAts={[117, 152, 178]} reportAt={210} reportLabel="DECISION" priceLabel="ITS CALL" />
      </Sequence>

      {/* 0:56 consistency vs ambiguity — you need both */}
      <Sequence from={1678} durationInFrames={175} premountFor={30}>
        <CompareCard kicker="YOU NEED BOTH" tint="#34D399" left={{ title: "CONSISTENCY", items: ["fixed steps"], accent: "#D97757", mark: "✓" }} right={{ title: "AMBIGUITY", items: ["messy input"], accent: "#34D399", mark: "✓" }} leftDelay={22} rightDelay={94} durationInFrames={175} />
      </Sequence>

      {/* 1:02 kinetic: intelligence ≠ reliability */}
      <Sequence from={1862} durationInFrames={113} premountFor={30}>
        <FinalTakeawayScene durationInFrames={113} title="SMART ≠ RELIABLE" accent="#EF4444" />
      </Sequence>

      {/* 1:06 Klarna 2024: the numbers that looked like the future */}
      <Sequence from={1987} durationInFrames={343} premountFor={30}>
        <StatCountersScene durationInFrames={343} kicker="KLARNA, 2024" title="THE AI-ONLY DREAM" stats={[{ label: "AGENTS' WORK", value: 700, at: 176 }, { label: "MINUTES → 2", value: 11, at: 286 }]} accent="#F59E0B" />
      </Sequence>

      {/* 1:18 then the quality wall */}
      <Sequence from={2350} durationInFrames={310} premountFor={30}>
        <SpeedWallScene durationInFrames={310} title="THE QUALITY WALL" />
      </Sequence>

      {/* 1:35 the fix: AI keeps simple work, humans take judgement */}
      <Sequence from={2867} durationInFrames={170} premountFor={30}>
        <FirstLineDeskScene durationInFrames={170} title="SPLIT THE WORK" />
      </Sequence>

      {/* 1:45 the real lesson: too much trust, no protection */}
      <Sequence from={3161} durationInFrames={279} premountFor={30}>
        <BalanceScaleScene durationInFrames={279} title="TOO MUCH TRUST" leftLabel="PROTECTION" rightLabel="RESPONSIBILITY" dropLeftAt={40} dropRightAt={77} tipAt={112} stampText="DESIGN MISTAKE" stampAt={213} tint="#EF4444" />
      </Sequence>

      {/* 1:55 n8n's money round */}
      <Sequence from={3449} durationInFrames={540} premountFor={30}>
        <StatCountersScene durationInFrames={540} kicker="OCTOBER 2025" title="THE ORCHESTRATION BET" stats={[{ label: "$ MILLION RAISED", value: 180, at: 118 }, { label: "$ BILLION VALUATION", value: 2.5, decimals: 1, at: 209 }, { label: "$ MILLION REVENUE", value: 40, at: 432 }]} accent="#E8B84B" />
      </Sequence>

      {/* 2:21 n8n = models + tools + data + workflows in ONE place */}
      <Sequence from={4250} durationInFrames={212} premountFor={30}>
        <AppFlowScene durationInFrames={212} title="ONE PLACE" apps={[{ label: "MODELS", at: 78 }, { label: "TOOLS", at: 97 }, { label: "DATA", at: 120 }, { label: "WORKFLOWS", at: 156 }]} connectAt={170} collapseAt={9999} />
      </Sequence>

      {/* 2:29 Zapier's identical bet: 800 internal agents */}
      <Sequence from={4469} durationInFrames={470} premountFor={30}>
        <StatCountersScene durationInFrames={470} kicker="ZAPIER'S BET" title="MORE AGENTS THAN STAFF" stats={[{ label: "INTERNAL AGENTS", value: 800, at: 168 }, { label: "PLATFORM", value: 1, at: 353 }]} accent="#D97757" />
      </Sequence>

      {/* 2:45 the workflow layer becomes the control system (+ Akeneo) */}
      <Sequence from={4954} durationInFrames={400} premountFor={30}>
        <PlumbingScene durationInFrames={400} title="THE CONTROL LAYER" />
      </Sequence>

      {/* 3:05 McKinsey: experimenting vs actually scaling */}
      <Sequence from={5551} durationInFrames={319} premountFor={30}>
        <BenchBarsScene durationInFrames={319} title="THE REAL GAP" barAts={[34, 184]} data={mckinsey.data} sourceName={mckinsey.sourceName} sourceUrl={mckinsey.sourceUrl} tint="#D97757" />
      </Sequence>

      {/* 3:19 the gap is where it hurts */}
      <Sequence from={5976} durationInFrames={190} premountFor={30}>
        <HiddenCostScene durationInFrames={190} title="WHERE IT HURTS" chipLabels={["RELIABILITY", "GOVERNANCE", "COST"]} chipAts={[100, 135, 161]} tint="#EF4444" />
      </Sequence>

      {/* 3:26 Gartner: 40% adopt AND 40% get cancelled */}
      <Sequence from={6179} durationInFrames={341} premountFor={30}>
        <BalanceScaleScene durationInFrames={341} kicker="GARTNER" title="ADOPTED AND CANCELLED" leftLabel="40% ADOPT" rightLabel="40% KILLED" dropLeftAt={30} dropRightAt={242} tipAt={292} tint="#F59E0B" />
      </Sequence>

      {/* 3:38 kinetic: both happen */}
      <Sequence from={6535} durationInFrames={125} premountFor={30}>
        <FinalTakeawayScene durationInFrames={125} title="BOTH HAPPEN" accent="#D97757" />
      </Sequence>

      {/* 3:47 the $1T sell-off */}
      <Sequence from={6806} durationInFrames={195} premountFor={30}>
        <StatCountersScene durationInFrames={195} kicker="FEBRUARY" title="PRICED FOR REPLACEMENT" stats={[{ label: "$ TRILLION SELL-OFF", value: 1, at: 28 }]} accent="#EF4444" />
      </Sequence>

      {/* 4:03 rule 1: known steps + expensive mistakes → workflow */}
      <Sequence from={7316} durationInFrames={330} premountFor={30}>
        <FlowScene durationInFrames={330} kicker="KNOWN STEPS?" title="WORKFLOW." nodes={[{ label: "Payments" }, { label: "Approvals" }, { label: "Compliance" }]} nodeAts={[147, 194, 222]} tint="#34D399" />
      </Sequence>

      {/* 4:15 rule 2: messy + bounded → agent (four bounded jobs, four gates) */}
      <Sequence from={7651} durationInFrames={355} premountFor={30}>
        <GatesScene durationInFrames={355} kicker="MESSY INPUT?" title="AGENT." gates={[{ label: "CLASSIFY", at: 179 }, { label: "INTERPRET", at: 226 }, { label: "RESEARCH", at: 259 }, { label: "DRAFT", at: 291 }]} tint="#D97757" />
      </Sequence>

      {/* 4:27 THE payoff: connect the two — agent recommends, workflow runs it */}
      <Sequence from={8018} durationInFrames={412} premountFor={30}>
        <HybridStackScene durationInFrames={412} kicker="MY BET" title="CORE + DECISION POINTS" slabLabel="WORKFLOW" agentLabel="AGENT" dockAt={65} chipLabels={["VALIDATE", "EXECUTE", "LOG", "RETRY", "ESCALATE"]} chipAts={[146, 168, 188, 200, 221]} tint="#34D399" />
      </Sequence>

      {/* 4:47 the skills that survive every platform cycle */}
      <Sequence from={8623} durationInFrames={240} premountFor={30}>
        <StepsScene durationInFrames={240} title="SKILLS THAT SURVIVE" accent="#F59E0B" tint="#F59E0B" steps={[{ label: "APIs + auth", at: 8 }, { label: "Webhooks", at: 51 }, { label: "Structured data", at: 69 }, { label: "Error handling", at: 107 }]} />
      </Sequence>

      {/* 4:55 don't marry one framework */}
      <Sequence from={8868} durationInFrames={240} premountFor={30}>
        <CompareCard kicker="CAREER ADVICE" tint="#D97757" left={{ title: "ONE FRAMEWORK", items: ["changes fast"], accent: "#EF4444", mark: "✗" }} right={{ title: "PORTABLE SKILLS", items: ["survive cycles"], accent: "#34D399", mark: "✓" }} leftDelay={22} rightDelay={145} durationInFrames={240} />
      </Sequence>

      {/* 5:03 finale: the durable skill */}
      <Sequence from={9117} durationInFrames={213} premountFor={30}>
        <FinalTakeawayScene durationInFrames={213} kicker="THE DURABLE SKILL" title="KNOW WHERE AUTONOMY MATTERS" stamp="THAT LASTS" stampAt={193} accent="#D97757" />
      </Sequence>

      {/* 5:11 OUTRO — anchored to the spoken "subscribe" (9411) */}
      <Sequence from={9350} durationInFrames={N8N_HYBRID_DUR - 9350} premountFor={30}>
        <Fable5Outro durationInFrames={N8N_HYBRID_DUR - 9350} kicker="PRACTICAL AI — NO HYPE" tag="Deterministic core or full agents? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const N8nHybridVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <N8nHybridVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={880} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={1987} durationInFrames={680} volume={0.07} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={3449} durationInFrames={760} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={6179} durationInFrames={620} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={8018} durationInFrames={760} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={9350} durationInFrames={N8N_HYBRID_DUR - 9350} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 9350].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* step/list ticks at the spoken anchors */}
      {[1283, 1320, 1399, 4334, 4353, 4376, 4412, 8631, 8674, 8692, 8730].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={9362} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: N8nHybridVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
