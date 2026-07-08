import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { WaitingScene } from "./scenes/WaitingScene";
import { SystemBreakScene } from "./scenes/SystemBreakScene";
import { BenefitMetersScene } from "./scenes/BenefitMetersScene";
import { TitleScene } from "./scenes/TitleScene";
import { StepsScene } from "./scenes/StepsScene";
import { EscalationScene } from "./scenes/EscalationScene";
import { StatCountersScene, Stat } from "./scenes/StatCountersScene";
import { SourceCardScene } from "./scenes/SourceCardScene";
import { FinalTakeawayScene } from "./scenes/FinalTakeawayScene";
import { FlowScene } from "./scenes/FlowScene";
import { HeroLaunchScene, SpeedLayerScene, SameCoreScene, RaceFasterScene } from "./scenes/LaunchScenes";
import { ReactionsScene, BoredMattersScene, ObstacleRunScene, NotMagicScene } from "./scenes/RobotScenes";
import { StackCollapseScene, ScaleCostScene } from "./scenes/CostScenes";
import {
  BillPrinterScene, HiddenCostScene, SpeedWallScene, CheaperToServeScene, LessPainScene,
  BenchmarksLieScene, MigrateStopScene, ThresholdGateScene, PlumbingScene, WorkOverTokensScene, FinishCheckScene,
} from "./scenes/MetaphorScenes";

// DSparkVideo — transparent cutaway overlay for the DeepSeek "DSpark" explainer
// (~6m39s, 11967f @ 30fps). Titles anchored to their SPOKEN frame (sec×30). EVERY
// beat is a full motion-graphics SCENE routed by narrative purpose (title / source
// / steps / stats / escalation / waiting / break / benefits / final) — no plain
// bullet slides. Transparent gaps = talking head. Timing/sound unchanged.

type SceneKind =
  | "title" | "waiting" | "break" | "benefits" | "escalation" | "steps" | "stats" | "source" | "final" | "flow"
  | "heroLaunch" | "speedLayer" | "sameCore" | "boredMatters" | "obstacles" | "notMagic" | "race" | "stackCollapse" | "scaleCost"
  | "billPrinter" | "hiddenCost" | "speedWall" | "cheaperServe" | "lessPain" | "benchLie" | "migrateStop" | "thresholdGate" | "plumbing" | "workOverTokens" | "finishCheck";
type FlowSpec = { nodes: { label: string; state?: "ok" | "error" }[]; retry?: [number, number]; retryLabel?: string };
type Card = {
  from: number; dur: number; scene: SceneKind;
  kicker?: string; title: string; subtitle?: string; items?: string[]; itemDelays?: number[]; icon?: React.ReactNode;
  accent?: string; denied?: boolean; titleSize?: number;
  stats?: Stat[]; source?: { name: string; lines: { text: string; highlight?: boolean }[] }; stamp?: string; stampAt?: number; flow?: FlowSpec;
};

