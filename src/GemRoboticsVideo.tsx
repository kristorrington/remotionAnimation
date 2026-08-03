import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic, NewsTakeaway } from "./scenes/AiNews2Scenes";
import { MontageClipCard, AnnotatedClipCard, OneBrainScene, HandoffsScene, HardwareVsAI, MissingProofScene, JointsStat } from "./scenes/GemRoboticsScenes";

// GemRoboticsVideo — the cutaway overlay for the Gemini Robotics 2 breakdown
// (~5m41s, 10242f @ 30fps). FOOTAGE-FIRST (Kris: "use as much video footage as
// possible"): DeepMind's official demo clips carry the edit — cold-open
// lightbulb/knot montage, the three-task reel, a long lightbulb deep-dive with
// timed annotations, the Apollo & Duo garage take, and the hero shot on the
// verdict. Animation covers only what footage can't: the one-brain claim, the
// handoff problem, hardware-vs-AI, and the missing-proof checklist. Bold
// newsroom style shared with AiNews2. COLD OPEN (§8 exception): the hook
// narrates the lightbulb demo, so the film card is on screen from frame 0 and
// the face rides the corner PiP.

export const GEMROB_DUR = 10242;

const BRAND = NEWS.brand;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BLUE = NEWS.blue;
const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";
const DM = "DeepMind — Gemini Robotics 2";

