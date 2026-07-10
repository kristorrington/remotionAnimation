import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { ClaudeMark } from "./components/Cartoons";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { SourceCardScene } from "./scenes/SourceCardScene";
import { StepsScene } from "./scenes/StepsScene";
import { StatCountersScene } from "./scenes/StatCountersScene";
import { FlowScene } from "./scenes/FlowScene";
import { StatReceiptScene } from "./scenes/StatReceiptScene";
import { HeroLaunchScene, SpeedLayerScene, RaceFasterScene } from "./scenes/LaunchScenes";
import { ReactionsScene, ObstacleRunScene, NotMagicScene } from "./scenes/RobotScenes";
import { StackCollapseScene } from "./scenes/CostScenes";
import { BenchmarksLieScene, SpeedWallScene, CheaperToServeScene, PlumbingScene, ThresholdGateScene, WorkOverTokensScene } from "./scenes/MetaphorScenes";
import {
  QuestionFlipScene, ToolStackScene, ScaleTrustScene, AdFloodScene, ExpectationScene,
  GapBridgeScene, DataCenterScene, NearBottleneckScene, BreakthroughScene, MissingPiecesScene,
} from "./scenes/WealthScenes";

// ClaudeWealthVideo — transparent cutaway overlay for the "Claude millionaire"
// explainer (~8m50s, 15899f @ 30fps). Beats classified per CLAUDE.md §3, every
// non-receipt scene has a SUBJECT acting (§1); frames anchored to the whisper
// words in captionsData.ts (frame = seconds × 30, from ≈ spoken − 6).
// Transparent gaps = talking head breathing room.

export const CLAUDE_WEALTH_DUR = 15899;

type Beat =
  | { scene: "questionFlip" | "reactions" | "benchLie" | "steps" | "cheaperServe" | "stats" | "toolStack" | "heroLaunch" | "scaleTrust" | "source" | "adFlood" | "speedWall" | "obstacles" | "statReceipt" | "flow" | "compare" | "notMagic" | "missingPieces" | "expectation" | "gapBridge" | "speedLayer" | "plumbing" | "dataCenter" | "nearBottleneck" | "solidStack" | "race" | "breakthrough" | "thresholdGate" | "workOverTokens"; from: number; dur: number };

// Cutaway windows (for the final cut's PiP spans). Outro excluded.
const BEATS: Beat[] = [
  { scene: "questionFlip", from: 66, dur: 250 },
  { scene: "reactions", from: 320, dur: 540 },
  { scene: "benchLie", from: 890, dur: 290 },
  { scene: "steps", from: 1187, dur: 436 },
  { scene: "cheaperServe", from: 1629, dur: 250 },
  { scene: "stats", from: 1884, dur: 615 },
  { scene: "toolStack", from: 2502, dur: 150 },
  { scene: "heroLaunch", from: 2664, dur: 300 },
  { scene: "scaleTrust", from: 2980, dur: 390 },
  { scene: "source", from: 3390, dur: 385 },
  { scene: "adFlood", from: 3785, dur: 300 },
  { scene: "speedWall", from: 4242, dur: 320 },
  { scene: "obstacles", from: 4590, dur: 400 },
  { scene: "statReceipt", from: 5000, dur: 410 },
  { scene: "flow", from: 5590, dur: 260 },
  { scene: "compare", from: 5943, dur: 610 },
  { scene: "notMagic", from: 6680, dur: 330 },
  { scene: "missingPieces", from: 7065, dur: 280 },
  { scene: "statReceipt", from: 7370, dur: 340 },
  { scene: "steps", from: 7913, dur: 260 },
  { scene: "expectation", from: 8180, dur: 240 },
  { scene: "source", from: 8426, dur: 460 },
  { scene: "gapBridge", from: 8898, dur: 370 },
  { scene: "speedLayer", from: 9282, dur: 230 },
  { scene: "plumbing", from: 9528, dur: 355 },
  { scene: "dataCenter", from: 9998, dur: 260 },
  { scene: "nearBottleneck", from: 10265, dur: 430 },
  { scene: "steps", from: 10795, dur: 380 },
  { scene: "solidStack", from: 11925, dur: 400 },
  { scene: "compare", from: 12345, dur: 640 },
  { scene: "steps", from: 13086, dur: 280 },
  { scene: "race", from: 13674, dur: 540 },
  { scene: "breakthrough", from: 14180, dur: 400 },
  { scene: "thresholdGate", from: 14598, dur: 480 },
  { scene: "workOverTokens", from: 15087, dur: 540 },
];