const CARDS: Card[] = [
  { from: 66, dur: 180, scene: "heroLaunch", kicker: "JUST RELEASED", title: "DEEPSEEK DSPARK" }, // 0:02.4
  { from: 623, dur: 230, scene: "sameCore", kicker: "BOTH REACTIONS MISSED IT", title: "NOT A NEW BRAIN" }, // 0:20.9
  { from: 871, dur: 175, scene: "source", kicker: "THE MODEL CARD", title: "SAME CHECKPOINT", source: { name: "model-card.md", lines: [{ text: "V4 checkpoint" }, { text: "+ draft module", highlight: true }, { text: "same weights" }] } }, // 0:29.2
  { from: 1057, dur: 260, scene: "boredMatters", kicker: "ONE OF THOSE CHANGES", title: "BORING — BUT IT MATTERS" }, // 0:35.4; "matters" rel ~56
  { from: 1333, dur: 320, scene: "waiting", kicker: "THE REAL PROBLEM", title: "IT'S WAITING", items: ["PROMPT", "TOOL", "RETRY"], itemDelays: [6, 59, 102] }, // 0:44.6
  { from: 1660, dur: 260, scene: "stackCollapse", kicker: "AND IT COMPOUNDS", title: "CALLS STACK UP" }, // 0:55.5; collapse on "broken" rel ~205
  { from: 1925, dur: 300, scene: "obstacles", kicker: "WHY IT MATTERS", title: "AGENTS, LESS PAINFUL" }, // 1:04.4
  { from: 2300, dur: 230, scene: "speedLayer", kicker: "SO WHAT IS DSPARK?", title: "A SPEED LAYER", subtitle: "for DeepSeek V4" }, // 1:16.9
  { from: 2532, dur: 610, scene: "flow", kicker: "HOW IT WORKS", title: "DRAFT, THEN VERIFY", flow: { nodes: [{ label: "Draft" }, { label: "Verify" }, { label: "Accept" }], retry: [1, 0], retryLabel: "Wrong" } }, // 1:24.6

  { from: 3312, dur: 260, scene: "notMagic", kicker: "WHAT IT'S NOT", title: "NOT MAGIC", items: ["HALLUCINATIONS", "SENIOR DEV"], itemDelays: [42, 173] }, // 1:50.6
  { from: 3582, dur: 280, scene: "race", kicker: "WHAT IT IS", title: "JUST FASTER" }, // 1:59.6
  { from: 4501, dur: 215, scene: "billPrinter", kicker: "BUT BE CAREFUL", title: "FASTER ≠ CHEAPER BILL" }, // 2:30.2
  { from: 4721, dur: 320, scene: "break", kicker: "PRODUCTION IS MESSIER", title: "IT ALL STILL BREAKS", items: ["PROMPTS", "TOOLS", "RETRIES"], itemDelays: [6, 110, 150] }, // 2:37.5
  { from: 5072, dur: 360, scene: "hiddenCost", kicker: "THE REAL QUESTION", title: "GET CHEAPER?" }, // 2:49.3
  { from: 5496, dur: 280, scene: "speedWall", kicker: "SPEED ISN'T SUCCESS", title: "SPEED ≠ SUCCESS" }, // 2:59.5
  { from: 5801, dur: 400, scene: "cheaperServe", kicker: "THE REAL STORY", title: "CHEAPER TO SERVE" }, // 3:13.4
  { from: 6218, dur: 620, scene: "scaleCost", kicker: "SPEED = MONEY AT SCALE", title: "AT SCALE IT ADDS UP", itemDelays: [6, 237, 567] }, // 3:27.5
  { from: 6950, dur: 560, scene: "stats", kicker: "AND IT'S NOT SMALL", title: "V4 IS HUGE", stats: [{ value: 284, suffix: "B", label: "Flash", at: 87, accent: "#06B6D4" }, { value: 1.6, suffix: "T", decimals: 1, label: "Pro", at: 303, accent: "#3B82F6" }, { value: 1, suffix: "M", label: "Context", at: 502, accent: "#34D399" }] }, // 3:51.9
  { from: 7652, dur: 275, scene: "lessPain", kicker: "THE REAL GOAL", title: "BIG MODELS, LESS PAIN" }, // 4:15.3
  { from: 7930, dur: 320, scene: "benefits", kicker: "IF IT WORKS", title: "CHEAPER · FASTER · USABLE", itemDelays: [14, 90, 164] }, // 4:24.4
  { from: 8257, dur: 300, scene: "benchLie", kicker: "THE CATCH", title: "BENCHMARKS LIE" }, // 4:35.4
  { from: 8562, dur: 280, scene: "migrateStop", kicker: "RULE #1", title: "DON'T MIGRATE — TEST" }, // 4:45.6
  { from: 9038, dur: 320, scene: "steps", kicker: "RUN YOUR OWN TEST", title: "MEASURE 3 THINGS", items: ["Faster?", "Succeeds?", "Cheaper?"], itemDelays: [6, 111, 175] }, // 5:01.5
  { from: 9501, dur: 320, scene: "thresholdGate", kicker: "MY THRESHOLD", title: "20–30% OR SKIP" }, // 5:16.9
  { from: 10202, dur: 320, scene: "plumbing", kicker: "THE TAKEAWAY", title: "PLUMBING > HYPE" }, // 5:40.3
  { from: 10592, dur: 300, scene: "workOverTokens", kicker: "WHAT MATTERS", title: "WORK > TOKENS" }, // 5:53.3
  { from: 11294, dur: 360, scene: "finishCheck", kicker: "THE ONLY QUESTION", title: "CHEAPER TO FINISH?", stamp: "THE REAL TEST", stampAt: 150 }, // 6:22.2
];

