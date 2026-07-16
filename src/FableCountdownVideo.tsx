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
import { ReactionsScene } from "./scenes/RobotScenes";
import { ThresholdGateScene } from "./scenes/MetaphorScenes";
import { QuestionFlipScene } from "./scenes/WealthScenes";
import { AccessWindowScene, RoutingLanesScene } from "./scenes/RoutingScenes";
import {
  CountdownGateScene, PriceRevealScene, ExtensionTimelineScene, PromoMeterScene, CapacityScene,
  DramaTimelineScene, JuneTimelineScene, ClassifierScene, TrustJengaScene, RerouteScene,
  SpecialistScene, WatchWordingScene,
} from "./scenes/CountdownScenes";

// FableCountdownVideo — transparent cutaway overlay for the "Fable 5 free
// window is a countdown, not a comeback" news explainer (~5m25s, 9755f @
// 30fps). Beats classified per CLAUDE.md §3; every `at` anchored to the
// whisper words in captionsData.ts (frame = seconds × 30, from ≈ spoken − 6).
// Transparent gaps = talking head; `fullscreen` spans = the animation OWNS
// the screen (≈ ⅓ of the runtime so the edit feels like a cartoon).

export const FABLE_COUNTDOWN_DUR = 9755;

const BEATS: { scene: string; from: number; dur: number; fullscreen?: boolean }[] = [
  { scene: "cdHook", from: 0, dur: 388, fullscreen: true },
  { scene: "cdWindow", from: 390, dur: 292 },
  { scene: "cdPrice", from: 684, dur: 190, fullscreen: true },
  { scene: "questionFlip", from: 876, dur: 211 },
  { scene: "thresholdGate", from: 1087, dur: 420, fullscreen: true },
  { scene: "cdExtension", from: 1508, dur: 390 },
  { scene: "cdPromo", from: 1900, dur: 300 },
  { scene: "compare", from: 2240, dur: 360 },
  { scene: "reactions", from: 2645, dur: 400, fullscreen: true },
  // 3045 → 3434: intentional talking-head beat ("why? no public explanation…")
  { scene: "cdCapacity", from: 3434, dur: 420 },
  { scene: "cdDrama", from: 3946, dur: 336, fullscreen: true },
  { scene: "cdJune", from: 4290, dur: 630 },
  { scene: "cdClassifier", from: 4920, dur: 370 },
  { scene: "reactions2", from: 5290, dur: 440 },
  { scene: "flow", from: 5735, dur: 210, fullscreen: true },
  // 5945 → 6250: talking-head beat (Anthropic-says vs Messaros-says)
  { scene: "cdJenga", from: 6250, dur: 400, fullscreen: true },
  { scene: "cdReroute", from: 6653, dur: 330, fullscreen: true },
  { scene: "steps", from: 7125, dur: 350 },
  { scene: "routingLanes", from: 7545, dur: 445 },
  { scene: "cdSpecialist", from: 8111, dur: 429, fullscreen: true },
  { scene: "compare2", from: 8547, dur: 320 },
  { scene: "cdWording", from: 8950, dur: 469 },
  { scene: "takeaway", from: 9419, dur: 190, fullscreen: true },
];

export const FABLE_COUNTDOWN_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const FABLE_COUNTDOWN_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));