// ── BEATS — from ≈ spokenFrame − 6 (whisper-pinned; captions-030826.ts) ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE REEL (cold open on the footage the hook narrates) ──
  { key: "coldOpen", from: 0, dur: 384, pip: true, node: (
    <MontageClipCard durationInFrames={384} tint={BRAND} punchIn kicker="Google DeepMind · July 30" title="WATCH THE HANDS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 0, label: "Unscrewing a lightbulb" },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 160, label: "Tying a trash-bag knot" },
      ]}
      chips={[{ at: 227, label: "“Most advanced ever” — Google" }]} />
  ) },
  { key: "hookKinetic", from: 530, dur: 190, fullscreen: true, node: (
    <NewsKinetic durationInFrames={190} tint={AMBER} text="BREAKTHROUGH OR GOOD EDITING?" highlight="EDITING?" size={96} />
  ) },

  // ── ONE BRAIN (the actual claim) ──
  { key: "announce", from: 888, dur: 260, receipt: true, node: (
    <ScreenshotReceiptScene durationInFrames={260} kicker="DEEPMIND · OFFICIAL" title="GEMINI ROBOTICS 2" fullBleed={false} tint={BLUE}
      src={`${SHOT}/ai2-gemini-robotics.png`} url="deepmind.google/blog" imageW={2680} imageH={2560}
      cardW={796} cardH={760} from={{ x: 0, y: 0, w: 2680, h: 2560 }} to={{ x: 0, y: 0, w: 2680, h: 2560 }} zoomAt={0} />
  ) },
  { key: "oneBrain", from: 1148, dur: 412, fullscreen: true, pip: true, node: (
    <OneBrainScene durationInFrames={412} tint={BLUE} coreAt={12} partAts={[142, 167, 200, 233]} tagAt={272} />
  ) },
  { key: "handoffs", from: 1734, dur: 666, fullscreen: true, pip: true, node: (
    <HandoffsScene durationInFrames={666} tint={AMBER} rowAts={[20, 76, 126]} sparkAt={167} unifyAt={411} />
  ) },

  // ── THE DEMOS ──
  { key: "selected", from: 2400, dur: 264, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={264} tint={AMBER} kicker="This is Google's own footage" title="CAREFULLY SELECTED" stamp="Not an independent test" stampAt={112} titleSize={84} />
  ) },
  { key: "tasksMontage", from: 2664, dur: 400, fullscreen: true, node: (
    <MontageClipCard durationInFrames={400} tint={GREEN} kicker="The demo reel" title="SMART CHOICES — FAILURE IS OBVIOUS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-packing.mp4`, at: 0, label: "Packing food" },
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 137, label: "The lightbulb" },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 188, label: "The knot" },
      ]}
      chips={[{ at: 296, label: "A dropped bulb can't hide" }]} />
  ) },
  { key: "bulbDeep", from: 3324, dur: 764, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={764} tint={BRAND} kicker="The hardest demo" title="GRIP · TURN · RELEASE" clip={`${CLIPS}/rob2-lightbulb.mp4`} source={DM} clipDur={294}
      chips={[
        { at: 164, label: "Grip — round & fragile" },
        { at: 278, label: "Pressure, not crushing" },
        { at: 443, label: "Fingers reposition" },
        { at: 661, label: "Knows it's loose" },
      ]} />
  ) },
  { key: "notPickPlace", from: 4088, dur: 252, fullscreen: true, node: (
    <NewsKinetic durationInFrames={252} tint={BRAND} text="NOT JUST PICK AND PLACE" highlight="PLACE" size={100} />
  ) },
  { key: "joints", from: 4340, dur: 300, fullscreen: true, pip: true, node: <JointsStat durationInFrames={300} tint={BLUE} numAt={20} /> },
  { key: "handsHard", from: 4640, dur: 390, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={390} tint={AMBER} kicker="Walking got solved — hands didn't" title="HANDS ARE THE HARD PART" stamp="Slippery · fragile · changing shape" stampAt={250} titleSize={80} />
  ) },

  // ── THE GARAGE ──
  { key: "garage", from: 5400, dur: 960, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={960} tint={BLUE} kicker="Two robots, one garage" title="APOLLO & DUO" clip={`${CLIPS}/rob2-garage.mp4`} source={DM} clipDur={534}
      chips={[
        { at: 77, label: "Apollo" },
        { at: 110, label: "Duo" },
        { at: 372, label: "Separate copies — no hive mind" },
        { at: 610, label: "No stopping to negotiate" },
      ]} />
  ) },
  { key: "planned", from: 6360, dur: 340, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={340} tint={AMBER} kicker="The footage doesn't say" title="HOW MUCH WAS PLANNED?" stamp="Maybe just separate jobs" stampAt={240} titleSize={82} />
  ) },
  { key: "forgiving", from: 6700, dur: 400, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={400} tint={AMBER} kicker="No exact order required" title="TIDYING IS FORGIVING" stamp="Smooth ≠ coordinated" stampAt={250} titleSize={84} />
  ) },
  { key: "hardware", from: 7150, dur: 410, fullscreen: true, pip: true, node: (
    <HardwareVsAI durationInFrames={410} tint={BLUE} leftAt={88} rightAt={250} />
  ) },

  // ── THE GAPS ──
  { key: "missing", from: 7690, dur: 890, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={890} tint={RED} items={[
      { at: 178, label: "Success rates", sub: "1 in 10? 9 in 10?" },
      { at: 461, label: "Independent testing" },
      { at: 566, label: "A fair comparison", sub: "Optimus · Figure · 1X" },
      { at: 725, label: "Release date / API access" },
    ]} />
  ) },

  // ── VERDICT ──
  { key: "verdict", from: 8580, dur: 770, fullscreen: true, pip: true, node: (
    <MontageClipCard durationInFrames={770} tint={GREEN} kicker="So — is it a breakthrough?" title="YES. NOT FOR THE REEL." source={DM}
      parts={[
        { src: `${CLIPS}/rob2-hero.mp4`, at: 0, clipDur: 405 },
        { src: `${CLIPS}/rob2-extra-wholebody.mp4`, at: 400, label: "Whole-body control", clipDur: 420 },
      ]}
      chips={[
        { at: 470, label: "One brain, whole body" },
        { at: 570, label: "Adapts to the space" },
      ]} />
  ) },
  { key: "comparison", from: 9350, dur: 354, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={354} tint={RED} kicker="Does this prove “most advanced”?" title="“MOST ADVANCED” IS A COMPARISON" stamp="Google hasn't shown it" stampAt={280} titleSize={74} />
  ) },
  { key: "demoNotProduct", from: 9704, dur: 380, fullscreen: true, pip: true, node: (
    <NewsTakeaway durationInFrames={380} tint={BRAND} kicker="Where this actually lands" title="A BREAKTHROUGH DEMO" stamp="Not yet a proven product" stampAt={165} titleSize={86} />
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

      {/* ===== SFX — restrained: soft whoosh on fullscreen starts; swish on
          montage sub-cuts (MontageClipCard internal source switches) ===== */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
      <SfxCue from={0 + 160} src={SFX.swish} volume={0.3} />
      <SfxCue from={2664 + 137} src={SFX.swish} volume={0.3} rate={1.06} />
      <SfxCue from={2664 + 188} src={SFX.swish} volume={0.3} rate={0.96} />
    </AbsoluteFill>
  );
};