// Full-screen cutaway windows (all scenes + the 3 compare cards). Used by the
// final cut for the corner PiP. Outro excluded (clean subscribe screen).
export const CUTAWAY_WINDOWS: { from: number; dur: number }[] = [
  ...CARDS.map((c) => ({ from: c.from, dur: c.dur })),
  { from: 254, dur: 360 },
  { from: 3875, dur: 480 },
];

const chipsFromItems = (c: Card) => (c.items ?? []).map((label, i) => ({ label, at: (c.itemDelays ?? [])[i] ?? 20 + i * 16, danger: c.denied }));

// Routes each beat to its purpose-fit motion-graphics scene.
const renderScene = (c: Card) => {
  switch (c.scene) {
    case "waiting":
      return <WaitingScene durationInFrames={c.dur} kicker={c.kicker} chips={chipsFromItems(c)} />;
    case "break":
      return <SystemBreakScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} badges={chipsFromItems(c)} errorAt={130} />;
    case "benefits":
      return <BenefitMetersScene durationInFrames={c.dur} kicker={c.kicker} delays={[(c.itemDelays ?? [])[0] ?? 14, (c.itemDelays ?? [])[1] ?? 90, (c.itemDelays ?? [])[2] ?? 164]} stampAt={c.dur - 108} />;
    case "escalation":
      return <EscalationScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} items={chipsFromItems(c)} />;
    case "steps":
      return <StepsScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} steps={chipsFromItems(c)} />;
    case "stats":
      return <StatCountersScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} stats={c.stats ?? []} />;
    case "source":
      return <SourceCardScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} sourceName={c.source?.name ?? ""} lines={c.source?.lines ?? []} />;
    case "flow":
      return <FlowScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} nodes={c.flow?.nodes ?? []} retry={c.flow?.retry} retryLabel={c.flow?.retryLabel} />;
    case "heroLaunch":
      return <HeroLaunchScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "speedLayer":
      return <SpeedLayerScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} subtitle={c.subtitle} />;
    case "sameCore":
      return <SameCoreScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "boredMatters":
      return <BoredMattersScene durationInFrames={c.dur} kicker={c.kicker} wakeAt={56} />;
    case "obstacles":
      return <ObstacleRunScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "notMagic":
      return <NotMagicScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} badges={chipsFromItems(c)} />;
    case "race":
      return <RaceFasterScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "stackCollapse":
      return <StackCollapseScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} collapseAt={205} />;
    case "scaleCost":
      return <ScaleCostScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} phases={[(c.itemDelays ?? [])[0] ?? 6, (c.itemDelays ?? [])[1] ?? 237, (c.itemDelays ?? [])[2] ?? 567]} />;
    case "billPrinter":
      return <BillPrinterScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "hiddenCost":
      return <HiddenCostScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "speedWall":
      return <SpeedWallScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "cheaperServe":
      return <CheaperToServeScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "lessPain":
      return <LessPainScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "benchLie":
      return <BenchmarksLieScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "migrateStop":
      return <MigrateStopScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "thresholdGate":
      return <ThresholdGateScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "plumbing":
      return <PlumbingScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "workOverTokens":
      return <WorkOverTokensScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} />;
    case "finishCheck":
      return <FinishCheckScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} stamp={c.stamp} stampAt={c.stampAt} />;
    case "final":
      return <FinalTakeawayScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} subtitle={c.subtitle} stamp={c.stamp} stampAt={c.stampAt} accent={c.accent} />;
    default:
      return <TitleScene durationInFrames={c.dur} kicker={c.kicker} title={c.title} subtitle={c.subtitle} icon={c.icon} chips={c.items ? chipsFromItems(c) : undefined} accent={c.accent} titleSize={c.titleSize} seed={c.from} />;
  }
};

