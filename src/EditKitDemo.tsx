import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ThemeProvider } from "./theme";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { FONT } from "./components/overlayUI";
import { SFX } from "./components/Sfx";
import {
  CameraPunchIn,
  KineticText,
  ModelComparison,
  PriceComparison,
  EffortSelector,
  DecisionFramework,
  SectionTransition,
  BenchmarkBar,
  SoundCue,
  MusicController,
  PALETTE,
} from "./motion/editkit";
import { ChartData } from "./motion/charts";

// ============================================================================
// EDIT KIT CATALOG — scrub this in Studio to preview every model-review edit
// component (~3s each), like TemplateLab. NOT a real cut: the benchmark numbers
// are illustrative placeholders (labelled DEMO), never a claim (CLAUDE.md §15.6).
// ============================================================================
export const EDITKIT_DEMO_DUR = 990;
const SEG = 90;

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)", padding: "10px 26px", borderRadius: 999, background: "rgba(20,16,13,0.82)" }}>
    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "#fff" }}>{text}</span>
  </div>
);

const Stage: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => (
  <AbsoluteFill>
    <AnimatedBackground durationInFrames={SEG} fade={false} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>{children}</AbsoluteFill>
    <Caption text={label} />
  </AbsoluteFill>
);

// illustrative-only demo chart (never mistaken for a real benchmark claim)
const DEMO_CHART: ChartData = {
  title: "BENCHMARK (DEMO)",
  unit: "%",
  source: { name: "illustrative", url: null },
  data: [
    { label: "Opus 5", value: 72 },
    { label: "Fable 5", value: 78 },
  ],
};

export const EditKitDemo: React.FC = () => {
  let f = 0;
  const next = () => {
    const from = f;
    f += SEG;
    return from;
  };
  return (
    <ThemeProvider style="paper">
      <AbsoluteFill style={{ backgroundColor: PALETTE.paper }}>
        {/* CameraPunchIn — on a talking-head stand-in */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="CameraPunchIn">
            <CameraPunchIn at={15} level="strong" hold={45}>
              <AbsoluteFill style={{ background: "linear-gradient(135deg,#2b2926,#4a4642)", justifyContent: "center", alignItems: "center" }}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, letterSpacing: 4, color: "rgba(255,255,255,0.85)" }}>TALKING HEAD</span>
              </AbsoluteFill>
            </CameraPunchIn>
          </Stage>
        </Sequence>

        {/* KineticText */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="KineticText">
            <KineticText text="HALF THE PRICE" durationInFrames={SEG} highlight="HALF" y={480} />
          </Stage>
        </Sequence>

        {/* ModelComparison */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="ModelComparison">
            <ModelComparison />
          </Stage>
        </Sequence>

        {/* PriceComparison */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="PriceComparison">
            <PriceComparison />
          </Stage>
        </Sequence>

        {/* BenchmarkBar */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="BenchmarkBar">
            <BenchmarkBar chart={DEMO_CHART} sourceType="interpretation" />
          </Stage>
        </Sequence>

        {/* EffortSelector */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="EffortSelector">
            <EffortSelector value={3} />
          </Stage>
        </Sequence>

        {/* DecisionFramework */}
        <Sequence from={next()} durationInFrames={SEG}>
          <Stage label="DecisionFramework">
            <DecisionFramework />
          </Stage>
        </Sequence>

        {/* SectionTransition — the four named kinds over a label card */}
        {(["evidence", "counterpoint", "section", "verdict"] as const).map((kind) => (
          <Sequence key={kind} from={next()} durationInFrames={SEG}>
            <Stage label={`SectionTransition · ${kind}`}>
              <div style={{ display: "flex", gap: 40 }}>
                <ModelComparison at={0} />
              </div>
              <Sequence from={40} durationInFrames={SEG - 40}>
                <SectionTransition kind={kind} />
              </Sequence>
            </Stage>
          </Sequence>
        ))}

        {/* ── audio: one music bed + a few restrained cues ── */}
        <MusicController state="main" from={0} durationInFrames={EDITKIT_DEMO_DUR} duck={[{ from: 4 * SEG, to: 5 * SEG }]} />
        <SoundCue from={1 * SEG + 4} src={SFX.softWhoosh} volume={0.42} />
        <SoundCue from={2 * SEG + 6} src={SFX.lowImpact} volume={0.4} />
        <SoundCue from={3 * SEG + 66} src={SFX.confirmation} volume={0.42} />
        <SoundCue from={4 * SEG + 8} src={SFX.confirmation} volume={0.4} />
        <SoundCue from={5 * SEG + 6} src={SFX.interfaceClick} volume={0.4} />
        <SoundCue from={6 * SEG + 6} src={SFX.confirmation} volume={0.42} />
        <SoundCue from={7 * SEG + 40} src={SFX.transitionSweep} volume={0.42} />
        <SoundCue from={9 * SEG + 40} src={SFX.transitionSweep} volume={0.42} />
      </AbsoluteFill>
    </ThemeProvider>
  );
};
