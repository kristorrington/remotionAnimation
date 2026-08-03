import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Fable5Outro } from "./components/Fable5Outro";
import { SFX, SfxCue, vary } from "./components/Sfx";
import { ScreenshotReceiptScene } from "./scenes/SourceCardScene";
import { ThemeProvider } from "./theme";
import { MusicController } from "./motion/editkit";
import { NEWS, NewsKinetic } from "./scenes/AiNews2Scenes";
import { MontageClipCard, AnnotatedClipCard, ClipTakeaway, OneBrainScene, HandoffsScene, HardwareVsAI, MissingProofScene, JointsStat } from "./scenes/GemRoboticsScenes";

// GemRoboticsVideo — the cutaway overlay for the Gemini Robotics 2 breakdown.
// FOOTAGE-FIRST (Kris): DeepMind's official demo clips carry the edit, with
// b-roll rolling on every animation slide and clips rotated so nothing repeats
// adjacently. PACE RULE (Kris, Aug 2026): the footage is re-timed 1.06×
// pitch-preserved (~5m22s, 9665f @ 30fps) and every anchor below is on the
// re-timed clock (captions-030826.ts is rescaled to match). OPEN: FACE
// full-frame with the punch-in, then the lightbulb film card cuts in at ~85f.

export const GEMROB_DUR = 9665;

const BRAND = NEWS.brand;
const GREEN = NEWS.green;
const AMBER = NEWS.amber;
const RED = NEWS.red;
const BLUE = NEWS.blue;
const SHOT = "assets/external/screenshots";
const CLIPS = "assets/external/clips";
const DM = "DeepMind — Gemini Robotics 2";