export const CLAUDE_WEALTH_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));

// map generic action-cue kinds for scenes reused under different names here
const cueKind = (b: Beat): string =>
  b.scene === "solidStack" ? "solidStack" : b.scene;

export const ClaudeWealthVisuals: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0:02 HOOK — the bright question crossed out, the darker one rises */}
      <Sequence from={66} durationInFrames={250} premountFor={30}>
        <QuestionFlipScene durationInFrames={250} q1="CAN CLAUDE MAKE ME RICH?" q2="WHAT KIND OF MILLIONAIRE?" q1At={48} crossAt={154} kicker="THE WRONG QUESTION" />
      </Sequence>

      {/* 0:10 TWO VERSIONS — dream robot vs warning robot */}
      <Sequence from={320} durationInFrames={540} premountFor={30}>
        <ReactionsScene durationInFrames={540} kicker="TWO VERSIONS OF THE STORY" leftBubble="THE DREAM" leftPose="celebrate" leftAccent="#34D399" leftAt={89} rightBubble="THE WARNING" rightPose="worried" rightAccent="#EF4444" rightAt={351} stamp="FASTER THAN TRUST" stampColor="#F59E0B" pointAt={463} />
      </Sequence>

      {/* 0:29 HEADLINES HIDE — placard drops, no receipts behind it */}
      <Sequence from={890} durationInFrames={290} premountFor={30}>
        <BenchmarksLieScene durationInFrames={290} kicker="MOST VIDEOS SKIP THIS" title="SHOW THE RECEIPTS" messLabels={["NO PROOF", "NO AUDIT", "NO RECEIPTS"]} />
      </Sequence>

      {/* 0:40 THE TEST — three questions */}
      <Sequence from={1187} durationInFrames={436} premountFor={30}>
        <StepsScene durationInFrames={436} kicker="ONE SIMPLE TEST" title="THE WEALTH TEST" steps={[{ label: "Bottleneck removed?", at: 171 }, { label: "Market paid?", at: 262 }, { label: "Survived scrutiny?", at: 347 }]} />
      </Sequence>

      {/* 0:54 BIG NUMBER vs RECEIPTS */}
      <Sequence from={1629} durationInFrames={250} premountFor={30}>
        <CheaperToServeScene durationInFrames={250} kicker="THE FILTER" title="THUMBNAILS ≠ BUSINESSES" leftLabel="BIG NUMBER" rightLabel="RECEIPTS" />
      </Sequence>

      {/* 1:03 MEDVI — the reported numbers (labelled as reported) */}
      <Sequence from={1884} durationInFrames={615} premountFor={30}>
        <StatCountersScene durationInFrames={615} kicker="MEDVI — REPORTED, NOT AUDITED" title="THE DREAM STORY" stats={[
          { value: 2, suffix: "", label: "People", at: 205, accent: "#D97757" },
          { value: 20, suffix: "K", label: "Upfront", at: 258, accent: "#C15F3C" },
          { value: 401, suffix: "M", label: "2025 revenue*", at: 347, accent: "#34D399" },
          { value: 1.8, suffix: "B", decimals: 1, label: "2026 pace*", at: 531, accent: "#F59E0B" },
        ]} />
      </Sequence>

      {/* 1:23 THE STACK — Claude + ChatGPT + Grok */}
      <Sequence from={2502} durationInFrames={150} premountFor={30}>
        <ToolStackScene durationInFrames={150} kicker="THE STACK" title="CLAUDE WAS ONE OF THREE" blocks={[{ label: "CLAUDE", at: 8, hero: true }, { label: "CHAT GPT", at: 103, hero: false }, { label: "GROK", at: 131, hero: false }]} />
      </Sequence>

      {/* 1:29 WHY IT EXPLODED — the dream rig launches */}
      <Sequence from={2664} durationInFrames={300} premountFor={30}>
        <HeroLaunchScene durationInFrames={300} kicker="WHY IT EXPLODED" title="TINY TEAM, GIANT MARKET" logo={<ClaudeMark size={100} />} blockLabel="TINY TEAM" moduleLabel="CLAUDE" />
      </Sequence>

      {/* 1:39 SCALE CUTS BOTH WAYS — the crack */}
      <Sequence from={2980} durationInFrames={390} premountFor={30}>
        <ScaleTrustScene durationInFrames={390} kicker="THE UNCOMFORTABLE PART" title="CLAUDE SCALES EVERYTHING" goods={[{ label: "OUTPUT", at: 76 }, { label: "OPS", at: 149 }, { label: "SPEED", at: 215 }]} crackAt={362} />
      </Sequence>

      {/* 1:53 FDA RECEIPT (mode E) */}
      <Sequence from={3390} durationInFrames={385} premountFor={30}>
        <SourceCardScene durationInFrames={385} kicker="THE RECEIPT" title="FDA WARNING LETTER" sourceName="fda.gov — press announcement" lines={[{ text: "FDA warns 30 telehealth companies" }, { text: "compounded GLP-1 marketing claims", highlight: true }, { text: "MedVi: cited site was an affiliate's" }]} />
      </Sequence>

      {/* 2:06 AD FLOOD — thousands of ads, fake personas */}
      <Sequence from={3785} durationInFrames={300} premountFor={30}>
        <AdFloodScene durationInFrames={300} kicker="THEN CAME THE ADS" title="PERSONAS THAT WEREN'T REAL" badgeAt={171} />
      </Sequence>

      {/* 2:21 FASTER THAN TRUST — the crash */}
      <Sequence from={4242} durationInFrames={320} premountFor={30}>
        <SpeedWallScene durationInFrames={320} kicker="THE PATTERN" title="FASTER THAN TRUST" wallLabel="TRUST" rocketLabel="GROWTH" />
      </Sequence>

      {/* 2:33 VULCAN — building through the regulatory walls */}
      <Sequence from={4590} durationInFrames={400} premountFor={30}>
        <ObstacleRunScene durationInFrames={400} kicker="THE QUIETER STORY" title="VULCAN × CLAUDE CODE" walls={[{ label: "REGULATION", drops: true }, { label: "COMPLEXITY", drops: true }, { label: "PROCUREMENT", drops: true }]} />
      </Sequence>

      {/* 2:47 THE DIFFERENT RECEIPT — $10.9M seed, gov customer */}
      <Sequence from={5000} durationInFrames={410} premountFor={30}>
        <StatReceiptScene durationInFrames={410} kicker="A DIFFERENT KIND OF RECEIPT" title="GOV CUSTOMER, THEN" value={10.9} decimals={1} prefix="$" suffix="M" label="SEED ROUND — REPORTED" source={{ name: "PR Newswire / Axios, Oct 2025", url: "https://www.prnewswire.com/news-releases/vulcan-technologies-raises-10-9m-seed-round-to-modernize-regulatory-law-with-ai-302579056.html" }} />
      </Sequence>

      {/* 3:06 THE ENTIRE GAME — flow */}
      <Sequence from={5590} durationInFrames={260} premountFor={30}>
        <FlowScene durationInFrames={260} kicker="THE ENTIRE GAME" title="BOTTLENECK → SPEED → BUYER" nodes={[{ label: "Bottleneck" }, { label: "Claude speed" }, { label: "Buyer pays" }]} />
      </Sequence>

      {/* 3:18 MEDVI vs VULCAN */}
      <Sequence from={5943} durationInFrames={610} premountFor={30}>
        <CompareCard kicker="EXCITING vs INSTRUCTIVE" left={{ title: "MEDVI", items: ["scaled growth", "fragile trust"], accent: "#F59E0B", mark: "!" }} right={{ title: "VULCAN", items: ["compressed execution", "validated buyer"], accent: "#34D399", mark: "»" }} leftDelay={100} rightDelay={285} durationInFrames={610} />
      </Sequence>

      {/* 3:43 OUTLIERS ≠ ADVICE — wand rejected */}
      <Sequence from={6680} durationInFrames={330} premountFor={30}>
        <NotMagicScene durationInFrames={330} kicker="WHERE IT GOES WRONG" title="OUTLIERS ≠ ADVICE" badges={[{ label: "NOT ADVICE", at: 217 }, { label: "DOPAMINE TRAP", at: 249 }]} />
      </Sequence>

      {/* 3:55 WHAT'S MISSING — the foundation tower collapses */}
      <Sequence from={7065} durationInFrames={280} premountFor={30}>
        <MissingPiecesScene durationInFrames={280} kicker="THE AVERAGE START" title="NO FOUNDATION, NO COPY" labels={["THE OUTLIER", "TEAM", "PROVEN BUYER", "DISTRIBUTION", "BIG MARKET"]} pullAt={47} collapseAt={213} />
      </Sequence>

      {/* 4:07 THE $200 REALITY */}
      <Sequence from={7370} durationInFrames={340} premountFor={30}>
        <StatReceiptScene durationInFrames={340} kicker="WHERE REALITY STARTS" value={200} prefix="$" suffix="/MO" label="MEDIAN SIDE HUSTLE" source={{ name: "SurveyMonkey side-hustle survey, 2025", url: "https://www.surveymonkey.com/curiosity/side-hustle-statistics/" }} />
      </Sequence>

      {/* 4:24 THE REAL LADDER */}
      <Sequence from={7913} durationInFrames={260} premountFor={30}>
        <StepsScene durationInFrames={260} kicker="THE FIRST REAL WIN" title="THE LADDER" steps={[{ label: "Leverage", at: 13 }, { label: "Consistency", at: 52 }, { label: "Income", at: 124 }]} />
      </Sequence>

      {/* 4:32 EXPECTATIONS — rich vs faster */}
      <Sequence from={8180} durationInFrames={240} premountFor={30}>
        <ExpectationScene durationInFrames={240} kicker="SET IT RIGHT" title="FASTER, NOT RICH" leftAt={49} rightAt={119} />
      </Sequence>

      {/* 4:41 ECONOMIC INDEX RECEIPT (mode E) */}
      <Sequence from={8426} durationInFrames={460} premountFor={30}>
        <SourceCardScene durationInFrames={460} kicker="THE BETTER SIGNAL" title="WHERE CLAUDE SHOWS UP" sourceName="anthropic.com/economic-index" lines={[{ text: "higher-value work" }, { text: "coding · writing · analysis", highlight: true }, { text: "speed + judgement tasks" }]} />
      </Sequence>

      {/* 4:57 KNOWING → DOING — the bridge */}
      <Sequence from={8898} durationInFrames={370} premountFor={30}>
        <GapBridgeScene durationInFrames={370} kicker="WHY IT'S VALUABLE" title="KNOWING → DOING" bridgeAt={187} />
      </Sequence>

      {/* 5:09 MORE LEVERAGE — module bolts onto the builder */}
      <Sequence from={9282} durationInFrames={230} premountFor={30}>
        <SpeedLayerScene durationInFrames={230} kicker="WHY BUILDERS CARE" title="MORE LEVERAGE" blockLabel="BUILDER" moduleLabel="CLAUDE" />
      </Sequence>

      {/* 5:18 JENSEN'S GRENADE — the plumber */}
      <Sequence from={9528} durationInFrames={355} premountFor={30}>
        <PlumbingScene durationInFrames={355} kicker="JENSEN'S GRENADE" title="PLUMBERS & ELECTRICIANS" />
      </Sequence>

      {/* 5:33 THE PHYSICAL BOTTLENECK — data centers need people */}
      <Sequence from={9998} durationInFrames={260} premountFor={30}>
        <DataCenterScene durationInFrames={260} kicker="AI NEEDS POWER" title="SOMEONE BUILDS THIS" overheatAt={64} fixAt={168} />
      </Sequence>

      {/* 5:42 MONEY FLOWS TO THE CONSTRAINT */}
      <Sequence from={10265} durationInFrames={430} premountFor={30}>
        <NearBottleneckScene durationInFrames={430} kicker="THE LESSON" title="STAND AT THE BOTTLENECK" coinsAt={325} labels={["SOFTWARE", "REGULATION", "INFRA"]} />
      </Sequence>

      {/* 5:60 ASK THIS INSTEAD */}
      <Sequence from={10795} durationInFrames={380} premountFor={30}>
        <StepsScene durationInFrames={380} kicker="ASK THIS INSTEAD" title="TWO QUESTIONS" steps={[{ label: "What constraint?", at: 80 }, { label: "Who would pay?", at: 253 }]} />
      </Sequence>

      {/* 6:38 WHAT REAL STORIES HAVE — the stack that HOLDS */}
      <Sequence from={11925} durationInFrames={400} premountFor={30}>
        <StackCollapseScene durationInFrames={400} kicker="THE REAL STORIES" title="PROBLEM · BUYER · PROOF" drops={[46, 81, 140]} labels={["PAINFUL PROBLEM", "URGENT BUYER", "PROOF"]} stamp="THE WEALTH TEST" stampAt={255} />
      </Sequence>

      {/* 6:52 VULCAN vs MEDVI — as roadmaps */}
      <Sequence from={12345} durationInFrames={640} premountFor={30}>
        <CompareCard kicker="WHICH ROADMAP?" left={{ title: "VULCAN", items: ["public problem", "gov customer", "seed round"], accent: "#34D399", mark: "»" }} right={{ title: "MEDVI", items: ["growth claim", "FDA scrutiny", "ad questions"], accent: "#EF4444", mark: "!" }} leftDelay={60} rightDelay={290} durationInFrames={640} />
      </Sequence>

      {/* 7:16 THE MECHANISM */}
      <Sequence from={13086} durationInFrames={280} premountFor={30}>
        <StepsScene durationInFrames={280} kicker="COPY THE MECHANISM" title="NOT THE HEADLINE" steps={[{ label: "What did AI remove?", at: 126 }, { label: "Who paid?", at: 174 }, { label: "Outside proof?", at: 219 }]} />
      </Sequence>

      {/* 7:36 DANGEROUSLY FAST — the race */}
      <Sequence from={13674} durationInFrames={540} premountFor={30}>
        <RaceFasterScene durationInFrames={540} kicker="USE IT FOR SPEED" title="DANGEROUSLY FAST" slowLabel="WITHOUT" fastLabel="WITH CLAUDE" blockLabel="YOU" />
      </Sequence>

      {/* 7:53 AIM IT AT THE BOTTLENECK — breakthrough */}
      <Sequence from={14180} durationInFrames={400} premountFor={30}>
        <BreakthroughScene durationInFrames={400} kicker="AIM THE SPEED" title="THROUGH THE BOTTLENECK" wallLabel="BOTTLENECK" chips={[{ label: "SIDE INCOME", at: 100 }, { label: "SMALL PRODUCTS", at: 152 }, { label: "REAL BUSINESS", at: 203 }]} />
      </Sequence>

      {/* 8:06 STUDY OR SCROLL — the gate */}
      <Sequence from={14598} durationInFrames={480} premountFor={30}>
        <ThresholdGateScene durationInFrames={480} kicker="NEXT TIME YOU SEE ONE" title="STUDY OR SCROLL" failLabel="VAGUE" passLabel="RECEIPTS" zoneLabel="PROOF" skipStamp="SCROLL" />
      </Sequence>

      {/* 8:23 CLOSING — leverage pointed at what the market wants */}
      <Sequence from={15087} durationInFrames={540} premountFor={30}>
        <WorkOverTokensScene durationInFrames={540} kicker="THE REAL STORY" title="LEVERAGE > HYPE" />
      </Sequence>

      {/* 8:43 OUTRO — anchored to the spoken "subscribe" (15684), runs to the end */}
      <Sequence from={15678} durationInFrames={CLAUDE_WEALTH_DUR - 15678} premountFor={30}>
        <Fable5Outro durationInFrames={CLAUDE_WEALTH_DUR - 15678} kicker="REAL SIGNALS — NO HYPE" tag="Drop your bottleneck below — I'll tell you if Claude can attack it" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ClaudeWealthVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ClaudeWealthVisuals />

      {/* ===== MUSIC — low beds over key sections ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={40} durationInFrames={840} volume={0.07} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={2980} durationInFrames={1600} volume={0.08} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={7370} durationInFrames={1520} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={13674} durationInFrames={1900} volume={0.08} startFrom={600} fadeInFrames={45} fadeOutFrames={140} />
      <MusicBed src={staticFile("music/outro.MP3")} from={15678} durationInFrames={CLAUDE_WEALTH_DUR - 15678} volume={0.075} fadeInFrames={45} />

      {/* ===== SFX — a whoosh per beat + derived per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 15678].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(cueKind(b), b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* step/stat ticks on the checklist + counter beats */}
      {[1358, 1449, 1534, 2089, 2142, 2231, 2415, 7926, 7965, 8037, 10875, 11048, 13212, 13260, 13305].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={15690} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};
