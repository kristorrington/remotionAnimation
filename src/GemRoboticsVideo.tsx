import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { MontageClipCard, AnnotatedClipCard, ClipTakeaway, OneBrainScene, HandoffsScene, HardwareVsAI, MissingProofScene, JointsStat } from "./scenes/GemRoboticsScenes";

// GemRoboticsVideo — the cutaway overlay for the Gemini Robotics 2 breakdown
// (~5m41s, 10242f @ 30fps — NATURAL speed; the 1.06× re-time was REVERTED,
// Kris Aug 2026: the 31.8→30fps conform caused visible lip-sync drift on the
// face. Tempo now comes from the edit, never from resampling the footage).
// FOOTAGE-FIRST: official DeepMind clips FULL-BLEED on every visual beat,
// clips rotated so nothing repeats adjacently, scenes capped ≤ ~12s (splits).
// OPEN: FACE full-frame with the punch-in, then the lightbulb film card cuts
// in at ~90f with a CutFlash. Anchors whisper-pinned to captions-030826.ts.

export const GEMROB_DUR = 10242;

const BRAND = NEWS.brand;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BLUE = NEWS.blue;
const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";
const DM = "DeepMind — Gemini Robotics 2";

// ── BEATS — from ≈ spokenFrame − 6 (whisper-pinned) ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE REEL (face opens; the narrated footage cuts in at the phrase break) ──
  { key: "coldOpen", from: 90, dur: 294, pip: true, node: (
    <MontageClipCard durationInFrames={294} tint={BRAND} punchIn kicker="Google DeepMind · July 30" title="WATCH THE HANDS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 0, label: "Unscrewing a lightbulb", clipDur: 294 },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 70, label: "Tying a trash-bag knot", clipDur: 570 },
      ]}
      chips={[{ at: 137, label: "“Most advanced ever” — Google" }]} />
  ) },
  { key: "hookKinetic", from: 530, dur: 190, fullscreen: true, node: (
    <NewsKinetic durationInFrames={190} tint={AMBER} text="BREAKTHROUGH OR GOOD EDITING?" highlight="EDITING?" size={96} />
  ) },

  // ── ONE BRAIN ──
  { key: "announce", from: 888, dur: 260, receipt: true, node: (
    <ScreenshotReceiptScene durationInFrames={260} kicker="DEEPMIND · OFFICIAL" title="GEMINI ROBOTICS 2" fullBleed={false} tint={BLUE}
      src={`${SHOT}/ai2-gemini-robotics.png`} url="deepmind.google/blog" imageW={2680} imageH={2560}
      cardW={796} cardH={760} from={{ x: 0, y: 0, w: 2680, h: 2560 }} to={{ x: 0, y: 0, w: 2680, h: 2560 }} zoomAt={0} />
  ) },
  { key: "oneBrain", from: 1148, dur: 412, fullscreen: true, pip: true, node: (
    <OneBrainScene durationInFrames={412} tint={BLUE} coreAt={12} partAts={[142, 167, 200, 233]} tagAt={272} clip={`${CLIPS}/rob2-extra-wholebody.mp4`} clipDur={420} />
  ) },
  { key: "handoffs", from: 1734, dur: 492, fullscreen: true, pip: true, node: (
    <HandoffsScene durationInFrames={492} tint={AMBER} rowAts={[20, 76, 126]} sparkAt={167} unifyAt={411} clip={`${CLIPS}/rob2-extra-sixgrid.mp4`} clipDur={600} />
  ) },
  { key: "handoffsPayoff", from: 2226, dur: 174, fullscreen: true, node: (
    <NewsKinetic durationInFrames={174} tint={GREEN} text="ONE SYSTEM. FEWER HANDOFFS." highlight="FEWER" size={92} />
  ) },

  // ── THE DEMOS ──
  { key: "selected", from: 2400, dur: 264, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={264} tint={AMBER} kicker="This is Google's own footage" title="CAREFULLY SELECTED" stamp="Not an independent test" stampAt={112} titleSize={78} clip={`${CLIPS}/rob2-extra-sweeping.mp4`} clipDur={300} />
  ) },
  { key: "tasksMontage", from: 2664, dur: 400, fullscreen: true, node: (
    <MontageClipCard durationInFrames={400} tint={GREEN} kicker="The demo reel" title="SMART CHOICES — FAILURE IS OBVIOUS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-packing.mp4`, at: 0, label: "Packing food", clipDur: 480 },
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 137, label: "The lightbulb", clipDur: 294 },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 188, label: "The knot", clipDur: 570 },
      ]}
      chips={[{ at: 296, label: "A dropped bulb can't hide" }]} />
  ) },
  { key: "bulbDeep", from: 3324, dur: 386, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={386} tint={BRAND} kicker="The hardest demo" title="GRIP · TURN · RELEASE" clip={`${CLIPS}/rob2-lightbulb.mp4`} source={DM} clipDur={294}
      chips={[
        { at: 164, label: "Grip — round & fragile" },
        { at: 278, label: "Pressure, not crushing" },
      ]} />
  ) },
  { key: "bulbFinish", from: 3710, dur: 378, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={378} tint={BRAND} kicker="Fingers reposition as it turns" title="IT KNOWS WHEN IT'S LOOSE" stamp="Not a fixed routine" stampAt={286} titleSize={64} clip={`${CLIPS}/rob2-lightbulb.mp4`} clipDur={294} />
  ) },
  { key: "notPickPlace", from: 4088, dur: 252, fullscreen: true, node: (
    <NewsKinetic durationInFrames={252} tint={BRAND} text="NOT JUST PICK AND PLACE" highlight="PLACE" size={100} />
  ) },
  { key: "joints", from: 4340, dur: 300, fullscreen: true, pip: true, node: <JointsStat durationInFrames={300} tint={BLUE} numAt={20} clip={`${CLIPS}/rob2-packing.mp4`} clipDur={480} /> },
  { key: "handsHard", from: 4640, dur: 390, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={390} tint={AMBER} kicker="Walking got solved — hands didn't" title="HANDS ARE THE HARD PART" stamp="Slippery · fragile · changing" stampAt={250} titleSize={72} clip={`${CLIPS}/rob2-knot.mp4`} clipDur={570} />
  ) },

  // ── THE GARAGE ──
  { key: "garage", from: 5400, dur: 472, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={472} tint={BLUE} kicker="Two robots, one garage" title="APOLLO & DUO" clip={`${CLIPS}/rob2-garage.mp4`} source={DM} clipDur={534}
      chips={[
        { at: 77, label: "Apollo" },
        { at: 110, label: "Duo" },
        { at: 372, label: "Separate copies" },
      ]} />
  ) },
  { key: "garageHive", from: 5872, dur: 340, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={340} tint={BLUE} kicker="Each robot runs its own copy" title="NO HIVE MIND" stamp="No stopping to negotiate" stampAt={138} titleSize={84} clip={`${CLIPS}/rob2-garage.mp4`} clipDur={534} />
  ) },
  { key: "garageAware", from: 6212, dur: 148, fullscreen: true, node: (
    <NewsKinetic durationInFrames={148} tint={BLUE} text="AWARE — AND THEY KEEP WORKING" highlight="WORKING" size={84} />
  ) },
  { key: "planned", from: 6360, dur: 340, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={340} tint={AMBER} kicker="The footage doesn't say" title="HOW MUCH WAS PLANNED?" stamp="Maybe just separate jobs" stampAt={240} titleSize={72} clip={`${CLIPS}/rob2-extra-wholebody.mp4`} clipDur={420} />
  ) },
  { key: "forgiving", from: 6700, dur: 451, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={451} tint={AMBER} kicker="No exact order required" title="TIDYING IS FORGIVING" stamp="Smooth ≠ coordinated" stampAt={250} titleSize={76} clip={`${CLIPS}/rob2-extra-sweeping.mp4`} clipDur={300} />
  ) },
  { key: "hardware", from: 7151, dur: 410, fullscreen: true, pip: true, node: (
    <HardwareVsAI durationInFrames={410} tint={BLUE} leftAt={88} rightAt={250} clip={`${CLIPS}/rob2-garage.mp4`} clipDur={534} />
  ) },

  // ── THE GAPS ──
  { key: "missing", from: 7690, dur: 472, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={472} tint={RED} clip={`${CLIPS}/rob2-extra-sixgrid.mp4`} clipDur={600} items={[
      { at: 178, label: "Success rates", sub: "1 in 10? 9 in 10?" },
      { at: 461, label: "Independent testing" },
    ]} />
  ) },
  { key: "missing2", from: 8162, dur: 418, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={418} tint={RED} clip={`${CLIPS}/rob2-hero.mp4`} clipDur={405} items={[
      { at: 94, label: "A fair comparison", sub: "Optimus · Figure · 1X" },
      { at: 253, label: "Release date / API access" },
    ]} />
  ) },

  // ── VERDICT ──
  { key: "verdict", from: 8580, dur: 399, fullscreen: true, pip: true, node: (
    <MontageClipCard durationInFrames={399} tint={GREEN} kicker="So — is it a breakthrough?" title="YES. NOT FOR THE REEL." source={DM}
      parts={[{ src: `${CLIPS}/rob2-hero.mp4`, at: 0, clipDur: 405 }]} />
  ) },
  { key: "verdictBody", from: 8979, dur: 371, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={371} tint={GREEN} kicker="The real story" title="ONE BRAIN, WHOLE BODY" clip={`${CLIPS}/rob2-extra-wholebody.mp4`} source={DM} clipDur={420}
      chips={[
        { at: 70, label: "One brain, whole body" },
        { at: 171, label: "Adapts to the space" },
      ]} />
  ) },
  { key: "comparison", from: 9350, dur: 354, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={354} tint={RED} kicker="Does this prove “most advanced”?" title="“MOST ADVANCED” IS A COMPARISON" stamp="Google hasn't shown it" stampAt={280} titleSize={62} clip={`${CLIPS}/rob2-hero.mp4`} clipDur={405} />
  ) },
  { key: "demoNotProduct", from: 9704, dur: 380, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={380} tint={BRAND} kicker="Where this actually lands" title="A BREAKTHROUGH DEMO" stamp="Not yet a proven product" stampAt={165} titleSize={78} clip={`${CLIPS}/rob2-lightbulb.mp4`} clipDur={294} />
  ) },
];