// ── BEATS — from ≈ spokenFrame − 6 (whisper-pinned on the 1.06× clock) ──
type Beat = { key: string; from: number; dur: number; fullscreen?: boolean; receipt?: boolean; pip?: boolean; node: React.ReactNode };
const BEATS: Beat[] = [
  // ── THE REEL (face opens; the narrated footage cuts in at the phrase break) ──
  { key: "coldOpen", from: 85, dur: 277, pip: true, node: (
    <MontageClipCard durationInFrames={277} tint={BRAND} punchIn kicker="Google DeepMind · July 30" title="WATCH THE HANDS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 0, label: "Unscrewing a lightbulb", clipDur: 294 },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 66, label: "Tying a trash-bag knot", clipDur: 570 },
      ]}
      chips={[{ at: 129, label: "“Most advanced ever” — Google" }]} />
  ) },
  { key: "hookKinetic", from: 500, dur: 179, fullscreen: true, node: (
    <NewsKinetic durationInFrames={179} tint={AMBER} text="BREAKTHROUGH OR GOOD EDITING?" highlight="EDITING?" size={96} />
  ) },

  // ── ONE BRAIN ──
  { key: "announce", from: 838, dur: 245, receipt: true, node: (
    <ScreenshotReceiptScene durationInFrames={245} kicker="DEEPMIND · OFFICIAL" title="GEMINI ROBOTICS 2" fullBleed={false} tint={BLUE}
      src={`${SHOT}/ai2-gemini-robotics.png`} url="deepmind.google/blog" imageW={2680} imageH={2560}
      cardW={796} cardH={760} from={{ x: 0, y: 0, w: 2680, h: 2560 }} to={{ x: 0, y: 0, w: 2680, h: 2560 }} zoomAt={0} />
  ) },
  { key: "oneBrain", from: 1083, dur: 389, fullscreen: true, pip: true, node: (
    <OneBrainScene durationInFrames={389} tint={BLUE} coreAt={11} partAts={[134, 158, 189, 220]} tagAt={257} clip={`${CLIPS}/rob2-extra-wholebody.mp4`} clipDur={420} />
  ) },
  { key: "handoffs", from: 1636, dur: 464, fullscreen: true, pip: true, node: (
    <HandoffsScene durationInFrames={464} tint={AMBER} rowAts={[19, 72, 119]} sparkAt={158} unifyAt={388} clip={`${CLIPS}/rob2-extra-sixgrid.mp4`} clipDur={600} />
  ) },
  { key: "handoffsPayoff", from: 2100, dur: 164, fullscreen: true, node: (
    <NewsKinetic durationInFrames={164} tint={GREEN} text="ONE SYSTEM. FEWER HANDOFFS." highlight="FEWER" size={92} />
  ) },

  // ── THE DEMOS ──
  { key: "selected", from: 2264, dur: 249, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={249} tint={AMBER} kicker="This is Google's own footage" title="CAREFULLY SELECTED" stamp="Not an independent test" stampAt={106} titleSize={78} clip={`${CLIPS}/rob2-extra-sweeping.mp4`} clipDur={300} />
  ) },
  { key: "tasksMontage", from: 2513, dur: 377, fullscreen: true, node: (
    <MontageClipCard durationInFrames={377} tint={GREEN} kicker="The demo reel" title="SMART CHOICES — FAILURE IS OBVIOUS" source={DM}
      parts={[
        { src: `${CLIPS}/rob2-packing.mp4`, at: 0, label: "Packing food", clipDur: 480 },
        { src: `${CLIPS}/rob2-lightbulb.mp4`, at: 129, label: "The lightbulb", clipDur: 294 },
        { src: `${CLIPS}/rob2-knot.mp4`, at: 177, label: "The knot", clipDur: 570 },
      ]}
      chips={[{ at: 279, label: "A dropped bulb can't hide" }]} />
  ) },
  { key: "bulbDeep", from: 3136, dur: 364, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={364} tint={BRAND} kicker="The hardest demo" title="GRIP · TURN · RELEASE" clip={`${CLIPS}/rob2-lightbulb.mp4`} source={DM} clipDur={294}
      chips={[
        { at: 155, label: "Grip — round & fragile" },
        { at: 262, label: "Pressure, not crushing" },
      ]} />
  ) },
  { key: "bulbFinish", from: 3500, dur: 357, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={357} tint={BRAND} kicker="Fingers reposition as it turns" title="IT KNOWS WHEN IT'S LOOSE" stamp="Not a fixed routine" stampAt={270} titleSize={64} clip={`${CLIPS}/rob2-lightbulb.mp4`} clipDur={294} />
  ) },
  { key: "notPickPlace", from: 3857, dur: 238, fullscreen: true, node: (
    <NewsKinetic durationInFrames={238} tint={BRAND} text="NOT JUST PICK AND PLACE" highlight="PLACE" size={100} />
  ) },
  { key: "joints", from: 4094, dur: 283, fullscreen: true, pip: true, node: <JointsStat durationInFrames={283} tint={BLUE} numAt={19} clip={`${CLIPS}/rob2-packing.mp4`} clipDur={480} /> },
  { key: "handsHard", from: 4377, dur: 368, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={368} tint={AMBER} kicker="Walking got solved — hands didn't" title="HANDS ARE THE HARD PART" stamp="Slippery · fragile · changing" stampAt={236} titleSize={72} clip={`${CLIPS}/rob2-knot.mp4`} clipDur={570} />
  ) },

  // ── THE GARAGE ──
  { key: "garage", from: 5094, dur: 446, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={446} tint={BLUE} kicker="Two robots, one garage" title="APOLLO & DUO" clip={`${CLIPS}/rob2-garage.mp4`} source={DM} clipDur={534}
      chips={[
        { at: 73, label: "Apollo" },
        { at: 104, label: "Duo" },
        { at: 351, label: "Separate copies" },
      ]} />
  ) },
  { key: "garageHive", from: 5540, dur: 320, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={320} tint={BLUE} kicker="Each robot runs its own copy" title="NO HIVE MIND" stamp="No stopping to negotiate" stampAt={130} titleSize={84} clip={`${CLIPS}/rob2-garage.mp4`} clipDur={534} />
  ) },
  { key: "garageAware", from: 5860, dur: 140, fullscreen: true, node: (
    <NewsKinetic durationInFrames={140} tint={BLUE} text="AWARE — AND THEY KEEP WORKING" highlight="WORKING" size={84} />
  ) },
  { key: "planned", from: 6000, dur: 321, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={321} tint={AMBER} kicker="The footage doesn't say" title="HOW MUCH WAS PLANNED?" stamp="Maybe just separate jobs" stampAt={226} titleSize={72} clip={`${CLIPS}/rob2-extra-wholebody.mp4`} clipDur={420} />
  ) },
  { key: "forgiving", from: 6321, dur: 425, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={425} tint={AMBER} kicker="No exact order required" title="TIDYING IS FORGIVING" stamp="Smooth ≠ coordinated" stampAt={236} titleSize={76} clip={`${CLIPS}/rob2-extra-sweeping.mp4`} clipDur={300} />
  ) },
  { key: "hardware", from: 6746, dur: 387, fullscreen: true, pip: true, node: (
    <HardwareVsAI durationInFrames={387} tint={BLUE} leftAt={83} rightAt={236} clip={`${CLIPS}/rob2-garage.mp4`} clipDur={534} />
  ) },

  // ── THE GAPS ──
  { key: "missing", from: 7255, dur: 445, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={445} tint={RED} clip={`${CLIPS}/rob2-extra-sixgrid.mp4`} clipDur={600} items={[
      { at: 168, label: "Success rates", sub: "1 in 10? 9 in 10?" },
      { at: 435, label: "Independent testing" },
    ]} />
  ) },
  { key: "missing2", from: 7700, dur: 395, fullscreen: true, pip: true, node: (
    <MissingProofScene durationInFrames={395} tint={RED} clip={`${CLIPS}/rob2-hero.mp4`} clipDur={405} items={[
      { at: 89, label: "A fair comparison", sub: "Optimus · Figure · 1X" },
      { at: 239, label: "Release date / API access" },
    ]} />
  ) },

  // ── VERDICT ──
  { key: "verdict", from: 8094, dur: 377, fullscreen: true, pip: true, node: (
    <MontageClipCard durationInFrames={377} tint={GREEN} kicker="So — is it a breakthrough?" title="YES. NOT FOR THE REEL." source={DM}
      parts={[{ src: `${CLIPS}/rob2-hero.mp4`, at: 0, clipDur: 405 }]} />
  ) },
  { key: "verdictBody", from: 8471, dur: 349, fullscreen: true, pip: true, node: (
    <AnnotatedClipCard durationInFrames={349} tint={GREEN} kicker="The real story" title="ONE BRAIN, WHOLE BODY" clip={`${CLIPS}/rob2-extra-wholebody.mp4`} source={DM} clipDur={420}
      chips={[
        { at: 66, label: "One brain, whole body" },
        { at: 161, label: "Adapts to the space" },
      ]} />
  ) },
  { key: "comparison", from: 8821, dur: 334, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={334} tint={RED} kicker="Does this prove “most advanced”?" title="“MOST ADVANCED” IS A COMPARISON" stamp="Google hasn't shown it" stampAt={264} titleSize={62} clip={`${CLIPS}/rob2-hero.mp4`} clipDur={405} />
  ) },
  { key: "demoNotProduct", from: 9155, dur: 358, fullscreen: true, pip: true, node: (
    <ClipTakeaway durationInFrames={358} tint={BRAND} kicker="Where this actually lands" title="A BREAKTHROUGH DEMO" stamp="Not yet a proven product" stampAt={156} titleSize={78} clip={`${CLIPS}/rob2-lightbulb.mp4`} clipDur={294} />
  ) },
];

