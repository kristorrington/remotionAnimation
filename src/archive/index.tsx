import React from "react";
import { CalculateMetadataFunction, Composition } from "remotion";
import { KrisIntro } from "../KrisIntro";
import { KrisHero } from "../KrisHero";
import { TutorialOverlays } from "../TutorialOverlays";
import { HookIntro, hookIntroSchema } from "../HookIntro";
import { HermesHook, hermesHookSchema } from "../HermesHook";
import { HermesVideo } from "../HermesVideo";
import { HermesAnnotations } from "../HermesAnnotations";
import { GmailVideo } from "../GmailVideo";
import { GmailAnnotations } from "../GmailAnnotations";
import { GmailAuthCommand } from "../GmailAuthCommand";
import { GmailLiveTests } from "../GmailLiveTests";
import { Fable5Video } from "../Fable5Video";
import { PolicyRiskVideo } from "../PolicyRiskVideo";
import { PolicyRiskFinal } from "../PolicyRiskFinal";
import { DSparkVideo } from "../DSparkVideo";
import { DSparkFinal } from "../DSparkFinal";
import { ClaudeWealthVideo, CLAUDE_WEALTH_DUR } from "../ClaudeWealthVideo";
import { ClaudeWealthFinal } from "../ClaudeWealthFinal";
import { ModelRoutingVideo, MODEL_ROUTING_DUR } from "../ModelRoutingVideo";
import { ModelRoutingFinal } from "../ModelRoutingFinal";

// ============================================================================
// THE ARCHIVE — compositions from PREVIOUS videos. When a new video starts,
// its predecessor's <Composition> entries move HERE from Root.tsx (and its
// ShortSpecs move to src/shorts/archivedSpecs.ts), so the Studio sidebar only
// shows the CURRENT video. Flip SHOW_ARCHIVE to true to re-render anything
// old — footage stays in public/ (rotated names) and captions stay correct
// via captionsRegistry. See AGENTS.md "Archiving previous videos".
// ============================================================================
export const SHOW_ARCHIVE = false;

const transparentDefaults: CalculateMetadataFunction<
  Record<string, unknown>
> = () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const ArchivedVideoCompositions: React.FC = () => {
  return (
    <>
      {/* ── Model routing: Opus vs Fable 5 (July 2026) ── */}
      <Composition
        id="ModelRoutingVideo"
        component={ModelRoutingVideo}
        durationInFrames={MODEL_ROUTING_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="ModelRoutingFinal"
        component={ModelRoutingFinal}
        durationInFrames={MODEL_ROUTING_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Claude wealth-stories (July 2026) ── */}
      <Composition
        id="ClaudeWealthVideo"
        component={ClaudeWealthVideo}
        durationInFrames={CLAUDE_WEALTH_DUR}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="ClaudeWealthFinal"
        component={ClaudeWealthFinal}
        durationInFrames={CLAUDE_WEALTH_DUR}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DeepSeek DSpark (July 2026) ── */}
      <Composition
        id="DSparkVideo"
        component={DSparkVideo}
        durationInFrames={11967}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="DSparkFinal"
        component={DSparkFinal}
        durationInFrames={11967}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Fable 5 explainer ── */}
      <Composition
        id="Fable5Video"
        component={Fable5Video}
        durationInFrames={9810}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      {/* ── "AI depends on policy" ── */}
      <Composition
        id="PolicyRiskVideo"
        component={PolicyRiskVideo}
        durationInFrames={14500}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="PolicyRiskFinal"
        component={PolicyRiskFinal}
        durationInFrames={14453}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Hermes ── */}
      <Composition
        id="HermesVideo"
        component={HermesVideo}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="HermesAnnotations"
        component={HermesAnnotations}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="HermesHook"
        component={HermesHook}
        durationInFrames={520}
        fps={30}
        width={1920}
        height={1080}
        schema={hermesHookSchema}
        defaultProps={{ showCaptions: true }}
      />

      {/* ── Gmail ── */}
      <Composition
        id="GmailVideo"
        component={GmailVideo}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailAnnotations"
        component={GmailAnnotations}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailAuthCommand"
        component={GmailAuthCommand}
        durationInFrames={740}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="GmailLiveTests"
        component={GmailLiveTests}
        durationInFrames={3560}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      {/* ── Early one-offs ── */}
      <Composition
        id="HookIntro"
        component={HookIntro}
        durationInFrames={140}
        fps={30}
        width={1920}
        height={1080}
        schema={hookIntroSchema}
        defaultProps={{ showCaptions: true }}
      />
      <Composition
        id="TutorialOverlays"
        component={TutorialOverlays}
        durationInFrames={11150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />
      <Composition
        id="KrisHero"
        component={KrisHero}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="KrisIntro"
        component={KrisIntro}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