export const FableCountdownVisuals: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 0:00 HOOK — not a comeback, a countdown (title waits for the spoken word) */}
      <Sequence from={0} durationInFrames={388} premountFor={30}>
        <CountdownGateScene durationInFrames={388} kicker="FABLE 5 DID NOT DISAPPEAR" title="NOT A COMEBACK — A COUNTDOWN" panelAt={148} alarmAt={242} titleAt={176} />
      </Sequence>

      {/* 0:13 AFTER JULY 12 — out of plan limits, into credit territory */}
      <Sequence from={390} durationInFrames={292} premountFor={30}>
        <AccessWindowScene durationInFrames={292} kicker="AFTER JULY 12" title="OUT OF YOUR PLAN LIMITS" closeAt={36} openAt={99999} creditsAt={172} />
      </Sequence>

      {/* 0:23 THE PRICE — $10 in / $50 out per million */}
      <Sequence from={684} durationInFrames={190} premountFor={30}>
        <PriceRevealScene durationInFrames={190} kicker="USAGE-CREDIT TERRITORY" title="THE PRICE GETS REAL" inAt={8} outAt={88} />
      </Sequence>

      {/* 0:29 THE QUESTION FLIP (starts after the price scene fully lands) */}
      <Sequence from={876} durationInFrames={211} premountFor={30}>
        <QuestionFlipScene durationInFrames={211} kicker="THE REAL QUESTION" q1="SHOULD YOU USE FABLE 5?" q2="WHAT'S ACTUALLY WORTH IT?" q1At={6} crossAt={82} tint="#D97757" />
      </Sequence>

      {/* 0:36 CLEAN RULES — routine falls through, result-changing work passes */}
      <Sequence from={1087} durationInFrames={420} premountFor={30}>
        <ThresholdGateScene durationInFrames={420} kicker="MY CLEAN RULES" title="ONLY WHERE IT CHANGES THE RESULT" failLabel="ROUTINE" passLabel="CHANGES IT" zoneLabel="FABLE-WORTHY" skipStamp="CHEAPER MODEL" tint="#4FA98A" />
      </Sequence>

      {/* 0:50 WHAT CHANGED — the window slides July 7 → July 12 */}
      <Sequence from={1508} durationInFrames={390} premountFor={30}>
        <ExtensionTimelineScene durationInFrames={390} kicker="SO HERE'S WHAT CHANGED" title="JULY 7 → JULY 12" slideAt={93} chips={[
          { label: "PRO", at: 264 }, { label: "MAX", at: 269 }, { label: "TEAM", at: 279 }, { label: "ENTERPRISE", at: 311 },
        ]} />
      </Sequence>

      {/* 1:03 THE PROMO DEAL — 50% of weekly limits, nothing to claim */}
      <Sequence from={1900} durationInFrames={300} premountFor={30}>
        <PromoMeterScene durationInFrames={300} kicker="DURING THE PROMO WINDOW" title="HALF YOUR WEEKLY LIMITS" donutAt={88} checkAt={186} selectAt={233} />
      </Sequence>

      {/* 1:14 WHEN THE PROMO ENDS — credits, or switch back */}
      <Sequence from={2240} durationInFrames={360} premountFor={30}>
        <CompareCard kicker="ONCE THE PROMO ENDS" tint="#C9913D" left={{ title: "KEEP USING FABLE", items: ["usage credits"], accent: "#E8B84B", mark: "»" }} right={{ title: "OR SWITCH BACK", items: ["Opus · Sonnet"], accent: "#4FA98A", mark: "»" }} leftDelay={234} rightDelay={318} durationInFrames={360} />
      </Sequence>

      {/* 1:28 "EXTENDED" ≠ SAFE — relieved robot vs alarmed robot */}
      <Sequence from={2645} durationInFrames={400} premountFor={30}>
        <ReactionsScene durationInFrames={400} kicker="DON'T RELAX YET" leftBubble="PRESSURE'S GONE" leftPose="celebrate" leftAccent="#4FA98A" leftAt={104} rightBubble="5 DAYS" rightPose="alarmed" rightAccent="#C65B52" rightAt={221} stamp="STILL A COUNTDOWN" stampColor="#C65B52" pointAt={317} tint="#C65B52" />
      </Sequence>

      {/* 1:55 THE SAFEST READ — demand high, capacity tight */}
      <Sequence from={3434} durationInFrames={420} premountFor={30}>
        <CapacityScene durationInFrames={420} kicker="THE SAFEST READ" title="DEMAND HIGH, CAPACITY TIGHT" chips={[
          { label: "DEMAND HIGH", at: 32 }, { label: "CAPACITY TIGHT", at: 76 }, { label: "USERS UNHAPPY", at: 160 },
        ]} shrugAt={284} />
      </Sequence>

      {/* 2:11 NOT A NORMAL LAUNCH — the drama timeline */}
      <Sequence from={3946} durationInFrames={336} premountFor={30}>
        <DramaTimelineScene durationInFrames={336} kicker="NOT A NORMAL LAUNCH" title="ONE MODEL, FOUR ACTS" stopAts={[40, 109, 141, 183]} stampAt={281} />
      </Sequence>

      {/* 2:23 THE JUNE STORY — dated receipt cards */}
      <Sequence from={4290} durationInFrames={630} premountFor={30}>
        <JuneTimelineScene durationInFrames={630} kicker="THE IMPORTANT PART" title="JUNE EXPLAINS THE DRAMA" cards={[
          { date: "JUN 12", label: "EXPORT CONTROLS → SHUTDOWN", color: "#C65B52", at: 75 },
          { date: "JUN 30", label: "CONTROLS LIFTED", color: "#4FA98A", at: 513 },
          { date: "JUL 1", label: "BACK — GLOBALLY", color: "#4FA98A", at: 552 },
        ]} />
      </Sequence>

      {/* 2:44 BACK WITH A SAFETY LAYER — 99% blocked, but not clean */}
      <Sequence from={4920} durationInFrames={370} premountFor={30}>
        <ClassifierScene durationInFrames={370} kicker="BACK — WITH A SAFETY LAYER" title="BLOCKS 99% OF THE TECHNIQUE" blockAt={159} donutAt={235} crackAt={326} />
      </Sequence>

      {/* 2:56 THE PUSHBACK — Messaros vs the jailbreak framing */}
      <Sequence from={5290} durationInFrames={440} premountFor={30}>
        <ReactionsScene durationInFrames={440} kicker="THE PUSHBACK" leftBubble="DEFENSIVE WORK" leftPose="pointing" leftAccent="#D97757" leftAt={401} rightBubble="A JAILBREAK?" rightPose="shrug" rightAccent="#C9913D" rightAt={241} stamp="OVERSTATED?" stampColor="#C9913D" pointAt={271} tint="#C9913D" />
      </Sequence>

      {/* 3:11 WHAT SHE ACTUALLY DID — find → fix → test */}
      <Sequence from={5735} durationInFrames={210} premountFor={30}>
        <FlowScene durationInFrames={210} kicker="WHAT SHE REPORTED" title="FIND → FIX → TEST" nodes={[{ label: "Find a bug" }, { label: "Fix the code" }, { label: "Write a test" }]} nodeAts={[8, 47, 91]} tint="#D97757" />
      </Sequence>

      {/* 3:28 TRUST NOT SETTLED — don't build the whole tower on it */}
      <Sequence from={6250} durationInFrames={400} premountFor={30}>
        <TrustJengaScene durationInFrames={400} kicker="THE PRACTICAL TAKEAWAY" title="TRUST ISN'T FULLY SETTLED" pullAt={222} chips={[
          { label: "SECURITY", at: 324 }, { label: "COMPLIANCE", at: 354 }, { label: "SENSITIVE CODE", at: 380 },
        ]} />
      </Sequence>

      {/* 3:41 SAFETY ROUTING — requests can be rerouted away */}
      <Sequence from={6653} durationInFrames={330} premountFor={30}>
        <RerouteScene durationInFrames={330} kicker="ANTHROPIC CAN STILL ROUTE" title="REQUESTS CAN BE REROUTED" rerouteAt={103} revealAt={191} />
      </Sequence>

      {/* 3:57 CONDITIONAL — plan, limits, routing */}
      <Sequence from={7125} durationInFrames={350} premountFor={30}>
        <StepsScene durationInFrames={350} kicker="NOT JUST EXPENSIVE" title="CONDITIONAL" accent="#C9913D" tint="#D97757" steps={[
          { label: "Access → your plan", at: 19 }, { label: "Usage → weekly limits", at: 70 }, { label: "Requests → safety routing", at: 138 },
        ]} />
      </Sequence>

      {/* 4:11 BURN THE LIMIT? — only on the right jobs */}
      <Sequence from={7545} durationInFrames={445} premountFor={30}>
        <RoutingLanesScene durationInFrames={445} kicker="BURN THE LIMIT?" title="ONLY ON THE RIGHT JOBS" tint="#4FA98A" cards={[
          { label: "STUCK PROJECT", lane: 2, at: 83 },
          { label: "CODEBASE REVIEW", lane: 2, at: 155 },
          { label: "PLANNING PROBLEMS", lane: 2, at: 245 },
          { label: "TIMER FOMO", lane: 0, at: 395 },
        ]} escalateAt={70} />
      </Sequence>

      {/* 4:30 THE SPECIALIST — expensive thinking, cheap execution */}
      <Sequence from={8111} durationInFrames={429} premountFor={30}>
        <SpecialistScene durationInFrames={429} kicker="THE BETTER MOVE" title="TREAT IT LIKE A SPECIALIST" inAt={20} workAt={90} handoffAt={170} chips={[
          { label: "EXPENSIVE THINKING", at: 304 }, { label: "CHEAP EXECUTION", at: 359 },
        ]} />
      </Sequence>

      {/* 4:45 THE DECISION RULE — before vs after July 12 */}
      <Sequence from={8547} durationInFrames={320} premountFor={30}>
        <CompareCard kicker="THE DECISION RULE" tint="#D97757" left={{ title: "BEFORE JULY 12", items: ["hardest unfinished work"], accent: "#E8B84B", mark: "»" }} right={{ title: "AFTER JULY 12", items: ["only if it beats the credit cost"], accent: "#4FA98A", mark: "»" }} leftDelay={140} rightDelay={194} durationInFrames={320} />
      </Sequence>

      {/* 4:58 WATCH THE WORDING — screenshots lie, official dates don't */}
      <Sequence from={8950} durationInFrames={469} premountFor={30}>
        <WatchWordingScene durationInFrames={469} kicker="WAITING FOR IT TO RETURN?" title="WATCH THE WORDING" crossAt={61} checkAt={192} stampAt={230} windowAts={[391, 420, 450]} />
      </Sequence>

      {/* 5:14 TAKEAWAY — leverage (stamp lands on the spoken word) */}
      <Sequence from={9419} durationInFrames={190} premountFor={30}>
        <FinalTakeawayScene durationInFrames={190} kicker="IF YOU'RE A BUILDER" title="ONE THING MATTERS" stamp="LEVERAGE" stampAt={132} accent="#4FA98A" />
      </Sequence>

      {/* 5:20 OUTRO — anchored to the spoken "subscribe" (9615) */}
      <Sequence from={9609} durationInFrames={FABLE_COUNTDOWN_DUR - 9609} premountFor={30}>
        <Fable5Outro durationInFrames={FABLE_COUNTDOWN_DUR - 9609} kicker="PRACTICAL AI — NO HYPE" tag="Burning your window on the right jobs? Tell me below" />
      </Sequence>
    </AbsoluteFill>
  );
};

