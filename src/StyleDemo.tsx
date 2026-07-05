import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SectionCard } from "./components/SectionCard";
import { ClaudeMark, IconGauge } from "./components/Cartoons";
import { ThemeProvider } from "./theme";

// Preview of the "bold" style on landscape cards (registered as StyleDemoBold).
// Not a deliverable — a reference for choosing a style per video.
export const StyleDemo: React.FC = () => {
  return (
    <ThemeProvider style="bold">
      <AbsoluteFill>
        <Sequence  durationInFrames={180}>
          <SectionCard
            icon={<ClaudeMark size={130} />}
            kicker="THE BEST MODEL EVER"
            title="FABLE 5"
            tape="IS BACK"
            bgWords={["FABLE 5", "SONNET 5", "OPUS 4.8"]}
            durationInFrames={180}
          />
        </Sequence>
        <Sequence from={180} durationInFrames={180}>
          <SectionCard
            icon={<IconGauge />}
            kicker="AND WE STILL HAVE"
            title="OPUS 4.8"
            subtitle="Along with that"
            items={["What's different", "What to use"]}
            itemDelays={[40, 60]}
            durationInFrames={180}
          />
        </Sequence>
      </AbsoluteFill>
    </ThemeProvider>
  );
};
