import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { DarkCinematicReveal } from "./components/DarkCinematicReveal";
import { KineticBurst } from "./components/KineticBurst";
import { UsingAICard } from "./components/UsingAICard";
import { HookCaptions } from "./components/HookCaptions";

export const hookIntroSchema = z.object({
  showCaptions: z.boolean(),
});

// HookIntro — a 3-second (90f @ 30fps) cinematic YouTube hook.
// Three hard-cut beats showcase two contrasting animation styles, then a brand
// payoff. Each beat paints its own full-frame background.
//   BEAT 1 (f0–54)  dark cinematic reveal  — "want to make animations like this"
//   BEAT 2 (f54–69) bright kinetic burst   — "or this"
//   BEAT 3 (f69–90) using-AI payoff card   — "using AI"
export const HookIntro: React.FC<z.infer<typeof hookIntroSchema>> = ({ showCaptions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202" }}>
      <Sequence from={0} durationInFrames={55}>
        <DarkCinematicReveal />
      </Sequence>
      <Sequence from={55} durationInFrames={45}>
        <KineticBurst />
      </Sequence>
      <Sequence from={100} durationInFrames={40}>
        <UsingAICard />
      </Sequence>

      {showCaptions ? (
        <Sequence from={0} durationInFrames={140}>
          <HookCaptions />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
