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
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
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
  { scene: "n8nOpenShot", from: 90, dur: 75, fullscreen: true }, // FIRST COVER at 3.0s — the n8n canvas as "abandon n8n" is spoken (56)
  { scene: "migrateStop", from: 168, dur: 177, fullscreen: true }, // stopAtFrame 40 → slam 208, right off "slow down." (185)
  { scene: "tenfold", from: 350, dur: 98 },
  { scene: "klarnaOpenProof", from: 452, dur: 180 }, // Klarna's FIRST MENTION → their own press page (brand rule; "humans back" 430)
  { scene: "hybridIntro", from: 641, dur: 229, fullscreen: true },
  { scene: "blurProof", from: 906, dur: 114 }, // opening b-roll: n8n's own hero IS the blur ("n8n leans" 936)
  { scene: "zapierNoCode", from: 1026, dur: 78 }, // Zapier's FIRST MENTION → their agents page ("towards no code" 1050)
  { scene: "predictable", from: 1104, dur: 320 },
  { scene: "messFunnel", from: 1433, dur: 237, fullscreen: true },
  { scene: "bothCompare", from: 1678, dur: 175 },
  { scene: "intelVsRely", from: 1862, dur: 113, fullscreen: true },
  { scene: "klarnaStats", from: 1987, dur: 240, fullscreen: true },
  { scene: "klarnaPrProof", from: 2239, dur: 105 }, // Klarna's own PR — "from 11 minutes to around 2" 2273
  { scene: "qualityWall", from: 2350, dur: 310, fullscreen: true },
  { scene: "klarnaRehireProof", from: 2694, dur: 168 }, // "began hiring people again" 2765
  { scene: "splitWork", from: 2867, dur: 170 },
  { scene: "tooMuchTrust", from: 3161, dur: 279, fullscreen: true },
  { scene: "moneyRound", from: 3449, dur: 540 },
  { scene: "seriesCProof", from: 3995, dur: 150 }, // receipt trails the counters ("did not confirm that figure" 3957)
  { scene: "surveyHype", from: 4149, dur: 91 }, // Zapier survey 84% — "agent hype is accelerating" 4155
  { scene: "onePlace", from: 4250, dur: 212, fullscreen: true },
  { scene: "zapierAgentsRoll", from: 4466, dur: 124 }, // the agents product page — "similar strategic bet" 4469
  { scene: "zapierBet", from: 4595, dur: 114 },
  { scene: "zapierPostProof", from: 4712, dur: 227 }, // "more agents than employees" 4736
  { scene: "controlLayer", from: 4954, dur: 126 },
  { scene: "akeneoProof", from: 5080, dur: 250 }, // "Akeneo followed that pattern" 5086
  { scene: "mckinseyGap", from: 5551, dur: 319, fullscreen: true },
  { scene: "gapHurts", from: 5976, dur: 190 },
  { scene: "fortyForty", from: 6179, dur: 341, fullscreen: true },
  { scene: "bothHappen", from: 6535, dur: 125, fullscreen: true },
  { scene: "gartnerProof", from: 6664, dur: 136 }, // receipt right after the 40/40 tip
  { scene: "sellOff", from: 6806, dur: 195 },
  { scene: "selloffProof", from: 7006, dur: 170 }, // "market fear tells you what investors expect" 7012
  { scene: "knownSteps", from: 7316, dur: 330 },
  { scene: "boundedGates", from: 7651, dur: 355 },
  { scene: "hybridPayoff", from: 8018, dur: 412, fullscreen: true },
  { scene: "n8nProductRoll", from: 8473, dur: 140 }, // "keep building in n8n, Make, or Zapier" 8479
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
      {/* 0:03 FIRST COVER — the n8n canvas on screen the moment it's named */}
      <Sequence from={90} durationInFrames={75} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={75} title="ABANDON N8N?" tint="#D97757" src="assets/external/screenshots/n8n-canvas-wide.png" url="n8n.io" imageW={1800} imageH={962} from={{ x: 72, y: 38, w: 1656, h: 885 }} to={{ x: 0, y: 0, w: 1800, h: 962 }} zoomAt={8} />
      </Sequence>

      {/* 0:06 HOOK GAG — STOP: slow down (slam pinned to the spoken verdict) */}
      <Sequence from={168} durationInFrames={177} premountFor={30}>
        <MigrateStopScene durationInFrames={177} title="SLOW DOWN" stopAtFrame={40} />
      </Sequence>

      {/* 0:06 n8n grew 10× while no-code was "dying" */}
      <Sequence from={350} durationInFrames={98} premountFor={30}>
        <StatCountersScene durationInFrames={98} title="WHILE NO-CODE 'DIED'" stats={[{ label: "N8N REVENUE", value: 10, suffix: "×", at: 43 }]} accent="#34D399" />
      </Sequence>

      {/* 0:15 Klarna's FIRST MENTION → Klarna's OWN press page (brand rule, July 2026);
          the Forbes rehire proof still lands at 2694 on "began hiring people again" */}
      <Sequence from={452} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="KLARNA.COM · FEB 2024" title="ALL-IN ON AI" tint="#F59E0B" src="assets/external/screenshots/klarna-pr-wide.png" url="klarna.com/press" imageW={2152} imageH={1150} from={{ x: 76, y: 48, w: 1980, h: 1058 }} to={{ x: 8, y: 48, w: 2062, h: 1102 }} zoomAt={16} highlight={{ x: 555, y: 372, w: 835, h: 95 }} highlightAt={26} />
      </Sequence>

      {/* 0:21 the verdict: hybrid — the workflow slab + the AI judgement module */}
      <Sequence from={641} durationInFrames={229} premountFor={30}>
        <HybridStackScene durationInFrames={229} title="WORKFLOW + JUDGEMENT" slabLabel="WORKFLOW" agentLabel="AI" dockAt={171} tint="#34D399" />
      </Sequence>

      {/* 0:30 opening b-roll: n8n's own homepage sells "AI agents and workflows" — the blur on screen */}
      <Sequence from={906} durationInFrames={114} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={114} kicker="N8N.IO" title="LABELS BLURRING" tint="#D97757" src="assets/external/screenshots/n8n-hero-wide.png" url="n8n.io" imageW={2900} imageH={1550} from={{ x: 290, y: 155, w: 2436, h: 1302 }} to={{ x: 0, y: 0, w: 2900, h: 1550 }} zoomAt={18} highlight={{ x: 385, y: 70, w: 1030, h: 220 }} highlightAt={40} />
      </Sequence>

      {/* 0:34 Zapier's FIRST MENTION → their own agents page ("Zapier, Make lean heavily towards no code" 1026) */}
      <Sequence from={1026} durationInFrames={78} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={78} kicker="ZAPIER.COM" title="THE NO-CODE CAMP" tint="#C15F3C" src="assets/external/screenshots/zapier-agents-wide.png" url="zapier.com/agents" imageW={2900} imageH={1550} from={{ x: 174, y: 44, w: 2552, h: 1364 }} to={{ x: 370, y: 44, w: 1870, h: 999 }} zoomAt={12} highlight={{ x: 820, y: 70, w: 970, h: 300 }} highlightAt={24} />
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
      <Sequence from={1987} durationInFrames={240} premountFor={30}>
        <StatCountersScene durationInFrames={240} kicker="KLARNA, 2024" title="THE AI-ONLY DREAM" stats={[{ label: "AGENTS' WORK", value: 700, at: 176 }]} accent="#F59E0B" />
      </Sequence>

      {/* 1:14 receipt: Klarna's OWN press release carries the 11→2 claim */}
      <Sequence from={2239} durationInFrames={105} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={105} kicker="KLARNA.COM · FEB 2024" title="THEIR OWN NUMBERS" tint="#34D399" src="assets/external/screenshots/klarna-pr-wide.png" url="klarna.com/press" imageW={2152} imageH={1150} from={{ x: 129, y: 69, w: 1894, h: 1012 }} to={{ x: 8, y: 48, w: 2062, h: 1102 }} zoomAt={8} highlight={{ x: 115, y: 838, w: 1260, h: 72 }} highlightAt={34} />
      </Sequence>

      {/* 1:18 then the quality wall */}
      <Sequence from={2350} durationInFrames={310} premountFor={30}>
        <SpeedWallScene durationInFrames={310} title="THE QUALITY WALL" />
      </Sequence>

      {/* 1:29 receipt: Forbes — Klarna hires humans back ("began hiring people again" 2765) */}
      <Sequence from={2694} durationInFrames={168} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={168} kicker="FORBES · MAY 2025" title="HIRING AGAIN" tint="#F59E0B" src="assets/external/screenshots/forbes-klarna-wide.png" url="forbes.com" imageW={1600} imageH={855} from={{ x: 160, y: 85, w: 1408, h: 753 }} to={{ x: 0, y: 0, w: 1600, h: 855 }} zoomAt={18} highlight={{ x: 2, y: 148, w: 1396, h: 112 }} highlightAt={71} />
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

      {/* 2:13 receipt: the Series C post itself ("did not confirm that figure" 3957) */}
      <Sequence from={3995} durationInFrames={150} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={150} kicker="BLOG.N8N.IO · OCT 2025" title="THE RECEIPT" tint="#34D399" src="assets/external/screenshots/n8n-seriesc-wide.png" url="blog.n8n.io/series-c" imageW={1650} imageH={882} from={{ x: 99, y: 53, w: 1452, h: 776 }} to={{ x: 0, y: 0, w: 1650, h: 882 }} zoomAt={22} highlight={{ x: 260, y: 440, w: 1250, h: 118 }} highlightAt={56} />
      </Sequence>

      {/* 2:18 receipt: the hype, measured — Zapier's own survey ("agent hype is accelerating" 4155) */}
      <Sequence from={4149} durationInFrames={91} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={91} kicker="ZAPIER SURVEY" title="HYPE, MEASURED" tint="#F59E0B" src="assets/external/screenshots/zapier-survey-wide.png" url="zapier.com/blog/ai-agents-survey" imageW={2040} imageH={1090} from={{ x: 122, y: 65, w: 1795, h: 959 }} to={{ x: 0, y: 0, w: 2040, h: 1090 }} zoomAt={10} highlight={{ x: 295, y: 175, w: 400, h: 155 }} highlightAt={32} />
      </Sequence>

      {/* 2:21 n8n = models + tools + data + workflows in ONE place */}
      <Sequence from={4250} durationInFrames={212} premountFor={30}>
        <AppFlowScene durationInFrames={212} title="ONE PLACE" apps={[{ label: "MODELS", at: 78 }, { label: "TOOLS", at: 97 }, { label: "DATA", at: 120 }, { label: "WORKFLOWS", at: 156 }]} connectAt={170} collapseAt={9999} />
      </Sequence>

      {/* 2:28 product b-roll: Zapier's agent product ("similar strategic bet" 4469) */}
      <Sequence from={4466} durationInFrames={124} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={124} kicker="ZAPIER.COM/AGENTS" title="THE SAME BET" tint="#C15F3C" src="assets/external/screenshots/zapier-agents-wide.png" url="zapier.com/agents" imageW={2900} imageH={1550} from={{ x: 174, y: 93, w: 2552, h: 1364 }} to={{ x: 40, y: 44, w: 2818, h: 1506 }} zoomAt={16} highlight={{ x: 820, y: 70, w: 970, h: 300 }} highlightAt={40} />
      </Sequence>

      {/* 2:33 Zapier's identical bet: 800 internal agents */}
      <Sequence from={4595} durationInFrames={114} premountFor={30}>
        <StatCountersScene durationInFrames={114} kicker="ZAPIER'S BET" title="MORE AGENTS THAN STAFF" stats={[{ label: "INTERNAL AGENTS", value: 800, at: 42 }]} accent="#D97757" />
      </Sequence>

      {/* 2:37 receipt: the CEO's post ("more agents than employees" 4736) */}
      <Sequence from={4712} durationInFrames={227} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={227} kicker="X · JUNE 2025" title="THE CEO'S POST" tint="#D97757" src="assets/external/screenshots/zapier-ceo-agents-post.png" url="x.com/wadefoster" imageW={1200} imageH={640} from={{ x: 72, y: 38, w: 1056, h: 563 }} to={{ x: 0, y: 0, w: 1200, h: 640 }} zoomAt={8} highlight={{ x: 42, y: 243, w: 680, h: 64 }} highlightAt={26} />
      </Sequence>

      {/* 2:45 the workflow layer becomes the control system */}
      <Sequence from={4954} durationInFrames={126} premountFor={30}>
        <PlumbingScene durationInFrames={126} title="THE CONTROL LAYER" />
      </Sequence>

      {/* 2:49 receipt: Akeneo bolts an agent layer onto its no-code platform ("launched an agent layer" 5201) */}
      <Sequence from={5080} durationInFrames={250} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={250} kicker="PR NEWSWIRE · JUL 2026" title="AGENT LAYER ADDED" tint="#34D399" src="assets/external/screenshots/akeneo-pr-wide.png" url="prnewswire.com" imageW={1497} imageH={800} from={{ x: 90, y: 48, w: 1317, h: 704 }} to={{ x: 0, y: 0, w: 1497, h: 800 }} zoomAt={20} highlight={{ x: 8, y: 78, w: 1190, h: 330 }} highlightAt={121} />
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

      {/* 3:42 receipt: Gartner's own headline right after the 40/40 tip */}
      <Sequence from={6664} durationInFrames={136} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={136} kicker="GARTNER · AUG 2025" title="40% BY 2026" tint="#F59E0B" src="assets/external/screenshots/gartner-40pct-agents-2026.png" url="gartner.com/newsroom" imageW={2000} imageH={600} to={{ x: 85, y: 68, w: 1660, h: 477 }} zoomAt={16} highlight={{ x: 112, y: 122, w: 1565, h: 100 }} highlightAt={44} cardH={545} />
      </Sequence>

      {/* 3:47 the $1T sell-off */}
      <Sequence from={6806} durationInFrames={195} premountFor={30}>
        <StatCountersScene durationInFrames={195} kicker="FEBRUARY" title="PRICED FOR REPLACEMENT" stats={[{ label: "$ TRILLION SELL-OFF", value: 1, at: 28 }]} accent="#EF4444" />
      </Sequence>

      {/* 3:53 receipt: the coverage of the sell-off ("market fear tells you" 7012) */}
      <Sequence from={7006} durationInFrames={170} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={170} kicker="YOUTUBE · FIRESHIP" title="THE $1T STORY" tint="#C15F3C" src="assets/external/screenshots/fireship-selloff-wide.png" url="youtube.com" imageW={2760} imageH={1475} from={{ x: 166, y: 89, w: 2429, h: 1298 }} to={{ x: 0, y: 0, w: 2760, h: 1475 }} zoomAt={22} highlight={{ x: 25, y: 1243, w: 850, h: 72 }} highlightAt={54} />
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

      {/* 4:42 product b-roll: the actual canvas ("keep building in n8n, Make, or Zapier" 8479) */}
      <Sequence from={8473} durationInFrames={140} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={140} kicker="N8N.IO" title="KEEP BUILDING" tint="#D97757" src="assets/external/screenshots/n8n-homepage-hero.png" url="n8n.io" imageW={3000} imageH={2450} from={{ x: 100, y: 0, w: 2900, h: 1418 }} to={{ x: 550, y: 900, w: 2450, h: 1198 }} zoomAt={30} />
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