export const GEMROB_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const GEMROB_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const GEMROB_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);
export const GEMROB_PIP: { from: number; to: number }[] = BEATS.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 10084;

export const GemRoboticsVisuals: React.FC = () => {
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill>
        {BEATS.map((b) => (
          <Sequence key={b.key} from={b.from} durationInFrames={b.dur} premountFor={30}>
            {b.node}
          </Sequence>
        ))}
        <Sequence from={OUTRO_FROM} durationInFrames={GEMROB_DUR - OUTRO_FROM} premountFor={30}>
          <Fable5Outro durationInFrames={GEMROB_DUR - OUTRO_FROM} kicker="THE EVIDENCE, NOT THE HIGHLIGHT REEL" tag="Independent tests drop → I break down the results. Subscribe." />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};

export const GemRoboticsVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GemRoboticsVisuals />

      {/* ===== MUSIC — main bed; caveat bed over doubts + the missing proof ===== */}
      <MusicController state="main" from={0} durationInFrames={2400} volume={0.07} duck={[{ from: 0, to: 384 }, { from: 888, to: 1148 }]} />
      <MusicController state="caveat" from={2400} durationInFrames={664} volume={0.06} />
      <MusicController state="main" from={3064} durationInFrames={3296} volume={0.07} duck={[{ from: 3324, to: 3724 }]} />
      <MusicController state="caveat" from={6360} durationInFrames={2220} volume={0.06} />
      <MusicController state="main" from={8580} durationInFrames={GEMROB_DUR - 8580} volume={0.065} />

      {/* ===== SFX — restrained: soft whoosh on fullscreen starts; swish on montage sub-cuts ===== */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
      <SfxCue from={90 + 70} src={SFX.swish} volume={0.3} />
      <SfxCue from={2664 + 137} src={SFX.swish} volume={0.3} rate={1.06} />
      <SfxCue from={2664 + 188} src={SFX.swish} volume={0.3} rate={0.96} />
    </AbsoluteFill>
  );
};
