import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { MigrateStopScene, HiddenCostScene, BenchmarksLieScene, FinishCheckScene } from "./scenes/MetaphorScenes";
import { PathDoorsScene } from "./scenes/SideHustleScenes";
import { GatesScene } from "./scenes/GptScenes";
import { BalanceScaleScene } from "./scenes/GptScenes";
import { ScannerScene } from "./scenes/GptScenes";
import { StepsScene } from "./scenes/StepsScene";
import { StackCollapseScene } from "./scenes/CostScenes";
import { SandboxScene } from "./scenes/ChatGptWorkScenes";
import { TierOneScene, TierTwoScene, TierThreeScene, LockGateScene } from "./scenes/GoLocalScenes";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";

// GoLocalVideo — transparent cutaway overlay for the "'just go local' solves
// nothing" explainer (~5m48s, 10428f @ 30fps). Beats classified per CLAUDE.md
// §3; every `at` is pinned to whisper word frames (captionsData, 2026-07-15).
// Multi-brand topic — no single product logo on the opener (§9 logo rule is
// per-product); the first cover is the Stanford-study receipt (first-5s rule).

export const GOLOCAL_DUR = 10428;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  // face-first open + punch-in (§8); the first cover is the claim's source
  { scene: "stanfordProof", from: 90, dur: 127, fullscreen: true }, // "71% of ChatGPT questions… run locally" (4-21)
  { scene: "gpuCatch", from: 217, dur: 112, fullscreen: true }, // "the catch? renting a GPU cluster" (223-275)
  { scene: "threeGates", from: 329, dur: 340, fullscreen: true }, // "really three: tier (409), licence (451), hardware (494); get one wrong (559)"
  { scene: "delangueProof", from: 780, dur: 180 }, // "cited by Hugging Face CEO Clément Delangue" (786-870)
  { scene: "benchLieFinePrint", from: 1073, dur: 577, fullscreen: true }, // "71% (1073)… an LLM judge (1198)… a specific comparison (1379)… your current computer (1577)"
  { scene: "tier1", from: 1854, dur: 497, fullscreen: true }, // "Tier one… ≤35B (1996)… gaming PC (2157)… most people picture (2264)"
  { scene: "tier2", from: 2351, dur: 399, fullscreen: true }, // "Tier two… hundreds of billions (2463)… rent that hardware (2675)"
  { scene: "nvidiaProof", from: 2906, dur: 180 }, // "1.6 trillion parameters" (2912-2949)
  { scene: "tier3", from: 3086, dur: 380, fullscreen: true }, // "H100 (3124)… spare laptop (3218)… downloadable ≠ deployable (3281)"
  { scene: "askTier", from: 3485, dur: 160 }, // "ask one question: which tier produced that answer? (3441-3525)"
  { scene: "sandbox", from: 3745, dur: 330, fullscreen: true }, // "sensitive contracts (3871), customer data, internal documents… without sending (4000)"
  { scene: "controlSteps", from: 4165, dur: 240 }, // "you choose the model, the update cycle (4268), where the data is processed (4310)"
  { scene: "freeKinetic", from: 4576, dur: 189 }, // "free to download ≠ free to use inside a commercial product (4620-4762)"
  { scene: "mitProof", from: 4765, dur: 200 }, // "DeepSeek and GLM… MIT terms (4850)"
  { scene: "sameLabKinetic", from: 5034, dur: 127 }, // "do not assume… identical terms (5121)"
  { scene: "kimiScan", from: 5161, dur: 205, fullscreen: true }, // "Kimi (5167)… credit the model (5336)"
  { scene: "minimaxProof", from: 5366, dur: 180 }, // "MiniMax (5372)… non-commercial terms (5479)"
  { scene: "qwenGate", from: 5630, dur: 261, fullscreen: true }, // "Qwen began open… becoming more restricted (5853)"
  { scene: "releaseScan", from: 5946, dur: 264, fullscreen: true }, // "exact version (5952), exact licence, date you checked (6065)"
  { scene: "fableProof", from: 6319, dur: 200 }, // "Fable 5 launched June 9th (6364)… taken offline (6427)… restored (6531)"
  { scene: "fableGate", from: 6649, dur: 231, fullscreen: true }, // "available today, inaccessible days later (6776)"
  { scene: "stackRisk", from: 6880, dur: 190, fullscreen: true }, // "your products, clients, or revenue depend on it (6940-7040)"
  { scene: "ownVsRent", from: 7102, dur: 300 }, // "tier 1: equipment you own (7148); tier 2/3: rented infrastructure (7262)"
  { scene: "cloudKinetic", from: 7596, dur: 118 }, // "self-hosting on someone else's hardware — cloud with extra steps (7638)"
  { scene: "worthBalance", from: 7714, dur: 244, fullscreen: true }, // "sometimes worth it (7726), sometimes more cost and maintenance (7788)"
  { scene: "pickSmallest", from: 8117, dur: 363, fullscreen: true }, // "start with the tier (8129): choose the smallest model (8187)"
  { scene: "licenceGates", from: 8486, dur: 320, fullscreen: true }, // "commercial-use rights (8600), attribution (8653), usage restrictions (8720)"
  { scene: "fitSteps", from: 8823, dur: 248 }, // "available memory (8936), model size, quantisation to make it fit (9044)"
  { scene: "greenLight", from: 9071, dur: 280, fullscreen: true }, // "tier 1 handles it + licence + hardware → local is a great option (9232)"
  { scene: "rentKinetic", from: 9451, dur: 152 }, // "do not confuse it with running AI cheaply on your laptop (9504)"
  { scene: "stopUnclear", from: 9603, dur: 248, fullscreen: true }, // "licence non-commercial or unclear? STOP (9609-9658)… recheck (9818)"
  { scene: "askThree", from: 9970, dur: 240, fullscreen: true }, // "three questions: which tier (9982), which licence (10043), whose hardware (10087)"
];