export const FableCountdownVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FableCountdownVisuals />

      {/* ===== MUSIC — short low beds over the emotional peaks only ===== */}
      <MusicBed src={staticFile("music/tension.MP3")} from={0} durationInFrames={700} volume={0.08} fadeOutFrames={90} />
      <MusicBed src={staticFile("music/calm.MP3")} from={1508} durationInFrames={720} volume={0.06} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={3946} durationInFrames={980} volume={0.07} startFrom={600} fadeInFrames={45} fadeOutFrames={120} />
      <MusicBed src={staticFile("music/tension.MP3")} from={6250} durationInFrames={740} volume={0.08} startFrom={1200} fadeInFrames={45} fadeOutFrames={110} />
      <MusicBed src={staticFile("music/calm.MP3")} from={8111} durationInFrames={760} volume={0.06} startFrom={900} fadeInFrames={45} fadeOutFrames={130} />
      <MusicBed src={staticFile("music/outro.MP3")} from={9609} durationInFrames={FABLE_COUNTDOWN_DUR - 9609} volume={0.075} fadeInFrames={30} />

      {/* ===== SFX — a whoosh per beat + per-scene action hits ===== */}
      {[...BEATS.map((b) => b.from), 9609].map((f, i) => (
        <SfxCue key={`w-${f}`} from={f} src={SFX.whoosh} volume={0.45} rate={vary(i)} />
      ))}
      {BEATS.flatMap((b) => sceneActionCues(b.scene, b.from, b.dur)).map((cue, i) => (
        <SfxCue key={`ac-${cue.at}-${cue.type}-${i}`} from={cue.at} src={SFX[cue.type]} volume={cue.type === "boom" ? 0.4 : cue.type === "whip" ? 0.3 : 0.4} rate={vary(i + 1)} />
      ))}
      {/* step/list ticks at spoken anchors (steps + plan chips + window stamps) */}
      {[7144, 7195, 7263, 1772, 1777, 1787, 1819, 9341, 9370, 9400].map((f) => (
        <SfxCue key={`t-${f}`} from={f} src={SFX.switch} volume={0.25} />
      ))}
      <SfxCue from={9621} src={SFX.ding} volume={0.45} />
    </AbsoluteFill>
  );
};
