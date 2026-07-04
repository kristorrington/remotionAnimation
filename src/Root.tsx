import "./index.css";
import { CalculateMetadataFunction, Composition } from "remotion";
import { KrisIntro } from "./KrisIntro";
import { KrisHero } from "./KrisHero";
import { TutorialOverlays } from "./TutorialOverlays";
import { HookIntro, hookIntroSchema } from "./HookIntro";
import { HermesHook, hermesHookSchema } from "./HermesHook";
import { HermesVideo } from "./HermesVideo";
import { HermesAnnotations } from "./HermesAnnotations";
import { GmailVideo } from "./GmailVideo";
import { GmailAnnotations } from "./GmailAnnotations";
import { GmailAuthCommand } from "./GmailAuthCommand";
import { GmailLiveTests } from "./GmailLiveTests";
import { Fable5Video } from "./Fable5Video";
import { PolicyRiskVideo } from "./PolicyRiskVideo";
import { PolicyRiskFinal } from "./PolicyRiskFinal";

// Default this composition to a transparent ProRes 4444 export so it composites
// cleanly over screen-recorded footage straight from Studio's render button.
const transparentDefaults: CalculateMetadataFunction<
  Record<string, unknown>
> = () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // Fable 5 explainer — transparent cutaway overlay track.
        id="Fable5Video"
        component={Fable5Video}
        durationInFrames={9810}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // "AI depends on policy" explainer — transparent cutaway overlay track.
        id="PolicyRiskVideo"
        component={PolicyRiskVideo}
        durationInFrames={14500}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // FINAL cut — talking-head footage + PolicyRiskVideo overlay + transitions,
        // mixed into one H.264 MP4 (1080p; render --scale=2 for true 4K).
        id="PolicyRiskFinal"
        component={PolicyRiskFinal}
        durationInFrames={14453}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // Full-length transparent overlay track for the Hermes video.
        id="HermesVideo"
        component={HermesVideo}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Transparent demo-annotation track (chips, prompts, checklists).
        id="HermesAnnotations"
        component={HermesAnnotations}
        durationInFrames={14600}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Gmail video — full-screen cutaway track.
        id="GmailVideo"
        component={GmailVideo}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Gmail video — transparent demo-annotation track.
        id="GmailAnnotations"
        component={GmailAnnotations}
        durationInFrames={16990}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Standalone Gmail MCP auth-command animation.
        id="GmailAuthCommand"
        component={GmailAuthCommand}
        durationInFrames={740}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Standalone live-tests animation (labels / triage / draft).
        id="GmailLiveTests"
        component={GmailLiveTests}
        durationInFrames={3560}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Render with: npx remotion render HermesHook out/HermesHook.mp4
        id="HermesHook"
        component={HermesHook}
        durationInFrames={520}
        fps={30}
        width={1920}
        height={1080}
        schema={hermesHookSchema}
        defaultProps={{ showCaptions: true }}
      />

      <Composition
        // Render with: npx remotion render HookIntro out/HookIntro.mp4
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
        // Render transparent: see render command in the chat / README.
        id="TutorialOverlays"
        component={TutorialOverlays}
        durationInFrames={11150}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={transparentDefaults}
      />

      <Composition
        // Render with: npx remotion render KrisHero
        id="KrisHero"
        component={KrisHero}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        // Render with: npx remotion render KrisIntro
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