export const GEMROB_WINDOWS: { from: number; dur: number }[] = BEATS.map((b) => ({ from: b.from, dur: b.dur }));
export const GEMROB_FULLSCREEN: { from: number; to: number }[] = BEATS.filter((b) => b.fullscreen).map((b) => ({ from: b.from, to: b.from + b.dur }));
export const GEMROB_EXTRA_CUTS = BEATS.filter((b) => b.receipt).map((b) => b.from);
export const GEMROB_PIP: { from: number; to: number }[] = BEATS.filter((b) => b.pip).map((b) => ({ from: b.from, to: b.from + b.dur }));

const OUTRO_FROM = 9513;

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
      <MusicController state="main" from={0} durationInFrames={2264} volume={0.07} duck={[{ from: 0, to: 362 }, { from: 838, to: 1083 }]} />
      <MusicController state="caveat" from={2264} durationInFrames={627} volume={0.06} />
      <MusicController state="main" from={2891} durationInFrames={3109} volume={0.07} duck={[{ from: 3136, to: 3513 }]} />
      <MusicController state="caveat" from={6000} durationInFrames={2094} volume={0.06} />
      <MusicController state="main" from={8094} durationInFrames={GEMROB_DUR - 8094} volume={0.065} />

      {/* ===== SFX — restrained: soft whoosh on fullscreen starts; swish on montage sub-cuts ===== */}
      {BEATS.filter((b) => b.fullscreen).map((b, i) => (
        <SfxCue key={`w-${b.from}`} from={b.from} src={SFX.softWhoosh} volume={0.2} rate={vary(i)} />
      ))}
      <SfxCue from={85 + 66} src={SFX.swish} volume={0.3} />
      <SfxCue from={2513 + 129} src={SFX.swish} volume={0.3} rate={1.06} />
      <SfxCue from={2513 + 177} src={SFX.swish} volume={0.3} rate={0.96} />
    </AbsoluteFill>
  );
};
