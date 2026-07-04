import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { AgentSearchReveal } from "./components/AgentSearchReveal";
import { FallApartBurst } from "./components/FallApartBurst";
import { HermesPayoff } from "./components/HermesPayoff";
import { HermesCaptions } from "./components/HermesCaptions";

export const hermesHookSchema = z.object({
  showCaptions: z.boolean(),
});

// HermesHook — cinematic intro hook (520f @ 30fps, ~17.3s) for the
// "Hermes × Playwright MCP" video. Three hard-cut beats, same visual language
// as HookIntro, synced to the opening narration.
//   BEAT 1 (f0–63)    baseline — "most AI agents can search the web"
//   BEAT 2 (f63–274)  problem  — "click / fill / real website … they fall apart"
//   BEAT 3 (f274–520) payoff   — "connecting Hermes to Playwright MCP … WSL / Windows"
export const HermesHook: React.FC<z.infer<typeof hermesHookSchema>> = ({ showCaptions }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#020202" }}>
      <Sequence from={0} durationInFrames={63}>
        <AgentSearchReveal />
      </Sequence>
      <Sequence from={63} durationInFrames={211}>
        <FallApartBurst />
      </Sequence>
      <Sequence from={274} durationInFrames={246}>
        <HermesPayoff />
      </Sequence>

      {showCaptions ? (
        <Sequence from={0} durationInFrames={520}>
          <HermesCaptions />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