// Visual-only track (all scenes + compares + outro, NO audio). Reused by the
// combined cut without re-triggering the SFX/music in DSparkVideo below.
export const DSparkVisuals: React.FC = () => {
  return (
    <AbsoluteFill>
      {CARDS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.dur} premountFor={30}>
          {renderScene(c)}
        </Sequence>
      ))}

      {/* 0:08 — two reactions acted out by robots (AGI panic vs shrug) */}
      <Sequence from={254} durationInFrames={360} premountFor={30}>
        <ReactionsScene durationInFrames={360} leftAt={103} rightAt={175} pointAt={262} />
      </Sequence>

      {/* 2:09 — the reported numbers */}
      <Sequence from={3875} durationInFrames={480} premountFor={30}>
        <CompareCard kicker="THE REPORTED NUMBERS" left={{ title: "V4 FLASH", items: ["60–85% faster", "per user"], accent: "#34D399", mark: "»" }} right={{ title: "V4 PRO", items: ["57–78% faster", "per user"], accent: "#06B6D4", mark: "»" }} leftDelay={87} rightDelay={306} durationInFrames={480} />
      </Sequence>

      {/* 6:29 — outro, anchored to the spoken "subscribe" (11678), runs to the end */}
      <Sequence from={11661} durationInFrames={306} premountFor={30}>
        <Fable5Outro durationInFrames={306} kicker="PRACTICAL AI — NO HYPE" tag="Drop your setup below — I'll tell you if DSpark's worth testing" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DSparkVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <DSparkVisuals />

      {/* ===== BACKGROUND MUSIC — short low beds over key sections only ===== */}
      <MusicBed src={staticFile("music/calm.MP3")}    from={40}    durationInFrames={620}  volume={0.07} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/tension.MP3")} from={4501}  durationInFrames={700}  volume={0.08} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")}    from={6950}  durationInFrames={900}  volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={10202} durationInFrames={900}  volume={0.085} fadeInFrames={45} fadeOutFrames={140} />
      <MusicBed src={staticFile("music/outro.MP3")}   from={11661} durationInFrames={306}  volume={0.075} fadeInFrames={45} />

      {/* ===== SOUND EFFECTS — audible under the boosted VO (§6 levels) ===== */}
      {[...CARDS.map((c) => c.from), 254, 3875, 11661].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {CARDS.flatMap((c) => (c.itemDelays ?? []).map((d) => (
        <SfxCue key={`t-${c.from}-${d}`} from={c.from + d + 6} src={SFX.switch} volume={0.25} />
      )))}
      {[357, 429, 3962, 4181, 5881, 6044].map((f) => (
        <SfxCue key={`wp-${f}`} from={f} src={SFX.whip} volume={0.35} />
      ))}
      {[2300, 10202].map((f) => (
        <SfxCue key={`pt-${f}`} from={f} src={SFX.pageTurn} volume={0.35} />
      ))}
      {[3962, 4181, 6455, 9507, 11534].map((f) => (
        <SfxCue key={`d-${f}`} from={f} src={SFX.ding} volume={0.45} />
      ))}
      {/* per-scene ACTION hits, derived from each scene's own timing formulas
          (src/motion/sfx-cues.ts) — retime a scene and its sound follows */}
      {CARDS.flatMap((c) => sceneActionCues(c.scene, c.from, c.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i)} />
      ))}
      {[629, 1339, 5502].map((f) => (
        <SfxCue key={`s-${f}`} from={f} src={SFX.shutter} volume={0.4} />
      ))}
      <SfxCue from={4851} src={SFX.boom} volume={0.4} />
    </AbsoluteFill>
  );
};
