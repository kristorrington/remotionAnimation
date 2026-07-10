import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { CompareCard } from "./components/CompareCard";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { sceneActionCues } from "./motion/sfx-cues";
import { MusicBed } from "./components/MusicBed";
import { StepsScene } from "./scenes/StepsScene";
import { FlowScene } from "./scenes/FlowScene";
import { SpeedLayerScene } from "./scenes/LaunchScenes";
import { ReactionsScene, NotMagicScene } from "./scenes/RobotScenes";
import { HiddenCostScene, ThresholdGateScene } from "./scenes/MetaphorScenes";
import { QuestionFlipScene, ExpectationScene } from "./scenes/WealthScenes";
import {
  PickCheaperScene, ProcessAroundScene, LeakDocScene, EffortDialScene, OverkillScene,
  RoutingLanesScene, AccessWindowScene, RateCardScene, Rule8020Scene, YesRunScene,
} from "./scenes/RoutingScenes";

// ModelRoutingVideo — transparent cutaway overlay for the "you don't need Fable
// for every job" explainer (~8m43s, 15689f @ 30fps). Beats classified per
// CLAUDE.md §3; frames anchored to the whisper words in captionsData.ts
// (frame = seconds × 30, from ≈ spoken − 6). Transparent gaps = talking head.

export const MODEL_ROUTING_DUR = 15689;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  { scene: "pickCheaper", from: 32, dur: 260 },
  { scene: "processAround", from: 330, dur: 350 },
  { scene: "notMagic", from: 743, dur: 380 },
  { scene: "compare", from: 1200, dur: 360 },
  { scene: "steps", from: 1606, dur: 330 },
  { scene: "leakDoc", from: 2010, dur: 700, fullscreen: true },
  { scene: "steps", from: 2748, dur: 340 },
  { scene: "reactions", from: 3105, dur: 540 },
  { scene: "flow", from: 3824, dur: 330 },
  { scene: "effortDial", from: 4160, dur: 470 },
  { scene: "overkill", from: 4636, dur: 320, fullscreen: true },
  { scene: "effortDial", from: 4956, dur: 880 },
  { scene: "hiddenCost", from: 6074, dur: 400, fullscreen: true },
  { scene: "questionFlip", from: 6480, dur: 330 },
  { scene: "speedLayer", from: 6816, dur: 480 },
  { scene: "steps", from: 7580, dur: 440 },
  { scene: "flow", from: 8106, dur: 420 },
  { scene: "expectation", from: 8582, dur: 540 },
  { scene: "routingLanes", from: 9128, dur: 890, fullscreen: true },
  { scene: "thresholdGate", from: 10062, dur: 700, fullscreen: true },
  { scene: "accessWindow", from: 10836, dur: 560 },
  { scene: "steps", from: 11454, dur: 560 },
  { scene: "rateCard", from: 12060, dur: 560 },
  { scene: "rule8020", from: 12780, dur: 600, fullscreen: true },
  { scene: "routingLanes", from: 13670, dur: 700 },
  { scene: "yesRun", from: 14440, dur: 680, fullscreen: true },
  { scene: "processAround", from: 15121, dur: 380, fullscreen: true },
];

export const MODEL_ROUTING_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
// Spans where the animation OWNS the screen — the final cut hides the PiP here
// (hook, gags, systems and payoffs breathe; explanations keep the face).
export const MODEL_ROUTING_FULLSCREEN: { from: number; to: number }[] = [
  { from: 32, to: 292 }, // the hook scene opens the video full-screen
  ...BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur })),
];