export const GOLOCAL_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const GOLOCAL_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

const SHOT = "assets/external/screenshots";

export const GoLocalVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
    <AbsoluteFill>
      {/* 0:03 first cover — the Stanford study behind the 71% claim */}
      <Sequence from={90} durationInFrames={127} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={127} kicker="STANFORD STUDY" title="THE 71% SOURCE" titlePos="right" tint="#D97757" src={`${SHOT}/stanford-ipw-wide.png`} url="scalingintelligence.stanford.edu" imageW={3840} imageH={2052} from={{ x: 1000, y: 820, w: 2200, h: 1176 }} to={{ x: 880, y: 195, w: 2400, h: 1283 }} zoomAt={12} />
      </Sequence>

      {/* 0:07 the catch: "free" local drops the meter — GPU rent pumps it back */}
      <Sequence from={217} durationInFrames={112} premountFor={30}>
        <HiddenCostScene durationInFrames={112} kicker="THE CATCH" title="LOCAL ≠ FREE" chipLabels={["GPU RENT", "CLUSTER", "BILLS"]} chipAts={[12, 42, 72]} tint="#F59E0B" />
      </Sequence>

      {/* 0:11 the REAL question is three gates: tier, licence, hardware */}
      <Sequence from={329} durationInFrames={340} premountFor={30}>
        <GatesScene durationInFrames={340} kicker="ONE DECISION? NO —" title="THREE GATES" gates={[{ label: "TIER", at: 80 }, { label: "LICENCE", at: 122 }, { label: "HARDWARE", at: 165 }]} missingAt={230} missingLabel="ONE WRONG" tint="#D97757" />
      </Sequence>

      {/* 0:26 receipt: the Hugging Face CEO's tweet (his own words) */}
      <Sequence from={780} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="HUGGING FACE CEO · ON X" title="THE 71% CLAIM" fullBleed={false} tint="#34D399" src={`${SHOT}/delangue-71pct-tweet.png`} url="x.com/ClementDelangue" imageW={1440} imageH={1860} from={{ x: 0, y: 700, w: 1440, h: 770 }} to={{ x: 0, y: 150, w: 1440, h: 770 }} zoomAt={14} />
      </Sequence>

      {/* 0:36 the shiny 71% placard vs the fine print behind it */}
      <Sequence from={1073} durationInFrames={577} premountFor={30}>
        <BenchmarksLieScene durationInFrames={577} title="HEADLINE VS FINE PRINT" messLabels={["ONE COMPARISON", "LLM AS JUDGE", "YOUR PC?"]} messAts={[300, 119, 498]} revealAt={110} tint="#EF4444" />
      </Sequence>

      {/* 1:02 TIER 1 — the genuine local tier (dev + tower + small block) */}
      <Sequence from={1854} durationInFrames={497} premountFor={30}>
        <TierOneScene durationInFrames={497} kicker="TIER 1" title="THE REAL LOCAL TIER" chipAts={[142, 303, 410]} tint="#34D399" />
      </Sequence>

      {/* 1:18 TIER 2 — rented racks, climbing rent meter */}
      <Sequence from={2351} durationInFrames={399} premountFor={30}>
        <TierTwoScene durationInFrames={399} kicker="TIER 2" title="RENTED MUSCLE" chipAts={[112, 209, 324]} tint="#F59E0B" />
      </Sequence>

      {/* 1:36 receipt: NVIDIA's model card — 1.6 trillion parameters */}
      <Sequence from={2906} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="NVIDIA MODEL CARD" title="1.6 TRILLION" titleTop={64} tint="#60A5FA" src={`${SHOT}/nvidia-dsv4-modelcard-wide.png`} url="build.nvidia.com" imageW={3840} imageH={2052} from={{ x: 560, y: 60, w: 2560, h: 1368 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 1565, y: 308, w: 490, h: 54 }} highlightAt={20} /></Sequence>

      {/* 1:42 TIER 3 — the rack wall; the spare laptop gets crossed out */}
      <Sequence from={3086} durationInFrames={380} premountFor={30}>
        <TierThreeScene durationInFrames={380} kicker="TIER 3" title="THE GIANTS" clusterChipAt={38} laptopAt={130} stampAt={195} tint="#EF4444" />
      </Sequence>

      {/* 1:56 kinetic: the one question that sorts all advice */}
      <Sequence from={3485} durationInFrames={160} premountFor={30}>
        <FinalTakeawayScene durationInFrames={160} title="ASK ONE QUESTION" stamp="WHICH TIER?" stampAt={20} accent="#E8B84B" />
      </Sequence>

      {/* 2:04 privacy: sensitive docs stay inside the boundary */}
      <Sequence from={3745} durationInFrames={330} premountFor={30}>
        <SandboxScene durationInFrames={330} kicker="THE PRIVACY WIN" title="NOTHING LEAVES" copyAts={[120, 184, 234]} boundaryAt={60} chipAts={[134, 198, 248]} tint="#34D399" />
      </Sequence>

      {/* 2:18 control: you choose the model, updates, data location */}
      <Sequence from={4165} durationInFrames={240} premountFor={30}>
        <StepsScene durationInFrames={240} kicker="THE CONTROL WIN" title="YOUR CALLS" steps={[{ label: "MODEL", at: 67 }, { label: "UPDATE CYCLE", at: 103 }, { label: "DATA LOCATION", at: 145 }]} accent="#D97757" tint="#D97757" subject />
      </Sequence>

      {/* 2:32 kinetic: the licence trap begins */}
      <Sequence from={4576} durationInFrames={189} premountFor={30}>
        <FinalTakeawayScene durationInFrames={189} title="FREE TO DOWNLOAD…" stamp="≠ FREE TO SELL" stampAt={145} accent="#F59E0B" />
      </Sequence>

      {/* 2:38 receipt: DeepSeek's MIT licence — commercial use permitted */}
      <Sequence from={4765} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="GITHUB · DEEPSEEK" title="MIT: COMMERCIAL OK" titlePos="right" titleTop={470} tint="#34D399" src={`${SHOT}/deepseek-mit-licence-wide.png`} url="github.com/deepseek-ai" imageW={3840} imageH={2052} from={{ x: 600, y: 100, w: 2500, h: 1336 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 2130, y: 200, w: 420, h: 210 }} highlightAt={97} />
      </Sequence>

      {/* 2:47 kinetic: same lab, different terms */}
      <Sequence from={5034} durationInFrames={127} premountFor={30}>
        <FinalTakeawayScene durationInFrames={127} title="SAME LAB" stamp="≠ SAME TERMS" stampAt={87} accent="#EF4444" />
      </Sequence>

      {/* 2:52 Kimi rides the licence scanner — CREDIT REQUIRED */}
      <Sequence from={5161} durationInFrames={205} premountFor={30}>
        <ScannerScene durationInFrames={205} kicker="THE ATTRIBUTION CLAUSE" title="KIMI'S CONDITION" cardLabel="KIMI K2" archLabel="LICENCE CHECK" tagLabel="CREDIT REQUIRED" scanAt={40} tagAt={175} tint="#60A5FA" />
      </Sequence>

      {/* 2:58 receipt: MiniMax flipped to NON-COMMERCIAL */}
      <Sequence from={5366} durationInFrames={180} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={180} kicker="GITHUB · MINIMAX" title="NON-COMMERCIAL NOW" titlePos="left" titleTop={870} tint="#EF4444" src={`${SHOT}/minimax-licence-wide.png`} url="github.com/MiniMax-AI" imageW={3840} imageH={2052} from={{ x: 0, y: 0, w: 3840, h: 2052 }} to={{ x: 520, y: 120, w: 2760, h: 1476 }} zoomAt={16} highlight={{ x: 640, y: 420, w: 1900, h: 70 }} highlightAt={119} />
      </Sequence>

      {/* 3:07 Qwen's most capable models — the gate is closing */}
      <Sequence from={5630} durationInFrames={261} premountFor={30}>
        <LockGateScene durationInFrames={261} kicker="OPEN… FOR NOW" title="QWEN IS CLOSING UP" cardLabel="QWEN-MAX" slamAt={223} tint="#F59E0B" />
      </Sequence>

      {/* 3:18 version + licence + date ride the release scanner */}
      <Sequence from={5946} durationInFrames={264} premountFor={30}>
        <ScannerScene durationInFrames={264} kicker="NAMES ARE NOT ENOUGH" title="CHECK THE EXACT RELEASE" cardLabel="MODEL vX.Y" archLabel="EXACT RELEASE" tagLabel="DATE CHECKED ✓" scanAt={40} tagAt={119} tint="#D97757" />
      </Sequence>

      {/* 3:30 receipt: Anthropic's own page — launched, gone, restored */}
      <Sequence from={6319} durationInFrames={200} premountFor={30}>
        <ScreenshotReceiptScene durationInFrames={200} kicker="ANTHROPIC.COM" title="GONE IN 3 DAYS" titlePos="left" titleTop={300} tint="#34D399" src={`${SHOT}/anthropic-fable-timeline-wide.png`} url="anthropic.com/news/claude-fable-5-mythos-5" imageW={3840} imageH={2052} from={{ x: 520, y: 1100, w: 2800, h: 1497 }} to={{ x: 0, y: 0, w: 3840, h: 2052 }} zoomAt={14} highlight={{ x: 730, y: 1555, w: 1580, h: 100 }} highlightAt={114} />
      </Sequence>

      {/* 3:41 the gate slams on FABLE 5 — access is not guaranteed */}
      <Sequence from={6649} durationInFrames={231} premountFor={30}>
        <LockGateScene durationInFrames={231} kicker="EVEN GOOD LICENCES" title="ACCESS CAN VANISH" cardLabel="FABLE 5" slamAt={127} warnLabel="BACK TODAY. TOMORROW?" warnAt={170} tint="#EF4444" />
      </Sequence>

      {/* 3:49 the dependency stack collapses */}
      <Sequence from={6880} durationInFrames={190} premountFor={30}>
        <StackCollapseScene durationInFrames={190} kicker="THE REAL RISK" title="YOUR ONLY DEPENDENCY?" labels={["PRODUCTS", "CLIENTS", "REVENUE"]} drops={[20, 45, 70]} collapseAt={110} accent="#F59E0B" tint="#F59E0B" />
      </Sequence>

      {/* 3:57 own vs rent */}
      <Sequence from={7102} durationInFrames={300} premountFor={30}>
        <CompareCard kicker="THE HARDWARE FILTER" tint="#D97757" left={{ title: "TIER 1", items: ["Hardware you own"], accent: "#34D399", mark: "✓" }} right={{ title: "TIER 2–3", items: ["Rented infrastructure"], accent: "#F59E0B", mark: "$" }} leftDelay={6} rightDelay={96} durationInFrames={300} />
      </Sequence>

      {/* 4:13 kinetic: the punchline */}
      <Sequence from={7596} durationInFrames={118} premountFor={30}>
        <FinalTakeawayScene durationInFrames={118} title="SELF-HOSTED?" stamp="CLOUD, EXTRA STEPS" stampAt={106} accent="#D97757" />
      </Sequence>

      {/* 4:17 worth it? the scale decides per case */}
      <Sequence from={7714} durationInFrames={244} premountFor={30}>
        <BalanceScaleScene durationInFrames={244} kicker="SOMETIMES / SOMETIMES" title="WORTH THE STEPS?" leftLabel="CONTROL" rightLabel="COST + UPKEEP" dropLeftAt={12} dropRightAt={74} tipAt={130} stampText="IT DEPENDS" stampAt={160} tint="#34D399" />
      </Sequence>

      {/* 4:30 rule step 1 — pick the SMALLEST door that fits the job */}
      <Sequence from={8117} durationInFrames={363} premountFor={30}>
        <PathDoorsScene durationInFrames={363} kicker="RULE STEP 1 · TIER" title="SMALLEST THAT WORKS" doors={[{ label: "SMALL", at: 30 }, { label: "MEDIUM", at: 55 }, { label: "LARGE", at: 80 }]} pickIndex={0} pickAt={110} tint="#D97757" />
      </Sequence>

      {/* 4:43 rule step 2 — the licence gates must all open */}
      <Sequence from={8486} durationInFrames={320} premountFor={30}>
        <GatesScene durationInFrames={320} kicker="RULE STEP 2 · LICENCE" title="OPEN THE MODEL CARD" gates={[{ label: "COMMERCIAL USE", at: 114 }, { label: "ATTRIBUTION", at: 167 }, { label: "RESTRICTIONS", at: 244 }]} tint="#34D399" />
      </Sequence>

      {/* 4:54 rule step 3 — make it fit the hardware you own */}
      <Sequence from={8823} durationInFrames={248} premountFor={30}>
        <StepsScene durationInFrames={248} kicker="RULE STEP 3 · HARDWARE" title="MAKE IT FIT" steps={[{ label: "MEMORY", at: 113 }, { label: "MODEL SIZE", at: 167 }, { label: "QUANTISE", at: 200 }]} accent="#60A5FA" tint="#60A5FA" subject />
      </Sequence>

      {/* 5:02 all three pass → local gets the green light */}
      <Sequence from={9071} durationInFrames={280} premountFor={30}>
        <FinishCheckScene durationInFrames={280} kicker="ALL THREE PASS?" title="LOCAL: GREEN LIGHT" stamp="GREAT OPTION" stampAt={165} tint="#34D399" />
      </Sequence>

      {/* 5:15 kinetic: tier 2-3 reality check */}
      <Sequence from={9451} durationInFrames={152} premountFor={30}>
        <FinalTakeawayScene durationInFrames={152} title="TIER 2–3 = RENTING" stamp="NOT A CHEAP LAPTOP" stampAt={53} accent="#F59E0B" />
      </Sequence>

      {/* 5:20 unclear licence? STOP — test bench, written permission */}
      <Sequence from={9603} durationInFrames={248} premountFor={30}>
        <MigrateStopScene durationInFrames={248} kicker="NON-COMMERCIAL OR UNCLEAR" title="STOP. GET IT IN WRITING" stopAtFrame={46} tint="#EF4444" />
      </Sequence>

      {/* 5:32 the recap: three doors to ask about */}
      <Sequence from={9970} durationInFrames={240} premountFor={30}>
        <PathDoorsScene durationInFrames={240} kicker="BEFORE ANYONE SAYS GO LOCAL" title="ASK THESE THREE" doors={[{ label: "TIER?", at: 14 }, { label: "LICENCE?", at: 73 }, { label: "HARDWARE?", at: 117 }]} tint="#D97757" />
      </Sequence>

      {/* 5:43 OUTRO — anchored to the spoken "subscribe" (10318) */}
      <Sequence from={10310} durationInFrames={GOLOCAL_DUR - 10310} premountFor={30}>
        <Fable5Outro durationInFrames={GOLOCAL_DUR - 10310} kicker="PRACTICAL AI — NO HYPE" tag="Tier 1, 2 or 3? Tell me below" />
      </Sequence>
    </AbsoluteFill>
    </ThemeProvider>
  );
};

export const GoLocalVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GoLocalVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={1080} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={3745} durationInFrames={760} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={9071} durationInFrames={1150} volume={0.07} startFrom={300} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/outro.MP3")} from={10310} durationInFrames={GOLOCAL_DUR - 10310} volume={0.075} fadeInFrames={30} />

      {/* opening punch-in whoosh — fires with the Final's intro zoom */}
      <SfxCue from={1} src={SFX.whoosh} volume={0.45} rate={1.12} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 10310].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      <SfxCue from={10322} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};

// Note: GoLocalVisuals wraps its own ThemeProvider, so both the standalone
// overlay comp and the Final render the paper look without extra plumbing.