export const ModelRoutingVisuals: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0:01 HOOK — you might not need the premium rig */}
      <Sequence from={32} durationInFrames={260} premountFor={30}>
        <PickCheaperScene durationInFrames={260} kicker="BEFORE YOU PAY PREMIUM" title="YOU MIGHT NOT NEED FABLE" chips={[{ label: "EFFORT", at: 123 }, { label: "INSTRUCTIONS", at: 166 }, { label: "ROUTING", at: 214 }]} />
      </Sequence>

      {/* 0:11 THE MAGIC ISN'T ONLY THE MODEL — process modules bolt on */}
      <Sequence from={330} durationInFrames={350} premountFor={30}>
        <ProcessAroundScene durationInFrames={350} kicker="IF FABLE FEELS MAGICAL" title="THE PROCESS AROUND IT" modules={[{ label: "PROCESS", at: 168 }, { label: "EFFORT", at: 229 }, { label: "ROUTING", at: 311 }]} />
      </Sequence>

      {/* 0:25 NOT A TRANSFORMATION — wand rejected */}
      <Sequence from={743} durationInFrames={380} premountFor={30}>
        <NotMagicScene durationInFrames={380} kicker="TO BE CLEAR" title="NOT OPUS → FABLE" badges={[{ label: "RIDICULOUS CLAIM", at: 76 }, { label: "BEHAVIOUR, NOT BRAIN", at: 170 }]} tint="#EF4444" />
      </Sequence>

      {/* 0:40 THE CLEAN VERSION — stronger vs cheaper */}
      <Sequence from={1200} durationInFrames={360} premountFor={30}>
        <CompareCard kicker="THE CLEAN VERSION" tint="#F59E0B" left={{ title: "FABLE 5", items: ["stronger", "2× the price"], accent: "#E8B84B", mark: "»" }} right={{ title: "OPUS 4.8", items: ["cheaper", "often enough"], accent: "#34D399", mark: "»" }} leftDelay={55} rightDelay={129} durationInFrames={360} />
      </Sequence>

      {/* 0:53 THE 5 RULES */}
      <Sequence from={1606} durationInFrames={330} premountFor={30}>
        <StepsScene durationInFrames={330} kicker="THE NEW GAME" title="FIVE RULES" tint="#D97757" steps={[{ label: "Copy the process", at: 28 }, { label: "Set effort", at: 84 }, { label: "Package a skill", at: 180 }, { label: "Route by risk", at: 233 }, { label: "Watch access", at: 284 }]} />
      </Sequence>

      {/* 1:07 RULE 1 — the leak is a rumour; steal the behaviour */}
      <Sequence from={2010} durationInFrames={700} premountFor={30}>
        <LeakDocScene durationInFrames={700} kicker="RULE 1" title="COPY THE PROCESS, NOT THE LEAK" stampAt={171} goodAt={534} />
      </Sequence>

      {/* 1:31 THE PATTERN WORTH STEALING */}
      <Sequence from={2748} durationInFrames={340} premountFor={30}>
        {/* tint cyan — the leak-doc scene before this one ends on a green wash */}
        <StepsScene durationInFrames={340} kicker="THE PATTERN" title="GOOD AGENT BEHAVIOUR" accent="#34D399" tint="#D97757" steps={[{ label: "No stale knowledge", at: 12 }, { label: "Never assume files", at: 56 }, { label: "Resolve unknowns", at: 115 }]} />
      </Sequence>

      {/* 1:43 IF FABLE DOES IT, OPUS CAN TOO — twin robots */}
      <Sequence from={3105} durationInFrames={540} premountFor={30}>
        <ReactionsScene durationInFrames={540} kicker="THE WHOLE TRICK" leftBubble="CHECKS FIRST" leftPose="celebrate" leftAccent="#E8B84B" leftAt={60} rightBubble="CAN TOO" rightPose="celebrate" rightAccent="#34D399" rightAt={134} stamp="SAME MOVES" stampColor="#D97757" pointAt={338} tint="#34D399" />
      </Sequence>

      {/* 2:07 THE OPERATING STYLE — nodes pop on the spoken verify/reason/act */}
      <Sequence from={3824} durationInFrames={330} premountFor={30}>
        <FlowScene durationInFrames={330} kicker="THE OPERATING STYLE" title="COPY THE OPERATING STYLE" nodes={[{ label: "Verify" }, { label: "Reason" }, { label: "Act" }]} nodeAts={[44, 107, 153]} tint="#D97757" />
      </Sequence>

      {/* 2:19 RULE 2 — the effort dial (what it is) */}
      <Sequence from={4160} durationInFrames={470} premountFor={30}>
        <EffortDialScene durationInFrames={470} kicker="RULE 2" title="SET EFFORT EXPLICITLY" sweep />
      </Sequence>

      {/* 2:35 THE ARCHITECT GAG */}
      <Sequence from={4636} durationInFrames={320} premountFor={30}>
        <OverkillScene durationInFrames={320} kicker="MAX EFFORT ON A TINY JOB" title="IT WORKS. IT'S EXPENSIVE." stampAt={200} />
      </Sequence>

      {/* 2:45 THE FIVE LEVELS — dial clicks through */}
      <Sequence from={4956} durationInFrames={880} premountFor={30}>
        <EffortDialScene durationInFrames={880} kicker="THE PRACTICAL VERSION" title="HOW MUCH THINKING?" stops={[
          { at: 8, label: "LOW", use: "quick checks" },
          { at: 196, label: "MED", use: "normal workflows" },
          { at: 371, label: "HIGH", use: "needs judgment" },
          { at: 522, label: "XHIGH", use: "coding + agents" },
          { at: 815, label: "MAX", use: "wrong = expensive" },
        ]} />
      </Sequence>

      {/* 3:22 MORE THINKING ≠ BETTER — chips land on the spoken failure modes */}
      <Sequence from={6074} durationInFrames={400} premountFor={30}>
        <HiddenCostScene durationInFrames={400} kicker="THE TRAP" title="MORE ≠ BETTER" chipLabels={["OVEREXPLAINS", "SECOND-GUESSES", "BURNS TOKENS"]} chipAts={[134, 190, 279]} tint="#EF4444" />
      </Sequence>

      {/* 3:36 THE QUESTION FLIP */}
      <Sequence from={6480} durationInFrames={330} premountFor={30}>
        <QuestionFlipScene durationInFrames={330} kicker="ASK THIS INSTEAD" q1="WHAT'S THE SMARTEST MODEL?" q2="WHAT DOES THIS TASK DESERVE?" q1At={30} crossAt={130} tint="#D97757" />
      </Sequence>

      {/* 3:47 RULE 3 — package the behaviour as a SKILL */}
      <Sequence from={6816} durationInFrames={480} premountFor={30}>
        <SpeedLayerScene durationInFrames={480} kicker="RULE 3" title="PACKAGE IT AS A SKILL" blockLabel="OPUS" moduleLabel="SKILL" tint="#34D399" />
      </Sequence>

      {/* 4:12 THE SKILL'S ONE JOB */}
      <Sequence from={7580} durationInFrames={440} premountFor={30}>
        <StepsScene durationInFrames={440} kicker="GIVE IT ONE JOB" title="SLOW DOWN BEFORE ACTING" tint="#D97757" steps={[{ label: "Inspect the context", at: 112 }, { label: "State uncertainty", at: 220 }, { label: "Cheapest sane path", at: 284 }]} />
      </Sequence>

      {/* 4:30 DISCIPLINE, NOT BRAIN */}
      <Sequence from={8106} durationInFrames={420} premountFor={30}>
        <FlowScene durationInFrames={420} kicker="THE BEHAVIOURAL UPGRADE" title="FABLE'S DISCIPLINE" nodes={[{ label: "Verify inputs" }, { label: "Plan" }, { label: "Execute" }]} nodeAts={[58, 97, 143]} tint="#34D399" />
      </Sequence>

      {/* 4:44 RULE 4 — route by risk, not ego */}
      <Sequence from={8582} durationInFrames={540} premountFor={30}>
        <ExpectationScene durationInFrames={540} kicker="RULE 4" title="ROUTE BY RISK, NOT EGO" leftAt={39} rightAt={206} leftLabel="PICK BY EGO" rightLabel="PICK BY RISK" leftCaption="OVERPAYS" rightCaption="SPENDS SMART" tint="#F59E0B" />
      </Sequence>

      {/* 5:04 THE ROUTING LANES */}
      <Sequence from={9128} durationInFrames={890} premountFor={30}>
        <RoutingLanesScene durationInFrames={890} kicker="THE ROUTING TABLE" title="MATCH TASK TO LANE" cards={[
          { label: "EXTRACT", lane: 0, at: 41 },
          { label: "FORMAT", lane: 0, at: 65 },
          { label: "CODE", lane: 1, at: 320 },
          { label: "ANALYSIS", lane: 1, at: 418 },
          { label: "AGENTIC / DEBUG", lane: 1, at: 560 },
          { label: "STILL FAILS?", lane: 2, at: 796 },
        ]} escalateAt={850} />
      </Sequence>

      {/* 5:35 THE ESCALATION PATH — cheapest that clears the bar */}
      <Sequence from={10062} durationInFrames={700} premountFor={30}>
        <ThresholdGateScene durationInFrames={700} kicker="FABLE = ESCALATION, NOT DEFAULT" title="CHEAPEST THAT CLEARS THE BAR" failLabel="HYPE PICK" passLabel="CLEARS IT" zoneLabel="QUALITY BAR" skipStamp="SKIP" tint="#34D399" />
      </Sequence>

      {/* 6:01 RULE 5 — the access window */}
      <Sequence from={10836} durationInFrames={560} premountFor={30}>
        <AccessWindowScene durationInFrames={560} kicker="RULE 5" title="WATCH THE ACCESS WINDOW" closeAt={164} openAt={199} creditsAt={435} />
      </Sequence>

      {/* 6:22 THE FALLBACK RULE */}
      <Sequence from={11454} durationInFrames={560} premountFor={30}>
        {/* tint cyan — the access-window scene before this one sits on amber */}
        <StepsScene durationInFrames={560} kicker="NOT PANIC — A ROUTING RULE" title="THE FALLBACK" accent="#F59E0B" tint="#D97757" steps={[{ label: "Fable down? Opus xhigh", at: 187 }, { label: "Too pricey? Step to high", at: 353 }, { label: "Ask: just enough?", at: 470 }]} />
      </Sequence>

      {/* 6:41 THE RATE CARD — 2× on paper, more in practice */}
      <Sequence from={12060} durationInFrames={560} premountFor={30}>
        <RateCardScene durationInFrames={560} kicker="THE COST TRAP" title="DOUBLE — BEFORE MULTIPLIERS" multipliersAt={360} />
      </Sequence>

      {/* 7:06 THE 80/20 RULE — donut/check/chips land on the spoken numbers */}
      <Sequence from={12780} durationInFrames={600} premountFor={30}>
        <Rule8020Scene durationInFrames={600} kicker="THE DECISION RULE" title="80% AT HALF PRICE? OPUS." checkAt={248} sonnetAt={275} missingAt={458} />
      </Sequence>

      {/* 7:36 HOW I'D ACTUALLY ROUTE IT */}
      <Sequence from={13670} durationInFrames={700} premountFor={30}>
        {/* default cyan tint — sandwiched between the green 80/20 and yes-run scenes */}
        <RoutingLanesScene durationInFrames={700} kicker="MY ACTUAL ROUTING" title="ESCALATE FASTER WHEN FAILURE COSTS" cards={[
          { label: "SIMPLE → LOW/MED", lane: 0, at: 46 },
          { label: "CODING AGENTS → XHIGH", lane: 1, at: 166 },
          { label: "FRONTIER UNCERTAINTY", lane: 2, at: 267 },
          { label: "FAILURE = $$$", lane: 2, at: 386 },
        ]} escalateAt={480} />
      </Sequence>

      {/* 8:00 THE YES RUN — back to the original claim */}
      <Sequence from={14440} durationInFrames={680} premountFor={30}>
        <YesRunScene durationInFrames={680} kicker="BACK TO THE CLAIM" title="THE MODEL ISN'T THE WHOLE STACK" qs={[
          { label: "BEHAVE LIKE FABLE?", at: 192, yesAt: 253 },
          { label: "EFFORT CLOSES THE GAP?", at: 283, yesAt: 360 },
          { label: "A SKILL = CONSISTENT?", at: 388, yesAt: 475 },
          { label: "ROUTING STOPS WASTE?", at: 502, yesAt: 614, big: true },
        ]} />
      </Sequence>

      {/* 8:24 THE STACK — callback to the opening metaphor */}
      <Sequence from={15121} durationInFrames={380} premountFor={30}>
        <ProcessAroundScene durationInFrames={380} kicker="THE REAL LESSON" title="MODEL + EFFORT + ROUTING" modules={[{ label: "EFFORT", at: 135 }, { label: "SKILL", at: 145 }, { label: "ROUTING", at: 184 }]} />
      </Sequence>

      {/* 8:39 OUTRO — anchored to the spoken "subscribe" (15587), runs to the end */}
      <Sequence from={15581} durationInFrames={MODEL_ROUTING_DUR - 15581} premountFor={30}>
        <Fable5Outro durationInFrames={MODEL_ROUTING_DUR - 15581} kicker="PRACTICAL AI — NO HYPE" tag="Drop your workflow below — I'll tell you which lane it belongs in" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const ModelRoutingVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <ModelRoutingVisuals />

      {/* ===== MUSIC — low beds over key sections ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={32} durationInFrames={680} volume={0.07} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={4160} durationInFrames={1680} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={9128} durationInFrames={1640} volume={0.08} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/calm.MP3")} from={13670} durationInFrames={1450} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={140} />
      <MusicBed src={staticFile("music/outro.MP3")} from={15581} durationInFrames={MODEL_ROUTING_DUR - 15581} volume={0.075} fadeInFrames={30} />

      {/* ===== SFX — a whoosh per beat + derived per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 15581].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* step/list ticks at spoken anchors */}
      {[1634, 1690, 1786, 1839, 1890, 2760, 2804, 2863, 7692, 7800, 7864, 11641, 11807, 11924].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={15593} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};
